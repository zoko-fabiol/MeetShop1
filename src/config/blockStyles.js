/**
 * SYSTÈME DE STYLES MODULAIRES POUR LES BOUTIQUES MEETSHOP
 * Fournit les variantes de boutons, formes d'avatars/logos, styles de cartes et variantes de blocs.
 */

export const BUTTON_STYLES = {
  modern_rounded: {
    id: 'modern_rounded',
    name: 'Moderne Arrondi',
    desc: 'Bouton premium standard avec coins arrondis doux'
  },
  pill: {
    id: 'pill',
    name: 'Capsule (Pill)',
    desc: 'Ultra-arrondi, moderne et fluide'
  },
  sharp_luxury: {
    id: 'sharp_luxury',
    name: 'Haute Couture (Sharp)',
    desc: 'Bords droits géométriques avec lettrage majuscule espacé'
  },
  glass_glow: {
    id: 'glass_glow',
    name: 'Verre Lumineux (Glass Glow)',
    desc: 'Translucide avec effet de flou et contour néon'
  },
  floating_3d: {
    id: 'floating_3d',
    name: 'Élévation 3D',
    desc: 'Bouton relief interactif avec effet d\'enfoncement'
  }
};

export const AVATAR_STYLES = {
  rounded: {
    id: 'rounded',
    name: 'Squircle Arrondi',
    desc: 'Coins adoucis, style moderne équilibré'
  },
  circle: {
    id: 'circle',
    name: 'Cercle Parfait',
    desc: 'Profil rond avec anneau de contraste'
  },
  sharp: {
    id: 'sharp',
    name: 'Carré Prestige',
    desc: 'Bords droits géométriques style joaillerie & haute-couture'
  },
  hexagon: {
    id: 'hexagon',
    name: 'Badge Angulaire',
    desc: 'Format stylisé avec rotation subtile'
  }
};

export const CARD_STYLES = {
  standard: {
    id: 'standard',
    name: 'Standard Épuré',
    desc: 'Carte classique avec bordure fine et ombre douce'
  },
  minimal_luxury: {
    id: 'minimal_luxury',
    name: 'Luxe Minimaliste',
    desc: 'Contour ultra-fin, typographie d\'orfèvre et grand visuel'
  },
  modern_glass: {
    id: 'modern_glass',
    name: 'Verre Dépoli (Glass)',
    desc: 'Fond translucide flouté avec halo de lumière'
  },
  neo_brutalism: {
    id: 'neo_brutalism',
    name: 'Néo-Brutalisme',
    desc: 'Contour noir net et ombre portée contrastée'
  }
};

/**
 * Calcule les classes CSS d'un bouton selon son style et le thème actif
 */
export function getButtonClasses(buttonStyle = 'modern_rounded', theme = null, variant = 'primary') {
  const isPrimary = variant === 'primary';
  const baseTransitions = 'transition-all duration-200 select-none flex items-center justify-center gap-2 cursor-pointer';

  switch (buttonStyle) {
    case 'pill':
      return isPrimary
        ? `${baseTransitions} rounded-full ${theme?.btnPrimary || 'bg-emerald-600 text-white font-black shadow-lg'} active:scale-95`
        : `${baseTransitions} rounded-full ${theme?.btnSecondary || 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-700'} hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95`;

    case 'sharp_luxury':
      return isPrimary
        ? `${baseTransitions} rounded-none uppercase tracking-widest font-black ${theme?.btnPrimary || 'bg-slate-900 text-white'} border border-current shadow-md active:scale-95`
        : `${baseTransitions} rounded-none uppercase tracking-widest font-bold border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95`;

    case 'glass_glow':
      return isPrimary
        ? `${baseTransitions} rounded-2xl ${theme?.btnPrimary || 'bg-emerald-600 text-white'} font-black border-2 border-white/40 shadow-[0_4px_25px_rgba(0,0,0,0.25)] ring-2 ring-white/20 hover:brightness-110 active:scale-95`
        : `${baseTransitions} rounded-2xl bg-slate-900 dark:bg-slate-800 text-white font-bold border border-slate-700 dark:border-slate-600 shadow-md hover:bg-slate-800 active:scale-95`;

    case 'floating_3d':
      return isPrimary
        ? `${baseTransitions} rounded-2xl ${theme?.btnPrimary || 'bg-emerald-600 text-white'} font-black shadow-[0_5px_0_rgba(0,0,0,0.25)] active:translate-y-1 active:shadow-[0_1px_0_rgba(0,0,0,0.25)]`
        : `${baseTransitions} rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border border-slate-300 dark:border-slate-700 shadow-[0_4px_0_rgba(0,0,0,0.15)] active:translate-y-1 active:shadow-[0_1px_0_rgba(0,0,0,0.15)]`;

    case 'modern_rounded':
    default:
      return isPrimary
        ? `${baseTransitions} rounded-2xl ${theme?.btnPrimary || 'bg-emerald-600 text-white font-black shadow-lg'} active:scale-95`
        : `${baseTransitions} rounded-2xl ${theme?.btnSecondary || 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-700'} hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95`;
  }
}

/**
 * Calcule les classes CSS pour le conteneur du logo / photo de profil
 */
export function getAvatarClasses(avatarStyle = 'rounded') {
  switch (avatarStyle) {
    case 'circle':
      return 'rounded-full ring-4 ring-white dark:ring-slate-950 shadow-2xl overflow-hidden';
    case 'sharp':
      return 'rounded-none border-2 border-white dark:border-slate-800 shadow-2xl overflow-hidden p-0.5';
    case 'hexagon':
      return 'rounded-2xl rotate-2 hover:rotate-0 transition-transform shadow-2xl overflow-hidden border-2 border-white dark:border-slate-900';
    case 'rounded':
    default:
      return 'rounded-2xl sm:rounded-3xl border-4 border-white dark:border-slate-950 shadow-2xl overflow-hidden';
  }
}

/**
 * Calcule les classes CSS d'une carte selon le style sélectionné
 */
export function getCardClasses(cardStyle = 'standard', theme = null) {
  switch (cardStyle) {
    case 'minimal_luxury':
      return `rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 transition-all ${theme?.cardHover || ''}`;
    case 'modern_glass':
      return `rounded-3xl border border-white/30 dark:border-slate-700/50 bg-white/75 dark:bg-slate-900/65 backdrop-blur-xl shadow-lg transition-all ${theme?.cardHover || ''}`;
    case 'neo_brutalism':
      return 'rounded-2xl border-2 border-slate-900 dark:border-white bg-white dark:bg-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.9)] transition-all';
    case 'standard':
    default:
      return `rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm hover:shadow-xl transition-all ${theme?.cardHover || ''}`;
  }
}
