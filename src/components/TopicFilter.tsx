import { ALL_TOPICS, TOPICS, type TopicSelection } from "../data/topics";
import type { Topic } from "../types";

interface TopicFilterProps {
  value: TopicSelection;
  topics?: readonly Topic[];
  onChange: (value: TopicSelection) => void;
}

export function TopicFilter({ value, topics = TOPICS, onChange }: TopicFilterProps) {
  return (
    <div className="space-y-2.5">
      <label htmlFor="topic-filter" className="block text-sm font-bold text-ink">
        Study focus
      </label>
      <div className="relative">
        <select
          id="topic-filter"
          value={value}
          onChange={(event) => onChange(event.target.value as TopicSelection)}
          className="min-h-12 w-full appearance-none rounded-xl border border-line-strong bg-paper-raised px-4 py-3 pr-11 text-base font-medium text-ink outline-none transition-[border-color,box-shadow] duration-150 focus:border-accent focus:ring-3 focus:ring-focus cursor-pointer"
        >
          <option value={ALL_TOPICS}>All topics</option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border-b-2 border-r-2 border-accent"
        />
      </div>
    </div>
  );
}
