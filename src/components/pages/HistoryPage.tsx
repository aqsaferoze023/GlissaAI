import { motion } from "framer-motion";
import { Clock, MessageCircle, Trash2 } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function HistoryPage() {
  const { chats, searchTopics, openChat, deleteChat, deleteTopic, clearHistory, searchQuery, submitSearch } =
    useApp();
  const q = searchQuery.trim().toLowerCase();
  const topicList = searchTopics.filter((t) => !q || t.query.toLowerCase().includes(q));
  const chatList = chats.filter((c) => !q || c.title.toLowerCase().includes(q));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="custom-scroll h-full overflow-y-auto px-4 py-4 sm:px-8 sm:py-6"
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 sm:text-[28px]">History</h2>
        <p className="mt-1 text-[14px] text-slate-500">
          Every topic you searched and every chat you started — saved on this device.
        </p>

        <div className="mb-4 mt-6 flex items-center justify-between">
          <p className="text-[13px] text-slate-500">
            {chatList.length} chats · {topicList.length} topics
          </p>
          {(chats.length > 0 || searchTopics.length > 0) && (
            <button
              onClick={clearHistory}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[12.5px] font-semibold text-rose-500 hover:bg-rose-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear all
            </button>
          )}
        </div>

        <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Search topics</h3>
        <div className="mb-6 space-y-1.5">
          {topicList.length === 0 && (
            <p className="rounded-2xl border border-dashed border-violet-100 bg-white/50 px-4 py-6 text-center text-[13px] text-slate-400">
              Topics you search for will appear here.
            </p>
          )}
          {topicList.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white/80 px-3 py-2.5 shadow-sm"
            >
              <button
                onClick={() => submitSearch(t.query)}
                className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50 text-violet-500">
                  <Clock className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13.5px] font-semibold text-slate-800">{t.query}</span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(t.createdAt).toLocaleString([], {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </span>
              </button>
              <button
                onClick={() => deleteTopic(t.id)}
                className="rounded-lg p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-500"
                aria-label="Delete topic"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Chats</h3>
        <div className="space-y-1.5">
          {chatList.length === 0 && (
            <p className="rounded-2xl border border-dashed border-violet-100 bg-white/50 px-4 py-6 text-center text-[13px] text-slate-400">
              Start a conversation and it will be saved here.
            </p>
          )}
          {chatList.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white/80 px-3 py-2.5 shadow-sm"
            >
              <button onClick={() => openChat(c.id)} className="flex min-w-0 flex-1 items-center gap-2.5 text-left">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                  <MessageCircle className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13.5px] font-semibold text-slate-800">{c.title}</span>
                  <span className="text-[11px] text-slate-400">
                    {c.messages.length} messages ·{" "}
                    {new Date(c.updatedAt).toLocaleString([], {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </span>
              </button>
              <button
                onClick={() => deleteChat(c.id)}
                className="rounded-lg p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-500"
                aria-label="Delete chat"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
