import { z } from "zod";

export const nutritionLogSchema = z.object({
  name: z.string().min(1, "Название обязательно").max(200),
  meal_type: z.enum(["breakfast", "lunch", "dinner", "snack"]).default("snack"),
  logged_date: z.string().optional(),
  calories: z.coerce.number().min(0, "Не может быть отрицательным").default(0),
  protein: z.coerce.number().min(0).default(0),
  fat: z.coerce.number().min(0).default(0),
  carbs: z.coerce.number().min(0).default(0),
});

export const nutritionGoalSchema = z.object({
  calories_target: z.coerce.number().min(0).default(2000),
  protein_target: z.coerce.number().min(0).default(150),
  fat_target: z.coerce.number().min(0).default(65),
  carbs_target: z.coerce.number().min(0).default(250),
});

export type NutritionLogFormValues = z.infer<typeof nutritionLogSchema>;
export type NutritionGoalFormValues = z.infer<typeof nutritionGoalSchema>;
