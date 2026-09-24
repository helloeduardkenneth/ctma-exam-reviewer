import type { Topic } from "../types";

export const ALL_TOPICS = "All topics" as const;
export type TopicSelection = Topic | typeof ALL_TOPICS;

export const TOPICS: readonly Topic[] = [
  "Transaction Monitoring Fundamentals",
  "AML/BSA Compliance",
  "Alert Investigation & Disposition",
  "SAR Filing",
  "Risk-Based Approach",
  "KYC/CDD",
  "Financial Crime Typologies",
  "Regulatory Frameworks",
];
