"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  UserRound,
  LogOut,
  CreditCard,
  Phone,
  MessageSquare,
  Video,
  Sparkles,
  Mail,
} from "lucide-react";
import Auth from "@/components/Auth";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!userMenuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [userMenuOpen]);

  const handleLogout = async () => {
    await signOut();
    setUserMenuOpen(false);
  };

  const linkBase =
    "text-sm text-neutral-700 hover:text-black transition-colors";
  const active = (href: string) =>
    pathname === href ? "text-black font-medium" : "";

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all ${
          scrolled
            ? "bg-white/80 backdrop-blur-md border-b border-neutral-200 supports-[backdrop-filter]:bg-white/60"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left: brand + desktop nav */}
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-extrabold tracking-tight">
                Zkypee
              </Link>

              <div className="hidden lg:flex items-center gap-6">
                <Link href="/ai-assistant" className={`${linkBase} ${active("/ai-assistant")}`}>
                  AI Voice Assistant
                </Link>

                {/* Free Tools dropdown */}
                <div className="relative group">
                  <button className={`${linkBase} inline-flex items-center gap-1`}>
                    Free Tools
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <div className="invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150 absolute left-0 top-full mt-2 w-[320px] rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl">
                    <Link
                      href="/receive-sms"
                      className="flex items-start gap-3 rounded-xl px-3 py-3 hover:bg-neutral-50"
                    >
                      <MessageSquare className="h-5 w-5 text-neutral-600 mt-[2px]" />
                      <div>
                        <div className="text-sm text-neutral-900">Receive SMS Online</div>
                        <div className="text-xs text-neutral-500">Free Temporary Phone Number</div>
                      </div>
                    </Link>
                    <Link
                      href="/receive-email"
                      className="flex items-start gap-3 rounded-xl px-3 py-3 hover:bg-neutral-50"
                    >
                      <Mail className="h-5 w-5 text-neutral-600 mt-[2px]" />
                      <div>
                        <div className="text-sm text-neutral-900">Receive Emails Online</div>
                        <div className="text-xs text-neutral-500">Free Temporary Email Address</div>
                      </div>
                    </Link>
                  </div>
                </div>

                <Link href="/credits" className={`${linkBase} ${active("/credits")}`}>
                  Buy Credits
                </Link>
                <Link href="/calling" className={`${linkBase} ${active("/calling")}`}>
                  Calling
                </Link>
                <Link href="/buy-number" className={`${linkBase} ${active("/buy-number")}`}>
                  Buy Number
                </Link>
                <Link href="/about" className={`${linkBase} ${active("/about")}`}>
                  About
                </Link>
                <Link href="/contact" className={`${linkBase} ${active("/contact")}`}>
                  Contact
                </Link>
              </div>
            </div>

            {/* Right: auth + CTA + mobile hamburger */}
            <div className="flex items-center gap-3">
              {/* Desktop auth */}
              <div className="hidden sm:flex items-center">
                {!user ? (
                  <button
                    onClick={() => setShowAuth(true)}
                    className="text-sm text-neutral-700 hover:text-black"
                  >
                    Login
                  </button>
                ) : (
                  <div ref={userMenuRef} className="relative">
                    <button
                      onClick={() => setUserMenuOpen((s) => !s)}
                      className="inline-flex items-center gap-2 text-sm text-neutral-700 hover:text-black"
                    >
                      <UserRound className="h-7 w-7" />
                      <span className="max-w-[150px] truncate">
                        {user.email?.split("@")[0] ?? "Account"}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          userMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-neutral-200 bg-white p-1 shadow-xl"
                        >
                          <Link
                            href="/credits"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-neutral-50"
                          >
                            <CreditCard className="h-4 w-4" /> Buy Credits
                          </Link>
                          <Link
                            href="/earn"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-neutral-50"
                          >
                            <Sparkles className="h-4 w-4" /> Generate Referral Code
                          </Link>
                          <Link
                            href="/add-referral"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-neutral-50"
                          >
                            <Mail className="h-4 w-4" /> Add Referral Code
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-neutral-50"
                          >
                            <LogOut className="h-4 w-4" /> Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* CTA */}
              <Link
                href="/dial"
                className="hidden sm:inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-900"
              >
                <Phone className="h-4 w-4" />
                Try for Free
              </Link>

              {/* Mobile burger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-neutral-100 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[60]" aria-modal="true" role="dialog">
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            {/* Panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.2 }}
              className="absolute left-0 top-0 h-full w-[86%] max-w-[380px] bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-200">
                <Link href="/" onClick={() => setMobileOpen(false)} className="text-lg font-semibold">
                  Zkypee
                </Link>
                <button
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-neutral-100"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="px-4 py-4 space-y-1">
                <Link
                  href="/ai-assistant"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-[15px] hover:bg-neutral-50"
                >
                  <Video className="h-4 w-4" /> AI Voice Assistant
                </Link>

                {/* Free Tools collapsible */}
                <div>
                  <button
                    onClick={() => setMobileToolsOpen((s) => !s)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-[15px] hover:bg-neutral-50"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Free Tools
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        mobileToolsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileToolsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="ml-2 overflow-hidden"
                      >
                        <Link
                          href="/receive-sms"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-neutral-50"
                        >
                          <MessageSquare className="h-4 w-4" /> Receive SMS Online
                        </Link>
                        <Link
                          href="/receive-email"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-neutral-50"
                        >
                          <Mail className="h-4 w-4" /> Receive Emails Online
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  href="/credits"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-[15px] hover:bg-neutral-50"
                >
                  <CreditCard className="h-4 w-4" /> Buy Credits
                </Link>
                <Link
                  href="/calling"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-[15px] hover:bg-neutral-50"
                >
                  <Phone className="h-4 w-4" /> Calling
                </Link>
                <Link
                  href="/buy-number"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-[15px] hover:bg-neutral-50"
                >
                  <Phone className="h-4 w-4" /> Buy Number
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-[15px] hover:bg-neutral-50"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-[15px] hover:bg-neutral-50"
                >
                  Contact
                </Link>
              </div>

              <div className="mt-2 border-t border-neutral-200 px-4 py-4 space-y-3">
                {!user ? (
                  <>
                    <button
                      onClick={() => {
                        setShowAuth(true);
                        setMobileOpen(false);
                      }}
                      className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm hover:bg-neutral-50"
                    >
                      Login
                    </button>
                    <Link
                      href="/dial"
                      onClick={() => setMobileOpen(false)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-900"
                    >
                      <Phone className="h-4 w-4" />
                      Try for Free
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="text-sm text-neutral-600 px-1">
                      Signed in as <span className="font-medium text-neutral-900">{user.email}</span>
                    </div>
                    <button
                      onClick={async () => {
                        await signOut();
                        setMobileOpen(false);
                      }}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm hover:bg-neutral-50"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </>
                )}
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Auth modal (single-file component) */}
      <Auth
        open={showAuth}
        onClose={() => setShowAuth(false)}
        initialMode="signin"
        onSuccess={() => setShowAuth(false)}
      />
    </>
  );
}