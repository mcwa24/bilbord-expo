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

## Resend Email Setup

Projekat koristi Resend API za slanje email obaveštenja kada se baner postavi na platformu.

### Setup Instrukcije

1. **Kreiraj Resend nalog:**
   - Idi na [resend.com](https://resend.com) i kreiraj nalog
   - Verifikuj domen ili koristi test domen

2. **Dobij API Key:**
   - Idi na API Keys u Resend dashboard-u
   - Kreiraj novi API key

3. **Environment Variables:**
   - Dodaj u Vercel Dashboard:
     - `RESEND_API_KEY` - tvoj Resend API key (isti kao u bilbord hub projektu)
   - Za lokalni development, dodaj u `.env.local`:
     ```
     RESEND_API_KEY=re_xxxxx
     ```
   - Email se šalje sa `expo@bilbord.rs`

4. **Korišćenje:**
   - Kada kreiraš ili ažuriraš baner u admin panelu, možeš uneti email adresu u polje "Email za obaveštenje"
   - Korisnik će dobiti email sa linkom ka baneru i linkom ka Bilbord Expo platformi


