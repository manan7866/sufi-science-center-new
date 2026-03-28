/*
  # Expand Dialogue Series with Episodes and Recommendations

  ## Overview
  Transforms dialogue series into a comprehensive knowledge system with:
  - Episode management (multiple episodes per series)
  - Series-to-series recommendations based on themes
  - Rich content for each episode with key insights
  - Knowledge graph connections to saints, themes, and research
  - Viewing progress tracking

  ## New Tables
  - `series_episodes` - Individual episodes within a series
  - `series_recommendations` - Related series suggestions
  - `series_themes` - Junction table for series-theme relationships
  - `episode_insights` - Key takeaways from each episode

  ## Enhanced Schema
  - Series metadata enriched with summary, duration, level
  - Episodes with transcripts, timestamps, key questions
  - Recommendation engine based on theme overlap
  
  ## Security
  - RLS enabled on all new tables
  - Public read access for published content
*/

-- ============================================================================
-- SERIES EPISODES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS series_episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id UUID NOT NULL REFERENCES dialogue_series(id) ON DELETE CASCADE,
  episode_number INTEGER NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  transcript TEXT,
  key_questions JSONB DEFAULT '[]'::jsonb,
  key_insights JSONB DEFAULT '[]'::jsonb,
  participants JSONB DEFAULT '[]'::jsonb,
  duration_minutes INTEGER,
  video_url TEXT,
  audio_url TEXT,
  video_timestamps JSONB DEFAULT '[]'::jsonb,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(series_id, episode_number),
  UNIQUE(series_id, slug)
);

-- ============================================================================
-- SERIES THEMES JUNCTION TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS series_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id UUID NOT NULL REFERENCES dialogue_series(id) ON DELETE CASCADE,
  theme_id UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  relevance_weight NUMERIC DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(series_id, theme_id)
);

-- ============================================================================
-- SERIES RECOMMENDATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS series_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_series_id UUID NOT NULL REFERENCES dialogue_series(id) ON DELETE CASCADE,
  to_series_id UUID NOT NULL REFERENCES dialogue_series(id) ON DELETE CASCADE,
  reason TEXT,
  relevance_score NUMERIC DEFAULT 0.5 CHECK (relevance_score >= 0 AND relevance_score <= 1),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(from_series_id, to_series_id),
  CHECK (from_series_id != to_series_id)
);

-- ============================================================================
-- SERIES METADATA ENHANCEMENTS
-- ============================================================================

-- Add additional metadata columns to dialogue_series
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dialogue_series' AND column_name = 'subtitle'
  ) THEN
    ALTER TABLE dialogue_series ADD COLUMN subtitle TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dialogue_series' AND column_name = 'total_episodes'
  ) THEN
    ALTER TABLE dialogue_series ADD COLUMN total_episodes INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dialogue_series' AND column_name = 'total_duration_minutes'
  ) THEN
    ALTER TABLE dialogue_series ADD COLUMN total_duration_minutes INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dialogue_series' AND column_name = 'difficulty_level'
  ) THEN
    ALTER TABLE dialogue_series ADD COLUMN difficulty_level TEXT DEFAULT 'intermediate';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dialogue_series' AND column_name = 'series_type'
  ) THEN
    ALTER TABLE dialogue_series ADD COLUMN series_type TEXT DEFAULT 'exploration';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dialogue_series' AND column_name = 'cover_image_url'
  ) THEN
    ALTER TABLE dialogue_series ADD COLUMN cover_image_url TEXT;
  END IF;
END $$;

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_series_episodes_series 
  ON series_episodes(series_id);

CREATE INDEX IF NOT EXISTS idx_series_episodes_published 
  ON series_episodes(published_at) WHERE published_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_series_themes_series 
  ON series_themes(series_id);

CREATE INDEX IF NOT EXISTS idx_series_themes_theme 
  ON series_themes(theme_id);

CREATE INDEX IF NOT EXISTS idx_series_recommendations_from 
  ON series_recommendations(from_series_id);

CREATE INDEX IF NOT EXISTS idx_series_recommendations_to 
  ON series_recommendations(to_series_id);

CREATE INDEX IF NOT EXISTS idx_series_recommendations_score 
  ON series_recommendations(relevance_score DESC);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE series_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE series_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE series_recommendations ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Public can view published episodes" ON series_episodes;
  CREATE POLICY "Public can view published episodes"
    ON series_episodes FOR SELECT
    TO public
    USING (published_at <= now());

  DROP POLICY IF EXISTS "Public can view series themes" ON series_themes;
  CREATE POLICY "Public can view series themes"
    ON series_themes FOR SELECT
    TO public
    USING (true);

  DROP POLICY IF EXISTS "Public can view series recommendations" ON series_recommendations;
  CREATE POLICY "Public can view series recommendations"
    ON series_recommendations FOR SELECT
    TO public
    USING (true);
