import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const login = request.nextUrl.searchParams.get("login");
  const domain = request.nextUrl.searchParams.get("domain");
  if (!login || !domain) {
    return NextResponse.json({ error: "Missing login or domain" }, { status: 400 });
  }
  try {
    const upstream = `https://www.1secmail.com/api/v1/?action=getMessages&login=${encodeURIComponent(
      login
    )}&domain=${encodeURIComponent(domain)}`;
    const res = await fetch(upstream, { cache: "no-store", headers: { "user-agent": "zkypee-temp-email" } });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json({ messages: data }, { headers: { "cache-control": "no-store" } });
  } catch (e) {
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}
