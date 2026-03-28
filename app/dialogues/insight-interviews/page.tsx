import Link from 'next/link';
import { Sparkles, BookOpen, User, Building, Calendar, ArrowRight, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Insight Interviews | Sufi Science Center',
  description: 'Transformation narratives and personal insights from individuals at the intersection of science and spirituality.',
};

const INTERVIEWS = [
  {
    slug: 'bridging-neuroscience-and-contemplative-practice',
    title: 'Bridging Neuroscience and Contemplative Practice',
    interviewee: 'Dr. Amina Hassan',
    affiliation: 'MIT Center for Neurobiological Engineering',
    description: 'How cutting-edge neuroscience research intersects with a lifelong Sufi practice, and what each tradition reveals about the other.',
    themes: ['Neuroscience', 'Meditation Research', 'Personal Practice'],
    readTime: '45 min',
    published: '2024-01-15',
  },
  {
    slug: 'from-silicon-valley-to-sacred-service',
    title: 'From Silicon Valley to Sacred Service',
    interviewee: 'Omar Farid',
    affiliation: 'Former VP Engineering, Now Community Organizer',
    description: 'A transformation journey from tech leadership to community service, exploring how Sufi principles inform ethical technology and social change.',
    themes: ['Technology Ethics', 'Service', 'Career Transformation'],
    readTime: '52 min',
    published: '2023-12-08',
  },
  {
    slug: 'complexity-science-and-spiritual-emergence',
    title: 'Complexity Science and Spiritual Emergence',
    interviewee: 'Prof. Sarah Chen',
    affiliation: 'Santa Fe Institute',
    description: 'Investigating parallels between complex adaptive systems and stages of spiritual development through rigorous scientific inquiry.',
    themes: ['Complex Systems', 'Spiritual Development', 'Scientific Method'],
    readTime: '48 min',
    published: '2023-11-20',
  },
];

export default function InsightInterviewsPage() {
  return (
    <div className="min-h-screen">
      <div className="relative py-16 px-4 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C8A75E]/4 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <p className="text-xs tracking-[0.22em] text-[#C8A75E]/60 uppercase mb-2">Dialogues</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#F5F3EE] leading-tight mb-4">
            Insight Interviews
          </h1>
          <p className="text-[#AAB0D6] leading-relaxed max-w-2xl">
            Transformation narratives and personal insights from researchers, practitioners, and contemplatives
            working at the intersection of science and spiritual wisdom.
          </p>
        </div>
      </div>

      <section className="py-12 px-4 border-b border-white/5">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="glass-panel rounded-2xl p-7 border border-white/5">
            <div className="w-9 h-9 rounded-xl bg-[#C8A75E]/10 border border-[#C8A75E]/20 flex items-center justify-center mb-4">
              <Sparkles className="w-4.5 h-4.5 text-[#C8A75E]" />
            </div>
            <h2 className="text-sm font-serif font-semibold text-[#F5F3EE] mb-3">About Insight Interviews</h2>
            <p className="text-xs text-[#AAB0D6]/60 leading-relaxed mb-3">
              These interviews explore how individuals integrate Sufi wisdom with their professional work,
              scientific research, and personal development. More than biography, each conversation investigates
              the lived experience of bridging traditions.
            </p>
            <p className="text-xs text-[#AAB0D6]/50 leading-relaxed">
              Participants share transformation narratives, methodological insights, and the challenges and
              discoveries that emerge when contemplative practice meets rigorous inquiry.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-7 border border-[#C8A75E]/15 bg-[#C8A75E]/3">
            <h3 className="text-sm font-serif font-semibold text-[#F5F3EE] mb-3">Contribute Your Perspective</h3>
            <p className="text-xs text-[#AAB0D6]/60 leading-relaxed mb-6">
              We invite researchers, practitioners, and contemplatives to share how Sufi wisdom informs
              their work and inner development.
            </p>
            <Link href="/dialogues/insight-interviews/apply" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#C8A75E] text-[#0A0C14] hover:bg-[#C8A75E]/90 transition-all">
              Apply to Participate
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-10">
            <h2 className="text-[10px] tracking-[0.2em] text-[#AAB0D6]/40 uppercase">Featured Interviews</h2>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="space-y-6">
            {INTERVIEWS.map((interview) => {
              const date = new Date(interview.published).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
              return (
                <div key={interview.slug} className="glass-panel rounded-2xl p-7 border border-white/5 hover:border-[#C8A75E]/20 transition-all group">
                  <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#C8A75E]/12 border border-[#C8A75E]/20 text-[#C8A75E] uppercase tracking-widest font-medium">Insight Interview</span>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-[#F5F3EE] mb-2 group-hover:text-[#C8A75E] transition-colors">
                        {interview.title}
                      </h3>
                      <p className="text-sm text-[#AAB0D6]/70 leading-relaxed mb-4 max-w-2xl">
                        {interview.description}
                      </p>

                      <div className="flex items-center gap-4 mb-4 flex-wrap">
                        <div className="flex items-center gap-1.5 text-xs text-[#AAB0D6]/50">
                          <User className="w-3.5 h-3.5 text-[#C8A75E]/50" />
                          <span className="text-[#F5F3EE]/60 font-medium">{interview.interviewee}</span>
                        </div>
                        {interview.affiliation && (
                          <div className="flex items-center gap-1.5 text-xs text-[#AAB0D6]/40">
                            <Building className="w-3.5 h-3.5" />
                            {interview.affiliation}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {interview.themes.map((theme, i) => (
                          <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-white/3 border border-white/5 text-[#AAB0D6]/35">{theme}</span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-[10px] text-[#AAB0D6]/30">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          {date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="w-3 h-3" />
                          {interview.readTime} read
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <Link href={`/dialogues/insight-interviews/${interview.slug}`}>
                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#C8A75E]/10 border border-[#C8A75E]/20 text-[#C8A75E] hover:bg-[#C8A75E]/16 hover:border-[#C8A75E]/35 transition-all whitespace-nowrap">
                          <BookOpen className="w-4 h-4" />
                          Read Interview
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-14 glass-panel rounded-2xl p-7 border border-white/5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#6B9BD1]/10 border border-[#6B9BD1]/20 flex items-center justify-center flex-shrink-0">
                <ChevronRight className="w-5 h-5 text-[#6B9BD1]" />
              </div>
              <div>
                <h3 className="text-sm font-serif font-semibold text-[#F5F3EE] mb-2">Expanding Archive</h3>
                <p className="text-xs text-[#AAB0D6]/60 leading-relaxed">
                  New interviews are added regularly. Each conversation is peer-reviewed for intellectual integrity
                  and presented with full transcripts. Audio versions are in preparation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
