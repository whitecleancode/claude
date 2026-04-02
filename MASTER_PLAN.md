# Life-OS — Master Plan

> Трекер привычек, задач и БЖУ с Neon Glassmorphism UI

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14+ (App Router), React, TypeScript |
| State | Zustand (client), React Query (cache/mutations) |
| Styles | Tailwind CSS, clsx, tailwind-merge, framer-motion |
| Validation | Zod |
| Backend | Supabase (Auth, Database, RLS) |
| Icons | lucide-react |
| Dates | date-fns |

---

## Схема базы данных

### 1. `profiles` (расширение auth.users)

```sql
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- RLS: auth.uid() = id (SELECT, INSERT, UPDATE)
-- Trigger: auto-create on auth.users INSERT
```

### 2. `habits`

```sql
CREATE TABLE public.habits (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  color       TEXT NOT NULL DEFAULT '#06b6d4',
  icon        TEXT NOT NULL DEFAULT 'check',
  frequency   TEXT NOT NULL DEFAULT 'daily'
              CHECK (frequency IN ('daily','weekdays','weekends','custom')),
  custom_days INT[],                -- ISO weekday: {1,3,5} = Пн/Ср/Пт
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- RLS: auth.uid() = user_id (ALL operations)
```

### 3. `habit_logs` (ежедневные отметки)

```sql
CREATE TABLE public.habit_logs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id       UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL,
  note           TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (habit_id, completed_date)
);
-- Индексы: (user_id, completed_date), (habit_id)
-- RLS: auth.uid() = user_id (SELECT, INSERT, DELETE)
```

### 4. `task_categories`

```sql
CREATE TABLE public.task_categories (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  color      TEXT NOT NULL DEFAULT '#a855f7',
  icon       TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- RLS: auth.uid() = user_id (ALL operations)
```

### 5. `tasks`

```sql
CREATE TABLE public.tasks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id  UUID REFERENCES task_categories(id) ON DELETE SET NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  priority     TEXT NOT NULL DEFAULT 'medium'
               CHECK (priority IN ('low','medium','high','urgent')),
  status       TEXT NOT NULL DEFAULT 'todo'
               CHECK (status IN ('todo','in_progress','done','cancelled')),
  due_date     DATE,
  completed_at TIMESTAMPTZ,
  sort_order   INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Индексы: (user_id), (user_id, status), (user_id, due_date), (category_id)
-- RLS: auth.uid() = user_id (ALL operations)
```

### 6. `nutrition_goals`

```sql
CREATE TABLE public.nutrition_goals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  calories_target INT NOT NULL DEFAULT 2000,
  protein_target  NUMERIC(6,1) NOT NULL DEFAULT 150.0,
  fat_target      NUMERIC(6,1) NOT NULL DEFAULT 65.0,
  carbs_target    NUMERIC(6,1) NOT NULL DEFAULT 250.0,
  effective_from  DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, effective_from)
);
-- RLS: auth.uid() = user_id (ALL operations)
```

### 7. `nutrition_logs`

```sql
CREATE TABLE public.nutrition_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type   TEXT NOT NULL DEFAULT 'snack'
              CHECK (meal_type IN ('breakfast','lunch','dinner','snack')),
  name        TEXT NOT NULL,
  calories    INT NOT NULL DEFAULT 0,
  protein     NUMERIC(6,1) NOT NULL DEFAULT 0,
  fat         NUMERIC(6,1) NOT NULL DEFAULT 0,
  carbs       NUMERIC(6,1) NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Индекс: (user_id, logged_date)
-- RLS: auth.uid() = user_id (ALL operations)
```

### Триггеры

- **`handle_new_user()`** — автосоздание профиля при регистрации
- **`set_updated_at()`** — обновление `updated_at` при UPDATE (profiles, habits, tasks, nutrition_goals)

---

## Структура проекта

