"use client";

import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { TwilioProvider } from "@/contexts/TwilioContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TwilioProvider>{children}</TwilioProvider>
    </AuthProvider>
  );
}