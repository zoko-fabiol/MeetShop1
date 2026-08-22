/**
 * MOTEUR DE FORMES GÉOMÉTRIQUES & VARIATIONS DE DESIGN DES CONTENUS INTÉRIEURS
 * Offre une variété de formes (pilule, carré net, arrondi, biseauté, feuille, bulle),
 * de styles de bordures et d'ombres personnalisables, compatibles avec les 5 univers visuels.
 */

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

export const SNIPPET_BORDER_STYLES = [
  { id: 'default', name: 'Selon Thème', class: '' },
  { id: 'solid', name: 'Trait Plein', class: 'border border-slate-300 dark:border-slate-700' },
  { id: 'dashed', name: 'Tirets / Coupon', class: 'border-2 border-dashed border-emerald-500/60' },
  { id: 'double', name: 'Double Ligne', class: 'border-4 border-double border-slate-400 dark:border-slate-600' },
  { id: 'glow', name: 'Lueur Néon', class: 'border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]' },
  { id: 'none', name: 'Sans Bordure', class: 'border-0' }
];

export const SNIPPET_SHADOW_STYLES = [
  { id: 'default', name: 'Selon Thème', class: '' },
  { id: 'none', name: 'Plate (Sans ombre)', class: 'shadow-none' },
  { id: 'soft', name: 'Ombre Douce', class: 'shadow-md hover:shadow-lg' },
  { id: 'brutalist_3d', name: '3D Pop Décalée', class: 'shadow-[4px_4px_0px_rgba(0,0,0,0.9)] dark:shadow-[4px_4px_0px_rgba(16,185,129,0.7)]' },
  { id: 'floating', name: 'Flottante Aérienne', class: 'shadow-2xl hover:-translate-y-0.5' }
];

export function getSnippetShape(shapeId) {
  return SNIPPET_SHAPES.find(s => s.id === shapeId) || SNIPPET_SHAPES[0];
}

export function getSnippetBorderStyle(borderId) {
  return SNIPPET_BORDER_STYLES.find(b => b.id === borderId) || SNIPPET_BORDER_STYLES[0];
}

export function getSnippetShadowStyle(shadowId) {
  return SNIPPET_SHADOW_STYLES.find(s => s.id === shadowId) || SNIPPET_SHADOW_STYLES[0];
}
