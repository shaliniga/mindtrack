import { useNavigate } from 'react-router-dom';
import { Users, AlertTriangle, Activity, CheckSquare, ArrowRight } from 'lucide-react';
import { Card, StatCard, Table, PageHeader, MoodScore } from '@/components';
import { ManagerLayout } from '@/layouts';
import type { Column } from '@/components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TeamMember {
  id: string;
  name: string;
  department: string;
  lastLogDate: string;
  avgMood: number;
  trend: 'up' | 'down' | 'stable';
}

const MOCK_TEAM: TeamMember[] = [
  { id: 'emp-1', name: 'Alex Johnson',    department: 'Engineering', lastLogDate: '2026-08-08', avgMood: 4.2, trend: 'up' },
  { id: 'emp-2', name: 'Emily Davis',     department: 'Engineering', lastLogDate: '2026-08-08', avgMood: 2.1, trend: 'down' },
  { id: 'emp-3', name: 'Michael Brown',   department: 'Design',      lastLogDate: '2026-08-07', avgMood: 3.8, trend: 'stable' },
  { id: 'emp-4', name: 'Jessica Taylor',  department: 'Product',     lastLogDate: '2026-08-08', avgMood: 4.5, trend: 'up' },
  { id: 'emp-5', name: 'David Wilson',    department: 'Engineering', lastLogDate: '2026-08-06', avgMood: 2.4, trend: 'down' },
];

const TEAM_TREND_DATA = [
  { date: 'Mon', avgMood: 3.8 },
  { date: 'Tue', avgMood: 3.6 },
  { date: 'Wed', avgMood: 3.9 },
  { date: 'Thu', avgMood: 4.1 },
  { date: 'Fri', avgMood: 3.5 },
  { date: 'Sat', avgMood: 3.7 },
  { date: 'Sun', avgMood: 3.9 },
];

const trendBadge = (t: string) => {
  if (t === 'up') {
    return <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs font-semibold">Improving ↑</span>;
  }
  if (t === 'down') {
    return <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full text-xs font-semibold">Declining ↓</span>;
  }
  return <span className="inline-flex items-center gap-1 text-zinc-600 bg-zinc-100 px-2.5 py-0.5 rounded-full text-xs font-semibold">Stable →</span>;
};

export default function ManagerDashboard() {
  const navigate = useNavigate();

  const columns: Column<TeamMember>[] = [
    {
      key: 'name',
      header: 'Team Member',
      render: (v) => (
        <span className="font-bold text-zinc-900 flex items-center gap-2">
          {v as string}
        </span>
      ),
    },
    { key: 'department',  header: 'Department', render: (v) => <span className="text-zinc-600 text-xs font-medium">{v as string}</span> },
    { key: 'lastLogDate', header: 'Last Check-in', render: (v) => <span className="text-zinc-500 text-xs">{v as string}</span> },
    { key: 'avgMood',     header: '7-Day Avg Mood', render: (v) => <MoodScore score={v as number} showLabel /> },
    {
      key: 'trend',
      header: 'Trend Indicator',
      render: (v) => trendBadge(v as string),
    },
    {
      key: 'actions',
      header: '',
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/manager/member/${row.id}`);
          }}
          className="text-xs font-bold text-[#00C853] hover:underline bg-transparent border-none cursor-pointer flex items-center gap-1"
        >
          View details <ArrowRight size={13} />
        </button>
      ),
    },
  ];

  return (
    <ManagerLayout>
      <div className="flex w-full flex-col gap-6 animate-fadeIn">
        <PageHeader
          title="Team Wellness Overview"
          subtitle="Monitor team wellness metrics, aggregate daily check-ins, and identify early burnout indicators"
        />

        {/* ── 1. 4 KPI Overview Cards (Equal Heights, xl:grid-cols-4, gap-6) ── */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Team Avg Mood"
            value="3.7 / 5"
            icon={<Users size={20} />}
            color="#00E676"
            trend="up"
            trendLabel="+0.2 this week"
          />
          <StatCard
            label="Check-in Rate"
            value="80%"
            icon={<CheckSquare size={20} />}
            color="#10B981"
            trend="up"
            trendLabel="4 of 5 logged today"
          />
          <StatCard
            label="Active Alerts"
            value="2 Members"
            icon={<AlertTriangle size={20} />}
            color="#EF4444"
            trend="down"
            trendLabel="Needs manager support"
          />
          <StatCard
            label="Wellness Streak"
            value="14 Days"
            icon={<Activity size={20} />}
            color="#3B82F6"
            trend="stable"
            trendLabel="Consistent team logging"
          />
        </div>

        {/* ── 2. Main Sections (CSS Grid: Roster 2-col + Trend Chart 1-col on lg+, gap-6) ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Team Roster Card (spans 2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h2 className="text-base font-semibold text-zinc-900 m-0">Team Members Roster</h2>
                <p className="text-xs text-zinc-500 m-0 mt-0.5">Click any member to open their detailed metric history</p>
              </div>
              <span className="text-xs text-zinc-400 font-medium">5 active members</span>
            </div>

            <Table
              columns={columns}
              data={MOCK_TEAM}
              keyExtractor={(row) => row.id}
              onRowClick={(row) => navigate(`/manager/member/${row.id}`)}
              emptyMessage="No team members assigned to this group"
            />
          </div>

          {/* Team Average Trend Chart Card (spans 1 col, equal height) */}
          <Card className="flex min-h-[380px] flex-col gap-6 p-8 lg:col-span-1">
            <div className="pb-4 border-b border-zinc-100">
              <h2 className="text-base font-semibold text-zinc-900 m-0">
                Team Average Trend (30 Days)
              </h2>
              <p className="text-xs text-zinc-500 m-0 mt-0.5">Rolling average mood score across all members</p>
            </div>

            <div className="flex-1 min-h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TEAM_TREND_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F4F5" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#71717A', fontSize: 12 }} />
                  <YAxis domain={[1, 5]} tickCount={5} tickLine={false} axisLine={false} tick={{ fill: '#71717A', fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="avgMood"
                    stroke="#00E676"
                    strokeWidth={3}
                    activeDot={{ r: 6, fill: '#00C853' }}
                    name="Team Avg"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

        </div>
      </div>
    </ManagerLayout>
  );
}
