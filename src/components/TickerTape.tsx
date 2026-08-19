"use client";

const tapeItems: [string, string, string, boolean][] = [
  ["AAPL", "231.42", "+0.8%", true],
  ["TSM", "187.10", "+2.1%", true],
  ["JPM", "201.33", "+0.3%", true],
  ["ASML", "842.55", "-0.7%", false],
  ["TSLA", "244.60", "-1.6%", false],
  ["SHEL", "68.90", "+0.2%", true],
  ["NVO", "112.40", "-0.9%", false],
  ["NESN", "96.20", "+0.1%", true],
  ["HSBC", "44.80", "+0.5%", true],
  ["TM", "198.15", "+0.4%", true],
];

export default function TickerTape() {
  const chunk = (
    <>
      {tapeItems.map(([t, p, ch, up]) => (
        <span
          key={t}
          className="inline-flex items-center px-[18px] border-r border-border-soft text-text-dim font-mono text-xs"
        >
          <b className="text-text font-semibold mr-2">{t}</b>${p}{" "}
          <span className={up ? "text-green ml-1" : "text-rose ml-1"}>{ch}</span>
        </span>
      ))}
    </>
  );

  return (
    <div className="border-b border-border bg-panel-alt overflow-hidden whitespace-nowrap">
      <div className="inline-flex items-center py-2 animate-[scroll-tape_38s_linear_infinite] motion-reduce:animate-none">
        {chunk}
        {chunk}
      </div>
    </div>
  );
}
