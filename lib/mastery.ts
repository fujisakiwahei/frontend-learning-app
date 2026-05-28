export type LessonProgress = {
  mastery: 0 | 1 | 2 | 3;
  firstCompletedAt?: string;
  lastCompletedAt?: string;
  masteryUpdatedAt?: string;
  attempts: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function utcDayIndex(iso: string): number {
  return Math.floor(new Date(iso).getTime() / DAY_MS);
}

function daysBetween(fromIso: string, toIso: string): number {
  return utcDayIndex(toIso) - utcDayIndex(fromIso);
}

export const EMPTY_PROGRESS: LessonProgress = { mastery: 0, attempts: 0 };

export function nextMastery(
  current: LessonProgress,
  allCorrectFirstTry: boolean,
  now: string
): LessonProgress {
  const attempts = current.attempts + 1;
  const next: LessonProgress = { ...current, attempts, lastCompletedAt: now };

  if (current.mastery === 0) {
    next.mastery = 1;
    next.firstCompletedAt = now;
    next.masteryUpdatedAt = now;
    return next;
  }

  if (current.mastery === 1) {
    if (
      allCorrectFirstTry &&
      current.lastCompletedAt &&
      daysBetween(current.lastCompletedAt, now) >= 1
    ) {
      next.mastery = 2;
      next.masteryUpdatedAt = now;
    }
    return next;
  }

  if (current.mastery === 2) {
    if (
      allCorrectFirstTry &&
      current.masteryUpdatedAt &&
      daysBetween(current.masteryUpdatedAt, now) >= 3
    ) {
      next.mastery = 3;
      next.masteryUpdatedAt = now;
    }
    return next;
  }

  return next;
}
