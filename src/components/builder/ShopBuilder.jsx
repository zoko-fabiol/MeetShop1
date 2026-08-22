import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  MoveUp, 
  MoveDown, 
  Sliders, 
  Sparkles, 
  Zap, 
  Flame, 
  Layers, 
  BookOpen, 
  Clock, 
  Star, 
  MapPin, 
  Save, 
  RotateCcw, 
  Smartphone, 
  Monitor, 
  Check, 
  X,
  Store,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Palette,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  PanelLeftClose,
  PanelLeft,
  Maximize2,
  Minimize2,
  Info,
  HelpCircle,
  MousePointerClick,
  Type,
  MessageCircleQuestion,
  Wand2,
  Bot
} from 'lucide-react';
import { getDefaultLayoutConfig, AVAILABLE_BLOCKS } from '../../config/shopBlocks';
import { THEME_PALETTES, getTheme } from '../../config/themes';
import BlockRenderer from '../shop-blocks/BlockRenderer';
import BlockConfigModal from './BlockConfigModal';
import AddBlockModal from './AddBlockModal';
import AiStorefrontGeneratorModal from './AiStorefrontGeneratorModal';
import AiBlockModifierModal from './AiBlockModifierModal';
import OdooBlocksDrawer from './OdooBlocksDrawer';
import DropZoneIndicator from './DropZoneIndicator';
import BlockActionToolbar from './BlockActionToolbar';

const BLOCK_ICON_MAP = {
  HeroBanner: Sparkles,
  CategoryCatalog: Layers,
  FeaturedProducts: Flame,
  FlashDeal: Zap,
  ContactMap: MapPin,
  CustomerReviews: Star,
  AboutStory: BookOpen,
  OpeningHours: Clock,
  CustomForm: HelpCircle,
  CustomCta: MousePointerClick,
  RichText: Type,
  FaqAccordion: MessageCircleQuestion,
  CustomAiBlock: Sparkles
};

