"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Building2,
  MessageSquare,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type Topic = "Support" | "Sales" | "Partnerships" | "Other";

export default function ContactPage() {
  const [topic, setTopic] = useState<Topic>("Support");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const emailOk = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email]);
  const messageOk = message.trim().length >= 10;
  const canSubmit = name.trim() && emailOk && messageOk && !loading;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setErrorMsg("");
    setStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, email, topic, message, website }),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Something went wrong");
      }
      setStatus("ok");
      setName("");
      setCompany("");
      setEmail("");
      setMessage("");
      setWebsite("");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-10 sm:pt-24 sm:pb-16">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900"
          >
            Contact Zkypee
          </motion.h1>
          <p className="mt-3 text-neutral-600 text-lg max-w-2xl mx-auto">
            We typically respond within one business day.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="lg:col-span-2"
          >
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)]">
              <form onSubmit={submit} className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {(["Support", "Sales", "Partnerships", "Other"] as Topic[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTopic(t)}
                      className={[
                        "px-3 py-1.5 rounded-full text-sm border transition-colors",
                        topic === t
                          ? "bg-neutral-900 text-white border-neutral-900"
                          : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50",
                      ].join(" ")}
                      aria-pressed={topic === t}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    id="name"
                    icon={<User className="h-4 w-4 text-neutral-500" />}
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                  <Field
                    id="company"
                    icon={<Building2 className="h-4 w-4 text-neutral-500" />}
                    type="text"
                    placeholder="Company (optional)"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    autoComplete="organization"
                  />
                </div>

                <Field
                  id="email"
                  icon={<Mail className="h-4 w-4 text-neutral-500" />}
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  invalid={email.length > 0 && !emailOk}
                />

                <TextArea
                  id="message"
                  icon={<MessageSquare className="h-4 w-4 text-neutral-500" />}
                  placeholder={`How can we help with ${topic.toLowerCase()}?`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  required
                />

                <input
                  type="text"
                  name="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="flex items-center justify-between">
                  <div className="text-xs text-neutral-500">
                    By submitting, you agree to be contacted about your request.
                  </div>
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className={[
                      "inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition-colors",
                      canSubmit ? "hover:bg-black" : "opacity-70 cursor-not-allowed",
                    ].join(" ")}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending
                      </>
                    ) : (
                      <>
                        Send Message
                      </>
                    )}
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {status === "ok" && (
                    <motion.div
                      key="ok"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-800"
                      aria-live="polite"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Thanks—your message has been sent.
                      </div>
                    </motion.div>
                  )}
                  {status === "error" && (
                    <motion.div
                      key="err"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-800"
                      aria-live="polite"
                    >
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {errorMsg || "Something went wrong. Please try again."}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.08 }}
            className="space-y-6"
          >
            <div className="rounded-3xl border border-neutral-200 bg-white p-6">
              <div className="text-sm font-semibold text-neutral-900">Before you write</div>
              <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                <li>
                  Check the <a href="/help" className="text-neutral-900 underline-offset-2 hover:underline">Help Center</a>
                </li>
                <li>
                  View <a href="/status" className="text-neutral-900 underline-offset-2 hover:underline">Service Status</a>
                </li>
                <li>
                  Explore <a href="/features" className="text-neutral-900 underline-offset-2 hover:underline">Features</a> and <a href="/pricing" className="text-neutral-900 underline-offset-2 hover:underline">Pricing</a>
                </li>
              </ul>
            </div>
            <div className="rounded-3xl border border-neutral-200 bg-white p-6">
              <div className="text-sm font-semibold text-neutral-900">What to include</div>
              <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                <li>Your account email and relevant screenshots</li>
                <li>Steps to reproduce issues, if any</li>
                <li>Links or IDs related to the request</li>
              </ul>
            </div>
          </motion.aside>
        </div>
      </section>
    </main>
  );
}

function Field({
  id,
  icon,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
  required,
  invalid,
}: {
  id: string;
  icon: React.ReactNode;
  type: string;
  placeholder?: string;
  value: string | number | readonly string[] | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  required?: boolean;
  invalid?: boolean;
}) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">{placeholder || id}</label>
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
        {icon}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={invalid ? "true" : "false"}
        className={[
          "h-12 w-full rounded-xl border bg-white pl-10 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-shadow focus:ring-4",
          invalid
            ? "border-rose-300 focus:ring-rose-100"
            : "border-neutral-200 focus:ring-black/5",
        ].join(" ")}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="none"
      />
    </div>
  );
}

function TextArea({
  id,
  icon,
  placeholder,
  value,
  onChange,
  rows = 6,
  required,
}: {
  id: string;
  icon: React.ReactNode;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">{placeholder || id}</label>
      <div className="pointer-events-none absolute left-3 top-4">
        {icon}
      </div>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-3 pt-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-shadow focus:ring-4 focus:ring-black/5"
        spellCheck={true}
      />
    </div>
  );
}