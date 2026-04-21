import { useState, useEffect, useCallback } from 'react';
import type { TrainingLog } from '../types';

const STORAGE_KEY = 'usna_tracker_v2';

function loadFromStorage(): TrainingLog {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TrainingLog) : {};
  } catch {
    return {};
  }
}

function saveToStorage(log: TrainingLog): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  } catch (e) {
    console.error('Storage save failed:', e);
  }
}

export function useTrainingLog() {
  const [log, setLog] = useState<TrainingLog>(loadFromStorage);

  useEffect(() => {
    saveToStorage(log);
  }, [log]);

  const toggleDone = useCallback((key: string, val: boolean) => {
    setLog((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] ?? { notes: '', completedSets: {} }),
        done: val,
        completedAt: val ? new Date().toISOString() : (prev[key]?.completedAt ?? undefined),
      },
    }));
  }, []);

  const toggleSet = useCallback((key: string, idx: number, val: boolean) => {
    setLog((prev) => {
      const entry = prev[key] ?? { done: false, notes: '', completedSets: {} };
      return {
        ...prev,
        [key]: { ...entry, completedSets: { ...entry.completedSets, [idx]: val } },
      };
    });
  }, []);

  const addNote = useCallback((key: string, text: string) => {
    setLog((prev) => ({
      ...prev,
      [key]: { ...(prev[key] ?? { done: false, completedSets: {} }), notes: text },
    }));
  }, []);

  const importLog = useCallback((data: TrainingLog) => {
    setLog(data);
  }, []);

  return { log, toggleDone, toggleSet, addNote, importLog };
}

export function exportLog(log: TrainingLog): void {
  const blob = new Blob([JSON.stringify(log, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `usna-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importLogFromFile(onImport: (log: TrainingLog) => void): void {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as TrainingLog;
        onImport(data);
      } catch {
        alert('Invalid backup file — could not parse JSON.');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

export function calculateStreak(
  log: TrainingLog,
  startDate: string | null,
  getWorkout: (week: number, day: string) => { type: string },
): number {
  if (!startDate) return 0;

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  let streak = 0;
  const cursor = new Date(today);

  for (let i = 0; i < 66; i++) {
    const diff = Math.floor((cursor.getTime() - start.getTime()) / 86400000);
    if (diff < 0) break;

    const week = Math.min(10, Math.floor(diff / 7) + 1);
    const dayKey = days[cursor.getDay()];
    const workout = getWorkout(week, dayKey);
    const logKey = `w${week}_${dayKey}`;

    if (workout.type === 'rest') {
      // rest days don't break streak, just skip
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }

    const isDone = log[logKey]?.done ?? false;
    const isFuture = cursor.getTime() > today.getTime();

    if (isFuture) {
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }

    if (isDone) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else if (cursor.getTime() === today.getTime()) {
      // today not done yet — skip but don't break
      cursor.setDate(cursor.getDate() - 1);
      continue;
    } else {
      break;
    }
  }

  return streak;
}
