/**
 * DÉFINITIONS DES BLOCS MODULAIRES & VARIANTES DE STYLES POUR LES BOUTIQUES MEETSHOP
 * Style Odoo Website Builder avec moteur de design modulaire
 */

export const AVAILABLE_BLOCKS = [
  {
    type: 'HeroBanner',
    name: 'Hero Banner',
    description: 'Bannière de couverture, logo, badge vérifié, slogan et CTA WhatsApp direct.',
    icon: 'Sparkles',
    category: 'Header & Identité',
    styleVariants: [
      { id: 'classic', name: 'Classique Superposé', desc: 'Bannière avec grand profil chevauchant et badges de confiance' },
      { id: 'split', name: 'Split Asymétrique', desc: '2 colonnes modernes avec couverture dynamique et carte de profil flottante' },
      { id: 'minimal_luxury', name: 'Luxe & Haute-Couture', desc: 'Typographie d\'orfèvre centrée, lisérés or/argent et minimalisme pur' },
      { id: 'glassmorphism', name: 'Verre Dépoli Flottant', desc: 'Carte translucide flottant sur couverture floutée en pleine largeur' },
      { id: 'cyber_futuristic', name: 'Cyberpunk & Néo-Tech', desc: 'Bordures lumineuses néon, puces technologiques et badges énergiques' }
    ],
    avatarStyles: [
      { id: 'rounded', name: 'Squircle Arrondi' },
      { id: 'circle', name: 'Cercle Parfait' },
      { id: 'sharp', name: 'Carré Prestige' },
      { id: 'hexagon', name: 'Badge Angulaire' }
    ],
    buttonStyles: [
      { id: 'modern_rounded', name: 'Moderne Arrondi' },
      { id: 'pill', name: 'Capsule (Pill)' },
      { id: 'sharp_luxury', name: 'Haute Couture' },
      { id: 'glass_glow', name: 'Verre Lumineux' },
      { id: 'floating_3d', name: 'Élévation 3D' }
    ],
    defaultProps: {
      styleVariant: 'classic',
      avatarStyle: 'rounded',
      buttonStyle: 'modern_rounded',
      slogan: 'Votre destination shopping de référence à Douala & Yaoundé.',
      ctaText: 'Discuter sur WhatsApp',
      showStats: true,
      showLiveBadge: true,
      customCoverUrl: '',
      customLogoUrl: ''
    }
  },
  {
    type: 'FlashDeal',
    name: 'Flash Deal (Offre Limitée)',
    description: 'Bannière promotionnelle temporaire avec compte à rebours et réduction en FCFA.',
    icon: 'Zap',
    category: 'Promotions',
    styleVariants: [
      { id: 'countdown_banner', name: 'Compteur Géant', desc: 'Affichage fort avec horloge digitale et grand visuel produit' },
      { id: 'split_deal_card', name: 'Coupon Détachable', desc: 'Bordures pointillées façon ticket promo exclusif' },
      { id: 'neon_fire', name: 'Néon Électrique', desc: 'Ambiance enflammée avec lueur pulsante et badge dynamique' },
      { id: 'minimal_urgent', name: 'Bandeau Épuré', desc: 'Bandeau promo discret et élégant' }
    ],
    buttonStyles: [
      { id: 'modern_rounded', name: 'Moderne Arrondi' },
      { id: 'pill', name: 'Capsule (Pill)' },
      { id: 'sharp_luxury', name: 'Haute Couture' },
      { id: 'glass_glow', name: 'Verre Lumineux' },
      { id: 'floating_3d', name: 'Élévation 3D' }
    ],
    defaultProps: {
      styleVariant: 'countdown_banner',
      buttonStyle: 'modern_rounded',
      title: 'Vente Flash Exceptionnelle !',
      subtitle: 'Jusqu\'à 30% de remise immédiate sur une sélection d\'articles.',
      discountBadge: '-25% IMMÉDIAT',
      endsInHours: 24,
      targetDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      ctaText: 'Profiter de l\'offre',
      dealImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80',
    }
  },
  {
    type: 'FeaturedProducts',
    name: 'Produits Vedettes',
    description: 'Carrousel ou grille des meilleurs articles mis en avant par le vendeur.',
    icon: 'Flame',
    category: 'Catalogue',
    styleVariants: [
      { id: 'grid', name: 'Grille Standard', desc: 'Grille responsive équilibrée' },
      { id: 'scroll', name: 'Carrousel Défilant', desc: 'Défilement horizontal fluide' },
      { id: 'editorial_staggered', name: 'Mise en Page Éditoriale', desc: 'Asymétrie magazine avec focus sur le premier article' }
    ],
    cardStyles: [
      { id: 'standard', name: 'Standard Épuré' },
      { id: 'minimal_luxury', name: 'Luxe Minimaliste' },
      { id: 'modern_glass', name: 'Verre Dépoli' },
      { id: 'neo_brutalism', name: 'Néo-Brutalisme' }
    ],
    buttonStyles: [
      { id: 'modern_rounded', name: 'Moderne Arrondi' },
      { id: 'pill', name: 'Capsule (Pill)' },
      { id: 'sharp_luxury', name: 'Haute Couture' },
      { id: 'glass_glow', name: 'Verre Lumineux' },
      { id: 'floating_3d', name: 'Élévation 3D' }
    ],
    defaultProps: {
      styleVariant: 'grid',
      cardStyle: 'standard',
      buttonStyle: 'modern_rounded',
      title: 'Nos Meilleures Ventes',
      subtitle: 'Sélection coup de cœur garantie par la boutique',
      maxItems: 4,
      layout: 'grid'
    }
  },
  {
    type: 'CategoryCatalog',
    name: 'Catalogue Complet',
    description: 'Grille complète des produits avec filtre par catégories et recherche interne.',
    icon: 'Layers',
    category: 'Catalogue',
    cardStyles: [
      { id: 'standard', name: 'Standard Épuré' },
      { id: 'minimal_luxury', name: 'Luxe Minimaliste' },
      { id: 'modern_glass', name: 'Verre Dépoli' },
      { id: 'neo_brutalism', name: 'Néo-Brutalisme' }
    ],
    buttonStyles: [
      { id: 'modern_rounded', name: 'Moderne Arrondi' },
      { id: 'pill', name: 'Capsule (Pill)' },
      { id: 'sharp_luxury', name: 'Haute Couture' },
      { id: 'glass_glow', name: 'Verre Lumineux' },
      { id: 'floating_3d', name: 'Élévation 3D' }
    ],
    defaultProps: {
      cardStyle: 'standard',
      buttonStyle: 'modern_rounded',
      title: 'Tous les Articles Disponibles',
      showSearch: true,
      showCategoryPills: true,
      itemsPerPage: 12,
    }
  },
  {
    type: 'AboutStory',
    name: 'Histoire & Engagements',
    description: 'Histoire de la boutique, valeurs et conditions de livraison locale rapide.',
    icon: 'BookOpen',
    category: 'Contenu & Confiance',
    styleVariants: [
      { id: 'story_classic', name: '3 Piliers Classiques', desc: 'Texte d\'introduction et 3 engagements clés' },
      { id: 'split_badges', name: 'Split avec Grands Badges', desc: 'Manifeste à gauche et badges visuels flottants à droite' },
      { id: 'timeline_quote', name: 'Citation & Signature', desc: 'Style interview ou citation authentique du gérant' },
      { id: 'stat_cards', name: 'Cartes de Confiance 3D', desc: '3 cartes surélevées avec métriques et garanties' }
    ],
    defaultProps: {
      styleVariant: 'story_classic',
      title: 'Qui sommes-nous ?',
      storyText: 'Implantés au cœur du Cameroun, nous sélectionnons rigoureusement des articles de premier choix pour vous garantir qualité, authenticité et satisfaction immédiate.',
      commitment1: 'Livraison express en moins de 2h',
      commitment2: 'Produits certifiés & testés avant envoi',
      commitment3: 'Paiement à la réception (Cash ou Mobile Money)',
      sinceYear: '2022',
      badgeText: 'Commerçant Vérifié MeetShop'
    }
  },
  {
    type: 'OpeningHours',
    name: 'Horaires & Disponibilité',
    description: 'Horaires d\'ouverture, quartier physique et statut en direct (Ouvert / Fermé).',
    icon: 'Clock',
    category: 'Informations Pratiques',
    styleVariants: [
      { id: 'grid_badges', name: 'Grille 3 Jours', desc: '3 blocs distincts (Semaine, Samedi, Dimanche)' },
      { id: 'compact_timeline', name: 'Planning Minimaliste', desc: 'Lignes épurées avec indicateur de direct' },
      { id: 'status_banner', name: 'Bandeau Live Immédiat', desc: 'Mise en avant immédiate de la disponibilité' }
    ],
    defaultProps: {
      styleVariant: 'grid_badges',
      title: 'Horaires & Disponibilité Locale',
      statusText: 'Ouvert maintenant',
      mondayFriday: '08h00 - 19h30',
      saturday: '08h30 - 20h00',
      sunday: '12h00 - 18h00 (Urgences WhatsApp)',
      dispatchNotice: 'Expéditions vers Douala & Yaoundé en continu.',
    }
  },
  {
    type: 'CustomerReviews',
    name: 'Avis Clients Vérifiés',
    description: 'Grille d\'avis clients réels ayant passé commande avec note sur 5 étoiles.',
    icon: 'Star',
    category: 'Contenu & Confiance',
    styleVariants: [
      { id: 'masonry_cards', name: 'Cartes Maçonnées', desc: 'Grille de cartes d\'avis avec badge d\'authenticité' },
      { id: 'quote_carousel', name: 'Grandes Citations', desc: 'Format testimonial grand format avec avatar' },
      { id: 'compact_feed', name: 'Flux Compact', desc: 'Liste compacte et dense optimisée mobile' }
    ],
    cardStyles: [
      { id: 'standard', name: 'Standard Épuré' },
      { id: 'minimal_luxury', name: 'Luxe Minimaliste' },
      { id: 'modern_glass', name: 'Verre Dépoli' },
      { id: 'neo_brutalism', name: 'Néo-Brutalisme' }
    ],
    buttonStyles: [
      { id: 'modern_rounded', name: 'Moderne Arrondi' },
      { id: 'pill', name: 'Capsule (Pill)' },
      { id: 'sharp_luxury', name: 'Haute Couture' },
      { id: 'glass_glow', name: 'Verre Lumineux' },
      { id: 'floating_3d', name: 'Élévation 3D' }
    ],
    defaultProps: {
      styleVariant: 'masonry_cards',
      cardStyle: 'standard',
      buttonStyle: 'modern_rounded',
      title: 'Avis Clients Vérifiés',
      subtitle: 'Retours d\'expérience 100% authentiques de clients vérifiés',
      reviews: []
    }
  },
  {
    type: 'ContactMap',
    name: 'Repère Physique & Contact',
    description: 'Informations de contact, repère physique, accès direct appel & WhatsApp.',
    icon: 'MapPin',
    category: 'Informations Pratiques',
    styleVariants: [
      { id: 'interactive_split', name: 'Split Coordonnées & GPS', desc: 'Coordonnées à gauche, carte satellite/plan à droite' },
      { id: 'floating_card_over_map', name: 'Carte Immersive Flottante', desc: 'Carte en fond avec carte de contact en surimpression' },
      { id: 'compact_clean', name: 'Coordonnées Épurées', desc: 'Boutons directs d\'itinéraires et de contacts' }
    ],
    buttonStyles: [
      { id: 'modern_rounded', name: 'Moderne Arrondi' },
      { id: 'pill', name: 'Capsule (Pill)' },
      { id: 'sharp_luxury', name: 'Haute Couture' },
      { id: 'glass_glow', name: 'Verre Lumineux' },
      { id: 'floating_3d', name: 'Élévation 3D' }
    ],
    defaultProps: {
      styleVariant: 'interactive_split',
      buttonStyle: 'modern_rounded',
      title: 'Nous Trouver & Nous Contacter',
      landmark: 'Près du Carrefour Idéal, face à la banque',
      directPhone: '+237699123456',
      whatsappPhone: '+237699123456',
      email: 'contact@meetshop.cm',
      gpsCoords: '4.0511, 9.7679',
    }
  },
  {
    type: 'CustomForm',
    name: 'Questionnaire & Devis Interactif',
    description: 'Formulaire avec questions personnalisées, réponses enregistrées dans le dashboard et transmises sur WhatsApp.',
    icon: 'HelpCircle',
    category: 'Formulaires & Conversion',
    styleVariants: [
      { id: 'modern_stepped', name: 'Étapes Modernes', desc: 'Questions numérotées avec encadrés interactifs' },
      { id: 'glass_card', name: 'Verre Translucide', desc: 'Formulaire surélevé avec fond dépoli' },
      { id: 'compact_clean', name: 'Formulaire Épuré', desc: 'Mise en page compacte et rapide' }
    ],
    buttonStyles: [
      { id: 'modern_rounded', name: 'Moderne Arrondi' },
      { id: 'pill', name: 'Capsule (Pill)' },
      { id: 'sharp_luxury', name: 'Haute Couture' },
      { id: 'glass_glow', name: 'Verre Lumineux' },
      { id: 'floating_3d', name: 'Élévation 3D' }
    ],
    defaultProps: {
      styleVariant: 'modern_stepped',
      buttonStyle: 'modern_rounded',
      title: 'Besoin d\'un renseignement ou d\'un devis ?',
      subtitle: 'Répondez à ces quelques questions pour recevoir notre meilleure proposition',
      submitButtonText: 'Envoyer ma demande sur WhatsApp',
      collectContactInfo: true,
      questions: [
        {
          id: 'q-1',
          label: 'Quel type d\'article ou service recherchez-vous ?',
          type: 'text',
          placeholder: 'Ex: Téléphone portable, Robe de soirée...',
          required: true
        },
        {
          id: 'q-2',
          label: 'Votre budget estimé :',
          type: 'select',
          options: ['Moins de 25 000 FCFA', '25 000 - 75 000 FCFA', '75 000 - 200 000 FCFA', 'Plus de 200 000 FCFA'],
          required: true
        },
        {
          id: 'q-3',
          label: 'Délai de livraison souhaité :',
          type: 'radio',
          options: ['Urgent (< 2 heures)', 'Aujourd\'hui', 'Cette semaine'],
          required: true
        },
        {
          id: 'q-4',
          label: 'Précisions supplémentaires pour le vendeur :',
          type: 'textarea',
          placeholder: 'Couleurs, tailles, marque spécifique...',
          required: false
        }
      ]
    }
  },
  {
    type: 'CustomCta',
    name: 'Boutons & Appel à l\'Action',
    description: 'Boutons personnalisés (WhatsApp direct, appel, devis express, catalogue) avec dégradé et icône.',
    icon: 'MousePointerClick',
    category: 'Formulaires & Conversion',
    styleVariants: [
      { id: 'hero_banner_glow', name: 'Halo Lumineux Sombre', desc: 'Fond sombre profond avec halos lumineux dynamiques' },
      { id: 'minimalist_centered', name: 'Minimaliste Épuré', desc: 'Appel centré clair à fort contraste' },
      { id: 'split_action_card', name: 'Double Carte d\'Action', desc: 'Deux panneaux côte à côte (WhatsApp & Appel direct)' },
      { id: 'floating_badge_card', name: 'Carte Flottante avec Badge', desc: 'Format compact avec voyant de disponibilité en direct' }
    ],
    buttonStyles: [
      { id: 'modern_rounded', name: 'Moderne Arrondi' },
      { id: 'pill', name: 'Capsule (Pill)' },
      { id: 'sharp_luxury', name: 'Haute Couture' },
      { id: 'glass_glow', name: 'Verre Lumineux' },
      { id: 'floating_3d', name: 'Élévation 3D' }
    ],
    defaultProps: {
      styleVariant: 'hero_banner_glow',
      buttonStyle: 'modern_rounded',
      title: 'Une question ? Besoin d\'un conseil personnalisé ?',
      subtitle: 'Notre équipe vous répond instantanément sur WhatsApp 7j/7.',
      primaryBtnText: 'Discuter en direct sur WhatsApp',
      primaryBtnAction: 'whatsapp',
      secondaryBtnText: 'Appeler la boutique',
      secondaryBtnAction: 'call',
      badgeText: 'Réponse en < 5 minutes'
    }
  },
  {
    type: 'RichText',
    name: 'Texte Enrichi & Histoire',
    description: 'Bloc de texte stylisé avec titre accrocheur, mise en avant, badges et paragraphes.',
    icon: 'Type',
    category: 'Contenu & Confiance',
    styleVariants: [
      { id: 'center_card', name: 'Centré avec Carte', desc: 'Mise en page centrée harmonieuse' },
      { id: 'left_minimal', name: 'Éditorial Alignement Gauche', desc: 'Style magazine avec liséré latéral' },
      { id: 'highlight_quote', name: 'Grande Citation', desc: 'Texte fort mis en valeur avec note informative' },
      { id: 'glass_statement', name: 'Verre Dépoli', desc: 'Panneau translucide moderne' }
    ],
    defaultProps: {
      styleVariant: 'center_card',
      heading: 'L\'Excellence et la Qualité au Meilleur Prix',
      content: 'Nous sélectionnons pour vous les meilleurs arrivages du marché avec une garantie totale de conformité. Tous nos colis sont emballés avec le plus grand soin et expédiés directement chez vous.',
      highlightNote: 'Livraison express disponible dans tous les arrondissements de Douala et Yaoundé.',
      badgeText: 'Engagement Qualité',
      alignment: 'center'
    }
  },
  {
    type: 'FaqAccordion',
    name: 'Questions Fréquentes (FAQ)',
    description: 'Foire aux questions interactive avec réponses dépliables en accordéon.',
    icon: 'MessageCircleQuestion',
    category: 'Contenu & Confiance',
    styleVariants: [
      { id: 'accordion_classic', name: 'Accordéon Classique', desc: 'Questions dépliables avec numérotation' },
      { id: 'grid_cards', name: 'Grille de Questions', desc: 'Cartes côte à côte dépliables individuellement' },
      { id: 'minimal_clean', name: 'Lignes Épurées', desc: 'Séparateurs fins et design sobre' }
    ],
    defaultProps: {
      styleVariant: 'accordion_classic',
      title: 'Foire Aux Questions (FAQ)',
      subtitle: 'Tout ce que vous devez savoir avant de commander',
      items: [
        {
          q: 'Comment s\'effectue la livraison ?',
          a: 'Nos livreurs partenaires acheminent votre colis directement à votre adresse sous 2 heures à Douala et Yaoundé.'
        },
        {
          q: 'Quels sont les modes de paiement acceptés ?',
          a: 'Vous pouvez payer en espèces à la livraison, ou par Orange Money et MTN Mobile Money.'
        },
        {
          q: 'Puis-je vérifier le produit avant de payer ?',
          a: 'Oui, absolument ! Vous pouvez déballer et vérifier l\'article en présence du livreur avant tout paiement.'
        }
      ]
    }
  },
  {
    type: 'CustomAiBlock',
    name: 'Bloc Sur-Mesure IA (Bento/Quizz/VIP)',
    description: 'Composant 100% inédit généré et codé de zéro par Mistral AI.',
    icon: 'Sparkles',
    category: 'Inventions IA',
    defaultProps: {
      name: 'Composant Sur-Mesure',
      category: 'Innovation IA',
      description: 'Bloc inédit conçu par Mistral AI',
      iconName: 'Sparkles',
      structure: {
        title: 'Section Exclusive',
        subtitle: 'Une expérience d\'achat personnalisée',
        cards: [
          { span: 'col-span-2', title: 'Prestation & Qualité', desc: 'Articles vérifiés et certifiés d\'origine.', badge: 'Exclusif', icon: 'ShieldCheck' },
          { span: 'col-span-1', title: 'Livraison Rapide', desc: 'Moins de 2h à Douala et Yaoundé.', badge: 'Express', icon: 'Zap' }
        ]
      }
    }
  }
];

