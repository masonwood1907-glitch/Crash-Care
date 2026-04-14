import type { DayKey, Workout, WorkoutType } from '../types';

export const PHASES: Record<number, string> = {
  1: 'FOUNDATION', 2: 'FOUNDATION',
  3: 'INTERVALS', 4: 'INTERVALS',
  5: 'VOLUME BUILD', 6: 'VOLUME BUILD',
  7: 'CONSOLIDATION', 8: 'CONSOLIDATION', 9: 'CONSOLIDATION',
  10: 'INTENSITY BUILD', 11: 'INTENSITY BUILD', 12: 'INTENSITY BUILD',
  13: 'PEAK', 14: 'PEAK',
};

export const DAYS: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const DAY_LABELS: Record<DayKey, string> = {
  mon: 'MON', tue: 'TUE', wed: 'WED', thu: 'THU',
  fri: 'FRI', sat: 'SAT', sun: 'SUN',
};

export const TYPE_COLORS: Record<WorkoutType, string> = {
  cardio: '#6b8c4a',
  strength: '#c8a84b',
  circuit: '#5a8a8a',
  rest: '#3a3f35',
};

export const TYPE_BG: Record<WorkoutType, string> = {
  cardio: 'rgba(107,140,74,0.08)',
  strength: 'rgba(200,168,75,0.08)',
  circuit: 'rgba(90,138,138,0.08)',
  rest: 'rgba(58,63,53,0.08)',
};

export const PHASE_NOTES: Record<string, string> = {
  FOUNDATION: 'Foundation phase. Focus on building consistent habits and avoiding injury. Keep effort honest — Effort 4 should feel genuinely easy.',
  INTERVALS: 'Intervals begin. 1-min hard efforts at Effort 8 should be uncomfortable but controlled. Wednesday circuit starts — don\'t sandbag it.',
  'VOLUME BUILD': 'Volume increase. Steady-state cardio climbs to 25 min. Plank holds jump to 60 seconds — this is where real core strength builds.',
  CONSOLIDATION: 'Consolidation. You are now running 30 min on Tue/Fri and holding 4 sets of everything. Don\'t skip the Wednesday circuit — it directly mirrors PEP.',
  'INTENSITY BUILD': 'Intensity build. Wednesday circuit hits 3 rounds. 5-min threshold intervals on Thursday will reveal your actual aerobic fitness.',
  PEAK: 'Peak phase. 4 rounds Wednesday circuit. 35 min sustained cardio. You are as fit as this plan will make you. Focus, recover well, and show up sharp.',
};

