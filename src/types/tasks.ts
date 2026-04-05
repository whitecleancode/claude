import type { Database } from "@/lib/supabase/types";

export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
export type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"];

export type TaskCategory = Database["public"]["Tables"]["task_categories"]["Row"];
export type TaskCategoryInsert = Database["public"]["Tables"]["task_categories"]["Insert"];

export type TaskPriority = Task["priority"];
export type TaskStatus = Task["status"];

export type TaskSort = "priority" | "due_date" | "created_at" | "alphabetical";

export interface TaskFilters {
  status?: TaskStatus | "all";
  priority?: TaskPriority | "all";
  categoryId?: string | null;
  search?: string;
  sort?: TaskSort;
}
