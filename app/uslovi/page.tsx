import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Uslovi Poslovanja | Bilbord Expo',
  description: 'Uslovi poslovanja Bilbord Expo platforme. Pravila i uslovi korišćenja naše platforme za izložbu banera.',
  keywords: 'uslovi poslovanja, pravila, uslovi korišćenja, terms of service',
}

export default function UsloviPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-16">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] mb-8">
          Uslovi Poslovanja
        </h1>

        <div className="prose prose-lg max-w-none text-[#1d1d1f] space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">
              Prihvatljivost materijala
            </h2>
            <p className="mb-2">
              Baneri koji se dostavljaju moraju biti relevantni za tematiku portala i odgovarati profesionalnim standardima.
            </p>
            <p className="mb-2">
              Sadržaj mora biti originalan i ne sme predstavljati kopiju već objavljenih radova. Sva pravila objavljivanja moraju biti ispoštovana u svakom trenutku.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">
              Kvalitet sadržaja
            </h2>
            <p className="mb-2">
              Baneri treba da budu visokog kvaliteta, jasan i profesionalan dizajn. Slike moraju biti u odgovarajućem formatu i rezoluciji za web prikaz.
            </p>
            <p className="mb-2">
              Baneri mogu sadržati fotografije i multimedijalne materijale uz obavezno poštovanje autorskih i licencnih prava.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">
              Korisnički sadržaj i licenciranje
            </h2>
            <p className="mb-2">
              Slanjem banera na objavu korisnik daje portalu Bilbord Expo neograničenu, globalnu, neopozivu, trajnu i sublicencibilnu licencu za korišćenje, reprodukciju, modifikaciju, distribuciju, prikazivanje i izvođenje sadržaja.
            </p>
            <p className="mb-2">
              Korisnik se slaže da nema pravo da zahteva uklanjanje ili brisanje već objavljenog sadržaja, osim ako je to unapred definisano pravilima portala ili ako portal sam odluči da sadržaj ukloni.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">
              Pravo na odbijanje objave
            </h2>
            <p className="mb-2">
              Administracija zadržava pravo da odbije objavu banera ukoliko proceni da sadržaj nije usklađen sa politikom portala ili interesima korisnika.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">
              Rokovi i brisanje
            </h2>
            <p className="mb-2">
              Baneri se prikazuju odmah nakon odobrenja od strane administracije.
            </p>
            <p className="mb-2">
              Portal zadržava pravo da u bilo kom trenutku ukloni, arhivira ili optimizuje sadržaj radi tehničke efikasnosti, SEO optimizacije ili reorganizacije baze.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">
              Odricanje od odgovornosti
            </h2>
            <p className="mb-2">
              Bilbord Expo ne snosi odgovornost za tačnost informacija i tvrdnji iznetih u banerima. Odgovornost za istinitost i verodostojnost dostavljenog sadržaja snosi isključivo podnosilac banera.
            </p>
            <p className="mb-2">
              Portal ne garantuje da će linkovi u banerima uvek biti funkcionalni ili da će vodi ka validnim stranicama.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">
              Pravo na izmenu uslova
            </h2>
            <p className="mb-2">
              Portal zadržava pravo da izmeni ove uslove bez prethodne najave.
            </p>
            <p className="mb-2">
              Preporučuje se redovno proveravanje eventualnih izmena.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">
              Kontakt
            </h2>
            <p className="mb-2">
              Za sva pitanja i dodatne informacije u vezi sa objavom banera, korisnici mogu kontaktirati administraciju putem{' '}
              <a href="https://bilbord.rs/kontakt/" target="_blank" rel="noopener noreferrer" className="text-[#1d1d1f] hover:underline">
                kontakt stranice
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

