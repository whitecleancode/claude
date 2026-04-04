"use client";

import { useEffect, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/stores/auth-store";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, setProfile, setLoading, isLoading } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    async function initAuth() {
      try {
        // getSession() reads from localStorage/cookies — no network request, resolves in < 5ms.
        // This avoids the 3-second timeout race that caused infinite skeleton loading on refresh.
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        const user = session?.user ?? null;
        setUser(user);
        setLoading(false);

        if (user) {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
          if (mounted) setProfile(data);
        } else {
          setProfile(null);
        }
      } catch {
        if (mounted) {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    }

    initAuth();

    // onAuthStateChange handles all subsequent events after the initial getSession() call:
    // TOKEN_REFRESHED, SIGNED_IN (from another tab), SIGNED_OUT, PASSWORD_RECOVERY, etc.
    // INITIAL_SESSION is skipped — already handled by getSession() above.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (event === "INITIAL_SESSION") return;

      const user = session?.user ?? null;
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (mounted) setProfile(data);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setProfile, setLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-neon-cyan border-t-transparent animate-spin" />
          <p className="text-sm text-slate-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
