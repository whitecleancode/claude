import type { Database } from "@/lib/supabase/types";

export type NutritionLog = Database["public"]["Tables"]["nutrition_logs"]["Row"];
export type NutritionLogInsert = Database["public"]["Tables"]["nutrition_logs"]["Insert"];
export type NutritionLogUpdate = Database["public"]["Tables"]["nutrition_logs"]["Update"];

export type NutritionGoal = Database["public"]["Tables"]["nutrition_goals"]["Row"];
export type NutritionGoalInsert = Database["public"]["Tables"]["nutrition_goals"]["Insert"];
export type NutritionGoalUpdate = Database["public"]["Tables"]["nutrition_goals"]["Update"];

export type MealType = NutritionLog["meal_type"];

export interface DailySummary {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}
