import React from 'react';
import { BookOpen, ShieldCheck, Zap, CreditCard, Award, CheckCircle2, Quote, Sparkles, Star, ThumbsUp } from 'lucide-react';
import { getTheme } from '../../config/themes';
import { getDesignVariant } from '../../config/blockDesignStyles';
import { getCustomColorStyle } from '../../config/colorTokens';
import { getOrderedSlots } from '../../config/blockSlots';
import SlotReplacer from './SlotReplacer';

export default function AboutStoryBlock({ 
  block, 
  blockId,
  shop, 
  themeId, 
  isMobilePreview = false,
  isEditMode = false,
  onUpdateBlockProps,
  onOpenWhatsApp,
  onSelectProduct,
  innerSnippetsSlot
}) {
  const theme = getTheme(themeId);
  const props = block?.props || {};
  const currentBlockId = blockId || block?.id;
  const dv = getDesignVariant(props.designVariant || 'modern_minimal');

  const titleStyle = getCustomColorStyle(props.titleColor);
  const textStyle = getCustomColorStyle(props.textColor);

  const title = props.title || `L'Histoire & Les Valeurs de ${shop.name}`;
  const storyText = props.storyText || `Fondée avec la passion d'offrir les meilleurs articles au Cameroun, ${shop.name} s'engage à vous garantir satisfaction, traçabilité et rapidité de service.`;
  const commitment1 = props.commitment1 || 'Livraison éclair en moins de 2h';
  const commitment2 = props.commitment2 || 'Produits 100% conformes et certifiés';
  const commitment3 = props.commitment3 || 'Paiement sécurisé à la livraison';
  const sinceYear = props.sinceYear || '2022';
  const badgeText = props.badgeText || 'Vendeur Certifié';

  const replacerProps = {
    blockId: currentBlockId,
    blockType: 'AboutStory',
    blockProps: props,
    isEditMode,
    onUpdateBlockProps,
    themeId,
    shop,
    onSelectProduct: isEditMode ? undefined : onSelectProduct,
    onOpenWhatsApp: isEditMode ? undefined : onOpenWhatsApp
  };

  const slotsOrder = getOrderedSlots('AboutStory', props.slotsOrder);

  const slotElements = {
    badgeSlot: (
      <SlotReplacer slotName="badgeSlot" slotLabel="Badge Certification" {...replacerProps}>
        <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${dv.accentBadgeClass || theme.badge}`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>{badgeText} • Depuis {sinceYear}</span>
        </span>
      </SlotReplacer>
    ),
    titleSlot: (
      <SlotReplacer slotName="titleSlot" slotLabel="Titre de Section" {...replacerProps}>
        <h2 style={titleStyle} className={`text-lg sm:text-2xl font-black ${dv.headerClass}`}>
          {title}
        </h2>
      </SlotReplacer>
    ),
    storyTextSlot: (
      <SlotReplacer slotName="storyTextSlot" slotLabel="Texte & Histoire" {...replacerProps}>
        <p style={textStyle} className={`text-xs sm:text-sm leading-relaxed opacity-90 ${dv.subTextClass}`}>
          {storyText}
        </p>
      </SlotReplacer>
    ),
    commitmentsSlot: (
      <SlotReplacer slotName="commitmentsSlot" slotLabel="Cartes de Garanties & Stats" {...replacerProps}>
        <div className={`grid gap-3 sm:gap-4 ${isMobilePreview ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'}`}>
          <div className={`text-center space-y-1 ${dv.cardInnerClass || 'p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800'}`}>
            <div className={`w-10 h-10 rounded-2xl ${theme.badge} flex items-center justify-center mx-auto mb-2`}>
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-black text-xs sm:text-sm text-current">Livraison &lt; 2h</h4>
            <p className="text-[11px] opacity-80 text-current">{commitment1}</p>
          </div>

          <div className={`text-center space-y-1 ${dv.cardInnerClass || 'p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800'}`}>
            <div className={`w-10 h-10 rounded-2xl ${theme.badge} flex items-center justify-center mx-auto mb-2`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-black text-xs sm:text-sm text-current">100% Conforme</h4>
            <p className="text-[11px] opacity-80 text-current">{commitment2}</p>
          </div>

          <div className={`text-center space-y-1 ${dv.cardInnerClass || 'p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800'}`}>
            <div className={`w-10 h-10 rounded-2xl ${theme.badge} flex items-center justify-center mx-auto mb-2`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <h4 className="font-black text-xs sm:text-sm text-current">Paiement Réception</h4>
            <p className="text-[11px] opacity-80 text-current">{commitment3}</p>
          </div>
        </div>
      </SlotReplacer>
    )
  };

  return (
    <section className={`p-5 sm:p-8 mb-6 sm:mb-8 transition-all duration-300 space-y-5 ${dv.containerClass}`}>
      <div className="text-center max-w-xl mx-auto space-y-3">
        {slotsOrder.filter(s => s !== 'commitmentsSlot').map(slotId => (
          <div key={slotId}>
            {slotElements[slotId]}
          </div>
        ))}
      </div>

      {slotsOrder.includes('commitmentsSlot') && (
        <div>
          {slotElements.commitmentsSlot}
        </div>
      )}

      {/* 🌟 Contenus Intérieurs & Réseaux Sociaux DANS le thème du bloc */}
      {innerSnippetsSlot}
    </section>
  );
}
