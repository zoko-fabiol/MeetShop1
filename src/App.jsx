import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import FeaturesSlider from './components/FeaturesSlider';
import LiveShops from './components/LiveShops';
import CategoryFilter from './components/CategoryFilter';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import VisualSearchModal from './components/VisualSearchModal';
import ShopCodeModal from './components/ShopCodeModal';
import CartDrawer from './components/CartDrawer';
import CheckoutSummaryModal from './components/CheckoutSummaryModal';
import OrdersModal from './components/OrdersModal';
import UserProfilePage from './components/profile/UserProfilePage';
import VendorDashboard from './components/VendorDashboard';
import ShopStorefront from './components/ShopStorefront';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import { fetchProducts, fetchShops } from './services/productsService';
import { useCart } from './context/CartContext';
import { Sparkles, Store, X, ArrowLeft, Filter } from 'lucide-react';

export default function App() {
  const { liteMode } = useCart();

  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [activeShopFilter, setActiveShopFilter] = useState(null);

  // Page Boutique Modulaire Active
  const [viewingShopStorefront, setViewingShopStorefront] = useState(null);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [isShopCodeOpen, setIsShopCodeOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutSummaryOpen, setIsCheckoutSummaryOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isVendorOpen, setIsVendorOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitRole, setAuthInitRole] = useState('client');
  const [authInitMode, setAuthInitMode] = useState('signin');

  const handleOpenAuthModal = (role = 'client', mode = 'signin') => {
    setAuthInitRole(role);
    setAuthInitMode(mode);
    setIsAuthOpen(true);
  };

  // Navigation helpers avec synchronisation URL Hash & LocalStorage
  const handleOpenShop = useCallback((shop) => {
    if (shop) {
      setViewingShopStorefront(shop);
      const codeOrId = shop.code || shop.id;
      window.location.hash = `shop/${codeOrId}`;
      localStorage.setItem('meetshop_current_view', JSON.stringify({ view: 'shop', id: codeOrId }));
    }
  }, []);

  const handleBackToMarketplace = useCallback(() => {
    setViewingShopStorefront(null);
    window.location.hash = '';
    localStorage.removeItem('meetshop_current_view');
  }, []);

  const handleOpenProduct = useCallback((product) => {
    setSelectedProduct(product);
    if (product) {
      const currentShopId = viewingShopStorefront ? (viewingShopStorefront.code || viewingShopStorefront.id) : null;
      if (currentShopId) {
        window.location.hash = `shop/${currentShopId}/product/${product.id}`;
      } else {
        window.location.hash = `product/${product.id}`;
      }
    }
  }, [viewingShopStorefront]);

  const handleCloseProduct = useCallback(() => {
    setSelectedProduct(null);
    if (viewingShopStorefront) {
      window.location.hash = `shop/${viewingShopStorefront.code || viewingShopStorefront.id}`;
    } else {
      window.location.hash = '';
    }
  }, [viewingShopStorefront]);

  const handleOpenVendor = useCallback(() => {
    setIsVendorOpen(true);
    window.location.hash = 'vendor';
  }, []);

  const handleCloseVendor = useCallback(() => {
    setIsVendorOpen(false);
    if (viewingShopStorefront) {
      window.location.hash = `shop/${viewingShopStorefront.code || viewingShopStorefront.id}`;
    } else {
      window.location.hash = '';
    }
  }, [viewingShopStorefront]);

  // Chargement initial des données
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [prodsData, shopsData] = await Promise.all([
        fetchProducts(),
        fetchShops()
      ]);
      setProducts(prodsData);
      setShops(shopsData);
      setIsLoading(false);

      // Restauration de l'état de la page après actualisation (F5 / Refresh)
      const hash = window.location.hash.replace(/^#/, '');
      let savedView = null;
      try {
        savedView = JSON.parse(localStorage.getItem('meetshop_current_view'));
      } catch (e) {}

      // 1. Vérifier si l'URL contient une boutique (#shop/...)
      if (hash.startsWith('shop/')) {
        const parts = hash.split('/');
        const shopIdentifier = parts[1];
        const targetShop = shopsData.find(
          s => s.code?.toUpperCase() === shopIdentifier?.toUpperCase() || s.id === shopIdentifier
        );
        if (targetShop) {
          setViewingShopStorefront(targetShop);
        }

        // Vérifier si un produit spécifique est ouvert dans cette boutique
        if (parts.length >= 4 && parts[2] === 'product') {
          const prodId = parts[3];
          const targetProd = prodsData.find(p => p.id === prodId);
          if (targetProd) setSelectedProduct(targetProd);
        }
      } else if (hash.startsWith('product/')) {
        const prodId = hash.replace('product/', '');
        const targetProd = prodsData.find(p => p.id === prodId);
        if (targetProd) setSelectedProduct(targetProd);
      } else if (hash === 'vendor') {
        setIsVendorOpen(true);
      } else if (hash === 'profile') {
        setIsProfileOpen(true);
      } else if (savedView && savedView.view === 'shop' && savedView.id) {
        // Fallback localStorage
        const targetShop = shopsData.find(
          s => s.code?.toUpperCase() === savedView.id?.toUpperCase() || s.id === savedView.id
        );
        if (targetShop) {
          setViewingShopStorefront(targetShop);
          window.location.hash = `shop/${targetShop.code || targetShop.id}`;
        }
      }
    }
    loadData();
  }, []);

  // Écouter les changements d'historique (Boutons Précédent / Suivant du navigateur)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (!hash) {
        setViewingShopStorefront(null);
        setSelectedProduct(null);
        setIsVendorOpen(false);
        setIsProfileOpen(false);
      } else if (hash === 'profile') {
        setIsProfileOpen(true);
        setViewingShopStorefront(null);
      } else if (hash.startsWith('shop/')) {
        setIsProfileOpen(false);
        const parts = hash.split('/');
        const shopIdentifier = parts[1];
        const targetShop = shops.find(
          s => s.code?.toUpperCase() === shopIdentifier?.toUpperCase() || s.id === shopIdentifier
        );
        if (targetShop) {
          setViewingShopStorefront(targetShop);
        }
        if (parts.length >= 4 && parts[2] === 'product') {
          const targetProd = products.find(p => p.id === parts[3]);
          if (targetProd) setSelectedProduct(targetProd);
        } else {
          setSelectedProduct(null);
        }
      } else if (hash === 'vendor') {
        setIsVendorOpen(true);
      } else if (hash.startsWith('product/')) {
        const prodId = hash.replace('product/', '');
        const targetProd = products.find(p => p.id === prodId);
        if (targetProd) setSelectedProduct(targetProd);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [shops, products]);

  const handleOpenProfile = useCallback(() => {
    setIsProfileOpen(true);
    setViewingShopStorefront(null);
    window.location.hash = 'profile';
  }, []);

  const handleCloseProfile = useCallback(() => {
    setIsProfileOpen(false);
    window.location.hash = '';
  }, []);

  const handleProductAdded = (newProd) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  // Rafraîchir la liste des boutiques depuis le service (LocalStorage + Supabase)
  const refreshShops = useCallback(async () => {
    const shopsData = await fetchShops();
    setShops(shopsData);
  }, []);

  // Appelé après création d'une boutique (Google ou Email)
  const handleShopCreated = useCallback((newShop) => {
    if (!newShop) return;
    setShops(prev => {
      // Éviter les doublons par code ou owner_uid
      const filtered = prev.filter(
        s => s.code !== newShop.code && s.owner_uid !== newShop.owner_uid && s.id !== newShop.id
      );
      return [newShop, ...filtered];
    });
    handleOpenShop(newShop);
  }, [handleOpenShop]);

  // Appelé après modification de la boutique (layout, logo, bannière, thème)
  const handleShopUpdated = useCallback((updatedShop) => {
    if (!updatedShop) return;
    setShops(prev => prev.map(s => {
      if (s.id === updatedShop.id || s.code === updatedShop.code || (s.owner_uid && s.owner_uid === updatedShop.owner_uid)) {
        return { ...s, ...updatedShop };
      }
      return s;
    }));
    setViewingShopStorefront(prev => {
      if (!prev) return null;
      if (prev.id === updatedShop.id || prev.code === updatedShop.code || (prev.owner_uid && prev.owner_uid === updatedShop.owner_uid)) {
        return { ...prev, ...updatedShop };
      }
      return prev;
    });
  }, []);

  const handleFilterNearby = (city) => {
    setSelectedCity(city);
  };

  // Filtrage des articles pour la vue marketplace globale
  const filteredProducts = products.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (selectedCity !== 'all' && item.shopCity !== selectedCity) {
      return false;
    }
    if (activeShopFilter && item.shopId !== activeShopFilter.id) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = (item.description || '').toLowerCase().includes(q);
      const matchShop = (item.shopName || '').toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchShop) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 ${liteMode ? 'lite-mode' : ''}`}>
      
      {/* VUE 1 : Page Profil Pleine Page Autonome */}
      {isProfileOpen ? (
        <UserProfilePage
          onBackToMarketplace={handleCloseProfile}
          onOpenStorefront={(shop) => {
            setIsProfileOpen(false);
            handleOpenShop(shop);
          }}
          products={products}
        />
      ) : viewingShopStorefront ? (
        /* VUE 2 : Page Boutique Modulaire Personnalisée (Style Odoo) */
        <ShopStorefront
          shop={viewingShopStorefront}
          products={products}
          onBackToMarketplace={handleBackToMarketplace}
          onSelectProduct={handleOpenProduct}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenVendorDashboard={handleOpenVendor}
          onShopUpdated={handleShopUpdated}
          initialEditMode={Boolean(viewingShopStorefront?.initialEditMode)}
        />
      ) : (
        /* VUE 3 : Marketplace Globale MeetShop */
        <>
          {/* En-tête Sticky */}
          <Header
            onOpenCart={() => setIsCartOpen(true)}
            onOpenOrders={() => setIsOrdersOpen(true)}
            onOpenProfile={handleOpenProfile}
            onOpenVendorModal={handleOpenVendor}
            onOpenAuthModal={handleOpenAuthModal}
            onNavigateHome={() => {
              setActiveShopFilter(null);
              setSelectedCategory('all');
              setSelectedCity('all');
              setSearchQuery('');
              handleBackToMarketplace();
            }}
          />

          <main className="flex-1">
            
            {/* Bannière Hero & Recherche */}
            <HeroBanner
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onOpenVisualSearch={() => setIsVisualSearchOpen(true)}
              onOpenShopCode={() => setIsShopCodeOpen(true)}
              onFilterNearby={handleFilterNearby}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
            />

            {/* 3 Piliers de proposition de valeur */}
            <FeaturesSlider />

            {/* Boutiques en direct (Cliquez pour ouvrir la vitrine modulaire) */}
            {!activeShopFilter && (
              <LiveShops
                shops={shops}
                onSelectShop={handleOpenShop}
                onOpenAllShops={() => setSelectedCategory('all')}
              />
            )}

            {/* Barre de filtrage par catégories */}
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setActiveShopFilter(null);
              }}
            />

            {/* Catalogue Produits */}
            <section className="max-w-7xl mx-auto px-4 py-6">
              
              {/* Header du catalogue */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      {activeShopFilter ? `Boutique : ${activeShopFilter.name}` : 'Tous les Produits'}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-green-600 dark:text-green-400">
                      {filteredProducts.length} PRODUITS DISPONIBLES
                    </span>
                  </div>
                  {activeShopFilter && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {activeShopFilter.quarter}, {activeShopFilter.city} • Code #{activeShopFilter.code}
                    </p>
                  )}
                </div>

                {/* Réinitialiser le filtre boutique si actif */}
                {activeShopFilter && (
                  <button
                    onClick={() => setActiveShopFilter(null)}
                    className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Voir toutes les boutiques</span>
                  </button>
                )}
              </div>

              {/* Grille des produits */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-72 rounded-3xl bg-slate-200/60 dark:bg-slate-900/60 animate-pulse border border-slate-200 dark:border-slate-800" />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-slate-100/60 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800/80 p-8">
                  <Sparkles className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">Aucun produit trouvé</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
                    Essayez d'ajuster votre recherche ou vos filtres de catégorie.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedCity('all');
                      setSearchQuery('');
                      setActiveShopFilter(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-green-500 text-slate-950 font-bold text-xs"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {filteredProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onSelectProduct={handleOpenProduct}
                    />
                  ))}
                </div>
              )}

            </section>

          </main>

          {/* Pied de page */}
          <Footer
            onOpenVendorModal={handleOpenVendor}
            onOpenOrders={() => setIsOrdersOpen(true)}
            onOpenAllShops={() => setSelectedCategory('all')}
          />
        </>
      )}

      {/* Modals & Tiroirs */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={handleCloseProduct}
        themeId={viewingShopStorefront ? (viewingShopStorefront.layout_config?.theme || 'emerald') : 'emerald'}
        shop={
          viewingShopStorefront ||
          shops.find(s => s.id === selectedProduct?.shopId || s.name === selectedProduct?.shopName)
        }
      />

      <VisualSearchModal
        isOpen={isVisualSearchOpen}
        onClose={() => setIsVisualSearchOpen(false)}
        allProducts={products}
        onSelectProduct={handleOpenProduct}
      />

      <ShopCodeModal
        isOpen={isShopCodeOpen}
        onClose={() => setIsShopCodeOpen(false)}
        shops={shops}
        onSelectShop={(s) => {
          handleOpenShop(s);
          setIsShopCodeOpen(false);
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenCheckoutSummary={() => {
          setIsCartOpen(false);
          setIsCheckoutSummaryOpen(true);
        }}
      />

      <CheckoutSummaryModal
        isOpen={isCheckoutSummaryOpen}
        onClose={() => setIsCheckoutSummaryOpen(false)}
      />

      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />

      <VendorDashboard
        isOpen={isVendorOpen}
        onClose={handleCloseVendor}
        onProductAdded={handleProductAdded}
        onShopUpdated={handleShopUpdated}
        shops={shops}
        products={products}
        onOpenStorefront={(shop) => {
          handleOpenShop(shop);
          setIsVendorOpen(false);
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultRole={authInitRole}
        defaultMode={authInitMode}
        onShopCreated={handleShopCreated}
      />

    </div>
  );
}
