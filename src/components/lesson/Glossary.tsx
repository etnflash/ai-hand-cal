"use client";

import { useState } from "react";
import type { Lesson } from "@/content/types";
import styles from "./Glossary.module.css";

type Props = {
  lesson: Lesson;
};

/** Lightweight per-lesson term sheet from formula + intro */
export function Glossary({ lesson }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "용어 · 공식 닫기" : "용어 · 공식 보기"}
      </button>
      {open && (
        <aside className={styles.panel}>
          <code className={styles.formula}>{lesson.formula}</code>
          <ul className={styles.list}>
            {lesson.intro.map((p) => (
              <li key={p.slice(0, 32)}>{p}</li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}
