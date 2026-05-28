<script setup lang="ts">
type Variant = "primary" | "success" | "error";

interface Props {
  label: string;
  variant?: Variant;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  disabled: false,
});

defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const variantClass = computed(() => `primary-button--${props.variant}`);
</script>

<template>
  <button
    type="button"
    class="primary-button"
    :class="variantClass"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    {{ label }}
  </button>
</template>

<style scoped>
.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-sans);
  font-size: var(--fs-body);
  font-weight: var(--fw-bold);
  color: #ffffff;
  background: var(--pb-bg);
  border: 0;
  border-radius: var(--radius-md);
  box-shadow: 0 4px 0 var(--pb-shadow-color);
  cursor: pointer;
  transition:
    transform 0.08s ease,
    box-shadow 0.08s ease,
    filter 0.08s ease;
}

.primary-button--primary {
  --pb-bg: var(--color-primary);
  --pb-shadow-color: var(--color-primary-dark);
}

.primary-button--success {
  --pb-bg: var(--color-success);
  --pb-shadow-color: color-mix(in srgb, var(--color-success) 70%, #000);
}

.primary-button--error {
  --pb-bg: var(--color-error);
  --pb-shadow-color: color-mix(in srgb, var(--color-error) 70%, #000);
}

.primary-button:hover:not(:disabled) {
  filter: brightness(1.05);
}

.primary-button:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 0 0 var(--pb-shadow-color);
}

.primary-button:focus-visible {
  outline: 3px solid var(--pb-shadow-color);
  outline-offset: 2px;
}

.primary-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: 0 4px 0 var(--pb-shadow-color);
  transform: none;
}
</style>
