import React from 'react';
import { Sparkles, Info, Quote, Award } from 'lucide-react';
import { getTheme } from '../../config/themes';
import { getDesignVariant } from '../../config/blockDesignStyles';

export default function RichTextBlock({ block, shop, themeId, isMobilePreview = false }) {
  const theme = getTheme(themeId);
  const props = block?.props || {};
  const dv = getDesignVariant(props.designVariant || 'modern_minimal');

  const heading = props.heading || 'L\'Excellence et la Qualité au Meilleur Prix';
  const content = props.content || 'Nous sélectionnons pour vous les meilleurs arrivages du marché avec une garantie totale de conformité.';
  const highlightNote = props.highlightNote || '';
  const badgeText = props.badgeText || '';

  return (
    <section className={`p-6 sm:p-10 mb-6 sm:mb-8 transition-all duration-300 text-center relative overflow-hidden ${dv.containerClass}`}>
      <Quote className={`w-16 h-16 mx-auto ${theme.accentColor} opacity-15 mb-2`} />
      <div className="max-w-2xl mx-auto space-y-3 relative z-10 -mt-10">
        {badgeText && (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${dv.accentBadgeClass || theme.badge}`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{badgeText}</span>
          </span>
        )}
        <h2 className={`text-xl sm:text-3xl font-black ${dv.headerClass}`}>
          {heading}
        </h2>
        <p className={`text-xs sm:text-sm italic leading-relaxed ${dv.subTextClass}`}>
          "{content}"
        </p>
        {highlightNote && (
          <div className={`p-3 rounded-2xl text-xs font-bold inline-block ${dv.accentBadgeClass || theme.badge}`}>
            {highlightNote}
          </div>
        )}
      </div>
    </section>
  );
}
