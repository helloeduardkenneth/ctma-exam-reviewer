import { useMemo, useState, useTransition } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FlashCard } from "./components/FlashCard";
import { ProgressBar } from "./components/ProgressBar";
import { ResultsScreen } from "./components/ResultsScreen";
import { ShuffleToggle } from "./components/ShuffleToggle";
import { TopicFilter } from "./components/TopicFilter";
import { questions } from "./data/questions";
import { ALL_TOPICS, type TopicSelection } from "./data/topics";
import { getScore, shuffleQuestions } from "./lib/study";
import type { AnswerRecord, AppView, Question } from "./types";

const DOMAIN_WEIGHTS = [
  ["Monitoring foundations", "20%"],
  ["Alert generation", "15%"],
  ["Alert investigation", "40%"],
  ["Investigation outcomes", "25%"],
] as const;

function App() {
  const [view, setView] = useState<AppView>("setup");
  const [topic, setTopic] = useState<TopicSelection>(ALL_TOPICS);
  const [shuffle, setShuffle] = useState(true);
  const [deck, setDeck] = useState<readonly Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [isPending, startTransition] = useTransition();
  const reduceMotion = useReducedMotion();

  const availableQuestions = useMemo(
    () =>
      topic === ALL_TOPICS
        ? questions
        : questions.filter((question) => question.topic === topic),
    [topic],
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

  return (
    <div className="min-h-[100dvh] bg-[#f3f7f6] text-slate-900">
      <a
        href="#main-content"
        className="sr-only rounded-xl bg-slate-950 px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to main content
      </a>

      <header className="border-b border-slate-200/80 bg-[#f3f7f6]/95">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <button
            type="button"
            onClick={chooseNewFocus}
            className="rounded-xl text-left outline-none focus-visible:ring-4 focus-visible:ring-teal-700/20"
            aria-label="Return to session setup"
          >
            <span className="block text-sm font-bold tracking-[-0.01em] text-slate-950">CTMA Practice</span>
            <span className="block text-xs text-slate-500">Independent reviewer</span>
          </button>
          {view === "study" && (
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">{score.correct} correct</p>
              <p className="text-xs text-slate-500">{answers.length} answered</p>
            </div>
          )}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {view === "setup" && (
          <motion.main
            key="setup"
            id="main-content"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-16"
          >
            <section>
              <p className="text-sm font-semibold text-teal-800">Focused review for the CTMA exam</p>
              <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.055em] text-slate-950 sm:text-5xl lg:text-6xl">
                Practice the decisions behind every alert.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Work through 60 original questions aligned to the public ACAMS blueprint, or drill one topic at a time.
              </p>

              <div className="mt-9 grid grid-cols-2 gap-x-7 gap-y-5 border-t border-slate-300 pt-7 sm:max-w-xl">
                {DOMAIN_WEIGHTS.map(([label, weight]) => (
                  <div key={label}>
                    <p className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">{weight}</p>
                    <p className="mt-1 text-sm leading-snug text-slate-600">{label}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,41,51,0.08)] sm:p-7">
              <h2 className="text-xl font-semibold tracking-[-0.025em] text-slate-950">Set up your session</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Choose a focus, then answer each question before reviewing the explanation.
              </p>

              <div className="mt-6 space-y-4">
                <TopicFilter value={topic} onChange={setTopic} />
                <ShuffleToggle checked={shuffle} onChange={setShuffle} />
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-600">Questions in session</span>
                  <span className="text-xl font-semibold text-slate-950">{availableQuestions.length}</span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-4 border-t border-slate-200 pt-3">
                  <span className="text-sm text-slate-600">Practice threshold</span>
                  <span className="text-sm font-semibold text-slate-950">74%</span>
                </div>
              </div>

              <button
                type="button"
                onClick={beginSession}
                disabled={isPending || availableQuestions.length === 0}
                className="mt-6 min-h-12 w-full rounded-2xl bg-teal-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/25 active:translate-y-px disabled:cursor-wait disabled:bg-slate-300 motion-reduce:transition-none"
              >
                {isPending ? "Preparing session" : `Start ${availableQuestions.length}-question review`}
              </button>
            </section>

            <p className="text-xs leading-relaxed text-slate-500 lg:col-span-2">
              Independent study tool. Not affiliated with or endorsed by ACAMS or Pearson VUE. Questions are original and do not reproduce certification exam content.
            </p>
          </motion.main>
        )}

        {view === "study" && currentQuestion && (
          <motion.main
            key="study"
            id="main-content"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10"
          >
            <ProgressBar current={currentIndex + 1} total={deck.length} />
            <p className="mt-4 line-clamp-1 text-sm text-slate-500">{currentQuestion.domain}</p>
            <div className="mt-5">
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
