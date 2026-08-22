import React, { useState, useEffect } from 'react';
import { X, Trash2, ShoppingBag, Send, MapPin, User, Phone, CheckCircle2, Zap, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatWhatsAppOrder } from '../services/whatsappService';
import { calculateWholesaleTier } from '../services/wholesaleService';

export default function CartDrawer({ isOpen, onClose, onOpenCheckoutSummary }) {
  const { cart, removeFromCart, updateQuantity, clearCart, totalAmount, addOrder } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [city, setCity] = useState('Douala');
  const [quarter, setQuarter] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [orderSent, setOrderSent] = useState(false);

  // Nombre de boutiques distinctes dans le panier
  const uniqueShopsCount = new Set(cart.map(it => it.shopId || it.shopCode || it.shopName || 'default')).size;

  // Verrouillage du scroll d'arrière plan
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckoutWhatsApp = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !quarter.trim()) {
      alert('Veuillez renseigner votre nom, téléphone et quartier de livraison.');
      return;
    }

    const orderData = {
      id: `CMD-${Date.now().toString().slice(-6)}`,
      items: cart,
      total: totalAmount,
      customer: {
        name: customerName,
        phone: customerPhone,
        city: city,
        quarter: quarter
      },
      deliveryNote,
      date: new Date().toISOString(),
      status: 'en_attente'
    };

    // Formatage WhatsApp
    const { url } = formatWhatsAppOrder(orderData);
    
    // Sauvegarder la commande dans l'état local / Firestore
    addOrder(orderData);
    setOrderSent(true);

    // Ouvrir WhatsApp
    window.open(url, '_blank');

    setTimeout(() => {
      clearCart();
      setOrderSent(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-[100vw] sm:max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transition-colors h-full">
          
          {/* Header */}
          <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-green-500/15 text-green-600 dark:text-green-400 shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">Mon Panier</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{cart.length} article{cart.length > 1 ? 's' : ''} sélectionné{cart.length > 1 ? 's' : ''}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              aria-label="Fermer le panier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Corps du panier */}
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">Votre panier est vide</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-6">
                Explorez les boutiques locales et ajoutez vos articles favoris.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              
              {/* Liste des articles */}
              <div className="space-y-3">
                {cart.map((item) => {
                  const tier = calculateWholesaleTier(item, item.quantity);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 shadow-sm min-w-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover bg-slate-100 dark:bg-slate-950 shrink-0"
                      />

                      <div className="flex-1 min-w-0 pr-1">
                        <h5 className="text-xs font-semibold text-slate-900 dark:text-white truncate mb-0.5" title={item.name}>
                          {item.name}
                        </h5>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {item.shopName} {item.shopCity ? `(${item.shopCity})` : ''}
                        </p>
                        
                        {/* Wholesale Tier Badge in Cart */}
                        {tier.discountPercent > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30 mt-0.5">
                            <Sparkles className="w-2.5 h-2.5 shrink-0" />
                            <span>Tarif {tier.activeTier === 3 ? 'VIP' : 'Gros'} (-{tier.discountPercent}%)</span>
                          </span>
                        )}

                        <div className="flex items-baseline gap-1.5 mt-1 flex-wrap">
                          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                            {tier.totalPrice.toLocaleString('fr-FR')} FCFA
                          </span>
                          {tier.discountPercent > 0 && (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 line-through whitespace-nowrap">
                              {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Contrôles de quantité */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors p-1"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center bg-white dark:bg-slate-700/80 rounded-lg p-0.5 text-xs border border-slate-200 dark:border-slate-600 shadow-sm">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-5 h-5 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold"
                          >
                            -
                          </button>
                          <span className="w-5 text-center font-bold text-slate-900 dark:text-white text-[11px]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-5 h-5 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Formulaire de livraison */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                  <MapPin className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
                  <span>Informations de Livraison (&lt; 2h)</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <input
                      type="text"
                      placeholder="Votre nom complet"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-green-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="tel"
                      placeholder="N° WhatsApp (ex: 699...)"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-green-500"
                      required
                    />
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-green-500"
                    >
                      <option value="Douala">Douala</option>
                      <option value="Yaoundé">Yaoundé</option>
                      <option value="Bafoussam">Bafoussam</option>
                      <option value="Kribi">Kribi</option>
                      <option value="Garoua">Garoua</option>
                      <option value="Bamenda">Bamenda</option>
                    </select>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Quartier / Repère (ex: Akwa, Bastos, Mokolo...)"
                      value={quarter}
                      onChange={(e) => setQuarter(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-green-500"
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Remarque particulière (facultatif)"
                      value={deliveryNote}
                      onChange={(e) => setDeliveryNote(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Footer Commande */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950/90 border-t border-slate-200 dark:border-slate-800 space-y-3 shrink-0">
              
              {/* Badge Multi-Boutiques */}
              {uniqueShopsCount > 1 && (
                <div className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-[11px] font-bold flex items-center justify-between">
                  <span>📦 Commande Multi-Boutiques</span>
                  <span className="font-mono bg-purple-500/15 px-2 py-0.5 rounded-md">{uniqueShopsCount} colis distincts</span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Total estimé :</span>
                <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-baseline gap-1">
                  {totalAmount.toLocaleString('fr-FR')}
                  <span className="text-xs font-bold text-green-600 dark:text-green-400">FCFA</span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onOpenCheckoutSummary) {
                    onClose();
                    onOpenCheckoutSummary();
                  } else {
                    handleCheckoutWhatsApp(new Event('submit'));
                  }
                }}
                className="w-full py-3.5 px-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-600/25 active:scale-98 transition-all"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span className="truncate">
                  {uniqueShopsCount > 1 ? 'Vérifier & Répartir par Boutique' : 'Récapitulatif & Commander (WhatsApp)'}
                </span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 text-center">
                <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                <span>Paiement à la livraison ou Mobile Money sécurisé</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
