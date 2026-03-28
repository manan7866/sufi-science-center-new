'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { CircleCheck as CheckCircle2, Circle as XCircle, Clock, Eye, Filter, ChevronDown, ChevronUp, Loader as Loader2, Award, GraduationCap, FileText, User, MapPin, Building, Calendar, ArrowLeft } from 'lucide-react';
import { createAdminClientUntyped as createAdminClient } from '@/lib/supabase-admin';

type Status = 'pending' | 'under_review' | 'approved' | 'declined';

interface Application {
  id: string;
  membership_type: string;
  status: Status;
  full_name: string;
  display_name: string;
  email: string;
  location: string;
  affiliation: string;
  areas_of_study: string[];
  bio: string;
  statement: string;
  linked_publications: string[];
  academic_focus: string | null;
  research_interest: string | null;
  years_of_engagement: string | null;
  leadership_roles: string | null;
  publications_list: string | null;
  reference_contact: string | null;
  review_notes: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_META: Record<Status, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-[#AAB0D6]', bg: 'bg-[#AAB0D6]/10 border-[#AAB0D6]/20' },
  under_review: { label: 'Under Review', color: 'text-[#C8A75E]', bg: 'bg-[#C8A75E]/10 border-[#C8A75E]/20' },
  approved: { label: 'Approved', color: 'text-[#27AE60]', bg: 'bg-[#27AE60]/10 border-[#27AE60]/20' },
  declined: { label: 'Declined', color: 'text-[#E07070]', bg: 'bg-[#E07070]/10 border-[#E07070]/20' },
};

const TEXTAREA = 'w-full bg-[#141A3A] text-[#F5F7FA] placeholder:text-[#9CA3AF] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C8A75E] focus:ring-1 focus:ring-[#C8A75E]/30 resize-none transition-all';

export default function AdminMembershipPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'scholar' | 'fellow'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const supabase = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from('membership_applications')
      .select('*')
      .order('created_at', { ascending: false });
    setApplications((data as Application[]) ?? []);
    const n: Record<string, string> = {};
    (data as Application[])?.forEach((a) => { if (a.review_notes) n[a.id] = a.review_notes; });
    setNotes(n);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  async function updateStatus(id: string, status: Status) {
    setSaving(id);
    const supabase = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('membership_applications')
      .update({ status, review_notes: notes[id] ?? null, reviewed_at: new Date().toISOString() })
      .eq('id', id);
    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    setSaving(null);
  }

  const filtered = applications.filter((a) => {
    if (filter !== 'all' && a.status !== filter) return false;
    if (typeFilter !== 'all' && a.membership_type !== typeFilter) return false;
    return true;
  });

