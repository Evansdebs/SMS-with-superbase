'use client';

import React, { useState } from 'react';

// ============================================================================
// Donut / Pie Chart Component
// ============================================================================
interface DonutData {
  label: string;
  value: number;
  color: string;
}

export function DonutChart({
  data,
  size = 180,
  strokeWidth = 24,
  centerLabel,
  centerValue,
}: {
  data: DonutData[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string | number;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg] transition-all">
          {data.map((item, index) => {
            const percent = item.value / total;
            const strokeDasharray = `${circumference * percent} ${circumference * (1 - percent)}`;
            const strokeDashoffset = -(circumference * accumulatedPercent);
            accumulatedPercent += percent;
            const isHovered = hovered === index;

            return (
              <circle
                key={item.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
          {centerValue !== undefined && (
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {centerValue}
            </span>
          )}
          {centerLabel && (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {centerLabel}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col space-y-2 min-w-[140px]">
        {data.map((item, i) => {
          const pct = Math.round((item.value / total) * 100);
          return (
            <div
              key={item.label}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={`flex items-center justify-between p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                hovered === i ? 'bg-slate-100 dark:bg-slate-800/80 font-semibold' : ''
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
              </div>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">
                {item.value.toLocaleString()} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// Multi-Bar Chart Component
// ============================================================================
interface BarChartData {
  label: string;
  primary: number;
  secondary?: number;
}

export function BarChart({
  data,
  primaryLabel = 'Value',
  secondaryLabel,
  height = 200,
}: {
  data: BarChartData[];
  primaryLabel?: string;
  secondaryLabel?: string;
  height?: number;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.primary, d.secondary || 0)),
    10
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-end space-x-4 mb-3 text-xs">
        <div className="flex items-center space-x-1.5">
          <span className="h-2.5 w-2.5 rounded bg-blue-600" />
          <span className="text-slate-600 dark:text-slate-400">{primaryLabel}</span>
        </div>
        {secondaryLabel && (
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400">{secondaryLabel}</span>
          </div>
        )}
      </div>

      <div className="flex items-end justify-between gap-2 pt-6 border-b border-slate-200 dark:border-slate-800" style={{ height }}>
        {data.map((item, idx) => {
          const primaryHeight = (item.primary / maxVal) * 100;
          const secondaryHeight = item.secondary ? (item.secondary / maxVal) * 100 : 0;
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={item.label}
              className="relative flex-1 flex flex-col items-center h-full justify-end group"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {isHovered && (
                <div className="absolute -top-10 z-10 whitespace-nowrap bg-slate-900 text-white text-[11px] rounded px-2 py-1 shadow-lg pointer-events-none">
                  <span className="font-semibold">{item.label}</span>: {item.primary}
                  {item.secondary !== undefined ? ` / ${item.secondary}` : ''}
                </div>
              )}
              <div className="flex items-end gap-1 w-full max-w-[36px] justify-center h-full">
                <div
                  className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t transition-all duration-300 hover:brightness-110"
                  style={{ height: `${Math.max(primaryHeight, 4)}%` }}
                />
                {item.secondary !== undefined && (
                  <div
                    className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t transition-all duration-300 hover:brightness-110"
                    style={{ height: `${Math.max(secondaryHeight, 4)}%` }}
                  />
                )}
              </div>
              <span className="mt-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-full">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// Smooth Sparkline / Trend Line
// ============================================================================
export function Sparkline({
  points,
  color = '#2563eb',
  height = 40,
  width = 120,
}: {
  points: number[];
  color?: string;
  height?: number;
  width?: number;
}) {
  if (points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points) || 1;
  const range = max - min || 1;

  const pathCoords = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  });

  const pathString = `M ${pathCoords.join(' L ')}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path
        d={pathString}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
