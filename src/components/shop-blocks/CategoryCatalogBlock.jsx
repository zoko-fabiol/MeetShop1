import React, { useState } from 'react';
import { Search, Filter, ShoppingBag, Eye, Sparkles, Layers, X } from 'lucide-react';
import { getTheme } from '../../config/themes';
import { getDesignVariant } from '../../config/blockDesignStyles';
import { useCart } from '../../context/CartContext';
import { getCardClasses, getButtonClasses } from '../../config/blockStyles';

export default function CategoryCatalogBlock({ block, shop, themeId, onSelectProduct, onNavigateToCatalog, products = [], isMobilePreview = false }) {
  const theme = getTheme(themeId);
  const { addToCart, liteMode } = useCart();
  const props = block?.props || {};
  const dv = getDesignVariant(props.designVariant || 'modern_minimal');

  const title = props.title || 'Catalogue de la Boutique';
  const showSearch = props.showSearch !== false;
  const showCategoryPills = props.showCategoryPills !== false;
  const cardStyle = props.cardStyle || 'standard';
  const buttonStyle = props.buttonStyle || 'modern_rounded';

  const cardContainerClass = getCardClasses(cardStyle, theme);
  const buttonClass = getButtonClasses(buttonStyle, theme, 'primary');

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Filtrer les produits de cette boutique
  const shopProducts = (products || []).filter(p => {
    if (!p) return false;
    const pShopId = p.shopId || p.shop_id || p.shop?.id;
    const pShopCode = p.shopCode || p.shop_code || p.shop?.code;
    const pShopName = (p.shopName || p.shop_name || p.shop?.name || '').trim().toLowerCase();
    const sId = shop?.id;
    const sCode = shop?.code;
    const sName = (shop?.name || '').trim().toLowerCase();
    const sSellerId = shop?.seller_id || shop?.owner_uid;

    return Boolean(
      (sId && pShopId === sId) ||
      (sCode && pShopCode === sCode) ||
      (sSellerId && (p.vendor_id === sSellerId || p.seller_id === sSellerId)) ||
      (sName && pShopName === sName)
    );
  });

  // Extraire les catégories uniques présentes dans les produits de la boutique
  const availableCategories = ['all', ...new Set(shopProducts.map(p => p?.category).filter(Boolean))];

  const filteredProducts = shopProducts.filter(p => {
    if (selectedCat !== 'all' && p.category !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = (p.description || '').toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'all': return 'Tous';
      case 'electronique': return 'High-Tech';
      case 'alimentation': return 'Épicerie';
      case 'maison': return 'Maison';
      case 'mode': return 'Mode';
      case 'beaute': return 'Beauté';
      case 'divers': return 'Divers';
      default: return cat;
    }
  };

  return (
    <section className={`p-4 sm:p-6 mb-6 sm:mb-8 transition-all duration-300 ${dv.containerClass}`}>
      {/* Header with Search & Filter */}
      <div className={`flex justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-current/15 ${isMobilePreview ? 'flex-col' : 'flex-col sm:flex-row sm:items-center'}`}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-lg sm:text-2xl font-black tracking-tight ${dv.headerClass}`}>
              {title}
            </h2>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${dv.accentBadgeClass || theme.badge}`}>
              {filteredProducts.length} articles
            </span>
          </div>
          <p className={`text-xs mt-1 opacity-90 ${dv.subTextClass}`}>
            Découvrez tous les articles disponibles en stock chez {shop.name}
          </p>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 opacity-50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher dans la boutique..."
              className={`w-full pl-9 pr-8 py-2 rounded-2xl bg-black/5 dark:bg-white/10 border border-current/20 text-xs text-current placeholder-current/50 focus:outline-none ${theme.inputFocus} transition-all shadow-sm`}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 opacity-50 hover:opacity-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Category Filter Pills */}
      {showCategoryPills && availableCategories.length > 1 && (
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
          <Filter className="w-3.5 h-3.5 opacity-50 shrink-0 ml-1" />
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                selectedCat === cat
                  ? `${dv.buttonClass || theme.btnPrimary} shadow-sm`
                  : 'bg-black/5 dark:bg-white/10 text-current border border-current/20 hover:bg-black/10 dark:hover:bg-white/15'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className={`text-center py-10 sm:py-12 p-5 sm:p-6 ${dv.cardInnerClass || 'bg-slate-100/60 dark:bg-slate-900/40 text-slate-900 dark:text-white rounded-3xl border border-slate-200 dark:border-slate-800/80'}`}>
          <Sparkles className="w-10 h-10 opacity-40 mx-auto mb-2" />
          <h4 className="text-sm font-bold mb-1 text-current">Aucun produit trouvé dans cette sélection</h4>
          <p className="text-xs opacity-75 max-w-sm mx-auto mb-3 text-current">
            Essayez de modifier votre recherche ou réinitialisez le filtre pour voir l'ensemble des articles.
          </p>
          {(search || selectedCat !== 'all') && (
            <button
              onClick={() => { setSearch(''); setSelectedCat('all'); }}
              className={`px-4 py-2 text-xs ${dv.buttonClass || theme.btnPrimary}`}
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      ) : (
        <div className={`grid gap-3 ${isMobilePreview ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => onSelectProduct?.(prod)}
              className={`cursor-pointer overflow-hidden transition-all duration-300 ${dv.cardInnerClass || cardContainerClass}`}
            >
              <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img
                  src={prod.image || prod.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80'}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {prod.isNew && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black uppercase shadow-md">
                    Nouveau
                  </span>
                )}
              </div>

              <div className="p-3 space-y-1.5">
                <h3 className="font-bold text-xs line-clamp-1 text-current">
                  {prod.name}
                </h3>

                <div className="flex items-center justify-between pt-1">
                  <span className="font-black text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
                    {(prod.price || 0).toLocaleString()} FCFA
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(prod);
                    }}
                    className={`p-1.5 rounded-lg ${dv.buttonClass || buttonClass}`}
                    title="Ajouter au panier"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
