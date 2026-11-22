import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Activity, Radio, BarChart3 } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const benign = payload.find(p => p.dataKey === 'benign_count')?.value || 0;
    const attack = payload.find(p => p.dataKey === 'attack_count')?.value || 0;
    const total = benign + attack;
    const attackRatio = total > 0 ? ((attack / total) * 100).toFixed(1) : 0;

    return (
      <div className="rounded-lg bg-slate-950/95 border border-slate-700/80 p-3 shadow-xl backdrop-blur-md font-mono text-xs">
        <p className="text-slate-400 border-b border-slate-800 pb-1.5 mb-2 font-semibold">
          Hour: {label}
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between space-x-4">
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Benign:</span>
            </span>
            <span className="font-bold text-white">{benign.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <span className="flex items-center space-x-1.5 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              <span>Malicious:</span>
            </span>
            <span className="font-bold text-rose-300">{attack.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between space-x-4 border-t border-slate-800 pt-1.5 text-slate-300">
            <span>Total Flows:</span>
            <span className="font-bold text-white">{total.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between space-x-4 text-[10px] text-amber-400 font-sans">
            <span>Attack Ratio:</span>
            <span className="font-bold">{attackRatio}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function TrafficChart({ hourlyData, isLoading }) {
  const [chartType, setChartType] = useState('area'); // 'area' or 'stacked'

  const formattedData = (hourlyData?.data || []).map(item => ({
    ...item,
    timeLabel: item.hour ? item.hour.split(' ')[1] || item.hour : 'N/A',
  }));

  const hasData = formattedData.length > 0;

  return (
    <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 shadow-sm backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-cyan-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-200 tracking-wide font-mono">
              TRAFFIC TIMELINE ACTIVITY
            </h2>
            <p className="text-xs text-slate-400">
              Aggregated hourly flow volume &bull; Benign vs Attack patterns
            </p>
          </div>
        </div>

        {/* Legend pills & toggle */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-800/70 text-emerald-400 border border-emerald-900/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Benign</span>
          </span>
          <span className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-800/70 text-rose-400 border border-rose-900/40">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            <span>Malicious</span>
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center space-y-2 text-slate-500">
              <Activity className="w-8 h-8 animate-spin text-cyan-500/50" />
              <span className="text-xs font-mono">Loading telemetry graph...</span>
            </div>
          </div>
        ) : !hasData ? (
          <div className="h-full flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-lg p-6 text-center">
            <BarChart3 className="w-10 h-10 text-slate-600 mb-2" />
            <p className="text-xs font-mono text-slate-400">No hourly activity records found in database.</p>
            <p className="text-[11px] text-slate-500 mt-1 max-w-sm">
              Upload a CSV file or seed dataset to visualize hourly intrusion traffic curves.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                {/* Gradient for Benign */}
                <linearGradient id="benignGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                {/* Gradient for Attack */}
                <linearGradient id="attackGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              
              <XAxis 
                dataKey="timeLabel" 
                stroke="#64748b" 
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                tickLine={false}
              />
              <YAxis 
                stroke="#64748b" 
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                tickLine={false}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="benign_count"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#benignGrad)"
                name="Benign"
              />
              <Area
                type="monotone"
                dataKey="attack_count"
                stroke="#f43f5e"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#attackGrad)"
                name="Malicious"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
