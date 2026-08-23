import React from 'react';
import { 
  Undo2, 
  Redo2, 
  Monitor, 
  Smartphone, 
  Bot, 
  X, 
  Check, 
  Sparkles, 
  Eye, 
  Save,
  RotateCcw,
  Home,
  ShoppingBag,
  Package,
  Menu,
  SlidersHorizontal
} from 'lucide-react';

export default function OdooTopEditBar({
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  deviceMode = 'desktop', // 'desktop' | 'mobile'
  onChangeDeviceMode,
  activePage = 'home', // 'home' | 'catalog'
  onChangePage,
  onOpenAiCopilot,
  onOpenVendorManager,
  ordersCount = 0,
  leadsCount = 0,
  onDiscard,
  onSave,
  isSaving = false,
  hasUnsavedChanges = false,
  shopName = 'Ma Boutique',
  onToggleMobileDrawer,
  isMobileDrawerOpen = false
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12 bg-[#1B1D23] text-white border-b border-slate-800 flex items-center justify-between px-2 sm:px-6 shadow-xl select-none">
      
      {/* ──── GAUCHE : Bouton Quitter / Logo & Navigation ──── */}
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
        
        {/* Bouton Quitter / Ignorer rapide sur Mobile */}
        <button
          type="button"
          onClick={onDiscard}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 sm:hidden cursor-pointer"
          title="Quitter l'éditeur"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Indicateur Mode Édition */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-xs font-black tracking-wider text-emerald-400 uppercase hidden md:inline">
            Éditeur Live
          </span>
        </div>

        <span className="text-slate-700 hidden md:inline">|</span>

        {/* Nom Boutique (tronqué proprement) */}
        <span className="font-bold text-xs text-slate-200 truncate max-w-[90px] sm:max-w-[150px] md:max-w-[180px]">
          {shopName}
        </span>

        {/* Switcher de Page (Accueil vs Boutique) */}
        <div className="flex items-center gap-0.5 bg-slate-900/90 p-0.5 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => onChangePage?.('home')}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              activePage === 'home' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Éditer la page d'accueil"
          >
            <Home className="w-3 h-3" />
            <span className="hidden sm:inline">Accueil</span>
          </button>
          <button
            type="button"
            onClick={() => onChangePage?.('catalog')}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              activePage === 'catalog' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Éditer la page boutique / catalogue"
          >
            <ShoppingBag className="w-3 h-3" />
            <span className="hidden sm:inline">Boutique</span>
          </button>
        </div>

        {hasUnsavedChanges && (
          <span className="hidden xl:inline-flex px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
            Non enregistré
          </span>
        )}
      </div>

      {/* ──── CENTRE : Outils Undo/Redo & Switcher Écran PC/Mobile ──── */}
      <div className="flex items-center gap-1 sm:gap-2.5">
        
        {/* Undo & Redo */}
        <div className="flex items-center gap-0.5 bg-slate-900/90 p-0.5 sm:p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              canUndo ? 'text-slate-200 hover:text-white hover:bg-slate-800' : 'text-slate-600 cursor-not-allowed'
            }`}
            title="Annuler (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              canRedo ? 'text-slate-200 hover:text-white hover:bg-slate-800' : 'text-slate-600 cursor-not-allowed'
            }`}
            title="Rétablir (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Device Switcher (visible uniquement sur grand écran car sur mobile l'écran est déjà mobile) */}
        <div className="hidden sm:flex items-center gap-0.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => onChangeDeviceMode('desktop')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              deviceMode === 'desktop' ? 'bg-slate-800 text-emerald-400 font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Vue Ordinateur"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onChangeDeviceMode('mobile')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              deviceMode === 'mobile' ? 'bg-slate-800 text-emerald-400 font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Vue Smartphone (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bouton Copilote IA */}
        <button
          type="button"
          onClick={onOpenAiCopilot}
          className="px-2 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
          title="Copilote IA Mistral"
        >
          <Bot className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">IA Copilote</span>
        </button>

        {/* Bouton Hub Ventes & CRM */}
        <button
          type="button"
          onClick={onOpenVendorManager}
          className="px-2 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 active:scale-95 transition-all cursor-pointer relative"
          title="Commandes, Prospects et Statistiques de vente"
        >
          <Package className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden md:inline">Ventes & CRM</span>
          {(ordersCount > 0 || leadsCount > 0) && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>

      </div>

      {/* ──── DROITE : Boutons Ignorer & Sauvegarder ──── */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        
        {/* Bouton Ignorer (Desktop) */}
        <button
          type="button"
          onClick={onDiscard}
          className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
          title="Quitter sans enregistrer les modifications"
        >
          <X className="w-3.5 h-3.5" />
          <span>Ignorer</span>
        </button>

        {/* Bouton Sauvegarder Vert Odoo Proéminent */}
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className={`px-3 sm:px-5 py-1.5 rounded-xl bg-[#00D084] hover:bg-[#00B875] text-[#111827] font-black text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer ${
            hasUnsavedChanges ? 'ring-2 ring-emerald-300 animate-pulse' : ''
          }`}
          title="Sauvegarder et publier les modifications"
        >
          {isSaving ? (
            <span className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          <span>Sauver</span>
        </button>

      </div>

    </header>
  );
}

