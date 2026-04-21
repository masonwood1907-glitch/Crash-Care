import type { DayKey, Workout, WorkoutType } from '../types';

// Total program: 9 weeks + 3 active recovery days = 66 days
export const TOTAL_PROGRAM_DAYS = 66;
export const TOTAL_DISPLAY_WEEKS = 10; // 9 regular + 1 recovery week

export const PHASES: Record<number, string> = {
  1: 'INTERVALS', 2: 'INTERVALS',
  3: 'VOLUME BUILD', 4: 'VOLUME BUILD',
  5: 'CONSOLIDATION',
  6: 'INTENSITY BUILD', 7: 'INTENSITY BUILD',
  8: 'PEAK', 9: 'PEAK',
  10: 'ACTIVE RECOVERY',
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
  INTERVALS: "Intervals from week one — you're coming in fit. Focus on consistent effort, not max effort. Volume builds week to week.",
  'VOLUME BUILD': 'Interval reps climbing toward 12. Core strength sets jump to 15 reps. Build the aerobic engine before the intensity phase.',
  CONSOLIDATION: 'Volume peaks — 6×2-min intervals and 3×5-min threshold. This is the hardest training week. Recover hard on Sunday.',
  'INTENSITY BUILD': 'Reduce volume slightly, sharpen intensity. Threshold holds at 5-min efforts. Circuit hits 3 rounds. Stay sharp.',
  PEAK: 'Maximum circuit volume — 4 rounds. Longest sustained cardio. You are as fit as this plan makes you. Show up sharp on I-Day.',
  'ACTIVE RECOVERY': "Arrive fresh. Do not train hard this week. Easy movement only — light jog and mobility work. You've done the work. Trust it.",
};

// ─── SHARED WORKOUT TEMPLATES ─────────────────────────────────────────────────

const SUN_REST: Workout = {
  type: 'rest', label: 'REST DAY',
  details: ['Full recovery', 'Sleep 8+ hours', 'Hydrate well'],
};

const RECOVERY_DAY: Workout = {
  type: 'rest', label: 'ACTIVE RECOVERY',
  details: [
    'Easy 20-min jog – Effort 3-4',
    'Light stretching and mobility work',
    'No hard efforts',
  ],
};

// ─── EXPLICIT WORKOUT DATA ────────────────────────────────────────────────────

