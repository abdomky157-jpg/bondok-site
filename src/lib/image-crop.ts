/**
 * Image Crop Helper — Canvas API based cropping with square/circle support
 */

export interface CropArea {
  x: number;       // crop origin x (%)  0–100
  y: number;       // crop origin y (%)  0–100
  width: number;   // crop width   (%)  0–100
  height: number;  // crop height  (%)  0–100
}

export type CropShape = "square" | "circle";

/**
 * Given a source <img> element, a crop area (in percent), and a shape,
 * returns an off-screen canvas with the cropped (and masked) image.
 */
export function getCroppedCanvas(
  sourceImg: HTMLImageElement,
  crop: CropArea,
  shape: CropShape,
  outputSize = 800
): HTMLCanvasElement {
  const imgW = sourceImg.naturalWidth;
  const imgH = sourceImg.naturalHeight;

  // Convert percentage crop to pixel values
  const sx = (crop.x / 100) * imgW;
  const sy = (crop.y / 100) * imgH;
  const sW = (crop.width / 100) * imgW;
  const sH = (crop.height / 100) * imgH;

  // Create output canvas
  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = canvas.getContext("2d")!;

  // Clear
  ctx.clearRect(0, 0, outputSize, outputSize);

  if (shape === "circle") {
    // Clip to circle before drawing
    ctx.beginPath();
    ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
  }

  // Draw the cropped region stretched/fitted into the output square
  ctx.drawImage(sourceImg, sx, sy, sW, sH, 0, 0, outputSize, outputSize);

  return canvas;
}

/**
 * Convert a canvas to a Blob (PNG).
 */
export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob returned null"));
      },
      "image/png",
      1
    );
  });
}

/**
 * Crop an image by URL, returning a Blob ready for upload.
 */
export async function cropImageToBlob(
  imageUrl: string,
  crop: CropArea,
  shape: CropShape,
  outputSize = 800
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = getCroppedCanvas(img, crop, shape, outputSize);
        canvasToBlob(canvas).then(resolve).catch(reject);
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageUrl;
  });
}

/**
 * Get a preview data-URL from the crop (lightweight, small size).
 */
export function getCroppedPreviewUrl(
  sourceImg: HTMLImageElement,
  crop: CropArea,
  shape: CropShape,
  previewSize = 200
): string {
  const canvas = getCroppedCanvas(sourceImg, crop, shape, previewSize);
  return canvas.toDataURL("image/png");
}
