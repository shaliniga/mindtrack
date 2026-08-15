import { useNavigate } from 'react-router-dom';
import { Users, AlertTriangle, Activity, CheckSquare, ArrowRight } from 'lucide-react';
import { StatCard, Table, PageHeader, MoodScore, PageSpinner } from '@/components';
import { ManagerLayout } from '@/layouts';
import type { Column } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { managerService } from '@/services/manager.service';


interface TeamMember {
  id: string;
  name: string;
  department: string;
  lastLogDate: string;
  avgMood: number;
  trend: 'up' | 'down' | 'stable';
}

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

  const { data: team = [], isPending: isTeamPending } = useQuery({
    queryKey: ['manager', 'team'],
    queryFn: managerService.getTeam,
  });

  const { data: stats, isPending: isStatsPending } = useQuery({
    queryKey: ['manager', 'team', 'stats'],
    queryFn: managerService.getTeamStats,
  });

  const isLoading = isTeamPending || isStatsPending;

  if (isLoading) {
    return (
      <ManagerLayout>
        <PageSpinner />
      </ManagerLayout>
    );
  }



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
    { key: 'department', header: 'Department', render: (v) => <span className="text-zinc-600 text-xs font-medium">{v as string}</span> },
    {
      key: 'lastLogDate',
      header: 'Last Check-in',
      render: (v) => v && v !== 'N/A' ? (
        <span className="text-zinc-500 text-xs font-medium">
          {new Date(v as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      ) : (
        <span className="text-zinc-400 text-xs">N/A</span>
      )
    },
    {
      key: 'avgMood',
      header: '7-Day Avg Mood',
      render: (v) => (v && (v as number) > 0) ? (
        <MoodScore score={v as number} showLabel />
      ) : (
        <span className="text-zinc-400 text-xs">N/A</span>
      )
    },
    {
      key: 'trend',
      header: 'Trend Indicator',
      render: (v, row) => (row.lastLogDate && row.lastLogDate !== 'N/A') ? (
        trendBadge(v as string)
      ) : (
        <span className="text-zinc-400 text-xs">N/A</span>
      ),
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
            value={stats?.avgMood ? `${stats.avgMood} / 5` : 'N/A'}
            icon={<Users size={20} />}
            color="#00E676"
            trend="stable"
            trendLabel="7-day rolling average"
          />
          <StatCard
            label="Check-in Rate"
            value={stats?.checkInRate || 'N/A'}
            icon={<CheckSquare size={20} />}
            color="#10B981"
            trend="stable"
            trendLabel="Distinct members logged in 7d"
          />
          <StatCard
            label="Active Alerts"
            value={stats?.activeAlerts !== undefined ? `${stats.activeAlerts} Alerts` : 'N/A'}
            icon={<AlertTriangle size={20} />}
            color="#EF4444"
            trend="stable"
            trendLabel="Needs manager support"
          />
          <StatCard
            label="Team Size"
            value={`${team.length} Members`}
            icon={<Activity size={20} />}
            color="#3B82F6"
            trend="stable"
            trendLabel="Active profiles linked to you"
          />
        </div>

        {/* ── 2. Main Sections (Team Roster full-width) ── */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h2 className="text-base font-semibold text-zinc-900 m-0">Team Members Roster</h2>
              <p className="text-xs text-zinc-500 m-0 mt-0.5">Click any member to open their detailed metric history</p>
            </div>
            <span className="text-xs text-zinc-400 font-medium">{team.length} active members</span>
          </div>

          <Table
            columns={columns}
            data={team.map((t: any) => ({
              id: t.id,
              employee_id: t.employee_id,
              name: t.name,
              department: t.department || 'N/A',
              lastLogDate: t.lastLogDate || 'N/A',
              avgMood: t.avgMood || 0,
              trend: t.trend || 'stable'
            }))}
            keyExtractor={(row) => row.id}
            onRowClick={(row) => navigate(`/manager/member/${row.id}`)}
            emptyMessage="No team members assigned to this group"
          />
        </div>
      </div>
    </ManagerLayout>
  );
}
