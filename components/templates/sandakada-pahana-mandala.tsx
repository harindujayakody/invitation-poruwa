import React from "react";

interface SandakadaPahanaMandalaProps {
  className?: string;
  accentColor?: string;
}

export function SandakadaPahanaMandala({
  className = "w-full max-w-[280px] mx-auto",
}: SandakadaPahanaMandalaProps) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 320 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-sm"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
          <radialGradient id="lotusCenter" cx="50%" cy="100%" r="80%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#fde68a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient glow backdrop */}
        <circle cx="160" cy="160" r="150" fill="url(#lotusCenter)" />

        {/* Outer concentric decorative arc 1 */}
        <path
          d="M 15 160 A 145 145 0 0 1 305 160"
          stroke="url(#goldGradient)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          opacity="0.7"
        />

        {/* Outer solid rim */}
        <path
          d="M 25 160 A 135 135 0 0 1 295 160"
          stroke="url(#goldGradient)"
          strokeWidth="2.5"
        />

        {/* Traditional Liyawel / scrollwork beads */}
        {Array.from({ length: 25 }).map((_, i) => {
          const angle = (Math.PI / 24) * i;
          const r = 126;
          const cx = 160 - r * Math.cos(angle);
          const cy = 160 - r * Math.sin(angle);
          return (
            <circle
              key={`outer-bead-${i}`}
              cx={cx}
              cy={cy}
              r="2.5"
              fill="url(#goldGradient)"
              opacity="0.85"
            />
          );
        })}

        {/* Mid concentric arc */}
        <path
          d="M 44 160 A 116 116 0 0 1 276 160"
          stroke="url(#goldGradient)"
          strokeWidth="1.5"
          opacity="0.8"
        />

        {/* Lotus petal ring */}
        {Array.from({ length: 17 }).map((_, i) => {
          const angle = (Math.PI / 16) * i;
          const rOuter = 112;
          const rInner = 88;
          const x1 = 160 - rOuter * Math.cos(angle);
          const y1 = 160 - rOuter * Math.sin(angle);
          const xMid = 160 - ((rOuter + rInner) / 2) * Math.cos(angle);
          const yMid = 160 - ((rOuter + rInner) / 2) * Math.sin(angle);
          return (
            <path
              key={`petal-${i}`}
              d={`M 160 160 Q ${xMid} ${yMid} ${x1} ${y1}`}
              stroke="url(#goldGradient)"
              strokeWidth="1.2"
              opacity="0.65"
            />
          );
        })}

        {/* Inner concentric ring */}
        <path
          d="M 72 160 A 88 88 0 0 1 248 160"
          stroke="url(#goldGradient)"
          strokeWidth="2"
        />

        {/* Inner scrollwork beads */}
        {Array.from({ length: 17 }).map((_, i) => {
          const angle = (Math.PI / 16) * i;
          const r = 78;
          const cx = 160 - r * Math.cos(angle);
          const cy = 160 - r * Math.sin(angle);
          return (
            <circle
              key={`inner-bead-${i}`}
              cx={cx}
              cy={cy}
              r="2"
              fill="url(#goldGradient)"
              opacity="0.9"
            />
          );
        })}

        {/* Sacred Half-Sun / Core Lotus Rosette */}
        <path
          d="M 96 160 A 64 64 0 0 1 224 160"
          stroke="url(#goldGradient)"
          strokeWidth="1.5"
        />
        <path
          d="M 120 160 A 40 40 0 0 1 200 160"
          fill="url(#goldGradient)"
          opacity="0.25"
          stroke="url(#goldGradient)"
          strokeWidth="1.5"
        />

        {/* Sun rays from core */}
        {Array.from({ length: 9 }).map((_, i) => {
          const angle = (Math.PI / 8) * i;
          const r1 = 40;
          const r2 = 62;
          const x1 = 160 - r1 * Math.cos(angle);
          const y1 = 160 - r1 * Math.sin(angle);
          const x2 = 160 - r2 * Math.cos(angle);
          const y2 = 160 - r2 * Math.sin(angle);
          return (
            <line
              key={`ray-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="url(#goldGradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          );
        })}

        {/* Center bindu jewel */}
        <circle cx="160" cy="155" r="4" fill="#d97706" />
      </svg>
    </div>
  );
}
