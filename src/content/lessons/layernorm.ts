import type { Lesson } from "../types";

export const layernormLesson: Lesson = {
  slug: "layernorm",
  title: "LayerNorm",
  subtitle: "행 단위 정규화",
  kind: "layernorm",
  trackOrder: 8,
  stage: "prep",
  generatable: true,
  intro: [
    "LayerNorm은 각 행(토큰)의 평균을 빼고 표준편차로 나눕니다. Transformer 블록 곳곳에 등장합니다.",
    "γ=1, β=0 이면 순수 정규화입니다. 소수 2자리까지 맞으면 정답입니다.",
  ],
  formula: "LN(x) = (x − μ) / √(σ²+ε) · γ + β",
  exercises: [
    {
      id: "ln-1",
      title: "두 값",
      prompt: "μ와 σ²를 구한 뒤 정규화하세요. γ=1, β=0, ε≈0. (소수 2자리)",
      inputs: [{ label: "x", matrix: [[1, 3]] }],
      expected: [[-1, 1]],
      decimals: 2,
      shapeHint: "[1×2] → [1×2]",
      formulaHint: "μ=2, σ²=((−1)²+(1)²)/2=1, σ=1 → (1−2)/1=−1, (3−2)/1=1",
    },
    {
      id: "ln-2",
      title: "모두 같으면",
      prompt: "값이 모두 같으면 정규화 결과는 0입니다.",
      inputs: [{ label: "x", matrix: [[4, 4, 4]] }],
      expected: [[0, 0, 0]],
      decimals: 2,
      shapeHint: "[1×3] → [1×3]",
      formulaHint: "μ=4, 편차 전부 0 → 결과 0",
    },
    {
      id: "ln-3",
      title: "배치 2행",
      prompt: "각 행을 독립적으로 LayerNorm 하세요.",
      inputs: [
        {
          label: "X",
          matrix: [
            [1, 3],
            [2, 2],
          ],
        },
      ],
      expected: [
        [-1, 1],
        [0, 0],
      ],
      decimals: 2,
      shapeHint: "[2×2] → [2×2], 행마다 따로",
      formulaHint: "첫째 행은 ln-1과 동일. 둘째 행은 값이 같아 0.",
    },
    {
      id: "ln-4",
      title: "γ, β 적용",
      prompt: "정규화 후 γ=[2,2], β=[1,0]을 적용하세요. (먼저 LN 후 스케일)",
      inputs: [
        { label: "x", matrix: [[1, 3]] },
        { label: "γ", matrix: [[2, 2]] },
        { label: "β", matrix: [[1, 0]] },
      ],
      expected: [[-1, 2]],
      decimals: 2,
      shapeHint: "LN 결과 [−1,1] → ×γ + β",
      formulaHint: "LN=[−1,1]. ×2 → [−2,2], +[1,0] → [−1,2]",
    },
    {
      id: "ln-5",
      title: "세 값",
      prompt: "μ=2인 벡터입니다. 정규화 결과를 채우세요. (소수 2자리)",
      inputs: [{ label: "x", matrix: [[0, 2, 4]] }],
      expected: [[-1.22, 0, 1.22]],
      decimals: 2,
      shapeHint: "[1×3] → [1×3]",
      formulaHint:
        "μ=2, σ²=(4+0+4)/3=8/3, σ≈1.63. (0−2)/1.63≈−1.22, (4−2)/1.63≈1.22",
    },
  ],
};
