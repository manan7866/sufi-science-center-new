import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const VALID_FREQUENCIES = new Set(['one_time', 'monthly', 'annual']);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, frequency, donorName, donorEmail, message } = body;

    const name = typeof donorName === 'string' ? donorName.trim() : '';
    if (!name || name.length < 2 || name.length > 120) {
      return NextResponse.json({ error: 'A valid full name is required (2–120 characters).' }, { status: 400 });
    }

    const email = typeof donorEmail === 'string' ? donorEmail.trim().toLowerCase() : '';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount < 1 || numericAmount > 1_000_000) {
      return NextResponse.json({ error: 'Amount must be between $1 and $1,000,000.' }, { status: 400 });
    }

    if (!VALID_FREQUENCIES.has(frequency)) {
      return NextResponse.json({ error: 'Invalid frequency.' }, { status: 400 });
    }

    const msg = typeof message === 'string' ? message.trim().slice(0, 1000) : null;

    const receiptRef = `SSC-${crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()}`;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
    );

    const { error: dbError } = await supabase.from('donations' as any).insert([{
      amount: Math.round(numericAmount * 100) / 100,
      currency: 'USD',
      frequency,
      donor_name: name,
      donor_email: email,
      message: msg || null,
      transaction_id: receiptRef,
      status: 'pending',
    }]);

    if (dbError) {
      console.error('[donations] insert error:', dbError.message);
      return NextResponse.json({ error: 'Failed to record contribution. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, receiptRef });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
