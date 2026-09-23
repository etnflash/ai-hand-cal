import type { Lesson } from "../types";

export const poolingLesson: Lesson = {
  slug: "pooling",
  title: "Pooling",
  subtitle: "Max / Avg 풀링",
  kind: "pooling",
  trackOrder: 5.5,
  stage: "classical",
  generatable: true,
  intro: [
    "Pooling은 합성곱 뒤에 해상도를 줄입니다. Max는 최댓값, Avg는 평균을 고릅니다.",
    "손계산: 2×2 non-overlap 창이 가장 많습니다.",
  ],
  formula: "Y[i,j] = max/mean (창 X[2i:2i+2, 2j:2j+2])",
  exercises: [
    {
      id: "pool-1",
      difficulty: "easy",
      title: "2×2 Max",
      prompt: "4×4를 2×2 Max-pool (stride=2)",
      inputs: [
        {
          label: "X",
          matrix: [
            [1, 3, 2, 0],
            [4, 1, 0, 5],
            [2, 2, 8, 1],
            [0, 7, 3, 3],
          ],
        },
      ],
      expected: [
        [4, 5],
        [7, 8],
      ],
      shapeHint: "[4×4]→[2×2]",
      formulaHint: "좌상 max(1,3,4,1)=4 …",
    },
    {
      id: "pool-2",
      difficulty: "easy",
      title: "2×2 Avg",
      prompt: "같은 X를 Avg-pool (소수 1자리 불필요, 정수)",
      inputs: [
        {
          label: "X",
          matrix: [
            [2, 2, 0, 4],
            [2, 2, 4, 0],
            [1, 1, 3, 3],
            [1, 1, 3, 3],
          ],
        },
      ],
      expected: [
        [2, 2],
        [1, 3],
      ],
      shapeHint: "[4×4]→[2×2]",
      formulaHint: "(2+2+2+2)/4=2",
    },
    {
      id: "pool-3",
      difficulty: "medium",
      title: "작은 맵",
      prompt: "2×2 Max-pool → 스칼라",
      inputs: [
        {
          label: "X",
          matrix: [
            [1, 9],
            [3, 2],
          ],
        },
      ],
      expected: [[9]],
      shapeHint: "[2×2]→[1×1]",
      formulaHint: "max=9",
    },
    {
      id: "pool-4",
      difficulty: "medium",
      title: "1×2 가로 pool",
      prompt: "행마다 인접 2개를 max (stride 2)",
      inputs: [
        {
          label: "X",
          matrix: [
            [1, 5, 2, 8],
            [0, 3, 9, 1],
          ],
        },
      ],
      expected: [
        [5, 8],
        [3, 9],
      ],
      shapeHint: "pool 1×2",
      formulaHint: "행별 (1,5)→5, (2,8)→8",
    },
    {
      id: "pool-5",
      difficulty: "hard",
      title: "Conv 후 Pool",
      prompt: "이미 conv 결과 Y를 Max-pool 2×2",
      inputs: [
        {
          label: "Y",
          matrix: [
            [2, 3, 1, 0],
            [5, 5, 4, 2],
            [0, 1, 8, 8],
            [3, 2, 7, 1],
          ],
        },
      ],
      expected: [
        [5, 4],
        [3, 8],
      ],
      shapeHint: "[4×4]→[2×2]",
      formulaHint: "좌상 max=5, 우상=4, 좌하=3, 우하=8",
    },
  ],
};
