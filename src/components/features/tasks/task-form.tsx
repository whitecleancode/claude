"use client";

import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { useCreateTask, useUpdateTask, useTaskCategories } from "@/lib/hooks/use-tasks";
import { taskSchema } from "@/lib/validators/task";
import { useState } from "react";
import type { Task } from "@/types/tasks";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
}

const priorityOptions = [
  { value: "low", label: "Низкий" },
  { value: "medium", label: "Средний" },
  { value: "high", label: "Высокий" },
  { value: "urgent", label: "Срочный" },
];

const statusOptions = [
  { value: "todo", label: "К выполнению" },
  { value: "in_progress", label: "В работе" },
  { value: "done", label: "Готово" },
  { value: "cancelled", label: "Отменено" },
];

export function TaskForm({ isOpen, onClose, task }: TaskFormProps) {
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const { data: categories } = useTaskCategories();
  const isEdit = !!task;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoryOptions = [
    { value: "", label: "Без категории" },
    ...(categories?.map((c) => ({ value: c.id, label: c.name })) ?? []),
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const fd = new FormData(e.currentTarget);
    const values = {
      title: fd.get("title") as string,
      description: (fd.get("description") as string) || "",
      priority: fd.get("priority") as string,
      status: fd.get("status") as string,
      category_id: (fd.get("category_id") as string) || null,
      due_date: (fd.get("due_date") as string) || null,
    };

    const result = taskSchema.safeParse(values);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        errs[i.path[0] as string] = i.message;
      });
      setErrors(errs);
      return;
    }

    if (isEdit) {
      await updateTask.mutateAsync({ ...result.data, id: task.id });
    } else {
      await createTask.mutateAsync(result.data);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Редактировать задачу" : "Новая задача"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="title"
          name="title"
          label="Название"
          placeholder="Что нужно сделать?"
          defaultValue={task?.title}
          error={errors.title}
        />

        <Textarea
          id="description"
          name="description"
          label="Описание"
          placeholder="Подробности (необязательно)"
          defaultValue={task?.description ?? ""}
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            id="priority"
            name="priority"
            label="Приоритет"
            options={priorityOptions}
            defaultValue={task?.priority ?? "medium"}
          />
          <Select
            id="status"
            name="status"
            label="Статус"
            options={statusOptions}
            defaultValue={task?.status ?? "todo"}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            id="category_id"
            name="category_id"
            label="Категория"
            options={categoryOptions}
            defaultValue={task?.category_id ?? ""}
          />
          <DatePicker
            id="due_date"
            name="due_date"
            label="Дедлайн"
            defaultValue={task?.due_date ?? ""}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            onClick={onClose}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            className="flex-1"
            loading={createTask.isPending || updateTask.isPending}
          >
            {isEdit ? "Сохранить" : "Создать"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
