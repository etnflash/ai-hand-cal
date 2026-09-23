import type { Lesson } from "../types";

export const vaeLesson: Lesson = {
  slug: "vae",
  title: "VAE",
  subtitle: "변분 오토인코더",
  kind: "vae",
  trackOrder: 16,
  stage: "generative",
  intro: [
    "VAE는 입력을 μ,σ로 인코딩한 뒤 z=μ+σ⊙ε 로 샘플하고 디코더로 복원합니다.",
    "손실은 재구성 오차 + KL(q(z|x)∥N(0,I)). 손계산으로 재파라미터·KL·ELBO 조각을 풉니다.",
  ],
  formula: "z=μ+σ⊙ε ,  KL=½(μ²+σ²−1−logσ²)",
  exercises: [
    {
      id: "vae-1",
      title: "재파라미터화",
      prompt: "z = μ + σ⊙ε",
      inputs: [
        { label: "μ", matrix: [[1, 0]] },
        { label: "σ", matrix: [[2, 1]] },
        { label: "ε", matrix: [[0.5, -1]] },
      ],
      expected: [[2, -1]],
      shapeHint: "원소별 [1×2]",
      formulaHint: "1+2·0.5=2, 0+1·(-1)=-1",
    },
    {
      id: "vae-2",
      title: "ε=0이면",
      prompt: "노이즈가 없으면 z=μ",
      inputs: [
        { label: "μ", matrix: [[3, -2]] },
        { label: "σ", matrix: [[9, 9]] },
        { label: "ε", matrix: [[0, 0]] },
      ],
      expected: [[3, -2]],
      shapeHint: "[1×2]",
      formulaHint: "σ⊙0=0",
    },
    {
      id: "vae-3",
      title: "디코더 선형",
      prompt: "x̂ = z W_dec + b",
      inputs: [
        { label: "z", matrix: [[1, 1]] },
        {
          label: "W_dec",
          matrix: [
            [1, 0],
            [0, 1],
          ],
        },
        { label: "b", matrix: [[0, 0]] },
      ],
      expected: [[1, 1]],
      shapeHint: "[1×2]",
      formulaHint: "W=I, b=0 → x̂=z",
    },
    {
      id: "vae-4",
      title: "복원 오차(L2 항)",
      prompt: "(x − x̂)² 원소별",
      inputs: [
        { label: "x", matrix: [[1, 2]] },
        { label: "x̂", matrix: [[1, 0]] },
      ],
      expected: [[0, 4]],
      shapeHint: "[1×2]",
      formulaHint: "0²=0, 2²=4",
    },
    {
      id: "vae-5",
      title: "배치 z",
      prompt: "두 샘플 재파라미터화",
      inputs: [
        {
          label: "μ",
          matrix: [
            [0, 0],
            [1, 1],
          ],
        },
        {
          label: "σ",
          matrix: [
            [1, 1],
            [1, 1],
          ],
        },
        {
          label: "ε",
          matrix: [
            [1, -1],
            [0, 2],
          ],
        },
      ],
      expected: [
        [1, -1],
        [1, 3],
      ],
      shapeHint: "[2×2]",
      formulaHint: "행별 μ+σ⊙ε",
    },
  ],
};
