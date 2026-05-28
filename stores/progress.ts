import { defineStore } from "pinia";
import { EMPTY_PROGRESS, nextMastery, type LessonProgress } from "~/lib/mastery";
import {
  addWrong as queueAddWrong,
  getDue,
  markCorrect as queueMarkCorrect,
  type ReviewEntry,
} from "~/lib/review-queue";

const STORAGE_KEY = "flap.progress.v1";
const SCHEMA_VERSION = 1;

type PersistedState = {
  lessons: Record<string, LessonProgress>;
  reviewQueue: ReviewEntry[];
  schemaVersion: number;
};

function loadFromStorage(): PersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    if (parsed?.schemaVersion !== SCHEMA_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveToStorage(state: PersistedState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota / disabled storage
  }
}

export const useProgressStore = defineStore("progress", {
  state: (): PersistedState => ({
    lessons: {},
    reviewQueue: [],
    schemaVersion: SCHEMA_VERSION,
  }),

  getters: {
    getLessonProgress: (state) => {
      return (lessonId: string): LessonProgress => state.lessons[lessonId] ?? { ...EMPTY_PROGRESS };
    },
    getDueToday: (state) => {
      return (now: string = new Date().toISOString()): ReviewEntry[] =>
        getDue(state.reviewQueue, now, 3);
    },
    getAllDue: (state) => {
      return (now: string = new Date().toISOString()): ReviewEntry[] =>
        getDue(state.reviewQueue, now);
    },
  },

  actions: {
    hydrate() {
      const persisted = loadFromStorage();
      if (persisted) {
        this.lessons = persisted.lessons ?? {};
        this.reviewQueue = persisted.reviewQueue ?? [];
      }
    },

    persist() {
      saveToStorage({
        lessons: this.lessons,
        reviewQueue: this.reviewQueue,
        schemaVersion: SCHEMA_VERSION,
      });
    },

    completeLesson(
      lessonId: string,
      allCorrectFirstTry: boolean,
      now: string = new Date().toISOString()
    ) {
      const current = this.lessons[lessonId] ?? { ...EMPTY_PROGRESS };
      this.lessons[lessonId] = nextMastery(current, allCorrectFirstTry, now);
      this.persist();
    },

    addWrong(exerciseRef: string, now: string = new Date().toISOString()) {
      this.reviewQueue = queueAddWrong(this.reviewQueue, exerciseRef, now);
      this.persist();
    },

    markCorrect(exerciseRef: string, now: string = new Date().toISOString()) {
      this.reviewQueue = queueMarkCorrect(this.reviewQueue, exerciseRef, now);
      this.persist();
    },

    reset() {
      this.lessons = {};
      this.reviewQueue = [];
      this.persist();
    },
  },
});
