import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Sidebar from "./Sidebar";
import { useApp } from "../context/AppContext";

export default function MobileSidebar() {
  const { sidebarOpen, setSidebarOpen } = useApp();

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-indigo-950/30 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            className="fixed inset-y-0 left-0 z-50 w-[280px] bg-gradient-to-b from-white/95 to-violet-50/95 shadow-2xl backdrop-blur-xl md:hidden"
          >
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-700"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
            <Sidebar onNavigate={() => setSidebarOpen(false)} className="w-full" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
