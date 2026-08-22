/**
 * NUANCIERS ET UTILITAIRES DE COULEURS DE TEXTE PERSONNALISABLES
 * Permet de modifier en 1 clic la couleur des titres, sous-textes et badges
 * pour assurer un contraste parfait sur n'importe quel arrière-plan.
 */

export const TEXT_COLOR_SWATCHES = [
  { id: 'default', name: 'Auto (Thème)', hex: '', class: '' },
  { id: 'white', name: 'Blanc Pur', hex: '#FFFFFF', class: 'text-white' },
  { id: 'slate_900', name: 'Noir Ardoise', hex: '#0F172A', class: 'text-slate-900' },
  { id: 'slate_700', name: 'Gris Foncé', hex: '#334155', class: 'text-slate-700' },
  { id: 'slate_300', name: 'Gris Clair', hex: '#CBD5E1', class: 'text-slate-300' },
  { id: 'emerald', name: 'Émeraude', hex: '#10B981', class: 'text-emerald-500' },
  { id: 'gold', name: 'Or & Ambre', hex: '#F59E0B', class: 'text-amber-500' },
  { id: 'cyan', name: 'Cyan Néon', hex: '#06B6D4', class: 'text-cyan-400' },
  { id: 'rose', name: 'Rose Fuchsia', hex: '#F43F5E', class: 'text-rose-500' },
  { id: 'purple', name: 'Violet Améthyste', hex: '#A855F7', class: 'text-purple-400' },
  { id: 'orange', name: 'Orange Solaire', hex: '#EA580C', class: 'text-orange-500' },
  { id: 'blue', name: 'Bleu Roi', hex: '#2563EB', class: 'text-blue-600' }
];

/**
 * Retourne le style inline pour une couleur personnalisée ou un objet vide si non défini.
 */
export function getCustomColorStyle(colorValue) {
  if (!colorValue || colorValue === 'default') return {};
  if (colorValue.startsWith('#') || colorValue.startsWith('rgb') || colorValue.startsWith('hsl')) {
    return { color: colorValue };
  }
  const match = TEXT_COLOR_SWATCHES.find(s => s.id === colorValue || s.hex.toLowerCase() === colorValue.toLowerCase());
  if (match && match.hex) {
    return { color: match.hex };
  }
  return { color: colorValue };
}
