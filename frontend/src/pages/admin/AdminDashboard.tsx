import { Users, AlertTriangle, Smile, ShieldCheck } from 'lucide-react';
import { Card, StatCard, PageHeader } from '@/components';
import { AdminLayout } from '@/layouts';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminService.getStats,
  });

  const { data: trend = [] } = useQuery({
    queryKey: ['admin', 'trend', 30],
    queryFn: () => adminService.getTrend(30),
  });

  const { data: depts = [] } = useQuery({
    queryKey: ['admin', 'depts'],
    queryFn: adminService.getDepts,
  });

  const chartData = trend.map((t: any) => ({
    date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    avgMood: Number(t.avgMood),
  }));

  const deptData = depts.map((d: any) => ({
    name: d.department,
    mood: Number(d.avgMood),
  }));
  return (
    <AdminLayout>
      <div className="flex w-full flex-col gap-6 animate-fadeIn">
        <PageHeader
          title="HR Admin Overview"
          subtitle="Organization-wide wellness metrics, high-risk alert statuses, and divisional mood averages"
        />

        {/* ── 1. 4 KPI Metric Cards (Equal Height, xl:grid-cols-4, gap-6) ── */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Employees"
            value={stats?.totalEmployees !== undefined ? `${stats.totalEmployees} Users` : 'N/A'}
            icon={<Users size={20} />}
            color="#00E676"
          />
          <StatCard
            label="Active Alerts"
            value={stats?.activeAlerts !== undefined ? `${stats.activeAlerts} Active` : 'N/A'}
            icon={<AlertTriangle size={20} />}
            color="#EF4444"
            trend="stable"
            trendLabel="Needs manager support"
          />
          <StatCard
            label="Org Average Mood"
            value={stats?.orgAvgMood ? `${stats.orgAvgMood} / 5` : 'N/A'}
            icon={<Smile size={20} />}
            color="#10B981"
            trend="stable"
            trendLabel="Rolling baseline index"
          />
          <StatCard
            label="Weekly Check-ins"
            value={stats?.checkinsThisWeek !== undefined ? `${stats.checkinsThisWeek} logs` : 'N/A'}
            icon={<ShieldCheck size={20} />}
            color="#3B82F6"
            trend="stable"
            trendLabel="Engagement this week"
          />
        </div>

        {/* ── 2. Visual Analytics Charts Grid (CSS Grid 2 equal columns on lg+, gap-6) ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Org Mood Trend Card */}
          <Card className="flex flex-col gap-6 min-h-[400px] p-8">
            <div className="pb-4 border-b border-zinc-100">
              <h2 className="text-base font-semibold text-zinc-900 m-0">
                Organization Mood Trend (30 Days)
              </h2>
              <p className="text-xs text-zinc-500 m-0 mt-0.5">
                Rolling daily average mood index calculated across all teams
              </p>
            </div>
            <div className="flex-1 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOrg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#00E676" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#00E676" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F4F5" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#71717A', fontSize: 12 }} />
                  <YAxis domain={[1, 5]} tickCount={5} tickLine={false} axisLine={false} tick={{ fill: '#71717A', fontSize: 12 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="avgMood"
                    stroke="#00E676"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorOrg)"
                    name="Avg Mood"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Department Bar Chart Card */}
          <Card className="flex flex-col gap-6 min-h-[400px] p-8">
            <div className="pb-4 border-b border-zinc-100">
              <h2 className="text-base font-semibold text-zinc-900 m-0">
                Mood Index by Department
              </h2>
              <p className="text-xs text-zinc-500 m-0 mt-0.5">
                Average self-logged score aggregated by company division
              </p>
            </div>
            <div className="flex-1 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F4F5" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#71717A', fontSize: 12 }} />
                  <YAxis domain={[0, 5]} tickCount={6} tickLine={false} axisLine={false} tick={{ fill: '#71717A', fontSize: 12 }} />
                  <Tooltip />
                  <Bar
                    dataKey="mood"
                    fill="#00E676"
                    radius={[6, 6, 0, 0]}
                    name="Avg Mood"
                    maxBarSize={45}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

        </div>
      </div>
    </AdminLayout>
  );
}
