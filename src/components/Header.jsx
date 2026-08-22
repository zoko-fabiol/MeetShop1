import React from 'react';
import { ShoppingBag, Package, Zap, User, Store, ShieldCheck, Sun, Moon, LogOut, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Header({ 
  onOpenCart, 
  onOpenOrders, 
  onOpenProfile, 
  onOpenVendorModal,
  onOpenAuthModal,
  onNavigateHome
}) {
  const { totalCount, liteMode, toggleLiteMode } = useCart();
  const { vendor, firebaseUser, userRole, logout, userProfile } = useAuth();
  const { themeMode, setThemeMode, isDark } = useTheme();

  const isLoggedIn = !!firebaseUser;
  const profileAvatar = userProfile?.photoURL || firebaseUser?.photoURL || (vendor?.logo || vendor?.logo_url);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-3">
        
        {/* Logo & Live Indicator */}
        <div 
          onClick={onNavigateHome}
          className="flex items-center gap-1.5 sm:gap-2 cursor-pointer select-none group shrink-0"
        >
          <img
            src={isDark ? "/logo-dark.png" : "/logo-light.png"}
            alt="MeetShop Logo"
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                MeetShop
              </span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>
            <p className="hidden xs:block text-[8px] sm:text-[9px] font-semibold tracking-wider text-green-600 dark:text-green-400 uppercase -mt-1">
              Live Marketplace
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          
          {/* Sélecteur Thème (uniquement pour les visiteurs non connectés, les utilisateurs connectés l'ont dans leur profil) */}
          {!isLoggedIn && (
            <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 shadow-inner">
              <button
                type="button"
                onClick={() => setThemeMode('light')}
                title="Activer le Mode Clair"
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                  themeMode === 'light'
                    ? 'bg-white text-amber-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Sun className={`w-3.5 h-3.5 ${themeMode === 'light' ? 'text-amber-500' : 'text-slate-400'}`} />
                <span className="hidden md:inline text-[11px]">Clair</span>
              </button>

              <button
                type="button"
                onClick={() => setThemeMode('dark')}
                title="Activer le Mode Sombre"
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                  themeMode === 'dark'
                    ? 'bg-slate-900 text-indigo-300 shadow-sm border border-slate-700/50'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Moon className={`w-3.5 h-3.5 ${themeMode === 'dark' ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span className="hidden md:inline text-[11px]">Sombre</span>
              </button>
            </div>
          )}

          {/* Mode LITE */}
          <button
            onClick={toggleLiteMode}
            title={liteMode ? "Mode Lite Activé" : "Activer le mode Lite"}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              liteMode 
                ? 'bg-amber-500/20 text-amber-500 dark:text-amber-400 border border-amber-500/40' 
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/50'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${liteMode ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
            <span className="hidden md:inline">LITE</span>
          </button>

          {/* Commandes */}
          <button
            onClick={onOpenOrders}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Mes Commandes"
          >
            <Package className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden lg:inline">COMMANDES</span>
          </button>

          {/* Panier */}
          <button
            onClick={onOpenCart}
            className="relative p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/50 transition-colors"
            aria-label="Panier"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-green-600 text-white font-bold text-[10px] sm:text-[11px] flex items-center justify-center shadow-md animate-bounce">
                {totalCount}
              </span>
            )}
          </button>

          {/* ── Avatar / Profil Rond ───────────────────────────────────── */}
          {isLoggedIn ? (
            <button
              onClick={onOpenProfile}
              title="Mon profil"
              className="relative p-0.5 rounded-full ring-2 ring-emerald-500/40 hover:ring-emerald-500 hover:scale-105 active:scale-95 transition-all shadow-sm shrink-0 flex items-center justify-center group"
            >
              {profileAvatar ? (
                <img 
                  src={profileAvatar} 
                  alt={userProfile?.name || 'Profil'} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                  }}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover shadow-inner" 
                />
              ) : (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-500/15 dark:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xs">
                  {userProfile?.name?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
            </button>
          ) : (
            <button
              onClick={() => onOpenAuthModal?.('client', 'signin')}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/50 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
            >
              <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">Connexion</span>
            </button>
          )}

          {/* Bouton Boutique / Vendre */}
          {vendor ? (
            <button
              onClick={onOpenVendorModal}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer active:scale-95"
              title={`Gérer ma boutique ${vendor.name}`}
            >
              <Store className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xs:inline">Ma Boutique</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenAuthModal?.('vendor', 'signup')}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer active:scale-95"
              title="Créer une boutique et vendre sur MeetShop"
            >
              <Store className="w-3.5 h-3.5 shrink-0" />
              <span>Vendre</span>
            </button>
          )}

          {/* Déconnexion (si connecté) */}
          {isLoggedIn && (
            <button
              onClick={logout}
              title="Se déconnecter"
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-900/20 border border-slate-200 dark:border-slate-700/50 hover:border-rose-300 dark:hover:border-rose-800 text-slate-400 hover:text-rose-500 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
