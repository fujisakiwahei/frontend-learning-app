<script setup lang="ts">
import PrimaryButton from "~/components/ui/PrimaryButton.vue";
import { useProgress } from "~/composables/useProgress";

const progress = useProgress();

const stats = computed(() => {
  if (!import.meta.client) {
    return { completed: 0, reviewing: 0 };
  }
  const completed = Object.values(progress.lessons).filter((l) => l.mastery > 0).length;
  const reviewing = progress.reviewQueue.length;
  return { completed, reviewing };
});

function resetProgress() {
  if (!window.confirm("進捗をすべて消去します。よろしいですか？")) return;
  progress.reset();
}
</script>

<template>
  <div class="settings app-container">
    <h1 class="settings__title">設定</h1>

    <section class="settings__section">
      <h2 class="settings__heading">進捗</h2>
      <ClientOnly>
        <dl class="settings__stats">
          <div class="settings__stat">
            <dt class="muted">着手したレッスン</dt>
            <dd>{{ stats.completed }}</dd>
          </div>
          <div class="settings__stat">
            <dt class="muted">復習キュー</dt>
            <dd>{{ stats.reviewing }} 問</dd>
          </div>
        </dl>
        <div class="settings__actions">
          <PrimaryButton label="進捗をリセット" variant="error" @click="resetProgress" />
        </div>
      </ClientOnly>
    </section>

    <section class="settings__section">
      <h2 class="settings__heading">バージョン</h2>
      <p class="muted">localStorage schema: <code>flap.progress.v1</code></p>
    </section>

    <section class="settings__section">
      <h2 class="settings__heading">このアプリについて</h2>
      <p class="muted">
        自分専用のフロントエンド学習アプリ。Vue 3 / Nuxt / TypeScript
        のコードリーディング力と設計判断力を鍛えるための、4択ベース短時間レッスン集。
      </p>
    </section>
  </div>
</template>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.settings__title {
  margin: 0;
  font-size: var(--fs-display);
}

.settings__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.settings__heading {
  margin: 0;
  font-size: var(--fs-h2);
}

.settings__stats {
  margin: 0;
  display: flex;
  gap: var(--space-6);
}

.settings__stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.settings__stat dt {
  margin: 0;
  font-size: var(--fs-label);
}

.settings__stat dd {
  margin: 0;
  font-weight: var(--fw-bold);
  font-size: var(--fs-h2);
}

.settings__actions {
  display: flex;
  justify-content: flex-start;
}
</style>
