"use client";

import React from "react";

export const dynamic = "force-dynamic";

export default function TestTwilioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
