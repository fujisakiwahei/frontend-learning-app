import { useProgress } from "~/composables/useProgress";
import { makeExerciseRef, type ReviewEntry } from "~/lib/review-queue";

export function useReviewQueue() {
  const store = useProgress();
  return {
    addWrong(lessonId: string, exerciseId: string, now?: string) {
      store.addWrong(makeExerciseRef(lessonId, exerciseId), now ?? new Date().toISOString());
    },
    markCorrect(lessonId: string, exerciseId: string, now?: string) {
      store.markCorrect(makeExerciseRef(lessonId, exerciseId), now ?? new Date().toISOString());
    },
    getDueToday(now?: string): ReviewEntry[] {
      return store.getDueToday(now ?? new Date().toISOString());
    },
    getAllDue(now?: string): ReviewEntry[] {
      return store.getAllDue(now ?? new Date().toISOString());
    },
  };
}
