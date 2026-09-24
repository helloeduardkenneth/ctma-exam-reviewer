import type { ExamVariant, EuropeTopic, GlobalTopic, Topic } from "../types";

export const ALL_TOPICS = "All topics" as const;
export type TopicSelection = Topic | typeof ALL_TOPICS;

export const GLOBAL_TOPICS: readonly GlobalTopic[] = [
  "Transaction Monitoring Fundamentals",
  "AML/BSA Compliance",
  "Alert Investigation & Disposition",
  "SAR Filing",
  "Risk-Based Approach",
  "KYC/CDD",
  "Financial Crime Typologies",
  "Regulatory Frameworks",
];

export const EUROPE_TOPICS: readonly EuropeTopic[] = [
  "Transaction Monitoring Fundamentals",
  "AML/EU Directive Compliance",
  "Alert Investigation & Disposition",
  "STR Filing",
  "Risk-Based Approach",
  "KYC/CDD",
  "Financial Crime Typologies",
  "Regulatory Frameworks",
];

export const TOPICS_BY_VARIANT = {
  global: GLOBAL_TOPICS,
  europe: EUROPE_TOPICS,
} as const;

export const TOPICS: readonly Topic[] = GLOBAL_TOPICS;

export function getEquivalentTopic(
  current: TopicSelection,
  toVariant: ExamVariant,
): TopicSelection {
  if (current === ALL_TOPICS) return ALL_TOPICS;

  if (toVariant === "europe") {
    if (current === "AML/BSA Compliance") return "AML/EU Directive Compliance";
    if (current === "SAR Filing") return "STR Filing";
    if (EUROPE_TOPICS.includes(current as EuropeTopic)) return current;
    return ALL_TOPICS;
  }

  if (toVariant === "global") {
    if (current === "AML/EU Directive Compliance") return "AML/BSA Compliance";
    if (current === "STR Filing") return "SAR Filing";
    if (GLOBAL_TOPICS.includes(current as GlobalTopic)) return current;
    return ALL_TOPICS;
  }

  return current;
}
