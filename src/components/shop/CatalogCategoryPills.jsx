import React from 'react';
import { 
  Layers, 
  Sparkles, 
  Shirt, 
  Smartphone, 
  Watch, 
  Heart, 
  ShoppingBag, 
  Tag, 
  Zap, 
  Flame,
  LayoutGrid,
  Cpu,
  HardDrive,
  Tv,
  Headphones,
  Laptop,
  Home,
  Utensils,
  Camera,
  Glasses,
  Gem,
  Scissors
} from 'lucide-react';
import { getTheme } from '../../config/themes';

const CATEGORY_ICONS = {
  'tous': LayoutGrid,
  'all': LayoutGrid,
  'vetements': Shirt,
  'dresses': Shirt,
  'robes': Shirt,
  'hoodies': Shirt,
  'vests': Shirt,
  'sweatshirts': Shirt,
  't-shirts': Shirt,
  'mode': Shirt,
  'chaussures': ShoppingBag,
  'sacs': ShoppingBag,
  'electronique': Smartphone,
  'smartphones': Smartphone,
  'cameras': Camera,
  'accessoires': Watch,
  'montres': Watch,
  'bijoux': Gem,
  'beaute': Heart,
  'cosmetiques': Scissors,
  'cases': HardDrive,
  'graphics': Cpu,
  'processors': Cpu,
  'hdd': HardDrive,
  'cooling': Zap,
  'desks': Home,
  'chairs': Home,
  'cabinets': Home,
  'lamps': Sparkles,
  'maison': Home,
  'meubles': Home,
  'offres': Zap,
  'promotions': Flame
};

export default function CatalogCategoryPills({
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
  productsCountByCategory = {},
  totalProductsCount = 0,
  themeId = 'emerald',
  variant = 'pills' // 'pills' | 'fashion_tiles' | 'hardware_icons' | 'minimal_tags'
}) {
  const theme = getTheme(themeId);

  const getCategoryIcon = (cat) => {
    if (!cat || cat === 'all') return LayoutGrid;
    const clean = cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    for (const [key, IconComp] of Object.entries(CATEGORY_ICONS)) {
      if (clean.includes(key)) return IconComp;
    }
    return Tag;
  };

  // 1. VARIANT: TUILES VISUELLES DE MODE (Style Odoo Clothes & Fashion)
  if (variant === 'fashion_tiles') {
    return (
      <div className="w-full pb-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-3 min-w-max py-2">
          
          {/* Tuile Tous */}
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`w-28 sm:w-32 p-3 sm:p-4 rounded-3xl border text-center flex flex-col items-center justify-between gap-2 transition-all cursor-pointer select-none group ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xl scale-105 ring-2 ring-emerald-500/50'
                : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 hover:shadow-md'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
              selectedCategory === 'all' 
                ? 'bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-900' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              <LayoutGrid className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xs block truncate">Tous</span>
              <span className="text-[10px] opacity-70 font-semibold">{totalProductsCount} articles</span>
            </div>
          </button>

          {/* Tuiles par catégorie */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = productsCountByCategory[cat] || 0;
            const Icon = getCategoryIcon(cat);

            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`w-28 sm:w-32 p-3 sm:p-4 rounded-3xl border text-center flex flex-col items-center justify-between gap-2 transition-all cursor-pointer select-none group ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xl scale-105 ring-2 ring-emerald-500/50'
                    : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 hover:shadow-md'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isSelected 
                    ? 'bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-900' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="w-full">
                  <span className="font-extrabold text-xs block truncate">{cat}</span>
                  <span className="text-[10px] opacity-70 font-semibold">{count} articles</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. VARIANT: GRILLE D'ICÔNES HARDWARE & PIÈCES (Style Odoo PC Components)
  if (variant === 'hardware_icons') {
    return (
      <div className="w-full pb-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-max py-2">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`px-3.5 py-2 rounded-2xl border text-xs font-black flex items-center gap-2 transition-all cursor-pointer select-none ${
              selectedCategory === 'all'
                ? `${theme.badge} ring-2 ring-emerald-500/30 shadow-md scale-105`
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4 text-emerald-500" />
            <span>Tous les composants ({totalProductsCount})</span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = productsCountByCategory[cat] || 0;
            const Icon = getCategoryIcon(cat);

            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-2 rounded-2xl border text-xs font-black flex items-center gap-2 transition-all cursor-pointer select-none ${
                  isSelected
                    ? `${theme.badge} ring-2 ring-emerald-500/30 shadow-md scale-105`
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat}</span>
                <span className="text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. VARIANT: CAPSULES STANDARDS HORIZONTALES (Pills)
  return (
    <div className="w-full pb-2 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 sm:gap-3 min-w-max py-1">
        
        {/* Pilule "Tous les produits" */}
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer select-none ${
            selectedCategory === 'all'
              ? `${theme.badge} ring-2 ring-emerald-500/30 shadow-md scale-105`
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Tous les Articles</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            selectedCategory === 'all'
              ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          }`}>
            {totalProductsCount}
          </span>
        </button>

        {/* Pilules des Catégories Spécifiques */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = productsCountByCategory[cat] || 0;
          const Icon = getCategoryIcon(cat);

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer select-none ${
                isSelected
                  ? `${theme.badge} ring-2 ring-emerald-500/30 shadow-md scale-105`
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                isSelected
                  ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}

      </div>
    </div>
  );
}
