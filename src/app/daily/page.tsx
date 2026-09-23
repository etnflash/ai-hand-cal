import Link from "next/link";
import { DailyChallenge } from "@/components/daily/DailyChallenge";
import styles from "../track/track.module.css";

export const metadata = {
  title: "오늘의 문제 — Hand Cal",
};

export default function DailyPage() {
  return (
    <div>
      <div className={styles.page} style={{ paddingBottom: 0 }}>
        <header className={styles.header}>
          <Link href="/" className={styles.brand}>
            Hand Cal
          </Link>
          <Link href="/track" style={{ fontSize: "0.9rem", color: "var(--ink-muted)" }}>
            개념 맵
          </Link>
        </header>
      </div>
      <DailyChallenge />
    </div>
  );
}
