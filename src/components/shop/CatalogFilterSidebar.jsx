import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  Check, 
  Tag, 
  CheckCircle2, 
  SlidersHorizontal, 
  Percent, 
  PackageCheck,
  ChevronRight,
  X
} from 'lucide-react';
import { getTheme } from '../../config/themes';

export default function CatalogFilterSidebar({
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
  priceRange = [0, 500000],
  maxPriceLimit = 500000,
  onPriceChange,
  onlyInStock = false,
  onToggleInStock,
  onlyOnSale = false,
  onToggleOnSale,
  onResetFilters,
  productsCountByCategory = {},
  totalProductsCount = 0,
  themeId = 'emerald',
  isMobileDrawer = false,
  onCloseMobileDrawer
}) {
  const theme = getTheme(themeId);

  const hasActiveFilters = 
    selectedCategory !== 'all' || 
    onlyInStock || 
    onlyOnSale || 
    priceRange[1] < maxPriceLimit || 
    priceRange[0] > 0;

  const content = (
    <div className="space-y-6">
      
      {/* En-tête des Filtres */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl border ${theme.badge}`}>
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Filtres du Catalogue
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              {totalProductsCount} articles référencés
            </span>
          </div>
        </div>

        {isMobileDrawer && (
          <button
            type="button"
            onClick={onCloseMobileDrawer}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 1. Filtre par Catégorie */}
      <div className="space-y-2.5">
        <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block">
          Catégories
        </label>
        
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
              selectedCategory === 'all'
                ? `${theme.badge} ring-1 ring-emerald-500/30`
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <span>Toutes les catégories</span>
            <span className="text-[10px] font-extrabold opacity-70">
              {totalProductsCount}
            </span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = productsCountByCategory[cat] || 0;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                  isSelected
                    ? `${theme.badge} ring-1 ring-emerald-500/30`
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <span className="truncate text-left">{cat}</span>
                <span className="text-[10px] font-extrabold opacity-70 shrink-0 ml-2">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Filtre de Prix Max (Curseur interactif) */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Budget Max
          </label>
          <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
            {Number(priceRange[1]).toLocaleString('fr-FR')} FCFA
          </span>
        </div>

        <input
          type="range"
          min="1000"
          max={maxPriceLimit > 0 ? maxPriceLimit : 500000}
          step="500"
          value={priceRange[1]}
          onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
          className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />

        <div className="flex justify-between text-[10px] font-bold text-slate-400">
          <span>0 FCFA</span>
          <span>{Number(maxPriceLimit).toLocaleString('fr-FR')} FCFA</span>
        </div>
      </div>

      {/* 3. Filtres de Disponibilité & Promotions */}
      <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
        <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
          Disponibilité & Offres
        </label>

        {/* En Stock Uniquement */}
        <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              En stock uniquement
            </span>
          </div>
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={(e) => onToggleInStock(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
          />
        </label>

        {/* En Promotion */}
        <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Articles en promotion
            </span>
          </div>
          <input
            type="checkbox"
            checked={onlyOnSale}
            onChange={(e) => onToggleOnSale(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
          />
        </label>
      </div>

      {/* 4. Bouton de Réinitialisation */}
      {hasActiveFilters && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onResetFilters}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser les filtres</span>
          </button>
        </div>
      )}

    </div>
  );

  if (isMobileDrawer) {
    return (
      <div 
        className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
        onClick={onCloseMobileDrawer}
      >
        <div 
          className="w-full max-w-xs sm:max-w-sm h-full bg-white dark:bg-slate-950 p-5 overflow-y-auto border-l border-slate-200 dark:border-slate-800 shadow-2xl animate-slideLeft"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
          
          <div className="pt-6">
            <button
              type="button"
              onClick={onCloseMobileDrawer}
              className={`w-full py-3 rounded-2xl text-xs font-black shadow-lg ${theme.btnPrimary}`}
            >
              Afficher les résultats ({totalProductsCount})
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-64 shrink-0 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm self-start hidden lg:block sticky top-24">
      {content}
    </aside>
  );
}
