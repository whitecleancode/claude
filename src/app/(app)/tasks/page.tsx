"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { isPast, isToday } from "date-fns";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton";
import { TaskCard } from "@/components/features/tasks/task-card";
import { TaskFiltersBar } from "@/components/features/tasks/task-filters";
import { TaskForm } from "@/components/features/tasks/task-form";
import { OverdueBanner } from "@/components/features/tasks/overdue-banner";
import { useTasks, useTaskCategories } from "@/lib/hooks/use-tasks";
import type { Task, TaskFilters, TaskSort } from "@/types/tasks";

const PRIORITY_ORDER: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };

function sortTasks(tasks: Task[], sort: TaskSort): Task[] {
  return [...tasks].sort((a, b) => {
    switch (sort) {
      case "priority":
        return (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9);
      case "due_date":
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      case "created_at":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "alphabetical":
        return a.title.localeCompare(b.title, "ru");
      default:
        return 0;
    }
  });
}

export default function TasksPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({
    status: "all",
    priority: "all",
    sort: "priority",
  });

  const { data: tasks, isLoading, error } = useTasks(filters);
  const { data: categories } = useTaskCategories();

  const overdueCount = useMemo(() => {
    if (!tasks) return 0;
    return tasks.filter((t) => {
      if (t.status === "done" || t.status === "cancelled") return false;
      if (!t.due_date) return false;
      return isPast(new Date(t.due_date)) && !isToday(new Date(t.due_date));
    }).length;
  }, [tasks]);

  const sortedTasks = useMemo(() => {
    if (!tasks) return undefined;
    return sortTasks(tasks, filters.sort ?? "priority");
  }, [tasks, filters.sort]);

  const handleEdit = (task: Task) => {
    setEditTask(task);
    setFormOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setEditTask(null);
  };

  const showOverdue = () => {
    setFilters({ status: "all", priority: "all", sort: "due_date" });
  };

  return (
    <>
      <Topbar title="Задачи" />
      <div className="p-4 lg:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            {error ? "Ошибка загрузки" : tasks ? `${tasks.length} задач` : "Загрузка..."}
          </p>
          <Button size="sm" onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Добавить
          </Button>
        </div>

        <OverdueBanner count={overdueCount} onClick={showOverdue} />
        <TaskFiltersBar filters={filters} onChange={setFilters} />

        {isLoading && (
          <div className="space-y-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {sortedTasks && sortedTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 mb-4">Задач не найдено</p>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4" />
              Создать задачу
            </Button>
          </div>
        )}

        {sortedTasks && sortedTasks.length > 0 && (
          <div className="space-y-2">
            {sortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                category={categories?.find((c) => c.id === task.category_id)}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      <TaskForm
        isOpen={formOpen}
        onClose={handleClose}
        task={editTask}
      />
    </>
  );
}
