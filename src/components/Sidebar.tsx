import { type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Compass,
  FolderKanban,
  HelpCircle,
  LayoutGrid,
  MessageSquarePlus,
  PenLine,
  Plus,
  Settings,
  Smartphone,
  Tablet,
  Monitor,
  Trophy,
  User,
  Users,
  Trash2,
  MessageCircle,
  Clock,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { cn } from "../utils/cn";
import type { View } from "../types";

const nav: { id: View; label: string; icon: typeof Compass }[] = [
  { id: "history", label: "History", icon: Clock },
  { id: "bots", label: "Bots and apps", icon: LayoutGrid },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "creators", label: "Creators", icon: Users },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "feedback", label: "Send feedback", icon: MessageSquarePlus },
  { id: "support", label: "Support", icon: HelpCircle },
];

export default function Sidebar({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const {
    view,
    setView,
    goHome,
    newChat,
    chats,
    activeChatId,
    openChat,
    deleteChat,
    searchQuery,
    searchTopics,
    submitSearch,
  } = useApp();
  const exploreActive = view === "home";
  const createActive = view === "chat";

  const filtered = chats.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const go = (v: View) => {
    if (v === "home") goHome();
    else setView(v);
    onNavigate?.();
  };

  return (
    <aside className={cn("flex h-full w-[212px] shrink-0 flex-col px-2.5 py-3 lg:w-[248px] lg:px-3.5 lg:py-4", className)}>
      <div className="mb-3 flex items-center gap-2 px-1">
        <button onClick={() => go("home")} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-200">
            <SparkleMark />
          </div>
          <span className="text-[15px] font-bold tracking-tight text-slate-800">Glissa AI</span>
        </button>
        <button
          onClick={() => go("bots")}
          className="ml-auto rounded-lg p-1.5 text-slate-400 transition hover:bg-white/70 hover:text-violet-600"
          aria-label="Apps"
        >
          <LayoutGrid className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-3 flex items-center gap-1 rounded-2xl bg-white/70 p-1 shadow-sm ring-1 ring-white/80">
        <button
          onClick={() => {
            goHome();
            onNavigate?.();
          }}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-[12.5px] font-semibold transition",
            exploreActive
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Compass className="h-3.5 w-3.5" />
          Explore
        </button>
        <button
          onClick={() => {
            newChat();
            onNavigate?.();
          }}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-[12.5px] font-semibold transition",
            createActive
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          <PenLine className="h-3.5 w-3.5" />
          Create
        </button>
        <button
          onClick={() => {
            newChat();
            onNavigate?.();
          }}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 transition hover:bg-violet-50 hover:text-violet-600"
          aria-label="New chat"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="custom-scroll flex-1 overflow-y-auto rounded-[22px] bg-white/55 p-1.5 ring-1 ring-white/70">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition",
                active
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-600 hover:bg-white/80 hover:text-slate-800"
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-violet-500" : "text-slate-400")} />
              {item.label}
            </button>
          );
        })}

         {searchTopics.length > 0 && (
          <div className="mt-2 border-t border-violet-100/70 pt-2">
            <p className="px-3 pb-1 text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">
              Saved topics
            </p>
            {searchTopics
              .filter((t) => t.query.toLowerCase().includes(searchQuery.toLowerCase()))
              .slice(0, 6)
              .map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    submitSearch(t.query);
                    onNavigate?.();
                  }}
                  className="mb-0.5 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-white/80"
                >
                  <Clock className="h-3.5 w-3.5 shrink-0 text-violet-400" />
                  <span className="truncate text-[12.5px] font-medium text-slate-600">{t.query}</span>
                </button>
              ))}
          </div>
        )}

        {filtered.length > 0 && (
          <div className="mt-2 border-t border-violet-100/70 pt-2">
            <p className="px-3 pb-1 text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">
              Recent chats
            </p>
            <AnimatePresence initial={false}>
              {filtered.slice(0, 12).map((c) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={cn(
                    "group mb-0.5 flex items-center gap-1 rounded-xl pr-1 transition",
                    activeChatId === c.id ? "bg-white shadow-sm" : "hover:bg-white/80"
                  )}
                >
                  <button
                    onClick={() => {
                      openChat(c.id);
                      onNavigate?.();
                    }}
                    className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-left"
                  >
                    <MessageCircle className="h-3.5 w-3.5 shrink-0 text-violet-400" />
                    <span className="truncate text-[12.5px] font-medium text-slate-600">
                      {c.title}
                    </span>
                  </button>
                  <button
                    onClick={() => deleteChat(c.id)}
                    className="rounded-md p-1 text-slate-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100"
                    aria-label="Delete chat"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="mt-3 space-y-2">
        <StoreBtn color="bg-[#cfeaf8] hover:bg-[#bddff3] text-sky-800" icon={<Smartphone className="h-3.5 w-3.5" />}>
          Download Android app
        </StoreBtn>
        <StoreBtn color="bg-[#f8d3ea] hover:bg-[#f3c2e0] text-pink-800" icon={<Tablet className="h-3.5 w-3.5" />}>
          Download iOS app
        </StoreBtn>
        <StoreBtn color="bg-[#d8f3c9] hover:bg-[#c6ebb3] text-lime-800" icon={<Monitor className="h-3.5 w-3.5" />}>
          Download MacOS app
        </StoreBtn>
      </div>
    </aside>
  );
}

function StoreBtn({
  color,
  icon,
  children,
}: {
  color: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  const { pushToast } = useApp();
  return (
    <button
      onClick={() => pushToast("App store links coming soon", "info")}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-[12.5px] font-semibold shadow-sm transition active:scale-[0.98]",
        color
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function SparkleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="currentColor">
      <path d="M12 2.4l1.15 6.1L19.2 9.6 13.15 12.1 12 18.4l-1.15-6.3L4.8 9.6l6.05-1.1L12 2.4z" />
      <path d="M18.5 14.2l.55 2.4 2.45.55-2.45.55-.55 2.4-.55-2.4-2.45-.55 2.45-.55.55-2.4z" opacity="0.9" />
    </svg>
  );
}
