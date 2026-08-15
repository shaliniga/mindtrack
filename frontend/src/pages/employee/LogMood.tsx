import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ArrowLeft, Sparkles, Info, Heart, Moon, Zap, MessageSquare } from 'lucide-react';
import { Button, Card, Input, PageHeader } from '@/components';
import { EmployeeLayout } from '@/layouts';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moodService } from '@/services/mood.service';

const moodFormSchema = z.object({
  moodScore:    z.number().min(1).max(5),
  stressLevel:  z.number().min(1).max(5),
  energyLevel:  z.number().min(1).max(5),
  sleepHours:   z.number().min(0, 'Cannot be negative').max(24, 'Cannot exceed 24 hours'),
  sleepQuality: z.number().min(1).max(5),
  notes:        z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

type MoodForm = z.infer<typeof moodFormSchema>;

const MOODS = [
  { score: 1, emoji: '😞', label: 'Very Low', color: '#EF4444', desc: 'Exhausted' },
  { score: 2, emoji: '😟', label: 'Low',      color: '#F97316', desc: 'Stressed' },
  { score: 3, emoji: '😐', label: 'Neutral',  color: '#EAB308', desc: 'Okay' },
  { score: 4, emoji: '😊', label: 'Good',     color: '#22C55E', desc: 'Positive' },
  { score: 5, emoji: '😄', label: 'Great',    color: '#00E676', desc: 'Energized' },
];

const METRIC_LABELS        = ['Very Low (1)', 'Low (2)', 'Moderate (3)', 'High (4)', 'Very High (5)'];
const SLEEP_QUALITY_LABELS = ['Poor (1)', 'Fair (2)', 'Good (3)', 'Very Good (4)', 'Excellent (5)'];

export default function LogMood() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const { register, handleSubmit, setValue, formState: { errors }, watch, reset } = useForm<MoodForm>({
    resolver: zodResolver(moodFormSchema),
    defaultValues: { sleepHours: 8, stressLevel: 3, energyLevel: 3, sleepQuality: 3, notes: '' },
  });

  const { data: todayMood } = useQuery({
    queryKey: ['mood', 'today'],
    queryFn: moodService.getToday,
  });

  // Pre-fill form if mood already logged today
  useEffect(() => {
    if (todayMood) {
      setSelectedMood(todayMood.mood_score);
      reset({
        moodScore: todayMood.mood_score,
        stressLevel: todayMood.stress_level,
        energyLevel: todayMood.energy_level,
        sleepHours: Number(todayMood.sleep_hours),
        sleepQuality: todayMood.sleep_quality,
        notes: todayMood.notes || '',
      });
    }
  }, [todayMood, reset]);

  const stressVal    = watch('stressLevel');
  const energyVal    = watch('energyLevel');
  const sleepQualVal = watch('sleepQuality');

  const mutation = useMutation({
    mutationFn: (data: MoodForm) => 
      todayMood ? moodService.updateMood(todayMood.id, data) : moodService.logMood(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood'] });
      toast.success(todayMood ? 'Mood check-in updated!' : 'Mood check-in logged successfully! Keep up the great work.');
      navigate('/employee/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save mood log.');
    },
  });

  async function onSubmit(data: MoodForm) {
    if (selectedMood === null) {
      toast.error("Please select today's overall mood score");
      return;
    }
    mutation.mutate(data);
  }

  return (
    <EmployeeLayout>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 animate-fadeIn">
        <PageHeader
          title="Daily Mood & Wellness Check-in"
          subtitle="Take 60 seconds to reflect on your day and track your mental wellbeing over time"
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
        />

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

          {/* ── 1. Overall Mood Score Picker ── */}
          <Card className="flex flex-col gap-6 p-8 sm:p-10">
            <div className="flex items-center gap-4 pb-4 border-b border-zinc-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#00C853] flex items-center justify-center">
                <Heart size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-zinc-900 m-0">
                  1. How do you feel overall today? <span className="text-red-500">*</span>
                </h2>
                <p className="text-xs text-zinc-500 m-0 mt-0.5">Select the emoji that best represents your state of mind</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 sm:gap-6 pt-2">
              {MOODS.map((m) => {
                const isActive = selectedMood === m.score;
                return (
                  <button
                    key={m.score}
                    type="button"
                    onClick={() => {
                      setSelectedMood(m.score);
                      setValue('moodScore', m.score);
                    }}
                    className={[
                      'flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 bg-white',
                      isActive
                        ? 'border-[#00E676] bg-[#E8FDF5] shadow-md shadow-[#00E676]/15 scale-105'
                        : 'border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-50/80 hover:scale-[1.02]',
                    ].join(' ')}
                  >
                    <span className="text-4xl select-none filter drop-shadow-sm">{m.emoji}</span>
                    <span className={`text-sm font-bold ${isActive ? 'text-[#00C853]' : 'text-zinc-700'}`}>
                      {m.label}
                    </span>
                    <span className="text-[0.6875rem] text-zinc-400 font-medium">
                      {m.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* ── 2. Stress & Energy Sliders ── */}
          <Card className="flex flex-col gap-6 p-8 sm:p-10">
            <div className="flex items-center gap-4 pb-4 border-b border-zinc-100">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Zap size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-zinc-900 m-0">
                  2. Stress & Energy Levels
                </h2>
                <p className="text-xs text-zinc-500 m-0 mt-0.5">Adjust the sliders to reflect your current physical & mental energy</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Stress Level */}
            <div className="flex flex-col gap-4 p-6 rounded-xl bg-zinc-50/70 border border-zinc-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-zinc-800">Stress Rating</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-600">
                    {stressVal} / 5
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  {...register('stressLevel', { valueAsNumber: true })}
                  className="w-full h-2 rounded-lg accent-[#00E676] bg-zinc-200 cursor-pointer"
                />
                <div className="flex justify-between text-[0.6875rem] text-zinc-400 font-medium">
                  <span>{METRIC_LABELS[0]}</span>
                  <span>{METRIC_LABELS[4]}</span>
                </div>
              </div>

              {/* Energy Level */}
              <div className="flex flex-col gap-4 p-6 rounded-xl bg-zinc-50/70 border border-zinc-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-zinc-800">Energy Rating</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-[#00C853]">
                    {energyVal} / 5
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  {...register('energyLevel', { valueAsNumber: true })}
                  className="w-full h-2 rounded-lg accent-[#00E676] bg-zinc-200 cursor-pointer"
                />
                <div className="flex justify-between text-[0.6875rem] text-zinc-400 font-medium">
                  <span>{METRIC_LABELS[0]}</span>
                  <span>{METRIC_LABELS[4]}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* ── 3. Sleep Section ── */}
          <Card className="flex flex-col gap-6 p-8 sm:p-10">
            <div className="flex items-center gap-4 pb-4 border-b border-zinc-100">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Moon size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-zinc-900 m-0">
                  3. Sleep Duration & Quality
                </h2>
                <p className="text-xs text-zinc-500 m-0 mt-0.5">Healthy sleep is strongly correlated with emotional resilience</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <Input
                label="Hours of Sleep"
                type="number"
                step="0.5"
                placeholder="e.g. 7.5"
                error={errors.sleepHours?.message}
                {...register('sleepHours', { valueAsNumber: true })}
              />

              <div className="flex flex-col gap-4 p-6 rounded-xl bg-zinc-50/70 border border-zinc-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-zinc-800">Sleep Quality</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-600">
                    {sleepQualVal} / 5
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  {...register('sleepQuality', { valueAsNumber: true })}
                  className="w-full h-2 rounded-lg accent-[#00E676] bg-zinc-200 cursor-pointer"
                />
                <div className="flex justify-between text-[0.6875rem] text-zinc-400 font-medium">
                  <span>{SLEEP_QUALITY_LABELS[0]}</span>
                  <span>{SLEEP_QUALITY_LABELS[4]}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* ── 4. Private Reflection Notes ── */}
          <Card className="flex flex-col gap-6 p-8 sm:p-10">
            <div className="flex items-center gap-4 pb-4 border-b border-zinc-100">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <MessageSquare size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-zinc-900 m-0">
                  4. Confidential Reflection (Optional)
                </h2>
                <p className="text-xs text-zinc-500 m-0 mt-0.5">Jot down any work triggers, thoughts, or wins from today</p>
              </div>
            </div>

            <textarea
              placeholder="What went well today? Any blockers, stressful events, or gratitude notes..."
              rows={4}
              {...register('notes')}
              className="w-full p-6 text-sm text-zinc-900 bg-white border border-zinc-200 rounded-xl outline-none transition-all duration-150 focus:border-[#00E676] focus:ring-2 focus:ring-[#00E676]/20 placeholder:text-zinc-400"
            />

            <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-lg text-sm text-zinc-500">
              <Info size={14} className="text-zinc-400 shrink-0" />
              <span>
                <strong>Confidentiality guarantee:</strong> Private notes are stored encrypted and are NEVER visible to managers or HR admins.
              </span>
            </div>
          </Card>

          {/* ── Submit Action Bar ── */}
          <div className="flex flex-col gap-6 border-t border-zinc-100 pt-4 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => navigate(-1)}
              className="font-semibold px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={mutation.isPending}
              rightIcon={<Sparkles size={18} />}
              className="font-bold shadow-lg shadow-[#00E676]/25 px-8"
            >
              Save Check-in
            </Button>
          </div>

        </form>
      </div>
    </EmployeeLayout>
  );
}
