"use client";

import { format, isPast, isToday as isDateToday } from "date-fns";
import { ru } from "date-fns/locale";
import { Check, Calendar } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Card } from "@/components/ui/card";
import { PriorityBadge } from "./priority-badge";
import { useCompleteTask } from "@/lib/hooks/use-tasks";
import type { Task, TaskCategory } from "@/types/tasks";

interface TaskCardProps {
  task: Task;
  category?: TaskCategory | null;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, category, onEdit }: TaskCardProps) {
  const complete = useCompleteTask();
  const isDone = task.status === "done";
  const isOverdue =
    task.due_date && !isDone && isPast(new Date(task.due_date)) && !isDateToday(new Date(task.due_date));

  return (
    <Card
      hoverable
      className={cn("flex items-start gap-3 p-4", isDone && "opacity-60")}
    >
      <button
        onClick={() => complete.mutate({ id: task.id, done: !isDone })}
        className={cn(
          "mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-all cursor-pointer",
          isDone
            ? "bg-neon-green border-neon-green"
            : "border-white/20 hover:border-neon-cyan"
        )}
      >
        {isDone && <Check className="h-3 w-3 text-slate-950" />}
      </button>

      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => onEdit(task)}
      >
        <p
          className={cn(
            "font-medium text-sm",
            isDone && "line-through text-slate-500"
          )}
        >
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <PriorityBadge priority={task.priority} />
          {category && (
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: `${category.color}15`,
                color: category.color,
              }}
            >
              {category.name}
            </span>
          )}
          {task.due_date && (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs",
                isOverdue ? "text-neon-pink" : "text-slate-400"
              )}
            >
              <Calendar className="h-3 w-3" />
              {format(new Date(task.due_date), "d MMM", { locale: ru })}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
