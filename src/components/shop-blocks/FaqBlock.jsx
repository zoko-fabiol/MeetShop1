import React, { useState } from 'react';
import { ChevronDown, MessageCircleQuestion, HelpCircle, CheckCircle2 } from 'lucide-react';
import { getTheme } from '../../config/themes';
import { getDesignVariant } from '../../config/blockDesignStyles';

export default function FaqBlock({ block, shop, themeId, isMobilePreview = false }) {
  const theme = getTheme(themeId);
  const props = block?.props || {};
  const dv = getDesignVariant(props.designVariant || 'modern_minimal');

  const title = props.title || 'Foire Aux Questions (FAQ)';
  const subtitle = props.subtitle || 'Tout ce que vous devez savoir avant de commander';
  const items = Array.isArray(props.items) && props.items.length > 0 ? props.items : [
    { q: 'Comment passer commande ?', a: 'Ajoutez vos articles au panier ou cliquez directement sur Discuter sur WhatsApp pour être mis en relation avec le vendeur.' },
    { q: 'Quels sont les délais de livraison ?', a: 'Généralement en moins de 2 heures à Douala et Yaoundé, et 24h à 48h pour les autres villes.' },
    { q: 'Quels sont les moyens de paiement acceptés ?', a: 'Paiement à la livraison en espèces ou par Mobile Money (Orange Money / MTN MoMo).' }
  ];

  const [openIndexes, setOpenIndexes] = useState([0]);

  const toggleItem = (idx) => {
    setOpenIndexes(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section className={`p-4 sm:p-8 mb-6 sm:mb-8 transition-all duration-300 ${dv.containerClass}`}>
      <div className="mb-6 pb-4 border-b border-current/15 text-center sm:text-left">
        <div className="flex items-center gap-2.5 justify-center sm:justify-start">
          <div className={`p-2 rounded-2xl border ${dv.accentBadgeClass || theme.badge}`}>
            <MessageCircleQuestion className="w-5 h-5" />
          </div>
          <h2 className={`text-lg sm:text-2xl font-black tracking-tight ${dv.headerClass}`}>
            {title}
          </h2>
        </div>
        <p className={`text-xs mt-1.5 opacity-90 ${dv.subTextClass}`}>{subtitle}</p>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const isOpen = openIndexes.includes(idx);
          return (
            <div
              key={idx}
              className={`rounded-2xl transition-all duration-200 overflow-hidden ${
                dv.cardInnerClass || 'border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${dv.accentBadgeClass || theme.pillActive}`}>
                    {idx + 1}
                  </span>
                  <span className="font-bold text-xs sm:text-sm text-current">{item.q}</span>
                </div>
                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 text-current ${isOpen ? 'rotate-180 opacity-100' : 'opacity-60'}`} />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 pl-13 text-xs leading-relaxed opacity-90 border-t border-current/10 text-current">
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
