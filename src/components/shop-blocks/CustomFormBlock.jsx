import React, { useState } from 'react';
import { 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  User, 
  Phone, 
  MapPin, 
  Sparkles, 
  AlertCircle,
  FileQuestion,
  MessageCircle,
  Zap
} from 'lucide-react';
import { getTheme } from '../../config/themes';
import { getDesignVariant } from '../../config/blockDesignStyles';
import { useAuth } from '../../context/AuthContext';
import { submitFormResponse, formatWhatsAppFormSubmission } from '../../services/formsService';
import { getButtonClasses } from '../../config/blockStyles';

export default function CustomFormBlock({ block, shop, themeId, isMobilePreview = false }) {
  const theme = getTheme(themeId);
  const props = block?.props || {};
  const dv = getDesignVariant(props.designVariant || 'modern_minimal');
  const { userProfile, firebaseUser } = useAuth();

  const title = props.title || 'Besoin d\'un renseignement ou d\'un devis ?';
  const subtitle = props.subtitle || 'Répondez à ces questions pour recevoir notre meilleure proposition';
  const submitButtonText = props.submitButtonText || 'Envoyer ma demande sur WhatsApp';
  const rawQuestions = Array.isArray(props.questions) ? props.questions : [];
  const questions = rawQuestions.map((q, idx) => {
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
  const collectContactInfo = props.collectContactInfo !== false;

  const styleVariant = props.styleVariant || 'modern_stepped';
  const buttonStyle = props.buttonStyle || 'modern_rounded';
  const primaryButtonClass = getButtonClasses(buttonStyle, theme, 'primary');

  // Form State
  const [formData, setFormData] = useState({});
  const [customerName, setCustomerName] = useState(userProfile?.name || firebaseUser?.displayName || '');
  const [customerPhone, setCustomerPhone] = useState(userProfile?.phone || '');
  const [customerCity, setCustomerCity] = useState(userProfile?.city || shop?.city || 'Douala');
  const [customerQuarter, setCustomerQuarter] = useState(userProfile?.quarter || '');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (questionId, value) => {
    setFormData(prev => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxChange = (questionId, option) => {
    setFormData(prev => {
      const currentList = Array.isArray(prev[questionId]) ? prev[questionId] : [];
      if (currentList.includes(option)) {
        return { ...prev, [questionId]: currentList.filter(o => o !== option) };
      } else {
        return { ...prev, [questionId]: [...currentList, option] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation des champs obligatoires
    for (const q of questions) {
      if (q.required) {
        const val = formData[q.id];
        if (!val || (Array.isArray(val) && val.length === 0) || (typeof val === 'string' && !val.trim())) {
          setErrorMsg(`Veuillez répondre à la question : "${q.label}"`);
          return;
        }
      }
    }

    if (collectContactInfo && (!customerName.trim() || !customerPhone.trim())) {
      setErrorMsg('Veuillez renseigner votre nom et votre numéro de téléphone.');
      return;
    }

    // Préparer les réponses formatées
    const formattedAnswers = questions.map(q => {
      let rawVal = formData[q.id];
      let answerText = 'Non précisé';
      if (Array.isArray(rawVal)) {
        answerText = rawVal.join(', ');
      } else if (rawVal !== undefined && rawVal !== null) {
        answerText = String(rawVal);
      }
      return {
        questionId: q.id,
        question: q.label,
        answer: answerText
      };
    });

    const customerInfo = {
      name: customerName.trim(),
      phone: customerPhone.trim(),
      city: customerCity,
      quarter: customerQuarter.trim()
    };

    // 1. Enregistrer dans la base locale / Dashboard Vendeur
    submitFormResponse({
      shopId: shop?.id || shop?.code || 'default',
      shopName: shop?.name || 'Boutique Partenaire',
      formTitle: title,
      answers: formattedAnswers,
      customerInfo
    });

    // 2. Générer et ouvrir WhatsApp
    const { url } = formatWhatsAppFormSubmission({
      shopPhone: shop?.phone || shop?.vendorPhone || '+237699123456',
      shopName: shop?.name || 'Boutique Partenaire',
      formTitle: title,
      customerInfo,
      answers: formattedAnswers
    });

    window.open(url, '_blank');
    setIsSubmitted(true);
  };

  return (
    <section className={`p-4 sm:p-8 mb-6 sm:mb-8 transition-all duration-300 ${dv.containerClass}`}>
      
      {/* En-tête du questionnaire */}
      <div className="mb-6 pb-4 border-b border-current/15 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 justify-center sm:justify-start">
            <div className={`p-2 rounded-2xl border ${dv.accentBadgeClass || theme.badge}`}>
              <HelpCircle className="w-5 h-5" />
            </div>
            <h2 className={`text-lg sm:text-2xl font-black tracking-tight ${dv.headerClass}`}>
              {title}
            </h2>
          </div>
          <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${dv.accentBadgeClass || theme.badge} self-center sm:self-auto flex items-center gap-1.5`}>
            <Zap className="w-3.5 h-3.5" />
            <span>Réponse Express</span>
          </span>
        </div>
        <p className={`text-xs mt-1.5 opacity-90 ${dv.subTextClass}`}>{subtitle}</p>
      </div>

      {isSubmitted ? (
        <div className="py-10 text-center space-y-4 animate-fadeIn">
          <div className={`w-16 h-16 rounded-3xl ${theme.badge} flex items-center justify-center mx-auto shadow-lg`}>
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-current">
            Demande Transmise avec Succès !
          </h3>
          <p className="text-xs opacity-75 max-w-md mx-auto text-current">
            Vos réponses ont été transmises sur WhatsApp à <strong>{shop?.name || 'la boutique'}</strong> et enregistrées dans son espace commerçant.
          </p>
          <button
            type="button"
            onClick={() => {
              setFormData({});
              setIsSubmitted(false);
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${dv.buttonClass || theme.btnPrimary}`}
          >
            Remplir un nouveau formulaire
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2 border border-rose-500/30">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Coordonnées Client (si activé) */}
          {collectContactInfo && (
            <div className={`p-4 rounded-2xl border space-y-3 ${dv.cardInnerClass || 'bg-slate-50 dark:bg-slate-950/70 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800'}`}>
              <span className="text-xs font-black text-current block">
                Vos Coordonnées de Contact
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-current opacity-85 mb-1">
                    Votre Nom *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Jean Dupont"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={`w-full bg-black/5 dark:bg-white/10 border border-current/20 rounded-xl px-3 py-2 text-current placeholder-current/50 focus:outline-none ${theme.inputFocus}`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-current opacity-85 mb-1">
                    Numéro WhatsApp / Téléphone *
                  </label>
                  <input
                    type="tel"
                    placeholder="Ex: 699123456"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className={`w-full bg-black/5 dark:bg-white/10 border border-current/20 rounded-xl px-3 py-2 text-current placeholder-current/50 focus:outline-none ${theme.inputFocus} font-mono`}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Liste des questions personnalisées */}
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={q.id || idx} className="space-y-1.5 text-xs">
                <label className="block font-bold text-current">
                  <span>{idx + 1}. {q.label}</span>
                  {q.required && <span className="text-rose-500 ml-1">*</span>}
                </label>

                {/* Champ Type: TEXT */}
                {q.type === 'text' && (
                  <input
                    type="text"
                    placeholder={q.placeholder || 'Votre réponse...'}
                    value={formData[q.id] || ''}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    className={`w-full bg-black/5 dark:bg-white/10 border border-current/20 rounded-xl px-3.5 py-2.5 text-current placeholder-current/50 focus:outline-none ${theme.inputFocus}`}
                    required={q.required}
                  />
                )}

                {/* Champ Type: TEXTAREA */}
                {q.type === 'textarea' && (
                  <textarea
                    rows={3}
                    placeholder={q.placeholder || 'Détaillez votre demande...'}
                    value={formData[q.id] || ''}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    className={`w-full bg-black/5 dark:bg-white/10 border border-current/20 rounded-xl px-3.5 py-2.5 text-current placeholder-current/50 focus:outline-none ${theme.inputFocus}`}
                    required={q.required}
                  />
                )}

                {/* Champ Type: SELECT */}
                {q.type === 'select' && (
                  <select
                    value={formData[q.id] || ''}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    className={`w-full bg-black/5 dark:bg-white/10 border border-current/20 rounded-xl px-3.5 py-2.5 text-current focus:outline-none ${theme.inputFocus}`}
                    required={q.required}
                  >
                    <option value="" className="bg-slate-900 text-white">Sélectionnez une option...</option>
                    {(q.options || []).map((opt, optIdx) => (
                      <option key={optIdx} value={opt} className="bg-slate-900 text-white">{opt}</option>
                    ))}
                  </select>
                )}

                {/* Champ Type: RADIO (Choix Unique) */}
                {q.type === 'radio' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {(q.options || []).map((opt, optIdx) => {
                      const isSelected = formData[q.id] === opt;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleInputChange(q.id, opt)}
                          className={`p-3 rounded-xl border text-left font-bold transition-all flex items-center gap-2.5 ${
                            isSelected
                              ? `${theme.badge} shadow-sm font-black`
                              : 'bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? `${theme.accentBorder} ${theme.accentBg}` : 'border-slate-400'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Champ Type: CHECKBOX (Choix Multiple) */}
                {q.type === 'checkbox' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {(q.options || []).map((opt, optIdx) => {
                      const currentSelected = Array.isArray(formData[q.id]) ? formData[q.id] : [];
                      const isChecked = currentSelected.includes(opt);
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleCheckboxChange(q.id, opt)}
                          className={`p-3 rounded-xl border text-left font-bold transition-all flex items-center gap-2.5 ${
                            isChecked
                              ? `${theme.badge} shadow-sm font-black`
                              : 'bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                            isChecked ? `${theme.accentBorder} ${theme.accentBg} text-white` : 'border-slate-400'
                          }`}>
                            {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

              </div>
            ))}
          </div>

          {/* Bouton de soumission */}
          <div className="pt-3">
            <button
              type="submit"
              className={`w-full py-3.5 text-xs sm:text-sm active:scale-98 transition-all flex items-center justify-center gap-2 ${primaryButtonClass}`}
            >
              <Send className="w-4 h-4" />
              <span>{submitButtonText}</span>
            </button>
          </div>

        </form>
      )}

    </section>
  );
}
