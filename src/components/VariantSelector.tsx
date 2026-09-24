import type { ExamVariant } from "../types";

interface VariantSelectorProps {
  value: ExamVariant;
  onChange: (value: ExamVariant) => void;
}

const VARIANTS: readonly {
  id: ExamVariant;
  label: string;
  tag: string;
  description: string;
}[] = [
  {
    id: "global",
    label: "Global",
    tag: "Standard",
    description: "Universal TM fundamentals, FATF standards & US regulatory context (BSA / FinCEN SARs)",
  },
  {
    id: "europe",
    label: "Europe",
    tag: "EU Directives",
    description: "European AML Directives (4AMLD–6AMLD), AMLA, EBA guidelines & national FIU STR filings",
  },
] as const;

export function VariantSelector({ value, onChange }: VariantSelectorProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label id="variant-label" className="block text-sm font-bold text-ink">
          Exam edition
        </label>
        <span className="text-xs font-semibold text-muted">
          ACAMS blueprint aligned
        </span>
      </div>

      <div
        role="radiogroup"
        aria-labelledby="variant-label"
        className="grid grid-cols-1 gap-3"
      >
        {VARIANTS.map((variant) => {
          const isSelected = value === variant.id;
          return (
            <button
              key={variant.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(variant.id)}
              className={`group relative flex min-h-28 cursor-pointer flex-col rounded-xl border p-4 text-left transition-all duration-150 outline-none focus-visible:ring-3 focus-visible:ring-focus ${
                isSelected
                  ? "border-accent/45 bg-paper-raised text-ink opacity-100 shadow-[0_5px_16px_rgb(19_39_42/0.1)]"
                  : "border-line bg-paper-raised/45 text-muted opacity-75 hover:border-line-strong hover:bg-paper-raised hover:text-ink"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex items-center gap-2 text-[15px] font-bold tracking-tight text-ink">
                  <span
                    className={`inline-block h-3.5 w-3.5 shrink-0 rounded-full border-2 transition-colors ${
                      isSelected
                        ? "border-accent bg-accent"
                        : "border-line-strong bg-transparent"
                    }`}
                    aria-hidden="true"
                  />
                  {variant.label}
                </span>
                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] transition-colors ${
                    isSelected
                      ? "bg-accent-soft text-accent-deep"
                      : "bg-line text-muted"
                  }`}
                >
                  {variant.tag}
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted">
                {variant.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
