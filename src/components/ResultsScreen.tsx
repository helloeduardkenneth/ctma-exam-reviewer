import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { buildBreakdown, getScore } from "../lib/study";
import type { AnswerRecord, Question } from "../types";

interface ResultsScreenProps {
  questions: readonly Question[];
  answers: readonly AnswerRecord[];
  onRetry: () => void;
  onNewSession: () => void;
}

type BreakdownMode = "domain" | "topic";

export function ResultsScreen({
  questions,
  answers,
  onRetry,
  onNewSession,
}: ResultsScreenProps) {
  const [mode, setMode] = useState<BreakdownMode>("domain");
  const reduceMotion = useReducedMotion();
  const score = useMemo(() => getScore(answers), [answers]);
  const rows = useMemo(
    () => buildBreakdown(questions, answers, mode),
    [answers, mode, questions],
  );

  return (
    <motion.main
      id="main-content"
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
      transition={{ duration: reduceMotion ? 0.1 : 0.42, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12"
    >
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,41,51,0.08)] sm:p-9">
        <p className="text-sm font-semibold text-teal-800">Session complete</p>
        <div className="mt-3 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              {score.passed ? "Practice target reached" : "Keep building your recall"}
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">
              {score.passed
                ? "You met the 74% CTMA practice threshold for this session."
                : "Review the weaker areas below, then try another focused session."}
            </p>
          </div>
          <div className="shrink-0 sm:text-right">
            <p className="text-6xl font-semibold tracking-[-0.07em] text-slate-950">{score.percentage}%</p>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {score.correct} of {score.total} correct
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-slate-950">Performance breakdown</h2>
            <div className="inline-flex w-fit rounded-2xl bg-slate-100 p-1" aria-label="Breakdown view">
              {(["domain", "topic"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value)}
                  aria-pressed={mode === value}
                  className={`rounded-xl px-3.5 py-2 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-teal-700 ${
                    mode === value ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  By {value}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {rows.map((row) => (
              <div
                key={row.label}
                className="grid gap-2 rounded-2xl bg-slate-50 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div>
                  <p className="font-semibold leading-snug text-slate-800">{row.label}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {row.correct} correct, {row.incorrect} incorrect
                  </p>
                </div>
                <p className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">{row.percentage}%</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onRetry}
            className="min-h-12 rounded-2xl bg-teal-700 px-5 py-3 font-semibold text-white transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/25 active:translate-y-px"
          >
            Retry this focus
          </button>
          <button
            type="button"
            onClick={onNewSession}
            className="min-h-12 rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/20 active:translate-y-px"
          >
            Choose a new focus
          </button>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-slate-500">
          This score is a study estimate, not an official ACAMS result. The published CTMA passing standard is 74% of scored questions.
        </p>
      </section>
    </motion.main>
  );
}
