# MeetShop — Live Marketplace Cameroun (Douala & Yaoundé)

Reproduction complète de l'application web [MeetShop](https://ves-tyless.vercel.app/) avec **React (Web View / PWA)** et une architecture hybride intelligente **Supabase + Firebase** optimisée pour les fonctionnalités 100% gratuites (Recherche visuelle IA, proximité locale, tunnel WhatsApp).

---

## 🏗️ Architecture Hybride Intelligente

| Service | Rôle & Responsabilités | Pourquoi cette répartition ? |
| :--- | :--- | :--- |
| **Supabase (PostgreSQL + pgvector)** | • Recherche visuelle IA d'images par similarité vectorielle (cosine distance `<=>`).<br>• Catalogue relationnel : Boutiques (`shops`), Produits (`products`), Catégories.<br>• Recherche par Code Boutique (`#CODE`) & Géolocalisation. | **100% Gratuit & Illimité :** L'extension PostgreSQL `pgvector` évite de payer des API payantes comme Google Cloud Vision ou OpenAI Embeddings. |
| **Firebase (Auth, Firestore, Storage)** | • Authentification utilisateurs & vendeurs (Google, Téléphone/SMS, Email).<br>• Firebase Storage : hébergement gratuit des photos de produits et bannières (5 Go gratuits).<br>• Firestore / Realtime DB : statuts en direct des boutiques (*Live Marketplace*) et suivi temps réel des coursiers (< 2h). | Gestion temps réel sans friction et hébergement des médias à haute vitesse. |
| **React Frontend (Web View / PWA)** | • Interface ultra-rapide optimisée mobile et WebView.<br>• Mode **LITE** intégré pour économiser la consommation de data internet au Cameroun.<br>• Extraction de signatures visuelles IA in-browser (Transformers.js / CLIP).<br>• Générateur de commande WhatsApp direct avec calculs en FCFA. | Expérience utilisateur fluide même avec une connexion mobile 3G/4G instable. |

---

## 🚀 Démarrage Rapide

### 1. Installation des dépendances
```bash
npm install
```

### 2. Configuration des bases de données
1. **Supabase :**
   - Créez un projet gratuit sur [Supabase](https://supabase.com).
   - Allez dans l'éditeur SQL et exécutez le script situé dans `supabase/schema.sql`.
   - Récupérez votre URL et votre clé Anon dans `Project Settings > API`.
2. **Firebase :**
   - Créez un projet sur [Firebase Console](https://console.firebase.google.com).
   - Activez *Authentication*, *Firestore* et *Storage*.
   - Déployez les règles de sécurité fournies dans `firebase/firestore.rules` et `firebase/storage.rules`.
3. **Variables d'environnement :**
   - Copiez `.env.example` en `.env` et renseignez vos clés :
   ```bash
   cp .env.example .env
   ```

### 3. Lancer en local
```bash
npm run dev
```

---

## 📸 Comment fonctionne la Recherche Visuelle IA Gratuite ?
1. **Côté Client :** L'utilisateur prend une photo d'un objet (vêtement, gadget, article d'épicerie).
2. **Extraction du Vecteur :** Le modèle d'IA analyse les caractéristiques visuelles et génère un vecteur d'embedding (512 dimensions).
3. **Recherche Vectorielle pgvector :** Supabase calcule instantanément la similarité cosinus avec la fonction RPC `match_products_by_embedding` pour trouver les boutiques locales possédant l'article en stock en moins de **0.4 seconde**.
