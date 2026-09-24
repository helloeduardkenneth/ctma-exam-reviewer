interface ShuffleToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ShuffleToggle({ checked, onChange }: ShuffleToggleProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-300 bg-white px-4 py-3 shadow-sm transition hover:border-slate-400">
      <span>
        <span className="block text-sm font-semibold text-slate-800">Shuffle questions</span>
        <span className="mt-0.5 block text-sm text-slate-500">Create a fresh order for this session</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="relative h-7 w-12 shrink-0 rounded-full bg-slate-300 transition peer-checked:bg-teal-700 peer-focus-visible:ring-4 peer-focus-visible:ring-teal-700/20 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:after:translate-x-5 motion-reduce:after:transition-none"
      />
    </label>
  );
}
