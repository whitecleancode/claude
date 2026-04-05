"use client";

import { Topbar } from "@/components/layout/topbar";
import { useAuthStore } from "@/lib/stores/auth-store";
import { HabitsWidget } from "@/components/features/dashboard/habits-widget";
import { TasksWidget } from "@/components/features/dashboard/tasks-widget";
import { NutritionWidget } from "@/components/features/dashboard/nutrition-widget";
import { WaterWidget } from "@/components/features/dashboard/water-widget";
import { WeeklyRadar } from "@/components/features/dashboard/weekly-radar";
import { DailyProgress } from "@/components/features/dashboard/daily-progress";
import { StreakCounter } from "@/components/features/dashboard/streak-counter";
import { MoodWidget } from "@/components/features/dashboard/mood-widget";
import { Confetti } from "@/components/ui/confetti";
import { useHabitsWithStats } from "@/lib/hooks/use-habits";

const QUOTES = [
  "Дисциплина — это выбор между тем, чего ты хочешь сейчас, и тем, чего ты хочешь больше всего.",
  "Маленькие ежедневные улучшения — ключ к потрясающим долгосрочным результатам.",
  "Не жди идеального момента. Возьми момент и сделай его идеальным.",
  "Привычки — это архитектура повседневной жизни.",
  "Успех — это сумма маленьких усилий, повторяемых день за днём.",
  "Ты не поднимешься до уровня своих целей. Ты упадёшь до уровня своих систем.",
  "Лучшее время посадить дерево было 20 лет назад. Второе лучшее — сейчас.",
  "Прогресс, а не совершенство.",
  "Один процент лучше каждый день — и через год ты в 37 раз лучше.",
  "Сложно — это не невозможно.",
  "Начни с малого, но начни.",
  "Каждый мастер когда-то был учеником.",
  "Последовательность побеждает интенсивность.",
  "Сегодняшние действия — завтрашние результаты.",
  "Мотивация приходит и уходит. Привычки остаются.",
  "Делай сегодня то, что другие не хотят. Завтра будешь жить так, как другие не могут.",
  "Путь в тысячу миль начинается с одного шага.",
  "Не сравнивай себя с другими. Сравнивай себя со вчерашним собой.",
  "Забота о себе — не эгоизм, а необходимость.",
  "Каждый день — новый шанс стать лучше.",
  "Твоё тело слышит всё, что говорит твой разум.",
  "Инвестируй в себя — это приносит лучшие дивиденды.",
  "Будь терпелив. Результаты приходят к тем, кто не сдаётся.",
  "Здоровье — это не всё, но без здоровья всё — ничто.",
  "Делай то, что можешь, с тем, что имеешь, там, где находишься.",
  "Сила не в том, чтобы никогда не падать, а в том, чтобы подниматься каждый раз.",
  "Цели без планов — просто мечты.",
  "Энергия идёт туда, куда направлено внимание.",
  "Будущее принадлежит тем, кто верит в красоту своих мечтаний.",
  "Самая трудная часть — это начать. Остальное проще.",
];

function getDailyQuote(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return QUOTES[dayOfYear % QUOTES.length];
}

export default function DashboardPage() {
  const { profile } = useAuthStore();
  const greeting = getGreeting();
  const quote = getDailyQuote();
  const { data: habits } = useHabitsWithStats();
  const allHabitsDone = habits && habits.length > 0 && habits.every((h) => h.completedToday);

  return (
    <>
      <Confetti trigger={!!allHabitsDone} />
      <Topbar title="Дашборд" />
      <div className="p-4 lg:p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold">
            {greeting},{" "}
            <span className="neon-text-cyan">
              {profile?.full_name ?? "друг"}
            </span>
          </h2>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400">
            {new Date().toLocaleDateString("ru-RU", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </span>
          <p className="text-sm text-slate-400 mt-3 italic max-w-lg">
            &ldquo;{quote}&rdquo;
          </p>
        </div>

        {/* Daily Progress */}
        <DailyProgress />

        {/* Streak Counter */}
        <StreakCounter />

        {/* Weekly Radar */}
        <WeeklyRadar />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <HabitsWidget />
          <TasksWidget />
          <WaterWidget />
          <NutritionWidget />
          <MoodWidget />
        </div>
      </div>
    </>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "Доброй ночи";
  if (hour < 12) return "Доброе утро";
  if (hour < 18) return "Добрый день";
  return "Добрый вечер";
}
