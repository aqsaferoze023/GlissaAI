import type { ChatOptions, FeatureMode } from "../types";
import { officialBots } from "./bots";

function titleCase(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function makeChatTitle(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "New chat";
  const clipped = clean.length > 42 ? clean.slice(0, 42).trim() + "…" : clean;
  return titleCase(clipped);
}

export function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function match(text: string, keys: string[]) {
  const t = text.toLowerCase();
  return keys.some((k) => t.includes(k));
}

export function generateAIResponse(
  userMessage: string,
  options: ChatOptions & { mode: FeatureMode; botId?: string }
): { content: string; imagePrompt?: string; sources?: { title: string; url: string }[] } {
  const bot = officialBots.find((b) => b.id === options.botId);
  const msg = userMessage.trim();
  const lower = msg.toLowerCase();

  let content = "";
  let imagePrompt: string | undefined;
  let sources: { title: string; url: string }[] | undefined;

  if (match(lower, ["who are you", "your name", "what are you", "who is glissa"])) {
    content = bot
      ? `I'm **${bot.name}**, a specialist bot on Glissa AI — ${bot.tagline.toLowerCase()}. ${bot.description}\n\nAsk me anything in that lane, or hop back to the home screen to pick another bot.`
      : `I'm **Glissa AI**, your all-in-one assistant. I can chat, plan tasks, design, write code, research, and help you write — all in one calm, focused workspace.\n\nPick a mode above, or just ask me anything.`;
  } else if (match(lower, ["hello", "hi ", "hey", "hi!", "hey!", "good morning", "good afternoon"])) {
    content = bot
      ? `${bot.greeting}`
      : `Hello — good to have you here.\n\nI can help you **think**, **make**, and **ship**. Try:\n- Explain a hard idea in simple terms\n- Draft an email or outline\n- Plan a project for the week\n- Write or review a code snippet\n\nWhat would you like to do first?`;
  } else if (match(lower, ["quantum"])) {
    content = `**Quantum computing in simple terms**\n\nClassical computers store bits that are either 0 or 1. Quantum computers use **qubits**, which can be 0, 1, or a blend of both at once (superposition). They can also be linked so that measuring one instantly constrains another (entanglement).\n\nThink of it like this:\n- A classical bit is a coin lying on heads or tails.\n- A qubit is a coin still spinning — it holds many possibilities until you look.\n\nThat extra state-space lets certain problems (factoring, simulation of molecules, some optimization) be attacked far faster *in theory*. In practice, today's machines are noisy and small, so they're research tools more than laptops.\n\n**Why it matters:** drug discovery, cryptography, materials science, and logistics could all shift if fault-tolerant machines arrive.\n\nWant a metaphor-only version, a math-light version, or a comparison with GPUs?`;
  } else if (options.mode === "code" || match(lower, ["code", "react", "typescript", "bug", "function", "api", "python"])) {
    content = `Here's a clean way to approach that.\n\n\`\`\`ts
type Result<T> = { ok: true; data: T } | { ok: false; error: string };

async function loadAssistantReply(prompt: string): Promise<Result<string>> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) return { ok: false, error: await res.text() };
    const data = (await res.json()) as { reply: string };
    return { ok: true, data: data.reply };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
\`\`\`\n\n**Why this shape works**\n- Explicit success/failure instead of throwing across UI layers\n- Easy to swap the mock for a real Glissa endpoint later\n- Keeps the chat view fully presentational\n\nIf you share a snippet or error, I'll tailor the fix.`;
  } else if (options.mode === "writing" || match(lower, ["write", "poem", "email", "essay", "story", "rewrite"])) {
    content = `Here's a draft you can use or push further.\n\n---\n\n**Subject:** A quieter kind of intelligence\n\nGlissa isn't trying to shout over you. It sits beside the work — a research desk, a sketchbook, and a patient editor in one place. Ask a hard question and it answers in full sentences. Ask for a plan and it gives you the next step, not a lecture.\n\nThe best assistants disappear into the craft. That's the idea.\n\n---\n\nI can shift tone (warmer, more formal, more playful), shorten this to a tweet, or turn it into a landing-page hero. What direction?`;
  } else if (options.mode === "design" || match(lower, ["design", "color", "ui", "layout", "palette"])) {
    content = `**Direction: "Lavender Atelier"**\n\nA calm, luminous system that feels like morning light on frosted glass.\n\n**Palette**\n- Canvas: \`#F7F4FF\` / \`#EEF4FF\`\n- Accent: \`#8B6CF6\` (actions) and \`#6D4ED4\` (text emphasis)\n- Support: sky \`#C5DEF8\`, mint \`#D4F5E9\`, blush \`#F8D7EC\`\n- Ink: \`#1E1B4B\`\n\n**Layout**\n- 12-column, max 1120px content, 24px rhythm\n- Cards at 20–28px radius, 1px white border, soft violet shadow\n- One focal orb / illustration per view — never competing hero art\n\n**Type**\n- Plus Jakarta Sans, 800 for display, 500–600 for UI, 400 for body\n\n**Motion**\n- 180–240ms ease-out fades, 4–8px rise, no bounce\n\nI can spec a particular screen (sidebar, empty chat, settings) next — which one?`;
  } else if (options.mode === "tasks" || match(lower, ["plan", "todo", "task", "schedule", "goal"])) {
    content = `**Plan — next 7 days**\n\n**Today**\n1. Define the outcome in one sentence\n2. List the 3 constraints (time, tools, people)\n3. Ship one visible piece in under 90 minutes\n\n**This week**\n- Mon: outline + research dump (45m)\n- Tue: first draft / prototype (90m)\n- Wed: review against constraints (30m)\n- Thu: revise and package (60m)\n- Fri: share, collect 3 notes, park the rest\n\n**Guardrails**\n- If a task takes > 25 minutes, split it\n- No new tools until the first version exists\n- End each day by writing tomorrow's first action\n\nWant me to turn this into a checklist with owners and estimates?`;
  } else if (options.mode === "research" || match(lower, ["research", "explain", "what is", "how does", "compare"])) {
    content = `**Brief**\n\nYou asked: *${msg}*\n\n**Snapshot**\nThis is a fast, structured take — not a substitute for primary sources, but enough to orient you and decide what to read next.\n\n**Key points**\n1. Start from the problem, not the buzzword. What decision does this answer?\n2. Separate *what is known*, *what is debated*, and *what is hype*.\n3. Prefer mechanisms over metaphors when you need to apply the idea.\n4. Write down the counter-argument; if you can't, you don't understand it yet.\n\n**Suggested next reads**\n- A primer from a trusted textbook or docs site\n- One skeptical take\n- One recent primary paper or changelog\n\nI can go deeper on any bullet, or produce a one-page memo.`;
  } else {
    content = `Here's a thoughtful take on that.\n\n**What I heard:** ${msg.length > 180 ? msg.slice(0, 180) + "…" : msg}\n\n**A useful way to think about it**\n- Clarify the outcome you actually want (decision, draft, plan, or explanation)\n- Name the constraints — time, audience, tone, tools\n- Produce a small version first, then refine\n\n**A first pass**\n${bot ? `As ${bot.name}, I'd start by framing this in my lane (${bot.tagline}). ` : ""}Break the request into a question you can answer in 10 minutes, a piece you can draft in 30, and a follow-up that needs sources or feedback.\n\nIf you tell me the audience and the deadline, I'll make this concrete — a checklist, a draft, or a worked example.`;
  }

  if (options.deepResearch) {
    content += `\n\n---\n**Deep Research**\nI cross-checked this against typical consensus in the field, noted where experts disagree, and flagged what's still unsettled. For a live literature pass, connect a research backend — the layout is already wired for citations.`;
    sources = [
      { title: "Stanford CS primer — foundations", url: "https://example.com/primer" },
      { title: "Nature review: open questions", url: "https://example.com/review" },
      { title: "Glissa Research Notes", url: "https://example.com/glissa" },
    ];
  }

  if (options.webSearch) {
    content += `\n\n**Web search (simulated)**\nTop results mention recent docs, community threads, and a couple of strong tutorials. Treat URLs as placeholders until a live search API is connected.`;
    sources = sources ?? [
      { title: "Docs overview", url: "https://example.com/docs" },
      { title: "Community guide", url: "https://example.com/guide" },
    ];
  }

  if (options.makeImage) {
    imagePrompt = msg;
    content =
      `I generated a visual from your prompt.\n\n> ${msg}\n\nThe composition leans into soft lavender light, glass, and a quiet futuristic mood — in line with Glissa's look. You can regenerate for a different crop or mood.\n\n` +
      content;
  }

  return { content, imagePrompt, sources };
}
