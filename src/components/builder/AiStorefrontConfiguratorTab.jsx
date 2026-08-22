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
  CheckSquare,
  Flame,
  Star,
  Award,
  Clock,
  MapPin,
  TrendingUp,
  Sliders,
  Feather
} from 'lucide-react';
import { generateStorefrontWithMistral } from '../../services/mistralAiService';
import { THEME_PALETTES, THEME_PALETTES_LIST, getTheme } from '../../config/themes';
import { BLOCK_DESIGN_VARIANTS } from '../../config/blockDesignStyles';
import { AVATAR_SHAPES, BUTTON_STYLES } from '../../config/snippetShapes';

const SITE_TYPES = [
  { 
    id: 'ecommerce', 
    title: 'e-Commerce Complet', 
    badge: 'Ventes & Panier',
    desc: 'Boutique en ligne avec catalogue complet, panier multi-articles et paiement direct.' 
  },
  { 
    id: 'vitrine', 
    title: 'Boutique Vitrine Exclusive', 
    badge: 'Prestige & Contact',
    desc: 'Présentation soignée de marque, histoire, galerie de réalisations et relation WhatsApp.' 
  },
  { 
    id: 'destockage', 
    title: 'Catalogue Déstockage & Flash', 
    badge: 'Offres Chocs',
    desc: 'Ventes flash avec compte à rebours, remises immédiates et déstockage express.' 
  },
  { 
    id: 'exclusive', 
    title: 'Boutique de Marque Capsule', 
    badge: 'Luxe & Rareté',
    desc: 'Mise en avant de collections limitées, éditions rares et réservation prioritaire.' 
  }
];

