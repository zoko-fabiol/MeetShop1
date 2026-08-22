import React from 'react';
import { ShoppingBag, Eye, Store, MapPin, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onSelectProduct }) {
  const { addToCart, liteMode } = useCart();

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-green-500/50 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-green-500/10 cursor-pointer transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Image du produit */}
        <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
          {!liteMode ? (
            <img
              src={product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
              alt={product.name}
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 p-4 text-center">
              <Zap className="w-6 h-6 text-amber-500 mb-1" />
              <span className="text-[11px] font-semibold text-slate-900 dark:text-white truncate max-w-full">{product.name}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">(Mode Lite éco data)</span>
            </div>
          )}

          <div className="absolute top-2.5 left-2.5">
            <span className="px-2.5 py-1 rounded-xl bg-white/90 dark:bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-green-600 dark:text-green-400 border border-green-500/30 shadow-sm">
              En Stock
            </span>
          </div>

          <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectProduct(product);
              }}
              className="p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-white hover:text-green-600 dark:hover:text-green-400 border border-slate-200 dark:border-slate-700 shadow-md backdrop-blur-sm"
              title="Aperçu rapide"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Détails du produit */}
        <div className="p-4">
          
          {/* Nom boutique & Ville */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <div className="flex items-center gap-1 truncate">
              <Store className="w-3 h-3 text-green-600 dark:text-green-400 shrink-0" />
              <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{product.shopName}</span>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0">{product.shopCity}</span>
          </div>

          {/* Nom article */}
          <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
            {product.name}
          </h4>

          {/* Description courte */}
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
            {product.description}
          </p>
        </div>
      </div>

      {/* Footer carte : Prix & Bouton Ajout */}
      <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-semibold">Prix local</span>
          <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">
            {product.price.toLocaleString('fr-FR')} <span className="text-xs font-semibold text-green-600 dark:text-green-400">FCFA</span>
          </span>
        </div>

        <button
          onClick={handleQuickAdd}
          className="p-2.5 sm:px-3 sm:py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-green-600/20 active:scale-95 transition-all"
          title="Ajouter au panier"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="hidden sm:inline">Ajouter</span>
        </button>
      </div>

    </div>
  );
}
