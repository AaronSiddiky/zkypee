"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_-10%,rgba(0,0,0,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_100%_0%,rgba(0,0,0,0.04),transparent)]" />
      </div>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-10 sm:pt-28 sm:pb-16">
        <div className="text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600 shadow-sm">
              Built at Columbia University
            </span>
            <h1 className="mt-6 text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-neutral-900">
              Calling, texting, and video, without the clutter.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-neutral-600 max-w-3xl mx-auto">
              Zkypee is the modern, lightweight replacement for legacy chat apps. Crystal‑clear calls,
              clean transcripts, and no bloat.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/buy-number"
                className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-white font-medium hover:bg-neutral-900 transition-colors"
              >
                Get a Private Number
              </Link>
              <Link
                href="/dial"
                className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-6 py-3 text-neutral-900 font-medium hover:bg-neutral-50 transition-colors"
              >
                Try in Browser
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-12 sm:mt-16"
          >
            <div className="relative mx-auto aspect-video w-full max-w-5xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)]">
              <Image src="/mockup.png" alt="Zkypee interface" fill className="object-cover" priority />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {[
            {
              title: "Video Calls",
              desc: "Sharp, reliable HD video that just works.",
              icon: (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              ),
            },
            {
              title: "Instant Chat",
              desc: "Fast messaging, file sharing, and emojis.",
              icon: (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              ),
            },
            {
              title: "Voice Calls",
              desc: "High‑quality, low‑latency audio.",
              icon: (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              ),
            },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-neutral-600">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold">Save time with AI</h2>
          <p className="mt-3 text-neutral-600">Smart summaries, searchable transcripts, and suggested next steps.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold">Call summaries and next steps</h3>
            <p className="mt-2 text-neutral-600">
              Zkypee AI automatically summarizes calls, then intelligently suggests follow‑ups.
            </p>
            <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-5">
              <div className="text-sm text-neutral-700 font-medium">Call Summary</div>
              <ul className="mt-2 space-y-2 text-sm text-neutral-600">
                <li>• Timeline and deliverables confirmed</li>
                <li>• Client requested extra features</li>
                <li>• Follow‑up scheduled next week</li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold">Automatic transcripts</h3>
            <p className="mt-2 text-neutral-600">Time‑stamped transcripts make search and review effortless.</p>
            <div className="mt-6 space-y-3">
              {[
                { t: "0:01", text: "Hello, this is John speaking." },
                { t: "0:05", text: "Hi John, thanks for taking my call." },
              ].map((r) => (
                <div key={r.t} className="flex items-start gap-3">
                  <div className="w-10 shrink-0 text-xs text-neutral-500">{r.t}</div>
                  <div className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-neutral-800">
                    {r.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}