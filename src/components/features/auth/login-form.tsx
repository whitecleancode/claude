"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { loginSchema, type LoginValues } from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OAuthButtons } from "./oauth-buttons";

export function LoginForm() {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginValues, string>>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const values = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const result = loginSchema.safeParse(values);
    if (!result.success) {
      const errors: Partial<Record<keyof LoginValues, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginValues;
        if (!errors[field]) errors[field] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold neon-text-cyan">Войти в Life-OS</h1>
        <p className="mt-1 text-sm text-slate-400">
          Трекер привычек, задач и питания
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-neon-pink/10 border border-neon-pink/20 px-4 py-3 text-sm text-neon-pink">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          error={fieldErrors.email}
          autoComplete="email"
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Пароль"
          placeholder="••••••"
          error={fieldErrors.password}
          autoComplete="current-password"
        />
        <Button type="submit" className="w-full" loading={loading}>
          Войти
        </Button>
      </form>

      <OAuthButtons onGoogleClick={signInWithGoogle} />

      <p className="text-center text-sm text-slate-400">
        Нет аккаунта?{" "}
        <Link href="/signup" className="text-neon-cyan hover:underline">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}
