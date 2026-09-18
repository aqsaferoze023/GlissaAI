import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Image as ImageIcon,
  Mic,
  Paperclip,
  Search,
  Send,
  Sparkles,
  Square,
  Telescope,
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { cn } from "../utils/cn";
import type { Attachment, FeatureMode } from "../types";

const placeholders: Record<FeatureMode, string> = {
  chat: "Example: “Explain quantum computing in simple terms”",
  tasks: "Example: “Plan my product launch for next month”",
  design: "Example: “Design a calm onboarding flow for a wellness app”",
  code: "Example: “Write a TypeScript function to debounce search”",
  research: "Example: “What are the tradeoffs of RAG vs fine-tuning?”",
  writing: "Example: “Draft a warm welcome email for new users”",
};

export default function ChatInput({ variant }: { variant: "hero" | "bar" }) {
  const {
    sendMessage,
    isTyping,
    stopGenerating,
    featureMode,
    options,
    setOptions,
    setProOpen,
  } = useApp();
  const [value, setValue] = useState("");
  const [listening, setListening] = useState(false);
  const [files, setFiles] = useState<Attachment[]>([]);
  const [focused, setFocused] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const listenTimer = useRef<number | null>(null);

  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, variant === "hero" ? 140 : 160) + "px";
  }, [value, variant]);

  const submit = async () => {
    if (isTyping) return;
    if (!value.trim() && files.length === 0) return;
    const text = value;
    const atts = files;
    setValue("");
    setFiles([]);
    await sendMessage(text, atts.length ? atts : undefined);
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const toggleMic = () => {
    if (listening) {
      setListening(false);
      if (listenTimer.current) window.clearTimeout(listenTimer.current);
      return;
    }
    const w = window as unknown as {
      webkitSpeechRecognition?: new () => {
        lang: string;
        start: () => void;
        onresult: ((ev: { results: { 0: { 0: { transcript: string } } } }) => void) | null;
        onerror: (() => void) | null;
        onend: (() => void) | null;
      };
      SpeechRecognition?: new () => {
        lang: string;
        start: () => void;
        onresult: ((ev: { results: { 0: { 0: { transcript: string } } } }) => void) | null;
        onerror: (() => void) | null;
        onend: (() => void) | null;
      };
    };
    const SR = w.webkitSpeechRecognition || w.SpeechRecognition;
    if (SR) {
      const rec = new SR();
      rec.lang = "en-US";
      rec.onresult = (ev) => {
        const said = ev.results[0][0].transcript;
        setValue((v) => (v ? v + " " + said : said));
        setListening(false);
      };
      rec.onerror = () => setListening(false);
      rec.onend = () => setListening(false);
      rec.start();
      setListening(true);
      return;
    }
    setListening(true);
    listenTimer.current = window.setTimeout(() => {
      setValue((v) => (v ? v : "Explain quantum computing in simple terms"));
      setListening(false);
    }, 1800);
  };

  const onFiles = (list: FileList | null) => {
    if (!list) return;
    const next: Attachment[] = Array.from(list).map((f) => ({
      id: f.name + f.size + f.lastModified,
      name: f.name,
      type: f.type,
      size: f.size,
    }));
    setFiles((prev) => [...prev, ...next].slice(0, 4));
  };

  const isHero = variant === "hero";

  return (
    <div className={cn("w-full", isHero ? "max-w-[720px]" : "max-w-3xl")}>
      {isHero && (
        <div className="mb-2 flex items-center justify-between px-1">
          <button
            onClick={() => setProOpen(true)}
            className="flex items-center gap-1.5 text-[11.5px] font-medium text-violet-500 transition hover:text-violet-700"
          >
            <Sparkles className="h-3 w-3" />
            Unlock more with Pro Plan
          </button>
          <span className="text-[11px] text-slate-400">Powered by Glissa AI</span>
        </div>
      )}

      <motion.div
        animate={{
          boxShadow: focused
            ? "0 10px 40px -12px rgba(124, 92, 232, 0.28)"
            : "0 8px 30px -18px rgba(80, 60, 140, 0.18)",
        }}
        className={cn(
          "relative rounded-[22px] border bg-white/90 backdrop-blur-md transition-colors",
          focused ? "border-violet-300" : "border-white/80",
          isHero ? "px-4 py-3 sm:px-5 sm:py-3.5" : "px-3 py-2.5 sm:px-4"
        )}
      >
        {files.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {files.map((f) => (
              <span
                key={f.id}
                className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-700"
              >
                {f.name}
                <button
                  onClick={() => setFiles((p) => p.filter((x) => x.id !== f.id))}
                  className="rounded-full p-0.5 hover:bg-violet-100"
                  aria-label={`Remove ${f.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2">
          <div className="mb-1.5 hidden text-violet-400 sm:block">
            <Sparkles className="h-4 w-4" />
          </div>
          <textarea
            id="glissa-input"
            ref={taRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKey}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            rows={1}
            placeholder={placeholders[featureMode]}
            className="max-h-40 min-h-[28px] flex-1 resize-none bg-transparent text-[13.5px] leading-relaxed text-slate-700 outline-none placeholder:text-slate-400 sm:text-[14.5px]"
          />
          <div className="flex items-center gap-0.5 sm:gap-1">
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              multiple
              accept="image/*,.pdf,.txt,.md,.csv,.json"
              onChange={(e) => onFiles(e.target.files)}
            />
            <IconBtn label="Attach" onClick={() => fileRef.current?.click()}>
              <Paperclip className="h-4 w-4" />
            </IconBtn>
            <IconBtn label="Image" onClick={() => setOptions((o) => ({ ...o, makeImage: !o.makeImage }))}>
              <ImageIcon className={cn("h-4 w-4", options.makeImage && "text-violet-600")} />
            </IconBtn>
            <IconBtn label={listening ? "Stop listening" : "Voice"} onClick={toggleMic} active={listening}>
              {listening ? (
                <span className="flex h-4 items-end gap-0.5">
                  <span className="w-0.5 rounded-full bg-violet-500" style={{ animation: "listen-bar 0.7s infinite" }} />
                  <span className="w-0.5 rounded-full bg-violet-500" style={{ animation: "listen-bar 0.7s infinite 0.15s" }} />
                  <span className="w-0.5 rounded-full bg-violet-500" style={{ animation: "listen-bar 0.7s infinite 0.3s" }} />
                </span>
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </IconBtn>
            {isTyping ? (
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={stopGenerating}
                className="ml-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-white shadow-md transition hover:bg-slate-700"
                aria-label="Stop generating"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                onClick={submit}
                disabled={!value.trim() && files.length === 0}
                className="ml-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white shadow-md shadow-slate-300 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                aria-label="Send"
              >
                <Send className="h-4 w-4 translate-x-px" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {isHero && (
        <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
          <OptionChip
            active={options.deepResearch}
            onClick={() => setOptions((o) => ({ ...o, deepResearch: !o.deepResearch }))}
            icon={<Telescope className="h-3.5 w-3.5" />}
            label="Deep Research"
          />
          <OptionChip
            active={options.makeImage}
            onClick={() => setOptions((o) => ({ ...o, makeImage: !o.makeImage }))}
            icon={<ImageIcon className="h-3.5 w-3.5" />}
            label="Make an image"
          />
          <OptionChip
            active={options.webSearch}
            onClick={() => setOptions((o) => ({ ...o, webSearch: !o.webSearch }))}
            icon={<Search className="h-3.5 w-3.5" />}
            label="Search"
          />
        </div>
      )}
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  label,
  active,
}: {
  children: ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-violet-50 hover:text-violet-600",
        active && "bg-violet-100 text-violet-600"
      )}
    >
      {children}
    </button>
  );
}

function OptionChip({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition",
        active
          ? "border-violet-300 bg-violet-50 text-violet-700 shadow-sm"
          : "border-violet-100/80 bg-white/70 text-slate-500 hover:border-violet-200 hover:text-violet-600"
      )}
    >
      {icon}
      {label}
    </button>
  );
}


