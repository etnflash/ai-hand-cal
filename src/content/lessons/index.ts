import { matmulLesson } from "./matmul";
import { linearLesson } from "./linear";
import { mlpLesson } from "./mlp";
import { softmaxLesson } from "./softmax";
import { crossentropyLesson } from "./crossentropy";
import { dropoutLesson } from "./dropout";
import { cnnLesson } from "./cnn";
import { lstmLesson } from "./lstm";
import { gnnLesson } from "./gnn";
import { layernormLesson } from "./layernorm";
import { rmsnormLesson } from "./rmsnorm";
import { positionalLesson } from "./positional";
import { ropeLesson } from "./rope";
import { attentionLesson } from "./attention";
import { causalLesson } from "./causal";
import { selfAttentionLesson } from "./self-attention";
import { multiheadLesson } from "./multihead";
import { kvcacheLesson } from "./kvcache";
import { transformerLesson } from "./transformer";
import { loraLesson } from "./lora";
import { ganLesson } from "./gan";
import { vaeLesson } from "./vae";
import { flowLesson } from "./flow";
import { diffusionLesson } from "./diffusion";
import { mergeExtras } from "../extraExercises";
import type { Lesson } from "../types";
export { TOPICS, topicOf, lessonsInTopic } from "../topics";
export type { Topic, TopicId } from "../topics";

function enrich(lesson: Lesson): Lesson {
  return {
    ...lesson,
    exercises: mergeExtras(lesson.slug, lesson.exercises),
    generatable: lesson.generatable !== false,
  };
}

export const lessons: Lesson[] = [
  matmulLesson,
  linearLesson,
  mlpLesson,
  softmaxLesson,
  crossentropyLesson,
  dropoutLesson,
  cnnLesson,
  lstmLesson,
  gnnLesson,
  layernormLesson,
  rmsnormLesson,
  positionalLesson,
  ropeLesson,
  attentionLesson,
  causalLesson,
  selfAttentionLesson,
  multiheadLesson,
  kvcacheLesson,
  transformerLesson,
  loraLesson,
  ganLesson,
  vaeLesson,
  flowLesson,
  diffusionLesson,
]
  .map(enrich)
  .sort((a, b) => a.trackOrder - b.trackOrder);

export function getLesson(slug: string): Lesson | undefined {
  return lessons.find((l) => l.slug === slug);
}
