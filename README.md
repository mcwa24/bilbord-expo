# Bilbord Expo

Izložba banera - jednostavan sajt za prikaz banera poredjanih po 3 u redu, sa admin panelom za upravljanje.

## Tehnologije

- Next.js 14
- TypeScript
- Tailwind CSS
- Vercel (deployment)

## Pokretanje

```bash
# Instalacija zavisnosti
npm install

# Development server
npm run dev

# Production build
npm run build
npm start
```

## Struktura

- `/` - Glavna stranica sa banerima (3 u redu)
- `/admin` - Admin panel za dodavanje i brisanje banera

## Supabase Setup

Projekat koristi Supabase za:
- **Database** - čuvanje banera
- **Storage** - upload i čuvanje slika

### Setup Instrukcije

1. **Kreiraj tabelu u Supabase:**
   - Idi na SQL Editor i pokreni `supabase-setup.sql`

2. **Kreiraj Storage Bucket:**
   - Storage → New bucket → Ime: `banners` → Public: ✅

3. **Postavi Storage Policies:**
   - Vidi `SUPABASE_SETUP.md` za detaljne instrukcije

4. **Environment Variables:**
   - Dodaj u Vercel Dashboard:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Za lokalni development, kreiraj `.env.local` sa istim vrednostima

**Detaljne instrukcije:** Pogledaj `SUPABASE_SETUP.md`


