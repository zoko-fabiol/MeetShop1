import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  MessageSquare, 
  ShoppingBag, 
  Store, 
  ShieldCheck, 
  Share2, 
  Edit3, 
  Plus, 
  Palette, 
  Sliders, 
  Eye, 
  Check, 
  Sparkles,
  Layers,
  Percent,
  Save,
  AlertCircle,
  Sun,
  Moon,
  Bot,
  Home,
  Wand2,
  X
} from 'lucide-react';
import BlockRenderer from './shop-blocks/BlockRenderer';
import { getTheme, THEME_PALETTES } from '../config/themes';
import { getDefaultLayoutConfig, AVAILABLE_BLOCKS } from '../config/shopBlocks';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { updateShopLayout, saveNewProduct, deleteProductFromLocalAndCloud } from '../services/productsService';
import BlockConfigModal from './builder/BlockConfigModal';
import AiBlockModifierModal from './builder/AiBlockModifierModal';
import AiStorefrontGeneratorModal from './builder/AiStorefrontGeneratorModal';
import AiStorefrontConfiguratorTab from './builder/AiStorefrontConfiguratorTab';
import ShopCatalogPage from './shop/ShopCatalogPage';
import OdooTopEditBar from './odoo-editor/OdooTopEditBar';
import OdooLiveEditorSidebar from './odoo-editor/OdooLiveEditorSidebar';
import OdooLiveCanvasWrapper from './odoo-editor/OdooLiveCanvasWrapper';
import { recordShopView } from '../services/analyticsService';

class StorefrontErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Erreur attrapée par StorefrontErrorBoundary:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-lg">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Récupération automatique de la boutique
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Un élément visuel a nécessité un rechargement propre. Cliquez ci-dessous pour actualiser la vitrine sans perte de données.
          </p>
          <div className="flex items-center gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Recharger la boutique
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ShopStorefront(props) {
  return (
    <StorefrontErrorBoundary>
      <ShopStorefrontInner {...props} />
    </StorefrontErrorBoundary>
  );
}

