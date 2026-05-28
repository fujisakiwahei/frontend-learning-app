<script setup lang="ts">
type Level = 0 | 1 | 2 | 3;
type Size = "sm" | "md";

interface Props {
  level: Level;
  size?: Size;
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
});

const stars = computed(() => [1, 2, 3].map((i) => i <= props.level));
const sizeClass = computed(() => `star-row--${props.size}`);
</script>

<template>
  <div class="star-row" :class="sizeClass" role="img" :aria-label="`マスタリー ${level} / 3`">
    <svg
      v-for="(filled, index) in stars"
      :key="index"
      class="star-row__star"
      :class="{ 'star-row__star--filled': filled }"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <polygon
        points="12 2 15.09 8.26 22 9.27 17.18 14.14 18.18 21.02 12 17.77 5.82 21.02 6.91 17.06 2.18 14.14 12 9.27 15.09 8.26"
      />
    </svg>
  </div>
</template>

<style scoped>
.star-row {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}

.star-row__star {
  color: #d9d9d9;
  fill: currentColor;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linejoin: round;
}

.star-row__star--filled {
  color: var(--color-accent);
}

.star-row--sm .star-row__star {
  width: 16px;
  height: 16px;
}

.star-row--md .star-row__star {
  width: 24px;
  height: 24px;
}
</style>
