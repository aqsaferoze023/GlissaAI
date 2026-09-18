import {
  BookOpen,
  Code2,
  MessageCircle,
  Palette,
  PenLine,
  Search,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";
import { officialBots } from "../data/bots";
import { useApp } from "../context/AppContext";
import { cn } from "../utils/cn";

const iconMap = {
  sun: Sun,
  code: Code2,
  pen: PenLine,
  palette: Palette,
  search: Search,
  book: BookOpen,
  zap: Zap,
  message: MessageCircle,
  sparkles: Sparkles,
};

export default function OfficialBots({ compact = false }: { compact?: boolean }) {
  const { startBotChat } = useApp();

  return (
    <div className={cn("w-full", compact ? "" : "px-2")}>
      {!compact && (
        <p className="mb-3 text-center text-[12px] font-semibold tracking-wide text-slate-400 sm:text-left">
          Official Bots
        </p>
      )}
      <div className="no-scrollbar flex items-end justify-start gap-3 overflow-x-auto pb-1 sm:justify-center sm:gap-4 lg:gap-5">
        {officialBots.map((bot) => {
          const Icon = iconMap[bot.icon as keyof typeof iconMap] ?? Sparkles;
          return (
            <button
              key={bot.id}
              onClick={() => startBotChat(bot.id)}
              className="group flex w-[68px] shrink-0 flex-col items-center gap-1.5 sm:w-[76px]"
            >
              <span
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md transition duration-200 group-hover:scale-110 group-hover:shadow-lg sm:h-12 sm:w-12",
                  bot.color
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="w-full truncate text-center text-[10.5px] font-semibold text-slate-500 group-hover:text-violet-600">
                {bot.name}
              </span>
              <span className="hidden w-full truncate text-center text-[9.5px] text-slate-400 sm:block">
                {bot.tagline}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
