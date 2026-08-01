import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  Legend
} from 'recharts';
import { Activity, Flame, Sparkles } from 'lucide-react';

export interface ToolUsageData {
  name: string;
  count: number;
  color: string;
}

interface LiveToolChartProps {
  data: ToolUsageData[];
  totalUses: number;
}

export const LiveToolChart: React.FC<LiveToolChartProps> = ({ data, totalUses }) => {
  // Find top used tool
  const topTool = [...data].sort((a, b) => b.count - a.count)[0];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Live Tools Usage Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time tool execution metrics tracking tool popularity across all users
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40">
          <Flame className="w-4 h-4 text-amber-500 shrink-0" />
          <div className="text-xs">
            <span className="font-medium text-slate-600 dark:text-slate-300">Most Popular: </span>
            <span className="font-extrabold text-slate-900 dark:text-slate-100">{topTool?.name || 'Check live UID Fb'}</span>
          </div>
        </div>
      </div>

      {/* Recharts Bar Chart */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }}
              interval={0}
              angle={-15}
              textAnchor="end"
            />
            <YAxis tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as ToolUsageData;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
                      <p className="font-extrabold text-amber-300">{item.name}</p>
                      <p className="font-medium">
                        Executions: <span className="font-bold text-emerald-400">{item.count}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Grid Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
        {data.map((tool) => (
          <div
            key={tool.name}
            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: tool.color }} />
              <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 truncate">
                {tool.name}
              </span>
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-slate-100 pl-4">
              {tool.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
