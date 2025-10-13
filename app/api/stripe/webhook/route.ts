import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, CREDIT_PACKAGES } from "@/lib/stripe";
import { addCreditsToUser } from "@/lib/credits";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    const sig = request.headers.get("stripe-signature");
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!sig || !secret) {
      return NextResponse.json({ error: "Missing webhook configuration" }, { status: 500 });
    }

    const rawBody = await request.text();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, secret);
    } catch (err) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const paymentIntentId = (session.payment_intent as string) || "";
      const metadata = session.metadata || {};

      const userId = metadata.userId || "";
      const packageId = metadata.packageId || "";
      const creditsToAdd = metadata.creditsToAdd ? Number(metadata.creditsToAdd) : undefined;

      if (!userId || !packageId || !creditsToAdd || !paymentIntentId) {
        return NextResponse.json({ received: true });
      }

      // Validate packageId and credits match configured package
      const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId);
      if (!pkg || pkg.credits !== creditsToAdd) {
        return NextResponse.json({ error: "Invalid package" }, { status: 400 });
      }

      // Idempotency: check transactions table for existing payment_intent_id
      const supabase = createRouteHandlerClient({ cookies });
      const { data: existing, error: existingErr } = await supabase
        .from("transactions")
        .select("id")
        .eq("payment_intent_id", paymentIntentId)
        .maybeSingle();

      if (!existingErr && existing) {
        return NextResponse.json({ received: true, duplicate: true });
      }

      // Add credits
      await addCreditsToUser(userId, creditsToAdd, paymentIntentId, pkg.amount);

      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }
}
