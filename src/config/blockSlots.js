/**
 * CONFIGURATION DES SLOTS & ÉLÉMENTS INTERNES DE CHAQUE BLOC
 * Permet la réorganisation et le déplacement libre des éléments d'un bloc.
 */

export const BLOCK_DEFAULT_SLOTS = {
  FlashDeal: [
    { id: 'badgeSlot', label: 'Badge Réduction', defaultIndex: 0 },
    { id: 'titleSlot', label: 'Titre & Description', defaultIndex: 1 },
    { id: 'countdownSlot', label: 'Compte à Rebours', defaultIndex: 2 },
    { id: 'ctaSlot', label: 'Bouton d\'Action (CTA)', defaultIndex: 3 }
  ],
  HeroBanner: [
    { id: 'badgeSlot', label: 'Badge Accroche', defaultIndex: 0 },
    { id: 'titleSlot', label: 'Titre & Slogan', defaultIndex: 1 },
    { id: 'ctaSlot', label: 'Bouton d\'Action Principal', defaultIndex: 2 },
    { id: 'mediaSlot', label: 'Image / Média d\'Arrière-plan', defaultIndex: 3 }
  ],
  AboutStory: [
    { id: 'badgeSlot', label: 'Badge Certification', defaultIndex: 0 },
    { id: 'titleSlot', label: 'Titre de Section', defaultIndex: 1 },
    { id: 'storyTextSlot', label: 'Texte & Histoire', defaultIndex: 2 },
    { id: 'commitmentsSlot', label: 'Cartes de Garanties & Stats', defaultIndex: 3 }
  ],
  CustomCta: [
    { id: 'badgeSlot', label: 'Badge CTA', defaultIndex: 0 },
    { id: 'titleSlot', label: 'Titre & Slogan', defaultIndex: 1 },
    { id: 'actionsGridSlot', label: 'Cartes d\'Action (WhatsApp / Appel)', defaultIndex: 2 }
  ],
  OpeningHours: [
    { id: 'headerSlot', label: 'En-tête & Statut', defaultIndex: 0 },
    { id: 'actionSlot', label: 'Bouton Action Rapide', defaultIndex: 1 },
    { id: 'gridSlot', label: 'Grille des Jours & Horaires', defaultIndex: 2 }
  ],
  ContactMap: [
    { id: 'headerSlot', label: 'En-tête Localisation', defaultIndex: 0 },
    { id: 'infoSlot', label: 'Adresse & Repères', defaultIndex: 1 },
    { id: 'actionSlot', label: 'Boutons de Contact', defaultIndex: 2 },
    { id: 'mapViewSlot', label: 'Carte GPS Interactive', defaultIndex: 3 }
  ],
  CustomerReviews: [
    { id: 'headerSlot', label: 'En-tête Avis Clients', defaultIndex: 0 },
    { id: 'overviewSlot', label: 'Note Globale & Score', defaultIndex: 1 },
    { id: 'reviewsGridSlot', label: 'Grille des Avis Témoignages', defaultIndex: 2 }
  ]
};

/**
 * Récupère la liste ordonnée des slots pour un bloc donné
 */
export function getOrderedSlots(blockType, slotsOrder = null) {
  const defaultList = BLOCK_DEFAULT_SLOTS[blockType] || [];
  if (!Array.isArray(slotsOrder) || slotsOrder.length === 0) {
    return defaultList.map(s => s.id);
  }

  // Fusionner l'ordre personnalisé avec tous les slots existants
  const customOrder = [...slotsOrder];
  defaultList.forEach(s => {
    if (!customOrder.includes(s.id)) {
      customOrder.push(s.id);
    }
  });

  return customOrder;
}

/**
 * Déplace un slot vers le haut ou vers le bas dans l'ordre du bloc
 */
export function moveSlotInBlock(currentOrder, slotId, direction = 'up') {
  const list = [...currentOrder];
  const idx = list.indexOf(slotId);
  if (idx === -1) return list;

  if (direction === 'up' && idx > 0) {
    const temp = list[idx - 1];
    list[idx - 1] = list[idx];
    list[idx] = temp;
  } else if (direction === 'down' && idx < list.length - 1) {
    const temp = list[idx + 1];
    list[idx + 1] = list[idx];
    list[idx] = temp;
  }

  return list;
}

/**
 * Réorganise l'ordre des slots en glissant-déposant un slot source vers un slot cible (Drag & Drop)
 */
export function reorderSlotToTarget(currentOrder, sourceSlotId, targetSlotId) {
  if (!sourceSlotId || !targetSlotId || sourceSlotId === targetSlotId) return currentOrder;
  const list = [...currentOrder];
  const sourceIndex = list.indexOf(sourceSlotId);
  const targetIndex = list.indexOf(targetSlotId);
  if (sourceIndex === -1 || targetIndex === -1) return list;

  list.splice(sourceIndex, 1);
  list.splice(targetIndex, 0, sourceSlotId);
  return list;
}

