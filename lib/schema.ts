import { z } from "zod";

export const SourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
});

export const CodeSchema = z.object({
  lang: z.string().min(1),
  src: z.string().min(1),
});

export const ChoiceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  isCorrect: z.boolean(),
  explanation: z.string().min(1),
});

export const ExerciseSchema = z
  .object({
    id: z.string().min(1),
    type: z.enum(["code-reading-4choice", "design-judgment-4choice"]),
    prompt: z.string().min(1),
    code: CodeSchema.optional(),
    choices: z.array(ChoiceSchema).length(4),
    sources: z.array(SourceSchema).min(1),
  })
  .refine((ex) => ex.choices.filter((c) => c.isCorrect).length === 1, {
    message: "exercise.choices must contain exactly one isCorrect: true",
  });

export const IntroSchema = z.object({
  headline: z.string().min(1),
  body: z.string().min(1),
});

export const ExplanationSchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
  code: CodeSchema.optional(),
  sources: z.array(SourceSchema).min(1),
});

export const SummarySchema = z.object({
  keypoints: z.array(z.string().min(1)).min(1),
  furtherReading: z.array(SourceSchema),
});

export const LessonSchema = z.object({
  id: z.string().min(1),
  version: z.number().int().positive(),
  title: z.string().min(1),
  estimatedMinutes: z.number().positive(),
  tags: z.array(z.string()),
  prerequisites: z.array(z.string()),
  intro: IntroSchema,
  explanations: z.array(ExplanationSchema).min(1),
  exercises: z.array(ExerciseSchema).min(1),
  summary: SummarySchema,
});

export const SectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  order: z.number().int().nonnegative(),
  lessons: z.array(z.string().min(1)).min(1),
});

export type Source = z.infer<typeof SourceSchema>;
export type Code = z.infer<typeof CodeSchema>;
export type Choice = z.infer<typeof ChoiceSchema>;
export type Exercise = z.infer<typeof ExerciseSchema>;
export type Intro = z.infer<typeof IntroSchema>;
export type Explanation = z.infer<typeof ExplanationSchema>;
export type Summary = z.infer<typeof SummarySchema>;
export type Lesson = z.infer<typeof LessonSchema>;
export type Section = z.infer<typeof SectionSchema>;
