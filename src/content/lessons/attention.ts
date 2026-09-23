import type { Lesson } from "../types";

export const attentionLesson: Lesson = {
  slug: "attention",
  title: "Attention",
  subtitle: "Scaled Dot-Product",
  kind: "attention",
  trackOrder: 10,
  intro: [
    "앞에서 Softmax·위치 인코딩을 봤다면, 이제 Attention의 핵심 계산입니다.",
    "Scaled Dot-Product: scores = Q Kᵀ / √d_k → weights = softmax(scores) → output = weights V",
    "작은 숫자로 한 단계씩 손으로 채워 보세요. Softmax 칸은 소수 4자리까지 맞으면 됩니다.",
  ],
  stage: "attention",
  formula: "Attention(Q,K,V) = softmax(QKᵀ / √d_k) V",
  exercises: [
    {
      id: "att-1",
      title: "Score 행렬 (d_k = 1)",
      prompt: "scores = Q Kᵀ / √d_k 를 채우세요. d_k = 1 이므로 나누기는 그대로입니다.",
      inputs: [
        {
          label: "Q",
          matrix: [
            [1],
            [0],
          ],
        },
        {
          label: "K",
          matrix: [
            [2],
            [1],
          ],
        },
      ],
      expected: [
        [2, 1],
        [0, 0],
      ],
      shapeHint: "Q [2×1], Kᵀ [1×2] → scores [2×2]",
      formulaHint: "Kᵀ = [[2, 1]]. 첫 행: 1·[2,1] = [2,1]. 둘째 행: 0·[2,1] = [0,0].",
    },
    {
      id: "att-2",
      title: "Attention weights",
      prompt: "주어진 score 각 행에 Softmax를 적용하세요. (소수 4자리)",
      inputs: [
        {
          label: "scores",
          matrix: [
            [1, 1],
            [0, 0],
          ],
        },
      ],
      expected: [
        [0.5, 0.5],
        [0.5, 0.5],
      ],
      decimals: 4,
      shapeHint: "[2×2] → [2×2], 각 행 합 = 1",
      formulaHint: "같은 값끼리 Softmax하면 균등 0.5입니다.",
    },
    {
      id: "att-3",
      title: "Weighted sum",
      prompt: "output = weights @ V 를 계산하세요.",
      inputs: [
        {
          label: "weights",
          matrix: [
            [0.5, 0.5],
            [1, 0],
          ],
        },
        {
          label: "V",
          matrix: [
            [2, 0],
            [4, 2],
          ],
        },
      ],
      expected: [
        [3, 1],
        [2, 0],
      ],
      shapeHint: "weights [2×2] @ V [2×2] → [2×2]",
      formulaHint: "첫 행: 0.5·[2,0] + 0.5·[4,2] = [3,1]. 둘째 행: 1·[2,0] + 0·… = [2,0].",
    },
    {
      id: "att-4",
      title: "스케일 √d_k",
      prompt: "d_k = 4 이므로 √4 = 2로 나눕니다. scores = QKᵀ / 2 를 채우세요.",
      inputs: [
        {
          label: "Q",
          matrix: [
            [2, 0],
            [0, 2],
          ],
        },
        {
          label: "K",
          matrix: [
            [2, 0],
            [0, 2],
          ],
        },
      ],
      expected: [
        [2, 0],
        [0, 2],
      ],
      shapeHint: "Q [2×2] @ Kᵀ [2×2] → [2×2], 그다음 / 2",
      formulaHint: "QKᵀ = [[4,0],[0,4]], 나누기 2 → [[2,0],[0,2]]",
    },
    {
      id: "att-5",
      title: "한 토큰이 자기에게 집중",
      prompt: "이미 Softmax된 weights와 V로 output을 구하세요.",
      inputs: [
        {
          label: "weights",
          matrix: [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
          ],
        },
        {
          label: "V",
          matrix: [
            [1, 2],
            [3, 4],
            [5, 6],
          ],
        },
      ],
      expected: [
        [1, 2],
        [3, 4],
        [5, 6],
      ],
      shapeHint: "weights [3×3] @ V [3×2] → [3×2]",
      formulaHint: "단위행렬 weights면 output = V 그대로입니다.",
    },
  ],
};
