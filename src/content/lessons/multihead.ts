import type { Lesson } from "../types";

export const multiheadLesson: Lesson = {
  slug: "multihead",
  title: "Multi-Head",
  subtitle: "머리를 나눠 Attention",
  kind: "multihead",
  trackOrder: 11.5,
  stage: "attention",
  generatable: true,
  intro: [
    "Multi-Head Attention은 Q,K,V의 차원을 여러 head로 쪼개 각각 Attention한 뒤 이어 붙입니다.",
    "손계산에서는 d=4, heads=2 → 각 head는 d=2 입니다.",
  ],
  formula: "MultiHead = Concat(head₁…headₕ)",
  exercises: [
    {
      id: "mh-1",
      title: "Head 분할",
      prompt: "행 [1,2,3,4]를 2 head로 나누면 head0=[1,2], head1=[3,4]. 두 행을 한 행렬로 쓰세요 (위=head0 전체, 아래는 첫 토큰만 연습).",
      inputs: [
        {
          label: "Q (T=1)",
          matrix: [[1, 2, 3, 4]],
        },
      ],
      expected: [
        [1, 2],
        [3, 4],
      ],
      shapeHint: "d=4, h=2 → 두 조각 [1×2]",
      formulaHint: "앞 절반 / 뒤 절반",
    },
    {
      id: "mh-2",
      title: "Head concat",
      prompt: "두 head 출력 [1,0] 과 [0,1] 을 이어 [1,0,0,1]",
      inputs: [
        { label: "h0", matrix: [[1, 0]] },
        { label: "h1", matrix: [[0, 1]] },
      ],
      expected: [[1, 0, 0, 1]],
      shapeHint: "[1×2]+[1×2]→[1×4]",
      formulaHint: "가로로 이어 붙이기",
    },
    {
      id: "mh-3",
      title: "한 head Attention",
      prompt: "작은 head에서 weights @ V (이미 Softmax된 w)",
      inputs: [
        { label: "w", matrix: [[1, 0]] },
        {
          label: "V_h",
          matrix: [
            [2, 0],
            [4, 1],
          ],
        },
      ],
      expected: [[2, 0]],
      shapeHint: "[1×2]@[2×2]",
      formulaHint: "첫 행만 선택",
    },
    {
      id: "mh-4",
      title: "2토큰 concat",
      prompt: "각 토큰의 두 head를 concat",
      inputs: [
        {
          label: "h0 out",
          matrix: [
            [1, 0],
            [0, 1],
          ],
        },
        {
          label: "h1 out",
          matrix: [
            [2, 2],
            [3, 0],
          ],
        },
      ],
      expected: [
        [1, 0, 2, 2],
        [0, 1, 3, 0],
      ],
      shapeHint: "[2×2]|[2×2]→[2×4]",
      formulaHint: "행마다 이어 붙이기",
    },
    {
      id: "mh-5",
      title: "분할 다시",
      prompt: "[2,4,6,8] → 2 head 행렬 (행=head)",
      inputs: [{ label: "v", matrix: [[2, 4, 6, 8]] }],
      expected: [
        [2, 4],
        [6, 8],
      ],
      shapeHint: "절반씩",
      formulaHint: "앞/뒤",
    },
  ],
};
