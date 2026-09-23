import type { CSSProperties } from "react";
import Link from "next/link";
import { HomeCta } from "@/components/home/HomeCta";
import styles from "./page.module.css";

const GRID = [
  [1, 0, 2, 1, 0, 3, 1],
  [0, 4, 1, 0, 2, 1, 0],
  [2, 1, 5, 2, 0, 1, 3],
  [1, 0, 2, 6, 1, 0, 2],
  [0, 3, 1, 0, 7, 2, 1],
  [2, 1, 0, 3, 1, 8, 0],
  [1, 2, 3, 0, 2, 1, 9],
];

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.heroBleed} aria-hidden>
        <div className={styles.bleedWash} />
        <div className={styles.bleedGrid}>
          {GRID.flatMap((row, ri) =>
            row.map((n, ci) => (
              <span
                key={`${ri}-${ci}`}
                className={styles.bleedCell}
                style={
                  {
                    "--delay": `${(ri * 7 + ci) * 45}ms`,
                  } as CSSProperties
                }
              >
                {n}
              </span>
            )),
          )}
        </div>
        <div className={styles.bleedScan} />
        <div className={styles.bleedFormula}>C = A × B</div>
      </div>

      <header className={styles.nav}>
        <span className={styles.brandMark}>Hand Cal</span>
        <div className={styles.navRight}>
          <Link href="/track" className={styles.navLink}>
            학습 트랙
          </Link>
          <Link href="/daily" className={styles.navLink}>
            오늘의 문제
          </Link>
        </div>
      </header>

      <main className={styles.hero}>
        <div className={styles.heroCopy}>
          <h1 className={styles.brand}>Hand Cal</h1>
          <p className={styles.tagline}>
            숫자를 직접 만들며 AI를 이해한다.
          </p>
          <p className={styles.support}>
            개념 맵으로 Transformer 안 세부 과정을 보고, 셀을 채우며 손계산합니다.
          </p>
          <HomeCta />
        </div>
      </main>
    </div>
  );
}
