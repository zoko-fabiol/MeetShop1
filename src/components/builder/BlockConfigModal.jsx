import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Sliders, 
  Sparkles, 
  Image, 
  Clock, 
  Phone, 
  MapPin, 
  AlignLeft, 
  Layers, 
  Star, 
  Plus, 
  Trash2, 
  User,
  AlertCircle,
  Save,
  RotateCcw,
  Upload,
  Loader2,
  Palette,
  Layout,
  Shapes,
  MousePointerClick
} from 'lucide-react';
import { getTheme } from '../../config/themes';
import { uploadImageToCloudinary } from '../../services/cloudinaryService';
import { AVAILABLE_BLOCKS } from '../../config/shopBlocks';
import { BUTTON_STYLES, AVATAR_STYLES, CARD_STYLES } from '../../config/blockStyles';

class BlockConfigErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Erreur dans l'inspecteur de bloc:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Paramètres Simplifiés</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Ce bloc utilise une configuration autonome.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Sélecteur Visuel de Style de Bloc ────────────────────────────────────────
function StyleVariantPicker({ blockType, value, onChange, theme }) {
  const blockDef = AVAILABLE_BLOCKS.find(b => b.type === blockType);
  const variants = blockDef?.styleVariants;
  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 mb-3">
      <label className="block text-slate-900 dark:text-white font-extrabold text-xs flex items-center gap-1.5">
        <Layout className={`w-3.5 h-3.5 ${theme?.accentColor || 'text-emerald-500'}`} />
        <span>Style & Disposition Visuelle du Bloc</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        {variants.map(v => {
          const isSelected = (value || variants[0].id) === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onChange(v.id)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? `${theme?.badge || 'bg-emerald-500/15 border-emerald-500 text-emerald-600'} shadow-sm font-bold ring-2 ring-emerald-500/30`
                  : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="font-black text-xs text-slate-900 dark:text-white">{v.name}</span>
                {isSelected && <span className={`w-2 h-2 rounded-full ${theme?.accentBg || 'bg-emerald-600'}`} />}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">{v.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Sélecteur de Forme d'Avatar / Logo ───────────────────────────────────────
function AvatarStylePicker({ value, onChange, theme }) {
  return (
    <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 mb-3">
      <label className="block text-slate-900 dark:text-white font-extrabold text-xs flex items-center gap-1.5">
        <Shapes className={`w-3.5 h-3.5 ${theme?.accentColor || 'text-emerald-500'}`} />
        <span>Forme du Logo / Photo de Profil</span>
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {Object.values(AVATAR_STYLES).map(st => {
          const isSelected = (value || 'rounded') === st.id;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => onChange(st.id)}
              className={`p-2 rounded-xl border text-center transition-all ${
                isSelected
                  ? `${theme?.badge || 'bg-emerald-500/15 border-emerald-500 text-emerald-600'} font-bold ring-2 ring-emerald-500/30 shadow-sm`
                  : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <span className="text-xs font-black block text-slate-900 dark:text-white truncate">{st.name}</span>
              <span className="text-[9px] text-slate-500 dark:text-slate-400 block mt-0.5 truncate">{st.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Sélecteur de Style de Bouton ────────────────────────────────────────────
function ButtonStylePicker({ value, onChange, theme }) {
  return (
    <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 mb-3">
      <label className="block text-slate-900 dark:text-white font-extrabold text-xs flex items-center gap-1.5">
        <MousePointerClick className={`w-3.5 h-3.5 ${theme?.accentColor || 'text-emerald-500'}`} />
        <span>Design des Boutons & CTA</span>
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
        {Object.values(BUTTON_STYLES).map(st => {
          const isSelected = (value || 'modern_rounded') === st.id;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => onChange(st.id)}
              className={`p-2 rounded-xl border text-center transition-all ${
                isSelected
                  ? `${theme?.badge || 'bg-emerald-500/15 border-emerald-500 text-emerald-600'} font-bold ring-2 ring-emerald-500/30 shadow-sm`
                  : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <span className="text-xs font-black block text-slate-900 dark:text-white truncate">{st.name}</span>
              <span className="text-[9px] text-slate-500 dark:text-slate-400 block mt-0.5 truncate">{st.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Sélecteur de Style de Carte ─────────────────────────────────────────────
function CardStylePicker({ value, onChange, theme }) {
  return (
    <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 mb-3">
      <label className="block text-slate-900 dark:text-white font-extrabold text-xs flex items-center gap-1.5">
        <Palette className={`w-3.5 h-3.5 ${theme?.accentColor || 'text-emerald-500'}`} />
        <span>Style des Cartes Éléments</span>
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {Object.values(CARD_STYLES).map(st => {
          const isSelected = (value || 'standard') === st.id;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => onChange(st.id)}
              className={`p-2 rounded-xl border text-center transition-all ${
                isSelected
                  ? `${theme?.badge || 'bg-emerald-500/15 border-emerald-500 text-emerald-600'} font-bold ring-2 ring-emerald-500/30 shadow-sm`
                  : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <span className="text-xs font-black block text-slate-900 dark:text-white truncate">{st.name}</span>
              <span className="text-[9px] text-slate-500 dark:text-slate-400 block mt-0.5 truncate">{st.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Composant Uploader Image Cloudinary (Mode Clair & Sombre) ───────────────
function CloudinaryImageUploader({ label, value, onChange, folder = 'meetshop_builder' }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [localPreview, setLocalPreview] = useState('');

  const displayImage = localPreview || value;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Aperçu instantané 0ms
    const tempUrl = URL.createObjectURL(file);
    setLocalPreview(tempUrl);
    setUploading(true);
    setError('');
    
    try {
      const url = await uploadImageToCloudinary(file, folder);
      if (url) {
        onChange(url);
        setLocalPreview('');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Échec du téléversement de l\'image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider">
          {label}
        </label>
      )}
      
      {displayImage ? (
        <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/90 p-2.5 flex items-center gap-3">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800">
            <img 
              src={displayImage} 
              alt="Preview" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&auto=format&fit=crop&q=80';
              }}
              className="w-full h-full object-cover" 
            />
            {uploading && (
              <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Enregistrement cloud en cours...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" /> Image enregistrée avec succès
                </>
              )}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-mono">
              {uploading ? 'Traitement et optimisation...' : displayImage}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <label 
              className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors shadow-sm" 
              title="Remplacer l'image"
            >
              <Upload className="w-4 h-4" />
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
            </label>
            <button
              type="button"
              onClick={() => {
                setLocalPreview('');
                onChange('');
              }}
              className="p-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-transparent transition-colors"
              title="Supprimer l'image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <label className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
          uploading
            ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
            : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500/60 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}>
          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Téléversement de l'image en cours...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-center py-1">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Importer une image depuis votre appareil</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Formats PNG, JPG, WEBP acceptés</span>
              </div>
            </div>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
        </label>
      )}

      {error && <p className="text-xs text-rose-500 dark:text-rose-400 font-semibold">{error}</p>}
    </div>
  );
}

// ─── Composant Interrupteur Toggle Switch ON / OFF ───────────────────────────
function SwitchToggle({ label, checked, onChange, helpText }) {
  return (
    <div 
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 cursor-pointer transition-all select-none group shadow-sm"
    >
      <div className="flex-1 pr-3">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {label}
        </span>
        {helpText && (
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
            {helpText}
          </span>
        )}
      </div>

      {/* Interrupteur ON/OFF dynamique */}
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-[10px] font-black tracking-wider uppercase transition-colors ${
          checked ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
        }`}>
          {checked ? 'ON' : 'OFF'}
        </span>
        <div className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
          checked ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
        }`}>
          <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`} />
        </div>
      </div>
    </div>
  );
}

const DEFAULT_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Arsène Manga',
    location: 'Douala - Akwa',
    rating: 5,
    comment: 'Livraison reçue en 45 minutes chrono ! Produit 100% original, vendeur très réactif sur WhatsApp.',
    date: 'Il y a 2 jours',
    avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'rev-2',
    name: 'Carole Tsafack',
    location: 'Yaoundé - Bastos',
    rating: 5,
    comment: 'Excellente qualité. Emballage soigné et paiement sécurisé Orange Money à la livraison. Bravo !',
    date: 'Il y a 4 jours',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'rev-3',
    name: 'Boris Kamga',
    location: 'Douala - Bonapriso',
    rating: 5,
    comment: 'Commander directement via la vitrine Odoo est un vrai plaisir. Je recommande à 100% cette boutique.',
    date: 'Il y a 1 semaine',
    avatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=200&auto=format&fit=crop&q=80'
  }
];

// Presets d'avatars africains rapides pour enrichir la preuve sociale
const AVATAR_PRESETS = [
  { label: 'Homme 1 (Arsène)', url: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=200&auto=format&fit=crop&q=80' },
  { label: 'Femme 1 (Carole)', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&auto=format&fit=crop&q=80' },
  { label: 'Homme 2 (Boris)', url: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=200&auto=format&fit=crop&q=80' },
  { label: 'Femme 2 (Nathalie)', url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80' },
  { label: 'Homme 3 (Samuel)', url: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=200&auto=format&fit=crop&q=80' },
  { label: 'Femme 3 (Diane)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80' },
  { label: 'Homme 4 (Franck)', url: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=200&auto=format&fit=crop&q=80' },
  { label: 'Femme 4 (Aïcha)', url: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=200&auto=format&fit=crop&q=80' },
  { label: 'Homme 5 (Patrick)', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
  { label: 'Femme 5 (Sonia)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
  { label: 'Homme 6 (Gilles)', url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80' },
  { label: 'Femme 6 (Laetitia)', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80' }
];

export default function BlockConfigModal({ block, shop, products = [], themeId, isOpen, onClose, onSave }) {
  const theme = getTheme(themeId);
  const [props, setProps] = useState({});
  const [initialSnapshot, setInitialSnapshot] = useState('');
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Récupération des produits de la boutique pour le sélecteur Flash Deal / Vitrine
  const shopProducts = (products && products.length > 0)
    ? products
    : (() => {
        try {
          const cached = JSON.parse(localStorage.getItem('meetshop_products') || '[]');
          if (shop?.id || shop?.code) {
            const filtered = cached.filter(p => p.shop_id === shop.id || p.shopCode === shop.code || p.shop_id === shop.code);
            return filtered.length > 0 ? filtered : cached;
          }
          return cached;
        } catch {
          return [];
        }
      })();

  useEffect(() => {
    if (block) {
      const initialProps = { ...(block.props || {}) };
      if (block.type === 'CustomerReviews' && (!initialProps.reviews || initialProps.reviews.length === 0)) {
        initialProps.reviews = DEFAULT_REVIEWS;
      }
      if (Array.isArray(initialProps.questions)) {
        initialProps.questions = initialProps.questions.map((q, idx) => {
          if (typeof q === 'string') {
            return { id: `q-${idx + 1}`, label: q, type: 'text', required: true, options: [] };
          }
          return {
            id: q?.id || `q-${idx + 1}`,
            label: q?.label || q?.question || q?.title || `Question ${idx + 1}`,
            type: q?.type || 'text',
            required: q?.required !== false,
            placeholder: q?.placeholder || '',
            options: Array.isArray(q?.options) ? q.options : []
          };
        });
      }
      if (Array.isArray(initialProps.items)) {
        initialProps.items = initialProps.items.map((it, idx) => ({
          q: it?.q || it?.question || `Question #${idx + 1}`,
          a: it?.a || it?.answer || 'Réponse...'
        }));
      }
      setProps(initialProps);
      setInitialSnapshot(JSON.stringify(initialProps));
      setShowExitConfirm(false);
    }
  }, [block, isOpen]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [isOpen]);

  if (!isOpen || !block) return null;

  const isDirty = initialSnapshot !== '' && JSON.stringify(props) !== initialSnapshot;

  const handleRequestClose = () => {
    if (isDirty) {
      setShowExitConfirm(true);
    } else {
      onClose();
    }
  };

  const handleChange = (key, value) => {
    setProps(prev => ({ ...prev, [key]: value }));
  };

  const handleReviewChange = (index, field, value) => {
    const currentReviews = [...(props.reviews || DEFAULT_REVIEWS)];
    currentReviews[index] = { ...currentReviews[index], [field]: value };
    handleChange('reviews', currentReviews);
  };

  const handleAddReview = () => {
    const currentReviews = [...(props.reviews || DEFAULT_REVIEWS)];
    const newRev = {
      id: `rev-${Date.now()}`,
      name: 'Nouveau Client',
      location: 'Douala',
      rating: 5,
      comment: 'Très satisfait de ma commande et du service de livraison rapide !',
      date: 'Récemment',
      avatar: AVATAR_PRESETS[currentReviews.length % AVATAR_PRESETS.length].url
    };
    handleChange('reviews', [...currentReviews, newRev]);
  };

  const handleDeleteReview = (index) => {
    const currentReviews = [...(props.reviews || DEFAULT_REVIEWS)];
    const updated = currentReviews.filter((_, i) => i !== index);
    handleChange('reviews', updated);
  };

  // Question helpers for CustomForm
  const handleAddQuestion = () => {
    const currentQuestions = Array.isArray(props.questions) ? props.questions : [];
    const newQ = {
      id: `q-${Date.now()}`,
      label: 'Nouvelle question',
      type: 'text',
      placeholder: 'Votre réponse...',
      required: true,
      options: []
    };
    handleChange('questions', [...currentQuestions, newQ]);
  };

  const handleQuestionChange = (qIndex, field, value) => {
    const currentQuestions = [...(props.questions || [])];
    const targetQ = typeof currentQuestions[qIndex] === 'object' && currentQuestions[qIndex] !== null 
      ? currentQuestions[qIndex] 
      : { id: `q-${qIndex + 1}`, label: '', type: 'text', options: [] };
    currentQuestions[qIndex] = { ...targetQ, [field]: value };
    handleChange('questions', currentQuestions);
  };

  const handleDeleteQuestion = (qIndex) => {
    const currentQuestions = [...(props.questions || [])];
    handleChange('questions', currentQuestions.filter((_, i) => i !== qIndex));
  };

  const handleAddOption = (qIndex) => {
    const currentQuestions = [...(props.questions || [])];
    const q = currentQuestions[qIndex] || {};
    const currentOpts = Array.isArray(q.options) ? q.options : [];
    currentQuestions[qIndex] = { ...q, options: [...currentOpts, `Option ${currentOpts.length + 1}`] };
    handleChange('questions', currentQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, val) => {
    const currentQuestions = [...(props.questions || [])];
    const q = currentQuestions[qIndex] || {};
    const currentOpts = [...(q.options || [])];
    currentOpts[optIndex] = val;
    currentQuestions[qIndex] = { ...q, options: currentOpts };
    handleChange('questions', currentQuestions);
  };

  const handleDeleteOption = (qIndex, optIndex) => {
    const currentQuestions = [...(props.questions || [])];
    const q = currentQuestions[qIndex] || {};
    const currentOpts = [...(q.options || [])];
    currentQuestions[qIndex] = { ...q, options: currentOpts.filter((_, i) => i !== optIndex) };
    handleChange('questions', currentQuestions);
  };

  // FAQ helpers
  const handleAddFaqItem = () => {
    const currentItems = Array.isArray(props.items) ? props.items : [];
    handleChange('items', [...currentItems, { q: 'Nouvelle question ?', a: 'Réponse détaillée ici...' }]);
  };

  const handleFaqItemChange = (fIndex, field, val) => {
    const currentItems = [...(props.items || [])];
    currentItems[fIndex] = { ...currentItems[fIndex], [field]: val };
    handleChange('items', currentItems);
  };

  const handleDeleteFaqItem = (fIndex) => {
    const currentItems = Array.isArray(props.items) ? props.items : [];
    if (currentItems.length <= 1) {
      alert('Vous devez conserver au moins une question/réponse.');
      return;
    }
    handleChange('items', currentItems.filter((_, i) => i !== fIndex));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSave(block.id, props);
    setShowExitConfirm(false);
    onClose();
  };

  const handleDiscardAndClose = () => {
    setShowExitConfirm(false);
    onClose();
  };

  const currentReviews = props.reviews || DEFAULT_REVIEWS;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn overscroll-contain"
      onClick={handleRequestClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative max-h-[92vh] flex flex-col overscroll-contain transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl border ${theme.badge} shadow-sm`}>
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">
                  Configurer : {block.type}
                </h3>
                {isDirty && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                    Modifié
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Personnalisez les textes, photos de profil et avis de ce bloc</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRequestClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-xs overscroll-contain bg-white dark:bg-slate-900">
          <BlockConfigErrorBoundary>
          
          {/* Specific fields for HeroBanner */}
          {block.type === 'HeroBanner' && (
            <>
              <StyleVariantPicker
                blockType="HeroBanner"
                value={props.styleVariant}
                onChange={(val) => handleChange('styleVariant', val)}
                theme={theme}
              />

              <AvatarStylePicker
                value={props.avatarStyle}
                onChange={(val) => handleChange('avatarStyle', val)}
                theme={theme}
              />

              <ButtonStylePicker
                value={props.buttonStyle}
                onChange={(val) => handleChange('buttonStyle', val)}
                theme={theme}
              />

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Slogan / Phrase d'accroche</label>
                <textarea
                  value={props.slogan || ''}
                  onChange={(e) => handleChange('slogan', e.target.value)}
                  rows={2}
                  placeholder="Ex: N°1 des smartphones et accessoires certifiés d'origine à Douala Akwa."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Texte du bouton d'action (CTA)</label>
                <input
                  type="text"
                  value={props.ctaText || ''}
                  onChange={(e) => handleChange('ctaText', e.target.value)}
                  placeholder="Ex: Discuter sur WhatsApp"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CloudinaryImageUploader
                  label="Photo de Profil / Logo de la boutique"
                  value={props.customLogoUrl || ''}
                  onChange={(url) => handleChange('customLogoUrl', url)}
                  folder="meetshop_logos"
                />

                <CloudinaryImageUploader
                  label="Photo de Couverture / Bannière"
                  value={props.customCoverUrl || ''}
                  onChange={(url) => handleChange('customCoverUrl', url)}
                  folder="meetshop_banners"
                />
              </div>

              <div className="space-y-2.5 pt-2">
                <SwitchToggle
                  label="Afficher le badge de statut 'En Direct / Ouvert'"
                  checked={props.showLiveBadge !== false}
                  onChange={(val) => handleChange('showLiveBadge', val)}
                  helpText="Affiche le badge vert clignotant en direct sur la bannière"
                />

                <SwitchToggle
                  label="Afficher la barre des 4 engagements de confiance"
                  checked={props.showStats !== false}
                  onChange={(val) => handleChange('showStats', val)}
                  helpText="Garantie authenticité, livraison rapide, paiement sécurisé et SAV"
                />
              </div>
            </>
          )}

          {/* Specific fields for FlashDeal */}
          {block.type === 'FlashDeal' && (
            <div className="space-y-4">
              <StyleVariantPicker
                blockType="FlashDeal"
                value={props.styleVariant}
                onChange={(val) => handleChange('styleVariant', val)}
                theme={theme}
              />

              <ButtonStylePicker
                value={props.buttonStyle}
                onChange={(val) => handleChange('buttonStyle', val)}
                theme={theme}
              />
              
              {/* 1. Sélection du Produit depuis la base de données */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-slate-700 dark:text-slate-300 font-bold text-xs">
                    1. Choisir le Produit en Promotion
                  </label>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {shopProducts.length} article{shopProducts.length > 1 ? 's' : ''} en boutique
                  </span>
                </div>

                {shopProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1.5 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40">
                    {shopProducts.map((p) => {
                      const isSelected = props.productId === p.id || (!props.productId && props.productName === p.name);
                      const prodImg = p.image || p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80';
                      const price = Number(p.price) || 0;
                      return (
                        <div
                          key={p.id || p.name}
                          onClick={() => {
                            const discount = props.discountPercentage || 25;
                            const discounted = Math.round(price * (1 - discount / 100));
                            setProps(prev => ({
                              ...prev,
                              productId: p.id,
                              productName: p.name,
                              originalPrice: price,
                              discountedPrice: discounted,
                              dealImage: prodImg,
                              title: `Vente Flash : ${p.name}`,
                              subtitle: `Offre exclusive limitée sur ${p.name} chez ${shop?.name || 'la boutique'}.`,
                              discountBadge: `-${discount}% IMMÉDIAT`
                            }));
                          }}
                          className={`flex items-center gap-2.5 p-2 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-emerald-500/15 border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-500/30'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-500/50'
                          }`}
                        >
                          <img
                            src={prodImg}
                            alt={p.name}
                            className="w-12 h-12 rounded-lg object-cover bg-slate-100 dark:bg-slate-900 shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80';
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-900 dark:text-white truncate text-xs">{p.name}</p>
                            <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                              {price.toLocaleString()} FCFA
                            </p>
                          </div>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl text-amber-800 dark:text-amber-300 text-xs">
                    Aucun article trouvé dans votre catalogue boutique. Vous pouvez ajouter des articles dans l'onglet Produits de votre tableau de bord.
                  </div>
                )}
              </div>

              {/* 2. Pourcentage de réduction */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-slate-700 dark:text-slate-300 font-bold text-xs">
                    2. Pourcentage de Réduction
                  </label>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 text-xs">
                    -{props.discountPercentage || 25}%
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {[10, 15, 20, 25, 30, 40, 50, 70].map((pct) => {
                    const active = (props.discountPercentage || 25) === pct;
                    return (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => {
                          const orig = props.originalPrice || 25000;
                          const discounted = Math.round(orig * (1 - pct / 100));
                          setProps(prev => ({
                            ...prev,
                            discountPercentage: pct,
                            discountBadge: `-${pct}% IMMÉDIAT`,
                            discountedPrice: discounted
                          }));
                        }}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                          active
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-105'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        -{pct}%
                      </button>
                    );
                  })}
                </div>

                {props.originalPrice ? (
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">
                      Prix Initial : <span className="line-through">{Number(props.originalPrice).toLocaleString()} FCFA</span>
                    </span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      Prix Promo : {Number(props.discountedPrice || Math.round(props.originalPrice * 0.75)).toLocaleString()} FCFA
                    </span>
                  </div>
                ) : null}
              </div>

              {/* 3. Validité du Flash Deal */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5 text-xs">
                  3. Durée de Validité du Flash Deal
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {[
                    { label: '2 Heures', hours: 2 },
                    { label: '6 Heures', hours: 6 },
                    { label: '12 Heures', hours: 12 },
                    { label: '24 Heures', hours: 24 },
                    { label: '48 Heures', hours: 48 },
                    { label: '7 Jours', hours: 168 }
                  ].map((dur) => {
                    const active = (props.validityHours || 24) === dur.hours;
                    return (
                      <button
                        key={dur.hours}
                        type="button"
                        onClick={() => {
                          setProps(prev => ({
                            ...prev,
                            validityHours: dur.hours,
                            expiresAt: Date.now() + dur.hours * 3600 * 1000
                          }));
                        }}
                        className={`py-2 px-1 rounded-xl text-center font-bold text-xs transition-all ${
                          active
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {dur.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Titre et Bouton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 text-xs">Titre de l'Offre</label>
                  <input
                    type="text"
                    value={props.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Vente Flash Exceptionnelle !"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 text-xs">Texte du Bouton</label>
                  <input
                    type="text"
                    value={props.ctaText || ''}
                    onChange={(e) => handleChange('ctaText', e.target.value)}
                    placeholder="Commander sur WhatsApp"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

            </div>
          )}

          {/* Specific fields for FeaturedProducts */}
          {block.type === 'FeaturedProducts' && (
            <>
              <CardStylePicker
                value={props.cardStyle}
                onChange={(val) => handleChange('cardStyle', val)}
                theme={theme}
              />

              <ButtonStylePicker
                value={props.buttonStyle}
                onChange={(val) => handleChange('buttonStyle', val)}
                theme={theme}
              />

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Titre de la section vedette</label>
                <input
                  type="text"
                  value={props.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Nos Meilleures Ventes"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Sous-titre explicatif</label>
                <input
                  type="text"
                  value={props.subtitle || ''}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  placeholder="Sélection coup de cœur garantie par la boutique"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Nombre maximum d'articles affichés</label>
                <select
                  value={props.maxItems || 4}
                  onChange={(e) => handleChange('maxItems', parseInt(e.target.value, 10))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                >
                  <option value={2}>2 articles</option>
                  <option value={4}>4 articles</option>
                  <option value={6}>6 articles</option>
                  <option value={8}>8 articles</option>
                </select>
              </div>
            </>
          )}

          {/* Specific fields for CategoryCatalog */}
          {block.type === 'CategoryCatalog' && (
            <>
              <CardStylePicker
                value={props.cardStyle}
                onChange={(val) => handleChange('cardStyle', val)}
                theme={theme}
              />

              <ButtonStylePicker
                value={props.buttonStyle}
                onChange={(val) => handleChange('buttonStyle', val)}
                theme={theme}
              />

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Titre de la section catalogue</label>
                <input
                  type="text"
                  value={props.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Tous les Articles Disponibles"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
              </div>

              <div className="space-y-2.5 pt-2">
                <SwitchToggle
                  label="Afficher la barre de recherche interne"
                  checked={props.showSearch !== false}
                  onChange={(val) => handleChange('showSearch', val)}
                  helpText="Permet aux clients de rechercher rapidement dans vos articles"
                />

                <SwitchToggle
                  label="Afficher les onglets de sous-catégories"
                  checked={props.showCategoryPills !== false}
                  onChange={(val) => handleChange('showCategoryPills', val)}
                  helpText="Boutons de filtre par catégorie pour faciliter la navigation"
                />
              </div>
            </>
          )}

          {/* Specific fields for AboutStory */}
          {block.type === 'AboutStory' && (
            <>
              <StyleVariantPicker
                blockType="AboutStory"
                value={props.styleVariant}
                onChange={(val) => handleChange('styleVariant', val)}
                theme={theme}
              />

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Titre de la section</label>
                <input
                  type="text"
                  value={props.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Qui sommes-nous ?"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Histoire / Description de la boutique</label>
                <textarea
                  value={props.storyText || ''}
                  onChange={(e) => handleChange('storyText', e.target.value)}
                  rows={3}
                  placeholder="Racontez votre histoire..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Année de création / Depuis</label>
                  <input
                    type="text"
                    value={props.sinceYear || ''}
                    onChange={(e) => handleChange('sinceYear', e.target.value)}
                    placeholder="Ex: 2021"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Texte du Badge</label>
                  <input
                    type="text"
                    value={props.badgeText || ''}
                    onChange={(e) => handleChange('badgeText', e.target.value)}
                    placeholder="Commerçant Vérifié MeetShop"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-slate-700 dark:text-slate-300 font-bold">Les 3 engagements de la boutique :</label>
                <input
                  type="text"
                  value={props.commitment1 || ''}
                  onChange={(e) => handleChange('commitment1', e.target.value)}
                  placeholder="Engagement 1"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
                <input
                  type="text"
                  value={props.commitment2 || ''}
                  onChange={(e) => handleChange('commitment2', e.target.value)}
                  placeholder="Engagement 2"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
                <input
                  type="text"
                  value={props.commitment3 || ''}
                  onChange={(e) => handleChange('commitment3', e.target.value)}
                  placeholder="Engagement 3"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
              </div>
            </>
          )}

          {/* Specific fields for OpeningHours */}
          {block.type === 'OpeningHours' && (
            <>
              <StyleVariantPicker
                blockType="OpeningHours"
                value={props.styleVariant}
                onChange={(val) => handleChange('styleVariant', val)}
                theme={theme}
              />
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Titre</label>
                <input
                  type="text"
                  value={props.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Horaires & Disponibilité Locale"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Lundi – Vendredi</label>
                  <input
                    type="text"
                    value={props.mondayFriday || ''}
                    onChange={(e) => handleChange('mondayFriday', e.target.value)}
                    placeholder="08h00 - 19h30"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Samedi</label>
                  <input
                    type="text"
                    value={props.saturday || ''}
                    onChange={(e) => handleChange('saturday', e.target.value)}
                    placeholder="08h30 - 20h00"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Dimanche</label>
                  <input
                    type="text"
                    value={props.sunday || ''}
                    onChange={(e) => handleChange('sunday', e.target.value)}
                    placeholder="12h00 - 18h00"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                </div>
              </div>
            </>
          )}

          {/* Specific fields for CustomerReviews */}
          {block.type === 'CustomerReviews' && (
            <div className="space-y-4">
              <CardStylePicker
                value={props.cardStyle}
                onChange={(val) => handleChange('cardStyle', val)}
                theme={theme}
              />

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Titre de la section avis</label>
                <input
                  type="text"
                  value={props.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Ce que disent nos clients"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Sous-titre</label>
                <input
                  type="text"
                  value={props.subtitle || ''}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  placeholder="Avis vérifiés après livraison locale"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
              </div>

              {/* Interrupteur: Autoriser les nouveaux avis */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white block">
                    Autoriser la publication de nouveaux avis
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {props.allowNewReviews !== false 
                      ? "Les clients connectés ayant reçu leur commande peuvent déposer un avis" 
                      : "Les nouveaux avis sont temporairement suspendus (les avis existants restent visibles)"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange('allowNewReviews', props.allowNewReviews === false ? true : false)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                    props.allowNewReviews !== false ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    props.allowNewReviews !== false ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Gestionnaire d'avis individuels */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span>Liste des Avis Clients ({currentReviews.length})</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddReview}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 hover:bg-emerald-100 dark:hover:bg-emerald-500/30 text-[11px] font-bold flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter un avis</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {currentReviews.map((rev, index) => (
                    <div
                      key={rev.id || index}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3 relative group"
                    >
                      {/* Header de la carte d'avis */}
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1">
                          <span>Avis #{index + 1}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-800 dark:text-slate-200">{rev.name || 'Client'}</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => handleDeleteReview(index)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-900 transition-colors"
                          title="Supprimer cet avis"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Photo de profil (Upload Cloudinary ou Sélection) */}
                      <div>
                        <CloudinaryImageUploader
                          label="Photo de profil du client"
                          value={rev.avatar || ''}
                          onChange={(url) => handleReviewChange(index, 'avatar', url)}
                          folder="meetshop_reviews"
                        />

                        {/* Presets d'avatars africains rapides (12 options) */}
                        <div className="mt-2.5 p-2 bg-white dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                            Ou sélectionner un avatar rapide :
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {AVATAR_PRESETS.map((preset, pIdx) => (
                              <button
                                key={pIdx}
                                type="button"
                                onClick={() => handleReviewChange(index, 'avatar', preset.url)}
                                className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all opacity-85 hover:opacity-100 hover:scale-110 shadow-sm ${
                                  rev.avatar === preset.url ? 'border-emerald-500 ring-2 ring-emerald-500/40 scale-105 opacity-100' : 'border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                                }`}
                                title={preset.label}
                              >
                                <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Nom et Ville */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 text-[11px] font-semibold mb-1">Nom du client :</label>
                          <input
                            type="text"
                            value={rev.name || ''}
                            onChange={(e) => handleReviewChange(index, 'name', e.target.value)}
                            placeholder="Ex: Arsène Manga"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 text-[11px] font-semibold mb-1">Ville / Quartier :</label>
                          <input
                            type="text"
                            value={rev.location || ''}
                            onChange={(e) => handleReviewChange(index, 'location', e.target.value)}
                            placeholder="Ex: Douala - Akwa"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      {/* Note étoiles et Date */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 text-[11px] font-semibold mb-1">Note (Étoiles) :</label>
                          <select
                            value={rev.rating || 5}
                            onChange={(e) => handleReviewChange(index, 'rating', parseInt(e.target.value, 10))}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                          >
                            <option value={5}>5 / 5 - Excellent</option>
                            <option value={4}>4 / 5 - Très bon</option>
                            <option value={3}>3 / 5 - Moyen</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 text-[11px] font-semibold mb-1">Délai / Date affichée :</label>
                          <input
                            type="text"
                            value={rev.date || ''}
                            onChange={(e) => handleReviewChange(index, 'date', e.target.value)}
                            placeholder="Ex: Il y a 2 jours"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      {/* Témoignage / Commentaire */}
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 text-[11px] font-semibold mb-1">Commentaire du client :</label>
                        <textarea
                          value={rev.comment || ''}
                          onChange={(e) => handleReviewChange(index, 'comment', e.target.value)}
                          rows={2}
                          placeholder="Écrivez le retour du client..."
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Specific fields for ContactMap */}
          {block.type === 'ContactMap' && (
            <>
              <StyleVariantPicker
                blockType="ContactMap"
                value={props.styleVariant}
                onChange={(val) => handleChange('styleVariant', val)}
                theme={theme}
              />

              <ButtonStylePicker
                value={props.buttonStyle}
                onChange={(val) => handleChange('buttonStyle', val)}
                theme={theme}
              />

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Titre de la section Contact & GPS</label>
                <input
                  type="text"
                  value={props.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Localisation & Contact Direct"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Quartier du Point de Retrait</label>
                  <select
                    value={props.quarter || 'Akwa'}
                    onChange={(e) => handleChange('quarter', e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  >
                    <optgroup label="Douala">
                      <option value="Akwa">Akwa (Douala)</option>
                      <option value="Bonanjo">Bonanjo (Douala)</option>
                      <option value="Bonapriso">Bonapriso (Douala)</option>
                      <option value="Bali">Bali (Douala)</option>
                      <option value="Deido">Deido (Douala)</option>
                      <option value="Bepanda">Bepanda (Douala)</option>
                      <option value="Makepe">Makepe (Douala)</option>
                      <option value="Bonamoussadi">Bonamoussadi (Douala)</option>
                      <option value="Logpom">Logpom (Douala)</option>
                      <option value="Kotto">Kotto (Douala)</option>
                      <option value="Ndogpassi">Ndogpassi (Douala)</option>
                      <option value="Yassa">Yassa (Douala)</option>
                    </optgroup>
                    <optgroup label="Yaoundé">
                      <option value="Bastos">Bastos (Yaoundé)</option>
                      <option value="Centre-ville">Centre-ville (Yaoundé)</option>
                      <option value="Omnisports">Omnisports (Yaoundé)</option>
                      <option value="Biyem-Assi">Biyem-Assi (Yaoundé)</option>
                      <option value="Mendong">Mendong (Yaoundé)</option>
                      <option value="Nlongkak">Nlongkak (Yaoundé)</option>
                      <option value="Mvan">Mvan (Yaoundé)</option>
                      <option value="Etoa-Meki">Etoa-Meki (Yaoundé)</option>
                      <option value="Essos">Essos (Yaoundé)</option>
                      <option value="Ngousso">Ngousso (Yaoundé)</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Ville</label>
                  <select
                    value={props.city || 'Douala'}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  >
                    <option value="Douala">Douala</option>
                    <option value="Yaoundé">Yaoundé</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Repère précis / Adresse physique</label>
                <input
                  type="text"
                  value={props.landmark || ''}
                  onChange={(e) => handleChange('landmark', e.target.value)}
                  placeholder="Ex: Rue Foch, en face de l'Hôtel Akwa Palace"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Numéro de Téléphone Direct</label>
                  <input
                    type="tel"
                    value={props.directPhone || ''}
                    onChange={(e) => handleChange('directPhone', e.target.value)}
                    placeholder="+237699123456"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Lien Google Maps personnalisé (optionnel)</label>
                  <input
                    type="url"
                    value={props.customMapsUrl || ''}
                    onChange={(e) => handleChange('customMapsUrl', e.target.value)}
                    placeholder="https://maps.app.goo.gl/..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                </div>
              </div>
            </>
          )}

          {/* Specific fields for CustomForm */}
          {block.type === 'CustomForm' && (
            <div className="space-y-4">
              <StyleVariantPicker
                blockType="CustomForm"
                value={props.styleVariant}
                onChange={(val) => handleChange('styleVariant', val)}
                theme={theme}
              />

              <ButtonStylePicker
                value={props.buttonStyle}
                onChange={(val) => handleChange('buttonStyle', val)}
                theme={theme}
              />

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Titre du formulaire</label>
                <input
                  type="text"
                  value={props.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Besoin d'un renseignement ou d'un devis ?"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Sous-titre / Consigne</label>
                <input
                  type="text"
                  value={props.subtitle || ''}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  placeholder="Répondez à ces questions pour recevoir notre offre"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Texte du bouton d'envoi</label>
                  <input
                    type="text"
                    value={props.submitButtonText || ''}
                    onChange={(e) => handleChange('submitButtonText', e.target.value)}
                    placeholder="Envoyer ma demande sur WhatsApp"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl mt-4 sm:mt-0">
                  <div>
                    <label className="text-xs font-bold text-slate-900 dark:text-white block">Demander Nom & Téléphone</label>
                    <span className="text-[10px] text-slate-400">Coordonnées de contact</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleChange('collectContactInfo', props.collectContactInfo === false ? true : false)}
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                      props.collectContactInfo !== false ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      props.collectContactInfo !== false ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Constructeur de Questions Dynamiques */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Questions du Formulaire ({(props.questions || []).length})</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 hover:bg-emerald-100 dark:hover:bg-emerald-500/30 text-[11px] font-bold flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter une question</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(props.questions || []).map((q, qIdx) => (
                    <div key={q.id || qIdx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
                          Question #{qIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(qIdx)}
                          className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                          title="Supprimer cette question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <input
                          type="text"
                          value={q.label || ''}
                          onChange={(e) => handleQuestionChange(qIdx, 'label', e.target.value)}
                          placeholder="Intitulé de la question..."
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={q.type || 'text'}
                            onChange={(e) => handleQuestionChange(qIdx, 'type', e.target.value)}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                          >
                            <option value="text">Texte court</option>
                            <option value="textarea">Texte long / Paragraphe</option>
                            <option value="select">Menu déroulant (Select)</option>
                            <option value="radio">Choix unique (Radio)</option>
                            <option value="checkbox">Choix multiple (Cases)</option>
                          </select>

                          <div className="flex items-center justify-between px-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs">
                            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Obligatoire</span>
                            <input
                              type="checkbox"
                              checked={q.required !== false}
                              onChange={(e) => handleQuestionChange(qIdx, 'required', e.target.checked)}
                              className="accent-emerald-600 rounded"
                            />
                          </div>
                        </div>

                        {/* Options de choix pour select, radio, checkbox */}
                        {['select', 'radio', 'checkbox'].includes(q.type) && (
                          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                              <span>Options de réponse :</span>
                              <button
                                type="button"
                                onClick={() => handleAddOption(qIdx)}
                                className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Ajouter option</span>
                              </button>
                            </div>

                            <div className="space-y-1.5">
                              {(q.options || []).map((opt, optIdx) => (
                                <div key={optIdx} className="flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-white"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteOption(qIdx, optIdx)}
                                    className="p-1 text-slate-400 hover:text-rose-500"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Specific fields for CustomCta */}
          {block.type === 'CustomCta' && (
            <div className="space-y-4">
              <StyleVariantPicker
                blockType="CustomCta"
                value={props.styleVariant}
                onChange={(val) => handleChange('styleVariant', val)}
                theme={theme}
              />

              <ButtonStylePicker
                value={props.buttonStyle}
                onChange={(val) => handleChange('buttonStyle', val)}
                theme={theme}
              />

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Titre principal</label>
                <input
                  type="text"
                  value={props.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Une question ? Besoin d'un conseil personnalisé ?"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Sous-titre explicatif</label>
                <input
                  type="text"
                  value={props.subtitle || ''}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  placeholder="Notre équipe vous répond instantanément sur WhatsApp 7j/7."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Texte Bouton Principal</label>
                  <input
                    type="text"
                    value={props.primaryBtnText || ''}
                    onChange={(e) => handleChange('primaryBtnText', e.target.value)}
                    placeholder="Discuter en direct sur WhatsApp"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Action Bouton Principal</label>
                  <select
                    value={props.primaryBtnAction || 'whatsapp'}
                    onChange={(e) => handleChange('primaryBtnAction', e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="whatsapp">Ouvrir WhatsApp</option>
                    <option value="call">Appeler la boutique</option>
                    <option value="catalog">Faire défiler vers le catalogue</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Texte Bouton Secondaire</label>
                  <input
                    type="text"
                    value={props.secondaryBtnText || ''}
                    onChange={(e) => handleChange('secondaryBtnText', e.target.value)}
                    placeholder="Appeler la boutique"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Badge d'accroche</label>
                  <input
                    type="text"
                    value={props.badgeText || ''}
                    onChange={(e) => handleChange('badgeText', e.target.value)}
                    placeholder="Réponse en < 5 minutes"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Specific fields for RichText */}
          {block.type === 'RichText' && (
            <div className="space-y-4">
              <StyleVariantPicker
                blockType="RichText"
                value={props.styleVariant}
                onChange={(val) => handleChange('styleVariant', val)}
                theme={theme}
              />

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Titre principal</label>
                <input
                  type="text"
                  value={props.heading || ''}
                  onChange={(e) => handleChange('heading', e.target.value)}
                  placeholder="L'Excellence et la Qualité au Meilleur Prix"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Contenu textuel</label>
                <textarea
                  rows={4}
                  value={props.content || ''}
                  onChange={(e) => handleChange('content', e.target.value)}
                  placeholder="Présentez les engagements de votre boutique..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Encadré de mise en valeur (Optionnel)</label>
                <input
                  type="text"
                  value={props.highlightNote || ''}
                  onChange={(e) => handleChange('highlightNote', e.target.value)}
                  placeholder="Ex: Livraison express garantie sous 2h à Douala et Yaoundé"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Badge</label>
                  <input
                    type="text"
                    value={props.badgeText || ''}
                    onChange={(e) => handleChange('badgeText', e.target.value)}
                    placeholder="Engagement Qualité"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Alignement</label>
                  <select
                    value={props.alignment || 'center'}
                    onChange={(e) => handleChange('alignment', e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="center">Centré</option>
                    <option value="left">Aligné à gauche</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Specific fields for FaqAccordion */}
          {block.type === 'FaqAccordion' && (
            <div className="space-y-4">
              <StyleVariantPicker
                blockType="FaqAccordion"
                value={props.styleVariant}
                onChange={(val) => handleChange('styleVariant', val)}
                theme={theme}
              />

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Titre de la FAQ</label>
                <input
                  type="text"
                  value={props.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Foire Aux Questions (FAQ)"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Sous-titre</label>
                <input
                  type="text"
                  value={props.subtitle || ''}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  placeholder="Tout ce que vous devez savoir avant de commander"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Questions / Réponses de la FAQ */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <MessageCircleQuestion className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Questions & Réponses ({(props.items || []).length})</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddFaqItem}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 hover:bg-emerald-100 dark:hover:bg-emerald-500/30 text-[11px] font-bold flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter une question</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(props.items || []).map((item, fIdx) => (
                    <div key={fIdx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
                          Q&A #{fIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteFaqItem(fIdx)}
                          className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                          title="Supprimer cette question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={item.q || ''}
                        onChange={(e) => handleFaqItemChange(fIdx, 'q', e.target.value)}
                        placeholder="Ex: Quels sont les délais de livraison ?"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:border-emerald-500"
                      />

                      <textarea
                        rows={2}
                        value={item.a || ''}
                        onChange={(e) => handleFaqItemChange(fIdx, 'a', e.target.value)}
                        placeholder="Ex: Livraison sous 2 heures par coursier express..."
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Specific fields for CustomAiBlock / DynamicCodeBlock */}
          {(block.type === 'CustomAiBlock' || block.type === 'DynamicCode' || block.type === 'DynamicCodeBlock') && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Nom / Libellé de la Création IA</label>
                <input
                  type="text"
                  value={props.name || props.structure?.title || props.title || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleChange('name', val);
                    handleChange('title', val);
                    if (props.structure) {
                      handleChange('structure', { ...props.structure, title: val });
                    }
                  }}
                  placeholder="Ex: Grille Bento High-Tech 3D"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Sous-titre / Description</label>
                <input
                  type="text"
                  value={props.subtitle || props.structure?.subtitle || props.description || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleChange('subtitle', val);
                    handleChange('description', val);
                    if (props.structure) {
                      handleChange('structure', { ...props.structure, subtitle: val });
                    }
                  }}
                  placeholder="Ex: Performances certifiées et garanties exclusives"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Cartes Bento personnalisables si présentes */}
              {(props.cards || props.structure?.cards) && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Cartes & Éléments du Bloc ({((props.cards || props.structure?.cards) || []).length})</span>
                  </label>
                  <div className="space-y-3">
                    {((props.cards || props.structure?.cards) || []).map((card, cIdx) => (
                      <div key={cIdx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">Élément #{cIdx + 1}</span>
                          <input
                            type="text"
                            value={card.badge || ''}
                            onChange={(e) => {
                              const cardsList = [...((props.cards || props.structure?.cards) || [])];
                              cardsList[cIdx] = { ...cardsList[cIdx], badge: e.target.value };
                              handleChange('cards', cardsList);
                              if (props.structure) handleChange('structure', { ...props.structure, cards: cardsList });
                            }}
                            placeholder="Badge (ex: 100% Original)"
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-900 dark:text-white"
                          />
                        </div>
                        <input
                          type="text"
                          value={card.title || ''}
                          onChange={(e) => {
                            const cardsList = [...((props.cards || props.structure?.cards) || [])];
                            cardsList[cIdx] = { ...cardsList[cIdx], title: e.target.value };
                            handleChange('cards', cardsList);
                            if (props.structure) handleChange('structure', { ...props.structure, cards: cardsList });
                          }}
                          placeholder="Titre de la carte"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white font-bold"
                        />
                        <textarea
                          rows={2}
                          value={card.desc || ''}
                          onChange={(e) => {
                            const cardsList = [...((props.cards || props.structure?.cards) || [])];
                            cardsList[cIdx] = { ...cardsList[cIdx], desc: e.target.value };
                            handleChange('cards', cardsList);
                            if (props.structure) handleChange('structure', { ...props.structure, cards: cardsList });
                          }}
                          placeholder="Description de la carte"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          </BlockConfigErrorBoundary>

          {/* Modal Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0 bg-white dark:bg-slate-900">
            <button
              type="button"
              onClick={handleRequestClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-md active:scale-95 transition-all ${theme.btnPrimary}`}
            >
              <Check className="w-4 h-4" />
              <span>Appliquer les modifications</span>
            </button>
          </div>

        </form>

        {/* ⚠️ MODAL DE CONFIRMATION SI MODIFICATIONS NON SAUVEGARDÉES */}
        {showExitConfirm && (
          <div className="absolute inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 max-w-sm w-full space-y-4 text-center shadow-2xl transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center mx-auto shadow-sm">
                <AlertCircle className="w-6 h-6" />
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base">Enregistrer les modifications ?</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Vous avez modifié les paramètres de ce bloc. Voulez-vous sauvegarder avant de fermer ?
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={(e) => handleFormSubmit(e)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md ${theme.btnPrimary}`}
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer et Valider</span>
                </button>

                <button
                  type="button"
                  onClick={handleDiscardAndClose}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-300 border border-slate-200 dark:border-slate-700 font-semibold text-xs transition-colors"
                >
                  Ignorer les modifications
                </button>

                <button
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                  className="w-full py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold"
                >
                  Continuer l'édition
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
