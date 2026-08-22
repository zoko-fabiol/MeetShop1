import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  Store, 
  Send, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Sparkles, 
  Layers, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Check,
  Package
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { calculateWholesaleTier } from '../services/wholesaleService';
import { formatWhatsAppOrder } from '../services/whatsappService';

const CITIES_LIST = [
  'Douala',
  'Yaoundé',
  'Bafoussam',
  'Kribi',
  'Garoua',
  'Bamenda',
  'Buea',
  'Limbe',
  'Maroua',
  'Ngaoundéré',
  'Bertoua',
  'Dschang'
];

export default function CheckoutSummaryModal({ isOpen, onClose }) {
  const { cart, clearCart, addOrder } = useCart();
  const { userProfile, firebaseUser } = useAuth();

  // Coordonnées de livraison
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('Douala');
  const [customerQuarter, setCustomerQuarter] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');

  // Suivi des colis commandés sur WhatsApp
  const [orderedShopKeys, setOrderedShopKeys] = useState([]);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'completed'

  // Initialisation des coordonnées avec le profil enregistré
  useEffect(() => {
    if (isOpen) {
      setCustomerName(userProfile?.name || firebaseUser?.displayName || '');
      setCustomerPhone(userProfile?.phone || '');
      setCustomerCity(userProfile?.city || 'Douala');
      setCustomerQuarter(userProfile?.quarter || '');
      setOrderedShopKeys([]);
      setActiveTab('summary');
    }
  }, [isOpen, userProfile, firebaseUser]);

  if (!isOpen || !cart.length) return null;

  // ── GROUPEMENT DES ARTICLES PAR BOUTIQUE ──────────────────────────────
  const shopGroups = {};
  cart.forEach(item => {
    const key = item.shopId || item.shopCode || item.shopName || 'Boutique MeetShop';
    if (!shopGroups[key]) {
      shopGroups[key] = {
        key,
        shopId: item.shopId || item.shopCode || key,
        shopName: item.shopName || key,
        shopPhone: item.shopPhone || item.vendorPhone || '+237699123456',
        shopCity: item.shopCity || 'Douala',
        shopLogo: item.shopLogo || null,
        items: [],
        subtotal: 0
      };
    }

    const tier = calculateWholesaleTier(item, item.quantity);
    const itemTotal = tier.totalPrice;
    shopGroups[key].items.push({
      ...item,
      tier,
      discountedPrice: itemTotal,
      discountPercent: tier.discountPercent
    });
    shopGroups[key].subtotal += itemTotal;
  });

  const shopKeysList = Object.keys(shopGroups);
  const isMultiShop = shopKeysList.length > 1;
  const grandTotal = Object.values(shopGroups).reduce((acc, g) => acc + g.subtotal, 0);

  // Validation formulaire livraison
  const isCustomerInfoValid = () => {
    return customerName.trim().length > 0 && customerPhone.trim().length > 0 && customerQuarter.trim().length > 0;
  };

  // ── COMMANDER UN COLIS DÉDIÉ AUPRÈS D'UNE BOUTIQUE ─────────────────────
  const handleOrderSingleShop = (group, packageIndex) => {
    if (!isCustomerInfoValid()) {
      alert('Veuillez renseigner votre nom, téléphone et quartier de livraison avant de commander.');
      return;
    }

    const customerData = {
      name: customerName,
      phone: customerPhone,
      city: customerCity,
      quarter: customerQuarter
    };

    const orderId = `CMD-${Date.now().toString().slice(-6)}`;

    const orderData = {
      id: orderId,
      shopId: group.shopId,
      shopName: group.shopName,
      items: group.items,
      total: group.subtotal,
      customer: customerData,
      deliveryNote,
      date: new Date().toISOString(),
      status: 'en_attente'
    };

    // 1. Enregistrer dans la base locale/Supabase (alimente instantanément l'onglet Commandes du dashboard de cette boutique)
    addOrder(orderData);

    // 2. Générer le lien WhatsApp dédié à ce vendeur
    const { url } = formatWhatsAppOrder({
      items: group.items,
      total: group.subtotal,
      customer: customerData,
      deliveryNote,
      targetShopName: group.shopName,
      targetShopPhone: group.shopPhone,
      packageIndex: isMultiShop ? packageIndex : null,
      totalPackages: isMultiShop ? shopKeysList.length : 1,
      orderId
    });

    // 3. Ouvrir WhatsApp
    window.open(url, '_blank');

    // 4. Marquer ce colis comme envoyé
    const nextOrdered = [...new Set([...orderedShopKeys, group.key])];
    setOrderedShopKeys(nextOrdered);

    // Si tous les colis ont été commandés
    if (nextOrdered.length === shopKeysList.length) {
      setTimeout(() => {
        clearCart();
        setActiveTab('completed');
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overscroll-contain">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl transition-colors">
        
        {/* ── HEADER MODAL RÉCAPITULATIF ── */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 dark:text-white text-base sm:text-lg">
                  Récapitulatif de Commande
                </h3>
                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${
                  isMultiShop 
                    ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                    : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                }`}>
                  {isMultiShop ? `${shopKeysList.length} Boutiques distinctes` : '1 Boutique Unique'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isMultiShop 
                  ? 'Vos articles sont séparés par boutique pour une livraison indépendante et rapide'
                  : 'Tous vos articles proviennent de la même boutique'}
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

        {/* ── CONTENU DU RÉCAPITULATIF ── */}
        {activeTab === 'completed' ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-4 animate-fadeIn my-auto">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg border border-emerald-500/30 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Commandes Transmises avec Succès !
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
              Les messages WhatsApp ont été générés pour chaque commerçant. Vos commandes sont désormais visibles en direct dans leurs tableaux de bord.
            </p>
            <div className="pt-3">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 active:scale-95 transition-all"
              >
                Retourner sur la Marketplace
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
            
            {/* ── FORMULAIRE DE LIVRAISON CLIENT ── */}
            <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-white">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Coordonnées de Livraison Express (&lt; 2h)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nom & Prénom *
                  </label>
                  <input
                    type="text"
                    placeholder="Votre nom complet"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Numéro WhatsApp / Téléphone *
                  </label>
                  <input
                    type="tel"
                    placeholder="Ex: 699123456"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ville au Cameroun *
                  </label>
                  <select
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {CITIES_LIST.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Quartier / Repère précis *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Akwa (Face pharmacie), Bastos..."
                    value={customerQuarter}
                    onChange={(e) => setCustomerQuarter(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Remarque ou consigne de livraison (facultatif)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Appelez avant d'arriver, livraison à l'étage..."
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* ── SÉPARATION PAR COLIS / BOUTIQUES ── */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-emerald-500" />
                  <span>Détail des Colis ({shopKeysList.length})</span>
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Total Panier : <strong className="text-emerald-600 dark:text-emerald-400 text-sm font-black">{grandTotal.toLocaleString('fr-FR')} FCFA</strong>
                </span>
              </div>

              {shopKeysList.map((shopKey, index) => {
                const group = shopGroups[shopKey];
                const isOrdered = orderedShopKeys.includes(shopKey);

                return (
                  <div 
                    key={shopKey}
                    className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                      isOrdered 
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/40'
                    }`}
                  >
                    {/* En-tête Colis / Boutique */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-black text-sm shrink-0 overflow-hidden shadow-inner">
                          {group.shopLogo ? (
                            <img src={group.shopLogo} alt={group.shopName} className="w-full h-full object-cover" />
                          ) : (
                            group.shopName.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                              Colis {index + 1}/{shopKeysList.length}
                            </span>
                            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                              {group.shopName}
                            </h4>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{group.shopCity}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{group.shopPhone}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Statut du colis */}
                      <div>
                        {isOrdered ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                            <Check className="w-3.5 h-3.5" />
                            <span>Transmis sur WhatsApp</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                            <Clock className="w-3.5 h-3.5" />
                            <span>En attente d'envoi</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Liste des articles du colis */}
                    <div className="py-3 space-y-2">
                      {group.items.map((item) => (
                        <div 
                          key={item.id}
                          className="flex items-center justify-between gap-3 text-xs py-1"
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
                              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                                <span>Quantité : <strong className="text-slate-800 dark:text-slate-200">{item.quantity}</strong></span>
                                {item.discountPercent > 0 && (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                    (-{item.discountPercent}% gros)
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-mono font-black text-slate-900 dark:text-white block">
                              {item.discountedPrice.toLocaleString('fr-FR')} FCFA
                            </span>
                            {item.discountPercent > 0 && (
                              <span className="text-[10px] text-slate-400 line-through">
                                {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer Colis avec Bouton WhatsApp Dédié */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                          Sous-total {group.shopName} :
                        </span>
                        <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                          {group.subtotal.toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOrderSingleShop(group, index + 1)}
                        className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 ${
                          isOrdered
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>
                          {isOrdered ? 'Renvoyer sur WhatsApp' : `Commander chez ${group.shopName}`}
                        </span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ── FOOTER GLOBAL DU MODAL ── */}
        {activeTab !== 'completed' && (
          <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950/90 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Paiement sécurisé à la réception auprès de chaque livreur.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all"
              >
                Modifier le panier
              </button>

              {isMultiShop && (
                <button
                  type="button"
                  onClick={() => {
                    if (!isCustomerInfoValid()) {
                      alert('Veuillez renseigner votre nom, téléphone et quartier de livraison.');
                      return;
                    }
                    // Envoyer successivement les commandes à toutes les boutiques non commandées
                    shopKeysList.forEach((key, idx) => {
                      if (!orderedShopKeys.includes(key)) {
                        handleOrderSingleShop(shopGroups[key], idx + 1);
                      }
                    });
                  }}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white font-black text-xs shadow-lg shadow-purple-600/25 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Tout commander ({grandTotal.toLocaleString('fr-FR')} FCFA)</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
