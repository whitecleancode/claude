"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { signupSchema, type SignupValues } from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OAuthButtons } from "./oauth-buttons";

export function SignupForm() {
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof SignupValues, string>>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const values = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    const result = signupSchema.safeParse(values);
    if (!result.success) {
      const errors: Partial<Record<keyof SignupValues, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof SignupValues;
        if (!errors[field]) errors[field] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold neon-text-purple">Регистрация</h1>
        <p className="mt-1 text-sm text-slate-400">
          Создайте аккаунт Life-OS
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-neon-pink/10 border border-neon-pink/20 px-4 py-3 text-sm text-neon-pink">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="fullName"
          name="fullName"
          label="Имя"
          placeholder="Иван Иванов"
          error={fieldErrors.fullName}
          autoComplete="name"
        />
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
          placeholder="Минимум 6 символов"
          error={fieldErrors.password}
          autoComplete="new-password"
        />
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Подтверждение пароля"
          placeholder="Повторите пароль"
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
        />
        <Button type="submit" variant="primary" className="w-full" loading={loading}>
          Создать аккаунт
        </Button>
      </form>

      <OAuthButtons onGoogleClick={signInWithGoogle} />

      <p className="text-center text-sm text-slate-400">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="text-neon-purple hover:underline">
          Войти
        </Link>
      </p>
    </div>
  );
}
