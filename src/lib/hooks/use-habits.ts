"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import { toDateString, getLast7Days, calculateStreak } from "@/lib/utils/dates";
import type { Habit, HabitLog, HabitWithStats } from "@/types/habits";
import type { HabitFormValues } from "@/lib/validators/habit";

function getSupabase() {
  return createClient();
}

export function useHabits() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["habits", user?.id],
    queryFn: async (): Promise<Habit[]> => {
      const { data, error } = await getSupabase()
        .from("habits")
        .select("*")
        .eq("is_archived", false)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useHabitLogs(startDate: string, endDate: string) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["habit_logs", user?.id, startDate, endDate],
    queryFn: async (): Promise<HabitLog[]> => {
      const { data, error } = await getSupabase()
        .from("habit_logs")
        .select("*")
        .gte("completed_date", startDate)
        .lte("completed_date", endDate);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useHabitsWithStats(): {
  data: HabitWithStats[] | undefined;
  isLoading: boolean;
  error: Error | null;
} {
  const { user } = useAuthStore();
  const today = new Date();
  const todayStr = toDateString(today);
  const days7 = getLast7Days(today);
  const startDate = toDateString(days7[0]);

  const habitsQuery = useHabits();
  const logsQuery = useHabitLogs(startDate, todayStr);

  const data =
    habitsQuery.data && logsQuery.data
      ? habitsQuery.data.map((habit): HabitWithStats => {
          const habitLogs = logsQuery.data.filter(
            (l) => l.habit_id === habit.id
          );
          const completedDates = habitLogs.map((l) => l.completed_date);
          const completedToday = completedDates.includes(todayStr);
          const currentStreak = calculateStreak(completedDates, today);
          const completionRate7d = Math.round(
            (completedDates.length / 7) * 100
          );

          return {
            ...habit,
            currentStreak,
            completedToday,
            completionRate7d,
          };
        })
      : undefined;

  return {
    data,
    isLoading: habitsQuery.isLoading || logsQuery.isLoading,
    error: habitsQuery.error || logsQuery.error,
  };
}

export function useHabitLogsForHabit(habitId: string, startDate: string, endDate: string) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["habit_logs", habitId, startDate, endDate],
    queryFn: async (): Promise<HabitLog[]> => {
      const { data, error } = await getSupabase()
        .from("habit_logs")
        .select("*")
        .eq("habit_id", habitId)
        .gte("completed_date", startDate)
        .lte("completed_date", endDate);
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!habitId,
  });
}

export function useArchivedHabits() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["habits_archived", user?.id],
    queryFn: async (): Promise<Habit[]> => {
      const { data, error } = await getSupabase()
        .from("habits")
        .select("*")
        .eq("is_archived", true)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useRestoreHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await getSupabase()
        .from("habits")
        .update({ is_archived: false })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["habits_archived"] });
    },
  });
}

export function useCreateHabit() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (values: HabitFormValues) => {
      const { data, error } = await getSupabase()
        .from("habits")
        .insert({ ...values, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

export function useUpdateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...values
    }: HabitFormValues & { id: string }) => {
      const { data, error } = await getSupabase()
        .from("habits")
        .update(values)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

export function useDeleteHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await getSupabase()
        .from("habits")
        .update({ is_archived: true })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

export function useToggleHabitLog() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async ({
      habitId,
      date,
      completed,
    }: {
      habitId: string;
      date: string;
      completed: boolean;
    }) => {
      if (completed) {
        // Remove log
        const { error } = await getSupabase()
          .from("habit_logs")
          .delete()
          .eq("habit_id", habitId)
          .eq("completed_date", date);
        if (error) throw error;
      } else {
        // Add log
        const { error } = await getSupabase()
          .from("habit_logs")
          .insert({ habit_id: habitId, user_id: user!.id, completed_date: date });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habit_logs"] });
    },
  });
}
