"use client";

import type { Matrix } from "@/engine";
import { Heatmap, ShapeBadge } from "@/components/viz/Heatmap";
import styles from "./AttentionMap.module.css";

type Props = {
  weights: Matrix;
  label?: string;
};

/** Dedicated attention-weight visualizer with shape badge */
export function AttentionMap({ weights, label = "Attention weights" }: Props) {
  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <span className={styles.title}>{label}</span>
        <ShapeBadge matrix={weights} />
      </div>
      <Heatmap matrix={weights} diverging={false} hideHeader />
      <p className={styles.caption}>
        행 = query 위치, 열 = key 위치. 밝을수록 더 높은 주의 가중치.
      </p>
    </div>
  );
}
