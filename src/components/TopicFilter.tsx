import { ALL_TOPICS, TOPICS, type TopicSelection } from "../data/topics";

interface TopicFilterProps {
  value: TopicSelection;
  onChange: (value: TopicSelection) => void;
}

export function TopicFilter({ value, onChange }: TopicFilterProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="topic-filter" className="block text-sm font-semibold text-slate-800">
        Study focus
      </label>
      <select
        id="topic-filter"
        value={value}
        onChange={(event) => onChange(event.target.value as TopicSelection)}
        className="min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10"
      >
        <option value={ALL_TOPICS}>All topics</option>
        {TOPICS.map((topic) => (
          <option key={topic} value={topic}>
            {topic}
          </option>
        ))}
      </select>
    </div>
  );
}
