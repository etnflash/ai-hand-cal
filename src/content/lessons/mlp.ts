import type { Lesson } from "../types";

export const mlpLesson: Lesson = {
  slug: "mlp",
  title: "MLP",
  subtitle: "다층 퍼셉트론",
  kind: "mlp",
  trackOrder: 3,
  stage: "foundation",
  intro: [
    "MLP는 선형층 사이에 비선형(ReLU 등)을 끼운 스택입니다.",
    "h = ReLU(xW₁+b₁),  y = hW₂+b₂ 를 손으로 한 번 관통하세요.",
  ],
  formula: "y = W₂ · ReLU(W₁x + b₁) + b₂",
  exercises: [
    {
      id: "mlp-1",
      title: "첫 선형",
      prompt: "z₁ = xW₁ + b₁ 을 채우세요.",
      inputs: [
        { label: "x", matrix: [[1, 2]] },
        {
          label: "W₁",
          matrix: [
            [1, 0, -1],
            [0, 1, 1],
          ],
        },
        { label: "b₁", matrix: [[0, 0, 1]] },
      ],
      expected: [[1, 2, 2]],
      shapeHint: "[1×2]@[2×3]+b → [1×3]",
      formulaHint: "[1,2]@[W₁]=[1,2,1], +b=[1,2,2]",
    },
    {
      id: "mlp-2",
      title: "ReLU",
      prompt: "음수를 0으로 만드세요.",
      inputs: [{ label: "z₁", matrix: [[2, -1, 3]] }],
      expected: [[2, 0, 3]],
      shapeHint: "shape 유지",
      formulaHint: "ReLU(z)=max(0,z)",
    },
    {
      id: "mlp-3",
      title: "둘째 선형",
      prompt: "y = hW₂ + b₂",
      inputs: [
        { label: "h", matrix: [[2, 0, 1]] },
        {
          label: "W₂",
          matrix: [
            [1, 0],
            [0, 1],
            [1, 1],
          ],
        },
        { label: "b₂", matrix: [[-1, 0]] },
      ],
      expected: [[2, 1]],
      shapeHint: "[1×3]@[3×2]+b → [1×2]",
      formulaHint: "2·[1,0]+0+1·[1,1]=[3,1], +[-1,0]=[2,1]",
    },
    {
      id: "mlp-4",
      title: "배치 2",
      prompt: "두 샘플에 같은 MLP 가중치를 적용한 뒤 ReLU까지.",
      inputs: [
        {
          label: "x",
          matrix: [
            [1, 0],
            [0, -2],
          ],
        },
        {
          label: "W₁",
          matrix: [
            [1, 1],
            [1, -1],
          ],
        },
      ],
      expected: [
        [1, 1],
        [0, 2],
      ],
      shapeHint: "xW 후 ReLU, b=0",
      formulaHint: "행1:[1,1]. 행2:[-2,2]→ReLU[0,2]",
    },
    {
      id: "mlp-5",
      title: "한 줄 요약",
      prompt: "이미 ReLU된 h로 최종 y (b=0).",
      inputs: [
        { label: "h", matrix: [[1, 1]] },
        {
          label: "W₂",
          matrix: [
            [2],
            [3],
          ],
        },
      ],
      expected: [[5]],
      shapeHint: "[1×2]@[2×1]→[1×1]",
      formulaHint: "1·2+1·3=5",
    },
  ],
};
