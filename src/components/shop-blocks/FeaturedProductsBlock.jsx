import React from 'react';
import { Flame, ShoppingBag, Eye, Star, Sparkles } from 'lucide-react';
import { getTheme } from '../../config/themes';
import { getDesignVariant } from '../../config/blockDesignStyles';
import { getCustomColorStyle } from '../../config/colorTokens';
import { useCart } from '../../context/CartContext';
import { getCardClasses, getButtonClasses } from '../../config/blockStyles';

export default function FeaturedProductsBlock({ block, shop, themeId, onSelectProduct, products = [], isMobilePreview = false, isEditMode = false }) {
  const theme = getTheme(themeId);
  const { addToCart, liteMode } = useCart();
  const props = block?.props || {};
  const dv = getDesignVariant(props.designVariant || 'modern_minimal');

  const titleStyle = getCustomColorStyle(props.titleColor);
  const textStyle = getCustomColorStyle(props.textColor);

  const title = props.title || 'Nos Meilleures Ventes';
  const subtitle = props.subtitle || 'Sélection coup de cœur garantie par la boutique';
  const maxItems = props.maxItems || 4;

  const cardStyle = props.cardStyle || 'standard';
  const buttonStyle = props.buttonStyle || 'modern_rounded';

  const cardContainerClass = getCardClasses(cardStyle, theme);
  const buttonClass = getButtonClasses(buttonStyle, theme, 'primary');

  // Filtrer les produits de la boutique
  const shopProducts = products.filter(p => p.shopId === shop.id || p.shopName === shop.name);
  const displayProducts = shopProducts.slice(0, maxItems);

  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <section className={`p-4 sm:p-6 mb-6 sm:mb-8 transition-all duration-300 ${dv.containerClass}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 style={titleStyle} className={`text-lg sm:text-2xl font-black tracking-tight ${dv.headerClass}`}>
              {title}
            </h2>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${dv.accentBadgeClass || theme.badge}`}>
              TOP CHOIX
            </span>
          </div>
          <p style={textStyle} className={`text-xs mt-0.5 opacity-90 ${dv.subTextClass}`}>{subtitle}</p>
        </div>
      </div>

      {/* Grid of Featured Products */}
      <div className={`grid gap-3 ${isMobilePreview ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
        {displayProducts.map((prod) => (
          <div
            key={prod.id}
            onClick={() => {
              if (isEditMode) return;
              onSelectProduct?.(prod);
            }}
            className={`cursor-pointer overflow-hidden transition-all duration-300 ${dv.cardInnerClass || cardContainerClass}`}
          >
            <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <img
                src={prod.image || prod.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80'}
                alt={prod.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {prod.isNew && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black uppercase shadow-md">
                  Nouveau
                </span>
              )}
            </div>

            <div className="p-3 space-y-1.5">
              <h3 className="font-bold text-xs line-clamp-1 text-current">
                {prod.name}
              </h3>

              <div className="flex items-center justify-between pt-1">
                <span className="font-black text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
                  {(prod.price || 0).toLocaleString()} FCFA
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isEditMode) return;
                    addToCart(prod);
                  }}
                  className={`p-1.5 rounded-lg ${dv.buttonClass || buttonClass}`}
                  title="Ajouter au panier"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
