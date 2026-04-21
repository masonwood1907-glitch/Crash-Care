import type { TrainingLog, DayKey } from '../types';
import { BASE_WORKOUTS, PHASES, PHASE_NOTES, TYPE_COLORS } from '../data/workouts';
import { WorkoutCard } from '../components/WorkoutCard';
import { ProgressBar } from '../components/ProgressBar';

interface TodayPageProps {
  log: TrainingLog;
  currentWeek: number | null;
  currentDay: DayKey | null;
  isPastProgram: boolean;
  daysUntilStart: number;
  startDate: string | null;
  onToggleDone: (key: string, val: boolean) => void;
  onToggleSet: (key: string, idx: number, val: boolean) => void;
  onAddNote: (key: string, text: string) => void;
  onGoToWeeks: () => void;
}

export function TodayPage({
  log,
  currentWeek,
  currentDay,
  isPastProgram,
  daysUntilStart,
  startDate,
  onToggleDone,
  onToggleSet,
  onAddNote,
  onGoToWeeks,
}: TodayPageProps) {
  // Not started yet
  if (!startDate || daysUntilStart > 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full px-6 py-12 text-center gap-6">
        <div
          className="font-condensed font-black uppercase"
          style={{ fontSize: 48, color: '#e8f0d8', letterSpacing: '0.2em', lineHeight: 1 }}
        >
          {daysUntilStart > 0 ? `T-${daysUntilStart}` : 'READY'}
        </div>
        <div className="font-mono" style={{ fontSize: 10, color: '#c8a84b', letterSpacing: '0.2em' }}>
          {daysUntilStart > 0
            ? `DAYS UNTIL PROGRAM BEGINS`
            : 'NO START DATE SET'}
        </div>
        {daysUntilStart > 0 && startDate && (
          <div className="font-sans" style={{ fontSize: 13, color: '#5a6055', lineHeight: 1.6 }}>
            Your plan starts on{' '}
            <span style={{ color: '#c8cfc0' }}>
              {new Date(startDate + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric',
              })}
            </span>
            . Report back then.
          </div>
        )}
      </div>
    );
  }

  // Program complete
  if (isPastProgram) {
    const totalDone = Object.values(log).filter((e) => e.done).length;
    return (
      <div className="flex flex-col items-center justify-center min-h-full px-6 py-12 text-center gap-6">
        <div
          className="font-condensed font-black uppercase"
          style={{ fontSize: 48, color: '#6b8c4a', letterSpacing: '0.2em', lineHeight: 1 }}
        >
          MISSION<br />COMPLETE
        </div>
        <div className="font-mono" style={{ fontSize: 10, color: '#c8a84b', letterSpacing: '0.2em' }}>
          9-WEEK PROGRAM FINISHED
        </div>
        <div className="font-sans" style={{ fontSize: 13, color: '#5a6055', lineHeight: 1.6 }}>
          {totalDone} sessions completed. Plebe Summer awaits.
        </div>
        <button
          onClick={onGoToWeeks}
          className="font-mono uppercase tracking-widest"
          style={{
            background: 'transparent',
            border: '1px solid #4a5c38',
            borderRadius: 4,
            padding: '10px 20px',
            fontSize: 10,
            color: '#6b8c4a',
            cursor: 'pointer',
          }}
        >
          VIEW ALL WEEKS
        </button>
      </div>
    );
  }

  if (!currentWeek || !currentDay) return null;

  const workout = BASE_WORKOUTS[currentDay](currentWeek);
  const key = `w${currentWeek}_${currentDay}`;
  const entry = log[key];
  const done = entry?.done ?? false;
  const color = TYPE_COLORS[workout.type];
  const phase = PHASES[currentWeek];

  // Week progress
  const weekDone = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].filter(
    (d) => log[`w${currentWeek}_${d}`]?.done,
  ).length;
  const weekPct = Math.round((weekDone / 7) * 100);

  const dayNames: Record<string, string> = {
    mon: 'MONDAY', tue: 'TUESDAY', wed: 'WEDNESDAY',
    thu: 'THURSDAY', fri: 'FRIDAY', sat: 'SATURDAY', sun: 'SUNDAY',
  };

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Today header */}
      <div
        className="sticky top-0 z-10 px-4 pt-3 pb-3"
        style={{
          background: 'rgba(13,15,11,0.97)',
          borderBottom: '1px solid #1c2018',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="flex justify-between items-start">
          <div>
            <div
              className="font-mono"
              style={{ fontSize: 9, color: '#6b7560', letterSpacing: '0.2em' }}
            >
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long', month: 'short', day: 'numeric',
              }).toUpperCase()}
            </div>
            <div
              className="font-condensed font-black uppercase"
              style={{ fontSize: 26, color: '#e8f0d8', letterSpacing: '0.15em', lineHeight: 1.1 }}
            >
              {dayNames[currentDay]}
            </div>
            <div
              className="font-mono"
              style={{ fontSize: 9, color: '#c8a84b', letterSpacing: '0.2em' }}
            >
              WEEK {currentWeek} // {phase}
            </div>
          </div>

          <div className="text-right">
            <div
              className="font-condensed font-black"
              style={{ fontSize: 30, color, lineHeight: 1 }}
            >
              {weekPct}%
            </div>
            <div className="font-mono" style={{ fontSize: 8, color: '#4a5540' }}>
              WEEK {weekDone}/7
            </div>
            <div className="mt-1 w-20">
              <ProgressBar pct={weekPct} color={color} thin />
            </div>
          </div>
        </div>
      </div>

      {/* Workout card */}
      <div className="px-4">
        <WorkoutCard
          week={currentWeek}
          day={currentDay}
          workout={workout}
          log={log}
          onToggleDone={onToggleDone}
          onToggleSet={onToggleSet}
          onAddNote={onAddNote}
        />
      </div>

      {/* Large MARK DONE button if not done */}
      {!done && workout.type !== 'rest' && (
        <div className="px-4">
          <button
            onClick={() => onToggleDone(key, true)}
            className="w-full font-condensed font-bold uppercase tracking-widest transition-all duration-200"
            style={{
              background: 'rgba(74,92,56,0.15)',
              border: `2px solid ${color}`,
              borderRadius: 8,
              padding: '16px',
              fontSize: 18,
              color: color,
              letterSpacing: '0.25em',
              cursor: 'pointer',
              minHeight: 56,
            }}
          >
            ✓ MARK SESSION COMPLETE
          </button>
        </div>
      )}

      {/* Done confirmation */}
      {done && (
        <div
          className="mx-4 flex items-center gap-3 px-4 py-3 rounded-lg"
          style={{ background: 'rgba(107,140,74,0.1)', border: '1px solid #4a5c38' }}
        >
          <div style={{ fontSize: 22, color: '#6b8c4a' }}>✓</div>
          <div>
            <div
              className="font-condensed font-bold uppercase"
              style={{ fontSize: 14, color: '#6b8c4a', letterSpacing: '0.1em' }}
            >
              SESSION COMPLETE
            </div>
            {entry?.completedAt && (
              <div className="font-mono" style={{ fontSize: 9, color: '#4a5c38' }}>
                {new Date(entry.completedAt).toLocaleTimeString('en-US', {
                  hour: 'numeric', minute: '2-digit',
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Phase note */}
      <div
        className="mx-4 rounded-lg px-4 py-3"
        style={{ background: 'rgba(74,92,56,0.06)', border: '1px solid #2a3025' }}
      >
        <div
          className="font-mono mb-2"
          style={{ fontSize: 9, color: '#4a5540', letterSpacing: '0.15em' }}
        >
          // PHASE NOTES
        </div>
        <div className="font-sans" style={{ fontSize: 12, color: '#5a6a50', lineHeight: 1.6 }}>
          {PHASE_NOTES[phase] ?? ''}
        </div>
      </div>
    </div>
  );
}
