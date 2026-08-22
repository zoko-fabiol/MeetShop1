import React, { useState, useEffect } from 'react';
import { 
  X, 
  Store, 
  Package, 
  PackagePlus,
  Plus, 
  CheckCircle2, 
  LogOut, 
  ExternalLink, 
  Palette, 
  Sliders, 
  Percent, 
  Layers, 
  CheckSquare, 
  Square, 
  Sparkles, 
  TrendingDown,
  Layout,
  Tag,
  ShieldCheck,
  Info,
  SlidersHorizontal,
  ChevronRight,
  ArrowUpRight,
  BarChart3,
  TrendingUp,
  Upload,
  Image as ImageIcon,
  Loader2,
  HelpCircle,
  Wand2,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveNewProduct, updateShopLayout } from '../services/productsService';
import { applyWholesaleConfigToProducts } from '../services/wholesaleService';
import { uploadImageToCloudinary } from '../services/cloudinaryService';
import ShopBuilder from './builder/ShopBuilder';
import WholesaleTierWidget from './WholesaleTierWidget';
import VendorStatsTab from './vendor/VendorStatsTab';
import VendorOrdersTab from './vendor/VendorOrdersTab';
import VendorLeadsTab from './vendor/VendorLeadsTab';
import AiStorefrontGeneratorModal from './builder/AiStorefrontGeneratorModal';

