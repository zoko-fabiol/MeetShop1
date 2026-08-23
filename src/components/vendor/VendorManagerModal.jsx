import React, { useState } from 'react';
import { 
  X, 
  Package, 
  HelpCircle, 
  BarChart3, 
  Store, 
  TrendingUp, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import VendorOrdersTab from './VendorOrdersTab';
import VendorLeadsTab from './VendorLeadsTab';
import VendorStatsTab from './VendorStatsTab';
import { useCart } from '../../context/CartContext';
import { getShopFormLeads } from '../../services/formsService';

export default function VendorManagerModal({
  isOpen,
  onClose,
  shop,
  products = [],
  initialTab = 'orders' // 'orders' | 'leads' | 'stats'
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { orders = [] } = useCart();

  if (!isOpen) return null;

  const shopId = shop?.id || shop?.code;
  const shopOrders = orders.filter(o => o.shopId === shopId || o.shopId === shop?.id || o.shopId === shop?.code);
  const pendingOrdersCount = shopOrders.filter(o => o.status === 'en_attente' || !o.status).length;
  
  const leads = getShopFormLeads(shopId || 'default');
  const newLeadsCount = leads.filter(l => l.status === 'nouveau' || !l.status).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-5xl h-[92vh] max-h-[850px] shadow-2xl flex flex-col overflow-hidden transition-all">
        
        {/* ──── EN-TÊTE PRINCIPAL DU HUB DE GESTION ──── */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-white/95 dark:bg-slate-900/95 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold shadow-sm shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 dark:text-white text-base sm:text-lg tracking-tight">
                  Gestion des Ventes & CRM
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">
                  {shop?.name || 'Ma Boutique'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Suivi des commandes en temps réel, relance des prospects et analyse des performances
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ──── BARRE D'ONGLETS INTUITIVE ──── */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          
          {/* Onglet 1: Commandes */}
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'orders'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Commandes Reçues</span>
            {pendingOrdersCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === 'orders' ? 'bg-white text-emerald-700' : 'bg-emerald-500 text-white'
              }`}>
                {pendingOrdersCount}
              </span>
            )}
          </button>

          {/* Onglet 2: Prospects & Devis */}
          <button
            type="button"
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'leads'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Prospects & Devis</span>
            {newLeadsCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === 'leads' ? 'bg-white text-emerald-700' : 'bg-amber-500 text-white'
              }`}>
                {newLeadsCount}
              </span>
            )}
          </button>

          {/* Onglet 3: Statistiques & Pubs */}
          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'stats'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Statistiques & Pubs</span>
          </button>

        </div>

        {/* ──── CONTENU DE L'ONGLET SÉLECTIONNÉ ──── */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 overscroll-contain">
          {activeTab === 'orders' && (
            <VendorOrdersTab vendor={shop} />
          )}

          {activeTab === 'leads' && (
            <VendorLeadsTab vendor={shop} />
          )}

          {activeTab === 'stats' && (
            <VendorStatsTab vendor={shop} products={products} />
          )}
        </div>

      </div>
    </div>
  );
}
