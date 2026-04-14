import { useState } from 'react';
import type { TrainingLog, DayKey } from '../types';
import { BASE_WORKOUTS, DAYS, DAY_LABELS, PHASES, TYPE_COLORS } from '../data/workouts';
import { WorkoutCard } from '../components/WorkoutCard';
import { ProgressBar } from '../components/ProgressBar';

interface WeeksPageProps {
  log: TrainingLog;
  currentWeek: number | null;
  currentDay: DayKey | null;
  initialWeek?: number | null;
  onToggleDone: (key: string, val: boolean) => void;
  onToggleSet: (key: string, idx: number, val: boolean) => void;
  onAddNote: (key: string, text: string) => void;
}

function weekCompletion(log: TrainingLog, w: number) {
  const done = DAYS.filter((d) => log[`w${w}_${d}`]?.done).length;
  return { done, total: 7, pct: Math.round((done / 7) * 100) };
}

export function WeeksPage({
  log,
  currentWeek,
  currentDay,
  initialWeek = null,
  onToggleDone,
  onToggleSet,
  onAddNote,
}: WeeksPageProps) {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(initialWeek ?? null);
  const [selectedDay, setSelectedDay] = useState<DayKey | null>(null);

  // Day detail view
  if (selectedWeek !== null && selectedDay !== null) {
    const workout = BASE_WORKOUTS[selectedDay](selectedWeek);
    const color = TYPE_COLORS[workout.type];
    return (
      <div className="flex flex-col gap-0 pb-4">
        {/* Back nav */}
        <div
          className="flex items-center gap-3 px-4 py-3 sticky top-0 z-10"
          style={{
            background: 'rgba(13,15,11,0.97)',
            borderBottom: '1px solid #1c2018',
            backdropFilter: 'blur(8px)',
          }}
        >
          <button
            onClick={() => setSelectedDay(null)}
            className="font-mono uppercase tracking-widest"
            style={{
              background: 'transparent',
              border: '1px solid #2a3025',
              borderRadius: 4,
              padding: '6px 12px',
              fontSize: 10,
              color: '#6b7560',
              cursor: 'pointer',
            }}
          >
            ← WK {selectedWeek}
          </button>
          <div>
            <div
              className="font-condensed font-bold uppercase"
              style={{ fontSize: 16, color, letterSpacing: '0.15em' }}
            >
              {DAY_LABELS[selectedDay]} · {workout.label}
            </div>
          </div>
        </div>

        {/* Day selector strip */}
        <div
          className="flex overflow-x-auto px-4 py-2 gap-1.5 shrink-0"
          style={{ borderBottom: '1px solid #1c2018' }}
        >
          {DAYS.map((d) => {
            const wo = BASE_WORKOUTS[d](selectedWeek);
            const isDone = log[`w${selectedWeek}_${d}`]?.done;
            const c = TYPE_COLORS[wo.type];
            const isSelected = d === selectedDay;
            return (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className="font-mono shrink-0 transition-all"
                style={{
                  padding: '6px 10px',
                  borderRadius: 4,
                  fontSize: 9,
                  border: `1px solid ${isSelected ? c : isDone ? c + '50' : '#2a3025'}`,
                  background: isSelected ? `${c}20` : isDone ? `${c}10` : 'transparent',
                  color: isSelected ? c : isDone ? c : '#4a5540',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                }}
              >
                {DAY_LABELS[d]}{isDone ? '✓' : ''}
              </button>
            );
          })}
        </div>

        <div className="px-4 pt-4">
          <WorkoutCard
            week={selectedWeek}
            day={selectedDay}
            workout={workout}
            log={log}
            onToggleDone={onToggleDone}
            onToggleSet={onToggleSet}
            onAddNote={onAddNote}
          />
        </div>

        {/* Prev / Next day */}
        <div className="flex gap-2 px-4 pt-3">
          {(() => {
            const idx = DAYS.indexOf(selectedDay);
            const prev = idx > 0 ? DAYS[idx - 1] : null;
            const next = idx < DAYS.length - 1 ? DAYS[idx + 1] : null;
            return (
              <>
                <button
                  onClick={() => prev && setSelectedDay(prev)}
                  disabled={!prev}
                  className="flex-1 font-mono uppercase tracking-widest"
                  style={{
                    background: 'transparent',
                    border: '1px solid #2a3025',
                    borderRadius: 4,
                    padding: '10px',
                    fontSize: 10,
                    color: prev ? '#6b7560' : '#2a3025',
                    cursor: prev ? 'pointer' : 'not-allowed',
                  }}
                >
                  ← PREV DAY
                </button>
                <button
                  onClick={() => next && setSelectedDay(next)}
                  disabled={!next}
                  className="flex-1 font-mono uppercase tracking-widest"
                  style={{
                    background: 'transparent',
                    border: '1px solid #2a3025',
                    borderRadius: 4,
                    padding: '10px',
                    fontSize: 10,
                    color: next ? '#6b7560' : '#2a3025',
                    cursor: next ? 'pointer' : 'not-allowed',
                  }}
                >
                  NEXT DAY →
                </button>
              </>
            );
          })()}
        </div>
      </div>
    );
  }

  // Week detail view (all 7 days)
  if (selectedWeek !== null) {
    const { done, pct } = weekCompletion(log, selectedWeek);
    const phase = PHASES[selectedWeek];

    return (
      <div className="flex flex-col pb-4">
        {/* Back nav */}
        <div
          className="flex items-center justify-between px-4 py-3 sticky top-0 z-10"
          style={{
            background: 'rgba(13,15,11,0.97)',
            borderBottom: '1px solid #1c2018',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedWeek(null)}
              className="font-mono uppercase tracking-widest"
              style={{
                background: 'transparent',
                border: '1px solid #2a3025',
                borderRadius: 4,
                padding: '6px 12px',
                fontSize: 10,
                color: '#6b7560',
                cursor: 'pointer',
              }}
            >
              ← ALL WEEKS
            </button>
            <div>
              <div
                className="font-condensed font-black uppercase"
                style={{ fontSize: 20, color: '#e8f0d8', letterSpacing: '0.15em', lineHeight: 1 }}
              >
                WEEK {selectedWeek}
              </div>
              <div className="font-mono" style={{ fontSize: 8, color: '#c8a84b', letterSpacing: '0.15em' }}>
                {phase}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div
              className="font-condensed font-black"
              style={{ fontSize: 24, color: pct === 100 ? '#6b8c4a' : '#c8a84b', lineHeight: 1 }}
            >
              {pct}%
            </div>
            <div className="font-mono" style={{ fontSize: 8, color: '#4a5540' }}>
              {done}/7
            </div>
          </div>
        </div>

        {/* Prev / Next week nav */}
        <div className="flex gap-2 px-4 py-2" style={{ borderBottom: '1px solid #1c2018' }}>
          <button
            onClick={() => setSelectedWeek(Math.max(1, selectedWeek - 1))}
            disabled={selectedWeek <= 1}
            className="font-mono uppercase tracking-widest"
            style={{
              flex: 1,
              background: 'transparent',
              border: '1px solid #2a3025',
              borderRadius: 4,
              padding: '8px',
              fontSize: 9,
              color: selectedWeek > 1 ? '#6b7560' : '#2a3025',
              cursor: selectedWeek > 1 ? 'pointer' : 'not-allowed',
            }}
          >
            ← WEEK {selectedWeek - 1}
          </button>
          <button
            onClick={() => setSelectedWeek(Math.min(14, selectedWeek + 1))}
            disabled={selectedWeek >= 14}
            className="font-mono uppercase tracking-widest"
            style={{
              flex: 1,
              background: 'transparent',
              border: '1px solid #2a3025',
              borderRadius: 4,
              padding: '8px',
              fontSize: 9,
              color: selectedWeek < 14 ? '#6b7560' : '#2a3025',
              cursor: selectedWeek < 14 ? 'pointer' : 'not-allowed',
            }}
          >
            WEEK {selectedWeek + 1} →
          </button>
        </div>

        {/* Day cards — tap to open detail */}
        <div className="flex flex-col gap-3 px-4 pt-4">
          {DAYS.map((day) => {
            const workout = BASE_WORKOUTS[day](selectedWeek);
            const key = `w${selectedWeek}_${day}`;
            const isDone = log[key]?.done;
            const color = TYPE_COLORS[workout.type];
            const isCurrentDay = currentWeek === selectedWeek && currentDay === day;

            return (
              <div
                key={day}
                style={{ border: isCurrentDay ? `1px solid ${color}60` : 'none' }}
                className="rounded-lg"
              >
                {isCurrentDay && (
                  <div
                    className="font-mono px-3 py-1 rounded-t-lg"
                    style={{
                      fontSize: 8,
                      color: color,
                      background: `${color}15`,
                      letterSpacing: '0.15em',
                    }}
                  >
                    ◉ TODAY
                  </div>
                )}
                <div
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all"
                  style={{
                    background: isDone ? `${color}10` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isDone ? color + '40' : '#2a3025'}`,
                    borderRadius: isCurrentDay ? '0 0 8px 8px' : 8,
                  }}
                  onClick={() => setSelectedDay(day)}
                >
                  <div
                    className="shrink-0 rounded"
                    style={{ width: 8, height: 8, background: isDone ? color : '#2a3025' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-mono"
                      style={{ fontSize: 9, color: '#6b7560', letterSpacing: '0.15em' }}
                    >
                      {DAY_LABELS[day]}
                    </div>
                    <div
                      className="font-condensed font-bold uppercase truncate"
                      style={{ fontSize: 14, color: isDone ? color : '#c8cfc0', letterSpacing: '0.1em' }}
                    >
                      {workout.label}
                    </div>
                  </div>
                  {isDone && (
                    <div className="font-mono" style={{ fontSize: 10, color, letterSpacing: '0.1em' }}>
                      ✓
                    </div>
                  )}
                  <div style={{ color: '#3a4035', fontSize: 14 }}>›</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Week list view
  return (
    <div className="flex flex-col pb-4">
      <div
        className="px-4 pt-3 pb-2 sticky top-0 z-10"
        style={{
          background: 'rgba(13,15,11,0.97)',
          borderBottom: '1px solid #1c2018',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          className="font-condensed font-black uppercase"
          style={{ fontSize: 22, color: '#e8f0d8', letterSpacing: '0.2em' }}
        >
          ALL WEEKS
        </div>
        <div className="font-mono" style={{ fontSize: 9, color: '#6b7560', letterSpacing: '0.15em' }}>
          14-WEEK PLEBE SUMMER PREP
        </div>
      </div>

      <div className="flex flex-col gap-1.5 px-4 pt-3">
        {Array.from({ length: 14 }, (_, i) => i + 1).map((w) => {
          const { done, pct } = weekCompletion(log, w);
          const phase = PHASES[w];
          const isCurrentWeek = currentWeek === w;

          return (
            <button
              key={w}
              onClick={() => setSelectedWeek(w)}
              className="flex flex-col gap-2 px-4 py-3 rounded-lg text-left transition-all duration-150"
              style={{
                background: isCurrentWeek
                  ? 'rgba(74,92,56,0.2)'
                  : pct === 100
                  ? 'rgba(107,140,74,0.06)'
                  : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isCurrentWeek ? '#4a5c38' : pct === 100 ? '#6b8c4a30' : '#2a3025'}`,
                borderLeft: `3px solid ${isCurrentWeek ? '#6b8c4a' : pct === 100 ? '#6b8c4a60' : '#2a3025'}`,
              }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {isCurrentWeek && (
                    <div className="font-mono" style={{ fontSize: 8, color: '#c8a84b' }}>
                      ◉ NOW
                    </div>
                  )}
                  <div
                    className="font-condensed font-bold uppercase"
                    style={{
                      fontSize: 16,
                      color: isCurrentWeek ? '#e8f0d8' : '#c8cfc0',
                      letterSpacing: '0.1em',
                    }}
                  >
                    WEEK {w}
                  </div>
                  <div
                    className="font-mono"
                    style={{ fontSize: 8, color: '#4a5540', letterSpacing: '0.1em' }}
                  >
                    {phase}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="font-mono"
                    style={{
                      fontSize: 9,
                      color: pct === 100 ? '#6b8c4a' : pct > 0 ? '#c8a84b' : '#3a4035',
                    }}
                  >
                    {done}/7
                  </div>
                  <div style={{ color: '#3a4035', fontSize: 14 }}>›</div>
                </div>
              </div>

              <ProgressBar
                pct={pct}
                color={pct === 100 ? '#6b8c4a' : '#c8a84b'}
                thin
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
