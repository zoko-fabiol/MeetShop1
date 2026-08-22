import { supabase, isSupabaseConfigured } from '../config/supabase';

// Base de données initiale réaliste (31+ produits et boutiques locales du Cameroun)
export const INITIAL_SHOPS = [
  {
    id: "shop-1",
    name: "ZOKOSTORE",
    code: "ZOKO01",
    city: "Douala",
    quarter: "Akwa (Rue Foch)",
    phone: "+237699123456",
    rating: 4.9,
    isLive: true,
    category: "electronique",
    logo: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80",
    description: "Spécialiste High-Tech, smartphones et accessoires d'origine à Douala.",
    layout_config: {
      theme: "emerald",
      blocks: [
        {
          id: "b-hero-1",
          type: "HeroBanner",
          visible: true,
          props: {
            slogan: "N°1 des smartphones et accessoires certifiés d'origine à Douala Akwa.",
            ctaText: "Discuter sur WhatsApp",
            showStats: true,
            showLiveBadge: true
          }
        },
        {
          id: "b-flash-1",
          type: "FlashDeal",
          visible: true,
          props: {
            title: "Vente Flash Accessoires TWS !",
            subtitle: "Jusqu'à 5 000 FCFA de remise immédiate sur les écouteurs sans fil.",
            discountBadge: "-25% IMMÉDIAT",
            endsInHours: 24,
            ctaText: "Commander sur WhatsApp"
          }
        },
        {
          id: "b-feat-1",
          type: "FeaturedProducts",
          visible: true,
          props: {
            title: "Nos Meilleures Ventes",
            subtitle: "Sélection coup de cœur certifiée par ZOKOSTORE",
            maxItems: 4
          }
        },
        {
          id: "b-cat-1",
          type: "CategoryCatalog",
          visible: true,
          props: {
            title: "Catalogue High-Tech & Accessoires",
            showSearch: true,
            showCategoryPills: true
          }
        },
        {
          id: "b-about-1",
          type: "AboutStory",
          visible: true,
          props: {
            title: "Qui est ZOKOSTORE ?",
            storyText: "Installés Rue Foch à Akwa, nous proposons les meilleurs équipements électroniques avec garantie 1 an et SAV local réactif.",
            commitment1: "Livraison en moins de 45 min sur Douala",
            commitment2: "Produits certifiés originaux",
            commitment3: "Paiement OM / MoMo à la livraison"
          }
        },
        {
          id: "b-hours-1",
          type: "OpeningHours",
          visible: true,
          props: {
            title: "Horaires Boutique Akwa",
            statusText: "Ouvert maintenant",
            mondayFriday: "08h00 - 19h30",
            saturday: "08h30 - 20h00",
            sunday: "12h00 - 18h00"
          }
        },
        {
          id: "b-rev-1",
          type: "CustomerReviews",
          visible: true,
          props: {
            title: "Avis Clients Vérifiés",
            subtitle: "Retours après livraison express à Akwa, Bonanjo et Bonapriso"
          }
        },
        {
          id: "b-map-1",
          type: "ContactMap",
          visible: true,
          props: {
            title: "Localisation ZOKOSTORE",
            landmark: "Rue Foch, face Hôtel Akwa Palace",
            directPhone: "+237699123456"
          }
        }
      ]
    }
  },
  {
    id: "shop-2",
    name: "ANABA BIO VN",
    code: "ANABA02",
    city: "Yaoundé",
    quarter: "Bastos",
    phone: "+237677987654",
    rating: 4.8,
    isLive: true,
    category: "alimentation",
    logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1506617420156-8e4536971650?w=800&auto=format&fit=crop&q=80",
    description: "Produits bio locaux, fruits frais et épicerie fine de Yaoundé.",
    layout_config: {
      theme: "amber",
      blocks: [
        {
          id: "b-hero-2",
          type: "HeroBanner",
          visible: true,
          props: {
            slogan: "Saveurs authentiques du terroir camerounais & paniers bio frais livrés à domicile.",
            ctaText: "Commander mon panier"
          }
        },
        {
          id: "b-feat-2",
          type: "FeaturedProducts",
          visible: true,
          props: {
            title: "Sélection Fraîcheur du Jour",
            subtitle: "Récoltes locales garanties sans conservateurs"
          }
        },
        {
          id: "b-cat-2",
          type: "CategoryCatalog",
          visible: true,
          props: {
            title: "Épicerie Fine & Produits Naturels",
            showSearch: true
          }
        },
        {
          id: "b-about-2",
          type: "AboutStory",
          visible: true,
          props: {
            title: "L'Engagement ANABA BIO",
            storyText: "Nous collaborons directement avec les coopératives agricoles de l'Ouest et du Centre pour vous offrir le meilleur de la terre.",
            commitment1: "Paniers livrés frais chaque matin à Bastos",
            commitment2: "Traçabilité 100% naturelle",
            commitment3: "Paiement facile à réception"
          }
        },
        {
          id: "b-rev-2",
          type: "CustomerReviews",
          visible: true,
          props: {
            title: "Témoignages de nos abonnés"
          }
        },
        {
          id: "b-hours-2",
          type: "OpeningHours",
          visible: true,
          props: {
            title: "Disponibilité Bastos"
          }
        },
        {
          id: "b-map-2",
          type: "ContactMap",
          visible: true,
          props: {
            title: "Notre Épicerie Bastos",
            landmark: "Bastos, Rue des Ambassades"
          }
        }
      ]
    }
  },
  {
    id: "shop-3",
    name: "ZOFAROCLU",
    code: "ZOF03",
    city: "Douala",
    quarter: "Bonamoussadi",
    phone: "+237655443322",
    rating: 4.7,
    isLive: false,
    category: "maison",
    logo: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80",
    description: "Électroménager, literie et décoration moderne de maison.",
    layout_config: {
      theme: "violet",
      blocks: [
        {
          id: "b-hero-3",
          type: "HeroBanner",
          visible: true,
          props: {
            slogan: "Équipez votre intérieur avec du mobilier et de l'électroménager de qualité supérieure.",
            ctaText: "Demander un devis WhatsApp"
          }
        },
        {
          id: "b-feat-3",
          type: "FeaturedProducts",
          visible: true,
          props: {
            title: "Confort & Maison",
            subtitle: "Nos équipements stars pour cuisine et salon"
          }
        },
        {
          id: "b-cat-3",
          type: "CategoryCatalog",
          visible: true,
          props: {
            title: "Rayon Électroménager & Décoration"
          }
        },
        {
          id: "b-hours-3",
          type: "OpeningHours",
          visible: true,
          props: {
            title: "Showroom Bonamoussadi"
          }
        },
        {
          id: "b-map-3",
          type: "ContactMap",
          visible: true,
          props: {
            title: "Nous Rendre Visite",
            landmark: "Rond-point Express Bonamoussadi"
          }
        }
      ]
    }
  },
  {
    id: "shop-4",
    name: "CAM-TECH AKWA",
    code: "CAMT04",
    city: "Douala",
    quarter: "Akwa",
    phone: "+237690112233",
    rating: 4.9,
    isLive: true,
    category: "electronique",
    logo: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=80",
    description: "Laptops, tablettes et maintenance informatique rapide.",
    layout_config: {
      theme: "cyan",
      blocks: [
        {
          id: "b-hero-4",
          type: "HeroBanner",
          visible: true,
          props: {
            slogan: "Laptops professionnels, ordinateurs gaming et maintenance express sur Douala.",
            ctaText: "Conseil Tech WhatsApp"
          }
        },
        {
          id: "b-flash-4",
          type: "FlashDeal",
          visible: true,
          props: {
            title: "Promo Laptops & Smartphones 5G",
            subtitle: "Jusqu'à -30% avec sacoche et souris offertes !",
            discountBadge: "-30% PROMO",
            endsInHours: 12
          }
        },
        {
          id: "b-feat-4",
          type: "FeaturedProducts",
          visible: true,
          props: {
            title: "Machines & Téléphones Haut de Gamme"
          }
        },
        {
          id: "b-cat-4",
          type: "CategoryCatalog",
          visible: true,
          props: {
            title: "Stock Informatique & Mobilité"
          }
        },
        {
          id: "b-map-4",
          type: "ContactMap",
          visible: true,
          props: {
            title: "Atelier & Boutique",
            landmark: "Akwa, Boulevard de la Liberté"
          }
        }
      ]
    }
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "Écouteurs Sans Fil Pro TWS",
    price: 15000,
    shopId: "shop-1",
    shopName: "ZOKOSTORE",
    shopCity: "Douala",
    shopQuarter: "Akwa",
    shopPhone: "+237699123456",
    category: "electronique",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80",
    description: "Écouteurs Bluetooth réduction de bruit active, autonomie 24h, boîtier de charge rapide.",
    stock: 15,
    isAvailable: true,
    views: 142
  },
  {
    id: "prod-2",
    name: "Pack Huile d'Olive Extra Vierge & Épices Bio",
    price: 8500,
    shopId: "shop-2",
    shopName: "ANABA BIO VN",
    shopCity: "Yaoundé",
    shopQuarter: "Bastos",
    shopPhone: "+237677987654",
    category: "alimentation",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80",
    description: "Huile d'olive première pression à froid et sélection d'épices naturelles du terroir.",
    stock: 25,
    isAvailable: true,
    views: 89
  },
  {
    id: "prod-3",
    name: "Montre Connectée Smartwatch Ultra Fit",
    price: 25000,
    shopId: "shop-1",
    shopName: "ZOKOSTORE",
    shopCity: "Douala",
    shopQuarter: "Akwa",
    shopPhone: "+237699123456",
    category: "electronique",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
    description: "Suivi fréquence cardiaque, notifications WhatsApp/Appels, étanche IP68, autonomie 7 jours.",
    stock: 8,
    isAvailable: true,
    views: 230
  },
  {
    id: "prod-4",
    name: "Mixeur Blender Multifonction 1000W",
    price: 22000,
    shopId: "shop-3",
    shopName: "ZOFAROCLU",
    shopCity: "Douala",
    shopQuarter: "Bonamoussadi",
    shopPhone: "+237655443322",
    category: "maison",
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&auto=format&fit=crop&q=80",
    description: "Bol en verre trempé 1.5L, 6 lames en acier inoxydable, idéal pour smoothies et sauces.",
    stock: 12,
    isAvailable: true,
    views: 110
  },
  {
    id: "prod-5",
    name: "Smartphone 5G Dual SIM 128Go",
    price: 89000,
    shopId: "shop-4",
    shopName: "CAM-TECH AKWA",
    shopCity: "Douala",
    shopQuarter: "Akwa",
    shopPhone: "+237690112233",
    category: "electronique",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80",
    description: "Écran AMOLED 6.5 pouces 120Hz, batterie 5000mAh, charge rapide 33W, garantie 1 an.",
    stock: 5,
    isAvailable: true,
    views: 310
  },
  {
    id: "prod-6",
    name: "Panier Fruits & Légumes Bio Hebdo",
    price: 12000,
    shopId: "shop-2",
    shopName: "ANABA BIO VN",
    shopCity: "Yaoundé",
    shopQuarter: "Bastos",
    shopPhone: "+237677987654",
    category: "alimentation",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&auto=format&fit=crop&q=80",
    description: "Sélection hebdomadaire fraîche : tomates, poivrons, avocats, ananas et bananes locales.",
    stock: 20,
    isAvailable: true,
    views: 75
  },
  {
    id: "prod-7",
    name: "Enceinte Bluetooth Waterproof BoomBox",
    price: 18000,
    shopId: "shop-1",
    shopName: "ZOKOSTORE",
    shopCity: "Douala",
    shopQuarter: "Akwa",
    shopPhone: "+237699123456",
    category: "electronique",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=80",
    description: "Son puissant avec basses profondes, autonomie 12h, résistance à l'eau.",
    stock: 14,
    isAvailable: true,
    views: 198
  },
  {
    id: "prod-8",
    name: "Cafetière Express Inox 15 Bar",
    price: 35000,
    shopId: "shop-3",
    shopName: "ZOFAROCLU",
    shopCity: "Douala",
    shopQuarter: "Bonamoussadi",
    shopPhone: "+237655443322",
    category: "maison",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&auto=format&fit=crop&q=80",
    description: "Machine à café expresso avec buse vapeur pour cappuccino crémeux.",
    stock: 6,
    isAvailable: true,
    views: 84
  }
];

