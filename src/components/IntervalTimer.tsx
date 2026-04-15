import { useState, useEffect, useRef, useCallback } from 'react';
import type { IntervalSet } from '../utils/parseIntervals';
import { ProgressBar } from './ProgressBar';

// ─── AUDIO ────────────────────────────────────────────────────────────────────

function tone(
  ctx: AudioContext,
  freq: number,
  durSecs: number,
  startDelay = 0,
  vol = 0.35,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.value = freq;
  const t = ctx.currentTime + startDelay;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(vol, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, t + durSecs);
  osc.start(t);
  osc.stop(t + durSecs + 0.05);
}

function beepWorkToRest(ctx: AudioContext) {
  // Two low descending tones
  tone(ctx, 480, 0.18, 0);
  tone(ctx, 380, 0.18, 0.24);
}

function beepRestToWork(ctx: AudioContext) {
  // Three rising short tones
  tone(ctx, 660, 0.08, 0, 0.5);
  tone(ctx, 880, 0.08, 0.12, 0.5);
  tone(ctx, 1100, 0.18, 0.24, 0.5);
}

function beepDone(ctx: AudioContext) {
  // Triumphant ascending arpeggio
  tone(ctx, 523, 0.15, 0);
  tone(ctx, 659, 0.15, 0.18);
  tone(ctx, 784, 0.15, 0.36);
  tone(ctx, 1047, 0.45, 0.54, 0.5);
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function fmt(totalSecs: number): string {
  const s = Math.max(0, Math.floor(totalSecs));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

// ─── CORE STATE ───────────────────────────────────────────────────────────────

interface CoreState {
  intervalIndex: number;         // 0-based index of current work interval
  phase: 'work' | 'rest';
  phaseStartEpoch: number;       // Date.now() when current phase started
  pausedRemainingMs: number;     // remaining ms at time of pause
  running: boolean;
  done: boolean;
}

const PERSIST_KEY = 'usna_itimer';

interface Persisted {
  workoutKey: string;
  intervalIndex: number;
  phase: 'work' | 'rest';
  phaseStartEpoch: number;
  rounds: number;
  workSecs: number;
  restSecs: number;
  savedAt: number;
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

interface IntervalTimerProps {
  intervalSet: IntervalSet;
  workoutKey: string;
  workoutLabel: string;
  onClose: () => void;
  onMarkDone: () => void;
}

export function IntervalTimer({
  intervalSet,
  workoutKey,
  workoutLabel,
  onClose,
  onMarkDone,
}: IntervalTimerProps) {
  const { rounds, workSecs, restSecs } = intervalSet;

  // ── Build initial core state: check for a restorable session ────────────────
  function buildInitialCore(): CoreState {
    try {
      const raw = localStorage.getItem(PERSIST_KEY);
      if (raw) {
        const p = JSON.parse(raw) as Persisted;
        // Only restore if same workout and saved < 2 h ago
        if (
          p.workoutKey === workoutKey &&
          p.rounds === rounds &&
          p.workSecs === workSecs &&
          p.restSecs === restSecs &&
          Date.now() - p.savedAt < 7200_000
        ) {
          return {
            intervalIndex: p.intervalIndex,
            phase: p.phase,
            phaseStartEpoch: p.phaseStartEpoch,
            pausedRemainingMs:
              (p.phase === 'work' ? workSecs : restSecs) * 1000,
            running: false,   // restore paused; user will press RESUME
            done: false,
          };
        }
      }
    } catch { /* ignore */ }
    // Fresh start — auto-begin
    return {
      intervalIndex: 0,
      phase: 'work',
      phaseStartEpoch: Date.now(),
      pausedRemainingMs: workSecs * 1000,
      running: true,
      done: false,
    };
  }

  const coreRef = useRef<CoreState>(buildInitialCore());
  const isRestored = useRef(
    !coreRef.current.running,  // if we restored, it's paused
  );

  // Single counter to trigger React re-renders
  const [, setRenderTick] = useState(0);
  const rerender = useCallback(() => setRenderTick((n) => n + 1), []);

  const tickRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const wakeLockRef = useRef<unknown>(null);
  const sessionStartRef = useRef<number>(
    coreRef.current.running ? Date.now() : 0,
  );

  // ── Audio context (lazy — must be created inside user gesture) ───────────────
  const getAudio = useCallback((): AudioContext | null => {
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new (
          window.AudioContext ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).webkitAudioContext
        )();
      } catch {
        return null;
      }
    }
    return audioCtxRef.current;
  }, []);

  // ── Wake lock ─────────────────────────────────────────────────────────────
  const acquireWakeLock = useCallback(async () => {
    if (!('wakeLock' in navigator)) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
    } catch { /* ignore */ }
  }, []);

  const releaseWakeLock = useCallback(() => {
    if (wakeLockRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (wakeLockRef.current as any).release().catch(() => {});
      wakeLockRef.current = null;
    }
  }, []);

  // ── Persist state ─────────────────────────────────────────────────────────
  const persist = useCallback(() => {
    const c = coreRef.current;
    if (c.done) { localStorage.removeItem(PERSIST_KEY); return; }
    const p: Persisted = {
      workoutKey,
      intervalIndex: c.intervalIndex,
      phase: c.phase,
      phaseStartEpoch: c.phaseStartEpoch,
      rounds,
      workSecs,
      restSecs,
      savedAt: Date.now(),
    };
    localStorage.setItem(PERSIST_KEY, JSON.stringify(p));
  }, [workoutKey, rounds, workSecs, restSecs]);

  // ── Tick logic (runs every 100 ms) ────────────────────────────────────────
  const startTick = useCallback(() => {
    if (tickRef.current) clearInterval(tickRef.current);

    tickRef.current = window.setInterval(() => {
      const c = coreRef.current;
      if (!c.running || c.done) return;

      const now = Date.now();
      const phaseDurMs = (c.phase === 'work' ? workSecs : restSecs) * 1000;
      let elapsed = now - c.phaseStartEpoch;

      // Advance through as many completed phases as needed
      // (handles phone-lock recovery where multiple phases elapsed)
      let didAdvance = false;
      while (elapsed >= phaseDurMs && !c.done) {
        const stepMs = (c.phase === 'work' ? workSecs : restSecs) * 1000;
        c.phaseStartEpoch += stepMs;
        elapsed -= stepMs;

        if (c.phase === 'work') {
          c.phase = 'rest';
        } else {
          if (c.intervalIndex + 1 >= rounds) {
            c.done = true;
          } else {
            c.intervalIndex++;
            c.phase = 'work';
          }
        }
        didAdvance = true;
      }

      if (c.done) {
        c.running = false;
        clearInterval(tickRef.current!);
        releaseWakeLock();
        localStorage.removeItem(PERSIST_KEY);
        const ctx = getAudio();
        if (ctx) beepDone(ctx);
      } else if (didAdvance) {
        // Play beep for whichever phase we just entered
        const ctx = getAudio();
        if (ctx) {
          if (c.phase === 'rest') beepWorkToRest(ctx);
          else beepRestToWork(ctx);
        }
        persist();
      }

      rerender();
    }, 100);
  }, [workSecs, restSecs, rounds, getAudio, releaseWakeLock, persist, rerender]);

  // ── Start / Resume ────────────────────────────────────────────────────────
  const start = useCallback(() => {
    const c = coreRef.current;
    if (c.done) return;

    // If paused: recalculate phaseStartEpoch so remaining time is preserved
    if (!c.running) {
      const phaseDurMs = (c.phase === 'work' ? workSecs : restSecs) * 1000;
      c.phaseStartEpoch = Date.now() - (phaseDurMs - c.pausedRemainingMs);
      c.running = true;
      if (sessionStartRef.current === 0) sessionStartRef.current = Date.now();
    }

    acquireWakeLock();
    startTick();
    persist();
    rerender();
  }, [workSecs, restSecs, acquireWakeLock, startTick, persist, rerender]);

  // ── Pause ─────────────────────────────────────────────────────────────────
  const pause = useCallback(() => {
    const c = coreRef.current;
    if (!c.running || c.done) return;

    const phaseDurMs = (c.phase === 'work' ? workSecs : restSecs) * 1000;
    c.pausedRemainingMs = Math.max(
      0,
      c.phaseStartEpoch + phaseDurMs - Date.now(),
    );
    c.running = false;

    if (tickRef.current) clearInterval(tickRef.current);
    releaseWakeLock();
    persist();
    rerender();
  }, [workSecs, restSecs, releaseWakeLock, persist, rerender]);

  // ── Skip current phase ────────────────────────────────────────────────────
  const skip = useCallback(() => {
    const c = coreRef.current;
    if (c.done) return;
    const wasRunning = c.running;

    if (c.phase === 'work') {
      c.phase = 'rest';
      c.phaseStartEpoch = Date.now();
      c.pausedRemainingMs = restSecs * 1000;
      const ctx = getAudio();
      if (ctx) beepWorkToRest(ctx);
    } else {
      if (c.intervalIndex + 1 >= rounds) {
        c.done = true;
        c.running = false;
        if (tickRef.current) clearInterval(tickRef.current);
        releaseWakeLock();
        localStorage.removeItem(PERSIST_KEY);
        const ctx = getAudio();
        if (ctx) beepDone(ctx);
        rerender();
        return;
      }
      c.intervalIndex++;
      c.phase = 'work';
      c.phaseStartEpoch = Date.now();
      c.pausedRemainingMs = workSecs * 1000;
      const ctx = getAudio();
      if (ctx) beepRestToWork(ctx);
    }

    if (!wasRunning) {
      c.running = false; // stay paused after skip
    }

    persist();
    rerender();
  }, [rounds, workSecs, restSecs, getAudio, releaseWakeLock, persist, rerender]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    // If this is a fresh (non-restored) start, begin ticking immediately
    if (!isRestored.current) {
      acquireWakeLock();
      startTick();
    }

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      releaseWakeLock();
      // Persist on unmount so the session can be resumed later
      persist();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-acquire wake lock if it's released (e.g., after page becomes visible)
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible' && coreRef.current.running) {
        acquireWakeLock();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [acquireWakeLock]);

  // ── Derived display values (computed on every render from ref) ────────────
  const c = coreRef.current;
  const phaseDurMs = (c.phase === 'work' ? workSecs : restSecs) * 1000;
  const remainingMs = c.running
    ? Math.max(0, c.phaseStartEpoch + phaseDurMs - Date.now())
    : c.pausedRemainingMs;
  const timeLeftSecs = Math.ceil(remainingMs / 1000);

  // Overall progress
  const completedSecs =
    c.phase === 'work'
      ? c.intervalIndex * (workSecs + restSecs)
      : (c.intervalIndex + 1) * workSecs + c.intervalIndex * restSecs;
  const phaseElapsedSecs = (c.phase === 'work' ? workSecs : restSecs) - timeLeftSecs;
  const totalDoneSecs = completedSecs + Math.max(0, phaseElapsedSecs);
  const totalSecs = rounds * (workSecs + restSecs);
  const overallPct = Math.min(100, (totalDoneSecs / totalSecs) * 100);

  const isWork = c.phase === 'work';
  const phaseColor = isWork ? '#6b8c4a' : '#c8a84b';
  const phaseLabel = isWork ? 'WORK' : 'REST';
  const intervalNum = c.intervalIndex + 1;

  // Total session time for completion screen
  const sessionElapsedSecs = sessionStartRef.current
    ? Math.floor((Date.now() - sessionStartRef.current) / 1000)
    : totalSecs;

  // ── DONE screen ───────────────────────────────────────────────────────────
  if (c.done) {
    return (
      <div
        className="fixed inset-0 z-[999] flex flex-col items-center justify-center"
        style={{ background: '#0d0f0b' }}
      >
        <GridBg />

        <div className="relative z-10 flex flex-col items-center gap-8 px-6 w-full max-w-sm text-center">
          <div
            className="font-condensed font-black uppercase"
            style={{ fontSize: 72, color: '#6b8c4a', lineHeight: 1, letterSpacing: '0.05em' }}
          >
            DONE
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="font-mono" style={{ fontSize: 10, color: '#6b7560', letterSpacing: '0.2em' }}>
              SESSION COMPLETE
            </div>
            <div
              className="font-condensed font-bold"
              style={{ fontSize: 22, color: '#c8a84b', letterSpacing: '0.1em' }}
            >
              {workoutLabel}
            </div>
            <div className="font-mono" style={{ fontSize: 11, color: '#4a5540', marginTop: 4 }}>
              {rounds} × {fmt(workSecs)} WORK / {fmt(restSecs)} REST
            </div>
          </div>

          <div
            className="w-full rounded-lg px-6 py-4"
            style={{ background: '#141710', border: '1px solid #2a3025' }}
          >
            <div className="font-mono" style={{ fontSize: 9, color: '#4a5540', letterSpacing: '0.2em', marginBottom: 4 }}>
              ELAPSED TIME
            </div>
            <div
              className="font-condensed font-black"
              style={{ fontSize: 44, color: '#e8f0d8', lineHeight: 1 }}
            >
              {fmt(sessionElapsedSecs)}
            </div>
          </div>

          <button
            onClick={() => { onMarkDone(); onClose(); }}
            className="w-full font-condensed font-bold uppercase tracking-widest"
            style={{
              background: '#4a5c38',
              border: '2px solid #6b8c4a',
              borderRadius: 8,
              padding: '18px',
              fontSize: 18,
              color: '#e8f0d8',
              letterSpacing: '0.2em',
              cursor: 'pointer',
              minHeight: 60,
            }}
          >
            ✓ MARK SESSION DONE
          </button>

          <button
            onClick={onClose}
            className="font-mono uppercase tracking-widest"
            style={{
              background: 'transparent',
              border: '1px solid #2a3025',
              borderRadius: 4,
              padding: '10px 24px',
              fontSize: 10,
              color: '#4a5540',
              cursor: 'pointer',
            }}
          >
            CLOSE WITHOUT MARKING
          </button>
        </div>
      </div>
    );
  }

  // ── ACTIVE timer screen ───────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col"
      style={{ background: '#0d0f0b' }}
    >
      <GridBg />

      {/* Top bar */}
      <div
        className="relative z-10 flex items-center justify-between px-4 pt-safe"
        style={{
          paddingTop: `calc(env(safe-area-inset-top) + 12px)`,
          paddingBottom: 12,
          borderBottom: '1px solid #1c2018',
          background: 'rgba(13,15,11,0.9)',
        }}
      >
        <div>
          <div className="font-mono" style={{ fontSize: 9, color: '#6b7560', letterSpacing: '0.2em' }}>
            {workoutLabel}
          </div>
          <div
            className="font-mono"
            style={{ fontSize: 10, color: phaseColor, letterSpacing: '0.15em' }}
          >
            INTERVAL {intervalNum} OF {rounds}
          </div>
        </div>

        <button
          onClick={onClose}
          className="font-mono uppercase tracking-widest"
          style={{
            background: 'transparent',
            border: '1px solid #2a3025',
            borderRadius: 4,
            padding: '6px 12px',
            fontSize: 9,
            color: '#4a5540',
            cursor: 'pointer',
          }}
        >
          ✕ EXIT
        </button>
      </div>

      {/* Main clock area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-4 px-6">
        {/* Phase label */}
        <div
          className="font-condensed font-black uppercase"
          style={{
            fontSize: 28,
            letterSpacing: '0.4em',
            color: phaseColor,
            textShadow: `0 0 40px ${phaseColor}80`,
            transition: 'color 0.3s, text-shadow 0.3s',
          }}
        >
          {phaseLabel}
        </div>

        {/* Big clock */}
        <div
          className="font-condensed font-black tabular-nums"
          style={{
            fontSize: 'clamp(80px, 22vw, 130px)',
            color: c.running ? phaseColor : '#4a5540',
            lineHeight: 1,
            letterSpacing: '0.02em',
            textShadow: c.running ? `0 0 60px ${phaseColor}50` : 'none',
            transition: 'color 0.3s, text-shadow 0.3s',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {fmt(timeLeftSecs)}
        </div>

        {/* Up next label */}
        <div className="font-mono" style={{ fontSize: 10, color: '#3a4035', letterSpacing: '0.15em' }}>
          {isWork
            ? `REST: ${fmt(restSecs)} →`
            : intervalNum < rounds
              ? `WORK: ${fmt(workSecs)} →`
              : 'FINAL REST'}
        </div>

        {/* Interval dots */}
        <div className="flex gap-1.5 flex-wrap justify-center mt-2">
          {Array.from({ length: rounds }, (_, i) => {
            const done = i < c.intervalIndex || (i === c.intervalIndex && c.phase === 'rest');
            const current = i === c.intervalIndex;
            return (
              <div
                key={i}
                style={{
                  width: current ? 12 : 8,
                  height: current ? 12 : 8,
                  borderRadius: '50%',
                  background: done ? '#6b8c4a' : current ? phaseColor : '#2a3025',
                  border: current ? `2px solid ${phaseColor}` : 'none',
                  transition: 'all 0.2s',
                  boxShadow: current ? `0 0 8px ${phaseColor}80` : 'none',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Bottom controls */}
      <div
        className="relative z-10 flex flex-col gap-3 px-4"
        style={{ paddingBottom: `calc(env(safe-area-inset-bottom) + 24px)` }}
      >
        {/* Overall progress */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <ProgressBar pct={overallPct} color={phaseColor} />
          </div>
          <div className="font-mono shrink-0" style={{ fontSize: 9, color: '#4a5540', minWidth: '3.5ch' }}>
            {Math.round(overallPct)}%
          </div>
        </div>

        {/* PAUSE / RESUME + SKIP */}
        <div className="flex gap-3">
          <button
            onClick={c.running ? pause : start}
            className="flex-1 font-condensed font-bold uppercase tracking-widest transition-all duration-150"
            style={{
              background: c.running ? 'rgba(200,168,75,0.15)' : 'rgba(107,140,74,0.2)',
              border: `2px solid ${c.running ? '#c8a84b' : '#6b8c4a'}`,
              borderRadius: 8,
              padding: '16px',
              fontSize: 18,
              color: c.running ? '#c8a84b' : '#6b8c4a',
              cursor: 'pointer',
              letterSpacing: '0.15em',
              minHeight: 60,
            }}
          >
            {c.running ? '⏸ PAUSE' : '▶ RESUME'}
          </button>

          <button
            onClick={skip}
            className="font-condensed font-bold uppercase tracking-widest transition-all"
            style={{
              background: 'transparent',
              border: '1px solid #2a3025',
              borderRadius: 8,
              padding: '16px 20px',
              fontSize: 14,
              color: '#4a5540',
              cursor: 'pointer',
              letterSpacing: '0.1em',
              minHeight: 60,
            }}
          >
            SKIP →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SHARED BACKGROUND ────────────────────────────────────────────────────────

function GridBg() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(42,48,37,0.15) 39px,rgba(42,48,37,0.15) 40px),' +
          'repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(42,48,37,0.08) 39px,rgba(42,48,37,0.08) 40px)',
      }}
    />
  );
}
