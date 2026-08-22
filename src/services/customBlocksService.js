/**
 * Service de Gestion et Hub Communautaire des Blocs Codés par l'IA (Mistral)
 * Permet de stocker, réutiliser et partager des blocs sur-mesure codés de zéro.
 */

import { supabase, isSupabaseConfigured } from '../config/supabase';

const STORAGE_KEY = 'meetshop_custom_ai_blocks';

// Blocs innovants pré-générés par l'IA comme base de départ
export const SEED_AI_BLOCKS = [
  {
    id: 'ai-bento-grid-tech',
    name: 'Grille Bento Cyber 3D',
    category: 'High-Tech & Gaming',
    description: 'Une disposition asymétrique moderne mettant en valeur nouveautés, garanties et performances.',
    iconName: 'LayoutGrid',
    structure: {
      title: 'L\'Écosystème Gaming & Création',
      subtitle: 'Performances brutes et composants certifiés',
      cards: [
        { span: 'col-span-2 row-span-2', title: 'PC & Setups Custom', desc: 'Montage sur-mesure sous 24h avec garantie pièces 1 an.', badge: 'Top Performance', icon: 'Zap' },
        { span: 'col-span-1', title: 'Composants Certifiés', desc: 'GPU, RAM & SSD d\'origine.', badge: 'Stock Réel', icon: 'ShieldCheck' },
        { span: 'col-span-1', title: 'Retrait Express Akwa', desc: 'Test sur place avant paiement.', badge: 'Zéro Risque', icon: 'MapPin' },
        { span: 'col-span-2', title: 'Assistance WhatsApp Dédiée', desc: 'Un technicien à votre écoute 7j/7 pour valider votre configuration.', badge: '< 5 min', icon: 'MessageSquare' }
      ]
    }
  },
  {
    id: 'ai-lookbook-interactive',
    name: 'Lookbook & Tenues de la Semaine',
    category: 'Mode & Streetwear',
    description: 'Galerie interactive de styles complets recommandés avec commande directe de la sélection.',
    iconName: 'Shirt',
    structure: {
      title: 'Le Lookbook de la Saison',
      subtitle: 'Des associations exclusives conçues par nos stylistes',
      looks: [
        { name: 'Look Urban Chic', desc: 'Ensemble lin premium & sneakers minimalistes', price: '45 000 FCFA', badge: 'Tendance' },
        { name: 'Look Soirée Prestige', desc: 'Costume cintré & souliers cuir patiné', price: '85 000 FCFA', badge: 'Exclusif' },
        { name: 'Look Casual Weekend', desc: 'T-shirt oversize coton lourd & short cargo', price: '28 000 FCFA', badge: 'Best-Seller' }
      ]
    }
  },
  {
    id: 'ai-product-quizz',
    name: 'Quizz Conseiller Express',
    category: 'Beauté, Tech & Conseil',
    description: 'Mini-guide interactif guidant le client vers le produit idéal selon son besoin.',
    iconName: 'Sparkles',
    structure: {
      title: 'Trouvez Votre Modèle Idéal en 2 Clics',
      subtitle: 'Notre algorithme vous oriente vers le choix le plus adapté',
      steps: [
        { question: 'Quel est votre usage principal ?', options: ['Usage Quotidien / Polyvalent', 'Professionnel & Créatif', 'Gaming & Haute Performance'] },
        { question: 'Quel est votre budget estimé ?', options: ['Moins de 150 000 FCFA', '150 000 à 350 000 FCFA', 'Haut de gamme (> 350 000 FCFA)'] }
      ],
      ctaText: 'Valider et recevoir ma sélection sur WhatsApp'
    }
  },
  {
    id: 'ai-vip-membership',
    name: 'Club Privilège & Fidélité VIP',
    category: 'Luxe & Bijouterie',
    description: 'Carte de membre numérique offrant remises exclusives, accès prioritaire et conciergerie.',
    iconName: 'Award',
    structure: {
      title: 'Rejoignez le Cercle Privé VIP',
      subtitle: 'Des privilèges réservés à nos clients les plus fidèles',
      perks: [
        { title: 'Remise Permanente 10%', desc: 'Appliquée automatiquement sur toutes vos commandes' },
        { title: 'Accès Avant-Première', desc: 'Découvrez les nouveaux arrivages 48h avant tout le monde' },
        { title: 'Livraison Gratuite', desc: 'Partout à Douala et Yaoundé sans minimum d\'achat' }
      ],
      badgeText: 'Carte Membre Numérique'
    }
  }
];

/**
 * Récupère tous les blocs IA personnalisés (locaux + communautaires)
 */
export function getCustomAiBlocks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const localBlocks = saved ? JSON.parse(saved) : [];
    
    // Fusionner les blocs par défaut et les blocs créés par l'utilisateur
    const existingIds = new Set(localBlocks.map(b => b.id));
    const merged = [...localBlocks];
    
    SEED_AI_BLOCKS.forEach(seed => {
      if (!existingIds.has(seed.id)) {
        merged.push(seed);
      }
    });

    return merged;
  } catch (err) {
    console.error('Erreur getCustomAiBlocks:', err);
    return SEED_AI_BLOCKS;
  }
}

/**
 * Enregistre un nouveau bloc codé par Mistral dans le Hub communautaire
 */
export async function saveCustomAiBlock(blockData) {
  if (!blockData || !blockData.name) return null;

  const newBlock = {
    id: blockData.id || `ai-block-${Date.now()}`,
    name: blockData.name,
    category: blockData.category || 'Général & Commerce',
    description: blockData.description || 'Bloc sur-mesure conçu par Mistral AI',
    iconName: blockData.iconName || 'Sparkles',
    structure: blockData.structure || {},
    authorShop: blockData.authorShop || 'Mistral Architect',
    created_at: new Date().toISOString()
  };

  // 1. Sauvegarde locale
  try {
    const current = getCustomAiBlocks();
    const filtered = current.filter(b => b.id !== newBlock.id);
    const updated = [newBlock, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Erreur localStorage saveCustomAiBlock:', e);
  }

  // 2. Sauvegarde Supabase si disponible
  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('community_ai_blocks')
        .upsert(newBlock, { onConflict: 'id' });
    } catch (supaErr) {
      console.warn('ℹ️ Hub Supabase non disponible pour les blocs partagés:', supaErr?.message);
    }
  }

  return newBlock;
}

/**
 * Supprime un bloc personnalisé localement
 */
export function deleteCustomAiBlock(blockId) {
  try {
    const current = getCustomAiBlocks();
    const updated = current.filter(b => b.id !== blockId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    return false;
  }
}
