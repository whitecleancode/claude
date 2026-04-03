"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { Task, TaskCategory, TaskFilters } from "@/types/tasks";
import type { TaskFormValues, CategoryFormValues } from "@/lib/validators/task";

function getSupabase() {
  return createClient();
}

export function useTasks(filters?: TaskFilters) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["tasks", user?.id, filters],
    queryFn: async (): Promise<Task[]> => {
      let query = getSupabase().from("tasks").select("*");

      if (filters?.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }
      if (filters?.priority && filters.priority !== "all") {
        query = query.eq("priority", filters.priority);
      }
      if (filters?.categoryId) {
        query = query.eq("category_id", filters.categoryId);
      }
      if (filters?.search) {
        query = query.ilike("title", `%${filters.search}%`);
      }

      const { data, error } = await query.order("sort_order").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useTaskCategories() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["task_categories", user?.id],
    queryFn: async (): Promise<TaskCategory[]> => {
      const { data, error } = await getSupabase()
        .from("task_categories")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (values: TaskFormValues) => {
      const { data, error } = await getSupabase()
        .from("tasks")
        .insert({ ...values, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...values
    }: Partial<TaskFormValues> & { id: string; completed_at?: string | null }) => {
      const { data, error } = await getSupabase()
        .from("tasks")
        .update(values)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, done }: { id: string; done: boolean }) => {
      const { error } = await getSupabase()
        .from("tasks")
        .update({
          status: done ? "done" : "todo",
          completed_at: done ? new Date().toISOString() : null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await getSupabase()
        .from("tasks")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      const { data, error } = await getSupabase()
        .from("task_categories")
        .insert({ ...values, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task_categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await getSupabase()
        .from("task_categories")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task_categories"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
