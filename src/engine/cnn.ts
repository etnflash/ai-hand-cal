import type { Matrix } from "./types";
import { zeros } from "./matrix";

/** Valid 2D convolution, single channel. kernel [kh×kw], image [H×W] */
export function conv2dValid(image: Matrix, kernel: Matrix): Matrix {
  const H = image.length;
  const W = image[0]?.length ?? 0;
  const kh = kernel.length;
  const kw = kernel[0]?.length ?? 0;
  const outH = H - kh + 1;
  const outW = W - kw + 1;
  if (outH <= 0 || outW <= 0) {
    throw new Error("conv2d: kernel larger than image");
  }
  const out = zeros(outH, outW);
  for (let i = 0; i < outH; i++) {
    for (let j = 0; j < outW; j++) {
      let sum = 0;
      for (let u = 0; u < kh; u++) {
        for (let v = 0; v < kw; v++) {
          sum += image[i + u][j + v] * kernel[u][v];
        }
      }
      out[i][j] = sum;
    }
  }
  return out;
}

/** 1D valid convolution */
export function conv1dValid(signal: number[], kernel: number[]): number[] {
  const outLen = signal.length - kernel.length + 1;
  if (outLen <= 0) throw new Error("conv1d: kernel too long");
  return Array.from({ length: outLen }, (_, i) => {
    let sum = 0;
    for (let k = 0; k < kernel.length; k++) {
      sum += signal[i + k] * kernel[k];
    }
    return sum;
  });
}

/** Max-pool 2D */
export function maxPool2d(
  image: Matrix,
  poolH: number,
  poolW: number,
  strideH = poolH,
  strideW = poolW,
): Matrix {
  const H = image.length;
  const W = image[0]?.length ?? 0;
  const outH = Math.floor((H - poolH) / strideH) + 1;
  const outW = Math.floor((W - poolW) / strideW) + 1;
  if (outH <= 0 || outW <= 0) throw new Error("maxPool2d: bad size");
  const out = zeros(outH, outW);
  for (let i = 0; i < outH; i++) {
    for (let j = 0; j < outW; j++) {
      let m = -Infinity;
      for (let u = 0; u < poolH; u++) {
        for (let v = 0; v < poolW; v++) {
          const val = image[i * strideH + u][j * strideW + v];
          if (val > m) m = val;
        }
      }
      out[i][j] = m;
    }
  }
  return out;
}

/** Average-pool 2D */
export function avgPool2d(
  image: Matrix,
  poolH: number,
  poolW: number,
  strideH = poolH,
  strideW = poolW,
): Matrix {
  const H = image.length;
  const W = image[0]?.length ?? 0;
  const outH = Math.floor((H - poolH) / strideH) + 1;
  const outW = Math.floor((W - poolW) / strideW) + 1;
  if (outH <= 0 || outW <= 0) throw new Error("avgPool2d: bad size");
  const out = zeros(outH, outW);
  const area = poolH * poolW;
  for (let i = 0; i < outH; i++) {
    for (let j = 0; j < outW; j++) {
      let s = 0;
      for (let u = 0; u < poolH; u++) {
        for (let v = 0; v < poolW; v++) {
          s += image[i * strideH + u][j * strideW + v];
        }
      }
      out[i][j] = s / area;
    }
  }
  return out;
}
