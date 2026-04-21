import { useState, useEffect } from 'react';
import type { TabView } from './types';
import { useTrainingLog } from './hooks/useTrainingLog';
import { getCurrentDay } from './hooks/useCurrentDay';
import { OnboardingScreen } from './components/OnboardingScreen';
import { BottomNav } from './components/BottomNav';
import { TodayPage } from './pages/TodayPage';
import { WeeksPage } from './pages/WeeksPage';
import { OverviewPage } from './pages/OverviewPage';
import { BASE_WORKOUTS } from './data/workouts';
import type { DayKey } from './types';

export default function App() {
  const [startDate, setStartDate] = useState<string | null>(
    () => localStorage.getItem('usna_start_date'),
  );
  const [showOnboarding, setShowOnboarding] = useState<boolean>(!startDate);
  const [tab, setTab] = useState<TabView>('today');
  const [weeksTarget, setWeeksTarget] = useState<number | null>(null);

  const { log, toggleDone, toggleSet, addNote, importLog } = useTrainingLog();

  const { week, day, isPastProgram, daysUntilStart } = getCurrentDay(startDate);

  // Check daily notification
  useEffect(() => {
    const enabled = localStorage.getItem('usna_notif_enabled') === 'true';
    const notifTime = localStorage.getItem('usna_notif_time') ?? '07:00';
    if (!enabled || !startDate || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    const [h, m] = notifTime.split(':').map(Number);
    const now = new Date();
    const scheduledToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);

    if (now >= scheduledToday) {
      // Show if today's workout not done
      const { week: cw, day: cd } = getCurrentDay(startDate);
      if (cw && cd) {
        const key = `w${cw}_${cd}`;
        const isDone = (JSON.parse(localStorage.getItem('usna_tracker_v2') ?? '{}') as Record<string, { done?: boolean }>)[key]?.done;
        const workout = BASE_WORKOUTS[cd as DayKey](cw);
        if (!isDone && workout.type !== 'rest') {
          new Notification('USNA Prep Tracker', {
            body: `Time to train. Today: ${workout.label} (Week ${cw})`,
          });
        }
      }
    }
  }, [startDate]);

  const handleOnboardingComplete = (date: string) => {
    setStartDate(date);
    setShowOnboarding(false);
  };

  const handleChangeStartDate = () => {
    setShowOnboarding(true);
  };

  const handleGoToWeeks = (targetWeek: number) => {
    setWeeksTarget(targetWeek);
    setTab('weeks');
  };

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <div
      className="relative min-h-screen"
      style={{ background: '#0d0f0b', color: '#c8cfc0' }}
    >
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(42,48,37,0.15) 39px,rgba(42,48,37,0.15) 40px),' +
            'repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(42,48,37,0.08) 39px,rgba(42,48,37,0.08) 40px)',
        }}
      />

      {/* Top header bar */}
      <header
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-2.5"
        style={{
          background: 'rgba(14,16,11,0.96)',
          borderBottom: '1px solid #2a3025',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Logo mark */}
        <div className="flex items-center gap-2.5">
          <div
            style={{
              width: 32,
              height: 32,
              background: '#4a5c38',
              clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span
              className="font-mono text-center leading-none"
              style={{ fontSize: 7, color: '#c8a84b' }}
            >
              USN
            </span>
          </div>
          <div>
            <div
              className="font-condensed font-black uppercase"
              style={{ fontSize: 15, color: '#e8f0d8', letterSpacing: '0.2em', lineHeight: 1 }}
            >
              PLEBE PREP
            </div>
            <div
              className="font-mono"
              style={{ fontSize: 7, color: '#c8a84b', letterSpacing: '0.15em' }}
            >
              9-WK PHYSICAL PREP PLAN
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-4">
          {week && (
            <div className="text-center">
              <div
                className="font-condensed font-black"
                style={{ fontSize: 20, color: '#c8a84b', lineHeight: 1 }}
              >
                {week}
              </div>
              <div className="font-mono" style={{ fontSize: 7, color: '#4a5540' }}>
                WEEK
              </div>
            </div>
          )}
          <div className="text-center">
            <div
              className="font-condensed font-black"
              style={{ fontSize: 20, color: '#6b8c4a', lineHeight: 1 }}
            >
              {Object.values(log).filter((e) => e.done).length}
            </div>
            <div className="font-mono" style={{ fontSize: 7, color: '#4a5540' }}>
              DONE
            </div>
          </div>
        </div>
      </header>

      {/* Main content — padded for header + bottom nav */}
      <main
        className="relative z-10 overflow-y-auto"
        style={{
          paddingTop: 56,
          paddingBottom: `calc(env(safe-area-inset-bottom) + 64px)`,
          minHeight: '100dvh',
        }}
      >
        {tab === 'today' && (
          <TodayPage
            log={log}
            currentWeek={week}
            currentDay={day}
            isPastProgram={isPastProgram}
            daysUntilStart={daysUntilStart}
            startDate={startDate}
            onToggleDone={toggleDone}
            onToggleSet={toggleSet}
            onAddNote={addNote}
            onGoToWeeks={() => setTab('weeks')}
          />
        )}

        {tab === 'weeks' && (
          <WeeksPage
            log={log}
            currentWeek={week}
            currentDay={day}
            initialWeek={weeksTarget}
            onToggleDone={toggleDone}
            onToggleSet={toggleSet}
            onAddNote={addNote}
          />
        )}

        {tab === 'overview' && (
          <OverviewPage
            log={log}
            startDate={startDate}
            currentWeek={week}
            currentDay={day}
            onImportLog={importLog}
            onGoToWeeks={handleGoToWeeks}
            onChangeStartDate={handleChangeStartDate}
          />
        )}
      </main>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
