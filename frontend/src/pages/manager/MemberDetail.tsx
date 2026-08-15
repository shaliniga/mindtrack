import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, AlertTriangle, Calendar, Heart } from 'lucide-react';
import { Button, Card, Table, PageHeader, MoodScore } from '@/components';
import { ManagerLayout } from '@/layouts';
import type { Column } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { managerService } from '@/services/manager.service';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MemberLog {
  id: string;
  date: string;
  mood: number;
  stress: number;
  energy: number;
  sleep: number;
}

export default function MemberDetail() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: member } = useQuery({
    queryKey: ['manager', 'member', id],
    queryFn: () => managerService.getMember(id!),
    enabled: !!id,
  });

  const name = member?.profile?.name || 'Loading...';
  const roleTitle = member?.profile?.job_title || 'Employee';
  const department = member?.profile?.department || 'N/A';

  const logs = member?.recentLogs || [];

  const chartData = [...logs].reverse().map((log: any) => ({
    date: new Date(log.log_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Mood: log.mood_score,
    Stress: log.stress_level,
    Energy: log.energy_level,
  }));

  const avgMood = logs.length > 0 
    ? (logs.reduce((acc: number, cur: any) => acc + cur.mood_score, 0) / logs.length).toFixed(1)
    : '0.0';

  const avgStress = logs.length > 0
    ? (logs.reduce((acc: number, cur: any) => acc + cur.stress_level, 0) / logs.length).toFixed(1)
    : '0.0';

  const alertStatus = member?.activeAlerts && member.activeAlerts.length > 0
    ? member.activeAlerts[0].alert_type === 'mood_decline' ? 'Mood Decline' : 'Active Alert'
    : 'Healthy';

  const columns: Column<MemberLog>[] = [
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
    { key: 'mood',   header: 'Mood Score',   render: (v) => <MoodScore score={v as number} showLabel /> },
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
    { key: 'sleep',  header: 'Sleep Duration', render: (v) => <span className="font-medium text-zinc-700">{v as number} hrs</span> },
  ];

  return (
    <ManagerLayout>
      <div className="flex w-full flex-col gap-6 animate-fadeIn">
        <PageHeader
          title={`Team Member: ${name}`}
          subtitle={`${roleTitle} · ${department} Division`}
          backButton={
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ArrowLeft size={15} />}
              onClick={() => navigate('/manager')}
              className="text-zinc-600 hover:text-zinc-900 font-semibold !pl-0"
            >
              Back to Team Overview
            </Button>
          }
        />

        {/* ── Summary Stats (grid-cols-1 sm:grid-cols-3 gap-6) ── */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card className="flex items-center gap-6 p-8">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#00C853] flex items-center justify-center shrink-0">
              <Heart size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">7-Day Avg Mood</span>
              <div className="text-xl font-extrabold text-zinc-900 mt-1 flex items-center gap-2">
                <MoodScore score={Number(avgMood) || 1} size="lg" />
              </div>
            </div>
          </Card>

          <Card className="flex items-center gap-6 p-8">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Activity size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Average Stress</span>
              <span className="text-xl font-extrabold text-rose-600 mt-1">{avgStress} / 5</span>
            </div>
          </Card>

          <Card className="flex items-center gap-6 p-8">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Alert Status</span>
              <span className="text-sm font-bold text-amber-600 mt-1">{alertStatus}</span>
            </div>
          </Card>
        </div>

        {/* ── Table & Visual Chart Grid (lg:grid-cols-3 gap-6) ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h2 className="text-base font-semibold text-zinc-900 m-0">Recent Check-in Logs</h2>
            <Table
              columns={columns as any}
              data={logs.map((log: any) => ({
                id: log.id,
                date: new Date(log.log_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                mood: log.mood_score,
                stress: log.stress_level,
                energy: log.energy_level,
                sleep: log.sleep_hours,
              }))}
              keyExtractor={(row: any) => row.id}
              emptyMessage="No mood logs found for this member"
            />
          </div>

          <Card className="flex min-h-[380px] flex-col gap-6 p-8 lg:col-span-1">
            <div className="pb-4 border-b border-zinc-100">
              <h3 className="text-base font-bold text-zinc-900 m-0">Metrics Visualization</h3>
              <p className="text-xs text-zinc-500 m-0 mt-0.5">Mood vs Stress trajectory over past 7 logs</p>
            </div>

            <div className="flex-1 min-h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colMood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#00E676" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#00E676" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colStress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F4F5" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#71717A', fontSize: 12 }} />
                  <YAxis domain={[1, 5]} tickCount={5} tickLine={false} axisLine={false} tick={{ fill: '#71717A', fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="Mood"   stroke="#00E676" strokeWidth={3} fillOpacity={1} fill="url(#colMood)"   name="Mood" />
                  <Area type="monotone" dataKey="Stress" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colStress)" name="Stress" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

      </div>
    </ManagerLayout>
  );
}
