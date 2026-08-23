import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Palette, 
  Sparkles, 
  Layers, 
  Flame, 
  Zap, 
  MapPin, 
  Clock, 
  HelpCircle, 
  MessageSquare, 
  FileText, 
  CheckSquare, 
  Bot, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft,
  ArrowRight,
  Upload, 
  Eye, 
  LayoutGrid, 
  Grid3x3,
  Grid2x2,
  Sliders, 
  ChevronRight, 
  ChevronDown, 
  Check, 
  Star, 
  Share2, 
  Search, 
  Highlighter, 
  BarChart3, 
  Percent, 
  Award, 
  Users, 
  Quote, 
  Code, 
  Calendar, 
  Heart, 
  ShoppingBag, 
  Store,
  Facebook, 
  Instagram,
  Shirt,
  Home,
  Smartphone,
  Cpu,
  Type,
  Maximize2,
  Minimize2,
  Globe,
  Settings,
  SlidersHorizontal,
  ToggleLeft,
  ToggleRight,
  Link,
  ShieldCheck,
  MousePointer,
  Wand2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RotateCcw,
  Move
} from 'lucide-react';
import { THEME_PALETTES_LIST, getTheme } from '../../config/themes';
import { AVAILABLE_BLOCKS, ODOO_SHOP_TEMPLATES } from '../../config/shopBlocks';
import { BLOCK_DESIGN_VARIANTS } from '../../config/blockDesignStyles';
import { 
  SNIPPET_SHAPES, 
  AVATAR_SHAPES, 
  BUTTON_STYLES, 
  SNIPPET_BORDER_STYLES, 
  SNIPPET_SHADOW_STYLES 
} from '../../config/snippetShapes';
import { TEXT_COLOR_SWATCHES } from '../../config/colorTokens';
import { CLOCK_STYLES } from '../../config/clockStyles';
import { BLOCK_DEFAULT_SLOTS, getOrderedSlots, moveSlotInBlock } from '../../config/blockSlots';

// Odoo Inner Snippets List
export const ODOO_INNER_SNIPPETS = [
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare, type: 'InnerSnippet', desc: 'Pilule WhatsApp direct' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, type: 'InnerSnippet', desc: 'Pilule Facebook' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, type: 'InnerSnippet', desc: 'Pilule Instagram' },
  { id: 'tiktok', name: 'TikTok', icon: Flame, type: 'InnerSnippet', desc: 'Pilule TikTok' },
  { id: 'youtube', name: 'YouTube', icon: Zap, type: 'InnerSnippet', desc: 'Pilule YouTube' },
  { id: 'rating', name: 'Évaluation', icon: Star, type: 'InnerSnippet', desc: 'Notes et étoiles clients' },
  { id: 'card', name: 'Card', icon: FileText, type: 'InnerSnippet', desc: 'Boîte de contenu stylisée' },
  { id: 'share', name: 'Partager', icon: Share2, type: 'InnerSnippet', desc: 'Boutons de partage social' },
  { id: 'social_networks', name: 'Réseaux sociaux', icon: Users, type: 'InnerSnippet', desc: 'Liens vers vos profils' },
  { id: 'search', name: 'Rechercher', icon: Search, type: 'InnerSnippet', desc: 'Barre de recherche catalogue' },
  { id: 'highlight', name: 'Surlignage du texte', icon: Highlighter, type: 'InnerSnippet', desc: 'Texte avec accentuation' },
  { id: 'chart', name: 'Graphique', icon: BarChart3, type: 'InnerSnippet', desc: 'Chiffres clés et statistiques' },
  { id: 'progress', name: 'Barre de progression', icon: Percent, type: 'InnerSnippet', desc: 'Objectif de ventes ou stock' },
  { id: 'badge', name: 'Badge', icon: Award, type: 'InnerSnippet', desc: 'Badge de certification' },
  { id: 'badge_cta', name: 'Badge CTA', icon: Sparkles, type: 'InnerSnippet', desc: 'Bouton d\'action avec badge' },
  { id: 'avatars', name: 'Avatars', icon: Users, type: 'InnerSnippet', desc: 'Photos de clients et équipe' },
  { id: 'quote', name: 'Bloc de citation', icon: Quote, type: 'InnerSnippet', desc: 'Témoignage marquant' },
  { id: 'form', name: 'Formulaire', icon: CheckSquare, type: 'InnerSnippet', desc: 'Questionnaire et devis' },
  { id: 'countdown', name: 'Décompte', icon: Zap, type: 'InnerSnippet', desc: 'Compte à rebours promotion' },
  { id: 'embed', name: 'Embed Code', icon: Code, type: 'InnerSnippet', desc: 'Code HTML ou widget externe' },
  { id: 'map', name: 'Carte', icon: MapPin, type: 'InnerSnippet', desc: 'Localisation et repère GPS' },
  { id: 'booking', name: 'Bouton rendez-vous', icon: Calendar, type: 'InnerSnippet', desc: 'Prise de contact rapide' },
  { id: 'donation', name: 'Donation', icon: Heart, type: 'InnerSnippet', desc: 'Soutien ou pourboire' },
  { id: 'cart_button', name: 'Bouton Ajouter au panier', icon: ShoppingBag, type: 'InnerSnippet', desc: 'Bouton de commande direct' }
];