export const BASE_WORKOUTS: Record<DayKey, (week: number) => Workout> = {
  mon: (w) => {
    if (w <= 2) return {
      type: 'cardio', label: 'INTERVALS',
      details: ['Warm-up: 5 min easy', '20 min – Effort 4', 'Cool-down: 5 min easy', '4× 20-sec sprints / 1-min rest – Effort 9'],
    };
    if (w <= 4) return {
      type: 'cardio', label: 'INTERVALS',
      details: ['Warm-up: 5 min easy', '5 min – Effort 4', `${w === 3 ? 6 : 8}× 1-min – Effort 8 / 1-min rest – Effort 3`, 'Cool-down: 5 min – Effort 3-4'],
    };
    if (w <= 6) return {
      type: 'cardio', label: 'INTERVALS',
      details: ['Warm-up: 5 min easy', '5 min – Effort 4', `${w === 5 ? 10 : 12}× 1-min – Effort 8 / 1-min rest – Effort 3`, 'Cool-down: 5 min – Effort 3-4'],
    };
    if (w <= 9) return {
      type: 'cardio', label: 'INTERVALS',
      details: ['Warm-up: 5 min easy', '5 min – Effort 4', `${w % 2 === 1 ? '12× 1-min' : '6× 2-min'} – Effort 8 / 1-min rest – Effort 3`, 'Cool-down: 5 min – Effort 3-4'],
    };
    if (w <= 12) return {
      type: 'cardio', label: 'INTERVALS',
      details: ['Warm-up: 5 min easy', '5 min – Effort 4', `${w % 2 === 0 ? '6× 2-min' : '12× 1-min'} – Effort 8 / 1-min rest – Effort 3`, 'Cool-down: 5 min – Effort 3-4'],
    };
    return {
      type: 'cardio', label: 'INTERVALS',
      details: ['Warm-up: 5 min easy', '5 min – Effort 4', `${w === 13 ? '12× 1-min' : '6× 2-min'} – Effort 8 / 1-min rest – Effort 3`, 'Cool-down: 5 min – Effort 3-4'],
    };
  },

  tue: (w) => {
    const mins = w <= 4 ? 20 : w <= 6 ? 25 : w <= 9 ? 30 : 35;
    const pu = w <= 2 ? '3×10 PU' : w <= 6 ? '4×10 PU' : '4×15 PU';
    const fp = w <= 2 ? '3×30-sec FP' : w <= 4 ? '3×45-sec FP' : w <= 6 ? '3×60-sec FP' : '4×60-sec FP';
    const sp = w <= 2 ? '3×30-sec SP' : w <= 4 ? '3×45-sec SP' : w <= 6 ? '3×60-sec SP' : '4×60-sec SP';
    return {
      type: 'strength', label: 'CARDIO + STRENGTH',
      details: ['Warm-up: 5 min easy', `${mins} min – Effort 4-5`, 'Cool-down: 5 min easy', `Strength: ${pu}`, fp, sp],
    };
  },

  wed: (w) => {
    if (w <= 2) return {
      type: 'rest', label: 'REST DAY',
      details: ['Full recovery', 'Light stretching if desired', 'Hydrate and sleep well'],
    };
    const rounds = w <= 5 ? 1 : w <= 9 ? 2 : w <= 12 ? 3 : 4;
    return {
      type: 'circuit', label: 'CALISTHENICS CIRCUIT',
      details: [
        'Dynamic warm-up only',
        `Circuit ×${rounds}: Burpees / Crunches / Mountain Climbers / USA Twists / Side Lunges`,
        'Each exercise: 45-sec on / 15-sec rest',
        '2-min rest between rounds',
        'Cool-down: 5 min easy',
      ],
    };
  },

  thu: (w) => {
    if (w <= 2) return {
      type: 'cardio', label: 'CARDIO + SPRINTS',
      details: ['Warm-up: 5 min easy', '20 min – Effort 4-5', 'Cool-down: 5 min easy', '4× 20-sec sprints / 1-min rest – Effort 9'],
    };
    let intervals: string;
    if (w <= 4) {
      intervals = `${w === 3 ? '3' : '4'}× 3-min – Effort 7 / 2-min rest – Effort 3`;
    } else if (w <= 7) {
      intervals = '5× 3-min – Effort 7 / 2-min easy between';
    } else if (w <= 10) {
      intervals = `${w % 2 === 0 ? '3× 5-min' : '5× 3-min'} – Effort 7 / 2-min rest`;
    } else {
      intervals = `${w % 2 === 1 ? '5× 3-min' : '3× 5-min'} – Effort 7 / 2-min rest`;
    }
    return {
      type: 'cardio', label: 'THRESHOLD INTERVALS',
      details: ['Warm-up: 5 min easy', '5 min – Effort 4', intervals, '5 min – Effort 3-4'],
    };
  },

  fri: (w) => {
    const mins = w <= 4 ? 25 : w <= 6 ? 25 : w <= 9 ? 30 : 35;
    const pu = w <= 2 ? '3×10 PU' : w <= 6 ? '4×10 PU' : '4×15 PU';
    const fp = w <= 2 ? '3×30-sec FP' : w <= 4 ? '3×45-sec FP' : w <= 6 ? '3×60-sec FP' : '4×60-sec FP';
    const sp = w <= 2 ? '3×30-sec SP' : w <= 4 ? '3×45-sec SP' : w <= 6 ? '3×60-sec SP' : '4×60-sec SP';
    return {
      type: 'strength', label: 'CARDIO + STRENGTH',
      details: ['Warm-up: 5 min easy', `${mins} min – Effort 4-5`, 'Cool-down: 5 min brisk walk', `Strength: ${pu}`, fp, sp],
    };
  },

  sat: (w) => {
    if (w <= 2) return {
      type: 'rest', label: 'REST DAY',
      details: ['Full recovery', 'Foam roll / mobility work', 'Prepare for next week'],
    };
    const mins = w <= 6 ? 25 : w <= 11 ? 30 : 35;
    return {
      type: 'cardio', label: 'CARDIO + SPRINTS',
      details: ['Warm-up: 5 min easy', `${mins} min – Effort 4-5`, 'Cool-down: 5 min easy', '4× 20-sec sprints / 1-min rest – Effort 9'],
    };
  },

  sun: (_w) => ({
    type: 'rest', label: 'REST DAY',
    details: ['Full recovery', 'Sleep 8+ hours', 'Hydrate well'],
  }),
};

export function getWorkoutKey(week: number, day: DayKey): string {
  return `w${week}_${day}`;
}
