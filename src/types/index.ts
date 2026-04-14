export type WorkoutType = 'cardio' | 'strength' | 'circuit' | 'rest';

export interface Workout {
  type: WorkoutType;
  label: string;
  details: string[];
}

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface LogEntry {
  done: boolean;
  notes: string;
  completedSets: Record<number, boolean>;
  completedAt?: string;
}

export type TrainingLog = Record<string, LogEntry>;

export type TabView = 'today' | 'weeks' | 'overview';

export interface CurrentDayResult {
  week: number | null;
  day: DayKey | null;
  isPastProgram: boolean;
  daysUntilStart: number;
}
