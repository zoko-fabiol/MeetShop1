import React from 'react';
import { Sparkles, TrendingDown, Check, Zap, Sliders } from 'lucide-react';
import { calculateWholesaleTier } from '../services/wholesaleService';
import { getTheme } from '../config/themes';

export default function WholesaleTierWidget({
  product,
  quantity = 1,
  onSelectQuantity,
  shop,
  themeId = 'emerald'
}) {
  if (!product) return null;

  const effectiveThemeId = themeId || shop?.layout_config?.theme || 'emerald';
  const theme = getTheme(effectiveThemeId);

  const tierInfo = calculateWholesaleTier(product, quantity, shop);
  const { config } = tierInfo;
  const t1 = config.tier1;
  const t2 = config.tier2;
  const t3 = config.tier3;

  return (
    <div className="rounded-3xl bg-slate-50 dark:bg-gradient-to-b dark:from-[#0e172e] dark:via-[#0c1527] dark:to-[#080d1a] border border-slate-200 dark:border-slate-800/90 p-4 sm:p-5 shadow-xl relative overflow-hidden group transition-colors">
      
      {/* Halo lumineux de fond selon le thème de la boutique */}
      <div 
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-15 dark:opacity-20 pointer-events-none"
        style={{ backgroundColor: theme.hex }}
      />

      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 mb-3.5 relative z-10">
        <div className="flex items-center gap-2">
          <span 
            className="w-2.5 h-2.5 rounded-full animate-pulse shadow-sm shrink-0"
            style={{ backgroundColor: theme.hex }}
          />
          <h4 className="font-black text-slate-900 dark:text-white text-xs sm:text-sm tracking-tight flex items-center gap-1.5">
            <Sliders className={`w-3.5 h-3.5 ${theme.accentColor}`} />
            <span>TARIFS GROSSISTE DÉGRESSIFS (MOQ)</span>
          </h4>
        </div>

        <span className={`text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full border shrink-0 ${theme.badge}`}>
          {tierInfo.tierLabel}
        </span>
      </div>

      {/* Dynamic Animated Progress Bar */}
      <div className="mb-2 relative z-10">
        <div className="h-2 w-full bg-slate-200 dark:bg-slate-950 rounded-full border border-slate-300 dark:border-slate-800 overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${theme.gradient} transition-all duration-500 shadow-sm`}
            style={{ width: `${Math.max(8, tierInfo.progressPercent)}%` }}
          />
        </div>
      </div>

      {/* Progress Message Row */}
      <div className="flex items-center justify-between text-xs mb-4 text-slate-600 dark:text-slate-300 relative z-10">
        <div className="text-[11px] sm:text-xs">
          {tierInfo.activeTier === 3 ? (
            <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>Tarif VIP Grossiste Maximal Débloqué (-{t3.discountPercent || 30}%)</span>
            </span>
          ) : (
            <span>
              Ajoutez <strong className="text-amber-600 dark:text-amber-400 font-black">{tierInfo.neededQtyForNextTier} article{tierInfo.neededQtyForNextTier > 1 ? 's' : ''}</strong> pour débloquer <strong className={`font-black ${theme.accentColor}`}>-{tierInfo.nextTierDiscount}% Grossiste</strong>
            </span>
          )}
        </div>

        <span className="font-mono text-xs font-extrabold text-slate-500 dark:text-slate-400 shrink-0">
          {quantity} pc{quantity > 1 ? 's' : ''}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-slate-200 dark:bg-slate-800/80 mb-3.5" />

      {/* 3 Tier Selection Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 relative z-10">
        
        {/* Tier 1 : Détail */}
        <button
          type="button"
          onClick={() => onSelectQuantity?.(t1.minQty)}
          className={`p-2.5 sm:p-3 rounded-2xl text-center transition-all duration-300 flex flex-col items-center justify-between cursor-pointer ${
            tierInfo.activeTier === 1
              ? 'bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-500 shadow-md ring-2 ring-blue-500/20 scale-[1.02]'
              : 'bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
          }`}
        >
          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
            {t1.minQty} - {t1.maxQty || 4} PCS
          </span>
          <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white my-1">
            {t1.label || 'Détail'}
          </span>
          <span className="text-[11px] sm:text-xs font-extrabold text-slate-700 dark:text-slate-300">
            {tierInfo.tier1Price.toLocaleString('fr-FR')} <span className="text-[9px] font-normal text-slate-400">FCFA</span>
          </span>
        </button>

        {/* Tier 2 : Gros (aux couleurs du thème) */}
        <button
          type="button"
          onClick={() => onSelectQuantity?.(t2.minQty)}
          className={`p-2.5 sm:p-3 rounded-2xl text-center transition-all duration-300 flex flex-col items-center justify-between cursor-pointer ${
            tierInfo.activeTier === 2
              ? `bg-white dark:bg-slate-950/90 border-2 shadow-md scale-[1.02] ring-2 ring-current`
              : 'bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
          }`}
          style={tierInfo.activeTier === 2 ? { borderColor: theme.hex, color: theme.hex } : {}}
        >
          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
            {t2.minQty} - {t2.maxQty || 19} PCS
          </span>
          <span className={`text-xs sm:text-sm font-black my-1 ${theme.accentColor}`}>
            Gros (-{t2.discountPercent || 15}%)
          </span>
          <span className="text-[11px] sm:text-xs font-extrabold text-slate-900 dark:text-white">
            {tierInfo.tier2Price.toLocaleString('fr-FR')} <span className="text-[9px] font-normal text-slate-400">FCFA</span>
          </span>
        </button>

        {/* Tier 3 : VIP Grossiste */}
        <button
          type="button"
          onClick={() => onSelectQuantity?.(t3.minQty)}
          className={`p-2.5 sm:p-3 rounded-2xl text-center transition-all duration-300 flex flex-col items-center justify-between cursor-pointer ${
            tierInfo.activeTier === 3
              ? 'bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-500 shadow-md ring-2 ring-amber-500/20 scale-[1.02]'
              : 'bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:border-amber-400'
          }`}
        >
          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
            {t3.minQty}+ PCS
          </span>
          <span className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400 my-1">
            VIP (-{t3.discountPercent || 30}%)
          </span>
          <span className="text-[11px] sm:text-xs font-extrabold text-slate-900 dark:text-white">
            {tierInfo.tier3Price.toLocaleString('fr-FR')} <span className="text-[9px] font-normal text-slate-400">FCFA</span>
          </span>
        </button>

      </div>

      {/* Savings highlight badge if wholesale tier unlocked */}
      {tierInfo.savings > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-xs">
          <span className={`font-bold flex items-center gap-1 ${theme.accentColor}`}>
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Remise Grossiste appliquée</span>
          </span>
          <span className="font-extrabold text-slate-900 dark:text-white">
            Économie : <strong className={theme.accentColor}>-{tierInfo.savings.toLocaleString('fr-FR')} FCFA</strong>
          </span>
        </div>
      )}

    </div>
  );
}
