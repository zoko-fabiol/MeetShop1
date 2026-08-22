import React, { useState, useRef } from 'react';
import { 
  ArrowLeftRight, 
  RotateCcw, 
  Sparkles, 
  Star, 
  Share2, 
  Search, 
  Highlighter, 
  BarChart3, 
  Percent, 
  Award, 
  Users, 
  Quote, 
  Code, 
  Calendar, 
  Heart, 
  ShoppingBag, 
  Facebook, 
  Instagram, 
  MapPin, 
  Zap, 
  CheckSquare,
  Sliders,
  Check,
  X,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Move
} from 'lucide-react';
import InnerSnippetRenderer from './InnerSnippetRenderer';
import { ODOO_INNER_SNIPPETS } from '../odoo-editor/OdooLiveEditorSidebar';
import { getOrderedSlots, moveSlotInBlock, reorderSlotToTarget } from '../../config/blockSlots';

export default function SlotReplacer({
  slotName,
  slotLabel = 'Cet élément',
  blockId,
  blockType = 'FlashDeal',
  blockProps = {},
  isEditMode = false,
  onUpdateBlockProps,
  themeId = 'emerald',
  shop = {},
  onSelectProduct,
  onOpenWhatsApp,
  onNavigateToCatalog,
  children
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const containerRef = useRef(null);

  const replacedSlots = blockProps.replacedSlots || {};
  const activeReplacement = replacedSlots[slotName];

  // Gestion du déplacement via boutons Haut / Bas
  const handleMove = (e, direction) => {
    e.stopPropagation();
    e.preventDefault();
    const currentOrder = getOrderedSlots(blockType, blockProps.slotsOrder);
    const nextOrder = moveSlotInBlock(currentOrder, slotName, direction);
    onUpdateBlockProps?.(blockId, { slotsOrder: nextOrder });
  };

  // ═══════════════════════════════════════════════════════════
  // 🖱️ MOUSE DRAG & DROP (HTML5 Drag and Drop)
  // ═══════════════════════════════════════════════════════════
  const handleDragStart = (e) => {
    if (!isEditMode) return;
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({
      blockId,
      slotName,
      blockType
    }));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setIsDragOver(false);
  };

  const handleDragOver = (e) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (!isEditMode) return;
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    if (!isEditMode) return;
    e.preventDefault();
    setIsDragOver(false);
    setIsDragging(false);

    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (!dataStr) return;
      const data = JSON.parse(dataStr);

      if (data.blockId === blockId && data.slotName && data.slotName !== slotName) {
        const currentOrder = getOrderedSlots(blockType, blockProps.slotsOrder);
        const nextOrder = reorderSlotToTarget(currentOrder, data.slotName, slotName);
        onUpdateBlockProps?.(blockId, { slotsOrder: nextOrder });
      }
    } catch (err) {
      console.warn('Erreur lors du drop de slot:', err);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // 📱 TOUCH DRAG & DROP (Au Doigt sur Smartphone / Tablette)
  // ═══════════════════════════════════════════════════════════
  const touchStateRef = useRef({ active: false, targetSlot: null });

  const handleTouchStart = (e) => {
    if (!isEditMode) return;
    touchStateRef.current = { active: true, targetSlot: null };
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isEditMode || !touchStateRef.current.active) return;
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const slotEl = el ? el.closest('[data-slot-name]') : null;

    if (slotEl) {
      const targetSlot = slotEl.getAttribute('data-slot-name');
      if (targetSlot && targetSlot !== slotName) {
        touchStateRef.current.targetSlot = targetSlot;
        setIsDragOver(true);
      }
    } else {
      setIsDragOver(false);
    }
  };

  const handleTouchEnd = () => {
    if (!isEditMode) return;
    const targetSlot = touchStateRef.current.targetSlot;
    touchStateRef.current = { active: false, targetSlot: null };
    setIsDragging(false);
    setIsDragOver(false);

    if (targetSlot && targetSlot !== slotName) {
      const currentOrder = getOrderedSlots(blockType, blockProps.slotsOrder);
      const nextOrder = reorderSlotToTarget(currentOrder, slotName, targetSlot);
      onUpdateBlockProps?.(blockId, { slotsOrder: nextOrder });
    }
  };

  // Intercepteur pour désactiver les actions de boutons en mode édition
  const handleEditClick = (e) => {
    if (isEditMode) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Classes d'état de Drag & Drop
  const dragClasses = isDragging 
    ? 'opacity-40 scale-95 border-2 border-dashed border-emerald-500 rounded-2xl' 
    : isDragOver 
      ? 'ring-2 ring-emerald-400 bg-emerald-500/15 shadow-xl scale-[1.01] rounded-2xl transition-all' 
      : '';

  // Si l'élément a été remplacé par un contenu intérieur
  if (activeReplacement && activeReplacement.snippetType) {
    return (
      <div 
        ref={containerRef}
        data-slot-name={slotName}
        draggable={isEditMode}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClickCapture={handleEditClick}
        className={`relative group/slot transition-all ${dragClasses} ${isEditMode ? 'ring-1 ring-emerald-500/40 rounded-2xl p-1 bg-emerald-500/5' : ''}`}
      >
        {/* Barre d'actions du slot remplacé en mode édition */}
        {isEditMode && (
          <div className="flex items-center justify-between gap-2 mb-1.5 px-2 py-1 bg-[#16181D]/95 backdrop-blur-md rounded-xl border border-slate-700 text-[10px] font-bold text-slate-300 shadow-xl z-20">
            <div className="flex items-center gap-1 text-emerald-400 truncate">
              {/* Poignée de Glisser-Déposer au Doigt / Curseur */}
              <div 
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white"
                title="Glisser-déposer pour déplacer avec le curseur ou au doigt"
              >
                <GripVertical className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">{slotLabel}: <strong>{activeReplacement.title || activeReplacement.snippetType}</strong></span>
            </div>
            
            <div className="flex items-center gap-1 shrink-0">
              {/* Boutons Déplacer Haut / Bas */}
              <button
                type="button"
                onClick={(e) => handleMove(e, 'up')}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                title="Déplacer vers le haut"
              >
                <ArrowUp className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={(e) => handleMove(e, 'down')}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                title="Déplacer vers le bas"
              >
                <ArrowDown className="w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPicker(!showPicker);
                }}
                className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 cursor-pointer"
                title="Changer de contenu intérieur"
              >
                <ArrowLeftRight className="w-3 h-3 text-cyan-400" />
                <span>Changer</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const nextReplaced = { ...replacedSlots };
                  delete nextReplaced[slotName];
                  onUpdateBlockProps?.(blockId, { replacedSlots: nextReplaced });
                }}
                className="px-2 py-0.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 flex items-center gap-1 cursor-pointer"
                title="Rétablir l'élément d'origine du bloc"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Rétablir</span>
              </button>
            </div>
          </div>
        )}

        {/* Menu de choix d'un autre contenu */}
        {isEditMode && showPicker && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="p-2 mb-2 rounded-2xl bg-slate-900 border border-slate-700 grid grid-cols-2 sm:grid-cols-3 gap-1.5 shadow-2xl z-40 animate-fadeIn"
          >
            {ODOO_INNER_SNIPPETS.map((snip) => {
              const Icon = snip.icon;
              return (
                <button
                  key={snip.id}
                  type="button"
                  onClick={() => {
                    const nextReplaced = {
                      ...replacedSlots,
                      [slotName]: {
                        snippetType: snip.id,
                        title: snip.name,
                        designVariant: blockProps.designVariant || 'modern_minimal',
                        width: '100%',
                        alignment: 'stretch',
                        props: {
                          badge: 'Spécial',
                          ratingScore: '4.9',
                          progressPercent: 85
                        }
                      }
                    };
                    onUpdateBlockProps?.(blockId, { replacedSlots: nextReplaced });
                    setShowPicker(false);
                  }}
                  className="p-1.5 rounded-xl bg-slate-950 hover:bg-emerald-500/20 text-left flex items-center gap-1.5 text-[10px] text-slate-200 hover:text-emerald-400 cursor-pointer transition-all"
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{snip.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Rendu du Contenu Intérieur substitué */}
        <InnerSnippetRenderer
          snippetType={activeReplacement.snippetType}
          props={{ ...(activeReplacement.props || {}), ...(activeReplacement || {}) }}
          shop={shop}
          themeId={themeId}
          designVariant={activeReplacement.designVariant || blockProps.designVariant || 'modern_minimal'}
          onSelectProduct={isEditMode ? undefined : onSelectProduct}
          onOpenWhatsApp={isEditMode ? undefined : onOpenWhatsApp}
          onNavigateToCatalog={isEditMode ? undefined : onNavigateToCatalog}
        />
      </div>
    );
  }

  // Si l'élément est dans son état par défaut d'origine
  return (
    <div 
      ref={containerRef}
      data-slot-name={slotName}
      draggable={isEditMode}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClickCapture={handleEditClick}
      className={`relative group/slot-default transition-all ${dragClasses} ${isEditMode ? 'hover:ring-1 hover:ring-cyan-500/40 rounded-xl' : ''}`}
    >
      {/* Barre d'outils flottante au survol en mode édition */}
      {isEditMode && (
        <div className="absolute top-1 right-1 z-30 opacity-0 group-hover/slot-default:opacity-100 transition-opacity flex items-center gap-1 bg-[#16181D]/95 backdrop-blur-md px-1.5 py-0.5 rounded-xl border border-slate-700 shadow-xl text-[9px] font-bold text-slate-300">
          {/* Poignée de Glisser-Déposer au Doigt / Curseur */}
          <div 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-slate-700 text-emerald-400 hover:text-white"
            title="Glisser-déposer pour déplacer avec la souris ou au doigt"
          >
            <GripVertical className="w-3 h-3" />
          </div>

          <span className="text-slate-400 mr-0.5 truncate max-w-[100px]">{slotLabel}</span>

          {/* Bouton Déplacer vers le haut */}
          <button
            type="button"
            onClick={(e) => handleMove(e, 'up')}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
            title="Déplacer cet élément vers le haut"
          >
            <ArrowUp className="w-2.5 h-2.5" />
          </button>

          {/* Bouton Déplacer vers le bas */}
          <button
            type="button"
            onClick={(e) => handleMove(e, 'down')}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
            title="Déplacer cet élément vers le bas"
          >
            <ArrowDown className="w-2.5 h-2.5" />
          </button>

          {/* Bouton Remplacer par un contenu intérieur */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowPicker(!showPicker);
            }}
            className="px-1.5 py-0.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center gap-0.5 cursor-pointer transition-all"
            title={`Remplacer ${slotLabel} par un contenu intérieur`}
          >
            <ArrowLeftRight className="w-2.5 h-2.5" />
            <span>Remplacer</span>
          </button>
        </div>
      )}

      {/* Menu déroulant des 21 snippets */}
      {isEditMode && showPicker && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute top-7 right-0 w-72 p-2 rounded-2xl bg-[#16181D] border border-slate-700 shadow-2xl z-40 grid grid-cols-2 gap-1 animate-fadeIn max-h-60 overflow-y-auto"
        >
          <div className="col-span-2 px-1 py-0.5 text-[9px] font-mono text-slate-400 flex items-center justify-between border-b border-slate-800 mb-1">
            <span>Remplacer {slotLabel} par :</span>
            <button type="button" onClick={() => setShowPicker(false)} className="text-slate-500 hover:text-white p-0.5"><X className="w-3 h-3" /></button>
          </div>
          {ODOO_INNER_SNIPPETS.map((snip) => {
            const Icon = snip.icon;
            return (
              <button
                key={snip.id}
                type="button"
                onClick={() => {
                  const nextReplaced = {
                    ...replacedSlots,
                    [slotName]: {
                      snippetType: snip.id,
                      title: snip.name,
                      designVariant: blockProps.designVariant || 'modern_minimal',
                      width: '100%',
                      alignment: 'stretch',
                      props: {
                        badge: 'Spécial',
                        ratingScore: '4.9',
                        progressPercent: 85
                      }
                    }
                  };
                  onUpdateBlockProps?.(blockId, { replacedSlots: nextReplaced });
                  setShowPicker(false);
                }}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-emerald-500/20 text-left flex items-center gap-1.5 text-[10px] text-slate-200 hover:text-emerald-400 cursor-pointer transition-all"
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{snip.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Rendu de l'élément standard d'origine */}
      {children}
    </div>
  );
}
