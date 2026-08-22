import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  ArrowLeft, 
  ArrowRight, 
  Maximize2, 
  Minimize2, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Move,
  Sparkles,
  Sliders,
  RotateCcw,
  Crosshair
} from 'lucide-react';
import InnerSnippetRenderer from './InnerSnippetRenderer';
import { BLOCK_DESIGN_VARIANTS } from '../../config/blockDesignStyles';

export default function InnerSnippetSlotContainer({
  snippets = [],
  blockId,
  shop,
  themeId = 'emerald',
  isEditMode = false,
  selectedSnippetId = null,
  onSelectSnippet,
  onUpdateSnippet,
  onRemoveSnippet,
  onDuplicateSnippet,
  onMoveSnippet,
  onAddSnippet,
  onSelectProduct,
  onOpenWhatsApp,
  onNavigateToCatalog
}) {
  const containerRef = useRef(null);
  const [hoveredSnippetId, setHoveredSnippetId] = useState(null);

  // ── MOTEUR DE DÉPLACEMENT 2D LIBRE (TOUCH & MOUSE) AVEC LIGNES X / Y ──
  const [draggingSnippetId, setDraggingSnippetId] = useState(null);
  const [dragCoords, setDragCoords] = useState({ x: 50, y: 50 }); // en pourcentages %

  // Début du glisser-déposer au curseur ou au doigt
  const handleStartDrag2D = (snippetId, initialX = 50, initialY = 50, e) => {
    e.stopPropagation();
    setDraggingSnippetId(snippetId);
    setDragCoords({ x: initialX, y: initialY });
  };

  // Suivi du déplacement par événement global
  useEffect(() => {
    if (!draggingSnippetId) return;

    const handlePointerMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const rawX = ((clientX - rect.left) / rect.width) * 100;
      const rawY = ((clientY - rect.top) / rect.height) * 100;

      const clampedX = Math.max(2, Math.min(96, Math.round(rawX)));
      const clampedY = Math.max(2, Math.min(96, Math.round(rawY)));

      setDragCoords({ x: clampedX, y: clampedY });
    };

    const handlePointerUp = () => {
      if (draggingSnippetId && containerRef.current) {
        onUpdateSnippet?.(blockId, draggingSnippetId, {
          posX: dragCoords.x,
          posY: dragCoords.y,
          isFreePositioned: true
        });
      }
      setDraggingSnippetId(null);
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [draggingSnippetId, dragCoords, blockId, onUpdateSnippet]);

  if (!snippets.length && !isEditMode) {
    return null;
  }

  // Largeurs standards Odoo
  const WIDTH_CLASSES = {
    '25%': 'w-full sm:w-[calc(25%-0.75rem)]',
    '33%': 'w-full sm:w-[calc(33.333%-0.75rem)]',
    '50%': 'w-full sm:w-[calc(50%-0.75rem)]',
    '75%': 'w-full sm:w-[calc(75%-0.75rem)]',
    '100%': 'w-full',
    'auto': 'w-auto max-w-full'
  };

  const ALIGN_CLASSES = {
    'left': 'justify-start mr-auto',
    'center': 'justify-center mx-auto',
    'right': 'justify-end ml-auto',
    'stretch': 'w-full'
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full mt-3 transition-all relative ${
        isEditMode ? 'p-2.5 rounded-3xl border-2 border-dashed border-slate-300/60 dark:border-slate-700/60 bg-slate-500/5 min-h-[60px]' : ''
      }`}
    >
      
      {/* ═══════════════════════════════════════════════════════
          LIGNES GUIDES D'AXES X ET Y (LASER REPÈRES MAGNETIQUES)
         ═══════════════════════════════════════════════════════ */}
      {isEditMode && draggingSnippetId && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-visible">
          
          {/* Ligne Guide d'Axe Y (Verticale) */}
          <div 
            style={{ left: `${dragCoords.x}%` }}
            className="absolute top-0 bottom-0 w-[2px] bg-emerald-400 shadow-[0_0_12px_#10b981] transition-none -translate-x-1/2"
          >
            <span className="absolute top-1 left-2 px-1.5 py-0.5 rounded bg-[#16181D] text-emerald-400 text-[9px] font-mono font-bold shadow border border-emerald-500/40">
              Y-Axis
            </span>
          </div>

          {/* Ligne Guide d'Axe X (Horizontale) */}
          <div 
            style={{ top: `${dragCoords.y}%` }}
            className="absolute left-0 right-0 h-[2px] bg-emerald-400 shadow-[0_0_12px_#10b981] transition-none -translate-y-1/2"
          >
            <span className="absolute left-1 top-2 px-1.5 py-0.5 rounded bg-[#16181D] text-emerald-400 text-[9px] font-mono font-bold shadow border border-emerald-500/40">
              X-Axis
            </span>
          </div>

          {/* Badge Flottant des Coordonnées précises X / Y */}
          <div 
            style={{ left: `${dragCoords.x}%`, top: `${dragCoords.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-10 px-2.5 py-1 rounded-xl bg-[#16181D]/95 text-emerald-400 font-mono font-black text-[11px] shadow-2xl border border-emerald-500/60 flex items-center gap-1.5 whitespace-nowrap animate-pulse"
          >
            <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
            <span>X: {dragCoords.x}% • Y: {dragCoords.y}%</span>
          </div>

        </div>
      )}

      {/* Label indicateur de zone de contenus intérieurs en mode édition */}
      {isEditMode && (
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Contenus Intérieurs & Réseaux ({snippets.length})</span>
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddSnippet?.(blockId);
            }}
            className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>+ Ajouter un contenu</span>
          </button>
        </div>
      )}

      {/* Grille Flex-wrap des Snippets */}
      <div className="flex flex-wrap items-center gap-2.5">
        {snippets.map((snip, index) => {
          const isSelected = isEditMode && selectedSnippetId === snip.id;
          const isDragging = draggingSnippetId === snip.id;
          const isPill = ['facebook', 'instagram', 'whatsapp', 'tiktok', 'youtube'].includes(snip.snippetType || snip.type);
          
          const currentWidth = isPill ? 'auto' : (snip.width || snip.props?.width || '100%');
          const currentAlign = snip.alignment || snip.props?.alignment || (isPill ? 'left' : 'stretch');
          const widthClass = isPill ? 'w-auto' : (WIDTH_CLASSES[currentWidth] || WIDTH_CLASSES['100%']);
          const alignClass = ALIGN_CLASSES[currentAlign] || ALIGN_CLASSES['stretch'];

          const isFreePos = Boolean(snip.isFreePositioned && snip.posX != null && snip.posY != null);
          const posX = isDragging ? dragCoords.x : (snip.posX != null ? snip.posX : 50);
          const posY = isDragging ? dragCoords.y : (snip.posY != null ? snip.posY : 50);

          return (
            <div
              key={snip.id || `snip-${index}`}
              onClick={(e) => {
                if (isEditMode) {
                  e.stopPropagation();
                  onSelectSnippet?.(snip.id, blockId);
                }
              }}
              onMouseEnter={() => setHoveredSnippetId(snip.id)}
              onMouseLeave={() => setHoveredSnippetId(null)}
              style={isFreePos ? {
                transform: `translate(${posX > 50 ? '-50%' : '0%'}, 0)`,
                marginLeft: `${posX}%`
              } : undefined}
              className={`relative group/snip transition-all duration-200 min-w-0 max-w-full ${widthClass} ${alignClass} ${
                isEditMode ? 'cursor-pointer' : ''
              } ${
                isSelected 
                  ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 rounded-2xl shadow-xl z-20' 
                  : isEditMode ? 'hover:ring-1 hover:ring-emerald-400/60 rounded-2xl' : ''
              }`}
            >
              
              {/* 🌟 BARRE D'OUTILS FLOTTANTE DU SNIPPET ACTIF */}
              {isEditMode && (isSelected || hoveredSnippetId === snip.id) && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className={`absolute -top-11 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 p-1 rounded-2xl bg-[#16181D]/95 backdrop-blur-md border border-slate-700 shadow-2xl transition-all select-none ${
                    isSelected ? 'opacity-100 scale-100' : 'opacity-90 scale-95'
                  }`}
                >
                  
                  {/* Poignée de Positionnement Libre 2D (Axes X/Y au Doigt et Curseur) */}
                  <div
                    onMouseDown={(e) => handleStartDrag2D(snip.id, posX, posY, e)}
                    onTouchStart={(e) => handleStartDrag2D(snip.id, posX, posY, e)}
                    className="px-2 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-black text-[10px] cursor-grab active:cursor-grabbing flex items-center gap-1 shadow-md"
                    title="Glissez avec le doigt ou la souris pour positionner n'importe où dans le bloc"
                  >
                    <Move className="w-3 h-3" />
                    <span>Placer 2D</span>
                  </div>

                  {/* Réinitialiser la position standard */}
                  {isFreePos && (
                    <button
                      type="button"
                      onClick={() => onUpdateSnippet?.(blockId, snip.id, { isFreePositioned: false, posX: null, posY: null })}
                      className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                      title="Réinitialiser l'alignement automatique"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}

                  {!isPill && (
                    /* Sélecteur de Largeur Rapide pour contenus standards */
                    <div className="flex items-center bg-slate-900 rounded-xl p-0.5 border border-slate-800">
                      {['25%', '50%', '75%', '100%'].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => onUpdateSnippet?.(blockId, snip.id, { width: w })}
                          className={`px-1.5 py-0.5 rounded-lg text-[9px] font-bold transition-colors cursor-pointer ${
                            currentWidth === w ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                          title={`Largeur ${w}`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Dupliquer */}
                  <button
                    type="button"
                    onClick={() => onDuplicateSnippet?.(blockId, snip.id)}
                    className="p-1 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                    title="Dupliquer ce contenu"
                  >
                    <Copy className="w-3 h-3" />
                  </button>

                  {/* Supprimer */}
                  <button
                    type="button"
                    onClick={() => onRemoveSnippet?.(blockId, snip.id)}
                    className="p-1 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 cursor-pointer"
                    title="Supprimer ce contenu"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Rendu du Contenu Intérieur ou de la Pilule Réseau Social */}
              <div className="h-full">
                <InnerSnippetRenderer
                  snippetType={snip.snippetType || snip.type || 'rating'}
                  props={snip.props || snip}
                  shop={shop}
                  themeId={themeId}
                  designVariant={snip.designVariant || snip.props?.designVariant || 'modern_minimal'}
                  onSelectProduct={isEditMode ? undefined : onSelectProduct}
                  onOpenWhatsApp={isEditMode ? undefined : onOpenWhatsApp}
                  onNavigateToCatalog={isEditMode ? undefined : onNavigateToCatalog}
                />
              </div>

            </div>
          );
        })}
      </div>

      {/* Bouton d'ajout rapide si vide en mode édition */}
      {isEditMode && !snippets.length && (
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onAddSnippet?.(blockId);
          }}
          className="py-3 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl hover:bg-emerald-500/10 hover:border-emerald-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-emerald-500">
            <Plus className="w-4 h-4" />
            <span>Ajouter une pilule Réseau Social (Facebook, WhatsApp, Insta...) ou Contenu</span>
          </div>
        </div>
      )}

    </div>
  );
}
