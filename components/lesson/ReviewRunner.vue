<script setup lang="ts">
import ExerciseCard from "~/components/lesson/ExerciseCard.vue";
import PrimaryButton from "~/components/ui/PrimaryButton.vue";
import TopBar from "~/components/nav/TopBar.vue";
import { useReviewQueue } from "~/composables/useReviewQueue";
import { getLesson } from "~/lib/content";
import type { Exercise } from "~/lib/schema";

const emit = defineEmits<{ (e: "exit"): void }>();

type ReviewItem = {
  exerciseRef: string;
  exercise: Exercise;
  sourceLessonTitle: string;
};

const queue = useReviewQueue();

const items = ref<ReviewItem[]>([]);
const cursor = ref(0);
const initialized = ref(false);

function load() {
  const due = queue.getAllDue();
  const out: ReviewItem[] = [];
  for (const entry of due) {
    const [lessonId, exerciseId] = entry.exerciseRef.split("#");
    if (!lessonId || !exerciseId) continue;
    const lesson = getLesson(lessonId);
    const exercise = lesson?.exercises.find((e) => e.id === exerciseId);
    if (!lesson || !exercise) continue;
    out.push({ exerciseRef: entry.exerciseRef, exercise, sourceLessonTitle: lesson.title });
  }
  items.value = out;
  cursor.value = 0;
  initialized.value = true;
}

onMounted(load);

const currentItem = computed<ReviewItem | null>(() => items.value[cursor.value] ?? null);
const progress = computed(() => {
  if (items.value.length === 0) return 1;
  return cursor.value / items.value.length;
});
const isDone = computed(() => initialized.value && cursor.value >= items.value.length);

function onAnswered(payload: { choiceId: string; correct: boolean }) {
  const item = currentItem.value;
  if (!item) return;
  const [lessonId, exerciseId] = item.exerciseRef.split("#");
  if (!lessonId || !exerciseId) return;
  if (payload.correct) queue.markCorrect(lessonId, exerciseId);
  else queue.addWrong(lessonId, exerciseId);
}

function advance() {
  if (cursor.value < items.value.length) cursor.value += 1;
}

function badgeFor(item: ReviewItem): string {
  return `復習: ${item.sourceLessonTitle}`;
}
</script>

<template>
  <div class="review-runner">
    <TopBar :progress="progress" @close="$emit('exit')" />
    <main class="review-runner__content">
      <template v-if="!initialized">
        <p class="muted">読み込み中…</p>
      </template>

      <template v-else-if="items.length === 0">
        <h1 class="review-runner__empty-title">復習はありません</h1>
        <p class="muted">
          間違えた問題がたまるとここに並びます。ホームからレッスンを進めましょう。
        </p>
        <div class="review-runner__actions">
          <PrimaryButton label="ホームへ" variant="primary" @click="emit('exit')" />
        </div>
      </template>

      <template v-else-if="isDone">
        <h1 class="review-runner__empty-title">復習完了！</h1>
        <p class="muted">今日の復習を消化しました。</p>
        <div class="review-runner__actions">
          <PrimaryButton label="ホームへ" variant="success" @click="emit('exit')" />
        </div>
      </template>

      <ExerciseCard
        v-else-if="currentItem"
        :key="`r-${currentItem.exerciseRef}-${cursor}`"
        :exercise="currentItem.exercise"
        :badge="badgeFor(currentItem)"
        @answered="onAnswered"
        @continue="advance"
      />
    </main>
  </div>
</template>

<style scoped>
.review-runner {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
}

.review-runner__content {
  flex: 1;
  max-width: 640px;
  width: 100%;
  margin: 0 auto;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.review-runner__empty-title {
  margin: 0;
  font-size: var(--fs-h1);
}

.review-runner__actions {
  display: flex;
  justify-content: flex-end;
}
</style>
