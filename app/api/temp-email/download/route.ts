import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const login = request.nextUrl.searchParams.get("login");
  const domain = request.nextUrl.searchParams.get("domain");
  const id = request.nextUrl.searchParams.get("id");
  const file = request.nextUrl.searchParams.get("file");
  if (!login || !domain || !id || !file) {
    return new Response(JSON.stringify({ error: "Missing login, domain, id or file" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
  try {
    const upstream = `https://www.1secmail.com/api/v1/?action=download&login=${encodeURIComponent(
      login
    )}&domain=${encodeURIComponent(domain)}&id=${encodeURIComponent(id)}&file=${encodeURIComponent(file)}`;

    const res = await fetch(upstream, { cache: "no-store", headers: { "user-agent": "zkypee-temp-email" } });
    if (!res.ok || !res.body) {
      return new Response(JSON.stringify({ error: "Failed to download attachment" }), {
        status: 502,
        headers: { "content-type": "application/json" },
      });
    }

    const headers = new Headers();
    const ct = res.headers.get("content-type") || "application/octet-stream";
    const cd = res.headers.get("content-disposition") || `attachment; filename*=UTF-8''${encodeURIComponent(file)}`;
    headers.set("content-type", ct);
    headers.set("content-disposition", cd);
    headers.set("cache-control", "no-store");

    return new Response(res.body, { status: 200, headers });
  } catch {
    return new Response(JSON.stringify({ error: "Upstream error" }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }
}
