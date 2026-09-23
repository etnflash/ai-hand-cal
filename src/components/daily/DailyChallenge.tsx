"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getDailyChallenge,
  loadDailyStreak,
  markDailySolved,
  type DailyStreak,
} from "@/lib/daily";
import { DIFFICULTY_LABEL } from "@/content/extraExercises";
import { CalcWorkbench } from "@/components/workbench/CalcWorkbench";
import styles from "./DailyChallenge.module.css";

export function DailyChallenge() {
  const challenge = useMemo(() => getDailyChallenge(), []);
  const [solved, setSolved] = useState(false);
  const [streak, setStreak] = useState<DailyStreak | null>(null);

  useEffect(() => {
    const s = loadDailyStreak();
    setStreak(s);
    if (challenge && s.solvedDates.includes(challenge.dateKey)) {
      setSolved(true);
    }
  }, [challenge]);

  if (!challenge) return null;

  const onSolved = () => {
    setSolved(true);
    setStreak(markDailySolved(challenge.dateKey));
  };

  return (
    <section className={styles.root}>
      <header className={styles.head}>
        <p className={styles.kicker}>{challenge.dateKey}</p>
        <h2>오늘의 문제</h2>
        <p>
          매일 바뀌는 손계산 한 문제 ·{" "}
          <Link href={`/learn/${challenge.lesson.slug}`}>
            {challenge.lesson.title}
          </Link>{" "}
          · {DIFFICULTY_LABEL[challenge.difficulty]}
        </p>
        {streak && (
          <p className={styles.streak}>
            연속 {streak.streak}일
            {streak.solvedDates.length > 0
              ? ` · 누적 ${streak.solvedDates.length}일`
              : ""}
          </p>
        )}
      </header>
      <CalcWorkbench exercise={challenge.exercise} onSolved={onSolved} />
      {solved && (
        <p className={styles.done}>
          오늘 완료!{" "}
          <Link href={`/learn/${challenge.lesson.slug}`}>
            이 레슨 더 풀기 →
          </Link>
        </p>
      )}
    </section>
  );
}
