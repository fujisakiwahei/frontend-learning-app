<script setup lang="ts">
const lesson = useLesson("vue-reactivity.ref-vs-reactive");
const sections = useAllSections();

definePageMeta({ title: "Markdown Preview (dev)" });
</script>

<template>
  <div class="dev-preview">
    <h1>Markdown / Shiki / データ層 動作確認</h1>

    <section>
      <h2>セクション一覧（Zod パース後）</h2>
      <ul>
        <li v-for="s in sections" :key="s.id">
          <strong>{{ s.title }}</strong>
          <span class="muted"> — {{ s.lessons.length }} レッスン</span>
        </li>
      </ul>
    </section>

    <template v-if="lesson">
      <section>
        <h2>サンプルレッスン</h2>
        <p>
          <code>{{ lesson.id }}</code> / 推定 {{ lesson.estimatedMinutes }} 分
        </p>
      </section>

      <section>
        <h2>Intro</h2>
        <MarkdownBlock :src="lesson.intro.body" />
      </section>

      <section v-for="(ex, i) in lesson.explanations" :key="i">
        <h2>{{ ex.heading }}</h2>
        <MarkdownBlock :src="ex.body" />
        <MarkdownBlock v-if="ex.code" :src="`\`\`\`${ex.code.lang}\n${ex.code.src}\n\`\`\``" />
      </section>
    </template>

    <p v-else class="muted">サンプルレッスンが見つかりません。</p>
  </div>
</template>

<style scoped>
.dev-preview {
  max-width: 720px;
  margin: 0 auto;
  padding: var(--space-6);
}

.dev-preview section {
  margin-top: var(--space-6);
}

.muted {
  color: var(--color-text-muted);
}
</style>
