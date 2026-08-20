"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { companies, sectorColor, COMPARE_COLORS, Company } from "@/lib/companies";
import { flagFor } from "@/lib/flags";

interface Props {
  selected: string[];
  onToggle: (ticker: string) => void;
  onHover: (ticker: string | null) => void;
}

const WIDTH = 900;
const HEIGHT = 460;
const MIN_ZOOM = 1;
const MAX_ZOOM = 12;

export default function WorldMap({ selected, onToggle, onHover }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomGroupRef = useRef<SVGGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const selectedRef = useRef(selected);
  const onToggleRef = useRef(onToggle);
  selectedRef.current = selected;
  onToggleRef.current = onToggle;

  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function build() {
      const svg = d3.select(svgRef.current).attr("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);
      svg.selectAll("*").remove();

      const zoomGroup = svg.append("g").attr("class", "zoom-group");
      zoomGroupRef.current = zoomGroup.node();

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
        zoomGroup
          .selectAll("path.country")
          .data((world as any).features)
          .join("path")
          .attr("class", "country")
          .attr("d", path as any)
          .attr("fill", "#171C28")
          .attr("stroke", "#232838")
          .attr("stroke-width", 0.6);
      } else {
        zoomGroup
          .append("text")
          .attr("x", WIDTH / 2)
          .attr("y", 24)
          .attr("text-anchor", "middle")
          .attr("fill", "#4B5163")
          .attr("font-family", "var(--font-mono)")
          .attr("font-size", 11)
          .text("World outline unavailable — showing markers on a coordinate projection");
      }

      const capExtent = d3.extent(companies, (d) => d.cap) as [number, number];
      const rScale = d3.scaleSqrt().domain(capExtent).range([2.6, 9]);

      const pins = zoomGroup
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
        .attr("r", (d) => rScale(d.cap) + 3.5)
        .style("fill", "none")
        .style("stroke-width", 1.8)
        .style("stroke", () => "#4FD1C5")
        .style("opacity", 0)
        .style("vector-effect", "non-scaling-stroke");

      pins
        .append("circle")
        .attr("class", "pin-dot")
        .attr("r", (d) => rScale(d.cap))
        .style("fill", (d) => sectorColor[d.sector])
        .style("stroke", "#0B0E14")
        .style("stroke-width", 1)
        .style("vector-effect", "non-scaling-stroke")
        .style("opacity", 0.85);

      pins
        .append("text")
        .attr("class", "pin-label")
        .text((d) => d.t)
        .attr("x", 0)
        .attr("y", (d) => -(rScale(d.cap) + 6))
        .attr("text-anchor", "middle")
        .attr("font-family", "var(--font-mono)")
        .attr("font-size", 8)
        .attr("font-weight", 600)
        .attr("fill", "#E8EAED")
        .style("pointer-events", "none")
        .style("opacity", 0);

      pins
        .on("mousemove", (event: MouseEvent, d) => {
          const tooltip = tooltipRef.current;
          if (tooltip) {
            tooltip.innerHTML = `<b class="text-amber">${d.t}</b> · ${d.name}<br/>${flagFor(d.country)} ${d.country} · ${d.sector}<br/>Market cap: $${d.cap}B`;
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

      applySelectionStyles();

      // ---- Zoom / pan behavior ----
      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([MIN_ZOOM, MAX_ZOOM])
        .translateExtent([
          [-WIDTH * 0.3, -HEIGHT * 0.3],
          [WIDTH * 1.3, HEIGHT * 1.3],
        ])
        .on("zoom", (event) => {
          const { transform } = event;
          zoomGroup.attr("transform", transform.toString());
          setZoomLevel(transform.k);
          // Keep pin dots a near-constant screen size, and reveal labels once zoomed in.
          zoomGroup
            .selectAll<SVGGElement, Company>("g.pin")
            .attr("transform", (d) => {
              const p = projection([d.lon, d.lat]);
              return p ? `translate(${p[0]},${p[1]})` : "translate(-100,-100)";
            });
          zoomGroup.selectAll(".pin-label").style("opacity", transform.k > 3 ? 1 : 0);
        });

      zoomBehaviorRef.current = zoom;
      if (svgRef.current) {
        d3.select<SVGSVGElement, unknown>(svgRef.current).call(zoom);
      }
    }

    function applySelectionStyles() {
      const svg = d3.select(svgRef.current);
      svg
        .selectAll<SVGGElement, Company>("g.pin")
        .select(".pin-ring")
        .style("opacity", (d) => {
          const idx = selectedRef.current.indexOf(d.t);
          return idx >= 0 ? 1 : 0;
        })
        .style("stroke", (d) => {
          const idx = selectedRef.current.indexOf(d.t);
          return idx >= 0 ? COMPARE_COLORS[idx % COMPARE_COLORS.length] : "#4FD1C5";
        });
    }

    build();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep ring visibility/color in sync with selection without rebuilding the map.
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg
      .selectAll<SVGGElement, Company>("g.pin")
      .select(".pin-ring")
      .style("opacity", (d) => (selected.includes(d.t) ? 1 : 0))
      .style("stroke", (d) => {
        const idx = selected.indexOf(d.t);
        return idx >= 0 ? COMPARE_COLORS[idx % COMPARE_COLORS.length] : "#4FD1C5";
      });
  }, [selected]);

  function zoomBy(factor: number) {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(250).call(zoomBehaviorRef.current.scaleBy, factor);
  }
  function resetZoom() {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(300)
      .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
  }

  return (
    <div className="relative">
      <div className="w-full overflow-hidden rounded-[2px] bg-[#0D1119] border border-border-soft">
        <svg ref={svgRef} className="w-full h-auto block touch-none" />
      </div>

      <div className="absolute top-2.5 right-2.5 flex flex-col gap-1">
        <button
          onClick={() => zoomBy(1.6)}
          aria-label="Zoom in"
          className="w-7 h-7 flex items-center justify-center bg-[#0D1119]/90 border border-border-soft rounded-[3px] text-text-dim hover:text-text hover:border-text-faint font-mono text-[14px] transition-colors"
        >
          +
        </button>
        <button
          onClick={() => zoomBy(1 / 1.6)}
          aria-label="Zoom out"
          className="w-7 h-7 flex items-center justify-center bg-[#0D1119]/90 border border-border-soft rounded-[3px] text-text-dim hover:text-text hover:border-text-faint font-mono text-[14px] transition-colors"
        >
          −
        </button>
        <button
          onClick={resetZoom}
          aria-label="Reset zoom"
          className="w-7 h-7 flex items-center justify-center bg-[#0D1119]/90 border border-border-soft rounded-[3px] text-text-dim hover:text-text hover:border-text-faint font-mono text-[10px] transition-colors"
        >
          ⟲
        </button>
      </div>

      <div className="absolute bottom-2.5 left-2.5 font-mono text-[10px] text-text-faint bg-[#0D1119]/90 border border-border-soft rounded-[3px] px-2 py-1">
        {zoomLevel > 1.05
          ? `Zoomed ${zoomLevel.toFixed(1)}×`
          : "Scroll or pinch to zoom in on dense regions"}
      </div>

      <div
        ref={tooltipRef}
        className="fixed pointer-events-none bg-[#050608] border border-border text-text font-mono text-[11.5px] px-2.5 py-2 rounded-[3px] z-50 opacity-0 transition-opacity duration-100 max-w-[230px] leading-relaxed"
      />
    </div>
  );
}
