"use client";

import { useState } from "react";
import type { UniverseMarker } from "@/lib/siteContent";

/* Top-down orthographic view of the diorama shelf — no-WebGL fallback. */

const XMIN = -7.5;
const XMAX = 7.5;
const ZMIN = -4.5;
const ZMAX = 4.5;
const W = 900;
const H = 640;

function project(m: UniverseMarker) {
  const px = ((m.x - XMIN) / (XMAX - XMIN)) * W;
  const py = ((m.z - ZMIN) / (ZMAX - ZMIN)) * H;
  return { x: px, y: py, r: m.size * 16 };
}

/* tiny terrain glyph rendered inside each island */
function TerrainGlyph({ terrain, color }: { terrain: UniverseMarker["terrain"]; color: string }) {
  if (terrain === "mountains") {
    return (
      <g stroke={color} strokeWidth="1.6" fill="none" strokeLinejoin="round">
        <path d="M-12 8 L-4 -6 L2 4 L8 -8 L14 8" />
        <path d="M2 4 L8 -8" stroke="#dfe4ea" strokeWidth="1.2" />
      </g>
    );
  }
  if (terrain === "plains") {
    return (
      <g fill={color}>
        <ellipse cx={-7} cy={4} rx={6} ry={4} />
        <ellipse cx={6} cy={2} rx={7} ry={5} />
      </g>
    );
  }
  if (terrain === "marsh") {
    return (
      <g>
        <ellipse cx={-6} cy={2} rx={7} ry={4} fill={color} opacity={0.55} />
        <ellipse cx={7} cy={-1} rx={5} ry={3} fill={color} opacity={0.4} />
        <path d="M-2 2 V-8 M3 4 V-7 M0 3 V-9" stroke={color} strokeWidth="1.1" />
      </g>
    );
  }
  if (terrain === "coast") {
    return (
      <g>
        <path d="M-14 6 Q-8 -2 0 4 Q6 -1 14 6 Z" fill={color} opacity={0.9} />
        <path d="M0 -12 Q4 -6 2 0 Q-2 6 0 12" stroke={color} strokeWidth="1.4" fill="none" />
      </g>
    );
  }
  // city
  return (
    <g fill={color}>
      <rect x={-10} y={-4} width={5} height={10} />
      <rect x={-3} y={-8} width={6} height={14} />
      <rect x={5} y={-3} width={4} height={9} />
    </g>
  );
}

export default function StaticMap({
  markers,
  onSelect,
}: {
  markers: UniverseMarker[];
  onSelect: (m: UniverseMarker) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="TARTARY Universe — illustrated shelf"
      >
        <defs>
          <radialGradient id="shelfFill" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#100e0c" />
            <stop offset="100%" stopColor="#060507" />
          </radialGradient>
          <filter id="softGlow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* background */}
        <rect width={W} height={H} fill="#05060c" />

        {/* stars */}
        {Array.from({ length: 90 }).map((_, i) => {
          const sx = (i * 137.5) % W;
          const sy = (i * 89.7) % H;
          const r = (i % 3) * 0.5 + 0.5;
          return <circle key={i} cx={sx} cy={sy} r={r} fill="#8a97bd" opacity={0.45} />;
        })}

        {/* shelf */}
        <ellipse cx={W / 2} cy={H / 2} rx={W * 0.46} ry={H * 0.46} fill="url(#shelfFill)" stroke="#2a2522" strokeOpacity={0.5} />

        {/* islands */}
        {markers.map((m) => {
          const p = project(m);
          const isHover = hovered === m.id;
          const glow = m.palette.glow;
          const rr = isHover ? p.r * 1.15 : p.r;
          return (
            <g
              key={m.id}
              onClick={() => onSelect(m)}
              onMouseEnter={() => setHovered(m.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              <circle cx={p.x} cy={p.y} r={rr + 10} fill={glow} opacity={0.12} />
              <circle
                cx={p.x}
                cy={p.y}
                r={rr}
                fill={m.palette.base}
                stroke={glow}
                strokeWidth={isHover ? 2 : 1.2}
                filter="url(#softGlow)"
                strokeOpacity={isHover ? 1 : 0.6}
              />
              <circle cx={p.x} cy={p.y} r={rr * 0.82} fill="none" stroke={m.palette.ridge} strokeOpacity={0.35} />
              <g transform={`translate(${p.x}, ${p.y})`}>
                <TerrainGlyph terrain={m.terrain} color={m.palette.ridge} />
              </g>
              <text
                x={p.x}
                y={p.y - rr - 10}
                textAnchor="middle"
                fill={isHover ? glow : "#c9c2b2"}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: isHover ? 15 : 13,
                  letterSpacing: "0.08em",
                }}
              >
                {m.name}
              </text>
              <text
                x={p.x}
                y={p.y + rr + 16}
                textAnchor="middle"
                fill="#6b6560"
                style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.06em" }}
              >
                {m.sublabel}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
