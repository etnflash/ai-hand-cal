import type { Lesson } from "../types";

export const linearLesson: Lesson = {
  slug: "linear",
  title: "선형층",
  subtitle: "Linear Layer  y = xW + b",
  kind: "linear",
  trackOrder: 2,
  stage: "foundation",
  generatable: true,
  intro: [
    "선형층(완전연결층)은 입력에 가중치 행렬을 곱한 뒤 편향을 더합니다.",
    "배치가 여러 행이어도 같은 W, b가 모든 행에 공유됩니다.",
  ],
  formula: "y = xW + b",
  exercises: [
    {
      id: "lin-1",
      title: "한 샘플",
      prompt: "먼저 xW를 구한 뒤 b를 더하세요.",
      inputs: [
        { label: "x", matrix: [[2, 1]] },
        {
          label: "W",
          matrix: [
            [3, 0],
            [-1, 2],
          ],
        },
        { label: "b", matrix: [[1, 4]] },
      ],
      expected: [[6, 6]],
      shapeHint: "x [1×2] @ W [2×2] → [1×2], 여기에 b [1×2]를 더합니다.",
      formulaHint: "xW = [2·3+1·(-1), 2·0+1·2] = [5, 2], + b → [6, 6]",
    },
    {
      id: "lin-2",
      title: "배치 2",
      prompt: "각 행에 같은 W와 b가 적용됩니다.",
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
            [2, 3],
            [4, 5],
          ],
        },
        { label: "b", matrix: [[1, -1]] },
      ],
      expected: [
        [3, 2],
        [5, 4],
      ],
      shapeHint: "x [2×2] @ W [2×2] → [2×2], b는 각 행에 더해집니다.",
      formulaHint: "첫 행: [1,0]@W + b = [2,3] + [1,-1] = [3,2]",
    },
    {
      id: "lin-3",
      title: "차원 확장",
      prompt: "입력이 3차원, 출력이 2차원인 선형층입니다.",
      inputs: [
        { label: "x", matrix: [[1, 2, 3]] },
        {
          label: "W",
          matrix: [
            [1, 0],
            [0, 1],
            [-1, 1],
          ],
        },
        { label: "b", matrix: [[0, 2]] },
      ],
      expected: [[-2, 7]],
      shapeHint: "x [1×3] @ W [3×2] → [1×2]",
      formulaHint: "xW = [1+0-3, 0+2+3] = [-2, 5], + [0,2] → [-2, 7]",
    },
    {
      id: "lin-4",
      title: "편향 없는 경우",
      prompt: "b = 0이면 순수 행렬곱과 같습니다. (b를 0으로 두세요)",
      inputs: [
        {
          label: "x",
          matrix: [
            [2, -1],
            [1, 1],
          ],
        },
        {
          label: "W",
          matrix: [
            [1, 2],
            [3, 0],
          ],
        },
        { label: "b", matrix: [[0, 0]] },
      ],
      expected: [
        [-1, 4],
        [4, 2],
      ],
      shapeHint: "[2×2] @ [2×2] → [2×2]",
      formulaHint: "b가 0이므로 y = xW만 계산하면 됩니다.",
    },
    {
      id: "lin-5",
      title: "혼합 부호",
      prompt: "음수 가중치와 편향을 함께 다뤄 보세요.",
      inputs: [
        { label: "x", matrix: [[3, -2]] },
        {
          label: "W",
          matrix: [
            [-1, 2],
            [2, -1],
          ],
        },
        { label: "b", matrix: [[-1, 1]] },
      ],
      expected: [[-8, 9]],
      shapeHint: "[1×2] @ [2×2] → [1×2]",
      formulaHint: "xW = [3·(-1)+(-2)·2, 3·2+(-2)·(-1)] = [-7, 8], + b → [-8, 9]",
    },
  ],
};
