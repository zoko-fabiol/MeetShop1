import React from 'react';
import { 
  GripVertical, 
  Settings, 
  Copy, 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  Trash2,
  Sliders,
  Sparkles
} from 'lucide-react';
import { getTheme } from '../../config/themes';

export default function BlockActionToolbar({
  block,
  index,
  totalBlocks,
  themeId,
  onEdit,
  onAiEdit,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onToggleVisibility,
  onDelete
}) {
  const theme = getTheme(themeId);
  const isAiBlock = block.type === 'CustomAiBlock' || block.type === 'DynamicCode' || block.type === 'DynamicCodeBlock';

  return (
    <div className="absolute -top-3.5 right-4 z-30 flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all scale-95 group-hover:scale-100">
      
      {/* Poignée de Glisser-Déposer Odoo */}
      <div 
        title="Glisser pour réordonner ce bloc"
        className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <GripVertical className="w-3.5 h-3.5" />
      </div>

      <div className="w-[1px] h-3.5 bg-slate-200 dark:bg-slate-800 my-auto" />

      {/* Bouton Paramètres / Styles standard OU Bouton Prompt IA pour les blocs IA */}
      {isAiBlock ? (
        <button
          type="button"
          onClick={() => onAiEdit?.(block)}
          title="Modifier ce bloc avec le Copilote IA (Prompt)"
          className="p-1.5 rounded-lg font-bold text-xs flex items-center gap-1 bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-cyan-500/15 text-emerald-600 dark:text-emerald-400 hover:scale-105 transition-all border border-emerald-500/30"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[10px] hidden sm:inline font-black">Modifier via IA</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onEdit(block)}
          title="Personnaliser les textes et styles"
          className={`p-1.5 rounded-lg font-bold text-xs flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${theme.accentColor}`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="text-[10px] hidden sm:inline">Styles</span>
        </button>
      )}

      {/* Bouton Dupliquer */}
      <button
        type="button"
        onClick={() => onDuplicate(index)}
        title="Dupliquer ce bloc"
        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>

      {/* Monter d'un cran */}
      {index > 0 && (
        <button
          type="button"
          onClick={() => onMoveUp(index)}
          title="Monter"
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Descendre d'un cran */}
      {index < totalBlocks - 1 && (
        <button
          type="button"
          onClick={() => onMoveDown(index)}
          title="Descendre"
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Visibilité Masquer / Afficher */}
      <button
        type="button"
        onClick={() => onToggleVisibility(index)}
        title={block.visible !== false ? 'Masquer' : 'Afficher'}
        className={`p-1.5 rounded-lg transition-colors ${
          block.visible !== false 
            ? 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800' 
            : 'text-amber-500 bg-amber-500/10'
        }`}
      >
        {block.visible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
      </button>

      {/* Supprimer */}
      <button
        type="button"
        onClick={() => onDelete(index)}
        title="Supprimer ce bloc"
        className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-500/10 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

    </div>
  );
}
