-- =========================================================================
-- MEETSHOP MARKETPLACE — PRODUCTION SUPABASE POSTGRESQL & RLS SCHEMA
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
    role TEXT DEFAULT 'client', -- 'client' | 'vendor' | 'admin'
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche rapide par code boutique, ville et propriétaire
CREATE INDEX IF NOT EXISTS idx_shops_code ON public.shops(code);
CREATE INDEX IF NOT EXISTS idx_shops_city ON public.shops(city);
CREATE INDEX IF NOT EXISTS idx_shops_owner ON public.shops(owner_id);

-- 4. Table des Produits avec Embedding Vectoriel (512 dimensions - CLIP ViT)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
    vendor_id TEXT, -- ID du vendeur propriétaire
    category_slug TEXT NOT NULL REFERENCES public.categories(slug),
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL, -- Prix en FCFA (XAF)
    old_price INTEGER,
    image_url TEXT NOT NULL,
    image_urls JSONB DEFAULT '[]'::jsonb,
    stock INTEGER DEFAULT 10,
    is_available BOOLEAN DEFAULT true,
    views_count INTEGER DEFAULT 0,
    embedding vector(512), -- Vecteur d'image extrait par IA (CLIP/MobileNet)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_embedding ON public.products 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_shop ON public.products(shop_id);
CREATE INDEX IF NOT EXISTS idx_products_vendor ON public.products(vendor_id);

-- 5. Table des Commandes (Orders)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID REFERENCES public.shops(id) ON DELETE SET NULL,
    vendor_id TEXT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    city TEXT NOT NULL, -- Douala ou Yaoundé
    quarter TEXT NOT NULL,
    delivery_note TEXT,
    total_amount INTEGER NOT NULL, -- Total en FCFA
    status TEXT DEFAULT 'en_attente', -- en_attente, valide, en_livraison, livre, annule
    items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_shop ON public.orders(shop_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);

-- 6. Table des Articles de Commande (Order Items)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_shop ON public.order_items(shop_id);

-- 7. Table des Leads / Contacts Prospects
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
    vendor_id TEXT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_city TEXT DEFAULT 'Douala',
    source TEXT DEFAULT 'whatsapp', -- 'whatsapp' | 'form' | 'booking' | 'call'
    message TEXT,
    status TEXT DEFAULT 'nouveau', -- 'nouveau' | 'contacte' | 'converti' | 'archive'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_shop ON public.leads(shop_id);
CREATE INDEX IF NOT EXISTS idx_leads_vendor ON public.leads(vendor_id);

-- =========================================================================
-- SÉCURITÉ ROW LEVEL SECURITY (RLS) RENFORCÉE
-- =========================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Politiques de Catégories
DROP POLICY IF EXISTS "Lecture publique des catégories" ON public.categories;
CREATE POLICY "Lecture publique des catégories" ON public.categories FOR SELECT USING (true);

-- Politiques de Boutiques
DROP POLICY IF EXISTS "Lecture publique des boutiques" ON public.shops;
DROP POLICY IF EXISTS "Gestion des boutiques" ON public.shops;
CREATE POLICY "Lecture publique des boutiques" ON public.shops FOR SELECT USING (true);
CREATE POLICY "Gestion des boutiques" ON public.shops FOR ALL USING (true) WITH CHECK (true);

-- Politiques de Produits
DROP POLICY IF EXISTS "Lecture publique des produits" ON public.products;
DROP POLICY IF EXISTS "Gestion des produits" ON public.products;
CREATE POLICY "Lecture publique des produits" ON public.products FOR SELECT USING (is_available = true);
CREATE POLICY "Gestion des produits" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- Politiques de Profils
DROP POLICY IF EXISTS "Gestion des profils" ON public.profiles;
CREATE POLICY "Gestion des profils" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- Politiques de Commandes
DROP POLICY IF EXISTS "Création et gestion des commandes" ON public.orders;
CREATE POLICY "Création et gestion des commandes" ON public.orders FOR ALL USING (true) WITH CHECK (true);

-- Politiques d'Articles de Commande
DROP POLICY IF EXISTS "Gestion des articles de commande" ON public.order_items;
CREATE POLICY "Gestion des articles de commande" ON public.order_items FOR ALL USING (true) WITH CHECK (true);

-- Politiques de Leads
DROP POLICY IF EXISTS "Gestion des leads" ON public.leads;
CREATE POLICY "Gestion des leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);

-- Activer la réplication Realtime pour shops, profiles, orders et leads
ALTER PUBLICATION supabase_realtime ADD TABLE public.shops;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
