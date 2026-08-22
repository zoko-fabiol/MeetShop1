/**
 * 12 STYLES DE DESIGNS D'HORLOGES & COMPTES À REBOURS POUR FLASHDEAL ET SNIPPETS
 * 100% compatibles avec tous les 16 univers de design et thèmes MeetShop.
 */

export const CLOCK_STYLES = [
  {
    id: 'flip_card',
    name: 'Cartes à Rabat 3D (Flip)',
    desc: 'Boîtes numériques avec pliure centrale et étiquettes J/H/M/S',
    badge: 'Populaire',
    icon: 'Layers'
  },
  {
    id: 'neon_cyber',
    name: 'Néon Matrix Cyberpunk',
    desc: 'Lueur néon cyan/magenta luminescente et typographie monospace',
    badge: 'Néon Tech',
    icon: 'Zap'
  },
  {
    id: 'minimal_pills',
    name: 'Pilules Épurées Modernes',
    desc: 'Pilules douces et compactes avec contrastes fluides',
    badge: 'Minimal',
    icon: 'Clock'
  },
  {
    id: 'circular_rings',
    name: 'Anneaux Radiaux Circulaires',
    desc: 'Cercles avec jauges SVG de progression radiale animée',
    badge: 'Radial',
    icon: 'Sparkles'
  },
  {
    id: 'retro_warm',
    name: 'Vintage 70s Warm',
    desc: 'Boîtes crème et terracotta avec typographie rétro chaleureuse',
    badge: 'Vintage',
    icon: 'Flame'
  },
  {
    id: 'glassmorphism_frost',
    name: 'Verre Dépoli Givré Cristal',
    desc: 'Boîtes translucides backdrop-blur avec reflets de verre',
    badge: 'Glass Pro',
    icon: 'ShieldCheck'
  },
  {
    id: 'neo_brutalist_pop',
    name: 'Neo-Brutalism Pop Art',
    desc: 'Contours noirs 2px, ombre portée décalée et style pop',
    badge: 'Pop Art',
    icon: 'Tag'
  },
  {
    id: 'luxury_gold',
    name: 'Prestige Doré Impérial',
    desc: 'Liserés dorés fins, chiffres dorés et typographie noble sérif',
    badge: 'Prestige',
    icon: 'Award'
  },
  {
    id: 'compact_inline',
    name: 'Bandeau Badge En Ligne',
    desc: 'Format ultra-compact minimal sur une seule ligne',
    badge: 'Compact',
    icon: 'Ticket'
  },
  {
    id: 'holographic_prism',
    name: 'Prisme Holographique',
    desc: 'Dégradés pastel irisés et reflets futuristes animés',
    badge: 'Holo 3D',
    icon: 'Sparkles'
  },
  {
    id: 'terminal_matrix',
    name: 'Console Terminal Hacker',
    desc: 'Style invite de commande sombre avec typographie verte monospace',
    badge: 'Terminal',
    icon: 'Code'
  },
  {
    id: 'split_segmented',
    name: 'Jauges Segmentées',
    desc: 'Chiffres nets avec barres de progression segmentées sous chaque unité',
    badge: 'Segmented',
    icon: 'Sliders'
  }
];

export const getClockStyle = (styleId = 'flip_card') => {
  return CLOCK_STYLES.find(s => s.id === styleId) || CLOCK_STYLES[0];
};
