<script setup lang="ts">
type ChoiceState = "default" | "selected" | "correct" | "wrong" | "disabled";

interface Props {
  label: string;
  state?: ChoiceState;
  labelPrefix?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  state: "default",
  labelPrefix: undefined,
});

defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const isDisabled = computed(() => props.state === "disabled");
const isPressed = computed(() => props.state === "selected");
const stateClass = computed(() => `choice-button--${props.state}`);
</script>

<template>
  <button
    type="button"
    class="choice-button"
    :class="stateClass"
    :disabled="isDisabled"
    :aria-pressed="isPressed"
    @click="$emit('click', $event)"
  >
    <span v-if="labelPrefix !== undefined" class="choice-button__prefix">
      {{ labelPrefix }}
    </span>
    <span class="choice-button__label">{{ label }}</span>
  </button>
</template>

<style scoped>
.choice-button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  min-height: 56px;
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-sans);
  font-size: var(--fs-body);
  font-weight: var(--fw-bold);
  text-align: left;
  background: var(--cb-bg);
  color: var(--cb-fg);
  border: 2px solid var(--cb-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    background 0.12s ease,
    color 0.12s ease,
    border-color 0.12s ease;
}

.choice-button__prefix {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  min-width: 28px;
  font-size: var(--fs-label);
  border: 2px solid currentColor;
  border-radius: var(--radius-sm);
}

.choice-button__label {
  flex: 1;
}

.choice-button--default {
  --cb-bg: var(--color-bg);
  --cb-fg: var(--color-text);
  --cb-border: #e0e0e0;
}

.choice-button--selected {
  --cb-bg: var(--color-primary);
  --cb-fg: #ffffff;
  --cb-border: var(--color-primary-dark);
}

.choice-button--correct {
  --cb-bg: var(--color-success);
  --cb-fg: #ffffff;
  --cb-border: color-mix(in srgb, var(--color-success) 70%, #000);
}

.choice-button--wrong {
  --cb-bg: var(--color-error);
  --cb-fg: #ffffff;
  --cb-border: color-mix(in srgb, var(--color-error) 70%, #000);
}

.choice-button--disabled {
  --cb-bg: var(--color-surface);
  --cb-fg: var(--color-text-muted);
  --cb-border: #e0e0e0;
  cursor: not-allowed;
}

.choice-button:hover:not(:disabled):not(.choice-button--selected):not(.choice-button--correct):not(.choice-button--wrong) {
  --cb-border: var(--color-primary);
}

.choice-button:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
