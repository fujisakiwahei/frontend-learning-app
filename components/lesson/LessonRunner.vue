<script setup lang="ts">
import IntroCard from "~/components/lesson/IntroCard.vue";
import ExplanationCard from "~/components/lesson/ExplanationCard.vue";
import ExerciseCard from "~/components/lesson/ExerciseCard.vue";
import SummaryCard from "~/components/lesson/SummaryCard.vue";
import TopBar from "~/components/nav/TopBar.vue";
import { useProgress } from "~/composables/useProgress";
import { useReviewQueue } from "~/composables/useReviewQueue";
import { getLesson } from "~/lib/content";
import type { Exercise, Lesson } from "~/lib/schema";

interface Props {
  lesson: Lesson;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "exit" | "complete"): void;
}>();

type Step =
  | { kind: "review"; exerciseRef: string; exercise: Exercise; sourceLessonTitle: string }
  | { kind: "intro" }
  | { kind: "explanation"; index: number }
  | { kind: "exercise"; exerciseId: string }
  | { kind: "retry"; exerciseId: string }
  | { kind: "summary" };

const progressStore = useProgress();
const reviewQueue = useReviewQueue();

const steps = ref<Step[]>([{ kind: "intro" }]);
const cursor = ref(0);
const firstTry = ref<Record<string, boolean>>({});

function buildReviewSteps(): Step[] {
  const due = reviewQueue.getDueToday();
  const out: Step[] = [];
  for (const entry of due) {
    const [lessonId, exerciseId] = entry.exerciseRef.split("#");
    if (!lessonId || !exerciseId) continue;
    const lesson = getLesson(lessonId);
    const exercise = lesson?.exercises.find((ex) => ex.id === exerciseId);
    if (!lesson || !exercise) continue;
    out.push({
      kind: "review",
      exerciseRef: entry.exerciseRef,
      exercise,
      sourceLessonTitle: lesson.title,
    });
  }
  return out;
}

function buildSteps() {
  const reviews = buildReviewSteps();
  const explanations: Step[] = props.lesson.explanations.map((_, i) => ({
    kind: "explanation",
    index: i,
  }));
  const exercises: Step[] = props.lesson.exercises.map((ex) => ({
    kind: "exercise",
    exerciseId: ex.id,
  }));
  steps.value = [...reviews, { kind: "intro" }, ...explanations, ...exercises, { kind: "summary" }];
  cursor.value = 0;
  firstTry.value = {};
}

onMounted(() => {
  buildSteps();
});

const currentStep = computed<Step | null>(() => steps.value[cursor.value] ?? null);

const progress = computed(() => {
  if (steps.value.length === 0) return 0;
  return cursor.value / steps.value.length;
});

function findExercise(exerciseId: string): Exercise | undefined {
  return props.lesson.exercises.find((ex) => ex.id === exerciseId);
}

function recordFirstTry(exerciseId: string, correct: boolean) {
  if (firstTry.value[exerciseId] === undefined) {
    firstTry.value[exerciseId] = correct;
  }
}

function handleMainAnswered(exerciseId: string, correct: boolean) {
  recordFirstTry(exerciseId, correct);
  if (!correct) {
    reviewQueue.addWrong(props.lesson.id, exerciseId);
    const summaryIdx = steps.value.findIndex((s) => s.kind === "summary");
    if (summaryIdx >= 0) {
      steps.value.splice(summaryIdx, 0, { kind: "retry", exerciseId });
    }
  }
}

function handleRetryAnswered(exerciseId: string, correct: boolean) {
  if (!correct) {
    const summaryIdx = steps.value.findIndex((s) => s.kind === "summary");
    if (summaryIdx >= 0) {
      steps.value.splice(summaryIdx, 0, { kind: "retry", exerciseId });
    }
  }
}

function handleReviewAnswered(exerciseRef: string, correct: boolean) {
  if (correct) {
    reviewQueue.markCorrect(...splitRef(exerciseRef));
  } else {
    reviewQueue.addWrong(...splitRef(exerciseRef));
  }
}

function splitRef(ref: string): [string, string] {
  const [lessonId, exerciseId] = ref.split("#");
  return [lessonId ?? "", exerciseId ?? ""];
}

function advance() {
  if (cursor.value < steps.value.length - 1) {
    cursor.value += 1;
  }
}

function completeLesson() {
  const allCorrect = props.lesson.exercises.every((ex) => firstTry.value[ex.id] === true);
  progressStore.completeLesson(props.lesson.id, allCorrect);
  emit("complete");
}

function exit() {
  if (cursor.value === 0 || currentStep.value?.kind === "summary") {
    emit("exit");
    return;
  }
  if (window.confirm("レッスンを途中で終了しますか？進捗は保存されません。")) {
    emit("exit");
  }
}

function exerciseBadge(): string | undefined {
  if (!currentStep.value) return undefined;
  if (currentStep.value.kind === "review") return `復習: ${currentStep.value.sourceLessonTitle}`;
  if (currentStep.value.kind === "retry") return "もう一度";
  return undefined;
}

function currentExercise(): Exercise | null {
  const step = currentStep.value;
  if (!step) return null;
  if (step.kind === "review") return step.exercise;
  if (step.kind === "exercise") return findExercise(step.exerciseId) ?? null;
  if (step.kind === "retry") return findExercise(step.exerciseId) ?? null;
  return null;
}

function onAnswered(payload: { choiceId: string; correct: boolean }) {
  const step = currentStep.value;
  if (!step) return;
  if (step.kind === "review") {
    handleReviewAnswered(step.exerciseRef, payload.correct);
  } else if (step.kind === "exercise") {
    handleMainAnswered(step.exerciseId, payload.correct);
  } else if (step.kind === "retry") {
    handleRetryAnswered(step.exerciseId, payload.correct);
  }
}

function exerciseKey(): string {
  const step = currentStep.value;
  if (!step) return "none";
  if (step.kind === "review") return `r-${step.exerciseRef}-${cursor.value}`;
  if (step.kind === "exercise") return `e-${step.exerciseId}-${cursor.value}`;
  if (step.kind === "retry") return `t-${step.exerciseId}-${cursor.value}`;
  return "none";
}
</script>

<template>
  <div class="lesson-runner">
    <TopBar :progress="progress" @close="exit" />
    <main class="lesson-runner__content">
      <template v-if="currentStep">
        <IntroCard v-if="currentStep.kind === 'intro'" :intro="lesson.intro" @continue="advance" />

        <ExplanationCard
          v-else-if="currentStep.kind === 'explanation'"
          :key="`exp-${currentStep.index}`"
          :explanation="lesson.explanations[currentStep.index]!"
          @continue="advance"
        />

        <ExerciseCard
          v-else-if="
            (currentStep.kind === 'review' ||
              currentStep.kind === 'exercise' ||
              currentStep.kind === 'retry') &&
            currentExercise()
          "
          :key="exerciseKey()"
          :exercise="currentExercise()!"
          :badge="exerciseBadge()"
          @answered="onAnswered"
          @continue="advance"
        />

        <SummaryCard
          v-else-if="currentStep.kind === 'summary'"
          :summary="lesson.summary"
          :lesson-title="lesson.title"
          @complete="completeLesson"
        />
      </template>
    </main>
  </div>
</template>

<style scoped>
.lesson-runner {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
}

.lesson-runner__content {
  flex: 1;
  max-width: 640px;
  width: 100%;
  margin: 0 auto;
  padding: var(--space-4);
}
</style>