export default function OdooLiveEditorSidebar({
  activeTab = 'blocks', // 'blocks' | 'style' | 'theme'
  onChangeTab,
  activePage = 'home', // 'home' | 'catalog'
  blocks = [],
  selectedBlockId = null,
  selectedSnippetId = null,
  onSelectBlock,
  onSelectSnippet,
  onAddBlock,
  onUpdateBlockProps,
  onDeleteBlock,
  onDuplicateBlock,
  onMoveBlock,
  onOpenAiForBlock,
  onUpdateSnippet,
  onRemoveSnippet,
  onDuplicateSnippet,
  onMoveSnippet,
  themeId = 'emerald',
  onChangeTheme,
  shopTemplate = 'odoo_fashion',
  onChangeShopTemplate,
  shop,
  themeConfig = {},
  onUpdateThemeConfig,
  isMobileDrawerOpen = false,
  onCloseMobileDrawer,
  onOpenAddProduct,
  onSyncCatalogWithAi,
  isAiSyncing = false,
  catalogCardStyle = 'modern',
  onChangeCatalogCardStyle,
  catalogLayoutGrid = 'grid_3',
  onChangeCatalogLayoutGrid
}) {
  const selectedBlock = blocks.find(b => b.id === selectedBlockId);
  const blockDef = selectedBlock ? AVAILABLE_BLOCKS.find(ab => ab.type === selectedBlock.type) : null;
  const currentThemeTokens = getTheme(themeId);

  // Trouver le snippet sélectionné s'il existe
  let activeSnippet = null;
  let activeSnippetHostBlockId = null;
  if (selectedSnippetId && selectedBlock) {
    const foundInSelected = (selectedBlock.props?.innerSnippets || []).find(s => s.id === selectedSnippetId);
    if (foundInSelected) {
      activeSnippet = foundInSelected;
      activeSnippetHostBlockId = selectedBlock.id;
    }
  }
  if (!activeSnippet && selectedSnippetId) {
    for (const b of blocks) {
      const found = (b.props?.innerSnippets || []).find(s => s.id === selectedSnippetId);
      if (found) {
        activeSnippet = found;
        activeSnippetHostBlockId = b.id;
        break;
      }
    }
  }

  // States for Theme Tab sub-sections
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showSnippetPicker, setShowSnippetPicker] = useState(false);
  
  const [pageLayoutMode, setPageLayoutMode] = useState(themeConfig.pageLayout || 'full'); // 'full' | 'boxed'
  const [paragraphFontSize, setParagraphFontSize] = useState(themeConfig.pSize || '16');
  const [paragraphFontFamily, setParagraphFontFamily] = useState(themeConfig.pFont || 'SN Pro');
  const [paragraphFontWeight, setParagraphFontWeight] = useState(themeConfig.pWeight || 'auto');
  const [headingFontSize, setHeadingFontSize] = useState(themeConfig.hSize || '48');
  const [headingFontFamily, setHeadingFontFamily] = useState(themeConfig.hFont || 'Ultra One');
  const [buttonBorderRadius, setButtonBorderRadius] = useState(themeConfig.btnRadius || '100');
  const [buttonBorderWidth, setButtonBorderWidth] = useState(themeConfig.btnBorderWidth || '3');
  const [buttonStylePrimary, setButtonStylePrimary] = useState(themeConfig.btnPrimaryStyle || 'fill');
  const [linkStyle, setLinkStyle] = useState(themeConfig.linkStyle || 'hover_underline');
  const [showHeaderToggle, setShowHeaderToggle] = useState(true);

  // Ajouter un contenu intérieur dans le bloc sélectionné
  const handleAddInnerSnippetToSelectedBlock = (snippetDef) => {
    if (!selectedBlock) {
      onAddBlock?.('InnerSnippet', null, { 
        snippetType: snippetDef.id, 
        designVariant: 'modern_minimal', 
        title: snippetDef.name,
        width: '100%',
        alignment: 'stretch',
        spacing: 'normal'
      });
      return;
    }

    const currentInner = Array.isArray(selectedBlock.props?.innerSnippets) ? selectedBlock.props.innerSnippets : [];
    const newSnippet = {
      id: `snip-${snippetDef.id}-${Date.now()}`,
      snippetType: snippetDef.id,
      type: snippetDef.id,
      title: snippetDef.name,
      width: '100%',
      alignment: 'stretch',
      spacing: 'normal',
      designVariant: selectedBlock.props?.designVariant || 'modern_minimal',
      badge: 'Top Tendance',
      ratingScore: '4.9',
      reviewsCount: '142',
      progressPercent: 80
    };

    const nextInner = [...currentInner, newSnippet];
    onUpdateBlockProps?.(selectedBlock.id, { innerSnippets: nextInner });
    onSelectSnippet?.(newSnippet.id, selectedBlock.id);
    setShowSnippetPicker(false);
  };

  const nestedSnippets = Array.isArray(selectedBlock?.props?.innerSnippets) ? selectedBlock.props.innerSnippets : [];

  const snipData = { ...(activeSnippet?.props || {}), ...(activeSnippet || {}) };
  const snipType = snipData.snippetType || snipData.type || 'item';
  const isSocialPill = ['facebook', 'instagram', 'whatsapp', 'tiktok', 'youtube'].includes(snipType);

  const handleUpdateActiveSnippet = (updatedFields) => {
    if (!activeSnippetHostBlockId || !activeSnippet?.id) return;
    onUpdateSnippet?.(activeSnippetHostBlockId, activeSnippet.id, {
      ...updatedFields,
      props: {
        ...(activeSnippet.props || {}),
        ...updatedFields
      }
    });
  };

  return (
    <>
      {/* ──── OVERLAY BACKDROP POUR MOBILE (Quand le tiroir est ouvert) ──── */}
      {isMobileDrawerOpen && (
        <div 
          onClick={onCloseMobileDrawer}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
          aria-hidden="true"
        />
      )}

      {/* ──── PANNEAU LATÉRAL (DESKTOP) / TIROIR COULISSANT TACTILE (MOBILE) ──── */}
      <aside className={`
        fixed inset-x-0 bottom-0 z-50 max-h-[85vh] h-[85vh] rounded-t-3xl border-t border-slate-700 shadow-2xl bg-[#16181D] text-slate-200 flex flex-col select-none transition-transform duration-300 ease-out
        lg:static lg:w-80 xl:w-[380px] lg:h-full lg:max-h-none lg:rounded-none lg:border-t-0 lg:border-l lg:border-slate-800 lg:z-40 lg:translate-y-0
        ${isMobileDrawerOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
      `}>
        
        {/* ──── EN-TÊTE TIROIR MOBILE AVEC POIGNÉE ET BOUTON FERMER ──── */}
        <div className="lg:hidden flex items-center justify-between px-4 pt-3 pb-2 border-b border-slate-800 bg-[#121418] shrink-0 rounded-t-3xl">
          <div className="flex items-center gap-1.5 text-xs font-black text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Panneau de Personnalisation</span>
          </div>

          <button
            type="button"
            onClick={onCloseMobileDrawer}
            className="px-3 py-1 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-black flex items-center gap-1.5 border border-emerald-500/30 cursor-pointer"
            title="Voir le rendu sur le site"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Voir le site</span>
          </button>
        </div>

        {/* ──── ONGLETS SUPÉRIEURS ODOO (Blocs / Catalogue | Style | Thème) ──── */}
        <div className="flex items-center border-b border-slate-800 bg-[#121418] shrink-0">
          
          {/* Onglet 1 : Blocs (Accueil) OU Catalogue (Boutique) */}
          <button
            type="button"
            onClick={() => onChangeTab('blocks')}
            className={`flex-1 py-3 text-xs font-black flex items-center justify-center gap-1.5 transition-all border-b-2 cursor-pointer ${
              activeTab === 'blocks'
                ? 'border-emerald-500 text-emerald-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            {activePage === 'catalog' ? (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
                <span>Catalogue</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-emerald-500" />
                <span>Blocs</span>
              </>
            )}
          </button>

          {/* Onglet 2 : ✏️ Style */}
          <button
            type="button"
            onClick={() => onChangeTab('style')}
            className={`flex-1 py-3 text-xs font-black flex items-center justify-center gap-1.5 transition-all border-b-2 cursor-pointer ${
              activeTab === 'style'
                ? 'border-emerald-500 text-emerald-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Style</span>
            {(selectedBlock || activeSnippet) && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
          </button>

          {/* Onglet 3 : 🎨 Thème */}
          <button
            type="button"
            onClick={() => onChangeTab('theme')}
            className={`flex-1 py-3 text-xs font-black flex items-center justify-center gap-1.5 transition-all border-b-2 cursor-pointer ${
              activeTab === 'theme'
                ? 'border-emerald-500 text-emerald-400 bg-slate-800/60 font-black'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span>Thème</span>
          </button>

        </div>

        {/* ──── CONTENU DE L'ONGLET SÉLECTIONNÉ ──── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* ═══════════════════════════════════════════════════════
            VUE 1 : CATALOGUE (SI PAGE BOUTIQUE) OU BLOCS (SI ACCUEIL)
           ═══════════════════════════════════════════════════════ */}
        {activeTab === 'blocks' && activePage === 'catalog' && (
          <div className="space-y-5 animate-fadeIn">
            
            {/* 1. ACTIONS RAPIDES DU CATALOGUE */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                Gestion des Produits
              </span>

              <button
                type="button"
                onClick={onOpenAddProduct}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Ajouter un Produit</span>
              </button>

              <button
                type="button"
                onClick={onSyncCatalogWithAi}
                disabled={isAiSyncing}
                className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAiSyncing ? 'animate-spin' : ''}`} />
                <span>{isAiSyncing ? 'Harmonisation IA en cours...' : 'Harmoniser le Design via IA'}</span>
              </button>
            </div>

            {/* 2. DESIGN DES CARTES PRODUITS */}
            <div className="p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800 space-y-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-emerald-400" />
                <span>Style des Cartes Produits</span>
              </span>

              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { id: 'modern', label: '🌟 Moderne & Arrondi', desc: 'Design épuré avec bouton panier flottant' },
                  { id: 'neo_brutalist', label: '⚡ Néo-Brutaliste', desc: 'Bordures nettes, ombres dures et fort contraste' },
                  { id: 'glassmorphism', label: '💎 Glassmorphism', desc: 'Effet verre dépoli moderne et translucide' },
                  { id: 'luxury_minimal', label: '👑 Luxe Épuré', desc: 'Typographie fine, minimalisme haute couture' },
                  { id: 'compact_merchant', label: '📦 Compact Marchand', desc: 'Densité optimale pour gros catalogues' }
                ].map(st => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => onChangeCatalogCardStyle?.(st.id)}
                    className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                      catalogCardStyle === st.id
                        ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold ring-1 ring-emerald-500 shadow-sm'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>{st.label}</span>
                      {catalogCardStyle === st.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{st.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. DISPOSITION DE LA GRILLE */}
            <div className="p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800 space-y-2.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
                <span>Affichage de la Grille</span>
              </span>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'grid_3', label: '3 Colonnes', icon: Grid3x3 },
                  { id: 'grid_2', label: '2 Colonnes', icon: Grid2x2 },
                  { id: 'grid_4', label: '4 Colonnes', icon: LayoutGrid },
                  { id: 'list', label: 'Mode Liste', icon: AlignLeft }
                ].map(gr => (
                  <button
                    key={gr.id}
                    type="button"
                    onClick={() => onChangeCatalogLayoutGrid?.(gr.id)}
                    className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                      catalogLayoutGrid === gr.id
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <gr.icon className="w-3.5 h-3.5" />
                    <span>{gr.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. TEMPLATES BOUTIQUE ODOO */}
            <div className="p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800 space-y-2.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-amber-400" />
                <span>Thème de Boutique Odoo</span>
              </span>

              <div className="grid grid-cols-1 gap-1.5">
                {ODOO_SHOP_TEMPLATES.map(tmpl => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => onChangeShopTemplate?.(tmpl.id)}
                    className={`p-2 rounded-xl text-left transition-all border cursor-pointer flex items-center justify-between ${
                      shopTemplate === tmpl.id
                        ? 'bg-amber-500/15 border-amber-500 text-white font-bold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-200">{tmpl.name}</span>
                      <p className="text-[10px] text-slate-500">{tmpl.description}</p>
                    </div>
                    {shopTemplate === tmpl.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            VUE 1 : BLOCS & SNIPPETS (SI PAGE ACCUEIL)
           ═══════════════════════════════════════════════════════ */}
        {activeTab === 'blocks' && activePage !== 'catalog' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* 1. GRANDS BLOCS STRUCTURELS */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Structure & Sections
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Glisser sur la page</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_BLOCKS.map((ab) => {
                  return (
                    <div
                      key={ab.type}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('application/json', JSON.stringify({
                          isNewBlock: true,
                          blockType: ab.type,
                          initialProps: ab.defaultProps || {}
                        }));
                      }}
                      onClick={() => onAddBlock?.(ab.type)}
                      className="p-3 rounded-2xl bg-[#1D2027] hover:bg-[#252932] border border-slate-800 hover:border-emerald-500/50 text-left transition-all cursor-grab active:cursor-grabbing group shadow-sm flex flex-col justify-between h-24"
                    >
                      <div className="flex items-center justify-between">
                        <span className="p-1.5 rounded-xl bg-slate-800 group-hover:bg-emerald-500/20 text-emerald-400 transition-colors">
                          <Layers className="w-4 h-4" />
                        </span>
                        <Plus className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-white truncate">{ab.name}</h4>
                        <p className="text-[10px] text-slate-400 truncate">{ab.category}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. CONTENUS INTÉRIEURS (SNIPPETS POSITIONNABLES & REDIMENSIONNABLES) */}
            <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Contenus intérieurs
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {selectedBlock ? 'Insérer dans le bloc' : '20+ Éléments'}
                </span>
              </div>

              {selectedBlock && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Cliquez pour insérer directement dans <strong>{selectedBlock.type}</strong></span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                {ODOO_INNER_SNIPPETS.map((snip) => {
                  const Icon = snip.icon;

                  return (
                    <div
                      key={snip.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('application/json', JSON.stringify({
                          isNewBlock: true,
                          blockType: 'InnerSnippet',
                          initialProps: {
                            snippetType: snip.id,
                            designVariant: 'modern_minimal',
                            title: snip.name,
                            width: '100%',
                            alignment: 'stretch',
                            spacing: 'normal',
                            badge: 'Top Tendance',
                            ratingScore: '4.9',
                            reviewsCount: '142',
                            progressPercent: 78
                          }
                        }));
                      }}
                      onClick={() => handleAddInnerSnippetToSelectedBlock(snip)}
                      className="p-2.5 rounded-2xl bg-[#1D2027] hover:bg-[#252932] border border-slate-800 hover:border-emerald-500/50 text-left transition-all cursor-grab active:cursor-grabbing group shadow-sm flex flex-col justify-between h-20"
                      title={snip.desc}
                    >
                      <div className="flex items-center justify-between">
                        <span className="p-1 rounded-lg bg-slate-800 group-hover:bg-emerald-500/20 text-emerald-400 transition-colors">
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        <Plus className="w-3 h-3 text-slate-500 group-hover:text-emerald-400" />
                      </div>
                      <div>
                        <span className="font-bold text-[11px] text-slate-200 block truncate">{snip.name}</span>
                        <span className="text-[9px] text-slate-500 block truncate">{snip.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            VUE 2 : ✏️ STYLE (Inspecteur Bloc & Snippet Actif)
           ═══════════════════════════════════════════════════════ */}
        {activeTab === 'style' && (
          <div className="space-y-5 animate-fadeIn">
            
            {/* Cas A : Un SNIPPET SPÉCIFIQUE est sélectionné */}
            {activeSnippet && activeSnippetHostBlockId ? (
              <div className="space-y-4">
                
                {/* En-tête du snippet sélectionné */}
                <div className="p-3.5 rounded-2xl bg-[#1D2027] border border-emerald-500/40 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-400 block tracking-wider">
                        Contenu Intérieur Actif
                      </span>
                      <h4 className="font-black text-sm text-white">
                        {snipData.label || snipData.title || snipData.name || snipType}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onDuplicateSnippet?.(activeSnippetHostBlockId, activeSnippet.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                        title="Dupliquer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveSnippet?.(activeSnippetHostBlockId, activeSnippet.id)}
                        className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 hover:text-rose-300 cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 🌟 0. CONFIGURATION RÉSEAU SOCIAL & LIEN DIRECT */}
                  {isSocialPill && (
                    <div className="space-y-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                      <span className="text-[11px] font-black uppercase text-emerald-400 block flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Configuration Pilule {snipData.name || snipType}</span>
                      </span>

                      {/* Facebook Link */}
                      {snipType === 'facebook' && (
                        <div>
                          <label className="text-[10px] font-bold text-slate-300 block mb-1">Lien de la page Facebook</label>
                          <input
                            type="url"
                            value={snipData.url || snipData.facebookUrl || ''}
                            onChange={(e) => handleUpdateActiveSnippet({ url: e.target.value, facebookUrl: e.target.value })}
                            placeholder="https://facebook.com/maboutique"
                            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      )}

                      {/* Instagram Username / Link */}
                      {snipType === 'instagram' && (
                        <div>
                          <label className="text-[10px] font-bold text-slate-300 block mb-1">Nom d'utilisateur Instagram ou Lien</label>
                          <input
                            type="text"
                            value={snipData.username || snipData.url || ''}
                            onChange={(e) => handleUpdateActiveSnippet({ username: e.target.value, url: e.target.value })}
                            placeholder="@maboutique ou lien"
                            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      )}

                      {/* WhatsApp Phone */}
                      {snipType === 'whatsapp' && (
                        <div>
                          <label className="text-[10px] font-bold text-slate-300 block mb-1">Numéro WhatsApp de la boutique</label>
                          <input
                            type="tel"
                            value={snipData.phone || shop?.phone || ''}
                            onChange={(e) => handleUpdateActiveSnippet({ phone: e.target.value })}
                            placeholder="694116078"
                            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      )}

                      {/* TikTok Username */}
                      {snipType === 'tiktok' && (
                        <div>
                          <label className="text-[10px] font-bold text-slate-300 block mb-1">Nom d'utilisateur TikTok</label>
                          <input
                            type="text"
                            value={snipData.username || snipData.url || ''}
                            onChange={(e) => handleUpdateActiveSnippet({ username: e.target.value, url: e.target.value })}
                            placeholder="@maboutique"
                            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      )}

                      {/* YouTube Link */}
                      {snipType === 'youtube' && (
                        <div>
                          <label className="text-[10px] font-bold text-slate-300 block mb-1">Lien de la chaîne YouTube</label>
                          <input
                            type="url"
                            value={snipData.url || ''}
                            onChange={(e) => handleUpdateActiveSnippet({ url: e.target.value })}
                            placeholder="https://youtube.com/@maboutique"
                            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      )}

                      {/* Label personnalisable */}
                      <div>
                        <label className="text-[10px] font-bold text-slate-300 block mb-1">Texte affiché sur la pilule</label>
                        <input
                          type="text"
                          value={snipData.label || ''}
                          onChange={(e) => handleUpdateActiveSnippet({ label: e.target.value })}
                          placeholder="Ex: Suivez-nous, @maboutique..."
                          className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                {/* 🌟 POSITIONNEMENT LIBRE 2D (AXES X / Y) */}
                <div className="space-y-3 p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-slate-300 block flex items-center gap-1.5">
                      <Move className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Positionnement 2D (Axes X / Y)</span>
                    </span>
                    {activeSnippet.isFreePositioned && (
                      <button
                        type="button"
                        onClick={() => onUpdateSnippet?.(activeSnippetHostBlockId, activeSnippet.id, { isFreePositioned: false, posX: null, posY: null })}
                        className="text-[9px] text-rose-400 hover:underline cursor-pointer"
                      >
                        Réinitialiser
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                        <span>Axe X (Horizontal)</span>
                        <span className="text-emerald-400 font-bold">{activeSnippet.posX != null ? `${activeSnippet.posX}%` : 'Auto'}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={activeSnippet.posX != null ? activeSnippet.posX : 50}
                        onChange={(e) => onUpdateSnippet?.(activeSnippetHostBlockId, activeSnippet.id, { posX: Number(e.target.value), isFreePositioned: true })}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                        <span>Axe Y (Vertical)</span>
                        <span className="text-emerald-400 font-bold">{activeSnippet.posY != null ? `${activeSnippet.posY}%` : 'Auto'}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={activeSnippet.posY != null ? activeSnippet.posY : 50}
                        onChange={(e) => onUpdateSnippet?.(activeSnippetHostBlockId, activeSnippet.id, { posY: Number(e.target.value), isFreePositioned: true })}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* 🌟 1. REDIMENSIONNEMENT DE LARGEUR (Style Odoo) */}
                <div className="space-y-2.5 p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-slate-300 block">
                      Largeur du Contenu
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">
                      {activeSnippet.width || '100%'}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5">
                    {['25%', '33%', '50%', '75%', '100%'].map((w) => {
                      const isCur = (activeSnippet.width || '100%') === w;
                      return (
                        <button
                          key={w}
                          type="button"
                          onClick={() => onUpdateSnippet?.(activeSnippetHostBlockId, activeSnippet.id, { width: w })}
                          className={`py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            isCur
                              ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {w}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 🌟 2. ALIGNEMENT DU CONTENU */}
                <div className="space-y-2.5 p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800">
                  <span className="text-[11px] font-black uppercase text-slate-300 block">
                    Alignement dans le Bloc
                  </span>

                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'left', name: 'Gauche', icon: AlignLeft },
                      { id: 'center', name: 'Centré', icon: AlignCenter },
                      { id: 'right', name: 'Droite', icon: AlignRight },
                      { id: 'stretch', name: 'Étendu', icon: Maximize2 }
                    ].map((al) => {
                      const Icon = al.icon;
                      const isCur = (activeSnippet.alignment || 'stretch') === al.id;
                      return (
                        <button
                          key={al.id}
                          type="button"
                          onClick={() => onUpdateSnippet?.(activeSnippetHostBlockId, activeSnippet.id, { alignment: al.id })}
                          className={`py-1.5 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                            isCur
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{al.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 🌟 3. ESPACEMENT & PADDING */}
                <div className="space-y-2.5 p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800">
                  <span className="text-[11px] font-black uppercase text-slate-300 block">
                    Marges Intérieures (Padding)
                  </span>

                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'compact', name: 'Compact' },
                      { id: 'normal', name: 'Normal' },
                      { id: 'spacious', name: 'Spacieux' }
                    ].map((sp) => {
                      const isCur = (activeSnippet.spacing || 'normal') === sp.id;
                      return (
                        <button
                          key={sp.id}
                          type="button"
                          onClick={() => onUpdateSnippet?.(activeSnippetHostBlockId, activeSnippet.id, { spacing: sp.id })}
                          className={`py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            isCur
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {sp.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 🌟 4. FORME GÉOMÉTRIQUE DU SNIPPET (6 Formes) */}
                <div className="space-y-2.5 p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-slate-300 block">
                      Forme Géométrique
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">
                      {SNIPPET_SHAPES.find(s => s.id === (activeSnippet.shape || 'rounded_modern'))?.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {SNIPPET_SHAPES.map((sh) => {
                      const isSelected = (activeSnippet.shape || 'rounded_modern') === sh.id;
                      return (
                        <button
                          key={sh.id}
                          type="button"
                          onClick={() => onUpdateSnippet?.(activeSnippetHostBlockId, activeSnippet.id, { shape: sh.id })}
                          className={`p-2 rounded-xl border text-left transition-all text-xs cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span className="block font-bold text-xs truncate">{sh.name}</span>
                          <span className="text-[9px] text-slate-500 block truncate">{sh.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 🌟 5. STYLE DE BORDURE & CONTOUR */}
                <div className="space-y-2.5 p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800">
                  <span className="text-[11px] font-black uppercase text-slate-300 block">
                    Style de Bordure
                  </span>

                  <div className="grid grid-cols-3 gap-1.5">
                    {SNIPPET_BORDER_STYLES.map((bd) => {
                      const isSelected = (activeSnippet.borderStyle || 'solid') === bd.id;
                      return (
                        <button
                          key={bd.id}
                          type="button"
                          onClick={() => onUpdateSnippet?.(activeSnippetHostBlockId, activeSnippet.id, { borderStyle: bd.id })}
                          className={`p-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span className="block truncate">{bd.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 🌟 6. EFFET D'OMBRE & RELIEF */}
                <div className="space-y-2.5 p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800">
                  <span className="text-[11px] font-black uppercase text-slate-300 block">
                    Ombre & Relief
                  </span>

                  <div className="grid grid-cols-2 gap-1.5">
                    {SNIPPET_SHADOW_STYLES.map((sd) => {
                      const isSelected = (activeSnippet.shadowStyle || 'soft') === sd.id;
                      return (
                        <button
                          key={sd.id}
                          type="button"
                          onClick={() => onUpdateSnippet?.(activeSnippetHostBlockId, activeSnippet.id, { shadowStyle: sd.id })}
                          className={`p-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span className="block truncate">{sd.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 🌟 7. SÉLECTEUR DE STYLE DU SNIPPET (5 Thèmes) */}
                <div className="space-y-2.5 p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800">
                  <span className="text-[11px] font-black uppercase text-slate-300 block">
                    Design Visuel Global (5 Thèmes)
                  </span>

                  <div className="space-y-1.5">
                    {BLOCK_DESIGN_VARIANTS.map((dv) => {
                      const isSelected = (activeSnippet.designVariant || 'modern_minimal') === dv.id;
                      return (
                        <button
                          key={dv.id}
                          type="button"
                          onClick={() => onUpdateSnippet?.(activeSnippetHostBlockId, activeSnippet.id, { designVariant: dv.id })}
                          className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between text-xs cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div>
                            <span className="block font-bold text-xs">{dv.name}</span>
                            <span className="text-[10px] text-slate-400 block">{dv.desc}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 🌟 8. COULEURS DU TEXTE DU SNIPPET */}
                <div className="space-y-3 p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800">
                  <span className="text-[11px] font-black uppercase text-slate-300 block">
                    Couleur des Textes
                  </span>

                  {/* Couleur du Titre */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-bold text-slate-400">Couleur du Titre</label>
                      <span className="text-[10px] font-mono text-emerald-400">{activeSnippet.titleColor || 'Auto'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {TEXT_COLOR_SWATCHES.map((sw) => {
                        const isCur = (activeSnippet.titleColor || 'default') === (sw.hex || sw.id);
                        return (
                          <button
                            key={sw.id}
                            type="button"
                            onClick={() => onUpdateSnippet?.(activeSnippetHostBlockId, activeSnippet.id, { titleColor: sw.hex || sw.id })}
                            className={`w-6 h-6 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                              isCur ? 'ring-2 ring-emerald-500 scale-110 border-white' : 'border-slate-700 hover:scale-105'
                            }`}
                            style={{ backgroundColor: sw.hex || '#334155' }}
                            title={sw.name}
                          >
                            {isCur && <Check className="w-3 h-3 text-slate-900 drop-shadow" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Couleur du Sous-Texte */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-bold text-slate-400">Couleur du Texte / Description</label>
                      <span className="text-[10px] font-mono text-emerald-400">{activeSnippet.textColor || 'Auto'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {TEXT_COLOR_SWATCHES.map((sw) => {
                        const isCur = (activeSnippet.textColor || 'default') === (sw.hex || sw.id);
                        return (
                          <button
                            key={sw.id}
                            type="button"
                            onClick={() => onUpdateSnippet?.(activeSnippetHostBlockId, activeSnippet.id, { textColor: sw.hex || sw.id })}
                            className={`w-6 h-6 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                              isCur ? 'ring-2 ring-emerald-500 scale-110 border-white' : 'border-slate-700 hover:scale-105'
                            }`}
                            style={{ backgroundColor: sw.hex || '#334155' }}
                            title={sw.name}
                          >
                            {isCur && <Check className="w-3 h-3 text-slate-900 drop-shadow" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 5. Contenus Textuels du Snippet */}
                <div className="space-y-3 p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800">
                  <span className="text-[11px] font-black uppercase text-slate-400 block">
                    Textes & Paramètres
                  </span>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Titre du snippet</label>
                    <input
                      type="text"
                      value={activeSnippet.title || ''}
                      onChange={(e) => onUpdateSnippet?.(activeSnippetHostBlockId, activeSnippet.id, { title: e.target.value })}
                      placeholder="Ex: Titre du contenu..."
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {activeSnippet.snippetType === 'progress' && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Progression ({activeSnippet.progressPercent || 78}%)</label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={activeSnippet.progressPercent || 78}
                        onChange={(e) => onUpdateSnippet?.(activeSnippetHostBlockId, activeSnippet.id, { progressPercent: Number(e.target.value) })}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                  )}

                  {activeSnippet.snippetType === 'rating' && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Note (sur 5)</label>
                      <input
                        type="text"
                        value={activeSnippet.ratingScore || '4.9'}
                        onChange={(e) => onUpdateSnippet?.(activeSnippetHostBlockId, activeSnippet.id, { ratingScore: e.target.value })}
                        className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                      />
                    </div>
                  )}

                  {activeSnippet.snippetType === 'countdown' && (
                    <div className="pt-2 border-t border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-300">Design de l'Horloge ({CLOCK_STYLES.length} styles)</label>
                        <span className="text-[10px] font-mono text-emerald-400">
                          {CLOCK_STYLES.find(c => c.id === (activeSnippet.clockStyle || 'flip_card'))?.name || 'Flip'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                        {CLOCK_STYLES.map((cs) => {
                          const isSelected = (activeSnippet.clockStyle || 'flip_card') === cs.id;
                          return (
                            <button
                              key={cs.id}
                              type="button"
                              onClick={() => onUpdateSnippet?.(activeSnippetHostBlockId, activeSnippet.id, { clockStyle: cs.id })}
                              className={`p-2 rounded-xl border text-left transition-all text-xs cursor-pointer flex flex-col justify-between ${
                                isSelected
                                  ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold shadow-md'
                                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full mb-1">
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-emerald-400 font-bold">{cs.badge}</span>
                                {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                              </div>
                              <span className="font-bold text-[11px] leading-tight block truncate">{cs.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : selectedBlock ? (
              /* Cas B : Un BLOC STRUCTUREL est sélectionné */
              <div className="space-y-4">
                
                {/* En-tête du bloc inspecté */}
                <div className="p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-400 block tracking-wider">
                      Bloc actif
                    </span>
                    <h4 className="font-black text-sm text-white">{selectedBlock.props?.title || selectedBlock.props?.snippetType || selectedBlock.type}</h4>
                  </div>

                  {/* Actions rapides */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onMoveBlock?.(selectedBlock.id, 'up')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                      title="Monter"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onMoveBlock?.(selectedBlock.id, 'down')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                      title="Descendre"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDuplicateBlock?.(selectedBlock.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                      title="Dupliquer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteBlock?.(selectedBlock.id)}
                      className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 hover:text-rose-300 cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 🌟 1. SÉLECTEUR DES 16 STYLES DE DESIGN DU BLOC */}
                <div className="space-y-2.5 p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-slate-300 block">
                      Style de Design (16 Thèmes)
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">1-Clic</span>
                  </div>

                  <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                    {BLOCK_DESIGN_VARIANTS.map((dv) => {
                      const isSelected = (selectedBlock.props?.designVariant || 'modern_minimal') === dv.id;

                      return (
                        <button
                          key={dv.id}
                          type="button"
                          onClick={() => onUpdateBlockProps?.(selectedBlock.id, { designVariant: dv.id })}
                          className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between text-xs cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div>
                            <span className="block font-bold text-xs">{dv.name}</span>
                            <span className="text-[10px] text-slate-400 block">{dv.desc}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 🌟 2. COULEURS DU TEXTE DU BLOC */}
                <div className="space-y-3 p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800">
                  <span className="text-[11px] font-black uppercase text-slate-300 block">
                    Couleurs de Texte & Contraste
                  </span>

                  {/* Couleur du Titre */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-bold text-slate-400">Couleur du Titre</label>
                      <span className="text-[10px] font-mono text-emerald-400">{selectedBlock.props?.titleColor || 'Auto'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {TEXT_COLOR_SWATCHES.map((sw) => {
                        const isCur = (selectedBlock.props?.titleColor || 'default') === (sw.hex || sw.id);
                        return (
                          <button
                            key={sw.id}
                            type="button"
                            onClick={() => onUpdateBlockProps?.(selectedBlock.id, { titleColor: sw.hex || sw.id })}
                            className={`w-6 h-6 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                              isCur ? 'ring-2 ring-emerald-500 scale-110 border-white' : 'border-slate-700 hover:scale-105'
                            }`}
                            style={{ backgroundColor: sw.hex || '#334155' }}
                            title={sw.name}
                          >
                            {isCur && <Check className="w-3 h-3 text-slate-900 drop-shadow" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Couleur du Texte / Slogan */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-bold text-slate-400">Couleur du Texte / Slogan</label>
                      <span className="text-[10px] font-mono text-emerald-400">{selectedBlock.props?.textColor || 'Auto'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {TEXT_COLOR_SWATCHES.map((sw) => {
                        const isCur = (selectedBlock.props?.textColor || 'default') === (sw.hex || sw.id);
                        return (
                          <button
                            key={sw.id}
                            type="button"
                            onClick={() => onUpdateBlockProps?.(selectedBlock.id, { textColor: sw.hex || sw.id })}
                            className={`w-6 h-6 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                              isCur ? 'ring-2 ring-emerald-500 scale-110 border-white' : 'border-slate-700 hover:scale-105'
                            }`}
                            style={{ backgroundColor: sw.hex || '#334155' }}
                            title={sw.name}
                          >
                            {isCur && <Check className="w-3 h-3 text-slate-900 drop-shadow" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 🌟 2bis. FORME DES PHOTOS & BULLES DU BLOC */}
                <div className="space-y-3 p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-slate-300 block">
                      Forme Photo & Bulles (6 Variantes)
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {AVATAR_SHAPES.find(s => s.id === (selectedBlock.props?.avatarShape || 'squircle'))?.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {AVATAR_SHAPES.map((sh) => {
                      const isSelected = (selectedBlock.props?.avatarShape || 'squircle') === sh.id;
                      return (
                        <button
                          key={sh.id}
                          type="button"
                          onClick={() => onUpdateBlockProps?.(selectedBlock.id, { avatarShape: sh.id })}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                            isSelected
                              ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span className={`w-5 h-5 bg-emerald-600/30 border border-emerald-500 block ${sh.class}`} />
                          <span className="text-[10px] truncate max-w-full">{sh.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 🌟 2ter. STYLE DES BOUTONS DU BLOC */}
                <div className="space-y-3 p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-slate-300 block">
                      Style des Boutons d'Action (5 Variantes)
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {BUTTON_STYLES.find(b => b.id === (selectedBlock.props?.buttonStyle || 'glow_gradient'))?.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {BUTTON_STYLES.map((btn) => {
                      const isSelected = (selectedBlock.props?.buttonStyle || 'glow_gradient') === btn.id;
                      return (
                        <button
                          key={btn.id}
                          type="button"
                          onClick={() => onUpdateBlockProps?.(selectedBlock.id, { buttonStyle: btn.id })}
                          className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span className="text-xs font-bold block truncate">{btn.name}</span>
                          <span className="text-[9px] text-slate-500 block truncate">{btn.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 🔀 2. SECTION ORDRE & DISPOSITION DES ÉLÉMENTS DU BLOC */}
                {BLOCK_DEFAULT_SLOTS[selectedBlock.type] && (
                  <div className="space-y-3 p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase text-slate-300 block">
                        Ordre des Éléments ({BLOCK_DEFAULT_SLOTS[selectedBlock.type].length})
                      </span>
                      {selectedBlock.props?.slotsOrder && (
                        <button
                          type="button"
                          onClick={() => onUpdateBlockProps?.(selectedBlock.id, { slotsOrder: null })}
                          className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold cursor-pointer"
                          title="Réinitialiser l'ordre par défaut"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                          <span>Ordre par défaut</span>
                        </button>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      {getOrderedSlots(selectedBlock.type, selectedBlock.props?.slotsOrder).map((slotId, sIdx) => {
                        const slotDef = BLOCK_DEFAULT_SLOTS[selectedBlock.type].find(s => s.id === slotId) || { id: slotId, label: slotId };
                        const orderedList = getOrderedSlots(selectedBlock.type, selectedBlock.props?.slotsOrder);
                        const isFirst = sIdx === 0;
                        const isLast = sIdx === orderedList.length - 1;

                        return (
                          <div
                            key={slotId}
                            className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2 text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-mono font-bold flex items-center justify-center text-emerald-400 shrink-0">
                                {sIdx + 1}
                              </span>
                              <span className="font-bold text-slate-200 truncate">{slotDef.label}</span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                disabled={isFirst}
                                onClick={() => {
                                  const nextOrder = moveSlotInBlock(orderedList, slotId, 'up');
                                  onUpdateBlockProps?.(selectedBlock.id, { slotsOrder: nextOrder });
                                }}
                                className={`p-1 rounded-lg ${isFirst ? 'opacity-30 cursor-not-allowed text-slate-600' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer'}`}
                                title="Déplacer vers le haut"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>

                              <button
                                type="button"
                                disabled={isLast}
                                onClick={() => {
                                  const nextOrder = moveSlotInBlock(orderedList, slotId, 'down');
                                  onUpdateBlockProps?.(selectedBlock.id, { slotsOrder: nextOrder });
                                }}
                                className={`p-1 rounded-lg ${isLast ? 'opacity-30 cursor-not-allowed text-slate-600' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer'}`}
                                title="Déplacer vers le bas"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 🧩 3. SECTION CONTENUS INTÉRIEURS DU BLOC */}
                <div className="space-y-3 p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-slate-300 block">
                      Contenus Intérieurs ({nestedSnippets.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowSnippetPicker(!showSnippetPicker)}
                      className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Ajouter un contenu</span>
                    </button>
                  </div>

                  {/* Grille de sélection d'un nouveau snippet */}
                  {showSnippetPicker && (
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 grid grid-cols-2 gap-1.5 animate-fadeIn">
                      {ODOO_INNER_SNIPPETS.map((snip) => {
                        const Icon = snip.icon;
                        return (
                          <button
                            key={snip.id}
                            type="button"
                            onClick={() => handleAddInnerSnippetToSelectedBlock(snip)}
                            className="p-1.5 rounded-lg bg-slate-950 hover:bg-emerald-500/20 text-left flex items-center gap-1.5 text-[11px] text-slate-200 hover:text-emerald-400 cursor-pointer"
                          >
                            <Icon className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{snip.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Liste des snippets déjà intégrés */}
                  {nestedSnippets.length === 0 ? (
                    <p className="text-[11px] text-slate-500">
                      Ce bloc ne contient pas encore de contenu intérieur. Cliquez sur "+ Ajouter un contenu" ou glissez un snippet depuis l'onglet Blocs.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {nestedSnippets.map((snip, idx) => (
                        <div 
                          key={snip.id || idx} 
                          onClick={() => onSelectSnippet?.(snip.id, selectedBlock.id)}
                          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-between gap-2 cursor-pointer transition-all"
                        >
                          <div className="min-w-0">
                            <span className="font-bold text-xs text-white block truncate">{snip.title || snip.snippetType}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{snip.width || '100%'} • {snip.snippetType}</span>
                          </div>
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => onRemoveSnippet?.(selectedBlock.id, snip.id)}
                              className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                              title="Supprimer ce contenu"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Textes & Titres du Bloc */}
                <div className="space-y-3 p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800">
                  <span className="text-[11px] font-black uppercase text-slate-400 block">
                    Textes & Titres
                  </span>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Titre</label>
                    <input
                      type="text"
                      value={selectedBlock.props?.title || ''}
                      onChange={(e) => onUpdateBlockProps?.(selectedBlock.id, { title: e.target.value })}
                      placeholder="Ex: Titre du bloc..."
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Sous-titre / Description</label>
                    <textarea
                      value={selectedBlock.props?.subtitle || selectedBlock.props?.slogan || selectedBlock.props?.text || ''}
                      onChange={(e) => onUpdateBlockProps?.(selectedBlock.id, { subtitle: e.target.value, slogan: e.target.value, text: e.target.value })}
                      rows={2}
                      placeholder="Ex: Description ou contenu..."
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* 4. Paramètres Vente Flash & 12 Designs d'Horloge (si FlashDeal) */}
                {selectedBlock.type === 'FlashDeal' && (
                  <div className="space-y-3 p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase text-amber-400 block tracking-wider flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5" />
                        <span>Style d'Horloge ({CLOCK_STYLES.length} Designs)</span>
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">
                        {CLOCK_STYLES.find(c => c.id === (selectedBlock.props?.clockStyle || 'flip_card'))?.name || 'Flip'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                      {CLOCK_STYLES.map((cs) => {
                        const isSelected = (selectedBlock.props?.clockStyle || 'flip_card') === cs.id;
                        return (
                          <button
                            key={cs.id}
                            type="button"
                            onClick={() => onUpdateBlockProps?.(selectedBlock.id, { clockStyle: cs.id })}
                            className={`p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'bg-amber-500/20 border-amber-500 text-white font-bold shadow-md ring-1 ring-amber-500'
                                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full mb-1">
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-amber-400 font-bold">{cs.badge}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                            </div>
                            <span className="font-bold text-[11px] leading-tight block truncate">{cs.name}</span>
                            <span className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">{cs.desc}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Badge Promo & Validité */}
                    <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">Badge Réduction</label>
                        <input
                          type="text"
                          value={selectedBlock.props?.discountBadge || '-25% IMMÉDIAT'}
                          onChange={(e) => onUpdateBlockProps?.(selectedBlock.id, { discountBadge: e.target.value })}
                          placeholder="-25% IMMÉDIAT"
                          className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">Validité (Heures)</label>
                        <input
                          type="number"
                          min="1"
                          max="96"
                          value={selectedBlock.props?.validityHours || 14}
                          onChange={(e) => onUpdateBlockProps?.(selectedBlock.id, { validityHours: Number(e.target.value) })}
                          className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Bouton d'action du Bloc */}
                <div className="space-y-3 p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800">
                  <span className="text-[11px] font-black uppercase text-slate-400 block">
                    Bouton d'action
                  </span>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Texte du bouton</label>
                    <input
                      type="text"
                      value={selectedBlock.props?.ctaText || selectedBlock.props?.buttonText || ''}
                      onChange={(e) => onUpdateBlockProps?.(selectedBlock.id, { ctaText: e.target.value, buttonText: e.target.value })}
                      placeholder="Ex: En savoir plus / Commander"
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

              </div>
            ) : (
              /* Cas C : Rien de sélectionné */
              <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <Edit3 className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-xs text-slate-300">Aucun bloc ou contenu sélectionné</h4>
                <p className="text-[11px] text-slate-500">
                  Cliquez sur n'importe quel bloc ou contenu intérieur sur la page pour inspecter et modifier ses dimensions, position et style en direct.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            VUE 3 : 🎨 THÈME GLOBAL (Fidèle à 100% aux Captures Odoo)
           ═══════════════════════════════════════════════════════ */}
        {activeTab === 'theme' && (
          <div className="space-y-4 animate-fadeIn text-xs">
            
            {/* 1. SECTION SITE WEB */}
            <div className="p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800 space-y-3">
              <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
                Site web
              </span>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold">Couleurs</span>
                <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                  <span className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: currentThemeTokens.hex || '#059669' }} />
                  <span className="w-4 h-4 rounded-full bg-slate-200 shadow-sm" />
                  <span className="w-4 h-4 rounded-full bg-slate-800 shadow-sm" />
                  <span className="w-4 h-4 rounded-full bg-emerald-400 shadow-sm" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold">Thème</span>
                <button
                  type="button"
                  onClick={() => setShowThemeModal(!showThemeModal)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
                >
                  Changer de thème
                </button>
              </div>

              {showThemeModal && (
                <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-700 grid grid-cols-2 gap-1.5 animate-fadeIn">
                  {THEME_PALETTES_LIST.map((pal) => (
                    <button
                      key={pal.id}
                      type="button"
                      onClick={() => {
                        onChangeTheme?.(pal.id);
                        setShowThemeModal(false);
                      }}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                        themeId === pal.id ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: pal.hex }} />
                      <span className="font-bold text-[11px] truncate">{pal.name.split(' (')[0]}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold">Langue</span>
                <select className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1 focus:outline-none cursor-pointer">
                  <option value="fr">Français (FR)</option>
                  <option value="en">English (US)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold">Agencement page</span>
                <select
                  value={pageLayoutMode}
                  onChange={(e) => {
                    setPageLayoutMode(e.target.value);
                    onUpdateThemeConfig?.({ pageLayout: e.target.value });
                  }}
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="full">Complet</option>
                  <option value="boxed">Encadré</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 block">Modèle Page Boutique</span>
                <select
                  value={shopTemplate}
                  onChange={(e) => onChangeShopTemplate?.(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2 font-bold focus:outline-none cursor-pointer"
                >
                  {ODOO_SHOP_TEMPLATES.map((tmpl) => (
                    <option key={tmpl.id} value={tmpl.id}>
                      {tmpl.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. SECTION PARAGRAPHE */}
            <div className="p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800 space-y-2.5">
              <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
                Paragraphe
              </span>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Taille caractères</span>
                <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-xl border border-slate-700">
                  <input
                    type="number"
                    value={paragraphFontSize}
                    onChange={(e) => {
                      setParagraphFontSize(e.target.value);
                      onUpdateThemeConfig?.({ pSize: e.target.value });
                    }}
                    className="w-10 bg-transparent text-white font-bold text-right focus:outline-none"
                  />
                  <span className="text-slate-500 font-mono text-[10px]">px</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Font Family</span>
                <select
                  value={paragraphFontFamily}
                  onChange={(e) => {
                    setParagraphFontFamily(e.target.value);
                    onUpdateThemeConfig?.({ pFont: e.target.value });
                  }}
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-2 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="SN Pro">SN Pro</option>
                  <option value="Inter">Inter</option>
                  <option value="Plus Jakarta">Plus Jakarta</option>
                  <option value="Roboto">Roboto</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Font Weight</span>
                <select
                  value={paragraphFontWeight}
                  onChange={(e) => {
                    setParagraphFontWeight(e.target.value);
                    onUpdateThemeConfig?.({ pWeight: e.target.value });
                  }}
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-2 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="auto">Automatique</option>
                  <option value="400">Normal (400)</option>
                  <option value="500">Medium (500)</option>
                  <option value="700">Gras (700)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Hauteur de ligne</span>
                <span className="font-bold text-white bg-slate-900 px-2 py-1 rounded-xl border border-slate-700">1,5 x</span>
              </div>
            </div>

            {/* 3. SECTION TITRES */}
            <div className="p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800 space-y-2.5">
              <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
                Titres
              </span>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Taille caractères</span>
                <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-xl border border-slate-700">
                  <input
                    type="number"
                    value={headingFontSize}
                    onChange={(e) => {
                      setHeadingFontSize(e.target.value);
                      onUpdateThemeConfig?.({ hSize: e.target.value });
                    }}
                    className="w-10 bg-transparent text-white font-bold text-right focus:outline-none"
                  />
                  <span className="text-slate-500 font-mono text-[10px]">px</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Font Family</span>
                <select
                  value={headingFontFamily}
                  onChange={(e) => {
                    setHeadingFontFamily(e.target.value);
                    onUpdateThemeConfig?.({ hFont: e.target.value });
                  }}
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-2 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="Ultra One">Ultra One</option>
                  <option value="Outfit">Outfit</option>
                  <option value="Playfair">Playfair Display</option>
                  <option value="Montserrat">Montserrat</option>
                </select>
              </div>
            </div>

            {/* 4. SECTION BOUTON */}
            <div className="p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800 space-y-2.5">
              <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
                Bouton
              </span>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Style primaire</span>
                <select
                  value={buttonStylePrimary}
                  onChange={(e) => {
                    setButtonStylePrimary(e.target.value);
                    onUpdateThemeConfig?.({ btnPrimaryStyle: e.target.value });
                  }}
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-2 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="fill">Remplir</option>
                  <option value="gradient">Dégradé</option>
                  <option value="glass">Verre dépoli</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Coins arrondis</span>
                <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-xl border border-slate-700">
                  <input
                    type="number"
                    value={buttonBorderRadius}
                    onChange={(e) => {
                      setButtonBorderRadius(e.target.value);
                      onUpdateThemeConfig?.({ btnRadius: e.target.value });
                    }}
                    className="w-10 bg-transparent text-white font-bold text-right focus:outline-none"
                  />
                  <span className="text-slate-500 font-mono text-[10px]">px</span>
                </div>
              </div>
            </div>

            {/* 5. SECTION LIEN */}
            <div className="p-3.5 rounded-2xl bg-[#1D2027] border border-slate-800 space-y-2.5">
              <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
                Lien
              </span>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Style de lien</span>
                <select
                  value={linkStyle}
                  onChange={(e) => {
                    setLinkStyle(e.target.value);
                    onUpdateThemeConfig?.({ linkStyle: e.target.value });
                  }}
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-2 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="hover_underline">Souligner au survol</option>
                  <option value="always_underline">Toujours souligné</option>
                  <option value="none">Aucun</option>
                </select>
              </div>
            </div>

          </div>
        )}

      </div>

    </aside>
    </>
  );
}
