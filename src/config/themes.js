/**
 * SYSTÈME DE DESIGN & PALETTES VERROUILLÉES VESTYLE / MEETSHOP
 * Thèmes prédéfinis parfaitement calibrés avec contraste élevé et harmonie visuelle sur toute la boutique
 */

export const THEME_PALETTES = {
  emerald: {
    id: 'emerald',
    name: 'Émeraude Live (Défaut MeetShop)',
    description: 'Style officiel MeetShop, idéal pour la tech & le commerce général',
    hex: '#16a34a',
    accentColor: 'text-emerald-600 dark:text-emerald-400',
    accentBg: 'bg-emerald-600',
    accentBorder: 'border-emerald-500/40',
    accentHoverBorder: 'hover:border-emerald-500/60',
    accentFocusBorder: 'focus:border-emerald-500',
    badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    badgeLive: 'bg-emerald-600 text-white',
    btnPrimary: 'bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-lg shadow-emerald-600/25',
    btnSecondary: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold',
    gradient: 'from-emerald-600 via-emerald-500 to-teal-500',
    glow: 'rgba(22, 163, 74, 0.3)',
    cardHover: 'hover:border-emerald-500/40 hover:shadow-emerald-500/10',
    pillActive: 'bg-emerald-600 text-white font-bold',
    ring: 'ring-emerald-500 focus:ring-emerald-500/30',
    inputFocus: 'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
  },
  indigo: {
    id: 'indigo',
    name: 'Indigo Nuit (Luxe & Prestige)',
    description: 'Design raffiné pour articles haut de gamme, mode premium et tech pro',
    hex: '#4f46e5',
    accentColor: 'text-indigo-600 dark:text-indigo-400',
    accentBg: 'bg-indigo-600',
    accentBorder: 'border-indigo-500/40',
    accentHoverBorder: 'hover:border-indigo-500/60',
    accentFocusBorder: 'focus:border-indigo-500',
    badge: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    badgeLive: 'bg-indigo-600 text-white',
    btnPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white font-black shadow-lg shadow-indigo-600/25',
    btnSecondary: 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 font-bold',
    gradient: 'from-indigo-600 via-indigo-500 to-violet-500',
    glow: 'rgba(79, 70, 229, 0.3)',
    cardHover: 'hover:border-indigo-500/40 hover:shadow-indigo-500/10',
    pillActive: 'bg-indigo-600 text-white font-bold',
    ring: 'ring-indigo-500 focus:ring-indigo-500/30',
    inputFocus: 'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
  },
  cyan: {
    id: 'cyan',
    name: 'Cyber Cyan (Tech & Futuriste)',
    description: 'Ambiance futuriste & high-tech pour boutiques d\'électronique & smartphones',
    hex: '#0891b2',
    accentColor: 'text-cyan-600 dark:text-cyan-400',
    accentBg: 'bg-cyan-600',
    accentBorder: 'border-cyan-500/40',
    accentHoverBorder: 'hover:border-cyan-500/60',
    accentFocusBorder: 'focus:border-cyan-500',
    badge: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    badgeLive: 'bg-cyan-600 text-white',
    btnPrimary: 'bg-cyan-600 hover:bg-cyan-500 text-white font-black shadow-lg shadow-cyan-600/25',
    btnSecondary: 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-bold',
    gradient: 'from-cyan-600 via-cyan-500 to-blue-600',
    glow: 'rgba(8, 145, 178, 0.3)',
    cardHover: 'hover:border-cyan-500/40 hover:shadow-cyan-500/10',
    pillActive: 'bg-cyan-600 text-white font-bold',
    ring: 'ring-cyan-500 focus:ring-cyan-500/30',
    inputFocus: 'focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20',
  },
  amber: {
    id: 'amber',
    name: 'Ambre Gold (Chaleureux & Bio)',
    description: 'Élégance chaleureuse et raffinée pour mode, bijouterie et alimentation bio',
    hex: '#d97706',
    accentColor: 'text-amber-600 dark:text-amber-400',
    accentBg: 'bg-amber-600',
    accentBorder: 'border-amber-500/40',
    accentHoverBorder: 'hover:border-amber-500/60',
    accentFocusBorder: 'focus:border-amber-500',
    badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    badgeLive: 'bg-amber-600 text-white',
    btnPrimary: 'bg-amber-600 hover:bg-amber-500 text-white font-black shadow-lg shadow-amber-600/25',
    btnSecondary: 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold',
    gradient: 'from-amber-600 via-amber-500 to-yellow-500',
    glow: 'rgba(217, 119, 6, 0.3)',
    cardHover: 'hover:border-amber-500/40 hover:shadow-amber-500/10',
    pillActive: 'bg-amber-600 text-white font-bold',
    ring: 'ring-amber-500 focus:ring-amber-500/30',
    inputFocus: 'focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20',
  },
  rose: {
    id: 'rose',
    name: 'Rose Glamour (Beauté & Cosmétique)',
    description: 'Vibrant et moderne pour cosmétiques, soins, mode féminine & bien-être',
    hex: '#e11d48',
    accentColor: 'text-rose-600 dark:text-rose-400',
    accentBg: 'bg-rose-600',
    accentBorder: 'border-rose-500/40',
    accentHoverBorder: 'hover:border-rose-500/60',
    accentFocusBorder: 'focus:border-rose-500',
    badge: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
    badgeLive: 'bg-rose-600 text-white',
    btnPrimary: 'bg-rose-600 hover:bg-rose-500 text-white font-black shadow-lg shadow-rose-600/25',
    btnSecondary: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold',
    gradient: 'from-rose-600 via-rose-500 to-pink-500',
    glow: 'rgba(225, 29, 72, 0.3)',
    cardHover: 'hover:border-rose-500/40 hover:shadow-rose-500/10',
    pillActive: 'bg-rose-600 text-white font-bold',
    ring: 'ring-rose-500 focus:ring-rose-500/30',
    inputFocus: 'focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20',
  },
  violet: {
    id: 'violet',
    name: 'Violet Deep (Créateurs & Artisans)',
    description: 'Inspirant et créatif pour artisans, décorateurs, designers & services',
    hex: '#7c3aed',
    accentColor: 'text-violet-600 dark:text-violet-400',
    accentBg: 'bg-violet-600',
    accentBorder: 'border-violet-500/40',
    accentHoverBorder: 'hover:border-violet-500/60',
    accentFocusBorder: 'focus:border-violet-500',
    badge: 'bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30',
    badgeLive: 'bg-violet-600 text-white',
    btnPrimary: 'bg-violet-600 hover:bg-violet-500 text-white font-black shadow-lg shadow-violet-600/25',
    btnSecondary: 'bg-violet-500/10 hover:bg-violet-500/20 text-violet-600 dark:text-violet-400 border border-violet-500/30 font-bold',
    gradient: 'from-violet-600 via-violet-500 to-purple-500',
    glow: 'rgba(124, 58, 237, 0.3)',
    cardHover: 'hover:border-violet-500/40 hover:shadow-violet-500/10',
    pillActive: 'bg-violet-600 text-white font-bold',
    ring: 'ring-violet-500 focus:ring-violet-500/30',
    inputFocus: 'focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20',
  }
};

export const THEME_PALETTES_LIST = Object.values(THEME_PALETTES);

// Aliases mapping pour assurer une compatibilité 100%
const ALIASES = {
  pink: 'rose',
  purple: 'violet',
  blue: 'cyan',
};

export function getTheme(themeId) {
  if (!themeId) return THEME_PALETTES.emerald;
  const normalized = String(themeId).toLowerCase().trim();
  const direct = THEME_PALETTES[normalized];
  if (direct) return direct;
  const aliasKey = ALIASES[normalized];
  if (aliasKey && THEME_PALETTES[aliasKey]) return THEME_PALETTES[aliasKey];
  return THEME_PALETTES.emerald;
}
