import type { Lesson } from "../types";

export const flowLesson: Lesson = {
  slug: "flow",
  title: "Flow",
  subtitle: "Normalizing Flow",
  kind: "flow",
  trackOrder: 17,
  stage: "generative",
  intro: [
    "Flow는 가역 변환으로 단순 분포를 복잡 분포로 바꿉니다. 밀도의 야코비안 행렬식을 추적합니다.",
    "affine y=s⊙x+t, RealNVP 커플링(앞 절반 고정), log|det|=Σlog|s| 까지 손계산합니다.",
  ],
  formula: "y=s⊙x+t ,  log p(x)=log p(z)+Σlog|s|",
  exercises: [
    {
      id: "flow-1",
      title: "순방향",
      prompt: "y = s⊙x + t",
      inputs: [
        { label: "x", matrix: [[1, 2]] },
        { label: "s", matrix: [[2, 0.5]] },
        { label: "t", matrix: [[1, 0]] },
      ],
      expected: [[3, 1]],
      shapeHint: "[1×2]",
      formulaHint: "2·1+1=3, 0.5·2+0=1",
    },
    {
      id: "flow-2",
      title: "역변환",
      prompt: "x = (y−t)/s",
      inputs: [
        { label: "y", matrix: [[3, 1]] },
        { label: "s", matrix: [[2, 0.5]] },
        { label: "t", matrix: [[1, 0]] },
      ],
      expected: [[1, 2]],
      shapeHint: "[1×2]",
      formulaHint: "(3-1)/2=1, (1-0)/0.5=2",
    },
    {
      id: "flow-3",
      title: "로그 야코비안(대각)",
      prompt: "log|det| = Σ log|s_i|. s=[2,0.5] → log2+log0.5=0",
      inputs: [{ label: "s", matrix: [[2, 0.5]] }],
      expected: [[0]],
      shapeHint: "스칼라",
      formulaHint: "log2 + log(1/2) = 0",
    },
    {
      id: "flow-4",
      title: "두 번 합성",
      prompt: "y=s⊙x+t 한 뒤 같은 s,t로 한 번 더.",
      inputs: [
        { label: "x", matrix: [[1]] },
        { label: "s", matrix: [[2]] },
        { label: "t", matrix: [[0]] },
      ],
      expected: [[4]],
      shapeHint: "[1×1]",
      formulaHint: "1→2→4",
    },
    {
      id: "flow-5",
      title: "배치",
      prompt: "행마다 같은 s,t",
      inputs: [
        {
          label: "x",
          matrix: [
            [1, 0],
            [0, 1],
          ],
        },
        {
          label: "s",
          matrix: [
            [2, 2],
            [2, 2],
          ],
        },
        {
          label: "t",
          matrix: [
            [1, 1],
            [1, 1],
          ],
        },
      ],
      expected: [
        [3, 1],
        [1, 3],
      ],
      shapeHint: "[2×2]",
      formulaHint: "2x+1",
    },
  ],
};
