"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateNutritionGoal } from "@/lib/hooks/use-nutrition";
import { nutritionGoalSchema } from "@/lib/validators/nutrition";
import type { NutritionGoal } from "@/types/nutrition";

interface GoalsFormProps {
  isOpen: boolean;
  onClose: () => void;
  current: NutritionGoal | null;
}

export function GoalsForm({ isOpen, onClose, current }: GoalsFormProps) {
  const update = useUpdateNutritionGoal();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const fd = new FormData(e.currentTarget);
    const values = {
      calories_target: fd.get("calories_target") as string,
      protein_target: fd.get("protein_target") as string,
      fat_target: fd.get("fat_target") as string,
      carbs_target: fd.get("carbs_target") as string,
    };

    const result = nutritionGoalSchema.safeParse(values);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        errs[i.path[0] as string] = i.message;
      });
      setErrors(errs);
      return;
    }

    await update.mutateAsync(result.data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Цели по питанию">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="calories_target"
          name="calories_target"
          type="number"
          label="Калории (ккал/день)"
          defaultValue={current?.calories_target ?? 2000}
          error={errors.calories_target}
        />
        <Input
          id="protein_target"
          name="protein_target"
          type="number"
          label="Белки (г/день)"
          defaultValue={current?.protein_target ?? 150}
          step="0.1"
          error={errors.protein_target}
        />
        <Input
          id="fat_target"
          name="fat_target"
          type="number"
          label="Жиры (г/день)"
          defaultValue={current?.fat_target ?? 65}
          step="0.1"
          error={errors.fat_target}
        />
        <Input
          id="carbs_target"
          name="carbs_target"
          type="number"
          label="Углеводы (г/день)"
          defaultValue={current?.carbs_target ?? 250}
          step="0.1"
          error={errors.carbs_target}
        />

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            onClick={onClose}
          >
            Отмена
          </Button>
          <Button type="submit" className="flex-1" loading={update.isPending}>
            Сохранить
          </Button>
        </div>
      </form>
    </Modal>
  );
}
