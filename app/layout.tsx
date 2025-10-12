import "./globals.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from '@/components/providers/Providers';

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://zkypee.com"),
  title: { default: "Zkypee", template: "%s | Zkypee" },
  description:
    "Modern calling and messaging without the bloat. Crystal‑clear calls, transcripts, and a clean experience across all devices.",
  applicationName: "Zkypee",
  keywords: ["Skype alternative", "VoIP", "calling", "video calls", "messaging", "international calling"],
  authors: [{ name: "Zkypee" }],
  creator: "Zkypee",
  publisher: "Zkypee",
  referrer: "strict-origin-when-cross-origin",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://zkypee.com",
    title: "Zkypee",
    description:
      "Modern calling and messaging without the bloat. Crystal‑clear calls, transcripts, and a clean experience across all devices.",
    siteName: "Zkypee",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zkypee",
    description:
      "Modern calling and messaging without the bloat. Crystal‑clear calls, transcripts, and a clean experience across all devices.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/site.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Zkypee" },
  formatDetection: { telephone: false, date: false, email: false, address: false },
  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#ffffff" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=AW-16917828312" strategy="afterInteractive" />
        <Script id="gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-16917828312', { anonymize_ip: true, transport_type: 'beacon' });
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Zkypee",
              url: "https://zkypee.com",
              logo: "https://zkypee.com/apple-touch-icon.png",
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased bg-white text-neutral-900`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-black focus:px-3 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>

        <Providers>
          <Suspense fallback={null}>
            <Header />
            <main id="main">{children}</main>
            <Footer />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}