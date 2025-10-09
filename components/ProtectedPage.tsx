"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Auth from "./Auth";
import { motion } from "framer-motion";

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
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
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Sign in to continue</h1>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center rounded-full bg-black text-white px-6 py-3 text-sm font-medium hover:bg-neutral-900"
          >
            Sign in
          </button>
        </div>
        <Auth
          open={open}
          onClose={() => setOpen(false)}
          initialMode="signin"
          onSuccess={() => setOpen(false)}
        />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {children}
    </motion.div>
  );
}