import React, { useState } from 'react';
import { 
  X, 
  Bot, 
  Sparkles, 
  Send, 
  Loader2, 
  Check, 
  RotateCcw, 
  Layout, 
  Layers, 
  Zap, 
  ShieldCheck, 
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { getTheme } from '../../config/themes';
import { modifyCustomBlockWithMistral } from '../../services/mistralAiService';

const SUGGESTIONS = [
  "Rendre les titres plus percutants et axés sur la livraison en 2h",
  "Ajouter un badge 'Offre Exclusive' et une réduction de 20%",
  "Ajouter une carte supplémentaire avec contact WhatsApp direct",
  "Simplifier les textes pour une lecture mobile ultra-rapide",
  "Passer la présentation en style Luxe & Prestige"
];

export default function AiBlockModifierModal({
  block,
  shop,
  themeId = 'emerald',
  isOpen,
  onClose,
  onApplyModification
}) {
  const theme = getTheme(themeId);
  const [promptText, setPromptText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewBlock, setPreviewBlock] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !block) return null;

  const currentProps = block.props || {};
  const currentStructure = currentProps.structure || {};

  const handleGenerate = async (textToUse) => {
    const finalPrompt = textToUse || promptText;
    if (!finalPrompt.trim()) {
      setErrorMsg('Veuillez décrire la modification souhaitée.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg('');

    try {
      const updated = await modifyCustomBlockWithMistral({
        block,
        promptText: finalPrompt,
        shop,
        themeId
      });
      setPreviewBlock(updated);
    } catch (err) {
      console.error('Erreur de modification IA:', err);
      setErrorMsg('Impossible de modifier le bloc via l\'IA pour le moment.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (previewBlock) {
      onApplyModification(block.id, previewBlock);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-md shadow-emerald-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  Copilote IA : Modifier ce Bloc
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Mistral AI
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Donnez vos consignes et l'IA réécrit et adapte le bloc sur-mesure
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* Bloc Actuel Résumé */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Bloc en cours d'édition
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                {currentProps.name || 'Création IA'}
              </span>
            </div>
            <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
              {currentStructure.title || currentProps.title || 'Titre du bloc'}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
              {currentStructure.subtitle || currentProps.subtitle || 'Sous-titre actuel'}
            </p>
          </div>

          {/* Saisie de consigne libre */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Que souhaitez-vous modifier sur ce bloc ?
            </label>
            <textarea
              rows={3}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Ex: Change le titre pour 'Sélection Exclusivité', ajoute une mention 'Garantie Satisfait ou Remboursé' et modifie les cartes pour mettre en valeur nos remises..."
              className={`w-full p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${theme.inputFocus}`}
            />
          </div>

          {/* Suggestions de modifications rapides */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>Idées de modifications rapides :</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((sug, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => {
                    setPromptText(sug);
                    handleGenerate(sug);
                  }}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-medium bg-slate-100 dark:bg-slate-800/80 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-300 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 transition-all text-left"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-500 font-bold bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
              {errorMsg}
            </p>
          )}

          {/* Prévisualisation des modifications */}
          {previewBlock && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Nouvelle Version Conçue par Mistral :</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  Prêt à appliquer
                </span>
              </div>
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                {previewBlock.props?.structure?.title || previewBlock.props?.title}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                {previewBlock.props?.structure?.subtitle || previewBlock.props?.subtitle}
              </p>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 bg-white dark:bg-slate-900 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Annuler
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isGenerating || !promptText.trim()}
              onClick={() => handleGenerate(promptText)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                  <span>Raisonnement IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Regénérer / Modifier</span>
                </>
              )}
            </button>

            {previewBlock && (
              <button
                type="button"
                onClick={handleApply}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all ${theme.btnPrimary}`}
              >
                <Check className="w-4 h-4" />
                <span>Appliquer au Bloc</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
