// Service de gestion des tarifs grossistes dégressifs (MOQ - Minimum Order Quantity)

export const DEFAULT_WHOLESALE_CONFIG = {
  enabled: true,
  tier1: { minQty: 1, maxQty: 4, label: 'Détail', discountPercent: 0 },
  tier2: { minQty: 5, maxQty: 19, label: 'Gros (-15%)', discountPercent: 15 },
  tier3: { minQty: 20, maxQty: null, label: 'VIP (-30%)', discountPercent: 30 }
};

/**
 * Récupère la configuration des paliers pour un produit donné (Priorité : Produit > Boutique > Défaut)
 */
export function getProductWholesaleConfig(product, shop) {
  if (product && product.wholesale_tiers && product.wholesale_tiers.enabled !== false) {
    return product.wholesale_tiers;
  }
  
  if (shop && shop.wholesale_config && shop.wholesale_config.enabled !== false) {
    return shop.wholesale_config;
  }

  // Par défaut activé pour les boutiques avec les paliers standards MeetShop
  return DEFAULT_WHOLESALE_CONFIG;
}

/**
 * Calcule le palier actif, le prix unitaire remisé et les informations de progression
 */
export function calculateWholesaleTier(product, quantity, shop) {
  const config = getProductWholesaleConfig(product, shop);
  const basePrice = Number(product?.price || 0);

  if (!config || !config.enabled) {
    return {
      activeTier: 1,
      tierLabel: 'Détail',
      discountPercent: 0,
      unitPrice: basePrice,
      totalPrice: basePrice * quantity,
      savings: 0,
      nextTierQty: null,
      neededQtyForNextTier: 0,
      progressPercent: 100,
      tier1Price: basePrice,
      tier2Price: basePrice,
      tier3Price: basePrice,
      config: DEFAULT_WHOLESALE_CONFIG
    };
  }

  const t1 = config.tier1 || DEFAULT_WHOLESALE_CONFIG.tier1;
  const t2 = config.tier2 || DEFAULT_WHOLESALE_CONFIG.tier2;
  const t3 = config.tier3 || DEFAULT_WHOLESALE_CONFIG.tier3;

  const tier1Price = Math.round(basePrice * (1 - (t1.discountPercent || 0) / 100));
  const tier2Price = Math.round(basePrice * (1 - (t2.discountPercent || 15) / 100));
  const tier3Price = Math.round(basePrice * (1 - (t3.discountPercent || 30) / 100));

  let activeTier = 1;
  let discountPercent = t1.discountPercent || 0;
  let tierLabel = `Détail (${t1.minQty}-${t1.maxQty || 4} pcs)`;
  let nextTierQty = t2.minQty;
  let nextTierDiscount = t2.discountPercent || 15;
  let neededQtyForNextTier = Math.max(0, t2.minQty - quantity);
  let progressPercent = Math.min(100, (quantity / t2.minQty) * 100);

  if (quantity >= t3.minQty) {
    activeTier = 3;
    discountPercent = t3.discountPercent || 30;
    tierLabel = `VIP (${t3.minQty}+ pcs)`;
    nextTierQty = null;
    nextTierDiscount = 0;
    neededQtyForNextTier = 0;
    progressPercent = 100;
  } else if (quantity >= t2.minQty) {
    activeTier = 2;
    discountPercent = t2.discountPercent || 15;
    tierLabel = `Gros (${t2.minQty}-${t2.maxQty || 19} pcs)`;
    nextTierQty = t3.minQty;
    nextTierDiscount = t3.discountPercent || 30;
    neededQtyForNextTier = Math.max(0, t3.minQty - quantity);
    progressPercent = Math.min(100, ((quantity - t2.minQty) / (t3.minQty - t2.minQty)) * 100);
  }

  const unitPrice = Math.round(basePrice * (1 - discountPercent / 100));
  const totalPrice = unitPrice * quantity;
  const standardTotal = basePrice * quantity;
  const savings = Math.max(0, standardTotal - totalPrice);

  return {
    activeTier,
    tierLabel,
    discountPercent,
    unitPrice,
    totalPrice,
    savings,
    nextTierQty,
    nextTierDiscount,
    neededQtyForNextTier,
    progressPercent,
    tier1Price,
    tier2Price,
    tier3Price,
    config: { tier1: t1, tier2: t2, tier3: t3, enabled: true }
  };
}

/**
 * Applique la configuration grossiste à plusieurs produits ou à toute la boutique
 */
export function applyWholesaleConfigToProducts({
  shopId,
  scope, // 'all_shop' | 'multiple' | 'single'
  selectedProductIds = [],
  wholesaleConfig
}) {
  const productsRaw = localStorage.getItem('meetshop_products');
  let products = [];
  try {
    products = productsRaw ? JSON.parse(productsRaw) : [];
  } catch (e) {
    products = [];
  }

  const updatedProducts = products.map(prod => {
    // Vérifier si le produit appartient à cette boutique
    if (prod.shopId !== shopId && prod.shopName !== shopId) {
      return prod;
    }

    if (scope === 'all_shop') {
      return {
        ...prod,
        wholesale_tiers: wholesaleConfig
      };
    } else if (scope === 'multiple' || scope === 'single') {
      if (selectedProductIds.includes(prod.id)) {
        return {
          ...prod,
          wholesale_tiers: wholesaleConfig
        };
      }
    }

    return prod;
  });

  localStorage.setItem('meetshop_products', JSON.stringify(updatedProducts));

  // Si 'all_shop', on sauvegarde aussi sur la boutique
  if (scope === 'all_shop') {
    const shopsRaw = localStorage.getItem('meetshop_shops');
    if (shopsRaw) {
      try {
        const shops = JSON.parse(shopsRaw);
        const updatedShops = shops.map(s => {
          if (s.id === shopId || s.code === shopId || s.name === shopId) {
            return {
              ...s,
              wholesale_config: wholesaleConfig
            };
          }
          return s;
        });
        localStorage.setItem('meetshop_shops', JSON.stringify(updatedShops));
      } catch (e) {}
    }
  }

  return updatedProducts;
}
