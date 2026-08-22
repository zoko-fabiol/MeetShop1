/**
 * Service de gestion des réponses aux formulaires et questionnaires personnalisés des boutiques.
 * Persistance locale et synchronisation en temps réel pour le tableau de bord vendeur.
 */

const LEADS_STORAGE_PREFIX = 'meetshop_form_leads_';

export function getShopFormLeads(shopId) {
  if (!shopId) return [];
  try {
    const key = `${LEADS_STORAGE_PREFIX}${shopId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveShopFormLeads(shopId, leads) {
  if (!shopId) return;
  try {
    const key = `${LEADS_STORAGE_PREFIX}${shopId}`;
    localStorage.setItem(key, JSON.stringify(leads));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {}
}

export function submitFormResponse({ shopId, shopName, formTitle, answers, customerInfo }) {
  if (!shopId) return null;

  const leadId = `LEAD-${Date.now().toString().slice(-6)}`;
  const newLead = {
    id: leadId,
    shopId,
    shopName: shopName || 'Boutique Partenaire',
    formTitle: formTitle || 'Questionnaire Client',
    customer: customerInfo || { name: 'Prospect', phone: '', city: 'Douala' },
    answers: answers || [],
    createdAt: new Date().toISOString(),
    status: 'nouveau' // 'nouveau' | 'traite' | 'archive'
  };

  const currentLeads = getShopFormLeads(shopId);
  const updated = [newLead, ...currentLeads];
  saveShopFormLeads(shopId, updated);

  return newLead;
}

export function updateLeadStatus(shopId, leadId, newStatus) {
  const currentLeads = getShopFormLeads(shopId);
  const updated = currentLeads.map(l => {
    if (l.id === leadId) {
      return { ...l, status: newStatus, updatedAt: new Date().toISOString() };
    }
    return l;
  });
  saveShopFormLeads(shopId, updated);
}

export function formatWhatsAppFormSubmission({ shopPhone, shopName, formTitle, customerInfo, answers }) {
  const cleanPhone = (shopPhone || '+237699123456').replace(/\D/g, '');

  let text = `📋 *NOUVEAU QUESTIONNAIRE REÇU — MEETSHOP*\n`;
  text += `🏬 *Boutique :* *${shopName || 'MeetShop'}*\n`;
  text += `📝 *Formulaire :* _${formTitle || 'Questionnaire'}\n`;
  text += `════════════════════════════════\n\n`;

  if (customerInfo && (customerInfo.name || customerInfo.phone)) {
    text += `👤 *INFORMATIONS DU CONTACT :*\n`;
    if (customerInfo.name) text += `▫️ *Nom :* ${customerInfo.name}\n`;
    if (customerInfo.phone) text += `▫️ *Téléphone :* ${customerInfo.phone}\n`;
    if (customerInfo.city) text += `▫️ *Ville :* ${customerInfo.city} ${customerInfo.quarter ? '(' + customerInfo.quarter + ')' : ''}\n`;
    text += `\n════════════════════════════════\n\n`;
  }

  text += `💡 *RÉPONSES DU QUESTIONNAIRE :*\n\n`;
  answers.forEach((item, idx) => {
    text += `*${idx + 1}. ${item.question}*\n`;
    text += `👉 *Réponse :* ${item.answer || 'Non précisé'}\n\n`;
  });

  text += `════════════════════════════════\n`;
  text += `🚀 _Envoyé en direct depuis la vitrine MeetShop_`;

  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  return { url, cleanPhone, text };
}
