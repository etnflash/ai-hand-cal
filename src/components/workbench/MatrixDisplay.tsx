"use client";

import type { Matrix } from "@/engine";
import styles from "./MatrixDisplay.module.css";

type Props = {
  matrix: Matrix;
  label?: string;
  readOnly?: boolean;
  decimals?: number;
  highlight?: boolean;
};

function fmt(n: number, decimals?: number): string {
  if (decimals !== undefined) {
    return n.toFixed(decimals);
  }
  if (Number.isInteger(n)) return String(n);
  return String(Math.round(n * 10000) / 10000);
}

export function MatrixDisplay({
  matrix,
  label,
  decimals,
  highlight,
}: Props) {
  return (
    <div className={`${styles.wrap} ${highlight ? styles.highlight : ""}`}>
      {label && <span className={styles.label}>{label}</span>}
      <div
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${matrix[0]?.length ?? 1}, minmax(2.6rem, auto))`,
        }}
      >
        {matrix.map((row, i) =>
          row.map((v, j) => (
            <div key={`${i}-${j}-${v}`} className={styles.cell}>
              {fmt(v, decimals)}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
