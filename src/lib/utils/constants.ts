import {
  LayoutDashboard,
  Target,
  ListTodo,
  Utensils,
  Settings,
} from "lucide-react";

export const NAV_ITEMS = [
  { label: "Дашборд", href: "/dashboard", icon: LayoutDashboard },
  { label: "Привычки", href: "/habits", icon: Target },
  { label: "Задачи", href: "/tasks", icon: ListTodo },
  { label: "Питание", href: "/nutrition", icon: Utensils },
  { label: "Настройки", href: "/settings", icon: Settings },
] as const;

export const PRIORITIES = {
  low: { label: "Низкий", color: "text-slate-400", bg: "bg-slate-400/10" },
  medium: { label: "Средний", color: "text-neon-cyan", bg: "bg-neon-cyan/10" },
  high: { label: "Высокий", color: "text-neon-amber", bg: "bg-neon-amber/10" },
  urgent: { label: "Срочный", color: "text-neon-pink", bg: "bg-neon-pink/10" },
} as const;

export const TASK_STATUSES = {
  todo: { label: "К выполнению" },
  in_progress: { label: "В работе" },
  done: { label: "Готово" },
  cancelled: { label: "Отменено" },
} as const;

export const MEAL_TYPES = {
  breakfast: { label: "Завтрак", icon: "☀️" },
  lunch: { label: "Обед", icon: "🌤️" },
  dinner: { label: "Ужин", icon: "🌙" },
  snack: { label: "Перекус", icon: "🍎" },
} as const;

export const HABIT_COLORS = [
  "#06b6d4",
  "#a855f7",
  "#ec4899",
  "#22c55e",
  "#f59e0b",
  "#3b82f6",
  "#ef4444",
  "#14b8a6",
] as const;
