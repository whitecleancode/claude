import type { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-surface-primary">
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
