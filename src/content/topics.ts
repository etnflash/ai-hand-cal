import type { Lesson } from "./types";

export type TopicId =
  | "foundations"
  | "mlp"
  | "cnn"
  | "lstm"
  | "gnn"
  | "transformer"
  | "generative";

export type GraphPos = { x: number; y: number };

export type TopicLane = {
  id: string;
  title: string;
  slugs: string[];
};

export type Topic = {
  id: TopicId;
  order: number;
  title: string;
  subtitle: string;
  blurb: string;
  hub: GraphPos;
  pipeline: string[];
  /** Short labels for map chips (fallback: lesson title) */
  mapLabel?: Record<string, string>;
  /** Visual lanes — preferred over spaghetti SVG layout */
  lanes?: TopicLane[];
  layout: Record<string, GraphPos>;
  edges: { from: string; to: string; label?: string }[];
};

/** Compact chip text for the topic map — keep short & fully readable */
export const MAP_LABEL: Record<string, string> = {
  matmul: "행렬곱",
  linear: "Linear",
  softmax: "Softmax",
  mlp: "MLP",
  crossentropy: "CE",
  dropout: "Dropout",
  cnn: "CNN",
  lstm: "LSTM",
  gnn: "GNN",
  positional: "위치",
  rope: "RoPE",
  attention: "Attn",
  causal: "Causal",
  "self-attention": "Self",
  multihead: "Heads",
  layernorm: "LN",
  rmsnorm: "RMS",
  transformer: "Block",
  kvcache: "KV",
  lora: "LoRA",
  gan: "GAN",
  vae: "VAE",
  flow: "Flow",
  diffusion: "Diff",
};

