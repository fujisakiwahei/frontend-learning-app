<script setup lang="ts">
import PrimaryButton from "~/components/ui/PrimaryButton.vue";
import type { Summary } from "~/lib/schema";

defineProps<{ summary: Summary; lessonTitle: string }>();
defineEmits<{ (e: "complete"): void }>();
</script>

<template>
  <article class="summary-card">
    <p class="summary-card__eyebrow label">レッスン完了</p>
    <h1 class="summary-card__title">{{ lessonTitle }}</h1>

    <section class="summary-card__section">
      <h2 class="summary-card__heading">要点</h2>
      <ul class="summary-card__list">
        <li v-for="(point, i) in summary.keypoints" :key="i">{{ point }}</li>
      </ul>
    </section>

    <section v-if="summary.furtherReading.length" class="summary-card__section">
      <h2 class="summary-card__heading">参考リンク</h2>
      <ul class="summary-card__list">
        <li v-for="src in summary.furtherReading" :key="src.url">
          <a :href="src.url" target="_blank" rel="noopener noreferrer">{{ src.title }}</a>
        </li>
      </ul>
    </section>

    <div class="summary-card__actions">
      <PrimaryButton label="完了" variant="success" @click="$emit('complete')" />
    </div>
  </article>
</template>

<style scoped>
.summary-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.summary-card__eyebrow {
  margin: 0;
  color: var(--color-success);
}

.summary-card__title {
  font-size: var(--fs-display);
  margin: 0;
  line-height: 1.2;
}

.summary-card__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.summary-card__heading {
  font-size: var(--fs-h2);
  margin: 0;
}

.summary-card__list {
  margin: 0;
  padding-left: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.summary-card__list a {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

.summary-card__actions {
  margin-top: var(--space-4);
  display: flex;
  justify-content: flex-end;
}
</style>
