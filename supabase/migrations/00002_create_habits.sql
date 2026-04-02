-- ===========================================
-- Habits table
-- ===========================================

CREATE TABLE public.habits (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  color       TEXT NOT NULL DEFAULT '#06b6d4',
  icon        TEXT NOT NULL DEFAULT 'check',
  frequency   TEXT NOT NULL DEFAULT 'daily'
              CHECK (frequency IN ('daily', 'weekdays', 'weekends', 'custom')),
  custom_days INT[],
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_habits_user ON habits(user_id);

ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "habits_select" ON habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "habits_insert" ON habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "habits_update" ON habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "habits_delete" ON habits FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON habits
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ===========================================
-- Habit Logs table (daily completions)
-- ===========================================

CREATE TABLE public.habit_logs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id       UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL,
  note           TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (habit_id, completed_date)
);

CREATE INDEX idx_habit_logs_user_date ON habit_logs(user_id, completed_date);
CREATE INDEX idx_habit_logs_habit ON habit_logs(habit_id);

ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "habit_logs_select" ON habit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "habit_logs_insert" ON habit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "habit_logs_delete" ON habit_logs FOR DELETE USING (auth.uid() = user_id);
