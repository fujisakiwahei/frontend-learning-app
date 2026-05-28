import { LessonSchema, SectionSchema, type Lesson, type Section } from "./schema";

const sectionModules = import.meta.glob<{ default: unknown }>("/content/sections/*/section.json", {
  eager: true,
});

const lessonModules = import.meta.glob<{ default: unknown }>("/content/sections/*/*/lesson.json", {
  eager: true,
});

const sectionsBySectionId = new Map<string, Section>();
const lessonsByLessonId = new Map<string, Lesson>();
const sectionIdByLessonId = new Map<string, string>();
const lessonDirByLessonId = new Map<string, string>();
const lessonByPathKey = new Map<string, Lesson>();

const parseErrors: Array<{ path: string; error: unknown }> = [];

for (const [path, mod] of Object.entries(sectionModules)) {
  const parsed = SectionSchema.safeParse(mod.default);
  if (!parsed.success) {
    parseErrors.push({ path, error: parsed.error });
    continue;
  }
  sectionsBySectionId.set(parsed.data.id, parsed.data);
}

for (const [path, mod] of Object.entries(lessonModules)) {
  const parsed = LessonSchema.safeParse(mod.default);
  if (!parsed.success) {
    parseErrors.push({ path, error: parsed.error });
    continue;
  }
  lessonsByLessonId.set(parsed.data.id, parsed.data);

  const match = path.match(/\/content\/sections\/([^/]+)\/([^/]+)\//);
  if (match) {
    const sectionId = match[1];
    const dirName = match[2];
    sectionIdByLessonId.set(parsed.data.id, sectionId);
    lessonDirByLessonId.set(parsed.data.id, dirName);
    lessonByPathKey.set(`${sectionId}/${dirName}`, parsed.data);
  }
}

if (parseErrors.length > 0 && import.meta.dev) {
  for (const { path, error } of parseErrors) {
    console.error(`[content] failed to parse ${path}`, error);
  }
  throw new Error(
    `[content] ${parseErrors.length} content file(s) failed schema validation. See console for details.`
  );
}

export function getSection(sectionId: string): Section | undefined {
  return sectionsBySectionId.get(sectionId);
}

export function getAllSections(): Section[] {
  return [...sectionsBySectionId.values()].sort((a, b) => a.order - b.order);
}

export function getLesson(lessonId: string): Lesson | undefined {
  return lessonsByLessonId.get(lessonId);
}

export function getAllLessons(): Lesson[] {
  return [...lessonsByLessonId.values()];
}

export function getSectionIdForLesson(lessonId: string): string | undefined {
  return sectionIdByLessonId.get(lessonId);
}

export function getLessonDir(lessonId: string): string | undefined {
  return lessonDirByLessonId.get(lessonId);
}

export function getLessonByPath(sectionId: string, dirName: string): Lesson | undefined {
  return lessonByPathKey.get(`${sectionId}/${dirName}`);
}

export function getLessonsForSection(sectionId: string): Lesson[] {
  const section = sectionsBySectionId.get(sectionId);
  if (!section) return [];
  const lessons: Lesson[] = [];
  for (const dirName of section.lessons) {
    const lesson = lessonByPathKey.get(`${sectionId}/${dirName}`);
    if (lesson) lessons.push(lesson);
  }
  return lessons;
}
