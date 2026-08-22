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
  ShoppingBag
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
  onDiscard,
  onSave,
  isSaving = false,
  hasUnsavedChanges = false,
  shopName = 'Ma Boutique'
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12 bg-[#1B1D23] text-white border-b border-slate-800 flex items-center justify-between px-3 sm:px-6 shadow-xl select-none">
      
      {/* Gauche : Logo Odoo Edit & Nom de la boutique */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-xs font-black tracking-wider text-emerald-400 uppercase hidden sm:inline">
            Éditeur Live Odoo
          </span>
        </div>

        <span className="text-slate-600 hidden sm:inline">|</span>

        <span className="font-bold text-xs text-slate-200 truncate max-w-[120px] sm:max-w-[180px]">
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
            <span className="hidden md:inline">Accueil</span>
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
            <span className="hidden md:inline">Boutique</span>
          </button>
        </div>

        {hasUnsavedChanges && (
          <span className="hidden lg:inline-flex px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
            Non enregistré
          </span>
        )}
      </div>

      {/* Centre : Outils Undo/Redo & Switcher Écran PC/Mobile */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        
        {/* Undo & Redo */}
        <div className="flex items-center gap-0.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
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

        {/* Device Switcher */}
        <div className="flex items-center gap-0.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
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

        {/* Bouton Copilote IA Odoo */}
        <button
          type="button"
          onClick={onOpenAiCopilot}
          className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
          title="Copilote IA Mistral"
        >
          <Bot className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">IA Copilote</span>
        </button>

      </div>

      {/* Droite : Boutons Ignorer & Sauvegarder Odoo */}
      <div className="flex items-center gap-2">
        
        {/* Bouton Ignorer (Discard) */}
        <button
          type="button"
          onClick={onDiscard}
          className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
          title="Quitter sans enregistrer les modifications"
        >
          <X className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ignorer</span>
        </button>

        {/* Bouton Sauvegarder Vert Odoo Proéminent */}
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="px-4 sm:px-5 py-1.5 rounded-xl bg-[#00D084] hover:bg-[#00B875] text-[#111827] font-black text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer"
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
