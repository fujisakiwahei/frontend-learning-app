<script setup lang="ts">
const route = useRoute();
const slug = computed(() => route.params.slug as string);
</script>

<template>
  <div class="app-container">
    <h1>セクション: {{ slug }}</h1>
    <p class="muted">セクション内レッスン一覧の雛形です。</p>
  </div>
</template>
