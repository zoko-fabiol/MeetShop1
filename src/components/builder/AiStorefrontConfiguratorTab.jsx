import React, { useState } from 'react';
import { 
  Sparkles, 
  Bot, 
  Wand2, 
  CheckCircle2, 
  Loader2, 
  Check, 
  ShieldCheck, 
  RefreshCw, 
  ArrowRight, 
  ArrowLeft,
  Eye, 
  Smartphone, 
  Palette, 
  MessageSquare, 
  ChevronDown, 
  Layers, 
  Store, 
  Compass,
  RotateCcw,
  Zap,
  ShoppingBag,
  HeartHandshake,
  CheckSquare
} from 'lucide-react';
import { generateStorefrontWithMistral } from '../../services/mistralAiService';
import { THEME_PALETTES, THEME_PALETTES_LIST, getTheme } from '../../config/themes';
import { BLOCK_DESIGN_VARIANTS } from '../../config/blockDesignStyles';

const SITE_TYPES = [
  { id: 'ecommerce', label: 'un e-Commerce', desc: 'Ventes en ligne complètes, panier et catalogue produit' },
  { id: 'vitrine', label: 'une boutique vitrine', desc: 'Présentation de marque, histoire et prise de contact WhatsApp' },
  { id: 'destockage', label: 'un catalogue de déstockage', desc: 'Offres chocs, réductions immédiates et compte à rebours' },
  { id: 'exclusive', label: 'un magasin de marque exclusive', desc: 'Prestige, collections capsules et haute visibilité' }
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
  { id: 'whatsapp', label: 'Ventes directes et discussions WhatsApp', desc: 'Idéal pour le commerce au Cameroun et la conversion directe' },
  { id: 'quote', label: 'Collecte de devis et besoins sur-mesure', desc: 'Formulaire de demande et questionnaire interactif' },
  { id: 'store', label: 'Mise en avant du magasin physique et retraits', desc: 'Horaires, plan d\'accès et localisation GPS' },
  { id: 'flash', label: 'Promotions ciblées, déstockage et ventes flash', desc: 'Compte à rebours promotionnel et badges rabais' }
];

const ADVANTAGES_PRESETS = [
  'Livraison express < 2h à Douala & Yaoundé',
  'Paiement OM / MoMo à la livraison',
  'Produits 100% certifiés d\'origine',
  'Garantie 1 an avec SAV réactif',
  'Devis sur-mesure en moins de 15 minutes',
  'Meilleurs prix garantis au Cameroun'
];