export const TOPICS: Topic[] = [
  {
    id: "foundations",
    order: 1,
    title: "기초",
    subtitle: "행렬 곱",
    blurb: "모든 모델의 공통 벽돌",
    hub: { x: 12, y: 50 },
    pipeline: ["matmul"],
    lanes: [{ id: "core", title: "연산", slugs: ["matmul"] }],
    layout: { matmul: { x: 50, y: 50 } },
    edges: [],
  },
  {
    id: "mlp",
    order: 2,
    title: "MLP",
    subtitle: "선형 · Softmax · 손실 · Dropout",
    blurb: "선형·활성화·손실·정규화가 한 네트워크로 모입니다.",
    hub: { x: 28, y: 22 },
    pipeline: ["linear", "softmax", "mlp", "crossentropy", "dropout"],
    lanes: [
      { id: "base", title: "기초", slugs: ["linear", "softmax"] },
      { id: "net", title: "네트워크", slugs: ["mlp"] },
      { id: "train", title: "학습", slugs: ["crossentropy", "dropout"] },
    ],
    layout: {
      linear: { x: 18, y: 28 },
      softmax: { x: 18, y: 55 },
      mlp: { x: 48, y: 40 },
      crossentropy: { x: 78, y: 28 },
      dropout: { x: 78, y: 62 },
    },
    edges: [
      { from: "linear", to: "mlp", label: "쌓기" },
      { from: "softmax", to: "mlp" },
      { from: "linear", to: "softmax", label: "로짓" },
      { from: "softmax", to: "crossentropy", label: "CE" },
      { from: "mlp", to: "dropout", label: "정규화" },
    ],
  },
  {
    id: "cnn",
    order: 3,
    title: "CNN",
    subtitle: "합성곱",
    blurb: "지역 패턴",
    hub: { x: 28, y: 78 },
    pipeline: ["cnn"],
    lanes: [{ id: "core", title: "합성곱", slugs: ["cnn"] }],
    layout: { cnn: { x: 50, y: 50 } },
    edges: [],
  },
  {
    id: "lstm",
    order: 4,
    title: "LSTM",
    subtitle: "시퀀스 게이트",
    blurb: "셀 상태 조절",
    hub: { x: 48, y: 82 },
    pipeline: ["lstm"],
    lanes: [{ id: "core", title: "게이트", slugs: ["lstm"] }],
    layout: { lstm: { x: 50, y: 50 } },
    edges: [],
  },
  {
    id: "gnn",
    order: 5,
    title: "GNN",
    subtitle: "그래프",
    blurb: "메시지 패싱",
    hub: { x: 68, y: 78 },
    pipeline: ["gnn"],
    lanes: [{ id: "core", title: "메시지", slugs: ["gnn"] }],
    layout: { gnn: { x: 50, y: 50 } },
    edges: [],
  },
  {
    id: "transformer",
    order: 6,
    title: "Transformer",
    subtitle: "위치 · Attention · Head · 블록",
    blurb: "위에서 아래로 쌓이며 한 블록이 됩니다.",
    hub: { x: 55, y: 42 },
    pipeline: [
      "positional",
      "rope",
      "attention",
      "causal",
      "self-attention",
      "multihead",
      "layernorm",
      "rmsnorm",
      "transformer",
      "kvcache",
      "lora",
    ],
    lanes: [
      { id: "pos", title: "위치", slugs: ["positional", "rope"] },
      {
        id: "attn",
        title: "주의",
        slugs: ["attention", "causal", "self-attention", "multihead"],
      },
      { id: "norm", title: "정규화", slugs: ["layernorm", "rmsnorm"] },
      {
        id: "block",
        title: "블록 · 추론",
        slugs: ["transformer", "kvcache", "lora"],
      },
    ],
    layout: {
      positional: { x: 18, y: 14 },
      rope: { x: 42, y: 14 },
      attention: { x: 18, y: 38 },
      causal: { x: 42, y: 38 },
      "self-attention": { x: 66, y: 38 },
      multihead: { x: 88, y: 38 },
      layernorm: { x: 30, y: 62 },
      rmsnorm: { x: 58, y: 62 },
      transformer: { x: 30, y: 86 },
      kvcache: { x: 58, y: 86 },
      lora: { x: 84, y: 86 },
    },
    edges: [
      { from: "positional", to: "self-attention", label: "X+PE" },
      { from: "rope", to: "self-attention", label: "회전" },
      { from: "attention", to: "self-attention", label: "QKV" },
      { from: "attention", to: "causal", label: "mask" },
      { from: "causal", to: "self-attention" },
      { from: "attention", to: "multihead", label: "split" },
      { from: "self-attention", to: "multihead" },
      { from: "self-attention", to: "layernorm", label: "+res" },
      { from: "multihead", to: "layernorm" },
      { from: "layernorm", to: "rmsnorm", label: "대안" },
      { from: "layernorm", to: "transformer", label: "FFN" },
      { from: "rmsnorm", to: "transformer" },
      { from: "attention", to: "kvcache", label: "K,V" },
      { from: "transformer", to: "kvcache", label: "추론" },
      { from: "transformer", to: "lora", label: "FT" },
    ],
  },
  {
    id: "generative",
    order: 7,
    title: "생성",
    subtitle: "GAN · VAE · Flow · Diff",
    blurb: "적대·잠재·가역·확산 — 네 갈래를 손계산으로 비교",
    hub: { x: 88, y: 50 },
    pipeline: ["gan", "vae", "flow", "diffusion"],
    lanes: [
      { id: "adv", title: "적대 · 잠재", slugs: ["gan", "vae"] },
      { id: "dens", title: "밀도 · 확산", slugs: ["flow", "diffusion"] },
    ],
    layout: {
      gan: { x: 28, y: 28 },
      vae: { x: 72, y: 28 },
      flow: { x: 28, y: 72 },
      diffusion: { x: 72, y: 72 },
    },
    edges: [
      { from: "gan", to: "vae", label: "잠재" },
      { from: "vae", to: "diffusion", label: "노이즈" },
      { from: "gan", to: "flow", label: "밀도" },
      { from: "flow", to: "diffusion", label: "가역↔확산" },
    ],
  },
];

export const HUB_EDGES: { from: TopicId; to: TopicId; label?: string }[] = [
  { from: "foundations", to: "mlp" },
  { from: "foundations", to: "cnn" },
  { from: "foundations", to: "transformer", label: "기반" },
  { from: "mlp", to: "transformer", label: "Softmax" },
  { from: "lstm", to: "transformer", label: "시퀀스" },
  { from: "gnn", to: "transformer" },
  { from: "transformer", to: "generative", label: "확산" },
];

const SLUG_TO_TOPIC: Record<string, TopicId> = {};
for (const topic of TOPICS) {
  for (const slug of topic.pipeline) {
    SLUG_TO_TOPIC[slug] = topic.id;
  }
}

export function topicOf(slug: string): Topic | undefined {
  const id = SLUG_TO_TOPIC[slug];
  return TOPICS.find((t) => t.id === id);
}

export function lessonsInTopic(topic: Topic, all: Lesson[]): Lesson[] {
  const map = new Map(all.map((l) => [l.slug, l]));
  return topic.pipeline
    .map((slug) => map.get(slug))
    .filter((l): l is Lesson => Boolean(l));
}

export function chipLabel(slug: string, lessonTitle?: string): string {
  return MAP_LABEL[slug] ?? lessonTitle ?? slug;
}
