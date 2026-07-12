// src/components/StatusBadge.jsx
//
// Renders a fleet status as a small "signal light" — a dot plus label.
// The dot pulses for "On Trip" to read as an active/live state, echoing
// a rail-yard signal rather than a generic pill badge.

const STATUS_STYLES = {
  Available: {
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    ring: "ring-emerald-400/30",
    bg: "bg-emerald-400/10",
  },
  "On Trip": {
    dot: "bg-[#4C8DFF]",
    text: "text-[#8FB4FF]",
    ring: "ring-[#4C8DFF]/30",
    bg: "bg-[#4C8DFF]/10",
    pulse: true,
  },
  Maintenance: {
    dot: "bg-amber-400",
    text: "text-amber-300",
    ring: "ring-amber-400/30",
    bg: "bg-amber-400/10",
  },
  Retired: {
    dot: "bg-rose-400",
    text: "text-rose-300",
    ring: "ring-rose-400/30",
    bg: "bg-rose-400/10",
  },
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.Available;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${style.bg} ${style.text} ${style.ring}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {style.pulse && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full ${style.dot} opacity-75`}
          />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${style.dot}`} />
      </span>
      {status}
    </span>
  );
}