export async function fetchProducts() {
  // Essayer Supabase d'abord
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          shops (
            name,
            city,
            quarter,
            phone_whatsapp
          )
        `)
        .eq('is_available', true);

      if (!error && data) {
        const supabaseProducts = data.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          shopId: p.shop_id,
          shopName: p.shops?.name || 'Boutique Locale',
          shopCity: p.shops?.city || 'Douala',
          shopQuarter: p.shops?.quarter || '',
          shopPhone: p.shops?.phone_whatsapp || '+237600000000',
          category: p.category_slug,
          image: p.image_url,
          images: p.image_urls || (p.image_url ? [p.image_url] : []),
          description: p.description,
          stock: p.stock,
          isAvailable: p.is_available,
          views: p.views_count
        }));

        // Fusionner avec localStorage (produits créés localement non encore sync)
        const localRaw = localStorage.getItem('meetshop_products');
        const localProds = localRaw ? JSON.parse(localRaw) : [];
        // Ne garder que les produits locaux qui ne sont pas déjà dans Supabase
        const localOnly = localProds.filter(lp =>
          lp && lp.id &&
          !supabaseProducts.find(sp => sp.id === lp.id || (sp.name === lp.name && (sp.shopId === lp.shopId || sp.shopId === lp.shop_id)))
        );
        return [...supabaseProducts, ...localOnly];
      }
    } catch (err) {
      console.warn('Supabase produits indisponible, fallback localStorage:', err);
    }
  }

  // Seulement localStorage — jamais les données démo hardcodées
  const saved = localStorage.getItem('meetshop_products');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }

  return []; // Retourner tableau vide si aucune vraie donnée
}

export async function fetchShops() {
  // Charger les boutiques depuis localStorage (créées localement)
  let localShops = [];
  const savedRaw = localStorage.getItem('meetshop_shops');
  if (savedRaw) {
    try { localShops = JSON.parse(savedRaw); } catch (e) {}
  }

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('shops').select('*');
      if (!error && data) {
        const supabaseShops = data.map(s => ({
          id: s.id,
          name: s.name,
          code: s.code,
          city: s.city,
          quarter: s.quarter,
          phone: s.phone_whatsapp,
          rating: s.rating,
          isLive: s.is_live,
          logo: s.logo_url,
          banner: s.banner_url,
          description: s.description,
          layout_config: s.layout_config,
          owner_uid: s.owner_id
        }));

        // Fusionner : Supabase + boutiques locales non encore sync
        const localOnly = localShops.filter(ls =>
          !supabaseShops.find(ss => ss.code === ls.code || ss.owner_uid === ls.owner_uid)
        );
        return [...supabaseShops, ...localOnly];
      }
    } catch (err) {
      console.warn('Supabase boutiques indisponible, fallback localStorage:', err);
    }
  }

  // Seulement localStorage — jamais les données démo hardcodées
  return localShops;
}

export async function saveNewProduct(newProduct) {
  const shopId = newProduct.shopId || newProduct.shop_id;
  const vendorId = newProduct.vendor_id || newProduct.seller_id;

  if (isSupabaseConfigured()) {
    try {
      const insertPayload = {
        name: newProduct.name,
        price: Number(newProduct.price),
        category_slug: newProduct.category || 'divers',
        image_url: newProduct.image || newProduct.images?.[0] || '',
        image_urls: newProduct.images || (newProduct.image ? [newProduct.image] : []),
        description: newProduct.description,
        stock: Number(newProduct.stock) || 10,
        is_available: true
      };

      if (shopId) {
        insertPayload.shop_id = shopId;
      }
      if (vendorId) {
        insertPayload.vendor_id = vendorId;
      }

      await supabase.from('products').insert([insertPayload]);
    } catch (err) {
      console.warn('Erreur insertion produit Supabase:', err);
    }
  }

  const current = JSON.parse(localStorage.getItem('meetshop_products') || '[]');
  const productWithId = {
    ...newProduct,
    id: newProduct.id || `prod-local-${Date.now()}`,
    shopId: shopId || newProduct.shopId,
    shop_id: shopId || newProduct.shop_id,
    vendor_id: vendorId || newProduct.vendor_id
  };
  
  // Éviter les doublons si le même id existe déjà
  const filtered = current.filter(p => p.id !== productWithId.id);
  const updated = [productWithId, ...filtered];
  localStorage.setItem('meetshop_products', JSON.stringify(updated));
  return updated;
}

export async function updateShopLayout(shopId, layoutConfig, extraFields = {}) {
  if (!shopId) return [];

  // Extraire d'éventuels customLogoUrl et customCoverUrl depuis le bloc HeroBanner
  const heroBlock = (layoutConfig?.blocks || []).find(b => b.type === 'HeroBanner');
  const customLogo = heroBlock?.props?.customLogoUrl || extraFields.logo || extraFields.logo_url;
  const customBanner = heroBlock?.props?.customCoverUrl || extraFields.banner || extraFields.banner_url;

  const updatePayload = {
    layout_config: layoutConfig,
    ...(customLogo ? { logo_url: customLogo } : {}),
    ...(customBanner ? { banner_url: customBanner } : {})
  };

  // 1. Sauvegarde Supabase si configuré
  if (isSupabaseConfigured()) {
    try {
      // Tenter la mise à jour par code d'abord
      const { data: codeData, error: codeErr } = await supabase
        .from('shops')
        .update(updatePayload)
        .eq('code', shopId)
        .select();

      // Si non trouvé par code, tenter par id
      if (!codeData || codeData.length === 0 || codeErr) {
        await supabase
          .from('shops')
          .update(updatePayload)
          .eq('id', shopId);
      }
    } catch (err) {
      console.warn('Erreur mise à jour Supabase layout_config:', err);
    }
  }

  // 2. Sauvegarde Locale (meetshop_shops)
  const currentShops = JSON.parse(localStorage.getItem('meetshop_shops') || '[]');
  const updatedShops = currentShops.map(s => {
    if (s.id === shopId || s.code === shopId || (s.owner_uid && s.owner_uid === shopId)) {
      return {
        ...s,
        layout_config: layoutConfig,
        ...(customLogo ? { logo: customLogo, logo_url: customLogo } : {}),
        ...(customBanner ? { banner: customBanner, banner_url: customBanner } : {}),
        ...extraFields
      };
    }
    return s;
  });
  localStorage.setItem('meetshop_shops', JSON.stringify(updatedShops));

  // 3. Sauvegarde de la session vendeur active (meetshop_vendor)
  try {
    const activeVendor = JSON.parse(localStorage.getItem('meetshop_vendor') || 'null');
    if (activeVendor && (activeVendor.id === shopId || activeVendor.code === shopId || activeVendor.owner_uid === shopId)) {
      const updatedVendor = {
        ...activeVendor,
        layout_config: layoutConfig,
        ...(customLogo ? { logo: customLogo, logo_url: customLogo } : {}),
        ...(customBanner ? { banner: customBanner, banner_url: customBanner } : {}),
        ...extraFields
      };
      localStorage.setItem('meetshop_vendor', JSON.stringify(updatedVendor));
    }
  } catch (e) {}

  return updatedShops;
}


