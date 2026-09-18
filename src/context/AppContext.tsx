import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  Attachment,
  Chat,
  ChatOptions,
  FeatureMode,
  Message,
  Toast,
  UserProfile,
  View,
} from "../types";
import { delay, generateAIResponse, makeChatTitle } from "../data/ai";
import { officialBots } from "../data/bots";
import {
  GUEST_EMAIL,
  clearUserHistory,
  defaultSettings,
  encodePass,
  getAccounts,
  getGuestSeen,
  getSession,
  loadChats,
  loadProfile,
  loadSettings,
  loadTopics,
  makeAvatar,
  saveAccounts,
  saveChats,
  saveProfile,
  saveSettings,
  saveTopics,
  seedDemoAccount,
  setGuestSeen,
  setSession,
  type AppSettings,
  type SearchTopic,
} from "../lib/storage";

export type AuthMode = "signin" | "signup";

interface AppContextValue {
  view: View;
  setView: (v: View) => void;
  chats: Chat[];
  activeChatId: string | null;
  activeChat: Chat | null;
  setActiveChatId: (id: string | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  isTyping: boolean;
  streamingContent: string;
  featureMode: FeatureMode;
  setFeatureMode: (m: FeatureMode) => void;
  options: ChatOptions;
  setOptions: React.Dispatch<React.SetStateAction<ChatOptions>>;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  toasts: Toast[];
  pushToast: (message: string, type?: Toast["type"]) => void;
  selectedBotId: string | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  proOpen: boolean;
  setProOpen: (v: boolean) => void;
  userMenuOpen: boolean;
  setUserMenuOpen: (v: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (v: boolean) => void;
  sendMessage: (text: string, attachments?: Attachment[]) => Promise<void>;
  regenerate: () => Promise<void>;
  stopGenerating: () => void;
  newChat: () => void;
  deleteChat: (id: string) => void;
  renameChat: (id: string, title: string) => void;
  openChat: (id: string) => void;
  toggleLike: (messageId: string) => void;
  toggleDislike: (messageId: string) => void;
  copyMessage: (content: string) => void;
  startBotChat: (botId: string) => void;
  goHome: () => void;
  isAuthenticated: boolean;
  authOpen: boolean;
  setAuthOpen: (v: boolean) => void;
  authMode: AuthMode;
  setAuthMode: (m: AuthMode) => void;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => void;
  continueAsGuest: () => void;
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;
  searchTopics: SearchTopic[];
  addSearchTopic: (query: string, chatId?: string) => void;
  deleteTopic: (id: string) => void;
  clearHistory: () => void;
  submitSearch: (query: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const guestUser: UserProfile = {
  name: "Guest",
  email: GUEST_EMAIL,
  plan: "Free",
  avatar: makeAvatar("Guest", GUEST_EMAIL),
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>("home");
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [featureMode, setFeatureMode] = useState<FeatureMode>("chat");
  const [options, setOptions] = useState<ChatOptions>({
    deepResearch: false,
    makeImage: false,
    webSearch: false,
  });
  const [user, setUser] = useState<UserProfile>(guestUser);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [proOpen, setProOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [searchTopics, setSearchTopics] = useState<SearchTopic[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const abortRef = useRef(false);
  const chatsRef = useRef(chats);
  chatsRef.current = chats;
  const activeRef = useRef(activeChatId);
  activeRef.current = activeChatId;
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const modeRef = useRef(featureMode);
  modeRef.current = featureMode;
  const botRef = useRef(selectedBotId);
  botRef.current = selectedBotId;
  const userRef = useRef(user);
  userRef.current = user;
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const topicsRef = useRef(searchTopics);
  topicsRef.current = searchTopics;
  const skipSaveRef = useRef(false);

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeChatId) ?? null,
    [chats, activeChatId]
  );

  const pushToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = uid();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const loadUserData = useCallback((email: string, profile: UserProfile, authed: boolean) => {
    skipSaveRef.current = true;
    const s = loadSettings(email);
    setSettings(s);
    setUser(loadProfile(email, profile));
    if (s.saveHistory) {
      setChats(loadChats(email));
      setSearchTopics(loadTopics(email));
    } else {
      setChats([]);
      setSearchTopics([]);
    }
    setIsAuthenticated(authed);
    setActiveChatId(null);
    setView("home");
  }, []);

  useEffect(() => {
    seedDemoAccount();
    const session = getSession();
    if (session) {
      const acc = getAccounts().find((a) => a.email === session);
      if (acc) {
        loadUserData(acc.email, {
          name: acc.name,
          email: acc.email,
          plan: acc.plan,
          avatar: acc.avatar,
        }, true);
        setHydrated(true);
        return;
      }
    }
    loadUserData(GUEST_EMAIL, guestUser, false);
    if (!getGuestSeen()) setAuthOpen(true);
    setHydrated(true);
  }, [loadUserData]);

  useEffect(() => {
    if (!hydrated) return;
    if (skipSaveRef.current) {
      skipSaveRef.current = false;
      return;
    }
    if (settings.saveHistory) {
      saveChats(user.email, chats);
    }
  }, [chats, hydrated, settings.saveHistory, user.email]);

  useEffect(() => {
    if (!hydrated) return;
    if (settings.saveHistory) saveTopics(user.email, searchTopics);
  }, [searchTopics, hydrated, settings.saveHistory, user.email]);

  useEffect(() => {
    if (!hydrated) return;
    saveSettings(user.email, settings);
  }, [settings, hydrated, user.email]);

  useEffect(() => {
    if (!hydrated) return;
    saveProfile(user.email, user);
    if (isAuthenticated) {
      const accounts = getAccounts().map((a) =>
        a.email === user.email ? { ...a, name: user.name, avatar: user.avatar } : a
      );
      saveAccounts(accounts);
    }
  }, [user, hydrated, isAuthenticated]);

  const addSearchTopic = useCallback((query: string, chatId?: string) => {
    const q = query.replace(/\s+/g, " ").trim();
    if (!q) return;
    setSearchTopics((prev) => {
      const without = prev.filter((t) => t.query.toLowerCase() !== q.toLowerCase());
      const next: SearchTopic[] = [
        { id: uid(), query: q, createdAt: Date.now(), chatId },
        ...without,
      ].slice(0, 40);
      return next;
    });
  }, []);

  const submitSearch = useCallback(
    (query: string) => {
      const q = query.trim();
      if (!q) return;
      addSearchTopic(q);
      setSearchQuery(q);
      const match = chatsRef.current.find((c) => c.title.toLowerCase().includes(q.toLowerCase()));
      if (match) {
        setActiveChatId(match.id);
        setSelectedBotId(match.botId ?? null);
        setView("chat");
      } else {
        setView("history");
      }
    },
    [addSearchTopic]
  );

  const deleteTopic = useCallback((id: string) => {
    setSearchTopics((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setChats([]);
    setSearchTopics([]);
    setActiveChatId(null);
    clearUserHistory(userRef.current.email);
    setView("home");
    pushToast("History cleared");
  }, [pushToast]);

  const updateSettings = useCallback(
    (patch: Partial<AppSettings>) => {
      setSettings((s) => {
        const next = { ...s, ...patch };
        if (patch.saveHistory === false) {
          pushToast("History will no longer be saved", "info");
        }
        if (patch.saveHistory === true) {
          pushToast("Saving chats and search topics on this device");
        }
        return next;
      });
    },
    [pushToast]
  );

  const signIn = useCallback(async (email: string, password: string) => {
    const em = email.trim().toLowerCase();
    if (!em || !em.includes("@")) return { ok: false, error: "Enter a valid email." };
    if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
    const acc = getAccounts().find((a) => a.email === em);
    if (!acc || acc.password !== encodePass(password)) {
      return { ok: false, error: "Email or password is incorrect." };
    }
    setSession(em);
    setGuestSeen();
    loadUserData(
      acc.email,
      { name: acc.name, email: acc.email, plan: acc.plan, avatar: acc.avatar },
      true
    );
    setAuthOpen(false);
    pushToast(`Welcome back, ${acc.name.split(" ")[0]}`);
    return { ok: true };
  }, [loadUserData, pushToast]);

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      const em = email.trim().toLowerCase();
      const nm = name.trim();
      if (nm.length < 2) return { ok: false, error: "Please enter your name." };
      if (!em || !em.includes("@")) return { ok: false, error: "Enter a valid email." };
      if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
      const accounts = getAccounts();
      if (accounts.some((a) => a.email === em)) {
        return { ok: false, error: "An account with that email already exists." };
      }
      const acc = {
        id: uid(),
        name: nm,
        email: em,
        password: encodePass(password),
        plan: "Free",
        avatar: makeAvatar(nm, em),
        createdAt: Date.now(),
      };
      saveAccounts([...accounts, acc]);
      const guestChats = settingsRef.current.saveHistory ? loadChats(GUEST_EMAIL) : [];
      const guestTopics = settingsRef.current.saveHistory ? loadTopics(GUEST_EMAIL) : [];
      const currentChats = chatsRef.current.length ? chatsRef.current : guestChats;
      const currentTopics = topicsRef.current.length ? topicsRef.current : guestTopics;
      saveChats(em, currentChats);
      saveTopics(em, currentTopics);
      saveSettings(em, settingsRef.current);
      setSession(em);
      setGuestSeen();
      loadUserData(em, { name: acc.name, email: acc.email, plan: acc.plan, avatar: acc.avatar }, true);
      setAuthOpen(false);
      pushToast("Account created — your history is saved");
      return { ok: true };
    },
    [loadUserData, pushToast]
  );

  const signOut = useCallback(() => {
    setSession(null);
    setGuestSeen();
    loadUserData(GUEST_EMAIL, guestUser, false);
    pushToast("Signed out", "info");
    setAuthMode("signin");
  }, [loadUserData, pushToast]);

  const continueAsGuest = useCallback(() => {
    setGuestSeen();
    setAuthOpen(false);
    if (!isAuthenticated) {
      setIsAuthenticated(false);
      setUser((u) => (u.email === GUEST_EMAIL ? u : guestUser));
    }
  }, [isAuthenticated]);

  const streamText = useCallback(async (full: string) => {
    abortRef.current = false;
    setStreamingContent("");
    const tokens = full.split(/(\s+)/);
    let acc = "";
    for (let i = 0; i < tokens.length; i++) {
      if (abortRef.current) break;
      acc += tokens[i];
      setStreamingContent(acc);
      const pause = tokens[i].includes("\n") ? 28 : 8 + Math.random() * 16;
      await delay(pause);
    }
    return acc;
  }, []);

  const runAssistant = useCallback(
    async (chatId: string, userText: string) => {
      setIsTyping(true);
      setStreamingContent("");
      await delay(420 + Math.random() * 380);
      if (abortRef.current) {
        setIsTyping(false);
        return;
      }
      const result = generateAIResponse(userText, {
        ...optionsRef.current,
        mode: modeRef.current,
        botId: botRef.current ?? undefined,
      });
      const streamed = await streamText(result.content);
      const assistant: Message = {
        id: uid(),
        role: "assistant",
        content: streamed || result.content,
        timestamp: Date.now(),
        imagePrompt: result.imagePrompt,
        sources: result.sources,
        botId: botRef.current ?? undefined,
      };
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? { ...c, messages: [...c.messages, assistant], updatedAt: Date.now() }
            : c
        )
      );
      setIsTyping(false);
      setStreamingContent("");
    },
    [streamText]
  );

  const sendMessage = useCallback(
    async (text: string, attachments?: Attachment[]) => {
      const trimmed = text.trim();
      if (!trimmed && !attachments?.length) return;
      abortRef.current = false;

      let chatId = activeRef.current;
      if (!chatId) {
        chatId = uid();
        const chat: Chat = {
          id: chatId,
          title: makeChatTitle(trimmed || "New chat"),
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          botId: botRef.current ?? undefined,
        };
        setChats((prev) => [chat, ...prev]);
        setActiveChatId(chatId);
      }

      const userMsg: Message = {
        id: uid(),
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
        attachments,
      };

      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? {
                ...c,
                title: c.messages.length === 0 ? makeChatTitle(trimmed) : c.title,
                messages: [...c.messages, userMsg],
                updatedAt: Date.now(),
              }
            : c
        )
      );
      addSearchTopic(trimmed, chatId);
      setView("chat");
      setSidebarOpen(false);
      await runAssistant(chatId, trimmed);
    },
    [runAssistant, addSearchTopic]
  );

