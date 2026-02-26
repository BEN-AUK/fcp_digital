/**
 * Signature density validation: guard against trivial strokes (single dot / tiny line).
 * Used only at submit time; not during drawing (no real-time cost).
 */

/** Minimum stroke pixels to consider signature valid. */
export const MIN_STROKE_PIXELS = 500;

/** Minimum ratio of stroke pixels to canvas area (e.g. 0.5%). */
export const MIN_STROKE_RATIO = 0.005;

/** Minimum base64 length for Native (proxy for "enough content"); ~500+ pixels in PNG. */
export const MIN_BASE64_LENGTH_NATIVE = 2000;

/**
 * Web: validate using getImageData on the (trimmed) canvas.
 * Counts non-background pixels (alpha > 0 and not solid white).
 * Valid iff strokeCount >= MIN_STROKE_PIXELS and strokeCount >= MIN_STROKE_RATIO * area.
 */
export function validateSignatureCanvas(canvas: HTMLCanvasElement): boolean {
  const w = canvas.width;
  const h = canvas.height;
  const area = w * h;
  if (area === 0) return false;

  const ctx = canvas.getContext("2d");
  if (!ctx) return false;

  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  let strokeCount = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]!;
    const g = data[i + 1]!;
    const b = data[i + 2]!;
    const a = data[i + 3]!;
    const isWhite = r === 255 && g === 255 && b === 255;
    if (a > 0 && !isWhite) strokeCount++;
  }

  return (
    strokeCount >= MIN_STROKE_PIXELS &&
    strokeCount >= MIN_STROKE_RATIO * area
  );
}

/**
 * Native: validate using base64 length as a proxy for stroke content.
 * Very small PNG (single dot / short line) has low byte size.
 */
export function validateSignatureBase64(base64: string): boolean {
  if (!base64 || typeof base64 !== "string") return false;
  return base64.length >= MIN_BASE64_LENGTH_NATIVE;
}
