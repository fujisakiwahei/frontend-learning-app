<script setup lang="ts">
import PrimaryButton from "~/components/ui/PrimaryButton.vue";

type Result = "correct" | "wrong";

interface Props {
  result: Result;
  explanation?: string;
  open?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  explanation: "",
  open: true,
});

defineEmits<{
  (e: "continue"): void;
}>();

const resultClass = computed(() => `feedback-sheet--${props.result}`);
const headline = computed(() =>
  props.result === "correct" ? "正解！" : "不正解",
);
const iconName = computed(() =>
  props.result === "correct" ? "lucide:check-circle-2" : "lucide:x-circle",
);
const continueVariant = computed(() =>
  props.result === "correct" ? "success" : "error",
);
</script>

<template>
  <Transition name="feedback-sheet-slide">
    <section
      v-if="open"
      class="feedback-sheet"
      :class="resultClass"
      role="status"
      aria-live="polite"
    >
      <div class="feedback-sheet__body">
        <Icon :name="iconName" class="feedback-sheet__icon" />
        <div class="feedback-sheet__text">
          <p class="feedback-sheet__headline">{{ headline }}</p>
          <p v-if="result === 'wrong' && explanation" class="feedback-sheet__explanation">
            {{ explanation }}
          </p>
        </div>
      </div>
      <div class="feedback-sheet__actions">
        <PrimaryButton
          label="続ける"
          :variant="continueVariant"
          @click="$emit('continue')"
        />
      </div>
    </section>
  </Transition>
</template>

<style scoped>
.feedback-sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-6) var(--space-4)
    calc(var(--space-6) + env(safe-area-inset-bottom, 0));
  background: var(--fs-bg);
  color: var(--fs-fg);
  border-top-left-radius: var(--radius-lg);
  border-top-right-radius: var(--radius-lg);
  box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.08);
  z-index: 20;
}

.feedback-sheet--correct {
  --fs-bg: #d7ffb8;
  --fs-fg: color-mix(in srgb, var(--color-success) 70%, #000);
}

.feedback-sheet--wrong {
  --fs-bg: #ffdada;
  --fs-fg: color-mix(in srgb, var(--color-error) 70%, #000);
}

.feedback-sheet__body {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
}

.feedback-sheet__icon {
  width: 32px;
  height: 32px;
  min-width: 32px;
  color: var(--fs-fg);
}

.feedback-sheet__text {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.feedback-sheet__headline {
  font-size: var(--fs-h2);
  font-weight: var(--fw-bold);
  margin: 0;
}

.feedback-sheet__explanation {
  font-size: var(--fs-body);
  color: var(--color-text);
  margin: 0;
}

.feedback-sheet__actions {
  display: flex;
  justify-content: flex-end;
}

.feedback-sheet-slide-enter-from,
.feedback-sheet-slide-leave-to {
  transform: translateY(100%);
}

.feedback-sheet-slide-enter-active,
.feedback-sheet-slide-leave-active {
  transition: transform 0.25s ease;
}
</style>
