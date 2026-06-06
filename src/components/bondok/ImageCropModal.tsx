"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Loader2, Square, Circle, ZoomIn, ZoomOut, RotateCw, Crop } from "lucide-react";
import { getCroppedCanvas, getCroppedPreviewUrl, cropImageToBlob, canvasToBlob } from "@/lib/image-crop";
import type { CropArea, CropShape } from "@/lib/image-crop";

interface ImageCropModalProps {
  /** The image URL to crop (data URL or remote URL) */
  imageUrl: string;
  /** Whether the image is a logo (defaults to circle for logos) */
  isLogo?: boolean;
  /** Called with the new data-URL when cropping is applied */
  onApply: (croppedUrl: string) => void;
  /** Called to close the modal */
  onCancel: () => void;
}

const OUTPUT_SIZE = 800;
const PREVIEW_SIZE = 160;

export default function ImageCropModal({
  imageUrl,
  isLogo = false,
  onApply,
  onCancel,
}: ImageCropModalProps) {
  const [shape, setShape] = useState<CropShape>(isLogo ? "circle" : "square");
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [crop, setCrop] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 });
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [applying, setApplying] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgNaturalSize, setImgNaturalSize] = useState({ w: 0, h: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const sourceImgRef = useRef<HTMLImageElement | null>(null);

  // Initialize a centered square crop
  const initCrop = useCallback((w: number, h: number) => {
    const minDim = Math.min(w, h);
    const cropPct = (minDim / Math.max(w, h)) * 100;
    const offsetX = ((w - minDim) / w) * 100;
    const offsetY = ((h - minDim) / h) * 100;
    setCrop({ x: offsetX, y: offsetY, width: cropPct, height: cropPct });
    setZoom(1);
  }, []);

  // Load image for source cropping
  useEffect(() => {
    const img = new window.Image();
    // Only set crossOrigin for remote URLs — data URLs don't have an origin
    // and setting crossOrigin on them causes load failures in most browsers
    if (!imageUrl.startsWith("data:")) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => {
      sourceImgRef.current = img;
      setImgNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
      setImgLoaded(true);
      // Initialize crop to center square
      initCrop(img.naturalWidth, img.naturalHeight);
    };
    img.onerror = () => setImgLoaded(false);
    img.src = imageUrl;
  }, [imageUrl, initCrop]);

  // Update preview whenever crop or shape changes
  useEffect(() => {
    if (!sourceImgRef.current) return;
    try {
      const url = getCroppedPreviewUrl(sourceImgRef.current, crop, shape, PREVIEW_SIZE);
      setPreviewUrl(url);
    } catch {
      // ignore preview errors
    }
  }, [crop, shape]);

  // Dragging handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!containerRef.current) return;
    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      const pctX = (deltaX / rect.width) * 100 * (1 / zoom);
      const pctY = (deltaY / rect.height) * 100 * (1 / zoom);
      setCrop((prev) => {
        let newX = prev.x - pctX;
        let newY = prev.y - pctY;
        // Clamp so crop doesn't go outside image bounds
        newX = Math.max(0, Math.min(100 - prev.width, newX));
        newY = Math.max(0, Math.min(100 - prev.height, newY));
        return { ...prev, x: newX, y: newY };
      });
      setDragStart({ x: e.clientX, y: e.clientY });
    },
    [dragging, dragStart, zoom]
  );

  const handlePointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  // Handle zoom with slider
  const handleZoomChange = useCallback((value: number) => {
    setZoom(value);
    setCrop((prev) => {
      // Shrink the crop area as zoom increases (zoom into center of current crop)
      const baseSize = 100 / value;
      const newW = Math.min(baseSize, 100);
      const newH = newW; // keep square
      const centerXPct = prev.x + prev.width / 2;
      const centerYPct = prev.y + prev.height / 2;
      let newX = centerXPct - newW / 2;
      let newY = centerYPct - newH / 2;
      newX = Math.max(0, Math.min(100 - newW, newX));
      newY = Math.max(0, Math.min(100 - newH, newY));
      return { x: newX, y: newY, width: newW, height: newH };
    });
  }, []);

  // Apply crop: generate full-size cropped image, upload via API, return URL
  const handleApply = async () => {
    if (!sourceImgRef.current) return;
    setApplying(true);
    try {
      const canvas = getCroppedCanvas(sourceImgRef.current, crop, shape, OUTPUT_SIZE);
      const blob = await canvasToBlob(canvas);
      const file = new File([blob], "cropped.png", { type: "image/png" });

      // Upload to server
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      onApply(data.url);
    } catch (err) {
      console.error("Crop apply error:", err);
      // Fallback: use data URL directly
      try {
        const canvas = getCroppedCanvas(sourceImgRef.current, crop, shape, OUTPUT_SIZE);
        const dataUrl = canvas.toDataURL("image/png");
        onApply(dataUrl);
      } catch {
        // Silent fail
      }
    } finally {
      setApplying(false);
    }
  };

  // Compute display styles for the image inside container
  const getContainerStyle = (): React.CSSProperties => ({
    position: "relative",
    width: "100%",
    height: "320px",
    overflow: "hidden",
    borderRadius: "12px",
    background: "#0D0806",
    cursor: dragging ? "grabbing" : "grab",
    touchAction: "none",
    userSelect: "none",
  });

  const getOverlayStyle = (): React.CSSProperties => {
    const cropX = crop.x / 100;
    const cropY = crop.y / 100;
    const cropW = crop.width / 100;
    const cropH = crop.height / 100;
    return {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      zIndex: 2,
    };
  };

  return (
    <div className="fixed inset-0 z-[2200] flex items-center justify-center bg-black/90 p-4">
      <div
        className="w-full max-w-2xl rounded-2xl p-5 border border-gold-500/30 overflow-hidden"
        style={{ background: "#1A0F0A" }}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Crop size={18} className="text-gold-400" />
            <h3 className="font-playfair text-lg font-bold text-gold-400">قص الصورة</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gold-400 hover:text-gold-200 transition p-1"
            aria-label="إغلاق"
          >
            <X size={20} />
          </button>
        </div>

        {/* Crop Workspace */}
        <div
          ref={containerRef}
          style={getContainerStyle()}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {imgLoaded && (
            <>
              {/* Source Image (scaled by zoom) */}
              <img
                ref={imgRef}
                src={imageUrl}
                alt="مصدر"
                {...(!imageUrl.startsWith("data:") ? { crossOrigin: "anonymous" } : {})}
                draggable={false}
                style={{
                  position: "absolute",
                  width: `${zoom * 100}%`,
                  height: `${zoom * 100}%`,
                  left: `${-crop.x * zoom}%`,
                  top: `${-crop.y * zoom}%`,
                  objectFit: "cover",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              />

              {/* Dark overlay outside crop */}
              <svg
                style={getOverlayStyle()}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {/* Full dim rect */}
                <rect x="0" y="0" width="100" height="100" fill="rgba(0,0,0,0.55)" />
                {/* Cut out the crop area */}
                <rect
                  x={crop.x}
                  y={crop.y}
                  width={crop.width}
                  height={crop.height}
                  fill="rgba(0,0,0,0)"
                  stroke="rgba(212,164,76,0.7)"
                  strokeWidth="0.4"
                  rx={shape === "circle" ? "50" : "0"}
                  ry={shape === "circle" ? "50" : "0"}
                />
                {/* Grid lines (rule of thirds) */}
                <line
                  x1={crop.x + crop.width / 3}
                  y1={crop.y}
                  x2={crop.x + crop.width / 3}
                  y2={crop.y + crop.height}
                  stroke="rgba(212,164,76,0.2)"
                  strokeWidth="0.15"
                />
                <line
                  x1={crop.x + (crop.width * 2) / 3}
                  y1={crop.y}
                  x2={crop.x + (crop.width * 2) / 3}
                  y2={crop.y + crop.height}
                  stroke="rgba(212,164,76,0.2)"
                  strokeWidth="0.15"
                />
                <line
                  x1={crop.x}
                  y1={crop.y + crop.height / 3}
                  x2={crop.x + crop.width}
                  y2={crop.y + crop.height / 3}
                  stroke="rgba(212,164,76,0.2)"
                  strokeWidth="0.15"
                />
                <line
                  x1={crop.x}
                  y1={crop.y + (crop.height * 2) / 3}
                  x2={crop.x + crop.width}
                  y2={crop.y + (crop.height * 2) / 3}
                  stroke="rgba(212,164,76,0.2)"
                  strokeWidth="0.15"
                />
              </svg>

              {/* Circular mask indicator */}
              {shape === "circle" && (
                <div
                  className="absolute pointer-events-none"
                  style={{
                    left: `${crop.x}%`,
                    top: `${crop.y}%`,
                    width: `${crop.width}%`,
                    height: `${crop.height}%`,
                    borderRadius: "50%",
                    border: "2px dashed rgba(212,164,76,0.5)",
                  }}
                />
              )}
            </>
          )}

          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="animate-spin text-gold-400" size={32} />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mt-4 space-y-3">
          {/* Shape + Zoom Row */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Shape Toggle */}
            <div className="flex items-center gap-1 border border-gold-500/20 rounded-lg overflow-hidden">
              <button
                onClick={() => setShape("square")}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs transition ${
                  shape === "square"
                    ? "text-wood-950 font-bold"
                    : "text-gold-400 hover:bg-gold-500/10"
                }`}
                style={
                  shape === "square"
                    ? { background: "linear-gradient(135deg,#D4A44C,#A07020)" }
                    : undefined
                }
              >
                <Square size={13} />
                مربع
              </button>
              <button
                onClick={() => setShape("circle")}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs transition ${
                  shape === "circle"
                    ? "text-wood-950 font-bold"
                    : "text-gold-400 hover:bg-gold-500/10"
                }`}
                style={
                  shape === "circle"
                    ? { background: "linear-gradient(135deg,#D4A44C,#A07020)" }
                    : undefined
                }
              >
                <Circle size={13} />
                دائري
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2 flex-1 min-w-[180px]">
              <ZoomOut size={14} className="text-gold-400 shrink-0" />
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => handleZoomChange(Number(e.target.value))}
                className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to left, #D4A44C 0%, #D4A44C ${((zoom - 1) / 2) * 100}%, rgba(212,164,76,0.15) ${((zoom - 1) / 2) * 100}%, rgba(212,164,76,0.15) 100%)`,
                  accentColor: "#D4A44C",
                }}
                dir="ltr"
              />
              <ZoomIn size={14} className="text-gold-400 shrink-0" />
              <span className="text-gold-400 text-xs min-w-[36px] text-center" dir="ltr">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Reset Zoom */}
            <button
              onClick={() => {
                if (sourceImgRef.current) {
                  initCrop(imgNaturalSize.w, imgNaturalSize.h);
                }
              }}
              className="flex items-center gap-1 px-2 py-2 text-xs text-gold-400 border border-gold-500/20 rounded-lg hover:bg-gold-500/10 transition"
              title="إعادة تعيين"
            >
              <RotateCw size={13} />
            </button>
          </div>

          {/* Preview + Actions */}
          <div className="flex items-end justify-between gap-4 pt-2 border-t border-gold-500/15">
            {/* Preview */}
            <div className="flex items-center gap-3">
              {previewUrl && (
                <div className="shrink-0">
                  <p className="text-gold-400/60 text-[10px] mb-1">معاينة</p>
                  <div
                    className="w-16 h-16 overflow-hidden border border-gold-500/20"
                    style={{
                      borderRadius: shape === "circle" ? "50%" : "8px",
                      background: "#0D0806",
                    }}
                  >
                    <img
                      src={previewUrl}
                      alt="معاينة"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              <div className="text-[10px] text-gold-400/40">
                <p>اسحب لتحريك الصورة</p>
                <p>استخدم الزوم لتقريب</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={onCancel}
                className="px-4 py-2.5 rounded-lg border border-gold-500/20 text-gold-300 text-sm transition hover:bg-gold-500/10"
              >
                إلغاء
              </button>
              <button
                onClick={handleApply}
                disabled={applying || !imgLoaded}
                className="px-5 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition"
                style={{
                  background: applying
                    ? "rgba(212,164,76,0.3)"
                    : "linear-gradient(135deg,#D4A44C,#A07020)",
                  color: "#1A0F0A",
                }}
              >
                {applying ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    جاري القص...
                  </>
                ) : (
                  <>
                    <Crop size={14} />
                    تطبيق القص
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
