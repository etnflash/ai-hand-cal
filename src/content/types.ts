import type { Matrix } from "@/engine";

export type LessonKind =
  | "matmul"
  | "linear"
  | "mlp"
  | "softmax"
  | "cnn"
  | "lstm"
  | "gnn"
  | "layernorm"
  | "positional"
  | "attention"
  | "self-attention"
  | "kvcache"
  | "transformer"
  | "lora"
  | "gan"
  | "vae"
  | "flow"
  | "diffusion"
  | "multihead"
  | "rope"
  | "crossentropy"
  | "dropout"
  | "rmsnorm"
  | "causal";

export type Difficulty = "easy" | "medium" | "hard";

export type Exercise = {
  id: string;
  title: string;
  prompt: string;
  inputs: { label: string; matrix: Matrix; role?: string }[];
  expected: Matrix;
  shapeHint: string;
  formulaHint: string;
  decimals?: number;
  /** Defaults to easy when omitted */
  difficulty?: Difficulty;
};

export type LessonStage =
  | "foundation"
  | "classical"
  | "prep"
  | "attention"
  | "block"
  | "generative";

export type Lesson = {
  slug: string;
  title: string;
  subtitle: string;
  kind: LessonKind;
  trackOrder: number;
  stage: LessonStage;
  intro: string[];
  formula: string;
  exercises: Exercise[];
  generatable?: boolean;
};
