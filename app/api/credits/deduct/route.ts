import { NextRequest, NextResponse } from "next/server";
import { deductCreditsForCall } from "@/lib/credits";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/lib/database.types";

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Check if user is authenticated
    const {
      data: { session: authSession },
    } = await supabase.auth.getSession();
    if (!authSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = authSession.user.id;
    const body = await request.json();
    const { durationMinutes, callSid, phoneNumber } = body;

    if (!durationMinutes || !callSid) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Delegate to server-side calculation to avoid trusting client input
    const result = await deductCreditsForCall(
      userId,
      Number(durationMinutes),
      String(callSid),
      phoneNumber ? String(phoneNumber) : undefined
    );

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Error deducting credits:", error);
    return NextResponse.json(
      { error: "Failed to deduct credits" },
      { status: 500 }
    );
  }
}
