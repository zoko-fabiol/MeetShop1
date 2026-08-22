import React, { useState } from 'react';
import { 
  X, 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  MapPin, 
  Phone, 
  Download, 
  FileText, 
  Search, 
  Filter, 
  MessageCircle, 
  ExternalLink,
  ChevronRight,
  Store,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { generateOrderPDFReceipt } from '../services/receiptService';
import { openWhatsAppDirect } from '../services/whatsappService';

const STATUS_DETAILS = {
  en_attente: {
    label: 'En attente',
    description: 'Votre commande a été transmise à la boutique',
    step: 1,
    badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    icon: Clock
  },
  preparation: {
    label: 'En préparation',
    description: 'Le commerçant emballe vos articles',
    step: 2,
    badgeClass: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
    icon: Package
  },
  livraison: {
    label: 'En livraison (< 2h)',
    description: 'Le livreur est en route vers votre adresse',
    step: 3,
    badgeClass: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
    icon: Truck
  },
  terminee: {
    label: 'Livrée & Réceptionnée',
    description: 'Colis livré et paiement effectué avec succès',
    step: 4,
    badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    icon: CheckCircle2
  },
  annulee: {
    label: 'Annulée',
    description: 'Cette commande a été annulée',
    step: 0,
    badgeClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
    icon: XCircle
  }
};

export default function OrdersModal({ isOpen, onClose }) {
  const { orders = [] } = useCart();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'active' | 'completed' | 'cancelled'
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  if (!isOpen) return null;

  // Filtrer les commandes selon l'onglet actif et la recherche
  const filteredOrders = orders.filter(order => {
    const status = order.status || 'en_attente';
    
    // Filtrage par statut
    let matchesTab = true;
    if (activeTab === 'active') {
      matchesTab = ['en_attente', 'preparation', 'livraison'].includes(status);
    } else if (activeTab === 'completed') {
      matchesTab = status === 'terminee';
    } else if (activeTab === 'cancelled') {
      matchesTab = status === 'annulee';
    }

    // Filtrage par recherche
    const matchesSearch = 
      order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shopName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items?.some(it => it.name?.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  const activeOrdersCount = orders.filter(o => ['en_attente', 'preparation', 'livraison'].includes(o.status || 'en_attente')).length;
  const completedOrdersCount = orders.filter(o => o.status === 'terminee').length;

  const handleDownloadReceipt = (order) => {
    setDownloadingId(order.id);
    try {
      generateOrderPDFReceipt(order);
    } catch (e) {
      console.error('Erreur génération PDF:', e);
    } finally {
      setTimeout(() => setDownloadingId(null), 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overscroll-contain">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl transition-colors">
        
        {/* ── HEADER MODAL COMMANDES ── */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 dark:text-white text-base sm:text-lg">
                  Mes Commandes & Livraisons
                </h3>
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  {orders.length} au total
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Suivi en temps réel de vos colis, contact boutique et téléchargement des reçus PDF
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── ONGLETS & RECHERCHE ── */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              Toutes ({orders.length})
            </button>

            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'active'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>En cours</span>
              {activeOrdersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                  {activeOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'completed'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              Livrées ({completedOrdersCount})
            </button>

            <button
              onClick={() => setActiveTab('cancelled')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'cancelled'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              Annulées
            </button>
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par article, code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* ── LISTE DES COMMANDES ── */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {filteredOrders.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-slate-50 dark:bg-slate-950/40 border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <ShoppingBag className="w-8 h-8 opacity-70" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                {searchQuery || activeTab !== 'all' ? 'Aucune commande ne correspond à ce filtre' : 'Vous n\'avez aucune commande récente'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Explorez nos boutiques locales certifiées à Douala et Yaoundé et passez commande en direct.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusKey = order.status || 'en_attente';
              const statusInfo = STATUS_DETAILS[statusKey] || STATUS_DETAILS.en_attente;
              const StatusIcon = statusInfo.icon;
              const currentStep = statusInfo.step;
              const shopName = order.shopName || order.items?.[0]?.shopName || 'Boutique MeetShop';
              const shopPhone = order.items?.[0]?.shopPhone || order.items?.[0]?.vendorPhone || '+237699123456';
              const isCompleted = statusKey === 'terminee';

              return (
                <div
                  key={order.id}
                  className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 hover:border-emerald-500/40 transition-all"
                >
                  
                  {/* 1. Entête Commande */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                          #{order.id}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{order.date ? new Date(order.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Date récente'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                        <Store className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Vendu par : <strong className="text-slate-900 dark:text-white">{shopName}</strong></span>
                      </div>
                    </div>

                    {/* Statut & Bouton Reçu PDF */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${statusInfo.badgeClass}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span>{statusInfo.label}</span>
                      </span>

                      {/* BOUTON TÉLÉCHARGER REÇU PDF */}
                      <button
                        type="button"
                        onClick={() => handleDownloadReceipt(order)}
                        disabled={downloadingId === order.id}
                        className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
                          isCompleted
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
                            : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                        title="Télécharger le reçu officiel au format PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{downloadingId === order.id ? 'Génération...' : 'Reçu PDF'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 2. STEPPER DE LIVRAISON (Timeline) */}
                  {statusKey !== 'annulee' && (
                    <div className="py-2 px-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80">
                      <div className="grid grid-cols-4 gap-2 text-center relative">
                        {[
                          { step: 1, label: 'Transmise', sub: 'Sur WhatsApp' },
                          { step: 2, label: 'Préparation', sub: 'En boutique' },
                          { step: 3, label: 'En route', sub: 'Livreur < 2h' },
                          { step: 4, label: 'Livrée', sub: 'Payée' }
                        ].map((s) => {
                          const isDone = currentStep >= s.step;
                          const isCurrent = currentStep === s.step;

                          return (
                            <div key={s.step} className="space-y-1">
                              <div className="flex items-center justify-center">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                  isDone
                                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                } ${isCurrent ? 'ring-4 ring-emerald-500/20' : ''}`}>
                                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                                </div>
                              </div>
                              <div>
                                <p className={`text-[11px] font-bold ${isDone ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                                  {s.label}
                                </p>
                                <p className="text-[9px] text-slate-400 hidden sm:block">
                                  {s.sub}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 3. Articles & Adresse de livraison */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    
                    {/* Liste des articles */}
                    <div className="md:col-span-2 space-y-2">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        Articles dans cette commande ({order.items?.length || 0})
                      </span>
                      <div className="space-y-2">
                        {order.items?.map((item, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center justify-between p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-10 h-10 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0" 
                              />
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 dark:text-white truncate">
                                  {item.name}
                                </p>
                                <p className="text-[11px] text-slate-500">
                                  Quantité : <strong className="text-slate-800 dark:text-slate-200">{item.quantity}</strong>
                                  {item.discountPercent > 0 && (
                                    <span className="ml-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                                      (-{item.discountPercent}% gros)
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>

                            <span className="font-mono font-black text-slate-900 dark:text-white shrink-0">
                              {((item.discountedPrice !== undefined ? item.discountedPrice : (item.price * item.quantity))).toLocaleString('fr-FR')} FCFA
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bloc Adresse & Contact Commerçant */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Adresse de réception</span>
                        </span>
                        <div className="text-slate-600 dark:text-slate-400 text-xs space-y-1">
                          <p><strong className="text-slate-800 dark:text-slate-200">{order.customer?.name}</strong></p>
                          <p>{order.customer?.city || 'Douala'} — {order.customer?.quarter}</p>
                          <p className="font-mono">{order.customer?.phone}</p>
                        </div>
                      </div>

                      {/* Total & Action WhatsApp */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-semibold">Total payé :</span>
                          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                            {Number(order.total || 0).toLocaleString('fr-FR')} FCFA
                          </span>
                        </div>

                        {shopPhone && (
                          <button
                            type="button"
                            onClick={() => openWhatsAppDirect(shopPhone, order.items?.[0]?.name || 'Commande', order.total, shopName)}
                            className="w-full py-2 px-3 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-600 dark:text-emerald-400 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Écrire à {shopName}</span>
                          </button>
                        )}
                      </div>
                    </div>

                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* ── FOOTER MODAL ── */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Livraisons garanties sous 2h à Douala et Yaoundé.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
}
