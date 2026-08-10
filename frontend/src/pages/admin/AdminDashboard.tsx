import { Users, AlertTriangle, Smile, ShieldCheck } from 'lucide-react';
import { Card, StatCard, PageHeader } from '@/components';
import { AdminLayout } from '@/layouts';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ORG_TREND_DATA = [
  { date: 'Mon', avgMood: 3.9 },
  { date: 'Tue', avgMood: 3.8 },
  { date: 'Wed', avgMood: 4.1 },
  { date: 'Thu', avgMood: 4.0 },
  { date: 'Fri', avgMood: 3.7 },
  { date: 'Sat', avgMood: 3.8 },
  { date: 'Sun', avgMood: 4.0 },
];

const DEPT_BREAKDOWN = [
  { name: 'Engineering', mood: 3.6 },
  { name: 'Product',     mood: 4.2 },
  { name: 'Sales',       mood: 3.9 },
  { name: 'Marketing',   mood: 4.1 },
  { name: 'HR Ops',      mood: 4.4 },
];

export default function AdminDashboard() {
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
            value="42 Users"
            icon={<Users size={20} />}
            color="#00E676"
          />
          <StatCard
            label="Active Alerts"
            value="3 High Risk"
            icon={<AlertTriangle size={20} />}
            color="#EF4444"
            trend="down"
            trendLabel="2 resolved today"
          />
          <StatCard
            label="Org Average Mood"
            value="3.9 / 5"
            icon={<Smile size={20} />}
            color="#10B981"
            trend="up"
            trendLabel="+0.1 this month"
          />
          <StatCard
            label="System Check-ins"
            value="94%"
            icon={<ShieldCheck size={20} />}
            color="#3B82F6"
            trend="up"
            trendLabel="High team engagement"
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
                <AreaChart data={ORG_TREND_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
                <BarChart data={DEPT_BREAKDOWN} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
