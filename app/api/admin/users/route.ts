import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('sb-access-token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const verifyClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
  );

  const { data: { user }, error: authError } = await verifyClient.auth.getUser();
  if (authError || !user || user.app_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ error: 'Service key not configured' }, { status: 500 });
  }

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey
  );

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') ?? '0');
  const search = searchParams.get('search') ?? '';
  const PAGE_SIZE = 25;

  const { data, error } = await adminClient.auth.admin.listUsers({
    page: page + 1,
    perPage: PAGE_SIZE,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let users = data.users ?? [];
  if (search) {
    users = users.filter(u => u.email?.toLowerCase().includes(search.toLowerCase()));
  }

  return NextResponse.json({ users });
}
