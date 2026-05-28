<!--
  UIプリミティブのデモページ。
  Issue #4 の手動確認用。LessonRunner 等への結線（別Issue）が済んだら
  このファイルは削除する。
-->
<script setup lang="ts">
import PrimaryButton from "~/components/ui/PrimaryButton.vue";
import ChoiceButton from "~/components/ui/ChoiceButton.vue";
import StarRow from "~/components/ui/StarRow.vue";
import TopBar from "~/components/nav/TopBar.vue";
import FeedbackSheet from "~/components/lesson/FeedbackSheet.vue";

definePageMeta({
  layout: false,
});

type ChoiceState = "default" | "selected" | "correct" | "wrong" | "disabled";

const choiceStates: ChoiceState[] = [
  "default",
  "selected",
  "correct",
  "wrong",
  "disabled",
];

const topBarProgress = ref(0.4);
const feedbackOpen = ref(false);
const feedbackResult = ref<"correct" | "wrong">("correct");

function showFeedback(result: "correct" | "wrong") {
  feedbackResult.value = result;
  feedbackOpen.value = true;
}
</script>

<template>
  <div class="demo">
    <h1 class="demo__title">UIプリミティブ デモ</h1>
    <p class="demo__note muted">
      Issue #4 の手動確認用。統合完了後に削除予定。
    </p>

    <section class="demo__section">
      <h2>PrimaryButton</h2>
      <div class="demo__row">
        <PrimaryButton label="続ける" variant="primary" />
        <PrimaryButton label="正解！" variant="success" />
        <PrimaryButton label="やり直す" variant="error" />
        <PrimaryButton label="無効" variant="primary" disabled />
      </div>
    </section>

    <section class="demo__section">
      <h2>ChoiceButton</h2>
      <div class="demo__stack">
        <ChoiceButton
          v-for="(state, i) in choiceStates"
          :key="state"
          :label="`選択肢 (${state})`"
          :state="state"
          :label-prefix="i + 1"
        />
      </div>
    </section>

    <section class="demo__section">
      <h2>StarRow</h2>
      <div class="demo__row">
        <StarRow :level="0" />
        <StarRow :level="1" />
        <StarRow :level="2" />
        <StarRow :level="3" />
      </div>
      <div class="demo__row">
        <StarRow :level="0" size="sm" />
        <StarRow :level="1" size="sm" />
        <StarRow :level="2" size="sm" />
        <StarRow :level="3" size="sm" />
      </div>
    </section>

    <section class="demo__section">
      <h2>TopBar</h2>
      <div class="demo__topbar-frame">
        <TopBar :progress="topBarProgress" @close="topBarProgress = 0" />
      </div>
      <div class="demo__row">
        <PrimaryButton
          label="進捗 +20%"
          variant="primary"
          @click="topBarProgress = Math.min(1, topBarProgress + 0.2)"
        />
        <PrimaryButton
          label="リセット"
          variant="error"
          @click="topBarProgress = 0"
        />
      </div>
    </section>

    <section class="demo__section">
      <h2>FeedbackSheet</h2>
      <div class="demo__row">
        <PrimaryButton
          label="正解シートを表示"
          variant="success"
          @click="showFeedback('correct')"
        />
        <PrimaryButton
          label="不正解シートを表示"
          variant="error"
          @click="showFeedback('wrong')"
        />
      </div>
    </section>

    <FeedbackSheet
      :result="feedbackResult"
      :open="feedbackOpen"
      explanation="`ref` はプリミティブ値、`reactive` はオブジェクトに使うのが基本です。"
      @continue="feedbackOpen = false"
    />
  </div>
</template>

<style scoped>
.demo {
  max-width: 640px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-4) calc(var(--space-8) + 200px);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.demo__title {
  font-size: var(--fs-display);
  margin: 0;
}

.demo__note {
  margin: 0;
}

.demo__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-surface);
  border-radius: var(--radius-md);
}

.demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-items: center;
}

.demo__stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.demo__topbar-frame {
  background: var(--color-bg);
  border: 1px solid #e0e0e0;
  border-radius: var(--radius-md);
}
</style>
