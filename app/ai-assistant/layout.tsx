"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import Auth from "../../components/Auth";

export default function AIAssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) setOpen(true);
  }, [loading, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-900" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full text-center"
        >
          <h1 className="text-3xl font-bold mb-4">
            Sign in to Access AI Assistant
          </h1>
          <p className="text-neutral-600 mb-8">
            Use your Zkypee account to continue.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center rounded-full bg-black text-white px-6 py-3 text-sm font-medium hover:bg-neutral-900"
          >
            Sign in
          </button>
        </motion.div>

        <Auth
          open={open}
          onClose={() => setOpen(false)}
          initialMode="signin"
          onSuccess={() => setOpen(false)}
        />
      </div>
    );
  }

  return <>{children}</>;
}