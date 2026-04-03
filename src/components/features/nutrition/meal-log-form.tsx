"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCreateNutritionLog } from "@/lib/hooks/use-nutrition";
import { nutritionLogSchema } from "@/lib/validators/nutrition";
import type { MealType } from "@/types/nutrition";

interface MealLogFormProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  defaultMealType?: MealType;
}

const mealTypeOptions = [
  { value: "breakfast", label: "Завтрак" },
  { value: "lunch", label: "Обед" },
  { value: "dinner", label: "Ужин" },
  { value: "snack", label: "Перекус" },
];

export function MealLogForm({
  isOpen,
  onClose,
  date,
  defaultMealType = "snack",
}: MealLogFormProps) {
  const create = useCreateNutritionLog();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const fd = new FormData(e.currentTarget);
    const values = {
      name: fd.get("name") as string,
      meal_type: fd.get("meal_type") as string,
      logged_date: date,
      calories: fd.get("calories") as string,
      protein: fd.get("protein") as string,
      fat: fd.get("fat") as string,
      carbs: fd.get("carbs") as string,
    };

    const result = nutritionLogSchema.safeParse(values);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        errs[i.path[0] as string] = i.message;
      });
      setErrors(errs);
      return;
    }

    await create.mutateAsync(result.data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Добавить приём пищи">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="name"
          name="name"
          label="Название"
          placeholder="Куриная грудка 200г"
          error={errors.name}
        />

        <Select
          id="meal_type"
          name="meal_type"
          label="Приём пищи"
          options={mealTypeOptions}
          defaultValue={defaultMealType}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="calories"
            name="calories"
            type="number"
            label="Калории (ккал)"
            placeholder="0"
            defaultValue="0"
            error={errors.calories}
          />
          <Input
            id="protein"
            name="protein"
            type="number"
            label="Белки (г)"
            placeholder="0"
            defaultValue="0"
            step="0.1"
            error={errors.protein}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="fat"
            name="fat"
            type="number"
            label="Жиры (г)"
            placeholder="0"
            defaultValue="0"
            step="0.1"
            error={errors.fat}
          />
          <Input
            id="carbs"
            name="carbs"
            type="number"
            label="Углеводы (г)"
            placeholder="0"
            defaultValue="0"
            step="0.1"
            error={errors.carbs}
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
          <Button type="submit" className="flex-1" loading={create.isPending}>
            Добавить
          </Button>
        </div>
      </form>
    </Modal>
  );
}
