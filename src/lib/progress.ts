const STORAGE_KEY = "handcal-progress-v1";

export type ProgressState = {
  completedLessons: string[];
  /** lessonSlug -> curated exercise ids only (not random) */
  completedExercises: Record<string, string[]>;
  lastVisited?: string;
};

function empty(): ProgressState {
  return { completedLessons: [], completedExercises: {} };
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return empty();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty();
    return { ...empty(), ...JSON.parse(raw) } as ProgressState;
  } catch {
    return empty();
  }
}

export function saveProgress(state: ProgressState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function touchLesson(lessonSlug: string): void {
  const state = loadProgress();
  state.lastVisited = lessonSlug;
  saveProgress(state);
}

/**
 * @param curatedIds - official exercise ids for this lesson (excludes random)
 */
export function markExerciseDone(
  lessonSlug: string,
  exerciseId: string,
  curatedIds: string[],
): ProgressState {
  const state = loadProgress();
  const isCurated = curatedIds.includes(exerciseId);
  if (isCurated) {
    const set = new Set(state.completedExercises[lessonSlug] ?? []);
    set.add(exerciseId);
    state.completedExercises[lessonSlug] = [...set];
    const doneAll = curatedIds.every((id) => set.has(id));
    if (doneAll && !state.completedLessons.includes(lessonSlug)) {
      state.completedLessons.push(lessonSlug);
    }
  }
  state.lastVisited = lessonSlug;
  saveProgress(state);
  return state;
}
