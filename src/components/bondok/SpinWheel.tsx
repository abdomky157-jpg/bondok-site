"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { X, RefreshCw } from "lucide-react";
import { useBondokStore } from "@/store/bondok";
import { useScrollLock } from "@/hooks/useScrollLock";

const PRIZES = [
  { label: "خصم 10%", code: "BONDOK10" },
  { label: "30ml هدية", code: "" },
  { label: "حاول تاني 🔄", code: "" },
  { label: "بلية هدية ☕", code: "" },
  { label: "خصم 10%", code: "BONDOK10" },
  { label: "مخمرية 🫖", code: "" },
  { label: "حاول تاني 🔄", code: "" },
  { label: "باقة سامبلز 🧪", code: "" },
];

const COLORS = ["#A07020", "#4A3224", "#2D1B11", "#4A3224", "#A07020", "#4A3224", "#2D1B11", "#4A3224"];

export default function SpinWheel() {
  const spinOpen = useBondokStore((s) => s.spinOpen);
  const setSpinOpen = useBondokStore((s) => s.setSpinOpen);
  useScrollLock(spinOpen);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [resultCode, setResultCode] = useState<string | null>(null);

  const drawWheel = useCallback((rotation: number) => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const cx = 144, cy = 144, r = 130;
    ctx.clearRect(0, 0, 288, 288);

    const n = 8;
    const arc = (2 * Math.PI) / n;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((rotation * Math.PI) / 180);

    for (let i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, r, i * arc, (i + 1) * arc);
      ctx.fillStyle = COLORS[i];
      ctx.fill();
      ctx.strokeStyle = "rgba(212,164,76,.3)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.rotate(i * arc + arc / 2);
      ctx.fillStyle = "#FFE099";
      ctx.font = "bold 11px Tajawal";
      ctx.textAlign = "center";
      ctx.fillText(PRIZES[i].label, r * 0.6, 4);
      ctx.restore();
    }
    ctx.restore();
  }, []);

  useEffect(() => {
    if (spinOpen) {
      drawWheel(0);
      setResult(null);
      setResultCode(null);
    }
  }, [spinOpen, drawWheel]);

  const doSpin = async () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    try {
      // Fetch prize from server to prevent client-side manipulation
      const res = await fetch("/api/spin");
      const prize = await res.json();
      const prizeIndex = PRIZES.findIndex((p) => p.label === prize.label);
      const idx = prizeIndex >= 0 ? prizeIndex : Math.floor(Math.random() * 8);
      const finalRot = 360 * 5 + idx * 45;
      let cur = 0;
      const step = finalRot / 60;
      let frame = 0;

      const anim = setInterval(() => {
        cur += step;
        frame++;
        drawWheel(cur);
        if (frame >= 60) {
          clearInterval(anim);
          setSpinning(false);
          setResult(prize.label);
          setResultCode(prize.code || null);
        }
      }, 30);
    } catch {
      setSpinning(false);
      setResult("حصل خطأ، حاول تاني");
      setResultCode(null);
    }
  };

  if (!spinOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,.8)", backdropFilter: "blur(5px)" }}
      tabIndex={-1}
      onClick={() => setSpinOpen(false)}
      onKeyDown={(e) => { if (e.key === "Escape") { setSpinOpen(false); } }}
    >
      <div
        className="rounded-2xl max-w-[520px] w-full p-8 text-center"
        style={{
          background: "linear-gradient(135deg,#2D1B11,#1A0F0A)",
          border: "1px solid rgba(212,164,76,.3)",
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="عجلة الحظ"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-playfair text-2xl font-bold gold-shimmer">🎡 عجلة الحظ</h3>
          <button onClick={() => setSpinOpen(false)} className="text-gold-500/50 hover:text-gold-400">
            <X size={20} />
          </button>
        </div>
        <p className="text-gold-100/50 text-sm mb-6">لف العجلة واكسب جايزة!</p>

        <div className="relative w-72 h-72 mx-auto mb-6">
          <canvas ref={canvasRef} width={288} height={288} className="w-full h-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-wood-950 border-2 border-gold-500/50 flex items-center justify-center z-10">
              <RefreshCw size={24} className="text-gold-400" />
            </div>
          </div>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <span className="text-gold-400" style={{ display: "inline-block", transform: "rotate(180deg)" }}>▲</span>
          </div>
        </div>

        <button
          onClick={doSpin}
          disabled={spinning}
          className="px-10 py-3 bg-gradient-to-l from-gold-500 to-gold-700 text-wood-950 font-bold rounded-full text-lg transition-all hover:scale-105 disabled:opacity-50"
        >
          {spinning ? "جاري اللف..." : "لف العجلة! 🎰"}
        </button>

        {result && (
          <div className="mt-6 p-4 rounded-xl gold-border">
            <p className="font-playfair text-xl font-bold text-gold-400 mb-1">🎉 مبروك!</p>
            <p className="text-gold-200 text-lg">{result}</p>
            {resultCode && (
              <>
                <p className="text-green-400 text-sm mt-2">
                  كود الخصم: <strong>{resultCode}</strong>
                </p>
                <p className="text-gold-100/40 text-xs">استخدمه في السلة!</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
