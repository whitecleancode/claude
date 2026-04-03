"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, LogOut, User } from "lucide-react";
import { useUIStore } from "@/lib/stores/ui-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useAuth } from "@/lib/hooks/use-auth";
import { Avatar } from "@/components/ui/avatar";

interface TopbarProps {
  title: string;
}

export function Topbar({ title }: TopbarProps) {
  const { toggleSidebar } = useUIStore();
  const { profile } = useAuthStore();
  const { signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-6 border-b border-white/10 bg-surface-primary/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors lg:hidden cursor-pointer"
          aria-label="Меню"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
        >
          <Avatar
            src={profile?.avatar_url}
            name={profile?.full_name}
            size="sm"
          />
          <span className="hidden sm:block text-sm text-slate-300 max-w-[120px] truncate">
            {profile?.full_name ?? profile?.email}
          </span>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 glass-card py-1 shadow-xl">
            <div className="px-3 py-2 border-b border-white/10">
              <p className="text-sm font-medium truncate">
                {profile?.full_name}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {profile?.email}
              </p>
            </div>
            <button
              onClick={() => {
                setMenuOpen(false);
                signOut();
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Выйти
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
