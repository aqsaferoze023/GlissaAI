import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Clock, LogIn, Moon, Shield, Trash2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { cn } from "../../utils/cn";
import type { ReactNode } from "react";

export default function SettingsPage() {
  const {
    pushToast,
    settings,
    updateSettings,
    isAuthenticated,
    user,
    setAuthOpen,
    setAuthMode,
    signOut,
    clearHistory,
    chats,
    searchTopics,
    setView,
  } = useApp();
  const [dark, setDark] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="custom-scroll h-full overflow-y-auto px-4 py-4 sm:px-8 sm:py-6"
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 sm:text-[28px]">Settings</h2>
        <p className="mt-1 text-[14px] text-slate-500">Account, history, and how Glissa behaves.</p>

        <div className="mt-6 mb-4 rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">Account</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <img src={user.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
              <div>
                <p className="text-[14px] font-bold text-slate-800">{user.name}</p>
                <p className="text-[12px] text-slate-400">
                  {isAuthenticated ? user.email : "Guest · history stays on this device"}
                </p>
              </div>
            </div>
            {isAuthenticated ? (
              <button
                onClick={signOut}
                className="rounded-xl bg-violet-50 px-4 py-2 text-[13px] font-semibold text-violet-700 hover:bg-violet-100"
              >
                Sign out
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthMode("signin");
                  setAuthOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-violet-700"
              >
                <LogIn className="h-4 w-4" />
                Sign in / Sign up
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2 rounded-2xl border border-white/80 bg-white/80 p-2 shadow-sm">
          <ToggleRow
            icon={<Clock className="h-4 w-4" />}
            label="Save history"
            hint="Keep chats and search topics on this device after refresh"
            on={settings.saveHistory}
            onChange={(v) => updateSettings({ saveHistory: v })}
          />
          <ToggleRow
            icon={<Bell className="h-4 w-4" />}
            label="Notifications"
            hint="Product updates and reply alerts"
            on={settings.notifications}
            onChange={(v) => updateSettings({ notifications: v })}
          />
          <ToggleRow
            icon={<Shield className="h-4 w-4" />}
            label="Improved safety filter"
            hint="Extra caution on sensitive topics"
            on={settings.safetyFilter}
            onChange={(v) => updateSettings({ safetyFilter: v })}
          />
          <ToggleRow
            icon={<Moon className="h-4 w-4" />}
            label="Dark mode"
            hint="Coming soon — light lavender is the default"
            on={dark}
            onChange={(v) => {
              setDark(v);
              pushToast("Dark mode is on the roadmap", "info");
            }}
          />
        </div>

        <div className="mt-4 rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[13.5px] font-semibold text-slate-800">Saved on this device</p>
              <p className="mt-0.5 text-[12.5px] text-slate-400">
                {chats.length} chats · {searchTopics.length} search topics
              </p>
            </div>
            <button
              onClick={() => setView("history")}
              className="rounded-xl bg-violet-50 px-3 py-2 text-[12.5px] font-semibold text-violet-700 hover:bg-violet-100"
            >
              View history
            </button>
          </div>
          <button
            onClick={clearHistory}
            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-[12.5px] font-semibold text-rose-600 hover:bg-rose-100"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear all history
          </button>
        </div>

        <div className="mt-4 rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">Language</p>
          <select className="mt-2 h-11 w-full rounded-xl border border-violet-100 bg-white px-3 text-[13.5px] outline-none">
            <option>English</option>
            <option>Español</option>
            <option>Français</option>
            <option>Deutsch</option>
            <option>日本語</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}

function ToggleRow({
  icon,
  label,
  hint,
  on,
  onChange,
}: {
  icon: ReactNode;
  label: string;
  hint: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-500">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-semibold text-slate-800">{label}</p>
        <p className="text-[12px] text-slate-400">{hint}</p>
      </div>
      <button
        role="switch"
        aria-checked={on}
        onClick={() => onChange(!on)}
        className={cn("relative h-6 w-11 rounded-full transition", on ? "bg-violet-500" : "bg-slate-200")}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition",
            on ? "left-[22px]" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}
