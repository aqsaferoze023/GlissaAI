import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle, Keyboard, LogIn, LogOut, Settings, Sparkles, User } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function UserMenu() {
  const {
    user,
    userMenuOpen,
    setUserMenuOpen,
    setView,
    setProOpen,
    pushToast,
    isAuthenticated,
    signOut,
    setAuthOpen,
    setAuthMode,
  } = useApp();

  return (
    <div className="relative">
      <button
        onClick={() => {
          setUserMenuOpen(!userMenuOpen);
        }}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition hover:bg-white/70"
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="h-8 w-8 rounded-full object-cover ring-2 ring-white shadow-sm"
        />
        <div className="hidden text-left sm:block">
          <p className="text-[12.5px] font-semibold leading-tight text-slate-800">{user.name}</p>
          <p className="text-[10.5px] leading-tight text-slate-400">{user.email}</p>
        </div>
      </button>

      <AnimatePresence>
        {userMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.16 }}
              className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-violet-100 bg-white/95 p-1.5 shadow-xl shadow-violet-200/50 backdrop-blur-xl"
            >
              <div className="mb-1 flex items-center gap-2.5 rounded-xl bg-violet-50 px-2.5 py-2">
                <img src={user.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-semibold text-slate-800">{user.name}</p>
                  <p className="text-[10.5px] text-violet-500">{user.plan}</p>
                </div>
              </div>
              <MenuItem
                icon={<User className="h-4 w-4" />}
                label="Profile"
                onClick={() => {
                  setView("profile");
                  setUserMenuOpen(false);
                }}
              />
              <MenuItem
                icon={<Settings className="h-4 w-4" />}
                label="Settings"
                onClick={() => {
                  setView("settings");
                  setUserMenuOpen(false);
                }}
              />
              <MenuItem
                icon={<Sparkles className="h-4 w-4" />}
                label="Upgrade to Pro"
                onClick={() => {
                  setProOpen(true);
                  setUserMenuOpen(false);
                }}
              />
              <MenuItem
                icon={<Keyboard className="h-4 w-4" />}
                label="Shortcuts"
                onClick={() => {
                  setUserMenuOpen(false);
                  pushToast("⌘K search · ⌘N new chat · Esc close", "info");
                }}
              />
              <MenuItem
                icon={<HelpCircle className="h-4 w-4" />}
                label="Support"
                onClick={() => {
                  setView("support");
                  setUserMenuOpen(false);
                }}
              />
              {isAuthenticated ? (
                <MenuItem
                  icon={<LogOut className="h-4 w-4" />}
                  label="Sign out"
                  onClick={() => {
                    setUserMenuOpen(false);
                    signOut();
                  }}
                />
              ) : (
                <MenuItem
                  icon={<LogIn className="h-4 w-4" />}
                  label="Sign in / Sign up"
                  onClick={() => {
                    setUserMenuOpen(false);
                    setAuthMode("signin");
                    setAuthOpen(true);
                  }}
                />
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"
    >
      <span className="text-slate-400">{icon}</span>
      {label}
    </button>
  );
}
