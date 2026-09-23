import type { Lesson } from "../types";

export const positionalLesson: Lesson = {
  slug: "positional",
  title: "위치 인코딩",
  subtitle: "Positional Encoding",
  kind: "positional",
  trackOrder: 9,
  stage: "prep",
  generatable: false,
  intro: [
    "Attention 자체는 토큰 순서를 모릅니다. 그래서 임베딩에 위치 신호를 더합니다.",
    "원본 Transformer는 sin/cos 위치 인코딩을 씁니다. 먼저 더하기부터, 그다음 작은 d에서 sin/cos를 손으로 계산합니다.",
    "이 레슨 다음에 Attention으로 가면 ‘왜 PE가 필요한지’가 바로 연결됩니다.",
  ],
  formula: "X' = X + PE,   PE(pos,2i)=sin(θ), PE(pos,2i+1)=cos(θ)",
  exercises: [
    {
      id: "pe-1",
      title: "임베딩 + PE",
      prompt: "토큰 임베딩에 위치 벡터를 원소별로 더하세요.",
      inputs: [
        {
          label: "X (임베딩)",
          matrix: [
            [1, 0],
            [0, 1],
            [1, 1],
          ],
        },
        {
          label: "PE",
          matrix: [
            [0, 1],
            [1, 0],
            [0.5, 0.5],
          ],
        },
      ],
      expected: [
        [1, 1],
        [1, 1],
        [1.5, 1.5],
      ],
      decimals: 1,
      shapeHint: "[3×2] + [3×2] → [3×2]",
      formulaHint: "같은 칸끼리 더합니다. 첫 행: [1,0]+[0,1]=[1,1]",
    },
    {
      id: "pe-2",
      title: "pos=0 이면",
      prompt:
        "d=2일 때 PE(0)=[sin(0), cos(0)]입니다. 값을 채우세요.",
      inputs: [{ label: "pos", matrix: [[0]] }],
      expected: [[0, 1]],
      shapeHint: "한 위치 → [1×2] 벡터",
      formulaHint: "sin(0)=0, cos(0)=1",
    },
    {
      id: "pe-3",
      title: "pos=1, d=2 (근사)",
      prompt:
        "θ = pos / 10000^(0) = 1. sin(1)≈0.8415, cos(1)≈0.5403. 소수 4자리로 채우세요.",
      inputs: [{ label: "pos", matrix: [[1]] }],
      expected: [[0.8415, 0.5403]],
      decimals: 4,
      shapeHint: "[1×2]",
      formulaHint: "i=0일 때 θ=1. even→sin, odd→cos",
    },
    {
      id: "pe-4",
      title: "두 위치 PE 표",
      prompt: "pos 0,1에 대한 PE 행렬을 채우세요. (위의 값을 그대로 사용)",
      inputs: [
        { label: "힌트 pos0", matrix: [[0, 1]] },
        { label: "힌트 pos1", matrix: [[0.8415, 0.5403]] },
      ],
      expected: [
        [0, 1],
        [0.8415, 0.5403],
      ],
      decimals: 4,
      shapeHint: "[2×2] — 행=위치, 열=차원",
      formulaHint: "각 행이 한 위치의 PE 벡터입니다.",
    },
    {
      id: "pe-5",
      title: "임베딩에 실제 PE 더하기",
      prompt: "X + PE 를 소수 4자리로 채우세요.",
      inputs: [
        {
          label: "X",
          matrix: [
            [1, 0],
            [0, 1],
          ],
        },
        {
          label: "PE",
          matrix: [
            [0, 1],
            [0.8415, 0.5403],
          ],
        },
      ],
      expected: [
        [1, 1],
        [0.8415, 1.5403],
      ],
      decimals: 4,
      shapeHint: "[2×2] + [2×2]",
      formulaHint: "둘째 행: [0,1]+[0.8415,0.5403]=[0.8415,1.5403]",
    },
  ],
};
