-- ===========================================
-- Nutrition Goals table
-- ===========================================

CREATE TABLE public.nutrition_goals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  calories_target INT NOT NULL DEFAULT 2000,
  protein_target  NUMERIC(6,1) NOT NULL DEFAULT 150.0,
  fat_target      NUMERIC(6,1) NOT NULL DEFAULT 65.0,
  carbs_target    NUMERIC(6,1) NOT NULL DEFAULT 250.0,
  effective_from  DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, effective_from)
);

ALTER TABLE public.nutrition_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nutrition_goals_select" ON nutrition_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "nutrition_goals_insert" ON nutrition_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "nutrition_goals_update" ON nutrition_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "nutrition_goals_delete" ON nutrition_goals FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON nutrition_goals
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ===========================================
-- Nutrition Logs table
-- ===========================================

CREATE TABLE public.nutrition_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type   TEXT NOT NULL DEFAULT 'snack'
              CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  name        TEXT NOT NULL,
  calories    INT NOT NULL DEFAULT 0,
  protein     NUMERIC(6,1) NOT NULL DEFAULT 0,
  fat         NUMERIC(6,1) NOT NULL DEFAULT 0,
  carbs       NUMERIC(6,1) NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_nutrition_logs_user_date ON nutrition_logs(user_id, logged_date);

ALTER TABLE public.nutrition_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nutrition_logs_select" ON nutrition_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "nutrition_logs_insert" ON nutrition_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "nutrition_logs_update" ON nutrition_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "nutrition_logs_delete" ON nutrition_logs FOR DELETE USING (auth.uid() = user_id);
