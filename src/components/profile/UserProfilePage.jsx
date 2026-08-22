import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  User, 
  Store, 
  BarChart2, 
  Users, 
  ShieldCheck, 
  Camera, 
  Upload, 
  Check, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  Lock, 
  Sun, 
  Moon, 
  LogOut, 
  Sparkles, 
  ExternalLink, 
  Save, 
  AlertCircle,
  Plus,
  HelpCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { uploadImageToCloudinary } from '../../services/cloudinaryService';
import ProfileStatsAndAdsSection from './ProfileStatsAndAdsSection';

export default function UserProfilePage({ 
  onBackToMarketplace, 
  onOpenStorefront, 
  products = [] 
}) {
  const { 
    userProfile, 
    updateUserProfile, 
    vendor, 
    updateVendorShop, 
    logout, 
    firebaseUser 
  } = useAuth();
  
  const { themeMode, setThemeMode } = useTheme();
  const avatarInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  // Tabs : 'personal' | 'shop' | 'stats_ads' | 'team' | 'security'
  const [activeTab, setActiveTab] = useState('personal');

  // ── État Profil Personnel ──
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Douala');
  const [quarter, setQuarter] = useState('');
  const [avatar, setAvatar] = useState('');
  
  // ── État Boutique ──
  const [shopName, setShopName] = useState('');
  const [shopSlogan, setShopSlogan] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  const [shopPhone, setShopPhone] = useState('');
  const [shopCity, setShopCity] = useState('Douala');
  const [shopQuarter, setShopQuarter] = useState('');
  const [shopCategory, setShopCategory] = useState('electronique');
  const [shopLogo, setShopLogo] = useState('');
  const [shopBanner, setShopBanner] = useState('');

  // ── Notifications / Feedback & Uploads ──
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState(null); // 'avatar' | 'shopLogo' | 'shopBanner'

  // Synchronisation initiale
  useEffect(() => {
    setName(userProfile?.name || firebaseUser?.displayName || '');
    setPhone(userProfile?.phone || '');
    setCity(userProfile?.city || 'Douala');
    setQuarter(userProfile?.quarter || '');
    setAvatar(userProfile?.photoURL || firebaseUser?.photoURL || '');

    if (vendor) {
      setShopName(vendor.name || '');
      setShopSlogan(vendor.slogan || '');
      setShopDescription(vendor.description || '');
      setShopPhone(vendor.phone || '');
      setShopCity(vendor.city || 'Douala');
      setShopQuarter(vendor.quarter || '');
      setShopCategory(vendor.category || 'electronique');
      setShopLogo(vendor.logo_url || vendor.logo || '');
      setShopBanner(vendor.banner_url || vendor.banner || '');
    }
  }, [userProfile, vendor, firebaseUser]);

  // 🌟 Gestion des photos : Upload Cloudinary CDN direct avec synchronisation Cloud
  const handlePhotoUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField(type);
    setFeedback({ type: 'success', text: 'Téléversement de la photo vers Cloudinary...' });

    try {
      let folder = 'meetshop_avatars';
      if (type === 'shopLogo') folder = 'meetshop_logos';
      if (type === 'shopBanner') folder = 'meetshop_banners';

      const cdnUrl = await uploadImageToCloudinary(file, folder);

      if (type === 'avatar') {
        setAvatar(cdnUrl);
        if (updateUserProfile) {
          await updateUserProfile({ photoURL: cdnUrl });
        }
      } else if (type === 'shopLogo') {
        setShopLogo(cdnUrl);
        if (updateVendorShop) {
          await updateVendorShop({ logo_url: cdnUrl, logo: cdnUrl });
        }
      } else if (type === 'shopBanner') {
        setShopBanner(cdnUrl);
        if (updateVendorShop) {
          await updateVendorShop({ banner_url: cdnUrl, banner: cdnUrl });
        }
      }

      setFeedback({ type: 'success', text: 'Photo sauvegardée en temps réel sur Cloudinary & synchronisée !' });
      setTimeout(() => setFeedback({ type: '', text: '' }), 4000);
    } catch (err) {
      console.error('Erreur upload Cloudinary:', err);
      setFeedback({ type: 'error', text: 'Erreur lors du téléversement de la photo.' });
    } finally {
      setUploadingField(null);
      e.target.value = '';
    }
  };

  // Enregistrer le profil personnel
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (updateUserProfile) {
        await updateUserProfile({
          name: name.trim(),
          phone: phone.trim(),
          city,
          quarter: quarter.trim(),
          photoURL: avatar
        });
      }
      setFeedback({ type: 'success', text: 'Votre profil a été mis à jour avec succès !' });
      setTimeout(() => setFeedback({ type: '', text: '' }), 4000);
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', text: 'Erreur lors de la mise à jour du profil.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Enregistrer les informations de la boutique
  const handleSaveShop = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (updateVendorShop) {
        await updateVendorShop({
          name: shopName.trim(),
          slogan: shopSlogan.trim(),
          description: shopDescription.trim(),
          phone: shopPhone.trim(),
          city: shopCity,
          quarter: shopQuarter.trim(),
          category: shopCategory,
          logo_url: shopLogo,
          banner_url: shopBanner
        });
      }
      setFeedback({ type: 'success', text: 'Paramètres de la boutique enregistrés avec succès !' });
      setTimeout(() => setFeedback({ type: '', text: '' }), 4000);
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', text: 'Erreur lors de l\'enregistrement de la boutique.' });
    } finally {
      setIsSaving(false);
    }
  };

  const isMerchant = Boolean(vendor);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col transition-colors">
      
      {/* ═══════════════════════════════════════════════════════
          EN-TÊTE PLEINE PAGE DU PROFIL
         ═══════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Gauche : Retour marketplace & Profil */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onBackToMarketplace}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shrink-0 cursor-pointer"
              title="Retour à la Marketplace MeetShop"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-emerald-500/40 shrink-0">
                {avatar ? (
                  <img src={avatar} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-black text-sm text-emerald-600 dark:text-emerald-400">
                    {name ? name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h1 className="font-black text-sm sm:text-base text-slate-900 dark:text-white truncate flex items-center gap-2">
                  <span>{name || 'Mon Profil'}</span>
                  {isMerchant ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black border border-emerald-500/20">
                      BOUTIQUE PRO
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black border border-blue-500/20">
                      CLIENT CERTIFIÉ
                    </span>
                  )}
                </h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {firebaseUser?.email || userProfile?.email || 'Compte personnel'}
                </p>
              </div>
            </div>
          </div>

          {/* Droite : Switch Thème & Déconnexion */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              title={themeMode === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre'}
            >
              {themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {logout && (
              <button
                type="button"
                onClick={() => {
                  logout();
                  onBackToMarketplace?.();
                }}
                className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════
          BARRE D'ONGLETS DE NAVIGATION DU PROFIL
         ═══════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-14 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
          
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeTab === 'personal'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Informations Personnelles</span>
          </button>

          {isMerchant && (
            <button
              type="button"
              onClick={() => setActiveTab('shop')}
              className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                activeTab === 'shop'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Ma Boutique Pro</span>
            </button>
          )}

          {isMerchant && (
            <button
              type="button"
              onClick={() => setActiveTab('stats_ads')}
              className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                activeTab === 'stats_ads'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Statistiques & Publicités</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase">
                Boost
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sécurité & Thème</span>
          </button>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          CONTENU DE LA PAGE PAR ONGLET
         ═══════════════════════════════════════════════════════ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full space-y-6">
        
        {/* Message de notification / feedback */}
        {feedback.text && (
          <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
          }`}>
            {feedback.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* ── ONGLET 1 : INFORMATIONS PERSONNELLES ── */}
        {activeTab === 'personal' && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Mon Profil Personnel</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gérez vos informations de compte, coordonnées et adresse de livraison
              </p>
            </div>

            {/* Photo de profil */}
            <div className="flex flex-col sm:flex-row items-center gap-5 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 border-2 border-emerald-500 shrink-0 shadow-md">
                {uploadingField === 'avatar' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-black/40 text-emerald-400">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-black text-2xl text-emerald-600 dark:text-emerald-400">
                    {name ? name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                  title="Changer la photo"
                >
                  <Camera className="w-6 h-6" />
                </button>
              </div>

              <input
                type="file"
                ref={avatarInputRef}
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e, 'avatar')}
                className="hidden"
              />

              <div className="space-y-1.5 text-center sm:text-left">
                <h3 className="font-black text-sm text-slate-900 dark:text-white">Photo de profil officielle</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Téléversez votre propre photo depuis votre appareil (JPG, PNG, WebP) synchronisée sur Cloudinary CDN.
                </p>
                <div className="flex items-center gap-2 justify-center sm:justify-start pt-1">
                  <button
                    type="button"
                    disabled={uploadingField === 'avatar'}
                    onClick={() => avatarInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {uploadingField === 'avatar' ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{uploadingField === 'avatar' ? 'Envoi en cours...' : 'Changer ma photo'}</span>
                  </button>
                  {avatar && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatar('');
                        if (updateUserProfile) updateUserProfile({ photoURL: '' });
                      }}
                      className="px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-500/10 font-bold text-xs cursor-pointer transition-colors"
                    >
                      Retirer
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Formulaire des coordonnées */}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Adresse Email (Identifiant)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={firebaseUser?.email || userProfile?.email || 'Non renseigné'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs font-semibold cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Numéro WhatsApp / Téléphone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: 694116078"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Ville principale (Cameroun)
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="Douala">Douala</option>
                    <option value="Yaoundé">Yaoundé</option>
                    <option value="Bafoussam">Bafoussam</option>
                    <option value="Garoua">Garoua</option>
                    <option value="Bamenda">Bamenda</option>
                    <option value="Kribi">Kribi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Quartier / Adresse de livraison favorite
                </label>
                <input
                  type="text"
                  value={quarter}
                  onChange={(e) => setQuarter(e.target.value)}
                  placeholder="Ex: Bonamoussadi, Akwa, Bastos..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer mon profil</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── ONGLET 2 : MA BOUTIQUE PRO ── */}
        {activeTab === 'shop' && isMerchant && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Store className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Paramètres de {vendor.name}</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Code boutique : #{vendor.code} • Statut : En direct
                </p>
              </div>

              {onOpenStorefront && (
                <button
                  type="button"
                  onClick={() => onOpenStorefront(vendor)}
                  className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Voir ma vitrine Odoo Live</span>
                </button>
              )}
            </div>

            {/* Logo et Bannière depuis l'appareil */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Logo */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Logo Officiel</span>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 shrink-0 shadow-sm relative">
                    {uploadingField === 'shopLogo' ? (
                      <div className="w-full h-full flex items-center justify-center bg-black/40 text-emerald-400">
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </div>
                    ) : shopLogo ? (
                      <img src={shopLogo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-black text-emerald-600">
                        {shopName ? shopName.charAt(0).toUpperCase() : 'B'}
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={logoInputRef}
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, 'shopLogo')}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploadingField === 'shopLogo'}
                      onClick={() => logoInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {uploadingField === 'shopLogo' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      <span>{uploadingField === 'shopLogo' ? 'Envoi...' : 'Téléverser logo'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bannière */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Bannière de Couverture</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-14 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 shrink-0 shadow-sm relative">
                    {uploadingField === 'shopBanner' ? (
                      <div className="w-full h-full flex items-center justify-center bg-black/40 text-emerald-400">
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </div>
                    ) : shopBanner ? (
                      <img src={shopBanner} alt="Bannière" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                        Aucune
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={bannerInputRef}
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, 'shopBanner')}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploadingField === 'shopBanner'}
                      onClick={() => bannerInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {uploadingField === 'shopBanner' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      <span>{uploadingField === 'shopBanner' ? 'Envoi...' : 'Téléverser bannière'}</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Formulaire boutique */}
            <form onSubmit={handleSaveShop} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nom de la Boutique
                  </label>
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Slogan Commercial
                  </label>
                  <input
                    type="text"
                    value={shopSlogan}
                    onChange={(e) => setShopSlogan(e.target.value)}
                    placeholder="Ex: La référence mode & luxe à Douala"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Description de la Boutique
                </label>
                <textarea
                  rows={3}
                  value={shopDescription}
                  onChange={(e) => setShopDescription(e.target.value)}
                  placeholder="Présentez votre boutique, vos produits phares et votre engagement qualité..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    WhatsApp Commercial
                  </label>
                  <input
                    type="tel"
                    value={shopPhone}
                    onChange={(e) => setShopPhone(e.target.value)}
                    placeholder="694116078"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Ville
                  </label>
                  <select
                    value={shopCity}
                    onChange={(e) => setShopCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="Douala">Douala</option>
                    <option value="Yaoundé">Yaoundé</option>
                    <option value="Bafoussam">Bafoussam</option>
                    <option value="Kribi">Kribi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Quartier
                  </label>
                  <input
                    type="text"
                    value={shopQuarter}
                    onChange={(e) => setShopQuarter(e.target.value)}
                    placeholder="Akwa, Bastos..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer la boutique</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── ONGLET 3 : STATISTIQUES & PUBLICITÉS (FUSION STATS + BOOST ADS) ── */}
        {activeTab === 'stats_ads' && isMerchant && (
          <ProfileStatsAndAdsSection
            vendor={vendor}
            products={products}
            onOpenStorefront={onOpenStorefront}
          />
        )}

        {/* ── ONGLET 4 : SÉCURITÉ & THÈME ── */}
        {activeTab === 'security' && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Sécurité & Préférences d'Affichage</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personnalisez votre expérience visuelle et la protection de vos données
              </p>
            </div>

            {/* Mode Sombre / Mode Clair */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-white">Thème de l'interface</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Basculez entre le mode clair lumineux et le mode sombre élégant
                </p>
              </div>

              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200 dark:bg-slate-700">
                <button
                  type="button"
                  onClick={() => setThemeMode('light')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    themeMode === 'light'
                      ? 'bg-white text-slate-900 shadow-sm font-black'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Clair</span>
                </button>
                <button
                  type="button"
                  onClick={() => setThemeMode('dark')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    themeMode === 'dark'
                      ? 'bg-slate-900 text-white shadow-sm font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-blue-400" />
                  <span>Sombre</span>
                </button>
              </div>
            </div>

            {/* Sessions & Protection des Données */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white">Session Active</h3>
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Navigateur actuel : Connecté en continu</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Sécurisé SSL 256-bit</span>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
