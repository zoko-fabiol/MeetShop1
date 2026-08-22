-- =========================================================================
-- AUTORISATION COMPLÈTE RLS (LECTURE & ÉCRITURE) SUR SUPABASE
-- =========================================================================

-- 1. Boutiques (Shops)
DROP POLICY IF EXISTS "Lecture publique des boutiques" ON public.shops;
DROP POLICY IF EXISTS "Accès complet public des boutiques" ON public.shops;
CREATE POLICY "Accès complet public des boutiques" ON public.shops 
FOR ALL USING (true) WITH CHECK (true);

-- 2. Produits (Products)
DROP POLICY IF EXISTS "Lecture publique des produits disponibles" ON public.products;
DROP POLICY IF EXISTS "Accès complet public des produits" ON public.products;
CREATE POLICY "Accès complet public des produits" ON public.products 
FOR ALL USING (true) WITH CHECK (true);

-- 3. Catégories (Categories)
DROP POLICY IF EXISTS "Lecture publique des catégories" ON public.categories;
DROP POLICY IF EXISTS "Accès complet public des catégories" ON public.categories;
CREATE POLICY "Accès complet public des catégories" ON public.categories 
FOR ALL USING (true) WITH CHECK (true);

-- 4. Commandes (Orders)
DROP POLICY IF EXISTS "Lecture publique des commandes" ON public.orders;
DROP POLICY IF EXISTS "Création de commande publique" ON public.orders;
CREATE POLICY "Accès complet public des commandes" ON public.orders 
FOR ALL USING (true) WITH CHECK (true);

-- 5. Articles de Commande (Order Items)
DROP POLICY IF EXISTS "Création des articles de commande" ON public.order_items;
CREATE POLICY "Accès complet public des articles de commande" ON public.order_items 
FOR ALL USING (true) WITH CHECK (true);

-- =========================================================================
-- INSERTION DES BOUTIQUES RÉELLES DE DOUALA & YAOUNDÉ
-- =========================================================================

INSERT INTO public.shops (name, code, city, quarter, phone_whatsapp, rating, is_live, logo_url, banner_url, description, layout_config)
VALUES 
(
  'ZOKOSTORE',
  'ZOKO01',
  'Douala',
  'Akwa (Rue Foch)',
  '+237699123456',
  4.9,
  true,
  'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
  'Spécialiste High-Tech, smartphones et accessoires d''origine à Douala.',
  '{
    "theme": "emerald",
    "blocks": [
      { "id": "b-hero-1", "type": "HeroBanner", "visible": true, "props": { "slogan": "N°1 des smartphones et accessoires certifiés d''origine à Douala Akwa.", "ctaText": "Discuter sur WhatsApp" } },
      { "id": "b-flash-1", "type": "FlashDeal", "visible": true, "props": { "title": "⚡ Vente Flash Accessoires TWS !", "discountBadge": "-25% IMMÉDIAT", "ctaText": "Commander sur WhatsApp" } },
      { "id": "b-feat-1", "type": "FeaturedProducts", "visible": true, "props": { "title": "🔥 Nos Meilleures Ventes" } },
      { "id": "b-cat-1", "type": "CategoryCatalog", "visible": true, "props": { "title": "Catalogue High-Tech & Accessoires" } },
      { "id": "b-hours-1", "type": "OpeningHours", "visible": true, "props": { "title": "Horaires Boutique Akwa" } }
    ]
  }'::jsonb
),
(
  'ANABA BIO VN',
  'ANABA02',
  'Yaoundé',
  'Bastos',
  '+237677987654',
  4.8,
  true,
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506617420156-8e4536971650?w=800&auto=format&fit=crop&q=80',
  'Produits bio locaux, fruits frais et épicerie fine de Yaoundé.',
  '{
    "theme": "amber",
    "blocks": [
      { "id": "b-hero-2", "type": "HeroBanner", "visible": true, "props": { "slogan": "Saveurs authentiques du terroir camerounais & paniers bio frais.", "ctaText": "Commander mon panier" } },
      { "id": "b-feat-2", "type": "FeaturedProducts", "visible": true, "props": { "title": "🥗 Sélection Fraîcheur du Jour" } },
      { "id": "b-cat-2", "type": "CategoryCatalog", "visible": true, "props": { "title": "Épicerie Fine & Produits Naturels" } }
    ]
  }'::jsonb
),
(
  'ZOFAROCLU',
  'ZOF03',
  'Douala',
  'Bonamoussadi',
  '+237655443322',
  4.7,
  false,
  'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80',
  'Maison, déco, électroménager et articles du quotidien.',
  '{
    "theme": "cyan",
    "blocks": [
      { "id": "b-hero-3", "type": "HeroBanner", "visible": true, "props": { "slogan": "Tout pour équiper votre intérieur au meilleur rapport qualité-prix à Douala.", "ctaText": "Explorer le stock" } }
    ]
  }'::jsonb
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  quarter = EXCLUDED.quarter,
  phone_whatsapp = EXCLUDED.phone_whatsapp,
  rating = EXCLUDED.rating,
  is_live = EXCLUDED.is_live,
  logo_url = EXCLUDED.logo_url,
  banner_url = EXCLUDED.banner_url,
  description = EXCLUDED.description,
  layout_config = EXCLUDED.layout_config;

