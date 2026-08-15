import { useNavigate } from 'react-router-dom';
import { Calendar, Flame, PenLine, History, AlertTriangle, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card, StatCard, Button, MoodScore } from '@/components';
import { useAuthStore } from '@/stores/authStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { moodService } from '@/services/mood.service';
import { alertService } from '@/services/alert.service';
import { EmployeeLayout } from '@/layouts';

export default function EmployeeDashboard() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const { data: todayMood } = useQuery({
    queryKey: ['mood', 'today'],
    queryFn: moodService.getToday,
  });

  const { data: stats } = useQuery({
    queryKey: ['mood', 'stats', 7],
    queryFn: () => moodService.getStats(7),
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts'],
    queryFn: alertService.getAlerts,
  });

  const loggedToday = !!todayMood;
  const todayScore = todayMood?.mood_score as 1 | 2 | 3 | 4 | 5 | undefined;

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const chartData = (stats || []).map((s: any) => ({
    date: new Date(s.date).toLocaleDateString('en-US', { weekday: 'short' }),
    mood: Number(s.avgMood),
    stress: Number(s.avgStress),
    energy: Number(s.avgEnergy),
  }));

  const avgMood = chartData.length > 0 
    ? (chartData.reduce((acc: number, cur: any) => acc + cur.mood, 0) / chartData.length).toFixed(1)
    : '0.0';

  const streak = chartData.length; // Simplified streak calculation for demo

  return (
    <EmployeeLayout>
      <div className="flex w-full flex-col gap-6 animate-fadeIn">
        <div
          className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-[1.75rem] border border-emerald-100/90 p-8 shadow-[0_16px_50px_rgba(0,230,118,0.08)] sm:p-10 md:flex-row md:items-center"
          style={{ background: 'linear-gradient(135deg, #E8FDF5 0%, #FFFFFF 60%, #F0FDF4 100%)' }}
        >
          <div className="flex flex-col gap-2 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#00C853] text-xs font-bold w-fit">
              <span>☀️</span> Daily Wellness Overview
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight m-0">
              Good morning, {user?.name ?? 'Employee'}!
            </h1>
            <p className="text-sm text-zinc-500 flex items-center gap-2 m-0 mt-0.5">
              <Calendar size={15} className="text-zinc-400" />
              <span>{todayStr}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 z-10 flex-wrap">
            <Button
              variant="primary"
              size="md"
              leftIcon={<PenLine size={16} />}
              onClick={() => navigate('/employee/log-mood')}
              className="font-bold shadow-md shadow-[#00E676]/20 h-10 px-6"
            >
              Log Today's Mood
            </Button>
            <Button
              variant="secondary"
              size="md"
              leftIcon={<History size={16} />}
              onClick={() => navigate('/employee/history')}
              className="font-semibold h-10 px-6"
            >
              View History
            </Button>
          </div>
        </div>

        {/* ── 2. KPI Cards Grid (Equal Heights, 3 columns: md:grid-cols-3, gap-6) ── */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Today's Check-in Card (Equal Height) */}
          <Card className="flex h-full flex-col justify-between gap-6 p-8">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Today's Check-in
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00C853] flex items-center justify-center font-bold shrink-0">
                <CheckCircle2 size={20} />
              </div>
            </div>

            <div className="my-1">
              {loggedToday ? (
              <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-zinc-700">Logged as</span>
                  <MoodScore score={todayScore || 1} size="lg" />
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-zinc-500">No mood logged yet today.</span>
                  <button
                    type="button"
                    onClick={() => navigate('/employee/log-mood')}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#00C853] hover:underline bg-transparent border-none p-0 cursor-pointer w-fit mt-1"
                  >
                    Log check-in now <ArrowRight size={15} />
                  </button>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-zinc-100 text-xs text-zinc-400 mt-auto">
              Daily check-ins power team wellness analytics
            </div>
          </Card>

          {/* Check-in Streak */}
          <StatCard
            label="Check-in Streak"
            value={`${streak} days`}
            icon={<Flame size={20} />}
            color="#F59E0B"
            trend="up"
            trendLabel="Keep the fire going!"
          />

          {/* Weekly Avg Mood */}
          <StatCard
            label="Weekly Avg Mood"
            value={`${avgMood} / 5`}
            icon={<User size={20} />}
            color="#00E676"
            trend="stable"
            trendLabel="Stable compared to last week"
          />
        </div>

        {/* ── 3. Main Dashboard Sections (CSS Grid: 2-col + 1-col on lg+, gap-6) ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Trend Area Chart (spans 2 columns) */}
          <Card className="flex min-h-[400px] flex-col gap-6 p-8 lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-100">
              <div>
                <h2 className="text-base font-semibold text-zinc-900 m-0">
                  Weekly Mood & Stress Overview
                </h2>
                <p className="text-xs text-zinc-500 m-0 mt-0.5">
                  Comparison of your mood, stress levels and energy logs this week
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00E676]" /> Mood
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Stress
                </span>
              </div>
            </div>

            <div className="flex-1 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMoodD" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#00E676" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#00E676" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorStressD" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F4F5" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#71717A', fontSize: 12 }} />
                  <YAxis domain={[1, 5]} tickCount={5} tickLine={false} axisLine={false} tick={{ fill: '#71717A', fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="mood"   stroke="#00E676" strokeWidth={3} fillOpacity={1} fill="url(#colorMoodD)"   name="Mood" />
                  <Area type="monotone" dataKey="stress" stroke="#EF4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorStressD)" name="Stress" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Recent Alerts (spans 1 column, equal height) */}
          <Card className="flex min-h-[400px] flex-col justify-between gap-6 p-8 lg:col-span-1">
            <div className="flex flex-col gap-5">
              <div className="pb-4 border-b border-zinc-100">
                <h2 className="text-base font-semibold text-zinc-900 m-0">Recent Alerts</h2>
                <p className="text-xs text-zinc-500 m-0 mt-0.5">Automated wellness notifications</p>
              </div>

              <div className="flex flex-col gap-4 overflow-y-auto max-h-[250px]">
                {alerts.length > 0 ? (
                  alerts.map((alert: any) => (
                    <div key={alert.id} className="flex gap-4 p-4 rounded-xl bg-amber-50 border border-amber-200/80">
                      <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-amber-950">
                          {alert.alert_type === 'mood_decline' ? 'Mood Decline Check' : 'Wellness Alert'}
                        </span>
                        <span className="text-xs text-amber-900/80 leading-relaxed">
                          {alert.message || 'Your average mood was lower than usual. Consider taking a short break or recharge time!'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-zinc-500 text-center py-8">
                    No active alerts. You're doing great! 🌟
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 mt-auto">
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={() => navigate('/employee/history')}
                className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 h-9"
              >
                View Full Log History →
              </Button>
            </div>
          </Card>

        </div>

      </div>
    </EmployeeLayout>
  );
}
