import React, { useState } from 'react';
import { 
  X, 
  Plus, 
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
  Award
} from 'lucide-react';
import { AVAILABLE_BLOCKS } from '../../config/shopBlocks';
import { getTheme } from '../../config/themes';

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
  Award
};

export default function AddBlockModal({ isOpen, onClose, onAddBlock, themeId, shop = {} }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (!isOpen) return null;

  const theme = getTheme(themeId);

  const categories = ['all', ...new Set(AVAILABLE_BLOCKS.map(b => b.category))];

  const filteredBlocks = selectedCategory === 'all' 
    ? AVAILABLE_BLOCKS 
    : AVAILABLE_BLOCKS.filter(b => b.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col transition-colors">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-500" />
              <span>Ajouter un Bloc à la Boutique</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Sélectionnez un bloc modulaire pour enrichir votre vitrine {shop.name || ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="px-5 sm:px-6 pt-4 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? `${theme.pillActive} shadow-sm font-black`
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'Tous les blocs' : cat}
            </button>
          ))}
        </div>

        {/* Modal Body: Blocks Grid */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBlocks.map((blockDef) => {
              const Icon = ICON_MAP[blockDef.icon] || Sparkles;
              return (
                <div
                  key={blockDef.type}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between group hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${theme.accentColor} group-hover:scale-105 transition-transform shadow-sm`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-200/80 dark:bg-slate-900 px-2 py-0.5 rounded-md">
                        {blockDef.category}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                      {blockDef.name}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
                      {blockDef.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onAddBlock(blockDef);
                      onClose();
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all ${theme.btnPrimary}`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ajouter ce bloc</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
