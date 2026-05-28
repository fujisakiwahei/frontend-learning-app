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

const sizeClass = computed(() => `star-row--${props.size}`);
</script>

<template>
  <div class="star-row" :class="sizeClass" role="img" :aria-label="`マスタリー ${level} / 3`">
    <span v-for="i in level" :key="i" class="star-row__star" aria-hidden="true">⭐️</span>
  </div>
</template>

<style scoped>
.star-row {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  line-height: 1;
}

.star-row--sm .star-row__star {
  font-size: 16px;
}

.star-row--md .star-row__star {
  font-size: 24px;
}
</style>
