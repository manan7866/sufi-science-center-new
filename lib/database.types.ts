export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      saints: {
        Row: {
          id: string
          slug: string
          name: string
          birth_year: number | null
          death_year: number | null
          region: string | null
          region_id: string | null
          historical_period_id: string | null
          civilizational_region: string | null
          modern_country: string | null
          city: string | null
          influence_scope: string | null
          gender: 'male' | 'female' | 'other' | 'unknown'
          primary_language: string | null
          is_founder: boolean
          short_summary: string | null
          biography: string | null
          search_vector: unknown | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          slug: string
          name: string
          birth_year?: number | null
          death_year?: number | null
          region?: string | null
          short_summary?: string | null
          biography?: string | null
          search_vector?: unknown | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          birth_year?: number | null
          death_year?: number | null
          region?: string | null
          short_summary?: string | null
          biography?: string | null
          search_vector?: unknown | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      lineages: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          parent_lineage_id: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          parent_lineage_id?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          parent_lineage_id?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      themes: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          category: 'scientific' | 'spiritual' | 'ethical' | 'interdisciplinary'
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          category?: 'scientific' | 'spiritual' | 'ethical' | 'interdisciplinary'
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          category?: 'scientific' | 'spiritual' | 'ethical' | 'interdisciplinary'
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      saint_lineages: {
        Row: {
          id: string
          saint_id: string
          lineage_id: string
          role: string | null
          created_at: string
        }
        Insert: {
          id?: string
          saint_id: string
          lineage_id: string
          role?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          saint_id?: string
          lineage_id?: string
          role?: string | null
          created_at?: string
        }
      }
      saint_themes: {
        Row: {
          id: string
          saint_id: string
          theme_id: string
          created_at: string
        }
        Insert: {
          id?: string
          saint_id: string
          theme_id: string
          created_at?: string
        }
        Update: {
          id?: string
          saint_id?: string
          theme_id?: string
          created_at?: string
        }
      }
      donations: {
        Row: {
          id: string
          user_id: string | null
          amount: number
          currency: string
          frequency: 'one_time' | 'monthly' | 'annual'
          transaction_id: string | null
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          donor_name: string
          donor_email: string
          message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          amount: number
          currency?: string
          frequency?: 'one_time' | 'monthly' | 'annual'
          transaction_id?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          donor_name: string
          donor_email: string
          message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          amount?: number
          currency?: string
          frequency?: 'one_time' | 'monthly' | 'annual'
          transaction_id?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          donor_name?: string
          donor_email?: string
          message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      volunteer_applications: {
        Row: {
          id: string
          user_id: string | null
          role_type: 'research' | 'content' | 'dialogue' | 'technical' | 'community' | 'translation'
          full_name: string
          email: string
          skills_json: Json
          motivation_text: string
          status: 'pending' | 'under_review' | 'approved' | 'declined'
          reviewed_at: string | null
          reviewed_by: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          role_type: 'research' | 'content' | 'dialogue' | 'technical' | 'community' | 'translation'
          full_name: string
          email: string
          skills_json?: Json
          motivation_text: string
          status?: 'pending' | 'under_review' | 'approved' | 'declined'
          reviewed_at?: string | null
          reviewed_by?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          role_type?: 'research' | 'content' | 'dialogue' | 'technical' | 'community' | 'translation'
          full_name?: string
          email?: string
          skills_json?: Json
          motivation_text?: string
          status?: 'pending' | 'under_review' | 'approved' | 'declined'
          reviewed_at?: string | null
          reviewed_by?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      pathway_applications: {
        Row: {
          id: string
          user_id: string | null
          pathway_id: string
          full_name: string
          email: string
          phone: string | null
          motivation: string
          spiritual_experience: string | null
          current_practices: string | null
          available_time_weekly: string
          preferred_start_date: string | null
          status: 'pending' | 'under_review' | 'accepted' | 'declined' | 'withdrawn'
          reviewer_notes: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          pathway_id: string
          full_name: string
          email: string
          phone?: string | null
          motivation: string
          spiritual_experience?: string | null
          current_practices?: string | null
          available_time_weekly: string
          preferred_start_date?: string | null
          status?: 'pending' | 'under_review' | 'accepted' | 'declined' | 'withdrawn'
          reviewer_notes?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          pathway_id?: string
          full_name?: string
          email?: string
          phone?: string | null
          motivation?: string
          spiritual_experience?: string | null
          current_practices?: string | null
          available_time_weekly?: string
          preferred_start_date?: string | null
          status?: 'pending' | 'under_review' | 'accepted' | 'declined' | 'withdrawn'
          reviewer_notes?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      mentorship_applications: {
        Row: {
          id: string
          user_id: string | null
          program_id: string
          full_name: string
          email: string
          phone: string | null
          background_summary: string
          spiritual_goals: string
          relevant_experience: string | null
          why_this_program: string
          commitment_level: string
          availability: string
          previous_mentorship_experience: string | null
          status: 'pending' | 'under_review' | 'interview_scheduled' | 'accepted' | 'declined' | 'withdrawn'
          reviewer_notes: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          interview_scheduled_for: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          program_id: string
          full_name: string
          email: string
          phone?: string | null
          background_summary: string
          spiritual_goals: string
          relevant_experience?: string | null
          why_this_program: string
          commitment_level: string
          availability: string
          previous_mentorship_experience?: string | null
          status?: 'pending' | 'under_review' | 'interview_scheduled' | 'accepted' | 'declined' | 'withdrawn'
          reviewer_notes?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          interview_scheduled_for?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          program_id?: string
          full_name?: string
          email?: string
          phone?: string | null
          background_summary?: string
          spiritual_goals?: string
          relevant_experience?: string | null
          why_this_program?: string
          commitment_level?: string
          availability?: string
          previous_mentorship_experience?: string | null
          status?: 'pending' | 'under_review' | 'interview_scheduled' | 'accepted' | 'declined' | 'withdrawn'
          reviewer_notes?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          interview_scheduled_for?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      collaboration_proposals: {
        Row: {
          id: string
          organization_name: string
          organization_type: 'academic' | 'research' | 'policy' | 'nonprofit' | 'other'
          contact_name: string
          contact_email: string
          contact_phone: string | null
          proposal_summary: string
          proposal_details: string
          collaboration_type: 'research' | 'dialogue' | 'conference' | 'curriculum' | 'technology' | 'translation'
          scope: string
          timeline: string
          attachment_urls: Json
          status: 'pending' | 'under_review' | 'approved' | 'declined'
          reviewed_at: string | null
          reviewed_by: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_name: string
          organization_type: 'academic' | 'research' | 'policy' | 'nonprofit' | 'other'
          contact_name: string
          contact_email: string
          contact_phone?: string | null
          proposal_summary: string
          proposal_details: string
          collaboration_type: 'research' | 'dialogue' | 'conference' | 'curriculum' | 'technology' | 'translation'
          scope: string
          timeline: string
          attachment_urls?: Json
          status?: 'pending' | 'under_review' | 'approved' | 'declined'
          reviewed_at?: string | null
          reviewed_by?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_name?: string
          organization_type?: 'academic' | 'research' | 'policy' | 'nonprofit' | 'other'
          contact_name?: string
          contact_email?: string
          contact_phone?: string | null
          proposal_summary?: string
          proposal_details?: string
          collaboration_type?: 'research' | 'dialogue' | 'conference' | 'curriculum' | 'technology' | 'translation'
          scope?: string
          timeline?: string
          attachment_urls?: Json
          status?: 'pending' | 'under_review' | 'approved' | 'declined'
          reviewed_at?: string | null
          reviewed_by?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Saint = Database['public']['Tables']['saints']['Row'];
export type Lineage = Database['public']['Tables']['lineages']['Row'];
export type Theme = Database['public']['Tables']['themes']['Row'];

export interface SaintWithRelations extends Saint {
  lineages?: Lineage[];
  themes?: Theme[];
}
