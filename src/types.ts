export type View =
  | "home"
  | "chat"
  | "bots"
  | "projects"
  | "leaderboard"
  | "creators"
  | "profile"
  | "settings"
  | "feedback"
  | "support"
  | "history";

export type FeatureMode = "chat" | "tasks" | "design" | "code" | "research" | "writing";

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  liked?: boolean;
  disliked?: boolean;
  attachments?: Attachment[];
  imagePrompt?: string;
  sources?: { title: string; url: string }[];
  botId?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  botId?: string;
  pinned?: boolean;
}

export interface Bot {
  id: string;
  name: string;
  tagline: string;
  description: string;
  color: string;
  accent: string;
  icon: string;
  greeting: string;
  personality: string;
}

export interface Toast {
  id: string;
  message: string;
  type?: "success" | "info" | "error";
}

export interface ChatOptions {
  deepResearch: boolean;
  makeImage: boolean;
  webSearch: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  plan: string;
  avatar: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  updated: string;
  color: string;
  chats: number;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  bots: number;
  likes: string;
  color: string;
  specialty: string;
}
