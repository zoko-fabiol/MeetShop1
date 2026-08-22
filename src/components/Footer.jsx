import React from 'react';
import { Store, ShoppingBag, Package, HelpCircle, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Footer({ onOpenVendorModal, onOpenOrders, onOpenAllShops }) {
  const { isDark } = useTheme();

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 pt-12 pb-8 text-slate-600 dark:text-slate-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1 : Logo & Mission */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <img
                src={isDark ? "/logo-dark.png" : "/logo-light.png"}
                alt="MeetShop Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="font-extrabold text-lg text-slate-900 dark:text-white">MeetShop</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs max-w-sm leading-relaxed">
              Marketplace social local au Cameroun. Connectez-vous en direct avec les meilleures boutiques de Douala et Yaoundé via notre recherche visuelle IA et livraison express &lt; 2h.
            </p>
            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-500" />
              <span>Paiement sécurisé et contact direct WhatsApp vérifié</span>
            </div>
          </div>

          {/* Col 2 : Navigation Rapide */}
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              Navigation
            </h5>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={onOpenAllShops} className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  BOUTIQUES
                </button>
              </li>
              <li>
                <button onClick={onOpenOrders} className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  MES COMMANDES
                </button>
              </li>
              <li>
                <button onClick={onOpenVendorModal} className="text-green-600 dark:text-green-400 font-bold hover:text-green-700 dark:hover:text-green-300 transition-colors">
                  VENDRE SUR VESTYLE
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 : Support & Contact */}
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              Assistance
            </h5>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <a href="https://wa.me/237699123456" target="_blank" rel="noreferrer" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  Support Client WhatsApp
                </a>
              </li>
              <li>
                <span>Douala : Akwa, Bonanjo, Bonamoussadi</span>
              </li>
              <li>
                <span>Yaoundé : Bastos, Mokolo, Omnisports</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Signature & Copyright */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} MeetShop Marketplace. Tous droits réservés.</p>
          <div className="flex items-center gap-1.5 font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>CAMEROUN EXCELLENCE • 2026</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
