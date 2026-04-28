"use client";

import { useRef } from "react";

/* ─── Nav ─────────────────────────────────────────────────────── */
function Nav() {
  return (
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
          href="#"
          style={{
            display: "inline-flex",
            alignItems: "center",
            fontWeight: 600,
            fontSize: 19,
            letterSpacing: "-0.025em",
          }}
        >
          Zkypee
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <a href="#why" className="zk-nav-link">
            The note
          </a>
          <a href="#about" className="zk-nav-link">
            About
          </a>
          <a href="#sunset" className="zk-nav-link">
            Account help
          </a>
          <a href="mailto:contact@zkypee.com" className="btn btn-primary btn-sm">
            Contact us
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Status Banner ───────────────────────────────────────────── */
function StatusBar() {
  return (
    <div
      style={{
        borderBottom: "1px solid var(--line)",
        background: "var(--ink)",
        color: "var(--paper)",
      }}
    >
      <div
        className="zk-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 40,
          fontSize: 12.5,
          padding: "8px 0",
          gap: 12,
          flexWrap: "wrap",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(246,244,238,0.55)",
          }}
        >
          Notice
        </span>
        <span style={{ color: "var(--paper)" }}>
          Zkypee has been deprecated. Thank you for trusting us to be your
          provider.
        </span>
        <a
          href="#sunset"
          style={{
            color: "var(--paper)",
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          Read more
        </a>
      </div>
    </div>
  );
}

/* ─── Hero Visual (service status card) ───────────────────────── */
function HeroVisual() {
  return (
    <div style={{ position: "relative" }}>
      <div
        className="zk-card"
        style={{
          padding: 0,
          overflow: "hidden",
          boxShadow: "0 24px 80px -30px rgba(10,10,11,0.25)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 14px",
            borderBottom: "1px solid var(--line)",
            background: "var(--paper-2)",
          }}
        >
          {["#e6e3dc", "#e6e3dc", "#e6e3dc"].map((c, i) => (
            <span
              key={i}
              style={{ width: 10, height: 10, borderRadius: "50%", background: c }}
            />
          ))}
          <span
            style={{
              marginLeft: 12,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--muted)",
            }}
          >
            zkypee.com / sunset
          </span>
        </div>
        <div style={{ padding: 32 }}>
          <div className="zk-tag">A note from the team</div>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 26,
              fontStyle: "italic",
              lineHeight: 1.35,
              marginTop: 14,
              letterSpacing: "-0.01em",
            }}
          >
            &ldquo;We started Zkypee at Columbia as a lightweight alternative to
            Skype. To everyone who paid for credits, ported a number, or made
            their first international call with us &mdash; thank you.&rdquo;
          </p>
          <div
            style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop: "1px solid var(--line)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--muted)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Service status
            </div>
            <div
              style={{
                marginTop: 12,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {[
                { l: "New sign-ups", v: "Closed" },
                { l: "Outbound calling", v: "Sunset" },
                { l: "Number porting (out)", v: "Available on request" },
                { l: "Account & credit refunds", v: "Available on request" },
              ].map((s) => (
                <div
                  key={s.l}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <span style={{ fontSize: 13.5, color: "var(--ink-2)" }}>
                    {s.l}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "var(--ink)",
                    }}
                  >
                    {s.v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Hero ────────────────────────────────────────────────────── */
function Hero() {
  return (
    <>
      <StatusBar />
      <section
        className="zk-section"
        id="sunset"
        style={{ paddingTop: 72, paddingBottom: 40 }}
      >
        <div className="zk-container">
          <div className="hero-grid">
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "6px 12px",
                  border: "1px solid var(--line-2)",
                  borderRadius: 999,
                  background: "var(--card)",
                  marginBottom: 28,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--muted)",
                  }}
                />
                <span style={{ fontSize: 12.5, color: "var(--ink-2)" }}>
                  Service deprecated &middot; April 2026
                </span>
              </div>
              <h1 className="display">
                Thank you for{" "}
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    color: "var(--accent)",
                  }}
                >
                  calling
                </span>{" "}
                with us.
              </h1>
              <p className="lead" style={{ marginTop: 24, maxWidth: 560 }}>
                Zkypee has been deprecated. We&rsquo;re grateful you trusted us
                to be your provider. If you have an active account, credits, or
                a number registered with us, you can still reach the team
                directly to wind things down.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginTop: 32,
                  flexWrap: "wrap",
                }}
              >
                <a
                  href="mailto:contact@zkypee.com"
                  className="btn btn-primary"
                >
                  Contact the team
                  <svg width="11" height="11" viewBox="0 0 11 11">
                    <path
                      d="M2 5.5h7M6 2.5l3 3-3 3"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <a href="#why" className="btn btn-ghost">
                  Read our note
                </a>
              </div>
              <div
                style={{
                  marginTop: 40,
                  paddingTop: 24,
                  borderTop: "1px solid var(--line)",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 24,
                  maxWidth: 480,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10.5,
                      color: "var(--muted)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Built at
                  </div>
                  <div style={{ fontSize: 14, marginTop: 4 }}>
                    Columbia University
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10.5,
                      color: "var(--muted)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Reach us at
                  </div>
                  <a
                    href="mailto:contact@zkypee.com"
                    style={{
                      fontSize: 14,
                      marginTop: 4,
                      display: "block",
                      textDecoration: "underline",
                      textUnderlineOffset: 3,
                    }}
                  >
                    contact@zkypee.com
                  </a>
                </div>
              </div>
            </div>
            <div>
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ─── Sunset Note ─────────────────────────────────────────────── */
function SunsetNote() {
  return (
    <section
      id="why"
      className="zk-section"
      style={{
        background: "var(--paper-2)",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div className="zk-container">
        <div className="sec-grid">
          <div>
            <div className="eyebrow">— A note</div>
            <h2 className="h1" style={{ marginTop: 12 }}>
              Winding down, with care.
            </h2>
          </div>
          <div style={{ maxWidth: 680 }}>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--ink-2)" }}>
              Zkypee began as a small project by Aaron Siddiky and Leonard Holter
              over a weekend. We wanted to build a cheap international calling
              service and AI voice agent that would allow anyone to make anonymous
              international calls to landlines on a per-credit basis. When Skype
              shut down and tech Twitter started complaining, building Zkypee only
              made sense. Over the past few months we&rsquo;ve been lucky enough
              to help thousands of people make calls, send messages, and stay
              connected.
            </p>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.6,
                color: "var(--ink-2)",
                marginTop: 18,
              }}
            >
              We&rsquo;ve made the difficult decision to deprecate the service.
              New sign-ups and outbound calling have been turned off. If you have
              a number registered with us, an active account, or remaining
              credits, please reach out and we&rsquo;ll help you wind things down
              on your terms. Feel free to email us personally at{" "}
              <a
                href="mailto:aaron.siddiky@columbia.edu"
                style={{
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}
              >
                aaron.siddiky@columbia.edu
              </a>{" "}
              or{" "}
              <a
                href="mailto:leonard.holter@columbia.edu"
                style={{
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}
              >
                leonard.holter@columbia.edu
              </a>
              .
            </p>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.6,
                color: "var(--ink-2)",
                marginTop: 18,
              }}
            >
              Thank you for trusting us to be your provider. It mattered more
              than you know.
            </p>
            <div
              style={{
                marginTop: 32,
                padding: "20px 24px",
                border: "1px solid var(--line)",
                borderRadius: 12,
                background: "var(--card)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>
                  Need help winding down?
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--muted)",
                    marginTop: 2,
                  }}
                >
                  We respond to every email personally.
                </div>
              </div>
              <a
                href="mailto:contact@zkypee.com"
                className="btn btn-primary btn-sm"
              >
                contact@zkypee.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── About Video ─────────────────────────────────────────────── */
function AboutVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section id="about" className="zk-section">
      <div className="zk-container">
        <div className="about-grid">
          <div style={{ maxWidth: 560 }}>
            <div className="eyebrow">— About</div>
            <h2 className="h1" style={{ marginTop: 12 }}>
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
            </h2>
            <p className="lead" style={{ marginTop: 20 }}>
              A short message from the team on why this project started, what it
              meant to us, and the people who made it possible along the way.
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
  );
}

