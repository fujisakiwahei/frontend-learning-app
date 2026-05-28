<script setup lang="ts">
import ReviewRunner from "~/components/lesson/ReviewRunner.vue";

const router = useRouter();

definePageMeta({ layout: false });

function back() {
  router.push("/");
}
</script>

<template>
  <ClientOnly>
    <ReviewRunner @exit="back" />
    <template #fallback>
      <div class="app-container">
        <p class="muted">読み込み中…</p>
      </div>
    </template>
  </ClientOnly>
</template>
