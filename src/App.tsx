import { useMemo, useState, useTransition } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FlashCard } from "./components/FlashCard";
import { ProgressBar } from "./components/ProgressBar";
import { ResultsScreen } from "./components/ResultsScreen";
import { ShuffleToggle } from "./components/ShuffleToggle";
import { TopicFilter } from "./components/TopicFilter";
import { VariantSelector } from "./components/VariantSelector";
import { questionsByVariant } from "./data/questions";
import {
  ALL_TOPICS,
  TOPICS_BY_VARIANT,
  getEquivalentTopic,
  type TopicSelection,
} from "./data/topics";
import { getScore, shuffleQuestions } from "./lib/study";
import type { AnswerRecord, AppView, ExamVariant, Question } from "./types";

const DOMAIN_WEIGHTS = [
  ["Foundations", "20%", "#9ee6d7"],
  ["Alert generation", "15%", "#5fc6b2"],
  ["Investigation", "40%", "#f3c766"],
  ["Outcomes", "25%", "#e37d5e"],
] as const;

const pageMotion = {
  initial: { opacity: 0, transform: "translateY(8px)" },
  animate: { opacity: 1, transform: "translateY(0)" },
  exit: { opacity: 0, transform: "translateY(-5px)" },
  transition: { duration: 0.22, ease: [0.23, 1, 0.32, 1] },
} as const;

