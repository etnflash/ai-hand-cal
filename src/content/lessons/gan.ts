import type { Lesson } from "../types";

export const ganLesson: Lesson = {
  slug: "gan",
  title: "GAN",
  subtitle: "생성 대립 네트워크",
  kind: "gan",
  trackOrder: 15,
  stage: "generative",
  intro: [
    "GAN은 생성기 G와 판별기 D가 경쟁합니다. D는 진짜/가짜 확률, G는 D를 속이는 샘플을 만듭니다.",
    "손계산: 로짓→σ→BCE(−log D, −log(1−D)), 그리고 G의 선형 맵까지 한 줄로 이어 봅니다.",
  ],
  formula: "D=σ(w·x+b) ,  L_D=−log D_real−log(1−D_fake)",
  exercises: [
    {
      id: "gan-1",
      title: "판별 로짓",
      prompt: "logit = w·x + b 를 구하세요.",
      inputs: [
        { label: "x", matrix: [[1, 2]] },
        { label: "w", matrix: [[1], [-1]] },
        { label: "b", matrix: [[0]] },
      ],
      expected: [[-1]],
      shapeHint: "내적 → 스칼라",
      formulaHint: "1·1 + 2·(-1) = -1",
    },
    {
      id: "gan-2",
      title: "Sigmoid",
      prompt: "σ(0)=0.5. σ(logit)을 소수 1자리로.",
      inputs: [{ label: "logit", matrix: [[0]] }],
      expected: [[0.5]],
      decimals: 1,
      shapeHint: "[1×1]",
      formulaHint: "σ(0)=1/(1+e⁰)=0.5",
    },
    {
      id: "gan-3",
      title: "가짜 샘플",
      prompt: "x_fake = z W_g",
      inputs: [
        { label: "z", matrix: [[1, 0]] },
        {
          label: "W_g",
          matrix: [
            [2, 1],
            [0, 1],
          ],
        },
      ],
      expected: [[2, 1]],
      shapeHint: "[1×2]@[2×2]",
      formulaHint: "[1,0]의 첫 행 → W_g 첫 행",
    },
    {
      id: "gan-4",
      title: "D(진짜) vs D(가짜) 로짓",
      prompt: "같은 w로 두 로짓을 한 행에. x_real=[2,0], x_fake=[0,2], w=[1,-1], b=0",
      inputs: [
        { label: "x_real", matrix: [[2, 0]] },
        { label: "x_fake", matrix: [[0, 2]] },
        { label: "w", matrix: [[1], [-1]] },
      ],
      expected: [[2, -2]],
      shapeHint: "[1×2] 로짓 쌍",
      formulaHint: "2·1+0=2, 0·1+2·(-1)=-2",
    },
    {
      id: "gan-5",
      title: "G 선형 한 번 더",
      prompt: "z=[0,1], W_g 동일. x_fake 구하세요.",
      inputs: [
        { label: "z", matrix: [[0, 1]] },
        {
          label: "W_g",
          matrix: [
            [2, 1],
            [0, 1],
          ],
        },
      ],
      expected: [[0, 1]],
      shapeHint: "[1×2]",
      formulaHint: "둘째 행 → [0,1]",
    },
  ],
};
