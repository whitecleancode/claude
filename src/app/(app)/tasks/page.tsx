"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton";
import { TaskCard } from "@/components/features/tasks/task-card";
import { TaskFiltersBar } from "@/components/features/tasks/task-filters";
import { TaskForm } from "@/components/features/tasks/task-form";
import { useTasks, useTaskCategories } from "@/lib/hooks/use-tasks";
import type { Task, TaskFilters } from "@/types/tasks";

export default function TasksPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({
    status: "all",
    priority: "all",
  });

  const { data: tasks, isLoading } = useTasks(filters);
  const { data: categories } = useTaskCategories();

  const handleEdit = (task: Task) => {
    setEditTask(task);
    setFormOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setEditTask(null);
  };

  return (
    <>
      <Topbar title="Задачи" />
      <div className="p-4 lg:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            {tasks ? `${tasks.length} задач` : "Загрузка..."}
          </p>
          <Button size="sm" onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Добавить
          </Button>
        </div>

        <TaskFiltersBar filters={filters} onChange={setFilters} />

        {isLoading && (
          <div className="space-y-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {tasks && tasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 mb-4">Задач не найдено</p>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4" />
              Создать задачу
            </Button>
          </div>
        )}

        {tasks && tasks.length > 0 && (
          <div className="space-y-2">
            {tasks.map((task) => (
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
