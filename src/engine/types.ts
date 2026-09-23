/** Row-major matrix: matrix[row][col] */
export type Matrix = number[][];

export type Shape = { rows: number; cols: number };

export function shapeOf(m: Matrix): Shape {
  return { rows: m.length, cols: m[0]?.length ?? 0 };
}

export function formatShape(s: Shape): string {
  return `[${s.rows}×${s.cols}]`;
}
