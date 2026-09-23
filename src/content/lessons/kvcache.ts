import type { Lesson } from "../types";

export const kvcacheLesson: Lesson = {
  slug: "kvcache",
  title: "KV Cache",
  subtitle: "추론 가속 캐시",
  kind: "kvcache",
  trackOrder: 12,
  stage: "attention",
  intro: [
    "오토리그레시브 생성에서 과거 토큰의 K,V는 다시 계산할 필요가 없습니다. 캐시에 쌓고 새 토큰 Q만 계산합니다.",
    "손으로: (1) 캐시 concat (2) 새 Q가 전체 Kᵀ에 어텐션.",
  ],
  formula: "K ← [K_past; k_new],  Attn(q_new, K, V)",
  exercises: [
    {
      id: "kv-1",
      title: "K 캐시 concat",
      prompt: "과거 K와 새 k를 행으로 이어 붙이세요.",
      inputs: [
        {
          label: "K_past",
          matrix: [
            [1, 0],
            [0, 1],
          ],
        },
        { label: "k_new", matrix: [[1, 1]] },
      ],
      expected: [
        [1, 0],
        [0, 1],
        [1, 1],
      ],
      shapeHint: "[2×2] + [1×2] → [3×2]",
      formulaHint: "행을 그대로 아래에 붙입니다.",
    },
    {
      id: "kv-2",
      title: "V 캐시 concat",
      prompt: "V도 동일하게 concat.",
      inputs: [
        {
          label: "V_past",
          matrix: [
            [2, 0],
            [0, 2],
          ],
        },
        { label: "v_new", matrix: [[3, 3]] },
      ],
      expected: [
        [2, 0],
        [0, 2],
        [3, 3],
      ],
      shapeHint: "[3×2]",
      formulaHint: "KV-1과 같은 방식",
    },
    {
      id: "kv-3",
      title: "새 Q의 scores",
      prompt: "q_new @ Kᵀ  (d=2, scale 없이). K는 캐시 전체.",
      inputs: [
        { label: "q_new", matrix: [[1, 0]] },
        {
          label: "K",
          matrix: [
            [1, 0],
            [0, 1],
            [1, 1],
          ],
        },
      ],
      expected: [[1, 0, 1]],
      shapeHint: "[1×2]@[2×3]→[1×3]",
      formulaHint: "Kᵀ 열과 내적: 1, 0, 1",
    },
    {
      id: "kv-4",
      title: "weights @ V",
      prompt: "이미 Softmax된 weights로 output.",
      inputs: [
        { label: "w", matrix: [[0.5, 0, 0.5]] },
        {
          label: "V",
          matrix: [
            [2, 0],
            [0, 2],
            [4, 0],
          ],
        },
      ],
      expected: [[3, 0]],
      shapeHint: "[1×3]@[3×2]→[1×2]",
      formulaHint: "0.5·[2,0]+0.5·[4,0]=[3,0]",
    },
    {
      id: "kv-5",
      title: "캐시 길이",
      prompt: "past T=3, 새 토큰 1개면 K 행 수는?",
      inputs: [{ label: "힌트", matrix: [[3, 1]] }],
      expected: [[4]],
      shapeHint: "스칼라 [1×1]",
      formulaHint: "3+1=4",
    },
  ],
};
