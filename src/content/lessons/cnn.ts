import type { Lesson } from "../types";

export const cnnLesson: Lesson = {
  slug: "cnn",
  title: "CNN",
  subtitle: "합성곱",
  kind: "cnn",
  trackOrder: 5,
  stage: "classical",
  intro: [
    "CNN은 작은 커널을 이미지 위에 밀며 내적합니다. 지역 패턴을 공유 가중치로 찾습니다.",
    "valid 합성곱: 출력 크기 = 입력 - 커널 + 1.",
  ],
  formula: "Y[i,j] = Σ_u Σ_v X[i+u,j+v] · K[u,v]",
  exercises: [
    {
      id: "cnn-1",
      title: "1D 합성곱",
      prompt: "신호와 커널의 valid conv 결과를 채우세요.",
      inputs: [
        { label: "x", matrix: [[1, 2, 3, 0]] },
        { label: "k", matrix: [[1, -1]] },
      ],
      expected: [[-1, -1, 3]],
      shapeHint: "길이 4, 커널 2 → 출력 3",
      formulaHint: "1·1+2·(-1)=-1, 2−3=-1, 3−0=3",
    },
    {
      id: "cnn-2",
      title: "2×2 커널",
      prompt: "3×3 이미지에 2×2 커널. 출력은 2×2.",
      inputs: [
        {
          label: "X",
          matrix: [
            [1, 2, 0],
            [3, 1, 1],
            [0, 2, 4],
          ],
        },
        {
          label: "K",
          matrix: [
            [1, 0],
            [0, 1],
          ],
        },
      ],
      expected: [
        [2, 3],
        [5, 5],
      ],
      shapeHint: "[3×3]*[2×2] → [2×2]",
      formulaHint: "좌상: 1·1+2·0+3·0+1·1=2",
    },
    {
      id: "cnn-3",
      title: "엣지 커널",
      prompt: "수평 차분 커널로 합성곱하세요.",
      inputs: [
        {
          label: "X",
          matrix: [
            [1, 1, 1],
            [2, 2, 2],
          ],
        },
        { label: "K", matrix: [[1, -1]] },
      ],
      expected: [
        [0, 0],
        [0, 0],
      ],
      shapeHint: "[2×3]*[1×2] → [2×2]",
      formulaHint: "같은 값이 옆이면 차분 0",
    },
    {
      id: "cnn-4",
      title: "평균 필터",
      prompt: "2×2 평균 커널 (각 1/4). 소수 2자리.",
      inputs: [
        {
          label: "X",
          matrix: [
            [0, 4],
            [4, 0],
          ],
        },
        {
          label: "K",
          matrix: [
            [0.25, 0.25],
            [0.25, 0.25],
          ],
        },
      ],
      expected: [[2]],
      decimals: 2,
      shapeHint: "[2×2]*[2×2] → [1×1]",
      formulaHint: "(0+4+4+0)/4=2",
    },
    {
      id: "cnn-5",
      title: "다시 2×2",
      prompt: "커널이 전부 1일 때 합을 구하세요.",
      inputs: [
        {
          label: "X",
          matrix: [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
          ],
        },
        {
          label: "K",
          matrix: [
            [1, 1],
            [1, 1],
          ],
        },
      ],
      expected: [
        [4, 4],
        [4, 4],
      ],
      shapeHint: "[3×3]*[2×2]→[2×2]",
      formulaHint: "윈도우마다 1이 4개 → 4",
    },
  ],
};
