-- ============================================
-- BILBORD EXPO - SUPABASE SETUP SQL
-- ============================================
-- Pokreni ovaj SQL u Supabase Dashboard → SQL Editor
-- Ovaj skript kreira tabelu za banere i storage bucket sa potrebnim RLS politikama

-- 1. Kreiraj tabelu za banere
CREATE TABLE IF NOT EXISTS banners (
  id BIGSERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  link TEXT NOT NULL,
  title TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NULL -- Opcioni datum isteka banera
);

-- Dodaj kolonu expires_at ako tabela već postoji
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'banners' AND column_name = 'expires_at'
  ) THEN
    ALTER TABLE banners ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE NULL;
  END IF;
END $$;

-- 2. Omogući RLS (Row Level Security) na tabeli banners
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- 3. Obriši postojeće policy-je ako postoje (za clean setup)
DROP POLICY IF EXISTS "Public read access" ON banners;
DROP POLICY IF EXISTS "Public insert access" ON banners;
DROP POLICY IF EXISTS "Public update access" ON banners;
DROP POLICY IF EXISTS "Public delete access" ON banners;

-- 4. RLS Policy: Javno čitanje banera (svi mogu da vide banere)
CREATE POLICY "Public read access" ON banners
  FOR SELECT
  USING (true);

-- 5. RLS Policy: Javno dodavanje banera (anon key može da dodaje)
-- Napomena: Ako želiš da samo authenticated korisnici mogu da dodaju,
-- promeni 'true' u 'auth.role() = ''authenticated'''
CREATE POLICY "Public insert access" ON banners
  FOR INSERT
  WITH CHECK (true);

-- 6. RLS Policy: Javno ažuriranje banera
CREATE POLICY "Public update access" ON banners
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 7. RLS Policy: Javno brisanje banera
CREATE POLICY "Public delete access" ON banners
  FOR DELETE
  USING (true);

-- 8. Kreiraj storage bucket za banere (slike)
INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- 9. Obriši postojeće storage policy-je ako postoje
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public upload access" ON storage.objects;
DROP POLICY IF EXISTS "Public update access" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access" ON storage.objects;

-- 10. Storage Policy: Javno čitanje slika iz banners bucket-a
CREATE POLICY "Public Access" ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'banners');

-- 11. Storage Policy: Javno upload-ovanje slika u banners bucket
CREATE POLICY "Public upload access" ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'banners');

-- 12. Storage Policy: Javno ažuriranje slika u banners bucket
CREATE POLICY "Public update access" ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'banners');

-- 13. Storage Policy: Javno brisanje slika iz banners bucket-a
CREATE POLICY "Public delete access" ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'banners');

-- ============================================
-- KRAJ SETUP-A
-- ============================================
-- Nakon pokretanja ovog SQL-a:
-- 1. Proveri da li je tabela 'banners' kreirana u Database → Tables
-- 2. Proveri da li je bucket 'banners' kreiran u Storage → Buckets
-- 3. Proveri RLS policy-je u Database → Tables → banners → Policies
-- 4. Proveri storage policy-je u Storage → Policies

