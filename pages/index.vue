<script setup lang="ts">
import StarRow from "~/components/ui/StarRow.vue";
import { useAllSections } from "~/composables/useSection";
import { useProgress } from "~/composables/useProgress";
import { useReviewQueue } from "~/composables/useReviewQueue";
import { getLessonsForSection } from "~/lib/content";

const sections = useAllSections();
const progress = useProgress();
const review = useReviewQueue();

const dueCount = computed(() => (import.meta.client ? review.getAllDue().length : 0));

function averageMastery(sectionId: string): 0 | 1 | 2 | 3 {
  const lessons = getLessonsForSection(sectionId);
  if (lessons.length === 0) return 0;
  const total = lessons.reduce((sum, l) => sum + progress.getLessonProgress(l.id).mastery, 0);
  return Math.floor(total / lessons.length) as 0 | 1 | 2 | 3;
}

function lessonCount(sectionId: string): number {
  return getLessonsForSection(sectionId).length;
}
</script>

<template>
  <div class="home app-container">
    <header class="home__header">
      <h1 class="home__title display">学習</h1>
    </header>

    <ClientOnly>
      <NuxtLink v-if="dueCount > 0" to="/review" class="home__review-card">
        <span class="home__review-label">今日の復習</span>
        <span class="home__review-count">{{ dueCount }} 問</span>
      </NuxtLink>
    </ClientOnly>

    <ul class="home__sections">
      <li v-for="section in sections" :key="section.id" class="home__section">
        <NuxtLink :to="`/section/${section.id}`" class="home__section-link">
          <div class="home__section-text">
            <p class="home__section-title">{{ section.title }}</p>
            <p class="home__section-meta muted">{{ lessonCount(section.id) }} レッスン</p>
          </div>
          <ClientOnly>
            <StarRow :level="averageMastery(section.id)" size="sm" />
          </ClientOnly>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.home__header {
  margin-bottom: var(--space-2);
}

.home__title {
  margin: 0;
}

.home__review-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  background: var(--color-primary);
  color: #ffffff;
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: var(--fw-bold);
  box-shadow: 0 4px 0 var(--color-primary-dark);
}

.home__review-label {
  font-size: var(--fs-body);
}

.home__review-count {
  font-size: var(--fs-h2);
}

.home__sections {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.home__section-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-surface);
  border-radius: var(--radius-md);
  color: var(--color-text);
  text-decoration: none;
}

.home__section-link:hover {
  background: color-mix(in srgb, var(--color-surface) 80%, var(--color-primary) 20%);
}

.home__section-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.home__section-title {
  margin: 0;
  font-weight: var(--fw-bold);
  font-size: var(--fs-body);
}

.home__section-meta {
  margin: 0;
  font-size: var(--fs-label);
}
</style>
