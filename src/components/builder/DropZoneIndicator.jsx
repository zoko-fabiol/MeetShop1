import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { getTheme } from '../../config/themes';

export default function DropZoneIndicator({ index, onDropBlock, themeId, isDraggingActive }) {
  const [isOver, setIsOver] = useState(false);
  const theme = getTheme(themeId);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    if (!isOver) setIsOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);

    try {
      // 1. Essai de récupération du nouveau bloc depuis le panneau Odoo
      const rawNewBlock = e.dataTransfer.getData('application/meetshop-block');
      if (rawNewBlock) {
        const blockDef = JSON.parse(rawNewBlock);
        onDropBlock(index, { isNew: true, blockDef });
        return;
      }

      // 2. Essai de récupération d'un bloc existant en cours de réordonnancement
      const rawMoveIndex = e.dataTransfer.getData('application/meetshop-reorder-index');
      if (rawMoveIndex !== '') {
        const fromIndex = parseInt(rawMoveIndex, 10);
        if (!isNaN(fromIndex)) {
          onDropBlock(index, { isNew: false, fromIndex });
          return;
        }
      }
    } catch (err) {
      console.warn('Erreur lors du drop de bloc:', err);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`transition-all duration-200 relative my-1 z-20 flex items-center justify-center ${
        isOver
          ? 'h-14 bg-emerald-500/15 dark:bg-emerald-500/20 border-2 border-dashed border-emerald-500 rounded-2xl scale-[1.01]'
          : isDraggingActive
          ? 'h-6 border border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-400 rounded-xl opacity-80'
          : 'h-2 hover:h-6 opacity-0 hover:opacity-100'
      }`}
    >
      {(isOver || isDraggingActive) && (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 border border-emerald-500/30 shadow-sm pointer-events-none animate-fadeIn">
          <Plus className="w-3.5 h-3.5 animate-pulse" />
          <span>{isOver ? 'Relâcher pour insérer ici' : 'Déposer ici'}</span>
        </div>
      )}
    </div>
  );
}
