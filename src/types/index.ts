export type ExamVariant = "global" | "europe";

export type Domain =
  | "Role of Transaction Monitoring in Financial Crime Prevention"
  | "Transaction Monitoring Alert Generation"
  | "Alert Investigation"
  | "Outcomes of Transaction Monitoring Investigations";

export type GlobalTopic =
  | "Transaction Monitoring Fundamentals"
  | "AML/BSA Compliance"
  | "Alert Investigation & Disposition"
  | "SAR Filing"
  | "Risk-Based Approach"
  | "KYC/CDD"
  | "Financial Crime Typologies"
  | "Regulatory Frameworks";

export type EuropeTopic =
  | "Transaction Monitoring Fundamentals"
  | "AML/EU Directive Compliance"
  | "Alert Investigation & Disposition"
  | "STR Filing"
  | "Risk-Based Approach"
  | "KYC/CDD"
  | "Financial Crime Typologies"
  | "Regulatory Frameworks";

export type Topic = GlobalTopic | EuropeTopic;

export interface Question {
  id: number;
  variant?: ExamVariant;
  domain: Domain;
  topic: Topic;
  question: string;
  choices: readonly [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface AnswerRecord {
  questionId: number;
  selectedIndex: number;
  correct: boolean;
}

export interface BreakdownRow {
  label: string;
  correct: number;
  incorrect: number;
  total: number;
  percentage: number;
}

export type AppView = "setup" | "study" | "results";
