import { lessons } from "@/content/lessons";
import { generateExercise } from "@/lib/generator";
import { hashSeed } from "@/engine";
import type { Difficulty, Exercise, Lesson } from "@/content/types";

function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const POOL = [
  "matmul",
  "linear",
  "softmax",
  "attention",
  "layernorm",
  "rmsnorm",
  "lora",
  "cnn",
  "vae",
  "multihead",
  "rope",
  "dropout",
  "crossentropy",
  "causal",
];

export type DailyChallenge = {
  dateKey: string;
  lesson: Lesson;
  exercise: Exercise;
  difficulty: Difficulty;
};

export type DailyStreak = {
  streak: number;
  lastSolved: string | null;
  solvedDates: string[];
};

const STREAK_KEY = "handcal-daily-streak-v1";

export function getDailyChallenge(date = new Date()): DailyChallenge | null {
  const dateKey = todayKey(date);
  const seed = hashSeed("daily", dateKey);
  const slug = POOL[seed % POOL.length];
  const lesson = lessons.find((l) => l.slug === slug);
  if (!lesson) return null;
  const diffs: Difficulty[] = ["easy", "medium", "hard"];
  const difficulty = diffs[seed % 3];
  const exercise = generateExercise(lesson, `daily-${dateKey}`, { difficulty });
  if (!exercise) return null;
  return {
    dateKey,
    lesson,
    exercise: {
      ...exercise,
      id: `daily-${dateKey}`,
      title: `오늘의 문제 · ${exercise.title}`,
    },
    difficulty,
  };
}

export function loadDailyStreak(): DailyStreak {
  if (typeof window === "undefined") {
    return { streak: 0, lastSolved: null, solvedDates: [] };
  }
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return { streak: 0, lastSolved: null, solvedDates: [] };
    return JSON.parse(raw) as DailyStreak;
  } catch {
    return { streak: 0, lastSolved: null, solvedDates: [] };
  }
}

function yesterdayKey(from: string): string {
  const d = new Date(from + "T12:00:00");
  d.setDate(d.getDate() - 1);
  return todayKey(d);
}

/** Mark today's daily solved; returns updated streak */
export function markDailySolved(dateKey = todayKey()): DailyStreak {
  const state = loadDailyStreak();
  if (state.solvedDates.includes(dateKey)) return state;

  const dates = [...state.solvedDates, dateKey];
  let streak = 1;
  if (state.lastSolved === yesterdayKey(dateKey)) {
    streak = state.streak + 1;
  } else if (state.lastSolved === dateKey) {
    streak = state.streak;
  }

  const next: DailyStreak = {
    streak,
    lastSolved: dateKey,
    solvedDates: dates.slice(-60),
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(STREAK_KEY, JSON.stringify(next));
  }
  return next;
}
