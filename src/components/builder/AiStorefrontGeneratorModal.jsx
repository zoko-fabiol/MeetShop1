import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Bot, 
  Wand2, 
  CheckCircle2, 
  Loader2, 
  Check, 
  ShieldCheck, 
  ImageIcon,
  RefreshCw,
  ExternalLink,
  ArrowRight,
  Eye,
  Sliders,
  Smartphone,
  Shirt,
  Sparkle,
  Footprints,
  Apple,
  Tv,
  Watch,
  Package,
  Zap,
  CreditCard,
  FileText,
  DollarSign,
  Palette,
  MessageSquare,
  ChevronDown,
  Layers,
  Store,
  Compass
} from 'lucide-react';
import { generateStorefrontWithMistral } from '../../services/mistralAiService';
import { THEME_PALETTES, getTheme } from '../../config/themes';
import { BLOCK_DESIGN_VARIANTS } from '../../config/blockDesignStyles';

const SITE_TYPES = [
  'un e-Commerce',
  'une boutique vitrine',
  'un catalogue de déstockage',
  'un magasin de marque exclusive'
];

const SECTORS_PRESETS = [
  'Smartphones & High-Tech',
  'Prêt-à-porter & Mode',
  'Beauté, Parfums & Cosmétiques',
  'Chaussures & Sneakers',
  'Épicerie fine & Produits bio',
  'Bijoux, Montres & Joaillerie',
  'Électroménager & Décoration maison',
  'Grossiste & Import Direct'
];

const POSITIONING_PRESETS = [
  { id: 'luxe', label: 'Luxe & Prestige', desc: 'Raffiné, épuré, haute couture' },
  { id: 'tendance', label: 'Tendance & Streetwear', desc: 'Moderne, vibrant, jeune' },
  { id: 'tech', label: 'Cyber & High-Tech', desc: 'Futuriste, néon, dynamique' },
  { id: 'eco', label: 'Éco-responsable & Bio', desc: 'Naturel, authentique, bien-être' },
  { id: 'artisanat', label: 'Artisanat Local & Terroir', desc: 'Fait-main, chaleureux, héritage' },
  { id: 'discount', label: 'Discount & Bonnes Affaires', desc: 'Promos, offres chocs, direct usine' },
  { id: 'minimaliste', label: 'Minimaliste & Contemporain', desc: 'Élégant, fonctionnel, centré produit' }
];

const OBJECTIVES_PRESETS = [
  'Ventes directes et discussions WhatsApp',
  'Collecte de devis et besoins sur-mesure via questionnaire',
  'Mise en avant du magasin physique et des retraits',
  'Promotions ciblées, déstockage et ventes flash'
];

const ADVANTAGES_PRESETS = [
  'Livraison express < 2h à Douala & Yaoundé',
  'Paiement OM / MoMo à la livraison',
  'Produits 100% certifiés d\'origine',
  'Garantie 1 an avec SAV réactif',
  'Devis sur-mesure en moins de 15 minutes',
  'Meilleurs prix garantis au Cameroun'
];

