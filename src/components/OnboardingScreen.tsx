import { useState } from 'react';

interface OnboardingScreenProps {
  onComplete: (startDate: string) => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);

  const handleSubmit = () => {
    if (!date) return;
    localStorage.setItem('usna_start_date', date);
    onComplete(date);
  };

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 px-6"
      style={{ background: '#0d0f0b' }}
    >
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(42,48,37,0.2) 39px,rgba(42,48,37,0.2) 40px),' +
            'repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(42,48,37,0.1) 39px,rgba(42,48,37,0.1) 40px)',
        }}
      />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div
            style={{
              width: 72,
              height: 72,
              background: '#4a5c38',
              clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              className="font-mono text-center leading-tight"
              style={{ fontSize: 11, color: '#c8a84b', letterSpacing: '0.05em' }}
            >
              USNA<br />USN
            </span>
          </div>

          <div className="text-center">
            <div
              className="font-condensed font-black uppercase tracking-widest"
              style={{ fontSize: 28, color: '#e8f0d8', letterSpacing: '0.3em' }}
            >
              PLEBE PREP
            </div>
            <div
              className="font-condensed font-black uppercase"
              style={{ fontSize: 20, color: '#e8f0d8', letterSpacing: '0.3em' }}
            >
              TRACKER
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <div
          className="font-mono text-center"
          style={{ fontSize: 9, color: '#c8a84b', letterSpacing: '0.2em' }}
        >
          14-WEEK PHYSICAL PREPARATION PLAN
          <br />
          USNA PE DEPARTMENT
        </div>

        {/* Divider */}
        <div className="w-full" style={{ borderTop: '1px solid #2a3025' }} />

        {/* Date picker */}
        <div className="w-full flex flex-col gap-3">
          <div
            className="font-mono uppercase tracking-widest"
            style={{ fontSize: 9, color: '#6b7560', letterSpacing: '0.2em' }}
          >
            WHEN DOES YOUR 14-WEEK PLAN START?
          </div>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full font-mono outline-none"
            style={{
              background: '#141710',
              border: '1px solid #4a5c38',
              borderRadius: 6,
              padding: '12px 16px',
              color: '#e8f0d8',
              fontSize: 16,
              colorScheme: 'dark',
            }}
          />

          <div
            className="font-sans"
            style={{ fontSize: 11, color: '#4a5540', lineHeight: 1.6 }}
          >
            Set this to the Monday of Week 1. All workout scheduling
            and progress tracking derives from this date.
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!date}
          className="w-full font-condensed font-bold uppercase tracking-widest transition-all duration-200"
          style={{
            background: date ? '#4a5c38' : '#1c2018',
            border: `1px solid ${date ? '#6b8c4a' : '#2a3025'}`,
            borderRadius: 6,
            padding: '14px',
            fontSize: 16,
            color: date ? '#e8f0d8' : '#3a4035',
            letterSpacing: '0.2em',
            cursor: date ? 'pointer' : 'not-allowed',
            minHeight: 52,
          }}
        >
          BEGIN MISSION
        </button>

        <div
          className="font-mono text-center"
          style={{ fontSize: 9, color: '#2a3025', letterSpacing: '0.1em' }}
        >
          ALL DATA STORED LOCALLY ON DEVICE · NO ACCOUNT REQUIRED
        </div>
      </div>
    </div>
  );
}
