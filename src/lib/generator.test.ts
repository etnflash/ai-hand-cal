import { describe, expect, it } from "vitest";
import { lessons } from "@/content/lessons";
import { generateExercise } from "@/lib/generator";

describe("generateExercise", () => {
  it("returns an exercise for every lesson kind", () => {
    for (const lesson of lessons) {
      const ex = generateExercise(lesson, "unit-seed", { difficulty: "medium" });
      expect(ex, `null for ${lesson.slug}/${lesson.kind}`).not.toBeNull();
      expect(ex!.expected.length).toBeGreaterThan(0);
      expect(ex!.inputs.length).toBeGreaterThan(0);
    }
  });

  it("changes when seed changes", () => {
    const lesson = lessons.find((l) => l.slug === "matmul")!;
    const a = generateExercise(lesson, "a", { difficulty: "easy" });
    const b = generateExercise(lesson, "b", { difficulty: "easy" });
    expect(a!.expected).not.toEqual(b!.expected);
  });
});
