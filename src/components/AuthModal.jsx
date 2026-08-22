import React, { useState, useEffect } from 'react';
import {
  X, Store, User, Mail, Lock, Eye, EyeOff, Phone, MapPin,
  ShieldCheck, Loader2, AlertCircle, ChevronRight, CheckCircle2, Sparkles, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ─── Icône Google SVG ──────────────────────────────────────────────────────
function GoogleIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// ─── Champ Input réutilisable ──────────────────────────────────────────────
function Field({ icon: Icon, label, type = 'text', value, onChange, placeholder, required, rightEl, disabled, helpText }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
        {helpText && <span className="text-[10px] text-slate-400">{helpText}</span>}
      </div>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full ${Icon ? 'pl-9' : 'pl-3'} ${rightEl ? 'pr-10' : 'pr-3'} py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all ${disabled ? 'opacity-70 cursor-not-allowed bg-slate-100 dark:bg-slate-800/40' : ''}`}
        />
        {rightEl}
      </div>
    </div>
  );
}

// ─── Bouton Google ─────────────────────────────────────────────────────────
function GoogleBtn({ onClick, loading, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin text-emerald-600" /> : <GoogleIcon className="w-4 h-4" />}
      <span>{label}</span>
    </button>
  );
}

// ─── Badge Utilisateur Google avec fallback propre ─────────────────────────
function GoogleUserBadge({ user, badgeText, badgeIcon: BadgeIcon = Store }) {
  const [imgError, setImgError] = useState(false);
  const initials = (user?.displayName || user?.email || 'U')
    .split(' ')
    .filter(Boolean)
    .map(p => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70">
      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm overflow-hidden border-2 border-emerald-400/40">
        {user?.photoURL && !imgError ? (
          <img
            src={user.photoURL}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-black text-slate-900 dark:text-emerald-200 truncate max-w-[170px]">
            {user?.displayName || 'Utilisateur'}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 dark:bg-emerald-800/80 text-[9px] font-black text-emerald-900 dark:text-emerald-100 uppercase tracking-wide">
            {badgeText}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{user?.email}</p>
      </div>
      <BadgeIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL AUTH MODAL AVEC ONBOARDING GOOGLE
// ═══════════════════════════════════════════════════════════════════════════
export default function AuthModal({ isOpen, onClose, defaultRole = 'client', defaultMode = 'signin', onShopCreated }) {
  const {
    signUpClient,
    signInClient,
    signUpVendor,
    signInVendor,
    signInWithGoogle,
    completeClientGoogleProfile,
    completeVendorGoogleProfile,
    findExistingVendorForUser,
    setVendor,
    setUserRole,
    authError,
    setAuthError
  } = useAuth();

  const [role, setRole] = useState(defaultRole); // 'client' | 'vendor'
  const [mode, setMode] = useState(defaultMode); // 'signin' | 'signup'
  
  // Étape : 'auth' (normal) | 'complete_client' | 'complete_vendor'
  const [step, setStep] = useState('auth');
  const [googleUser, setGoogleUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess] = useState('');

  // Champs de formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('Douala');
  const [quarter, setQuarter] = useState('');
  const [phone, setPhone] = useState('');
  const [shopCategory, setShopCategory] = useState('general');
  const [shopDescription, setShopDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      setRole(defaultRole);
      setMode(defaultMode);
      setStep('auth');
      setAuthError('');
      setSuccess('');
    }
  }, [isOpen, defaultRole, defaultMode]);

  if (!isOpen) return null;

  const resetFields = () => {
    setEmail('');
    setPassword('');
    setName('');
    setCity('Douala');
    setQuarter('');
    setPhone('');
    setShopCategory('general');
    setShopDescription('');
    setAuthError('');
    setSuccess('');
    setStep('auth');
    setGoogleUser(null);
  };

  const switchMode = (m) => { setMode(m); resetFields(); };
  const switchRole = (r) => { setRole(r); resetFields(); };

  // ─── Soumission Email / Mot de passe ─────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    setSuccess('');

    let result;
    if (mode === 'signup') {
      result = role === 'vendor'
        ? await signUpVendor({ email, password, shopName: name, city, quarter, phone })
        : await signUpClient({ email, password, name, city, phone });
    } else {
      result = role === 'vendor'
        ? await signInVendor({ email, password })
        : await signInClient({ email, password });
    }

    setLoading(false);
    if (result.success) {
      if (result.vendor && onShopCreated) {
        onShopCreated(result.vendor);
      }
      setSuccess(mode === 'signup' ? 'Compte créé avec succès !' : 'Connexion réussie !');
      setTimeout(() => { onClose(); resetFields(); }, 900);
    }
  };

  // ─── Connexion Google avec redirection vers formulaire complémentaire ───────
  const handleGoogle = async () => {
    setGoogleLoading(true);
    setAuthError('');
    const result = await signInWithGoogle(role);
    setGoogleLoading(false);

    if (result.success && result.user) {
      const gUser = result.user;
      setGoogleUser(gUser);

      if (role === 'vendor') {
        // Vérifier si cette boutique existe déjà
        const targetShop = result.vendor || await findExistingVendorForUser(gUser.uid, gUser.email);
        if (targetShop) {
          if (setVendor) setVendor(targetShop);
          if (setUserRole) setUserRole('vendor');
          localStorage.setItem('meetshop_vendor', JSON.stringify(targetShop));
          localStorage.setItem('meetshop_role', 'vendor');
          if (onShopCreated) onShopCreated(targetShop);
          setSuccess(`Boutique "${targetShop.name}" connectée avec succès !`);
          setTimeout(() => { onClose(); resetFields(); }, 800);
          return;
        }
        // Sinon, rediriger vers l'étape de configuration de la boutique
        setName(gUser.displayName ? `${gUser.displayName} Store` : 'Ma Boutique');
        setEmail(gUser.email || '');
        setStep('complete_vendor');
      } else {
        // Client : Vérifier si le numéro de téléphone est déjà renseigné
        const savedUser = JSON.parse(localStorage.getItem('meetshop_user') || '{}');
        if (savedUser.phone && savedUser.city) {
          setSuccess('Connecté avec Google !');
          setTimeout(() => { onClose(); resetFields(); }, 800);
          return;
        }
        // Sinon, rediriger vers l'étape d'informations complémentaires
        setName(gUser.displayName || '');
        setEmail(gUser.email || '');
        setStep('complete_client');
      }
    }
  };

  // ─── Finalisation Profil Client après Google ─────────────────────────────
  const handleCompleteClient = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    
    const res = await completeClientGoogleProfile({
      name: name.trim(),
      phone: phone.trim(),
      city,
      quarter: quarter.trim()
    });

    setLoading(false);
    if (res.success) {
      setSuccess('Profil complété avec succès ! Bienvenue sur MeetShop.');
      setTimeout(() => { onClose(); resetFields(); }, 900);
    }
  };

  // ─── Finalisation Boutique après Google ──────────────────────────────────
  const handleCompleteVendor = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');

    const res = await completeVendorGoogleProfile({
      shopName: name.trim(),
      phone: phone.trim(),
      city,
      quarter: quarter.trim(),
      description: description.trim(),
      category
    });

    setLoading(false);
    if (res.success) {
      if (res.vendor && onShopCreated) {
        onShopCreated(res.vendor);
      }
      setSuccess(`Boutique "${name}" créée avec succès !`);
      setTimeout(() => { onClose(); resetFields(); }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-900/30 overflow-hidden border border-slate-200 dark:border-slate-800 animate-slideUp">

        {/* ─── Header Banner ─────────────────────────────────────────────── */}
        <div className="relative px-6 pt-6 pb-5 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Logo & Titre */}
          <div className="flex items-center gap-2.5 mb-4">
            <img
              src="/logo-dark.png"
              alt="MeetShop Logo"
              className="w-9 h-9 object-contain drop-shadow-md"
            />
            <div>
              <div className="font-black text-white text-lg leading-none">MeetShop</div>
              <div className="text-emerald-100 text-[10px] font-semibold uppercase tracking-widest">Marketplace Cameroun</div>
            </div>
          </div>

          {/* Switch Role (uniquement à l'étape 'auth') */}
          {step === 'auth' ? (
            <div className="flex items-center p-1 rounded-2xl bg-white/15 backdrop-blur-sm gap-1">
              <button
                onClick={() => switchRole('client')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all ${
                  role === 'client'
                    ? 'bg-white text-emerald-700 shadow-md'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Client</span>
              </button>
              <button
                onClick={() => switchRole('vendor')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all ${
                  role === 'vendor'
                    ? 'bg-white text-emerald-700 shadow-md'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Boutique</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 py-1 text-white">
              <button
                type="button"
                onClick={() => setStep('auth')}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors mr-1"
                title="Retour"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-100">Étape 2 / 2</p>
                <h4 className="text-sm font-black text-white">
                  {step === 'complete_vendor' ? 'Configuration de votre Boutique' : 'Informations complémentaires'}
                </h4>
              </div>
            </div>
          )}
        </div>

        {/* ─── Body ───────────────────────────────────────────────────────── */}
        <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">

          {/* ════════════════════════════════════════════════════════════════
              ÉTAPE 1 : CONNEXION / INSCRIPTION STANDARD
             ════════════════════════════════════════════════════════════════ */}
          {step === 'auth' && (
            <>
              {/* Tabs Connexion / Inscription */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                <button
                  onClick={() => switchMode('signin')}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                    mode === 'signin'
                      ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  Se connecter
                </button>
                <button
                  onClick={() => switchMode('signup')}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                    mode === 'signup'
                      ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {role === 'vendor' ? 'Créer ma boutique' : 'S\'inscrire'}
                </button>
              </div>

              {/* Bouton Google */}
              <GoogleBtn
                onClick={handleGoogle}
                loading={googleLoading}
                label={mode === 'signup'
                  ? (role === 'vendor' ? 'Créer avec Google' : 'S\'inscrire avec Google')
                  : 'Continuer avec Google'
                }
              />

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">ou par email</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              </div>

              {/* Formulaire Email/Password */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {mode === 'signup' && (
                  <Field
                    icon={role === 'vendor' ? Store : User}
                    label={role === 'vendor' ? 'Nom de la boutique' : 'Votre prénom et nom'}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={role === 'vendor' ? 'Ex: ZOKOSTORE, MaBoutique...' : 'Ex: Marie Dupont'}
                    required
                  />
                )}

                {mode === 'signup' && role === 'client' && (
                  <Field
                    icon={Phone}
                    label="Numéro WhatsApp"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+237 6XX XXX XXX"
                    required
                  />
                )}

                <Field
                  icon={Mail}
                  label="Adresse email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                />

                <Field
                  icon={Lock}
                  label="Mot de passe"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Minimum 6 caractères' : '••••••••'}
                  required
                  rightEl={
                    <button
                      type="button"
                      onClick={() => setShowPass(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />

                {mode === 'signup' && role === 'vendor' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <Field
                        icon={MapPin}
                        label="Ville"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="Douala / Yaoundé"
                      />
                      <Field
                        label="Quartier"
                        value={quarter}
                        onChange={e => setQuarter(e.target.value)}
                        placeholder="Akwa, Bastos..."
                      />
                    </div>
                    <Field
                      icon={Phone}
                      label="WhatsApp boutique"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+237 6XX XXX XXX"
                      required
                    />
                  </>
                )}

                {/* Messages Erreur / Succès */}
                {authError && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{authError}</p>
                  </div>
                )}

                {success && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{success}</p>
                  </div>
                )}

                {/* Bouton Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {mode === 'signup'
                        ? (role === 'vendor' ? <Store className="w-4 h-4" /> : <User className="w-4 h-4" />)
                        : <ChevronRight className="w-4 h-4" />
                      }
                      <span>
                        {mode === 'signup'
                          ? (role === 'vendor' ? 'Créer ma boutique' : 'Créer mon compte')
                          : 'Se connecter'
                        }
                      </span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* ════════════════════════════════════════════════════════════════
              ÉTAPE 2 : INFORMATIONS COMPLÉMENTAIRES GOOGLE - CLIENT
             ════════════════════════════════════════════════════════════════ */}
          {step === 'complete_client' && (
            <form onSubmit={handleCompleteClient} className="space-y-3.5">
              
              {/* Badge Compte Google vérifié */}
              <GoogleUserBadge user={googleUser} badgeText="Google" badgeIcon={CheckCircle2} />

              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 p-2.5 rounded-xl">
                <p className="text-[11px] text-amber-800 dark:text-amber-300 font-medium leading-relaxed">
                  Renseignez votre numéro WhatsApp pour recevoir vos notifications de commande et le suivi de livraison en temps réel.
                </p>
              </div>

              <Field
                icon={User}
                label="Nom complet"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Votre nom complet"
                required
              />

              <Field
                icon={Phone}
                label="Numéro WhatsApp de livraison"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+237 6XX XXX XXX"
                required
                helpText="Requis pour vos livraisons"
              />

              <div className="grid grid-cols-2 gap-3">
                <Field
                  icon={MapPin}
                  label="Ville"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Douala / Yaoundé"
                  required
                />
                <Field
                  label="Quartier"
                  value={quarter}
                  onChange={e => setQuarter(e.target.value)}
                  placeholder="Akwa, Bonapriso..."
                  required
                />
              </div>

              {authError && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{authError}</p>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{success}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Finaliser mon profil & Continuer</span>
              </button>
            </form>
          )}

          {/* ════════════════════════════════════════════════════════════════
              ÉTAPE 2 : CONFIGURATION DE LA BOUTIQUE GOOGLE - VENDOR
             ════════════════════════════════════════════════════════════════ */}
          {step === 'complete_vendor' && (
            <form onSubmit={handleCompleteVendor} className="space-y-3.5">
              
              {/* Badge Compte Google Propriétaire */}
              <GoogleUserBadge user={googleUser} badgeText="Propriétaire" badgeIcon={Store} />

              <Field
                icon={Store}
                label="Nom commercial de la boutique"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Douala Tech, Fashion Style..."
                required
              />

              <Field
                icon={Phone}
                label="Numéro WhatsApp de la boutique"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+237 6XX XXX XXX"
                required
                helpText="Pour recevoir les commandes clients"
              />

              <div className="grid grid-cols-2 gap-3">
                <Field
                  icon={MapPin}
                  label="Ville principale"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Douala / Yaoundé"
                  required
                />
                <Field
                  label="Quartier / Marché"
                  value={quarter}
                  onChange={e => setQuarter(e.target.value)}
                  placeholder="Akwa, Marché Central..."
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Catégorie d'activité
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-all"
                >
                  <option value="general">Général & Multimédia</option>
                  <option value="electronique">Électronique & Smartphones</option>
                  <option value="mode">Mode & Vêtements</option>
                  <option value="beaute">Beauté & Cosmétiques</option>
                  <option value="maison">Maison & Électroménager</option>
                  <option value="alimentaire">Alimentation & Épicerie</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Courte description de la boutique
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Ex: Vente de téléphones et accessoires neufs avec garantie 1 an à Akwa..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>

              {authError && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{authError}</p>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{success}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Store className="w-4 h-4" />}
                <span>Ouvrir ma boutique sur MeetShop</span>
              </button>
            </form>
          )}

        </div>

        {/* ─── Footer ────────────────────────────────────────────────────── */}
        <div className="px-6 pb-5 text-center border-t border-slate-100 dark:border-slate-800/60 pt-3">
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            En vous inscrivant, vous acceptez les{' '}
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold cursor-pointer hover:underline">
              Conditions d'utilisation
            </span>{' '}
            de MeetShop Cameroun.
          </p>
        </div>

      </div>
    </div>
  );
}
