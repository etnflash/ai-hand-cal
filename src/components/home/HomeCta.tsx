"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadProgress } from "@/lib/progress";
import styles from "@/app/page.module.css";

export function HomeCta() {
  const [resume, setResume] = useState<string | null>(null);

  useEffect(() => {
    const p = loadProgress();
    setResume(p.lastVisited ?? null);
  }, []);

  return (
    <div className={styles.cta}>
      {resume ? (
        <Link href={`/learn/${resume}`} className={styles.primary}>
          이어서 하기
        </Link>
      ) : (
        <Link href="/learn/matmul" className={styles.primary}>
          첫 레슨 시작
        </Link>
      )}
      <Link href="/track" className={styles.secondary}>
        개념 맵 보기
      </Link>
      <Link href="/daily" className={styles.secondary}>
        오늘의 문제
      </Link>
    </div>
  );
}
