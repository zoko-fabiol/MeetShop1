import React, { useState } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Search, 
  Filter, 
  ExternalLink,
  ChevronDown,
  Calendar,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { contactCustomerWhatsApp } from '../../services/whatsappService';

const STATUS_CONFIG = {
  en_attente: {
    label: 'En attente',
    badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    icon: Clock
  },
  preparation: {
    label: 'En préparation',
    badgeClass: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
    icon: Package
  },
  livraison: {
    label: 'En livraison (< 2h)',
    badgeClass: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
    icon: Truck
  },
  terminee: {
    label: 'Livrée & Payée',
    badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    icon: CheckCircle2
  },
  annulee: {
    label: 'Annulée',
    badgeClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
    icon: XCircle
  }
};

export default function VendorOrdersTab({ vendor }) {
  const { orders = [] } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filtrer les commandes pour cette boutique
  // Correspondance par shopId, shopCode ou nom de boutique dans les items de la commande
  const shopOrders = orders.filter(order => {
    if (!vendor) return false;
    if (order.shopId && (order.shopId === vendor.id || order.shopId === vendor.code)) return true;
    if (order.shopName && order.shopName.toLowerCase() === (vendor.name || '').toLowerCase()) return true;
    if (order.items && order.items.some(it => 
      (it.shopId && (it.shopId === vendor.id || it.shopId === vendor.code)) ||
      (it.shopName && it.shopName.toLowerCase() === (vendor.name || '').toLowerCase())
    )) return true;
    return false;
  });

  // Filtrer par recherche & statut
  const filteredOrders = shopOrders.filter(order => {
    const matchesStatus = statusFilter === 'all' || (order.status || 'en_attente') === statusFilter;
    const matchesSearch = 
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.phone?.includes(searchTerm) ||
      order.customer?.quarter?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Métriques de vente
  const totalRevenue = shopOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const pendingCount = shopOrders.filter(o => (o.status || 'en_attente') === 'en_attente').length;
  const inDeliveryCount = shopOrders.filter(o => o.status === 'livraison' || o.status === 'preparation').length;
  const completedCount = shopOrders.filter(o => o.status === 'terminee').length;

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    try {
      const storedOrders = JSON.parse(localStorage.getItem('meetshop_orders') || '[]');
      const updated = storedOrders.map(o => {
        if (o.id === orderId) {
          return { ...o, status: newStatus, updated_at: new Date().toISOString() };
        }
        return o;
      });
      localStorage.setItem('meetshop_orders', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* ── BANNIÈRE STATISTIQUES COMMANDES ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Total Encaissé</span>
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
            {totalRevenue.toLocaleString('fr-FR')} <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">FCFA</span>
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">À Préparer</span>
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
            {pendingCount} <span className="text-xs font-medium text-slate-500">colis</span>
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-purple-500/10 border border-purple-500/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">En Livraison</span>
            <Truck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
            {inDeliveryCount} <span className="text-xs font-medium text-slate-500">colis</span>
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Livrées avec succès</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
            {completedCount} <span className="text-xs font-medium text-slate-500">commandes</span>
          </p>
        </div>
      </div>

      {/* ── BARRE D'OUTILS ET FILTRES ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher (Code, Client, N°...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {['all', 'en_attente', 'preparation', 'livraison', 'terminee'].map((statusKey) => (
            <button
              key={statusKey}
              onClick={() => setStatusFilter(statusKey)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === statusKey
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              {statusKey === 'all' ? 'Toutes' : STATUS_CONFIG[statusKey]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── LISTE DES COMMANDES ── */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-slate-950/40 border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <Package className="w-7 h-7" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
            {searchTerm || statusFilter !== 'all' ? 'Aucune commande ne correspond à votre filtre' : 'Aucune commande reçue pour le moment'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Dès qu'un client passe commande de vos articles depuis la marketplace ou votre vitrine, elle s'affichera instantanément ici en temps réel.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const currentStatus = order.status || 'en_attente';
            const statusInfo = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.en_attente;
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={order.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-emerald-500/40 transition-colors"
              >
                {/* En-tête commande */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                      #{order.id}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{order.date ? new Date(order.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Date récente'}</span>
                    </div>
                  </div>

                  {/* Sélecteur de statut de livraison */}
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold border ${statusInfo.badgeClass}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span>{statusInfo.label}</span>
                    </span>

                    <select
                      value={currentStatus}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="en_attente">En attente</option>
                      <option value="preparation">En préparation</option>
                      <option value="livraison">En livraison</option>
                      <option value="terminee">Livrée & Payée</option>
                      <option value="annulee">Annulée</option>
                    </select>
                  </div>
                </div>

                {/* Corps : Détails Client & Produits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Coordonnées Client */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-2 text-xs">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      👤 Coordonnées de Livraison
                    </span>
                    <div className="space-y-1 text-slate-600 dark:text-slate-400">
                      <p><span className="font-semibold text-slate-900 dark:text-white">Nom :</span> {order.customer?.name || 'Client MeetShop'}</p>
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{order.customer?.phone || 'N/A'}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{order.customer?.city || 'Douala'} — {order.customer?.quarter || 'Non précisé'}</span>
                      </p>
                      {order.deliveryNote && (
                        <p className="italic text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-800">
                          "{order.deliveryNote}"
                        </p>
                      )}
                    </div>

                    {/* Bouton WhatsApp Client */}
                    {order.customer?.phone && (
                      <button
                        type="button"
                        onClick={() => contactCustomerWhatsApp(order.customer.phone, order.id, currentStatus, vendor?.name)}
                        className="mt-2 w-full py-2 px-3 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Contacter le client sur WhatsApp</span>
                      </button>
                    )}
                  </div>

                  {/* Articles de la boutique */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between text-xs space-y-2">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block mb-2">
                        📦 Articles Commandés
                      </span>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {order.items?.map((it, idx) => (
                          <div key={idx} className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                            <span className="truncate pr-2">
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">{it.quantity}x</span> {it.name}
                            </span>
                            <span className="font-mono font-bold shrink-0">
                              {((it.discountedPrice !== undefined ? it.discountedPrice : (it.price * it.quantity))).toLocaleString('fr-FR')} FCFA
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total Commande */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">Total Commande :</span>
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                        {Number(order.total || 0).toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
