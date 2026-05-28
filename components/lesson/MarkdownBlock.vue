<script setup lang="ts">
import { renderMarkdown } from "~/lib/markdown";

const props = defineProps<{ src: string }>();

const key = computed(() => `md-${hashSrc(props.src)}`);

function hashSrc(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36);
}

const { data: html } = await useAsyncData(key.value, () => renderMarkdown(props.src), {
  watch: [() => props.src],
});
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -- src is trusted Git-managed content rendered through markdown-it + Shiki -->
  <div class="markdown-block" v-html="html" />
</template>

<style scoped>
.markdown-block {
  font-family: var(--font-sans);
  font-size: var(--fs-body);
  color: var(--color-text);
  line-height: 1.7;
}

.markdown-block :deep(h1),
.markdown-block :deep(h2),
.markdown-block :deep(h3) {
  font-weight: var(--fw-bold);
  margin-top: var(--space-6);
  margin-bottom: var(--space-3);
}

.markdown-block :deep(p) {
  margin-block: var(--space-3);
}

.markdown-block :deep(code) {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.95em;
  background: #e4e4e4;
  padding: 1px 6px;
  border-radius: var(--radius-sm);
}

.markdown-block :deep(pre) {
  margin-block: var(--space-4);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  overflow-x: auto;
  background: #e4e4e4 !important;
  font-size: 14px;
  line-height: 1.6;
}

.markdown-block :deep(pre code) {
  background: transparent;
  padding: 0;
}

.markdown-block :deep(a) {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

.markdown-block :deep(ul),
.markdown-block :deep(ol) {
  padding-left: var(--space-6);
  margin-block: var(--space-3);
}
</style>
