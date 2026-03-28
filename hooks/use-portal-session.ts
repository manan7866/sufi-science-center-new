'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export interface PortalSession {
  id: string;
  session_token: string;
  display_name: string | null;
  assessment_stage: string;
  completed_modules: string[];
  current_focus: string | null;
  last_activity_at: string;
  created_at: string;
}

export interface PortalProfile {
  full_name: string;
  display_name: string;
  location: string;
  bio: string;
  interests: string[];
  avatar_url: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  country: string;
  postal_code: string;
  completed_modules: string[];
}

export interface MembershipEnrollment {
  id: string;
  tier: string;
  status: string;
  applied_at: string;
  activated_at: string;
  cancelled_at: string | null;
}

export interface SurahView {
  surah_number: number;
  viewed_at: string;
}

export interface ReflectionEntry {
  surah_number: number;
  reflection_text: string;
  updated_at: string;
}

export interface ActivityEvent {
  id: string;
  event_type: string;
  event_label: string;
  event_metadata: Record<string, unknown>;
  occurred_at: string;
}

const SESSION_KEY = 'ssc_portal_session_token';

function getOrCreateToken(): string {
  let token = localStorage.getItem(SESSION_KEY);
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, token);
  }
  return token;
}

const DEFAULT_PROFILE: PortalProfile = {
  full_name: '',
  display_name: '',
  location: '',
  bio: '',
  interests: [],
  avatar_url: '',
  email: '',
  phone: '',
  address_line1: '',
  address_line2: '',
  city: '',
  country: '',
  postal_code: '',
  completed_modules: [],
};

