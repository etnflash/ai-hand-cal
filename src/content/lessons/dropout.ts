import type { Lesson } from "../types";

export const dropoutLesson: Lesson = {
  slug: "dropout",
  title: "Dropout",
  subtitle: "랜덤 마스킹",
  kind: "dropout",
  trackOrder: 3.6,
  stage: "foundation",
  generatable: true,
  intro: [
    "Dropout은 학습 중 일부를 0으로 만들어 과적합을 줄입니다.",
    "y = x ⊙ mask. (손계산에서는 keep 확률 스케일은 생략하거나 mask에 이미 반영)",
  ],
  formula: "y = x ⊙ m",
  exercises: [
    {
      id: "drop-1",
      title: "마스크 적용",
      prompt: "원소별 곱",
      inputs: [
        { label: "x", matrix: [[1, 2, 3, 4]] },
        { label: "m", matrix: [[1, 0, 1, 0]] },
      ],
      expected: [[1, 0, 3, 0]],
      shapeHint: "[1×4]",
      formulaHint: "0인 칸은 꺼짐",
    },
    {
      id: "drop-2",
      title: "전부 keep",
      prompt: "m이 전부 1이면 x 그대로",
      inputs: [
        {
          label: "x",
          matrix: [
            [2, 1],
            [0, 3],
          ],
        },
        {
          label: "m",
          matrix: [
            [1, 1],
            [1, 1],
          ],
        },
      ],
      expected: [
        [2, 1],
        [0, 3],
      ],
      shapeHint: "[2×2]",
      formulaHint: "항등",
    },
    {
      id: "drop-3",
      title: "스케일 2",
      prompt: "keep=0.5면 보통 ×2. y = x⊙m×2",
      inputs: [
        { label: "x", matrix: [[1, 1, 1, 1]] },
        { label: "m", matrix: [[1, 0, 1, 0]] },
      ],
      expected: [[2, 0, 2, 0]],
      shapeHint: "[1×4]",
      formulaHint: "살아남은 값 ×2",
    },
    {
      id: "drop-4",
      title: "행렬",
      prompt: "2×3 dropout",
      inputs: [
        {
          label: "x",
          matrix: [
            [1, 2, 3],
            [4, 5, 6],
          ],
        },
        {
          label: "m",
          matrix: [
            [0, 1, 1],
            [1, 0, 1],
          ],
        },
      ],
      expected: [
        [0, 2, 3],
        [4, 0, 6],
      ],
      shapeHint: "[2×3]",
      formulaHint: "원소별",
    },
    {
      id: "drop-5",
      title: "추론 시",
      prompt: "추론에서는 보통 dropout 없음 → x 그대로",
      inputs: [{ label: "x", matrix: [[7, 8]] }],
      expected: [[7, 8]],
      shapeHint: "[1×2]",
      formulaHint: "mask 없음",
    },
  ],
};
