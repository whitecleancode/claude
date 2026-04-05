"use client";

import { useState, useEffect } from "react";
import { format, isPast, isToday as isDateToday } from "date-fns";
import { ru } from "date-fns/locale";
import { Check, Calendar, Trash2, Loader2, ListChecks, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Card } from "@/components/ui/card";
import { PriorityBadge } from "./priority-badge";
import { useCompleteTask, useDeleteTask } from "@/lib/hooks/use-tasks";
import { getSubtasks, addSubtask, toggleSubtask, removeSubtask, type Subtask } from "@/lib/utils/subtasks";
import type { Task, TaskCategory } from "@/types/tasks";

interface TaskCardProps {
  task: Task;
  category?: TaskCategory | null;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, category, onEdit }: TaskCardProps) {
  const complete = useCompleteTask();
  const deleteTask = useDeleteTask();
  const isDone = task.status === "done";
  const isOverdue =
    task.due_date && !isDone && isPast(new Date(task.due_date)) && !isDateToday(new Date(task.due_date));

  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");

  useEffect(() => {
    setSubtasks(getSubtasks(task.id));
  }, [task.id]);

  const doneCount = subtasks.filter((s) => s.done).length;

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks(addSubtask(task.id, newSubtask.trim()));
    setNewSubtask("");
  };

  return (
    <Card
      hoverable
      className={cn("p-4 group", isDone && "opacity-60")}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => complete.mutate({ id: task.id, done: !isDone })}
          disabled={complete.isPending}
          className={cn(
            "mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-all cursor-pointer disabled:opacity-50",
            isDone
              ? "bg-neon-green border-neon-green"
              : "border-white/20 hover:border-neon-cyan"
          )}
        >
          {complete.isPending ? (
            <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
          ) : isDone ? (
            <Check className="h-3 w-3 text-slate-950" />
          ) : null}
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
            {subtasks.length > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setShowSubtasks(!showSubtasks); }}
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-neon-cyan transition-colors cursor-pointer"
              >
                <ListChecks className="h-3 w-3" />
                {doneCount}/{subtasks.length}
              </button>
            )}
            {subtasks.length === 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setShowSubtasks(!showSubtasks); }}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
              >
                <ListChecks className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => deleteTask.mutate(task.id)}
          disabled={deleteTask.isPending}
          className="p-1 rounded opacity-100 lg:opacity-0 lg:group-hover:opacity-100 hover:bg-white/10 transition-all cursor-pointer shrink-0 disabled:opacity-50"
        >
          {deleteTask.isPending ? (
            <Loader2 className="h-3.5 w-3.5 text-slate-400 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5 text-slate-400" />
          )}
        </button>
      </div>

      {/* Subtasks */}
      {showSubtasks && (
        <div className="mt-3 pl-8 space-y-1.5">
          {subtasks.map((sub) => (
            <div key={sub.id} className="flex items-center gap-2 group/sub">
              <button
                onClick={() => setSubtasks(toggleSubtask(task.id, sub.id))}
                className={cn(
                  "h-4 w-4 rounded border flex items-center justify-center shrink-0 cursor-pointer transition-all",
                  sub.done ? "bg-neon-green/80 border-neon-green/80" : "border-white/20"
                )}
              >
                {sub.done && <Check className="h-2.5 w-2.5 text-slate-950" />}
              </button>
              <span className={cn("text-xs flex-1", sub.done && "line-through text-slate-500")}>{sub.text}</span>
              <button
                onClick={() => setSubtasks(removeSubtask(task.id, sub.id))}
                className="opacity-0 group-hover/sub:opacity-100 cursor-pointer p-0.5"
              >
                <X className="h-3 w-3 text-slate-500" />
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddSubtask()}
              placeholder="Добавить подзадачу..."
              className="flex-1 text-xs bg-transparent border-b border-white/10 py-1 outline-none focus:border-neon-cyan/50 text-slate-300 placeholder:text-slate-600"
            />
            <button onClick={handleAddSubtask} className="cursor-pointer p-0.5">
              <Plus className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
