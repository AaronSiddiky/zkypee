"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

type Domain = string;

type MessageSummary = {
  id: number;
  from: string;
  subject: string;
  date: string;
};

type Attachment = { filename: string; contentType?: string; size?: number };

type MessageDetail = {
  id: number;
  from: string;
  subject: string;
  date: string;
  textBody?: string;
  htmlBody?: string;
  attachments?: Attachment[];
};

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue] as const;
}

export default function ReceiveEmailPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [domain, setDomain] = useLocalStorage<Domain>("te_domain", "");
  const [login, setLogin] = useLocalStorage<string>("te_login", "");
  const [messages, setMessages] = useState<MessageSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<MessageDetail | null>(null);
  const [polling, setPolling] = useLocalStorage<boolean>("te_poll", true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const address = useMemo(() => (login && domain ? `${login}@${domain}` : ""), [login, domain]);

  const fetchDomains = useCallback(async () => {
    try {
      const res = await fetch("/api/temp-email/domains", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && Array.isArray(data.domains)) {
        setDomains(data.domains);
        if (!domain && data.domains.length) setDomain(data.domains[0]);
      } else {
        throw new Error(data.error || "Failed to fetch domains");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load domains");
    }
  }, [domain, setDomain]);

  const generateLogin = useCallback(() => {
    const rand = Math.random().toString(36).slice(2, 10);
    const stamp = Date.now().toString(36).slice(-4);
    return `z_${rand}${stamp}`;
  }, []);

  const ensureAddress = useCallback(() => {
    if (!login) setLogin(generateLogin());
  }, [login, setLogin, generateLogin]);

  const fetchMessages = useCallback(async () => {
    if (!login || !domain) return;
    try {
      setLoading(true);
      const url = `/api/temp-email/messages?login=${encodeURIComponent(login)}&domain=${encodeURIComponent(domain)}`;
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch messages");
      setMessages(Array.isArray(data.messages) ? data.messages : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, [login, domain]);

  const fetchDetail = useCallback(
    async (id: number) => {
      if (!login || !domain) return;
      try {
        setSelectedId(id);
        setSelectedDetail(null);
        const url = `/api/temp-email/message?login=${encodeURIComponent(login)}&domain=${encodeURIComponent(domain)}&id=${id}`;
        const res = await fetch(url, { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch message");
        setSelectedDetail(data.message as MessageDetail);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to fetch message");
      }
    },
    [login, domain]
  );

  // Initialize from query params if present
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const qLogin = sp.get("login");
    const qDomain = sp.get("domain");
    if (qLogin && !login) setLogin(qLogin);
    if (qDomain && !domain) setDomain(qDomain);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  useEffect(() => {
    if (!login || !domain) return;
    fetchMessages();
  }, [login, domain, fetchMessages]);

  // Polling
  useEffect(() => {
    if (!polling || !login || !domain) return;
    const id = setInterval(fetchMessages, 10000);
    return () => clearInterval(id);
  }, [polling, login, domain, fetchMessages]);

  const copyAddress = useCallback(async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
    } catch {}
  }, [address]);

  const attachmentUrl = useCallback(
    (id: number, filename: string) =>
      `/api/temp-email/download?login=${encodeURIComponent(login)}&domain=${encodeURIComponent(
        domain
      )}&id=${id}&file=${encodeURIComponent(filename)}`,
    [login, domain]
  );

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-white">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900">Receive Emails Online</h1>
          <p className="mt-2 text-neutral-600">Generate a temporary inbox and receive emails for free. No signup. No cost.</p>
        </div>

        {/* Controls */}
        <div className="rounded-2xl border border-neutral-200 p-5 bg-white mb-6">
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-sm text-neutral-600">Alias</label>
              <input
                value={login}
                onChange={(e) => setLogin(e.target.value.trim().toLowerCase())}
                placeholder="random-alias"
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-800"
              />
              <button
                type="button"
                onClick={() => setLogin(generateLogin())}
                className="mt-2 text-xs text-neutral-600 hover:text-neutral-900"
              >
                Generate random
              </button>
            </div>
            <div>
              <label className="text-sm text-neutral-600">Domain</label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-800"
              >
                {domains.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-neutral-600">Actions</label>
              <div className="mt-1 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    ensureAddress();
                    fetchMessages();
                  }}
                  className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-900"
                >
                  Get messages
                </button>
                <button
                  type="button"
                  onClick={copyAddress}
                  disabled={!address}
                  className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm hover:bg-neutral-50 disabled:opacity-50"
                >
                  Copy address
                </button>
                <label className="inline-flex items-center gap-2 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    checked={polling}
                    onChange={(e) => setPolling(e.target.checked)}
                  />
                  Auto‑refresh
                </label>
              </div>
              {address && (
                <div className="mt-2 text-xs text-neutral-600">
                  Your inbox: <span className="font-semibold text-neutral-900">{address}</span>
                </div>
              )}
            </div>
          </div>
          {error && (
            <div className="mt-3 text-sm text-red-600">{error}</div>
          )}
        </div>

        {/* Inbox + Viewer */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 rounded-2xl border border-neutral-200 bg-white overflow-hidden">
            <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
              <div className="text-sm font-medium text-neutral-900">Inbox</div>
              <button
                className="text-xs text-neutral-600 hover:text-neutral-900"
                onClick={fetchMessages}
                disabled={loading}
              >
                Refresh
              </button>
            </div>
            {messages.length === 0 ? (
              <div className="p-6 text-sm text-neutral-600">No messages yet. Send an email to your address to see it here.</div>
            ) : (
              <ul className="divide-y divide-neutral-200">
                {messages.map((m) => (
                  <li key={m.id}>
                    <button
                      onClick={() => fetchDetail(m.id)}
                      className={`w-full text-left px-4 py-3 hover:bg-neutral-50 ${
                        selectedId === m.id ? "bg-neutral-50" : ""
                      }`}
                    >
                      <div className="text-sm font-medium text-neutral-900 truncate">{m.subject || "(no subject)"}</div>
                      <div className="mt-0.5 text-xs text-neutral-600 truncate">{m.from}</div>
                      <div className="mt-0.5 text-[11px] text-neutral-500">{m.date}</div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="lg:col-span-2 rounded-2xl border border-neutral-200 bg-white overflow-hidden">
            <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
              <div className="text-sm font-medium text-neutral-900">Message</div>
              {selectedDetail && (
                <div className="text-xs text-neutral-600">{selectedDetail.subject || "(no subject)"}</div>
              )}
            </div>
            {!selectedDetail ? (
              <div className="p-6 text-sm text-neutral-600">Select a message to view.</div>
            ) : (
              <div className="p-4 space-y-4">
                <div className="text-sm">
                  <div className="text-neutral-900 font-medium">From</div>
                  <div className="text-neutral-700">{selectedDetail.from}</div>
                </div>
                {selectedDetail.attachments && selectedDetail.attachments.length > 0 && (
                  <div className="text-sm">
                    <div className="text-neutral-900 font-medium">Attachments</div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {selectedDetail.attachments.map((a) => (
                        <a
                          key={a.filename}
                          href={attachmentUrl(selectedDetail.id, a.filename)}
                          className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs hover:bg-neutral-50"
                        >
                          {a.filename}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {selectedDetail.htmlBody ? (
                  <iframe
                    ref={iframeRef}
                    title="email"
                    sandbox="allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
                    className="w-full h-[480px] border rounded-md"
                    srcDoc={selectedDetail.htmlBody}
                  />
                ) : (
                  <pre className="whitespace-pre-wrap text-sm text-neutral-800 bg-neutral-50 p-3 rounded-md border">
                    {selectedDetail.textBody || "(no content)"}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
