<script setup lang="ts">
import ChoiceButton from "~/components/ui/ChoiceButton.vue";
import FeedbackSheet from "~/components/lesson/FeedbackSheet.vue";
import MarkdownBlock from "~/components/lesson/MarkdownBlock.vue";
import type { Exercise } from "~/lib/schema";

interface Props {
  exercise: Exercise;
  badge?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "answered", payload: { choiceId: string; correct: boolean }): void;
  (e: "continue"): void;
}>();

const selectedChoiceId = ref<string | null>(null);

const selectedChoice = computed(
  () => props.exercise.choices.find((c) => c.id === selectedChoiceId.value) ?? null
);

const isAnswered = computed(() => selectedChoice.value !== null);
const isCorrect = computed(() => selectedChoice.value?.isCorrect === true);

const codeSrc = computed(() => {
  if (!props.exercise.code) return null;
  return `\`\`\`${props.exercise.code.lang}\n${props.exercise.code.src}\n\`\`\``;
});

function stateFor(choiceId: string): "default" | "selected" | "correct" | "wrong" | "disabled" {
  const choice = props.exercise.choices.find((c) => c.id === choiceId);
  if (!choice) return "default";
  if (!isAnswered.value) return "default";
  if (choice.isCorrect) return "correct";
  if (choice.id === selectedChoiceId.value) return "wrong";
  return "disabled";
}

function select(choiceId: string) {
  if (isAnswered.value) return;
  selectedChoiceId.value = choiceId;
  const choice = props.exercise.choices.find((c) => c.id === choiceId);
  if (!choice) return;
  emit("answered", { choiceId, correct: choice.isCorrect });
}

function handleKeydown(e: KeyboardEvent) {
  if (isAnswered.value) {
    if (e.key === "Enter") {
      e.preventDefault();
      emit("continue");
    }
    return;
  }
  const idx = ["1", "2", "3", "4"].indexOf(e.key);
  if (idx === -1) return;
  const choice = props.exercise.choices[idx];
  if (!choice) return;
  e.preventDefault();
  select(choice.id);
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});

watch(
  () => props.exercise.id,
  () => {
    selectedChoiceId.value = null;
  }
);
</script>

<template>
  <article class="exercise-card">
    <p v-if="badge" class="exercise-card__badge label">{{ badge }}</p>
    <h2 class="exercise-card__prompt">{{ exercise.prompt }}</h2>
    <MarkdownBlock v-if="codeSrc" :src="codeSrc" />
    <div class="exercise-card__choices">
      <ChoiceButton
        v-for="(choice, i) in exercise.choices"
        :key="choice.id"
        :label="choice.label"
        :label-prefix="i + 1"
        :state="stateFor(choice.id)"
        @click="select(choice.id)"
      />
    </div>
    <FeedbackSheet
      :result="isCorrect ? 'correct' : 'wrong'"
      :open="isAnswered"
      :explanation="selectedChoice?.explanation ?? ''"
      @continue="$emit('continue')"
    />
  </article>
</template>

<style scoped>
.exercise-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding-bottom: 200px;
}

.exercise-card__badge {
  margin: 0;
  color: var(--color-primary);
}

.exercise-card__prompt {
  font-size: var(--fs-h1);
  margin: 0;
}

.exercise-card__choices {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
</style>