export function getDefaultLayoutConfig(theme = 'emerald', shop = null) {
  const shopName = shop?.name || 'Notre Boutique';
  const shopCity = shop?.city || 'Douala';
  const shopQuarter = shop?.quarter || 'Akwa';
  const shopPhone = shop?.phone || '+237699123456';
  const shopDesc = shop?.description || `Bienvenue chez ${shopName}, votre référence shopping à ${shopQuarter} (${shopCity}).`;

  return {
    theme: theme,
    blocks: [
      {
        id: `b-hero-${Date.now()}`,
        type: 'HeroBanner',
        visible: true,
        props: {
          styleVariant: 'classic',
          avatarStyle: 'rounded',
          buttonStyle: 'modern_rounded',
          slogan: shopDesc,
          ctaText: 'Discuter sur WhatsApp',
          showStats: true,
          showLiveBadge: true
        }
      },
      {
        id: `b-flash-${Date.now() + 1}`,
        type: 'FlashDeal',
        visible: true,
        props: {
          styleVariant: 'countdown_banner',
          buttonStyle: 'modern_rounded',
          title: `Vente Flash Exclusive ${shopName}`,
          subtitle: `Profitez d'offres spéciales et remises immédiates en stock chez ${shopName}.`,
          discountBadge: '-20% IMMÉDIAT',
          endsInHours: 24,
          ctaText: 'Commander sur WhatsApp'
        }
      },
      {
        id: `b-featured-${Date.now() + 2}`,
        type: 'FeaturedProducts',
        visible: true,
        props: {
          styleVariant: 'grid',
          cardStyle: 'standard',
          buttonStyle: 'modern_rounded',
          title: 'Nos Meilleures Ventes',
          subtitle: `Sélection coup de cœur certifiée par ${shopName}`,
          maxItems: 4,
          layout: 'grid'
        }
      },
      {
        id: `b-catalog-${Date.now() + 3}`,
        type: 'CategoryCatalog',
        visible: true,
        props: {
          cardStyle: 'standard',
          buttonStyle: 'modern_rounded',
          title: `Tous les Articles en Stock`,
          showSearch: true,
          showCategoryPills: true
        }
      },
      {
        id: `b-about-${Date.now() + 4}`,
        type: 'AboutStory',
        visible: true,
        props: {
          styleVariant: 'story_classic',
          title: `Qui est ${shopName} ?`,
          storyText: `Implantée au quartier ${shopQuarter} à ${shopCity}, ${shopName} vous propose des articles de qualité supérieure, rigoureusement vérifiés avant expédition.`,
          commitment1: `Expédition express en moins de 2h à ${shopCity}`,
          commitment2: 'Produits testés et 100% conformes',
          commitment3: 'Paiement à la livraison (OM, MoMo ou Espèces)',
          sinceYear: '2023',
          badgeText: `Vendeur Certifié ${shopCity}`
        }
      },
      {
        id: `b-reviews-${Date.now() + 5}`,
        type: 'CustomerReviews',
        visible: true,
        props: {
          styleVariant: 'masonry_cards',
          cardStyle: 'standard',
          buttonStyle: 'modern_rounded',
          title: 'Ce que disent nos clients',
          subtitle: `Retours d'expérience après achat chez ${shopName}`
        }
      },
      {
        id: `b-hours-${Date.now() + 6}`,
        type: 'OpeningHours',
        visible: true,
        props: {
          styleVariant: 'grid_badges',
          title: `Horaires & Retrait à ${shopQuarter}`,
          statusText: 'Ouvert maintenant',
          mondayFriday: '08h00 - 19h30',
          saturday: '08h30 - 20h00',
          sunday: '12h00 - 18h00 (Urgences WhatsApp)',
          dispatchNotice: `Livraison continue sur ${shopCity} et environs.`
        }
      },
      {
        id: `b-contact-${Date.now() + 7}`,
        type: 'ContactMap',
        visible: true,
        props: {
          styleVariant: 'interactive_split',
          buttonStyle: 'modern_rounded',
          title: `Nous Trouver & Nous Contacter`,
          landmark: `Situé à ${shopQuarter}, ${shopCity}`,
          directPhone: shopPhone,
          whatsappPhone: shopPhone
        }
      }
    ]
  };
}

