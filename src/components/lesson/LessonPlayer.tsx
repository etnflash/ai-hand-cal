"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Difficulty, Exercise, Lesson } from "@/content/types";
import { DIFFICULTY_LABEL } from "@/content/extraExercises";
import { getLesson } from "@/content/lessons";
import { topicOf } from "@/content/topics";
import { CalcWorkbench } from "@/components/workbench/CalcWorkbench";
import { generateExercise } from "@/lib/generator";
import {
  loadProgress,
  markExerciseDone,
  touchLesson,
} from "@/lib/progress";
import styles from "./LessonPlayer.module.css";

type Props = {
  lesson: Lesson;
};

type Filter = Difficulty | "all";

function matrixPreview(ex: Exercise): string {
  return ex.inputs
    .map((inp) => {
      const flat = inp.matrix.flat().slice(0, 6).join(", ");
      return `${inp.label}=[${flat}${inp.matrix.flat().length > 6 ? ",…" : ""}]`;
    })
    .join(" · ");
}

export function LessonPlayer({ lesson }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [exIndex, setExIndex] = useState(0);
  const [generated, setGenerated] = useState<Exercise | null>(null);
  const [genDiff, setGenDiff] = useState<Difficulty>("medium");
  const [doneIds, setDoneIds] = useState<string[]>([]);
  const [genMsg, setGenMsg] = useState<string | null>(null);
  const [workbenchKey, setWorkbenchKey] = useState(0);

  const curatedIds = useMemo(
    () => lesson.exercises.map((e) => e.id),
    [lesson.exercises],
  );

  const topic = topicOf(lesson.slug);
  const pipeline = topic?.pipeline ?? [];
  const stepIdx = pipeline.indexOf(lesson.slug);
  const prevSlug = stepIdx > 0 ? pipeline[stepIdx - 1] : null;
  const nextSlug =
    stepIdx >= 0 && stepIdx < pipeline.length - 1
      ? pipeline[stepIdx + 1]
      : null;
  const prevLesson = prevSlug ? getLesson(prevSlug) : undefined;
  const nextLesson = nextSlug ? getLesson(nextSlug) : undefined;

  const [showKeys, setShowKeys] = useState(false);

  useEffect(() => {
    touchLesson(lesson.slug);
    const p = loadProgress();
    setDoneIds(p.completedExercises[lesson.slug] ?? []);
    setFilter("all");
    setExIndex(0);
    setGenerated(null);
    setGenMsg(null);
  }, [lesson.slug]);

  const filtered = useMemo(() => {
    if (filter === "all") return lesson.exercises;
    return lesson.exercises.filter((e) => (e.difficulty ?? "easy") === filter);
  }, [lesson.exercises, filter]);

  useEffect(() => {
    setExIndex(0);
    setGenerated(null);
    setGenMsg(null);
  }, [filter]);

  const base = filtered[exIndex];
  const exercise = generated ?? base;

  const showAtt =
    lesson.kind === "attention" ||
    lesson.kind === "self-attention" ||
    lesson.kind === "transformer" ||
    lesson.kind === "kvcache" ||
    lesson.kind === "multihead" ||
    lesson.kind === "causal";

  const counts = useMemo(() => {
    const c = { easy: 0, medium: 0, hard: 0 };
    for (const e of lesson.exercises) {
      c[e.difficulty ?? "easy"]++;
    }
    return c;
  }, [lesson.exercises]);

  const onSolved = useCallback(() => {
    if (!exercise) return;
    const state = markExerciseDone(lesson.slug, exercise.id, curatedIds);
    setDoneIds(state.completedExercises[lesson.slug] ?? []);
  }, [exercise, lesson.slug, curatedIds]);

  const goNextExercise = useCallback(() => {
    if (generated) {
      setGenerated(null);
      setGenMsg(null);
      setWorkbenchKey((k) => k + 1);
      return;
    }
    if (exIndex < filtered.length - 1) {
      setExIndex((i) => i + 1);
      setWorkbenchKey((k) => k + 1);
    }
  }, [generated, exIndex, filtered.length]);

  const goPrev = useCallback(() => {
    setGenerated(null);
    setGenMsg(null);
    setExIndex((i) => Math.max(0, i - 1));
    setWorkbenchKey((k) => k + 1);
  }, []);

  const goNext = useCallback(() => {
    setGenerated(null);
    setGenMsg(null);
    setExIndex((i) => Math.min(filtered.length - 1, i + 1));
    setWorkbenchKey((k) => k + 1);
  }, [filtered.length]);

  const makeRandom = useCallback(() => {
    const salt = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    try {
      const ex = generateExercise(lesson, salt, { difficulty: genDiff });
      if (!ex) {
        setGenMsg("이 레슨은 아직 랜덤 생성을 지원하지 않습니다.");
        return;
      }
      const unique: Exercise = {
        ...ex,
        id: `rand-${salt}`,
        title: `랜덤 ${DIFFICULTY_LABEL[genDiff]} · ${ex.title}`,
      };
      setGenerated(unique);
      setWorkbenchKey((k) => k + 1);
      setGenMsg(`숫자가 바뀌었습니다 → ${matrixPreview(unique)}`);
    } catch (err) {
      setGenMsg(err instanceof Error ? `오류: ${err.message}` : "생성 실패");
    }
  }, [lesson, genDiff]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT" ||
          t.isContentEditable)
      ) {
        return;
      }
      if (e.key === "?" || (e.key === "/" && e.shiftKey)) {
        e.preventDefault();
        setShowKeys((v) => !v);
        return;
      }
      if (e.key === "Escape") {
        setShowKeys(false);
        return;
      }
      if (e.key === "j" || e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
        return;
      }
      if (e.key === "k" || e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
        return;
      }
      if (e.key === "r" && lesson.generatable !== false) {
        e.preventDefault();
        makeRandom();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, makeRandom, lesson.generatable]);


  const hasNextExercise =
    Boolean(generated) || exIndex < filtered.length - 1;
  const diff = exercise?.difficulty ?? "easy";

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        {topic && (
          <p className={styles.topicCrumb}>
            <Link href={`/track?topic=${topic.id}`}>{topic.title}</Link>
            {stepIdx >= 0 && (
              <>
                <span aria-hidden> / </span>
                <span>
                  세부 {stepIdx + 1}/{pipeline.length}
                </span>
              </>
            )}
          </p>
        )}
        <p className={styles.kicker}>{lesson.subtitle}</p>
        <h1 className={styles.title}>{lesson.title}</h1>
        <div className={styles.intro}>
          {lesson.intro.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          <p className={styles.depthNote}>
            기초 {counts.easy} · 응용 {counts.medium} · 도전 {counts.hard} 문제.
          </p>
        </div>
        <code className={styles.formula}>{lesson.formula}</code>

        <button
          type="button"
          className={styles.keysToggle}
          onClick={() => setShowKeys((v) => !v)}
          aria-expanded={showKeys}
        >
          단축키 {showKeys ? "숨기기" : "보기"} (?)
        </button>
        {showKeys && (
          <ul className={styles.keysHelp}>
            <li>
              <kbd>←</kbd>/<kbd>k</kbd> 이전 문제
            </li>
            <li>
              <kbd>→</kbd>/<kbd>j</kbd> 다음 문제
            </li>
            <li>
              <kbd>r</kbd> 랜덤 문제
            </li>
            <li>
              <kbd>Ctrl</kbd>+<kbd>Enter</kbd> 채점 (입력란에서)
            </li>
            <li>
              <kbd>?</kbd> 이 도움말
            </li>
          </ul>
        )}

        {(prevLesson || nextLesson) && (
          <div className={styles.pipeNav}>
            {prevLesson ? (
              <Link href={`/learn/${prevLesson.slug}`} className={styles.pipeLink}>
                ← {prevLesson.title}
              </Link>
            ) : (
              <span />
            )}
            {nextLesson ? (
              <Link href={`/learn/${nextLesson.slug}`} className={styles.pipeLink}>
                {nextLesson.title} →
              </Link>
            ) : (
              <Link href={`/track?topic=${topic?.id ?? ""}`} className={styles.pipeLink}>
                맵으로 →
              </Link>
            )}
          </div>
        )}
      </header>

      <div className={styles.filters} role="tablist" aria-label="난이도">
        {(
          [
            ["all", "전체"],
            ["easy", "기초"],
            ["medium", "응용"],
            ["hard", "도전"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={filter === key}
            className={filter === key ? styles.filterActive : styles.filter}
            onClick={() => setFilter(key)}
          >
            {label}
            {key !== "all" && (
              <span className={styles.count}>{counts[key as Difficulty]}</span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className={styles.emptyFilter}>
          이 난이도 문제가 없습니다. 위 필터에서 다른 난이도를 골라주세요.
        </p>
      ) : (
        <>
          <div className={styles.picker}>
            {filtered.map((ex, i) => (
              <button
                key={ex.id}
                type="button"
                className={`${styles.pill} ${i === exIndex && !generated ? styles.pillActive : ""} ${doneIds.includes(ex.id) ? styles.pillDone : ""}`}
                onClick={() => {
                  setGenerated(null);
                  setGenMsg(null);
                  setExIndex(i);
                  setWorkbenchKey((k) => k + 1);
                }}
                title={ex.title}
              >
                {i + 1}
                <span className={styles.pillDiff}>
                  {(ex.difficulty ?? "easy")[0]}
                </span>
              </button>
            ))}
          </div>

          <nav className={styles.nav}>
            <button type="button" onClick={goPrev} disabled={exIndex === 0}>
              이전
            </button>
            <span className={styles.progress}>
              {generated ? "랜덤" : `${exIndex + 1} / ${filtered.length}`}
              <span className={`${styles.badge} ${styles[diff]}`}>
                {DIFFICULTY_LABEL[diff]}
              </span>
              {!generated &&
              exercise &&
              doneIds.includes(exercise.id)
                ? " · 완료"
                : ""}
            </span>
            <button
              type="button"
              onClick={goNext}
              disabled={exIndex >= filtered.length - 1 && !generated}
            >
              다음
            </button>
          </nav>

          <div className={styles.randomBar}>
            <label className={styles.randomDiff}>
              난이도
              <select
                value={genDiff}
                onChange={(e) => setGenDiff(e.target.value as Difficulty)}
              >
                <option value="easy">기초</option>
                <option value="medium">응용</option>
                <option value="hard">도전</option>
              </select>
            </label>
            <button
              type="button"
              className={styles.randomBtn}
              onClick={makeRandom}
              disabled={lesson.generatable === false}
            >
              랜덤 문제 만들기
            </button>
            {generated && (
              <button
                type="button"
                className={styles.ghostBtn}
                onClick={() => {
                  setGenerated(null);
                  setGenMsg(null);
                  setWorkbenchKey((k) => k + 1);
                }}
              >
                목록 문제로 돌아가기
              </button>
            )}
          </div>

          {exercise && (
            <>
              <h2 id="exercise-anchor" className={styles.exTitle}>
                {exercise.title}
                {generated && <span className={styles.genTag}>랜덤</span>}
              </h2>
              {genMsg && <p className={styles.genMsg}>{genMsg}</p>}

              <div
                key={workbenchKey}
                className={generated ? styles.flashIn : undefined}
              >
                <CalcWorkbench
                  key={workbenchKey}
                  exercise={exercise}
                  onSolved={onSolved}
                  showAttentionMap={showAtt}
                  onNextExercise={
                    hasNextExercise ? goNextExercise : undefined
                  }
                  nextLessonHref={
                    !hasNextExercise && nextLesson
                      ? `/learn/${nextLesson.slug}`
                      : !hasNextExercise
                        ? `/track?topic=${topic?.id ?? ""}`
                        : undefined
                  }
                  nextLessonLabel={
                    !hasNextExercise && nextLesson
                      ? `다음 레슨: ${nextLesson.title}`
                      : !hasNextExercise
                        ? "맵으로 돌아가기"
                        : undefined
                  }
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