export default function AiStorefrontGeneratorModal({ 
  isOpen, 
  onClose, 
  shop, 
  onApplyGeneratedLayout,
  onPreviewPublic,
  onSaveLayout
}) {
  // Phrase interactive Odoo State
  const [siteType, setSiteType] = useState(SITE_TYPES[0]);
  const [activity, setActivity] = useState(shop?.category || SECTORS_PRESETS[0]);
  const [isCustomActivity, setIsCustomActivity] = useState(false);
  const [customActivityText, setCustomActivityText] = useState('');
  
  const [positioning, setPositioning] = useState(POSITIONING_PRESETS[0].label);
  const [objective, setObjective] = useState(OBJECTIVES_PRESETS[0]);
  const [selectedAdvantages, setSelectedAdvantages] = useState([
    'Livraison express < 2h à Douala & Yaoundé',
    'Paiement OM / MoMo à la livraison'
  ]);
  
  // Style de Design parmi les 16 univers : 'auto' ou id précis (ex: 'luxury_editorial', 'cyber_tech_dark'...)
  const [selectedDesignVariant, setSelectedDesignVariant] = useState('auto');

  // Palette de couleur (préserve le thème actuel de la boutique par défaut)
  const [selectedTheme, setSelectedTheme] = useState(() => shop?.layout_config?.theme || 'emerald');

  // Menus déroulants interactifs
  const [activeDropdown, setActiveDropdown] = useState(null); // 'siteType' | 'activity' | 'positioning' | 'objective'

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhase, setGenerationPhase] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const currentThemeObj = getTheme(selectedTheme);

  const toggleAdvantage = (advLabel) => {
    setSelectedAdvantages(prev => 
      prev.includes(advLabel) ? prev.filter(a => a !== advLabel) : [...prev, advLabel]
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setIsSuccess(false);
    setErrorMsg('');
    setActiveDropdown(null);
    setGenerationPhase('Analyse du positionnement et du profil commercial...');

    let t1, t2, t3;
    const finalActivity = isCustomActivity && customActivityText.trim() ? customActivityText.trim() : (activity || 'Commerce Général');

    try {
      t1 = setTimeout(() => setGenerationPhase('Raisonnement Mistral AI sur les 16 styles et contenus intérieurs...'), 900);
      t2 = setTimeout(() => setGenerationPhase('Composition des blocs standards et insertion des snippets Odoo...'), 1800);
      t3 = setTimeout(() => setGenerationPhase('Harmonisation des couleurs de textes et contrastes visuels...'), 2600);

      const generatedLayout = await generateStorefrontWithMistral({
        shop,
        answers: {
          siteType,
          activity: finalActivity,
          positioning,
          advantages: selectedAdvantages.join(', '),
          style: selectedTheme,
          objective,
          designVariant: selectedDesignVariant !== 'auto' ? selectedDesignVariant : undefined
        }
      });

      if (!generatedLayout || !Array.isArray(generatedLayout.blocks)) {
        throw new Error('Format de vitrine invalide');
      }

      // Verrouillage de la palette sélectionnée
      generatedLayout.theme = selectedTheme;

      setGeneratedResult(generatedLayout);
      setIsGenerating(false);
      setIsSuccess(true);

    } catch (err) {
      console.error('Erreur génération vitrine IA:', err);
      setErrorMsg('Une erreur est survenue lors de la réflexion IA. Veuillez réessayer.');
      setIsGenerating(false);
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    }
  };

  const handleApplyAndEdit = async () => {
    const result = generatedResult;
    setIsSuccess(false);
    onClose();
    if (result) {
      onApplyGeneratedLayout(result);
      if (onSaveLayout) {
        await onSaveLayout(result);
      }
    }
  };

  const handleApplyAndVisit = async () => {
    const result = generatedResult;
    setIsSuccess(false);
    onClose();
    if (result) {
      onApplyGeneratedLayout(result);
      if (onSaveLayout) {
        await onSaveLayout(result);
      }
      if (onPreviewPublic) {
        setTimeout(() => onPreviewPublic(result), 300);
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
      onClick={() => setActiveDropdown(null)}
    >
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Modal */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${currentThemeObj.badge} shadow-sm`}>
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">
                  Configurateur Intelligent de Vitrine
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono text-[10px] font-bold">
                  MISTRAL AI
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Définissez votre vision avec précision : l'IA raisonne et imagine un design unique pour votre boutique.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps de la Modal */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-6">

          {/* 🌟 ÉCRAN DE SUCCÈS APRÈS GÉNÉRATION */}
          {isSuccess && generatedResult ? (
            <div className="py-2 space-y-5 animate-fadeIn">
              
              <div className="text-center space-y-2">
                <div className={`w-14 h-14 rounded-2xl ${currentThemeObj.badge} flex items-center justify-center mx-auto shadow-lg`}>
                  <Sparkles className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">
                  Vitrine Unique Conçue par Mistral AI !
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
                  Votre identité visuelle personnalisée a été générée selon le positionnement <strong>{positioning}</strong> avec la palette <strong>{currentThemeObj.name}</strong>.
                </p>
              </div>

              {/* Récapitulatif des blocs créés */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-500" />
                    <span>Composition de votre vitrine ({generatedResult.blocks?.length} blocs)</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg border ${currentThemeObj.badge} text-[10px]`}>
                    Thème {currentThemeObj.name.split(' (')[0]}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {generatedResult.blocks?.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{b.type}</span>
                      {b.props?.styleVariant && (
                        <span className="text-[10px] text-slate-400 font-mono ml-auto truncate">
                          {b.props.styleVariant}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Boutons d'application */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleApplyAndEdit}
                  className="py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Appliquer & Personnaliser</span>
                </button>

                <button
                  type="button"
                  onClick={handleApplyAndVisit}
                  className={`py-3 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all ${currentThemeObj.btnPrimary}`}
                >
                  <Eye className="w-4 h-4" />
                  <span>Appliquer & Voir la Boutique</span>
                </button>
              </div>

            </div>
          ) : isGenerating ? (
            /* ⏳ ÉCRAN DE CHARGEMENT ANIMÉ */
            <div className="py-14 text-center space-y-6 animate-fadeIn">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className={`absolute inset-0 rounded-full ${currentThemeObj.accentBg} opacity-20 animate-ping`} />
                <div className={`w-16 h-16 rounded-3xl ${currentThemeObj.badge} border flex items-center justify-center shadow-2xl relative z-10 animate-bounce`}>
                  <Bot className="w-8 h-8" />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Mistral AI conçoit votre vitrine sur-mesure...
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium animate-pulse max-w-md mx-auto">
                  {generationPhase || 'Réflexion architecturale en cours...'}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                <span>Respect de la palette {currentThemeObj.name} et absence de doublons</span>
              </div>
            </div>
          ) : (
            /* 📝 CONFIGURATEUR INTERACTIF EN PHRASE NATURELLE (STYLE ODOO) */
            <div className="space-y-6">

              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 🎯 LA PHRASE INTERACTIVE (ODOO STYLE MAD-LIBS) */}
              <div className="p-5 sm:p-7 rounded-3xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-base sm:text-lg leading-loose font-normal shadow-inner relative">
                
                <span>Je veux </span>
                
                {/* 1. Type de site */}
                <span className="relative inline-block my-1">
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(activeDropdown === 'siteType' ? null : 'siteType')}
                    className={`font-black underline decoration-2 underline-offset-4 decoration-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 px-1 py-0.5 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15 transition-all inline-flex items-center gap-1`}
                  >
                    <span>{siteType}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                  </button>

                  {activeDropdown === 'siteType' && (
                    <div className="absolute left-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-1.5 shadow-2xl z-[100] space-y-1 text-xs font-bold text-slate-900 dark:text-white animate-fadeIn max-h-72 overflow-y-auto">
                      {SITE_TYPES.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => { setSiteType(t); setActiveDropdown(null); }}
                          className={`w-full text-left p-2 rounded-xl transition-colors ${siteType === t ? 'bg-emerald-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </span>

                <span> pour mon business de </span>

                {/* 2. Secteur / Activité */}
                <span className="relative inline-block my-1">
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(activeDropdown === 'activity' ? null : 'activity')}
                    className={`font-black underline decoration-2 underline-offset-4 decoration-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 px-1 py-0.5 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15 transition-all inline-flex items-center gap-1`}
                  >
                    <span>{isCustomActivity ? (customActivityText || 'Saisie personnalisée...') : activity}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                  </button>

                  {activeDropdown === 'activity' && (
                    <div className="absolute left-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 shadow-2xl z-[100] space-y-1 text-xs font-bold text-slate-900 dark:text-white animate-fadeIn max-h-72 overflow-y-auto">
                      {SECTORS_PRESETS.map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => { setActivity(sec); setIsCustomActivity(false); setActiveDropdown(null); }}
                          className={`w-full text-left p-2 rounded-xl transition-colors ${!isCustomActivity && activity === sec ? 'bg-emerald-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                          {sec}
                        </button>
                      ))}
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => { setIsCustomActivity(true); }}
                          className="w-full text-left p-2 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                        >
                          + Autre spécialité sur-mesure...
                        </button>
                      </div>
                    </div>
                  )}
                </span>

                {isCustomActivity && (
                  <div className="my-2">
                    <input
                      type="text"
                      value={customActivityText}
                      onChange={(e) => setCustomActivityText(e.target.value)}
                      placeholder="Précisez votre activité (ex: Vente de Perruques HD, Sneakers de collection...)"
                      className={`w-full p-2.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none ${currentThemeObj.inputFocus}`}
                      autoFocus
                    />
                  </div>
                )}

                <span>, avec un positionnement </span>

                {/* 3. Positionnement (Luxe, Eco, Tech, etc.) */}
                <span className="relative inline-block my-1">
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(activeDropdown === 'positioning' ? null : 'positioning')}
                    className={`font-black underline decoration-2 underline-offset-4 decoration-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 px-1 py-0.5 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15 transition-all inline-flex items-center gap-1`}
                  >
                    <span>{positioning}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                  </button>

                  {activeDropdown === 'positioning' && (
                    <div className="absolute left-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 shadow-2xl z-[100] space-y-1 text-xs text-slate-900 dark:text-white animate-fadeIn max-h-72 overflow-y-auto">
                      {POSITIONING_PRESETS.map((pos) => (
                        <button
                          key={pos.id}
                          type="button"
                          onClick={() => { setPositioning(pos.label); setActiveDropdown(null); }}
                          className={`w-full text-left p-2.5 rounded-xl transition-colors ${positioning === pos.label ? 'bg-emerald-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                          <div className="font-bold">{pos.label}</div>
                          <div className={`text-[10px] ${positioning === pos.label ? 'text-emerald-100' : 'text-slate-400'}`}>
                            {pos.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </span>

                <span> et un objectif prioritaire de </span>

                {/* 4. Objectif Commercial */}
                <span className="relative inline-block my-1">
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(activeDropdown === 'objective' ? null : 'objective')}
                    className={`font-black underline decoration-2 underline-offset-4 decoration-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 px-1 py-0.5 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15 transition-all inline-flex items-center gap-1`}
                  >
                    <span>{objective}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                  </button>

                  {activeDropdown === 'objective' && (
                    <div className="absolute left-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 shadow-2xl z-[100] space-y-1 text-xs text-slate-900 dark:text-white animate-fadeIn max-h-72 overflow-y-auto">
                      {OBJECTIVES_PRESETS.map((obj) => (
                        <button
                          key={obj}
                          type="button"
                          onClick={() => { setObjective(obj); setActiveDropdown(null); }}
                          className={`w-full text-left p-2.5 rounded-xl transition-colors font-bold ${objective === obj ? 'bg-emerald-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                          {obj}
                        </button>
                      ))}
                    </div>
                  )}
                </span>
                <span>.</span>

              </div>

              {/* 🎨 PALETTE DE COULEURS DE LA BOUTIQUE (Strictement Préservée) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Palette de Couleurs Imposée</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {currentThemeObj.name}
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {Object.values(THEME_PALETTES).map((pal) => {
                    const isSelected = selectedTheme === pal.id;
                    return (
                      <button
                        key={pal.id}
                        type="button"
                        onClick={() => setSelectedTheme(pal.id)}
                        className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center gap-1.5 text-center ${
                          isSelected 
                            ? 'border-emerald-500 ring-2 ring-emerald-500/50 bg-emerald-500/10 shadow-md scale-105' 
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-slate-300'
                        }`}
                      >
                        <span 
                          className="w-5 h-5 rounded-full shadow-sm" 
                          style={{ backgroundColor: pal.hex }} 
                        />
                        <span className="text-[10px] font-bold text-slate-900 dark:text-white truncate max-w-full">
                          {pal.name.split(' (')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ⚡ POINTS FORTS & ATOUTS COMMERCIAUX */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Atouts & Arguments de Réassurance (sélectionnez vos points forts)</span>
                </label>

                <div className="flex flex-wrap gap-2">
                  {ADVANTAGES_PRESETS.map((adv) => {
                    const isChecked = selectedAdvantages.includes(adv);
                    return (
                      <button
                        key={adv}
                        type="button"
                        onClick={() => toggleAdvantage(adv)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isChecked 
                            ? `${currentThemeObj.badge} border shadow-sm scale-[1.02]` 
                            : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 text-emerald-500" />}
                        <span>{adv}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 🌟 STYLE DE DESIGN (16 UNIVERS VISUELS ODOO) */}
              <div className="space-y-2.5 p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Style de Design Imposé (16 Univers Disponibles)</span>
                  </label>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${currentThemeObj.badge}`}>
                    {selectedDesignVariant === 'auto' ? 'Sélection Auto par l\'IA' : selectedDesignVariant}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 max-h-48 overflow-y-auto pr-1">
                  {/* Option Auto */}
                  <button
                    type="button"
                    onClick={() => setSelectedDesignVariant('auto')}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      selectedDesignVariant === 'auto'
                        ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-white dark:bg-slate-900 shadow-md font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-black text-slate-900 dark:text-white block">Auto (Recommandé)</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">L'IA choisit le meilleur style selon votre secteur</span>
                    </div>
                    {selectedDesignVariant === 'auto' && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />}
                  </button>

                  {/* 16 Variantes */}
                  {BLOCK_DESIGN_VARIANTS.map((dv) => {
                    const isSelected = selectedDesignVariant === dv.id;
                    return (
                      <button
                        key={dv.id}
                        type="button"
                        onClick={() => setSelectedDesignVariant(dv.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-white dark:bg-slate-900 shadow-md font-bold'
                            : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 hover:border-slate-300'
                        }`}
                      >
                        <div className="truncate pr-1">
                          <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">{dv.name}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">{dv.desc}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* BOUTON DE LANCEMENT MISTRAL */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleGenerate}
                  className={`w-full py-4 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 shadow-xl hover:shadow-emerald-500/25 active:scale-[0.99] transition-all ${currentThemeObj.btnPrimary}`}
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Laisser Mistral concevoir ma vitrine sur-mesure</span>
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-2">
                  L'IA adapte l'agencement, les variantes de blocs et les questions sans doublons de design.
                </p>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
