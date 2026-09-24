import { describe, expect, it } from "vitest";
import { questions } from "../data/questions";
import type { AnswerRecord } from "../types";
import { buildBreakdown, getScore, shuffleQuestions } from "./study";

describe("study utilities", () => {
  it("shuffles without changing membership or the source array", () => {
    const source = questions.slice(0, 5);
    const originalIds = source.map((question) => question.id);
    const shuffled = shuffleQuestions(source, () => 0);

    expect(shuffled.map((question) => question.id)).not.toEqual(originalIds);
    expect([...shuffled.map((question) => question.id)].sort((a, b) => a - b)).toEqual(originalIds);
    expect(source.map((question) => question.id)).toEqual(originalIds);
  });

  it("uses the unrounded 74% passing boundary", () => {
    const passing = Array.from({ length: 50 }, (_, index): AnswerRecord => ({
      questionId: index + 1,
      selectedIndex: 0,
      correct: index < 37,
    }));
    const failing = passing.map((answer, index) => ({
      ...answer,
      correct: index < 36,
    }));

    expect(getScore(passing)).toMatchObject({ percentage: 74, passed: true });
    expect(getScore(failing)).toMatchObject({ percentage: 72, passed: false });
  });

  it("builds correct and incorrect totals for represented groups", () => {
    const sample = questions.slice(0, 3);
    const answers: AnswerRecord[] = sample.map((question, index) => ({
      questionId: question.id,
      selectedIndex: index === 0 ? question.correctIndex : (question.correctIndex + 1) % 4,
      correct: index === 0,
    }));
    const rows = buildBreakdown(sample, answers, "topic");

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ correct: 1, incorrect: 2, total: 3, percentage: 33 });
  });
});
