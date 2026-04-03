"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCreateHabit, useUpdateHabit } from "@/lib/hooks/use-habits";
import { habitSchema, type HabitFormValues } from "@/lib/validators/habit";
import { HABIT_COLORS } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/cn";
import type { Habit } from "@/types/habits";

interface HabitFormProps {
  isOpen: boolean;
  onClose: () => void;
  habit?: Habit | null;
}

const frequencyOptions = [
  { value: "daily", label: "Каждый день" },
  { value: "weekdays", label: "Будни" },
  { value: "weekends", label: "Выходные" },
  { value: "custom", label: "Выбрать дни" },
];

const weekDays = [
  { value: 1, label: "Пн" },
  { value: 2, label: "Вт" },
  { value: 3, label: "Ср" },
  { value: 4, label: "Чт" },
  { value: 5, label: "Пт" },
  { value: 6, label: "Сб" },
  { value: 7, label: "Вс" },
];

export function HabitForm({ isOpen, onClose, habit }: HabitFormProps) {
  const createHabit = useCreateHabit();
  const updateHabit = useUpdateHabit();
  const isEdit = !!habit;

  const [color, setColor] = useState(habit?.color ?? "#06b6d4");
  const [frequency, setFrequency] = useState(habit?.frequency ?? "daily");
  const [customDays, setCustomDays] = useState<number[]>(
    habit?.custom_days ?? []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const values: HabitFormValues = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || "",
      color,
      icon: "check",
      frequency: frequency as HabitFormValues["frequency"],
      custom_days: frequency === "custom" ? customDays : undefined,
    };

    const result = habitSchema.safeParse(values);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        errs[i.path[0] as string] = i.message;
      });
      setErrors(errs);
      return;
    }

    if (isEdit) {
      await updateHabit.mutateAsync({ ...result.data, id: habit.id });
    } else {
      await createHabit.mutateAsync(result.data);
    }
    onClose();
  };

  const toggleDay = (day: number) => {
    setCustomDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Редактировать привычку" : "Новая привычка"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="name"
          name="name"
          label="Название"
          placeholder="Например: Зарядка"
          defaultValue={habit?.name}
          error={errors.name}
        />

        <Textarea
          id="description"
          name="description"
          label="Описание"
          placeholder="Необязательно"
          defaultValue={habit?.description ?? ""}
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-300">
            Цвет
          </label>
          <div className="flex gap-2">
            {HABIT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={cn(
                  "h-8 w-8 rounded-full border-2 transition-all cursor-pointer",
                  color === c
                    ? "border-white scale-110"
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <Select
          id="frequency"
          label="Частота"
          options={frequencyOptions}
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as "daily" | "weekdays" | "weekends" | "custom")}
        />

        {frequency === "custom" && (
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300">
              Дни недели
            </label>
            <div className="flex gap-1.5">
              {weekDays.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => toggleDay(d.value)}
                  className={cn(
                    "h-9 w-9 rounded-lg text-xs font-medium border transition-all cursor-pointer",
                    customDays.includes(d.value)
                      ? "bg-neon-cyan/20 border-neon-cyan/50 text-neon-cyan"
                      : "border-white/10 text-slate-400 hover:border-white/20"
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        )}

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
            loading={createHabit.isPending || updateHabit.isPending}
          >
            {isEdit ? "Сохранить" : "Создать"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