export default function VendorDashboard({ 
  isOpen, 
  onClose, 
  products = [], 
  onProductAdded,
  onOpenStorefront,
  onShopUpdated
}) {
  const { vendor, loginVendor, logoutVendor, updateVendorShop, error: authError } = useAuth();
  
  // Tabs: 'wholesale' | 'builder' | 'products'
  const [activeTab, setActiveTab] = useState('wholesale');
  const [isQuickWizardOpen, setIsQuickWizardOpen] = useState(false);
  
  // Login form state
  const [shopCode, setShopCode] = useState('');
  const [password, setPassword] = useState('');

  // New Product form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('electronique');
  const [description, setDescription] = useState('');
  const [productImages, setProductImages] = useState([]); // max 5 images
  const [uploadingSlot, setUploadingSlot] = useState(null); // index du slot en cours d'upload
  const [uploadError, setUploadError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const MAX_IMAGES = 5;

  const handleImageFileChange = async (e, slotIndex) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    e.target.value = '';

    // Si on remplace un slot précis (survol d'une miniature existante)
    if (typeof slotIndex === 'number' && slotIndex < productImages.length) {
      const file = files[0];
      const tempUrl = URL.createObjectURL(file);
      // Aperçu instantané 0ms
      setProductImages(prev => {
        const next = [...prev];
        next[slotIndex] = tempUrl;
        return next;
      });

      try {
        setUploadingSlot(slotIndex);
        setUploadError('');
        const url = await uploadImageToCloudinary(file, 'meetshop_products');
        if (url) {
          setProductImages(prev => {
            const next = [...prev];
            next[slotIndex] = url;
            return next;
          });
        }
      } catch (err) {
        console.warn('Erreur téléversement:', err);
      } finally {
        setUploadingSlot(null);
      }
      return;
    }

    // Sélection multiple : ajout instantané des aperçus puis téléversement cloud
    const remaining = MAX_IMAGES - productImages.length;
    if (remaining <= 0) return;

    const filesToUpload = files.slice(0, remaining);
    const tempUrls = filesToUpload.map(f => URL.createObjectURL(f));
    const startIndex = productImages.length;

    // Affichage instantané à l'écran
    setProductImages(prev => [...prev, ...tempUrls].slice(0, MAX_IMAGES));
    setUploadingSlot('batch');
    setUploadError('');

    try {
      // Téléversement multi-cloud en parallèle
      const urls = await Promise.all(
        filesToUpload.map(async (file, idx) => {
          try {
            return await uploadImageToCloudinary(file, 'meetshop_products');
          } catch {
            return tempUrls[idx];
          }
        })
      );

      // Remplacer les aperçus temporaires par les URLs cloud permanentes
      setProductImages(prev => {
        const next = [...prev];
        urls.forEach((url, i) => {
          if (url && startIndex + i < next.length) {
            next[startIndex + i] = url;
          }
        });
        return next;
      });
    } catch (err) {
      console.warn('Erreur téléversement multiple:', err);
    } finally {
      setUploadingSlot(null);
    }
  };

  const removeProductImage = (index) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  // Wholesale MOQ Configuration State
  const [wholesaleScope, setWholesaleScope] = useState('all_shop'); // 'all_shop' | 'multiple' | 'single'
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [selectedSingleProductId, setSelectedSingleProductId] = useState('');
  
  // Tiers settings
  const [moqEnabled, setMoqEnabled] = useState(true);
  const [tier2MinQty, setTier2MinQty] = useState(5);
  const [tier2Discount, setTier2Discount] = useState(15);
  const [tier3MinQty, setTier3MinQty] = useState(20);
  const [tier3Discount, setTier3Discount] = useState(30);
  const [wholesaleSuccessMsg, setWholesaleSuccessMsg] = useState('');

  // Verrouillage du scroll d'arrière-plan
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentShopData = vendor || {};
  const vendorProducts = products.filter(p => p.shopId === vendor?.id || p.shopName === vendor?.name);

  // Initialize single product if empty
  const activePreviewProduct = selectedSingleProductId 
    ? vendorProducts.find(p => p.id === selectedSingleProductId) || vendorProducts[0] || products[0]
    : vendorProducts[0] || products[0] || {
        id: 'sample-prod',
        name: 'Écouteurs Sans Fil Pro TWS',
        price: 15000,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
        category: 'electronique',
        shopName: vendor?.name || 'Ma Boutique'
      };

  const handleLogin = (e) => {
    e.preventDefault();
    const success = loginVendor(shopCode, password);
    if (success) {
      setShopCode('');
      setPassword('');
    }
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!name || !price || !vendor) return;

    const mainImage = productImages[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';

    const newProd = {
      id: `prod-v-${Date.now()}`,
      name,
      price: parseFloat(price),
      currency: 'FCFA',
      category,
      shopId: vendor.id,
      shopName: vendor.name,
      shopCode: vendor.code,
      shopCity: vendor.city,
      shopQuarter: vendor.quarter,
      shopPhone: vendor.phone,
      rating: 5.0,
      reviewsCount: 1,
      image: mainImage,
      images: productImages.length > 0 ? productImages : [mainImage],
      description,
      stock: 10,
      isAvailable: true,
      views: 1,
      wholesale_tiers: moqEnabled ? {
        enabled: true,
        tier1: { minQty: 1, maxQty: Number(tier2MinQty) - 1, label: 'Détail', discountPercent: 0 },
        tier2: { minQty: Number(tier2MinQty), maxQty: Number(tier3MinQty) - 1, label: `Gros (-${tier2Discount}%)`, discountPercent: Number(tier2Discount) },
        tier3: { minQty: Number(tier3MinQty), maxQty: null, label: `VIP (-${tier3Discount}%)`, discountPercent: Number(tier3Discount) }
      } : { enabled: false }
    };

    saveNewProduct(newProd);
    onProductAdded?.(newProd);
    setSuccessMsg('Article publié avec succès sur MeetShop !');
    setName('');
    setPrice('');
    setDescription('');
    setProductImages([]);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSaveLayout = async (newLayoutConfig) => {
    if (vendor) {
      // Extraire le logo et la bannière personnalisés si définis dans le bloc HeroBanner
      const heroBlock = (newLayoutConfig.blocks || []).find(b => b.type === 'HeroBanner');
      const customLogo = heroBlock?.props?.customLogoUrl;
      const customBanner = heroBlock?.props?.customCoverUrl;

      const shopUpdates = {
        layout_config: newLayoutConfig,
        ...(customLogo ? { logo: customLogo, logo_url: customLogo } : {}),
        ...(customBanner ? { banner: customBanner, banner_url: customBanner } : {})
      };

      if (updateVendorShop) {
        await updateVendorShop(shopUpdates);
      }
      await updateShopLayout(vendor.code || vendor.id, newLayoutConfig, shopUpdates);

      onShopUpdated?.({ ...vendor, ...shopUpdates });
    }
  };

  const handlePreviewPublicStorefront = async (layoutConfig) => {
    const finalLayout = layoutConfig || vendor?.layout_config;
    if (layoutConfig) {
      await handleSaveLayout(layoutConfig);
    }
    const finalShop = {
      ...vendor,
      layout_config: finalLayout
    };
    onShopUpdated?.(finalShop);
    onOpenStorefront?.(finalShop);
    onClose?.();
  };

  const handleCompleteQuickWizard = async (updatedData) => {
    if (vendor) {
      if (updateVendorShop) {
        await updateVendorShop(updatedData);
      }
      if (updatedData.layout_config) {
        await updateShopLayout(vendor.code || vendor.id, updatedData.layout_config, updatedData);
      }
      const finalShop = { ...vendor, ...updatedData };
      onShopUpdated?.(finalShop);
      setSuccessMsg('Votre vitrine a été créée et publiée avec succès !');
      setTimeout(() => setSuccessMsg(''), 4000);
      if (onOpenStorefront) {
        onOpenStorefront(finalShop);
        onClose?.();
      }
    }
  };

  // Enregistrer la configuration Grossiste (MOQ)
  const handleSaveWholesaleConfig = () => {
    const config = {
      enabled: moqEnabled,
      tier1: { minQty: 1, maxQty: Number(tier2MinQty) - 1, label: 'Détail', discountPercent: 0 },
      tier2: { minQty: Number(tier2MinQty), maxQty: Number(tier3MinQty) - 1, label: `Gros (-${tier2Discount}%)`, discountPercent: Number(tier2Discount) },
      tier3: { minQty: Number(tier3MinQty), maxQty: null, label: `VIP (-${tier3Discount}%)`, discountPercent: Number(tier3Discount) }
    };

    let targetIds = [];
    if (wholesaleScope === 'all_shop') {
      targetIds = vendorProducts.map(p => p.id);
    } else if (wholesaleScope === 'multiple') {
      targetIds = selectedProductIds;
    } else if (wholesaleScope === 'single' && selectedSingleProductId) {
      targetIds = [selectedSingleProductId];
    }

    applyWholesaleConfigToProducts(config, targetIds, vendor?.id);
    
    const scopeLabel = wholesaleScope === 'all_shop' 
      ? 'toute la boutique' 
      : wholesaleScope === 'multiple' 
        ? `${targetIds.length} articles sélectionnés` 
        : `1 article spécifique`;

    setWholesaleSuccessMsg(`Tarifs grossistes enregistrés avec succès pour ${scopeLabel} !`);
    setTimeout(() => setWholesaleSuccessMsg(''), 4000);
  };

  const toggleSelectProduct = (productId) => {
    setSelectedProductIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSelectAllProducts = () => {
    if (selectedProductIds.length === vendorProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(vendorProducts.map(p => p.id));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overscroll-contain">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-6xl overflow-hidden shadow-2xl relative h-[94vh] flex flex-col overscroll-contain transition-colors">
        
        {/* Header Modal Premium */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-white/95 dark:bg-slate-900/95 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0 shadow-sm">
              <Store className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 dark:text-white text-sm sm:text-base tracking-tight truncate">
                  Espace Vendeur MeetShop
                </h3>
                {vendor && (
                  <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-sm">
                    #{vendor.code} • {vendor.name}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Gestion des tarifs grossistes, constructeur de vitrine & stock
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {vendor && (
              <button
                onClick={() => handlePreviewPublicStorefront(currentShopData.layout_config)}
                className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all hover:text-slate-900 dark:hover:text-white shadow-sm"
                title="Voir la vitrine en ligne"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Voir ma vitrine</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Premium Responsive */}
        {vendor && (
          <div className="px-2.5 sm:px-6 py-2 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar shrink-0">
            <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
              
              {/* Onglet 1: Tarifs Grossiste (MOQ) */}
              <button
                onClick={() => setActiveTab('wholesale')}
                className={`flex-1 sm:flex-initial px-2 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5 transition-all shrink-0 ${
                  activeTab === 'wholesale'
                    ? 'bg-emerald-600 text-white font-black shadow-md shadow-emerald-600/25'
                    : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm'
                }`}
              >
                <Percent className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === 'wholesale' ? 'text-white' : 'text-emerald-500'}`} />
                <span className="hidden sm:inline">Tarifs </span>
                <span>Grossiste</span>
                <span className="hidden md:inline"> (MOQ)</span>
              </button>

              {/* Onglet 2: Ajout Article */}
              <button
                onClick={() => setActiveTab('products')}
                className={`flex-1 sm:flex-initial px-2 sm:px-3.5 py-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5 transition-all shrink-0 ${
                  activeTab === 'products'
                    ? 'bg-emerald-600 text-white font-black shadow-md shadow-emerald-600/25'
                    : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm'
                }`}
              >
                <PackagePlus className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === 'products' ? 'text-white' : 'text-amber-500'}`} />
                <span className="hidden sm:inline">Ajout </span>
                <span>Article</span>
              </button>

              {/* Onglet 4: Commandes Reçues & CRM */}
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 sm:flex-initial px-2 sm:px-3.5 py-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5 transition-all shrink-0 ${
                  activeTab === 'orders'
                    ? 'bg-emerald-600 text-white font-black shadow-md shadow-emerald-600/25'
                    : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm'
                }`}
              >
                <Package className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === 'orders' ? 'text-white' : 'text-blue-500'}`} />
                <span className="hidden sm:inline">Commandes </span>
                <span>Reçues</span>
              </button>

              {/* Onglet 5: Prospects & Questionnaires */}
              <button
                onClick={() => setActiveTab('leads')}
                className={`flex-1 sm:flex-initial px-2 sm:px-3.5 py-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5 transition-all shrink-0 ${
                  activeTab === 'leads'
                    ? 'bg-emerald-600 text-white font-black shadow-md shadow-emerald-600/25'
                    : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm'
                }`}
              >
                <HelpCircle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === 'leads' ? 'text-white' : 'text-teal-500'}`} />
                <span className="hidden sm:inline">Prospects & </span>
                <span>Devis</span>
              </button>

              {/* Onglet 6: Stats & Pubs (Style Facebook Ads) */}
              <button
                onClick={() => setActiveTab('stats')}
                className={`flex-1 sm:flex-initial px-2 sm:px-3.5 py-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5 transition-all shrink-0 ${
                  activeTab === 'stats'
                    ? 'bg-emerald-600 text-white font-black shadow-md shadow-emerald-600/25'
                    : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm'
                }`}
              >
                <BarChart3 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === 'stats' ? 'text-white' : 'text-indigo-500 dark:text-indigo-400'}`} />
                <span className="hidden sm:inline">Stats & </span>
                <span>Pubs</span>
              </button>

            </div>

            <button
              onClick={logoutVendor}
              className="hidden sm:flex px-3 py-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent hover:border-rose-500/20 transition-all items-center gap-1.5 text-xs font-semibold shrink-0"
              title="Déconnexion"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Quitter</span>
            </button>
          </div>
        )}

        {/* 🚀 BANDEAU D'ASSISTANT RAPIDE EN 3 CLICS */}
        {vendor && (
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-3 sm:px-6 py-2.5 shadow-md flex flex-wrap items-center justify-between gap-3 text-white shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-white/20 backdrop-blur-sm shrink-0">
                <Wand2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-black text-xs sm:text-sm">
                  Créez votre Page Boutique en 3 Clics
                </p>
                <p className="text-[11px] text-emerald-100 hidden sm:block">
                  L'assistant et l'IA génèrent automatiquement votre vitrine complète et votre catalogue prêt à vendre.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onOpenStorefront?.({ ...vendor, initialEditMode: true });
                  onClose?.();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer border border-white/20"
                title="Ouvrir la page boutique directement en mode édition Odoo"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Modifier en Direct (Odoo)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsQuickWizardOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Générateur IA Odoo</span>
              </button>

              {onOpenStorefront && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenStorefront(vendor);
                    onClose?.();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-950/25 hover:bg-slate-950/40 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Voir ma Vitrine</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Corps principal */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          
          {!vendor ? (
            /* Formulaire de Connexion Vendeur */
            <div className="p-6">
              <form onSubmit={handleLogin} className="max-w-md mx-auto py-10 space-y-4">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Store className="w-8 h-8" />
                  </div>
                  <h4 className="font-black text-slate-900 dark:text-white text-xl">Connexion Espace Vendeur</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Accédez à vos tarifs grossistes, constructeur de page et stock</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1.5 shadow-sm">
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Info className="w-4 h-4" />
                    <span>Identifiants de démonstration :</span>
                  </p>
                  <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400">• Code: <strong className="text-slate-900 dark:text-white">ZOKO01</strong> | Passe: <strong className="text-slate-900 dark:text-white">123456</strong> (ZOKOSTORE Douala)</p>
                  <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400">• Code: <strong className="text-slate-900 dark:text-white">ANABA02</strong> | Passe: <strong className="text-slate-900 dark:text-white">123456</strong> (ANABA BIO Yaoundé)</p>
                </div>

                {authError && (
                  <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-600 dark:text-rose-300 text-xs font-semibold">
                    {authError}
                  </div>
                )}

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 text-xs font-semibold">Code Boutique</label>
                  <input
                    type="text"
                    value={shopCode}
                    onChange={(e) => setShopCode(e.target.value.toUpperCase())}
                    placeholder="Ex: ZOKO01"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 uppercase font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 text-xs font-semibold">Mot de passe</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-emerald-600/25 transition-all active:scale-98"
                >
                  Ouvrir mon Espace Vendeur
                </button>
              </form>
            </div>
          ) : activeTab === 'wholesale' ? (
            
            /* 📊 ONGLET TARIFS GROSSISTE DÉGRESSIFS (MOQ) */
            <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
              
              {/* Header Info Banner */}
              <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-gradient-to-r dark:from-emerald-950/70 dark:via-slate-900 dark:to-slate-900 border border-emerald-200 dark:border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      Configuration des Tarifs Grossistes Dégressifs (MOQ)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    Incitez vos clients et revendeurs à commander en volume en débloquant automatiquement des remises par paliers de quantité (-15% Gros, -30% VIP).
                  </p>
                </div>

                <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 dark:bg-emerald-500/10 px-3.5 py-1.5 rounded-xl border border-emerald-500/30 font-extrabold self-start sm:self-auto shrink-0 shadow-sm">
                  Boutique : {vendor.name}
                </span>
              </div>

              {wholesaleSuccessMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>{wholesaleSuccessMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Colonne Gauche : Paramétrage (7 cols) */}
                <div className="lg:col-span-7 space-y-5">
                  
                  {/* 1. Sélecteur de Portée (Scope) */}
                  <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
                    <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      1. Portée d'application :
                    </label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                      {/* Option A : Toute la boutique */}
                      <button
                        type="button"
                        onClick={() => setWholesaleScope('all_shop')}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          wholesaleScope === 'all_shop'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-slate-900 dark:text-white ring-2 ring-emerald-500/20 shadow-md'
                            : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-0.5">
                          <Store className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>Toute la boutique</span>
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Règle globale pour tous vos articles</div>
                      </button>

                      {/* Option B : Plusieurs articles */}
                      <button
                        type="button"
                        onClick={() => setWholesaleScope('multiple')}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          wholesaleScope === 'multiple'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-slate-900 dark:text-white ring-2 ring-emerald-500/20 shadow-md'
                            : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-0.5">
                          <Layers className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                          <span>Plusieurs articles</span>
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Sélection multiple par lot</div>
                      </button>

                      {/* Option C : Un seul article */}
                      <button
                        type="button"
                        onClick={() => setWholesaleScope('single')}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          wholesaleScope === 'single'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-slate-900 dark:text-white ring-2 ring-emerald-500/20 shadow-md'
                            : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-0.5">
                          <Tag className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>Un seul article</span>
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Sur-mesure pour 1 produit</div>
                      </button>
                    </div>

                    {/* Sélecteur de produit unique si scope === 'single' */}
                    {wholesaleScope === 'single' && (
                      <div className="pt-2 animate-fadeIn">
                        <label className="block text-slate-700 dark:text-slate-300 text-xs font-semibold mb-1">Sélectionner l'article :</label>
                        <select
                          value={selectedSingleProductId}
                          onChange={(e) => setSelectedSingleProductId(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 shadow-sm"
                        >
                          {vendorProducts.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} — {p.price.toLocaleString('fr-FR')} FCFA
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Sélecteur multiple de produits avec checkboxes si scope === 'multiple' */}
                    {wholesaleScope === 'multiple' && (
                      <div className="pt-2 space-y-2 animate-fadeIn">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-700 dark:text-slate-300 font-semibold">Cochez les articles à inclure :</span>
                          <button
                            type="button"
                            onClick={toggleSelectAllProducts}
                            className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold text-[11px]"
                          >
                            {selectedProductIds.length === vendorProducts.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                          </button>
                        </div>

                        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 no-scrollbar bg-white dark:bg-slate-900/80 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
                          {vendorProducts.map((p) => {
                            const isChecked = selectedProductIds.includes(p.id);
                            return (
                              <div
                                key={p.id}
                                onClick={() => toggleSelectProduct(p.id)}
                                className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-colors ${
                                  isChecked 
                                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-white font-semibold' 
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  {isChecked ? (
                                    <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                  ) : (
                                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                                  )}
                                  <span className="truncate">{p.name}</span>
                                </div>
                                <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400 shrink-0">
                                  {p.price.toLocaleString('fr-FR')} FCFA
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* 2. Configuration des Paliers */}
                  <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        2. Définition des Paliers de Remise :
                      </label>
                      <button
                        type="button"
                        onClick={() => setMoqEnabled(!moqEnabled)}
                        className="flex items-center gap-2 cursor-pointer text-xs"
                      >
                        <span className={`text-[10px] font-black tracking-wider uppercase ${
                          moqEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                        }`}>
                          {moqEnabled ? 'ON' : 'OFF'}
                        </span>
                        <div className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
                          moqEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                        }`}>
                          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                            moqEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`} />
                        </div>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      
                      {/* Palier 2 : Gros */}
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                        <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                          <span className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5" />
                            <span>Palier 2 (Gros)</span>
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                            Intermédiaire
                          </span>
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-medium">Quantité minimale (MOQ) :</label>
                          <input
                            type="number"
                            min="2"
                            max="50"
                            value={tier2MinQty}
                            onChange={(e) => setTier2MinQty(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-900 dark:text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-medium">Pourcentage de remise (%) :</label>
                          <div className="relative">
                            <input
                              type="number"
                              min="1"
                              max="80"
                              value={tier2Discount}
                              onChange={(e) => setTier2Discount(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-emerald-600 dark:text-emerald-400 font-bold"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                          </div>
                        </div>
                      </div>

                      {/* Palier 3 : VIP Grossiste */}
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                        <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 font-bold">
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Palier 3 (VIP Grossiste)</span>
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                            Volume Élevé
                          </span>
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-medium">Quantité minimale (MOQ) :</label>
                          <input
                            type="number"
                            min="5"
                            max="200"
                            value={tier3MinQty}
                            onChange={(e) => setTier3MinQty(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-900 dark:text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-medium">Pourcentage de remise (%) :</label>
                          <div className="relative">
                            <input
                              type="number"
                              min="5"
                              max="90"
                              value={tier3Discount}
                              onChange={(e) => setTier3Discount(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-amber-600 dark:text-amber-400 font-bold"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={handleSaveWholesaleConfig}
                      className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/25 active:scale-98 transition-all flex items-center justify-center gap-2 mt-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Enregistrer la Configuration Grossiste</span>
                    </button>
                  </div>

                </div>

                {/* Colonne Droite : Aperçu Visuel Direct du Widget (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Aperçu Client en Direct</span>
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono">Thème MeetShop</span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Voici comment s'affiche exactement le module sur la fiche produit de vos clients :
                    </p>

                    {/* Widget Simulateur */}
                    <div className="pt-1">
                      <WholesaleTierWidget
                        product={{
                          ...activePreviewProduct,
                          wholesale_tiers: {
                            enabled: moqEnabled,
                            tier1: { minQty: 1, maxQty: Number(tier2MinQty) - 1, label: 'Détail', discountPercent: 0 },
                            tier2: { minQty: Number(tier2MinQty), maxQty: Number(tier3MinQty) - 1, label: `Gros (-${tier2Discount}%)`, discountPercent: Number(tier2Discount) },
                            tier3: { minQty: Number(tier3MinQty), maxQty: null, label: `VIP (-${tier3Discount}%)`, discountPercent: Number(tier3Discount) }
                          }
                        }}
                        quantity={1}
                        onSelectQuantity={() => {}}
                        shop={vendor}
                      />
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 space-y-2 shadow-sm">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-slate-500 dark:text-slate-400">Article testé :</span>
                        <span className="text-slate-900 dark:text-white font-bold truncate max-w-[160px]">{activePreviewProduct.name}</span>
                      </div>
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-slate-500 dark:text-slate-400">Prix de base :</span>
                        <span className="text-slate-900 dark:text-white font-bold">{Number(activePreviewProduct.price).toLocaleString('fr-FR')} FCFA</span>
                      </div>
                      <div className="flex items-center justify-between font-semibold text-emerald-600 dark:text-emerald-400">
                        <span>Prix de Gros ({tier2MinQty}+ pcs) :</span>
                        <span className="font-bold">{Math.round(activePreviewProduct.price * (1 - tier2Discount / 100)).toLocaleString('fr-FR')} FCFA</span>
                      </div>
                      <div className="flex items-center justify-between font-semibold text-amber-600 dark:text-amber-400">
                        <span>Prix VIP ({tier3MinQty}+ pcs) :</span>
                        <span className="font-bold">{Math.round(activePreviewProduct.price * (1 - tier3Discount / 100)).toLocaleString('fr-FR')} FCFA</span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

            </div>

          ) : activeTab === 'products' ? (
            /* Onglet 2: Ajout d'Articles & Stock */
            <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
              
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">{vendor.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {vendor.quarter}, {vendor.city} • WhatsApp: {vendor.phone}
                  </p>
                </div>
                <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-bold">
                  #{vendor.code}
                </span>
              </div>

              <form onSubmit={handleCreateProduct} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                  <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Ajouter un nouvel article en stock</span>
                </div>

                {successMsg && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Titre de l'article *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Écouteurs Sans Fil Pro"
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 shadow-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Prix en FCFA *</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Ex: 15000"
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 shadow-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Catégorie</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 shadow-sm"
                    >
                      <option value="electronique">Électronique & High-Tech</option>
                      <option value="alimentation">Alimentation & Supermarché</option>
                      <option value="maison">Maison & Électroménager</option>
                      <option value="mode">Mode & Prêt-à-porter</option>
                      <option value="beaute">Beauté & Cosmétiques</option>
                      <option value="divers">Divers & Services</option>
                    </select>
                  </div>

                  {/* Upload Multi-Photos (max 5) — Galerie Cloudinary */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Photos de l'article
                      </label>
                      <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                        {productImages.length} / {MAX_IMAGES}
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      {/* Slots des images existantes */}
                      {productImages.map((url, index) => (
                        <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-emerald-500/30 shadow-sm">
                          <img
                            src={url}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-full object-contain bg-slate-100 dark:bg-slate-800"
                          />
                          {/* Overlay survol : remplacer ou supprimer */}
                          <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-all duration-150 flex flex-col items-center justify-center gap-1.5">
                            <label className="cursor-pointer w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center border border-white/30 transition-colors">
                              <Upload className="w-3.5 h-3.5 text-white" />
                              <input type="file" accept="image/*" onChange={(e) => handleImageFileChange(e, index)} disabled={uploadingSlot !== null} className="hidden" />
                            </label>
                            <button
                              type="button"
                              onClick={() => removeProductImage(index)}
                              className="w-7 h-7 rounded-full bg-rose-500/80 hover:bg-rose-500 flex items-center justify-center border border-rose-400/40 transition-colors"
                            >
                              <X className="w-3.5 h-3.5 text-white" />
                            </button>
                          </div>
                          {/* Badge principal */}
                          {index === 0 && (
                            <div className="absolute bottom-1 left-1 text-[8px] font-black bg-emerald-600 text-white px-1.5 py-0.5 rounded-full leading-none">
                              PRINCIPALE
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Slots d'upload en cours (batch) */}
                      {uploadingSlot === 'batch' && Array.from({ length: Math.max(0, MAX_IMAGES - productImages.length) }).map((_, i) => (
                        <div key={`uploading-${i}`} className="aspect-square rounded-xl border-2 border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 flex flex-col items-center justify-center gap-1">
                          <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                          {i === 0 && <span className="text-[9px] font-bold text-emerald-600 text-center leading-tight">Upload...</span>}
                        </div>
                      ))}

                      {/* Slot d'upload d'un seul slot (remplacement) */}
                      {typeof uploadingSlot === 'number' && uploadingSlot >= 0 && uploadingSlot === productImages.length && (
                        <div className="aspect-square rounded-xl border-2 border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 flex flex-col items-center justify-center gap-1">
                          <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                          <span className="text-[9px] font-bold text-emerald-600 text-center leading-tight">Upload...</span>
                        </div>
                      )}

                      {/* Slot d'ajout (si < 5 images et pas d'upload en cours) */}
                      {productImages.length < MAX_IMAGES && uploadingSlot === null && (
                        <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/20 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-150 group">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 flex items-center justify-center transition-colors border border-slate-200 dark:border-slate-700 group-hover:border-emerald-300">
                            <ImageIcon className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors text-center leading-tight">
                            {productImages.length === 0 ? 'Ajouter jusqu\'à 5' : 'Ajouter'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleImageFileChange(e, productImages.length)}
                            className="hidden"
                          />
                        </label>
                      )}

                      {/* Slots vides restants — uniquement si pas d'upload batch en cours */}
                      {uploadingSlot !== 'batch' && Array.from({ length: Math.max(0, MAX_IMAGES - productImages.length - (uploadingSlot === null ? 1 : 0)) }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30" />
                      ))}
                    </div>

                    {uploadError && (
                      <p className="mt-1.5 text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-rose-500 inline-block" />
                        {uploadError}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 text-xs font-medium">Description de l'article</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    placeholder="Précisez les caractéristiques, l'état, la garantie..."
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publier l'article sur MeetShop</span>
                </button>
              </form>

            </div>

          ) : activeTab === 'orders' ? (
            /* Onglet 4 : Commandes Reçues, Suivi & CRM */
            <div className="p-4 sm:p-6 max-w-5xl mx-auto">
              <VendorOrdersTab vendor={vendor} />
            </div>
          ) : activeTab === 'leads' ? (
            /* Onglet 5 : Réponses aux Questionnaires & Prospects */
            <div className="p-4 sm:p-6 max-w-5xl mx-auto">
              <VendorLeadsTab vendor={vendor} />
            </div>
          ) : activeTab === 'stats' ? (
            /* Onglet 6 : Statistiques, Audience & Boost Ads */
            <div className="p-4 sm:p-6 max-w-5xl mx-auto">
              <VendorStatsTab vendor={vendor} products={products} />
            </div>
          ) : null}

        </div>

        {/* 🚀 Moteur Unique de Génération IA Odoo */}
        <AiStorefrontGeneratorModal
          isOpen={isQuickWizardOpen}
          onClose={() => setIsQuickWizardOpen(false)}
          shop={vendor}
          onApplyGeneratedLayout={(generatedLayout) => {
            handleCompleteQuickWizard({
              ...vendor,
              layout_config: generatedLayout
            });
            setIsQuickWizardOpen(false);
          }}
        />

      </div>
    </div>
  );
}
