// ─── User & Auth ─────────────────────────────────────────
export type Role = 'employee' | 'manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Employee extends User {
  role: 'employee';
  department: string;
  jobTitle: string;
  managerId: string;
}

export interface Manager extends User {
  role: 'manager';
}

export interface Admin extends User {
  role: 'admin';
}

// ─── Mood ────────────────────────────────────────────────
export interface MoodLog {
  id: string;
  employeeId: string;
  logDate: string;         // ISO date string "YYYY-MM-DD"
  moodScore: 1 | 2 | 3 | 4 | 5;
  stressLevel: 1 | 2 | 3 | 4 | 5;
  energyLevel: 1 | 2 | 3 | 4 | 5;
  sleepHours: number;
  sleepQuality: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  createdAt: string;
}

export interface MoodStats {
  avgMood: number;
  avgStress: number;
  avgEnergy: number;
  avgSleep: number;
  dataPoints: {
    date: string;
    mood: number;
    stress: number;
    energy: number;
  }[];
}

// ─── Alerts ──────────────────────────────────────────────
export type AlertType = 'mood_decline' | 'stress_spike' | 'no_checkin';
export type AlertSeverity = 'low' | 'medium' | 'high';
export type AlertStatus = 'active' | 'resolved' | 'dismissed';

export interface Alert {
  id: string;
  employeeId: string;
  employeeName: string;
  managerId: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  createdAt: string;
  resolvedAt?: string;
}

// ─── Team Member (manager view) ───────────────────────────
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  department: string;
  jobTitle: string;
  lastLogDate: string | null;
  avgMood7d: number | null;   // null if no logs
  trend: 'up' | 'down' | 'stable' | 'none';
  activeAlerts: number;
}

export interface TeamStats {
  avgMood: number;
  avgStress: number;
  checkinRate: number;        // 0–100 percentage
  activeAlertCount: number;
}

// ─── Admin ───────────────────────────────────────────────
export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
}

export interface OrgStats {
  totalEmployees: number;
  activeAlerts: number;
  orgAvgMood: number;
  checkinsThisWeek: number;
}

// ─── API Response wrapper ─────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  statusCode: number;
}
