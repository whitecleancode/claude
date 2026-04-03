import type { Database } from "@/lib/supabase/types";

export type Habit = Database["public"]["Tables"]["habits"]["Row"];
export type HabitInsert = Database["public"]["Tables"]["habits"]["Insert"];
export type HabitUpdate = Database["public"]["Tables"]["habits"]["Update"];

export type HabitLog = Database["public"]["Tables"]["habit_logs"]["Row"];
export type HabitLogInsert = Database["public"]["Tables"]["habit_logs"]["Insert"];

export interface HabitWithStats extends Habit {
  currentStreak: number;
  completedToday: boolean;
  completionRate7d: number;
}