function App() {
  const [view, setView] = useState<AppView>("setup");
  const [variant, setVariant] = useState<ExamVariant>("global");
  const [topic, setTopic] = useState<TopicSelection>(ALL_TOPICS);
  const [shuffle, setShuffle] = useState(true);
  const [deck, setDeck] = useState<readonly Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [isPending, startTransition] = useTransition();
  const reduceMotion = useReducedMotion();

  function handleVariantChange(nextVariant: ExamVariant) {
    if (nextVariant === variant) return;
    setVariant(nextVariant);
    setTopic((prev) => getEquivalentTopic(prev, nextVariant));
  }

  const variantQuestions = useMemo(
    () => questionsByVariant[variant],
    [variant],
  );

  const availableTopics = useMemo(
    () => TOPICS_BY_VARIANT[variant],
    [variant],
  );

  const availableQuestions = useMemo(
    () =>
      topic === ALL_TOPICS
        ? variantQuestions
        : variantQuestions.filter((question) => question.topic === topic),
    [variantQuestions, topic],
  );

  const score = useMemo(() => getScore(answers), [answers]);
  const currentQuestion = deck[currentIndex];

  function beginSession() {
    startTransition(() => {
      const nextDeck = shuffle
        ? shuffleQuestions(availableQuestions)
        : [...availableQuestions];

      setDeck(nextDeck);
      setCurrentIndex(0);
      setSelectedIndex(null);
      setRevealed(false);
      setAnswers([]);
      setView("study");
    });
  }

  function revealAnswer() {
    if (!currentQuestion || selectedIndex === null || revealed) return;

    setAnswers((current) => [
      ...current,
      {
        questionId: currentQuestion.id,
        selectedIndex,
        correct: selectedIndex === currentQuestion.correctIndex,
      },
    ]);
    setRevealed(true);
  }

  function advance() {
    if (currentIndex === deck.length - 1) {
      setView("results");
      return;
    }

    setCurrentIndex((index) => index + 1);
    setSelectedIndex(null);
    setRevealed(false);
  }

  function chooseNewFocus() {
    setView("setup");
    setDeck([]);
    setCurrentIndex(0);
    setSelectedIndex(null);
    setRevealed(false);
    setAnswers([]);
  }

  const motionProps = reduceMotion
    ? {
        initial: false as const,
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.12 },
      }
    : pageMotion;

  return (
    <div className="min-h-[100dvh] bg-paper text-ink font-sans">
      <a
        href="#main-content"
        className="sr-only rounded-lg bg-ink px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to main content
      </a>

      <header className="border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <button
            type="button"
            onClick={chooseNewFocus}
            className="-ml-2 flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-left outline-none transition-all duration-150 hover:bg-ink/5 active:scale-[0.98] focus-visible:ring-3 focus-visible:ring-focus"
            aria-label="Return to session setup"
          >
            <span>
              <span className="block text-[15px] font-semibold tracking-tight text-ink">CTMA Practice</span>
              <span className="block text-[11px] font-medium text-muted">Independent study</span>
            </span>
          </button>

          {view === "setup" && (
            <p className="hidden text-sm text-muted sm:block">
              120 practice questions &bull; {variant === "europe" ? "Europe Edition" : "Global Edition"}
            </p>
          )}

          {view === "study" && (
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-muted" aria-label="Session in progress">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent ring-4 ring-accent-soft" />
              Practice mode ({variant === "europe" ? "Europe" : "Global"})
            </div>
          )}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {view === "setup" && (
          <motion.main
            key="setup"
            id="main-content"
            {...motionProps}
            className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:py-12"
          >
            <section className="relative overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_8%_0%,rgb(56_137_124/0.55),transparent_32rem),linear-gradient(135deg,var(--color-hero)_0%,var(--color-hero-deep)_100%)] p-6 sm:p-10 lg:p-12 text-hero-ink after:pointer-events-none after:absolute after:-bottom-44 after:-right-36 after:h-[25rem] after:w-[25rem] after:rounded-full after:border after:border-[#9ee6d7]/15">
              <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)] lg:items-center lg:gap-14">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#9ee6d7]">
                    CTMA practice reviewer &bull; {variant === "europe" ? "Europe Edition" : "Global Edition"}
                  </p>
                  <h1 className="mt-5 max-w-3xl text-balance text-[clamp(2.55rem,5.4vw,4.75rem)] font-semibold leading-[1.02] tracking-tight text-hero-ink">
                    {variant === "europe"
                      ? "Master European CTMA standards with confidence."
                      : "Prepare for CTMA with sharper judgment."}
                  </h1>
                  <p className="mt-5 max-w-[60ch] text-base font-normal leading-7 text-hero-body sm:text-lg">
                    {variant === "europe"
                      ? "Train transaction monitoring decisions with 60 Europe-focused questions covering EU AML Directives (4AMLD–6AMLD), AMLA, EBA guidelines, and national FIU STR filings."
                      : "Train the decisions behind transaction monitoring alerts with 60 original questions mapped to the public ACAMS blueprint."}
                  </p>

                  <div
                    className="relative mt-7 grid max-w-[31rem] grid-cols-3 text-[0.72rem] font-semibold text-hero-body"
                    aria-label="Transaction monitoring review flow"
                  >
                    <div
                      aria-hidden="true"
                      className="absolute left-[5px] top-[5px] h-px w-[66.67%] bg-[#9ee6d7]/35"
                    />
                    <span className="relative grid gap-2.5">
                      <i
                        aria-hidden="true"
                        className="relative z-10 h-2.5 w-2.5 rounded-full border-2 border-hero bg-[#9ee6d7] shadow-[0_0_0_2px_rgb(158_230_215/0.28)]"
                      />
                      Detect
                    </span>
                    <span className="relative grid gap-2.5">
                      <i
                        aria-hidden="true"
                        className="relative z-10 h-2.5 w-2.5 rounded-full border-2 border-hero bg-[#9ee6d7] shadow-[0_0_0_2px_rgb(158_230_215/0.28)]"
                      />
                      Investigate
                    </span>
                    <span className="relative grid gap-2.5">
                      <i
                        aria-hidden="true"
                        className="relative z-10 h-2.5 w-2.5 rounded-full border-2 border-hero bg-[#9ee6d7] shadow-[0_0_0_2px_rgb(158_230_215/0.28)]"
                      />
                      Decide
                    </span>
                  </div>

                  <div className="mt-8 max-w-[42rem] border-t border-white/15 pt-5">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <h2 className="text-sm font-semibold text-hero-ink">
                        Exam blueprint coverage ({variant === "europe" ? "Europe" : "Global"})
                      </h2>
                      <span className="text-xs text-hero-muted">60 questions</span>
                    </div>
                    <div className="flex h-2 gap-0.5 overflow-hidden rounded-full bg-white/12" aria-hidden="true">
                      {DOMAIN_WEIGHTS.map(([label, weight, color]) => (
                        <span key={label} style={{ width: weight, backgroundColor: color }} />
                      ))}
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4">
                      {DOMAIN_WEIGHTS.map(([label, weight, color]) => (
                        <div key={label}>
                          <dt className="flex items-start gap-2 text-[0.68rem] leading-relaxed text-hero-muted">
                            <span aria-hidden="true" className="mt-0.5 h-2 w-2 shrink-0 rounded-xs" style={{ backgroundColor: color }} />
                            {label}
                          </dt>
                          <dd className="mt-1 pl-4 text-[0.82rem] font-semibold tabular-nums text-hero-ink">{weight}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>

                <section className="rounded-2xl bg-paper-raised p-6 text-ink shadow-[0_28px_70px_rgb(2_24_22/0.34)] sm:p-8" aria-labelledby="session-title">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <h2 id="session-title" className="text-xl font-semibold tracking-tight text-ink">
                        Build your session
                      </h2>
                      <p className="mt-1.5 text-sm leading-6 text-muted">
                        Choose an edition and focus, then start when ready.
                      </p>
                    </div>
                    <span className="grid h-11 min-w-[2.75rem] place-items-center rounded-full bg-accent-soft px-2.5 text-sm font-extrabold tabular-nums text-accent-deep" aria-label={`${availableQuestions.length} questions`}>
                      {availableQuestions.length}
                    </span>
                  </div>

                  <div className="mt-7 space-y-5">
                    <VariantSelector value={variant} onChange={handleVariantChange} />
                    <TopicFilter value={topic} topics={availableTopics} onChange={setTopic} />
                    <ShuffleToggle checked={shuffle} onChange={setShuffle} />
                  </div>

                  <div className="mt-7 flex items-center justify-between border-t border-line pt-5 text-sm">
                    <span className="text-muted">Practice target</span>
                    <span className="font-semibold text-ink">74% or higher</span>
                  </div>

                  <button
                    type="button"
                    onClick={beginSession}
                    disabled={isPending || availableQuestions.length === 0}
                    className="mt-5 flex min-h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-accent bg-accent px-5 py-3 font-semibold text-white shadow-[0_6px_16px_rgb(31_107_98/0.17)] transition-all duration-150 hover:border-accent-deep hover:bg-accent-deep active:scale-[0.98] disabled:cursor-not-allowed disabled:border-line-strong disabled:bg-line-strong disabled:text-[#61706d] disabled:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus"
                  >
                    <span>{isPending ? "Preparing session" : `Start ${availableQuestions.length}-question session`}</span>
                    {!isPending && <span aria-hidden="true">&rarr;</span>}
                  </button>
                </section>
              </div>
            </section>

            <section className="mt-8 grid gap-8 border-b border-line py-9 lg:grid-cols-[minmax(240px,0.75fr)_minmax(0,1.25fr)] lg:items-start lg:gap-14" aria-labelledby="rhythm-title">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-accent">Built for deliberate practice</p>
                <h2 id="rhythm-title" className="mt-3 max-w-md text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  A review loop that keeps you thinking.
                </h2>
              </div>
              <ol className="grid gap-6 sm:grid-cols-3">
                <li className="flex gap-4 border-t border-line pt-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent-deep">1</span>
                  <div>
                    <strong className="text-sm font-semibold text-ink">Choose</strong>
                    <p className="mt-1 max-w-[32ch] text-[0.78rem] leading-relaxed text-muted">Commit to one answer before seeing the explanation.</p>
                  </div>
                </li>
                <li className="flex gap-4 border-t border-line pt-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent-deep">2</span>
                  <div>
                    <strong className="text-sm font-semibold text-ink">Check</strong>
                    <p className="mt-1 max-w-[32ch] text-[0.78rem] leading-relaxed text-muted">Compare your judgment with the best response.</p>
                  </div>
                </li>
                <li className="flex gap-4 border-t border-line pt-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent-deep">3</span>
                  <div>
                    <strong className="text-sm font-semibold text-ink">Refine</strong>
                    <p className="mt-1 max-w-[32ch] text-[0.78rem] leading-relaxed text-muted">Use topic results to target the next session.</p>
                  </div>
                </li>
              </ol>
            </section>

            <p className="mt-9 max-w-3xl border-t border-line pt-5 text-xs leading-5 text-muted">
              Independent study tool. Not affiliated with or endorsed by ACAMS or Pearson VUE. Questions are original and do not reproduce certification exam content.
            </p>
          </motion.main>
        )}

        {view === "study" && currentQuestion && (
          <motion.main
            key="study"
            id="main-content"
            {...motionProps}
            className="mx-auto flex min-h-[calc(100dvh-68px)] w-full max-w-[1120px] flex-col justify-center px-4 py-6 sm:px-6 sm:py-8 max-sm:min-h-auto"
          >
            <div className="my-auto w-full">
              <ProgressBar
                current={currentIndex + 1}
                total={deck.length}
                correct={score.correct}
                answered={answers.length}
                domain={currentQuestion.domain}
              />
              <div className="mt-4">
                <FlashCard
                  key={currentQuestion.id}
                  question={currentQuestion}
                  selectedIndex={selectedIndex}
                  revealed={revealed}
                  isLast={currentIndex === deck.length - 1}
                  onSelect={(index) => {
                    if (selectedIndex === null) setSelectedIndex(index);
                  }}
                  onReveal={revealAnswer}
                  onNext={advance}
                />
              </div>
            </div>
          </motion.main>
        )}

        {view === "results" && (
          <ResultsScreen
            key="results"
            questions={deck}
            answers={answers}
            onRetry={beginSession}
            onNewSession={chooseNewFocus}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