  const counts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    under_review: applications.filter((a) => a.status === 'under_review').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    declined: applications.filter((a) => a.status === 'declined').length,
  };

  return (
    <div className="min-h-screen bg-[#0A0B14] py-10 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin/login" className="inline-flex items-center gap-1.5 text-[#AAB0D6]/40 hover:text-[#C8A75E] transition-colors text-xs mb-1">
              <ArrowLeft className="w-3 h-3" />
              Admin
            </Link>
            <h1 className="text-2xl font-serif font-semibold text-white">Membership Applications</h1>
            <p className="text-xs text-[#AAB0D6]/40 mt-1">Admin Review Dashboard</p>
          </div>
          <button onClick={fetch} className="text-xs text-[#AAB0D6]/40 hover:text-[#AAB0D6] border border-white/8 hover:border-white/15 px-3 py-1.5 rounded-lg transition-all">
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-5 gap-3 mb-7">
          {(['all', 'pending', 'under_review', 'approved', 'declined'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-xl p-3 text-center border transition-all ${filter === s ? 'border-[#C8A75E]/30 bg-[#C8A75E]/8' : 'border-white/5 bg-white/2 hover:border-white/12'}`}
            >
              <p className={`text-lg font-bold ${filter === s ? 'text-[#C8A75E]' : 'text-white'}`}>{counts[s]}</p>
              <p className="text-[10px] text-[#AAB0D6]/40 capitalize mt-0.5">{s.replace('_', ' ')}</p>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Filter className="w-4 h-4 text-[#AAB0D6]/30" />
          <div className="flex gap-2">
            {(['all', 'scholar', 'fellow'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`text-xs px-3 py-1.5 rounded-lg border capitalize transition-all ${typeFilter === t ? 'border-[#C8A75E]/30 bg-[#C8A75E]/8 text-[#C8A75E]' : 'border-white/8 text-[#AAB0D6]/40 hover:border-white/15'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-[#C8A75E]/50 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 border border-white/5 rounded-2xl">
            <p className="text-[#AAB0D6]/30 text-sm">No applications match the current filters.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((app) => {
              const meta = STATUS_META[app.status] ?? STATUS_META.pending;
              const isFellow = app.membership_type === 'fellow';
              const TypeIcon = isFellow ? Award : GraduationCap;
              const isExpanded = expanded === app.id;

              return (
                <div key={app.id} className="bg-gradient-to-br from-[#141A3A]/50 to-[#0D1129]/50 border border-white/6 rounded-2xl overflow-hidden">
                  <div
                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/2 transition-all"
                    onClick={() => setExpanded(isExpanded ? null : app.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isFellow ? 'bg-[#C8A75E]/12' : 'bg-[#4A90D9]/12'}`}>
                        <TypeIcon className={`w-4 h-4 ${isFellow ? 'text-[#C8A75E]' : 'text-[#4A90D9]'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#F5F3EE]">{app.full_name}</p>
                        <p className="text-xs text-[#AAB0D6]/40 mt-0.5">{app.email} · {app.affiliation}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] px-2.5 py-1 rounded-full border ${meta.bg} ${meta.color} font-medium`}>{meta.label}</span>
                      <span className="text-xs text-[#AAB0D6]/30 hidden sm:block">
                        {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-[#AAB0D6]/30" /> : <ChevronDown className="w-4 h-4 text-[#AAB0D6]/30" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-6 border-t border-white/5 pt-5 space-y-5">
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          { icon: User, label: 'Name', value: app.full_name },
                          { icon: MapPin, label: 'Location', value: app.location },
                          { icon: Building, label: 'Affiliation', value: app.affiliation },
                          { icon: Calendar, label: 'Applied', value: new Date(app.created_at).toLocaleDateString() },
                        ].map(({ icon: Icon, label, value }) => (
                          <div key={label}>
                            <p className="text-[10px] tracking-[0.15em] text-[#AAB0D6]/30 uppercase mb-1 flex items-center gap-1.5">
                              <Icon className="w-3 h-3" /> {label}
                            </p>
                            <p className="text-sm text-[#F5F7FA]">{value}</p>
                          </div>
                        ))}
                      </div>

                      {app.areas_of_study?.length > 0 && (
                        <div>
                          <p className="text-[10px] tracking-[0.15em] text-[#AAB0D6]/30 uppercase mb-2">Areas of Study</p>
                          <div className="flex flex-wrap gap-1.5">
                            {(app.areas_of_study as string[]).map((a) => (
                              <span key={a} className="text-xs px-2.5 py-1 rounded-full bg-white/4 border border-white/8 text-[#AAB0D6]/60">{a}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <p className="text-[10px] tracking-[0.15em] text-[#AAB0D6]/30 uppercase mb-2">Biography</p>
                        <p className="text-sm text-[#AAB0D6]/65 leading-relaxed">{app.bio}</p>
                      </div>

                      {isFellow && app.years_of_engagement && (
                        <div>
                          <p className="text-[10px] tracking-[0.15em] text-[#AAB0D6]/30 uppercase mb-2">Years of Engagement</p>
                          <p className="text-sm text-[#AAB0D6]/65">{app.years_of_engagement}</p>
                        </div>
                      )}

                      {!isFellow && app.academic_focus && (
                        <div>
                          <p className="text-[10px] tracking-[0.15em] text-[#AAB0D6]/30 uppercase mb-2">Academic Focus</p>
                          <p className="text-sm text-[#AAB0D6]/65">{app.academic_focus}</p>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-3.5 h-3.5 text-[#AAB0D6]/30" />
                          <p className="text-[10px] tracking-[0.15em] text-[#AAB0D6]/30 uppercase">Statement</p>
                        </div>
                        <div className="bg-[#0D1129]/60 rounded-xl p-4 max-h-48 overflow-y-auto">
                          <p className="text-sm text-[#AAB0D6]/65 leading-relaxed whitespace-pre-wrap">{app.statement}</p>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-5">
                        <p className="text-[10px] tracking-[0.15em] text-[#AAB0D6]/30 uppercase mb-2">Review Notes</p>
                        <textarea
                          className={`${TEXTAREA} min-h-[80px] mb-4`}
                          value={notes[app.id] ?? ''}
                          onChange={(e) => setNotes((p) => ({ ...p, [app.id]: e.target.value }))}
                          placeholder="Add review notes (visible to applicant if any action is taken)"
                        />
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => updateStatus(app.id, 'under_review')}
                            disabled={saving === app.id || app.status === 'under_review'}
                            className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg bg-[#C8A75E]/10 border border-[#C8A75E]/25 text-[#C8A75E] hover:bg-[#C8A75E]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" /> Mark Under Review
                          </button>
                          <button
                            onClick={() => updateStatus(app.id, 'approved')}
                            disabled={saving === app.id || app.status === 'approved'}
                            className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg bg-[#27AE60]/10 border border-[#27AE60]/25 text-[#27AE60] hover:bg-[#27AE60]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                          >
                            {saving === app.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(app.id, 'declined')}
                            disabled={saving === app.id || app.status === 'declined'}
                            className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg bg-[#E07070]/10 border border-[#E07070]/25 text-[#E07070] hover:bg-[#E07070]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Decline
                          </button>
                          <button
                            onClick={() => updateStatus(app.id, 'pending')}
                            disabled={saving === app.id || app.status === 'pending'}
                            className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[#AAB0D6]/50 hover:bg-white/8 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                          >
                            <Clock className="w-3.5 h-3.5" /> Reset to Pending
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
