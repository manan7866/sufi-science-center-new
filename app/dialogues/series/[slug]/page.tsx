import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ObservatoryHero } from '@/components/observatory-hero';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  BookOpen, Calendar, Users, Clock, PlayCircle,
  Lightbulb, MessageCircle, ArrowRight, ArrowLeft, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

interface SeriesDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function SeriesDetailPage({ params }: SeriesDetailPageProps) {
  const { data: series } = await (supabase as any)
    .from('dialogue_series')
    .select('*')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!series) {
    notFound();
  }

  const { data: episodes } = await (supabase as any)
    .from('series_episodes')
    .select('*')
    .eq('series_id', series.id)
    .order('episode_number', { ascending: true });

  const { data: themes } = await (supabase as any)
    .from('series_themes')
    .select(`
      theme_id,
      themes (
        id,
        slug,
        name,
        description
      )
    `)
    .eq('series_id', series.id)
    .order('relevance_weight', { ascending: false });

  const { data: recommendations } = await (supabase as any)
    .from('series_recommendations')
    .select(`
      relevance_score,
      reason,
      to_series:dialogue_series!series_recommendations_to_series_id_fkey (
        id,
        slug,
        title,
        subtitle,
        description,
        total_episodes,
        difficulty_level
      )
    `)
    .eq('from_series_id', series.id)
    .order('relevance_score', { ascending: false })
    .limit(3);

  const totalDuration = episodes?.reduce((sum: number, ep: any) => sum + (ep.duration_minutes || 0), 0) || 0;
  const publishedDate = new Date(series.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });

  return (
    <div className="min-h-screen">
      <ObservatoryHero
        subtitle="Dialogic Inquiry Series"
        whiteHeading='Exploring'
        goldHeading={series.title}
        description={series.subtitle || series.description}
      />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/dialogues/series" className="inline-flex items-center gap-2 text-[#AAB0D6]/60 hover:text-[#C8A75E] transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Series
          </Link>
        </div>
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <div className="flex items-center gap-4 flex-wrap mb-6">
                <Badge variant="outline" className="border-[#C8A75E]/30 text-[#C8A75E]">
                  {series.series_type || 'Exploration'}
                </Badge>
                <Badge variant="outline" className="border-[#AAB0D6]/30 text-[#AAB0D6]">
                  {series.difficulty_level || 'Intermediate'}
                </Badge>
                {series.featured && (
                  <Badge className="bg-[#C8A75E]/20 text-[#C8A75E] border-[#C8A75E]/30">
                    Featured
                  </Badge>
                )}
              </div>

              <div className="glass-panel rounded-2xl p-8 mb-8">
                <div className="flex items-center gap-8 text-sm text-[#AAB0D6] mb-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#C8A75E]" />
                    <span>{episodes?.length || 0} Episodes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#C8A75E]" />
                    <span>~{totalDuration} min total</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#C8A75E]" />
                    <span>{publishedDate}</span>
                  </div>
                </div>

                <p className="text-[#F5F3EE] text-lg leading-relaxed">
                  {series.description}
                </p>
              </div>

              {series.participants && series.participants.length > 0 && (
                <Card className="glass-panel border-white/10 mb-8">
                  <CardHeader>
                    <CardTitle className="text-xl text-[#F5F3EE] flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#C8A75E]" />
                      Series Participants
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {series.participants.map((participant: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#C8A75E]" />
                          <p className="text-[#F5F3EE]">{participant}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </section>

            <section>
              <h2 className="text-3xl font-semibold text-[#F5F3EE] mb-8 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-[#C8A75E]" />
                Episodes
              </h2>

              <div className="space-y-6">
                {episodes?.map((episode: any) => (
                  <Card key={episode.id} className="glass-panel border-white/10 hover:border-[#C8A75E]/30 transition-all group">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-[#C8A75E]/20 text-[#C8A75E] border-[#C8A75E]/30">
                              Episode {episode.episode_number}
                            </Badge>
                            {episode.duration_minutes && (
                              <span className="text-sm text-[#AAB0D6] flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {episode.duration_minutes} min
                              </span>
                            )}
                          </div>
                          <CardTitle className="text-xl text-[#F5F3EE] mb-2">
                            {episode.title}
                          </CardTitle>
                          <CardDescription className="text-[#AAB0D6]">
                            {episode.description}
                          </CardDescription>
                        </div>
                        {episode.video_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#C8A75E]/30 text-[#C8A75E] hover:bg-[#C8A75E]/10 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Watch
                          </Button>
                        )}
                      </div>
                    </CardHeader>

                    {(episode.key_questions?.length > 0 || episode.key_insights?.length > 0) && (
                      <CardContent className="space-y-4">
                        {episode.key_questions?.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-[#C8A75E] mb-2 flex items-center gap-2">
                              <MessageCircle className="w-4 h-4" />
                              Key Questions
                            </h4>
                            <ul className="space-y-2">
                              {episode.key_questions.slice(0, 2).map((question: string, idx: number) => (
                                <li key={idx} className="text-sm text-[#AAB0D6] flex items-start gap-2">
                                  <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#C8A75E]" />
                                  <span>{question}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {episode.key_insights?.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-[#C8A75E] mb-2 flex items-center gap-2">
                              <Lightbulb className="w-4 h-4" />
                              Key Insights
                            </h4>
                            <ul className="space-y-2">
                              {episode.key_insights.slice(0, 2).map((insight: string, idx: number) => (
                                <li key={idx} className="text-sm text-[#AAB0D6] flex items-start gap-2">
                                  <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#C8A75E]" />
                                  <span>{insight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            {themes && themes.length > 0 && (
              <Card className="glass-panel border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg text-[#F5F3EE]">Related Themes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {themes.map((item: any) => (
                      <Link
                        key={item.theme_id}
                        href={`/knowledge-systems/${item.themes.slug}`}
                        className="block p-3 rounded-lg hover:bg-white/5 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[#F5F3EE] group-hover:text-[#C8A75E] transition-colors">
                            {item.themes.name}
                          </span>
                          <ArrowRight className="w-4 h-4 text-[#AAB0D6] group-hover:text-[#C8A75E] group-hover:translate-x-1 transition-all" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {recommendations && recommendations.length > 0 && (
              <Card className="glass-panel border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg text-[#F5F3EE]">Recommended Series</CardTitle>
                  <CardDescription className="text-[#AAB0D6]">
                    Explore related dialogues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.map((rec: any) => (
                      <Link
                        key={rec.to_series.id}
                        href={`/dialogues/series/${rec.to_series.slug}`}
                        className="block group"
                      >
                        <div className="p-4 rounded-lg border border-white/10 hover:border-[#C8A75E]/30 transition-all">
                          <h4 className="font-semibold text-[#F5F3EE] mb-1 group-hover:text-[#C8A75E] transition-colors">
                            {rec.to_series.title}
                          </h4>
                          {rec.to_series.subtitle && (
                            <p className="text-sm text-[#AAB0D6] mb-2">{rec.to_series.subtitle}</p>
                          )}
                          {rec.reason && (
                            <p className="text-xs text-[#AAB0D6] italic">
                              {rec.reason}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-3 text-xs text-[#AAB0D6]">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {rec.to_series.total_episodes} episodes
                            </span>
                            <Badge variant="outline" className="border-[#AAB0D6]/30 text-[#AAB0D6] text-xs">
                              {rec.to_series.difficulty_level}
                            </Badge>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="glass-panel border-white/10 bg-[#C8A75E]/5">
              <CardHeader>
                <CardTitle className="text-lg text-[#F5F3EE]">Access Format</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-[#AAB0D6] mb-3">
                    Currently available as written transcripts for deep reflection and study.
                  </p>
                  <Link href={`/dialogues/series/${series.slug}/transcript`}>
                    <Button className="w-full bg-[#C8A75E] hover:bg-[#C8A75E]/90 text-[#0A0A0F]">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Read Full Transcript
                    </Button>
                  </Link>
                </div>
                <Separator className="bg-white/10" />
                <p className="text-xs text-[#AAB0D6] italic">
                  Audio and video formats coming soon to provide multiple ways to engage with these dialogues.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
