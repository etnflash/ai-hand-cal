"use client";

import type { Matrix } from "@/engine";
import { shapeOf, formatShape } from "@/engine";
import styles from "./Heatmap.module.css";

type Props = {
  matrix: Matrix;
  label?: string;
  /** Use diverging colors around 0 */
  diverging?: boolean;
  hideHeader?: boolean;
};

export function ShapeBadge({ matrix, label }: { matrix: Matrix; label?: string }) {
  const s = shapeOf(matrix);
  return (
    <span className={styles.badge}>
      {label ? `${label} ` : ""}
      {formatShape(s)}
    </span>
  );
}

export function Heatmap({ matrix, label, diverging, hideHeader }: Props) {
  const flat = matrix.flat();
  const maxAbs = Math.max(...flat.map(Math.abs), 1e-9);
  const max = Math.max(...flat, 1e-9);
  const min = Math.min(...flat, 0);

  return (
    <div className={styles.wrap}>
      {!hideHeader && (
        <div className={styles.head}>
          {label && <span className={styles.label}>{label}</span>}
          <ShapeBadge matrix={matrix} />
        </div>
      )}
      <div
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${matrix[0]?.length ?? 1}, 1fr)`,
        }}
      >
        {matrix.map((row, i) =>
          row.map((v, j) => {
            let bg: string;
            if (diverging) {
              const t = v / maxAbs;
              if (t >= 0) {
                bg = `color-mix(in srgb, var(--heat-pos) ${Math.round(t * 85)}%, var(--heat-zero))`;
              } else {
                bg = `color-mix(in srgb, var(--heat-neg) ${Math.round(-t * 85)}%, var(--heat-zero))`;
              }
            } else {
              const t = (v - min) / (max - min || 1);
              bg = `color-mix(in srgb, var(--heat-pos) ${Math.round(t * 90)}%, var(--heat-zero))`;
            }
            return (
              <div
                key={`${i}-${j}`}
                className={styles.cell}
                style={{ background: bg }}
                title={`${v}`}
              >
                <span className={styles.num}>
                  {Number.isInteger(v) ? v : Math.round(v * 100) / 100}
                </span>
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
