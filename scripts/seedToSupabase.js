import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://auefltgcpixwtmjkidek.supabase.co';
const SUPABASE_KEY = 'sb_publishable_b1sa__mENj_2wtRPzRDNgA_Y2Wo4uOB';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SHOPS = [
  {
    name: "ZOKOSTORE",
    code: "ZOKO01",
    city: "Douala",
    quarter: "Akwa (Rue Foch)",
    phone_whatsapp: "+237699123456",
    rating: 4.9,
    is_live: true,
    logo_url: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=150&auto=format&fit=crop&q=80",
    banner_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80",
    description: "Spécialiste High-Tech, smartphones et accessoires d'origine à Douala.",
    layout_config: {
      theme: "emerald",
      blocks: [
        { id: "b-hero-1", type: "HeroBanner", visible: true, props: { slogan: "N°1 des smartphones et accessoires certifiés d'origine à Douala Akwa.", ctaText: "Discuter sur WhatsApp" } },
        { id: "b-flash-1", type: "FlashDeal", visible: true, props: { title: "⚡ Vente Flash Accessoires TWS !", discountBadge: "-25% IMMÉDIAT", ctaText: "Commander sur WhatsApp" } },
        { id: "b-feat-1", type: "FeaturedProducts", visible: true, props: { title: "🔥 Nos Meilleures Ventes" } },
        { id: "b-cat-1", type: "CategoryCatalog", visible: true, props: { title: "Catalogue High-Tech & Accessoires" } },
        { id: "b-hours-1", type: "OpeningHours", visible: true, props: { title: "Horaires Boutique Akwa" } }
      ]
    }
  },
  {
    name: "ANABA BIO VN",
    code: "ANABA02",
    city: "Yaoundé",
    quarter: "Bastos",
    phone_whatsapp: "+237677987654",
    rating: 4.8,
    is_live: true,
    logo_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80",
    banner_url: "https://images.unsplash.com/photo-1506617420156-8e4536971650?w=800&auto=format&fit=crop&q=80",
    description: "Produits bio locaux, fruits frais et épicerie fine de Yaoundé.",
    layout_config: {
      theme: "amber",
      blocks: [
        { id: "b-hero-2", type: "HeroBanner", visible: true, props: { slogan: "Saveurs authentiques du terroir camerounais & paniers bio frais.", ctaText: "Commander mon panier" } },
        { id: "b-feat-2", type: "FeaturedProducts", visible: true, props: { title: "🥗 Sélection Fraîcheur du Jour" } },
        { id: "b-cat-2", type: "CategoryCatalog", visible: true, props: { title: "Épicerie Fine & Produits Naturels" } }
      ]
    }
  },
  {
    name: "ZOFAROCLU",
    code: "ZOF03",
    city: "Douala",
    quarter: "Bonamoussadi",
    phone_whatsapp: "+237655443322",
    rating: 4.7,
    is_live: false,
    logo_url: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=150&auto=format&fit=crop&q=80",
    banner_url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80",
    description: "Maison, déco, électroménager et articles du quotidien.",
    layout_config: {
      theme: "cyan",
      blocks: [
        { id: "b-hero-3", type: "HeroBanner", visible: true, props: { slogan: "Tout pour équiper votre intérieur au meilleur rapport qualité-prix à Douala.", ctaText: "Explorer le stock" } }
      ]
    }
  }
];

const PRODUCTS = [
  {
    name: "Écouteurs Sans Fil Pro TWS (Réduction Bruit)",
    price: 25000,
    shop_code: "ZOKO01",
    category_slug: "electronique",
    image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80",
    description: "Autonomie 24h, Bluetooth 5.3, son haute fidélité avec basses puissantes et isolation sonore active.",
    stock: 25,
    is_available: true
  },
  {
    name: "Chargeur Rapide 65W GaN USB-C Multi-ports",
    price: 15000,
    shop_code: "ZOKO01",
    category_slug: "electronique",
    image_url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80",
    description: "Charge ultra-rapide compatible iPhone, Samsung, MacBook et PC portables.",
    stock: 40,
    is_available: true
  },
  {
    name: "Smartwatch Sport Étanche GPS & Cardio",
    price: 32000,
    shop_code: "ZOKO01",
    category_slug: "electronique",
    image_url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format&fit=crop&q=80",
    description: "Écran AMOLED HD, suivi fréquence cardiaque, notifications WhatsApp et étanchéité 5ATM.",
    stock: 12,
    is_available: true
  },
  {
    name: "Panier Maraîcher Bio Frais Yaoundé (10kg)",
    price: 12500,
    shop_code: "ANABA02",
    category_slug: "alimentation",
    image_url: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&auto=format&fit=crop&q=80",
    description: "Légumes et fruits fraîchement cueillis à l'Ouest : tomates, carottes, poivrons, avocats, plantains.",
    stock: 30,
    is_available: true
  },
  {
    name: "Miel Pur Sauvage de l'Adamaoua (1L)",
    price: 7500,
    shop_code: "ANABA02",
    category_slug: "alimentation",
    image_url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=80",
    description: "Miel 100% pur récolté traditionnellement dans la région de l'Adamaoua. Sans sucre ajouté.",
    stock: 50,
    is_available: true
  },
  {
    name: "Cafetière Express Inox 15 Bar",
    price: 35000,
    shop_code: "ZOF03",
    category_slug: "maison",
    image_url: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&auto=format&fit=crop&q=80",
    description: "Machine à café expresso avec buse vapeur pour cappuccino crémeux et mousse onctueuse.",
    stock: 8,
    is_available: true
  }
];

async function seed() {
  console.log('🚀 Connexion à Supabase...');
  
  // 1. Tester la connexion
  const { data: catTest, error: catError } = await supabase.from('categories').select('*').limit(1);
  if (catError) {
    console.error('❌ Erreur de connexion aux tables Supabase :', catError.message);
    console.log('👉 Assurez-vous d\'avoir exécuté le script SQL dans SQL Editor sur supabase.com');
    return;
  }
  console.log('✅ Tables Supabase accessibles !');

  // 2. Insérer les boutiques
  console.log('🏪 Transfert des boutiques...');
  for (const shop of SHOPS) {
    const { error } = await supabase
      .from('shops')
      .upsert(shop, { onConflict: 'code' });
    if (error) {
      console.warn(`Avertissement boutique ${shop.name}:`, error.message);
    } else {
      console.log(`  ✓ Boutique ${shop.name} synchronisée`);
    }
  }

  // 3. Récupérer les IDs des boutiques
  const { data: dbShops } = await supabase.from('shops').select('id, code');
  const shopMap = {};
  (dbShops || []).forEach(s => { shopMap[s.code] = s.id; });

  // 4. Insérer les produits
  console.log('📦 Transfert des produits...');
  for (const prod of PRODUCTS) {
    const shopId = shopMap[prod.shop_code];
    const { error } = await supabase
      .from('products')
      .insert([
        {
          name: prod.name,
          price: prod.price,
          shop_id: shopId || null,
          category_slug: prod.category_slug,
          image_url: prod.image_url,
          description: prod.description,
          stock: prod.stock,
          is_available: prod.is_available
        }
      ]);
    if (error) {
      console.warn(`Avertissement produit ${prod.name}:`, error.message);
    } else {
      console.log(`  ✓ Produit "${prod.name}" inséré`);
    }
  }

  console.log('🎉 Synchronisation terminée avec succès !');
}

seed();
