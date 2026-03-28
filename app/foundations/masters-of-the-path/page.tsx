'use client';

import { useState, useEffect, useMemo } from 'react';
import { ObservatoryHero } from '@/components/observatory-hero';
import { SaintCard } from '@/components/saint-card';
import { SaintDetailDrawer } from '@/components/saint-detail-drawer';
import { SaintFilters } from '@/components/saint-filters';
import { SaintsTimeline } from '@/components/saints-timeline';
import { SaintsAtlas } from '@/components/saints-atlas';
import { ViewSwitcher } from '@/components/view-switcher';
import { supabase } from '@/lib/supabase';
import { SaintWithRelations, Lineage, Saint } from '@/lib/database.types';
import { Loader2, Users, Globe, Sparkles, Clock, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Theme {
  id: string;
  name: string;
  slug: string;
  display_order?: number;
}

interface HistoricalPeriod {
  id: string;
  name: string;
  slug: string;
  start_year: number;
  end_year?: number;
}

interface RegionWithHierarchy {
  id: string;
  name: string;
  slug: string;
  level: number;
  parent_region_id?: string | null;
  display_order?: number;
}

interface LineageWithHierarchy extends Lineage {
  level?: number;
  display_order?: number;
}

interface SearchParams {
  lineage?: string;
  region?: string;
  era?: string;
  theme?: string;
}

export default function MastersOfThePathPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [saints, setSaints] = useState<SaintWithRelations[]>([]);
  const [lineages, setLineages] = useState<LineageWithHierarchy[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [eras, setEras] = useState<HistoricalPeriod[]>([]);
  const [allRegions, setAllRegions] = useState<RegionWithHierarchy[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLineage, setSelectedLineage] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'timeline' | 'atlas'>('grid');
  const [selectedSaint, setSelectedSaint] = useState<SaintWithRelations | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [saintsRes, lineagesRes, themesRes, erasRes, regionsRes] = await Promise.all([
        supabase
          .from('saints')
          .select('*')
          .is('deleted_at', null)
          .order('birth_year', { ascending: true, nullsFirst: false }),
        supabase
          .from('lineages')
          .select('id, name, slug, description, parent_lineage_id, level, display_order')
          .is('deleted_at', null)
          .order('display_order', { ascending: true }),
        supabase
          .from('themes')
          .select('id, name, slug, display_order')
          .is('deleted_at', null)
          .order('display_order', { ascending: true }),
        supabase
          .from('historical_periods')
          .select('id, name, slug, start_year, end_year, display_order')
          .is('deleted_at', null)
          .order('display_order', { ascending: true }),
        supabase
          .from('regions')
          .select('id, name, slug, level, parent_region_id, display_order')
          .is('deleted_at', null)
          .order('display_order', { ascending: true }),
      ]);

      if (saintsRes.error) throw saintsRes.error;
      if (lineagesRes.error) throw lineagesRes.error;
      if (themesRes.error) throw themesRes.error;
      if (erasRes.error) throw erasRes.error;
      if (regionsRes.error) throw regionsRes.error;

      const saintsWithRelations: SaintWithRelations[] = await Promise.all(
        (saintsRes.data || []).map(async (saint: Saint): Promise<SaintWithRelations> => {
          const [{ data: saintLineages }, { data: saintThemes }] = await Promise.all([
            supabase
              .from('saint_lineages')
              .select('lineage_id, lineages!inner(*)')
              .eq('saint_id', saint.id),
            supabase
              .from('saint_themes')
              .select('theme_id, themes!inner(*)')
              .eq('saint_id', saint.id),
          ]);
          return {
            ...saint,
            lineages: saintLineages?.map((sl: any) => sl.lineages) || [],
            themes: saintThemes?.map((st: any) => st.themes) || [],
          };
        })
      );

      const allLineages: LineageWithHierarchy[] = lineagesRes.data || [];
      const allEras: HistoricalPeriod[] = erasRes.data || [];
      const allRegionsList: RegionWithHierarchy[] = regionsRes.data || [];

      setSaints(saintsWithRelations);
      setLineages(allLineages);
      setThemes(themesRes.data || []);
      setEras(allEras);
      setAllRegions(allRegionsList);

      if (searchParams?.lineage) {
        const match = allLineages.find((l) => l.slug === searchParams.lineage);
        if (match) setSelectedLineage(match.id);
      }
      if (searchParams?.region) {
        const match = allRegionsList.find((r) => r.slug === searchParams.region);
        if (match) setSelectedRegion(match.id);
      }
      if (searchParams?.era) {
        const match = allEras.find((e) => e.slug === searchParams.era);
        if (match) setSelectedEra(match.id);
      }
      if (searchParams?.theme) {
        const allThemes: Theme[] = themesRes.data || [];
        const match = allThemes.find((t) => t.slug === searchParams.theme);
        if (match) setSelectedTheme(match.id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredSaints = useMemo(() => {
    return saints.filter((saint) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match =
          saint.name.toLowerCase().includes(q) ||
          saint.short_summary?.toLowerCase().includes(q) ||
          saint.biography?.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (selectedLineage) {
        if (!saint.lineages?.some((l) => l.id === selectedLineage)) return false;
      }
      if (selectedRegion) {
        if (!saint.region_id) return false;
        const sr = allRegions.find((r) => r.id === saint.region_id);
        if (!sr) return false;
        if (sr.id !== selectedRegion && sr.parent_region_id !== selectedRegion) return false;
      }
      if (selectedEra && saint.birth_year) {
        const era = eras.find((e) => e.id === selectedEra);
        if (era) {
          const inRange =
            saint.birth_year >= era.start_year &&
            (!era.end_year || saint.birth_year <= era.end_year);
          if (!inRange) return false;
        }
      }
      if (selectedTheme) {
        if (!saint.themes?.some((t) => t.id === selectedTheme)) return false;
      }
      return true;
    });
  }, [saints, searchQuery, selectedLineage, selectedRegion, selectedEra, selectedTheme, eras, allRegions]);

  const availableLineages = useMemo(() => {
    const pool = saints.filter((saint) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!saint.name.toLowerCase().includes(q) && !saint.short_summary?.toLowerCase().includes(q)) return false;
      }
      if (selectedRegion) {
        if (!saint.region_id) return false;
        const sr = allRegions.find((r) => r.id === saint.region_id);
        if (!sr || (sr.id !== selectedRegion && sr.parent_region_id !== selectedRegion)) return false;
      }
      if (selectedEra && saint.birth_year) {
        const era = eras.find((e) => e.id === selectedEra);
        if (era && !(saint.birth_year >= era.start_year && (!era.end_year || saint.birth_year <= era.end_year))) return false;
      }
      if (selectedTheme && !saint.themes?.some((t) => t.id === selectedTheme)) return false;
      return true;
    });
    return lineages.filter((l) => pool.some((s) => s.lineages?.some((sl) => sl.id === l.id)));
  }, [lineages, saints, searchQuery, selectedRegion, selectedEra, selectedTheme, eras, allRegions]);

  const availableRegions = useMemo(() => {
    const regionIds = new Set<string>();
    saints.forEach((saint) => {
      if (!saint.region_id) return;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!saint.name.toLowerCase().includes(q) && !saint.short_summary?.toLowerCase().includes(q)) return;
      }
      if (selectedLineage && !saint.lineages?.some((l) => l.id === selectedLineage)) return;
      if (selectedEra && saint.birth_year) {
        const era = eras.find((e) => e.id === selectedEra);
        if (era && !(saint.birth_year >= era.start_year && (!era.end_year || saint.birth_year <= era.end_year))) return;
      }
      if (selectedTheme && !saint.themes?.some((t) => t.id === selectedTheme)) return;
      regionIds.add(saint.region_id);
    });
    return allRegions.filter((r) => {
      if (regionIds.has(r.id)) return true;
      if (r.level === 0) {
        return allRegions.some((child) => child.parent_region_id === r.id && regionIds.has(child.id));
      }
      return false;
    });
  }, [allRegions, saints, searchQuery, selectedLineage, selectedEra, selectedTheme, eras]);

  const availableEras = useMemo(() => {
    const pool = saints.filter((saint) => {
      if (!saint.birth_year) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!saint.name.toLowerCase().includes(q) && !saint.short_summary?.toLowerCase().includes(q)) return false;
      }
      if (selectedLineage && !saint.lineages?.some((l) => l.id === selectedLineage)) return false;
      if (selectedRegion) {
        if (!saint.region_id) return false;
        const sr = allRegions.find((r) => r.id === saint.region_id);
        if (!sr || (sr.id !== selectedRegion && sr.parent_region_id !== selectedRegion)) return false;
      }
      if (selectedTheme && !saint.themes?.some((t) => t.id === selectedTheme)) return false;
      return true;
    });
    return eras.filter((era) =>
      pool.some((s) =>
        s.birth_year! >= era.start_year && (!era.end_year || s.birth_year! <= era.end_year)
      )
    );
  }, [eras, saints, searchQuery, selectedLineage, selectedRegion, selectedTheme, allRegions]);

  const availableThemes = useMemo(() => {
    const pool = saints.filter((saint) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!saint.name.toLowerCase().includes(q) && !saint.short_summary?.toLowerCase().includes(q)) return false;
      }
      if (selectedLineage && !saint.lineages?.some((l) => l.id === selectedLineage)) return false;
      if (selectedRegion) {
        if (!saint.region_id) return false;
        const sr = allRegions.find((r) => r.id === saint.region_id);
        if (!sr || (sr.id !== selectedRegion && sr.parent_region_id !== selectedRegion)) return false;
      }
      if (selectedEra && saint.birth_year) {
        const era = eras.find((e) => e.id === selectedEra);
        if (era && !(saint.birth_year >= era.start_year && (!era.end_year || saint.birth_year <= era.end_year))) return false;
      }
      return true;
    });
    return themes.filter((t) => pool.some((s) => s.themes?.some((st) => st.id === t.id)));
  }, [themes, saints, searchQuery, selectedLineage, selectedRegion, selectedEra, allRegions, eras]);

  const activeFiltersCount = [selectedLineage, selectedRegion, selectedEra, selectedTheme].filter(Boolean).length;

  function handleClearFilters() {
    setSelectedLineage(null);
    setSelectedRegion(null);
    setSelectedEra(null);
    setSelectedTheme(null);
  }

  function handleSaintClick(saint: SaintWithRelations) {
    setSelectedSaint(saint);
    setDrawerOpen(true);
  }

  function handleEraClick(eraId: string) {
    setSelectedEra(eraId);
    setView('grid');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F2A]">
        <Loader2 className="h-8 w-8 animate-spin text-[#C8A75E]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F2A]">
      <ObservatoryHero
        subtitle="Foundational Studies"
        whiteHeading='Masters of the'
        goldHeading='Path'
        description="The primary archive of Sufi masters — organized by lineage, region, era, and theme. Apply any filter combination to navigate the full civilizational record."
      />

      <section className="py-12 px-4 observatory-gradient">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
            <Card className="p-5 glass-panel border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-7 w-7 text-[#C8A75E]" />
                <span className="text-2xl font-bold text-[#F5F3EE]">{saints.length}</span>
              </div>
              <p className="text-xs text-[#AAB0D6]">Sufi Masters</p>
            </Card>

            <Card className="p-5 glass-panel border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center justify-between mb-2">
                <Sparkles className="h-7 w-7 text-[#C8A75E]" />
                <span className="text-2xl font-bold text-[#F5F3EE]">{lineages.length}</span>
              </div>
              <p className="text-xs text-[#AAB0D6]">Lineages</p>
            </Card>

            <Card className="p-5 glass-panel border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center justify-between mb-2">
                <Globe className="h-7 w-7 text-[#C8A75E]" />
                <span className="text-2xl font-bold text-[#F5F3EE]">
                  {allRegions.filter((r) => r.level === 0).length}
                </span>
              </div>
              <p className="text-xs text-[#AAB0D6]">Civilizational Regions</p>
            </Card>

            <Card className="p-5 glass-panel border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-7 w-7 text-[#C8A75E]" />
                <span className="text-2xl font-bold text-[#F5F3EE]">{eras.length}</span>
              </div>
              <p className="text-xs text-[#AAB0D6]">Historical Eras</p>
            </Card>

            <Card className="p-5 glass-panel border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center justify-between mb-2">
                <Lightbulb className="h-7 w-7 text-[#C8A75E]" />
                <span className="text-2xl font-bold text-[#F5F3EE]">{themes.length}</span>
              </div>
              <p className="text-xs text-[#AAB0D6]">Scholarly Themes</p>
            </Card>
          </div>

          <SaintFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedLineage={selectedLineage}
            onLineageChange={setSelectedLineage}
            selectedRegion={selectedRegion}
            onRegionChange={setSelectedRegion}
            selectedEra={selectedEra}
            onEraChange={setSelectedEra}
            selectedTheme={selectedTheme}
            onThemeChange={setSelectedTheme}
            lineages={availableLineages}
            allLineages={lineages}
            regions={availableRegions}
            allRegions={allRegions}
            eras={availableEras}
            themes={availableThemes}
            allThemes={themes}
            activeFiltersCount={activeFiltersCount}
            onClearFilters={handleClearFilters}
            filteredCount={filteredSaints.length}
            totalCount={saints.length}
          />

          <div className="flex justify-center mb-8">
            <ViewSwitcher view={view} onViewChange={setView} />
          </div>

          {filteredSaints.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-[#AAB0D6]">No masters found matching your criteria.</p>
              <button
                onClick={handleClearFilters}
                className="mt-4 text-[#C8A75E] hover:text-[#E6D5A8] font-medium transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              {view === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSaints.map((saint) => (
                    <SaintCard
                      key={saint.id}
                      saint={saint}
                      onClick={() => handleSaintClick(saint)}
                      allRegions={allRegions}
                    />
                  ))}
                </div>
              )}

              {view === 'timeline' && (
                <SaintsTimeline
                  saints={filteredSaints}
                  onSaintClick={handleSaintClick}
                  eraBands={eras}
                  onEraClick={handleEraClick}
                />
              )}

              {view === 'atlas' && (
                <SaintsAtlas
                  saints={filteredSaints}
                  onSaintClick={handleSaintClick}
                  allRegions={allRegions}
                />
              )}
            </>
          )}
        </div>
      </section>

      <SaintDetailDrawer
        saint={selectedSaint}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
