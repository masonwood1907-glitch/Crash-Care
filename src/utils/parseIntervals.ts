export interface IntervalSet {
  rounds: number;
  workSecs: number;
  restSecs: number;
}

function parseSecs(text: string): number | null {
  const sec = text.match(/(\d+)\s*-?\s*sec/i);
  if (sec) return parseInt(sec[1]);
  const min = text.match(/(\d+)\s*-?\s*min/i);
  if (min) return parseInt(min[1]) * 60;
  return null;
}

/**
 * Scans a workout's detail strings for an interval pattern like:
 *   "12× 1-min – Effort 8 / 1-min rest – Effort 3"
 *   "4× 20-sec sprints / 1-min rest – Effort 9"
 *   "5× 3-min – Effort 7 / 2-min easy between"
 * Returns null if no parseable interval is found.
 */
export function parseIntervals(details: string[]): IntervalSet | null {
  for (const detail of details) {
    // Must start with  N×  or  N x
    const m = detail.match(/^(\d+)\s*[×x]\s+(.+?)\s*\/\s*(.+)$/i);
    if (!m) continue;

    const rounds = parseInt(m[1]);
    const workSecs = parseSecs(m[2]);
    const restSecs = parseSecs(m[3]);

    if (rounds > 0 && workSecs && workSecs > 0 && restSecs && restSecs > 0) {
      return { rounds, workSecs, restSecs };
    }
  }
  return null;
}
