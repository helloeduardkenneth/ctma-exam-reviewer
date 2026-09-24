import { describe, expect, it } from "vitest";
import { questions } from "./questions";

describe("question bank", () => {
  it("contains 60 unique, valid four-choice questions", () => {
    expect(questions).toHaveLength(60);
    expect(new Set(questions.map((question) => question.id)).size).toBe(60);

    questions.forEach((question) => {
      expect(question.choices).toHaveLength(4);
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(4);
      expect(question.question.length).toBeGreaterThan(20);
      expect(question.explanation.length).toBeGreaterThan(30);
    });
  });

  it("matches the official-domain allocation", () => {
    const counts = Object.groupBy(questions, (question) => question.domain);

    expect(counts["Role of Transaction Monitoring in Financial Crime Prevention"]).toHaveLength(12);
    expect(counts["Transaction Monitoring Alert Generation"]).toHaveLength(9);
    expect(counts["Alert Investigation"]).toHaveLength(24);
    expect(counts["Outcomes of Transaction Monitoring Investigations"]).toHaveLength(15);
  });

  it("matches the study-topic allocation", () => {
    const counts = Object.groupBy(questions, (question) => question.topic);

    expect(counts["Transaction Monitoring Fundamentals"]).toHaveLength(8);
    expect(counts["AML/BSA Compliance"]).toHaveLength(7);
    expect(counts["Alert Investigation & Disposition"]).toHaveLength(12);
    expect(counts["SAR Filing"]).toHaveLength(7);
    expect(counts["Risk-Based Approach"]).toHaveLength(6);
    expect(counts["KYC/CDD"]).toHaveLength(6);
    expect(counts["Financial Crime Typologies"]).toHaveLength(8);
    expect(counts["Regulatory Frameworks"]).toHaveLength(6);
  });
});
