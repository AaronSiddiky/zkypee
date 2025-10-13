import { NextRequest, NextResponse } from "next/server";
import { CREDIT_PACKAGES, getStripe } from "@/lib/stripe";
import { addCreditsToUser } from "@/lib/credits";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/lib/database.types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
  }

  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Get Stripe instance
    const stripe = getStripe();
    if (!stripe) {
      console.error("Stripe configuration error - stripe instance is null");
      return NextResponse.json(
        { error: "Stripe configuration error" },
        { status: 500 }
      );
    }

    // Retrieve the checkout session from Stripe
    console.log(`Retrieving Stripe session with ID: ${sessionId}`);
    let checkoutSession;
    try {
      checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
      console.log(
        "Retrieved session:",
        JSON.stringify({
          id: checkoutSession.id,
          payment_status: checkoutSession.payment_status,
          metadata: checkoutSession.metadata,
          payment_intent: checkoutSession.payment_intent,
        })
      );
    } catch (stripeError) {
      console.error("Error retrieving Stripe session:", stripeError);
      return NextResponse.json(
        { error: "Failed to retrieve Stripe session" },
        { status: 500 }
      );
    }

    // Verify the payment was successful
    if (checkoutSession.payment_status !== "paid") {
      console.error(
        `Payment not completed. Status: ${checkoutSession.payment_status}`
      );
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Get the metadata from the session
    const { userId, packageId, creditsToAdd } = checkoutSession.metadata || {};

    if (!userId || !packageId || !creditsToAdd) {
      console.error("Missing required metadata:", checkoutSession.metadata);
      return NextResponse.json(
        { error: "Missing required metadata" },
        { status: 400 }
      );
    }

    // Find the credit package
    const creditPackage = CREDIT_PACKAGES.find((pkg) => pkg.id === packageId);
    if (!creditPackage) {
      console.error(`Invalid package ID: ${packageId}`);
      return NextResponse.json(
        { error: "Invalid package ID" },
        { status: 400 }
      );
    }

    // Get the payment intent ID
    const paymentIntentId = checkoutSession.payment_intent as string;
    if (!paymentIntentId) {
      console.error("Missing payment intent ID in session");
      return NextResponse.json(
        { error: "Missing payment intent ID" },
        { status: 400 }
      );
    }

    // Check if this transaction has already been processed
    console.log(
      `Checking for existing transaction with payment intent: ${paymentIntentId}`
    );
    let existingTransaction;
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("id")
        .eq("payment_intent_id", paymentIntentId);

      if (error) {
        console.error("Error checking for existing transaction:", error);
        // Continue anyway, since this is just a check
      } else if (data && data.length > 0) {
        existingTransaction = data[0];
      }
    } catch (dbError) {
      console.error("Database error when checking transactions:", dbError);
      // Continue anyway, as this is not a critical failure
    }

    if (existingTransaction) {
      console.log("Transaction already processed, redirecting to thank-you");
      const redirectUrl = new URL(`/credits/thank-you?creditsAdded=${true}`, request.nextUrl.origin);
      return NextResponse.redirect(redirectUrl, { status: 302 });
    }

    // Add credits to the user's account
    console.log(`Adding ${creditsToAdd} credits to user ${userId}`);
    try {
      const creditsAdded = await addCreditsToUser(
        userId,
        Number(creditsToAdd),
        paymentIntentId,
        creditPackage.amount
      );

      if (!creditsAdded) {
        console.warn(
          "Payment processed but credits may not have been added to the user's account"
        );
        // Redirect with flag indicating the credits might not have been added
        const redirectUrl = new URL(`/credits/thank-you?creditsAdded=${false}`, request.nextUrl.origin);
        return NextResponse.redirect(redirectUrl, { status: 302 });
      }
    } catch (creditError) {
      console.error("Error adding credits to user:", creditError);

      // Attempt to record the transaction even if adding credits failed
      try {
        const { error: transactionError } = await supabase
          .from("transactions")
          .insert({
            user_id: userId,
            amount: creditPackage.amount,
            credits_added: Number(creditsToAdd),
            payment_intent_id: paymentIntentId,
            status: "error",
            notes: `Payment processed but credits not added: ${
              creditError instanceof Error
                ? creditError.message
                : String(creditError)
            }`,
          });

        if (transactionError) {
          console.error(
            "Error recording fallback transaction:",
            transactionError
          );
        } else {
          console.log("Recorded transaction with error status");
        }
      } catch (fallbackError) {
        console.error(
          "Error in fallback transaction recording:",
          fallbackError
        );
      }

      // Redirect with flag indicating the credits weren't added
      const redirectUrl = new URL(`/credits/thank-you?creditsAdded=${false}`, request.nextUrl.origin);
      return NextResponse.redirect(redirectUrl, { status: 302 });
    }

    // Redirect browser to thank-you page; credits are already handled (webhook) or just added above
    const redirectUrl = new URL(`/credits/thank-you?creditsAdded=${true}`, request.nextUrl.origin);
    return NextResponse.redirect(redirectUrl, { status: 302 });
  } catch (error) {
    console.error("Unexpected error in success route:", error);

    // Redirect anyway; thank-you page will reflect current balance
    const redirectUrl = new URL(`/credits/thank-you?creditsAdded=${false}`, request.nextUrl.origin);
    return NextResponse.redirect(redirectUrl, { status: 302 });
  }
}

