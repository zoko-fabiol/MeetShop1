import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Bot, 
  Sparkles,
  GripVertical
} from 'lucide-react';
import BlockRenderer from '../shop-blocks/BlockRenderer';

export default function OdooLiveCanvasWrapper({
  blocks = [],
  shop,
  products = [],
  themeId = 'emerald',
  selectedBlockId = null,
  selectedSnippetId = null,
  onSelectBlock,
  onSelectSnippet,
  onUpdateSnippet,
  onRemoveSnippet,
  onDuplicateSnippet,
  onMoveSnippet,
  onAddSnippet,
  onAddBlockAtIndex,
  onUpdateBlockProps,
  onMoveBlock,
  onDuplicateBlock,
  onDeleteBlock,
  onOpenAiForBlock,
  onSelectProduct,
  onOpenWhatsApp,
  deviceMode = 'desktop'
}) {
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Handle Drag Over
  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    setDragOverIndex(null);
    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (dataStr) {
        const data = JSON.parse(dataStr);
        if (data && data.blockType) {
          onAddBlockAtIndex?.(data.blockType, index, data.initialProps);
        }
      }
    } catch (err) {
      console.warn('Drop parse error:', err);
    }
  };

  const renderInnerCanvas = () => (
    <>
      {/* Zone de drop tout en haut */}
      <div
        onDragOver={(e) => handleDragOver(e, 0)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, 0)}
        className={`w-full py-1 transition-all ${
          dragOverIndex === 0 ? 'h-14 bg-emerald-500/20 border-2 border-dashed border-emerald-500 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs' : 'h-3 opacity-0 hover:opacity-100'
        }`}
      >
        {dragOverIndex === 0 && (
          <span className="flex items-center gap-1.5 animate-pulse">
            <Plus className="w-4 h-4" />
            <span>Déposer le bloc ici en haut</span>
          </span>
        )}
      </div>

      {/* Rendu des Blocs */}
      <div className="space-y-3 w-full">
        {blocks.map((block, idx) => {
          const isSelected = selectedBlockId === block.id;

          return (
            <React.Fragment key={block.id}>
              
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectBlock?.(block.id);
                }}
                className={`relative group/odoo rounded-2xl transition-all duration-200 cursor-pointer overflow-visible ${
                  isSelected
                    ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 shadow-xl'
                    : 'hover:ring-1 hover:ring-emerald-400/50'
                }`}
              >
                
                {/* Floating Toolbar on Hover & Selection */}
                <div className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-30 flex items-center gap-1 bg-[#16181D]/95 backdrop-blur-md p-1 rounded-2xl border border-slate-700 shadow-2xl transition-all ${
                  isSelected ? 'opacity-100 scale-100' : 'opacity-0 group-hover/odoo:opacity-100'
                }`}>
                  
                  {/* Modifier via IA */}
                  {(block.type === 'CustomAiBlock' || block.type === 'DynamicCode') && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenAiForBlock?.(block);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-[10px] font-black flex items-center gap-1 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
                      title="Modifier par IA"
                    >
                      <Bot className="w-3 h-3" />
                      <span>Modifier IA</span>
                    </button>
                  )}

                  {/* Monter */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveBlock?.(block.id, 'up');
                    }}
                    className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                    title="Monter ce bloc"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Descendre */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveBlock?.(block.id, 'down');
                    }}
                    className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                    title="Descendre ce bloc"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Dupliquer */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateBlock?.(block.id);
                    }}
                    className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                    title="Dupliquer ce bloc"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Supprimer */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBlock?.(block.id);
                    }}
                    className="p-1.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 cursor-pointer"
                    title="Supprimer ce bloc"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Badge Type de bloc en haut à gauche */}
                <div className={`absolute top-2 left-2 sm:top-3 sm:left-3 z-30 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-[10px] font-mono font-bold text-slate-300 border border-slate-700 pointer-events-none transition-opacity ${
                  isSelected ? 'opacity-100 text-emerald-400 border-emerald-500/50' : 'opacity-0 group-hover/odoo:opacity-100'
                }`}>
                  {block.type}
                </div>

                {/* Rendu du bloc avec InnerSnippetSlotContainer */}
                <div className="w-full overflow-hidden rounded-2xl">
                  <BlockRenderer
                    block={block}
                    shop={shop}
                    products={products}
                    themeId={themeId}
                    onSelectProduct={onSelectProduct}
                    onOpenWhatsApp={onOpenWhatsApp}
                    isMobilePreview={deviceMode === 'mobile'}
                    isEditMode={true}
                    selectedSnippetId={selectedSnippetId}
                    onSelectSnippet={onSelectSnippet}
                    onUpdateSnippet={onUpdateSnippet}
                    onRemoveSnippet={onRemoveSnippet}
                    onDuplicateSnippet={onDuplicateSnippet}
                    onMoveSnippet={onMoveSnippet}
                    onAddSnippet={onAddSnippet}
                    onUpdateBlockProps={onUpdateBlockProps}
                  />
                </div>

              </div>

              {/* Zone de drop intermédiaire */}
              <div
                onDragOver={(e) => handleDragOver(e, idx + 1)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, idx + 1)}
                className={`w-full py-1 transition-all ${
                  dragOverIndex === idx + 1 ? 'h-14 bg-emerald-500/20 border-2 border-dashed border-emerald-500 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs' : 'h-3 opacity-0 hover:opacity-100'
                }`}
              >
                {dragOverIndex === idx + 1 && (
                  <span className="flex items-center gap-1.5 animate-pulse">
                    <Plus className="w-4 h-4" />
                    <span>Insérer le bloc ici</span>
                  </span>
                )}
              </div>

            </React.Fragment>
          );
        })}
      </div>
    </>
  );

  if (deviceMode === 'mobile') {
    return (
      <div className="w-full flex items-center justify-center py-2 select-none">
        {/* Sur mobile natif : canvas pleine largeur sans châssis encombrant */}
        <div className="w-full md:hidden bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-slate-200/90 dark:border-slate-800 p-2 sm:p-4 transition-all">
          {renderInnerCanvas()}
        </div>

        {/* 📱 MOCKUP SMARTPHONE (Sur écran Desktop uniquement) */}
        <div className="hidden md:flex relative w-[385px] max-w-full h-[760px] max-h-[calc(100vh-140px)] rounded-[52px] bg-slate-950 p-[10px] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.7)] border-4 border-slate-700/80 ring-1 ring-white/10 transition-all duration-300 flex-col shrink-0">
          
          {/* Boutons latéraux physiques (Power & Volume) */}
          <div className="absolute -left-[7px] top-24 w-[3px] h-10 bg-slate-700 rounded-l-sm" />
          <div className="absolute -left-[7px] top-38 w-[3px] h-10 bg-slate-700 rounded-l-sm" />
          <div className="absolute -right-[7px] top-28 w-[3px] h-14 bg-slate-700 rounded-r-sm" />

          {/* Écran Smartphone */}
          <div className="relative w-full h-full rounded-[42px] bg-white dark:bg-slate-900 overflow-hidden flex flex-col flex-1">
            
            {/* Barre de Statut Supérieure avec Dynamic Island */}
            <div className="h-10 bg-white dark:bg-slate-900 w-full flex items-center justify-between px-6 pt-1 select-none shrink-0 z-30 border-b border-slate-100 dark:border-slate-800/40">
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 font-mono">09:41</span>
              
              {/* Dynamic Island Pill */}
              <div className="w-24 h-4 bg-black rounded-full flex items-center justify-end px-2 gap-1.5 shadow-inner">
                <div className="w-2 h-2 rounded-full bg-slate-800 ring-1 ring-slate-700" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
              </div>

              <div className="flex items-center gap-1 text-[10px] text-slate-800 dark:text-slate-200 font-bold">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Contenu Défilable Intérieur de l'Écran */}
            <div className="flex-1 h-full overflow-y-auto overflow-x-hidden p-2 sm:p-2.5 max-w-full overscroll-contain">
              {renderInnerCanvas()}
            </div>

            {/* Barre d'accueil Home Indicator Inférieure */}
            <div className="h-6 bg-white dark:bg-slate-900 w-full flex items-center justify-center shrink-0 z-30 border-t border-slate-100 dark:border-slate-800/40">
              <div className="w-32 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-slate-900 shadow-xl rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-2 sm:p-6 transition-all duration-300">
      {renderInnerCanvas()}
    </div>
  );
}