const WORKOUT_DATA: Record<number, Record<DayKey, Workout>> = {
  // ── WEEK 1 ────────────────────────────────────────────────────────────────
  1: {
    mon: {
      type: 'cardio', label: 'INTERVALS',
      details: [
        'Warm-up: 5 min easy',
        '5 min – Effort 4',
        '6× 1-min – Effort 8 / 1-min rest – Effort 3',
        'Cool-down: 5 min easy',
      ],
    },
    tue: {
      type: 'strength', label: 'CARDIO + STRENGTH',
      details: [
        'Warm-up: 5 min easy',
        '25 min – Effort 4-5',
        'Cool-down: 5 min easy',
        'Strength: 4×10 PU',
        '3×45-sec FP',
        '3×45-sec SP',
      ],
    },
    wed: {
      type: 'circuit', label: 'CALISTHENICS CIRCUIT',
      details: [
        'Circuit ×1: Burpees / Crunches / Mountain Climbers / USA Twists / Side Lunges',
        'Each exercise: 45-sec on / 15-sec rest',
        'Cool-down: 5 min easy',
      ],
    },
    thu: {
      type: 'cardio', label: 'THRESHOLD INTERVALS',
      details: [
        'Warm-up: 5 min easy',
        '5 min – Effort 4',
        '3× 3-min – Effort 7 / 2-min rest – Effort 3',
        '5 min – Effort 3-4',
      ],
    },
    fri: {
      type: 'strength', label: 'CARDIO + STRENGTH',
      details: [
        'Warm-up: 5 min easy',
        '25 min – Effort 4-5',
        'Cool-down: 5 min easy',
        'Strength: 4×10 PU',
        '3×45-sec FP',
        '3×45-sec SP',
      ],
    },
    sat: {
      type: 'cardio', label: 'CARDIO + SPRINTS',
      details: [
        'Warm-up: 5 min easy',
        '20 min – Effort 4-5',
        'Cool-down: 5 min easy',
        '4× 20-sec sprints / 1-min rest – Effort 9',
      ],
    },
    sun: SUN_REST,
  },

  // ── WEEK 2 ────────────────────────────────────────────────────────────────
  2: {
    mon: {
      type: 'cardio', label: 'INTERVALS',
      details: [
        'Warm-up: 5 min easy',
        '5 min – Effort 4',
        '8× 1-min – Effort 8 / 1-min rest – Effort 3',
        'Cool-down: 5 min easy',
      ],
    },
    tue: {
      type: 'strength', label: 'CARDIO + STRENGTH',
      details: [
        'Warm-up: 5 min easy',
        '25 min – Effort 4-5',
        'Cool-down: 5 min easy',
        'Strength: 4×10 PU',
        '3×45-sec FP',
        '3×45-sec SP',
      ],
    },
    wed: {
      type: 'circuit', label: 'CALISTHENICS CIRCUIT',
      details: [
        'Circuit ×1: Burpees / Crunches / Mountain Climbers / USA Twists / Side Lunges',
        'Each exercise: 45-sec on / 15-sec rest',
        '2-min rest',
        'Cool-down: 5 min easy',
      ],
    },
    thu: {
      type: 'cardio', label: 'THRESHOLD INTERVALS',
      details: [
        'Warm-up: 5 min easy',
        '5 min – Effort 4',
        '4× 3-min – Effort 7 / 2-min rest – Effort 3',
        '5 min – Effort 3-4',
      ],
    },
    fri: {
      type: 'strength', label: 'CARDIO + STRENGTH',
      details: [
        'Warm-up: 5 min easy',
        '25 min – Effort 4-5',
        'Cool-down: 5 min easy',
        'Strength: 4×10 PU',
        '3×45-sec FP',
        '3×45-sec SP',
      ],
    },
    sat: {
      type: 'cardio', label: 'CARDIO + SPRINTS',
      details: [
        'Warm-up: 5 min easy',
        '20 min – Effort 4-5',
        'Cool-down: 5 min easy',
        '4× 20-sec sprints / 1-min rest – Effort 9',
      ],
    },
    sun: SUN_REST,
  },

  // ── WEEK 3 ────────────────────────────────────────────────────────────────
  3: {
    mon: {
      type: 'cardio', label: 'INTERVALS',
      details: [
        'Warm-up: 5 min easy',
        '5 min – Effort 4',
        '10× 1-min – Effort 8 / 1-min rest – Effort 3',
        'Cool-down: 5 min easy',
      ],
    },
    tue: {
      type: 'strength', label: 'CARDIO + STRENGTH',
      details: [
        'Warm-up: 5 min easy',
        '25 min – Effort 4-5',
        'Cool-down: 5 min easy',
        'Strength: 3×15 PU',
        '3×60-sec FP',
        '3×60-sec SP',
      ],
    },
    wed: {
      type: 'circuit', label: 'CALISTHENICS CIRCUIT',
      details: [
        'Circuit ×2: Burpees / Crunches / Mountain Climbers / USA Twists / Side Lunges',
        'Each exercise: 45-sec on / 15-sec rest',
        '2-min rest between rounds',
        'Cool-down: 5 min easy',
      ],
    },
    thu: {
      type: 'cardio', label: 'THRESHOLD INTERVALS',
      details: [
        'Warm-up: 5 min easy',
        '5 min – Effort 4',
        '5× 3-min – Effort 7 / 2-min easy between',
        '5 min – Effort 3-4',
      ],
    },
    fri: {
      type: 'strength', label: 'CARDIO + STRENGTH',
      details: [
        'Warm-up: 5 min easy',
        '25 min – Effort 4-5',
        'Cool-down: 5 min easy',
        'Strength: 3×15 PU',
        '3×60-sec FP',
        '3×60-sec SP',
      ],
    },
    sat: {
      type: 'cardio', label: 'CARDIO + SPRINTS',
      details: [
        'Warm-up: 5 min easy',
        '25 min – Effort 4-5',
        'Cool-down: 5 min easy',
        '4× 20-sec sprints / 1-min rest – Effort 9',
      ],
    },
    sun: SUN_REST,
  },

  // ── WEEK 4 ────────────────────────────────────────────────────────────────
  4: {
    mon: {
      type: 'cardio', label: 'INTERVALS',
      details: [
        'Warm-up: 5 min easy',
        '5 min – Effort 4',
        '12× 1-min – Effort 8 / 1-min rest – Effort 3',
        'Cool-down: 5 min easy',
      ],
    },
    tue: {
      type: 'strength', label: 'CARDIO + STRENGTH',
      details: [
        'Warm-up: 5 min easy',
        '25 min – Effort 4-5',
        'Cool-down: 5 min easy',
        'Strength: 3×15 PU',
        '3×60-sec FP',
        '3×60-sec SP',
      ],
    },
    wed: {
      type: 'circuit', label: 'CALISTHENICS CIRCUIT',
      details: [
        'Circuit ×2: Burpees / Crunches / Mountain Climbers / USA Twists / Side Lunges',
        'Each exercise: 45-sec on / 15-sec rest',
        '2-min rest between rounds',
        'Cool-down: 5 min easy',
      ],
    },
    thu: {
      type: 'cardio', label: 'THRESHOLD INTERVALS',
      details: [
        'Warm-up: 5 min easy',
        '5 min – Effort 4',
        '5× 3-min – Effort 7 / 2-min easy between',
        '5 min – Effort 3-4',
      ],
    },
    fri: {
      type: 'strength', label: 'CARDIO + STRENGTH',
      details: [
        'Warm-up: 5 min easy',
        '25 min – Effort 4-5',
        'Cool-down: 5 min easy',
        'Strength: 3×15 PU',
        '3×60-sec FP',
        '3×60-sec SP',
      ],
    },
    sat: {
      type: 'cardio', label: 'CARDIO + SPRINTS',
      details: [
        'Warm-up: 5 min easy',
        '25 min – Effort 4-5',
        'Cool-down: 5 min easy',
        '4× 20-sec sprints / 1-min rest – Effort 9',
      ],
    },
    sun: SUN_REST,
  },

  // ── WEEK 5 ────────────────────────────────────────────────────────────────
  5: {
    mon: {
      type: 'cardio', label: 'INTERVALS',
      details: [
        'Warm-up: 5 min easy',
        '5 min – Effort 4',
        '6× 2-min – Effort 8 / 1-min rest – Effort 3',
        'Cool-down: 5 min easy',
      ],
    },
    tue: {
      type: 'strength', label: 'CARDIO + STRENGTH',
      details: [
        'Warm-up: 5 min easy',
        '30 min – Effort 4-5',
        'Cool-down: 5 min easy',
        'Strength: 4×15 PU',
        '4×60-sec FP',
        '4×60-sec SP',
      ],
    },
    wed: {
      type: 'circuit', label: 'CALISTHENICS CIRCUIT',
      details: [
        'Circuit ×2: Burpees / Crunches / Mountain Climbers / USA Twists / Side Lunges',
        'Each exercise: 45-sec on / 15-sec rest',
        '2-min rest between rounds',
        'Cool-down: 5 min easy',
      ],
    },
    thu: {
      type: 'cardio', label: 'THRESHOLD INTERVALS',
      details: [
        'Warm-up: 5 min easy',
        '5 min – Effort 4',
        '3× 5-min – Effort 7 / 2-min rest – Effort 3',
        '5 min – Effort 3-4',
      ],
    },
    fri: {
      type: 'strength', label: 'CARDIO + STRENGTH',
      details: [
        'Warm-up: 5 min easy',
        '30 min – Effort 4-5',
        'Cool-down: 5 min easy',
        'Strength: 4×15 PU',
        '4×60-sec FP',
        '4×60-sec SP',
      ],
    },
    sat: {
      type: 'cardio', label: 'CARDIO + SPRINTS',
      details: [
        'Warm-up: 5 min easy',
        '30 min – Effort 4-5',
        'Cool-down: 5 min easy',
        '4× 20-sec sprints / 1-min rest – Effort 9',
      ],
    },
    sun: SUN_REST,
  },

  // ── WEEK 6 ────────────────────────────────────────────────────────────────
  6: {
    mon: {
      type: 'cardio', label: 'INTERVALS',
      details: [
        'Warm-up: 5 min easy',
        '5 min – Effort 4',
        '6× 2-min – Effort 8 / 1-min rest – Effort 3',
        'Cool-down: 5 min easy',
      ],
    },
    tue: {
      type: 'strength', label: 'CARDIO + STRENGTH',
      details: [
        'Warm-up: 5 min easy',
        '30 min – Effort 4-5',
        'Cool-down: 5 min easy',
        'Strength: 4×15 PU',
        '4×60-sec FP',
        '4×60-sec SP',
      ],
    },
    wed: {
      type: 'circuit', label: 'CALISTHENICS CIRCUIT',
      details: [
        'Circuit ×3: Burpees / Crunches / Mountain Climbers / USA Twists / Side Lunges',
        'Each exercise: 45-sec on / 15-sec rest',
        '2-min rest between rounds',
        'Cool-down: 5 min easy',
      ],
    },
    thu: {
      type: 'cardio', label: 'THRESHOLD INTERVALS',
      details: [
        'Warm-up: 5 min easy',
        '5 min – Effort 4',
        '3× 5-min – Effort 7 / 2-min rest – Effort 3',
        '5 min – Effort 3-4',
      ],
    },
    fri: {
      type: 'strength', label: 'CARDIO + STRENGTH',
      details: [
        'Warm-up: 5 min easy',
        '30 min – Effort 4-5',
        'Cool-down: 5 min easy',
        'Strength: 4×15 PU',
        '4×60-sec FP',
        '4×60-sec SP',
      ],
    },
    sat: {
      type: 'cardio', label: 'CARDIO + SPRINTS',
      details: [
        'Warm-up: 5 min easy',
        '30 min – Effort 4-5',
        'Cool-down: 5 min easy',
        '4× 20-sec sprints / 1-min rest – Effort 9',
      ],
    },
    sun: SUN_REST,
  },

  // ── WEEK 7 ────────────────────────────────────────────────────────────────
  7: {
    mon: {
      type: 'cardio', label: 'INTERVALS',
      details: [
        'Warm-up: 5 min easy',
        '5 min – Effort 4',
        '12× 1-min – Effort 8 / 1-min rest – Effort 3',
        'Cool-down: 5 min easy',
      ],
    },
    tue: {
      type: 'strength', label: 'CARDIO + STRENGTH',
      details: [
        'Warm-up: 5 min easy',
        '35 min – Effort 4-5',
        'Cool-down: 5 min easy',
        'Strength: 4×15 PU',
        '4×60-sec FP',
        '4×60-sec SP',
      ],
    },
    wed: {
      type: 'circuit', label: 'CALISTHENICS CIRCUIT',
      details: [
        'Circuit ×3: Burpees / Crunches / Mountain Climbers / USA Twists / Side Lunges',
        'Each exercise: 45-sec on / 15-sec rest',
        '2-min rest between rounds',
        'Cool-down: 5 min easy',
      ],
    },
    thu: {
      type: 'cardio', label: 'THRESHOLD INTERVALS',
      details: [
        'Warm-up: 5 min easy',
        '5 min – Effort 4',
        '5× 3-min – Effort 7 / 2-min rest – Effort 3',
        '5 min – Effort 3-4',
      ],
    },
    fri: {
      type: 'strength', label: 'CARDIO + STRENGTH',
      details: [
        'Warm-up: 5 min easy',
        '35 min – Effort 4-5',
        'Cool-down: 5 min easy',
        'Strength: 4×15 PU',
        '4×60-sec FP',
        '4×60-sec SP',
      ],
    },
    sat: {
      type: 'cardio', label: 'CARDIO + SPRINTS',
      details: [
        'Warm-up: 5 min easy',
        '30 min – Effort 4-5',
        'Cool-down: 5 min easy',
        '4× 20-sec sprints / 1-min rest – Effort 9',
      ],
    },
    sun: SUN_REST,
  },

  // ── WEEK 8 ────────────────────────────────────────────────────────────────
  8: {
    mon: {
      type: 'cardio', label: 'INTERVALS',
      details: [
        'Warm-up: 5 min easy',
        '5 min – Effort 4',
        '12× 1-min – Effort 8 / 1-min rest – Effort 3',
        'Cool-down: 5 min easy',
      ],
    },
    tue: {
      type: 'strength', label: 'CARDIO + STRENGTH',
      details: [
        'Warm-up: 5 min easy',
        '35 min – Effort 4-5',
        'Cool-down: 5 min easy',
        'Strength: 4×15 PU',
        '4×60-sec FP',
        '4×60-sec SP',
      ],
    },
    wed: {
      type: 'circuit', label: 'CALISTHENICS CIRCUIT',
      details: [
        'Circuit ×4: Burpees / Crunches / Mountain Climbers / USA Twists / Side Lunges',
        'Each exercise: 45-sec on / 15-sec rest',
        '2-min rest between rounds',
        'Cool-down: 5 min easy',
      ],
    },
    thu: {
      type: 'cardio', label: 'THRESHOLD INTERVALS',
      details: [
        'Warm-up: 5 min easy',
        '5 min – Effort 4',
        '5× 3-min – Effort 7 / 2-min rest – Effort 3',
        '5 min – Effort 3-4',
      ],
    },
    fri: {
      type: 'strength', label: 'CARDIO + STRENGTH',
      details: [
        'Warm-up: 5 min easy',
        '35 min – Effort 4-5',
        'Cool-down: 5 min easy',
        'Strength: 4×15 PU',
        '4×60-sec FP',
        '4×60-sec SP',
      ],
    },
    sat: {
      type: 'cardio', label: 'CARDIO + SPRINTS',
      details: [
        'Warm-up: 5 min easy',
        '35 min – Effort 4-5',
        'Cool-down: 5 min easy',
        '4× 20-sec sprints / 1-min rest – Effort 9',
      ],
    },
    sun: SUN_REST,
  },

  // ── WEEK 9 ────────────────────────────────────────────────────────────────
  9: {
    mon: {
      type: 'cardio', label: 'INTERVALS',
      details: [
        'Warm-up: 5 min easy',
        '5 min – Effort 4',
        '6× 2-min – Effort 8 / 1-min rest – Effort 3',
        'Cool-down: 5 min easy',
      ],
    },
    tue: {
      type: 'strength', label: 'CARDIO + STRENGTH',
      details: [
        'Warm-up: 5 min easy',
        '35 min – Effort 4-5',
        'Cool-down: 5 min easy',
        'Strength: 4×15 PU',
        '4×60-sec FP',
        '4×60-sec SP',
      ],
    },
    wed: {
      type: 'circuit', label: 'CALISTHENICS CIRCUIT',
      details: [
        'Circuit ×4: Burpees / Crunches / Mountain Climbers / USA Twists / Side Lunges',
        'Each exercise: 45-sec on / 15-sec rest',
        '2-min rest between rounds',
        'Cool-down: 5 min easy',
      ],
    },
    thu: {
      type: 'cardio', label: 'THRESHOLD INTERVALS',
      details: [
        'Warm-up: 5 min easy',
        '5 min – Effort 4',
        '3× 5-min – Effort 7 / 2-min rest – Effort 3',
        '5 min – Effort 3-4',
      ],
    },
    fri: {
      type: 'strength', label: 'CARDIO + STRENGTH',
      details: [
        'Warm-up: 5 min easy',
        '35 min – Effort 4-5',
        'Cool-down: 5 min easy',
        'Strength: 4×15 PU',
        '4×60-sec FP',
        '4×60-sec SP',
      ],
    },
    sat: {
      type: 'cardio', label: 'CARDIO + SPRINTS',
      details: [
        'Warm-up: 5 min easy',
        '35 min – Effort 4-5',
        'Cool-down: 5 min easy',
        '4× 20-sec sprints / 1-min rest – Effort 9',
      ],
    },
    sun: SUN_REST,
  },

  // ── WEEK 10 — ACTIVE RECOVERY (3 days) ───────────────────────────────────
  // isPastProgram fires after day 65 (Wed); Thu–Sun are never reached naturally
  10: {
    mon: RECOVERY_DAY,
    tue: RECOVERY_DAY,
    wed: RECOVERY_DAY,
    thu: SUN_REST,
    fri: SUN_REST,
    sat: SUN_REST,
    sun: SUN_REST,
  },
};

// ─── PUBLIC API (same signature as before — all callers unchanged) ────────────

export const BASE_WORKOUTS: Record<DayKey, (week: number) => Workout> = {
  mon: (w) => WORKOUT_DATA[w]?.mon ?? RECOVERY_DAY,
  tue: (w) => WORKOUT_DATA[w]?.tue ?? RECOVERY_DAY,
  wed: (w) => WORKOUT_DATA[w]?.wed ?? RECOVERY_DAY,
  thu: (w) => WORKOUT_DATA[w]?.thu ?? SUN_REST,
  fri: (w) => WORKOUT_DATA[w]?.fri ?? SUN_REST,
  sat: (w) => WORKOUT_DATA[w]?.sat ?? SUN_REST,
  sun: (_w) => SUN_REST,
};

export function getWorkoutKey(week: number, day: DayKey): string {
  return `w${week}_${day}`;
}
