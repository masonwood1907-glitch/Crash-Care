import { useState } from 'react';
import type { TrainingLog, DayKey } from '../types';
import { BASE_WORKOUTS, DAYS, PHASES } from '../data/workouts';
import { ProgressBar } from '../components/ProgressBar';
import { HeatmapCalendar } from '../components/HeatmapCalendar';
import { calculateStreak, exportLog, importLogFromFile } from '../hooks/useTrainingLog';

interface OverviewPageProps {
  log: TrainingLog;
  startDate: string | null;
  currentWeek: number | null;
  currentDay: DayKey | null;
  onImportLog: (data: TrainingLog) => void;
  onGoToWeeks: (week: number) => void;
  onChangeStartDate: () => void;
}

function weekCompletion(log: TrainingLog, w: number) {
  const done = DAYS.filter((d) => log[`w${w}_${d}`]?.done).length;
  return { done, total: 7, pct: Math.round((done / 7) * 100) };
}

const PRT_STANDARDS = [
  { label: 'PUSH-UPS (2 min)', male: '35–60', female: '20–45' },
  { label: 'PLANK HOLD', male: '1:45–4:20', female: '1:45–4:20' },
  { label: '1.5 MI RUN', male: '8:15–10:30', female: '9:35–12:40' },
  { label: 'SWIM', male: '100 yd + 15 min tread', female: '100 yd + 15 min tread' },
];

