import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header.' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-01-28.clover' as const });
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('[stripe-webhook] signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook signature verification failed.' }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (session.payment_status !== 'paid' && session.status !== 'complete') {
    return NextResponse.json({ received: true });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
    );

    const paymentIntentId = typeof session.payment_intent === 'string'
      ? session.payment_intent
      : (session.payment_intent as Stripe.PaymentIntent | null)?.id ?? null;

    const receiptUrl = session.payment_intent
      ? `https://dashboard.stripe.com/payments/${paymentIntentId}`
      : null;

    const { error } = await (supabase as any).rpc('mark_donation_paid', {
      p_session_id: session.id,
      p_payment_intent_id: paymentIntentId ?? '',
      p_receipt_url: receiptUrl ?? '',
    });

    if (error) {
      console.error('[stripe-webhook] db update error:', error.message);
      return NextResponse.json({ error: 'DB update failed.' }, { status: 500 });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[stripe-webhook] unexpected error:', err);
    return NextResponse.json({ error: 'Internal error.' }, { status: 500 });
  }
}
