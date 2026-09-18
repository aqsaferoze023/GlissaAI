import { Sparkles } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-1">
      <div className="generating-avatar relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 text-white shadow-md shadow-violet-200">
        <Sparkles className="h-3.5 w-3.5" />
      </div>
      <div className="rounded-2xl rounded-tl-md border border-violet-100/80 bg-white/90 px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-violet-400" />
          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-violet-400" />
          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-violet-400" />
        </div>
      </div>
    </div>
  );
}
