/**
 * Moteur IA Génératif Avancé pour Vitrines & Boutiques Odoo (MeetShop AI Copilot)
 * Connecté à Mistral AI avec prompts de direction artistique riches,
 * combinant les 16 univers graphiques, les 12 blocs modulaires,
 * les 21 snippets intérieurs, les 6 formes géométriques et les 5 styles de boutons.
 */

const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY || 'rqxoM1TXeI5KguDB2UzE4Sya7JlCdAHA';
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

export async function generateStorefrontWithMistral({ shop = {}, answers = {} }) {
  try {
    const shopName = shop?.name || 'Notre Boutique';
    const shopCity = shop?.city || 'Douala';
    const shopQuarter = shop?.quarter || 'Akwa';
    const shopCategory = shop?.category || 'Commerce Général';
    const shopPhone = shop?.phone || '+237699123456';

    // 1. Récupération des assets existants
    const existingHeroBlock = shop?.layout_config?.blocks?.find(b => b && b.type === 'HeroBanner');
    const existingLogo = existingHeroBlock?.props?.customLogoUrl || shop?.logo_url || shop?.avatar || shop?.logo || '';
    const existingCover = existingHeroBlock?.props?.customCoverUrl || shop?.banner_url || shop?.cover_url || '';
    
    const existingContactBlock = shop?.layout_config?.blocks?.find(b => b && b.type === 'ContactMap');
    const existingLandmark = existingContactBlock?.props?.landmark || shop?.address || `Situé à ${shopQuarter}, ${shopCity}`;
    const existingDirectPhone = existingContactBlock?.props?.directPhone || shopPhone;
    const existingWhatsappPhone = existingContactBlock?.props?.whatsappPhone || shopPhone;
    const existingCustomMapsUrl = existingContactBlock?.props?.customMapsUrl || '';

    const existingReviewsBlock = shop?.layout_config?.blocks?.find(b => b && b.type === 'CustomerReviews');

    const siteType = answers.siteType || 'un eCommerce';
    const activity = answers.activity || shopCategory;
    const positioning = answers.positioning || 'moderne';
    const advantages = answers.advantages || 'Livraison express < 2h, produits originaux certifiés';
    const style = answers.style || shop?.layout_config?.theme || 'emerald';
    const objective = answers.objective || 'Ventes directes WhatsApp et devis personnalisés';

    // Sélection intelligente de la variante de design parmi les 16 univers Odoo
    let targetDesignVariant = answers.designVariant && answers.designVariant !== 'auto' ? answers.designVariant : null;

    if (!targetDesignVariant) {
      const posLow = positioning.toLowerCase();
      const actLow = activity.toLowerCase();

      if (posLow.includes('luxe') || posLow.includes('prestige') || actLow.includes('bijoux') || actLow.includes('joaillerie') || actLow.includes('montre')) {
        targetDesignVariant = 'luxury_editorial';
      } else if (posLow.includes('tech') || posLow.includes('cyber') || actLow.includes('phone') || actLow.includes('informatique') || actLow.includes('laptop')) {
        targetDesignVariant = 'cyber_tech_dark';
      } else if (posLow.includes('streetwear') || posLow.includes('tendance') || actLow.includes('sneaker') || actLow.includes('chaussure')) {
        targetDesignVariant = 'streetwear_tokyo';
      } else if (posLow.includes('bio') || posLow.includes('éco') || actLow.includes('épicerie') || actLow.includes('naturel') || actLow.includes('aliment')) {
        targetDesignVariant = 'nature_organic';
      } else if (posLow.includes('vintage') || posLow.includes('retro') || posLow.includes('artisanat') || actLow.includes('terroir')) {
        targetDesignVariant = 'vintage_retro_warm';
      } else if (posLow.includes('discount') || posLow.includes('pop') || posLow.includes('bonne affaire')) {
        targetDesignVariant = 'neo_brutalism_bold';
      } else if (posLow.includes('minimal')) {
        targetDesignVariant = 'nordic_scandi';
      } else if (actLow.includes('beauté') || actLow.includes('cosmétique') || actLow.includes('parfum') || actLow.includes('mode')) {
        targetDesignVariant = 'sunset_warm_gradient';
      } else {
        targetDesignVariant = 'modern_minimal';
      }
    }

    const systemPrompt = `Tu es le Directeur Artistique IA UI/UX Senior & Spécialiste E-Commerce de MeetShop.
Ta mission est de concevoir une architecture de vitrine boutique UNIQUE, DIVERSIFIÉE et HAUTEMENT CONVERTISSEUSE pour le commerce au Cameroun.

RÈGLES STRICTES D'ARCHITECTURE :
1. Tu DOIS générer un JSON valide { "theme": "${style}", "blocks": [...] }.
2. Utilise EXCLUSIVEMENT les 12 types de blocs modulaires officiels de MeetShop :
   - "HeroBanner"
   - "FlashDeal"
   - "FeaturedProducts"
   - "CategoryCatalog"
   - "AboutStory"
   - "CustomForm"
   - "CustomCta"
   - "FaqBlock"
   - "OpeningHours"
   - "ContactMap"
   - "CustomerReviews"
   - "RichTextBlock"
3. N'invente AUCUN nom de bloc inconnu.
4. Dans "innerSnippets" de chaque bloc, choisis parmi :
   - "rating", "card", "share", "social_networks", "search", "highlight", "chart", "progress", "badge", "badge_cta", "avatars", "quote", "form", "countdown", "booking", "cart_button".
5. Pour les formes d'avatars / photos ("avatarShape"), varie parmi : "circle", "squircle", "cyber_octo", "capsule", "leaf_asymmetric", "bubble_callout".
6. Pour les styles de boutons ("buttonStyle"), varie parmi : "glow_gradient", "glassmorphism", "neo_brutalist", "ghost_arrow", "pill_chunky".
7. N'INCLUS AUCUN ÉMOJI DANS LES TEXTES. Rédige un français commercial soigné, professionnel et engageant.`;

    const userPrompt = `Boutique : ${shopName}
Ville : ${shopCity} (Quartier : ${shopQuarter})
Secteur : ${activity}
Positionnement : ${positioning}
Objectif : ${objective}
Atouts majeurs : ${advantages}
Univers graphique cible : ${targetDesignVariant}

Génère maintenant une architecture JSON complète et originale de 6 à 9 blocs avec des textes d'accroche vendeurs adaptés à la cible locale.`;

    let resultLayout = null;

    if (MISTRAL_API_KEY && MISTRAL_API_KEY.length > 5) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        const response = await fetch(MISTRAL_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MISTRAL_API_KEY}`
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: 'mistral-small-latest',
            temperature: 0.85,
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ]
          })
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          let content = data.choices?.[0]?.message?.content;
          if (content) {
            content = content.replace(/```json/gi, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(content);
            if (parsed && Array.isArray(parsed.blocks) && parsed.blocks.length > 0) {
              resultLayout = parsed;
            }
          }
        }
      } catch (apiErr) {
        console.warn('ℹ️ Bascule fluide vers le générateur expert standard :', apiErr?.message || apiErr);
      }
    }

    // Si pas de réponse API ou bloc non reconnu, on utilise le générateur expert structuré multi-variantes
    if (!resultLayout || !Array.isArray(resultLayout.blocks) || resultLayout.blocks.length === 0) {
      resultLayout = generateStandardLayout({ 
        shop, 
        answers: { ...answers, siteType, activity, positioning, advantages, style, objective }, 
        targetDesignVariant,
        existingLogo, 
        existingCover, 
        existingLandmark 
      });
    }

    // Assainissement strict pour garantir UNIQUEMENT des types de blocs officiels
    const validBlockTypes = new Set([
      'HeroBanner', 'FlashDeal', 'FeaturedProducts', 'CategoryCatalog', 
      'AboutStory', 'OpeningHours', 'CustomerReviews', 'ContactMap', 
      'CustomCta', 'CustomForm', 'RichTextBlock', 'FaqBlock'
    ]);

    resultLayout.theme = style;

    resultLayout.blocks = resultLayout.blocks.map((block, idx) => {
      if (!block || typeof block !== 'object') return null;
      
      let blockType = block.type;
      if (!validBlockTypes.has(blockType)) {
        blockType = 'AboutStory';
      }

      const currentProps = block.props || {};

      const enrichedProps = {
        ...currentProps,
        designVariant: currentProps.designVariant || targetDesignVariant,
        titleColor: currentProps.titleColor || 'default',
        textColor: currentProps.textColor || 'default',
        avatarShape: currentProps.avatarShape || (idx % 2 === 0 ? 'squircle' : 'circle'),
        buttonStyle: currentProps.buttonStyle || 'glow_gradient',
        innerSnippets: Array.isArray(currentProps.innerSnippets) ? currentProps.innerSnippets : []
      };

      if (blockType === 'HeroBanner') {
        enrichedProps.customLogoUrl = existingLogo || currentProps.customLogoUrl || '';
        enrichedProps.customCoverUrl = existingCover || currentProps.customCoverUrl || '';
        if (!enrichedProps.slogan) enrichedProps.slogan = `Bienvenue chez ${shopName} — Votre référence ${activity} à ${shopQuarter}, ${shopCity}.`;
        if (!enrichedProps.ctaText) enrichedProps.ctaText = 'Commander sur WhatsApp';
        enrichedProps.showStats = true;
        enrichedProps.showLiveBadge = true;

        if (enrichedProps.innerSnippets.length === 0) {
          enrichedProps.innerSnippets = [
            { id: `snip-${Date.now()}-1`, snippetType: 'rating', ratingScore: '4.9', reviewsCount: '185', alignment: 'center', shape: 'rounded_capsule', width: '100%' }
          ];
        }
      }

      if (blockType === 'ContactMap') {
        enrichedProps.landmark = existingLandmark || currentProps.landmark || `Situé à ${shopQuarter}, ${shopCity}`;
        enrichedProps.directPhone = existingDirectPhone;
        enrichedProps.whatsappPhone = existingWhatsappPhone;
        enrichedProps.customMapsUrl = existingCustomMapsUrl || currentProps.customMapsUrl || '';
        enrichedProps.city = shopCity;
      }

      return {
        id: block.id || `b-${blockType.toLowerCase()}-${Date.now()}-${idx}`,
        type: blockType,
        visible: block.visible !== false,
        props: enrichedProps
      };
    }).filter(Boolean);

    // Conserver les avis authentiques s'ils existaient
    if (existingReviewsBlock && !resultLayout.blocks.some(b => b && b.type === 'CustomerReviews')) {
      resultLayout.blocks.splice(Math.max(0, resultLayout.blocks.length - 2), 0, existingReviewsBlock);
    }

    return resultLayout;
  } catch (globalErr) {
    console.error('Erreur globale generateStorefrontWithMistral:', globalErr);
    return generateStandardLayout({ shop, answers });
  }
}

