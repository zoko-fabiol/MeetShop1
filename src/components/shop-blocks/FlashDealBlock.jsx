import React, { useState, useEffect } from 'react';
import { Zap, Clock, ArrowRight, Sparkles, Flame, Tag, Ticket, AlertTriangle } from 'lucide-react';
import { getTheme } from '../../config/themes';
import { getButtonClasses } from '../../config/blockStyles';
import { getDesignVariant } from '../../config/blockDesignStyles';
import { getCustomColorStyle } from '../../config/colorTokens';
import { getOrderedSlots } from '../../config/blockSlots';
import SlotReplacer from './SlotReplacer';
import CountdownClockRenderer from './CountdownClockRenderer';

export default function FlashDealBlock({ 
  block, 
  blockId,
  shop, 
  themeId, 
  onOpenWhatsApp, 
  onSelectProduct, 
  products = [], 
  isMobilePreview = false, 
  isEditMode = false,
  onUpdateBlockProps,
  innerSnippetsSlot
}) {
  const theme = getTheme(themeId);
  const props = block?.props || {};
  const currentBlockId = blockId || block?.id;
  const dv = getDesignVariant(props.designVariant || 'modern_minimal');
  const clockStyle = props.clockStyle || 'flip_card';

  const titleStyle = getCustomColorStyle(props.titleColor);
  const textStyle = getCustomColorStyle(props.textColor);

  const title = props.title || 'Offre Flash Spéciale !';
  const subtitle = props.subtitle || 'Réductions exclusives sur stock limité disponible aujourd\'hui.';
  const discountBadge = props.discountBadge || '-25% IMMÉDIAT';
  const ctaText = props.ctaText || 'Commander sur WhatsApp';
  const dealImage = props.dealImage || (products[0]?.image) || (products[0]?.images?.[0]) || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80';

  const buttonStyle = props.buttonStyle || 'modern_rounded';
  const primaryButtonClass = getButtonClasses(buttonStyle, theme, 'primary');

  const originalPrice = Number(props.originalPrice) || 0;
  const discountedPrice = Number(props.discountedPrice) || (originalPrice > 0 ? Math.round(originalPrice * 0.75) : 0);

  // Compte à rebours animé dynamique
  const [timeLeft, setTimeLeft] = useState(() => {
    if (props.expiresAt) {
      const diff = Math.max(0, Math.floor((props.expiresAt - Date.now()) / 1000));
      return {
        hours: Math.floor(diff / 3600),
        minutes: Math.floor((diff % 3600) / 60),
        seconds: diff % 60
      };
    }
    return { hours: Number(props.validityHours) || 14, minutes: 59, seconds: 8 };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCta = () => {
    if (isEditMode) return; // Aucun bouton ne doit déclencher d'action externe en mode édition
    if (onOpenWhatsApp) {
      const priceTxt = discountedPrice > 0 ? ` au prix promo de ${discountedPrice.toLocaleString()} FCFA (${discountBadge})` : ` (${discountBadge})`;
      const msg = `Bonjour ${shop.name}, je souhaite profiter de votre offre flash : "${title}"${priceTxt} !`;
      const cleanPhone = (shop.phone || '+237699123456').replace(/\D/g, '');
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };

  const replacerProps = {
    blockId: currentBlockId,
    blockType: 'FlashDeal',
    blockProps: props,
    isEditMode,
    onUpdateBlockProps,
    themeId,
    shop,
    onSelectProduct: isEditMode ? undefined : onSelectProduct,
    onOpenWhatsApp: isEditMode ? undefined : onOpenWhatsApp
  };

  const slotsOrder = getOrderedSlots('FlashDeal', props.slotsOrder);

  const slotElements = {
    badgeSlot: (
      <SlotReplacer slotName="badgeSlot" slotLabel="Badge Réduction" {...replacerProps}>
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase shadow-md ${dv.accentBadgeClass || 'bg-rose-600 text-white'}`}>
          <Flame className="w-3.5 h-3.5" />
          <span>{discountBadge}</span>
        </div>
      </SlotReplacer>
    ),
    titleSlot: (
      <SlotReplacer slotName="titleSlot" slotLabel="Titre & Description" {...replacerProps}>
        <div>
          <h3 style={titleStyle} className={`text-xl sm:text-2xl font-black ${dv.headerClass}`}>
            {title}
          </h3>
          <p style={textStyle} className={`text-xs sm:text-sm pt-0.5 opacity-90 ${dv.subTextClass}`}>
            {subtitle}
          </p>
        </div>
      </SlotReplacer>
    ),
    countdownSlot: (
      <SlotReplacer slotName="countdownSlot" slotLabel="Compte à Rebours" {...replacerProps}>
        <div className="flex justify-center sm:justify-start">
          <CountdownClockRenderer
            hours={timeLeft.hours}
            minutes={timeLeft.minutes}
            seconds={timeLeft.seconds}
            clockStyle={clockStyle}
            themeId={themeId}
            dv={dv}
          />
        </div>
      </SlotReplacer>
    ),
    ctaSlot: (
      <SlotReplacer slotName="ctaSlot" slotLabel="Bouton d'Action" {...replacerProps}>
        <button
          type="button"
          onClick={handleCta}
          className={`w-full sm:w-auto px-6 py-3.5 text-xs font-black uppercase tracking-wider ${dv.buttonClass || primaryButtonClass}`}
        >
          <Zap className="w-4 h-4" />
          <span>{ctaText}</span>
        </button>
      </SlotReplacer>
    )
  };

  return (
    <section className={`relative p-5 sm:p-7 mb-6 sm:mb-8 transition-all duration-300 ${dv.containerClass}`}>
      <div className="space-y-3.5 text-center sm:text-left">
        {slotsOrder.map(slotId => (
          <div key={slotId} className="w-full">
            {slotElements[slotId]}
          </div>
        ))}

        {/* 🌟 Contenus Intérieurs & Réseaux Sociaux DANS le thème du bloc */}
        {innerSnippetsSlot}
      </div>
    </section>
  );
}
