"use client";

import { useState, useRef, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCreateNutritionLog } from "@/lib/hooks/use-nutrition";
import { nutritionLogSchema } from "@/lib/validators/nutrition";
import { useFoodSearch, type FoodResult } from "@/lib/hooks/use-food-search";
import { Search, Loader2 } from "lucide-react";
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
  const [nameQuery, setNameQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [calories, setCalories] = useState("0");
  const [protein, setProtein] = useState("0");
  const [fat, setFat] = useState("0");
  const [carbs, setCarbs] = useState("0");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { results, isLoading } = useFoodSearch(nameQuery);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Show dropdown when results appear
  useEffect(() => {
    if (results.length > 0) setShowDropdown(true);
  }, [results]);

  const selectFood = (food: FoodResult) => {
    setNameQuery(food.name);
    setCalories(String(food.calories));
    setProtein(String(food.protein));
    setFat(String(food.fat));
    setCarbs(String(food.carbs));
    setShowDropdown(false);
  };

  const resetForm = () => {
    setNameQuery("");
    setCalories("0");
    setProtein("0");
    setFat("0");
    setCarbs("0");
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const fd = new FormData(e.currentTarget);
    const values = {
      name: nameQuery,
      meal_type: fd.get("meal_type") as string,
      logged_date: date,
      calories,
      protein,
      fat,
      carbs,
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
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Добавить приём пищи">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Food name with auto-suggest */}
        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <Input
              id="name"
              name="name"
              label="Название продукта"
              placeholder="Начните вводить... (напр. курица)"
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              error={errors.name}
              autoComplete="off"
            />
            <div className="absolute right-3 top-[38px] text-slate-400">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </div>
          </div>

          {showDropdown && results.length > 0 && (
            <div className="absolute z-50 mt-1 w-full rounded-lg border border-white/10 bg-surface-secondary shadow-lg overflow-hidden">
              {results.map((food, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="w-full px-3 py-2.5 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                  onClick={() => selectFood(food)}
                >
                  <div className="text-sm font-medium text-foreground truncate">
                    {food.name}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {food.calories} ккал · Б {food.protein}г · Ж {food.fat}г · У {food.carbs}г
                    <span className="text-slate-500 ml-1">(на 100г)</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

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
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            error={errors.calories}
          />
          <Input
            id="protein"
            name="protein"
            type="number"
            label="Белки (г)"
            placeholder="0"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
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
            value={fat}
            onChange={(e) => setFat(e.target.value)}
            step="0.1"
            error={errors.fat}
          />
          <Input
            id="carbs"
            name="carbs"
            type="number"
            label="Углеводы (г)"
            placeholder="0"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            step="0.1"
            error={errors.carbs}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            onClick={handleClose}
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
