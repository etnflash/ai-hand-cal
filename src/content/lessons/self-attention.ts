import type { Lesson } from "../types";

export const selfAttentionLesson: Lesson = {
  slug: "self-attention",
  title: "Self-Attention",
  subtitle: "X → Q, K, V → Output",
  kind: "self-attention",
  trackOrder: 11,
  stage: "attention",
  intro: [
    "Self-Attention에서는 같은 입력 X(이미 PE가 더해진 임베딩이라고 생각해도 됨)에 W_Q, W_K, W_V를 곱해 Q, K, V를 만듭니다.",
    "그다음 일반 Attention과 동일: softmax(QKᵀ/√d) V",
    "토큰 수 T=3, 차원 d=2 정도의 작은 예로 Transformer의 핵심을 손으로 관통합니다.",
  ],
  formula: "Q=XW_Q, K=XW_K, V=XW_V,  Out=Attention(Q,K,V)",
  exercises: [
    {
      id: "sa-1",
      title: "Q 투영",
      prompt: "Q = X W_Q 를 채우세요.",
      inputs: [
        {
          label: "X",
          matrix: [
            [1, 0],
            [0, 1],
            [1, 1],
          ],
        },
        {
          label: "W_Q",
          matrix: [
            [1, 0],
            [0, 1],
          ],
        },
      ],
      expected: [
        [1, 0],
        [0, 1],
        [1, 1],
      ],
      shapeHint: "X [3×2] @ W_Q [2×2] → Q [3×2]",
      formulaHint: "W_Q가 단위행렬이면 Q = X입니다.",
    },
    {
      id: "sa-2",
      title: "K 투영",
      prompt: "K = X W_K 를 채우세요.",
      inputs: [
        {
          label: "X",
          matrix: [
            [1, 0],
            [0, 1],
            [1, 1],
          ],
        },
        {
          label: "W_K",
          matrix: [
            [2, 0],
            [0, 2],
          ],
        },
      ],
      expected: [
        [2, 0],
        [0, 2],
        [2, 2],
      ],
      shapeHint: "X [3×2] @ W_K [2×2] → K [3×2]",
      formulaHint: "W_K = 2I 이므로 각 행이 2배가 됩니다.",
    },
    {
      id: "sa-3",
      title: "V 투영",
      prompt: "V = X W_V 를 채우세요.",
      inputs: [
        {
          label: "X",
          matrix: [
            [1, 0],
            [0, 1],
            [1, 1],
          ],
        },
        {
          label: "W_V",
          matrix: [
            [1, 1],
            [0, 1],
          ],
        },
      ],
      expected: [
        [1, 1],
        [0, 1],
        [1, 2],
      ],
      shapeHint: "X [3×2] @ W_V [2×2] → V [3×2]",
      formulaHint: "첫 행: [1,0]·W_V = [1,1]. 둘째: [0,1]·W_V = [0,1]. 셋째: [1,1]·W_V = [1,2].",
    },
    {
      id: "sa-4",
      title: "Scores (단위 Q,K)",
      prompt: "Q=K=X(아래), d_k=2, scores = QKᵀ/√2 입니다. √2≈1.4142. 소수 2자리로 채우세요.",
      inputs: [
        {
          label: "Q (=K)",
          matrix: [
            [1, 0],
            [0, 1],
          ],
        },
      ],
      expected: [
        [0.71, 0],
        [0, 0.71],
      ],
      decimals: 2,
      shapeHint: "Q [2×2] @ Kᵀ [2×2] → [2×2], 그다음 / √2",
      formulaHint: "QKᵀ = I. 각 대각 1/√2 ≈ 0.71, 나머지는 0.",
    },
    {
      id: "sa-5",
      title: "End-to-end output",
      prompt:
        "Q=K=V=X이고 weights가 이미 Softmax된 상태일 때 output = weights @ V 를 구하세요.",
      inputs: [
        {
          label: "weights",
          matrix: [
            [0.5, 0.5],
            [0.5, 0.5],
          ],
        },
        {
          label: "V (=X)",
          matrix: [
            [2, 0],
            [0, 4],
          ],
        },
      ],
      expected: [
        [1, 2],
        [1, 2],
      ],
      shapeHint: "[2×2] @ [2×2] → [2×2]",
      formulaHint: "각 행이 V의 행 평균: 0.5·[2,0]+0.5·[0,4] = [1,2]",
    },
  ],
};