-- =========================================================================
-- INSERTION DES PRODUITS INITIAUX DANS SUPABASE
-- =========================================================================

INSERT INTO public.products (name, price, category_slug, image_url, description, stock, is_available, shop_id)
SELECT 
  'Écouteurs Sans Fil Pro TWS (Réduction Bruit)',
  25000,
  'electronique',
  'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80',
  'Autonomie 24h, Bluetooth 5.3, son haute fidélité avec basses puissantes et isolation sonore active.',
  25,
  true,
  id FROM public.shops WHERE code = 'ZOKO01';

INSERT INTO public.products (name, price, category_slug, image_url, description, stock, is_available, shop_id)
SELECT 
  'Chargeur Rapide 65W GaN USB-C Multi-ports',
  15000,
  'electronique',
  'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80',
  'Charge ultra-rapide compatible iPhone, Samsung, MacBook et PC portables.',
  40,
  true,
  id FROM public.shops WHERE code = 'ZOKO01';

INSERT INTO public.products (name, price, category_slug, image_url, description, stock, is_available, shop_id)
SELECT 
  'Smartwatch Sport Étanche GPS & Cardio',
  32000,
  'electronique',
  'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format&fit=crop&q=80',
  'Écran AMOLED HD, suivi fréquence cardiaque, notifications WhatsApp et étanchéité 5ATM.',
  12,
  true,
  id FROM public.shops WHERE code = 'ZOKO01';

INSERT INTO public.products (name, price, category_slug, image_url, description, stock, is_available, shop_id)
SELECT 
  'Panier Maraîcher Bio Frais Yaoundé (10kg)',
  12500,
  'alimentation',
  'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&auto=format&fit=crop&q=80',
  'Légumes et fruits fraîchement cueillis à l''Ouest : tomates, carottes, poivrons, avocats, plantains.',
  30,
  true,
  id FROM public.shops WHERE code = 'ANABA02';

INSERT INTO public.products (name, price, category_slug, image_url, description, stock, is_available, shop_id)
SELECT 
  'Miel Pur Sauvage de l''Adamaoua (1L)',
  7500,
  'alimentation',
  'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=80',
  'Miel 100% pur récolté traditionnellement dans la région de l''Adamaoua. Sans sucre ajouté.',
  50,
  true,
  id FROM public.shops WHERE code = 'ANABA02';

INSERT INTO public.products (name, price, category_slug, image_url, description, stock, is_available, shop_id)
SELECT 
  'Cafetière Express Inox 15 Bar',
  35000,
  'maison',
  'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&auto=format&fit=crop&q=80',
  'Machine à café expresso avec buse vapeur pour cappuccino crémeux et mousse onctueuse.',
  8,
  true,
  id FROM public.shops WHERE code = 'ZOF03';
