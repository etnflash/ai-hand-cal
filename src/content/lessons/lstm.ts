import type { Lesson } from "../types";

export const lstmLesson: Lesson = {
  slug: "lstm",
  title: "LSTM",
  subtitle: "장단기 메모리",
  kind: "lstm",
  trackOrder: 6,
  stage: "classical",
  intro: [
    "LSTM은 forget/input/output 게이트로 셀 상태 c를 조절합니다.",
    "c' = f⊙c + i⊙g,  h' = o⊙tanh(c'). 여기선 게이트 값이 이미 주어진 손계산에 집중합니다.",
  ],
  formula: "c' = f⊙c + i⊙g,   h' = o⊙tanh(c')",
  exercises: [
    {
      id: "lstm-1",
      title: "셀 업데이트",
      prompt: "c' = f⊙c + i⊙g 를 채우세요. (게이트는 이미 0~1)",
      inputs: [
        { label: "f", matrix: [[1, 0]] },
        { label: "c", matrix: [[2, 5]] },
        { label: "i", matrix: [[0, 1]] },
        { label: "g", matrix: [[3, 4]] },
      ],
      expected: [[2, 4]],
      shapeHint: "원소별 연산, shape 유지 [1×2]",
      formulaHint: "1·2+0·3=2, 0·5+1·4=4",
    },
    {
      id: "lstm-2",
      title: "전부 잊기",
      prompt: "f=0이면 이전 c가 사라집니다.",
      inputs: [
        { label: "f", matrix: [[0, 0]] },
        { label: "c", matrix: [[9, 9]] },
        { label: "i", matrix: [[1, 1]] },
        { label: "g", matrix: [[1, -1]] },
      ],
      expected: [[1, -1]],
      shapeHint: "[1×2]",
      formulaHint: "c' = 0 + i⊙g = g",
    },
    {
      id: "lstm-3",
      title: "히든 상태",
      prompt: "h = o ⊙ tanh(c). tanh(0)=0, tanh(큰값)≈±1.",
      inputs: [
        { label: "o", matrix: [[1, 0.5]] },
        { label: "c", matrix: [[0, 0]] },
      ],
      expected: [[0, 0]],
      shapeHint: "[1×2]",
      formulaHint: "tanh(0)=0 → h=0",
    },
    {
      id: "lstm-4",
      title: "tanh≈1",
      prompt: "c가 매우 크면 tanh≈1. h=o⊙1.",
      inputs: [
        { label: "o", matrix: [[0.2, 0.8]] },
        { label: "tanh(c)", matrix: [[1, 1]] },
      ],
      expected: [[0.2, 0.8]],
      decimals: 1,
      shapeHint: "[1×2]",
      formulaHint: "원소별 곱",
    },
    {
      id: "lstm-5",
      title: "한 스텝 종합",
      prompt: "c'를 구한 뒤 (tanh(c')≈c'가 작을 때 근사하지 말고) c'만 구하세요.",
      inputs: [
        { label: "f", matrix: [[0.5]] },
        { label: "c", matrix: [[4]] },
        { label: "i", matrix: [[0.5]] },
        { label: "g", matrix: [[2]] },
      ],
      expected: [[3]],
      shapeHint: "[1×1]",
      formulaHint: "0.5·4 + 0.5·2 = 3",
    },
  ],
};
