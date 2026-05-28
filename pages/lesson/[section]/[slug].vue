<script setup lang="ts">
import LessonRunner from "~/components/lesson/LessonRunner.vue";
import { getLessonByPath } from "~/lib/content";

const route = useRoute();
const router = useRouter();

const section = computed(() => route.params.section as string);
const slug = computed(() => route.params.slug as string);

const lesson = computed(() => getLessonByPath(section.value, slug.value));

definePageMeta({ layout: false });

function back() {
  router.push(`/section/${section.value}`);
}
</script>

<template>
  <div>
    <ClientOnly>
      <LessonRunner v-if="lesson" :lesson="lesson" @exit="back" @complete="back" />
      <div v-else class="lesson-missing app-container">
        <h1>レッスンが見つかりません</h1>
        <p class="muted">path: {{ section }}/{{ slug }}</p>
        <p>
          <NuxtLink to="/">ホームに戻る</NuxtLink>
        </p>
      </div>
      <template #fallback>
        <div class="lesson-loading app-container">
          <p class="muted">読み込み中…</p>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<style scoped>
.lesson-missing,
.lesson-loading {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding-top: var(--space-8);
}
</style>
