import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "./ChatInput";
import { officialBots } from "../data/bots";

export default function ChatWindow() {
  const { activeChat, isTyping, streamingContent, selectedBotId } = useApp();
  const bottomRef = useRef<HTMLDivElement>(null);
  const bot = officialBots.find((b) => b.id === selectedBotId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages.length, isTyping, streamingContent]);

  const messages = activeChat?.messages ?? [];
  const lastAssistantId = [...messages].reverse().find((m) => m.role === "assistant")?.id;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full min-h-0 flex-col"
    >
      <div className="custom-scroll flex-1 overflow-y-auto px-3 py-4 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          {bot && (
            <div className="mb-1 flex items-center justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-3 py-1 text-[12px] font-medium text-violet-600 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Chatting with {bot.name} · {bot.tagline}
              </span>
            </div>
          )}

          {messages.map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              isLastAssistant={m.id === lastAssistantId}
            />
          ))}

          <AnimatePresence>
            {isTyping && streamingContent && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3"
              >
                <div className="generating-avatar mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 text-white shadow-md shadow-violet-200">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div className="max-w-[min(100%,640px)] rounded-2xl rounded-tl-md border border-violet-100/80 bg-white/90 px-4 py-2.5 shadow-sm">
                  <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-slate-700 sm:text-[14.5px]">
                    {streamingContent}
                    <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-violet-400 align-middle" />
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isTyping && !streamingContent && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="shrink-0 border-t border-violet-100/50 bg-white/30 px-3 py-3 backdrop-blur-md sm:px-6 sm:py-4">
        <div className="mx-auto flex justify-center">
          <ChatInput variant="bar" />
        </div>
      </div>
    </motion.div>
  );
}
