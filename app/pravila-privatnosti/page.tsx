import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pravila Privatnosti | Bilbord Expo',
  description: 'Pravila privatnosti Bilbord Expo platforme. Saznajte kako prikupljamo, koristimo i štitimo vaše lične podatke.',
  keywords: 'privatnost, pravila privatnosti, zaštita podataka, GDPR, lični podaci',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-16">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] mb-8">
          Pravila Privatnosti
        </h1>

        <div className="prose prose-lg max-w-none text-[#1d1d1f]">
          <p className="text-sm text-gray-500 mb-8">Datum stupanja na snagu: {new Date().toLocaleDateString('sr-RS', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <p className="mb-4">
            Hvala vam što ste posetili Bilbord Expo ("Veb stranica"). Ova Pravila o privatnosti objašnjavaju kako prikupljamo, koristimo i otkrivamo podatke o vama kada koristite našu web stranicu.
          </p>
          <p className="mb-6">
            Poštujemo vašu privatnost i predani smo zaštiti vaših osobnih podataka. Pažljivo pročitajte ovu Politiku privatnosti kako biste razumeli našu praksu u vezi s vašim osobnim podacima i kako ćemo s njima postupati.
          </p>

          <h2 className="text-2xl font-bold text-[#1d1d1f] mt-8 mb-4">
            Informacije koje prikupljamo
          </h2>
          <p className="mb-4">
            Od vas možemo prikupljati osobne podatke kada posjetite našu web stranicu, registrirate se na web stranici, pretplatite se na naš bilten, ispunite obrazac ili odgovorite na anketu. Osobni podaci koje možemo prikupiti uključuju:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6 ml-4">
            <li>Tvoje ime</li>
            <li>Vaša email adresa</li>
            <li>Vaš broj telefona</li>
            <li>Vaša adresa</li>
            <li>Vaša IP adresa</li>
            <li>Informacije o vašem pregledniku</li>
            <li>Informacije o vašem uređaju</li>
            <li>Ostale informacije koje nam dostavite</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1d1d1f] mt-8 mb-4">
            Kako koristimo vaše podatke
          </h2>
          <p className="mb-4">
            Osobne podatke koje prikupljamo od vas možemo koristiti u razne svrhe, uključujući:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
            <li>Za poboljšanje naše web stranice i usluga koje nudimo</li>
            <li>Da odgovorimo na vaše upite, zahtjeve i komentare</li>
            <li>Za slanje marketinških i promotivnih e-poruka</li>
            <li>Kako bismo personalizirali vaše iskustvo na našoj web stranici</li>
            <li>Za provođenje anketa i istraživanja</li>
            <li>Za poštivanje zakonskih obveza</li>
          </ul>
          <p className="mb-4">
            Vaše osobne podatke možemo podijeliti s pružateljima usluga trećih strana koji obavljaju usluge u naše ime, kao što su hosting web stranica, isporuka e-pošte i analiza podataka. Od pružatelja usluga trećih strana zahtijevamo da koriste vaše osobne podatke samo za pružanje usluga za koje smo ih ugovorili i za održavanje povjerljivosti i sigurnosti vaših osobnih podataka.
          </p>
          <p className="mb-6">
            Također možemo otkriti vaše osobne podatke trećim stranama kada vjerujemo da je takvo otkrivanje potrebno za poštivanje primjenjivih zakona, propisa ili pravnih procesa ili za zaštitu naših prava, imovine ili sigurnosti ili prava, imovine ili sigurnosti drugih.
          </p>

          <h2 className="text-2xl font-bold text-[#1d1d1f] mt-8 mb-4">
            Kolačići i druge tehnologije praćenja
          </h2>
          <p className="mb-4">
            Koristimo kolačiće i druge tehnologije praćenja na našoj web stranici kako bismo prikupili informacije o vašem ponašanju pregledavanja i obrascima korištenja. Kolačići su male datoteke koje se pohranjuju na vaš uređaj kada posjetite web stranicu. Omogućuju nam prepoznavanje vašeg uređaja i pamćenje vaših preferencija i postavki.
          </p>
          <p className="mb-6">
            Kolačiće možete kontrolirati putem postavki preglednika. Međutim, ako odlučite onemogućiti kolačiće, neke značajke naše web stranice možda neće ispravno funkcionirati.
          </p>

          <h2 className="text-2xl font-bold text-[#1d1d1f] mt-8 mb-4">
            Vaši izbori
          </h2>
          <p className="mb-4">
            Možete odlučiti isključiti primanje marketinških i promotivnih e-poruka od nas slijedeći upute navedene u e-poruci. Također se možete odjaviti s našeg newslettera klikom na poveznicu za odjavu pri dnu e-pošte.
          </p>
          <p className="mb-6">
            Također možete imati pravo na pristup, ispravak ili brisanje svojih osobnih podataka. Ako želite ostvariti bilo koje od ovih prava, obratite nam se na kontakt strani.
          </p>

          <h2 className="text-2xl font-bold text-[#1d1d1f] mt-8 mb-4">
            Sigurnost
          </h2>
          <p className="mb-6">
            Poduzimamo razumne mjere kako bismo zaštitili vaše osobne podatke od neovlaštenog pristupa, korištenja i otkrivanja. Međutim, nijedna metoda prijenosa putem interneta ili metoda elektroničke pohrane nije 100% sigurna. Stoga ne možemo jamčiti apsolutnu sigurnost vaših osobnih podataka.
          </p>

          <h2 className="text-2xl font-bold text-[#1d1d1f] mt-8 mb-4">
            Promjene ovih Pravila privatnosti
          </h2>
          <p className="mb-6">
            S vremena na vrijeme možemo ažurirati ovu Politiku privatnosti. Ako napravimo bilo kakve materijalne promjene, obavijestit ćemo vas objavljivanjem ažuriranih Pravila o privatnosti na našem web-mjestu i ažuriranjem "Datuma stupanja na snagu" na vrhu ove stranice.
          </p>

          <h2 className="text-2xl font-bold text-[#1d1d1f] mt-8 mb-4">
            Kontaktirajte nas
          </h2>
          <p className="mb-6">
            Ukoliko imate pitanja ili nedoumica u vezi sa ovom Politikom privatnosti, kontaktirajte nas putem{' '}
            <a href="https://bilbord.rs/kontakt/" target="_blank" rel="noopener noreferrer" className="text-[#1d1d1f] hover:underline">
              kontakt stranice
            </a>.
          </p>
        </div>
      </div>
    </div>
  )
}

