import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';
import { Card, Table, Button, PageHeader, MoodScore } from '@/components';
import { EmployeeLayout } from '@/layouts';
import type { Column } from '@/components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HistoryLog {
  id: string;
  date: string;
  mood: number;
  stress: number;
  energy: number;
  sleep: number;
  notes: string;
}

const MOCK_HISTORY: HistoryLog[] = [
  { id: '1', date: '2026-08-08', mood: 4, stress: 2, energy: 4, sleep: 7.5, notes: 'Felt productive and energetic today.' },
  { id: '2', date: '2026-08-07', mood: 3, stress: 3, energy: 3, sleep: 6.0, notes: 'Had a long meeting, felt slightly tired.' },
  { id: '3', date: '2026-08-06', mood: 5, stress: 1, energy: 5, sleep: 8.5, notes: 'Great sleep. Got out for a walk in the afternoon.' },
  { id: '4', date: '2026-08-05', mood: 4, stress: 2, energy: 4, sleep: 8.0, notes: 'Regular work day. Calm.' },
  { id: '5', date: '2026-08-04', mood: 2, stress: 4, energy: 2, sleep: 5.5, notes: 'Poor sleep. Stressed about deadline.' },
  { id: '6', date: '2026-08-03', mood: 4, stress: 1, energy: 3, sleep: 7.0, notes: 'Relaxing weekend check-in.' },
  { id: '7', date: '2026-08-02', mood: 5, stress: 1, energy: 5, sleep: 9.0, notes: 'Slept in. Very refreshed.' },
];

export default function MoodHistory() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'7d' | '30d'>('7d');

  const chartData = [...MOCK_HISTORY].reverse().map((log) => ({
    date:   log.date.split('-')[2],
    Mood:   log.mood,
    Stress: log.stress,
    Energy: log.energy,
  }));

  const columns: Column<HistoryLog>[] = [
    {
      key: 'date',
      header: 'Check-in Date',
      render: (v) => (
        <span className="font-bold text-zinc-900 flex items-center gap-2">
          <Calendar size={14} className="text-zinc-400" />
          {v as string}
        </span>
      ),
    },
    { key: 'mood',   header: 'Mood Score', render: (v) => <MoodScore score={v as number} size="md" showLabel /> },
    {
      key: 'stress',
      header: 'Stress Level',
      render: (v) => (
        <span className="inline-flex items-center gap-1 font-semibold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full text-xs">
          {v as number} / 5
        </span>
      ),
    },
    {
      key: 'energy',
      header: 'Energy Level',
      render: (v) => (
        <span className="inline-flex items-center gap-1 font-semibold text-[#00C853] bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs">
          {v as number} / 5
        </span>
      ),
    },
    {
      key: 'sleep',
      header: 'Sleep Duration',
      render: (v) => <span className="font-medium text-zinc-700">{v as number} hrs</span>,
    },
    {
      key: 'notes',
      header: 'Confidential Notes',
      render: (v) => (
        <span className="text-zinc-500 text-xs block max-w-xs truncate" title={v as string}>
          {(v as string) || '—'}
        </span>
      ),
    },
  ];

  return (
    <EmployeeLayout>
      <div className="flex w-full flex-col gap-6 animate-fadeIn">
        <PageHeader
          title="Mood & Wellness History"
          subtitle="Review past check-in submissions and analyze your emotional trends over time"
          backButton={
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ArrowLeft size={15} />}
              onClick={() => navigate(-1)}
              className="text-zinc-600 hover:text-zinc-900 font-semibold !pl-0"
            >
              Back to Dashboard
            </Button>
          }
          action={
            <div className="flex rounded-xl border border-zinc-200/80 bg-zinc-100 p-1">
              {(['7d', '30d'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={[
                    'px-4 py-2 text-xs font-bold rounded-lg transition-all duration-150 border-none cursor-pointer',
                    activeTab === tab
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'bg-transparent text-zinc-500 hover:text-zinc-900',
                  ].join(' ')}
                >
                  {tab === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
                </button>
              ))}
            </div>
          }
        />

        {/* ── Trend Graph Card ── */}
        <Card className="flex min-h-[380px] flex-col gap-6 p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
            <div>
              <h2 className="text-base font-bold text-zinc-900 m-0">
                Emotional & Physical Trend Index
              </h2>
              <p className="text-xs text-zinc-500 m-0 mt-0.5">
                Correlation curve across self-reported mood, stress, and physical energy
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-[#00C853]">
                <span className="w-3 h-3 rounded-full bg-[#00E676]" /> Mood
              </span>
              <span className="flex items-center gap-1.5 text-red-500">
                <span className="w-3 h-3 rounded-full bg-red-500" /> Stress
              </span>
              <span className="flex items-center gap-1.5 text-blue-500">
                <span className="w-3 h-3 rounded-full bg-blue-500" /> Energy
              </span>
            </div>
          </div>

          <div className="flex-1 min-h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F4F5" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#71717A', fontSize: 12 }} />
                <YAxis domain={[1, 5]} tickCount={5} tickLine={false} axisLine={false} tick={{ fill: '#71717A', fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="Mood"   stroke="#00E676" strokeWidth={3} activeDot={{ r: 6 }} name="Mood" />
                <Line type="monotone" dataKey="Stress" stroke="#EF4444" strokeWidth={2} name="Stress" />
                <Line type="monotone" dataKey="Energy" stroke="#3B82F6" strokeWidth={2} name="Energy" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* ── Table Card ── */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900 m-0">Detailed Check-in Log History</h2>
            <span className="text-xs text-zinc-400 font-medium">Showing {MOCK_HISTORY.length} records</span>
          </div>

          <Table
            columns={columns}
            data={MOCK_HISTORY}
            keyExtractor={(row) => row.id}
            emptyIcon={<FileText size={28} />}
            emptyMessage="No historical check-ins recorded yet"
          />
        </div>

      </div>
    </EmployeeLayout>
  );
}
