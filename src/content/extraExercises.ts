import type { Difficulty, Exercise } from "./types";
import {
  attention,
  bceLoss,
  conv2dValid,
  diffuseForward,
  diffuseReverseStep,
  discriminatorScore,
  klDiag,
  klSum,
  layerNormRows,
  linear,
  logAbsDetDiag,
  loraLinear,
  matmul,
  messageAggregate,
  predictX0,
  realNvpCouple,
  reparameterize,
  relu,
  roundMatrix,
  scaleShiftMatrix,
  softmaxRows,
} from "@/engine";

/**
 * Extra medium/hard drills merged into each lesson.
 * Focus: larger shapes, negatives, multi-step, chained concepts.
 */
export const EXTRA_EXERCISES: Record<string, Exercise[]> = {
  matmul: [
    {
      id: "mm-m1",
      difficulty: "medium",
      title: "3×3 체인 준비",
      prompt: "음수·0이 섞인 3×2 @ 2×3 을 계산하세요.",
      inputs: [
        {
          label: "A",
          matrix: [
            [2, -1],
            [0, 3],
            [-2, 1],
          ],
        },
        {
          label: "B",
          matrix: [
            [1, 0, -1],
            [2, 1, 0],
          ],
        },
      ],
      expected: matmul(
        [
          [2, -1],
          [0, 3],
          [-2, 1],
        ],
        [
          [1, 0, -1],
          [2, 1, 0],
        ],
      ),
      shapeHint: "[3×2]@[2×3]→[3×3]",
      formulaHint: "각 C[i][j]는 길이 2 내적",
    },
    {
      id: "mm-h1",
      difficulty: "hard",
      title: "결합법칙 검증",
      prompt: "(AB)C 결과만 채우세요. A,B,C가 주어집니다.",
      inputs: [
        {
          label: "A",
          matrix: [
            [1, 2],
            [0, 1],
          ],
        },
        {
          label: "B",
          matrix: [
            [2, 0],
            [1, 1],
          ],
        },
        {
          label: "C",
          matrix: [
            [1, -1],
            [0, 2],
          ],
        },
      ],
      expected: matmul(
        matmul(
          [
            [1, 2],
            [0, 1],
          ],
          [
            [2, 0],
            [1, 1],
          ],
        ),
        [
          [1, -1],
          [0, 2],
        ],
      ),
      shapeHint: "먼저 AB=[4,2;1,1], 그다음 @C",
      formulaHint: "AB=[[4,2],[1,1]], (AB)C=[[4,0],[1,1]]",
    },
    {
      id: "mm-h2",
      difficulty: "hard",
      title: "4×3 @ 3×2",
      prompt: "큰 shape. 한 칸씩 차분히.",
      inputs: [
        {
          label: "A",
          matrix: [
            [1, 0, 2],
            [-1, 1, 0],
            [0, 2, 1],
            [2, -1, 1],
          ],
        },
        {
          label: "B",
          matrix: [
            [1, 2],
            [0, -1],
            [1, 0],
          ],
        },
      ],
      expected: matmul(
        [
          [1, 0, 2],
          [-1, 1, 0],
          [0, 2, 1],
          [2, -1, 1],
        ],
        [
          [1, 2],
          [0, -1],
          [1, 0],
        ],
      ),
      shapeHint: "[4×3]@[3×2]→[4×2]",
      formulaHint: "안쪽 차원 3",
    },
  ],

  linear: [
    {
      id: "lin-m1",
      difficulty: "medium",
      title: "배치 3 × out 3",
      prompt: "y=xW+b, 배치 3.",
      inputs: [
        {
          label: "x",
          matrix: [
            [1, 0],
            [0, 1],
            [1, 1],
          ],
        },
        {
          label: "W",
          matrix: [
            [1, 2, 0],
            [-1, 0, 1],
          ],
        },
        { label: "b", matrix: [[1, 0, -1]] },
      ],
      expected: linear(
        [
          [1, 0],
          [0, 1],
          [1, 1],
        ],
        [
          [1, 2, 0],
          [-1, 0, 1],
        ],
        [1, 0, -1],
      ),
      shapeHint: "[3×2]@[2×3]+b",
      formulaHint: "각 행에 같은 b",
    },
    {
      id: "lin-h1",
      difficulty: "hard",
      title: "두 선형 합성",
      prompt: "y = (xW1)W2 + b2 (b1=0). 최종 y만.",
      inputs: [
        { label: "x", matrix: [[2, 1]] },
        {
          label: "W1",
          matrix: [
            [1, 0, 1],
            [0, 1, 1],
          ],
        },
        {
          label: "W2",
          matrix: [
            [1, -1],
            [0, 2],
            [1, 0],
          ],
        },
        { label: "b2", matrix: [[0, 1]] },
      ],
      expected: (() => {
        const h = matmul(
          [[2, 1]],
          [
            [1, 0, 1],
            [0, 1, 1],
          ],
        );
        return linear(
          h,
          [
            [1, -1],
            [0, 2],
            [1, 0],
          ],
          [0, 1],
        );
      })(),
      shapeHint: "x→[1×3]→[1×2]",
      formulaHint: "xW1=[2,1,3], @W2+[0,1]=[5,1]",
    },
  ],

  mlp: [
    {
      id: "mlp-m1",
      difficulty: "medium",
      title: "음수 통과 ReLU",
      prompt: "z=xW 후 ReLU. W에 음수 포함.",
      inputs: [
        { label: "x", matrix: [[1, -2, 1]] },
        {
          label: "W",
          matrix: [
            [1, 0],
            [1, 1],
            [-1, 2],
          ],
        },
      ],
      expected: relu(
        matmul(
          [[1, -2, 1]],
          [
            [1, 0],
            [1, 1],
            [-1, 2],
          ],
        ),
      ),
      shapeHint: "[1×3]@[3×2]→ReLU",
      formulaHint: "먼저 matmul, 그다음 max(0,·)",
    },
    {
      id: "mlp-h1",
      difficulty: "hard",
      title: "2층 end-to-end",
      prompt: "h=ReLU(xW1), y=hW2. 최종 y.",
      inputs: [
        { label: "x", matrix: [[1, 1]] },
        {
          label: "W1",
          matrix: [
            [1, -2, 0],
            [0, 1, 2],
          ],
        },
        {
          label: "W2",
          matrix: [
            [1],
            [1],
            [-1],
          ],
        },
      ],
      expected: (() => {
        const h = relu(
          matmul(
            [[1, 1]],
            [
              [1, -2, 0],
              [0, 1, 2],
            ],
          ),
        );
        return matmul(h, [[1], [1], [-1]]);
      })(),
      shapeHint: "숨은층 3 → 출력 1",
      formulaHint: "xW1=[1,-1,2]→ReLU[1,0,2], ·W2=1+0-2=-1",
    },
  ],

  softmax: [
    {
      id: "sm-m1",
      difficulty: "medium",
      title: "큰 로짓 안정화",
      prompt: "max를 빼는 이유 체감. 소수 4자리.",
      inputs: [{ label: "z", matrix: [[10, 10, 12]] }],
      expected: roundMatrix(softmaxRows([[10, 10, 12]]), 4),
      decimals: 4,
      shapeHint: "[1×3]",
      formulaHint: "max=12 → [-2,-2,0] 후 exp",
    },
    {
      id: "sm-h1",
      difficulty: "hard",
      title: "3행 Softmax",
      prompt: "행마다 독립 Softmax. 소수 4자리.",
      inputs: [
        {
          label: "Z",
          matrix: [
            [0, 0, 0],
            [1, 2, 3],
            [5, 0, 0],
          ],
        },
      ],
      expected: roundMatrix(
        softmaxRows([
          [0, 0, 0],
          [1, 2, 3],
          [5, 0, 0],
        ]),
        4,
      ),
      decimals: 4,
      shapeHint: "[3×3], 각 행 합=1",
      formulaHint: "행1 균등, 행3은 첫 칸이 지배",
    },
  ],

  cnn: [
    {
      id: "cnn-m1",
      difficulty: "medium",
      title: "4×4 * 3×3",
      prompt: "valid conv. 출력 2×2.",
      inputs: [
        {
          label: "X",
          matrix: [
            [1, 0, 0, 1],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [1, 0, 0, 1],
          ],
        },
        {
          label: "K",
          matrix: [
            [1, 0, 1],
            [0, 1, 0],
            [1, 0, 1],
          ],
        },
      ],
      expected: conv2dValid(
        [
          [1, 0, 0, 1],
          [0, 1, 1, 0],
          [0, 1, 1, 0],
          [1, 0, 0, 1],
        ],
        [
          [1, 0, 1],
          [0, 1, 0],
          [1, 0, 1],
        ],
      ),
      shapeHint: "[4×4]*[3×3]→[2×2]",
      formulaHint: "윈도우마다 9항 합",
    },
    {
      id: "cnn-h1",
      difficulty: "hard",
      title: "두 번 합성곱",
      prompt: "X*K1 결과를 이미 계산한 Y로 두고, Y*K2 를 채우세요.",
      inputs: [
        {
          label: "Y (=X*K1)",
          matrix: [
            [2, 3],
            [5, 5],
          ],
        },
        {
          label: "K2",
          matrix: [
            [1, -1],
            [0, 1],
          ],
        },
      ],
      expected: conv2dValid(
        [
          [2, 3],
          [5, 5],
        ],
        [
          [1, -1],
          [0, 1],
        ],
      ),
      shapeHint: "[2×2]*[2×2]→[1×1]",
      formulaHint: "2·1+3·(-1)+5·0+5·1=4",
    },
  ],

  lstm: [
    {
      id: "lstm-m1",
      difficulty: "medium",
      title: "길이 3 셀",
      prompt: "c'=f⊙c+i⊙g , 3차원",
      inputs: [
        { label: "f", matrix: [[0.5, 1, 0]] },
        { label: "c", matrix: [[2, 2, 8]] },
        { label: "i", matrix: [[0.5, 0, 1]] },
        { label: "g", matrix: [[4, 9, 1]] },
      ],
      expected: [[3, 2, 1]],
      shapeHint: "[1×3]",
      formulaHint: "0.5·2+0.5·4=3, 1·2+0=2, 0+1·1=1",
    },
    {
      id: "lstm-h1",
      difficulty: "hard",
      title: "두 스텝 셀",
      prompt: "c0에서 c1, 같은 게이트로 한 번 더 → c2만 답.",
      inputs: [
        { label: "f", matrix: [[0.5]] },
        { label: "i", matrix: [[0.5]] },
        { label: "g", matrix: [[2]] },
        { label: "c0", matrix: [[0]] },
      ],
      expected: [[1.5]],
      decimals: 1,
      shapeHint: "c1=1, c2=0.5·1+0.5·2=1.5",
      formulaHint: "동일 게이트로 2스텝",
    },
  ],

  gnn: [
    {
      id: "gnn-m1",
      difficulty: "medium",
      title: "feature dim 2",
      prompt: "A@X , X가 2차원 feature",
      inputs: [
        {
          label: "A",
          matrix: [
            [0, 1, 1],
            [1, 0, 1],
            [1, 1, 0],
          ],
        },
        {
          label: "X",
          matrix: [
            [1, 0],
            [0, 1],
            [1, 1],
          ],
        },
      ],
      expected: messageAggregate(
        [
          [0, 1, 1],
          [1, 0, 1],
          [1, 1, 0],
        ],
        [
          [1, 0],
          [0, 1],
          [1, 1],
        ],
      ),
      shapeHint: "[3×3]@[3×2]→[3×2]",
      formulaHint: "노드0: 행1+행2 = [1,2]",
    },
    {
      id: "gnn-h1",
      difficulty: "hard",
      title: "ÂXW 풀스택",
      prompt: "H=ÂXW 최종.",
      inputs: [
        {
          label: "Â",
          matrix: [
            [0.5, 0.5],
            [0.5, 0.5],
          ],
        },
        {
          label: "X",
          matrix: [
            [2, 0],
            [0, 4],
          ],
        },
        {
          label: "W",
          matrix: [
            [1, 1],
            [0, 1],
          ],
        },
      ],
      expected: matmul(
        matmul(
          [
            [0.5, 0.5],
            [0.5, 0.5],
          ],
          [
            [2, 0],
            [0, 4],
          ],
        ),
        [
          [1, 1],
          [0, 1],
        ],
      ),
      shapeHint: "먼저 ÂX=[1,2;1,2], 그다음 @W",
      formulaHint: "ÂX 각 행 [1,2], @W → [1,3]",
    },
  ],

  layernorm: [
    {
      id: "ln-m1",
      difficulty: "medium",
      title: "4차원 벡터",
      prompt: "γ=1,β=0. 소수 2자리.",
      inputs: [{ label: "x", matrix: [[1, 3, 5, 7]] }],
      expected: roundMatrix(layerNormRows([[1, 3, 5, 7]]), 2),
      decimals: 2,
      shapeHint: "[1×4]",
      formulaHint: "μ=4, 편차 -3,-1,1,3",
    },
    {
      id: "ln-h1",
      difficulty: "hard",
      title: "배치 3 + γβ",
      prompt: "각 행 LN 후 γ=[2,2], β=[0,1] (모든 행 동일).",
      inputs: [
        {
          label: "X",
          matrix: [
            [1, 3],
            [2, 2],
            [0, 4],
          ],
        },
        { label: "γ", matrix: [[2, 2]] },
        { label: "β", matrix: [[0, 1]] },
      ],
      expected: (() => {
        const ln = layerNormRows([
          [1, 3],
          [2, 2],
          [0, 4],
        ]);
        return ln.map((row) => [row[0] * 2 + 0, row[1] * 2 + 1]);
      })(),
      decimals: 2,
      shapeHint: "[3×2]",
      formulaHint: "행1 LN=[-1,1]→[-2,3], 행2=0→[0,1]",
    },
  ],

  positional: [
    {
      id: "pe-m1",
      difficulty: "medium",
      title: "3토큰 더하기",
      prompt: "X+PE, 소수 포함.",
      inputs: [
        {
          label: "X",
          matrix: [
            [0.5, 0.5],
            [1, 0],
            [0, 1],
          ],
        },
        {
          label: "PE",
          matrix: [
            [0, 1],
            [0.8415, 0.5403],
            [0.9093, -0.4161],
          ],
        },
      ],
      expected: [
        [0.5, 1.5],
        [1.8415, 0.5403],
        [0.9093, 0.5839],
      ],
      decimals: 4,
      shapeHint: "[3×2]",
      formulaHint: "원소별 합. pos2의 cos(2)≈-0.4161",
    },
    {
      id: "pe-h1",
      difficulty: "hard",
      title: "d=4 자리 표시",
      prompt: "pos=0, d=4 PE=[sin0,cos0,sin0,cos0]=[0,1,0,1]",
      inputs: [{ label: "pos", matrix: [[0]] }],
      expected: [[0, 1, 0, 1]],
      shapeHint: "[1×4]",
      formulaHint: "모든 angle=0",
    },
  ],

  attention: [
    {
      id: "att-m1",
      difficulty: "medium",
      title: "T=3,d=2 scores",
      prompt: "QKᵀ/√2 . √2≈1.4142, 소수 2자리.",
      inputs: [
        {
          label: "Q",
          matrix: [
            [1, 0],
            [0, 1],
            [1, 1],
          ],
        },
        {
          label: "K",
          matrix: [
            [1, 0],
            [0, 1],
            [1, 1],
          ],
        },
      ],
      expected: roundMatrix(
        attention(
          [
            [1, 0],
            [0, 1],
            [1, 1],
          ],
          [
            [1, 0],
            [0, 1],
            [1, 1],
          ],
          [
            [1, 0],
            [0, 1],
            [1, 1],
          ],
        ).scores,
        2,
      ),
      decimals: 2,
      shapeHint: "[3×3] scores",
      formulaHint: "QKᵀ 후 /√2",
    },
    {
      id: "att-h1",
      difficulty: "hard",
      title: "풀 Attention output",
      prompt: "Attention(Q,K,V)의 output. 소수 2자리.",
      inputs: [
        {
          label: "Q",
          matrix: [
            [1, 0],
            [0, 1],
          ],
        },
        {
          label: "K",
          matrix: [
            [1, 0],
            [0, 1],
          ],
        },
        {
          label: "V",
          matrix: [
            [1, 2],
            [3, 4],
          ],
        },
      ],
      expected: roundMatrix(
        attention(
          [
            [1, 0],
            [0, 1],
          ],
          [
            [1, 0],
            [0, 1],
          ],
          [
            [1, 2],
            [3, 4],
          ],
        ).output,
        2,
      ),
      decimals: 2,
      shapeHint: "[2×2]",
      formulaHint: "scores=I/√2 후 softmax, @V",
    },
  ],

  "self-attention": [
    {
      id: "sa-m1",
      difficulty: "medium",
      title: "비단위 W_Q",
      prompt: "Q=XW_Q , W_Q가 대각이 아님.",
      inputs: [
        {
          label: "X",
          matrix: [
            [1, 2],
            [0, 1],
            [1, 0],
          ],
        },
        {
          label: "W_Q",
          matrix: [
            [1, 1],
            [0, 1],
          ],
        },
      ],
      expected: matmul(
        [
          [1, 2],
          [0, 1],
          [1, 0],
        ],
        [
          [1, 1],
          [0, 1],
        ],
      ),
      shapeHint: "[3×2]@[2×2]",
      formulaHint: "행1: [1,3]",
    },
    {
      id: "sa-h1",
      difficulty: "hard",
      title: "Q,K,V 모두 구한 뒤 scores",
      prompt: "Wq=Wk=Wv=I, scores=QKᵀ/√2 (소수 2자리). X 3×2.",
      inputs: [
        {
          label: "X",
          matrix: [
            [1, 0],
            [0, 1],
            [1, 1],
          ],
        },
      ],
      expected: roundMatrix(
        attention(
          [
            [1, 0],
            [0, 1],
            [1, 1],
          ],
          [
            [1, 0],
            [0, 1],
            [1, 1],
          ],
          [
            [1, 0],
            [0, 1],
            [1, 1],
          ],
        ).scores,
        2,
      ),
      decimals: 2,
      shapeHint: "[3×3]",
      formulaHint: "Q=K=X",
    },
  ],

  kvcache: [
    {
      id: "kv-m1",
      difficulty: "medium",
      title: "긴 캐시 concat",
      prompt: "past 4행 + new 2행.",
      inputs: [
        {
          label: "K_past",
          matrix: [
            [1, 0],
            [0, 1],
            [1, 1],
            [2, 0],
          ],
        },
        {
          label: "k_new",
          matrix: [
            [0, 2],
            [1, 2],
          ],
        },
      ],
      expected: [
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 0],
        [0, 2],
        [1, 2],
      ],
      shapeHint: "[6×2]",
      formulaHint: "행 이어붙이기",
    },
    {
      id: "kv-h1",
      difficulty: "hard",
      title: "새 2토큰 scores",
      prompt: "Q_new[2×2] @ Kᵀ[2×5] — K는 캐시 5토큰. scale 없이.",
      inputs: [
        {
          label: "Q_new",
          matrix: [
            [1, 0],
            [0, 1],
          ],
        },
        {
          label: "K",
          matrix: [
            [1, 0],
            [0, 1],
            [1, 0],
            [0, 1],
            [1, 1],
          ],
        },
      ],
      expected: matmul(
        [
          [1, 0],
          [0, 1],
        ],
        [
          [1, 0, 1, 0, 1],
          [0, 1, 0, 1, 1],
        ],
      ),
      shapeHint: "[2×5]",
      formulaHint: "Kᵀ를 먼저 그려보세요",
    },
  ],

  transformer: [
    {
      id: "tf-m1",
      difficulty: "medium",
      title: "배치 residual",
      prompt: "3토큰 residual.",
      inputs: [
        {
          label: "x",
          matrix: [
            [1, 0],
            [0, 1],
            [1, 1],
          ],
        },
        {
          label: "attn",
          matrix: [
            [0, 1],
            [1, 0],
            [-1, 1],
          ],
        },
      ],
      expected: [
        [1, 1],
        [1, 1],
        [0, 2],
      ],
      shapeHint: "[3×2]",
      formulaHint: "원소별 합",
    },
    {
      id: "tf-h1",
      difficulty: "hard",
      title: "FFN 풀스택",
      prompt: "y = x + W2·ReLU(xW1). 최종 y.",
      inputs: [
        { label: "x", matrix: [[1, -1]] },
        {
          label: "W1",
          matrix: [
            [1, 1, 0],
            [0, 1, 1],
          ],
        },
        {
          label: "W2",
          matrix: [
            [1, 0],
            [0, 1],
            [1, 1],
          ],
        },
      ],
      expected: (() => {
        const h = relu(
          matmul(
            [[1, -1]],
            [
              [1, 1, 0],
              [0, 1, 1],
            ],
          ),
        );
        const ffn = matmul(h, [
          [1, 0],
          [0, 1],
          [1, 1],
        ]);
        return [[1 + ffn[0][0], -1 + ffn[0][1]]];
      })(),
      shapeHint: "residual 포함 [1×2]",
      formulaHint: "xW1=[1,0,-1]→ReLU[1,0,0], W2→[1,0], +x→[2,-1]",
    },
  ],

  lora: [
    {
      id: "lora-m1",
      difficulty: "medium",
      title: "랭크 2 ΔW",
      prompt: "A[2×2]@B[2×2] = ΔW",
      inputs: [
        {
          label: "A",
          matrix: [
            [1, 0],
            [0, 2],
          ],
        },
        {
          label: "B",
          matrix: [
            [1, 1],
            [0, 1],
          ],
        },
      ],
      expected: matmul(
        [
          [1, 0],
          [0, 2],
        ],
        [
          [1, 1],
          [0, 1],
        ],
      ),
      shapeHint: "[2×2]",
      formulaHint: "ΔW=[[1,1],[0,2]]",
    },
    {
      id: "lora-h1",
      difficulty: "hard",
      title: "배치 + scale 0.5",
      prompt: "y=xW+0.5·xAB",
      inputs: [
        {
          label: "x",
          matrix: [
            [1, 0],
            [2, 1],
          ],
        },
        {
          label: "W",
          matrix: [
            [1, 0],
            [0, 1],
          ],
        },
        {
          label: "A",
          matrix: [
            [2],
            [0],
          ],
        },
        { label: "B", matrix: [[1, 1]] },
      ],
      expected: loraLinear(
        [
          [1, 0],
          [2, 1],
        ],
        [
          [1, 0],
          [0, 1],
        ],
        [[2], [0]],
        [[1, 1]],
        0.5,
      ),
      shapeHint: "[2×2]",
      formulaHint: "행1: [1,0]+0.5·[2,2]=[2,1]",
    },
  ],

  gan: [
    {
      id: "gan-m1",
      difficulty: "medium",
      title: "배치 판별 로짓",
      prompt: "각 행 x·w (b=0). w=[1,-2]",
      inputs: [
        {
          label: "X",
          matrix: [
            [1, 0],
            [0, 1],
            [2, 1],
          ],
        },
        { label: "w", matrix: [[1], [-2]] },
      ],
      expected: matmul(
        [
          [1, 0],
          [0, 1],
          [2, 1],
        ],
        [[1], [-2]],
      ),
      shapeHint: "[3×1]",
      formulaHint: "1, -2, 0",
    },
    {
      id: "gan-m2",
      difficulty: "medium",
      title: "D 확률",
      prompt: "D=σ(w·x+b). w=[0,0], b=0 → 0.5",
      inputs: [
        { label: "x", matrix: [[3, -9]] },
        { label: "w", matrix: [[0], [0]] },
        { label: "b", matrix: [[0]] },
      ],
      expected: [[0.5]],
      decimals: 1,
      shapeHint: "스칼라",
      formulaHint: "logit=0 → σ=0.5",
    },
    {
      id: "gan-h1",
      difficulty: "hard",
      title: "G 후 D 로짓",
      prompt: "x=zWg 후 logit=x·w. 최종 로짓만.",
      inputs: [
        { label: "z", matrix: [[1, 1]] },
        {
          label: "Wg",
          matrix: [
            [1, 0],
            [0, 2],
          ],
        },
        { label: "w", matrix: [[1], [1]] },
      ],
      expected: (() => {
        const x = matmul(
          [[1, 1]],
          [
            [1, 0],
            [0, 2],
          ],
        );
        return matmul(x, [[1], [1]]);
      })(),
      shapeHint: "스칼라",
      formulaHint: "x=[1,2], logit=3",
    },
    {
      id: "gan-h2",
      difficulty: "hard",
      title: "판별 BCE (진짜)",
      prompt: "p=D(x)=0.5, y=1 → BCE=−log p ≈ 0.69",
      inputs: [{ label: "p", matrix: [[0.5]] }],
      expected: [[Math.round(bceLoss(0.5, 1) * 100) / 100]],
      decimals: 2,
      shapeHint: "스칼라",
      formulaHint: "−ln(0.5)=ln2≈0.69",
    },
    {
      id: "gan-h3",
      difficulty: "hard",
      title: "생성기 fool loss",
      prompt: "D(G(z))=0.25 → −log D ≈ 1.39 (G가 D를 속이려는 항)",
      inputs: [{ label: "D_fake", matrix: [[0.25]] }],
      expected: [[Math.round(bceLoss(0.25, 1) * 100) / 100]],
      decimals: 2,
      shapeHint: "스칼라",
      formulaHint: "−ln(0.25)=ln4≈1.39",
    },
    {
      id: "gan-h4",
      difficulty: "hard",
      title: "점수→확률→BCE",
      prompt: "logit=0 → D=0.5, 가짜 라벨 y=0의 BCE",
      inputs: [
        { label: "x", matrix: [[1, 1]] },
        { label: "w", matrix: [[0], [0]] },
        { label: "b", matrix: [[0]] },
      ],
      expected: [
        [
          Math.round(
            bceLoss(discriminatorScore([1, 1], [0, 0], 0), 0) * 100,
          ) / 100,
        ],
      ],
      decimals: 2,
      shapeHint: "스칼라",
      formulaHint: "−ln(1−0.5)=0.69",
    },
  ],

  vae: [
    {
      id: "vae-m1",
      difficulty: "medium",
      title: "latent dim 3",
      prompt: "z=μ+σ⊙ε",
      inputs: [
        { label: "μ", matrix: [[0, 1, -1]] },
        { label: "σ", matrix: [[2, 0.5, 1]] },
        { label: "ε", matrix: [[0.5, 2, 0]] },
      ],
      expected: reparameterize(
        [[0, 1, -1]],
        [[2, 0.5, 1]],
        [[0.5, 2, 0]],
      ),
      shapeHint: "[1×3]",
      formulaHint: "[1, 2, -1]",
    },
    {
      id: "vae-m2",
      difficulty: "medium",
      title: "KL (표준 정규)",
      prompt: "μ=0, logσ²=0 → KL 차원별 0",
      inputs: [
        { label: "μ", matrix: [[0, 0]] },
        { label: "logσ²", matrix: [[0, 0]] },
      ],
      expected: [klDiag([0, 0], [0, 0])],
      decimals: 2,
      shapeHint: "[1×2]",
      formulaHint: "−½(1+0−0−1)=0",
    },
    {
      id: "vae-h1",
      difficulty: "hard",
      title: "인코드→z→디코드",
      prompt: "z=μ+σ⊙ε 후 x̂=zW. 최종 x̂.",
      inputs: [
        { label: "μ", matrix: [[1, 0]] },
        { label: "σ", matrix: [[1, 1]] },
        { label: "ε", matrix: [[1, -1]] },
        {
          label: "W_dec",
          matrix: [
            [2, 0],
            [0, 2],
          ],
        },
      ],
      expected: (() => {
        const z = reparameterize([[1, 0]], [[1, 1]], [[1, -1]]);
        return matmul(z, [
          [2, 0],
          [0, 2],
        ]);
      })(),
      shapeHint: "z=[2,-1] → x̂=[4,-2]",
      formulaHint: "재파라미터 후 선형 디코드",
    },
    {
      id: "vae-h2",
      difficulty: "hard",
      title: "KL 한 차원",
      prompt: "μ=1, logσ²=0 → KL=0.5",
      inputs: [
        { label: "μ", matrix: [[1]] },
        { label: "logσ²", matrix: [[0]] },
      ],
      expected: [[0.5]],
      decimals: 2,
      shapeHint: "스칼라",
      formulaHint: "−½(1+0−1−1)=0.5",
    },
    {
      id: "vae-h3",
      difficulty: "hard",
      title: "ELBO 조각",
      prompt: "재구성 MSE 합 + KL 합. MSE항=[1,0] 합=1, μ=[1,0] logσ²=[0,0] → KL=0.5 → 총 1.5",
      inputs: [
        { label: "(x−x̂)²", matrix: [[1, 0]] },
        { label: "μ", matrix: [[1, 0]] },
        { label: "logσ²", matrix: [[0, 0]] },
      ],
      expected: [
        [
          Math.round(
            (1 + 0 + klSum([1, 0], [0, 0])) * 100,
          ) / 100,
        ],
      ],
      decimals: 2,
      shapeHint: "스칼라",
      formulaHint: "1 + 0.5",
    },
  ],

  flow: [
    {
      id: "flow-m1",
      difficulty: "medium",
      title: "음수 scale",
      prompt: "s에 음수. y=s⊙x+t",
      inputs: [
        { label: "x", matrix: [[2, -2, 1]] },
        { label: "s", matrix: [[-1, 2, 0.5]] },
        { label: "t", matrix: [[1, 0, 1]] },
      ],
      expected: scaleShiftMatrix(
        [[2, -2, 1]],
        [[-1, 2, 0.5]],
        [[1, 0, 1]],
      ),
      shapeHint: "[1×3]",
      formulaHint: "[-1, -4, 1.5]",
    },
    {
      id: "flow-m2",
      difficulty: "medium",
      title: "log|det|",
      prompt: "Σ log|s|. s=[2,4] → log2+log4=log8≈2.08",
      inputs: [{ label: "s", matrix: [[2, 4]] }],
      expected: [[Math.round(logAbsDetDiag([2, 4]) * 100) / 100]],
      decimals: 2,
      shapeHint: "스칼라",
      formulaHint: "ln2+ln4=ln8≈2.079",
    },
    {
      id: "flow-h1",
      difficulty: "hard",
      title: "왕복 검증",
      prompt: "y에서 역변환한 x를 채우세요 (원래 x 복원).",
      inputs: [
        { label: "y", matrix: [[5, 1]] },
        { label: "s", matrix: [[2, 0.5]] },
        { label: "t", matrix: [[1, 1]] },
      ],
      expected: [[2, 0]],
      shapeHint: "(y-t)/s",
      formulaHint: "(5-1)/2=2, (1-1)/0.5=0",
    },
    {
      id: "flow-h2",
      difficulty: "hard",
      title: "RealNVP 커플링",
      prompt: "앞 절반 고정, 뒤만 y=s⊙x+t. x=[1,2,3,4], s=[2,0.5], t=[0,1] → [1,2,6,3]",
      inputs: [
        { label: "x", matrix: [[1, 2, 3, 4]] },
        { label: "s", matrix: [[2, 0.5]] },
        { label: "t", matrix: [[0, 1]] },
      ],
      expected: [realNvpCouple([1, 2, 3, 4], [2, 0.5], [0, 1])],
      shapeHint: "[1×4]",
      formulaHint: "앞 [1,2], 뒤 3·2+0=6, 4·0.5+1=3",
    },
    {
      id: "flow-h3",
      difficulty: "hard",
      title: "밀도 한 줄",
      prompt: "log p(x)=log p(z)+log|det|. log p(z)=−1, s=[e,1] → log|det|=1 → 합 0",
      inputs: [
        { label: "log p(z)", matrix: [[-1]] },
        { label: "s", matrix: [[Math.E, 1]] },
      ],
      expected: [[0]],
      decimals: 2,
      shapeHint: "스칼라",
      formulaHint: "−1 + (1+0) = 0",
    },
  ],

  diffusion: [
    {
      id: "diff-m1",
      difficulty: "medium",
      title: "ᾱ=0.64 벡터",
      prompt: "√0.64=0.8, √0.36=0.6. x_t 계산.",
      inputs: [
        { label: "x₀", matrix: [[1, 2, 0]] },
        { label: "ε", matrix: [[1, 0, -1]] },
      ],
      expected: roundMatrix(diffuseForward([[1, 2, 0]], [[1, 0, -1]], 0.64), 2),
      decimals: 2,
      shapeHint: "[1×3]",
      formulaHint: "0.8x0+0.6ε → [1.4, 1.6, -0.6]",
    },
    {
      id: "diff-m2",
      difficulty: "medium",
      title: "x₀ 복원",
      prompt: "ᾱ=0.25, x_t=[1], ε=[0] → x̂0=(1−0)/0.5=2",
      inputs: [
        { label: "x_t", matrix: [[1]] },
        { label: "ε", matrix: [[0]] },
      ],
      expected: roundMatrix(predictX0([[1]], [[0]], 0.25), 2),
      decimals: 2,
      shapeHint: "[1×1]",
      formulaHint: "(x_t − √0.75·ε)/√0.25",
    },
    {
      id: "diff-h1",
      difficulty: "hard",
      title: "배치 forward",
      prompt: "ᾱ=0.25, 두 샘플. √0.25=0.5, √0.75≈0.866. 소수 2자리.",
      inputs: [
        {
          label: "x₀",
          matrix: [
            [2, 0],
            [0, 2],
          ],
        },
        {
          label: "ε",
          matrix: [
            [0, 0],
            [1, -1],
          ],
        },
      ],
      expected: roundMatrix(
        diffuseForward(
          [
            [2, 0],
            [0, 2],
          ],
          [
            [0, 0],
            [1, -1],
          ],
          0.25,
        ),
        2,
      ),
      decimals: 2,
      shapeHint: "[2×2]",
      formulaHint: "행1: [1,0], 행2: [0.87, 0.13] 근사",
    },
    {
      id: "diff-h2",
      difficulty: "hard",
      title: "역방향 한 스텝",
      prompt: "ᾱ_t=0.25, ᾱ_{t-1}=1, ε̂=ε. x_t에서 한 스텝 → x̂0 (ᾱ_prev=1이면 순수 복원)",
      inputs: [
        { label: "x_t", matrix: [[1, 0.5]] },
        { label: "ε", matrix: [[0, 0]] },
      ],
      expected: roundMatrix(
        diffuseReverseStep([[1, 0.5]], [[0, 0]], 0.25, 1),
        2,
      ),
      decimals: 2,
      shapeHint: "[1×2]",
      formulaHint: "ε=0 → x̂0=x_t/√ᾱ = [2,1]",
    },
    {
      id: "diff-h3",
      difficulty: "hard",
      title: "왕복 일관성",
      prompt: "x0→forward(ᾱ=0.64)→predictX0. 복원된 x0를 채우세요.",
      inputs: [
        { label: "x₀", matrix: [[2, -2]] },
        { label: "ε", matrix: [[1, 1]] },
      ],
      expected: (() => {
        const xt = diffuseForward([[2, -2]], [[1, 1]], 0.64);
        return roundMatrix(predictX0(xt, [[1, 1]], 0.64), 2);
      })(),
      decimals: 2,
      shapeHint: "[1×2]",
      formulaHint: "같은 ε로 되돌리면 x0",
    },
  ],
};

/** Tag existing easy drills and append extras */
export function withDifficultyDefaults(exercises: Exercise[]): Exercise[] {
  return exercises.map((ex) => ({
    ...ex,
    difficulty: ex.difficulty ?? "easy",
  }));
}

export function mergeExtras(slug: string, base: Exercise[]): Exercise[] {
  const extras = EXTRA_EXERCISES[slug] ?? [];
  return [...withDifficultyDefaults(base), ...extras];
}

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "기초",
  medium: "응용",
  hard: "도전",
};
