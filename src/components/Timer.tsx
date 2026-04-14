import { useState, useEffect, useRef, useCallback } from 'react';

function parseDuration(text: string): number | null {
  // Skip ranges like "8+ hours" or "1:45-4:20"
  if (text.includes('+') && text.includes('hour')) return null;
  if (/\d+:\d+-\d+:\d+/.test(text)) return null;

  const secMatch = text.match(/(\d+)\s*-?\s*sec/i);
  if (secMatch) return parseInt(secMatch[1]);

  const minMatch = text.match(/(\d+)\s*-?\s*min/i);
  if (minMatch) return parseInt(minMatch[1]) * 60;

  return null;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface TimerProps {
  stepText: string;
}

export function Timer({ stepText }: TimerProps) {
  const duration = parseDuration(stepText);
  const isCountdown = duration !== null;

  const [expanded, setExpanded] = useState(false);
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration ?? 0);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setFinished(false);
    if (isCountdown) setTimeLeft(duration!);
    else setElapsed(0);
  }, [isCountdown, duration]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const toggle = useCallback(() => {
    if (finished) {
      reset();
      return;
    }
    if (running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setRunning(false);
    } else {
      setRunning(true);
      intervalRef.current = window.setInterval(() => {
        if (isCountdown) {
          setTimeLeft((t) => {
            if (t <= 1) {
              clearInterval(intervalRef.current!);
              setRunning(false);
              setFinished(true);
              return 0;
            }
            return t - 1;
          });
        } else {
          setElapsed((e) => e + 1);
        }
      }, 1000);
    }
  }, [running, finished, isCountdown, reset]);

  const display = isCountdown ? timeLeft : elapsed;
  const pct = isCountdown && duration ? ((duration - timeLeft) / duration) * 100 : 0;

  return (
    <span className="inline-flex items-center gap-1 ml-1">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wider transition-colors"
        style={{
          background: expanded ? 'rgba(200,168,75,0.15)' : 'rgba(74,92,56,0.2)',
          border: `1px solid ${expanded ? '#7a6530' : '#2a3025'}`,
          color: expanded ? '#c8a84b' : '#4a5540',
        }}
        title={isCountdown ? `${duration}s timer` : 'Stopwatch'}
      >
        <svg width="8" height="8" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 1.5a5.5 5.5 0 110 11 5.5 5.5 0 010-11zM8 4a.75.75 0 01.75.75v3.19l2.28 1.32a.75.75 0 11-.75 1.3L7.5 9.06V4.75A.75.75 0 018 4z" />
        </svg>
        {isCountdown ? formatTime(duration!) : '⏱'}
      </button>

      {expanded && (
        <span
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded"
          style={{ background: 'rgba(14,16,11,0.9)', border: '1px solid #2a3025' }}
        >
          {/* Progress ring */}
          {isCountdown && (
            <svg width="18" height="18" viewBox="0 0 36 36" className="shrink-0">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#2a3025" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15" fill="none"
                stroke={finished ? '#6b8c4a' : running ? '#c8a84b' : '#4a5540'}
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 15}`}
                strokeDashoffset={`${2 * Math.PI * 15 * (1 - pct / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
          )}

          <span
            className="font-mono text-[11px] tabular-nums"
            style={{ color: finished ? '#6b8c4a' : running ? '#c8a84b' : '#c8cfc0', minWidth: '2.8ch' }}
          >
            {formatTime(display)}
          </span>

          <button
            onClick={toggle}
            className="font-mono text-[9px] px-1.5 py-0.5 rounded transition-colors"
            style={{
              background: running ? 'rgba(200,168,75,0.2)' : 'rgba(107,140,74,0.2)',
              border: `1px solid ${running ? '#7a6530' : '#4a5c38'}`,
              color: running ? '#c8a84b' : '#6b8c4a',
            }}
          >
            {finished ? 'DONE' : running ? 'PAUSE' : 'GO'}
          </button>

          <button
            onClick={reset}
            className="font-mono text-[9px] px-1 py-0.5 rounded"
            style={{ background: 'transparent', border: '1px solid #2a3025', color: '#3a4035' }}
            title="Reset"
          >
            ↺
          </button>
        </span>
      )}
    </span>
  );
}
