import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';

export interface PlatformStatData {
  name: string;
  generated: number;
  copied: number;
  fill: string;
}

interface LivePlatformChartProps {
  data: PlatformStatData[];
  totalGenerated: number;
  totalCopies: number;
}

export const LivePlatformChart: React.FC<LivePlatformChartProps> = ({
  data,
  totalGenerated,
  totalCopies,
}) => {
  return (
    <div className="space-y-6">
      
      {/* Platform Comparison Bar Chart */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Platform Usage & Copy Activity Live Chart</span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live comparison of generated profiles & copy actions across Instagram, Facebook, TikTok, LinkedIn & Twitter
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <div className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              Generated: {totalGenerated}
            </div>
            <div className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Copies: {totalCopies}
            </div>
          </div>
        </div>

        {/* Fresh User Empty State Banner */}
        {totalGenerated === 0 && totalCopies === 0 && (
          <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/50 text-center space-y-1">
            <div className="text-xs font-extrabold text-indigo-700 dark:text-indigo-300">
              Fresh User Session Initialized (0 Tool Hits)
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Run any generator or UID tool check above to populate your live personal activity charts!
            </p>
          </div>
        )}

        {/* Bar Chart */}
        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="generated" name="Generated Names" fill="#6366f1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="copied" name="Copied Details" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribution Donut Chart & Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Donut Distribution */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
            Platform Copy Share (%)
          </h4>
          <p className="text-xs text-slate-500">
            Distribution of profile copies across social networks
          </p>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="copied"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Stat Cards List */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
            Top Social Platform Activity
          </h4>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
            {data.map((item) => (
              <div
                key={item.name}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 font-bold">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-slate-800 dark:text-slate-200">{item.name}</span>
                </div>

                <div className="flex items-center gap-3 font-mono font-bold text-[11px]">
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {item.generated} Gen
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {item.copied} Copied
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
