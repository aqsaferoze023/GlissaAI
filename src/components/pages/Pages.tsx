import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Heart,
  LogIn,
  Mail,
  Send,
  Sparkles,
  Trophy,
} from "lucide-react";
import { officialBots, mockCreators, mockProjects, leaderboard } from "../../data/bots";
import { useApp } from "../../context/AppContext";
import { cn } from "../../utils/cn";
import SettingsPageNew from "./SettingsPage";
import HistoryPage from "./HistoryPage";

const fade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.28 },
};

function Shell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <motion.div {...fade} className="custom-scroll h-full overflow-y-auto px-4 py-4 sm:px-8 sm:py-6">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 sm:text-[28px]">{title}</h2>
        {subtitle && <p className="mt-1 text-[14px] text-slate-500">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </motion.div>
  );
}

export function BotsPage() {
  const { startBotChat } = useApp();
  return (
    <Shell title="Bots and apps" subtitle="Official specialists, ready when you are.">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {officialBots.map((bot) => (
          <button
            key={bot.id}
            onClick={() => startBotChat(bot.id)}
            className="group rounded-2xl border border-white/80 bg-white/80 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className={cn("mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow", bot.color)}>
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="font-bold text-slate-800">{bot.name}</p>
            <p className="text-[12px] font-medium text-violet-500">{bot.tagline}</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">{bot.description}</p>
            <span className="mt-3 inline-block text-[12px] font-semibold text-violet-600 group-hover:underline">
              Start chat →
            </span>
          </button>
        ))}
      </div>
    </Shell>
  );
}

export function ProjectsPage() {
  const { pushToast, newChat } = useApp();
  return (
    <Shell title="Projects" subtitle="Keep related chats, files, and bots in one space.">
      <div className="grid gap-3 sm:grid-cols-2">
        {mockProjects.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              newChat();
              pushToast(`Opened ${p.name}`, "info");
            }}
            className="rounded-2xl border border-white/80 bg-white/80 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className={cn("mb-4 h-1.5 w-16 rounded-full bg-gradient-to-r", p.color)} />
            <p className="text-lg font-bold text-slate-800">{p.name}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{p.description}</p>
            <div className="mt-4 flex items-center justify-between text-[12px] text-slate-400">
              <span>{p.chats} chats</span>
              <span>Updated {p.updated}</span>
            </div>
          </button>
        ))}
      </div>
    </Shell>
  );
}