const SECTORS_PRESETS = [
  { id: 'hightech', label: 'Smartphones & High-Tech', icon: Smartphone, tag: 'High-Tech' },
  { id: 'fashion', label: 'Prêt-à-porter & Mode', icon: ShoppingBag, tag: 'Mode' },
  { id: 'beauty', label: 'Beauté, Parfums & Cosmétiques', icon: Sparkles, tag: 'Cosmétiques' },
  { id: 'sneakers', label: 'Chaussures & Sneakers', icon: Flame, tag: 'Chaussures' },
  { id: 'food', label: 'Épicerie fine & Produits bio', icon: Feather, tag: 'Alimentation' },
  { id: 'jewelry', label: 'Bijoux, Montres & Joaillerie', icon: Award, tag: 'Luxe' },
  { id: 'home', label: 'Électroménager & Décoration', icon: Store, tag: 'Maison' },
  { id: 'wholesale', label: 'Grossiste & Import Direct', icon: Layers, tag: 'B2B Grossiste' }
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

const ADVANTAGES_PRESETS = [
  'Livraison Express < 2h sur Douala & Yaoundé',
  'Paiement à la livraison (Espèces, OM, MoMo)',
  'Articles 100% Originaux et Certifiés',
  'Service Après-Vente Réactif & Dédié',
  'Stock Réellement Disponible au Cameroun',
  'Conseils Personnalisés en Direct sur WhatsApp'
];

export default function AiStorefrontConfiguratorTab({
  shop = {},
  onApplyGeneratedLayout,
  onClose
}) {
  // Wizard Steps : 1: Type | 2: Secteur | 3: Design & Couleurs | 4: Réassurance & Lancement
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [siteType, setSiteType] = useState('e-Commerce Complet');
  const [selectedSector, setSelectedSector] = useState(SECTORS_PRESETS[0].label);
  const [customSectorText, setCustomSectorText] = useState('');
  const [isCustomSector, setIsCustomSector] = useState(false);
  const [positioning, setPositioning] = useState('Tendance & Streetwear');
  const [selectedTheme, setSelectedTheme] = useState(() => shop?.layout_config?.theme || 'emerald');
  const [selectedDesignVariant, setSelectedDesignVariant] = useState('auto');
  const [selectedAvatarShape, setSelectedAvatarShape] = useState('squircle');
  const [selectedButtonStyle, setSelectedButtonStyle] = useState('glow_gradient');
  const [selectedAdvantages, setSelectedAdvantages] = useState([
    ADVANTAGES_PRESETS[0],
    ADVANTAGES_PRESETS[1],
    ADVANTAGES_PRESETS[2]
  ]);

  // Loading & Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhase, setGenerationPhase] = useState('');
  const [generatedResult, setGeneratedResult] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleAdvantage = (adv) => {
    setSelectedAdvantages((prev) =>
      prev.includes(adv) ? prev.filter((a) => a !== adv) : [...prev, adv]
    );
  };

  const handleLaunchGeneration = async () => {
    setIsGenerating(true);
    setGenerationPhase('Analyse de l\'identité et du positionnement de votre boutique...');

    const timer1 = setTimeout(() => {
      setGenerationPhase('Harmonisation des blocs modulaires et des styles de boutons...');
    }, 1200);

    const timer2 = setTimeout(() => {
      setGenerationPhase('Génération des textes d\'accroche et des arguments de vente...');
    }, 2400);

    try {
      const activeSector = isCustomSector ? customSectorText || 'Commerce Spécialisé' : selectedSector;

      const result = await generateStorefrontWithMistral({
        shop,
        answers: {
          siteType,
          activity: activeSector,
          positioning,
          advantages: selectedAdvantages.join(', '),
          style: selectedTheme,
          designVariant: selectedDesignVariant,
          avatarShape: selectedAvatarShape,
          buttonStyle: selectedButtonStyle,
          objective: 'Ventes directes WhatsApp et commandes en ligne'
        }
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      if (result && Array.isArray(result.blocks) && result.blocks.length > 0) {
        setGeneratedResult(result);
        setIsSuccess(true);
      }
    } catch (err) {
      console.error('Erreur lors de la génération IA :', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (generatedResult && onApplyGeneratedLayout) {
      onApplyGeneratedLayout(generatedResult);
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-[#0F1117] min-h-[550px] rounded-3xl border border-slate-200 dark:border-slate-800/80 p-4 sm:p-8 flex flex-col justify-between shadow-xl transition-all">
      
      {/* ── EN-TÊTE DU CONFIGURATEUR IA ── */}
      <div className="border-b border-slate-200 dark:border-slate-800/80 pb-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <Wand2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Générateur IA de Vitrine Odoo
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Mistral Copilot
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Créez une vitrine unique, vendeuse et adaptée à votre activité au Cameroun.
              </p>
            </div>
          </div>

          {/* Stepper horizontal */}
          {!isGenerating && !isSuccess && (
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-800 text-xs font-bold self-start sm:self-auto">
              {[
                { step: 1, label: 'Type' },
                { step: 2, label: 'Secteur' },
                { step: 3, label: 'Design' },
                { step: 4, label: 'Réassurance' }
              ].map((s) => {
                const isActive = currentStep === s.step;
                const isPassed = currentStep > s.step;
                return (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setCurrentStep(s.step)}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : isPassed
                          ? 'text-emerald-600 dark:text-emerald-400 hover:bg-slate-300/50 dark:hover:bg-slate-800'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-[10px] font-mono">
                      {isPassed ? <Check className="w-2.5 h-2.5" /> : s.step}
                    </span>
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── CORPS CENTRAL DU CONFIGURATEUR ── */}
      <div className="flex-1">
        {isGenerating ? (
          /* ÉCRAN DE CHARGEMENT & SYNTHÈSE IA */
          <div className="py-16 text-center space-y-6 animate-pulse">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-3xl border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
              <div className="absolute inset-2 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Bot className="w-10 h-10 animate-bounce" />
              </div>
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Génération de votre Vitrine en cours...
              </h2>
              <p className="text-xs sm:text-sm font-mono text-emerald-600 dark:text-emerald-400">
                {generationPhase}
              </p>
            </div>
          </div>
        ) : isSuccess ? (
          /* ÉCRAN DE SUCCÈS & APERÇU */
          <div className="space-y-6 py-4 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Votre Vitrine a été générée avec succès !
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {generatedResult?.blocks?.length || 0} blocs modulaires et snippets prêts à être déployés.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleApply}
                  className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Appliquer à ma boutique</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccess(false);
                    handleLaunchGeneration();
                  }}
                  className="px-4 py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Générer une autre variante"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Autre variante</span>
                </button>
              </div>
            </div>

            {/* Liste des blocs générés */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {generatedResult?.blocks?.map((block, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      Bloc #{idx + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500">
                      {block.type}
                    </span>
                  </div>
                  <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                    {block.props?.title || block.props?.slogan || block.props?.heading || block.type}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* STEPPER INTERACTIF */
          <div className="space-y-6">
            
            {/* ── ÉTAPE 1 : TYPE DE BOUTIQUE ── */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    1. Quel type d'expérience souhaitez-vous offrir ?
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Sélectionnez le format adapté à votre stratégie commerciale.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {SITE_TYPES.map((t) => {
                    const isSelected = siteType === t.title;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setSiteType(t.title)}
                        className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/30'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {t.badge}
                            </span>
                            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-2">
                              {t.title}
                            </h3>
                          </div>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 dark:border-slate-700'
                          }`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {t.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── ÉTAPE 2 : SECTEUR D'ACTIVITÉ & POSITIONNEMENT ── */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    2. Quel est votre secteur d'activité et votre positionnement ?
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    L'IA adaptera les visuels, les textes et le vocabulaire commercial.
                  </p>
                </div>

                {/* Secteurs Prédéfinis */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {SECTORS_PRESETS.map((sec) => {
                    const isSelected = !isCustomSector && selectedSector === sec.label;
                    const Icon = sec.icon;
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => {
                          setSelectedSector(sec.label);
                          setIsCustomSector(false);
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500/10 shadow-md ring-2 ring-emerald-500/30'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">
                            {sec.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Saisie Libre Personnalisée */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Ou saisissez votre domaine sur-mesure :
                  </label>
                  <input
                    type="text"
                    value={customSectorText}
                    onChange={(e) => {
                      setCustomSectorText(e.target.value);
                      setIsCustomSector(true);
                    }}
                    placeholder="Ex: Vente de Perruques HD, Sneakers rares, Pièces détachées auto..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Positionnement */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Style de Positionnement :
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {POSITIONING_PRESETS.map((pos) => {
                      const isSel = positioning === pos.label;
                      return (
                        <button
                          key={pos.id}
                          type="button"
                          onClick={() => setPositioning(pos.label)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSel
                              ? 'border-emerald-500 bg-emerald-500/10 shadow-sm ring-2 ring-emerald-500/30'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                          }`}
                        >
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">{pos.label}</span>
                          <span className="text-[10px] text-slate-500 block truncate">{pos.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── ÉTAPE 3 : DESIGN, COULEURS & BOUTONS ── */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    3. Univers Visuel, Palette Chromatique & Styles
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Choisissez la personnalité esthétique de votre boutique.
                  </p>
                </div>

                {/* Palettes de Couleurs */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-emerald-500" />
                      <span>Palette de Couleurs MeetShop</span>
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {getTheme(selectedTheme)?.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
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
                            className="w-6 h-6 rounded-full shadow-inner block"
                            style={{ backgroundColor: pal.hex || pal.color || '#16a34a' }}
                          />
                          <span className="text-[11px] font-bold truncate max-w-full">{pal.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Formes d'Avatars & Styles de Boutons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Formes d'Avatars & Photos */}
                  <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-emerald-500" />
                      <span>Forme des Photos & Avatars</span>
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {AVATAR_SHAPES.map((shape) => {
                        const isSel = selectedAvatarShape === shape.id;
                        return (
                          <button
                            key={shape.id}
                            type="button"
                            onClick={() => setSelectedAvatarShape(shape.id)}
                            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                              isSel
                                ? 'border-emerald-500 bg-emerald-500/10 shadow-sm ring-2 ring-emerald-500/30'
                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                            }`}
                          >
                            <span className={`w-6 h-6 bg-emerald-600/30 border border-emerald-500 block ${shape.class}`} />
                            <span className="text-[10px] font-bold truncate max-w-full">{shape.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Styles de Boutons CTA */}
                  <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-emerald-500" />
                      <span>Style des Boutons d'Action</span>
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {BUTTON_STYLES.map((btn) => {
                        const isSel = selectedButtonStyle === btn.id;
                        return (
                          <button
                            key={btn.id}
                            type="button"
                            onClick={() => setSelectedButtonStyle(btn.id)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              isSel
                                ? 'border-emerald-500 bg-emerald-500/10 shadow-sm ring-2 ring-emerald-500/30'
                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                            }`}
                          >
                            <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">{btn.name}</span>
                            <span className="text-[10px] text-slate-500 block truncate">{btn.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 16 Univers Visuels Odoo */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      <span>Univers Graphique (16 Styles Odoo)</span>
                    </span>
                    {selectedDesignVariant !== 'auto' && (
                      <button
                        type="button"
                        onClick={() => setSelectedDesignVariant('auto')}
                        className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                      >
                        Laisser l'IA choisir automatiquement
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto pr-1">
                    <button
                      type="button"
                      onClick={() => setSelectedDesignVariant('auto')}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedDesignVariant === 'auto'
                          ? 'border-emerald-500 bg-emerald-500/15 shadow-sm ring-2 ring-emerald-500/30'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">Auto (Recommandé)</span>
                      <span className="text-[10px] text-slate-500 block truncate">L'IA choisit le style parfait</span>
                    </button>

                    {BLOCK_DESIGN_VARIANTS.map((dv) => {
                      const isCur = selectedDesignVariant === dv.id;
                      return (
                        <button
                          key={dv.id}
                          type="button"
                          onClick={() => setSelectedDesignVariant(dv.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isCur
                              ? 'border-emerald-500 bg-emerald-500/15 shadow-sm ring-2 ring-emerald-500/30'
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
              </div>
            )}

            {/* ── ÉTAPE 4 : RÉASSURANCE & LANCEMENT ── */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    4. Arguments de Réassurance & Lancement
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Sélectionnez les gages de confiance mis en avant dans vos blocs.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ADVANTAGES_PRESETS.map((adv) => {
                    const isChecked = selectedAdvantages.includes(adv);
                    return (
                      <div
                        key={adv}
                        onClick={() => toggleAdvantage(adv)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isChecked
                            ? 'border-emerald-500 bg-emerald-500/10 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{adv}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                          isChecked ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 dark:border-slate-700'
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* ── BARRE DE NAVIGATION & ACTION DU BAS ── */}
      {!isGenerating && !isSuccess && (
        <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-4">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s - 1)}
              className="px-5 py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Précédent</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s + 1)}
              className="px-7 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Continuer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLaunchGeneration}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/30 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <Wand2 className="w-4 h-4 animate-pulse" />
              <span>Générer ma Vitrine avec Mistral IA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

    </div>
  );
}
