"use client";

import { useState, useRef, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCreateNutritionLog, useUpdateNutritionLog } from "@/lib/hooks/use-nutrition";
import { nutritionLogSchema } from "@/lib/validators/nutrition";
import { useFoodSearch, type FoodResult } from "@/lib/hooks/use-food-search";
import { Search, Loader2 } from "lucide-react";
import type { MealType, NutritionLog } from "@/types/nutrition";

interface MealLogFormProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  defaultMealType?: MealType;
  editEntry?: NutritionLog | null;
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
  editEntry = null,
}: MealLogFormProps) {
  const create = useCreateNutritionLog();
  const update = useUpdateNutritionLog();
  const isEdit = !!editEntry;

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nameQuery, setNameQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [calories, setCalories] = useState("0");
  const [protein, setProtein] = useState("0");
  const [fat, setFat] = useState("0");
  const [carbs, setCarbs] = useState("0");
  const [grams, setGrams] = useState("100");
  const [basePer100, setBasePer100] = useState<FoodResult | null>(null);
  const [mealType, setMealType] = useState<string>(defaultMealType);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { results, isLoading } = useFoodSearch(nameQuery);

  // Pre-fill when editing
  useEffect(() => {
    if (editEntry) {
      setNameQuery(editEntry.name);
      setCalories(String(editEntry.calories));
      setProtein(String(editEntry.protein));
      setFat(String(editEntry.fat));
      setCarbs(String(editEntry.carbs));
      setMealType(editEntry.meal_type ?? defaultMealType);
    } else {
      resetForm();
    }
  }, [editEntry, defaultMealType]);

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
    setBasePer100(food);
    setGrams("100");
    setCalories(String(food.calories));
    setProtein(String(food.protein));
    setFat(String(food.fat));
    setCarbs(String(food.carbs));
    setShowDropdown(false);
  };

  const handleGramsChange = (g: string) => {
    setGrams(g);
    if (basePer100 && g) {
      const ratio = Number(g) / 100;
      setCalories(String(Math.round(basePer100.calories * ratio)));
      setProtein(String(Math.round(basePer100.protein * ratio * 10) / 10));
      setFat(String(Math.round(basePer100.fat * ratio * 10) / 10));
      setCarbs(String(Math.round(basePer100.carbs * ratio * 10) / 10));
    }
  };

  const resetForm = () => {
    setNameQuery("");
    setCalories("0");
    setProtein("0");
    setFat("0");
    setCarbs("0");
    setGrams("100");
    setBasePer100(null);
    setMealType(defaultMealType);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const values = {
      name: nameQuery,
      meal_type: mealType,
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

    if (isEdit) {
      await update.mutateAsync({ ...result.data, id: editEntry.id });
    } else {
      await create.mutateAsync(result.data);
    }
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isEdit ? "Редактировать запись" : "Добавить приём пищи"}>
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
            <div className="absolute z-50 mt-1 w-full rounded-lg border border-white/10 bg-surface-secondary shadow-lg overflow-hidden max-h-60 overflow-y-auto">
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
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
        />

        <Input
          id="grams"
          name="grams"
          type="number"
          label={`Порция (г)${basePer100 ? " — авто-пересчёт БЖУ" : ""}`}
          placeholder="100"
          value={grams}
          onChange={(e) => handleGramsChange(e.target.value)}
          min="1"
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
          <Button type="submit" className="flex-1" loading={create.isPending || update.isPending}>
            {isEdit ? "Сохранить" : "Добавить"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
