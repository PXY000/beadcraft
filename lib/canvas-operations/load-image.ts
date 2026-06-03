/**
 * Load an image File into an HTMLImageElement and extract its ImageData.
 * Uses createImageBitmap for fast decoding with fallback to Image + onload.
 */
export async function loadImage(
  file: File
): Promise<{ image: HTMLImageElement; imageData: ImageData }> {
  // Step 1: Decode the image
  let bitmap: ImageBitmap | null = null;

  if (typeof createImageBitmap !== "undefined") {
    try {
      bitmap = await createImageBitmap(file);
    } catch {
      // Fall through to Image() fallback
    }
  }

  if (!bitmap) {
    bitmap = await loadViaImageElement(file);
  }

  // Step 2: Extract ImageData via offscreen canvas
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0);
  const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);

  // Step 3: Create HTMLImageElement for later use (needed by drawImage in pixelation)
  const image = await bitmapToImage(bitmap);

  bitmap.close();
  return { image, imageData };
}

function loadViaImageElement(file: File): Promise<ImageBitmap> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      createImageBitmap(canvas).then(resolve).catch(reject);
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

function bitmapToImage(bitmap: ImageBitmap): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(bitmap, 0, 0);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to convert bitmap to image"));
    img.src = canvas.toDataURL();
  });
}

/**
 * Center-crop image data to a square.
 */
export function cropToSquare(imageData: ImageData): ImageData {
  const { width, height, data } = imageData;
  if (width === height) return imageData;

  const size = Math.min(width, height);
  const sx = Math.floor((width - size) / 2);
  const sy = Math.floor((height - size) / 2);

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Put source ImageData onto a temp canvas
  const srcCanvas = document.createElement("canvas");
  srcCanvas.width = width;
  srcCanvas.height = height;
  const srcCtx = srcCanvas.getContext("2d")!;
  srcCtx.putImageData(imageData, 0, 0);

  ctx.drawImage(srcCanvas, sx, sy, size, size, 0, 0, size, size);
  return ctx.getImageData(0, 0, size, size);
}
