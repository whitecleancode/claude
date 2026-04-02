import type { Metadata } from "next";
import { Providers } from "@/lib/providers/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life-OS — Трекер привычек, задач и БЖУ",
  description:
    "Персональный трекер привычек, задач и питания с Neon Glassmorphism UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full bg-surface-primary text-foreground font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
