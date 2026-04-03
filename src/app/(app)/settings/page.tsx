"use client";

import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Avatar } from "@/components/ui/avatar";

export default function SettingsPage() {
  const { profile } = useAuthStore();

  return (
    <>
      <Topbar title="Настройки" />
      <div className="p-4 lg:p-6 space-y-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Профиль</h3>
          <div className="flex items-center gap-4">
            <Avatar
              src={profile?.avatar_url}
              name={profile?.full_name}
              size="lg"
            />
            <div>
              <p className="font-medium">
                {profile?.full_name ?? "Без имени"}
              </p>
              <p className="text-sm text-slate-400">{profile?.email}</p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