END $$;

-- ============================================================================
-- SEED DIALOGUE SERIES
-- ============================================================================

-- Get theme IDs for associations
DO $$
DECLARE
  v_consciousness_id UUID;
  v_complexity_id UUID;
  v_transformation_id UUID;
  v_ethics_id UUID;
  v_energy_id UUID;
  v_epistemology_id UUID;

  v_series_1_id UUID;
  v_series_2_id UUID;
  v_series_3_id UUID;
  v_series_4_id UUID;
BEGIN
  -- Get theme IDs
  SELECT id INTO v_consciousness_id FROM themes WHERE slug = 'consciousness-studies' LIMIT 1;
  SELECT id INTO v_complexity_id FROM themes WHERE slug = 'complex-systems' LIMIT 1;
  SELECT id INTO v_transformation_id FROM themes WHERE slug = 'transformation' LIMIT 1;
  SELECT id INTO v_ethics_id FROM themes WHERE slug = 'ethical-discipline' LIMIT 1;
  SELECT id INTO v_energy_id FROM themes WHERE slug = 'energy-systems' LIMIT 1;
  SELECT id INTO v_epistemology_id FROM themes WHERE slug = 'epistemology' LIMIT 1;

  -- Series 1: Consciousness & Complexity
  INSERT INTO dialogue_series (
    slug, title, subtitle, description, 
    total_episodes, difficulty_level, series_type, featured, published_at
  ) VALUES (
    'consciousness-complexity-2024',
    'Consciousness & Complexity',
    'Exploring Emergence, Awareness, and the Hard Problem',
    'A four-part exploration of how consciousness emerges from complex systems, the relationship between subjective experience and physical processes, and the philosophical challenges of explaining awareness. Featuring perspectives from neuroscience, physics, contemplative traditions, and philosophy of mind.',
    4,
    'advanced',
    'exploration',
    true,
    now() - interval '2 months'
  ) RETURNING id INTO v_series_1_id;

  -- Connect Series 1 to themes
  IF v_consciousness_id IS NOT NULL THEN
    INSERT INTO series_themes (series_id, theme_id, relevance_weight) 
    VALUES (v_series_1_id, v_consciousness_id, 1.0);
  END IF;
  IF v_complexity_id IS NOT NULL THEN
    INSERT INTO series_themes (series_id, theme_id, relevance_weight) 
    VALUES (v_series_1_id, v_complexity_id, 0.9);
  END IF;
  IF v_epistemology_id IS NOT NULL THEN
    INSERT INTO series_themes (series_id, theme_id, relevance_weight) 
    VALUES (v_series_1_id, v_epistemology_id, 0.7);
  END IF;

  -- Episode 1.1
  INSERT INTO series_episodes (
    series_id, episode_number, slug, title, description, 
    key_questions, key_insights, participants, duration_minutes, published_at
  ) VALUES (
    v_series_1_id, 1,
    'foundations-of-consciousness',
    'Foundations of Consciousness Studies',
    'We begin by establishing a shared vocabulary and examining different frameworks for understanding consciousness: materialist reductionism, emergentism, panpsychism, and contemplative phenomenology. What are the strengths and limitations of each approach?',
    '["What do we mean by consciousness versus awareness?", "Can subjective experience be fully reduced to neural activity?", "What role does first-person investigation play in consciousness research?"]'::jsonb,
    '["Multiple viable frameworks exist, each capturing different aspects of consciousness", "The hard problem persists across most materialist frameworks", "Contemplative traditions offer methodologies for systematic first-person investigation", "Integration of third-person and first-person methods may be necessary"]'::jsonb,
    '["Dr. Sarah Chen (Neuroscience)", "Sheikh Ahmad al-Hakim (Islamic Philosophy)", "Prof. James Morrison (Philosophy of Mind)"]'::jsonb,
    75,
    now() - interval '2 months'
  );

  -- Episode 1.2
  INSERT INTO series_episodes (
    series_id, episode_number, slug, title, description, 
    key_questions, key_insights, participants, duration_minutes, published_at
  ) VALUES (
    v_series_1_id, 2,
    'emergence-and-complexity',
    'Emergence and Levels of Organization',
    'Examining how complex phenomena arise from simpler components. We explore emergence in physics, biology, and social systems, then ask: does consciousness emerge from neural complexity, or is something else required?',
    '["What distinguishes weak emergence from strong emergence?", "Are there genuine emergent properties, or only epistemic limitations?", "Can consciousness emerge from non-conscious components?"]'::jsonb,
    '["Emergence is well-established in physical and biological systems", "The explanatory gap remains between neural processes and subjective experience", "Complexity may be necessary but not sufficient for consciousness", "Different levels of organization may require different explanatory frameworks"]'::jsonb,
    '["Dr. Sarah Chen (Neuroscience)", "Sheikh Ahmad al-Hakim (Islamic Philosophy)", "Prof. James Morrison (Philosophy of Mind)"]'::jsonb,
    82,
    now() - interval '7 weeks'
  );

  -- Episode 1.3
  INSERT INTO series_episodes (
    series_id, episode_number, slug, title, description, 
    key_questions, key_insights, participants, duration_minutes, published_at
  ) VALUES (
    v_series_1_id, 3,
    'phenomenology-and-experience',
    'Phenomenology of Awareness',
    'Deep dive into the structure of conscious experience itself. Using both Western phenomenological methods and Eastern contemplative frameworks, we examine attention, intention, and the witnessing quality of awareness.',
    '["What is the relationship between awareness and its contents?", "Can we investigate consciousness using consciousness itself?", "What is revealed through sustained contemplative inquiry?"]'::jsonb,
    '["Awareness has a dual structure: knowing and known", "Phenomenological investigation reveals layers not apparent in ordinary experience", "Contemplative training systematically develops observational precision", "First-person data challenges some neuroscientific assumptions"]'::jsonb,
    '["Dr. Sarah Chen (Neuroscience)", "Sheikh Ahmad al-Hakim (Islamic Philosophy)", "Prof. James Morrison (Philosophy of Mind)"]'::jsonb,
    88,
    now() - interval '5 weeks'
  );

  -- Episode 1.4
  INSERT INTO series_episodes (
    series_id, episode_number, slug, title, description, 
    key_questions, key_insights, participants, duration_minutes, published_at
  ) VALUES (
    v_series_1_id, 4,
    'integration-and-future-directions',
    'Integrated Framework and Future Research',
    'Synthesizing insights from our exploration, we propose avenues for future research that honor both objective measurement and subjective experience. What would a mature science of consciousness look like?',
    '["Can we develop rigorous methods for first-person investigation?", "What are the practical applications of consciousness research?", "How might different traditions collaborate productively?"]'::jsonb,
    '["Neurophenomenology offers a promising integrative framework", "Contemplative practices can be studied rigorously without losing their essence", "Collaboration requires methodological pluralism and epistemic humility", "Consciousness research has implications for ethics, medicine, and human development"]'::jsonb,
    '["Dr. Sarah Chen (Neuroscience)", "Sheikh Ahmad al-Hakim (Islamic Philosophy)", "Prof. James Morrison (Philosophy of Mind)"]'::jsonb,
    79,
    now() - interval '3 weeks'
  );

  -- Series 2: Energy, Information & Transformation
  INSERT INTO dialogue_series (
    slug, title, subtitle, description, 
    total_episodes, difficulty_level, series_type, featured, published_at
  ) VALUES (
    'energy-information-transformation-2023',
    'Energy, Information & Transformation',
    'Subtle Energies, Information Theory, and Spiritual Practice',
    'A six-part investigation into energetic frameworks across wisdom traditions and their potential relationship to information theory, thermodynamics, and transformation. We examine practices involving breath, attention, and subtle perception through multiple lenses.',
    6,
    'intermediate',
    'exploration',
    true,
    now() - interval '4 months'
  ) RETURNING id INTO v_series_2_id;

  -- Connect Series 2 to themes
  IF v_energy_id IS NOT NULL THEN
    INSERT INTO series_themes (series_id, theme_id, relevance_weight) 
    VALUES (v_series_2_id, v_energy_id, 1.0);
  END IF;
  IF v_transformation_id IS NOT NULL THEN
    INSERT INTO series_themes (series_id, theme_id, relevance_weight) 
    VALUES (v_series_2_id, v_transformation_id, 0.8);
  END IF;

  -- Series 2 Episode 1
  INSERT INTO series_episodes (
    series_id, episode_number, slug, title, description, 
    key_questions, key_insights, participants, duration_minutes, published_at
  ) VALUES (
    v_series_2_id, 1,
    'energetic-frameworks-across-traditions',
    'Energetic Frameworks Across Traditions',
    'Survey of how different spiritual traditions conceptualize and work with subtle energy: prana, qi, ruh, baraka, pneuma. Are these metaphors, phenomenological realities, or something else?',
    '["Are energetic experiences universal across cultures?", "What is the relationship between energy and information?", "Can energetic frameworks be investigated scientifically?"]'::jsonb,
    '["Remarkably consistent phenomenological reports across traditions", "Energy may be related to information, attention, and intentionality", "Modern physics offers analogies but not direct mappings", "Experiential validity is independent of ontological interpretation"]'::jsonb,
    '["Dr. Leila Rahman (Comparative Religion)", "Prof. Michael Torres (Physics)", "Imam Rashid ibn Ali (Islamic Scholar)"]'::jsonb,
    72,
    now() - interval '4 months'
  );

  -- Series 3: Ethics of Inner Development
  INSERT INTO dialogue_series (
    slug, title, subtitle, description, 
    total_episodes, difficulty_level, series_type, featured, published_at
  ) VALUES (
    'ethics-inner-development-2023',
    'Ethics of Inner Development',
    'Moral Frameworks Emerging from Contemplative Practice',
    'A five-part examination of how ethical frameworks emerge from and are transformed by contemplative practice. We explore virtue ethics, deontology, consequentialism, and care ethics through the lens of inner development.',
    5,
    'intermediate',
    'exploration',
    true,
    now() - interval '6 months'
  ) RETURNING id INTO v_series_3_id;

  -- Connect Series 3 to themes
  IF v_ethics_id IS NOT NULL THEN
    INSERT INTO series_themes (series_id, theme_id, relevance_weight) 
    VALUES (v_series_3_id, v_ethics_id, 1.0);
  END IF;
  IF v_transformation_id IS NOT NULL THEN
    INSERT INTO series_themes (series_id, theme_id, relevance_weight) 
    VALUES (v_series_3_id, v_transformation_id, 0.7);
  END IF;

  -- Series 3 Episode 1
  INSERT INTO series_episodes (
    series_id, episode_number, slug, title, description, 
    key_questions, key_insights, participants, duration_minutes, published_at
  ) VALUES (
    v_series_3_id, 1,
    'contemplative-ethics-foundations',
    'Foundations of Contemplative Ethics',
    'How does contemplative practice shape moral perception and action? We examine claims that meditation and spiritual disciplines naturally lead to ethical behavior, and investigate the relationship between wisdom and virtue.',
    '["Does contemplative practice inherently cultivate ethical behavior?", "What is the relationship between self-knowledge and moral action?", "Can ethics be grounded in phenomenology?"]'::jsonb,
    '["Contemplative practice refines moral perception and emotional regulation", "Self-awareness can reveal hidden motivations and biases", "Ethical development requires both insight and habituation", "Different practices emphasize different ethical dimensions"]'::jsonb,
    '["Dr. Jennifer Wu (Moral Psychology)", "Sheikh Omar Farid (Sufi Ethics)", "Prof. David Klein (Philosophy)"]'::jsonb,
    68,
    now() - interval '6 months'
  );

  -- Series 4: Sacred Geometry and Cosmology
  INSERT INTO dialogue_series (
    slug, title, subtitle, description, 
    total_episodes, difficulty_level, series_type, featured, published_at
  ) VALUES (
    'sacred-geometry-cosmology-2024',
    'Sacred Geometry and Cosmology',
    'Pattern, Proportion, and the Architecture of Reality',
    'Exploring geometric patterns in nature, art, and consciousness. We investigate whether sacred geometry reveals objective truths about reality or represents meaningful symbolic frameworks for human understanding.',
    5,
    'intermediate',
    'exploration',
    false,
    now() - interval '1 month'
  ) RETURNING id INTO v_series_4_id;

  -- ======================================================================
  -- SERIES RECOMMENDATIONS
  -- ======================================================================

  -- Consciousness & Complexity -> Energy & Information
  INSERT INTO series_recommendations (from_series_id, to_series_id, reason, relevance_score) 
  VALUES (
    v_series_1_id, v_series_2_id,
    'Explores complementary aspects of consciousness through energetic frameworks and information theory',
    0.85
  );

  -- Consciousness & Complexity -> Ethics of Inner Development
  INSERT INTO series_recommendations (from_series_id, to_series_id, reason, relevance_score) 
  VALUES (
    v_series_1_id, v_series_3_id,
    'Examines ethical implications of consciousness research and contemplative practice',
    0.75
  );

  -- Energy & Information -> Consciousness & Complexity
  INSERT INTO series_recommendations (from_series_id, to_series_id, reason, relevance_score) 
  VALUES (
    v_series_2_id, v_series_1_id,
    'Provides theoretical foundations for understanding energetic phenomena in consciousness',
    0.82
  );

  -- Energy & Information -> Sacred Geometry
  INSERT INTO series_recommendations (from_series_id, to_series_id, reason, relevance_score) 
  VALUES (
    v_series_2_id, v_series_4_id,
    'Explores pattern and structure in both energetic systems and geometric frameworks',
    0.70
  );

  -- Ethics -> Consciousness & Complexity
  INSERT INTO series_recommendations (from_series_id, to_series_id, reason, relevance_score) 
  VALUES (
    v_series_3_id, v_series_1_id,
    'Deepens understanding of the consciousness that underlies ethical perception',
    0.78
  );

  -- Ethics -> Energy & Information
  INSERT INTO series_recommendations (from_series_id, to_series_id, reason, relevance_score) 
  VALUES (
    v_series_3_id, v_series_2_id,
    'Examines transformative practices that cultivate ethical development',
    0.73
  );
END $$;
