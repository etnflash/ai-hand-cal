import type { Lesson } from "../types";

export const gnnLesson: Lesson = {
  slug: "gnn",
  title: "GNN",
  subtitle: "그래프 메시지 패싱",
  kind: "gnn",
  trackOrder: 7,
  stage: "classical",
  intro: [
    "GNN은 이웃 노드 feature를 모아(메시지) 내 노드를 업데이트합니다.",
    "가장 단순한 형태: H = A X 또는 H = Â X W (GCN).",
  ],
  formula: "H = Â X W",
  exercises: [
    {
      id: "gnn-1",
      title: "이웃 합",
      prompt: "A @ X 로 메시지를 모으세요. (무향, 자기 루프 없음)",
      inputs: [
        {
          label: "A",
          matrix: [
            [0, 1, 1],
            [1, 0, 0],
            [1, 0, 0],
          ],
        },
        {
          label: "X",
          matrix: [
            [1],
            [2],
            [3],
          ],
        },
      ],
      expected: [
        [5],
        [1],
        [1],
      ],
      shapeHint: "[3×3]@[3×1]→[3×1]",
      formulaHint: "노드0: 이웃1+2 → 2+3=5",
    },
    {
      id: "gnn-2",
      title: "자기 루프",
      prompt: "(A+I) @ X",
      inputs: [
        {
          label: "A+I",
          matrix: [
            [1, 1],
            [1, 1],
          ],
        },
        {
          label: "X",
          matrix: [
            [1, 0],
            [0, 1],
          ],
        },
      ],
      expected: [
        [1, 1],
        [1, 1],
      ],
      shapeHint: "[2×2]@[2×2]",
      formulaHint: "각 행이 두 노드 feature 합",
    },
    {
      id: "gnn-3",
      title: "GCN 한 층",
      prompt: "Â @ X @ W 를 계산하세요.",
      inputs: [
        {
          label: "Â",
          matrix: [
            [1, 0],
            [0, 1],
          ],
        },
        {
          label: "X",
          matrix: [
            [1, 2],
            [3, 4],
          ],
        },
        {
          label: "W",
          matrix: [
            [1, 0],
            [0, 1],
          ],
        },
      ],
      expected: [
        [1, 2],
        [3, 4],
      ],
      shapeHint: "Â=I, W=I → H=X",
      formulaHint: "단위행렬이면 feature 그대로",
    },
    {
      id: "gnn-4",
      title: "가중 변환",
      prompt: "X @ W 만 (이미 메시지 합친 뒤).",
      inputs: [
        {
          label: "X̃",
          matrix: [
            [1, 1],
            [2, 0],
          ],
        },
        {
          label: "W",
          matrix: [
            [2, 0],
            [0, 3],
          ],
        },
      ],
      expected: [
        [2, 3],
        [4, 0],
      ],
      shapeHint: "[2×2]@[2×2]",
      formulaHint: "행1:[2,3], 행2:[4,0]",
    },
    {
      id: "gnn-5",
      title: "3노드 평균",
      prompt: "균등 Â로 feature 평균에 가깝게. Â@X 계산.",
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
            [2],
            [4],
          ],
        },
      ],
      expected: [
        [3],
        [3],
      ],
      shapeHint: "[2×2]@[2×1]",
      formulaHint: "0.5·2+0.5·4=3",
    },
  ],
};
