"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Exercise } from "@/content/types";
import {
  buildHints,
  checkMatrix,
  findRevealCell,
  type CheckResult,
  type HintLevel,
} from "@/engine";
import { MatrixDisplay } from "./MatrixDisplay";
import { blankMatrix, MatrixInput } from "./MatrixInput";
import { Heatmap } from "@/components/viz/Heatmap";
import { AttentionMap } from "@/components/viz/AttentionMap";
import styles from "./CalcWorkbench.module.css";

type Props = {
  exercise: Exercise;
  onSolved?: () => void;
  showAttentionMap?: boolean;
  onNextExercise?: () => void;
  nextLessonHref?: string;
  nextLessonLabel?: string;
};

export function CalcWorkbench({
  exercise,
  onSolved,
  showAttentionMap,
  onNextExercise,
  nextLessonHref,
  nextLessonLabel,
}: Props) {
  const rows = exercise.expected.length;
  const cols = exercise.expected[0]?.length ?? 0;
  const [values, setValues] = useState(() => blankMatrix(exercise.expected));
  const [check, setCheck] = useState<CheckResult | null>(null);
  const [hintLevel, setHintLevel] = useState<HintLevel>(0);
  const [flash, setFlash] = useState(false);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    setValues(blankMatrix(exercise.expected));
    setCheck(null);
    setHintLevel(0);
    setSolved(false);
  }, [exercise.id]);

  const tol = exercise.decimals != null ? 5e-3 : 1e-3;

  const hint = useMemo(() => {
    const reveal =
      hintLevel >= 3
        ? findRevealCell(values, exercise.expected, tol)
        : null;
    return buildHints({
      level: hintLevel,
      shapeHint: exercise.shapeHint,
      formulaHint: exercise.formulaHint,
      reveal,
    });
  }, [hintLevel, values, exercise, tol]);

  const grade = () => {
    const result = checkMatrix(values, exercise.expected, tol);
    setCheck(result);
    setFlash(true);
    window.setTimeout(() => setFlash(false), 500);
    if (result.ok && !solved) {
      setSolved(true);
      onSolved?.();
    }
  };

  const bumpHint = () => {
    setHintLevel((h) => Math.min(3, (h + 1) as HintLevel) as HintLevel);
  };

  const applyReveal = () => {
    const cell = findRevealCell(values, exercise.expected, tol);
    if (!cell) return;
    const next = values.map((row) => [...row]);
    const v = exercise.expected[cell.row][cell.col];
    next[cell.row][cell.col] =
      exercise.decimals != null
        ? v.toFixed(exercise.decimals)
        : Number.isInteger(v)
          ? String(v)
          : String(Math.round(v * 10000) / 10000);
    setValues(next);
    setHintLevel(3);
  };

  return (
    <div className={styles.root}>
      <p className={styles.prompt}>{exercise.prompt}</p>

      <div className={styles.inputs}>
        {exercise.inputs.map((inp, idx) => (
          <div
            key={`${inp.label}-${inp.matrix.flat().join(",")}-${idx}`}
            className={styles.inputBlock}
          >
            <MatrixDisplay matrix={inp.matrix} label={inp.label} />
            <Heatmap
              matrix={inp.matrix}
              label={`${inp.label} 시각화`}
              diverging
            />
          </div>
        ))}
      </div>

      <div className={styles.answerBlock}>
        <div className={styles.answerHead}>
          <span className={styles.answerLabel}>당신의 답</span>
          <span className={styles.shape}>
            [{rows}×{cols}]
          </span>
        </div>
        <MatrixInput
          rows={rows}
          cols={cols}
          values={values}
          onChange={setValues}
          check={check}
          flash={flash}
          onSubmitGrade={grade}
        />
        {showAttentionMap && solved && (
          <div className={styles.attMap}>
            <AttentionMap weights={exercise.expected} label="결과 맵" />
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={grade}>
          채점하기
        </button>
        <button type="button" className={styles.ghost} onClick={bumpHint}>
          힌트 {hintLevel < 3 ? `(${hintLevel}/3)` : "(최대)"}
        </button>
        {hintLevel >= 2 && (
          <button type="button" className={styles.ghost} onClick={applyReveal}>
            한 칸 채우기
          </button>
        )}
      </div>

      {check && (
        <div className={solved ? styles.okBox : styles.msgBox}>
          <p className={solved ? styles.okMsg : styles.msg}>
            {solved
              ? "정답입니다."
              : `${check.correctCount}/${check.totalCount} 칸 맞음 — 틀린/빈 칸을 확인하세요.`}
          </p>
          {solved && onNextExercise && (
            <button
              type="button"
              className={styles.primary}
              onClick={onNextExercise}
            >
              다음 문제로
            </button>
          )}
          {solved && !onNextExercise && nextLessonHref && (
            <Link href={nextLessonHref} className={styles.nextLink}>
              {nextLessonLabel ?? "다음으로"}
            </Link>
          )}
        </div>
      )}

      {hint && (
        <aside className={styles.hint}>
          <strong>{hint.title}</strong>
          <p>{hint.body}</p>
        </aside>
      )}
    </div>
  );
}
