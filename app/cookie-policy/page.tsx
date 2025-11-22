import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy | Bilbord Expo',
  description: 'Politika kolačića Bilbord Expo platforme. Saznajte kako koristimo kolačiće i kako možete kontrolisati njihovo korišćenje.',
  keywords: 'cookie policy, kolačići, cookies, praćenje, privatnost',
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-16">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] mb-8">
          Cookie Policy
        </h1>

        <div className="prose prose-lg max-w-none text-[#1d1d1f]">
          <p className="text-sm text-gray-500 mb-8">Datum stupanja na snagu: {new Date().toLocaleDateString('sr-RS', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <p className="mb-6">
            Ova Pravila o kolačićima objašnjavaju kako Bilbord Expo ("Web stranica") koristi kolačiće i druge tehnologije praćenja za prikupljanje informacija o vašem ponašanju pregledavanja i obrascima korištenja.
          </p>

          <h2 className="text-2xl font-bold text-[#1d1d1f] mt-8 mb-4">
            Što su kolačići?
          </h2>
          <p className="mb-6">
            Kolačići su male datoteke koje se pohranjuju na vaš uređaj kada posjetite web stranicu. Omogućuju web stranici da prepozna vaš uređaj i zapamti vaše preferencije i postavke.
          </p>

          <h2 className="text-2xl font-bold text-[#1d1d1f] mt-8 mb-4">
            Vrste kolačića koje koristimo
          </h2>
          <p className="mb-4">
            Na našoj web stranici koristimo sljedeće vrste kolačića:
          </p>
          <ul className="list-disc list-inside space-y-3 mb-6 ml-4">
            <li><strong>Neophodni kolačići:</strong> Ovi kolačići su neophodni za pravilno funkcioniranje web stranice. Omogućuju vam navigaciju web-stranicom i korištenje njezinih značajki.</li>
            <li><strong>Kolačići za rad:</strong> Ovi kolačići prikupljaju informacije o tome kako posjetitelji koriste našu web stranicu, kao što su stranice koje se najviše posjećuju i koje poveznice se klikaju. Oni nam pomažu poboljšati izvedbu naše web stranice.</li>
            <li><strong>Funkcionalni kolačići:</strong> Ovi kolačići omogućuju web-mjestu da zapamti vaše postavke i postavke, kao što su postavke jezika i veličina fonta.</li>
            <li><strong>Oglašavački kolačići:</strong> Ovi se kolačići koriste za isporuku prilagođenih oglasa na temelju vašeg ponašanja i interesa prilikom pregledavanja.</li>
            <li><strong>Kolačići društvenih medija:</strong> Ovi se kolačići koriste za omogućavanje dijeljenja društvenih medija i interakcije s platformama društvenih medija.</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1d1d1f] mt-8 mb-4">
            Kolačići treće strane
          </h2>
          <p className="mb-6">
            Također možemo koristiti kolačiće trećih strana na našoj web stranici. Ove kolačiće postavljaju pružatelji usluga trećih strana, kao što su Google Analytics i platforme društvenih medija.
          </p>

          <h2 className="text-2xl font-bold text-[#1d1d1f] mt-8 mb-4">
            Kako kontrolirati kolačiće
          </h2>
          <p className="mb-4">
            Kolačiće možete kontrolirati putem postavki preglednika. Možete odlučiti prihvatiti ili odbiti kolačiće i izbrisati postojeće kolačiće. Međutim, ako odlučite onemogućiti kolačiće, neke značajke naše web stranice možda neće ispravno funkcionirati.
          </p>
          <p className="mb-2">Kako biste saznali više o tome kako kontrolirati kolačiće u svom pregledniku, posjetite sljedeće poveznice:</p>
          <ul className="list-disc list-inside space-y-2 mb-6 ml-4">
            <li>
              <a href="https://support.google.com/chrome/answer/95647?hl=hr" target="_blank" rel="noopener noreferrer" className="text-[#1d1d1f] hover:underline">
                Google Chrome: https://support.google.com/chrome/answer/95647?hl=hr
              </a>
            </li>
            <li>
              <a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-[#1d1d1f] hover:underline">
                Firefox: https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences
              </a>
            </li>
            <li>
              <a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[#1d1d1f] hover:underline">
                Safari: https://support.apple.com/en-gb/guide/safari/sfri11471/mac
              </a>
            </li>
            <li>
              <a href="https://support.microsoft.com/en-us/topic/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="text-[#1d1d1f] hover:underline">
                Internet Explorer: https://support.microsoft.com/en-us/topic/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d
              </a>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1d1d1f] mt-8 mb-4">
            Promjene ove Politike kolačića
          </h2>
          <p className="mb-6">
            S vremena na vrijeme možemo ažurirati ovu Politiku kolačića. Ako napravimo bilo kakve materijalne promjene, obavijestit ćemo vas objavljivanjem ažuriranih Pravila o kolačićima na našoj web stranici i ažuriranjem "Datuma stupanja na snagu" na vrhu ove stranice.
          </p>

          <h2 className="text-2xl font-bold text-[#1d1d1f] mt-8 mb-4">
            Kontaktirajte nas
          </h2>
          <p className="mb-6">
            Ako imate pitanja ili nedoumica u vezi sa ovom Politikom kolačića, kontaktirajte nas putem{' '}
            <a href="https://bilbord.rs/kontakt/" target="_blank" rel="noopener noreferrer" className="text-[#1d1d1f] hover:underline">
              kontakt stranice
            </a>.
          </p>
        </div>
      </div>
    </div>
  )
}

