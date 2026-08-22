import React from 'react';
import { Star, ShieldCheck, MapPin, Phone, MessageSquare, Sparkles, CheckCircle2, Clock, Zap, Award, Gem, Terminal } from 'lucide-react';
import { getTheme } from '../../config/themes';
import { getButtonClasses, getAvatarClasses } from '../../config/blockStyles';
import { getDesignVariant } from '../../config/blockDesignStyles';
import { getCustomColorStyle } from '../../config/colorTokens';
import { getAvatarShape, getButtonStyle } from '../../config/snippetShapes';
import SlotReplacer from './SlotReplacer';

export default function HeroBannerBlock({ 
  block, 
  blockId,
  shop, 
  themeId, 
  onOpenWhatsApp, 
  onSelectProduct, 
  isMobilePreview = false,
  isEditMode = false,
  onUpdateBlockProps,
  innerSnippetsSlot
}) {
  const theme = getTheme(themeId);
  const props = block?.props || {};
  const currentBlockId = blockId || block?.id;
  const dv = getDesignVariant(props.designVariant || 'modern_minimal');

  const titleStyle = getCustomColorStyle(props.titleColor);
  const textStyle = getCustomColorStyle(props.textColor);

  const heroFromLayout = shop?.layout_config?.blocks?.find(b => b && b.type === 'HeroBanner');
  const coverUrl = props.customCoverUrl || heroFromLayout?.props?.customCoverUrl || shop?.banner || shop?.banner_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80';
  const logoUrl = props.customLogoUrl || heroFromLayout?.props?.customLogoUrl || shop?.logo || shop?.logo_url || 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=200&auto=format&fit=crop&q=80';
  const slogan = props.slogan || heroFromLayout?.props?.slogan || shop?.description || 'Votre boutique locale vérifiée sur MeetShop.';
  const ctaText = props.ctaText || heroFromLayout?.props?.ctaText || 'Discuter sur WhatsApp';

  // Style Tokens avec support des 6 formes d'avatars et 5 variantes de boutons
  const customAvatarShape = props.avatarShape ? getAvatarShape(props.avatarShape)?.class : null;
  const customButtonStyle = props.buttonStyle ? getButtonStyle(props.buttonStyle)?.class : null;

  const avatarContainerClass = customAvatarShape || getAvatarClasses(props.avatarStyle || 'rounded');
  const primaryButtonClass = customButtonStyle || dv.buttonClass || getButtonClasses(props.buttonStyle || 'modern_rounded', theme, 'primary');
  const secondaryButtonClass = getButtonClasses(props.buttonStyle || 'modern_rounded', theme, 'secondary');

  const replacerProps = {
    blockId: currentBlockId,
    blockType: 'HeroBanner',
    blockProps: props,
    isEditMode,
    onUpdateBlockProps,
    themeId,
    shop,
    onSelectProduct: isEditMode ? undefined : onSelectProduct,
    onOpenWhatsApp: isEditMode ? undefined : onOpenWhatsApp
  };

  return (
    <section className={`relative overflow-hidden mb-6 sm:mb-8 transition-all duration-300 ${dv.containerClass}`}>
      
      {/* Image de Couverture */}
      <div className="relative h-44 sm:h-64 md:h-80 w-full overflow-hidden bg-slate-800">
        <img
          src={coverUrl}
          alt={shop.name}
          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />
        
        {/* Badge Vendeur Vérifié en haut à droite */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <SlotReplacer slotName="verifiedBadgeSlot" slotLabel="Badge Certification" {...replacerProps}>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${dv.accentBadgeClass}`}>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Boutique Officielle Vérifiée</span>
            </div>
          </SlotReplacer>
        </div>
      </div>

      {/* Corps Informations Commerçant */}
      <div className="px-3 sm:px-8 pb-5 sm:pb-8 pt-0 relative z-10">
        <div className={`flex justify-between gap-4 -mt-12 sm:-mt-20 ${
          isMobilePreview 
            ? 'flex-col items-center text-center' 
            : 'flex-col sm:flex-row items-start sm:items-end'
        }`}>
          
          {/* Logo & Identité */}
          <div className={`flex gap-3 sm:gap-5 min-w-0 max-w-full ${
            isMobilePreview 
              ? 'flex-col items-center text-center' 
              : 'flex-col xs:flex-row items-center xs:items-end'
          }`}>
            <SlotReplacer slotName="logoSlot" slotLabel="Logo" {...replacerProps}>
              <div className="relative group shrink-0">
                <div className={`w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 ${avatarContainerClass} bg-slate-100 dark:bg-slate-800 ring-4 ring-white dark:ring-slate-900 shadow-2xl overflow-hidden`}>
                  <img
                    src={logoUrl}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={`absolute bottom-1 right-1 p-1 rounded-full bg-slate-900 ${theme.accentColor} border ${theme.accentBorder} shadow-md`}>
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>
            </SlotReplacer>

            <div className={`space-y-1 pb-1 min-w-0 flex-1 ${isMobilePreview ? 'text-center' : ''}`}>
              <SlotReplacer slotName="titleSlot" slotLabel="Nom & Description" {...replacerProps}>
                <div className="min-w-0">
                  <div className={`flex items-center gap-2 flex-wrap ${isMobilePreview ? 'justify-center' : ''}`}>
                    <h1 style={titleStyle} className={`text-lg sm:text-2xl md:text-3xl tracking-tight break-words ${dv.headerClass}`}>
                      {shop.name}
                    </h1>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${theme.badge}`}>
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {shop.rating || 4.9}
                    </span>
                  </div>
                  <p style={textStyle} className={`text-xs sm:text-sm max-w-xl line-clamp-2 break-words opacity-90 ${dv.subTextClass}`}>
                    {slogan}
                  </p>
                </div>
              </SlotReplacer>

              <div className={`flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1 ${isMobilePreview ? 'justify-center' : ''}`}>
                <div className="flex items-center gap-1">
                  <MapPin className={`w-3.5 h-3.5 ${theme.accentColor}`} />
                  <span>{shop.quarter || 'Bonamoussadi'}, {shop.city || 'Douala'}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1 text-emerald-500 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block mr-0.5" />
                  <span>Ouvert maintenant</span>
                </div>
              </div>
            </div>
          </div>

          {/* Boutons d'action rapides */}
          <SlotReplacer slotName="ctaSlot" slotLabel="Bouton WhatsApp CTA" {...replacerProps}>
            <div className={`w-full sm:w-auto flex items-center gap-2 shrink-0 pt-2 sm:pt-0 ${isMobilePreview ? 'justify-center' : ''}`}>
              <button
                type="button"
                onClick={(e) => {
                  if (isEditMode) {
                    e.preventDefault();
                    return;
                  }
                  onOpenWhatsApp?.(shop.phone, shop.name);
                }}
                className={`flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 text-xs flex items-center justify-center gap-2 whitespace-nowrap ${dv.buttonClass || primaryButtonClass}`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{ctaText}</span>
              </button>

              <a
                href={isEditMode ? undefined : `tel:${shop.phone || '+237699123456'}`}
                onClick={(e) => {
                  if (isEditMode) e.preventDefault();
                }}
                className={`px-3 py-2.5 sm:py-3 text-xs flex items-center justify-center shrink-0 ${secondaryButtonClass}`}
                title="Appeler directement"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </SlotReplacer>

        </div>

        {/* 🌟 Contenus Intérieurs & Réseaux Sociaux DANS le thème du bloc */}
        {innerSnippetsSlot}

      </div>
    </section>
  );
}
