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
    <span
      v-for="(filled, index) in stars"
      :key="index"
      class="star-row__star"
      :class="{ 'star-row__star--filled': filled }"
      aria-hidden="true"
      >⭐️</span
    >
  </div>
</template>

<style scoped>
.star-row {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  line-height: 1;
}

.star-row__star {
  opacity: 0.25;
  filter: grayscale(1);
}

.star-row__star--filled {
  opacity: 1;
  filter: none;
}

.star-row--sm .star-row__star {
  font-size: 16px;
}

.star-row--md .star-row__star {
  font-size: 24px;
}
</style>
