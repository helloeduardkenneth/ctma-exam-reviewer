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
    <div className="perspective-card">
      <motion.article
        className="preserve-3d grid w-full will-change-transform"
        animate={
          reduceMotion
            ? { opacity: revealed ? 0.99 : 1 }
            : { transform: revealed ? "rotateY(180deg)" : "rotateY(0deg)" }
        }
        transition={
          reduceMotion
            ? { duration: 0.1 }
            : { duration: 0.38, ease: [0.23, 1, 0.32, 1] }
        }
      >
        <section
          className={`backface-hidden row-start-1 col-start-1 flex min-h-[590px] flex-col rounded-2xl border border-line/70 bg-paper-raised p-5 shadow-[0_22px_54px_rgb(19_39_42/0.12)] sm:p-8 lg:p-10 ${reduceMotion && revealed ? "invisible" : ""}`}
          aria-hidden={revealed}
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <span className="max-w-[min(78%,32rem)] truncate text-[0.73rem] font-bold leading-tight text-accent-deep">
              {question.topic}
            </span>
            <span className="text-xs font-semibold text-muted">Choose one</span>
          </div>

          <h2
            ref={questionHeadingRef}
            tabIndex={-1}
            className="max-w-[34ch] text-balance text-[1.45rem] font-semibold leading-[1.35] tracking-[-0.025em] text-ink outline-none sm:text-[1.8rem]"
          >
            {question.question}
          </h2>

          <div className="mt-8 grid gap-3" role="radiogroup" aria-label="Answer choices">
            {question.choices.map((choice, index) => {
              const selected = selectedIndex === index;
              const isLocked = selectedIndex !== null && !selected;
              return (
                <label
                  key={choice}
                  className={`flex min-h-[4.5rem] items-center gap-3.5 sm:gap-4 rounded-xl border p-4 sm:px-4.5 sm:py-3.5 text-base font-medium leading-relaxed transition-all duration-150 max-sm:min-h-[4.2rem] max-sm:p-3.5 ${
                    selected
                      ? "border-accent bg-accent-soft text-ink shadow-[0_5px_16px_rgb(31_107_98/0.12)]"
                      : isLocked
                        ? "cursor-default border-line-strong bg-[#faf8f2] text-[#697875] opacity-70"
                        : "cursor-pointer border-line-strong bg-[#faf8f2] text-body hover:-translate-y-px hover:border-accent hover:bg-paper-raised hover:shadow-[0_7px_18px_rgb(19_39_42/0.08)] active:scale-[0.98]"
                  } has-[:focus-visible]:border-accent has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-focus`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={index}
                    checked={selected}
                    disabled={selectedIndex !== null || revealed}
                    onChange={() => onSelect(index)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={`grid h-[2.15rem] w-[2.15rem] shrink-0 place-items-center rounded-[0.6rem] border text-xs font-bold transition-colors ${
                      selected
                        ? "border-accent bg-accent text-white"
                        : "border-line-strong bg-paper-raised text-muted"
                    }`}
                  >
                    {CHOICE_LABELS[index]}
                  </span>
                  <span className="min-w-0 pt-0.5">{choice}</span>
                  {selected && (
                    <span className="ml-auto text-[0.68rem] font-bold uppercase tracking-wider text-accent-deep max-sm:hidden">
                      Selected
                    </span>
                  )}
                </label>
              );
            })}
          </div>

          <div className="mt-auto pt-7" aria-live="polite">
            {selectedIndex === null ? (
              <div className="flex min-h-[3.5rem] items-center gap-3 border-t border-line pt-4 text-[0.78rem] leading-relaxed text-muted">
                <span
                  aria-hidden="true"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent-deep"
                >
                  ?
                </span>
                <p>
                  <strong className="font-semibold text-body">Select one response.</strong> You will review the correct answer and explanation next.
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={onReveal}
                tabIndex={revealed ? -1 : 0}
                className="flex min-h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-ink bg-ink px-5 py-3 font-semibold text-white transition-all duration-150 hover:bg-[#244044] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus"
              >
                <span>Review answer</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            )}
          </div>
        </section>

        <section
          className={`backface-hidden rotate-y-180 row-start-1 col-start-1 flex min-h-[590px] flex-col rounded-2xl border border-line/70 bg-paper-raised p-5 shadow-[0_22px_54px_rgb(19_39_42/0.12)] sm:p-8 lg:p-10 ${reduceMotion && !revealed ? "invisible" : ""}`}
          style={reduceMotion ? { transform: "none" } : undefined}
          aria-hidden={!revealed}
        >
          <div
            className={`inline-flex w-fit items-center gap-2 text-xs font-extrabold ${
              isCorrect ? "text-accent-deep" : "text-review"
            }`}
          >
            <span
              className={`grid h-7 w-7 place-items-center rounded-full text-[0.62rem] font-bold tracking-tight ${
                isCorrect ? "bg-accent-soft" : "bg-review-soft"
              }`}
              aria-hidden="true"
            >
              {isCorrect ? "OK" : "!"}
            </span>
            <span>{isCorrect ? "Correct answer" : "Worth another look"}</span>
          </div>

          <h2
            ref={answerHeadingRef}
            tabIndex={-1}
            className="mt-6 text-[1.45rem] font-semibold tracking-[-0.025em] text-ink outline-none sm:text-[1.75rem]"
          >
            {CHOICE_LABELS[question.correctIndex]}. {question.choices[question.correctIndex]}
          </h2>

          {!isCorrect && selectedIndex !== null && (
            <p className="mt-4 text-sm leading-6 text-muted">
              You chose <span className="font-semibold text-body">{CHOICE_LABELS[selectedIndex]}. {question.choices[selectedIndex]}</span>
            </p>
          )}

          <div className="mt-7 border-t border-line pt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-accent">Explanation</p>
            <p className="mt-3 max-w-[68ch] text-base leading-7 text-body">{question.explanation}</p>
          </div>

          <div className="mt-auto pt-8">
            <button
              type="button"
              onClick={onNext}
              tabIndex={revealed ? 0 : -1}
              className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-accent bg-accent px-5 py-3 font-semibold text-white shadow-[0_6px_16px_rgb(31_107_98/0.17)] transition-all duration-150 hover:border-accent-deep hover:bg-accent-deep active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus"
            >
              <span>{isLast ? "View results" : "Continue"}</span>
              <span aria-hidden="true">&rarr;</span>
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
