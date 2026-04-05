"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { NutritionLog, NutritionGoal, DailySummary } from "@/types/nutrition";
import type { NutritionLogFormValues, NutritionGoalFormValues } from "@/lib/validators/nutrition";

function getSupabase() {
  return createClient();
}

export function useNutritionLogs(date: string) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["nutrition_logs", user?.id, date],
    queryFn: async (): Promise<NutritionLog[]> => {
      const { data, error } = await getSupabase()
        .from("nutrition_logs")
        .select("*")
        .eq("logged_date", date)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useNutritionGoal() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["nutrition_goal", user?.id],
    queryFn: async (): Promise<NutritionGoal | null> => {
      const { data, error } = await getSupabase()
        .from("nutrition_goals")
        .select("*")
        .order("effective_from", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useDailySummary(logs: NutritionLog[] | undefined): DailySummary {
  if (!logs || logs.length === 0) {
    return { calories: 0, protein: 0, fat: 0, carbs: 0 };
  }
  return logs.reduce(
    (acc, log) => ({
      calories: acc.calories + log.calories,
      protein: acc.protein + Number(log.protein),
      fat: acc.fat + Number(log.fat),
      carbs: acc.carbs + Number(log.carbs),
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );
}

export function useCreateNutritionLog() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (values: NutritionLogFormValues) => {
      const { data, error } = await getSupabase()
        .from("nutrition_logs")
        .insert({ ...values, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutrition_logs"] });
    },
  });
}

export function useUpdateNutritionLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...values }: NutritionLogFormValues & { id: string }) => {
      const { data, error } = await getSupabase()
        .from("nutrition_logs")
        .update(values)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutrition_logs"] });
    },
  });
}

export function useDeleteNutritionLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await getSupabase()
        .from("nutrition_logs")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutrition_logs"] });
    },
  });
}

export function useCopyMealToToday() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (logs: NutritionLog[]) => {
      const today = new Date().toISOString().split("T")[0];
      const inserts = logs.map((log) => ({
        name: log.name,
        meal_type: log.meal_type,
        calories: log.calories,
        protein: log.protein,
        fat: log.fat,
        carbs: log.carbs,
        logged_date: today,
        user_id: user!.id,
      }));
      const { error } = await getSupabase()
        .from("nutrition_logs")
        .insert(inserts);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutrition_logs"] });
    },
  });
}

export function useWeeklyNutritionLogs() {
  const { user } = useAuthStore();
  const today = new Date();
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }

  return useQuery({
    queryKey: ["nutrition_logs_weekly", user?.id, dates[0]],
    queryFn: async (): Promise<NutritionLog[]> => {
      const { data, error } = await getSupabase()
        .from("nutrition_logs")
        .select("*")
        .gte("logged_date", dates[0])
        .lte("logged_date", dates[6]);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useUpdateNutritionGoal() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (values: NutritionGoalFormValues) => {
      // Upsert: update existing or create new
      const { data: existing } = await getSupabase()
        .from("nutrition_goals")
        .select("id")
        .order("effective_from", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing) {
        const { data, error } = await getSupabase()
          .from("nutrition_goals")
          .update(values)
          .eq("id", existing.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await getSupabase()
          .from("nutrition_goals")
          .insert({ ...values, user_id: user!.id })
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutrition_goal"] });
    },
  });
}
