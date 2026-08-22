import jsPDF from 'jspdf';

/**
 * Service de génération de reçu et facture PDF officielle MeetShop
 */
export function generateOrderPDFReceipt(order) {
  if (!order) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const orderId = order.id || `CMD-${Date.now().toString().slice(-6)}`;
  const orderDate = order.date 
    ? new Date(order.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleDateString('fr-FR');

  const customerName = order.customer?.name || 'Client MeetShop';
  const customerPhone = order.customer?.phone || 'Non renseigné';
  const customerCity = order.customer?.city || 'Douala';
  const customerQuarter = order.customer?.quarter || 'Non précisé';
  const deliveryNote = order.deliveryNote || '';

  const shopName = order.shopName || order.items?.[0]?.shopName || 'Boutique Partenaire MeetShop';
  const shopCity = order.items?.[0]?.shopCity || order.shopCity || customerCity;

  // ── 1. EN-TÊTE DU DOCUMENT ──
  // Bandeau supérieur vert émeraude
  doc.setFillColor(5, 150, 105); // #059669
  doc.rect(0, 0, 210, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('MEETSHOP MARKETPLACE', 15, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('REÇU OFFICIEL DE COMMANDE', 140, 14);

  // ── 2. INFORMATIONS GÉNÉRALES ──
  doc.setTextColor(30, 41, 59); // #1e293b
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`COMMANDE #${orderId}`, 15, 33);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Date d'émission : ${orderDate}`, 15, 38);
  doc.text(`Statut : ${order.status === 'terminee' ? 'LIVRÉE & PAYÉE' : 'COMMANDE ENREGISTRÉE'}`, 15, 43);

  // Cadre Vendeur & Client
  doc.setDrawColor(226, 232, 240); // #e2e8f0
  doc.setFillColor(248, 250, 252); // #f8fafc

  // Bloc Boutique Vendeuse (Gauche)
  doc.roundedRect(15, 48, 85, 34, 3, 3, 'FD');
  doc.setTextColor(5, 150, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('BOUTIQUE VENDEUSE', 20, 55);
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9.5);
  doc.text(shopName, 20, 61);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Ville : ${shopCity} (Cameroun)`, 20, 67);
  doc.text('Vendeur Vérifié MeetShop Pro', 20, 72);

  // Bloc Destinataire / Client (Droite)
  doc.roundedRect(110, 48, 85, 34, 3, 3, 'FD');
  doc.setTextColor(5, 150, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('DESTINATAIRE (LIVRAISON)', 115, 55);
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9.5);
  doc.text(customerName, 115, 61);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Tél / WhatsApp : ${customerPhone}`, 115, 67);
  doc.text(`Adresse : ${customerCity} — ${customerQuarter}`, 115, 72);

  if (deliveryNote) {
    doc.text(`Note : ${deliveryNote}`, 115, 77);
  }

  // ── 3. TABLEAU DES ARTICLES ──
  let y = 92;

  // En-tête de table
  doc.setFillColor(241, 245, 249); // #f1f5f9
  doc.rect(15, y, 180, 8, 'F');
  doc.setTextColor(71, 85, 105); // #475569
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('ARTICLE / DÉSIGNATION', 18, y + 5.5);
  doc.text('QTÉ', 120, y + 5.5);
  doc.text('P.U (FCFA)', 140, y + 5.5);
  doc.text('TOTAL (FCFA)', 170, y + 5.5);

  y += 10;

  // Lignes d'articles
  const items = order.items || [];
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);

  items.forEach((item, idx) => {
    const unitPrice = item.price || 0;
    const itemTotal = item.discountedPrice !== undefined ? item.discountedPrice : (unitPrice * item.quantity);
    
    // Titre de l'article (tronqué si trop long)
    const title = item.name.length > 50 ? item.name.substring(0, 47) + '...' : item.name;
    
    doc.setFontSize(8.5);
    doc.text(title, 18, y + 4);
    
    if (item.discountPercent && item.discountPercent > 0) {
      doc.setFontSize(7);
      doc.setTextColor(5, 150, 105);
      doc.text(`(Remise grossiste -${item.discountPercent}% incluse)`, 18, y + 8);
      doc.setTextColor(30, 41, 59);
    }

    doc.setFontSize(8.5);
    doc.text(`${item.quantity}`, 122, y + 4);
    doc.text(`${unitPrice.toLocaleString('fr-FR')}`, 140, y + 4);
    doc.text(`${itemTotal.toLocaleString('fr-FR')}`, 170, y + 4);

    // Ligne de séparation
    doc.setDrawColor(241, 245, 249);
    doc.line(15, y + 10, 195, y + 10);

    y += 12;
  });

  // ── 4. SOUS-TOTAL ET TOTAL ──
  y += 4;
  const totalAmount = Number(order.total || 0);

  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(120, y, 75, 28, 2, 2, 'D');

  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Sous-total articles :', 125, y + 7);
  doc.text(`${totalAmount.toLocaleString('fr-FR')} FCFA`, 165, y + 7);

  doc.text('Livraison Express :', 125, y + 13);
  doc.setTextColor(5, 150, 105);
  doc.text('GRATUIT / INCLUS', 160, y + 13);

  doc.setDrawColor(226, 232, 240);
  doc.line(125, y + 16, 190, y + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(5, 150, 105);
  doc.text('TOTAL PAYÉ :', 125, y + 23);
  doc.text(`${totalAmount.toLocaleString('fr-FR')} FCFA`, 158, y + 23);

  // ── 5. TAMPON & BAS DE PAGE ──
  const bottomY = 240;

  // Tampon certifié MeetShop
  doc.setDrawColor(5, 150, 105);
  doc.setLineWidth(0.8);
  doc.roundedRect(15, bottomY, 70, 22, 3, 3, 'D');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(5, 150, 105);
  doc.text('PAIEMENT CONFIRMÉ', 23, bottomY + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Livraison sécurisée MeetShop', 23, bottomY + 12);
  doc.text('Garantie & Authenticité', 23, bottomY + 17);

  // Signature Vendeur
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Pour faire valoir ce que de droit,', 130, bottomY + 7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(shopName, 130, bottomY + 14);

  // Mentions légales bas de page
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('MeetShop Marketplace Cameroun — Douala & Yaoundé — Assistance 24/7 sur WhatsApp', 35, 280);
  doc.text('Ce reçu électronique est une preuve officielle d\'achat générée automatiquement.', 45, 284);

  // Téléchargement du fichier
  doc.save(`Recu_MeetShop_${orderId}.pdf`);
}
