import { AnimatePresence, motion } from "framer-motion";
import { Check, Info, X } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Toast() {
  const { toasts } = useApp();
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[80] flex flex-col items-end gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-violet-100 bg-white/95 px-3.5 py-2.5 text-[13px] font-medium text-slate-700 shadow-lg shadow-violet-200/50 backdrop-blur-md"
          >
            {t.type === "info" ? (
              <Info className="h-4 w-4 text-sky-500" />
            ) : t.type === "error" ? (
              <X className="h-4 w-4 text-rose-500" />
            ) : (
              <Check className="h-4 w-4 text-emerald-500" />
            )}
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
