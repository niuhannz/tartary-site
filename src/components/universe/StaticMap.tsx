"use client";

import { useState } from "react";
import type { UniverseMarker } from "@/lib/siteContent";

const KIND_COLOR: Record<UniverseMarker["kind"], string> = {
  world: "#FF6600",
  character: "#b9d0ff",
  story: "#e7c77a",
};

/* Equirectangular-ish projection onto a globe disc, for the no-WebGL fallback. */
function project(m: UniverseMarker, w: number, h: number) {
  const cx = w / 2;
  const cy = h / 2;
  const rx = w * 0.42;
  const ry = h * 0.42;
  const x = cx + (m.lng / 180) * rx;
  const y = cy - (m.lat / 90) * ry;
  return { x, y };
}

export default function StaticMap({
  markers,
  onSelect,
}: {
  markers: UniverseMarker[];
  onSelect: (m: UniverseMarker) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const W = 800;
  const H = 520;
  const cx = W / 2;
  const cy = H / 2;
  const rx = W * 0.42;
  const ry = H * 0.42;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="TARTARY Universe — illustrated map"
      >
        <defs>
          <radialGradient id="planetFill" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#141b2e" />
            <stop offset="70%" stopColor="#0a0f1e" />
            <stop offset="100%" stopColor="#070a14" />
          </radialGradient>
          <radialGradient id="halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF6600" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FF6600" stopOpacity="0" />
          </radialGradient>
          <filter id="softGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* stars */}
        {Array.from({ length: 90 }).map((_, i) => {
          const sx = (i * 137.5) % W;
          const sy = (i * 89.7) % H;
          const r = (i % 3) * 0.5 + 0.5;
          return <circle key={i} cx={sx} cy={sy} r={r} fill="#8a97bd" opacity={0.5} />;
        })}

        {/* halo behind planet */}
        <ellipse cx={cx} cy={cy} rx={rx * 1.05} ry={ry * 1.05} fill="url(#halo)" opacity={0.5} />

        {/* planet disc */}
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#planetFill)" stroke="#2a3350" strokeOpacity="0.5" />

        {/* graticule */}
        {Array.from({ length: 6 }).map((_, i) => {
          const f = (i + 1) / 6;
          return (
            <ellipse
              key={`par-${i}`}
              cx={cx}
              cy={cy}
              rx={rx * f}
              ry={ry * f}
              fill="none"
              stroke="#3a4668"
              strokeOpacity="0.3"
            />
          );
        })}
        {Array.from({ length: 6 }).map((_, i) => {
          const ang = (i / 6) * Math.PI;
          const x2 = cx + Math.cos(ang) * rx;
          const y2 = cy + Math.sin(ang) * ry;
          return (
            <line
              key={`mer-${i}`}
              x1={cx}
              y1={cy}
              x2={x2}
              y2={y2}
              stroke="#3a4668"
              strokeOpacity="0.25"
            />
          );
        })}

        {/* markers */}
        {markers.map((m) => {
          const p = project(m, W, H);
          const isHover = hovered === m.id;
          const color = KIND_COLOR[m.kind];
          return (
            <g
              key={m.id}
              onClick={() => onSelect(m)}
              onMouseEnter={() => setHovered(m.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              <circle cx={p.x} cy={p.y} r={isHover ? 22 : 16} fill={color} opacity={0.18} />
              <circle cx={p.x} cy={p.y} r={isHover ? 6 : 4.5} fill={color} filter="url(#softGlow)" />
              <circle cx={p.x} cy={p.y} r={2} fill="#fff" />
              <text
                x={p.x}
                y={p.y - (isHover ? 16 : 12)}
                textAnchor="middle"
                fill={isHover ? color : "#c9c2b2"}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: isHover ? 14 : 12,
                  letterSpacing: "0.08em",
                }}
              >
                {m.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
