import React, { useState } from 'react';
import { 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  MapPin, 
  MessageSquare, 
  Award, 
  Shirt, 
  LayoutGrid, 
  Check, 
  Star, 
  ArrowUpRight,
  TrendingUp,
  Heart,
  Tag,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { getTheme } from '../../config/themes';

const ICON_MAP = {
  Zap,
  ShieldCheck,
  MapPin,
  MessageSquare,
  Award,
  Shirt,
  LayoutGrid,
  Star,
  Sparkles,
  TrendingUp,
  Heart,
  Tag,
  Clock
};

export default function DynamicCodeBlock({ block, shop, themeId, onOpenWhatsApp, onSelectProduct, isMobilePreview = false }) {
  const theme = getTheme(themeId);
  const props = block.props || {};
  const structure = props.structure || props || {};

  const title = structure.title || props.title || props.name || 'Sélection Exclusive Sur-Mesure';
  const subtitle = structure.subtitle || props.subtitle || props.description || `Offres et prestations certifiées par ${shop?.name || 'la boutique'}`;

  const cards = structure.cards || props.cards || null;
  const looks = structure.looks || props.looks || null;
  const steps = structure.steps || props.steps || null;
  const perks = structure.perks || props.perks || null;

  const [selectedOptions, setSelectedOptions] = useState({});

  const handleOptionClick = (stepIndex, option) => {
    setSelectedOptions(prev => ({ ...prev, [stepIndex]: option }));
  };

  const handleQuizzSubmit = () => {
    const answersText = Object.entries(selectedOptions)
      .map(([idx, opt]) => `Critère ${Number(idx) + 1}: ${opt}`)
      .join('\n');
    const msg = `Bonjour ${shop.name}, j'ai complété votre conseiller interactif sur MeetShop :\n${answersText}\nJe souhaite votre recommandation personnalisée.`;
    const cleanPhone = (shop.phone || '+237699123456').replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // ─── 1. TYPE DE STRUCTURE: GRILLE BENTO MODERNE ─────────────────────────────
  if (cards && Array.isArray(cards) && cards.length > 0) {
    return (
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 sm:p-8 shadow-xl mb-6 sm:mb-8 transition-colors">
        <div className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-800 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${theme.badge}`}>
              Création Exclusive IA
            </span>
            <span className="text-xs text-slate-500 font-medium">Grille Bento 3D</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className={`grid gap-3 sm:gap-4 ${isMobilePreview ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
          {cards.map((c, i) => {
            const IconComponent = ICON_MAP[c.icon] || Sparkles;
            return (
              <div
                key={i}
                className={`p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between space-y-3 relative overflow-hidden group hover:border-emerald-500/40 transition-all ${
                  !isMobilePreview && c.span ? c.span : ''
                }`}
              >
                <div className="space-y-2 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${theme.accentColor} shrink-0`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    {c.badge && (
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${theme.badge}`}>
                        {c.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    {c.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  // ─── 2. TYPE DE STRUCTURE: LOOKBOOK / TENUES EXCLUSIVES ────────────────────
  if (looks && Array.isArray(looks) && looks.length > 0) {
    return (
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 sm:p-8 shadow-xl mb-6 sm:mb-8 transition-colors">
        <div className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-800 text-center sm:text-left">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${theme.badge}`}>
            Lookbook & Tendances
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className={`grid gap-4 ${isMobilePreview ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'}`}>
          {looks.map((look, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Style #{idx + 1}</span>
                  {look.badge && (
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${theme.badge}`}>
                      {look.badge}
                    </span>
                  )}
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{look.name}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">{look.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="font-mono font-black text-xs text-slate-900 dark:text-white">{look.price}</span>
                <button
                  type="button"
                  onClick={() => onOpenWhatsApp?.(shop.phone, `${shop.name} - ${look.name}`)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 ${theme.btnPrimary}`}
                >
                  <span>Commander</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ─── 3. TYPE DE STRUCTURE: QUIZZ INTERACTIF / CONSEILLER ───────────────────
  if (steps && Array.isArray(steps) && steps.length > 0) {
    return (
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 sm:p-8 shadow-xl mb-6 sm:mb-8 transition-colors space-y-5">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase border ${theme.badge}`}>
            <Sparkles className="w-3 h-3" />
            <span>Guide Personnalisé</span>
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          {steps.map((st, sIdx) => (
            <div key={sIdx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${theme.pillActive}`}>
                  {sIdx + 1}
                </span>
                <span>{st.question}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {(st.options || []).map((opt, oIdx) => {
                  const isSel = selectedOptions[sIdx] === opt;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleOptionClick(sIdx, opt)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                        isSel
                          ? `${theme.badge} ring-2 ring-emerald-500/40 font-bold shadow-sm`
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleQuizzSubmit}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-xs shadow-lg active:scale-95 transition-all ${theme.btnPrimary}`}
            >
              <span>{structure.ctaText || props.ctaText || 'Envoyer ma sélection sur WhatsApp'}</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ─── 4. TYPE DE STRUCTURE: CLUB PRIVILÈGE / PERKS VIP ─────────────────────
  if (perks && Array.isArray(perks) && perks.length > 0) {
    return (
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 sm:p-9 shadow-xl mb-6 sm:mb-8 relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-72 h-72 opacity-20 bg-gradient-to-br ${theme.gradient} rounded-full blur-3xl pointer-events-none`} />

        <div className={`relative z-10 flex items-start justify-between gap-6 ${isMobilePreview ? 'flex-col' : 'flex-col md:flex-row'}`}>
          <div className="space-y-2 max-w-md">
            <span className={`px-3 py-0.5 rounded-full text-[10px] font-mono font-bold border ${theme.badge}`}>
              {structure.badgeText || props.badgeText || 'VIP ACCESS'}
            </span>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white">
              {title}
            </h2>
            <p className="text-xs text-slate-300">
              {subtitle}
            </p>
          </div>

          <div className="flex-1 w-full space-y-2.5">
            {perks.map((p, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-white/10 dark:bg-slate-900/60 backdrop-blur-md border border-white/10 flex items-start gap-3">
                <div className={`p-2 rounded-xl ${theme.badge} shrink-0`}>
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white">{p.title}</h4>
                  <p className="text-[11px] text-slate-300">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ─── 5. STRUCTURE DE REPLI: BENTO GRID TECH AUTOMATIQUE ────────────────────
  return (
    <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 sm:p-8 shadow-xl mb-6 sm:mb-8 transition-colors">
      <div className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-800 text-center sm:text-left">
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${theme.badge}`}>
            Invention IA Sur-Mesure
          </span>
          <span className="text-xs text-slate-500 font-medium">Bento Showcase</span>
        </div>
        <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
          {title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {subtitle}
        </p>
      </div>

      <div className={`grid gap-3 sm:gap-4 ${isMobilePreview ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 col-span-1 md:col-span-2 space-y-2">
          <div className="flex items-center justify-between">
            <span className={`p-2 rounded-xl bg-white dark:bg-slate-900 border ${theme.accentColor}`}>
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${theme.badge}`}>100% Certifié</span>
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Sélection Haute Performance & Garantie</h4>
          <p className="text-xs text-slate-600 dark:text-slate-300">Articles rigoureusement testés et garantis avec SAV express sur Douala et Yaoundé.</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className={`p-2 rounded-xl bg-white dark:bg-slate-900 border ${theme.accentColor}`}>
              <Zap className="w-4 h-4" />
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${theme.badge}`}>Express</span>
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Livraison Moins de 2h</h4>
          <p className="text-xs text-slate-600 dark:text-slate-300">Paiement sécurisé à la réception (Orange Money, MoMo ou Espèces).</p>
        </div>
      </div>
    </section>
  );
}
