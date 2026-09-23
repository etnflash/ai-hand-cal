import {
  attention,
  applyCausalMask,
  causalSoftmax,
  concatCache,
  conv2dValid,
  createRng,
  diffuseForward,
  hashSeed,
  klDiag,
  layerNormRows,
  linear,
  loraLinear,
  matmul,
  messageAggregate,
  predictX0,
  randomMatrix,
  realNvpCouple,
  reparameterize,
  relu,
  rmsNormRows,
  roundMatrix,
  scaleShiftMatrix,
  softmaxRows,
  type Matrix,
} from "@/engine";
import type { Difficulty, Exercise, Lesson } from "@/content/types";

export type GenOptions = {
  difficulty?: Difficulty;
};

function dimsFor(d: Difficulty): {
  batch: number;
  m: number;
  k: number;
  n: number;
  range: [number, number];
} {
  if (d === "hard") {
    return { batch: 3, m: 3, k: 3, n: 3, range: [-4, 4] };
  }
  if (d === "medium") {
    return { batch: 2, m: 3, k: 2, n: 3, range: [-3, 3] };
  }
  return { batch: 1, m: 2, k: 2, n: 2, range: [-2, 2] };
}

export function generateExercise(
  lesson: Lesson,
  seedInput: string | number,
  options: GenOptions = {},
): Exercise | null {
  const difficulty = options.difficulty ?? "medium";
  const seed = hashSeed(lesson.slug, difficulty, seedInput);
  const rng = createRng(seed);
  const { batch, m, k, n, range } = dimsFor(difficulty);
  const [lo, hi] = range;

  const tag = difficulty === "hard" ? "도전" : difficulty === "medium" ? "응용" : "기초";

  if (lesson.kind === "matmul") {
    const a = randomMatrix(rng, m, k, lo, hi);
    const b = randomMatrix(rng, k, n, lo, hi);
    return {
      id: `gen-mm-${difficulty}-${seed}`,
      difficulty,
      title: `${tag} 행렬곱 #${seed % 10000}`,
      prompt: `[${m}×${k}]@[${k}×${n}] 결과를 채우세요.`,
      inputs: [
        { label: "A", matrix: a },
        { label: "B", matrix: b },
      ],
      expected: matmul(a, b),
      shapeHint: `A [${m}×${k}] @ B [${k}×${n}] → [${m}×${n}]`,
      formulaHint: "C[i][j] = A의 i행 · B의 j열",
    };
  }

  if (lesson.kind === "linear") {
    const x = randomMatrix(rng, batch, k, lo, hi);
    const w = randomMatrix(rng, k, n, lo, hi);
    const bRow = randomMatrix(rng, 1, n, lo, hi)[0];
    return {
      id: `gen-lin-${difficulty}-${seed}`,
      difficulty,
      title: `${tag} 선형층 #${seed % 10000}`,
      prompt: "y = xW + b",
      inputs: [
        { label: "x", matrix: x },
        { label: "W", matrix: w },
        { label: "b", matrix: [bRow] },
      ],
      expected: linear(x, w, bRow),
      shapeHint: `[${batch}×${k}]@[${k}×${n}]+b`,
      formulaHint: "먼저 xW, 각 행에 b",
    };
  }

  if (lesson.kind === "mlp") {
    const x = randomMatrix(rng, 1, 2, lo, hi);
    const w1 = randomMatrix(rng, 2, 3, lo, hi);
    const w2 = randomMatrix(rng, 3, 2, lo, hi);
    const h = relu(matmul(x, w1));
    return {
      id: `gen-mlp-${difficulty}-${seed}`,
      difficulty,
      title: `${tag} MLP #${seed % 10000}`,
      prompt: "y = ReLU(xW1) W2  (최종 y)",
      inputs: [
        { label: "x", matrix: x },
        { label: "W1", matrix: w1 },
        { label: "W2", matrix: w2 },
      ],
      expected: matmul(h, w2),
      shapeHint: "숨은 3 → 출력 2",
      formulaHint: "matmul → ReLU → matmul",
    };
  }

  if (lesson.kind === "softmax") {
    const cols = difficulty === "hard" ? 4 : 3;
    const rows = difficulty === "easy" ? 1 : 2;
    const z = randomMatrix(rng, rows, cols, lo, hi);
    return {
      id: `gen-sm-${difficulty}-${seed}`,
      difficulty,
      title: `${tag} Softmax #${seed % 10000}`,
      prompt: "행별 Softmax (소수 4자리)",
      inputs: [{ label: "Z", matrix: z }],
      expected: roundMatrix(softmaxRows(z), 4),
      decimals: 4,
      shapeHint: `[${rows}×${cols}]`,
      formulaHint: "max 빼기 → exp → 정규화",
    };
  }

  if (lesson.kind === "cnn") {
    const size = difficulty === "hard" ? 4 : 3;
    const ks = difficulty === "hard" ? 3 : 2;
    const x = randomMatrix(rng, size, size, 0, 3);
    const ker = randomMatrix(rng, ks, ks, -1, 1);
    return {
      id: `gen-cnn-${difficulty}-${seed}`,
      difficulty,
      title: `${tag} CNN #${seed % 10000}`,
      prompt: "valid 합성곱",
      inputs: [
        { label: "X", matrix: x },
        { label: "K", matrix: ker },
      ],
      expected: conv2dValid(x, ker),
      shapeHint: `[${size}×${size}]*[${ks}×${ks}]`,
      formulaHint: "윈도우 내적",
    };
  }

  if (lesson.kind === "layernorm") {
    const cols = difficulty === "hard" ? 4 : 2;
    const rows = difficulty === "easy" ? 1 : 2;
    let x = randomMatrix(rng, rows, cols, 0, 5);
    // ensure not all equal
    x = x.map((row) => {
      if (row.every((v) => v === row[0])) {
        return row.map((v, j) => v + j);
      }
      return row;
    });
    return {
      id: `gen-ln-${difficulty}-${seed}`,
      difficulty,
      title: `${tag} LayerNorm #${seed % 10000}`,
      prompt: "γ=1, β=0 (소수 2자리)",
      inputs: [{ label: "X", matrix: x }],
      expected: roundMatrix(layerNormRows(x), 2),
      decimals: 2,
      shapeHint: `[${rows}×${cols}]`,
      formulaHint: "행별 (x-μ)/σ",
    };
  }

  if (lesson.kind === "rmsnorm") {
    const cols = difficulty === "hard" ? 4 : 2;
    const rows = difficulty === "easy" ? 1 : 2;
    const x = randomMatrix(rng, rows, cols, 0, 5);
    return {
      id: `gen-rms-${difficulty}-${seed}`,
      difficulty,
      title: `${tag} RMSNorm #${seed % 10000}`,
      prompt: "γ=1 (소수 2자리)",
      inputs: [{ label: "X", matrix: x }],
      expected: roundMatrix(rmsNormRows(x), 2),
      decimals: 2,
      shapeHint: `[${rows}×${cols}]`,
      formulaHint: "x / √(mean(x²))",
    };
  }

  if (lesson.kind === "causal") {
    const n = difficulty === "hard" ? 3 : 2;
    const scores = randomMatrix(rng, n, n, 0, 3);
    if (difficulty === "easy") {
      return {
        id: `gen-causal-${difficulty}-${seed}`,
        difficulty,
        title: `${tag} Mask #${seed % 10000}`,
        prompt: "미래 칸을 −99로",
        inputs: [{ label: "scores", matrix: scores }],
        expected: applyCausalMask(scores, -99),
        shapeHint: `[${n}×${n}]`,
        formulaHint: "j>i → −99",
      };
    }
    return {
      id: `gen-causal-${difficulty}-${seed}`,
      difficulty,
      title: `${tag} Causal Softmax #${seed % 10000}`,
      prompt: "마스크 후 Softmax (소수 2자리)",
      inputs: [{ label: "scores", matrix: scores }],
      expected: roundMatrix(causalSoftmax(scores, -99), 2),
      decimals: 2,
      shapeHint: `[${n}×${n}]`,
      formulaHint: "미래 −99 → Softmax",
    };
  }

  if (lesson.kind === "lora") {
    const x = randomMatrix(rng, batch, 2, lo, hi);
    const w = randomMatrix(rng, 2, 2, lo, hi);
    const a = randomMatrix(rng, 2, 1, lo, hi);
    const b = randomMatrix(rng, 1, 2, lo, hi);
    const scale = difficulty === "hard" ? 0.5 : 1;
    return {
      id: `gen-lora-${difficulty}-${seed}`,
      difficulty,
      title: `${tag} LoRA #${seed % 10000}`,
      prompt: `y = xW + ${scale}·xAB`,
      inputs: [
        { label: "x", matrix: x },
        { label: "W", matrix: w },
        { label: "A", matrix: a },
        { label: "B", matrix: b },
      ],
      expected: loraLinear(x, w, a, b, scale),
      shapeHint: `[${batch}×2]`,
      formulaHint: "base + scale·low-rank",
    };
  }

  if (lesson.kind === "attention" || lesson.kind === "self-attention") {
    const t = difficulty === "hard" ? 3 : 2;
    const d = 2;
    const q = randomMatrix(rng, t, d, lo, hi);
    const kMat = randomMatrix(rng, t, d, lo, hi);
    const v = randomMatrix(rng, t, d, lo, hi);
    const { output } = attention(q, kMat, v);
    return {
      id: `gen-att-${difficulty}-${seed}`,
      difficulty,
      title: `${tag} Attention out #${seed % 10000}`,
      prompt: "Attention(Q,K,V) output (소수 2자리)",
      inputs: [
        { label: "Q", matrix: q },
        { label: "K", matrix: kMat },
        { label: "V", matrix: v },
      ],
      expected: roundMatrix(output, 2),
      decimals: 2,
      shapeHint: `[${t}×${d}]`,
      formulaHint: "softmax(QKᵀ/√d)V",
    };
  }

  if (lesson.kind === "kvcache") {
    const past = randomMatrix(rng, difficulty === "hard" ? 4 : 2, 2, lo, hi);
    const neu = randomMatrix(rng, difficulty === "hard" ? 2 : 1, 2, lo, hi);
    return {
      id: `gen-kv-${difficulty}-${seed}`,
      difficulty,
      title: `${tag} KV concat #${seed % 10000}`,
      prompt: "K 캐시에 새 행을 이어 붙이세요",
      inputs: [
        { label: "K_past", matrix: past },
        { label: "k_new", matrix: neu },
      ],
      expected: concatCache(past, neu),
      shapeHint: `→ [${past.length + neu.length}×2]`,
      formulaHint: "행 concat",
    };
  }

  if (lesson.kind === "gnn") {
    const nodes = difficulty === "hard" ? 3 : 2;
    const adj = randomMatrix(rng, nodes, nodes, 0, 1);
    const x = randomMatrix(rng, nodes, 2, lo, hi);
    return {
      id: `gen-gnn-${difficulty}-${seed}`,
      difficulty,
      title: `${tag} GNN #${seed % 10000}`,
      prompt: "H = A @ X",
      inputs: [
        { label: "A", matrix: adj },
        { label: "X", matrix: x },
      ],
      expected: messageAggregate(adj, x),
      shapeHint: `[${nodes}×${nodes}]@[${nodes}×2]`,
      formulaHint: "이웃 feature 합",
    };
  }

  if (lesson.kind === "vae") {
    if (difficulty === "hard") {
      const mu = randomMatrix(rng, 1, 2, 0, 2)[0];
      const logVar = [0, 0];
      const k = klDiag(mu, logVar);
      return {
        id: `gen-vae-${difficulty}-${seed}`,
        difficulty,
        title: `${tag} KL #${seed % 10000}`,
        prompt: "차원별 KL (logσ²=0, 소수 2자리)",
        inputs: [
          { label: "μ", matrix: [mu] },
          { label: "logσ²", matrix: [logVar] },
        ],
        expected: roundMatrix([k], 2),
        decimals: 2,
        shapeHint: "[1×2]",
        formulaHint: "−½(1+logσ²−μ²−σ²)",
      };
    }
    const mu = randomMatrix(rng, 1, 2, lo, hi) as Matrix;
    const sigma = randomMatrix(rng, 1, 2, 1, 3);
    const eps = randomMatrix(rng, 1, 2, -1, 1);
    return {
      id: `gen-vae-${difficulty}-${seed}`,
      difficulty,
      title: `${tag} VAE z #${seed % 10000}`,
      prompt: "z = μ + σ⊙ε",
      inputs: [
        { label: "μ", matrix: mu },
        { label: "σ", matrix: sigma },
        { label: "ε", matrix: eps },
      ],
      expected: reparameterize(mu, sigma, eps),
      shapeHint: "[1×2]",
      formulaHint: "원소별",
    };
  }

  if (lesson.kind === "flow") {
    if (difficulty === "hard") {
      const x = randomMatrix(rng, 1, 4, lo, hi)[0];
      const s = randomMatrix(rng, 1, 2, 1, 3)[0];
      const t = randomMatrix(rng, 1, 2, lo, hi)[0];
      return {
        id: `gen-flow-${difficulty}-${seed}`,
        difficulty,
        title: `${tag} RealNVP #${seed % 10000}`,
        prompt: "앞 절반 고정, 뒤만 s⊙x+t",
        inputs: [
          { label: "x", matrix: [x] },
          { label: "s", matrix: [s] },
          { label: "t", matrix: [t] },
        ],
        expected: [realNvpCouple(x, s, t)],
        shapeHint: "[1×4]",
        formulaHint: "커플링",
      };
    }
    const x = randomMatrix(rng, 1, 2, lo, hi);
    const s = randomMatrix(rng, 1, 2, 1, 3);
    const t = randomMatrix(rng, 1, 2, lo, hi);
    return {
      id: `gen-flow-${difficulty}-${seed}`,
      difficulty,
      title: `${tag} Flow #${seed % 10000}`,
      prompt: "y = s⊙x + t",
      inputs: [
        { label: "x", matrix: x },
        { label: "s", matrix: s },
        { label: "t", matrix: t },
      ],
      expected: scaleShiftMatrix(x, s, t),
      shapeHint: "[1×2]",
      formulaHint: "원소별 affine",
    };
  }

  if (lesson.kind === "diffusion") {
    const x0 = randomMatrix(rng, difficulty === "hard" ? 2 : 1, 2, lo, hi);
    const eps = randomMatrix(rng, x0.length, 2, -1, 1);
    const ab = difficulty === "hard" ? 0.64 : 0.25;
    if (difficulty === "hard") {
      const xt = diffuseForward(x0, eps, ab);
      return {
        id: `gen-diff-${difficulty}-${seed}`,
        difficulty,
        title: `${tag} x0 복원 #${seed % 10000}`,
        prompt: `ᾱ=${ab} forward 후 같은 ε로 x̂0 복원 (소수 2자리)`,
        inputs: [
          { label: "x_t", matrix: roundMatrix(xt, 2) },
          { label: "ε", matrix: eps },
        ],
        expected: roundMatrix(predictX0(roundMatrix(xt, 2), eps, ab), 2),
        decimals: 2,
        shapeHint: `[${x0.length}×2]`,
        formulaHint: "(x_t−√(1−ᾱ)ε)/√ᾱ",
      };
    }
    return {
      id: `gen-diff-${difficulty}-${seed}`,
      difficulty,
      title: `${tag} Diffusion #${seed % 10000}`,
      prompt: `x_t = √ᾱ x0 + √(1-ᾱ)ε , ᾱ=${ab} (소수 2자리)`,
      inputs: [
        { label: "x₀", matrix: x0 },
        { label: "ε", matrix: eps },
      ],
      expected: roundMatrix(diffuseForward(x0, eps, ab), 2),
      decimals: 2,
      shapeHint: `[${x0.length}×2]`,
      formulaHint: `√${ab}, √${(1 - ab).toFixed(2)}`,
    };
  }

  if (lesson.kind === "lstm") {
    const f = randomMatrix(rng, 1, 2, 0, 1);
    const c = randomMatrix(rng, 1, 2, lo, hi);
    const i = randomMatrix(rng, 1, 2, 0, 1);
    const g = randomMatrix(rng, 1, 2, lo, hi);
    const expected = [
      [
        f[0][0] * c[0][0] + i[0][0] * g[0][0],
        f[0][1] * c[0][1] + i[0][1] * g[0][1],
      ],
    ];
    return {
      id: `gen-lstm-${difficulty}-${seed}`,
      difficulty,
      title: `${tag} LSTM c' #${seed % 10000}`,
      prompt: "c' = f⊙c + i⊙g",
      inputs: [
        { label: "f", matrix: f },
        { label: "c", matrix: c },
        { label: "i", matrix: i },
        { label: "g", matrix: g },
      ],
      expected,
      shapeHint: "[1×2]",
      formulaHint: "원소별",
    };
  }

  if (lesson.kind === "gan") {
    const x = randomMatrix(rng, difficulty === "hard" ? 3 : 1, 2, lo, hi);
    const w = randomMatrix(rng, 2, 1, lo, hi);
    return {
      id: `gen-gan-${difficulty}-${seed}`,
      difficulty,
      title: `${tag} GAN logit #${seed % 10000}`,
      prompt: "logit = X @ w",
      inputs: [
        { label: "X", matrix: x },
        { label: "w", matrix: w },
      ],
      expected: matmul(x, w),
      shapeHint: `[${x.length}×1]`,
      formulaHint: "내적",
    };
  }

  if (lesson.kind === "positional") {
    const x = randomMatrix(rng, 3, 2, 0, 2);
    const pe = randomMatrix(rng, 3, 2, -1, 1);
    // use halves for nicer decimals
    const pe2 = pe.map((row) => row.map((v) => Math.round(v * 2) / 2));
    return {
      id: `gen-pe-${difficulty}-${seed}`,
      difficulty,
      title: `${tag} PE 가산 #${seed % 10000}`,
      prompt: "X + PE",
      inputs: [
        { label: "X", matrix: x },
        { label: "PE", matrix: pe2 },
      ],
      expected: x.map((row, i) => row.map((v, j) => v + pe2[i][j])),
      decimals: 1,
      shapeHint: "[3×2]",
      formulaHint: "원소별 합",
    };
  }

  if (lesson.kind === "transformer") {
    const x = randomMatrix(rng, 2, 2, lo, hi);
    const attn = randomMatrix(rng, 2, 2, lo, hi);
    return {
      id: `gen-tf-${difficulty}-${seed}`,
      difficulty,
      title: `${tag} Residual #${seed % 10000}`,
      prompt: "x + attn_out",
      inputs: [
        { label: "x", matrix: x },
        { label: "attn", matrix: attn },
      ],
      expected: x.map((row, i) => row.map((v, j) => v + attn[i][j])),
      shapeHint: "[2×2]",
      formulaHint: "원소별 합",
    };
  }

  if (lesson.kind === "multihead") {
    const v = randomMatrix(rng, 1, 4, lo, hi);
    return {
      id: `gen-mh-${difficulty}-${seed}`,
      difficulty,
      title: `${tag} Head split #${seed % 10000}`,
      prompt: "d=4를 2 head로 나눠 두 행으로",
      inputs: [{ label: "v", matrix: v }],
      expected: [v[0].slice(0, 2), v[0].slice(2, 4)],
      shapeHint: "[2×2]",
      formulaHint: "앞/뒤 절반",
    };
  }

  if (lesson.kind === "rope") {
    const x = randomMatrix(rng, 1, 2, lo, hi)[0];
    // θ=0 identity for easy; for medium/hard use π/2
    if (difficulty === "easy") {
      return {
        id: `gen-rope-${difficulty}-${seed}`,
        difficulty,
        title: `${tag} RoPE θ=0`,
        prompt: "θ=0 → 그대로",
        inputs: [{ label: "(x,y)", matrix: [x] }],
        expected: [x],
        shapeHint: "[1×2]",
        formulaHint: "항등",
      };
    }
    return {
      id: `gen-rope-${difficulty}-${seed}`,
      difficulty,
      title: `${tag} RoPE θ=π/2`,
      prompt: "π/2 회전: (x,y)→(−y,x)",
      inputs: [{ label: "(x,y)", matrix: [x] }],
      expected: [[-x[1], x[0]]],
      shapeHint: "[1×2]",
      formulaHint: "코사인 0, 사인 1",
    };
  }

  if (lesson.kind === "dropout") {
    const x = randomMatrix(rng, 1, 4, lo, hi);
    const m = randomMatrix(rng, 1, 4, 0, 1);
    return {
      id: `gen-drop-${difficulty}-${seed}`,
      difficulty,
      title: `${tag} Dropout #${seed % 10000}`,
      prompt: "x ⊙ m",
      inputs: [
        { label: "x", matrix: x },
        { label: "m", matrix: m },
      ],
      expected: x.map((row, i) => row.map((v, j) => v * m[i][j])),
      shapeHint: "[1×4]",
      formulaHint: "원소별",
    };
  }

  if (lesson.kind === "crossentropy") {
    const z = randomMatrix(rng, 1, 2, 0, 3);
    const p = roundMatrix(softmaxRows(z), 4);
    return {
      id: `gen-ce-${difficulty}-${seed}`,
      difficulty,
      title: `${tag} Softmax #${seed % 10000}`,
      prompt: "로짓 Softmax (소수 4자리)",
      inputs: [{ label: "z", matrix: z }],
      expected: p,
      decimals: 4,
      shapeHint: "[1×2]",
      formulaHint: "max 빼기 → exp → 정규화",
    };
  }

  return null;
}
