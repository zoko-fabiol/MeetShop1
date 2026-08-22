import React from 'react';
import { Sparkles, ShoppingBag, Smartphone, Home, Package } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'Toutes les catégories', icon: Sparkles },
  { id: 'alimentation', name: 'Alimentation & Supermarché', icon: ShoppingBag },
  { id: 'electronique', name: 'Électronique & High-Tech', icon: Smartphone },
  { id: 'maison', name: 'Maison & Électroménager', icon: Home },
  { id: 'divers', name: 'Divers & Accessoires', icon: Package }
];

export default function CategoryFilter({ selectedCategory, onSelectCategory }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const Icon = cat.icon;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 shadow-sm ${
                isSelected
                  ? 'bg-green-600 text-white shadow-md shadow-green-600/20 scale-105'
                  : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