/* ─── Action Cards ─────────────────────────────────────────────── */
function ActionCards() {
  const cards = [
    {
      t: "Port your number",
      d: "We'll help you move any active number to a new provider, free of charge.",
      a: "Request a port",
      href: "mailto:contact@zkypee.com?subject=Number%20port%20request",
    },
    {
      t: "Refund credits",
      d: "Any remaining unused credits on your account can be refunded to your original payment method.",
      a: "Request a refund",
      href: "mailto:contact@zkypee.com?subject=Credit%20refund%20request",
    },
    {
      t: "Export account data",
      d: "Download your call history, transcripts, and contacts before accounts are closed.",
      a: "Request my data",
      href: "mailto:contact@zkypee.com?subject=Data%20export%20request",
    },
  ];

  return (
    <section style={{ paddingBottom: 96 }}>
      <div className="zk-container">
        <div className="eyebrow">— What you can still do</div>
        <div
          className="action-grid"
          style={{
            marginTop: 24,
            border: "1px solid var(--line)",
            borderRadius: 14,
            overflow: "hidden",
            background: "var(--card)",
          }}
        >
          {cards.map((c, i) => (
            <div
              key={c.t}
              style={{
                padding: 32,
                borderRight:
                  i < cards.length - 1 ? "1px solid var(--line)" : 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                }}
              >
                {c.t}
              </div>
              <p
                style={{
                  fontSize: 13.5,
                  color: "var(--ink-2)",
                  lineHeight: 1.55,
                  marginTop: 10,
                  flex: 1,
                }}
              >
                {c.d}
              </p>
              <a
                href={c.href}
                className="btn btn-ghost btn-sm"
                style={{ marginTop: 16, alignSelf: "flex-start" }}
              >
                {c.a} →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ──────────────────────────────────────────────────── */
function SiteFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--line)",
        background: "var(--paper)",
        padding: "56px 0 28px",
      }}
    >
      <div className="zk-container">
        <div className="foot-grid">
          <div>
            <div
              style={{
                fontWeight: 600,
                fontSize: 18,
                letterSpacing: "-0.025em",
              }}
            >
              Zkypee
            </div>
            <p
              style={{
                marginTop: 14,
                fontSize: 13.5,
                color: "var(--ink-2)",
                maxWidth: 320,
                lineHeight: 1.55,
              }}
            >
              Built at Columbia University. Service deprecated April 2026. Thank
              you to everyone who called, messaged, and trusted us along the way.
            </p>
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--muted)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Get in touch
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {[
                { label: "contact@zkypee.com", href: "mailto:contact@zkypee.com" },
                {
                  label: "Port a number",
                  href: "mailto:contact@zkypee.com?subject=Number%20port%20request",
                },
                {
                  label: "Request a refund",
                  href: "mailto:contact@zkypee.com?subject=Credit%20refund%20request",
                },
                {
                  label: "Export account data",
                  href: "mailto:contact@zkypee.com?subject=Data%20export%20request",
                },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    style={{ fontSize: 13.5, color: "var(--ink-2)" }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--muted)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Quick links
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {[
                { label: "The note", href: "#why" },
                { label: "About", href: "#about" },
                { label: "Account help", href: "#sunset" },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    style={{ fontSize: 13.5, color: "var(--ink-2)" }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <hr className="hairline" style={{ marginTop: 48 }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 20,
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
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div>
      <Nav />
      <Hero />
      <SunsetNote />
      <AboutVideo />
      <ActionCards />
      <SiteFooter />
    </div>
  );
}
