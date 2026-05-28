<script setup lang="ts">
import StarRow from "~/components/ui/StarRow.vue";
import { useProgress } from "~/composables/useProgress";
import { getLessonDir, getLessonsForSection, getSection } from "~/lib/content";

const route = useRoute();
const sectionId = computed(() => route.params.slug as string);
const section = computed(() => getSection(sectionId.value));
const lessons = computed(() => getLessonsForSection(sectionId.value));

const progress = useProgress();

function dirFor(lessonId: string): string | undefined {
  return getLessonDir(lessonId);
}

function mastery(lessonId: string): 0 | 1 | 2 | 3 {
  return progress.getLessonProgress(lessonId).mastery;
}
</script>

<template>
  <div class="section app-container">
    <NuxtLink to="/" class="section__back muted">← ホーム</NuxtLink>

    <template v-if="section">
      <header class="section__header">
        <h1 class="section__title">{{ section.title }}</h1>
        <p class="section__desc muted">{{ section.description }}</p>
      </header>

      <ol class="section__lessons">
        <li v-for="(lesson, i) in lessons" :key="lesson.id" class="section__lesson">
          <NuxtLink
            v-if="dirFor(lesson.id)"
            :to="`/lesson/${sectionId}/${dirFor(lesson.id)}`"
            class="section__lesson-link"
          >
            <span class="section__lesson-index">{{ i + 1 }}</span>
            <div class="section__lesson-text">
              <p class="section__lesson-title">{{ lesson.title }}</p>
              <p class="section__lesson-meta muted">約 {{ lesson.estimatedMinutes }} 分</p>
            </div>
            <ClientOnly>
              <StarRow :level="mastery(lesson.id)" size="sm" />
            </ClientOnly>
          </NuxtLink>
        </li>
      </ol>

      <p v-if="lessons.length < section.lessons.length" class="section__note muted">
        ※ 未公開のレッスン {{ section.lessons.length - lessons.length }} 本
      </p>
    </template>

    <div v-else class="section__missing">
      <h1>セクションが見つかりません</h1>
      <p class="muted">id: {{ sectionId }}</p>
    </div>
  </div>
</template>

<style scoped>
.section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.section__back {
  text-decoration: none;
  font-size: var(--fs-label);
}

.section__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.section__title {
  margin: 0;
  font-size: var(--fs-display);
}

.section__desc {
  margin: 0;
}

.section__lessons {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  counter-reset: lesson;
}

.section__lesson-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
  border-radius: var(--radius-md);
  color: var(--color-text);
  text-decoration: none;
}

.section__lesson-link:hover {
  background: color-mix(in srgb, var(--color-surface) 80%, var(--color-primary) 20%);
}

.section__lesson-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--color-bg);
  border-radius: 999px;
  font-weight: var(--fw-bold);
  font-size: var(--fs-label);
  color: var(--color-text-muted);
}

.section__lesson-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.section__lesson-title {
  margin: 0;
  font-weight: var(--fw-bold);
  font-size: var(--fs-body);
}

.section__lesson-meta {
  margin: 0;
  font-size: var(--fs-label);
}

.section__note {
  margin: 0;
  font-size: var(--fs-label);
}

.section__missing {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
</style>
