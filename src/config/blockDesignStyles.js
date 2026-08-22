/**
 * 16+ STYLES DE DESIGN ODOO POUR LES BLOCS & CONTENUS INTÉRIEURS
 * Chaque style dispose d'une version Thème Clair et d'une version Thème Sombre
 * harmonieuses, contrastées et magnifiques.
 */

export const BLOCK_DESIGN_VARIANTS = [
  // 1. Modern Minimal
  {
    id: 'modern_minimal',
    name: 'Modern Minimal',
    desc: 'Épuré, ombres douces et bordures fines contemporaines',
    badgeText: 'Minimal',
    containerClass: 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300',
    headerClass: 'text-slate-900 dark:text-white font-extrabold tracking-tight',
    subTextClass: 'text-slate-500 dark:text-slate-400',
    accentBadgeClass: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 font-bold',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-sm active:scale-98 transition-all',
    cardInnerClass: 'bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm'
  },

  // 2. Glassmorphism Blur
  {
    id: 'glassmorphism_blur',
    name: 'Glassmorphism Blur',
    desc: 'Verre dépoli transparent, reflets cristallins et contours lumineux',
    badgeText: 'Glass Pro',
    containerClass: 'bg-white/85 dark:bg-slate-900/85 text-slate-900 dark:text-white backdrop-blur-xl border border-white/60 dark:border-slate-700/60 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300',
    headerClass: 'text-slate-900 dark:text-white font-black tracking-tight',
    subTextClass: 'text-slate-600 dark:text-slate-300',
    accentBadgeClass: 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-800 dark:text-emerald-200 border border-emerald-400/30 backdrop-blur-md font-extrabold',
    buttonClass: 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/25 active:scale-95 transition-all',
    cardInnerClass: 'bg-white/70 dark:bg-slate-800/70 text-slate-900 dark:text-white backdrop-blur-md rounded-2xl p-4 border border-white/40 dark:border-slate-700/40 shadow-inner'
  },

  // 3. Neo-Brutalism Bold
  {
    id: 'neo_brutalism_bold',
    name: 'Neo-Brutalism Pop',
    desc: 'Contours noirs francs 2px, ombres 3D dures et typographie pop-art',
    badgeText: 'Pop Art',
    containerClass: 'bg-amber-50/90 dark:bg-slate-900 text-slate-950 dark:text-white border-2 border-slate-950 dark:border-white rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.9)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all duration-200',
    headerClass: 'text-slate-950 dark:text-white font-black uppercase tracking-wide',
    subTextClass: 'text-slate-800 dark:text-slate-200 font-semibold',
    accentBadgeClass: 'bg-amber-300 dark:bg-amber-400 text-slate-950 border-2 border-slate-950 dark:border-slate-950 font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
    buttonClass: 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black border-2 border-slate-950 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all',
    cardInnerClass: 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white rounded-xl p-4 border-2 border-slate-950 dark:border-slate-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
  },

  // 4. Luxury Editorial
  {
    id: 'luxury_editorial',
    name: 'Luxury Editorial',
    desc: 'Haute-couture, dorures chaudes, typographie sérif et prestige',
    badgeText: 'Prestige Gold',
    containerClass: 'bg-[#FCFBF7] dark:bg-[#151412] text-[#2A231C] dark:text-[#F3EED9] border border-amber-300/80 dark:border-amber-900/50 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300',
    headerClass: 'text-[#2A231C] dark:text-[#F3EED9] font-serif font-extrabold tracking-normal',
    subTextClass: 'text-[#685D52] dark:text-[#B6A89B] font-serif italic',
    accentBadgeClass: 'bg-amber-100/90 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300/70 dark:border-amber-700/60 font-serif font-bold tracking-wider uppercase text-[10px]',
    buttonClass: 'bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-500 text-white font-serif font-bold rounded-2xl shadow-md shadow-amber-900/20 active:scale-98 transition-all',
    cardInnerClass: 'bg-white/90 dark:bg-[#1E1C18] text-[#2A231C] dark:text-[#F3EED9] rounded-2xl p-4 border border-amber-200/80 dark:border-amber-950 shadow-sm'
  },

  // 5. Cyber Tech Dark & Light
  {
    id: 'cyber_tech_dark',
    name: 'Cyber Neon Tech',
    desc: 'Ambiance matrice néon cyan et monospace (Clair & Sombre)',
    badgeText: 'Cyber Neon',
    containerClass: 'bg-cyan-50/80 dark:bg-[#0A0D12] text-slate-900 dark:text-slate-100 border border-cyan-400/80 dark:border-cyan-500/40 rounded-2xl shadow-lg shadow-cyan-500/10 dark:shadow-cyan-950/50 hover:border-cyan-500 transition-all duration-300 relative overflow-hidden',
    headerClass: 'text-cyan-900 dark:text-cyan-300 font-mono font-black tracking-tight',
    subTextClass: 'text-slate-600 dark:text-slate-400 font-mono text-xs',
    accentBadgeClass: 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-900 dark:text-cyan-300 border border-cyan-400 dark:border-cyan-500/60 font-mono font-bold shadow-[0_0_10px_rgba(6,182,212,0.25)]',
    buttonClass: 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-black rounded-xl shadow-lg shadow-cyan-500/30 active:scale-95 transition-all',
    cardInnerClass: 'bg-white/90 dark:bg-[#111620] text-slate-900 dark:text-slate-100 rounded-xl p-4 border border-cyan-200 dark:border-cyan-900/70 shadow-inner'
  },

  // 6. Vintage Retro Warm
  {
    id: 'vintage_retro_warm',
    name: 'Vintage 70s Warm',
    desc: 'Teintes terracotta, papier crème, orange solaire et look rétro chaleureux',
    badgeText: 'Retro Warm',
    containerClass: 'bg-[#FFF8F0] dark:bg-[#1F1815] text-[#4A2511] dark:text-[#FFE3D1] border border-orange-200 dark:border-orange-900/40 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300',
    headerClass: 'text-[#4A2511] dark:text-[#FFE3D1] font-serif font-black tracking-tight',
    subTextClass: 'text-[#855B42] dark:text-[#D1A88F] font-medium',
    accentBadgeClass: 'bg-orange-100 dark:bg-orange-950/70 text-orange-800 dark:text-orange-300 border border-orange-300/60 font-bold',
    buttonClass: 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black rounded-2xl shadow-md shadow-orange-500/20 active:scale-98 transition-all',
    cardInnerClass: 'bg-white/90 dark:bg-[#2B201B] text-[#4A2511] dark:text-[#FFE3D1] rounded-2xl p-4 border border-orange-100 dark:border-orange-950'
  },

  // 7. Nordic Soft Pastel
  {
    id: 'nordic_scandi',
    name: 'Nordic Scandi Soft',
    desc: 'Douceur scandinave, teintes polaires, courbes généreuses et calme visuel',
    badgeText: 'Scandi Soft',
    containerClass: 'bg-[#F4F8FA] dark:bg-[#12181C] text-slate-800 dark:text-slate-100 border border-sky-200/80 dark:border-sky-950 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300',
    headerClass: 'text-slate-800 dark:text-slate-100 font-bold tracking-tight',
    subTextClass: 'text-slate-500 dark:text-slate-400',
    accentBadgeClass: 'bg-sky-100/80 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border border-sky-200 font-semibold',
    buttonClass: 'bg-slate-800 hover:bg-slate-700 text-white dark:bg-sky-600 dark:hover:bg-sky-500 font-bold rounded-2xl shadow-sm active:scale-98 transition-all',
    cardInnerClass: 'bg-white dark:bg-[#1A2227] text-slate-800 dark:text-slate-100 rounded-2xl p-4 border border-sky-100 dark:border-sky-950 shadow-sm'
  },

  // 8. Midnight Amethyst
  {
    id: 'midnight_amethyst',
    name: 'Midnight Amethyst',
    desc: 'Violet nuit mystique, reflets améthyste et lueurs pourpres envoûtantes',
    badgeText: 'Royal Violet',
    containerClass: 'bg-purple-50/85 dark:bg-[#0E0A1A] text-purple-950 dark:text-purple-100 border border-purple-300/80 dark:border-purple-500/40 rounded-3xl shadow-xl hover:border-purple-400 transition-all duration-300',
    headerClass: 'text-purple-900 dark:text-purple-200 font-extrabold tracking-tight',
    subTextClass: 'text-purple-700 dark:text-purple-300/80 text-xs',
    accentBadgeClass: 'bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-200 border border-purple-300 dark:border-purple-500/50 font-bold shadow-[0_0_10px_rgba(168,85,247,0.2)]',
    buttonClass: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-600/30 active:scale-95 transition-all',
    cardInnerClass: 'bg-white/90 dark:bg-[#18122B] text-purple-950 dark:text-purple-100 rounded-2xl p-4 border border-purple-200 dark:border-purple-900/60 shadow-inner'
  },

  // 9. Sunset Warm Glow
  {
    id: 'sunset_warm_gradient',
    name: 'Sunset Warm Glow',
    desc: 'Dégradés crépuscule rose fuchsia et corail énergisant',
    badgeText: 'Sunset Aura',
    containerClass: 'bg-gradient-to-br from-rose-50/70 via-white to-amber-50/50 dark:from-slate-900 dark:via-rose-950/30 dark:to-slate-900 text-slate-900 dark:text-white border border-rose-200/80 dark:border-rose-900/40 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300',
    headerClass: 'text-slate-900 dark:text-white font-black tracking-tight',
    subTextClass: 'text-rose-950/80 dark:text-rose-200/80',
    accentBadgeClass: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300/60 font-black',
    buttonClass: 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-black rounded-2xl shadow-md shadow-rose-500/25 active:scale-98 transition-all',
    cardInnerClass: 'bg-white/90 dark:bg-slate-800/80 text-slate-900 dark:text-white rounded-2xl p-4 border border-rose-100 dark:border-rose-950'
  },

  // 10. Corporate Clean Trust
  {
    id: 'corporate_clean',
    name: 'Corporate Clean Trust',
    desc: 'Bleu marine institutionnel, netteté professionnelle et clarté business',
    badgeText: 'Pro Trust',
    containerClass: 'bg-white dark:bg-[#0C1424] text-slate-900 dark:text-white border border-blue-200/80 dark:border-blue-900/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300',
    headerClass: 'text-[#0A192F] dark:text-white font-extrabold tracking-tight',
    subTextClass: 'text-slate-500 dark:text-slate-400',
    accentBadgeClass: 'bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200 font-bold',
    buttonClass: 'bg-[#0052CC] hover:bg-[#0747A6] text-white font-bold rounded-xl shadow-sm active:scale-98 transition-all',
    cardInnerClass: 'bg-slate-50 dark:bg-[#131F38] text-slate-900 dark:text-white rounded-xl p-4 border border-blue-100 dark:border-blue-900/60'
  },

  // 11. Nature & Sage Organic
  {
    id: 'nature_organic',
    name: 'Nature & Sage Herbal',
    desc: 'Vert sauge bio, teintes végétales douces et harmonie écologique',
    badgeText: '100% Bio Nature',
    containerClass: 'bg-[#F5F8F4] dark:bg-[#121A13] text-[#1E3320] dark:text-[#E2F2E4] border border-emerald-200/80 dark:border-emerald-950 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300',
    headerClass: 'text-[#1E3320] dark:text-[#E2F2E4] font-black tracking-tight',
    subTextClass: 'text-[#445E47] dark:text-[#A7C7AA]',
    accentBadgeClass: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border border-emerald-300/60 font-bold',
    buttonClass: 'bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-md shadow-emerald-800/20 active:scale-98 transition-all',
    cardInnerClass: 'bg-white/90 dark:bg-[#1A261C] text-[#1E3320] dark:text-[#E2F2E4] rounded-2xl p-4 border border-emerald-100 dark:border-emerald-950'
  },

  // 12. Monochrome Bauhaus
  {
    id: 'monochrome_bauhaus',
    name: 'Monochrome Bauhaus',
    desc: 'Noir et blanc pur à haut contraste, découpes nettes et impact graphique',
    badgeText: 'Bauhaus B&W',
    containerClass: 'bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white rounded-none shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#FFF] transition-all duration-200',
    headerClass: 'text-black dark:text-white font-black tracking-tighter uppercase',
    subTextClass: 'text-neutral-700 dark:text-neutral-300 font-mono text-xs',
    accentBadgeClass: 'bg-black text-white dark:bg-white dark:text-black font-black uppercase text-[10px] px-2 py-0.5',
    buttonClass: 'bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-black uppercase rounded-none border-2 border-black dark:border-white active:translate-x-1 active:translate-y-1 transition-all',
    cardInnerClass: 'bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white border border-black dark:border-white p-4'
  },

  // 13. Futuristic Holographic
  {
    id: 'futuristic_hologram',
    name: 'Holographic Prism',
    desc: 'Reflets irisés arc-en-ciel, brillance holographique (Clair & Sombre)',
    badgeText: 'Holo Prism',
    containerClass: 'bg-gradient-to-br from-indigo-50/85 via-purple-50/70 to-pink-50/85 dark:from-indigo-950/90 dark:via-purple-950/80 dark:to-slate-950 text-slate-900 dark:text-white border border-pink-300/80 dark:border-pink-400/50 rounded-3xl shadow-2xl shadow-purple-500/10 dark:shadow-pink-950/40 hover:border-pink-400 transition-all duration-300',
    headerClass: 'text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 dark:from-pink-300 dark:via-purple-200 dark:to-cyan-300 font-black tracking-tight',
    subTextClass: 'text-slate-600 dark:text-slate-300 text-xs',
    accentBadgeClass: 'bg-pink-100 dark:bg-gradient-to-r dark:from-pink-500/20 dark:to-cyan-500/20 text-pink-800 dark:text-pink-200 border border-pink-300 dark:border-pink-400/60 font-bold',
    buttonClass: 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-400 hover:to-cyan-400 text-white font-black rounded-2xl shadow-lg shadow-purple-500/30 active:scale-95 transition-all',
    cardInnerClass: 'bg-white/85 dark:bg-slate-900/70 text-slate-900 dark:text-white backdrop-blur-md rounded-2xl p-4 border border-pink-200 dark:border-purple-500/30'
  },

  // 14. Tokyo Streetwear
  {
    id: 'streetwear_tokyo',
    name: 'Tokyo Streetwear',
    desc: 'Ambiance Shibuya underground, jaune acide et badges dynamiques',
    badgeText: 'Street Core',
    containerClass: 'bg-yellow-50/90 dark:bg-[#121316] text-slate-950 dark:text-white border-2 border-yellow-500 dark:border-yellow-400 rounded-2xl shadow-[5px_5px_0px_#EAB308] dark:shadow-[5px_5px_0px_#FACC15] hover:shadow-[7px_7px_0px_#EAB308] dark:hover:shadow-[7px_7px_0px_#FACC15] transition-all duration-200',
    headerClass: 'text-slate-950 dark:text-yellow-400 font-black uppercase tracking-wider',
    subTextClass: 'text-slate-700 dark:text-slate-300 text-xs font-mono',
    accentBadgeClass: 'bg-yellow-400 text-black font-black uppercase px-2.5 py-0.5 rounded-sm',
    buttonClass: 'bg-yellow-400 hover:bg-yellow-300 text-black font-black uppercase rounded-lg border-2 border-black active:translate-x-1 active:translate-y-1 transition-all',
    cardInnerClass: 'bg-white dark:bg-[#1C1E24] text-slate-950 dark:text-white rounded-xl p-4 border border-yellow-300 dark:border-yellow-400/40'
  },

  // 15. Claymorphism 3D
  {
    id: 'claymorphism_soft3d',
    name: 'Claymorphism Soft 3D',
    desc: 'Reliefs 3D moelleux arrondis, biseaux doux et aspect guimauve moderne',
    badgeText: 'Clay 3D',
    containerClass: 'bg-indigo-50/80 dark:bg-slate-900 text-indigo-950 dark:text-white border border-indigo-200/70 dark:border-indigo-900/50 rounded-3xl shadow-[inset_0_-4px_6px_rgba(0,0,0,0.06),0_10px_20px_rgba(79,70,229,0.12)] hover:scale-[1.01] transition-all duration-300',
    headerClass: 'text-indigo-950 dark:text-white font-extrabold tracking-tight',
    subTextClass: 'text-indigo-900/70 dark:text-indigo-200/70',
    accentBadgeClass: 'bg-indigo-200/80 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 rounded-full font-bold shadow-inner',
    buttonClass: 'bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-[inset_0_-3px_0_rgba(0,0,0,0.2),0_8px_16px_rgba(79,70,229,0.3)] active:translate-y-0.5 transition-all',
    cardInnerClass: 'bg-white dark:bg-slate-800 text-indigo-950 dark:text-white rounded-2xl p-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.04)]'
  },

  // 16. Y2K Cyberpop
  {
    id: 'y2k_cyberpop',
    name: 'Y2K Cyberpop',
    desc: 'Nostalgie an 2000, teintes bubblegum rose fuchsia et cyan métallique',
    badgeText: 'Y2K Millenium',
    containerClass: 'bg-gradient-to-br from-pink-100 via-white to-cyan-100 dark:from-[#1F0E1E] dark:to-[#0A1A22] text-slate-900 dark:text-white border-2 border-pink-400 dark:border-pink-500 rounded-3xl shadow-[4px_4px_0px_#EC4899] hover:shadow-[6px_6px_0px_#06B6D4] transition-all duration-300',
    headerClass: 'text-pink-600 dark:text-pink-300 font-black tracking-tighter uppercase',
    subTextClass: 'text-slate-700 dark:text-slate-300 text-xs font-semibold',
    accentBadgeClass: 'bg-pink-500 text-white font-black uppercase text-[10px] px-2.5 py-0.5 rounded-full shadow-sm',
    buttonClass: 'bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-400 hover:to-cyan-400 text-white font-black uppercase rounded-2xl shadow-md active:scale-95 transition-all',
    cardInnerClass: 'bg-white/95 dark:bg-slate-900/90 text-slate-900 dark:text-white rounded-2xl p-4 border border-pink-200 dark:border-pink-900'
  }
];

export const getDesignVariant = (variantId = 'modern_minimal') => {
  return BLOCK_DESIGN_VARIANTS.find(v => v.id === variantId) || BLOCK_DESIGN_VARIANTS[0];
};
