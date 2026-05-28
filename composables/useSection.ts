import { getSection, getAllSections } from "~/lib/content";
import type { Section } from "~/lib/schema";

export function useSection(id: string): Section | undefined {
  return getSection(id);
}

export function useAllSections(): Section[] {
  return getAllSections();
}
