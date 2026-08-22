import React, { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Grid3X3, 
  Grid2X2, 
  LayoutList, 
  ShoppingBag, 
  MessageSquare, 
  Plus, 
  Minus, 
  Check, 
  Heart, 
  Sparkles, 
  Flame, 
  Percent, 
  ArrowUpDown, 
  ChevronDown,
  X,
  Store,
  Layers,
  ArrowRight,
  ChevronRight,
  Eye,
  Shirt,
  Home,
  Zap,
  Smartphone,
  Cpu,
  Palette,
  CheckCircle2,
  PackagePlus,
  Edit3
} from 'lucide-react';
import { getTheme } from '../../config/themes';
import { useCart } from '../../context/CartContext';
import { getDesignVariant } from '../../config/blockDesignStyles';
import { getCustomColorStyle } from '../../config/colorTokens';
import { ODOO_SHOP_TEMPLATES } from '../../config/shopBlocks';
import CatalogCategoryPills from './CatalogCategoryPills';
import CatalogFilterSidebar from './CatalogFilterSidebar';
import OdooQuickProductModal from '../odoo-editor/OdooQuickProductModal';

export default function ShopCatalogPage({
  shop,
  products = [],
  themeId = 'emerald',
  designVariant = null,
  isEditMode = false,
  isOwner = false,
  onSelectProduct,
  onOpenWhatsApp,
  onAddProduct,
  initialCategory = 'all',
  templateOverride = null,
  onUpdateTemplate = null
}) {
  const theme = getTheme(themeId);
  const { addToCart, items: cartItems } = useCart();
  const dv = getDesignVariant(designVariant || shop?.layout_config?.designVariant || 'modern_minimal');

  // Filtrage strict : Ne garder QUE les produits appartenant à cette boutique
  const shopProducts = useMemo(() => {
    if (!shop) return [];
    return (products || []).filter(p => {
      const pShopId = p.shopId || p.shop_id || p.shop?.id;
      const pShopCode = p.shopCode || p.shop_code || p.shop?.code;
      const pShopName = (p.shopName || p.shop_name || p.shop?.name || '').trim().toLowerCase();
      const sId = shop.id;
      const sCode = shop.code;
      const sName = (shop.name || '').trim().toLowerCase();
      const sSellerId = shop.seller_id || shop.owner_uid;

      return (
        (sId && pShopId === sId) ||
        (sCode && pShopCode === sCode) ||
        (sSellerId && (p.vendor_id === sSellerId || p.seller_id === sSellerId)) ||
        (sName && pShopName === sName)
      );
    });
  }, [products, shop]);

  // Active Odoo Shop Template
  const activeTemplateId = templateOverride || shop?.layout_config?.shop_template || 'odoo_fashion';
  const [currentTemplate, setCurrentTemplate] = useState(activeTemplateId);

  // Modal d'insertion rapide de produit style Odoo
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price_asc' | 'price_desc' | 'newest' | 'discount'
  const [layoutMode, setLayoutMode] = useState('grid_3'); // 'grid_4' | 'grid_3' | 'list'
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyOnSale, setOnlyOnSale] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [addedProductId, setAddedProductId] = useState(null);
  const [wishlist, setWishlist] = useState({});

  const toggleWishlist = (productId, e) => {
    e?.stopPropagation();
    if (isEditMode) return;
    setWishlist(prev => ({ ...prev, [productId]: !prev[productId] }));
  };

  // Extraire les catégories uniques de la boutique
  const { categories, productsCountByCategory, maxPriceLimit } = useMemo(() => {
    const counts = {};
    const catSet = new Set();
    let maxP = 100000;

    shopProducts.forEach(p => {
      const cat = p.category || 'Général';
      catSet.add(cat);
      counts[cat] = (counts[cat] || 0) + 1;

      const price = Number(p.price) || 0;
      if (price > maxP) maxP = price;
    });

    return {
      categories: Array.from(catSet),
      productsCountByCategory: counts,
      maxPriceLimit: maxP > 0 ? maxP : 500000
    };
  }, [shopProducts]);

  // Price range state (curseur utilisateur optionnel)
  const [userSelectedMaxPrice, setUserSelectedMaxPrice] = useState(null);
  const currentMaxPrice = userSelectedMaxPrice !== null ? userSelectedMaxPrice : maxPriceLimit;
  const priceRange = [0, currentMaxPrice];

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return shopProducts.filter(p => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (p.name || '').toLowerCase().includes(q);
        const matchesDesc = (p.description || '').toLowerCase().includes(q);
        const matchesCat = (p.category || '').toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      // Category (Insensible à la casse)
      if (selectedCategory && selectedCategory !== 'all') {
        const pCat = (p.category || '').trim().toLowerCase();
        const sCat = selectedCategory.trim().toLowerCase();
        if (pCat !== sCat && (p.category || '') !== selectedCategory) return false;
      }

      // Price Range (Seulement si l'utilisateur a manipulé le filtre de prix)
      const price = Number(p.price) || 0;
      if (userSelectedMaxPrice !== null && price > userSelectedMaxPrice) return false;

      // In Stock
      if (onlyInStock && p.stock !== undefined && Number(p.stock) <= 0) return false;

      // On Sale
      if (onlyOnSale && (!p.old_price || Number(p.old_price) <= price)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return (Number(a.price) || 0) - (Number(b.price) || 0);
      if (sortBy === 'price_desc') return (Number(b.price) || 0) - (Number(a.price) || 0);
      if (sortBy === 'newest') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      if (sortBy === 'discount') {
        const discA = a.old_price ? (Number(a.old_price) - Number(a.price)) : 0;
        const discB = b.old_price ? (Number(b.old_price) - Number(b.price)) : 0;
        return discB - discA;
      }
      return 0; // 'featured'
    });
  }, [shopProducts, searchQuery, selectedCategory, userSelectedMaxPrice, onlyInStock, onlyOnSale, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setUserSelectedMaxPrice(null);
    setOnlyInStock(false);
    setOnlyOnSale(false);
  };

  const handleAddToCart = (product, e) => {
    e?.stopPropagation();
    if (isEditMode) return; // Garde mode édition
    addToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  return (
    <div className={`w-full min-h-screen pb-20 transition-all duration-300 ${dv.containerClass || 'bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white'}`}>
      
      {/* ═══════════════════════════════════════════════════════
          EN-TÊTE DE LA BOUTIQUE (HARMONISÉ AVEC LE THÈME)
         ═══════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* Barre Supérieure Boutique */}
        <div className={`p-5 sm:p-7 rounded-3xl transition-all shadow-sm ${dv.cardInnerClass || 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className={`p-2 rounded-2xl ${dv.accentBadgeClass || theme.badge}`}>
                  <Store className="w-5 h-5" />
                </span>
                <div>
                  <h1 className={`text-xl sm:text-3xl font-black tracking-tight ${dv.headerClass || 'text-slate-900 dark:text-white'}`}>
                    Catalogue de {shop?.name}
                  </h1>
                  <p className={`text-xs sm:text-sm ${dv.subTextClass || 'text-slate-500 dark:text-slate-400'}`}>
                    {shopProducts.length} article{shopProducts.length > 1 ? 's' : ''} exclusif{shopProducts.length > 1 ? 's' : ''} disponible{shopProducts.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Bouton style Odoo d'ajout de produit rapide */}
            {(isOwner || isEditMode) && (
              <button
                type="button"
                onClick={() => setIsAddProductOpen(true)}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer transition-all hover:scale-105 active:scale-95 shrink-0"
                title="Ajouter un nouveau produit directement dans cette boutique"
              >
                <PackagePlus className="w-4 h-4" />
                <span>+ Ajouter un Produit</span>
              </button>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            BANDEAU VISUEL DE CATÉGORIES
           ═══════════════════════════════════════════════════════ */}
        {categories.length > 0 && (
          <div className="space-y-2">
            <CatalogCategoryPills
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              productsCountByCategory={productsCountByCategory}
              totalProductsCount={shopProducts.length}
              themeId={themeId}
              variant="pills"
            />
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            CORPS DU CATALOGUE (FILTRES + GRILLE PRODUITS)
           ═══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* SIDEBAR DE FILTRES (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-4">
            <CatalogFilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              maxPriceLimit={maxPriceLimit}
              onlyInStock={onlyInStock}
              onToggleInStock={setOnlyInStock}
              onlyOnSale={onlyOnSale}
              onToggleOnSale={setOnlyOnSale}
              productsCountByCategory={productsCountByCategory}
              totalProductsCount={shopProducts.length}
              onResetFilters={handleResetFilters}
              themeId={themeId}
            />
          </aside>

          {/* MAIN CONTENT AREA */}
          <section className="lg:col-span-9 space-y-4">
            
            {/* Barre de Recherche, Tri & Switcher de Vue Odoo */}
            <div className={`p-3 sm:p-4 rounded-3xl shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${dv.cardInnerClass || 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}`}>
              
              {/* Recherche intégrée */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un article de la boutique..."
                  className="w-full pl-9 pr-8 py-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/15 text-xs text-current placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-semibold"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-current"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Actions Droite: Tri & Vue */}
              <div className="flex items-center gap-2 justify-between sm:justify-end">
                
                {/* Bouton Filtres Mobile */}
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden px-3 py-2 rounded-2xl bg-black/5 dark:bg-white/10 text-current font-bold text-xs flex items-center gap-1.5"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Filtres</span>
                </button>

                {/* Dropdown de Tri */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/15 text-xs font-bold text-current focus:outline-none cursor-pointer"
                  >
                    <option value="featured">Mis en avant (Recommandé)</option>
                    <option value="price_asc">Prix : Croissant</option>
                    <option value="price_desc">Prix : Décroissant</option>
                    <option value="newest">Nouveautés récentes</option>
                    <option value="discount">Plus fortes remises</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Sélecteur de grille Odoo */}
                <div className="hidden sm:flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-2xl border border-current/10">
                  <button
                    type="button"
                    onClick={() => setLayoutMode('grid_3')}
                    className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                      layoutMode === 'grid_3'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-400 hover:text-current'
                    }`}
                    title="Grille normale (3 colonnes)"
                  >
                    <Grid2X2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLayoutMode('grid_4')}
                    className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                      layoutMode === 'grid_4'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-400 hover:text-current'
                    }`}
                    title="Grille compacte (4 colonnes)"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLayoutMode('list')}
                    className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                      layoutMode === 'list'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-400 hover:text-current'
                    }`}
                    title="Vue Liste"
                  >
                    <LayoutList className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

            {/* ═══════════════════════════════════════════════════════
                GRILLE DES PRODUITS
               ═══════════════════════════════════════════════════════ */}
            {filteredProducts.length === 0 && !isOwner && !isEditMode ? (
              <div className={`p-12 rounded-3xl text-center space-y-4 shadow-sm ${dv.cardInnerClass || 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}`}>
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-current">Aucun article dans cette sélection</h3>
                  <p className="text-xs opacity-75 mt-1">Modifiez vos filtres ou explorez toutes les catégories.</p>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-black text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Réinitialiser les filtres</span>
                </button>
              </div>
            ) : (
              <div className={`grid gap-3 sm:gap-4 ${
                layoutMode === 'list'
                  ? 'grid-cols-1'
                  : layoutMode === 'grid_4'
                    ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3'
              }`}>
                
                {/* Carte Rapide Ajouter un Produit (Style Odoo) */}
                {(isOwner || isEditMode) && (
                  <div
                    onClick={() => setIsAddProductOpen(true)}
                    className={`group/add cursor-pointer rounded-3xl border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 p-6 flex flex-col items-center justify-center text-center transition-all min-h-[260px] shadow-sm hover:shadow-lg`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-3 group-hover/add:scale-110 transition-transform">
                      <Plus className="w-7 h-7" />
                    </div>
                    <h3 className="font-black text-sm text-emerald-400 mb-1">
                      + Ajouter un Produit
                    </h3>
                    <p className="text-[11px] text-slate-400 max-w-[160px]">
                      Insertion instantanée dans {shop?.name}
                    </p>
                  </div>
                )}

                {filteredProducts.map((prod) => {
                  const isWishlisted = Boolean(wishlist[prod.id]);
                  const discountPercent = prod.old_price && Number(prod.old_price) > Number(prod.price)
                    ? Math.round(((Number(prod.old_price) - Number(prod.price)) / Number(prod.old_price)) * 100)
                    : null;
                  const isJustAdded = addedProductId === prod.id;

                  return (
                    <div
                      key={prod.id}
                      onClick={() => {
                        if (isEditMode) return;
                        onSelectProduct?.(prod);
                      }}
                      className={`group/card rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative ${dv.cardInnerClass || 'bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'}`}
                    >
                      {/* Image container */}
                      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-3">
                        <img
                          src={prod.image || prod.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
                          alt={prod.name}
                          className="w-full h-full object-contain group-hover/card:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />

                        {/* Badges Promo & Nouveauté */}
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                          {discountPercent && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-md">
                              -{discountPercent}%
                            </span>
                          )}
                          {(prod.isNew || prod.is_new) && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white shadow-md">
                              Nouveau
                            </span>
                          )}
                        </div>

                        {/* Wishlist Toggle */}
                        <button
                          type="button"
                          onClick={(e) => toggleWishlist(prod.id, e)}
                          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-90 ${
                            isWishlisted
                              ? 'bg-rose-500 text-white'
                              : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-400 hover:text-rose-500'
                          }`}
                          title="Ajouter aux favoris"
                        >
                          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Content details */}
                      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase tracking-wider font-extrabold opacity-60 truncate block">
                            {prod.category || 'Général'}
                          </span>
                          <h3 className="font-extrabold text-xs sm:text-sm text-current line-clamp-2 leading-snug">
                            {prod.name}
                          </h3>
                        </div>

                        {/* Price & Actions */}
                        <div className="pt-2 border-t border-current/10 space-y-2">
                          <div className="flex items-baseline justify-between gap-1">
                            <div>
                              <span className="font-black text-sm sm:text-base text-current tracking-tight">
                                {Number(prod.price).toLocaleString('fr-FR')} <span className={`text-xs font-bold ${theme.accentColor}`}>FCFA</span>
                              </span>
                              {prod.old_price && (
                                <span className="text-[11px] opacity-60 line-through block">
                                  {Number(prod.old_price).toLocaleString('fr-FR')} FCFA
                                </span>
                              )}
                            </div>

                            {/* Stock badge */}
                            <span className="text-[10px] font-bold text-emerald-500">
                              En stock
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={(e) => handleAddToCart(prod, e)}
                              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer ${
                                isJustAdded
                                  ? 'bg-emerald-500 text-slate-950 font-black'
                                  : `${dv.buttonClass || theme.btnPrimary}`
                              }`}
                            >
                              {isJustAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Ajouté !</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                  <span>Ajouter</span>
                                </>
                              )}
                            </button>

                            {onOpenWhatsApp && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isEditMode) return;
                                  onOpenWhatsApp(prod);
                                }}
                                className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-all cursor-pointer shrink-0"
                                title="Commander directement sur WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </section>

        </div>

      </div>

      {/* ──── TIROIR DE FILTRES MOBILE ──── */}
      {isMobileFilterOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm lg:hidden flex justify-end animate-fadeIn"
          onClick={() => setIsMobileFilterOpen(false)}
        >
          <div 
            className="w-full max-w-xs h-full bg-[#16181D] border-l border-slate-800 p-5 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <span className="font-black text-sm text-white">Filtres du Catalogue</span>
              <button 
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <CatalogFilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setIsMobileFilterOpen(false);
              }}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              maxPriceLimit={maxPriceLimit}
              onlyInStock={onlyInStock}
              onToggleInStock={setOnlyInStock}
              onlyOnSale={onlyOnSale}
              onToggleOnSale={setOnlyOnSale}
              productsCountByCategory={productsCountByCategory}
              totalProductsCount={shopProducts.length}
              onResetFilters={handleResetFilters}
              themeId={themeId}
            />
          </div>
        </div>
      )}

      {/* ──── MODALE ODOO AJOUT PRODUIT RAPIDE ──── */}
      <OdooQuickProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddProduct={onAddProduct}
        shop={shop}
        themeId={themeId}
        existingCategories={categories}
      />

    </div>
  );
}
