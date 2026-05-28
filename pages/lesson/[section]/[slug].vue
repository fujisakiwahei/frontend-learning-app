<script setup lang="ts">
const route = useRoute();
const section = computed(() => route.params.section as string);
const slug = computed(() => route.params.slug as string);
</script>

<template>
  <div class="app-container">
    <h1>レッスン</h1>
    <p class="muted">section: {{ section }} / slug: {{ slug }}</p>
    <p class="muted">レッスン実行画面の雛形です。下部ナビは非表示。</p>
  </div>
</template>
