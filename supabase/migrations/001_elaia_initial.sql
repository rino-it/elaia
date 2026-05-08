-- ============================================================================
-- ELAIA — Migration iniziale
-- Progetto Supabase condiviso: yajhearqopveqldaanii (landing_page_operazioni)
-- 4 tabelle dedicate ELAIA, prefisso "elaia_", separate da quelle EDEL.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1) LEADS — form principale "Richiedi Informazioni"
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.elaia_leads (
  id              BIGSERIAL PRIMARY KEY,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  project         TEXT,
  nome            TEXT NOT NULL,
  email           TEXT NOT NULL,
  telefono        TEXT NOT NULL,
  taglio          TEXT,            -- trilocale | quadrilocale | attico | null
  note            TEXT,
  prefer_call     BOOLEAN DEFAULT FALSE,
  consenso_gdpr   BOOLEAN NOT NULL DEFAULT FALSE,
  consenso_at     TIMESTAMPTZ,
  request_type    TEXT,            -- 'info_generali' | 'capitolato' | ...
  source          TEXT,            -- 'landing_elaia', 'landing_elaia_capitolato'
  page_url        TEXT,
  user_agent      TEXT,
  utm_source      TEXT,
  utm_medium      TEXT,
  utm_campaign    TEXT,
  utm_content     TEXT,
  utm_term        TEXT
);

CREATE INDEX IF NOT EXISTS idx_elaia_leads_created_at ON public.elaia_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_elaia_leads_email      ON public.elaia_leads (email);

-- ---------------------------------------------------------------------------
-- 2) NEWSLETTER SUBSCRIBERS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.elaia_newsletter_subscribers (
  id              BIGSERIAL PRIMARY KEY,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  project         TEXT,
  email           TEXT NOT NULL,
  source_section  TEXT,
  page_url        TEXT,
  utm_source      TEXT,
  utm_medium      TEXT,
  utm_campaign    TEXT,
  utm_content     TEXT,
  utm_term        TEXT
);

CREATE INDEX IF NOT EXISTS idx_elaia_newsletter_email ON public.elaia_newsletter_subscribers (email);

-- ---------------------------------------------------------------------------
-- 3) BROCHURE DOWNLOADS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.elaia_brochure_downloads (
  id              BIGSERIAL PRIMARY KEY,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  project         TEXT,
  email           TEXT,
  source_section  TEXT,
  page_url        TEXT,
  utm_source      TEXT,
  utm_medium      TEXT,
  utm_campaign    TEXT,
  utm_content     TEXT,
  utm_term        TEXT
);

CREATE INDEX IF NOT EXISTS idx_elaia_brochure_created_at ON public.elaia_brochure_downloads (created_at DESC);

-- ---------------------------------------------------------------------------
-- 4) CALLBACK REQUESTS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.elaia_callback_requests (
  id              BIGSERIAL PRIMARY KEY,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  project         TEXT,
  nome            TEXT NOT NULL,
  telefono        TEXT NOT NULL,
  time_slot       TEXT,
  page_url        TEXT,
  user_agent      TEXT,
  utm_source      TEXT,
  utm_medium      TEXT,
  utm_campaign    TEXT,
  utm_content     TEXT,
  utm_term        TEXT
);

CREATE INDEX IF NOT EXISTS idx_elaia_callback_created_at ON public.elaia_callback_requests (created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY
-- - INSERT: permesso ad anon (frontend pubblico)
-- - SELECT/UPDATE/DELETE: NON permesso ad anon (solo service_role lato dashboard)
-- ============================================================================

ALTER TABLE public.elaia_leads                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elaia_newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elaia_brochure_downloads     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elaia_callback_requests      ENABLE ROW LEVEL SECURITY;

-- elaia_leads
DROP POLICY IF EXISTS "anon_insert_elaia_leads" ON public.elaia_leads;
CREATE POLICY "anon_insert_elaia_leads"
  ON public.elaia_leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- elaia_newsletter_subscribers
DROP POLICY IF EXISTS "anon_insert_elaia_newsletter" ON public.elaia_newsletter_subscribers;
CREATE POLICY "anon_insert_elaia_newsletter"
  ON public.elaia_newsletter_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- elaia_brochure_downloads
DROP POLICY IF EXISTS "anon_insert_elaia_brochure" ON public.elaia_brochure_downloads;
CREATE POLICY "anon_insert_elaia_brochure"
  ON public.elaia_brochure_downloads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- elaia_callback_requests
DROP POLICY IF EXISTS "anon_insert_elaia_callback" ON public.elaia_callback_requests;
CREATE POLICY "anon_insert_elaia_callback"
  ON public.elaia_callback_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Le SELECT/UPDATE/DELETE rimangono inaccessibili ad anon: i dati sono
-- visibili SOLO a service_role (Dashboard Supabase, Postgres editor, API
-- con service key). Nessuna policy SELECT viene creata di proposito.