/**
 * Générateur Standard Dynamique Multi-Variantes (Garantit une diversité totale)
 */
function generateStandardLayout({ 
  shop = {}, 
  answers = {}, 
  targetDesignVariant = 'modern_minimal',
  existingLogo = '', 
  existingCover = '', 
  existingLandmark = '' 
}) {
  const shopName = shop?.name || 'Notre Boutique';
  const shopCity = shop?.city || 'Douala';
  const shopQuarter = shop?.quarter || 'Akwa';
  const shopPhone = shop?.phone || '+237699123456';
  const activity = answers?.activity || shop?.category || 'Commerce Général';
  const requestedTheme = answers?.style || shop?.layout_config?.theme || 'emerald';
  const siteType = answers?.siteType || 'eCommerce';

  const formQuestions = [
    { id: 'q1', label: `Quel article précis recherchez-vous chez ${shopName} ?`, type: 'text', required: true, placeholder: 'Ex: Modèle, référence ou besoin particulier' },
    { id: 'q2', label: 'Quel est votre délai souhaité pour la livraison ?', type: 'select', options: ['Livraison Express (< 2h)', 'Aujourd\'hui', 'Dans les 48h', 'Simple renseignement'], required: true },
    { id: 'q3', label: 'Précisions complémentaires', type: 'textarea', required: false, placeholder: 'Indiquez toute exigence ou adresse de livraison...' }
  ];

  // Variations selon le type de commerce
  const isDestockage = siteType.toLowerCase().includes('destock') || siteType.toLowerCase().includes('promo');
  const isExclusive = siteType.toLowerCase().includes('exclusive') || siteType.toLowerCase().includes('marque');
  const isVitrine = siteType.toLowerCase().includes('vitrine');

  const blocks = [];

  // 1. HeroBanner Adapté
  blocks.push({
    id: `b-hero-${Date.now()}`,
    type: 'HeroBanner',
    visible: true,
    props: {
      designVariant: targetDesignVariant,
      customLogoUrl: existingLogo,
      customCoverUrl: existingCover,
      slogan: isExclusive
        ? `L'univers exclusif et haute précision ${activity} à ${shopQuarter}, ${shopCity}.`
        : isDestockage
          ? `Offres exceptionnelles & arrivages directs ${activity} à ${shopQuarter}, ${shopCity}. Prix imbattables.`
          : `L'excellence ${activity} à ${shopQuarter}, ${shopCity}. Commandez en direct et recevez sous 2h.`,
      ctaText: isVitrine ? 'Découvrir la Collection' : 'Commander sur WhatsApp',
      showStats: true,
      showLiveBadge: true,
      avatarShape: isExclusive ? 'leaf_asymmetric' : 'squircle',
      buttonStyle: isDestockage ? 'neo_brutalist' : 'glow_gradient',
      innerSnippets: [
        { id: `snip-hero-${Date.now()}`, snippetType: 'rating', ratingScore: '4.9', reviewsCount: '194', shape: 'rounded_capsule', alignment: 'center', width: '100%' }
      ]
    }
  });

  // 2. FlashDeal ou Offre Spéciale
  if (isDestockage || !isVitrine) {
    blocks.push({
      id: `b-flash-${Date.now()}`,
      type: 'FlashDeal',
      visible: true,
      props: {
        designVariant: targetDesignVariant,
        title: isDestockage ? 'Vente Flash Déstockage Immédiat' : 'Offre Spéciale Nouveaux Arrivages',
        subtitle: `Profitez des réductions exclusives du jour sur toute la collection ${activity} !`,
        discountBadge: isDestockage ? '-35% IMMÉDIAT' : '-25% EXCLUSIF',
        ctaText: 'Réclamer mon offre sur WhatsApp',
        buttonStyle: 'glow_gradient',
        innerSnippets: [
          { id: `snip-flash-${Date.now()}`, snippetType: 'countdown', title: 'Temps Restant Offre Flash', shape: 'rounded_modern', alignment: 'center', width: '100%' }
        ]
      }
    });
  }

  // 3. Featured Products
  blocks.push({
    id: `b-featured-${Date.now()}`,
    type: 'FeaturedProducts',
    visible: true,
    props: {
      designVariant: targetDesignVariant,
      title: isExclusive ? 'Pièces Rares & Éditions Limitées' : 'Sélection Vedette du Moment',
      subtitle: 'Nos articles les plus demandés, contrôlés et plébiscités par nos clients',
      maxItems: 4
    }
  });

  // 4. Category Catalog
  blocks.push({
    id: `b-catalog-${Date.now()}`,
    type: 'CategoryCatalog',
    visible: true,
    props: {
      designVariant: targetDesignVariant,
      title: `Tout le Catalogue ${shopName}`,
      showSearch: true,
      showCategoryPills: true
    }
  });

  // 5. About Story avec Avatars ou Citation
  blocks.push({
    id: `b-about-${Date.now()}`,
    type: 'AboutStory',
    visible: true,
    props: {
      designVariant: targetDesignVariant,
      title: `L'Engagement ${shopName}`,
      storyText: `Implantée à ${shopQuarter} (${shopCity}), notre équipe sélectionne des articles ${activity} avec des critères de qualité stricts et une garantie de satisfaction.`,
      commitment1: 'Authenticité 100% garantie sur tous nos produits',
      commitment2: 'Livraison express en moins de 2h à Douala et Yaoundé',
      commitment3: 'Paiement sécurisé à la livraison ou Mobile Money',
      sinceYear: '2022',
      badgeText: 'Qualité Certifiée',
      avatarShape: 'squircle',
      innerSnippets: [
        { id: `snip-about-${Date.now()}`, snippetType: isExclusive ? 'quote' : 'avatars', shape: 'rounded_modern', alignment: 'center', width: '100%' }
      ]
    }
  });

  // 6. Custom Form
  blocks.push({
    id: `b-form-${Date.now()}`,
    type: 'CustomForm',
    visible: true,
    props: {
      designVariant: targetDesignVariant,
      title: 'Besoin d\'un Conseil ou d\'un Devis Personnalisé ?',
      subtitle: 'Indiquez votre besoin pour recevoir une proposition directe sur WhatsApp.',
      submitButtonText: 'Transmettre ma demande',
      buttonStyle: 'glow_gradient',
      collectContactInfo: true,
      questions: formQuestions
    }
  });

  // 7. Custom CTA
  blocks.push({
    id: `b-cta-${Date.now()}`,
    type: 'CustomCta',
    visible: true,
    props: {
      designVariant: targetDesignVariant,
      title: 'Une question ? Notre équipe vous répond immédiatement',
      subtitle: 'Discutez en direct avec notre responsable de vente pour toute demande.',
      primaryBtnText: 'Lancer la discussion WhatsApp',
      badgeText: 'Réponse en moins de 5 min',
      buttonStyle: 'glow_gradient',
      innerSnippets: [
        { id: `snip-cta-${Date.now()}`, snippetType: 'booking', title: 'Réservation Prioritaire', subtitle: 'Réservez votre article avant rupture', shape: 'rounded_modern', alignment: 'center', width: '100%' }
      ]
    }
  });

  // 8. FAQ
  blocks.push({
    id: `b-faq-${Date.now()}`,
    type: 'FaqBlock',
    visible: true,
    props: {
      designVariant: targetDesignVariant,
      title: 'Questions Fréquentes',
      subtitle: 'Tout ce que vous devez savoir avant de passer commande',
      items: [
        { q: 'Comment se passe la livraison ?', a: `Les livraisons sont assurées sous 2h à ${shopCity} et en 24h pour les autres villes du Cameroun.` },
        { q: 'Puis-je vérifier l\'article avant de payer ?', a: 'Absolument ! Vous avez le droit d\'inspecter votre colis avant de régler au livreur.' },
        { q: 'Quels sont les modes de paiement acceptés ?', a: 'Espèces à la livraison, Orange Money et MTN Mobile Money.' }
      ]
    }
  });

  // 9. Opening Hours
  blocks.push({
    id: `b-hours-${Date.now()}`,
    type: 'OpeningHours',
    visible: true,
    props: {
      designVariant: targetDesignVariant,
      title: 'Horaires d\'Ouverture & Retraits',
      statusText: 'Ouvert maintenant',
      mondayFriday: '08h00 - 19h30',
      saturday: '08h30 - 20h00',
      sunday: '12h00 - 18h00'
    }
  });

  // 10. Contact Map
  blocks.push({
    id: `b-contact-${Date.now()}`,
    type: 'ContactMap',
    visible: true,
    props: {
      designVariant: targetDesignVariant,
      title: 'Nous Rendre Visite en Boutique',
      landmark: existingLandmark || `Situé à ${shopQuarter}, ${shopCity}`,
      directPhone: shopPhone,
      whatsappPhone: shopPhone,
      city: shopCity
    }
  });

  return {
    theme: requestedTheme,
    blocks
  };
}

export async function generateCustomBlockWithMistral({ prompt, shop = {} }) {
  return {
    name: 'Bloc Spécial Boutique',
    category: 'Mise en avant',
    description: prompt || 'Composant conçu pour valoriser vos offres',
    iconName: 'Sparkles',
    structure: {
      type: 'bento_grid',
      badge: 'Exclusivité',
      title: shop.name || 'Notre Sélection',
      subtitle: prompt || 'Découvrez nos points forts et commandez en direct',
      cards: [
        { span: 'col-span-2', title: 'Livraison Express < 2h', desc: 'Service rapide et garanti à Douala & Yaoundé', badge: 'Express', icon: 'Zap' },
        { span: 'col-span-1', title: 'Articles 100% Conformes', desc: 'Contrôle qualité strict avant expédition', badge: 'Certifié', icon: 'ShieldCheck' }
      ]
    }
  };
}

export async function modifyCustomBlockWithMistral({ block = {}, modificationPrompt = '', shop = {} }) {
  const props = block.props || {};
  return {
    ...props,
    title: props.title || 'Sélection Spéciale',
    subtitle: modificationPrompt || props.subtitle || 'Service rapide et produits certifiés'
  };
}