/**
 * 🎨 LES 6 MODÈLES DE PAGES BOUTIQUE ODOO E-COMMERCE
 * Chaque modèle définit une présentation visuelle spécifique adaptée au secteur d'activité.
 */
export const ODOO_SHOP_TEMPLATES = [
  {
    id: 'odoo_fashion',
    name: 'Mode & Fashion (Tuiles Visuelles)',
    category: 'Vêtements, Chaussures & Tendance',
    desc: 'Tuiles illustrées de vêtements (Robes, Sweats, Vestes, T-shirts) avec grille pastel épurée.',
    icon: 'Shirt',
    badge: 'Fashion',
    previewFeatures: ['Bandeau illustré', 'Sélecteur de teintes', 'Grille aérée']
  },
  {
    id: 'odoo_furniture',
    name: 'Mobilier & Décoration (Filtres Détaillés)',
    category: 'Maison, Meubles & Literie',
    desc: 'Filtres latéraux complets (couleurs, dimensions, prix) et barre de sous-catégories.',
    icon: 'Home',
    badge: 'Maison',
    previewFeatures: ['Sidebar attributs', 'Double curseur prix', 'Détails dimensions']
  },
  {
    id: 'odoo_hero_showcase',
    name: 'Hero Showcase / Produit Star',
    category: 'e-Bikes, Véhicules & Électroménager',
    desc: 'Bannière panoramique grand format mettant en vedette votre produit phare.',
    icon: 'Zap',
    badge: 'Spotlight',
    previewFeatures: ['Produit star géant', 'Spécifications', 'Catalogue secondaire']
  },
  {
    id: 'odoo_tech',
    name: 'High-Tech & Caméras (Grille Compacte)',
    category: 'Smartphones, Audio & Électronique',
    desc: 'Grille technique 4 colonnes avec bouton d\'achat direct contrasté et favoris.',
    icon: 'Smartphone',
    badge: 'Tech',
    previewFeatures: ['4 colonnes compactes', 'Ajout 1-clic', 'Spécifications techniques']
  },
  {
    id: 'odoo_components',
    name: 'Informatique & Pièces Détachées',
    category: 'Composants PC, Accessoires & Réparation',
    desc: 'Grille d\'icônes de composants (GPU, CPU, SSD, RAM, Boîtiers) avec filtres de compatibilité.',
    icon: 'Layers',
    badge: 'Hardware',
    previewFeatures: ['Grille d\'icônes', 'Filtres de pièces', 'Comparateur']
  },
  {
    id: 'odoo_lookbook',
    name: 'Lookbook & Galerie Panoramique',
    category: 'Luxe, Bijoux, Beauté & Art',
    desc: 'Cartes panoramiques verticales créant un effet magazine et catalogue artistique.',
    icon: 'Sparkles',
    badge: 'Prestige',
    previewFeatures: ['Galerie verticale', 'Immersion visuelle', 'Luxe & Élégance']
  }
];
