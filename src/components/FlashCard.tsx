import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Question } from "../types";

interface FlashCardProps {
  question: Question;
  selectedIndex: number | null;
  revealed: boolean;
  isLast: boolean;
  onSelect: (index: number) => void;
  onReveal: () => void;
  onNext: () => void;
}

const CHOICE_LABELS = ["A", "B", "C", "D"] as const;

export function FlashCard({
  question,
  selectedIndex,
  revealed,
  isLast,
  onSelect,
  onReveal,
  onNext,
}: FlashCardProps) {
  const reduceMotion = useReducedMotion();
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const answerHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    questionHeadingRef.current?.focus();
  }, [question.id]);

  useEffect(() => {
    if (revealed) answerHeadingRef.current?.focus();
  }, [revealed]);

  const isCorrect = selectedIndex === question.correctIndex;

  return (
    <div className="card-perspective">
      <motion.article
        className="card-stage relative min-h-[610px] w-full sm:min-h-[560px]"
        animate={
          reduceMotion
            ? { opacity: revealed ? 0.985 : 1 }
            : { rotateY: revealed ? 180 : 0 }
        }
        transition={
          reduceMotion
            ? { duration: 0.12 }
            : { duration: 0.62, ease: [0.16, 1, 0.3, 1] }
        }
      >
        <section
          className={`card-face absolute inset-0 flex flex-col rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,41,51,0.10)] sm:p-8 ${
            reduceMotion && revealed ? "invisible" : ""
          }`}
          aria-hidden={revealed}
        >
          <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-teal-800">
            <span className="rounded-full bg-teal-50 px-3 py-1.5">{question.topic}</span>
          </div>

          <h2
            ref={questionHeadingRef}
            tabIndex={-1}
            className="text-balance text-xl font-semibold leading-snug tracking-[-0.02em] text-slate-950 outline-none sm:text-2xl"
          >
            {question.question}
          </h2>

          <div
            className="mt-6 grid gap-3"
            role="radiogroup"
            aria-label="Answer choices"
          >
            {question.choices.map((choice, index) => {
              const selected = selectedIndex === index;

              return (
                <button
                  key={choice}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={selectedIndex !== null}
                  tabIndex={revealed ? -1 : 0}
                  onClick={() => onSelect(index)}
                  className={`group flex min-h-14 items-start gap-3 rounded-2xl border p-3.5 text-left text-sm leading-relaxed outline-none transition active:scale-[0.99] motion-reduce:transition-none sm:text-base ${
                    selected
                      ? "border-teal-700 bg-teal-50 text-slate-950 ring-2 ring-teal-700/10"
                      : "border-slate-200 bg-slate-50/60 text-slate-700 hover:border-slate-400 hover:bg-white focus-visible:border-teal-700 focus-visible:ring-4 focus-visible:ring-teal-700/10 disabled:cursor-default disabled:hover:border-slate-200 disabled:hover:bg-slate-50/60"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border text-xs font-bold ${
                      selected
                        ? "border-teal-700 bg-teal-700 text-white"
                        : "border-slate-300 bg-white text-slate-600 group-hover:border-slate-400"
                    }`}
                  >
                    {CHOICE_LABELS[index]}
                  </span>
                  <span className="pt-0.5">{choice}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-auto pt-6">
            <button
              type="button"
              onClick={onReveal}
              disabled={selectedIndex === null}
              tabIndex={revealed ? -1 : 0}
              className="min-h-12 w-full rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/25 active:translate-y-px disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 motion-reduce:transition-none"
            >
              {selectedIndex === null ? "Choose an answer to continue" : "Reveal answer"}
            </button>
          </div>
        </section>

        <section
          className={`card-face card-back absolute inset-0 flex flex-col rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,41,51,0.10)] sm:p-8 ${
            reduceMotion && !revealed ? "invisible" : ""
          }`}
          style={reduceMotion ? { transform: "none" } : undefined}
          aria-hidden={!revealed}
        >
          <div
            className={`mb-5 inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-bold ${
              isCorrect ? "bg-teal-50 text-teal-800" : "bg-rose-50 text-rose-800"
            }`}
          >
            {isCorrect ? "Correct" : "Review this one"}
          </div>

          <h2
            ref={answerHeadingRef}
            tabIndex={-1}
            className="text-xl font-semibold tracking-[-0.02em] text-slate-950 outline-none sm:text-2xl"
          >
            Answer and explanation
          </h2>

          <dl className="mt-6 space-y-5">
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Correct answer</dt>
              <dd className="mt-2 text-base font-semibold leading-relaxed text-teal-800">
                {CHOICE_LABELS[question.correctIndex]}. {question.choices[question.correctIndex]}
              </dd>
            </div>
            {!isCorrect && selectedIndex !== null && (
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Your answer</dt>
                <dd className="mt-2 text-base leading-relaxed text-slate-700">
                  {CHOICE_LABELS[selectedIndex]}. {question.choices[selectedIndex]}
                </dd>
              </div>
            )}
            <div className="border-t border-slate-200 pt-5">
              <dt className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Why it matters</dt>
              <dd className="mt-2 text-base leading-relaxed text-slate-700">{question.explanation}</dd>
            </div>
          </dl>

          <div className="mt-auto pt-6">
            <button
              type="button"
              onClick={onNext}
              tabIndex={revealed ? 0 : -1}
              className="min-h-12 w-full rounded-2xl bg-teal-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/25 active:translate-y-px motion-reduce:transition-none"
            >
              {isLast ? "View results" : "Next question"}
            </button>
          </div>
        </section>
      </motion.article>

      <p className="sr-only" aria-live="polite">
        {revealed
          ? `${isCorrect ? "Correct." : "Incorrect."} The correct answer is ${question.choices[question.correctIndex]}.`
          : ""}
      </p>
    </div>
  );
}
