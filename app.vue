<script setup lang="ts">
const route = useRoute();
const showBottomNav = computed(() => !route.path.startsWith("/lesson"));
</script>

<template>
  <div class="app">
    <main class="app__main" :class="{ 'app__main--with-nav': showBottomNav }">
      <NuxtPage />
    </main>
    <BottomNav v-if="showBottomNav" />
  </div>
</template>

<style scoped>
.app {
  min-height: 100dvh;
}

.app__main {
  padding-bottom: 0;
}

.app__main--with-nav {
  padding-bottom: 80px;
}
</style>
