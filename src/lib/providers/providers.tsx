"use client";

import { useEffect, type ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { AuthProvider } from "./auth-provider";
import { ToastProvider } from "@/components/ui/toast";
import { initNativePlugins } from "@/lib/capacitor/native";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    initNativePlugins();
  }, []);

  return (
    <QueryProvider>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