export default function AiStorefrontConfiguratorTab({
  shop,
  themeId = 'emerald',
  onBackToStorefront,
  onApplyGeneratedLayout
}) {
  // Workflow Séquentiel Odoo : Étape courante (1 à 5)
  const [currentStep, setCurrentStep] = useState(1);

  // Valeurs du questionnaire Odoo
  const [siteType, setSiteType] = useState(SITE_TYPES[0].label);
  const [activity, setActivity] = useState(shop?.category || SECTORS_PRESETS[0]);
  const [isCustomActivity, setIsCustomActivity] = useState(false);
  const [customActivityText, setCustomActivityText] = useState('');
  
  const [positioning, setPositioning] = useState(POSITIONING_PRESETS[0].label);
  const [objective, setObjective] = useState(OBJECTIVES_PRESETS[0].label);
  
  const [selectedAdvantages, setSelectedAdvantages] = useState([
    'Livraison express < 2h à Douala & Yaoundé',
    'Paiement OM / MoMo à la livraison'
  ]);
  
  const [selectedDesignVariant, setSelectedDesignVariant] = useState('auto');
  const [selectedTheme, setSelectedTheme] = useState(() => shop?.layout_config?.theme || themeId || 'emerald');

  // Menus déroulants interactifs
  const [activeDropdown, setActiveDropdown] = useState(null);

  // État de génération IA
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhase, setGenerationPhase] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleAdvantage = (adv) => {
    setSelectedAdvantages(prev => 
      prev.includes(adv) ? prev.filter(a => a !== adv) : [...prev, adv]
    );
  };

  const handleLaunchGeneration = async () => {
    setIsGenerating(true);
    setErrorMsg('');
    setGenerationPhase('Analyse de votre secteur & positionnement...');

    const finalActivity = isCustomActivity && customActivityText.trim() 
      ? customActivityText.trim() 
      : activity;

    const generationPayload = {
      siteType,
      activity: finalActivity,
      positioning,
      objective,
      advantages: selectedAdvantages,
      designVariant: selectedDesignVariant,
      theme: selectedTheme,
      shopName: shop?.name || 'Ma Boutique MeetShop',
      shopCity: shop?.city || 'Douala',
      shopPhone: shop?.phone || '+237699123456'
    };

    try {
      setTimeout(() => setGenerationPhase('Sélection des 7 blocs modulaires optimaux...'), 1200);
      setTimeout(() => setGenerationPhase('Rédaction des accroches marketing & garanties...'), 2400);
      setTimeout(() => setGenerationPhase('Harmonisation des palettes & typographies Odoo...'), 3600);

      const result = await generateStorefrontWithMistral(generationPayload);

      if (result && result.blocks && result.blocks.length > 0) {
        setGeneratedResult(result);
        setIsSuccess(true);
      } else {
        throw new Error('Résultat de vitrine incomplet');
      }
    } catch (err) {
      console.error('Erreur génération IA:', err);
      setErrorMsg('Erreur lors de la génération. Le modèle de secours a été préparé.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (generatedResult) {
      onApplyGeneratedLayout?.(generatedResult);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D13] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* ──── BARRE SUPÉRIEURE ÉPURÉE ──── */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#12151D]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToStorefront}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Retour à la boutique</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-md shadow-emerald-500/20">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black tracking-tight flex items-center gap-2">
                <span>Configurateur Intelligent de Vitrine</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-bold border border-emerald-500/30">
                  MISTRAL AI
                </span>
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setCurrentStep(1);
              setIsSuccess(false);
              setGeneratedResult(null);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Réinitialiser le configurateur"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Recommencer</span>
          </button>
        </div>
      </header>

      {/* ──── CORPS PRINCIPAL DU CONFIGURATEUR ──── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* ÉCRAN DE SUCCÈS APRÈS GÉNÉRATION */}
        {isSuccess && generatedResult ? (
          <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#161922] border border-emerald-500/40 shadow-2xl space-y-6 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Vitrine Intelligente Générée avec Succès !
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                L'IA a combiné <strong className="text-emerald-500">{generatedResult.blocks?.length || 7} blocs modulaires</strong> haute conversion avec vos arguments forts et le thème assorti.
              </p>
            </div>

            {/* Aperçu des blocs créés */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-left">
              {generatedResult.blocks?.map((b, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <span className="text-[10px] text-emerald-500 font-mono font-bold block">Bloc {idx + 1}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{b.type}</span>
                </div>
              ))}
            </div>

            {/* Actions finales */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={handleApply}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-sm shadow-xl shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-5 h-5" />
                <span>Appliquer cette vitrine à ma boutique</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  handleLaunchGeneration();
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Régénérer une autre variante</span>
              </button>
            </div>
          </div>
        ) : isGenerating ? (
          /* ÉCRAN DE CHARGEMENT IA */
          <div className="p-8 sm:p-16 rounded-3xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6 animate-pulse">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
              <div className="absolute inset-2 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Bot className="w-8 h-8 animate-bounce" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Génération de votre Vitrine en Cours...
              </h2>
              <p className="text-xs sm:text-sm font-mono text-emerald-600 dark:text-emerald-400">
                {generationPhase}
              </p>
            </div>
          </div>
        ) : (
          /* WORKFLOW SÉQUENTIEL ODOO PAS-À-PAS */
          <div className="space-y-8">
            
            {/* Titre & Progression */}
            <div className="text-center space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Configurateur Interactif Odoo
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Définissez votre vision avec précision
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                Chaque réponse guide l'intelligence artificielle pour concevoir une boutique taillée pour votre activité.
              </p>
            </div>

            {/* ═══════════════════════════════════════════════════════
                PHRASE INTERACTIVE SÉQUENTIELLE ODOO À LIGNES ANIMÉES
               ═══════════════════════════════════════════════════════ */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
              
              {/* Ligne 1 : Type de site */}
              <div className="flex flex-wrap items-center gap-2.5 text-base sm:text-xl font-bold text-slate-800 dark:text-slate-200">
                <span className="shrink-0">Je veux</span>
                
                <div className="relative inline-block">
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(activeDropdown === 'siteType' ? null : 'siteType')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-500/50 font-black text-sm sm:text-lg transition-all cursor-pointer"
                  >
                    <span>{siteType}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Popover Choix Type de Site */}
                  {activeDropdown === 'siteType' && (
                    <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-[#1D212C] border border-slate-200 dark:border-slate-700 shadow-2xl p-2 z-50 space-y-1">
                      {SITE_TYPES.map((st) => (
                        <div
                          key={st.id}
                          onClick={() => {
                            setSiteType(st.label);
                            setActiveDropdown(null);
                            if (currentStep < 2) setCurrentStep(2);
                          }}
                          className={`p-2.5 rounded-xl cursor-pointer transition-all ${
                            siteType === st.label
                              ? 'bg-emerald-600 text-white font-bold'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="block text-xs sm:text-sm font-bold">{st.label}</span>
                          <span className="text-[10px] opacity-80 block">{st.desc}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <span className="shrink-0">pour mon business de</span>
              </div>

              {/* Ligne Connectrice Odoo */}
              <div className="relative pl-4 border-l-2 border-dashed border-emerald-400/60 dark:border-emerald-500/40 ml-4 py-1 space-y-6">
                
                {/* Ligne 2 : Secteur d'activité */}
                <div className="flex flex-wrap items-center gap-2.5 text-base sm:text-xl font-bold text-slate-800 dark:text-slate-200">
                  <div className="relative inline-block">
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(activeDropdown === 'activity' ? null : 'activity')}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-500/50 font-black text-sm sm:text-lg transition-all cursor-pointer"
                    >
                      <span>{isCustomActivity ? customActivityText || 'Secteur personnalisé' : activity}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* Popover Choix Secteur */}
                    {activeDropdown === 'activity' && (
                      <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-[#1D212C] border border-slate-200 dark:border-slate-700 shadow-2xl p-2 z-50 space-y-1">
                        {SECTORS_PRESETS.map((sec) => (
                          <div
                            key={sec}
                            onClick={() => {
                              setActivity(sec);
                              setIsCustomActivity(false);
                              setActiveDropdown(null);
                              if (currentStep < 3) setCurrentStep(3);
                            }}
                            className={`p-2.5 rounded-xl cursor-pointer text-xs sm:text-sm font-bold transition-all ${
                              activity === sec && !isCustomActivity
                                ? 'bg-emerald-600 text-white'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {sec}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <span className="shrink-0">, avec un positionnement</span>
                </div>

                {/* Ligne 3 : Positionnement */}
                <div className="flex flex-wrap items-center gap-2.5 text-base sm:text-xl font-bold text-slate-800 dark:text-slate-200">
                  <div className="relative inline-block">
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(activeDropdown === 'positioning' ? null : 'positioning')}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-500/50 font-black text-sm sm:text-lg transition-all cursor-pointer"
                    >
                      <span>{positioning}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* Popover Choix Positionnement */}
                    {activeDropdown === 'positioning' && (
                      <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-[#1D212C] border border-slate-200 dark:border-slate-700 shadow-2xl p-2 z-50 space-y-1">
                        {POSITIONING_PRESETS.map((pos) => (
                          <div
                            key={pos.id}
                            onClick={() => {
                              setPositioning(pos.label);
                              setActiveDropdown(null);
                              if (currentStep < 4) setCurrentStep(4);
                            }}
                            className={`p-2.5 rounded-xl cursor-pointer transition-all ${
                              positioning === pos.label
                                ? 'bg-emerald-600 text-white font-bold'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span className="block text-xs sm:text-sm font-bold">{pos.label}</span>
                            <span className="text-[10px] opacity-80 block">{pos.desc}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <span className="shrink-0">et un objectif prioritaire de</span>
                </div>

                {/* Ligne 4 : Objectif Commercial */}
                <div className="flex flex-wrap items-center gap-2.5 text-base sm:text-xl font-bold text-slate-800 dark:text-slate-200">
                  <div className="relative inline-block">
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(activeDropdown === 'objective' ? null : 'objective')}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-500/50 font-black text-sm sm:text-lg transition-all cursor-pointer"
                    >
                      <span>{objective}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* Popover Choix Objectif */}
                    {activeDropdown === 'objective' && (
                      <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-[#1D212C] border border-slate-200 dark:border-slate-700 shadow-2xl p-2 z-50 space-y-1">
                        {OBJECTIVES_PRESETS.map((obj) => (
                          <div
                            key={obj.id}
                            onClick={() => {
                              setObjective(obj.label);
                              setActiveDropdown(null);
                              if (currentStep < 5) setCurrentStep(5);
                            }}
                            className={`p-2.5 rounded-xl cursor-pointer transition-all ${
                              objective === obj.label
                                ? 'bg-emerald-600 text-white font-bold'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span className="block text-xs sm:text-sm font-bold">{obj.label}</span>
                            <span className="text-[10px] opacity-80 block">{obj.desc}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <span>.</span>
                </div>

              </div>

            </div>

            {/* ═══════════════════════════════════════════════════════
                SECTION 2 : PALETTE DE COULEURS & POINTS FORTS
               ═══════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Palette Chromatique */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-emerald-500" />
                    <span>Palette de Couleurs</span>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-500 font-bold capitalize">
                    {getTheme(selectedTheme)?.name || 'Émeraude'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(THEME_PALETTES_LIST || Object.values(THEME_PALETTES)).map((pal) => {
                    const isCur = selectedTheme === pal.id;
                    return (
                      <button
                        key={pal.id}
                        type="button"
                        onClick={() => setSelectedTheme(pal.id)}
                        className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                          isCur 
                            ? 'border-emerald-500 bg-emerald-500/10 shadow-md ring-2 ring-emerald-500/40' 
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                        }`}
                      >
                        <span 
                          className="w-5 h-5 rounded-full shadow-inner block"
                          style={{ backgroundColor: pal.hex || pal.color || '#16a34a' }}
                        />
                        <span className="text-[11px] font-bold truncate max-w-full">{pal.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Atouts & Points Forts Cochables */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Arguments de Réassurance</span>
                </span>

                <div className="flex flex-wrap gap-2">
                  {ADVANTAGES_PRESETS.map((adv) => {
                    const isChecked = selectedAdvantages.includes(adv);
                    return (
                      <button
                        key={adv}
                        type="button"
                        onClick={() => toggleAdvantage(adv)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isChecked
                            ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-800 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                        <span>{adv}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* ═══════════════════════════════════════════════════════
                SECTION 3 : SÉLECTEUR VISUEL DES 16 UNIVERS DE DESIGN
               ═══════════════════════════════════════════════════════ */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>Univers Graphique (16 Styles Disponibles)</span>
                </span>

                {selectedDesignVariant !== 'auto' && (
                  <button
                    type="button"
                    onClick={() => setSelectedDesignVariant('auto')}
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    Laisser l'IA choisir automatiquement
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto pr-1">
                {/* Option Recommandée Automatique */}
                <button
                  type="button"
                  onClick={() => setSelectedDesignVariant('auto')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedDesignVariant === 'auto'
                      ? 'border-emerald-500 bg-emerald-500/15 shadow-md ring-2 ring-emerald-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">Auto (Recommandé)</span>
                  <span className="text-[10px] text-slate-500 block truncate">L'IA choisit le style parfait</span>
                </button>

                {/* 16 Variantes */}
                {BLOCK_DESIGN_VARIANTS.map((dv) => {
                  const isCur = selectedDesignVariant === dv.id;
                  return (
                    <button
                      key={dv.id}
                      type="button"
                      onClick={() => setSelectedDesignVariant(dv.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isCur
                          ? 'border-emerald-500 bg-emerald-500/15 shadow-md ring-2 ring-emerald-500/30'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200 block truncate">{dv.name}</span>
                      <span className="text-[10px] text-slate-500 block truncate">{dv.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════
                BARRE D'ACTION INFÉRIEURE : BOUTON MAGIQUE IA
               ═══════════════════════════════════════════════════════ */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
                <span>Prêt à propulser votre boutique ? Cliquez sur le bouton pour lancer le raisonnement IA.</span>
              </div>

              <button
                type="button"
                onClick={handleLaunchGeneration}
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-sm shadow-2xl shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Wand2 className="w-5 h-5 animate-pulse" />
                <span>Générer ma Vitrine avec Mistral IA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
