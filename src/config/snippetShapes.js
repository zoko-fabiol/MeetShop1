/**
 * MOTEUR DE FORMES GÉOMÉTRIQUES, BULLES, AVATARS ET VARIATIONS D'ÉLÉMENTS
 * Permet de personnaliser chaque composant, sous-élément, photo de profil,
 * bulle, bouton et typographie de la vitrine Odoo.
 */

// ── 1. FORMES DES CONTENUS INTÉRIEURS & CONTENEURS ────────────────────────────
export const SNIPPET_SHAPES = [
  {
    id: 'rounded_modern',
    name: 'Arrondi Moderne',
    desc: 'Coins arrondis harmonieux et contemporains',
    class: 'rounded-2xl sm:rounded-3xl',
    badgeClass: 'rounded-xl',
    buttonClass: 'rounded-xl'
  },
  {
    id: 'rounded_capsule',
    name: 'Pilule / Capsule',
    desc: 'Courbure maximale pour un aspect fluide',
    class: 'rounded-full px-6 py-3.5',
    badgeClass: 'rounded-full',
    buttonClass: 'rounded-full'
  },
  {
    id: 'square_sharp',
    name: 'Carré Net',
    desc: 'Bords droits rigides et géométriques (Brutalist)',
    class: 'rounded-none',
    badgeClass: 'rounded-none',
    buttonClass: 'rounded-none'
  },
  {
    id: 'asymmetric_leaf',
    name: 'Feuille Asymétrique',
    desc: 'Deux coins arrondis et deux coins nets (Haute-couture)',
    class: 'rounded-tr-3xl rounded-bl-3xl rounded-tl-md rounded-br-md',
    badgeClass: 'rounded-tr-xl rounded-bl-xl rounded-tl-sm rounded-br-sm',
    buttonClass: 'rounded-tr-xl rounded-bl-xl rounded-tl-sm rounded-br-sm'
  },
  {
    id: 'chamfered_tech',
    name: 'Biseauté Cyber',
    desc: 'Coins coupés angulaires style high-tech',
    class: 'rounded-lg [clip-path:polygon(0_10px,10px_0,calc(100%-10px)_0,100%_10px,100%_calc(100%-10px),calc(100%-10px)_100%,10px_100%,0_calc(100%-10px))]',
    badgeClass: 'rounded-sm',
    buttonClass: 'rounded-sm'
  },
  {
    id: 'bubble_callout',
    name: 'Bulle / Message',
    desc: 'Forme bulle avec encoche pour témoignages et callouts',
    class: 'rounded-2xl rounded-bl-none shadow-md',
    badgeClass: 'rounded-lg',
    buttonClass: 'rounded-xl'
  }
];

// ── 2. FORMES DES AVATARS, PHOTOS DE PROFIL & BULLES D'IMAGES ─────────────────
export const AVATAR_SHAPES = [
  {
    id: 'circle',
    name: 'Cercle Parfait',
    desc: 'Classique rond parfait',
    class: 'rounded-full',
    imgClass: 'rounded-full'
  },
  {
    id: 'squircle',
    name: 'Squircle Arrondi',
    desc: 'Forme d\'icône moderne iOS douce',
    class: 'rounded-2xl sm:rounded-3xl',
    imgClass: 'rounded-2xl sm:rounded-3xl'
  },
  {
    id: 'cyber_octo',
    name: 'Octogone Biseauté',
    desc: 'Découpe cybernétique 8 pans',
    class: '[clip-path:polygon(30%_0%,70%_0%,100%_30%,100%_70%,70%_100%,30%_100%,0%_70%,0%_30%)]',
    imgClass: '[clip-path:polygon(30%_0%,70%_0%,100%_30%,100%_70%,70%_100%,30%_100%,0%_70%,0%_30%)]'
  },
  {
    id: 'capsule',
    name: 'Capsule Pilule',
    desc: 'Forme ovale allongée fluide',
    class: 'rounded-full aspect-[4/3]',
    imgClass: 'rounded-full aspect-[4/3] object-cover'
  },
  {
    id: 'leaf_asymmetric',
    name: 'Feuille Asymétrique',
    desc: 'Deux pointes artistiques opposées',
    class: 'rounded-tr-3xl rounded-bl-3xl rounded-tl-md rounded-br-md',
    imgClass: 'rounded-tr-3xl rounded-bl-3xl rounded-tl-md rounded-br-md object-cover'
  },
  {
    id: 'bubble_callout',
    name: 'Bulle de Dialogue',
    desc: 'Bulle avec coin d\'ancrage net',
    class: 'rounded-3xl rounded-bl-none',
    imgClass: 'rounded-3xl rounded-bl-none object-cover'
  }
];