export default function ShopBuilder({ 
  shop, 
  products = [], 
  onSaveLayout, 
  onPreviewPublic 
}) {
  // State for layout configuration (blocks and theme)
  const [layoutConfig, setLayoutConfig] = useState(() => {
    return shop?.layout_config || getDefaultLayoutConfig('emerald', shop);
  });

  const [activeTheme, setActiveTheme] = useState(() => {
    return shop?.layout_config?.theme || 'emerald';
  });

  const [deviceMode, setDeviceMode] = useState('desktop'); // 'desktop' | 'mobile'
  const [editingBlock, setEditingBlock] = useState(null);
  const [aiEditingBlock, setAiEditingBlock] = useState(null);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [isAddBlockOpen, setIsAddBlockOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);

  // Snapshot pour détection des modifications non enregistrées
  const [initialSnapshot, setInitialSnapshot] = useState('');
  const [showExitConfirmDialog, setShowExitConfirmDialog] = useState(false);

  // Sélection & Auto-scroll bi-directionnel entre la prévisualisation et la barre de structure
  const handleSelectBlockFromPreview = (blockId) => {
    setSelectedBlockId(blockId);
    if (isSidebarCollapsed) {
      setIsSidebarCollapsed(false);
    }
    setTimeout(() => {
      const el = document.getElementById(`sidebar-block-${blockId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 60);
  };

  const handleSelectBlockFromSidebar = (blockId) => {
    setSelectedBlockId(blockId);
    setTimeout(() => {
      const el = document.getElementById(`preview-block-${blockId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 60);
  };

  useEffect(() => {
    if (shop?.layout_config) {
      setLayoutConfig(shop.layout_config);
      setActiveTheme(shop.layout_config.theme || 'emerald');
      setInitialSnapshot(JSON.stringify(shop.layout_config));
    } else {
      const defaultLayout = getDefaultLayoutConfig('emerald', shop);
      setLayoutConfig(defaultLayout);
      setInitialSnapshot(JSON.stringify(defaultLayout));
    }
  }, [shop]);

  const currentSnapshot = JSON.stringify({ ...layoutConfig, theme: activeTheme });
  const hasUnsavedChanges = initialSnapshot !== '' && currentSnapshot !== initialSnapshot;

  const theme = getTheme(activeTheme);
  const blocks = layoutConfig.blocks || [];

  // Helper to count published reviews for this shop
  const getShopReviewsCount = () => {
    try {
      const saved = localStorage.getItem(`meetshop_shop_reviews_${shop?.id || shop?.code || 'default'}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.length;
      }
    } catch {}
    return 0;
  };

  // Toggle block visibility
  const handleToggleVisibility = (blockId) => {
    const target = blocks.find(b => b.id === blockId);
    if (target?.type === 'CustomerReviews' && target.visible) {
      const revCount = getShopReviewsCount();
      if (revCount > 0) {
        alert('Ce bloc contient des avis clients vérifiés et ne peut pas être désactivé pour garantir la transparence. Vous pouvez toutefois désactiver les nouveaux avis dans les paramètres du bloc.');
        return;
      }
    }
    const updated = blocks.map(b => b.id === blockId ? { ...b, visible: !b.visible } : b);
    setLayoutConfig(prev => ({ ...prev, blocks: updated }));
  };

  // Move block up/down
  const handleMoveUp = (index) => {
    if (index === 0) return;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setLayoutConfig(prev => ({ ...prev, blocks: updated }));
  };

  const handleMoveDown = (index) => {
    if (index === blocks.length - 1) return;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setLayoutConfig(prev => ({ ...prev, blocks: updated }));
  };

  // Delete block
  const handleDeleteBlock = (blockId) => {
    const target = blocks.find(b => b.id === blockId);
    if (target?.type === 'CustomerReviews') {
      const revCount = getShopReviewsCount();
      if (revCount > 0) {
        alert('Ce bloc contient des avis clients vérifiés et ne peut pas être supprimé. Vous pouvez suspendre la réception de nouveaux avis dans les paramètres du bloc.');
        return;
      }
    }
    if (blocks.length <= 1) {
      alert('Une vitrine doit contenir au moins un bloc.');
      return;
    }
    const updated = blocks.filter(b => b.id !== blockId);
    setLayoutConfig(prev => ({ ...prev, blocks: updated }));
  };

  const [sidebarTab, setSidebarTab] = useState('snippets'); // 'snippets' | 'layers'
  const [isDraggingActive, setIsDraggingActive] = useState(false);

  // Insérer un nouveau bloc à un index précis (Odoo Drop)
  const handleInsertBlockAtIndex = (index, blockDef) => {
    const newBlock = {
      id: `block-${blockDef.type.toLowerCase()}-${Date.now()}`,
      type: blockDef.type,
      visible: true,
      props: { ...(blockDef.defaultProps || {}) }
    };
    const updated = [...blocks];
    updated.splice(index, 0, newBlock);
    setLayoutConfig(prev => ({ ...prev, blocks: updated }));
    setSelectedBlockId(newBlock.id);
  };

  // Traiter un drop (nouveau bloc ou réordonnancement)
  const handleDropBlock = (targetIndex, dropData) => {
    setIsDraggingActive(false);
    if (dropData.isNew) {
      handleInsertBlockAtIndex(targetIndex, dropData.blockDef);
    } else if (dropData.fromIndex !== undefined && dropData.fromIndex !== targetIndex) {
      const updated = [...blocks];
      const [movedBlock] = updated.splice(dropData.fromIndex, 1);
      const adjustedTarget = dropData.fromIndex < targetIndex ? targetIndex - 1 : targetIndex;
      updated.splice(adjustedTarget, 0, movedBlock);
      setLayoutConfig(prev => ({ ...prev, blocks: updated }));
      setSelectedBlockId(movedBlock.id);
    }
  };

  // Dupliquer un bloc à la position index + 1
  const handleDuplicateBlock = (index) => {
    const target = blocks[index];
    if (!target) return;
    const duplicated = {
      ...JSON.parse(JSON.stringify(target)),
      id: `block-${target.type.toLowerCase()}-${Date.now()}`
    };
    const updated = [...blocks];
    updated.splice(index + 1, 0, duplicated);
    setLayoutConfig(prev => ({ ...prev, blocks: updated }));
    setSelectedBlockId(duplicated.id);
  };

  // Add new block from catalog
  const handleAddBlock = (blockDef) => {
    handleInsertBlockAtIndex(blocks.length, blockDef);
    setIsAddBlockOpen(false);
  };

  // Save block properties from standard modal
  const handleSaveBlockProps = (blockId, newProps) => {
    const updated = blocks.map(b => b.id === blockId ? { ...b, props: newProps } : b);
    setLayoutConfig(prev => ({ ...prev, blocks: updated }));
  };

  // Apply AI block modification from Mistral prompt
  const handleApplyAiModification = (blockId, updatedBlock) => {
    const updated = blocks.map(b => b.id === blockId ? updatedBlock : b);
    setLayoutConfig(prev => ({ ...prev, blocks: updated }));
    setSelectedBlockId(blockId);
    setSaveSuccessMsg('Bloc modifié avec succès par le Copilote IA !');
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  // Change shop branding theme
  const handleThemeChange = (newThemeId) => {
    setActiveTheme(newThemeId);
    setLayoutConfig(prev => ({ ...prev, theme: newThemeId }));
  };

  // Reset to default layout
  const handleResetDefault = () => {
    if (window.confirm('Voulez-vous restaurer la disposition recommandée par défaut ?')) {
      const defaultLayout = getDefaultLayoutConfig('emerald', shop);
      setLayoutConfig(defaultLayout);
      setActiveTheme(defaultLayout.theme || 'emerald');
    }
  };

  // Save layout permanently to backend/storage
  const handleSave = async (overrideConfig = null) => {
    try {
      const target = overrideConfig || layoutConfig;
      const finalConfig = {
        ...target,
        theme: target.theme || activeTheme,
        updated_at: new Date().toISOString()
      };
      await onSaveLayout?.(finalConfig);
      setInitialSnapshot(JSON.stringify(finalConfig));
      setShowExitConfirmDialog(false);
      setSaveSuccessMsg('Vitrine boutique enregistrée et publiée avec succès !');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Error saving shop layout:', err);
    }
  };

  // Discard changes
  const handleDiscardChanges = () => {
    if (initialSnapshot) {
      try {
        const parsed = JSON.parse(initialSnapshot);
        setLayoutConfig(parsed);
        setActiveTheme(parsed.theme || 'emerald');
      } catch (e) {}
    }
    setShowExitConfirmDialog(false);
  };

  // Drag and drop handlers
  const handleDragStart = (index) => setDraggedIndex(index);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (dropIndex) => {
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    const updated = [...blocks];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, draggedItem);
    setLayoutConfig(prev => ({ ...prev, blocks: updated }));
    setDraggedIndex(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 dark:bg-slate-950 overflow-hidden relative transition-colors">
      
      {/* Top Toolbar: Theme Selector, Device Toggle & Save Actions */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2.5 z-20 shrink-0 shadow-sm transition-colors">
        
        {/* Left: Branding theme selector & collapse toggle */}
        <div className="flex items-center gap-2">
          
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
              isSidebarCollapsed 
                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-700 shadow-sm'
            }`}
            title={isSidebarCollapsed ? "Afficher les blocs" : "Masquer les blocs pour agrandir"}
          >
            {isSidebarCollapsed ? <PanelLeft className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isSidebarCollapsed ? "Ouvrir Blocs" : "Masquer Blocs"}</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
            {Object.values(THEME_PALETTES).map((pal) => (
              <button
                key={pal.id}
                onClick={() => handleThemeChange(pal.id)}
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-xl flex items-center justify-center transition-all relative ${
                  activeTheme === pal.id ? 'ring-2 ring-emerald-500 dark:ring-white scale-110 shadow-md' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: pal.hex }}
                title={pal.name}
              >
                {activeTheme === pal.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-slate-950"></span>
                )}
              </button>
            ))}
          </div>

          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 hidden xl:inline truncate max-w-[140px]">
            {theme.name.split(' (')[0]}
          </span>

          {/* Badge d'état des modifications non enregistrées */}
          {hasUnsavedChanges && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1.5 animate-pulse">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Modifications non enregistrées</span>
            </span>
          )}
        </div>

        {/* Center: Device Viewport Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              deviceMode === 'desktop' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PC / Bureau</span>
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              deviceMode === 'mobile' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile (375px)</span>
          </button>
        </div>

        {/* Right: Actions & Fullscreen toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Bouton Génération Copilote IA */}
          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-600/25 active:scale-95 transition-all"
            title="Concevoir ou regénérer automatiquement votre vitrine sur-mesure avec le Copilote IA"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Créer avec l'IA</span>
          </button>

          {/* Bouton Générateur IA Odoo */}
          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-sm transition-all cursor-pointer"
            title="Générer ou refondre la boutique avec l'IA Odoo"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden xl:inline">Générateur IA Odoo</span>
          </button>

          {/* Bouton Plein Écran */}
          <button
            onClick={() => setIsFullscreenPreview(true)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-200 dark:border-slate-700 shadow-sm hover:text-slate-900 dark:hover:text-white"
            title="Passer la prévisualisation en plein écran"
          >
            <Maximize2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden md:inline">Plein Écran</span>
          </button>

          <button
            onClick={handleResetDefault}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs"
            title="Réinitialiser la disposition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {onPreviewPublic && (
            <button
              onClick={() => onPreviewPublic(layoutConfig)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Voir Vitrine Client</span>
            </button>
          )}

          {/* Bouton Sauvegarder & Publier */}
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all ${
              hasUnsavedChanges ? 'ring-2 ring-emerald-400 shadow-emerald-500/30 animate-pulse' : ''
            } ${theme.btnPrimary}`}
          >
            <Save className="w-4 h-4" />
            <span>Sauvegarder & Publier</span>
          </button>
        </div>

      </div>

      {/* Success notification banner */}
      {saveSuccessMsg && (
        <div className="bg-emerald-500/20 border-b border-emerald-500/40 text-emerald-700 dark:text-emerald-300 px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-2 animate-fadeIn shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Main Builder Work Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Unified Left Sidebar: Snippets Palette & Layers (Odoo Style) */}
        {!isSidebarCollapsed && (
          <div className="w-full lg:w-80 xl:w-96 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 max-h-[45vh] lg:max-h-none overflow-hidden animate-fadeIn transition-colors z-20 shadow-lg">
            
            {/* Header with 2 Tabs: Snippets vs Structure */}
            <div className="p-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setSidebarTab('snippets')}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  sidebarTab === 'snippets'
                    ? `${theme.pillActive} shadow-sm font-black`
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Snippets & Blocs</span>
              </button>

              <button
                type="button"
                onClick={() => setSidebarTab('layers')}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  sidebarTab === 'layers'
                    ? `${theme.pillActive} shadow-sm font-black`
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Structure ({blocks.length})</span>
              </button>
            </div>

            {/* Tab 1: Snippets / Blocs Catalog */}
            {sidebarTab === 'snippets' ? (
              <OdooBlocksDrawer
                onSelectBlockToInsert={(blockDef) => handleInsertBlockAtIndex(blocks.length, blockDef)}
                onDragStartBlock={() => setIsDraggingActive(true)}
                onDragEndBlock={() => setIsDraggingActive(false)}
                themeId={activeTheme}
                shop={shop}
              />
            ) : (
              /* Tab 2: Structure / Layers */
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="p-3 space-y-2 flex-1 overflow-y-auto">
                  {blocks.map((block, index) => {
                    const Icon = BLOCK_ICON_MAP[block.type] || Sparkles;
                    const isSelected = selectedBlockId === block.id;
                    return (
                      <div
                        key={block.id}
                        id={`sidebar-block-${block.id}`}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(index)}
                        onClick={() => handleSelectBlockFromSidebar(block.id)}
                        className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-2 group cursor-pointer ${
                          isSelected
                            ? `ring-2 ${theme.ring} border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/15 shadow-md scale-[1.02]`
                            : block.visible 
                              ? 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm' 
                              : 'bg-slate-100/60 dark:bg-slate-950/30 border-slate-200 dark:border-slate-900 opacity-50'
                        } ${draggedIndex === index ? 'border-dashed border-emerald-500 scale-95' : ''}`}
                      >
                        {/* Drag Handle & Info */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:group-hover:text-slate-400">
                            <GripVertical className="w-4 h-4" />
                          </div>
                          
                          <div className={`p-2 rounded-xl border ${theme.badge} shrink-0`}>
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="truncate">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                              <span>{block.props?.name || block.type}</span>
                              {isSelected && <span className={`w-1.5 h-1.5 rounded-full ${theme.accentBg}`} />}
                            </h4>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                              {block.props?.title || block.props?.slogan || 'Section configurable'}
                            </p>
                          </div>
                        </div>

                        {/* Actions sur le bloc */}
                        <div className="flex items-center gap-1 shrink-0">
                          {/* Reorder Buttons */}
                          <div className="flex flex-col">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleMoveUp(index); }}
                              disabled={index === 0}
                              className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-20 p-0.5"
                              title="Monter"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleMoveDown(index); }}
                              disabled={index === blocks.length - 1}
                              className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-20 p-0.5"
                              title="Descendre"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Visibility Toggle */}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleToggleVisibility(block.id); }}
                            className={`p-1.5 rounded-lg transition-colors ${
                              block.visible ? 'text-emerald-600 dark:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800' : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400'
                            }`}
                            title={block.visible ? "Masquer" : "Afficher"}
                          >
                            {block.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>

                          {/* Config Button (Standard vs IA) */}
                          {block.type === 'CustomAiBlock' || block.type === 'DynamicCode' || block.type === 'DynamicCodeBlock' ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); setAiEditingBlock(block); }}
                              className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                              title="Modifier ce bloc avec l'IA (Prompt)"
                            >
                              <Bot className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={(e) => { e.stopPropagation(); setEditingBlock(block); }}
                              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Configurer ce bloc"
                            >
                              <Sliders className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Delete Button */}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block.id); }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Supprimer ce bloc"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-[11px] text-slate-500 dark:text-slate-400 text-center flex items-center justify-center gap-1.5 shrink-0">
                  <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Cliquez sur un bloc pour le synchroniser instantanément avec la prévisualisation.</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right Canvas: Live Interactive Preview with Odoo Drag & Drop */}
        <div className="flex-1 bg-slate-200/60 dark:bg-slate-950/70 p-3 sm:p-5 overflow-y-auto flex items-center justify-center transition-colors">
          
          {deviceMode === 'desktop' ? (
            /* Desktop Canvas */
            <div className="w-full max-w-5xl rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 p-4 sm:p-6 shadow-xl transition-all self-start">
              
              {/* Drop Zone Initial (Haut de page) */}
              <DropZoneIndicator
                index={0}
                onDropBlock={handleDropBlock}
                themeId={activeTheme}
                isDraggingActive={isDraggingActive}
              />

              {blocks.map((block, index) => (
                <React.Fragment key={block.id}>
                  <div
                    id={`preview-block-${block.id}`}
                    draggable="true"
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/meetshop-reorder-index', index.toString());
                      e.dataTransfer.effectAllowed = 'move';
                      setIsDraggingActive(true);
                    }}
                    onDragEnd={() => setIsDraggingActive(false)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectBlockFromPreview(block.id);
                    }}
                    className={`relative rounded-3xl transition-all group my-3 ${
                      !block.visible ? 'opacity-40 grayscale border-2 border-dashed border-slate-400' : ''
                    } ${
                      selectedBlockId === block.id
                        ? `ring-4 ${theme.ring} ring-offset-4 ring-offset-slate-100 dark:ring-offset-slate-950 shadow-2xl z-20`
                        : 'hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-700'
                    }`}
                  >
                    {/* Barre d'outils flottante contextuelle Odoo */}
                    <BlockActionToolbar
                      block={block}
                      index={index}
                      totalBlocks={blocks.length}
                      themeId={activeTheme}
                      onEdit={(b) => setEditingBlock(b)}
                      onAiEdit={(b) => setAiEditingBlock(b)}
                      onDuplicate={() => handleDuplicateBlock(index)}
                      onMoveUp={() => handleMoveUp(index)}
                      onMoveDown={() => handleMoveDown(index)}
                      onToggleVisibility={() => handleToggleVisibility(block.id)}
                      onDelete={() => handleDeleteBlock(block.id)}
                    />

                    <BlockRenderer
                      block={block}
                      shop={shop}
                      themeId={activeTheme}
                      products={products}
                      onSelectProduct={() => {}}
                      onOpenWhatsApp={() => {}}
                    />
                  </div>

                  {/* Drop Zone Intermédiaire */}
                  <DropZoneIndicator
                    index={index + 1}
                    onDropBlock={handleDropBlock}
                    themeId={activeTheme}
                    isDraggingActive={isDraggingActive}
                  />
                </React.Fragment>
              ))}

              {blocks.length === 0 && (
                <div className="py-16 text-center text-slate-400 space-y-3">
                  <p className="text-sm font-bold">Votre vitrine ne contient aucun bloc pour le moment.</p>
                  <p className="text-xs">Glissez un bloc depuis le panneau de gauche pour commencer à concevoir votre page.</p>
                </div>
              )}

            </div>
          ) : (
            /* Mobile Device Mockup (Châssis smartphone 100% visible) */
            <div className="w-[385px] max-w-full h-[760px] max-h-[calc(100vh-140px)] rounded-[52px] bg-slate-950 p-[10px] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.7)] border-4 border-slate-700/80 ring-1 ring-white/10 relative my-auto flex flex-col shrink-0 transition-all duration-300">
              
              {/* Boutons latéraux physiques (Power & Volume) */}
              <div className="absolute -left-[7px] top-24 w-[3px] h-10 bg-slate-700 rounded-l-sm" />
              <div className="absolute -left-[7px] top-38 w-[3px] h-10 bg-slate-700 rounded-l-sm" />
              <div className="absolute -right-[7px] top-28 w-[3px] h-14 bg-slate-700 rounded-r-sm" />

              {/* Écran Smartphone */}
              <div className="relative w-full h-full rounded-[42px] bg-white dark:bg-slate-900 overflow-hidden flex flex-col flex-1">
                
                {/* Barre de Statut Supérieure avec Dynamic Island */}
                <div className="h-10 bg-white dark:bg-slate-900 w-full flex items-center justify-between px-6 pt-1 select-none shrink-0 z-30 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 font-mono">09:41</span>
                  
                  {/* Dynamic Island Pill */}
                  <div className="w-24 h-4 bg-black rounded-full flex items-center justify-end px-2 gap-1.5 shadow-inner">
                    <div className="w-2 h-2 rounded-full bg-slate-800 ring-1 ring-slate-700" />
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-slate-800 dark:text-slate-200 font-bold">
                    <span>5G</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Scrollable Mobile Viewport */}
                <div className="flex-1 h-full overflow-y-auto no-scrollbar p-2.5 space-y-3 overscroll-contain bg-slate-50 dark:bg-slate-950">
                  {blocks.filter(b => b.visible).map((block) => (
                    <div
                      key={block.id}
                      id={`preview-block-mobile-${block.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectBlockFromPreview(block.id);
                      }}
                      className={`relative rounded-3xl transition-all cursor-pointer group ${
                        selectedBlockId === block.id
                          ? `ring-4 ${theme.ring} ring-offset-2 ring-offset-slate-950 shadow-2xl z-20`
                          : 'hover:ring-1 hover:ring-slate-300 dark:hover:ring-slate-700'
                      }`}
                    >
                      <BlockRenderer
                        block={block}
                        shop={shop}
                        themeId={activeTheme}
                        products={products}
                        onSelectProduct={() => {}}
                        onOpenWhatsApp={() => {}}
                        isMobilePreview={true}
                      />
                    </div>
                  ))}
                </div>

                {/* Barre Home Indicator Inférieure */}
                <div className="h-6 bg-white dark:bg-slate-900 w-full flex items-center justify-center shrink-0 z-30 border-t border-slate-100 dark:border-slate-800/40">
                  <div className="w-32 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
                </div>

              </div>
            </div>
          )}

        </div>

      </div>

      {/* 🚀 MODE PLEIN ÉCRAN FLUIDE (FULLSCREEN PREVIEW OVERLAY) */}
      {isFullscreenPreview && (
        <div className="fixed inset-0 z-[100] bg-slate-100 dark:bg-slate-950 flex flex-col animate-fadeIn overflow-hidden transition-colors">
          
          {/* Top Floating Fullscreen Header */}
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shadow-xl shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <Store className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Prévisualisation Plein Écran — {shop?.name}</span>
              </div>

              {hasUnsavedChanges && (
                <span className="hidden md:inline-flex px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                  Modifications non enregistrées
                </span>
              )}

              {/* Palette Switcher */}
              <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-950/90 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
                {Object.values(THEME_PALETTES).map((pal) => (
                  <button
                    key={pal.id}
                    onClick={() => handleThemeChange(pal.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      activeTheme === pal.id ? 'ring-2 ring-emerald-500 dark:ring-white scale-110 shadow-md' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: pal.hex }}
                    title={pal.name}
                  />
                ))}
              </div>
            </div>

            {/* Device Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  deviceMode === 'desktop' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">PC / Bureau</span>
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  deviceMode === 'mobile' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile (375px)</span>
              </button>
            </div>

            {/* Fullscreen Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all ${theme.btnPrimary}`}
              >
                <Save className="w-4 h-4" />
                <span>Sauvegarder & Publier</span>
              </button>

              <button
                onClick={() => setIsFullscreenPreview(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
                title="Quitter le mode plein écran (Échap)"
              >
                <Minimize2 className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                <span className="hidden sm:inline">Quitter Plein Écran</span>
              </button>
            </div>
          </div>

          {/* Fullscreen Canvas Content */}
          <div className="flex-1 bg-slate-100 dark:bg-slate-950 overflow-y-auto p-4 sm:p-8 flex items-center justify-center">
            {deviceMode === 'desktop' ? (
              <div className="w-full max-w-6xl rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 sm:p-8 shadow-2xl transition-all self-start mx-auto space-y-4">
                {blocks.filter(b => b.visible).map((block) => (
                  <BlockRenderer
                    key={block.id}
                    block={block}
                    shop={shop}
                    themeId={activeTheme}
                    products={products}
                    onSelectProduct={() => {}}
                    onOpenWhatsApp={() => {}}
                  />
                ))}
              </div>
            ) : (
              /* Fullscreen Smartphone */
              <div className="w-[375px] max-w-full h-[calc(100vh-100px)] max-h-[720px] rounded-[44px] bg-white dark:bg-slate-950 border-[7px] border-slate-300 dark:border-slate-800 shadow-2xl ring-1 ring-slate-400/50 dark:ring-slate-700/60 overflow-hidden relative my-auto flex flex-col shrink-0">
                <div className="h-6 bg-slate-100 dark:bg-slate-950 flex items-center justify-center shrink-0 relative z-20 pt-1 border-b border-slate-200 dark:border-slate-900">
                  <div className="w-24 h-3.5 bg-slate-200 dark:bg-slate-900 rounded-full flex items-center justify-between px-2.5 border border-slate-300 dark:border-slate-800/80 shadow-inner">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-700" />
                    <div className="w-8 h-1 bg-slate-300 dark:bg-slate-800 rounded-full" />
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar p-2.5 space-y-3 overscroll-contain bg-slate-50 dark:bg-slate-950">
                  {blocks.filter(b => b.visible).map((block) => (
                    <BlockRenderer
                      key={block.id}
                      block={block}
                      shop={shop}
                      themeId={activeTheme}
                      products={products}
                      onSelectProduct={() => {}}
                      onOpenWhatsApp={() => {}}
                      isMobilePreview={true}
                    />
                  ))}
                </div>

                <div className="h-4 bg-slate-100 dark:bg-slate-950 flex items-center justify-center shrink-0 relative z-20 pb-1 border-t border-slate-200 dark:border-slate-900">
                  <div className="w-28 h-1 bg-slate-400 dark:bg-slate-700/90 rounded-full" />
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ⚠️ MODAL DE CONFIRMATION DES MODIFICATIONS NON SAUVEGARDÉES */}
      {showExitConfirmDialog && (
        <div className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 sm:p-6 max-w-md w-full space-y-4 text-center shadow-2xl transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto shadow-sm">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-lg">Enregistrer les modifications de la vitrine ?</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                Vous avez apporté des modifications à votre page boutique qui n'ont pas encore été sauvegardées. Voulez-vous les enregistrer pour qu'elles prennent effet ?
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleSave}
                className={`w-full py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg ${theme.btnPrimary}`}
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer & Publier maintenant</span>
              </button>

              <button
                type="button"
                onClick={handleDiscardChanges}
                className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-300 border border-slate-200 dark:border-slate-700 font-bold text-xs transition-colors"
              >
                Ignorer les modifications
              </button>

              <button
                type="button"
                onClick={() => setShowExitConfirmDialog(false)}
                className="w-full py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold"
              >
                Continuer l'édition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Property Inspector Modal */}
      <BlockConfigModal
        block={editingBlock}
        themeId={activeTheme}
        isOpen={Boolean(editingBlock)}
        onClose={() => setEditingBlock(null)}
        onSave={handleSaveBlockProps}
      />

      {/* Add Block Modal */}
      <AddBlockModal
        isOpen={isAddBlockOpen}
        onClose={() => setIsAddBlockOpen(false)}
        onAddBlock={handleAddBlock}
        themeId={activeTheme}
        shop={shop}
      />

      {/* Copilote IA Storefront Architect Modal */}
      <AiStorefrontGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        shop={{ ...shop, layout_config: layoutConfig }}
        onPreviewPublic={onPreviewPublic}
        onSaveLayout={handleSave}
        onApplyGeneratedLayout={(generatedLayout) => {
          setLayoutConfig(generatedLayout);
          if (generatedLayout.theme) {
            setActiveTheme(generatedLayout.theme);
          }
          handleSave(generatedLayout);
          setSaveSuccessMsg('Vitrine générée par le Copilote IA appliquée et enregistrée avec succès !');
          setTimeout(() => setSaveSuccessMsg(''), 4000);
        }}
      />

      {/* Copilote IA Block Modifier Modal (Re-prompting sur-mesure) */}
      <AiBlockModifierModal
        block={aiEditingBlock}
        shop={shop}
        themeId={activeTheme}
        isOpen={Boolean(aiEditingBlock)}
        onClose={() => setAiEditingBlock(null)}
        onApplyModification={handleApplyAiModification}
      />

    </div>
  );
}
