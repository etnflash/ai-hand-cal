import type { Matrix } from "./types";

const DEFAULT_TOL = 1e-3;

export type CellStatus = "empty" | "correct" | "incorrect" | "partial";

export type CheckResult = {
  ok: boolean;
  /** Parallel to expected; null = empty cell */
  cellOk: (boolean | null)[][];
  correctCount: number;
  totalCount: number;
  rowOk: boolean[];
  colOk: boolean[];
};

function parseCell(raw: string): number | null {
  const t = raw.trim();
  if (t === "" || t === "-" || t === "." || t === "-.") return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function checkMatrix(
  user: string[][],
  expected: Matrix,
  tol = DEFAULT_TOL,
): CheckResult {
  const rows = expected.length;
  const cols = expected[0]?.length ?? 0;
  const cellOk: (boolean | null)[][] = [];
  let correctCount = 0;
  let filledWrong = 0;
  const rowOk = Array(rows).fill(true);
  const colOk = Array(cols).fill(true);

  for (let i = 0; i < rows; i++) {
    cellOk[i] = [];
    for (let j = 0; j < cols; j++) {
      const parsed = parseCell(user[i]?.[j] ?? "");
      if (parsed === null) {
        cellOk[i][j] = null;
        rowOk[i] = false;
        colOk[j] = false;
        continue;
      }
      const ok = Math.abs(parsed - expected[i][j]) <= tol;
      cellOk[i][j] = ok;
      if (ok) correctCount++;
      else {
        filledWrong++;
        rowOk[i] = false;
        colOk[j] = false;
      }
    }
  }

  const totalCount = rows * cols;
  return {
    ok: correctCount === totalCount && filledWrong === 0,
    cellOk,
    correctCount,
    totalCount,
    rowOk,
    colOk,
  };
}

export function matricesEqual(a: Matrix, b: Matrix, tol = DEFAULT_TOL): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].length !== b[i].length) return false;
    for (let j = 0; j < a[i].length; j++) {
      if (Math.abs(a[i][j] - b[i][j]) > tol) return false;
    }
  }
  return true;
}

/** Round for display / answer keys */
export function roundMatrix(m: Matrix, decimals = 4): Matrix {
  const f = 10 ** decimals;
  return m.map((row) => row.map((v) => Math.round(v * f) / f));
}
