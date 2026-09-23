import type { Lesson } from "../types";

export const loraLesson: Lesson = {
  slug: "lora",
  title: "LoRA",
  subtitle: "Low-Rank Adaptation",
  kind: "lora",
  trackOrder: 14,
  stage: "block",
  generatable: true,
  intro: [
    "LoRA는 큰 W를 직접 건드리지 않고, 낮은 랭크 행렬 A, B로 보정합니다.",
    "y = xW + scale · (x A B). 손계산으로 ΔW = A B 와 최종 y를 구해 보세요.",
  ],
  formula: "y = xW + α · (xAB)",
  exercises: [
    {
      id: "lora-1",
      title: "ΔW = A B",
      prompt: "랭크-1 업데이트 ΔW = A @ B 를 채우세요. (scale=1)",
      inputs: [
        {
          label: "A",
          matrix: [
            [1],
            [2],
          ],
        },
        { label: "B", matrix: [[3, 0]] },
      ],
      expected: [
        [3, 0],
        [6, 0],
      ],
      shapeHint: "A [2×1] @ B [1×2] → ΔW [2×2]",
      formulaHint: "바깥곱: 첫 행 1·[3,0]=[3,0], 둘째 행 2·[3,0]=[6,0]",
    },
    {
      id: "lora-2",
      title: "x에 ΔW 적용",
      prompt: "x @ ΔW 를 계산하세요. (아래 ΔW 사용)",
      inputs: [
        { label: "x", matrix: [[1, 1]] },
        {
          label: "ΔW",
          matrix: [
            [3, 0],
            [6, 0],
          ],
        },
      ],
      expected: [[9, 0]],
      shapeHint: "[1×2] @ [2×2] → [1×2]",
      formulaHint: "1·[3,0] + 1·[6,0] = [9,0]",
    },
    {
      id: "lora-3",
      title: "전체 forward",
      prompt: "y = xW + xAB 를 한 번에 구하세요. (α=1)",
      inputs: [
        { label: "x", matrix: [[1, 0]] },
        {
          label: "W",
          matrix: [
            [1, 0],
            [0, 1],
          ],
        },
        {
          label: "A",
          matrix: [
            [1],
            [0],
          ],
        },
        { label: "B", matrix: [[2, 0]] },
      ],
      expected: [[3, 0]],
      shapeHint: "xW=[1,0], xAB=[2,0] → 합 [3,0]",
      formulaHint: "xW = [1,0]. xA=[1], ×B → [2,0]. 합 = [3,0]",
    },
    {
      id: "lora-4",
      title: "scale = 0.5",
      prompt: "y = xW + 0.5·(xAB). 소수 없이 정수로 떨어집니다.",
      inputs: [
        { label: "x", matrix: [[2, 0]] },
        {
          label: "W",
          matrix: [
            [1, 1],
            [0, 0],
          ],
        },
        {
          label: "A",
          matrix: [
            [2],
            [0],
          ],
        },
        { label: "B", matrix: [[1, 1]] },
      ],
      expected: [[4, 4]],
      shapeHint: "xW=[2,2], 0.5·xAB=0.5·[4,4]=[2,2] → [4,4]",
      formulaHint: "xA=[4], ×B=[4,4]. ×0.5=[2,2]. + xW[2,2] = [4,4]",
    },
    {
      id: "lora-5",
      title: "배치 2",
      prompt: "두 행 모두에 같은 W, A, B를 적용하세요. (α=1)",
      inputs: [
        {
          label: "x",
          matrix: [
            [1, 0],
            [0, 1],
          ],
        },
        {
          label: "W",
          matrix: [
            [1, 0],
            [0, 1],
          ],
        },
        {
          label: "A",
          matrix: [
            [1],
            [1],
          ],
        },
        { label: "B", matrix: [[1, 0]] },
      ],
      expected: [
        [2, 0],
        [1, 1],
      ],
      shapeHint: "[2×2] 출력",
      formulaHint:
        "행1: xW=[1,0], xAB=[1,0] → [2,0]. 행2: xW=[0,1], xAB=[1,0] → [1,1]",
    },
  ],
};
