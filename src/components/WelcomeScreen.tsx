import { motion } from "framer-motion";
import {
  BookOpen,
  Code2,
  MessageCircle,
  Palette,
  PenLine,
  Zap,
} from "lucide-react";
import ChatInput from "./ChatInput";
import OfficialBots from "./OfficialBots";
import { useApp } from "../context/AppContext";
import { cn } from "../utils/cn";
import type { FeatureMode } from "../types";

const features: {
  id: FeatureMode;
  label: string;
  icon: typeof MessageCircle;
  wrap: string;
  iconBg: string;
  iconColor: string;
}[] = [
  {
    id: "chat",
    label: "Chat",
    icon: MessageCircle,
    wrap: "bg-[#d8f1ff]",
    iconBg: "bg-[#bfe6fb]",
    iconColor: "text-sky-600",
  },
  {
    id: "tasks",
    label: "Tasks",
    icon: Zap,
    wrap: "bg-[#fff4c8]",
    iconBg: "bg-[#ffe899]",
    iconColor: "text-amber-600",
  },
  {
    id: "design",
    label: "Design",
    icon: Palette,
    wrap: "bg-[#ead9ff]",
    iconBg: "bg-[#d9bfff]",
    iconColor: "text-violet-600",
  },
  {
    id: "code",
    label: "Code",
    icon: Code2,
    wrap: "bg-[#ffd6d4]",
    iconBg: "bg-[#ffb8b5]",
    iconColor: "text-rose-600",
  },
  {
    id: "research",
    label: "Research",
    icon: BookOpen,
    wrap: "bg-[#d9e6ff]",
    iconBg: "bg-[#bfd4ff]",
    iconColor: "text-blue-600",
  },
  {
    id: "writing",
    label: "Writing",
    icon: PenLine,
    wrap: "bg-[#d8f5ea]",
    iconBg: "bg-[#b7ead6]",
    iconColor: "text-emerald-600",
  },
];

export default function WelcomeScreen() {
  const { featureMode, setFeatureMode, setView } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-full min-h-0 flex-col"
    >
      <div className="custom-scroll flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-4 pb-4 pt-2 sm:px-8">
        <div className="relative mb-1 mt-2 flex h-[120px] w-[120px] items-center justify-center sm:mt-4 sm:h-[150px] sm:w-[150px]">
          <div className="orb-glow absolute inset-2 rounded-full bg-gradient-to-br from-violet-300/50 via-sky-200/40 to-fuchsia-300/40 blur-2xl" />
          <img
            src="/images/orb.png"
            alt=""
            className="orb-float orb-mask relative z-10 h-full w-full object-contain"
          />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="text-center text-[26px] font-extrabold tracking-tight text-slate-800 sm:text-[32px]"
        >
          Welcome to Glissa AI
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="mt-1 text-center text-[15px] font-medium text-slate-500 sm:text-[17px]"
        >
          Your all-in-one AI Assistant!
        </motion.p>

        <div className="mt-6 grid w-full max-w-[640px] grid-cols-3 gap-2.5 sm:mt-8 sm:grid-cols-6 sm:gap-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            const active = featureMode === f.id;
            return (
              <motion.button
                key={f.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.04 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setFeatureMode(f.id);
                  if (f.id !== "chat") setView("home");
                  requestAnimationFrame(() => {
                    document.getElementById("glissa-input")?.focus();
                  });
                }}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl px-2 py-3 transition sm:rounded-[22px] sm:py-3.5",
                  f.wrap,
                  active && "ring-2 ring-violet-400 ring-offset-2 ring-offset-transparent"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl sm:h-10 sm:w-10 sm:rounded-2xl",
                    f.iconBg,
                    f.iconColor
                  )}
                >
                  <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                </span>
                <span className="text-[12px] font-semibold text-slate-700 sm:text-[13px]">
                  {f.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-7 w-full sm:mt-9">
          <div className="mx-auto flex justify-center">
            <ChatInput variant="hero" />
          </div>
        </div>

        <div className="mt-auto w-full pt-8 sm:pt-10">
          <OfficialBots />
        </div>
      </div>
    </motion.div>
  );
}
