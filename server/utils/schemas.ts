import { z } from 'zod'

export const workoutSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).nullish(),
  tag: z.string().trim().max(40).nullish(),
  items: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(160),
        sets: z.number().int().min(0).max(100).nullish(),
        reps: z.string().trim().max(40).nullish(),
        load: z.string().trim().max(40).nullish(),
        restSeconds: z.number().int().min(0).max(3600).nullish(),
        notes: z.string().trim().max(500).nullish(),
        videoUrl: z.string().trim().url().max(500).nullish().or(z.literal('')),
      }),
    )
    .max(60),
})

export const runPlanSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).nullish(),
  goal: z.string().trim().max(160).nullish(),
  weeks: z.number().int().min(1).max(52),
  sessions: z
    .array(
      z.object({
        week: z.number().int().min(1).max(52),
        weekday: z.number().int().min(0).max(6),
        type: z.enum(RUN_TYPES),
        distanceKm: z.number().min(0).max(300).nullish(),
        durationMin: z.number().int().min(0).max(1440).nullish(),
        targetPace: z.string().max(10).nullish(), // "5:30"
        description: z.string().trim().max(1000).nullish(),
      }),
    )
    .max(400),
})
