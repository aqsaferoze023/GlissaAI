import { useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Copy,
  RefreshCw,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import type { Message } from "../types";
import { useApp } from "../context/AppContext";
import { cn } from "../utils/cn";

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function renderInline(text: string, keyPrefix: string) {
  const parts: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("**")) {
      parts.push(
        <strong key={`${keyPrefix}-b-${i}`} className="font-semibold text-indigo-950">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`")) {
      parts.push(
        <code key={`${keyPrefix}-c-${i}`}>{token.slice(1, -1)}</code>
      );
    } else {
      parts.push(
        <em key={`${keyPrefix}-i-${i}`} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    }
    last = m.index + token.length;
    i++;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function RichContent({ content }: { content: string }) {
  const blocks = useMemo(() => {
    const out: { type: "code" | "p"; lang?: string; text: string }[] = [];
    const re = /```(\w+)?\n([\s\S]*?)```/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(content))) {
      if (m.index > last) out.push({ type: "p", text: content.slice(last, m.index) });
      out.push({ type: "code", lang: m[1], text: m[2].replace(/\n$/, "") });
      last = m.index + m[0].length;
    }
    if (last < content.length) out.push({ type: "p", text: content.slice(last) });
    return out;
  }, [content]);

  return (
    <div className="prose-msg text-[13.5px] leading-relaxed text-slate-700 sm:text-[14.5px]">
      {blocks.map((b, i) =>
        b.type === "code" ? (
          <pre key={i}>
            <code>{b.text}</code>
          </pre>
        ) : (
          <div key={i}>
            {b.text.split("\n").map((line, li) => {
              if (line.startsWith("### "))
                return <h3 key={li}>{renderInline(line.slice(4), `${i}-${li}`)}</h3>;
              if (line.startsWith("## "))
                return <h2 key={li}>{renderInline(line.slice(3), `${i}-${li}`)}</h2>;
              if (line.startsWith("# "))
                return <h1 key={li}>{renderInline(line.slice(2), `${i}-${li}`)}</h1>;
              if (line.startsWith("---"))
                return <hr key={li} className="my-3 border-violet-100" />;
              if (line.startsWith("- "))
                return (
                  <div key={li} className="ml-3 flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet-400" />
                    <span>{renderInline(line.slice(2), `${i}-${li}`)}</span>
                  </div>
                );
              if (/^\d+\.\s/.test(line))
                return (
                  <div key={li} className="ml-3">
                    {renderInline(line, `${i}-${li}`)}
                  </div>
                );
              if (line.startsWith("> "))
                return (
                  <blockquote
                    key={li}
                    className="my-2 border-l-2 border-violet-300 pl-3 text-slate-500 italic"
                  >
                    {renderInline(line.slice(2), `${i}-${li}`)}
                  </blockquote>
                );
              if (!line)
                return <div key={li} className="h-2" />;
              return <p key={li}>{renderInline(line, `${i}-${li}`)}</p>;
            })}
          </div>
        )
      )}
    </div>
  );
}

function GeneratedArt({ prompt }: { prompt: string }) {
  return (
    <div className="my-3 overflow-hidden rounded-2xl border border-violet-100 shadow-sm">
      <div
        className="relative h-44 w-full sm:h-56"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(196,181,253,0.95), transparent 50%),
            radial-gradient(ellipse at 80% 30%, rgba(125,211,252,0.8), transparent 45%),
            radial-gradient(ellipse at 50% 80%, rgba(244,114,182,0.55), transparent 50%),
            linear-gradient(135deg, #c4b5fd, #93c5fd 40%, #e9d5ff 80%)
          `,
        }}
      >
        <div className="absolute inset-0 shimmer-bg opacity-30" />
        <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-white/70 px-3 py-2 text-[11px] text-slate-600 backdrop-blur-md">
          <span className="font-semibold text-violet-700">Generated · Glissa AI</span>
          <p className="mt-0.5 line-clamp-2">{prompt}</p>
        </div>
      </div>
    </div>
  );
}

export default function MessageBubble({
  message,
  isLastAssistant,
}: {
  message: Message;
  isLastAssistant?: boolean;
}) {
  const { user, copyMessage, regenerate, toggleLike, toggleDislike, isTyping } = useApp();
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const onCopy = () => {
    copyMessage(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={cn("group flex w-full gap-3", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 text-white shadow-md shadow-violet-200">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
      )}

      <div className={cn("max-w-[min(100%,640px)]", isUser && "flex flex-col items-end")}>
        <div
          className={cn(
            "px-4 py-2.5 shadow-sm",
            isUser
              ? "rounded-2xl rounded-tr-md bg-gradient-to-br from-violet-500 to-indigo-500 text-white"
              : "rounded-2xl rounded-tl-md border border-violet-100/80 bg-white/90 text-slate-700"
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed sm:text-[14.5px]">
              {message.content}
            </p>
          ) : (
            <>
              {message.imagePrompt && <GeneratedArt prompt={message.imagePrompt} />}
              <RichContent content={message.content} />
              {message.sources && message.sources.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {message.sources.map((s) => (
                    <span
                      key={s.url}
                      className="rounded-full border border-violet-100 bg-violet-50 px-2.5 py-0.5 text-[11px] font-medium text-violet-600"
                    >
                      {s.title}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {message.attachments.map((a) => (
                <span
                  key={a.id}
                  className={cn(
                    "rounded-lg px-2 py-1 text-[11px]",
                    isUser ? "bg-white/20" : "bg-violet-50 text-violet-700"
                  )}
                >
                  {a.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div
          className={cn(
            "mt-1 flex items-center gap-1 px-1 text-[10.5px] text-slate-400",
            isUser ? "justify-end" : "justify-start"
          )}
        >
          <span>{formatTime(message.timestamp)}</span>
          {!isUser && (
            <div className="ml-1 flex items-center gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
              <button
                onClick={onCopy}
                className="rounded-md p-1 transition hover:bg-violet-100 hover:text-violet-600"
                aria-label="Copy"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              {isLastAssistant && (
                <button
                  onClick={() => regenerate()}
                  disabled={isTyping}
                  className="rounded-md p-1 transition hover:bg-violet-100 hover:text-violet-600 disabled:opacity-40"
                  aria-label="Regenerate"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                onClick={() => toggleLike(message.id)}
                className={cn(
                  "rounded-md p-1 transition hover:bg-violet-100",
                  message.liked ? "text-violet-600" : "hover:text-violet-600"
                )}
                aria-label="Like"
              >
                <ThumbsUp className="h-3.5 w-3.5" fill={message.liked ? "currentColor" : "none"} />
              </button>
              <button
                onClick={() => toggleDislike(message.id)}
                className={cn(
                  "rounded-md p-1 transition hover:bg-violet-100",
                  message.disliked ? "text-rose-500" : "hover:text-violet-600"
                )}
                aria-label="Dislike"
              >
                <ThumbsDown className="h-3.5 w-3.5" fill={message.disliked ? "currentColor" : "none"} />
              </button>
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <img
          src={user.avatar}
          alt={user.name}
          className="mt-0.5 h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm"
        />
      )}
    </motion.div>
  );
}
