import { useState } from "react";
import { Bell, Clock, Mail, Menu, Plus, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import UserMenu from "./UserMenu";

const notifications = [
  { id: 1, title: "Nova published an update", body: "App Creator v3 is live.", time: "2m" },
  { id: 2, title: "Weekly research digest", body: "5 new papers in your vault.", time: "1h" },
  { id: 3, title: "Pro trial reminder", body: "Your extra seats expire Friday.", time: "Yesterday" },
];

export default function ChatHeader() {
  const {
    setSidebarOpen,
    searchQuery,
    setSearchQuery,
    notificationsOpen,
    setNotificationsOpen,
    setUserMenuOpen,
    newChat,
    pushToast,
    setView,
    searchTopics,
    submitSearch,
    isAuthenticated,
    setAuthOpen,
    setAuthMode,
  } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);

  const suggestions = searchTopics
    .filter((t) => !searchQuery || t.query.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 8);

  return (
    <header className="relative z-20 flex min-w-0 items-center gap-1.5 px-2.5 py-3 sm:gap-2 sm:px-5 sm:py-4">
      <button
        onClick={() => setSidebarOpen(true)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-white/80 hover:text-violet-600 md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative mx-auto min-w-0 max-w-[560px] flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          id="glissa-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchOpen(true)}
          onBlur={() => setTimeout(() => setSearchOpen(false), 160)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submitSearch(searchQuery);
              setSearchOpen(false);
              (e.target as HTMLInputElement).blur();
            }
          }}
          placeholder="Search chats and topics"
          className="h-11 w-full rounded-full border border-white/80 bg-white/80 pl-10 pr-14 text-[13.5px] text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-200/50 sm:pr-28"
        />
        <button
          onClick={() => {
            newChat();
            pushToast("New space created", "info");
          }}
          className="absolute right-1.5 top-1/2 inline-flex h-8 -translate-y-1/2 items-center gap-1 rounded-full bg-white px-2.5 text-[12px] font-semibold text-slate-600 shadow-sm ring-1 ring-violet-100 transition hover:text-violet-700 sm:px-3"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Space</span>
        </button>

        <AnimatePresence>
          {searchOpen && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-2xl border border-violet-100 bg-white/95 py-1.5 shadow-xl backdrop-blur-xl"
            >
              <p className="px-3 pb-1 pt-1 text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">
                Saved topics
              </p>
              {suggestions.map((t) => (
                <button
                  key={t.id}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    submitSearch(t.query);
                    setSearchOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"
                >
                  <Clock className="h-3.5 w-3.5 shrink-0 text-violet-400" />
                  <span className="truncate">{t.query}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
        {!isAuthenticated && (
          <button
            onClick={() => {
              setAuthMode("signin");
              setAuthOpen(true);
            }}
            className="mr-1 hidden h-9 items-center rounded-full bg-violet-600 px-3 text-[12px] font-semibold text-white shadow-sm transition hover:bg-violet-700 sm:inline-flex"
          >
            Sign in
          </button>
        )}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setUserMenuOpen(false);
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-white/80 hover:text-violet-600"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet-500" />
          </button>
          <AnimatePresence>
            {notificationsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 top-12 z-50 w-[300px] overflow-hidden rounded-2xl border border-violet-100 bg-white/95 p-2 shadow-xl backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <p className="text-[12.5px] font-semibold text-slate-700">Notifications</p>
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="rounded-md p-1 text-slate-400 hover:bg-violet-50"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {notifications.map((n) => (
                    <div key={n.id} className="rounded-xl px-2.5 py-2 transition hover:bg-violet-50">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[12.5px] font-semibold text-slate-700">{n.title}</p>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[12px] text-slate-500">{n.body}</p>
                    </div>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => setView("feedback")}
          className="hidden h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-white/80 hover:text-violet-600 sm:flex"
          aria-label="Messages"
        >
          <Mail className="h-[18px] w-[18px]" />
        </button>

        <UserMenu />
      </div>
    </header>
  );
}
