export type ReviewBox = 1 | 2 | 3;

export type ReviewEntry = {
  exerciseRef: string;
  box: ReviewBox;
  dueAt: string;
  lastResult: "wrong" | "correct";
};

const DAY_MS = 24 * 60 * 60 * 1000;

const BOX_INTERVAL_DAYS: Record<ReviewBox, number> = {
  1: 1,
  2: 3,
  3: 7,
};

function addDays(iso: string, days: number): string {
  return new Date(new Date(iso).getTime() + days * DAY_MS).toISOString();
}

export function addWrong(queue: ReviewEntry[], exerciseRef: string, now: string): ReviewEntry[] {
  const next = queue.filter((e) => e.exerciseRef !== exerciseRef);
  next.push({
    exerciseRef,
    box: 1,
    dueAt: addDays(now, BOX_INTERVAL_DAYS[1]),
    lastResult: "wrong",
  });
  return next;
}

export function markCorrect(queue: ReviewEntry[], exerciseRef: string, now: string): ReviewEntry[] {
  const entry = queue.find((e) => e.exerciseRef === exerciseRef);
  if (!entry) return queue;

  if (entry.box === 3) {
    return queue.filter((e) => e.exerciseRef !== exerciseRef);
  }

  const nextBox = (entry.box + 1) as ReviewBox;
  return queue.map((e) =>
    e.exerciseRef === exerciseRef
      ? {
          ...e,
          box: nextBox,
          dueAt: addDays(now, BOX_INTERVAL_DAYS[nextBox]),
          lastResult: "correct",
        }
      : e
  );
}

export function getDue(queue: ReviewEntry[], now: string, limit?: number): ReviewEntry[] {
  const nowMs = new Date(now).getTime();
  const due = queue
    .filter((e) => new Date(e.dueAt).getTime() <= nowMs)
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
  return typeof limit === "number" ? due.slice(0, limit) : due;
}

export function makeExerciseRef(lessonId: string, exerciseId: string): string {
  return `${lessonId}#${exerciseId}`;
}