export function LeaderboardPage() {
  return (
    <Shell title="Leaderboard" subtitle="Top creators on Glissa this week.">
      <div className="overflow-hidden rounded-2xl border border-white/80 bg-white/80 shadow-sm">
        {leaderboard.map((row) => (
          <div
            key={row.rank}
            className="flex items-center gap-3 border-b border-violet-50 px-4 py-3 last:border-0"
          >
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold",
                row.rank === 1
                  ? "bg-amber-100 text-amber-700"
                  : row.rank === 2
                    ? "bg-slate-100 text-slate-600"
                    : row.rank === 3
                      ? "bg-orange-100 text-orange-700"
                      : "bg-violet-50 text-violet-500"
              )}
            >
              {row.rank === 1 ? <Trophy className="h-4 w-4" /> : row.rank}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-slate-800">{row.name}</p>
              <p className="text-[11.5px] text-slate-400">{row.bots} bots</p>
            </div>
            <span className={cn("text-[12px] font-semibold", row.change.startsWith("+") ? "text-emerald-600" : "text-rose-500")}>
              {row.change}
            </span>
            <span className="w-14 text-right text-[13px] font-bold text-slate-700">{row.score.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </Shell>
  );
}

export function CreatorsPage() {
  const { pushToast } = useApp();
  return (
    <Shell title="Creators" subtitle="People building remarkable bots on Glissa.">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {mockCreators.map((c) => (
          <div key={c.id} className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={cn("flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white", c.color)}>
                {c.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="font-bold text-slate-800">{c.name}</p>
                <p className="text-[12px] text-slate-400">{c.handle}</p>
              </div>
            </div>
            <p className="mt-3 text-[13px] text-slate-500">{c.specialty}</p>
            <div className="mt-3 flex items-center justify-between text-[12px] text-slate-400">
              <span>{c.bots} bots</span>
              <span className="inline-flex items-center gap-1">
                <Heart className="h-3 w-3 text-rose-400" /> {c.likes}
              </span>
            </div>
            <button
              onClick={() => pushToast(`Following ${c.name}`, "success")}
              className="mt-3 w-full rounded-xl bg-violet-50 py-2 text-[12.5px] font-semibold text-violet-700 transition hover:bg-violet-100"
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </Shell>
  );
}

export function ProfilePage() {
  const { user, setUser, chats, pushToast, isAuthenticated, setAuthOpen, setAuthMode, searchTopics } = useApp();
  return (
    <Shell title="Profile" subtitle="How you appear across Glissa AI.">
      <div className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-sm sm:p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <img src={user.avatar} alt="" className="h-20 w-20 rounded-full object-cover ring-4 ring-violet-100" />
          <div className="flex-1">
            <p className="text-xl font-bold text-slate-800">{user.name}</p>
            <p className="text-[13px] text-slate-500">{user.email}</p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-semibold text-violet-700">
              <Sparkles className="h-3 w-3" /> {user.plan}
            </span>
          </div>
          {!isAuthenticated && (
            <button
              onClick={() => {
                setAuthMode("signin");
                setAuthOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-[13px] font-semibold text-white"
            >
              <LogIn className="h-4 w-4" /> Sign in
            </button>
          )}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat label="Chats" value={String(chats.length)} />
          <Stat label="Messages" value={String(chats.reduce((n, c) => n + c.messages.length, 0))} />
          <Stat label="Topics" value={String(searchTopics.length)} />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Field
            label="Display name"
            value={user.name}
            onChange={(v) => setUser((u) => ({ ...u, name: v }))}
          />
          <Field label="Email" value={user.email} disabled onChange={() => {}} />
        </div>
        <button
          onClick={() => pushToast(isAuthenticated ? "Profile saved" : "Sign in to keep profile changes")}
          className="mt-5 rounded-xl bg-violet-600 px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-violet-700"
        >
          Save changes
        </button>
      </div>
    </Shell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-violet-50 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-400">{label}</p>
      <p className="text-2xl font-extrabold text-slate-800">{value}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-semibold text-slate-500">{label}</span>
      <input
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-violet-100 bg-white px-3 text-[13.5px] outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100 disabled:bg-violet-50 disabled:text-slate-500"
      />
    </label>
  );
}

export function FeedbackPage() {
  const { pushToast } = useApp();
  const [sent, setSent] = useState(false);
  const [text, setText] = useState("");
  return (
    <Shell title="Send feedback" subtitle="Tell us what to polish next.">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
          pushToast("Thanks — we read every note");
          setText("");
        }}
        className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-sm"
      >
        <label className="block text-[12px] font-semibold text-slate-500">Your note</label>
        <textarea
          required
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="What felt great? What felt off?"
          className="mt-1.5 w-full resize-none rounded-xl border border-violet-100 bg-white px-3 py-2.5 text-[13.5px] outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
        />
        <button
          type="submit"
          className="mt-3 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-violet-700"
        >
          <Send className="h-4 w-4" />
          Send feedback
        </button>
        {sent && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-emerald-600">
            <Check className="h-4 w-4" /> Received. Thank you.
          </p>
        )}
      </form>
    </Shell>
  );
}

const faqs = [
  {
    q: "Is Glissa connected to a live model?",
    a: "This demo simulates replies so you can explore the full interface. The chat layer is structured so a real API can be wired in without changing the UI.",
  },
  {
    q: "Where is my history stored?",
    a: "If Save history is on in Settings, chats and search topics are kept in this browser. Sign in and they stay tied to your account on this device.",
  },
  {
    q: "How do Official Bots differ?",
    a: "Each bot has a specialty and greeting. They share the same canvas, so you can switch without leaving Glissa.",
  },
  {
    q: "Keyboard shortcuts?",
    a: "⌘K focuses search, ⌘N starts a new chat, Enter sends, Shift+Enter adds a newline, Esc closes menus.",
  },
];

export function SupportPage() {
  const [open, setOpen] = useState<number | null>(0);
  const { pushToast } = useApp();
  return (
    <Shell title="Support" subtitle="Answers, and a way to reach us.">
      <div className="space-y-2">
        {faqs.map((f, i) => (
          <div key={f.q} className="overflow-hidden rounded-2xl border border-white/80 bg-white/80 shadow-sm">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-[14px] font-semibold text-slate-800">{f.q}</span>
              <ChevronDown className={cn("h-4 w-4 text-slate-400 transition", open === i && "rotate-180")} />
            </button>
            {open === i && <p className="px-4 pb-4 text-[13.5px] leading-relaxed text-slate-500">{f.a}</p>}
          </div>
        ))}
      </div>
      <button
        onClick={() => pushToast("Support ticket filed — we'll reply in the demo inbox", "info")}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[13px] font-semibold text-violet-700 shadow-sm ring-1 ring-violet-100 hover:bg-violet-50"
      >
        <Mail className="h-4 w-4" />
        Contact support
      </button>
    </Shell>
  );
}

export function PageRouter() {
  const { view } = useApp();
  switch (view) {
    case "bots":
      return <BotsPage />;
    case "projects":
      return <ProjectsPage />;
    case "leaderboard":
      return <LeaderboardPage />;
    case "creators":
      return <CreatorsPage />;
    case "profile":
      return <ProfilePage />;
    case "settings":
      return <SettingsPageNew />;
    case "feedback":
      return <FeedbackPage />;
    case "support":
      return <SupportPage />;
    case "history":
      return <HistoryPage />;
    default:
      return null;
  }
}
