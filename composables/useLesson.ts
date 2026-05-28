import { getLesson, getAllLessons } from "~/lib/content";
import type { Lesson } from "~/lib/schema";

export function useLesson(id: string): Lesson | undefined {
  return getLesson(id);
}

export function useAllLessons(): Lesson[] {
  return getAllLessons();
}
