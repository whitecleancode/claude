import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Название обязательно").max(200),
  description: z.string().max(2000).optional().default(""),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  status: z.enum(["todo", "in_progress", "done", "cancelled"]).default("todo"),
  category_id: z.string().uuid().nullable().optional(),
  due_date: z.string().nullable().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Название обязательно").max(50),
  color: z.string().default("#a855f7"),
  icon: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
export type CategoryFormValues = z.infer<typeof categorySchema>;
