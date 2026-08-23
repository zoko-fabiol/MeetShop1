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
  Edit3,
  Trash2,
  Sliders,
  Wand2,
  RefreshCw,
  AlertTriangle,
  PackageCheck,
  ShieldCheck
} from 'lucide-react';
import { getTheme } from '../../config/themes';
import { useCart } from '../../context/CartContext';
import { getDesignVariant } from '../../config/blockDesignStyles';
import { getCustomColorStyle } from '../../config/colorTokens';
import { ODOO_SHOP_TEMPLATES } from '../../config/shopBlocks';
import { syncCatalogDesignWithShopTheme } from '../../services/mistralAiService';
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
  isMobilePreview = false,
  onSelectProduct,
  onOpenWhatsApp,
  onAddProduct,
  onDeleteProduct,
  initialCategory = 'all',
  templateOverride = null,
  onUpdateTemplate = null,
  onUpdateCatalogConfig = null
}) {
  const theme = getTheme(themeId);
  const { addToCart, items: cartItems } = useCart();
  const dv = getDesignVariant(designVariant || shop?.layout_config?.designVariant || 'modern_minimal');

  // Configuration personnalisée du catalogue (sauvegardée dans layout_config.catalog_config)
  const savedCatalogConfig = shop?.layout_config?.catalog_config || {};
  const [catalogCardStyle, setCatalogCardStyle] = useState(savedCatalogConfig.cardStyle || 'modern');
  const [isAiSyncing, setIsAiSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Modal d'insertion & édition de produit
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // States de recherche & filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price_asc' | 'price_desc' | 'newest' | 'discount'
  const [layoutMode, setLayoutMode] = useState(savedCatalogConfig.layoutGrid || 'grid_3'); // 'grid_4' | 'grid_3' | 'list'
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyOnSale, setOnlyOnSale] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [addedProductId, setAddedProductId] = useState(null);
  const [wishlist, setWishlist] = useState({});

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

  const toggleWishlist = (productId, e) => {
    e?.stopPropagation();
    if (isEditMode) return;
    setWishlist(prev => ({ ...prev, [productId]: !prev[productId] }));
  };

  // Synchronisation intelligente du design du catalogue via l'IA
  const handleSyncDesignWithAi = async () => {
    setIsAiSyncing(true);
    try {
      const syncedStyles = await syncCatalogDesignWithShopTheme({ shop, currentLayout: shop?.layout_config });
      if (syncedStyles.cardStyle) {
        setCatalogCardStyle(syncedStyles.cardStyle);
      }
      if (syncedStyles.layoutGrid) {
        setLayoutMode(syncedStyles.layoutGrid);
      }
      onUpdateCatalogConfig?.({
        cardStyle: syncedStyles.cardStyle,
        layoutGrid: syncedStyles.layoutGrid,
        synced_at: new Date().toISOString()
      });
      setToastMessage('✨ Design du catalogue harmonisé avec succès avec votre vitrine !');
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      console.warn('Erreur synchronisation IA catalogue:', err);
    } finally {
      setIsAiSyncing(false);
    }
  };

  // Modification du style de cartes
  const handleCardStyleChange = (styleKey) => {
    setCatalogCardStyle(styleKey);
    onUpdateCatalogConfig?.({
      cardStyle: styleKey,
      layoutGrid: layoutMode,
      updated_at: new Date().toISOString()
    });
  };

  // Basculement rapide du stock d'un produit (En stock <-> Rupture)
  const handleToggleStockDirectly = async (product, e) => {
    e?.stopPropagation();
    const currentStock = Number(product.stock) || 0;
    const newStock = currentStock > 0 ? 0 : 10;
    const updatedProd = {
      ...product,
      stock: newStock,
      is_available: newStock > 0
    };
    await onAddProduct?.(updatedProd);
    setToastMessage(`Stock de "${product.name}" mis à jour : ${newStock > 0 ? 'En stock' : 'Rupture de stock'}`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Clic sur l'édition d'un produit
  const handleEditProductClick = (product, e) => {
    e?.stopPropagation();
    setEditingProduct(product);
    setIsAddProductOpen(true);
  };

  // Confirmation de suppression
  const handleDeleteProductClick = (product, e) => {
    e?.stopPropagation();
    setProductToDelete(product);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await onDeleteProduct?.(productToDelete.id);
      setToastMessage(`Produit "${productToDelete.name}" supprimé.`);
      setTimeout(() => setToastMessage(''), 3500);
    } catch (e) {
      console.error(e);
    } finally {
      setProductToDelete(null);
    }
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

  const handlePriceRangeChange = (newRange) => {
    setUserSelectedMaxPrice(newRange ? newRange[1] : null);
  };

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
    <div className={`w-full ${isMobilePreview ? 'pb-8 max-w-full overflow-x-hidden' : 'min-h-screen pb-20'} transition-all duration-300 ${dv.containerClass || 'bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white'}`}>
      
      {/* Toast de Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-black shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          EN-TÊTE DE LA BOUTIQUE (HARMONISÉ AVEC LE THÈME)
         ═══════════════════════════════════════════════════════ */}
      <div className={`${isMobilePreview ? 'w-full px-1.5 pt-2 space-y-3 max-w-full overflow-hidden' : 'max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6'}`}>
        
        {/* Barre Supérieure Boutique */}
        <div className={`${isMobilePreview ? 'p-3 rounded-2xl' : 'p-5 sm:p-7 rounded-3xl'} transition-all shadow-sm ${dv.cardInnerClass || 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}`}>
          <div className="flex flex-col items-start justify-between gap-3">
            <div className="w-full">
              <div className="flex items-center gap-2">
                <span className={`p-1.5 rounded-xl shrink-0 ${dv.accentBadgeClass || theme.badge}`}>
                  <Store className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <h1 className={`${isMobilePreview ? 'text-base leading-tight' : 'text-xl sm:text-3xl'} font-black tracking-tight truncate ${dv.headerClass || 'text-slate-900 dark:text-white'}`}>
                    Catalogue de {shop?.name}
                  </h1>
                  <p className={`text-[11px] ${dv.subTextClass || 'text-slate-500 dark:text-slate-400'} truncate`}>
                    {shopProducts.length} article{shopProducts.length > 1 ? 's' : ''} disponible{shopProducts.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Bouton d'ajout de produit rapide */}
            {(isOwner || isEditMode) && (
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setIsAddProductOpen(true);
                }}
                className={`w-full ${isMobilePreview ? 'py-2 px-3 text-[11px]' : 'sm:w-auto px-5 py-3 text-xs'} rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30 cursor-pointer transition-all active:scale-95 shrink-0`}
                title="Ajouter un nouveau produit directement dans cette boutique"
              >
                <PackagePlus className="w-3.5 h-3.5" />
                <span>+ Ajouter un Produit</span>
              </button>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            BANDEAU VISUEL DE CATÉGORIES
           ═══════════════════════════════════════════════════════ */}
        {categories.length > 0 && (
          <div className="space-y-2 max-w-full overflow-hidden">
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
        <div className={`grid grid-cols-1 ${isMobilePreview ? 'gap-3' : 'lg:grid-cols-12 gap-6'} items-start`}>
          
          {/* SIDEBAR DE FILTRES (Desktop uniquement hors mobile preview) */}
          {!isMobilePreview && (
            <aside className="hidden lg:block lg:col-span-3 sticky top-4">
              <CatalogFilterSidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                priceRange={priceRange}
                onPriceRangeChange={handlePriceRangeChange}
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
          )}

          {/* MAIN CONTENT AREA */}
          <section className={`${isMobilePreview ? 'w-full space-y-2.5 max-w-full overflow-hidden' : 'lg:col-span-9 space-y-4'}`}>
            
            {/* Barre de Recherche, Tri & Switcher de Vue Odoo */}
            <div className={`${isMobilePreview ? 'p-2.5 rounded-2xl flex-col gap-2' : 'p-3 sm:p-4 rounded-3xl flex-col sm:flex-row gap-3'} shadow-sm flex items-stretch sm:items-center justify-between ${dv.cardInnerClass || 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}`}>
              
              {/* Recherche intégrée */}
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-current/15 text-xs text-current placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-semibold"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-current"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Actions Droite: Tri & Vue */}
              <div className="flex items-center gap-1.5 justify-between">
                
                {/* Bouton Filtres Mobile */}
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 text-current font-bold text-[11px] flex items-center gap-1 shrink-0"
                >
                  <SlidersHorizontal className="w-3 h-3 text-emerald-500" />
                  <span>Filtres</span>
                </button>

                {/* Dropdown de Tri */}
                <div className="relative flex-1 min-w-0">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none pl-2.5 pr-6 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-current/15 text-[11px] font-bold text-current focus:outline-none cursor-pointer truncate"
                  >
                    <option value="featured">Recommandés</option>
                    <option value="price_asc">Prix croissant</option>
                    <option value="price_desc">Prix décroissant</option>
                    <option value="newest">Nouveautés</option>
                    <option value="discount">Remises</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
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
              <div className={`grid gap-2.5 sm:gap-4 ${
                layoutMode === 'list'
                  ? 'grid-cols-1'
                  : isMobilePreview
                    ? 'grid-cols-2'
                    : layoutMode === 'grid_4'
                      ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4'
                      : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3'
              }`}>
                
                {/* Carte Rapide Ajouter un Produit (Style Odoo) */}
                {(isOwner || isEditMode) && (
                  <div
                    onClick={() => {
                      setEditingProduct(null);
                      setIsAddProductOpen(true);
                    }}
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
                  const inStock = Number(prod.stock) > 0;

                  // Classes de style de carte dynamique
                  let cardStyleClass = dv.cardInnerClass || 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white';
                  if (catalogCardStyle === 'neo_brutalist') {
                    cardStyleClass = 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-950 dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.9)] hover:translate-x-[-2px] hover:translate-y-[-2px]';
                  } else if (catalogCardStyle === 'glassmorphism') {
                    cardStyleClass = 'backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 border border-white/40 dark:border-white/10 text-slate-900 dark:text-white shadow-lg hover:shadow-2xl';
                  } else if (catalogCardStyle === 'luxury') {
                    cardStyleClass = 'bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white border border-amber-500/30 shadow-2xl hover:border-amber-400';
                  } else if (catalogCardStyle === 'compact') {
                    cardStyleClass = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm';
                  }

                  return (
                    <div
                      key={prod.id}
                      onClick={() => {
                        if (isEditMode) return;
                        onSelectProduct?.(prod);
                      }}
                      className={`group/card rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${cardStyleClass}`}
                    >
                      {/* 🌟 ACTION BAR COMMERÇANT EN MODE ÉDITION */}
                      {(isOwner || isEditMode) && (
                        <div className="absolute top-2.5 right-2.5 z-30 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2 py-1.5 rounded-2xl shadow-xl border border-slate-700/80">
                          <button
                            type="button"
                            onClick={(e) => handleEditProductClick(prod, e)}
                            className="p-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white transition-all cursor-pointer hover:scale-105"
                            title="Modifier cet article (Nom, Prix, Photos...)"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteProductClick(prod, e)}
                            className="p-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white transition-all cursor-pointer hover:scale-105"
                            title="Supprimer définitivement cet article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

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

                        {/* Wishlist Toggle (En mode visiteur) */}
                        {!isEditMode && !isOwner && (
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
                        )}
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

                            {/* Stock badge avec basculement en 1 clic pour le propriétaire */}
                            <button
                              type="button"
                              onClick={(e) => {
                                if (isOwner || isEditMode) {
                                  handleToggleStockDirectly(prod, e);
                                }
                              }}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
                                inStock
                                  ? 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20'
                                  : 'text-rose-500 bg-rose-500/10 border border-rose-500/20'
                              } ${isOwner || isEditMode ? 'hover:scale-105 cursor-pointer ring-1 ring-transparent hover:ring-current' : ''}`}
                              title={isOwner || isEditMode ? 'Cliquer pour basculer entre En Stock et Rupture' : undefined}
                            >
                              {inStock ? '● En stock' : '○ Rupture'}
                            </button>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1.5 pt-1">
                            {isEditMode || isOwner ? (
                              <button
                                type="button"
                                onClick={(e) => handleEditProductClick(prod, e)}
                                className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Modifier l'article</span>
                              </button>
                            ) : (
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
                            )}

                            {onOpenWhatsApp && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
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
              onPriceRangeChange={handlePriceRangeChange}
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

      {/* ──── MODALE ODOO AJOUT / ÉDITION DE PRODUIT RAPIDE ──── */}
      <OdooQuickProductModal
        isOpen={isAddProductOpen}
        onClose={() => {
          setIsAddProductOpen(false);
          setEditingProduct(null);
        }}
        onAddProduct={onAddProduct}
        initialProduct={editingProduct}
        shop={shop}
        themeId={themeId}
        existingCategories={categories}
      />

      {/* ──── MODALE DE CONFIRMATION DE SUPPRESSION ──── */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  Supprimer ce produit ?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cette action retirera "{productToDelete.name}" de votre boutique.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 flex items-center gap-3 border border-slate-200 dark:border-slate-800">
              <img
                src={productToDelete.image || productToDelete.images?.[0]}
                alt=""
                className="w-12 h-12 rounded-xl object-contain bg-white dark:bg-slate-900 p-1"
              />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{productToDelete.name}</p>
                <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">{Number(productToDelete.price).toLocaleString('fr-FR')} FCFA</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-md shadow-rose-600/30 transition-all cursor-pointer"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
