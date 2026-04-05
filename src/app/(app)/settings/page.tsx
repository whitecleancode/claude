"use client";

import { useState, useEffect } from "react";
import { LogOut, Save, Droplets } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useAuth } from "@/lib/hooks/use-auth";
import { Avatar } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const { profile, setProfile } = useAuthStore();
  const { signOut } = useAuth();
  const [name, setName] = useState(profile?.full_name ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [waterGoal, setWaterGoal] = useState(8);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    if (profile) setName(profile.full_name ?? "");
  }, [profile]);

  useEffect(() => {
    const saved = localStorage.getItem("water-goal");
    if (saved) setWaterGoal(Number(saved));
  }, []);

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .update({ full_name: name })
      .eq("id", profile.id)
      .select()
      .single();

    if (!error && data) {
      setProfile(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  const handleWaterGoalChange = (value: number) => {
    const clamped = Math.max(4, Math.min(20, value));
    setWaterGoal(clamped);
    localStorage.setItem("water-goal", String(clamped));
  };

  return (
    <>
      <Topbar title="Настройки" />
      <div className="p-4 lg:p-6 space-y-6 max-w-lg">
        {/* Profile */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Профиль</h3>
          <div className="flex items-center gap-4 mb-4">
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

          <Input
            id="full_name"
            label="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя"
          />
          <Button
            className="mt-3 w-full"
            onClick={handleSaveProfile}
            loading={saving}
            disabled={name === (profile?.full_name ?? "")}
          >
            <Save className="h-4 w-4" />
            {saved ? "Сохранено!" : "Сохранить"}
          </Button>
        </Card>

        {/* Water Goal */}
        <Card>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Droplets className="h-4 w-4 text-neon-cyan" />
            Цель воды в день
          </h3>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={4}
              max={20}
              value={waterGoal}
              onChange={(e) => handleWaterGoalChange(Number(e.target.value))}
              className="flex-1 accent-neon-cyan"
            />
            <span className="text-lg font-bold text-neon-cyan w-12 text-right">
              {waterGoal}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{waterGoal} стаканов (~{waterGoal * 250} мл)</p>
        </Card>

        {/* Logout */}
        <Card>
          {!showLogout ? (
            <Button
              variant="danger"
              className="w-full"
              onClick={() => setShowLogout(true)}
            >
              <LogOut className="h-4 w-4" />
              Выйти из аккаунта
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-300">Вы уверены, что хотите выйти?</p>
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => setShowLogout(false)}>
                  Отмена
                </Button>
                <Button variant="danger" className="flex-1" onClick={() => signOut()}>
                  Выйти
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
