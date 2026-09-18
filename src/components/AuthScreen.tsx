import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Sparkles, User, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { cn } from "../utils/cn";

export default function AuthScreen() {
  const { authOpen, setAuthOpen, authMode, setAuthMode, signIn, signUp, continueAsGuest, isAuthenticated } =
    useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (authOpen) {
      setError("");
      setBusy(false);
      setShow(false);
    }
  }, [authOpen, authMode]);

  const isSignUp = authMode === "signup";

  const close = () => {
    continueAsGuest();
    setAuthOpen(false);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const result = isSignUp ? await signUp(name, email, password) : await signIn(email, password);
    setBusy(false);
    if (!result.ok) setError(result.error || "Something went wrong");
    else {
      setName("");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <AnimatePresence>
      {authOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto p-4"
        >
          <div className="absolute inset-0 bg-indigo-950/35 backdrop-blur-md" onClick={close} />
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            onClick={(e) => e.stopPropagation()}
            className="relative my-6 w-full max-w-[420px] overflow-hidden rounded-[28px] border border-white/70 bg-white/95 p-6 shadow-2xl shadow-violet-300/40 sm:p-8"
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-400 transition hover:bg-violet-50 hover:text-slate-700"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-5 flex flex-col items-center text-center">
              <div className="relative mb-3 flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-violet-300/40 blur-xl" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-200">
                  <Sparkles className="h-6 w-6" />
                </div>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-800">
                {isSignUp ? "Create your Glissa account" : "Welcome back"}
              </h2>
              <p className="mt-1 text-[13px] text-slate-500">
                {isSignUp
                  ? "Save your chats and search topics across visits."
                  : "Sign in to restore your history on this device."}
              </p>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-1 rounded-2xl bg-violet-50 p-1">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("signin");
                  setError("");
                }}
                className={cn(
                  "rounded-xl py-2 text-[13px] font-semibold transition",
                  !isSignUp ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("signup");
                  setError("");
                }}
                className={cn(
                  "rounded-xl py-2 text-[13px] font-semibold transition",
                  isSignUp ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                Sign up
              </button>
            </div>

            <form onSubmit={submit} className="space-y-3">
              {isSignUp && (
                <Field
                  icon={<User className="h-4 w-4" />}
                  label="Name"
                  value={name}
                  onChange={setName}
                  placeholder="Ada Lovelace"
                  autoComplete="name"
                />
              )}
              <Field
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@email.com"
                autoComplete="email"
              />
              <label className="block">
                <span className="mb-1 block text-[12px] font-semibold text-slate-500">Password</span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={show ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    className="h-11 w-full rounded-xl border border-violet-100 bg-white pl-10 pr-11 text-[13.5px] outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-violet-50 hover:text-violet-600"
                    aria-label={show ? "Hide password" : "Show password"}
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              {error && (
                <p className="rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] font-medium text-rose-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="mt-1 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-[14px] font-semibold text-white shadow-md shadow-violet-200 transition hover:brightness-110 disabled:opacity-60"
              >
                {busy ? "Please wait…" : isSignUp ? "Create account" : "Sign in"}
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                setAuthMode("signin");
                setEmail("john@glissa.ai");
                setPassword("glissa123");
                setError("");
              }}
              className="mt-4 w-full text-center text-[11.5px] text-slate-400 transition hover:text-violet-600"
            >
              Demo: <span className="font-semibold text-violet-500">john@glissa.ai</span> /{" "}
              <span className="font-semibold text-violet-500">glissa123</span>
              <span className="block text-[10.5px] text-slate-400">Click to fill</span>
            </button>

            <button
              type="button"
              onClick={close}
              className="mt-2 w-full py-2 text-[13px] font-semibold text-slate-500 transition hover:text-violet-600"
            >
              {isAuthenticated ? "Close" : "Continue as guest"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-semibold text-slate-500">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
        <input
          type={type}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-11 w-full rounded-xl border border-violet-100 bg-white pl-10 pr-3 text-[13.5px] outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
        />
      </div>
    </label>
  );
}
