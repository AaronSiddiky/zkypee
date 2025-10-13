"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CREDIT_PACKAGES, COST_PER_MINUTE } from "@/lib/stripe";
import { useAuth } from "@/contexts/AuthContext";
import Auth from "@/components/Auth";
import { motion } from "framer-motion";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";

export default function BuyCreditsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const supabase = useMemo(() => createClientComponentClient<Database>(), []);

  // Auth modal state
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) setAuthOpen(true);
  }, [authLoading, user]);

  useEffect(() => {
    const loadBalance = async () => {
      if (!user) return;
      try {
        setBalanceLoading(true);
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const res = await fetch("/api/credits/balance", {
          headers: session?.access_token
            ? { Authorization: `Bearer ${session.access_token}` }
            : undefined,
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) setBalance(data.creditBalance ?? 0);
        else setBalance(0);
      } catch {
        setBalance(0);
      } finally {
        setBalanceLoading(false);
      }
    };
    loadBalance();
  }, [user, supabase]);

  const handlePurchase = async (packageId: string) => {
    try {
      setIsProcessing(true);
      setSelectedPackage(packageId);

      if (!user) {
        setError("Please sign in to purchase credits");
        setAuthOpen(true);
        return;
      }

      const response = await fetch("/api/credits/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error("Error creating checkout session:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsProcessing(false);
      setSelectedPackage(null);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full text-center"
        >
          <h1 className="text-3xl font-bold text-neutral-900 mb-3">
            Sign in to Purchase Credits
          </h1>
          <p className="text-neutral-600 mb-6">
            Use your Zkypee account to continue.
          </p>
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="inline-flex items-center rounded-full bg-black text-white px-6 py-3 text-sm font-semibold hover:bg-neutral-900"
          >
            Sign in
          </button>
        </motion.div>

        <Auth
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          initialMode="signin"
          onSuccess={() => {
            setAuthOpen(false);
            router.refresh();
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 mb-3">
            Add Credits
          </h1>
          <p className="text-base text-neutral-600">
            Choose a package. Payments are processed securely.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Balance panel */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-neutral-600">Current balance</div>
                <div className="mt-1 text-3xl font-bold text-neutral-900">
                  {balanceLoading ? "—" : (balance ?? 0).toFixed(2)}
                  <span className="ml-2 text-base font-medium text-neutral-500">credits</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-neutral-600">Estimated minutes</div>
                <div className="mt-1 text-xl font-semibold text-neutral-900">
                  {balanceLoading ? "—" : ((balance ?? 0) / COST_PER_MINUTE).toFixed(0)} min
                </div>
                <div className="text-xs text-neutral-500">at ${(COST_PER_MINUTE).toFixed(2)}/min</div>
              </div>
            </div>
          </div>

          {/* Packages */}
          <div className="grid md:grid-cols-3 gap-6">
            {CREDIT_PACKAGES.map((pkg) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl p-6 cursor-pointer border border-neutral-200 shadow-sm"
                onClick={() => handlePurchase(pkg.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                      {pkg.credits} Credits
                    </h3>
                    <p className="text-neutral-600">
                      {pkg.credits === 100
                        ? "Perfect for occasional calls"
                        : pkg.credits === 300
                        ? "Most popular option"
                        : "Best value for heavy users"}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-neutral-900">
                      ${pkg.amount}
                    </div>
                    <div className="text-neutral-500 text-sm">
                      ${(pkg.amount / pkg.credits).toFixed(2)}/credit
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className={`mt-4 w-full bg-black text-white py-3 rounded-lg font-medium transition-all ${
                    isProcessing && selectedPackage === pkg.id
                      ? "opacity-75 cursor-not-allowed"
                      : "hover:bg-neutral-900"
                  }`}
                  disabled={isProcessing && selectedPackage === pkg.id}
                >
                  {isProcessing && selectedPackage === pkg.id ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    "Purchase Now"
                  )}
                </button>
              </motion.div>
            ))}
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-center">{error}</p>
            </div>
          )}

          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Why buy credits?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-neutral-800 mb-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">Cost‑effective</h3>
                <p className="text-neutral-600">Pay only for what you use with a flexible credit system.</p>
              </div>
              <div>
                <div className="text-neutral-800 mb-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">Instant access</h3>
                <p className="text-neutral-600">Credits are added to your account moments after payment.</p>
              </div>
              <div>
                <div className="text-neutral-800 mb-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">Secure payments</h3>
                <p className="text-neutral-600">Transactions are processed by Stripe with industry‑standard security.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keep the modal mounted so we can open it from anywhere if needed */}
      <Auth
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode="signin"
        onSuccess={() => {
          setAuthOpen(false);
          router.refresh();
        }}
      />
    </div>
  );
}