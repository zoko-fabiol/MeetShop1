import React, { useState, useEffect } from 'react';
import { 
  Star, 
  CheckCircle, 
  Quote, 
  ThumbsUp, 
  ShieldCheck, 
  MessageSquarePlus, 
  Send, 
  User, 
  AlertCircle 
} from 'lucide-react';
import { getTheme } from '../../config/themes';
import { getDesignVariant } from '../../config/blockDesignStyles';
import { getCustomColorStyle } from '../../config/colorTokens';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import SlotReplacer from './SlotReplacer';

export default function CustomerReviewsBlock({ 
  block, 
  blockId,
  shop, 
  themeId, 
  isMobilePreview = false,
  isEditMode = false,
  onUpdateBlockProps,
  onOpenWhatsApp,
  onSelectProduct
}) {
  const theme = getTheme(themeId);
  const props = block?.props || {};
  const currentBlockId = blockId || block?.id;
  const dv = getDesignVariant(props.designVariant || 'modern_minimal');

  const titleStyle = getCustomColorStyle(props.titleColor);
  const textStyle = getCustomColorStyle(props.textColor);

  const { orders = [] } = useCart();
  const { isLoggedIn, userProfile, firebaseUser } = useAuth();

  const title = props.title || 'Avis Clients Vérifiés';
  const subtitle = props.subtitle || 'Retours d\'expérience 100% authentiques de clients vérifiés';
  const allowNewReviews = props.allowNewReviews !== false;
  const shopStorageKey = `meetshop_shop_reviews_${shop?.id || shop?.code || 'default'}`;

  // État des avis enregistrés
  const [reviewsList, setReviewsList] = useState(() => {
    try {
      const saved = localStorage.getItem(shopStorageKey);
      if (saved) return JSON.parse(saved);
      return Array.isArray(props.reviews) ? props.reviews : [];
    } catch {
      return Array.isArray(props.reviews) ? props.reviews : [];
    }
  });

  // Calcul dynamique des notes
  const totalRating = reviewsList.reduce((sum, r) => sum + (Number(r.rating) || 5), 0);
  const calculatedAverage = reviewsList.length > 0 ? (totalRating / reviewsList.length).toFixed(1) : (props.averageRating || '4.9');
  const satisfactionPercent = reviewsList.length > 0 ? Math.round((reviewsList.filter(r => (Number(r.rating) || 5) >= 4).length / reviewsList.length) * 100) : 98;

  const replacerProps = {
    blockId: currentBlockId,
    blockType: 'CustomerReviews',
    blockProps: props,
    isEditMode,
    onUpdateBlockProps,
    themeId,
    shop,
    onSelectProduct,
    onOpenWhatsApp
  };

  return (
    <section className={`p-5 sm:p-8 mb-6 sm:mb-8 transition-all duration-300 space-y-6 ${dv.containerClass}`}>
      
      {/* ── EN-TÊTE DU BLOC ── */}
      <div className={`flex items-start justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800 ${isMobilePreview ? 'flex-col' : 'flex-col sm:flex-row sm:items-center'}`}>
        
        <SlotReplacer slotName="headerSlot" slotLabel="En-tête Avis" {...replacerProps}>
          <div>
            <div className="flex items-center gap-2">
              <h2 style={titleStyle} className={`text-lg sm:text-2xl font-black tracking-tight ${dv.headerClass}`}>
                {title}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${dv.accentBadgeClass || theme.badge}`}>
                Certifié MeetShop
              </span>
            </div>
            <p style={textStyle} className={`text-xs mt-1 ${dv.subTextClass}`}>
              {subtitle}
            </p>
          </div>
        </SlotReplacer>

        {/* ── NOTE GLOBALE & STATS ── */}
        <SlotReplacer slotName="overviewSlot" slotLabel="Score Global & Étoiles" {...replacerProps}>
          <div className={`flex items-center gap-3 p-3 rounded-2xl shrink-0 ${dv.cardInnerClass || 'bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800'}`}>
            <div className="text-center pr-3 border-r border-current/20">
              <span className="text-2xl font-black block leading-none text-current">
                {calculatedAverage}
              </span>
              <span className="text-[10px] opacity-75 font-bold text-current">sur 5</span>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-0.5 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-[10px] font-bold opacity-85 text-current">
                {satisfactionPercent}% de satisfaction ({reviewsList.length} avis)
              </p>
            </div>
          </div>
        </SlotReplacer>

      </div>

      {/* ── LISTE DES AVIS CLIENTS ── */}
      <SlotReplacer slotName="reviewsGridSlot" slotLabel="Grille des Avis" {...replacerProps}>
        {reviewsList.length === 0 ? (
          <div className={`py-10 text-center rounded-2xl space-y-2 border border-dashed ${dv.cardInnerClass || 'bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800'}`}>
            <Quote className="w-8 h-8 opacity-40 mx-auto" />
            <h4 className="font-bold text-sm text-current">
              Avis clients vérifiés
            </h4>
            <p className="text-xs opacity-75 max-w-sm mx-auto text-current">
              Retrouvez bientôt ici les retours certifiés des clients de {shop?.name}.
            </p>
          </div>
        ) : (
          <div className={`grid gap-3 sm:gap-4 ${isMobilePreview ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
            {reviewsList.map((rev, rIdx) => (
              <div
                key={rev.id || rIdx}
                className={`flex flex-col justify-between space-y-3 shadow-sm transition-all ${dv.cardInnerClass || 'p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800/80'}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] opacity-70 text-current">{rev.date || 'Récent'}</span>
                  </div>

                  <p className="text-xs leading-relaxed italic text-current opacity-90">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-current/15">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-full ${theme.badge} flex items-center justify-center font-bold text-xs shrink-0`}>
                      {rev.name?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-bold text-xs truncate text-current">
                        {rev.name}
                      </h5>
                      <p className="text-[10px] opacity-70 truncate text-current">
                        {rev.location || 'Douala'}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-[9px] font-black ${dv.accentBadgeClass || theme.badge} px-1.5 py-0.5 rounded shrink-0`}>
                    <ShieldCheck className="w-2.5 h-2.5" />
                    <span>Achat vérifié</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </SlotReplacer>

    </section>
  );
}