// ── 3. VARIANTES DE BOUTONS D'ACTION & CTA ────────────────────────────────────
export const BUTTON_STYLES = [
  {
    id: 'glow_gradient',
    name: 'Glow Dégradé',
    desc: 'Éclatant avec ombre luminescente',
    class: 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 transition-all'
  },
  {
    id: 'glassmorphism',
    name: 'Glass Translucide',
    desc: 'Verre dépoli avec bordure brillante',
    class: 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-current shadow-md hover:border-white/50 active:scale-95 transition-all'
  },
  {
    id: 'neo_brutalist',
    name: 'Néo-Brutalism Pop',
    desc: 'Bordure 2px et ombre décalée dure',
    class: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.9)] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all'
  },
  {
    id: 'ghost_arrow',
    name: 'Ghost Minimaliste',
    desc: 'Bordure fine et design épuré',
    class: 'bg-transparent hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 hover:border-emerald-500 font-bold active:scale-95 transition-all'
  },
  {
    id: 'pill_chunky',
    name: 'Pilule Haute Visibilité',
    desc: 'Capsule pleine haute intensité',
    class: 'rounded-full px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all'
  }
];

// ── 4. STYLES DE BORDURE ──────────────────────────────────────────────────────
export const SNIPPET_BORDER_STYLES = [
  { id: 'default', name: 'Selon Thème', class: '' },
  { id: 'solid', name: 'Trait Plein', class: 'border border-slate-300 dark:border-slate-700' },
  { id: 'dashed', name: 'Tirets / Coupon', class: 'border-2 border-dashed border-emerald-500/60' },
  { id: 'double', name: 'Double Ligne', class: 'border-4 border-double border-slate-400 dark:border-slate-600' },
  { id: 'glow', name: 'Lueur Néon', class: 'border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]' },
  { id: 'none', name: 'Sans Bordure', class: 'border-0' }
];

// ── 5. STYLES D'OMBRES ────────────────────────────────────────────────────────
export const SNIPPET_SHADOW_STYLES = [
  { id: 'default', name: 'Selon Thème', class: '' },
  { id: 'none', name: 'Plate (Sans ombre)', class: 'shadow-none' },
  { id: 'soft', name: 'Ombre Douce', class: 'shadow-md hover:shadow-lg' },
  { id: 'brutalist_3d', name: '3D Pop Décalée', class: 'shadow-[4px_4px_0px_rgba(0,0,0,0.9)] dark:shadow-[4px_4px_0px_rgba(16,185,129,0.7)]' },
  { id: 'floating', name: 'Flottante Aérienne', class: 'shadow-2xl hover:-translate-y-0.5' }
];

// ── 6. HELPERS D'EXTRACTION ───────────────────────────────────────────────────
export function getSnippetShape(shapeId) {
  return SNIPPET_SHAPES.find(s => s.id === shapeId) || SNIPPET_SHAPES[0];
}

export function getAvatarShape(shapeId) {
  return AVATAR_SHAPES.find(s => s.id === shapeId) || AVATAR_SHAPES[0];
}

export function getButtonStyle(styleId) {
  return BUTTON_STYLES.find(b => b.id === styleId) || BUTTON_STYLES[0];
}

export function getSnippetBorderStyle(borderId) {
  return SNIPPET_BORDER_STYLES.find(b => b.id === borderId) || SNIPPET_BORDER_STYLES[0];
}

export function getSnippetShadowStyle(shadowId) {
  return SNIPPET_SHADOW_STYLES.find(s => s.id === shadowId) || SNIPPET_SHADOW_STYLES[0];
}
