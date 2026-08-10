import type { User, MoodLog, Alert } from '@/types';

// ─── Mock Users ──────────────────────────────────────────
export const MOCK_USERS: User[] = [
  { id: 'emp-1', name: 'Alex Johnson', email: 'employee@demo.com', role: 'employee' },
  { id: 'emp-2', name: 'Emily Davis', email: 'emily@demo.com', role: 'employee' },
  { id: 'emp-3', name: 'Michael Brown', email: 'michael@demo.com', role: 'employee' },
  { id: 'emp-4', name: 'Jessica Taylor', email: 'jessica@demo.com', role: 'employee' },
  { id: 'emp-5', name: 'David Wilson', email: 'david@demo.com', role: 'employee' },
  { id: 'mgr-1', name: 'Sarah Williams', email: 'manager@demo.com', role: 'manager' },
  { id: 'adm-1', name: 'James Carter', email: 'admin@demo.com', role: 'admin' },
];

// ─── Mock Mood Logs (30 days of check-ins) ────────────────
const getPastDateString = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const MOCK_MOOD_LOGS: MoodLog[] = [];

// Seed 30 days of data for employee Alex Johnson (stable good mood)
for (let i = 0; i < 30; i++) {
  MOCK_MOOD_LOGS.push({
    id: `log-alex-${i}`,
    employeeId: 'emp-1',
    logDate: getPastDateString(i),
    moodScore: (i % 7 === 0 ? 3 : i % 5 === 0 ? 5 : 4) as 1 | 2 | 3 | 4 | 5,
    stressLevel: (i % 7 === 0 ? 3 : i % 4 === 0 ? 1 : 2) as 1 | 2 | 3 | 4 | 5,
    energyLevel: (i % 5 === 0 ? 5 : 4) as 1 | 2 | 3 | 4 | 5,
    sleepHours: i % 6 === 0 ? 6.5 : 8,
    sleepQuality: 4,
    notes: i % 10 === 0 ? 'Felt productive and energetic today.' : undefined,
    createdAt: new Date(getPastDateString(i)).toISOString(),
  });
}

// Seed 10 days of declining mood data for employee Emily Davis (burnout indicator)
for (let i = 0; i < 10; i++) {
  MOCK_MOOD_LOGS.push({
    id: `log-emily-${i}`,
    employeeId: 'emp-2',
    logDate: getPastDateString(i),
    moodScore: (i < 3 ? 2 : i < 6 ? 3 : 4) as 1 | 2 | 3 | 4 | 5,
    stressLevel: (i < 3 ? 5 : i < 6 ? 4 : 2) as 1 | 2 | 3 | 4 | 5,
    energyLevel: (i < 3 ? 1 : 3) as 1 | 2 | 3 | 4 | 5,
    sleepHours: i < 3 ? 5 : 7,
    sleepQuality: i < 3 ? 1 : 3 as 1 | 2 | 3 | 4 | 5,
    notes: i < 3 ? 'Struggling to sleep and focus due to project workload.' : undefined,
    createdAt: new Date(getPastDateString(i)).toISOString(),
  });
}

// ─── Mock Alerts ──────────────────────────────────────────
export const MOCK_ALERTS: Alert[] = [
  {
    id: 'alt-1',
    employeeId: 'emp-2',
    employeeName: 'Emily Davis',
    managerId: 'mgr-1',
    type: 'mood_decline',
    severity: 'high',
    status: 'active',
    createdAt: getPastDateString(1),
  },
  {
    id: 'alt-2',
    employeeId: 'emp-5',
    employeeName: 'David Wilson',
    managerId: 'mgr-1',
    type: 'stress_spike',
    severity: 'medium',
    status: 'active',
    createdAt: getPastDateString(2),
  },
  {
    id: 'alt-3',
    employeeId: 'emp-3',
    employeeName: 'Michael Brown',
    managerId: 'mgr-1',
    type: 'no_checkin',
    severity: 'low',
    status: 'resolved',
    createdAt: getPastDateString(5),
    resolvedAt: getPastDateString(4),
  },
];
