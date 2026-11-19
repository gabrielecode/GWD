import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Language } from '../types/showcase';
import { TRANSLATIONS } from '../data/translations';
import { ContactForm } from '../components/ContactForm';

interface ContactViewProps {
  lang: Language;
  onNavigate: (path: string) => void;
}

export function ContactView({ lang, onNavigate }: ContactViewProps) {
  const t = TRANSLATIONS[lang];

  const whatsappUrl =
    'https://wa.me/41910004210?text=' +
    encodeURIComponent('Buongiorno GWD Group, vorrei fissare una consulenza.');

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      <header className="max-w-3xl space-y-4">
        <p className="text-sm font-medium text-[#2DD4BF]">
          GWD Group · Lugano
        </p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FAFAF9]">
          {t.contactPage.title}
        </h1>
        <p className="text-lg text-[#A8A29E] leading-relaxed">
          {t.contactPage.subtitle}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Direct Channels + Swiss Phone + Email + Lugano Map + Response Times */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-[#292524] bg-[#1C1917] p-6 space-y-5">
            <h2 className="font-display text-lg font-semibold text-[#FAFAF9]">
              {t.contactPage.directChannels}
            </h2>

            <div className="space-y-4 text-sm">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-xl border border-[#2DD4BF]/35 bg-[#0C0A09] p-3.5 hover:border-[#2DD4BF] transition-colors"
              >
                <span className="inline-flex items-center gap-2.5 text-[#FAFAF9] font-medium">
                  <MessageCircle className="h-4 w-4 text-[#2DD4BF]" aria-hidden="true" />
                  <span>{t.quickContact.whatsappDirect}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-[#2DD4BF]" aria-hidden="true" />
              </a>

              <div className="flex items-start gap-3 pt-1">
                <Phone className="h-4 w-4 text-[#A8A29E] mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-xs text-[#A8A29E]">{t.contactPage.phoneLabel}</div>
                  <a
                    href="tel:+41910004210"
                    className="font-mono text-[#FAFAF9] hover:text-[#2DD4BF]"
                  >
                    +41 91 000 42 10
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-[#A8A29E] mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-xs text-[#A8A29E]">{t.contactPage.emailLabel}</div>
                  <a
                    href="mailto:hello@gwdgroup.ch"
                    className="font-mono text-[#FAFAF9] hover:text-[#2DD4BF]"
                  >
                    hello@gwdgroup.ch
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#A8A29E] mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-xs text-[#A8A29E]">{t.contactPage.addressLabel}</div>
                  <div className="text-[#FAFAF9]">{t.footer.address}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-[#A8A29E] mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-xs text-[#A8A29E]">{t.contactPage.hoursLabel}</div>
                  <div className="text-[#FAFAF9]">{t.contactPage.hoursValue}</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#292524]">
              <div className="text-xs font-semibold text-[#2DD4BF] mb-1">
                {t.contactPage.responseTitle}
              </div>
              <p className="text-xs text-[#A8A29E] leading-relaxed">
                {t.contactPage.responseValue}
              </p>
            </div>
          </div>

          {/* Architectural Lugano Map Box */}
          <div className="rounded-2xl border border-[#292524] bg-[#1C1917] p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-base font-semibold text-[#FAFAF9]">
                {t.contactPage.mapTitle}
              </h3>
              <span className="font-mono text-xs text-[#A8A29E]">
                46.0037° N, 8.9511° E
              </span>
            </div>
            <div className="relative h-48 rounded-xl border border-[#292524] bg-[#0C0A09] overflow-hidden p-4 flex flex-col justify-between">
              {/* Clean geometric Ticino coordinate grid */}
              <svg
                className="absolute inset-0 h-full w-full opacity-25"
                viewBox="0 0 400 200"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M0 40H400M0 80H400M0 120H400M0 160H400M50 0V200M100 0V200M150 0V200M200 0V200M250 0V200M300 0V200M350 0V200"
                  stroke="#A8A29E"
                  strokeOpacity="0.3"
                  strokeDasharray="3 3"
                />
                <path
                  d="M40 165C110 140 175 110 220 95C270 78 320 65 385 35"
                  stroke="#60A5FA"
                  strokeWidth="2.5"
                />
              </svg>
              <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#A8A29E]">
                <span>Bellinzona · 25 min</span>
                <span>Mendrisio · 20 min</span>
              </div>
              <div className="relative z-10 self-center rounded-xl border border-[#2DD4BF]/40 bg-[#1C1917]/95 px-3.5 py-2 text-xs text-[#FAFAF9]">
                <span className="font-semibold text-[#2DD4BF]">GWD Group</span> · Via Nassa 21, Lugano
              </div>
              <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#A8A29E]">
                <span>Locarno · 35 min</span>
                <a
                  href="https://maps.google.com/?q=Via+Nassa+21,+6900+Lugano"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2DD4BF] hover:underline"
                >
                  Google Maps ↗
                </a>
              </div>
            </div>
            <p className="text-xs text-[#A8A29E]">
              {t.contactPage.mapSubtitle}
            </p>
          </div>
        </div>

        {/* Right: Short 4-Field Form */}
        <div className="lg:col-span-7">
          <ContactForm
            lang={lang}
            onOpenPrivacy={() => onNavigate('/privacy')}
          />
        </div>
      </div>
    </div>
  );
}
