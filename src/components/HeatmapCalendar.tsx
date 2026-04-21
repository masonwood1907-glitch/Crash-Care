import type { TrainingLog, DayKey } from '../types';
import { BASE_WORKOUTS, DAYS, DAY_LABELS } from '../data/workouts';

interface HeatmapCalendarProps {
  log: TrainingLog;
  startDate: string;
  currentWeek: number | null;
  currentDay: DayKey | null;
  onSelectWeek?: (week: number) => void;
}

function getCellColor(
  workout: { type: string },
  isDone: boolean,
  isToday: boolean,
  isPast: boolean,
): string {
  if (isToday) return isDone ? '#6b8c4a' : '#c8a84b';
  if (workout.type === 'rest') return isDone ? '#3a3f35' : '#1c2018';
  if (isDone) return '#6b8c4a';
  if (isPast) return '#1c2018';
  return '#141710';
}

export function HeatmapCalendar({
  log,
  startDate,
  currentWeek,
  currentDay,
  onSelectWeek,
}: HeatmapCalendarProps) {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="w-full overflow-x-auto">
      <div style={{ minWidth: 280 }}>
        {/* Week column headers */}
        <div className="flex mb-1 pl-8">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((w) => (
            <button
              key={w}
              onClick={() => onSelectWeek?.(w)}
              className="font-mono flex-1 text-center transition-colors"
              style={{
                fontSize: 7,
                color: currentWeek === w ? '#c8a84b' : '#3a4035',
                letterSpacing: '0.05em',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px 0',
              }}
            >
              {w}
            </button>
          ))}
        </div>

        {/* Day rows */}
        {DAYS.map((day) => (
          <div key={day} className="flex items-center mb-1 gap-0.5">
            {/* Day label */}
            <div
              className="font-mono shrink-0 text-right pr-1.5"
              style={{ width: 28, fontSize: 7, color: '#3a4035', letterSpacing: '0.05em' }}
            >
              {DAY_LABELS[day].slice(0, 2)}
            </div>

            {/* Week cells */}
            {Array.from({ length: 10 }, (_, i) => i + 1).map((w) => {
              const workout = BASE_WORKOUTS[day](w);
              const logKey = `w${w}_${day}`;
              const isDone = log[logKey]?.done ?? false;

              // Calculate what date this cell corresponds to
              const dayIndex = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].indexOf(day);
              // Week 1 starts on startDate's week
              const startDayIndex = start.getDay(); // day of week for start date
              const weekOffset = w - 1;
              // Days from start to this cell
              const daysFromStart = weekOffset * 7 + ((dayIndex - startDayIndex + 7) % 7);
              const cellDate = new Date(start.getTime() + daysFromStart * 86400000);

              const isToday = cellDate.getTime() === today.getTime();
              const isPast = cellDate.getTime() < today.getTime();
              const isCurrent = currentWeek === w && currentDay === day;

              const color = getCellColor(workout, isDone, isToday, isPast);

              return (
                <div
                  key={w}
                  className="flex-1 rounded-sm transition-all duration-200"
                  style={{
                    height: 12,
                    background: color,
                    border: isCurrent || isToday ? `1px solid ${isToday ? '#c8a84b' : '#6b8c4a'}` : '1px solid transparent',
                    opacity: cellDate.getTime() > today.getTime() ? 0.4 : 1,
                  }}
                  title={`W${w} ${DAY_LABELS[day]}: ${workout.label}${isDone ? ' ✓' : ''}`}
                />
              );
            })}
          </div>
        ))}

        {/* Legend */}
        <div className="flex gap-4 mt-3 pt-3" style={{ borderTop: '1px solid #1c2018' }}>
          {[
            { color: '#6b8c4a', label: 'Done' },
            { color: '#c8a84b', label: 'Today' },
            { color: '#1c2018', label: 'Missed' },
            { color: '#141710', label: 'Upcoming' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className="rounded-sm"
                style={{ width: 10, height: 10, background: color, border: '1px solid #2a3025' }}
              />
              <span className="font-mono" style={{ fontSize: 8, color: '#4a5540' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
