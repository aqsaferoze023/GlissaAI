import { AnimatePresence, motion } from "framer-motion";
import { Check, Sparkles, X } from "lucide-react";
import { useApp } from "../context/AppContext";

const perks = [
  "Unlimited chats and longer memory",
  "Priority replies and Deep Research",
  "Image studio and file analysis",
  "Custom bots for your workspace",
  "Shared Spaces for teams",
];

export default function ProModal() {
  const { proOpen, setProOpen, pushToast } = useApp();
  return (
    <AnimatePresence>
      {proOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-indigo-950/30 p-4 backdrop-blur-sm"
          onClick={() => setProOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl"
          >
            <button
              onClick={() => setProOpen(false)}
              className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-400 hover:bg-violet-50 hover:text-slate-700"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-200">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-800">Glissa Pro</h3>
            <p className="mt-1 text-[13.5px] text-slate-500">
              Unlock the full atelier — research, images, and team spaces.
            </p>
            <p className="mt-4 text-3xl font-extrabold text-slate-800">
              $20 <span className="text-base font-semibold text-slate-400">/ month</span>
            </p>
            <ul className="mt-4 space-y-2">
              {perks.map((p) => (
                <li key={p} className="flex items-start gap-2 text-[13.5px] text-slate-600">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
                  {p}
                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                setProOpen(false);
                pushToast("You're already on the Pro demo");
              }}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-[14px] font-semibold text-white shadow-md shadow-violet-200 transition hover:brightness-110"
            >
              Continue with Pro
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
