import { useProgress } from "~/composables/useProgress";
import type { LessonProgress } from "~/lib/mastery";

export function useMastery() {
  const store = useProgress();
  return {
    getMastery(lessonId: string): LessonProgress["mastery"] {
      return store.getLessonProgress(lessonId).mastery;
    },
    completeLesson(lessonId: string, allCorrectFirstTry: boolean, now?: string) {
      store.completeLesson(lessonId, allCorrectFirstTry, now ?? new Date().toISOString());
    },
  };
}
