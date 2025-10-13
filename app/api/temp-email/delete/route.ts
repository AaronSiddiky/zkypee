import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  const login = request.nextUrl.searchParams.get("login");
  const domain = request.nextUrl.searchParams.get("domain");
  const id = request.nextUrl.searchParams.get("id");
  if (!login || !domain || !id) {
    return NextResponse.json({ error: "Missing login, domain, or id" }, { status: 400 });
  }
  try {
    const upstream = `https://www.1secmail.com/api/v1/?action=deleteMessage&login=${encodeURIComponent(
      login
    )}&domain=${encodeURIComponent(domain)}&id=${encodeURIComponent(id)}`;
    const res = await fetch(upstream, { method: "GET", cache: "no-store", headers: { "user-agent": "zkypee-temp-email" } });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to delete message" }, { status: 502 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}
