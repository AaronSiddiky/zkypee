import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, company, email, topic, message, website } = await req.json();
    if (website) return new Response("ok", { status: 200 });
    if (!name || !email || !message) return new Response("missing", { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return new Response("invalid", { status: 400 });
    if (String(message).trim().length < 10) return new Response("short", { status: 400 });

    const text = [
      `New contact request`,
      `Name: ${name}`,
      company ? `Company: ${company}` : "",
      `Email: ${email}`,
      `Topic: ${topic || "Support"}`,
      `Message:`,
      message,
    ].filter(Boolean).join("\n");

    const webhook = process.env.SLACK_WEBHOOK_URL;
    if (webhook) {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
    } else {
      console.log(text);
    }

    return new Response("ok", { status: 200 });
  } catch {
    return new Response("error", { status: 500 });
  }
}