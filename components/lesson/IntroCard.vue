<script setup lang="ts">
import MarkdownBlock from "~/components/lesson/MarkdownBlock.vue";
import PrimaryButton from "~/components/ui/PrimaryButton.vue";
import type { Intro } from "~/lib/schema";

defineProps<{ intro: Intro }>();
defineEmits<{ (e: "continue"): void }>();
</script>

<template>
  <article class="intro-card">
    <p class="intro-card__eyebrow label">今回学ぶこと</p>
    <h1 class="intro-card__headline">{{ intro.headline }}</h1>
    <MarkdownBlock :src="intro.body" />
    <div class="intro-card__actions">
      <PrimaryButton label="続ける" variant="primary" @click="$emit('continue')" />
    </div>
  </article>
</template>

<style scoped>
.intro-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.intro-card__eyebrow {
  margin: 0;
}

.intro-card__headline {
  font-size: var(--fs-display);
  margin: 0;
  line-height: 1.2;
}

.intro-card__actions {
  margin-top: var(--space-4);
  display: flex;
  justify-content: flex-end;
}
</style>
