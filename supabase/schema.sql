-- =========================================================================
-- VESTYLE MARKETPLACE — SUPABASE POSTGRESQL & PGVECTOR SCHEMA
-- =========================================================================

-- 1. Activer l'extension pgvector pour la recherche visuelle d'images par IA
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Table des Catégories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.bis Table des Profils Utilisateurs (Clients & Vendeurs - Synchronisation Cloud Multi-Appareils)
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY, -- UID Firebase Auth ou Supabase Auth
    email TEXT,
    name TEXT,
    phone TEXT,
    city TEXT DEFAULT 'Douala',
    quarter TEXT,
    avatar_url TEXT, -- URL Cloudinary CDN permanente
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertion des catégories initiales
INSERT INTO public.categories (name, slug, icon) VALUES
('✨ Toutes les catégories', 'all', 'Sparkles'),
('🛒 Alimentation & Supermarché', 'alimentation', 'ShoppingBag'),
('📱 Électronique & High-Tech', 'electronique', 'Smartphone'),
('🏠 Maison & Électroménager', 'maison', 'Home'),
('👗 Mode & Vêtements', 'mode', 'Shirt'),
('💄 Beauté & Cosmétiques', 'beaute', 'Sparkle'),
('📦 Divers & Services', 'divers', 'Package')
ON CONFLICT (slug) DO NOTHING;

-- 3. Table des Boutiques (Shops de Douala & Yaoundé)
CREATE TABLE IF NOT EXISTS public.shops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id TEXT, -- ID Firebase Auth ou Supabase Auth du vendeur
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE, -- ex: "ZOKO01", "ANABA02"
    city TEXT NOT NULL DEFAULT 'Douala', -- Douala ou Yaoundé
    quarter TEXT NOT NULL, -- Akwa, Bonamoussadi, Bastos, Mokolo, etc.
    phone_whatsapp TEXT NOT NULL, -- Numéro WhatsApp format international (+237...)
    rating NUMERIC(2,1) DEFAULT 4.8,
    is_live BOOLEAN DEFAULT false,
    logo_url TEXT,
    banner_url TEXT,
    description TEXT,
    layout_config JSONB DEFAULT '{
      "theme": "emerald",
      "blocks": [
        { "id": "b-1", "type": "HeroBanner", "visible": true, "props": { "ctaText": "Discuter sur WhatsApp" } },
        { "id": "b-2", "type": "FeaturedProducts", "visible": true, "props": { "title": "Nos Meilleures Ventes" } },
        { "id": "b-3", "type": "CategoryCatalog", "visible": true, "props": { "layout": "grid" } },
        { "id": "b-4", "type": "OpeningHours", "visible": true, "props": {} }
      ]
    }'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration pour boutiques existantes
ALTER TABLE public.shops 
ADD COLUMN IF NOT EXISTS layout_config JSONB DEFAULT '{
  "theme": "emerald",
  "blocks": [
    { "id": "b-1", "type": "HeroBanner", "visible": true, "props": { "ctaText": "Discuter sur WhatsApp" } },
    { "id": "b-2", "type": "FeaturedProducts", "visible": true, "props": { "title": "Nos Meilleures Ventes" } },
    { "id": "b-3", "type": "CategoryCatalog", "visible": true, "props": { "layout": "grid" } },
    { "id": "b-4", "type": "OpeningHours", "visible": true, "props": {} }
  ]
}'::jsonb;

-- Index pour recherche rapide par code boutique et par ville
CREATE INDEX IF NOT EXISTS idx_shops_code ON public.shops(code);
CREATE INDEX IF NOT EXISTS idx_shops_city ON public.shops(city);

-- 4. Table des Produits avec Embedding Vectoriel (512 dimensions - CLIP ViT)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
    category_slug TEXT NOT NULL REFERENCES public.categories(slug),
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL, -- Prix en FCFA (XAF)
    image_url TEXT NOT NULL,
    stock INTEGER DEFAULT 10,
    is_available BOOLEAN DEFAULT true,
    views_count INTEGER DEFAULT 0,
    embedding vector(512), -- Vecteur d'image extrait par IA (CLIP/MobileNet)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index vectoriel IVFFlat ou HNSW pour recherche ultra-rapide (< 0.4s)
CREATE INDEX IF NOT EXISTS idx_products_embedding ON public.products 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_shop ON public.products(shop_id);

-- 5. Table des Commandes
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    city TEXT NOT NULL, -- Douala ou Yaoundé
    quarter TEXT NOT NULL,
    delivery_note TEXT,
    total_amount INTEGER NOT NULL, -- Total en FCFA
    status TEXT DEFAULT 'en_attente', -- en_attente, valide, en_livraison, livre, annule
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Table des Articles de Commande
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    shop_id UUID REFERENCES public.shops(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price INTEGER NOT NULL
);

-- =========================================================================
-- FONCTIONS RPC (RECHERCHE VISUELLE & GÉOLOCALISATION)
-- =========================================================================

-- Fonction RPC : Recherche visuelle par similarité Cosine avec pgvector
CREATE OR REPLACE FUNCTION match_products_by_embedding (
  query_embedding vector(512),
  match_threshold float DEFAULT 0.6,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  shop_id UUID,
  category_slug TEXT,
  name TEXT,
  description TEXT,
  price INTEGER,
  image_url TEXT,
  similarity float,
  shop_name TEXT,
  shop_city TEXT,
  shop_phone TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.shop_id,
    p.category_slug,
    p.name,
    p.description,
    p.price,
    p.image_url,
    1 - (p.embedding <=> query_embedding) AS similarity,
    s.name AS shop_name,
    s.city AS shop_city,
    s.phone_whatsapp AS shop_phone
  FROM public.products p
  JOIN public.shops s ON p.shop_id = s.id
  WHERE p.is_available = true 
    AND p.embedding IS NOT NULL
    AND 1 - (p.embedding <=> query_embedding) > match_threshold
  ORDER BY p.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- RLS (Sécurité Niveau Lignes)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique & gestion de profils
CREATE POLICY "Lecture publique des catégories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Lecture publique des boutiques" ON public.shops FOR SELECT USING (true);
CREATE POLICY "Gestion publique des profils utilisateurs" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Lecture publique des produits disponibles" ON public.products FOR SELECT USING (is_available = true);
CREATE POLICY "Création de commande publique" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Création des articles de commande" ON public.order_items FOR INSERT WITH CHECK (true);

-- Activer la réplication Realtime pour shops et profiles
ALTER PUBLICATION supabase_realtime ADD TABLE public.shops;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