function ShopStorefrontInner({
  shop,
  products = [],
  onBackToMarketplace,
  onSelectProduct,
  onOpenCart,
  onOpenVendorDashboard,
  onShopUpdated,
  initialEditMode = false
}) {
  const { totalCount } = useCart();
  const { vendor, updateVendorShop, userProfile, firebaseUser } = useAuth();
  const { themeMode, setThemeMode } = useTheme();

  // Détecter si l'utilisateur connecté est le propriétaire de cette boutique
  const isOwner = Boolean(
    vendor && (
      vendor.id === shop?.id ||
      vendor.code === shop?.code ||
      (vendor.owner_uid && shop?.owner_uid && vendor.owner_uid === shop?.owner_uid) ||
      vendor.name?.toUpperCase() === shop?.name?.toUpperCase() ||
      vendor.name?.toLowerCase() === shop?.name?.toLowerCase()
    )
  );

  // Enregistrer la vue de boutique pour l'analytics (UNIQUEMENT si ce n'est PAS le propriétaire)
  useEffect(() => {
    if (shop?.id || shop?.code) {
      recordShopView(shop.id || shop.code, {
        isOwner,
        visitorUid: firebaseUser?.uid || userProfile?.uid || null
      });
    }
  }, [shop?.id, shop?.code, isOwner, firebaseUser?.uid, userProfile?.uid]);

  // État local de la disposition pour prévisualisation et édition en direct
  const getShopLayout = (s) => (s?.layout_config && s?.layout_config.blocks && s?.layout_config.blocks.length > 0)
    ? s.layout_config
    : getDefaultLayoutConfig(s?.layout_config?.theme || 'emerald', s);

  const [currentLayout, setCurrentLayout] = useState(() => getShopLayout(shop));
  const [activeThemeId, setActiveThemeId] = useState(() => shop?.layout_config?.theme || currentLayout.theme || 'emerald');
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify({ ...getShopLayout(shop), theme: shop?.layout_config?.theme || 'emerald' }));

  // Synchroniser lorsque la boutique est mise à jour
  useEffect(() => {
    if (shop) {
      const layout = getShopLayout(shop);
      setCurrentLayout(layout);
      const themeId = shop.layout_config?.theme || layout.theme || 'emerald';
      setActiveThemeId(themeId);
      setSavedSnapshot(JSON.stringify({ ...layout, theme: themeId }));
    }
  }, [shop?.id, shop?.code, shop?.layout_config]);

  // ═══════════════════════════════════════════════════════
  // MODE ÉDITION LIVE ODOO
  // ═══════════════════════════════════════════════════════
  const [isEditMode, setIsEditMode] = useState(initialEditMode);
  const [editorTab, setEditorTab] = useState('blocks'); // 'blocks' | 'style' | 'theme'
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [selectedSnippetId, setSelectedSnippetId] = useState(null);
  const [deviceMode, setDeviceMode] = useState('desktop'); // 'desktop' | 'mobile'
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState('');

  // Undo / Redo History
  const [history, setHistory] = useState([currentLayout]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const pushHistory = (newLayout) => {
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(newLayout);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setCurrentLayout(newLayout);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setCurrentLayout(history[prevIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setCurrentLayout(history[nextIndex]);
    }
  };

  // Modals
  const [aiEditingBlock, setAiEditingBlock] = useState(null);
  const [isAiStorefrontOpen, setIsAiStorefrontOpen] = useState(false);

  // Tabs de navigation storefront (Accueil vs Boutique)
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'catalog'
  const [catalogCategory, setCatalogCategory] = useState('all');

  // Filtrage strict et gestion des produits de cette boutique
  const [shopProductsList, setShopProductsList] = useState(() => {
    if (!shop) return products;
    return products.filter(p => {
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
  });

  useEffect(() => {
    if (shop && products) {
      const filtered = products.filter(p => {
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
      setShopProductsList(filtered);
    }
  }, [shop?.id, shop?.code, shop?.name, products]);

  const handleAddProductDirectly = async (newProduct) => {
    try {
      const enhancedProduct = {
        ...newProduct,
        shopId: newProduct.shopId || shop?.id || shop?.code,
        shop_id: newProduct.shop_id || shop?.id || shop?.code,
        shopCode: newProduct.shopCode || shop?.code,
        shopName: newProduct.shopName || shop?.name,
        vendor_id: newProduct.vendor_id || shop?.seller_id || shop?.owner_uid || shop?.id
      };
      await saveNewProduct(enhancedProduct);
      setShopProductsList(prev => [enhancedProduct, ...prev.filter(p => p.id !== enhancedProduct.id)]);
      if (onShopUpdated) {
        onShopUpdated({ ...shop, last_product_added_at: new Date().toISOString() });
      }
      setSaveToast(`Produit "${enhancedProduct.name}" inséré avec succès !`);
      setTimeout(() => setSaveToast(''), 4000);
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement du produit:', err);
      setShopProductsList(prev => [newProduct, ...prev]);
    }
  };

  const handleDeleteProductDirectly = async (productId) => {
    try {
      await deleteProductFromLocalAndCloud(productId);
      setShopProductsList(prev => prev.filter(p => p.id !== productId));
      setSaveToast('Produit retiré de votre boutique avec succès !');
      setTimeout(() => setSaveToast(''), 4000);
    } catch (err) {
      console.error('Erreur suppression produit:', err);
    }
  };

  const handleNavigateToCatalog = (category = 'all') => {
    setCatalogCategory(category || 'all');
    setActiveTab('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const theme = getTheme(activeThemeId);
  const blocks = currentLayout.blocks || [];
  const hasUnsavedChanges = JSON.stringify({ ...currentLayout, theme: activeThemeId }) !== savedSnapshot;

  // ═══════════════════════════════════════════════════════
  // ACTIONS D'ÉDITION ODOO LIVE
  // ═══════════════════════════════════════════════════════
  const handleSelectBlock = (blockId) => {
    setSelectedBlockId(blockId);
    setSelectedSnippetId(null);
    setEditorTab('style');
  };

  const handleSelectSnippet = (snippetId, blockId) => {
    setSelectedSnippetId(snippetId);
    if (blockId) setSelectedBlockId(blockId);
    setEditorTab('style');
  };

  const handleUpdateSnippet = (blockId, snippetId, updatedProps) => {
    const nextBlocks = blocks.map(b => {
      if (b.id === blockId) {
        const currentInner = Array.isArray(b.props?.innerSnippets) ? b.props.innerSnippets : [];
        const nextInner = currentInner.map(s => s.id === snippetId ? { ...s, ...updatedProps } : s);
        return { ...b, props: { ...b.props, innerSnippets: nextInner } };
      }
      return b;
    });
    const nextLayout = { ...currentLayout, blocks: nextBlocks };
    pushHistory(nextLayout);
  };

  const handleRemoveSnippet = (blockId, snippetId) => {
    const nextBlocks = blocks.map(b => {
      if (b.id === blockId) {
        const currentInner = Array.isArray(b.props?.innerSnippets) ? b.props.innerSnippets : [];
        const nextInner = currentInner.filter(s => s.id !== snippetId);
        return { ...b, props: { ...b.props, innerSnippets: nextInner } };
      }
      return b;
    });
    const nextLayout = { ...currentLayout, blocks: nextBlocks };
    pushHistory(nextLayout);
    if (selectedSnippetId === snippetId) {
      setSelectedSnippetId(null);
    }
  };

  const handleDuplicateSnippet = (blockId, snippetId) => {
    const nextBlocks = blocks.map(b => {
      if (b.id === blockId) {
        const currentInner = Array.isArray(b.props?.innerSnippets) ? b.props.innerSnippets : [];
        const idx = currentInner.findIndex(s => s.id === snippetId);
        if (idx !== -1) {
          const original = currentInner[idx];
          const duplicated = {
            ...original,
            id: `snip-${original.snippetType || 'item'}-${Date.now()}`
          };
          const nextInner = [...currentInner];
          nextInner.splice(idx + 1, 0, duplicated);
          return { ...b, props: { ...b.props, innerSnippets: nextInner } };
        }
      }
      return b;
    });
    const nextLayout = { ...currentLayout, blocks: nextBlocks };
    pushHistory(nextLayout);
  };

  const handleMoveSnippet = (blockId, snippetId, direction) => {
    const nextBlocks = blocks.map(b => {
      if (b.id === blockId) {
        const currentInner = Array.isArray(b.props?.innerSnippets) ? b.props.innerSnippets : [];
        const idx = currentInner.findIndex(s => s.id === snippetId);
        if (idx !== -1) {
          const targetIdx = (direction === 'left' || direction === 'up') ? idx - 1 : idx + 1;
          if (targetIdx >= 0 && targetIdx < currentInner.length) {
            const nextInner = [...currentInner];
            const [moved] = nextInner.splice(idx, 1);
            nextInner.splice(targetIdx, 0, moved);
            return { ...b, props: { ...b.props, innerSnippets: nextInner } };
          }
        }
      }
      return b;
    });
    const nextLayout = { ...currentLayout, blocks: nextBlocks };
    pushHistory(nextLayout);
  };

  const handleAddSnippet = (blockId, snippetDef = null) => {
    const defaultSnippet = snippetDef || {
      id: 'rating',
      name: 'Évaluation',
      type: 'InnerSnippet'
    };
    const nextBlocks = blocks.map(b => {
      if (b.id === blockId) {
        const currentInner = Array.isArray(b.props?.innerSnippets) ? b.props.innerSnippets : [];
        const newSnippet = {
          id: `snip-${defaultSnippet.id}-${Date.now()}`,
          snippetType: defaultSnippet.id,
          type: defaultSnippet.id,
          title: defaultSnippet.name,
          width: '100%',
          alignment: 'stretch',
          spacing: 'normal',
          designVariant: b.props?.designVariant || 'modern_minimal',
          badge: 'Top Tendance',
          ratingScore: '4.9',
          reviewsCount: '142',
          progressPercent: 80
        };
        return { ...b, props: { ...b.props, innerSnippets: [...currentInner, newSnippet] } };
      }
      return b;
    });
    const nextLayout = { ...currentLayout, blocks: nextBlocks };
    pushHistory(nextLayout);
    setEditorTab('style');
  };

  const handleAddBlock = (blockType, insertIndex = null, initialProps = {}) => {
    const blockDef = AVAILABLE_BLOCKS.find(b => b.type === blockType);
    const newBlock = {
      id: `b-${blockType.toLowerCase()}-${Date.now()}`,
      type: blockType,
      visible: true,
      props: {
        ...(blockDef?.defaultProps || {}),
        ...initialProps
      }
    };

    let nextBlocks = [...blocks];
    if (typeof insertIndex === 'number') {
      nextBlocks.splice(insertIndex, 0, newBlock);
    } else {
      nextBlocks.push(newBlock);
    }

    const nextLayout = { ...currentLayout, blocks: nextBlocks };
    pushHistory(nextLayout);
    setSelectedBlockId(newBlock.id);
    setEditorTab('style');
  };

  const handleUpdateBlockProps = (blockId, newProps) => {
    const nextBlocks = blocks.map(b => {
      if (b.id === blockId) {
        return { ...b, props: { ...b.props, ...newProps } };
      }
      return b;
    });
    const nextLayout = { ...currentLayout, blocks: nextBlocks };
    pushHistory(nextLayout);
  };

  const handleDeleteBlock = (blockId) => {
    const nextBlocks = blocks.filter(b => b.id !== blockId);
    const nextLayout = { ...currentLayout, blocks: nextBlocks };
    pushHistory(nextLayout);
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
      setEditorTab('blocks');
    }
  };

  const handleDuplicateBlock = (blockId) => {
    const index = blocks.findIndex(b => b.id === blockId);
    if (index === -1) return;
    const original = blocks[index];
    const duplicated = {
      ...original,
      id: `b-${original.type.toLowerCase()}-${Date.now()}`,
      props: { ...original.props }
    };
    const nextBlocks = [...blocks];
    nextBlocks.splice(index + 1, 0, duplicated);
    const nextLayout = { ...currentLayout, blocks: nextBlocks };
    pushHistory(nextLayout);
    setSelectedBlockId(duplicated.id);
    setEditorTab('style');
  };

  const handleMoveBlock = (blockId, direction) => {
    const index = blocks.findIndex(b => b.id === blockId);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const nextBlocks = [...blocks];
    const [moved] = nextBlocks.splice(index, 1);
    nextBlocks.splice(targetIndex, 0, moved);

    const nextLayout = { ...currentLayout, blocks: nextBlocks };
    pushHistory(nextLayout);
  };

  const handleChangeTheme = (newThemeId) => {
    setActiveThemeId(newThemeId);
    const nextLayout = { ...currentLayout, theme: newThemeId };
    pushHistory(nextLayout);
  };

  const handleChangeShopTemplate = (tmplId) => {
    const nextLayout = { ...currentLayout, shop_template: tmplId };
    pushHistory(nextLayout);
  };

  // Sauvegarder les modifications en base et quitter ou rester en mode édition
  const handleSaveLive = async () => {
    setIsSaving(true);
    try {
      const finalConfig = {
        ...currentLayout,
        theme: activeThemeId,
        updated_at: new Date().toISOString()
      };

      if (updateVendorShop && isOwner) {
        await updateVendorShop({ layout_config: finalConfig });
      }
      await updateShopLayout(shop?.id || shop?.code, finalConfig);

      if (onShopUpdated) {
        onShopUpdated({ ...shop, layout_config: finalConfig });
      }

      setSavedSnapshot(JSON.stringify(finalConfig));
      setSaveToast('Votre vitrine a été enregistrée et publiée avec succès !');
      setTimeout(() => setSaveToast(''), 4000);
    } catch (err) {
      console.error('Erreur sauvegarde live:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardLive = () => {
    const initial = JSON.parse(savedSnapshot);
    setCurrentLayout(initial);
    setActiveThemeId(initial.theme || 'emerald');
    setIsEditMode(false);
  };

  const handleWhatsApp = (phone, name) => {
    const cleanPhone = (phone || '').replace(/\D/g, '');
    const targetPhone = cleanPhone.length === 9 ? `237${cleanPhone}` : cleanPhone;
    const message = encodeURIComponent(`Bonjour ${name || 'la boutique'}, je vous contacte depuis MeetShop.`);
    window.open(`https://wa.me/${targetPhone}?text=${message}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: shop?.name || 'Boutique MeetShop',
        text: `Découvrez la boutique ${shop?.name || ''} sur MeetShop !`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setSaveToast('Lien de la boutique copié !');
      setTimeout(() => setSaveToast(''), 3000);
    }
  };

  const handleApplyGeneratedLayout = (generatedLayout) => {
    pushHistory(generatedLayout);
    if (generatedLayout.theme) {
      setActiveThemeId(generatedLayout.theme);
    }
    updateShopLayout(shop?.id || shop?.code, generatedLayout);
    if (onShopUpdated) onShopUpdated({ ...shop, layout_config: generatedLayout });
    setActiveTab('home');
    setIsEditMode(true);
    setSaveToast('Vitrine générée par le Copilote IA appliquée avec succès !');
    setTimeout(() => setSaveToast(''), 4000);
  };

  // ──── VUE ONGLET DÉDIÉ : CONFIGURATEUR IA (MISTRAL AI) ────
  if (activeTab === 'ai_generator') {
    return (
      <AiStorefrontConfiguratorTab
        shop={shop}
        themeId={activeThemeId}
        onBackToStorefront={() => setActiveTab('home')}
        onApplyGeneratedLayout={handleApplyGeneratedLayout}
      />
    );
  }

  const themeConfig = currentLayout.theme_config || {};

  return (
    <div 
      style={{
        '--theme-primary': theme.hex,
        '--theme-btn-radius': `${themeConfig.btnRadius || 100}px`,
        '--theme-btn-border': `${themeConfig.btnBorderWidth || 2}px`,
        fontFamily: themeConfig.pFont ? `'${themeConfig.pFont}', sans-serif` : undefined
      }}
      className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors ${isEditMode ? 'pt-12' : ''}`}
    >
      
      {/* ═══════════════════════════════════════════════════════
          BARRE SUPÉRIEURE DE L'ÉDITEUR ODOO LIVE (Mode Édition)
         ═══════════════════════════════════════════════════════ */}
      {isEditMode && (
        <OdooTopEditBar
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onUndo={handleUndo}
          onRedo={handleRedo}
          deviceMode={deviceMode}
          onChangeDeviceMode={setDeviceMode}
          activePage={activeTab}
          onChangePage={setActiveTab}
          onOpenAiCopilot={() => setActiveTab('ai_generator')}
          onDiscard={handleDiscardLive}
          onSave={handleSaveLive}
          isSaving={isSaving}
          hasUnsavedChanges={hasUnsavedChanges}
          shopName={shop?.name}
        />
      )}

      {/* ═══════════════════════════════════════════════════════
          BARRE SUPÉRIEURE D'ACCÈS RAPIDE À L'ÉDITEUR (Pour le Commerçant connecté)
         ═══════════════════════════════════════════════════════ */}
      {!isEditMode && isOwner && (
        <div className="bg-[#16181D] text-white px-3 sm:px-6 py-2 flex items-center justify-between border-b border-slate-800 text-xs shadow-md z-30 relative">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-300">
              Espace Propriétaire de {shop?.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('ai_generator')}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Créer avec IA</span>
            </button>

            <button
              type="button"
              onClick={() => setIsEditMode(true)}
              className="px-3.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Modifier la page (Odoo)</span>
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          EN-TÊTE STOREFRONT STANDARD (Mode Visiteur / Navigation)
         ═══════════════════════════════════════════════════════ */}
      {!isEditMode && (
        <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
            
            {/* Gauche : Retour marketplace & Profil */}
            <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
              <button
                onClick={onBackToMarketplace}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shrink-0 cursor-pointer"
                title="Retour à la Marketplace MeetShop"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border ${theme.badge}`}>
                  {shop.logo_url || shop.logo ? (
                    <img src={shop.logo_url || shop.logo} alt={shop.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <span>{shop.name ? shop.name.charAt(0).toUpperCase() : 'B'}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <h1 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white truncate flex items-center gap-1">
                    <span>{shop.name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  </h1>
                </div>
              </div>
            </div>

            {/* Centre : Onglets Odoo (Accueil vs Boutique) */}
            <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-inner">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'home'
                    ? `${theme.badge} shadow-sm scale-102`
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Accueil</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('catalog')}
                className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'catalog'
                    ? `${theme.badge} shadow-sm scale-102`
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Boutique</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-emerald-600 text-white">
                  {shopProductsList.length}
                </span>
              </button>
            </div>

            {/* Droite : WhatsApp & Panier */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleWhatsApp(shop.phone, shop.name)}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${theme.badgeLive}`}
                title="Contacter le vendeur sur WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden md:inline">WhatsApp</span>
              </button>

              {onOpenCart && (
                <button
                  type="button"
                  onClick={onOpenCart}
                  className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  title="Voir le panier"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {totalCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow">
                      {totalCount}
                    </span>
                  )}
                </button>
              )}
            </div>

          </div>
        </header>
      )}

      {/* ═══════════════════════════════════════════════════════
          CORPS PRINCIPAL : MODE ÉDITION VS MODE PUBLIC
         ═══════════════════════════════════════════════════════ */}
      {isEditMode ? (
        /* Mode Édition Odoo Live : Barre d'édition (top-0 h-12) + Canvas plein écran scrollable + Sidebar Droite */
        <div className="fixed inset-0 top-12 z-40 flex overflow-hidden bg-slate-100 dark:bg-slate-950">
          
          {/* Zone Canvas Page */}
          <main tabIndex={0} className={`flex-1 h-full bg-slate-200/70 dark:bg-slate-950 focus:outline-none ${
            deviceMode === 'mobile' ? 'overflow-hidden flex items-center justify-center p-2' : 'overflow-y-auto overscroll-contain py-6 px-2 sm:px-6'
          }`}>
            {activeTab === 'catalog' ? (
              <div className="w-full max-w-6xl mx-auto pb-48 animate-fadeIn">
                <ShopCatalogPage
                  shop={shop}
                  products={shopProductsList}
                  themeId={activeThemeId}
                  designVariant={currentLayout.designVariant || shop?.layout_config?.designVariant || 'modern_minimal'}
                  isEditMode={true}
                  isOwner={isOwner}
                  onAddProduct={handleAddProductDirectly}
                  onDeleteProduct={handleDeleteProductDirectly}
                  onSelectProduct={onSelectProduct}
                  onOpenWhatsApp={handleWhatsApp}
                  initialCategory={catalogCategory}
                  onUpdateCatalogConfig={(catalogConfig) => {
                    const newConfig = { ...currentLayout, catalog_config: catalogConfig };
                    setCurrentLayout(newConfig);
                    updateShopLayout(shop?.id || shop?.code, newConfig);
                    if (onShopUpdated) onShopUpdated({ ...shop, layout_config: newConfig });
                  }}
                  onUpdateTemplate={(tmplId) => {
                    const newConfig = { ...currentLayout, shop_template: tmplId };
                    setCurrentLayout(newConfig);
                    updateShopLayout(shop?.id || shop?.code, newConfig);
                    if (onShopUpdated) onShopUpdated({ ...shop, layout_config: newConfig });
                  }}
                />
              </div>
            ) : (
              <div className={`transition-all duration-300 ${
                deviceMode === 'mobile' ? 'w-full max-w-[440px] flex justify-center' : 'w-full max-w-5xl mx-auto pb-48'
              }`}>
                <OdooLiveCanvasWrapper
                  blocks={blocks}
                  shop={shop}
                  products={shopProductsList}
                  themeId={activeThemeId}
                  selectedBlockId={selectedBlockId}
                  selectedSnippetId={selectedSnippetId}
                  onSelectBlock={handleSelectBlock}
                  onSelectSnippet={handleSelectSnippet}
                  onUpdateSnippet={handleUpdateSnippet}
                  onRemoveSnippet={handleRemoveSnippet}
                  onDuplicateSnippet={handleDuplicateSnippet}
                  onMoveSnippet={handleMoveSnippet}
                  onAddSnippet={handleAddSnippet}
                  onAddBlockAtIndex={handleAddBlock}
                  onMoveBlock={handleMoveBlock}
                  onDuplicateBlock={handleDuplicateBlock}
                  onDeleteBlock={handleDeleteBlock}
                  onUpdateBlockProps={handleUpdateBlockProps}
                  onOpenAiForBlock={(b) => setAiEditingBlock(b)}
                  onSelectProduct={onSelectProduct}
                  onOpenWhatsApp={handleWhatsApp}
                  deviceMode={deviceMode}
                />
              </div>
            )}
          </main>

          {/* Panneau Latéral Droit Odoo */}
          <OdooLiveEditorSidebar
            activeTab={editorTab}
            onChangeTab={setEditorTab}
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            selectedSnippetId={selectedSnippetId}
            onSelectBlock={handleSelectBlock}
            onSelectSnippet={handleSelectSnippet}
            onAddBlock={handleAddBlock}
            onUpdateBlockProps={handleUpdateBlockProps}
            onDeleteBlock={handleDeleteBlock}
            onDuplicateBlock={handleDuplicateBlock}
            onMoveBlock={handleMoveBlock}
            onOpenAiForBlock={(b) => setAiEditingBlock(b)}
            onUpdateSnippet={handleUpdateSnippet}
            onRemoveSnippet={handleRemoveSnippet}
            onDuplicateSnippet={handleDuplicateSnippet}
            onMoveSnippet={handleMoveSnippet}
            themeId={activeThemeId}
            onChangeTheme={handleChangeTheme}
            shopTemplate={currentLayout.shop_template || 'odoo_fashion'}
            onChangeShopTemplate={handleChangeShopTemplate}
            shop={shop}
            themeConfig={currentLayout.theme_config || {}}
            onUpdateThemeConfig={(cfg) => {
              const nextLayout = { ...currentLayout, theme_config: { ...(currentLayout.theme_config || {}), ...cfg } };
              pushHistory(nextLayout);
            }}
          />
        </div>
      ) : (
        /* Mode Visiteur Public & Commerçant : Défilement naturel et fluide 100% de la fenêtre */
        <main className="w-full flex-1 pb-16">
          {activeTab === 'catalog' ? (
            <div className="animate-fadeIn">
              <ShopCatalogPage
                shop={shop}
                products={shopProductsList}
                themeId={activeThemeId}
                designVariant={currentLayout.designVariant || shop?.layout_config?.designVariant || 'modern_minimal'}
                isEditMode={false}
                isOwner={isOwner}
                onAddProduct={handleAddProductDirectly}
                onDeleteProduct={handleDeleteProductDirectly}
                onSelectProduct={onSelectProduct}
                onOpenWhatsApp={handleWhatsApp}
                initialCategory={catalogCategory}
                onUpdateCatalogConfig={(catalogConfig) => {
                  const newConfig = { ...currentLayout, catalog_config: catalogConfig };
                  setCurrentLayout(newConfig);
                  updateShopLayout(shop?.id || shop?.code, newConfig);
                  if (onShopUpdated) onShopUpdated({ ...shop, layout_config: newConfig });
                }}
                onUpdateTemplate={(tmplId) => {
                  const newConfig = { ...currentLayout, shop_template: tmplId };
                  setCurrentLayout(newConfig);
                  updateShopLayout(shop?.id || shop?.code, newConfig);
                  if (onShopUpdated) onShopUpdated({ ...shop, layout_config: newConfig });
                }}
              />
            </div>
          ) : (
            <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6 space-y-2 animate-fadeIn">
              {blocks.map((block) => (
                <BlockRenderer
                  key={block.id}
                  block={block}
                  shop={shop}
                  products={shopProductsList}
                  themeId={activeThemeId}
                  onSelectProduct={onSelectProduct}
                  onOpenWhatsApp={handleWhatsApp}
                  onNavigateToCatalog={handleNavigateToCatalog}
                  isMobilePreview={false}
                />
              ))}
            </div>
          )}
        </main>
      )}

      {/* ═══════════════════════════════════════════════════════
          MODALS COMPLÉMENTAIRES
         ═══════════════════════════════════════════════════════ */}
      
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-5 right-5 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Modal Copilote IA (Re-prompting de bloc sur-mesure) */}
      <AiBlockModifierModal
        block={aiEditingBlock}
        shop={shop}
        themeId={activeThemeId}
        isOpen={Boolean(aiEditingBlock)}
        onClose={() => setAiEditingBlock(null)}
        onApplyModification={(blockId, updatedBlock) => {
          const updatedBlocks = blocks.map(b => b.id === blockId ? updatedBlock : b);
          const nextLayout = { ...currentLayout, blocks: updatedBlocks };
          pushHistory(nextLayout);
          setAiEditingBlock(null);
        }}
      />

      {/* Modal Copilote IA (Génération complète de vitrine) */}
      <AiStorefrontGeneratorModal
        isOpen={isAiStorefrontOpen}
        onClose={() => setIsAiStorefrontOpen(false)}
        shop={shop}
        themeId={activeThemeId}
        onApplyGeneratedLayout={(generatedLayout) => {
          pushHistory(generatedLayout);
          if (generatedLayout.theme) {
            setActiveThemeId(generatedLayout.theme);
          }
          setIsAiStorefrontOpen(false);
          setSaveToast('Vitrine générée par le Copilote IA appliquée !');
          setTimeout(() => setSaveToast(''), 4000);
        }}
      />

    </div>
  );
}
