interface ShuffleToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ShuffleToggle({ checked, onChange }: ShuffleToggleProps) {
  return (
    <label className="flex min-h-16 cursor-pointer items-center justify-between gap-4 border-y border-line py-3">
      <span>
        <span className="block text-sm font-bold text-ink">Shuffle questions</span>
        <span className="mt-0.5 block text-sm leading-5 text-muted">Use a fresh order for this session</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="relative h-[1.55rem] w-[2.75rem] shrink-0 rounded-full bg-[#b7c0bb] transition-colors duration-150 peer-checked:bg-accent peer-focus-visible:ring-3 peer-focus-visible:ring-focus after:absolute after:left-[0.2rem] after:top-[0.2rem] after:h-[1.15rem] after:w-[1.15rem] after:rounded-full after:bg-paper-raised after:shadow-[0_2px_5px_rgb(19_39_42/0.2)] after:transition-transform after:duration-180 peer-checked:after:translate-x-[1.2rem]"
      />
    </label>
  );
}
