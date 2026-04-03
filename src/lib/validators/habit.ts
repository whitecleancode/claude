import { z } from "zod";

export const habitSchema = z.object({
  name: z.string().min(1, "Название обязательно").max(100),
  description: z.string().max(500).optional().default(""),
  color: z.string().default("#06b6d4"),
  icon: z.string().default("check"),
  frequency: z
    .enum(["daily", "weekdays", "weekends", "custom"])
    .default("daily"),
  custom_days: z.array(z.number().min(1).max(7)).optional(),
});

export type HabitFormValues = z.infer<typeof habitSchema>;
