"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { companies, sectorColor, Company } from "@/lib/companies";

interface Props {
  selected: string[];
  onToggle: (ticker: string) => void;
  onHover: (ticker: string | null) => void;
}

const WIDTH = 900;
const HEIGHT = 460;

export default function WorldMap({ selected, onToggle, onHover }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  // Refs so the D3 event handlers (bound once) always see the latest props.
  const selectedRef = useRef(selected);
  const onToggleRef = useRef(onToggle);
  selectedRef.current = selected;
  onToggleRef.current = onToggle;

  // Build the map once on mount.
  useEffect(() => {
    let cancelled = false;

    async function build() {
      const svg = d3.select(svgRef.current).attr("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);
      svg.selectAll("*").remove();
      const g = svg.append("g");

      let world: any = null;
      try {
        const topology = await d3.json(
          "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
        );
        world = topojson.feature(topology as any, (topology as any).objects.countries);
      } catch {
        world = null;
      }
      if (cancelled) return;

      const projection = d3.geoNaturalEarth1();
      if (world) {
        projection.fitSize([WIDTH, HEIGHT - 10], world as any);
      } else {
        projection.scale(148).translate([WIDTH / 2, HEIGHT / 2 + 10]);
      }
      const path = d3.geoPath(projection as any);

      if (world) {
        g.selectAll("path.country")
          .data((world as any).features)
          .join("path")
          .attr("class", "country")
          .attr("d", path as any)
          .attr("fill", "#171C28")
          .attr("stroke", "#232838")
          .attr("stroke-width", 0.6);
      } else {
        g.append("text")
          .attr("x", WIDTH / 2)
          .attr("y", 24)
          .attr("text-anchor", "middle")
          .attr("fill", "#4B5163")
          .attr("font-family", "var(--font-mono)")
          .attr("font-size", 11)
          .text("World outline unavailable — showing markers on a coordinate projection");
      }

      const capExtent = d3.extent(companies, (d) => d.cap) as [number, number];
      const rScale = d3.scaleSqrt().domain(capExtent).range([4, 12]);

      const pins = g
        .selectAll<SVGGElement, Company>("g.pin")
        .data(companies)
        .join("g")
        .attr("class", "pin")
        .attr("transform", (d) => {
          const p = projection([d.lon, d.lat]);
          return p ? `translate(${p[0]},${p[1]})` : "translate(-100,-100)";
        })
        .style("cursor", "pointer");

      pins
        .append("circle")
        .attr("class", "pin-ring")
        .attr("r", (d) => rScale(d.cap) + 4)
        .style("fill", "none")
        .style("stroke-width", 2)
        .style("stroke", (d) => sectorColor[d.sector])
        .style("opacity", (d) => (selectedRef.current.includes(d.t) ? 1 : 0));

      pins
        .append("circle")
        .attr("class", "pin-dot")
        .attr("r", (d) => rScale(d.cap))
        .style("fill", (d) => sectorColor[d.sector])
        .style("stroke", "#0B0E14")
        .style("stroke-width", 1.4)
        .style("opacity", 0.88);

      pins
        .append("text")
        .attr("class", "pin-label")
        .text((d) => d.t)
        .attr("x", 0)
        .attr("y", (d) => -(rScale(d.cap) + 8))
        .attr("text-anchor", "middle")
        .attr("font-family", "var(--font-mono)")
        .attr("font-size", 9)
        .attr("font-weight", 600)
        .attr("fill", "#E8EAED")
        .style("pointer-events", "none")
        .style("opacity", (d) => (selectedRef.current.includes(d.t) ? 1 : 0));

      pins
        .on("mousemove", (event: MouseEvent, d) => {
          const tooltip = tooltipRef.current;
          if (tooltip) {
            tooltip.innerHTML = `<b class="text-amber">${d.t}</b> · ${d.name}<br/>${d.country} · ${d.sector}<br/>Market cap: $${d.cap}B`;
            tooltip.style.left = `${event.clientX + 14}px`;
            tooltip.style.top = `${event.clientY + 14}px`;
            tooltip.style.opacity = "1";
          }
          onHover(d.t);
        })
        .on("mouseleave", () => {
          if (tooltipRef.current) tooltipRef.current.style.opacity = "0";
          onHover(null);
        })
        .on("click", (_event, d) => onToggleRef.current(d.t));
    }

    build();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep ring/label visibility in sync with selection without rebuilding the map.
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg
      .selectAll<SVGGElement, Company>("g.pin")
      .select(".pin-ring")
      .style("opacity", (d) => (selected.includes(d.t) ? 1 : 0));
    svg
      .selectAll<SVGGElement, Company>("g.pin")
      .select(".pin-label")
      .style("opacity", (d) => (selected.includes(d.t) ? 1 : 0));
  }, [selected]);

  return (
    <div className="relative">
      <div className="w-full overflow-hidden rounded-[2px] bg-[#0D1119] border border-border-soft">
        <svg ref={svgRef} className="w-full h-auto block" />
      </div>
      <div
        ref={tooltipRef}
        className="fixed pointer-events-none bg-[#050608] border border-border text-text font-mono text-[11.5px] px-2.5 py-2 rounded-[3px] z-50 opacity-0 transition-opacity duration-100 max-w-[230px] leading-relaxed"
      />
    </div>
  );
}
