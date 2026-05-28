import { useProgressStore } from "~/stores/progress";

export function useProgress() {
  const store = useProgressStore();
  if (
    import.meta.client &&
    Object.keys(store.lessons).length === 0 &&
    store.reviewQueue.length === 0
  ) {
    store.hydrate();
  }
  return store;
}
