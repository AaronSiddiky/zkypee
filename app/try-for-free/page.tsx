"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { TwilioProvider } from "@/contexts/TwilioContext";
import { useTwilio } from "@/contexts/TwilioContext";
import PhoneDialer from "@/components/PhoneDialer";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

function TrialStarter() {
  const { user } = useAuth();
  const router = useRouter();
  const {
    isReady,
    isConnecting,
    isConnected,
    initializeTrialMode,
    trialCallsRemaining,
    isTrialMode,
    error,
    resetError,
  } = useTwilio();

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  const siteKey = useMemo(() => process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "", []);

  const onCaptchaChange = useCallback((token: string | null) => {
    setCaptchaToken(token);
    if (!token) resetError();
  }, [resetError]);

  const startTrial = useCallback(async () => {
    if (!captchaToken) return;
    setStarting(true);
    resetError();
    try {
      const ok = await initializeTrialMode(captchaToken);
      if (!ok) {
        // reset so user can retry verification
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
      }
    } finally {
      setStarting(false);
    }
  }, [captchaToken, initializeTrialMode, resetError]);

  useEffect(() => {
    if (user) {
      router.replace("/calling");
    }
  }, [user, router]);

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900">
            Try Zkypee Free
          </h1>
          <p className="mt-3 text-neutral-600">
            Place a quick outbound call with our secure trial. Human verification is required.
            No credit card. Trial calls are time-limited.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 p-5 bg-white">
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-semibold text-neutral-900">Step 1 · Human verification</h2>
              <p className="text-sm text-neutral-600">Complete the CAPTCHA to enable your free call.</p>
            </div>

            <div className="pt-1">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={siteKey}
                onChange={onCaptchaChange}
              />
            </div>

            <div>
              <button
                onClick={startTrial}
                disabled={!captchaToken || starting}
                className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
              >
                {starting ? "Starting…" : "Start free trial"}
              </button>
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
              <p className="mt-2 text-xs text-neutral-500">
                By continuing you agree to our Terms. We use device fingerprint, IP, rate limits, and fraud checks
                to protect the free tier.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 p-5 bg-white">
          <h2 className="text-base font-semibold text-neutral-900">What you get</h2>
          <ul className="mt-3 space-y-2 text-sm text-neutral-700">
            <li>• One short outbound call to evaluate audio quality</li>
            <li>• Access to our modern web dialer UI</li>
            <li>• Upgrade anytime to unlock full features</li>
          </ul>
        </div>

        
      </div>

      <div className="space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl border border-neutral-200 bg-white shadow-sm overflow-hidden"
        >
          <div className="p-4 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-neutral-900">Trial Status</div>
                <div className="text-xs text-neutral-500">
                  {isTrialMode ? "Trial enabled" : "Awaiting verification"}
                </div>
              </div>
              <div className="text-xs text-neutral-600">
                Remaining: <span className="font-semibold">{trialCallsRemaining}</span>
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <div className="flex items-center justify-between text-xs text-neutral-600">
                <span>Device</span>
                <span className="font-medium">{isReady ? "Ready" : isConnecting ? "Connecting…" : "Idle"}</span>
              </div>
            </div>
            <div className="mt-4">
              {isTrialMode && isReady ? (
                <PhoneDialer user={null} loading={false} />
              ) : (
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-center text-sm text-neutral-600">
                  Complete verification to enable the dialer.
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="text-xs text-neutral-500">
          Need full access? <a href="/signup" className="underline underline-offset-2">Create an account</a>
        </div>
      </div>
    </div>
  );
}

export default function TryForFreePage() {
  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-white">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <TwilioProvider>
          <TrialStarter />
        </TwilioProvider>
      </section>
    </main>
  );
}