  const regenerate = useCallback(async () => {
    const chat = chatsRef.current.find((c) => c.id === activeRef.current);
    if (!chat) return;
    const lastUser = [...chat.messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    abortRef.current = false;
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chat.id) return c;
        const msgs = [...c.messages];
        if (msgs.length && msgs[msgs.length - 1].role === "assistant") msgs.pop();
        return { ...c, messages: msgs, updatedAt: Date.now() };
      })
    );
    await runAssistant(chat.id, lastUser.content);
  }, [runAssistant]);

  const stopGenerating = useCallback(() => {
    abortRef.current = true;
    setIsTyping(false);
    setStreamingContent("");
  }, []);

  const newChat = useCallback(() => {
    abortRef.current = true;
    setIsTyping(false);
    setStreamingContent("");
    setActiveChatId(null);
    setSelectedBotId(null);
    setFeatureMode("chat");
    setView("home");
    setSidebarOpen(false);
    requestAnimationFrame(() => {
      document.getElementById("glissa-input")?.focus();
    });
  }, []);

  const goHome = useCallback(() => {
    abortRef.current = true;
    setIsTyping(false);
    setStreamingContent("");
    setActiveChatId(null);
    setSelectedBotId(null);
    setView("home");
    setSidebarOpen(false);
  }, []);

  const deleteChat = useCallback(
    (id: string) => {
      setChats((prev) => prev.filter((c) => c.id !== id));
      setSearchTopics((prev) => prev.filter((t) => t.chatId !== id));
      if (activeRef.current === id) {
        setActiveChatId(null);
        setView("home");
      }
      pushToast("Chat deleted");
    },
    [pushToast]
  );

  const renameChat = useCallback((id: string, title: string) => {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
  }, []);

  const openChat = useCallback((id: string) => {
    setActiveChatId(id);
    const chat = chatsRef.current.find((c) => c.id === id);
    setSelectedBotId(chat?.botId ?? null);
    setView("chat");
    setSidebarOpen(false);
  }, []);

  const toggleLike = useCallback((messageId: string) => {
    setChats((prev) =>
      prev.map((c) => ({
        ...c,
        messages: c.messages.map((m) =>
          m.id === messageId ? { ...m, liked: !m.liked, disliked: false } : m
        ),
      }))
    );
  }, []);

  const toggleDislike = useCallback((messageId: string) => {
    setChats((prev) =>
      prev.map((c) => ({
        ...c,
        messages: c.messages.map((m) =>
          m.id === messageId ? { ...m, disliked: !m.disliked, liked: false } : m
        ),
      }))
    );
  }, []);

  const copyMessage = useCallback(
    async (content: string) => {
      try {
        await navigator.clipboard.writeText(content);
        pushToast("Copied to clipboard");
      } catch {
        pushToast("Couldn't copy", "error");
      }
    },
    [pushToast]
  );

  const startBotChat = useCallback((botId: string) => {
    const bot = officialBots.find((b) => b.id === botId);
    if (!bot) return;
    abortRef.current = true;
    const chatId = uid();
    const greeting: Message = {
      id: uid(),
      role: "assistant",
      content: bot.greeting,
      timestamp: Date.now(),
      botId,
    };
    const chat: Chat = {
      id: chatId,
      title: `Chat with ${bot.name}`,
      messages: [greeting],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      botId,
    };
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(chatId);
    setSelectedBotId(botId);
    setView("chat");
    setSidebarOpen(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        document.getElementById("glissa-search")?.focus();
      }
      if (meta && e.key.toLowerCase() === "n") {
        e.preventDefault();
        newChat();
      }
      if (e.key === "Escape") {
        setUserMenuOpen(false);
        setNotificationsOpen(false);
        setProOpen(false);
        setSidebarOpen(false);
        if (getGuestSeen()) setAuthOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [newChat]);

  const value: AppContextValue = {
    view,
    setView,
    chats,
    activeChatId,
    activeChat,
    setActiveChatId,
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
    isTyping,
    streamingContent,
    featureMode,
    setFeatureMode,
    options,
    setOptions,
    user,
    setUser,
    toasts,
    pushToast,
    selectedBotId,
    searchQuery,
    setSearchQuery,
    proOpen,
    setProOpen,
    userMenuOpen,
    setUserMenuOpen,
    notificationsOpen,
    setNotificationsOpen,
    sendMessage,
    regenerate,
    stopGenerating,
    newChat,
    deleteChat,
    renameChat,
    openChat,
    toggleLike,
    toggleDislike,
    copyMessage,
    startBotChat,
    goHome,
    isAuthenticated,
    authOpen,
    setAuthOpen,
    authMode,
    setAuthMode,
    signIn,
    signUp,
    signOut,
    continueAsGuest,
    settings,
    updateSettings,
    searchTopics,
    addSearchTopic,
    deleteTopic,
    clearHistory,
    submitSearch,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
