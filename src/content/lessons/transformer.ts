import type { Lesson } from "../types";

export const transformerLesson: Lesson = {
  slug: "transformer",
  title: "Transformer 블록",
  subtitle: "Residual + FFN",
  kind: "transformer",
  trackOrder: 13,
  stage: "block",
  intro: [
    "이제 조각을 조립합니다: Self-Attention → Residual → (LayerNorm) → FFN → Residual.",
    "여기선 작은 숫자로 residual과 2층 FFN(ReLU)을 손으로 관통합니다. LN은 이전 레슨에서 이미 연습했습니다.",
  ],
  formula: "x' = x + Attn(x),   y = x' + W₂ · ReLU(x' W₁)",
  exercises: [
    {
      id: "tf-1",
      title: "Residual 연결",
      prompt: "x + attn_out 을 채우세요.",
      inputs: [
        {
          label: "x",
          matrix: [
            [1, 2],
            [0, 1],
          ],
        },
        {
          label: "attn_out",
          matrix: [
            [0, 1],
            [2, 0],
          ],
        },
      ],
      expected: [
        [1, 3],
        [2, 1],
      ],
      shapeHint: "같은 shape끼리 원소별 합 → [2×2]",
      formulaHint: "칸마다 더하면 됩니다: (1,2)+(0,1)=(1,3)",
    },
    {
      id: "tf-2",
      title: "FFN 첫 층",
      prompt: "h = x' W₁ 을 계산하세요.",
      inputs: [
        { label: "x'", matrix: [[1, 1]] },
        {
          label: "W₁",
          matrix: [
            [2, 0, 1],
            [0, 2, -1],
          ],
        },
      ],
      expected: [[2, 2, 0]],
      shapeHint: "[1×2] @ [2×3] → [1×3]",
      formulaHint: "[1,1]·열들 → [2, 2, 0]",
    },
    {
      id: "tf-3",
      title: "ReLU",
      prompt: "음수를 0으로 바꾸세요.",
      inputs: [{ label: "h", matrix: [[2, -3, 0, 4]] }],
      expected: [[2, 0, 0, 4]],
      shapeHint: "shape 유지 [1×4]",
      formulaHint: "ReLU(z)=max(0,z)",
    },
    {
      id: "tf-4",
      title: "FFN 둘째 층",
      prompt: "ReLU(h) @ W₂ 를 구하세요.",
      inputs: [
        { label: "ReLU(h)", matrix: [[2, 0, 1]] },
        {
          label: "W₂",
          matrix: [
            [1, 0],
            [0, 1],
            [1, 1],
          ],
        },
      ],
      expected: [[3, 1]],
      shapeHint: "[1×3] @ [3×2] → [1×2]",
      formulaHint: "2·[1,0] + 0 + 1·[1,1] = [3,1]",
    },
    {
      id: "tf-5",
      title: "FFN residual",
      prompt: "최종 y = x' + ffn_out 을 채우세요.",
      inputs: [
        { label: "x'", matrix: [[1, 2]] },
        { label: "ffn_out", matrix: [[3, 1]] },
      ],
      expected: [[4, 3]],
      shapeHint: "[1×2] + [1×2]",
      formulaHint: "[1,2]+[3,1]=[4,3]",
    },
    {
      id: "tf-6",
      title: "미니 블록 end-to-end",
      prompt:
        "이미 attn residual까지 끝난 x'와 ffn_out이 주어졌습니다. y를 구하세요.",
      inputs: [
        {
          label: "x'",
          matrix: [
            [1, 0],
            [0, 1],
          ],
        },
        {
          label: "ffn_out",
          matrix: [
            [1, 1],
            [2, 0],
          ],
        },
      ],
      expected: [
        [2, 1],
        [2, 1],
      ],
      shapeHint: "[2×2] + [2×2]",
      formulaHint: "원소별 합",
    },
  ],
};
