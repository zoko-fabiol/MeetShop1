import React, { useState, useEffect } from 'react';
import { 
  X, 
  Layers, 
  Sparkles, 
  Zap, 
  Flame, 
  BookOpen, 
  Clock, 
  Star, 
  MapPin, 
  HelpCircle, 
  MousePointerClick, 
  Type, 
  MessageCircleQuestion,
  LayoutGrid,
  Shirt,
  Award,
  Search,
  ChevronRight,
  GripHorizontal,
  Bot
} from 'lucide-react';
import { AVAILABLE_BLOCKS } from '../../config/shopBlocks';
import { getTheme } from '../../config/themes';
import { getCustomAiBlocks } from '../../services/customBlocksService';

const ICON_MAP = {
  Sparkles,
  Zap,
  Flame,
  Layers,
  BookOpen,
  Clock,
  Star,
  MapPin,
  HelpCircle,
  MousePointerClick,
  Type,
  MessageCircleQuestion,
  LayoutGrid,
  Shirt,
  Award,
  Bot
};

const CATEGORIES = [
  { id: 'all', label: 'Tous' },
  { id: 'Structure', label: 'Structure' },
  { id: 'Vente', label: 'Vente & Offres' },
  { id: 'Engagement', label: 'Devis & Quizz' },
  { id: 'Confiance', label: 'Confiance' },
  { id: 'IA', label: 'Créations IA' }
];

const mapCategory = (type, category = '') => {
  if (type === 'CustomAiBlock') return 'IA';
  if (type === 'HeroBanner' || type === 'RichText' || category.includes('Structure') || category.includes('Identité') || category.includes('Mise en Page')) {
    return 'Structure';
  }
  if (type === 'FlashDeal' || type === 'FeaturedProducts' || type === 'CategoryCatalog' || category.includes('Promotions') || category.includes('Catalogue')) {
    return 'Vente';
  }
  if (type === 'CustomForm' || type === 'CustomCta' || category.includes('Interactif') || category.includes('Devis') || category.includes('Action') || category.includes('Conversion')) {
    return 'Engagement';
  }
  if (type === 'CustomerReviews' || type === 'AboutStory' || type === 'OpeningHours' || type === 'ContactMap' || category.includes('Confiance') || category.includes('Pratiques') || category.includes('Contact')) {
    return 'Confiance';
  }
  return 'Structure';
};

export default function OdooBlocksDrawer({
  onSelectBlockToInsert,
  onDragStartBlock,
  onDragEndBlock,
  themeId,
  shop
}) {
  const theme = getTheme(themeId);
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customAiBlocks, setCustomAiBlocks] = useState([]);

  useEffect(() => {
    setCustomAiBlocks(getCustomAiBlocks());
  }, []);

  // Combiner les blocs standards et les créations de l'IA
  const allBlocks = [
    ...AVAILABLE_BLOCKS.map(b => ({
      ...b,
      groupCat: mapCategory(b.type, b.category)
    })),
    ...customAiBlocks.map(cb => ({
      type: 'CustomAiBlock',
      name: cb.name,
      description: cb.description,
      icon: cb.iconName || 'Sparkles',
      category: 'Inventions IA',
      groupCat: 'IA',
      defaultProps: {
        name: cb.name,
        category: cb.category,
        description: cb.description,
        iconName: cb.iconName,
        structure: cb.structure
      }
    }))
  ];

  const filteredBlocks = allBlocks.filter(b => {
    const matchesCat = selectedCat === 'all' || b.groupCat === selectedCat;
    const matchesSearch = searchQuery.trim() === '' || 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSnippetDragStart = (e, blockDef) => {
    e.dataTransfer.setData('application/meetshop-block', JSON.stringify(blockDef));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStartBlock?.(blockDef);
  };

  const handleSnippetDragEnd = (e) => {
    onDragEndBlock?.();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      
      {/* Search & Categories Tabs */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-2 shrink-0">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un bloc..."
            className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none ${theme.inputFocus}`}
          />
        </div>

        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCat(cat.id)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                selectedCat === cat.id
                  ? `${theme.pillActive} shadow-sm font-black`
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Blocks Palette / Grid */}
      <div className="p-3 overflow-y-auto flex-1 space-y-2">
        {filteredBlocks.map((blockDef, idx) => {
          const Icon = ICON_MAP[blockDef.icon] || Sparkles;
          return (
            <div
              key={`${blockDef.type}-${idx}`}
              draggable="true"
              onDragStart={(e) => handleSnippetDragStart(e, blockDef)}
              onDragEnd={handleSnippetDragEnd}
              onClick={() => onSelectBlockToInsert?.(blockDef)}
              className="p-2.5 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group select-none relative"
            >
              <div className="flex items-start gap-2.5">
                <div className={`p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${theme.accentColor} group-hover:scale-110 transition-transform shrink-0`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                      {blockDef.name}
                    </h4>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-900 text-slate-500 shrink-0">
                      {blockDef.groupCat}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed">
                    {blockDef.description}
                  </p>
                </div>
              </div>

              {/* Petite poignée visuelle au survol */}
              <div className="mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 opacity-60 group-hover:opacity-100 transition-opacity">
                <span className="flex items-center gap-1 font-medium">
                  <GripHorizontal className="w-3 h-3" />
                  <span>Glisser vers la page</span>
                </span>
                <span className="text-emerald-500 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
                  <span>Insérer</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}

        {filteredBlocks.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-400">
            Aucun bloc dans cette catégorie.
          </div>
        )}
      </div>

    </div>
  );
}
