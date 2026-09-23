"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { CheckResult, Matrix } from "@/engine";
import styles from "./MatrixInput.module.css";

type Props = {
  rows: number;
  cols: number;
  values: string[][];
  onChange: (next: string[][]) => void;
  check?: CheckResult | null;
  flash?: boolean;
  /** Ctrl/Cmd+Enter or last-cell Enter grades */
  onSubmitGrade?: () => void;
};

function emptyGrid(rows: number, cols: number): string[][] {
  return Array.from({ length: rows }, () => Array(cols).fill(""));
}

export function MatrixInput({
  rows,
  cols,
  values,
  onChange,
  check,
  flash,
  onSubmitGrade,
}: Props) {
  const refs = useRef<(HTMLInputElement | null)[][]>([]);

  useEffect(() => {
    refs.current = Array.from({ length: rows }, () => Array(cols).fill(null));
  }, [rows, cols]);

  const focusCell = useCallback(
    (r: number, c: number) => {
      const nr = Math.max(0, Math.min(rows - 1, r));
      const nc = Math.max(0, Math.min(cols - 1, c));
      refs.current[nr]?.[nc]?.focus();
    },
    [rows, cols],
  );

  const setCell = (r: number, c: number, raw: string) => {
    const next = values.map((row) => [...row]);
    if (!next[r]) next[r] = Array(cols).fill("");
    next[r][c] = raw;
    onChange(next);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>, r: number, c: number) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      onSubmitGrade?.();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (r + 1 < rows) focusCell(r + 1, c);
      else onSubmitGrade?.();
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      if (c + 1 < cols) focusCell(r, c + 1);
      else if (r + 1 < rows) focusCell(r + 1, 0);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (c - 1 >= 0) focusCell(r, c - 1);
      else if (r - 1 >= 0) focusCell(r - 1, cols - 1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      focusCell(r + 1, c);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusCell(r - 1, c);
    } else if (e.key === "Tab") {
      // let Tab leave the grid / move naturally — only trap with arrows
      return;
    }
  };

  const grid = values.length === rows ? values : emptyGrid(rows, cols);

  return (
    <div
      className={`${styles.grid} ${flash ? styles.flash : ""}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(3rem, 4.5rem))`,
      }}
    >
      {Array.from({ length: rows }, (_, i) =>
        Array.from({ length: cols }, (_, j) => {
          const status = check?.cellOk[i]?.[j];
          let statusClass = "";
          if (status === true) statusClass = styles.correct;
          else if (status === false) statusClass = styles.incorrect;
          return (
            <input
              key={`${i}-${j}`}
              ref={(el) => {
                if (!refs.current[i]) refs.current[i] = [];
                refs.current[i][j] = el;
              }}
              className={`${styles.cell} ${statusClass}`}
              inputMode="decimal"
              value={grid[i]?.[j] ?? ""}
              onChange={(e) => setCell(i, j, e.target.value)}
              onKeyDown={(e) => onKeyDown(e, i, j)}
              aria-label={`행 ${i + 1} 열 ${j + 1}`}
            />
          );
        }),
      )}
    </div>
  );
}

export function blankMatrix(expected: Matrix): string[][] {
  return expected.map((row) => row.map(() => ""));
}
