export type Domain =
  | "Role of Transaction Monitoring in Financial Crime Prevention"
  | "Transaction Monitoring Alert Generation"
  | "Alert Investigation"
  | "Outcomes of Transaction Monitoring Investigations";

export type Topic =
  | "Transaction Monitoring Fundamentals"
  | "AML/BSA Compliance"
  | "Alert Investigation & Disposition"
  | "SAR Filing"
  | "Risk-Based Approach"
  | "KYC/CDD"
  | "Financial Crime Typologies"
  | "Regulatory Frameworks";

export interface Question {
  id: number;
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
