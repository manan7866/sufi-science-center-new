'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { MessageSquare, LifeBuoy, Clock, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, Loader as Loader2, ChevronRight, RefreshCw } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { usePortalSession } from '@/hooks/use-portal-session';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Ticket {
  id: string;
  ticket_number: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  open: { label: 'Open', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20', icon: Clock },
  in_progress: { label: 'In Progress', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20', icon: Loader2 },
  resolved: { label: 'Resolved', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle2 },
  closed: { label: 'Closed', color: 'text-[#AAB0D6]/50', bg: 'bg-white/4 border-white/8', icon: CheckCircle2 },
};

const PRIORITY_DOTS: Record<string, string> = {
  low: 'bg-blue-400/60',
  medium: 'bg-amber-400/70',
  high: 'bg-rose-400/70',
};

const CATEGORY_LABELS: Record<string, string> = {
  general: 'General Inquiry',
  membership: 'Membership & Access',
  donation: 'Donation & Payment',
  research: 'Research & Collaboration',
  technical: 'Technical Issue',
  other: 'Other',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function MyTicketsPage() {
  const { session } = usePortalSession();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

  const fetchTickets = useCallback(async () => {
    if (!session?.session_token) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await db
        .rpc('get_tickets_by_token', { p_token: session.session_token });

      if (fetchError) throw fetchError;
      setTickets((data as Ticket[]) || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load tickets.');
    } finally {
      setLoading(false);
    }
  }, [session?.session_token]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const filtered = tickets.filter((t) => {
    if (filter === 'open') return t.status === 'open' || t.status === 'in_progress';
    if (filter === 'resolved') return t.status === 'resolved' || t.status === 'closed';
    return true;
  });

  const openCount = tickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C8A75E]/10 border border-[#C8A75E]/20 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-[#C8A75E]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#F5F3EE] font-serif">My Tickets</h1>
            <p className="text-xs text-[#AAB0D6]/60 mt-0.5">
              {tickets.length === 0
                ? 'No tickets yet'
                : `${tickets.length} ticket${tickets.length !== 1 ? 's' : ''}${openCount > 0 ? ` · ${openCount} open` : ''}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchTickets}
            disabled={loading}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/8 text-[#AAB0D6]/50 hover:text-[#AAB0D6] hover:bg-white/4 transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/portal/support/create"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C8A75E]/12 border border-[#C8A75E]/25 text-[#C8A75E] text-xs font-semibold hover:bg-[#C8A75E]/18 hover:border-[#C8A75E]/40 transition-all"
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            New Ticket
          </Link>
        </div>
      </div>

      {tickets.length > 0 && (
        <div className="flex gap-1.5 mb-5">
          {([
            { key: 'all', label: `All (${tickets.length})` },
            { key: 'open', label: `Open (${openCount})` },
            { key: 'resolved', label: `Resolved (${resolvedCount})` },
          ] as const).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                filter === f.key
                  ? 'bg-[#C8A75E]/10 border-[#C8A75E]/25 text-[#C8A75E]'
                  : 'border-white/6 text-[#AAB0D6]/60 hover:text-[#AAB0D6] hover:border-white/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-6 h-6 text-[#C8A75E]/50 animate-spin" />
          <p className="text-xs text-[#AAB0D6]/40">Loading your tickets…</p>
        </div>
      ) : error ? (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-rose-500/8 border border-rose-500/20 text-rose-400 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel border border-white/8 rounded-2xl p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-[#C8A75E]/8 border border-[#C8A75E]/12 flex items-center justify-center mx-auto mb-5">
            <LifeBuoy className="w-6 h-6 text-[#C8A75E]/40" />
          </div>
          <h3 className="text-base font-semibold text-[#F5F3EE] font-serif mb-2">
            {filter === 'all' ? 'No tickets yet' : `No ${filter} tickets`}
          </h3>
          <p className="text-xs text-[#AAB0D6]/50 mb-6 leading-relaxed max-w-xs mx-auto">
            {filter === 'all'
              ? 'Have a question or issue? Submit a support ticket and the SSC team will respond within 1–3 business days.'
              : `You have no ${filter} tickets at this time.`}
          </p>
          {filter === 'all' && (
            <Link
              href="/portal/support/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C8A75E]/10 border border-[#C8A75E]/25 text-[#C8A75E] text-sm font-medium hover:bg-[#C8A75E]/15 transition-colors"
            >
              <LifeBuoy className="w-4 h-4" />
              Create Your First Ticket
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((ticket) => {
            const statusCfg = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
            const StatusIcon = statusCfg.icon;
            return (
              <Link
                key={ticket.id}
                href={`/portal/support/tickets/${ticket.id}`}
                className="glass-panel border border-white/8 rounded-2xl p-5 hover:border-white/12 transition-all group block"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-mono text-[#C8A75E]/60 tracking-wider">{ticket.ticket_number}</span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusCfg.bg} ${statusCfg.color}`}>
                        <StatusIcon className="w-2.5 h-2.5" />
                        {statusCfg.label}
                      </span>
                      <span className="text-[10px] text-[#AAB0D6]/40">
                        {CATEGORY_LABELS[ticket.category] || ticket.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#F5F3EE] truncate pr-2">{ticket.subject}</h3>
                    <p className="text-xs text-[#AAB0D6]/50 mt-1.5 line-clamp-2 leading-relaxed">
                      {ticket.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOTS[ticket.priority] || 'bg-[#AAB0D6]/30'}`} />
                      <span className="text-[10px] text-[#AAB0D6]/40 capitalize">{ticket.priority}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#AAB0D6]/20 group-hover:text-[#C8A75E]/40 transition-colors" />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/4">
                  <span className="text-[10px] text-[#AAB0D6]/30">Submitted {timeAgo(ticket.created_at)}</span>
                  {ticket.updated_at !== ticket.created_at && (
                    <span className="text-[10px] text-[#AAB0D6]/20">· Updated {timeAgo(ticket.updated_at)}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {tickets.length > 0 && (
        <p className="text-[10px] text-[#AAB0D6]/25 text-center mt-8 leading-relaxed">
          For urgent matters, include your ticket reference number in all follow-up communications.
        </p>
      )}
    </div>
  );
}
