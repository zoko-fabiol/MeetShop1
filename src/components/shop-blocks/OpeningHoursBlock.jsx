import React from 'react';
import { Clock, MapPin, CheckCircle, Calendar, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import { getTheme } from '../../config/themes';
import { getDesignVariant } from '../../config/blockDesignStyles';
import { getCustomColorStyle } from '../../config/colorTokens';
import SlotReplacer from './SlotReplacer';

export default function OpeningHoursBlock({ 
  block, 
  blockId,
  shop, 
  themeId, 
  onOpenWhatsApp, 
  isMobilePreview = false,
  isEditMode = false,
  onUpdateBlockProps,
  onSelectProduct
}) {
  const theme = getTheme(themeId);
  const props = block?.props || {};
  const currentBlockId = blockId || block?.id;
  const dv = getDesignVariant(props.designVariant || 'modern_minimal');

  const titleStyle = getCustomColorStyle(props.titleColor);
  const textStyle = getCustomColorStyle(props.textColor);

  const title = props.title || 'Horaires & Disponibilité Locale';
  const statusText = props.statusText || (shop.isLive ? 'Ouvert maintenant' : 'Disponible sur WhatsApp');
  const mondayFriday = props.mondayFriday || '08h00 - 19h30';
  const saturday = props.saturday || '08h30 - 20h00';
  const sunday = props.sunday || '12h00 - 18h00 (Urgences WhatsApp)';
  const dispatchNotice = props.dispatchNotice || `Livraison continue sur ${shop.city || 'Douala & Yaoundé'}.`;

  const replacerProps = {
    blockId: currentBlockId,
    blockType: 'OpeningHours',
    blockProps: props,
    isEditMode,
    onUpdateBlockProps,
    themeId,
    shop,
    onSelectProduct: isEditMode ? undefined : onSelectProduct,
    onOpenWhatsApp: isEditMode ? undefined : onOpenWhatsApp
  };

  return (
    <section className={`p-4 sm:p-8 mb-6 sm:mb-8 transition-all duration-300 ${dv.containerClass}`}>
      
      <div className={`flex items-start justify-between gap-3 sm:gap-4 mb-5 sm:mb-6 pb-4 border-b border-current/15 ${isMobilePreview ? 'flex-col' : 'flex-col md:flex-row md:items-center'}`}>
        <div>
          <SlotReplacer slotName="headerSlot" slotLabel="En-tête Horaires" {...replacerProps}>
            <div className="flex items-center gap-2">
              <h2 style={titleStyle} className={`text-lg sm:text-2xl font-black tracking-tight ${dv.headerClass}`}>
                {title}
              </h2>
              <span className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md ${dv.accentBadgeClass || theme.badgeLive}`}>
                <span className="w-2 h-2 rounded-full bg-current animate-ping"></span>
                {statusText}
              </span>
            </div>
          </SlotReplacer>
          <p style={textStyle} className={`text-xs mt-1 flex items-center gap-1.5 opacity-90 ${dv.subTextClass}`}>
            <MapPin className={`w-3.5 h-3.5 ${theme.accentColor}`} />
            <span>Retrait et essayage en boutique physique à {shop.quarter}, {shop.city}</span>
          </p>
        </div>

        <SlotReplacer slotName="actionSlot" slotLabel="Bouton Action Rapide" {...replacerProps}>
          <button
            type="button"
            onClick={(e) => {
              if (isEditMode) {
                e.preventDefault();
                return;
              }
              onOpenWhatsApp?.(shop.phone, shop.name);
            }}
            className={`w-full sm:w-auto px-4 py-2 text-xs flex items-center justify-center gap-2 ${dv.buttonClass || theme.btnPrimary}`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Contacter en Direct</span>
          </button>
        </SlotReplacer>
      </div>

      <SlotReplacer slotName="gridSlot" slotLabel="Grille des Jours" {...replacerProps}>
        <div className={`grid gap-3 sm:gap-4 ${isMobilePreview ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'}`}>
          <div className={`space-y-1 text-center ${dv.cardInnerClass || 'p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800'}`}>
            <span className="text-[10px] font-extrabold uppercase opacity-70 tracking-wider text-current">Semaine</span>
            <h4 className="font-black text-xs sm:text-sm text-current">Lundi – Vendredi</h4>
            <p className="font-mono text-xs font-black text-current opacity-90">{mondayFriday}</p>
          </div>

          <div className={`space-y-1 text-center ${dv.cardInnerClass || 'p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800'}`}>
            <span className="text-[10px] font-extrabold uppercase opacity-70 tracking-wider text-current">Samedi</span>
            <h4 className="font-black text-xs sm:text-sm text-current">Samedi</h4>
            <p className="font-mono text-xs font-black text-current opacity-90">{saturday}</p>
          </div>

          <div className={`space-y-1 text-center ${dv.cardInnerClass || 'p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800'}`}>
            <span className="text-[10px] font-extrabold uppercase opacity-70 tracking-wider text-current">Dimanche & Fêtes</span>
            <h4 className="font-black text-xs sm:text-sm text-current">Dimanche</h4>
            <p className="font-mono text-xs font-black text-amber-500">{sunday}</p>
          </div>
        </div>
      </SlotReplacer>

    </section>
  );
}