```
src/
├── app/
│   ├── layout.tsx                  # Providers, шрифты, globals
│   ├── page.tsx                    # Redirect → dashboard или login
│   ├── globals.css                 # Tailwind + neon утилиты
│   ├── (auth)/
│   │   ├── layout.tsx              # Центрированный layout без sidebar
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── callback/route.ts      # OAuth callback
│   └── (app)/
│       ├── layout.tsx              # Sidebar + topbar + auth guard
│       ├── dashboard/page.tsx
│       ├── habits/page.tsx
│       ├── habits/[id]/page.tsx
│       ├── tasks/page.tsx
│       ├── nutrition/page.tsx
│       ├── nutrition/goals/page.tsx
│       └── settings/page.tsx
├── components/
│   ├── ui/                         # Атомарные: button, input, card, modal, skeleton...
│   ├── layout/                     # sidebar, topbar, nav-link, mobile-nav
│   └── features/
│       ├── auth/                   # login-form, signup-form, oauth-buttons
│       ├── habits/                 # habit-card, habit-form, habit-tracker, streak-badge
│       ├── tasks/                  # task-card, task-form, task-list, task-filters
│       ├── nutrition/              # meal-log-form, macro-ring, daily-summary, goals-form
│       └── dashboard/              # habits-widget, tasks-widget, nutrition-widget
├── lib/
│   ├── supabase/                   # client.ts, server.ts, middleware.ts, types.ts
│   ├── stores/                     # auth-store.ts, ui-store.ts (Zustand)
│   ├── hooks/                      # use-auth, use-habits, use-tasks, use-nutrition
│   ├── validators/                 # Zod-схемы: auth, habit, task, nutrition
│   ├── utils/                      # cn.ts, dates.ts, constants.ts
│   └── providers/                  # query-provider, auth-provider, providers
├── types/                          # habits.ts, tasks.ts, nutrition.ts
└── middleware.ts                   # Session refresh + защита маршрутов
supabase/
└── migrations/                     # SQL-миграции
```

---

## Фазы разработки

### Phase 0: Scaffolding проекта
- Init Next.js + установка всех зависимостей
- Tailwind-тема (neon colors, glass utilities)
- `globals.css` (`.glass-card`, `.neon-glow`)
- Supabase client/server setup
- SQL-миграции (все 7 таблиц + RLS + триггеры)
- Providers (QueryClient)
- Root layout

### Phase 1: Аутентификация
- Zod-схемы login/signup
- Zustand auth-store + use-auth hook
- Next.js middleware (session + route protection)
- Страницы: login, signup, OAuth callback
- Формы: login-form, signup-form, oauth-buttons

### Phase 2: UI Kit (атомарные компоненты)
- button, input, textarea, select
- badge, card (GlassCard), modal
- skeleton, progress-bar, avatar
- date-picker, toast

### Phase 3: Layout + навигация
- Sidebar (desktop + mobile drawer)
- Topbar с аватаром и logout
- App layout с auth guard
- Placeholder dashboard и settings

### Phase 4: Модуль привычек
- Типы + Zod + React Query хуки
- Карточка привычки + форма создания/редактирования
- Трекер (7 дней) + расчёт streaks
- Страница списка + страница детальной статистики

### Phase 5: Модуль задач
- Типы + Zod + React Query хуки
- Карточка задачи + форма + фильтры
- Список с сортировкой по приоритету/дедлайну
- Priority badge + category select

### Phase 6: Модуль питания (БЖУ)
- Типы + Zod + React Query хуки
- Форма добавления приёма пищи
- Circular progress (macro-ring) для каждого макронутриента
- Дневная сводка vs цели
- Страница настройки целей

### Phase 7: Виджеты дашборда
- habits-widget (сегодняшние привычки)
- tasks-widget (активные задачи, ближайшие дедлайны)
- nutrition-widget (сегодняшние macro rings)
- Интеграция в responsive grid на dashboard

### Phase 8: Полировка
- framer-motion анимации и переходы
- Skeleton loaders на всех страницах
- Error boundaries + пустые состояния
- Адаптив (mobile/tablet/desktop)
- Fallback `bg-slate-900/90` для мобилок без backdrop-blur

---

## Definition of Done (для каждой фазы)

1. `npx tsc --noEmit` — нет ошибок типов
2. `npm run build` — успешная production-сборка
3. Ручная проверка: навигация, CRUD-операции работают
