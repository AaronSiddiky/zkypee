import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zkypee Blog — Guides, Tips, and Updates",
  description: "In-depth guides and updates on calling, messaging, and modern comms.",
  openGraph: {
    title: "Zkypee Blog — Guides, Tips, and Updates",
    description: "In-depth guides and updates on calling, messaging, and modern comms.",
    type: "website",
  },
  alternates: { canonical: "https://zkypee.com/blog" },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-white">{children}</div>;
}