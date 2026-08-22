import React from 'react';
import { Camera, Search, MapPin, Hash, Sparkles, Navigation, Bot, ShieldCheck } from 'lucide-react';
import { recordSearchQuery } from '../services/analyticsService';

export default function HeroBanner({
  searchQuery,
  setSearchQuery,
  onOpenVisualSearch,
  onOpenShopCode,
  onFilterNearby,
  selectedCity,
  setSelectedCity
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery && searchQuery.trim()) {
      recordSearchQuery(searchQuery, selectedCity);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 pt-6 sm:pt-8 pb-8 sm:pb-10 border-b border-slate-200 dark:border-slate-800 transition-colors">
      
      {/* Halo lumineux d'arrière plan */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-3 sm:px-4 text-center relative z-10">
        
        {/* Badge principal */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-800/80 border border-green-500/30 text-green-700 dark:text-green-400 text-[11px] sm:text-xs font-semibold mb-4 sm:mb-5 shadow-sm max-w-full truncate">
          <Sparkles className="w-3.5 h-3.5 text-green-500 dark:text-green-400 shrink-0" />
          <span className="truncate">#1 MARKETPLACE DE PROXIMITÉ AU CAMEROUN</span>
        </div>

        {/* Grand Titre */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-2 sm:mb-3 leading-tight">
          « <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 dark:from-green-400 dark:via-emerald-300 dark:to-teal-200 bg-clip-text text-transparent">Vise l'objet</span>, trouve la boutique »
        </h1>

        {/* Sous-titre */}
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mb-5 sm:mb-6 leading-relaxed">
          Les meilleures boutiques locales à <strong className="text-slate-900 dark:text-slate-200">Douala & Yaoundé</strong> — Recherche photo instantanée, deals exclusifs et logistique intelligente en moins de 2h.
        </p>

        {/* Barre de Recherche Principale */}
        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mb-4 sm:mb-5">
          <div className="flex items-center bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700/80 rounded-2xl p-1 sm:p-1.5 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 focus-within:border-green-500/60 focus-within:ring-2 focus-within:ring-green-500/20 transition-all">
            
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 ml-2 sm:ml-3 shrink-0" />
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un article, une marque, une boutique..."
              className="w-full bg-transparent border-0 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none min-w-0"
            />

            {/* Bouton Recherche Visuelle par Photo */}
            <button
              type="button"
              onClick={onOpenVisualSearch}
              title="Prendre une photo pour chercher"
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/70 hover:bg-slate-200 dark:hover:bg-slate-700 text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 border border-slate-200 dark:border-slate-600/50 flex items-center gap-1 text-xs font-semibold transition-all shrink-0 mr-1"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Photo</span>
            </button>

            {/* Bouton Chercher */}
            <button
              type="submit"
              className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-xs tracking-wide shadow-md transition-all shrink-0"
            >
              <span className="hidden xs:inline">Chercher</span>
              <Search className="w-3.5 h-3.5 xs:hidden" />
            </button>
          </div>
        </form>

        {/* Badges de Fonctionnalités & Filtres Rapides */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-1 text-xs">
          
          <button
            onClick={onOpenVisualSearch}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30 flex items-center gap-1 font-medium transition-all text-[11px] sm:text-xs shadow-sm"
          >
            <Camera className="w-3.5 h-3.5 text-green-600 dark:text-green-400 shrink-0" />
            <span>Recherche Image IA</span>
          </button>

          <button
            onClick={onFilterNearby}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1 font-medium transition-all text-[11px] sm:text-xs shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
            <span>Autour de moi</span>
          </button>

          <button
            onClick={onOpenShopCode}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1 font-medium transition-all text-[11px] sm:text-xs shadow-sm"
          >
            <Hash className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
            <span># CODE BOUTIQUE</span>
          </button>

          {/* Sélecteur de ville */}
          <div className="flex items-center rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-0.5 text-xs font-semibold shadow-sm">
            <button
              onClick={() => setSelectedCity('all')}
              className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all text-[11px] sm:text-xs ${
                selectedCity === 'all' 
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-bold' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setSelectedCity('Douala')}
              className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all text-[11px] sm:text-xs ${
                selectedCity === 'Douala' ? 'bg-green-600 text-white font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Douala
            </button>
            <button
              onClick={() => setSelectedCity('Yaoundé')}
              className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all text-[11px] sm:text-xs ${
                selectedCity === 'Yaoundé' ? 'bg-green-600 text-white font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Yaoundé
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
