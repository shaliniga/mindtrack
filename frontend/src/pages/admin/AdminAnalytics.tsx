import { useState } from 'react';
import { Card, PageHeader } from '@/components';
import { AdminLayout } from '@/layouts';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WEEKLY_TREND = [
  { week: 'Week 1', checkinRate: 85, stressLevel: 2.1 },
  { week: 'Week 2', checkinRate: 88, stressLevel: 2.2 },
  { week: 'Week 3', checkinRate: 91, stressLevel: 2.0 },
  { week: 'Week 4', checkinRate: 94, stressLevel: 1.8 },
];

const DEPT_COMPARISON = [
  { name: 'Engineering', avgMood: 3.5, avgStress: 3.8 },
  { name: 'Product',     avgMood: 4.1, avgStress: 2.6 },
  { name: 'Sales',       avgMood: 3.8, avgStress: 3.2 },
  { name: 'Marketing',   avgMood: 4.0, avgStress: 2.9 },
  { name: 'HR Ops',      avgMood: 4.5, avgStress: 1.5 },
];

export default function AdminAnalytics() {
  const [rangeFilter, setRangeFilter] = useState<'30' | '90'>('30');

  const RANGES = [
    { key: '30' as const, label: 'Last 30 Days' },
    { key: '90' as const, label: 'Last 90 Days' },
  ];

  return (
    <AdminLayout>
      <div className="flex w-full flex-col gap-6 animate-fadeIn">
        <PageHeader
          title="Organization Analytics & Deep Dive"
          subtitle="Long-term comparative metrics mapping engagement rates against stress indicators"
          action={
            <div className="flex p-1 bg-zinc-100 rounded-xl border border-zinc-200/80">
              {RANGES.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setRangeFilter(key)}
                  className={[
                    'px-4 py-2 text-xs font-bold rounded-lg transition-all duration-150 border-none cursor-pointer',
                    rangeFilter === key
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'bg-transparent text-zinc-500 hover:text-zinc-900',
                  ].join(' ')}
                >
                  {label}
                </button>
              ))}
            </div>
          }
        />

        {/* ── Visual Analytics Charts Grid (CSS Grid lg:grid-cols-2, gap-6) ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* System Activity & Stress Correlation */}
          <Card className="flex flex-col gap-6 min-h-[400px] p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-100">
              <div>
                <h2 className="text-base font-semibold text-zinc-900 m-0">
                  System Activity & Stress Correlation
                </h2>
                <p className="text-xs text-zinc-500 m-0 mt-0.5">
                  Check-in participation percentage vs average reported stress
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-[#00C853]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00E676]" /> Check-in %
                </span>
                <span className="flex items-center gap-1.5 text-red-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Avg Stress
                </span>
              </div>
            </div>

            <div className="flex-1 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={WEEKLY_TREND} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F4F5" />
                  <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fill: '#71717A', fontSize: 12 }} />
                  <YAxis yAxisId="left"  domain={[50, 100]} tickLine={false} axisLine={false} tick={{ fill: '#71717A', fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" domain={[1, 5]} tickLine={false} axisLine={false} tick={{ fill: '#71717A', fontSize: 12 }} />
                  <Tooltip />
                  <Line yAxisId="left"  type="monotone" dataKey="checkinRate" stroke="#00E676" strokeWidth={3} activeDot={{ r: 6 }} name="Check-in %" />
                  <Line yAxisId="right" type="monotone" dataKey="stressLevel" stroke="#EF4444" strokeWidth={2} name="Avg Stress" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Division Comparison */}
          <Card className="flex flex-col gap-6 min-h-[400px] p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-100">
              <div>
                <h2 className="text-base font-semibold text-zinc-900 m-0">
                  Mood vs Stress by Division
                </h2>
                <p className="text-xs text-zinc-500 m-0 mt-0.5">
                  Side-by-side department level wellness and stress indices
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-[#00C853]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00E676]" /> Mood
                </span>
                <span className="flex items-center gap-1.5 text-red-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Stress
                </span>
              </div>
            </div>

            <div className="flex-1 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DEPT_COMPARISON} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F4F5" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#71717A', fontSize: 12 }} />
                  <YAxis domain={[0, 5]} tickLine={false} axisLine={false} tick={{ fill: '#71717A', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="avgMood"   fill="#00E676" name="Mood Score"   radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="avgStress" fill="#EF4444" name="Stress Rating" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

        </div>
      </div>
    </AdminLayout>
  );
}
