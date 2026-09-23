import { describe, expect, it } from "vitest";
import {
  matmul,
  linear,
  softmaxRows,
  softmaxVec,
  attention,
  selfAttention,
  checkMatrix,
  roundMatrix,
  transpose,
  layerNormRows,
  loraLinear,
  loraDeltaW,
  sinusoidalPE,
  addPositional,
  conv2dValid,
  concatCache,
  reparameterize,
  diffuseForward,
  maxPool2d,
  splitHeads,
  concatHeads,
  rope2d,
  applyDropout,
  crossEntropyLogits,
  rmsNormRows,
  applyCausalMask,
  causalSoftmax,
  klDiag,
  bceLoss,
  realNvpCouple,
  diffuseReverseStep,
} from "./index";

describe("matmul", () => {
  it("multiplies 2x3 @ 3x2", () => {
    const a = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const b = [
      [7, 8],
      [9, 10],
      [11, 12],
    ];
    expect(matmul(a, b)).toEqual([
      [58, 64],
      [139, 154],
    ]);
  });

  it("throws on incompatible shapes", () => {
    expect(() => matmul([[1, 2]], [[1], [2], [3]])).toThrow(/incompatible/);
  });
});

describe("linear", () => {
  it("computes xW + b", () => {
    const x = [[1, 2]];
    const w = [
      [3, 4],
      [5, 6],
    ];
    const b = [1, -1];
    expect(linear(x, w, b)).toEqual([[14, 15]]);
  });
});

describe("softmax", () => {
  it("sums to 1 per row", () => {
    const out = softmaxRows([
      [1, 2, 3],
      [0, 0, 0],
    ]);
    expect(out[0].reduce((a, b) => a + b, 0)).toBeCloseTo(1);
    expect(out[1]).toEqual([1 / 3, 1 / 3, 1 / 3]);
  });

  it("vec softmax", () => {
    const v = softmaxVec([0, 0]);
    expect(v[0]).toBeCloseTo(0.5);
  });
});

