import { z } from "zod";
import { ActivityType } from "@prisma/client";

export const goalSchema = z.object({
  languageId: z.string(),
  hours: z.number().min(0),
  minutes: z.number().min(0).max(59),
  deadline: z.date().nullable(),
  activityType: z.nativeEnum(ActivityType)
}).refine(data => data.hours > 0 || data.minutes > 0, {
  message: "Target duration must be greater than 0",
});

export type GoalInput = z.infer<typeof goalSchema>;

export const goalCreateSchema = z.object({
  languageId: z.string(),
  target: z.number().min(1),
  deadline: z.date().nullable(),
  activityType: z.nativeEnum(ActivityType)
});

export type GoalCreateInput = z.infer<typeof goalCreateSchema>; 