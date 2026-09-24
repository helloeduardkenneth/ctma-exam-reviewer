interface ProgressBarProps {
  current: number;
  total: number;
  correct: number;
  answered: number;
  domain: string;
}

export function ProgressBar({ current, total, correct, answered, domain }: ProgressBarProps) {
  const percentage = total === 0 ? 0 : (current / total) * 100;

  return (
    <section
      className="rounded-2xl border border-line bg-paper-raised/75 px-4.5 py-4 shadow-sm"
      aria-label={`Question ${current} of ${total}`}
    >
      <div className="flex items-center justify-between gap-5">
        <div className="min-w-0">
          <p className="text-[0.82rem] font-medium text-ink">
            Question <strong className="ml-1 text-[1.35rem] font-bold tabular-nums text-accent-deep">{current}</strong>
            <span className="text-xs tabular-nums text-muted"> of {total}</span>
          </p>
          <p className="mt-1 truncate text-xs font-medium text-muted">{domain}</p>
        </div>
        <div
          className="grid grid-cols-2 items-baseline gap-x-2.5 gap-y-0.5 border-l border-line-strong pl-4 text-right max-sm:grid-cols-1 max-sm:pl-3.5"
          aria-label={`${correct} correct, ${answered} answered`}
        >
          <span className="col-span-full text-[0.62rem] font-semibold uppercase tracking-wider text-muted max-sm:hidden">
            Session score
          </span>
          <strong className="text-[0.86rem] font-semibold text-ink">{correct} correct</strong>
          <small className="text-[0.7rem] font-medium text-muted">{answered} answered</small>
        </div>
      </div>
      <div
        className="mt-3.5 h-[0.55rem] overflow-hidden rounded-full bg-line-strong"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
      >
        <div
          className="h-full rounded-full bg-accent transition-all duration-200"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between gap-4 text-[11px] font-medium text-muted">
        <span>{Math.round(percentage)}% complete</span>
        <span className="tabular-nums">{total - current} remaining</span>
      </div>
    </section>
  );
}
