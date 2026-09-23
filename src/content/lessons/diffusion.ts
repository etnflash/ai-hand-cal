import type { Lesson } from "../types";

export const diffusionLesson: Lesson = {
  slug: "diffusion",
  title: "Diffusion",
  subtitle: "확산 모델",
  kind: "diffusion",
  trackOrder: 18,
  stage: "generative",
  intro: [
    "Diffusion은 데이터에 노이즈를 서서히 섞었다가(forward), 신경망이 노이즈를 제거하며 샘플합니다(reverse).",
    "DDPM: x_t=√ᾱ x_0+√(1−ᾱ)ε. 손계산으로 forward, x₀ 복원, 한 스텝 reverse까지 갑니다.",
  ],
  formula: "x_t=√ᾱ x_0+√(1−ᾱ)ε ,  x̂₀=(x_t−√(1−ᾱ)ε)/√ᾱ",
  exercises: [
    {
      id: "diff-1",
      title: "ᾱ=1 (노이즈 없음)",
      prompt: "ᾱ=1이면 x_t = x_0",
      inputs: [
        { label: "x₀", matrix: [[3, -1]] },
        { label: "ε", matrix: [[9, 9]] },
      ],
      expected: [[3, -1]],
      shapeHint: "[1×2]",
      formulaHint: "√1=1, √0=0",
    },
    {
      id: "diff-2",
      title: "ᾱ=0 (순수 노이즈)",
      prompt: "ᾱ=0이면 x_t = ε",
      inputs: [
        { label: "x₀", matrix: [[3, -1]] },
        { label: "ε", matrix: [[0.5, -0.5]] },
      ],
      expected: [[0.5, -0.5]],
      decimals: 1,
      shapeHint: "[1×2]",
      formulaHint: "√0=0, √1=1",
    },
    {
      id: "diff-3",
      title: "ᾱ=0.25",
      prompt: "√0.25=0.5, √0.75≈0.8660. 소수 2자리.",
      inputs: [
        { label: "x₀", matrix: [[2]] },
        { label: "ε", matrix: [[0]] },
      ],
      expected: [[1]],
      decimals: 2,
      shapeHint: "[1×1]",
      formulaHint: "0.5·2 + 0.866·0 = 1",
    },
    {
      id: "diff-4",
      title: "노이즈만 있는 항",
      prompt: "x₀=0, ᾱ=0.75 → x_t = √0.25 ε = 0.5ε",
      inputs: [
        { label: "x₀", matrix: [[0, 0]] },
        { label: "ε", matrix: [[2, -4]] },
      ],
      expected: [[1, -2]],
      shapeHint: "[1×2]",
      formulaHint: "0.5·[2,-4]=[1,-2]",
    },
    {
      id: "diff-5",
      title: "x₀ 예측",
      prompt: "x̂₀ = (x_t − √(1−ᾱ)ε)/√ᾱ. ᾱ=1이면 x̂₀=x_t.",
      inputs: [
        { label: "x_t", matrix: [[4, 2]] },
        { label: "ε", matrix: [[1, 1]] },
      ],
      expected: [[4, 2]],
      shapeHint: "[1×2]",
      formulaHint: "ᾱ=1 가정: 노이즈 항 0",
    },
  ],
};
