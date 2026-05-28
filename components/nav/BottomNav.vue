<script setup lang="ts">
const route = useRoute();

interface NavItem {
  to: string;
  label: string;
  icon: string;
  match: (path: string) => boolean;
}

const items: NavItem[] = [
  {
    to: "/",
    label: "ホーム",
    icon: "lucide:home",
    match: (p) => p === "/" || p.startsWith("/section"),
  },
  {
    to: "/review",
    label: "復習",
    icon: "lucide:repeat",
    match: (p) => p.startsWith("/review"),
  },
  {
    to: "/settings",
    label: "設定",
    icon: "lucide:settings",
    match: (p) => p.startsWith("/settings"),
  },
];
</script>

<template>
  <nav class="bottom-nav" aria-label="メインナビゲーション">
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="bottom-nav__item"
      :class="{ 'bottom-nav__item--active': item.match(route.path) }"
    >
      <Icon :name="item.icon" class="bottom-nav__icon" />
      <span class="bottom-nav__label">{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: var(--color-bg);
  border-top: 1px solid var(--color-surface);
  padding: var(--space-2) 0 calc(var(--space-2) + env(safe-area-inset-bottom, 0));
  z-index: 10;
}

.bottom-nav__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: var(--space-2);
  color: var(--color-text-muted);
  font-size: var(--fs-label);
  font-weight: var(--fw-bold);
}

.bottom-nav__item--active {
  color: var(--color-primary);
}

.bottom-nav__icon {
  width: 24px;
  height: 24px;
}
</style>
