import type { AnswerRecord, BreakdownRow, Question } from "../types";

export const PASSING_RATIO = 0.74;

export function shuffleQuestions(
  source: readonly Question[],
  random: () => number = Math.random,
): Question[] {
  const shuffled = [...source];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

export function getScore(answers: readonly AnswerRecord[]) {
  const correct = answers.filter((answer) => answer.correct).length;
  const total = answers.length;
  const ratio = total === 0 ? 0 : correct / total;

  return {
    correct,
    total,
    ratio,
    percentage: Math.round(ratio * 100),
    passed: total > 0 && ratio >= PASSING_RATIO,
  };
}

export function buildBreakdown(
  questions: readonly Question[],
  answers: readonly AnswerRecord[],
  groupBy: "domain" | "topic",
): BreakdownRow[] {
  const answerById = new Map(
    answers.map((answer) => [answer.questionId, answer]),
  );
  const groups = new Map<string, { correct: number; total: number }>();

  questions.forEach((question) => {
    const answer = answerById.get(question.id);
    if (!answer) return;

    const label = question[groupBy];
    const group = groups.get(label) ?? { correct: 0, total: 0 };
    group.total += 1;
    group.correct += answer.correct ? 1 : 0;
    groups.set(label, group);
  });

  return [...groups.entries()].map(([label, value]) => ({
    label,
    correct: value.correct,
    incorrect: value.total - value.correct,
    total: value.total,
    percentage: Math.round((value.correct / value.total) * 100),
  }));
}
