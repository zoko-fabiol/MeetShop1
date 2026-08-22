import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, MessageCircle, MapPin, Store, ShieldCheck, Zap, Share2, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { openWhatsAppDirect } from '../services/whatsappService';
import WholesaleTierWidget from './WholesaleTierWidget';
import { calculateWholesaleTier } from '../services/wholesaleService';
import { getTheme } from '../config/themes';

export default function ProductDetailModal({ 
  product, 
  isOpen, 
  onClose, 
  themeId = 'emerald',
  shop 
}) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  // Verrouillage du défilement de l'arrière-plan lorsque le popup est ouvert
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  // Récupérer le thème de la boutique active
  const effectiveThemeId = themeId || shop?.layout_config?.theme || 'emerald';
  const theme = getTheme(effectiveThemeId);

  const tierInfo = calculateWholesaleTier(product, quantity, shop);

  const handleAddToCart = () => {
    addToCart(product, quantity, {
      unitPrice: tierInfo.unitPrice,
      discountPercent: tierInfo.discountPercent,
      tierLabel: tierInfo.tierLabel
    });
    onClose();
  };

  const handleWhatsAppContact = () => {
    openWhatsAppDirect(
      product.shopPhone || shop?.phone,
      `${product.name} (Qté: ${quantity} pcs - Tarif: ${tierInfo.unitPrice.toLocaleString('fr-FR')} FCFA/u)`,
      tierInfo.totalPrice,
      product.shopName || shop?.name
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Découvrez ${product.name} à ${product.price} FCFA sur MeetShop`,
        url: window.location.href
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn overscroll-contain"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative max-h-[92vh] flex flex-col overscroll-contain transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Halo décoratif selon le thème de la boutique */}
        <div 
          className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: theme.hex }}
        />

        {/* Header Modal */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white dark:bg-slate-900 relative z-10">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold text-slate-900 dark:text-white text-sm">Fiche Article</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">• {product.shopName}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Partager"
            >
              {copied ? <Check className={`w-4 h-4 ${theme.accentColor}`} /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenu Défilant */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-5 relative z-10 overscroll-contain text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Image principale */}
            <div className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 aspect-square flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Infos rapides */}
            <div className="flex flex-col justify-between space-y-3">
              <div>
                <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold mb-2 border ${theme.badge}`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Boutique Vérifiée</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                  {product.name}
                </h3>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {tierInfo.unitPrice.toLocaleString('fr-FR')}
                  </span>
                  <span className={`text-xs font-bold ${theme.accentColor}`}>FCFA / pièce</span>

                  {tierInfo.discountPercent > 0 && (
                    <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-semibold ml-1">
                      {product.price.toLocaleString('fr-FR')} FCFA
                    </span>
                  )}
                </div>

                {/* Vendeur Info Card */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                    <Store className={`w-4 h-4 ${theme.accentColor}`} />
                    <span>{product.shopName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>{product.shopQuarter || 'Centre-ville'}, {product.shopCity}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                    <span>Livraison express disponible en &lt; 2h</span>
                  </div>
                </div>
              </div>

              {/* Sélecteur de quantité */}
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Quantité commandée :</span>
                <div className="flex items-center bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-0.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-black text-sm flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 active:scale-95 transition-all shadow-sm"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-black text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-black text-sm flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 active:scale-95 transition-all shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* 📊 WIDGET INTERACTIF DES TARIFS GROSSISTES DÉGRESSIFS (MOQ) AUX COULEURS DE LA BOUTIQUE */}
          <WholesaleTierWidget
            product={product}
            quantity={quantity}
            onSelectQuantity={(newQty) => setQuantity(newQty)}
            shop={shop}
            themeId={effectiveThemeId}
          />

          {/* Description Complète */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Description de l'article
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

        </div>

        {/* Actions Footer aux couleurs de la palette boutique */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/90 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2.5 shrink-0 relative z-10">
          <button
            onClick={handleAddToCart}
            className={`w-full sm:flex-1 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all ${theme.btnPrimary}`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              Ajouter au Panier ({tierInfo.totalPrice.toLocaleString('fr-FR')} FCFA)
            </span>
          </button>

          <button
            onClick={handleWhatsAppContact}
            className={`w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${theme.btnSecondary}`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Direct</span>
          </button>
        </div>

      </div>
    </div>
  );
}
