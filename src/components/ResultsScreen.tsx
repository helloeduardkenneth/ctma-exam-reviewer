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
      initial={reduceMotion ? false : { opacity: 0, transform: "translateY(8px)" }}
      animate={{ opacity: 1, transform: "translateY(0)" }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(-5px)" }}
      transition={{ duration: reduceMotion ? 0.1 : 0.22, ease: [0.23, 1, 0.32, 1] }}
      className="mx-auto w-full max-w-[920px] px-4 py-8 sm:px-6 sm:py-14"
    >
      <section className="rounded-2xl border border-line/70 bg-paper-raised p-6 shadow-[0_18px_48px_rgb(19_39_42/0.06)] sm:p-8">
        <div className="grid gap-8 border-b border-line pb-8 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-accent">Session complete</p>
            <h1 className="mt-4 max-w-xl text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] text-ink sm:text-[2.65rem]">
              {score.passed ? "You reached the practice target." : "A useful baseline. Keep going."}
            </h1>
            <p className="mt-4 max-w-[60ch] text-base leading-7 text-body">
              {score.passed
                ? "You met the 74% practice threshold. Use the breakdown to decide what deserves another pass."
                : "Review the lower-scoring areas below, then try a shorter focused session."}
            </p>
          </div>
          <div className="min-w-[9rem] border-l border-line pl-6 max-sm:border-l-0 max-sm:border-t max-sm:pl-0 max-sm:pt-6">
            <p className="text-[4.5rem] font-semibold leading-none tracking-[-0.06em] text-ink sm:text-[5.5rem]">
              {score.percentage}<span className="text-[0.38em] tracking-normal text-muted">%</span>
            </p>
            <p className="mt-2 text-sm font-medium tabular-nums text-muted">
              {score.correct} of {score.total} correct
            </p>
            <p className={`mt-3 text-xs font-bold ${score.passed ? "text-accent" : "text-review"}`}>
              {score.passed ? "Target met" : "Target: 74%"}
            </p>
          </div>
        </div>

        <div className="pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-ink">Where to focus next</h2>
              <p className="mt-1 text-sm text-muted">Compare performance across this session.</p>
            </div>
            <div className="inline-flex rounded-xl border border-line bg-[#eeece6] p-1" aria-label="Breakdown view">
              {(["domain", "topic"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value)}
                  aria-pressed={mode === value}
                  className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold outline-none transition-all focus-visible:ring-3 focus-visible:ring-focus ${
                    mode === value
                      ? "bg-paper-raised text-ink shadow-[0_1px_4px_rgb(19_39_42/0.1)]"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  By {value}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 divide-y divide-line border-y border-line">
            {rows.map((row) => (
              <div key={row.label} className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_140px_52px] sm:items-center sm:gap-5">
                <div>
                  <p className="font-semibold leading-snug text-ink">{row.label}</p>
                  <p className="mt-1 text-xs tabular-nums text-muted">
                    {row.correct} correct / {row.incorrect} incorrect
                  </p>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-line-strong" aria-hidden="true">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${row.percentage}%` }} />
                </div>
                <p className="text-right text-lg font-bold tabular-nums text-ink">{row.percentage}%</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onRetry}
            className="flex min-h-12 cursor-pointer items-center justify-center gap-3 rounded-xl border border-accent bg-accent px-5 py-3 font-semibold text-white shadow-[0_6px_16px_rgb(31_107_98/0.17)] transition-all duration-150 hover:border-accent-deep hover:bg-accent-deep active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus"
          >
            <span>Retry this focus</span><span aria-hidden="true">&rarr;</span>
          </button>
          <button
            type="button"
            onClick={onNewSession}
            className="flex min-h-12 cursor-pointer items-center justify-center gap-3 rounded-xl border border-line-strong bg-transparent px-5 py-3 font-semibold text-ink transition-all duration-150 hover:border-[#9daaa5] hover:bg-paper-raised/70 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus"
          >
            Choose a new focus
          </button>
        </div>

        <p className="mt-6 text-xs leading-5 text-muted">
          This score is a study estimate, not an official ACAMS result. The published CTMA passing standard is 74% of scored questions.
        </p>
      </section>
    </motion.main>
  );
}