export function OverviewPage({
  log,
  startDate,
  currentWeek,
  currentDay,
  onImportLog,
  onGoToWeeks,
  onChangeStartDate,
}: OverviewPageProps) {
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [notifTime, setNotifTime] = useState(
    localStorage.getItem('usna_notif_time') ?? '07:00',
  );
  const [notifEnabled, setNotifEnabled] = useState(
    localStorage.getItem('usna_notif_enabled') === 'true',
  );

  const totalWorkoutDays = 14 * 7;
  const completedDays = Object.values(log).filter((e) => e.done).length;
  const overallPct = Math.round((completedDays / totalWorkoutDays) * 100);

  const streak = calculateStreak(log, startDate, (w, d) => BASE_WORKOUTS[d as DayKey](w));

  const handleImport = () => {
    importLogFromFile((data) => {
      onImportLog(data);
      setImportMsg('Data imported successfully!');
      setTimeout(() => setImportMsg(null), 3000);
    });
  };

  const handleNotifToggle = async () => {
    if (!notifEnabled) {
      if ('Notification' in window) {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          setNotifEnabled(true);
          localStorage.setItem('usna_notif_enabled', 'true');
          new Notification('USNA Prep Tracker', {
            body: 'Daily training reminders enabled.',
          });
        } else {
          alert('Notification permission denied. Enable in browser settings.');
        }
      }
    } else {
      setNotifEnabled(false);
      localStorage.setItem('usna_notif_enabled', 'false');
    }
  };

  const handleNotifTimeChange = (t: string) => {
    setNotifTime(t);
    localStorage.setItem('usna_notif_time', t);
  };

  return (
    <div className="flex flex-col pb-4">
      {/* Header */}
      <div
        className="px-4 pt-3 pb-3 sticky top-0 z-10"
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
          MISSION OVERVIEW
        </div>
        <div className="font-mono" style={{ fontSize: 9, color: '#6b7560', letterSpacing: '0.15em' }}>
          {completedDays} OF {totalWorkoutDays} SESSIONS COMPLETE
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 pt-4">
        {/* Overall progress */}
        <div
          className="rounded-lg p-4"
          style={{ background: '#141710', border: '1px solid #2a3025' }}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <div
                className="font-mono"
                style={{ fontSize: 9, color: '#6b7560', letterSpacing: '0.15em' }}
              >
                OVERALL COMPLETION
              </div>
              <div
                className="font-condensed font-black"
                style={{ fontSize: 40, color: '#6b8c4a', lineHeight: 1 }}
              >
                {overallPct}%
              </div>
            </div>

            <div className="text-right">
              <div
                className="font-mono"
                style={{ fontSize: 9, color: '#6b7560', letterSpacing: '0.1em' }}
              >
                CURRENT STREAK
              </div>
              <div
                className="font-condensed font-black"
                style={{ fontSize: 40, color: '#c8a84b', lineHeight: 1 }}
              >
                {streak}
              </div>
              <div className="font-mono" style={{ fontSize: 8, color: '#4a5540' }}>
                DAYS
              </div>
            </div>
          </div>

          <ProgressBar pct={overallPct} color="#6b8c4a" />

          <div
            className="font-mono mt-2 text-right"
            style={{ fontSize: 8, color: '#4a5540', letterSpacing: '0.1em' }}
          >
            {completedDays} / {totalWorkoutDays} SESSIONS
          </div>
        </div>

        {/* Phase progress */}
        <div
          className="rounded-lg p-4"
          style={{ background: '#141710', border: '1px solid #2a3025' }}
        >
          <div
            className="font-mono mb-3"
            style={{ fontSize: 9, color: '#6b7560', letterSpacing: '0.15em' }}
          >
            PHASE PROGRESS
          </div>

          <div className="flex flex-col gap-2.5">
            {[
              { phase: 'FOUNDATION', weeks: [1, 2] },
              { phase: 'INTERVALS', weeks: [3, 4] },
              { phase: 'VOLUME BUILD', weeks: [5, 6] },
              { phase: 'CONSOLIDATION', weeks: [7, 8, 9] },
              { phase: 'INTENSITY BUILD', weeks: [10, 11, 12] },
              { phase: 'PEAK', weeks: [13, 14] },
            ].map(({ phase, weeks }) => {
              const totalDays = weeks.length * 7;
              const doneDays = weeks.reduce(
                (acc, w) => acc + weekCompletion(log, w).done,
                0,
              );
              const phasePct = Math.round((doneDays / totalDays) * 100);
              const isCurrentPhase = weeks.some((w) => w === currentWeek);

              return (
                <div key={phase}>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {isCurrentPhase && (
                        <div
                          className="font-mono"
                          style={{ fontSize: 7, color: '#c8a84b' }}
                        >
                          ◉
                        </div>
                      )}
                      <div
                        className="font-mono"
                        style={{
                          fontSize: 9,
                          color: isCurrentPhase ? '#c8cfc0' : '#4a5540',
                          letterSpacing: '0.1em',
                        }}
                      >
                        {phase}
                      </div>
                      <div className="font-mono" style={{ fontSize: 8, color: '#3a4035' }}>
                        WK {weeks[0]}{weeks.length > 1 ? `-${weeks[weeks.length - 1]}` : ''}
                      </div>
                    </div>
                    <div
                      className="font-mono"
                      style={{
                        fontSize: 9,
                        color: phasePct === 100 ? '#6b8c4a' : phasePct > 0 ? '#c8a84b' : '#3a4035',
                      }}
                    >
                      {doneDays}/{totalDays}
                    </div>
                  </div>
                  <ProgressBar
                    pct={phasePct}
                    color={phasePct === 100 ? '#6b8c4a' : '#c8a84b'}
                    thin
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Week grid */}
        <div
          className="rounded-lg p-4"
          style={{ background: '#141710', border: '1px solid #2a3025' }}
        >
          <div
            className="font-mono mb-3"
            style={{ fontSize: 9, color: '#6b7560', letterSpacing: '0.15em' }}
          >
            WEEK GRID
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 14 }, (_, i) => i + 1).map((w) => {
              const { done, pct } = weekCompletion(log, w);
              const isCurrentWeek = currentWeek === w;

              return (
                <button
                  key={w}
                  onClick={() => onGoToWeeks(w)}
                  className="flex flex-col items-center gap-1 py-2 rounded transition-all"
                  style={{
                    background: isCurrentWeek
                      ? 'rgba(74,92,56,0.3)'
                      : pct === 100
                      ? 'rgba(107,140,74,0.1)'
                      : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isCurrentWeek ? '#4a5c38' : pct === 100 ? '#6b8c4a30' : '#2a3025'}`,
                    cursor: 'pointer',
                  }}
                >
                  <div
                    className="font-condensed font-bold"
                    style={{
                      fontSize: 14,
                      color: isCurrentWeek ? '#e8f0d8' : pct === 100 ? '#6b8c4a' : '#c8cfc0',
                      lineHeight: 1,
                    }}
                  >
                    {w}
                  </div>
                  <div className="w-full px-1">
                    <ProgressBar pct={pct} color={pct === 100 ? '#6b8c4a' : '#c8a84b'} thin />
                  </div>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: 7,
                      color: pct === 100 ? '#6b8c4a' : '#3a4035',
                    }}
                  >
                    {done}/7
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Heatmap */}
        {startDate && (
          <div
            className="rounded-lg p-4"
            style={{ background: '#141710', border: '1px solid #2a3025' }}
          >
            <div
              className="font-mono mb-3"
              style={{ fontSize: 9, color: '#6b7560', letterSpacing: '0.15em' }}
            >
              TRAINING HEATMAP
            </div>
            <HeatmapCalendar
              log={log}
              startDate={startDate}
              currentWeek={currentWeek}
              currentDay={currentDay}
              onSelectWeek={(w) => onGoToWeeks(w)}
            />
          </div>
        )}

        {/* PRT Standards */}
        <div
          className="rounded-lg p-4"
          style={{ background: 'rgba(200,168,75,0.04)', border: '1px solid #7a6530' }}
        >
          <div
            className="font-condensed font-bold uppercase mb-3"
            style={{ fontSize: 13, color: '#c8a84b', letterSpacing: '0.15em' }}
          >
            PRT STANDARDS — WHAT YOU'RE TRAINING FOR
          </div>

          <div className="flex flex-col gap-2">
            {PRT_STANDARDS.map((s) => (
              <div
                key={s.label}
                className="rounded p-3"
                style={{ background: 'rgba(0,0,0,0.2)' }}
              >
                <div
                  className="font-mono mb-1.5"
                  style={{ fontSize: 8, color: '#7a6530', letterSpacing: '0.1em' }}
                >
                  {s.label}
                </div>
                <div className="flex gap-4">
                  <div>
                    <div className="font-mono" style={{ fontSize: 7, color: '#4a5540' }}>
                      MALE
                    </div>
                    <div
                      className="font-condensed font-bold"
                      style={{ fontSize: 13, color: '#e8f0d8' }}
                    >
                      {s.male}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono" style={{ fontSize: 7, color: '#4a5540' }}>
                      FEMALE
                    </div>
                    <div
                      className="font-condensed font-bold"
                      style={{ fontSize: 13, color: '#c8cfc0' }}
                    >
                      {s.female}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div
          className="rounded-lg p-4"
          style={{ background: '#141710', border: '1px solid #2a3025' }}
        >
          <div
            className="font-mono mb-3"
            style={{ fontSize: 9, color: '#6b7560', letterSpacing: '0.15em' }}
          >
            DAILY REMINDER
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleNotifToggle}
              className="font-mono uppercase tracking-widest transition-all"
              style={{
                background: notifEnabled ? 'rgba(107,140,74,0.2)' : 'transparent',
                border: `1px solid ${notifEnabled ? '#4a5c38' : '#2a3025'}`,
                borderRadius: 4,
                padding: '8px 14px',
                fontSize: 9,
                color: notifEnabled ? '#6b8c4a' : '#4a5540',
                cursor: 'pointer',
              }}
            >
              {notifEnabled ? '◉ ON' : '○ OFF'}
            </button>

            {notifEnabled && (
              <input
                type="time"
                value={notifTime}
                onChange={(e) => handleNotifTimeChange(e.target.value)}
                className="font-mono outline-none"
                style={{
                  background: '#0d0f0b',
                  border: '1px solid #2a3025',
                  borderRadius: 4,
                  padding: '8px 10px',
                  color: '#c8cfc0',
                  fontSize: 13,
                  colorScheme: 'dark',
                }}
              />
            )}

            <div
              className="font-mono"
              style={{ fontSize: 9, color: '#3a4035', letterSpacing: '0.1em' }}
            >
              {notifEnabled ? 'ENABLED' : 'NOTIFICATIONS OFF'}
            </div>
          </div>
        </div>

        {/* Data management */}
        <div
          className="rounded-lg p-4"
          style={{ background: '#141710', border: '1px solid #2a3025' }}
        >
          <div
            className="font-mono mb-3"
            style={{ fontSize: 9, color: '#6b7560', letterSpacing: '0.15em' }}
          >
            DATA MANAGEMENT
          </div>

          {importMsg && (
            <div
              className="font-mono mb-3 px-3 py-2 rounded"
              style={{
                background: 'rgba(107,140,74,0.15)',
                border: '1px solid #4a5c38',
                fontSize: 10,
                color: '#6b8c4a',
              }}
            >
              {importMsg}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <button
              onClick={() => exportLog(log)}
              className="font-mono uppercase tracking-widest transition-all"
              style={{
                background: 'rgba(74,92,56,0.15)',
                border: '1px solid #4a5c38',
                borderRadius: 4,
                padding: '12px',
                fontSize: 10,
                color: '#6b8c4a',
                cursor: 'pointer',
                letterSpacing: '0.15em',
              }}
            >
              ↓ EXPORT BACKUP (.json)
            </button>

            <button
              onClick={handleImport}
              className="font-mono uppercase tracking-widest transition-all"
              style={{
                background: 'rgba(200,168,75,0.08)',
                border: '1px solid #7a6530',
                borderRadius: 4,
                padding: '12px',
                fontSize: 10,
                color: '#c8a84b',
                cursor: 'pointer',
                letterSpacing: '0.15em',
              }}
            >
              ↑ IMPORT BACKUP (.json)
            </button>

            <button
              onClick={onChangeStartDate}
              className="font-mono uppercase tracking-widest transition-all"
              style={{
                background: 'transparent',
                border: '1px solid #2a3025',
                borderRadius: 4,
                padding: '12px',
                fontSize: 10,
                color: '#4a5540',
                cursor: 'pointer',
                letterSpacing: '0.15em',
              }}
            >
              ✎ CHANGE START DATE
            </button>
          </div>

          {startDate && (
            <div
              className="font-mono mt-3"
              style={{ fontSize: 9, color: '#3a4035', letterSpacing: '0.1em' }}
            >
              PROGRAM START:{' '}
              {new Date(startDate + 'T00:00:00').toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
              }).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
