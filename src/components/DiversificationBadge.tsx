interface Props {
  avg: number;
}

function readAvg(avg: number): { label: string; color: string; text: string } {
  if (avg < 0.2) {
    return {
      label: "Well diversified",
      color: "var(--green)",
      text: "These holdings mostly move independently of each other — a downturn in one is unlikely to drag the others down with it.",
    };
  }
  if (avg < 0.4) {
    return {
      label: "Moderately diversified",
      color: "var(--amber)",
      text: "Some groups move together more than others. There's real diversification here, but it's uneven across sectors.",
    };
  }
  return {
    label: "Concentrated risk",
    color: "var(--rose)",
    text: "Many of these holdings tend to rise and fall together. A downturn in one sector is likely to affect several others at once.",
  };
}

export default function DiversificationBadge({ avg }: Props) {
  const read = readAvg(avg);
  return (
    <div
      className="flex items-center gap-3 border rounded-[3px] px-3.5 py-2.5"
      style={{ borderColor: read.color, background: `${read.color}0F` }}
    >
      <div
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ background: read.color }}
      />
      <div>
        <div className="font-mono text-[12px] font-semibold" style={{ color: read.color }}>
          {read.label}
        </div>
        <div className="text-[12px] text-text-dim leading-snug mt-0.5 max-w-md">{read.text}</div>
      </div>
    </div>
  );
}
