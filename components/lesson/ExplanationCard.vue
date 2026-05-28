<script setup lang="ts">
import MarkdownBlock from "~/components/lesson/MarkdownBlock.vue";
import PrimaryButton from "~/components/ui/PrimaryButton.vue";
import type { Explanation } from "~/lib/schema";

const props = defineProps<{ explanation: Explanation }>();
defineEmits<{ (e: "continue"): void }>();

const codeSrc = computed(() => {
  if (!props.explanation.code) return null;
  return `\`\`\`${props.explanation.code.lang}\n${props.explanation.code.src}\n\`\`\``;
});
</script>

<template>
  <article class="explanation-card">
    <h2 class="explanation-card__heading">{{ explanation.heading }}</h2>
    <MarkdownBlock :src="explanation.body" />
    <MarkdownBlock v-if="codeSrc" :src="codeSrc" />
    <ul v-if="explanation.sources.length" class="explanation-card__sources">
      <li v-for="src in explanation.sources" :key="src.url">
        <a :href="src.url" target="_blank" rel="noopener noreferrer">{{ src.title }}</a>
      </li>
    </ul>
    <div class="explanation-card__actions">
      <PrimaryButton label="続ける" variant="primary" @click="$emit('continue')" />
    </div>
  </article>
</template>

<style scoped>
.explanation-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.explanation-card__heading {
  font-size: var(--fs-h1);
  margin: 0;
}

.explanation-card__sources {
  margin: 0;
  padding-left: var(--space-6);
  font-size: var(--fs-label);
  color: var(--color-text-muted);
}

.explanation-card__sources a {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

.explanation-card__actions {
  margin-top: var(--space-4);
  display: flex;
  justify-content: flex-end;
}
</style>
