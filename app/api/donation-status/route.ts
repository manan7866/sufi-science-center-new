import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SESSION_ID_RE = /^cs_(test|live)_[a-zA-Z0-9_]+$/;

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');

  if (!sessionId || !SESSION_ID_RE.test(sessionId)) {
    return NextResponse.json({ error: 'Invalid session_id.' }, { status: 400 });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
    );

    const { data, error } = await (supabase as any)
      .from('donations')
      .select('status, amount, currency, frequency, donor_name, donor_email, transaction_id, receipt_url')
      .eq('stripe_session_id', sessionId)
      .maybeSingle();

    if (error) {
      console.error('[donation-status] query error:', error.message);
      return NextResponse.json({ error: 'Failed to retrieve donation.' }, { status: 500 });
    }

    return NextResponse.json({ donation: data });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
