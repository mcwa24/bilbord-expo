# Supabase Setup Instrukcije

## 1. Kreiraj tabelu u Supabase

Idi na Supabase Dashboard → SQL Editor i pokreni sledeći SQL:

```sql
-- Create banners table
CREATE TABLE IF NOT EXISTS banners (
  id BIGSERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  link TEXT NOT NULL,
  title TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 2. Kreiraj Storage Bucket

1. Idi na Supabase Dashboard → Storage
2. Klikni "New bucket"
3. Ime: `banners`
4. Public bucket: ✅ (označi kao javni)
5. Klikni "Create bucket"

## 3. Postavi Storage Policies

Idi na Storage → Policies i dodaj sledeće policy-je za `banners` bucket:

**SELECT Policy (Public Read):**
```sql
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'banners');
```

**INSERT Policy (Authenticated Upload):**
```sql
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'banners');
```

**UPDATE Policy:**
```sql
CREATE POLICY "Authenticated users can update" ON storage.objects FOR UPDATE USING (bucket_id = 'banners');
```

**DELETE Policy:**
```sql
CREATE POLICY "Authenticated users can delete" ON storage.objects FOR DELETE USING (bucket_id = 'banners');
```

ILI koristi SQL Editor i pokreni ceo fajl `supabase-setup.sql`.

## 4. Environment Variables

Dodaj u Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://kqpmbcknztcofausqzfa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxcG1iY2tuenRjb2ZhdXNxemZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2ODEzNDksImV4cCI6MjA3OTI1NzM0OX0.6fOBiostBVt68cnKJXFD8GSBtAR4PUpyBLhk3y4hvu8
```

Za lokalni development, kreiraj `.env.local` fajl sa istim vrednostima.

## 5. Test

Nakon setup-a, testiraj:
1. Upload slike preko admin panela
2. Dodaj baner sa linkom
3. Proveri da li se baneri prikazuju na glavnoj stranici

## Napomena

- Trenutno su hardkodovani credentials u kodu kao fallback
- Za production, uvek koristi environment variables
- Storage bucket mora biti javan (public) da bi slike bile dostupne

