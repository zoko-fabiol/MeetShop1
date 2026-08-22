import React from 'react';
import { Sparkles, MessageCircle, Phone, ShoppingBag, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { getTheme } from '../../config/themes';
import { getButtonClasses } from '../../config/blockStyles';
import { getDesignVariant } from '../../config/blockDesignStyles';
import { getCustomColorStyle } from '../../config/colorTokens';
import { getOrderedSlots } from '../../config/blockSlots';
import SlotReplacer from './SlotReplacer';

export default function CustomCtaBlock({ 
  block, 
  blockId,
  shop, 
  themeId, 
  onOpenWhatsApp, 
  onOpenVendorDashboard,
  isMobilePreview = false,
  isEditMode = false,
  onUpdateBlockProps,
  onSelectProduct,
  innerSnippetsSlot
}) {
  const theme = getTheme(themeId);
  const props = block?.props || {};
  const currentBlockId = blockId || block?.id;
  const dv = getDesignVariant(props.designVariant || 'modern_minimal');

  const titleStyle = getCustomColorStyle(props.titleColor);
  const textStyle = getCustomColorStyle(props.textColor);

  const title = props.title || 'Une question ? Besoin d\'un conseil personnalisé ?';
  const subtitle = props.subtitle || 'Notre équipe vous répond instantanément sur WhatsApp 7j/7.';
  const primaryBtnText = props.primaryBtnText || 'Discuter en direct sur WhatsApp';
  const primaryBtnAction = props.primaryBtnAction || 'whatsapp';
  const secondaryBtnText = props.secondaryBtnText || 'Appeler la boutique';
  const secondaryBtnAction = props.secondaryBtnAction || 'call';
  const badgeText = props.badgeText || 'Réponse en < 5 minutes';

  const buttonStyle = props.buttonStyle || 'modern_rounded';
  const primaryBtnClass = getButtonClasses(buttonStyle, theme, 'primary');
  const secondaryBtnClass = getButtonClasses(buttonStyle, theme, 'secondary');

  const handleAction = (actionType) => {
    if (isEditMode) return; // Désactiver l'ouverture externe en mode édition
    if (actionType === 'whatsapp') {
      const cleanPhone = (shop.phone || '+237699123456').replace(/\D/g, '');
      const msg = `Bonjour ${shop.name}, j'ai une question concernant vos articles !`;
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    } else if (actionType === 'call') {
      window.location.href = `tel:${shop.phone || '+237699123456'}`;
    }
  };

  const replacerProps = {
    blockId: currentBlockId,
    blockType: 'CustomCta',
    blockProps: props,
    isEditMode,
    onUpdateBlockProps,
    themeId,
    shop,
    onSelectProduct: isEditMode ? undefined : onSelectProduct,
    onOpenWhatsApp: isEditMode ? undefined : onOpenWhatsApp
  };

  const slotsOrder = getOrderedSlots('CustomCta', props.slotsOrder);

  const slotElements = {
    badgeSlot: (
      <SlotReplacer slotName="badgeSlot" slotLabel="Badge CTA" {...replacerProps}>
        <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${dv.accentBadgeClass || theme.badge}`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>{badgeText}</span>
        </span>
      </SlotReplacer>
    ),
    titleSlot: (
      <SlotReplacer slotName="titleSlot" slotLabel="Titre & Slogan" {...replacerProps}>
        <div>
          <h2 style={titleStyle} className={`text-lg sm:text-2xl font-black ${dv.headerClass}`}>
            {title}
          </h2>
          <p style={textStyle} className={`text-xs sm:text-sm pt-0.5 opacity-90 ${dv.subTextClass}`}>
            {subtitle}
          </p>
        </div>
      </SlotReplacer>
    ),
    actionsGridSlot: (
      <SlotReplacer slotName="actionsGridSlot" slotLabel="Cartes d'Action" {...replacerProps}>
        <div className={`grid gap-3 sm:gap-4 ${isMobilePreview ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
          <div 
            onClick={() => handleAction(primaryBtnAction)}
            className={`p-5 flex items-center justify-between gap-4 cursor-pointer hover:scale-[1.02] transition-all shadow-sm group ${dv.cardInnerClass || 'rounded-2xl bg-slate-50 dark:bg-slate-950/70 text-slate-900 dark:text-white border border-slate-200'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${dv.accentBadgeClass || theme.badgeLive} shadow-md shrink-0`}>
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-sm text-current">{primaryBtnText}</h4>
                <p className="text-[11px] opacity-80 font-semibold text-current">Conseiller en direct</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-current opacity-70 group-hover:translate-x-1 transition-transform shrink-0" />
          </div>

          <div 
            onClick={() => handleAction(secondaryBtnAction)}
            className={`p-5 flex items-center justify-between gap-4 cursor-pointer hover:scale-[1.02] transition-all shadow-sm group ${dv.cardInnerClass || 'rounded-2xl bg-slate-50 dark:bg-slate-950/70 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800'}`}
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-black/10 dark:bg-white/10 text-current shadow-md shrink-0">
                <Phone className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h4 className="font-black text-sm text-current">{secondaryBtnText}</h4>
                <p className="text-[11px] opacity-75 font-semibold text-current">{shop.phone || '+237 699 123 456'}</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 opacity-70 text-current group-hover:translate-x-1 transition-transform shrink-0" />
          </div>
        </div>
      </SlotReplacer>
    )
  };

  return (
    <section className={`p-5 sm:p-8 mb-6 sm:mb-8 transition-all duration-300 space-y-4 ${dv.containerClass}`}>
      <div className="text-center max-w-xl mx-auto space-y-2">
        {slotsOrder.filter(s => s !== 'actionsGridSlot').map(slotId => (
          <div key={slotId}>
            {slotElements[slotId]}
          </div>
        ))}
      </div>

      {slotsOrder.includes('actionsGridSlot') && (
        <div>
          {slotElements.actionsGridSlot}
        </div>
      )}

      {/* 🌟 Contenus Intérieurs & Réseaux Sociaux DANS le thème du bloc */}
      {innerSnippetsSlot}
    </section>
  );
}
