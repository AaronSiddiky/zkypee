"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  X,
  Check,
} from "lucide-react";

type Mode = "signin" | "signup";

export default function Auth({
  open,
  onClose,
  initialMode = "signin",
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  initialMode?: Mode;
  onSuccess?: () => void;
}) {
  const supabase = createClientComponentClient();
  const params = useSearchParams();

  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => setMode(initialMode), [initialMode]);

  const backdropDownRef = useRef(false);
  const downPos = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const pwOk = mode === "signin" ? pw.length >= 1 : pw.length >= 8;
  const canSubmit = emailOk && pwOk && !loading;

  const CARD_MIN_H = 620;

  function getBaseUrl() {
    if (typeof window !== "undefined") return process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    return process.env.NEXT_PUBLIC_BASE_URL || "";
  }

  const handleGoogle = async () => {
    setErr(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${getBaseUrl()}/auth/callback` },
      });
      if (error) throw error;
    } catch (e: any) {
      setErr(e?.message ?? "Google sign-in failed");
      setLoading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setErr(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error: upErr } = await supabase.auth.signUp({
          email,
          password: pw,
          options: {
            emailRedirectTo: `${getBaseUrl()}/auth/callback`,
            data: { name },
          },
        });
        if (upErr) throw upErr;
        const { error: inErr } = await supabase.auth.signInWithPassword({ email, password: pw });
        if (inErr) throw inErr;
        const ref = params.get("ref");
        if (ref) {
          fetch("/api/referral-track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: ref, email }),
          }).catch(() => null);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
        if (error) throw error;
      }
      onSuccess?.();
      onClose();
    } catch (e: any) {
      setErr(e?.message ?? "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const onBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const targetIsBackdrop = e.target === e.currentTarget;
    backdropDownRef.current = targetIsBackdrop;
    downPos.current = targetIsBackdrop ? { x: e.clientX, y: e.clientY } : null;
  };
  const onBackdropMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    const targetIsBackdrop = e.target === e.currentTarget;
    const sel = typeof window !== "undefined" ? window.getSelection()?.toString() : "";
    const hasSelection = !!sel && sel.length > 0;
    if (targetIsBackdrop && backdropDownRef.current && downPos.current && !hasSelection) {
      const dx = e.clientX - downPos.current.x;
      const dy = e.clientY - downPos.current.y;
      const moved = Math.hypot(dx, dy) > 6;
      if (!moved) onClose();
    }
    backdropDownRef.current = false;
    downPos.current = null;
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]" onMouseDown={onBackdropMouseDown} onMouseUp={onBackdropMouseUp}>
          <motion.div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <div className="relative grid h-full place-items-center p-4">
            <motion.div role="dialog" aria-modal="true" initial={{ opacity: 0, y: 10, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.985 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }} className="relative w-[92vw] max-w-[600px]" onClick={(e) => e.stopPropagation()}>
              <div className="rounded-3xl p-[1px] bg-gradient-to-b from-neutral-200/80 to-neutral-100 shadow-[0_40px_110px_-40px_rgba(0,0,0,0.35)]">
                <div className="relative rounded-3xl bg-white" style={{ minHeight: CARD_MIN_H }}>
                  <motion.button type="button" aria-label="Close" onClick={onClose} initial={{ opacity: 0, rotate: -8, scale: 0.95 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 8, scale: 0.95 }} transition={{ duration: 0.18 }} className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-700 hover:text-black hover:bg-neutral-50">
                    <X className="h-5 w-5" />
                  </motion.button>

                  <div className="p-10 h-full">
                    <Segmented mode={mode} onChange={setMode} />

                    <div className="mt-6">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.div key={mode} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                          <h2 className="text-[32px] font-extrabold tracking-tight text-neutral-900">{mode === "signup" ? "Create your account" : "Welcome back"}</h2>
                          <p className="mt-1.5 text-[14px] text-neutral-600">{mode === "signup" ? "Join the modern way to call and text." : "Sign in to continue."}</p>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <AnimatePresence initial={false}>
                      {err && (
                        <motion.div key="error" initial={{ opacity: 0, y: -6, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -6, height: 0 }} className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                          <AlertCircle className="h-4 w-4 mt-[2px]" />
                          <span>{err}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button type="button" onClick={handleGoogle} disabled={loading} whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[14px] font-medium text-neutral-900 hover:bg-neutral-50 transition-colors">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                      Continue with Google
                    </motion.button>

                    <div className="my-8 flex items-center gap-4">
                      <div className="h-px flex-1 bg-neutral-200" />
                      <span className="text-xs text-neutral-500">or continue with email</span>
                      <div className="h-px flex-1 bg-neutral-200" />
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                      <AnimatePresence mode="popLayout" initial={false}>
                        {mode === "signup" && (
                          <motion.div key="name" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.16 }}>
                            <Field icon={<User className="h-5 w-5 text-neutral-500" />} id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" autoComplete="name" required />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <Field icon={<Mail className="h-5 w-5 text-neutral-500" />} id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" required />

                      <div className="relative">
                        <Field
                          icon={<Lock className="h-5 w-5 text-neutral-500" />}
                          id="password"
                          type={showPw ? "text" : "password"}
                          value={pw}
                          onChange={(e) => setPw(e.target.value)}
                          placeholder={mode === "signup" ? "Create a strong password" : "Your password"}
                          autoComplete={mode === "signup" ? "new-password" : "current-password"}
                          required
                          isPassword
                          rightSlot={
                            <button
                              type="button"
                              onClick={() => setShowPw((s) => !s)}
                              aria-label={showPw ? "Hide password" : "Show password"}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-800"
                            >
                              {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          }
                        />
                        {mode === "signup" && <PasswordStrength value={pw} />}
                      </div>

                      {mode === "signin" && (
                        <div className="text-right -mt-1">
                          <a href="/auth/reset-password" className="text-xs text-neutral-600 hover:text-neutral-900">Forgot password?</a>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={!canSubmit}
                        className={["group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors", canSubmit ? "hover:bg-black" : "opacity-70 cursor-not-allowed"].join(" ")}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing…
                          </>
                        ) : mode === "signup" ? (
                          <>
                            Create account <ArrowRight className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Sign in <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </form>

                    <div className="mt-8 text-center text-sm">
                      {mode === "signup" ? (
                        <button onClick={() => setMode("signin")} className="text-neutral-700 hover:text-black">Already have an account? Sign in</button>
                      ) : (
                        <button onClick={() => setMode("signup")} className="text-neutral-700 hover:text-black">Need an account? Create one</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Segmented({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const signInRef = useRef<HTMLButtonElement | null>(null);
  const signUpRef = useRef<HTMLButtonElement | null>(null);
  const [pill, setPill] = useState<{ x: number; w: number }>({ x: 0, w: 0 });

  const measure = () => {
    if (!wrapRef.current || !signInRef.current || !signUpRef.current) return;
    const wrapRect = wrapRef.current.getBoundingClientRect();
    const rect = (mode === "signin" ? signInRef : signUpRef).current!.getBoundingClientRect();
    setPill({ x: rect.left - wrapRect.left, w: rect.width });
  };

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    measure();
  }, [mode]);

  return (
    <div className="flex items-center justify-between">
      <div className="text-[15px] font-semibold tracking-tight">Zkypee</div>
      <div ref={wrapRef} className="relative inline-flex rounded-full border border-neutral-200 bg-white p-1">
        <motion.span layout className="absolute top-1 bottom-1 rounded-full bg-neutral-900" animate={{ x: pill.x, width: pill.w }} transition={{ type: "spring", stiffness: 450, damping: 32 }} />
        <button ref={signInRef} type="button" onClick={() => onChange("signin")} className={`relative z-10 w-28 px-3 py-1.5 text-sm rounded-full transition-colors ${mode === "signin" ? "text-white" : "text-neutral-600 hover:text-neutral-900"}`}>Sign in</button>
        <button ref={signUpRef} type="button" onClick={() => onChange("signup")} className={`relative z-10 w-28 px-3 py-1.5 text-sm rounded-full transition-colors ${mode === "signup" ? "text-white" : "text-neutral-600 hover:text-neutral-900"}`}>Create</button>
      </div>
    </div>
  );
}

function Field({
  icon,
  id,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
  rightSlot,
  isPassword,
}: {
  icon: React.ReactNode;
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  rightSlot?: React.ReactNode;
  isPassword?: boolean;
}) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">{placeholder || id}</label>
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="h-12 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-11 text-[14px] text-neutral-900 placeholder:text-neutral-400 outline-none transition-shadow focus:ring-4 focus:ring-black/5"
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="none"
        data-1p-ignore={isPassword ? "true" : undefined}
      />
      {rightSlot}
    </div>
  );
}

function PasswordStrength({ value }: { value: string }) {
  const { score, label, colorClass, tips } = evaluatePassword(value);
  if (!value) return null;
  return (
    <div className="mt-2">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
          <div className={`h-full transition-all duration-200 ${colorClass}`} style={{ width: `${(Math.max(0, score) / 4) * 100}%` }} />
        </div>
        <span className={`${colorClass.includes("bg-") ? colorClass.replace("bg-", "text-") : "text-neutral-600"} text-xs font-medium`}>{label}</span>
      </div>
      {tips.length > 0 && (
        <ul className="mt-1.5 space-y-1">
          {tips.slice(0, 2).map((t) => (
            <li key={t} className="flex items-center gap-2 text-xs text-neutral-600">
              <Check className="h-3.5 w-3.5 text-neutral-400" />
              {t}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function evaluatePassword(pw: string): { score: 0 | 1 | 2 | 3 | 4; label: string; colorClass: string; tips: string[] } {
  if (!pw) return { score: 0, label: "Very weak", colorClass: "bg-rose-500", tips: [] };
  const length = pw.length;
  const hasLower = /[a-z]/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasNum = /\d/.test(pw);
  const hasSym = /[^A-Za-z0-9]/.test(pw);
  const variety = [hasLower, hasUpper, hasNum, hasSym].filter(Boolean).length;
  const common = /(password|qwerty|abc|123|111|000|letmein|welcome)/i.test(pw);
  const repeat = /(.)\1{2,}/.test(pw);
  const seq = /(0123|1234|2345|abcd|bcde|cdef)/i.test(pw);
  let points = 0;
  if (length >= 8) points += 1;
  if (length >= 12) points += 1;
  if (length >= 16) points += 1;
  points += Math.min(2, variety - 1);
  if (common) points -= 2;
  if (repeat) points -= 1;
  if (seq) points -= 1;
  const score = (Math.max(0, Math.min(4, points)) as 0 | 1 | 2 | 3 | 4);
  const labelMap: Record<number, string> = { 0: "Very weak", 1: "Weak", 2: "Fair", 3: "Strong", 4: "Excellent" };
  const colorMap: Record<number, string> = { 0: "bg-rose-500", 1: "bg-orange-500", 2: "bg-amber-500", 3: "bg-emerald-500", 4: "bg-emerald-600" };
  const tips: string[] = [];
  if (length < 12) tips.push("Use at least 12 characters.");
  if (variety < 3) tips.push("Mix upper/lowercase, numbers, and symbols.");
  if (common) tips.push("Avoid common words or phrases.");
  if (repeat || seq) tips.push("Avoid repeated or sequential characters.");
  return { score, label: labelMap[score], colorClass: colorMap[score], tips };
}