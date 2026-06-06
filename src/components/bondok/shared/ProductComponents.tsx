"use client";

export function CircleProgress({
  value,
  color = "#D4A44C",
}: {
  value: number;
  color?: string;
}) {
  return (
    <div className="relative w-16 h-16 mx-auto">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
        <path
          d="M18 2.0845a15.9155 15.9155 0 010 31.831 15.9155 15.9155 0 010-31.831"
          fill="none"
          stroke="rgba(212,164,76,.15)"
          strokeWidth="3"
        />
        <path
          d="M18 2.0845a15.9155 15.9155 0 010 31.831 15.9155 15.9155 0 010-31.831"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${value * 10},100`}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-playfair text-gold-400 font-bold text-sm">
        {value}/10
      </span>
    </div>
  );
}

export function NoteRow({
  type,
  label,
  notes,
}: {
  type: "top" | "mid" | "base";
  label: string;
  notes: string[];
}) {
  const bg =
    type === "top"
      ? "rgba(255,224,153,.12)"
      : type === "mid"
        ? "rgba(212,164,76,.1)"
        : "rgba(160,112,32,.1)";
  return (
    <div className="p-3 rounded-lg text-center" style={{ background: bg }}>
      <p className="text-gold-200 text-xs mb-1">{label}</p>
      <p className="text-gold-300 text-sm">{notes.join(" · ")}</p>
    </div>
  );
}
