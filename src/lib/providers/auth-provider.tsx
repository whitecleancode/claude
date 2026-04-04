"use client";

import { useEffect, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/stores/auth-store";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, setProfile, setLoading, isLoading } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    // Hard timeout — never block UI longer than 3s
    const timeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 3000);

    // Use getSession (reads localStorage first, much faster than getUser)
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!mounted) return;
        const user = session?.user ?? null;
        setUser(user);
        setLoading(false);
        clearTimeout(timeout);

        if (user) {
          supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single()
            .then(({ data }) => {
              if (mounted) setProfile(data);
            });
        }
      })
      .catch(() => {
        if (mounted) {
          setLoading(false);
          clearTimeout(timeout);
        }
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();
        if (mounted) setProfile(data);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
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
