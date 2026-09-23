import type { Lesson } from "../types";

/** Causal (lower-triangular) attention mask — scores then softmax */
export const causalLesson: Lesson = {
  slug: "causal",
  title: "Causal Mask",
  subtitle: "미래 토큰 가리기",
  kind: "causal",
  trackOrder: 7.5,
  stage: "attention",
  generatable: true,
  intro: [
    "디코더(GPT) Attention은 미래 토큰을 보지 못합니다. 점수 행렬에서 j>i 인 칸에 −∞를 넣고 Softmax합니다.",
    "손계산에서는 −∞ 대신 Softmax 전에 0으로 두고 해당 칸 확률을 0으로 두는 효과를 연습합니다. 마스크 적용 후 Softmax 행을 채우세요.",
  ],
  formula: "scores′ᵢⱼ = scoresᵢⱼ if j≤i else −∞",
  exercises: [
    {
      id: "causal-1",
      title: "마스크 적용",
      difficulty: "easy",
      prompt: "2×2 점수. 미래(우상단)를 −99로 바꾼 뒤 Softmax 행. 행0: [2,−99] → ≈[1,0]",
      inputs: [
        {
          label: "scores",
          matrix: [
            [2, 1],
            [0, 3],
          ],
        },
      ],
      expected: [
        [1, 0],
        [0.05, 0.95],
      ],
      decimals: 2,
      shapeHint: "[2×2]",
      formulaHint: "행0: j>0 마스크 → Softmax([2,−∞])≈[1,0]. 행1: Softmax([0,3])",
    },
    {
      id: "causal-2",
      title: "마스크만",
      difficulty: "easy",
      prompt: "마스크 후 점수만 쓰세요. 미래 칸은 −99",
      inputs: [
        {
          label: "scores",
          matrix: [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
          ],
        },
      ],
      expected: [
        [1, -99, -99],
        [4, 5, -99],
        [7, 8, 9],
      ],
      shapeHint: "[3×3]",
      formulaHint: "j>i → −99",
    },
    {
      id: "causal-3",
      title: "행 Softmax",
      difficulty: "medium",
      prompt: "이미 마스크된 점수 Softmax (소수 2자리)",
      inputs: [
        {
          label: "masked",
          matrix: [
            [0, -99],
            [1, 1],
          ],
        },
      ],
      expected: [
        [1, 0],
        [0.5, 0.5],
      ],
      decimals: 2,
      shapeHint: "[2×2]",
      formulaHint: "행0 거의 [1,0], 행1 균등",
    },
    {
      id: "causal-4",
      title: "대각선만",
      difficulty: "medium",
      prompt: "마스크 후 Softmax. 점수 전부 0이면 허용 칸만 균등",
      inputs: [
        {
          label: "scores",
          matrix: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
          ],
        },
      ],
      expected: [
        [1, 0, 0],
        [0.5, 0.5, 0],
        [0.33, 0.33, 0.33],
      ],
      decimals: 2,
      shapeHint: "[3×3]",
      formulaHint: "허용 칸만 Softmax",
    },
    {
      id: "causal-5",
      title: "한 줄 추론",
      difficulty: "hard",
      prompt: "마지막 행만 Softmax (과거+현재). 점수 [1,2,3] → Softmax",
      inputs: [{ label: "last row", matrix: [[1, 2, 3]] }],
      expected: [[0.09, 0.24, 0.67]],
      decimals: 2,
      shapeHint: "[1×3]",
      formulaHint: "표준 Softmax",
    },
  ],
};
