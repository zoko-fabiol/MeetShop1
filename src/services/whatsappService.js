/**
 * Service de génération de commande WhatsApp optimisé pour le Cameroun (MeetShop).
 * Gère le dispatching multi-boutiques et la communication client-vendeur.
 */

export function formatWhatsAppOrder({ 
  items, 
  total, 
  customer, 
  deliveryNote, 
  targetShopName, 
  targetShopPhone,
  packageIndex,
  totalPackages,
  orderId 
}) {
  const shopPhone = targetShopPhone || items[0]?.shopPhone || items[0]?.vendorPhone || '+237699123456';
  // Nettoyage du numéro pour format international sans '+' ni espaces
  const cleanPhone = shopPhone.replace(/\D/g, '');
  const idStr = orderId || `CMD-${Date.now().toString().slice(-6)}`;

  let text = `*COMMANDE MEETSHOP — #${idStr}*\n`;
  if (totalPackages && totalPackages > 1 && packageIndex) {
    text += `*Colis ${packageIndex}/${totalPackages}* (Boutique : *${targetShopName || items[0]?.shopName}*)\n`;
  } else if (targetShopName || items[0]?.shopName) {
    text += `*Boutique :* *${targetShopName || items[0]?.shopName}*\n`;
  }
  text += `════════════════════════════════\n\n`;

  text += `*INFORMATIONS DU CLIENT :*\n`;
  text += `• *Nom :* ${customer?.name || 'Client'}\n`;
  text += `• *Téléphone :* ${customer?.phone || 'N/A'}\n`;
  text += `• *Ville :* ${customer?.city || 'Douala'} (${customer?.quarter || 'Non précisé'})\n`;
  if (deliveryNote) {
    text += `• *Note de livraison :* _${deliveryNote}_\n`;
  }
  text += `\n════════════════════════════════\n\n`;

  text += `*ARTICLES COMMANDÉS :*\n`;
  items.forEach((item, idx) => {
    const unitPrice = item.price || 0;
    const finalItemPrice = item.discountedPrice !== undefined ? item.discountedPrice : (unitPrice * item.quantity);
    
    text += `*${idx + 1}. ${item.name}*\n`;
    text += `   • Quantité : *${item.quantity}*\n`;
    text += `   • Prix unitaire : ${unitPrice.toLocaleString('fr-FR')} FCFA\n`;
    if (item.discountPercent && item.discountPercent > 0) {
      text += `   • Remise Grossiste appliquée : *-${item.discountPercent}%*\n`;
    }
    text += `   • Sous-total : *${finalItemPrice.toLocaleString('fr-FR')} FCFA*\n\n`;
  });

  text += `════════════════════════════════\n`;
  text += `*TOTAL COLIS :* *${total.toLocaleString('fr-FR')} FCFA*\n`;
  text += `*Mode :* Livraison Express Urbaine (< 2h)\n`;
  text += `*Paiement :* À la livraison ou Mobile Money\n\n`;
  text += `_Commande transmise via MeetShop Live Marketplace_`;

  const encodedUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  return {
    url: encodedUrl,
    cleanPhone,
    text,
    orderId: idStr
  };
}

export function openWhatsAppDirect(phone, productName, price, shopName) {
  const cleanPhone = (phone || '+237699123456').replace(/\D/g, '');
  const msg = `Bonjour *${shopName || 'Commerçant'}*, je suis intéressé par votre article *${productName}* à *${Number(price || 0).toLocaleString('fr-FR')} FCFA* vu sur MeetShop. Est-il disponible ?`;
  window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
}

export function contactCustomerWhatsApp(customerPhone, orderId, status, shopName) {
  const cleanPhone = (customerPhone || '').replace(/\D/g, '');
  if (!cleanPhone) return;

  let msg = `Bonjour ! C'est la boutique *${shopName || 'MeetShop'}* concernant votre commande *#${orderId}*.\n`;
  if (status === 'livraison') {
    msg += `Votre colis est actuellement *en cours d'acheminement* par notre livreur. Êtes-vous disponible pour la réception ?`;
  } else if (status === 'terminee') {
    msg += `Votre commande a bien été *livrée*. Merci pour votre confiance et à très bientôt sur MeetShop !`;
  } else {
    msg += `Nous avons bien reçu votre commande et nous la préparons actuellement pour l'expédition.`;
  }

  window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
}
