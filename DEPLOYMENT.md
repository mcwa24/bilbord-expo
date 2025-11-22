# Deployment i Storage

## Trenutno stanje

**Lokalno:**
- Baneri se čuvaju u `data/banners.json`
- Slike se čuvaju u `public/uploads/`

**Problem na Vercel-u:**
- JSON fajlovi se resetuju pri svakom deploymentu
- Upload-ovani fajlovi se gube (ephemeral filesystem)

## Rešenja za Production

### Opcija 1: Vercel Blob Storage (Preporučeno)

**Za slike:**
1. Instaliraj `@vercel/blob`
2. Koristi Vercel Blob Storage za upload slika
3. Slike se čuvaju trajno u Vercel Blob Storage

**Za banere:**
- Koristi Vercel KV (Redis) ili
- Supabase Database ili
- Vercel Postgres

### Opcija 2: Supabase (Kao bilbord-hub)

**Za slike:**
- Supabase Storage (kao u bilbord-hub projektu)

**Za banere:**
- Supabase Database (PostgreSQL)

### Opcija 3: Vercel Postgres + Vercel Blob

- Vercel Postgres za banere
- Vercel Blob Storage za slike

## Setup za Vercel Blob Storage

1. Instaliraj paket:
```bash
npm install @vercel/blob
```

2. Dodaj environment variable u Vercel:
- `BLOB_READ_WRITE_TOKEN` (dobijaš iz Vercel dashboard-a)

3. Ažuriraj `/app/api/upload/route.ts` da koristi Vercel Blob

4. Za banere, koristi Vercel KV ili Supabase Database

## Setup za Supabase (Kao bilbord-hub)

1. Instaliraj pakete:
```bash
npm install @supabase/supabase-js @supabase/ssr
```

2. Dodaj environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

3. Kreiraj Supabase projekat i:
   - Storage bucket za slike
   - Database tabelu za banere

## Preporuka

Za brzo rešenje: **Vercel Blob Storage + Vercel KV**
Za dugoročno rešenje: **Supabase** (kao bilbord-hub)

