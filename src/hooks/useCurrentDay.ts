import type { DayKey, CurrentDayResult } from '../types';

const DAY_KEYS: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export function getCurrentDay(startDate: string | null): CurrentDayResult {
  if (!startDate) {
    return { week: null, day: null, isPastProgram: false, daysUntilStart: 0 };
  }

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((today.getTime() - start.getTime()) / 86400000);

  if (diffDays < 0) {
    return { week: null, day: null, isPastProgram: false, daysUntilStart: -diffDays };
  }

  const isPastProgram = diffDays >= 66;
  const week = Math.min(10, Math.floor(diffDays / 7) + 1);
  const day = DAY_KEYS[today.getDay()];

  return { week, day, isPastProgram, daysUntilStart: 0 };
}

export function getWeekDayFromDate(date: Date, startDate: string): { week: number; day: DayKey } | null {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const diff = Math.floor((d.getTime() - start.getTime()) / 86400000);
  if (diff < 0 || diff >= 66) return null;

  const week = Math.floor(diff / 7) + 1;
  const day = DAY_KEYS[d.getDay()];
  return { week, day };
}
