import type { Lesson } from "../types";

export const ropeLesson: Lesson = {
  slug: "rope",
  title: "RoPE",
  subtitle: "회전 위치 인코딩",
  kind: "rope",
  trackOrder: 9.5,
  stage: "prep",
  generatable: true,
  intro: [
    "RoPE는 벡터 쌍을 각도 θ만큼 회전시켜 위치를 넣습니다.",
    "(x', y') = (x cosθ − y sinθ, x sinθ + y cosθ). θ=0이면 그대로, θ=π/2면 (−y, x).",
  ],
  formula: "R_θ [x,y]ᵀ",
  exercises: [
    {
      id: "rope-1",
      title: "θ=0",
      prompt: "회전 없으면 그대로. [3, 4] → ?",
      inputs: [{ label: "(x,y)", matrix: [[3, 4]] }],
      expected: [[3, 4]],
      shapeHint: "[1×2]",
      formulaHint: "cos0=1, sin0=0",
    },
    {
      id: "rope-2",
      title: "θ=π/2",
      prompt: "cos=0, sin=1. [1, 0] → [0, 1]",
      inputs: [{ label: "(x,y)", matrix: [[1, 0]] }],
      expected: [[0, 1]],
      shapeHint: "[1×2]",
      formulaHint: "x'=−y=0, y'=x=1",
    },
    {
      id: "rope-3",
      title: "θ=π/2 다른 점",
      prompt: "[0, 2] 를 π/2 회전",
      inputs: [{ label: "(x,y)", matrix: [[0, 2]] }],
      expected: [[-2, 0]],
      shapeHint: "[1×2]",
      formulaHint: "x' = 0−2·1 = −2, y' = 0+0 = 0? Wait: x'=x c - y s = 0 - 2*1 = -2, y'=x s + y c = 0 + 2*0 = 0",
    },
    {
      id: "rope-4",
      title: "두 토큰 θ=0, π/2",
      prompt: "행0은 θ=0, 행1은 θ=π/2. 입력 [[1,0],[1,0]]",
      inputs: [
        {
          label: "X",
          matrix: [
            [1, 0],
            [1, 0],
          ],
        },
      ],
      expected: [
        [1, 0],
        [0, 1],
      ],
      shapeHint: "[2×2]",
      formulaHint: "둘째 행만 회전",
    },
    {
      id: "rope-5",
      title: "θ=π",
      prompt: "cos=-1, sin=0. [2, 3] → [-2, -3]",
      inputs: [{ label: "(x,y)", matrix: [[2, 3]] }],
      expected: [[-2, -3]],
      shapeHint: "[1×2]",
      formulaHint: "부호 반전",
    },
  ],
};
