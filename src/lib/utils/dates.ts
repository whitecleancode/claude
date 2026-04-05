import { format, subDays, eachDayOfInterval, startOfMonth, endOfMonth, isToday as dateFnsIsToday } from "date-fns";
import { ru } from "date-fns/locale";

export function formatDate(date: Date | string, pattern = "d MMM yyyy"): string {
  return format(new Date(date), pattern, { locale: ru });
}

export function toDateString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function isToday(date: Date | string): boolean {
  return dateFnsIsToday(new Date(date));
}

export function getLast7Days(from: Date = new Date()): Date[] {
  return Array.from({ length: 7 }, (_, i) => subDays(from, 6 - i));
}

export function getMonthDays(date: Date): Date[] {
  return eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });
}

export function calculateStreak(
  completedDates: string[],
  today: Date = new Date()
): number {
  if (completedDates.length === 0) return 0;

  const sorted = [...completedDates].sort().reverse();
  const todayStr = toDateString(today);
  const yesterdayStr = toDateString(subDays(today, 1));

  // Streak must include today or yesterday
  if (sorted[0] !== todayStr && sorted[0] !== yesterdayStr) return 0;

  let streak = 0;
  let checkDate = sorted[0] === todayStr ? today : subDays(today, 1);

  for (const dateStr of sorted) {
    const expected = toDateString(checkDate);
    if (dateStr === expected) {
      streak++;
      checkDate = subDays(checkDate, 1);
    } else if (dateStr < expected) {
      break;
    }
  }

  return streak;
}

export function calculateBestStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;

  const sorted = [...new Set(completedDates)].sort();
  let best = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86400000);

    if (diffDays === 1) {
      current++;
      if (current > best) best = current;
    } else {
      current = 1;
    }
  }

  return best;
}

export function getCompletionRate(
  completedDates: string[],
  totalDays: number
): number {
  if (totalDays === 0) return 0;
  return Math.round((completedDates.length / totalDays) * 100);
}
