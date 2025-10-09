"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import Auth from "../../components/Auth";
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function AIAssistantPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [callStatus, setCallStatus] = useState<
    "idle" | "scheduled" | "in-progress" | "completed" | "failed"
  >("idle");
  const [callResult, setCallResult] = useState<{
    callId?: string;
    recording?: string | null;
    transcript?: string | null;
    summary?: string | null;
  } | null>(null);
  const [error, setError] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("Cailee (Female)");
  const [twilioNumber, setTwilioNumber] = useState<string | null>(null);
  const [showVoices, setShowVoices] = useState(false);

  // Auth modal state
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) setAuthOpen(true);
  }, [loading, user]);

  // Loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#00AFF0]">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 flex items-center space-x-4">
          <svg
            className="animate-spin h-5 w-5 text-blue-500"
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-gray-900 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  // Gate: if unauthenticated, show CTA + Auth modal
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#00AFF0]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full text-center bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30"
        >
          <h1 className="text-3xl font-bold text-white mb-3">
            Sign in to Access AI Assistant
          </h1>
          <p className="text-white/80 mb-6">
            Use your Zkypee account to continue.
          </p>
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="inline-flex items-center rounded-full bg-white text-[#00AFF0] px-6 py-3 text-sm font-semibold hover:bg-opacity-90"
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

  // Format phone numbers
  const formatPhoneNumber = (number: string): string => {
    const digits = number.replace(/\D/g, "");
    if (digits.length === 10) return `+1${digits}`;
    if (digits.length > 10 && !number.startsWith("+")) return `+${digits}`;
    if (number.startsWith("+")) return `+${digits}`;
    return number;
  };

  // Fetch Twilio number (optional use)
  React.useEffect(() => {
    const fetchTwilioNumber = async () => {
      try {
        const response = await fetch("/api/twilio/phone-number");
        if (response.ok) {
          const data = await response.json();
          if (data.phoneNumber) setTwilioNumber(data.phoneNumber);
        }
      } catch (error) {
        console.error("Error fetching Twilio number:", error);
      }
    };
    if (user) fetchTwilioNumber();
  }, [user]);

  const handleAICall = async (
    prompt: string,
    phoneNumber: string,
    voice: string = "cailee"
  ) => {
    try {
      const response = await fetch("/api/bland-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, phoneNumber, voice }),
      });
      if (!response.ok) throw new Error("Failed to schedule AI call");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error making AI call:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("Please sign in to use the AI Voice Assistant");
      setAuthOpen(true);
      return;
    }
    if (!prompt.trim()) {
      setError("Please enter instructions for the AI assistant");
      return;
    }
    if (!phoneNumber.trim()) {
      setError("Please enter a phone number to call");
      return;
    }

    setError("");
    setIsProcessing(true);
    setCallStatus("scheduled");

    try {
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

      const result = await handleAICall(
        prompt,
        formattedPhoneNumber,
        selectedVoice.split(" ")[0]
      );

      if (!result.success) {
        throw new Error(result.error || "Failed to schedule call");
      }

      setCallResult(result);
      setCallStatus("in-progress");

      // Poll for updates with exponential backoff
      let pollCount = 0;
      const maxPolls = 30;
      const base = 2000;

      const pollForUpdates = async () => {
        if (pollCount >= maxPolls) return;
        try {
          const response = await fetch(
            `/api/bland-ai?callId=${result.callId}`
          ).then((r) => r.json());

          if (response.status === "completed") {
            setCallStatus("completed");
            setCallResult(response);
            return;
          }

          pollCount++;
          setTimeout(pollForUpdates, base * Math.pow(1.5, pollCount));
        } catch (error) {
          console.error("Error polling for updates:", error);
        }
      };

      pollForUpdates();
    } catch (err) {
      console.error("Error making AI call:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "details" in (err as any)
          ? String((err as any).details)
          : "Failed to initiate call. Please try again.";

      setError(errorMessage);
      setCallStatus("failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualRefresh = async () => {
    if (!callResult?.callId) return;
    try {
      setIsProcessing(true);
      const refreshResult = await fetch(
        `/api/bland-ai?callId=${callResult.callId}`
      ).then((r) => r.json());

      setCallResult((prev) => ({
        ...(prev || { callId: callResult.callId }),
        recording: refreshResult.recording ?? prev?.recording ?? null,
        transcript:
          refreshResult.transcript ?? prev?.transcript ?? "No transcript available",
        summary: refreshResult.summary ?? prev?.summary ?? "No summary available",
      }));
    } catch (error) {
      console.error("Error refreshing call data:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const voices = ["Cailee (Female)", "James (Male)", "Sarah (Female)", "Michael (Male)"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00AFF0] to-[#0078D4] p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-bold mb-6 text-white flex items-center justify-center gap-4">
              AI Voice <span className="text-white">Assistant</span>
              <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full border border-white/30 font-semibold tracking-wider">
                BETA
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Experience smarter conversations with our AI-powered voice assistant
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="phoneNumber" className="block text-xl font-semibold text-white mb-4">
                Phone Number to Call
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg"
              />
            </div>

            <div>
              <label htmlFor="instructions" className="block text-xl font-semibold text-white mb-4">
                Instructions for the AI
              </label>
              <textarea
                id="instructions"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Call this Korean BBQ restaurant and ask if they cook the meat for customers. Also ask about their prices and if reservations are required."
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 min-h-[120px] text-lg"
              />
            </div>

            <div>
              <label className="block text-xl font-semibold text-white mb-4">
                AI Voice
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowVoices((s) => !s)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 flex items-center justify-between text-lg"
                >
                  <span>{selectedVoice}</span>
                  <ChevronDownIcon
                    className={`w-5 h-5 transform transition-transform ${
                      showVoices ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showVoices && (
                  <div className="absolute w-full mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 py-1 z-50">
                    {voices.map((voice) => (
                      <button
                        key={voice}
                        type="button"
                        onClick={() => {
                          setSelectedVoice(voice);
                          setShowVoices(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-100 text-gray-900"
                      >
                        {voice}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isProcessing || callStatus === "in-progress"}
              className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-colors text-lg ${
                isProcessing || callStatus === "in-progress" ? "bg-blue-400 cursor-not-allowed" : ""
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                "Schedule Call"
              )}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}