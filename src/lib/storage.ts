import type { Chat, UserProfile } from "../types";

export interface Account {
  id: string;
  name: string;
  email: string;
  password: string;
  plan: string;
  avatar: string;
  createdAt: number;
}

export interface AppSettings {
  saveHistory: boolean;
  notifications: boolean;
  safetyFilter: boolean;
}

export interface SearchTopic {
  id: string;
  query: string;
  createdAt: number;
  chatId?: string;
}

const K = {
  accounts: "glissa.accounts",
  session: "glissa.session",
  guestSeen: "glissa.guestSeen",
};

export const defaultSettings: AppSettings = {
  saveHistory: true,
  notifications: true,
  safetyFilter: true,
};

export function makeAvatar(name: string, email: string) {
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
      .replace(/[^A-Z]/g, "") || "G";
  const palette = ["#8b6cf6", "#7c5ce8", "#6366f1", "#0ea5e9", "#10b981", "#f43f5e"];
  let hash = 0;
  for (let i = 0; i < email.length; i++) hash = email.charCodeAt(i) + ((hash << 5) - hash);
  const color = palette[Math.abs(hash) % palette.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" rx="48" fill="${color}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="34" font-weight="700">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode */
  }
}

export function encodePass(s: string) {
  try {
    return btoa(unescape(encodeURIComponent(s)));
  } catch {
    return s;
  }
}

function userKey(email: string) {
  return email.trim().toLowerCase() || "guest";
}

export function getAccounts(): Account[] {
  return read<Account[]>(K.accounts, []);
}

export function saveAccounts(accounts: Account[]) {
  write(K.accounts, accounts);
}

export function seedDemoAccount() {
  const accounts = getAccounts();
  if (accounts.some((a) => a.email === "john@glissa.ai")) return;
  accounts.push({
    id: "demo-john",
    name: "John Smith",
    email: "john@glissa.ai",
    password: encodePass("glissa123"),
    plan: "Pro Plan",
    avatar: "/images/avatar.jpg",
    createdAt: Date.now(),
  });
  saveAccounts(accounts);
}

export function getSession(): string | null {
  return localStorage.getItem(K.session);
}

export function setSession(email: string | null) {
  if (email) localStorage.setItem(K.session, email);
  else localStorage.removeItem(K.session);
}

export function getGuestSeen() {
  return localStorage.getItem(K.guestSeen) === "1";
}

export function setGuestSeen() {
  localStorage.setItem(K.guestSeen, "1");
}

export function loadChats(email: string): Chat[] {
  return read<Chat[]>(`glissa.chats.${userKey(email)}`, []);
}

export function saveChats(email: string, chats: Chat[]) {
  write(`glissa.chats.${userKey(email)}`, chats);
}

export function loadTopics(email: string): SearchTopic[] {
  return read<SearchTopic[]>(`glissa.topics.${userKey(email)}`, []);
}

export function saveTopics(email: string, topics: SearchTopic[]) {
  write(`glissa.topics.${userKey(email)}`, topics);
}

export function loadSettings(email: string): AppSettings {
  return { ...defaultSettings, ...read<Partial<AppSettings>>(`glissa.settings.${userKey(email)}`, {}) };
}

export function saveSettings(email: string, settings: AppSettings) {
  write(`glissa.settings.${userKey(email)}`, settings);
}

export function loadProfile(email: string, fallback: UserProfile): UserProfile {
  const stored = read<Partial<UserProfile>>(`glissa.profile.${userKey(email)}`, {});
  return {
    name: stored.name || fallback.name,
    email: stored.email || fallback.email,
    plan: stored.plan || fallback.plan,
    avatar: stored.avatar || fallback.avatar,
  };
}

export function saveProfile(email: string, profile: UserProfile) {
  write(`glissa.profile.${userKey(email)}`, profile);
}

export function clearUserHistory(email: string) {
  localStorage.removeItem(`glissa.chats.${userKey(email)}`);
  localStorage.removeItem(`glissa.topics.${userKey(email)}`);
}

export const GUEST_EMAIL = "guest@glissa.ai";
