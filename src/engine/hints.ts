export type HintLevel = 0 | 1 | 2 | 3;

export type HintPayload = {
  level: HintLevel;
  title: string;
  body: string;
};

/**
 * Progressive hints:
 * 0 = none
 * 1 = shape
 * 2 = formula
 * 3 = reveal one empty/wrong cell
 */
export function buildHints(opts: {
  level: HintLevel;
  shapeHint: string;
  formulaHint: string;
  reveal?: { row: number; col: number; value: number } | null;
}): HintPayload | null {
  if (opts.level <= 0) return null;
  if (opts.level === 1) {
    return {
      level: 1,
      title: "Shape 힌트",
      body: opts.shapeHint,
    };
  }
  if (opts.level === 2) {
    return {
      level: 2,
      title: "공식 힌트",
      body: opts.formulaHint,
    };
  }
  if (opts.reveal) {
    const { row, col, value } = opts.reveal;
    return {
      level: 3,
      title: "한 칸 공개",
      body: `(${row + 1}, ${col + 1}) 칸 = ${formatNum(value)}`,
    };
  }
  return {
    level: 3,
    title: "한 칸 공개",
    body: "공개할 빈/틀린 칸이 없습니다. 이미 거의 맞았어요.",
  };
}

export function findRevealCell(
  user: string[][],
  expected: number[][],
  tol = 1e-3,
): { row: number; col: number; value: number } | null {
  for (let i = 0; i < expected.length; i++) {
    for (let j = 0; j < expected[i].length; j++) {
      const raw = user[i]?.[j]?.trim() ?? "";
      if (raw === "") {
        return { row: i, col: j, value: expected[i][j] };
      }
      const n = Number(raw);
      if (!Number.isFinite(n) || Math.abs(n - expected[i][j]) > tol) {
        return { row: i, col: j, value: expected[i][j] };
      }
    }
  }
  return null;
}

function formatNum(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return String(Math.round(n * 10000) / 10000);
}
