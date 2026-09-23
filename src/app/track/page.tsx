import Link from "next/link";
import { Suspense } from "react";
import { lessons } from "@/content/lessons";
import { TrackList } from "@/components/track/TrackList";
import styles from "./track.module.css";

export const metadata = {
  title: "학습 트랙 — Hand Cal",
};

export default function TrackPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          Hand Cal
        </Link>
        <h1>학습 트랙</h1>
        <p>
          일자 목록이 아니라 <strong>맵</strong>입니다. 허브(예: Transformer)를
          누르면 안의 세부 과정이 그래프로 열립니다.
        </p>
      </header>
      <Suspense fallback={<p>맵 불러오는 중…</p>}>
        <TrackList lessons={lessons} />
      </Suspense>
    </div>
  );
}