describe("attention", () => {
  it("runs scaled dot-product", () => {
    const q = [
      [1, 0],
      [0, 1],
    ];
    const k = [
      [1, 0],
      [0, 1],
    ];
    const v = [
      [1, 2],
      [3, 4],
    ];
    const { weights, output } = attention(q, k, v);
    expect(weights[0].reduce((a, b) => a + b, 0)).toBeCloseTo(1);
    expect(output.length).toBe(2);
    expect(output[0].length).toBe(2);
  });

  it("selfAttention projects then attends", () => {
    const x = [
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    const I = [
      [1, 0],
      [0, 1],
    ];
    const r = selfAttention(x, I, I, I);
    expect(r.q).toEqual(x);
    expect(r.weights.length).toBe(3);
  });
});

describe("checkMatrix", () => {
  it("marks cells", () => {
    const expected = [
      [1, 2],
      [3, 4],
    ];
    const user = [
      ["1", "0"],
      ["", "4"],
    ];
    const r = checkMatrix(user, expected);
    expect(r.cellOk[0][0]).toBe(true);
    expect(r.cellOk[0][1]).toBe(false);
    expect(r.cellOk[1][0]).toBe(null);
    expect(r.correctCount).toBe(2);
    expect(r.ok).toBe(false);
  });
});

describe("transpose / round", () => {
  it("transposes", () => {
    expect(transpose([[1, 2, 3]])).toEqual([[1], [2], [3]]);
  });
  it("rounds", () => {
    expect(roundMatrix([[0.123456]], 2)).toEqual([[0.12]]);
  });
});

describe("layerNorm", () => {
  it("normalizes [1,3]", () => {
    const out = layerNormRows([[1, 3]]);
    expect(out[0][0]).toBeCloseTo(-1, 5);
    expect(out[0][1]).toBeCloseTo(1, 5);
  });
});

describe("lora", () => {
  it("matches lesson lora-3", () => {
    const y = loraLinear(
      [[1, 0]],
      [
        [1, 0],
        [0, 1],
      ],
      [[1], [0]],
      [[2, 0]],
      1,
    );
    expect(y).toEqual([[3, 0]]);
  });

  it("delta W", () => {
    expect(
      loraDeltaW(
        [
          [1],
          [2],
        ],
        [[3, 0]],
      ),
    ).toEqual([
      [3, 0],
      [6, 0],
    ]);
  });
});

describe("positional", () => {
  it("pos0 is [0,1] for d=2", () => {
    const pe = sinusoidalPE(1, 2);
    expect(pe[0][0]).toBeCloseTo(0, 5);
    expect(pe[0][1]).toBeCloseTo(1, 5);
  });

  it("adds PE", () => {
    expect(
      addPositional(
        [
          [1, 0],
          [0, 1],
        ],
        [
          [0, 1],
          [1, 0],
        ],
      ),
    ).toEqual([
      [1, 1],
      [1, 1],
    ]);
  });
});

describe("cnn / kv / vae / diffusion", () => {
  it("conv2d valid", () => {
    expect(
      conv2dValid(
        [
          [1, 2, 0],
          [3, 1, 1],
          [0, 2, 4],
        ],
        [
          [1, 0],
          [0, 1],
        ],
      ),
    ).toEqual([
      [2, 3],
      [5, 5],
    ]);
  });

  it("concatCache", () => {
    expect(
      concatCache(
        [
          [1, 0],
          [0, 1],
        ],
        [[1, 1]],
      ),
    ).toEqual([
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
  });

  it("reparameterize", () => {
    expect(
      reparameterize([[1, 0]], [[2, 1]], [[0.5, -1]]),
    ).toEqual([[2, -1]]);
  });

  it("diffuse alphaBar=1", () => {
    expect(diffuseForward([[3, -1]], [[9, 9]], 1)).toEqual([[3, -1]]);
  });

  it("maxPool2d", () => {
    expect(
      maxPool2d(
        [
          [1, 3, 2, 0],
          [4, 1, 0, 5],
          [2, 2, 8, 1],
          [0, 7, 3, 3],
        ],
        2,
        2,
      ),
    ).toEqual([
      [4, 5],
      [7, 8],
    ]);
  });
});

describe("multihead / rope / dropout / loss / rms / causal", () => {
  it("split and concat heads", () => {
    expect(splitHeads([[1, 2, 3, 4]], 2)).toEqual([
      [[1, 2]],
      [[3, 4]],
    ]);
    expect(
      concatHeads([
        [[1, 0]],
        [[0, 1]],
      ]),
    ).toEqual([[1, 0, 0, 1]]);
  });

  it("rope2d identity and quarter turn", () => {
    expect(rope2d(3, 4, 0)).toEqual([3, 4]);
    expect(rope2d(1, 0, Math.PI / 2)[0]).toBeCloseTo(0, 5);
    expect(rope2d(1, 0, Math.PI / 2)[1]).toBeCloseTo(1, 5);
  });

  it("applyDropout", () => {
    expect(
      applyDropout(
        [
          [2, 4],
          [6, 8],
        ],
        [
          [1, 0],
          [1, 1],
        ],
        1,
      ),
    ).toEqual([
      [2, 0],
      [6, 8],
    ]);
  });

  it("crossEntropyLogits", () => {
    expect(crossEntropyLogits([0, 0], 0)).toBeCloseTo(Math.LN2, 5);
  });

  it("rmsNormRows", () => {
    expect(roundMatrix(rmsNormRows([[0, 2]]), 2)).toEqual([[0, 1.41]]);
  });

  it("causal mask and softmax", () => {
    expect(
      applyCausalMask(
        [
          [1, 2],
          [3, 4],
        ],
        -99,
      ),
    ).toEqual([
      [1, -99],
      [3, 4],
    ]);
    const w = causalSoftmax(
      [
        [2, 1],
        [0, 3],
      ],
      -99,
    );
    expect(w[0][0]).toBeCloseTo(1, 5);
    expect(w[0][1]).toBeCloseTo(0, 5);
  });

  it("klDiag and bceLoss", () => {
    expect(klDiag([0, 0], [0, 0])).toEqual([0, 0]);
    expect(klDiag([1], [0])[0]).toBeCloseTo(0.5, 5);
    expect(bceLoss(0.5, 1)).toBeCloseTo(Math.LN2, 5);
  });

  it("realNvp and reverse diffusion", () => {
    expect(realNvpCouple([1, 2, 3, 4], [2, 0.5], [0, 1])).toEqual([
      1, 2, 6, 3,
    ]);
    expect(
      roundMatrix(diffuseReverseStep([[1]], [[0]], 0.25, 1), 2),
    ).toEqual([[2]]);
  });
});