export function usePortalSession() {
  const [session, setSession] = useState<PortalSession | null>(null);
  const [profile, setProfile] = useState<PortalProfile>(DEFAULT_PROFILE);
  const [membership, setMembership] = useState<MembershipEnrollment | null>(null);
  const [surahViews, setSurahViews] = useState<SurahView[]>([]);
  const [reflections, setReflections] = useState<ReflectionEntry[]>([]);
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function loadSession() {
      const token = getOrCreateToken();

      const [sessionResult, profileResult, membershipResult, viewsResult, reflectionsResult, activityResult] = await Promise.all([
        (supabase as any).from('portal_sessions').select('*').eq('session_token', token).maybeSingle(),
        (supabase as any).rpc('get_portal_profile', { p_token: token }),
        (supabase as any).from('membership_enrollments').select('*').eq('session_token', token).eq('status', 'active').order('activated_at', { ascending: false }).limit(1),
        (supabase as any).from('surah_views').select('surah_number, viewed_at').eq('session_token', token).order('viewed_at', { ascending: false }),
        (supabase as any).from('reflection_journal').select('surah_number, reflection_text, updated_at').eq('session_token', token),
        (supabase as any).from('portal_activity_events').select('id, event_type, event_label, event_metadata, occurred_at').eq('session_token', token).order('occurred_at', { ascending: false }).limit(20),
      ]);

      let sess = sessionResult.data as PortalSession | null;
      if (!sess) {
        const { data: newSession } = await (supabase as any)
          .from('portal_sessions')
          .insert({ session_token: token })
          .select()
          .maybeSingle();
        sess = newSession as PortalSession | null;
      }

      setSession(sess);

      if (profileResult.data && profileResult.data.length > 0) {
        const p = profileResult.data[0];
        setProfile({
          full_name: p.full_name || '',
          display_name: p.display_name || '',
          location: p.location || '',
          bio: p.bio || '',
          interests: p.interests || [],
          avatar_url: p.avatar_url || '',
          email: p.email || '',
          phone: p.phone || '',
          address_line1: p.address_line1 || '',
          address_line2: p.address_line2 || '',
          city: p.city || '',
          country: p.country || '',
          postal_code: p.postal_code || '',
          completed_modules: p.completed_modules || [],
        });
      } else {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('ssc_profile_data') : null;
        const storedContact = typeof window !== 'undefined' ? localStorage.getItem('ssc_contact_data') : null;
        const storedModules = typeof window !== 'undefined' ? localStorage.getItem('ssc_completed_modules') : null;
        if (stored || storedContact || storedModules) {
          const pd = stored ? JSON.parse(stored) : {};
          const cd = storedContact ? JSON.parse(storedContact) : {};
          const mods = storedModules ? JSON.parse(storedModules) : [];
          setProfile({
            full_name: pd.fullName || '',
            display_name: pd.displayName || (sess?.display_name ?? ''),
            location: pd.location || '',
            bio: pd.bio || '',
            interests: pd.interests || [],
            avatar_url: '',
            email: cd.email || '',
            phone: cd.phone || '',
            address_line1: cd.addressLine1 || '',
            address_line2: cd.addressLine2 || '',
            city: cd.city || '',
            country: cd.country || '',
            postal_code: cd.postalCode || '',
            completed_modules: mods,
          });
        }
      }

      if (membershipResult.data && membershipResult.data.length > 0) {
        setMembership(membershipResult.data[0] as MembershipEnrollment);
      }

      setSurahViews(viewsResult.data || []);
      setReflections(reflectionsResult.data || []);
      setActivityEvents(activityResult.data || []);
      setLoading(false);
    }

    loadSession();
  }, []);

  const saveProfile = useCallback(async (updates: Partial<PortalProfile>) => {
    const token = localStorage.getItem(SESSION_KEY);
    if (!token) return;
    const merged = { ...profile, ...updates };
    setProfile(merged);
    await (supabase as any).rpc('upsert_portal_profile', {
      p_token: token,
      p_full_name: merged.full_name,
      p_display_name: merged.display_name,
      p_location: merged.location,
      p_bio: merged.bio,
      p_interests: merged.interests,
      p_email: merged.email,
      p_phone: merged.phone,
      p_address_line1: merged.address_line1,
      p_address_line2: merged.address_line2,
      p_city: merged.city,
      p_country: merged.country,
      p_postal_code: merged.postal_code,
      p_completed_modules: merged.completed_modules,
    });
    if (merged.display_name) {
      await (supabase as any)
        .from('portal_sessions')
        .update({ display_name: merged.display_name })
        .eq('session_token', token);
      setSession((prev) => prev ? { ...prev, display_name: merged.display_name } : prev);
    }
  }, [profile]);

  const enrollMembership = useCallback(async (tier: string) => {
    const token = localStorage.getItem(SESSION_KEY);
    if (!token) return;
    await (supabase as any).rpc('enroll_membership_tier', { p_token: token, p_tier: tier });
    const { data } = await (supabase as any)
      .from('membership_enrollments')
      .select('*')
      .eq('session_token', token)
      .eq('status', 'active')
      .order('activated_at', { ascending: false })
      .limit(1);
    if (data && data.length > 0) setMembership(data[0]);
  }, []);

  const cancelMembership = useCallback(async () => {
    const token = localStorage.getItem(SESSION_KEY);
    if (!token) return;
    await (supabase as any).rpc('cancel_membership', { p_token: token });
    setMembership(null);
  }, []);

  const recordSurahView = useCallback(async (surahNumber: number, arabicName: string) => {
    const token = localStorage.getItem(SESSION_KEY);
    if (!token) return;

    await (supabase as any).from('surah_views').upsert(
      { session_token: token, surah_number: surahNumber, viewed_at: new Date().toISOString() },
      { onConflict: 'session_token,surah_number' }
    );

    await (supabase as any).from('portal_activity_events').insert({
      session_token: token,
      event_type: 'viewed_surah',
      event_label: `Viewed Surah ${surahNumber}: ${arabicName}`,
      event_metadata: { surah_number: surahNumber, arabic_name: arabicName },
    });

    await (supabase as any)
      .from('portal_sessions')
      .update({ last_activity_at: new Date().toISOString() })
      .eq('session_token', token);

    setSurahViews((prev) => {
      const exists = prev.find((v) => v.surah_number === surahNumber);
      if (exists) return prev;
      return [{ surah_number: surahNumber, viewed_at: new Date().toISOString() }, ...prev];
    });

    setActivityEvents((prev) => [
      {
        id: crypto.randomUUID(),
        event_type: 'viewed_surah',
        event_label: `Viewed Surah ${surahNumber}: ${arabicName}`,
        event_metadata: { surah_number: surahNumber },
        occurred_at: new Date().toISOString(),
      },
      ...prev.slice(0, 19),
    ]);
  }, []);

  const saveReflection = useCallback(async (surahNumber: number, text: string) => {
    const token = localStorage.getItem(SESSION_KEY);
    if (!token) return;

    const now = new Date().toISOString();
    await (supabase as any).from('reflection_journal').upsert(
      { session_token: token, surah_number: surahNumber, reflection_text: text, updated_at: now },
      { onConflict: 'session_token,surah_number' }
    );

    setReflections((prev) => {
      const existing = prev.findIndex((r) => r.surah_number === surahNumber);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { surah_number: surahNumber, reflection_text: text, updated_at: now };
        return updated;
      }
      return [...prev, { surah_number: surahNumber, reflection_text: text, updated_at: now }];
    });
  }, []);

  const logActivity = useCallback(async (eventType: string, label: string, metadata?: Record<string, unknown>) => {
    const token = localStorage.getItem(SESSION_KEY);
    if (!token) return;

    await (supabase as any).from('portal_activity_events').insert({
      session_token: token,
      event_type: eventType,
      event_label: label,
      event_metadata: metadata || {},
    });

    setActivityEvents((prev) => [
      {
        id: crypto.randomUUID(),
        event_type: eventType,
        event_label: label,
        event_metadata: metadata || {},
        occurred_at: new Date().toISOString(),
      },
      ...prev.slice(0, 19),
    ]);
  }, []);

  const saveModules = useCallback(async (modules: string[]) => {
    const token = localStorage.getItem(SESSION_KEY);
    if (!token) return;
    setProfile((prev) => ({ ...prev, completed_modules: modules }));
    await (supabase as any).rpc('upsert_portal_profile', {
      p_token: token,
      p_full_name: profile.full_name,
      p_display_name: profile.display_name,
      p_location: profile.location,
      p_bio: profile.bio,
      p_interests: profile.interests,
      p_email: profile.email,
      p_phone: profile.phone,
      p_address_line1: profile.address_line1,
      p_address_line2: profile.address_line2,
      p_city: profile.city,
      p_country: profile.country,
      p_postal_code: profile.postal_code,
      p_completed_modules: modules,
    });
  }, [profile]);

  const clearSession = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('ssc_profile_data');
    localStorage.removeItem('ssc_contact_data');
    localStorage.removeItem('ssc_completed_modules');
    localStorage.removeItem('ssc_profile_avatar');
    localStorage.removeItem('ssc_donor_email');
  }, []);

  return {
    session,
    profile,
    membership,
    surahViews,
    reflections,
    activityEvents,
    loading,
    saveProfile,
    enrollMembership,
    cancelMembership,
    recordSurahView,
    saveReflection,
    logActivity,
    saveModules,
    clearSession,
  };
}
