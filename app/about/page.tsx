"use client";

import { useRef } from "react";

export default function AboutPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      {/* Mini nav */}
      <div className="zk-nav">
        <div
          className="zk-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
          }}
        >
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontWeight: 600,
              fontSize: 19,
              letterSpacing: "-0.025em",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              style={{ opacity: 0.4 }}
            >
              <path
                d="M10 13L5 8l5-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Zkypee
          </a>
          <a
            href="mailto:contact@zkypee.com"
            className="btn btn-ghost btn-sm"
          >
            Contact us
          </a>
        </div>
      </div>

      {/* About section */}
      <section className="zk-section">
        <div className="zk-container">
          <div className="about-grid">
            <div style={{ maxWidth: 560 }}>
              <div className="eyebrow">— About</div>
              <h1 className="h1" style={{ marginTop: 12 }}>
                Why we built{" "}
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    color: "var(--accent)",
                  }}
                >
                  Zkypee
                </span>
                .
              </h1>
              <p className="lead" style={{ marginTop: 20 }}>
                A short message from the team on why this project started, what
                it meant to us, and the people who made it possible along the
                way.
              </p>
              <div
                style={{
                  marginTop: 28,
                  paddingTop: 20,
                  borderTop: "1px solid var(--line)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {[
                  { l: "Recorded by", v: "The Zkypee team" },
                  { l: "Origin", v: "Columbia University" },
                ].map((r) => (
                  <div
                    key={r.l}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13.5,
                    }}
                  >
                    <span style={{ color: "var(--muted)" }}>{r.l}</span>
                    <span style={{ color: "var(--ink-2)" }}>{r.v}</span>
                  </div>
                ))}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13.5,
                  }}
                >
                  <span style={{ color: "var(--muted)" }}>Questions</span>
                  <a
                    href="mailto:contact@zkypee.com"
                    style={{
                      color: "var(--ink)",
                      textDecoration: "underline",
                      textUnderlineOffset: 3,
                    }}
                  >
                    contact@zkypee.com
                  </a>
                </div>
              </div>

              <div
                style={{
                  marginTop: 32,
                  padding: "20px 24px",
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                  background: "var(--card)",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 500 }}>
                  Zkypee has been deprecated
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--muted)",
                    marginTop: 6,
                    lineHeight: 1.55,
                  }}
                >
                  Service shut down April 2026. If you have credits, a number,
                  or account data to retrieve, reach out and we&rsquo;ll take
                  care of you.
                </p>
                <a
                  href="/"
                  style={{
                    display: "inline-flex",
                    marginTop: 14,
                    fontSize: 13,
                    color: "var(--ink)",
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                  }}
                >
                  See account help &rarr;
                </a>
              </div>
            </div>

            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "relative",
                  aspectRatio: "9 / 16",
                  borderRadius: 14,
                  overflow: "hidden",
                  background: "#000",
                  border: "1px solid var(--line)",
                  boxShadow: "0 24px 80px -30px rgba(10,10,11,0.35)",
                }}
              >
                <video
                  ref={videoRef}
                  src="/about.mp4"
                  controls
                  playsInline
                  preload="metadata"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
              <div
                style={{
                  marginTop: 12,
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--muted)",
                  textAlign: "center",
                  letterSpacing: "0.06em",
                }}
              >
                about.mp4 &middot; 9:16
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--line)",
          background: "var(--paper)",
          padding: "40px 0 28px",
        }}
      >
        <div className="zk-container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11.5,
                color: "var(--muted)",
              }}
            >
              &copy; 2026 Zkypee. Built at Columbia University.
            </div>
            <a
              href="mailto:contact@zkypee.com"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11.5,
                color: "var(--muted)",
              }}
            >
              contact@zkypee.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
