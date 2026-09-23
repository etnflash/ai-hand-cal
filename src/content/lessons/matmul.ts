import type { Lesson } from "../types";

export const matmulLesson: Lesson = {
  slug: "matmul",
  title: "행렬 곱셈",
  subtitle: "Matrix Multiplication",
  kind: "matmul",
  trackOrder: 1,
  stage: "foundation",
  generatable: true,
  intro: [
    "신경망의 거의 모든 층은 결국 행렬 곱입니다. 손으로 한 번 채워 보면 shape와 합의 의미가 몸에 붙습니다.",
    "A가 [m×k], B가 [k×n]일 때 결과 C는 [m×n]이고, C[i][j]는 A의 i번째 행과 B의 j번째 열의 내적입니다.",
  ],
  formula: "C[i][j] = Σ_k A[i][k] · B[k][j]",
  exercises: [
    {
      id: "mm-1",
      title: "2×2 기초",
      prompt: "아래 두 행렬을 곱한 결과를 빈 칸에 채우세요.",
      inputs: [
        {
          label: "A",
          matrix: [
            [1, 2],
            [3, 4],
          ],
        },
        {
          label: "B",
          matrix: [
            [5, 6],
            [7, 8],
          ],
        },
      ],
      expected: [
        [19, 22],
        [43, 50],
      ],
      shapeHint: "A는 [2×2], B는 [2×2] → 결과는 [2×2]",
      formulaHint: "C[0][0] = 1·5 + 2·7 = 19. 같은 방식으로 나머지 칸을 채우세요.",
    },
    {
      id: "mm-2",
      title: "직사각 행렬",
      prompt: "행과 열 개수가 다를 때 shape를 먼저 확인하세요.",
      inputs: [
        {
          label: "A",
          matrix: [
            [2, 0, 1],
            [1, 3, -1],
          ],
        },
        {
          label: "B",
          matrix: [
            [1, 2],
            [0, 1],
            [4, 0],
          ],
        },
      ],
      expected: [
        [6, 4],
        [-3, 5],
      ],
      shapeHint: "A [2×3] @ B [3×2] → [2×2]",
      formulaHint: "안쪽 차원 3이 맞물려야 곱할 수 있습니다. C[0][0] = 2·1 + 0·0 + 1·4 = 6",
    },
    {
      id: "mm-3",
      title: "행벡터 × 행렬",
      prompt: "입력이 한 행일 때도 같은 규칙입니다.",
      inputs: [
        { label: "x", matrix: [[1, -1, 2]] },
        {
          label: "W",
          matrix: [
            [2, 0],
            [1, 3],
            [0, -1],
          ],
        },
      ],
      expected: [[1, -5]],
      shapeHint: "x [1×3] @ W [3×2] → [1×2]",
      formulaHint: "결과의 j번째 성분은 x와 W의 j열의 내적입니다.",
    },
    {
      id: "mm-4",
      title: "음수 포함",
      prompt: "부호에 주의하며 내적을 계산하세요.",
      inputs: [
        {
          label: "A",
          matrix: [
            [-2, 1],
            [0, 3],
          ],
        },
        {
          label: "B",
          matrix: [
            [1, -1],
            [2, 4],
          ],
        },
      ],
      expected: [
        [0, 6],
        [6, 12],
      ],
      shapeHint: "둘 다 [2×2] → 결과 [2×2]",
      formulaHint: "C[0][0] = (-2)·1 + 1·2 = 0",
    },
    {
      id: "mm-5",
      title: "단위행렬",
      prompt: "I를 곱하면 무엇이 남나요?",
      inputs: [
        {
          label: "A",
          matrix: [
            [4, 5],
            [6, 7],
          ],
        },
        {
          label: "I",
          matrix: [
            [1, 0],
            [0, 1],
          ],
        },
      ],
      expected: [
        [4, 5],
        [6, 7],
      ],
      shapeHint: "[2×2] @ [2×2] → [2×2]",
      formulaHint: "A @ I = A. 각 행이 그대로 복사됩니다.",
    },
  ],
};
