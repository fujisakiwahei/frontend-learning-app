<script setup lang="ts">
interface Props {
  progress: number;
}

const props = defineProps<Props>();

defineEmits<{
  (e: "close"): void;
}>();

const clampedProgress = computed(() =>
  Math.max(0, Math.min(1, props.progress)),
);

const progressPercent = computed(() => `${clampedProgress.value * 100}%`);
</script>

<template>
  <header class="top-bar">
    <button
      type="button"
      class="top-bar__close"
      aria-label="レッスンを閉じる"
      @click="$emit('close')"
    >
      <Icon name="lucide:x" class="top-bar__close-icon" />
    </button>
    <div
      class="top-bar__progress"
      role="progressbar"
      :aria-valuenow="Math.round(clampedProgress * 100)"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div class="top-bar__progress-fill" :style="{ width: progressPercent }" />
    </div>
  </header>
</template>

<style scoped>
.top-bar {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg);
}

.top-bar__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  min-width: 40px;
  background: transparent;
  border: 0;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  cursor: pointer;
}

.top-bar__close:hover {
  color: var(--color-text);
  background: var(--color-surface);
}

.top-bar__close:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

.top-bar__close-icon {
  width: 24px;
  height: 24px;
}

.top-bar__progress {
  flex: 1;
  height: 14px;
  background: #e5e5e5;
  border-radius: 999px;
  overflow: hidden;
}

.top-bar__progress-fill {
  height: 100%;
  background: var(--color-success);
  border-radius: 999px;
  transition: width 0.3s ease;
}
</style>
