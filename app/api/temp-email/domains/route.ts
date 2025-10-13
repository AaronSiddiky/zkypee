import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://www.1secmail.com/api/v1/?action=getDomainList", {
      cache: "no-store",
      headers: { "user-agent": "zkypee-temp-email" },
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch domains" }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json({ domains: data }, { headers: { "cache-control": "no-store" } });
  } catch (e) {
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}
