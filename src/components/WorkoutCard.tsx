import { useState } from 'react';
import type { Workout, TrainingLog } from '../types';
import { TYPE_COLORS, TYPE_BG, DAY_LABELS } from '../data/workouts';
import type { DayKey } from '../types';
import { ProgressBar } from './ProgressBar';
import { Timer } from './Timer';

interface WorkoutCardProps {
  week: number;
  day: DayKey;
  workout: Workout;
  log: TrainingLog;
  onToggleDone: (key: string, val: boolean) => void;
  onToggleSet: (key: string, idx: number, val: boolean) => void;
  onAddNote: (key: string, text: string) => void;
  compact?: boolean;
}

export function WorkoutCard({
  week,
  day,
  workout,
  log,
  onToggleDone,
  onToggleSet,
  onAddNote,
  compact = false,
}: WorkoutCardProps) {
  const key = `w${week}_${day}`;
  const entry = log[key] ?? { done: false, notes: '', completedSets: {} };
  const done = entry.done;
  const notes = entry.notes ?? '';
  const completedSets = entry.completedSets ?? {};

  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState(notes);

  const color = TYPE_COLORS[workout.type];
  const bg = TYPE_BG[workout.type];
  const isRest = workout.type === 'rest';

  const detailsCount = workout.details.length;
  const setsDone = Object.values(completedSets).filter(Boolean).length;
  const progress = isRest ? (done ? 100 : 0) : detailsCount > 0 ? Math.round((setsDone / detailsCount) * 100) : 0;

  return (
    <div
      style={{
        background: done ? bg : 'rgba(255,255,255,0.02)',
        border: `1px solid ${done ? color + '60' : '#2a3025'}`,
        borderRadius: 8,
        padding: compact ? '12px' : '16px',
        position: 'relative',
        transition: 'all 0.2s',
      }}
    >
      {/* Day label + workout type + done button */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div
            className="font-mono mb-1"
            style={{ fontSize: 10, color: '#6b7560', letterSpacing: '0.2em' }}
          >
            {DAY_LABELS[day]} · WK {week}
          </div>
          <div
            className="font-condensed font-bold uppercase"
            style={{ fontSize: 14, color, letterSpacing: '0.12em' }}
          >
            {workout.label}
          </div>
        </div>

        <button
          onClick={() => onToggleDone(key, !done)}
          className="font-mono uppercase tracking-widest transition-all duration-200 shrink-0 ml-3"
          style={{
            background: done ? color : 'transparent',
            border: `1px solid ${done ? color : '#2a3025'}`,
            borderRadius: 4,
            padding: compact ? '6px 14px' : '8px 18px',
            fontSize: 10,
            color: done ? '#0d0f0b' : '#6b7560',
            letterSpacing: '0.1em',
            minHeight: 36,
            cursor: 'pointer',
          }}
        >
          {done ? '✓ DONE' : 'MARK DONE'}
        </button>
      </div>

      {/* Progress bar */}
      {!isRest && (
        <div className="mb-3">
          <ProgressBar pct={progress} color={color} thin />
        </div>
      )}

      {/* Workout details */}
      <div className="flex flex-col gap-2">
        {workout.details.map((detail, i) => {
          const checked = isRest ? done : !!completedSets[i];
          return (
            <div key={i} className="flex gap-2 items-start">
              {!isRest && (
                <button
                  onClick={() => onToggleSet(key, i, !checked)}
                  className="shrink-0 transition-all duration-150 mt-0.5"
                  style={{
                    width: 18,
                    height: 18,
                    border: `1px solid ${checked ? color : '#3a4035'}`,
                    background: checked ? color : 'transparent',
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    color: '#0d0f0b',
                    fontWeight: 900,
                    cursor: 'pointer',
                    minWidth: 18,
                  }}
                >
                  {checked ? '✓' : ''}
                </button>
              )}
              <div className="flex-1 flex flex-wrap items-center gap-1">
                <span
                  className="font-sans"
                  style={{
                    fontSize: compact ? 12 : 13,
                    color: checked ? '#c8cfc0' : '#5a6055',
                    textDecoration: checked && !isRest ? 'line-through' : 'none',
                    lineHeight: 1.5,
                    transition: 'all 0.2s',
                  }}
                >
                  {detail}
                </span>
                <Timer stepText={detail} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Completed at timestamp */}
      {done && entry.completedAt && (
        <div
          className="font-mono mt-3 pt-2"
          style={{
            fontSize: 9,
            color: '#4a5c38',
            letterSpacing: '0.1em',
            borderTop: '1px solid #1c2018',
          }}
        >
          ✓ COMPLETED {new Date(entry.completedAt).toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
          }).toUpperCase()}
        </div>
      )}

      {/* Notes */}
      <div style={{ marginTop: 10, borderTop: '1px solid #1c2018', paddingTop: 8 }}>
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="font-mono uppercase tracking-widest"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 9,
            color: '#4a5540',
            letterSpacing: '0.1em',
            padding: 0,
          }}
        >
          {showNotes ? '▲ HIDE NOTES' : '▼ ADD NOTES'}
          {notes && !showNotes ? ' •' : ''}
        </button>

        {showNotes && (
          <div className="mt-2">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onBlur={() => onAddNote(key, noteText)}
              placeholder="Log reps, times, how you felt..."
              rows={3}
              className="w-full font-sans resize-y outline-none"
              style={{
                background: '#0d0f0b',
                border: '1px solid #2a3025',
                borderRadius: 4,
                padding: '6px 8px',
                color: '#c8cfc0',
                fontSize: 12,
                lineHeight: 1.5,
                minHeight: 64,
              }}
            />
          </div>
        )}

        {notes && !showNotes && (
          <div
            className="mt-1 font-sans italic"
            style={{ fontSize: 10, color: '#4a6040', lineHeight: 1.4 }}
          >
            "{notes.slice(0, 100)}{notes.length > 100 ? '…' : ''}"
          </div>
        )}
      </div>
    </div>
  );
}
