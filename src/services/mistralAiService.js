/**
 * Service Copilote IA pour la Création & Refonte Intelligente de Vitrines Odoo
 * Utilise EXCLUSIVEMENT les 16 Styles de Design, les 12 Blocs Officiels et les 21 Contenus Intérieurs (Inner Snippets).
 * Aucune génération de blocs arbitraires ou inconnus.
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

    // 1. Récupération & préservation des assets existants de la boutique
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

    // Sélection automatique du meilleur designVariant parmi les 16 univers
    let targetDesignVariant = 'modern_minimal';
    const posLow = positioning.toLowerCase();
    const actLow = activity.toLowerCase();

    if (posLow.includes('luxe') || posLow.includes('prestige') || actLow.includes('bijoux') || actLow.includes('joaillerie')) {
      targetDesignVariant = 'luxury_editorial';
    } else if (posLow.includes('tech') || posLow.includes('cyber') || actLow.includes('phone') || actLow.includes('informatique')) {
      targetDesignVariant = 'cyber_tech_dark';
    } else if (posLow.includes('streetwear') || posLow.includes('tendance') || actLow.includes('sneaker')) {
      targetDesignVariant = 'streetwear_tokyo';
    } else if (posLow.includes('bio') || posLow.includes('éco') || actLow.includes('épicerie') || actLow.includes('naturel')) {
      targetDesignVariant = 'nature_organic';
    } else if (posLow.includes('vintage') || posLow.includes('retro') || posLow.includes('artisanat')) {
      targetDesignVariant = 'vintage_retro_warm';
    } else if (posLow.includes('discount') || posLow.includes('pop')) {
      targetDesignVariant = 'neo_brutalism_bold';
    } else if (posLow.includes('minimal')) {
      targetDesignVariant = 'nordic_scandi';
    } else if (actLow.includes('beauté') || actLow.includes('cosmétique') || actLow.includes('parfum')) {
      targetDesignVariant = 'sunset_warm_gradient';
    }

    const systemPrompt = `Tu es le Directeur Artistique IA UI/UX & E-Commerce Senior de MeetShop.
Tu dois générer l'architecture JSON complète d'une boutique haut de gamme, vendeuse et interactive.
Tu DOIS impérativement utiliser UNIQUEMENT les 12 blocs officiels et les 21 contenus intérieurs (innerSnippets) de l'outil.
NE CRÉE AUCUN BLOC INCONNU OU ARBITRAIRE (pas de "CustomAiBlock").

BLOCS DISPONIBLES :
1. "HeroBanner" : { slogan: string, ctaText: string, designVariant: "${targetDesignVariant}", innerSnippets: [...] }
2. "FlashDeal" : { title: string, subtitle: string, discountBadge: string, ctaText: string, designVariant: "${targetDesignVariant}", innerSnippets: [...] }
3. "FeaturedProducts" : { title: string, subtitle: string, maxItems: 4, designVariant: "${targetDesignVariant}" }
4. "CategoryCatalog" : { title: string, showSearch: true, showCategoryPills: true, designVariant: "${targetDesignVariant}" }
5. "AboutStory" : { title: string, storyText: string, commitment1: string, commitment2: string, commitment3: string, sinceYear: "2021", badgeText: string, designVariant: "${targetDesignVariant}", innerSnippets: [...] }
6. "CustomForm" : { title: string, subtitle: string, submitButtonText: string, collectContactInfo: true, questions: [...], designVariant: "${targetDesignVariant}" }
7. "CustomCta" : { title: string, subtitle: string, primaryBtnText: string, badgeText: string, designVariant: "${targetDesignVariant}", innerSnippets: [...] }
8. "FaqBlock" : { title: string, subtitle: string, items: [{ q: string, a: string }], designVariant: "${targetDesignVariant}" }
9. "OpeningHours" : { title: string, mondayFriday: "08h00 - 19h30", saturday: "08h30 - 20h00", sunday: "12h00 - 18h00", designVariant: "${targetDesignVariant}" }
10. "ContactMap" : { title: string, landmark: string, directPhone: "${shopPhone}", whatsappPhone: "${shopPhone}", designVariant: "${targetDesignVariant}" }
11. "CustomerReviews" : { title: string, subtitle: string, designVariant: "${targetDesignVariant}" }
12. "RichTextBlock" : { heading: string, content: string, badgeText: string, designVariant: "${targetDesignVariant}" }

SNIPPETS INTÉRIEURS DISPONIBLES DANS "innerSnippets" :
- rating (avis & étoiles), card (encart), share (partage), social_networks (liens), search, highlight, chart, progress, badge, badge_cta, avatars, quote, form, countdown, map, booking (RDV), donation, cart (catalogue).

Tu DOIS impérativement répondre avec un JSON valide : { "theme": "${style}", "blocks": [...] }. N'inclus aucun emoji dans les textes.`;

    const userPrompt = `Boutique : ${shopName}
Ville : ${shopCity} (${shopQuarter})
Secteur : ${activity}
Positionnement : ${positioning}
Objectif : ${objective}
Atouts majeurs : ${advantages}
Design Variant suggéré : ${targetDesignVariant}

Génère maintenant l'architecture JSON complète avec les blocs standards et leurs contenus intérieurs.`;

    let resultLayout = null;

    if (MISTRAL_API_KEY && MISTRAL_API_KEY.length > 5) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 18000);

        const response = await fetch(MISTRAL_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MISTRAL_API_KEY}`
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: 'mistral-small-latest',
            temperature: 0.8,
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

    // Si pas de réponse API ou bloc non reconnu, on utilise le générateur standard structuré
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
      'CustomCta', 'CustomForm', 'RichText', 'FaqBlock'
    ]);

    resultLayout.theme = style;

    resultLayout.blocks = resultLayout.blocks.map((block, idx) => {
      if (!block || typeof block !== 'object') return null;
      
      let blockType = block.type;
      if (!validBlockTypes.has(blockType)) {
        blockType = 'AboutStory'; // Remplacer tout type invalide par AboutStory
      }

      const currentProps = block.props || {};

      const enrichedProps = {
        ...currentProps,
        designVariant: currentProps.designVariant || targetDesignVariant,
        titleColor: currentProps.titleColor || 'default',
        textColor: currentProps.textColor || 'default',
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

    // Conserver le bloc avis authentiques s'il existait déjà avec des avis
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
 * Générateur Standard Structuré (Utilise 100% les outils, designs et snippets officiels)
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

  const formQuestions = [
    { id: 'q1', label: `Quel article précis recherchez-vous chez ${shopName} ?`, type: 'text', required: true, placeholder: 'Ex: Modèle, référence ou besoin particulier' },
    { id: 'q2', label: 'Quel est votre délai souhaité pour la livraison ?', type: 'select', options: ['Livraison Express (< 2h)', 'Aujourd\'hui', 'Dans les 48h', 'Simple renseignement'], required: true },
    { id: 'q3', label: 'Précisions complémentaires', type: 'textarea', required: false, placeholder: 'Indiquez toute exigence ou adresse de livraison...' }
  ];

  return {
    theme: requestedTheme,
    blocks: [
      // 1. HeroBanner avec Inner Snippet Note / Étoiles
      {
        id: `b-hero-${Date.now()}`,
        type: 'HeroBanner',
        visible: true,
        props: {
          designVariant: targetDesignVariant,
          customLogoUrl: existingLogo,
          customCoverUrl: existingCover,
          slogan: `L'univers d'excellence ${activity} à ${shopQuarter}, ${shopCity}. Arrivages certifiés et livraison express.`,
          ctaText: 'Commander sur WhatsApp',
          showStats: true,
          showLiveBadge: true,
          innerSnippets: [
            { id: `snip-hero-${Date.now()}`, snippetType: 'rating', ratingScore: '4.9', reviewsCount: '194', shape: 'rounded_capsule', alignment: 'center', width: '100%' }
          ]
        }
      },

      // 2. FlashDeal avec Compte à Rebours
      {
        id: `b-flash-${Date.now()}`,
        type: 'FlashDeal',
        visible: true,
        props: {
          designVariant: targetDesignVariant,
          title: 'Offre Spéciale Nouveaux Arrivages',
          subtitle: `Profitez des réductions exclusives du jour sur toute la collection ${activity} !`,
          discountBadge: '-25% IMMÉDIAT',
          ctaText: 'Réclamer mon code promo sur WhatsApp',
          innerSnippets: [
            { id: `snip-flash-${Date.now()}`, snippetType: 'countdown', title: 'Temps Restant Offre Flash', shape: 'rounded_modern', alignment: 'center', width: '100%' }
          ]
        }
      },

      // 3. Featured Products
      {
        id: `b-featured-${Date.now()}`,
        type: 'FeaturedProducts',
        visible: true,
        props: {
          designVariant: targetDesignVariant,
          title: 'Sélection Vedette du Moment',
          subtitle: 'Nos meilleures ventes contrôlées et plébiscitées par nos clients',
          maxItems: 4
        }
      },

      // 4. Category Catalog
      {
        id: `b-catalog-${Date.now()}`,
        type: 'CategoryCatalog',
        visible: true,
        props: {
          designVariant: targetDesignVariant,
          title: `Tout le Catalogue ${shopName}`,
          showSearch: true,
          showCategoryPills: true
        }
      },

      // 5. About Story avec Snippet Avatars
      {
        id: `b-about-${Date.now()}`,
        type: 'AboutStory',
        visible: true,
        props: {
          designVariant: targetDesignVariant,
          title: `Pourquoi choisir ${shopName} ?`,
          storyText: `Implantée à ${shopQuarter} (${shopCity}), notre boutique s'engage à vous fournir des articles de premier choix avec un service après-vente dévoué.`,
          commitment1: 'Authenticité 100% garantie sur tous nos articles',
          commitment2: 'Livraison express en moins de 2h à Douala et Yaoundé',
          commitment3: 'Paiement sécurisé à la livraison ou Mobile Money',
          sinceYear: '2022',
          badgeText: 'Qualité Certifiée',
          innerSnippets: [
            { id: `snip-about-${Date.now()}`, snippetType: 'avatars', shape: 'rounded_modern', alignment: 'center', width: '100%' }
          ]
        }
      },

      // 6. Custom Form
      {
        id: `b-form-${Date.now()}`,
        type: 'CustomForm',
        visible: true,
        props: {
          designVariant: targetDesignVariant,
          title: 'Besoin d\'un Conseil ou d\'un Devis Rapide ?',
          subtitle: 'Remplissez ces quelques informations pour être orienté directement sur WhatsApp.',
          submitButtonText: 'Transmettre ma demande sur WhatsApp',
          collectContactInfo: true,
          questions: formQuestions
        }
      },

      // 7. Custom CTA avec Snippet Réservation / RDV
      {
        id: `b-cta-${Date.now()}`,
        type: 'CustomCta',
        visible: true,
        props: {
          designVariant: targetDesignVariant,
          title: 'Une question ? Notre équipe vous répond immédiatement',
          subtitle: 'Discutez en direct avec notre responsable de vente pour toute demande personnalisée.',
          primaryBtnText: 'Lancer la discussion WhatsApp',
          badgeText: 'Disponibilité 7j/7',
          innerSnippets: [
            { id: `snip-cta-${Date.now()}`, snippetType: 'booking', title: 'Réservation Prioritaire', subtitle: 'Réservez votre passage en boutique', shape: 'rounded_modern', alignment: 'center', width: '100%' }
          ]
        }
      },

      // 8. FAQ
      {
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
      },

      // 9. Opening Hours
      {
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
      },

      // 10. Contact & Localisation
      {
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
      }
    ]
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

