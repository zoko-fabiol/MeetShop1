import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Store, 
  Users, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Camera, 
  CheckCircle2, 
  Sun, 
  Moon, 
  Palette, 
  Plus, 
  Trash2, 
  Edit3, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus, 
  UserCheck, 
  CheckSquare, 
  Square, 
  Save, 
  LogOut, 
  Sparkles, 
  Upload, 
  Sliders, 
  Tag, 
  Package, 
  Percent, 
  Layout, 
  BarChart2, 
  Layers, 
  ChevronRight,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { uploadImageToCloudinary } from '../services/cloudinaryService';

const CITIES_LIST = [
  'Douala',
  'Yaoundé',
  'Bafoussam',
  'Kribi',
  'Garoua',
  'Bamenda',
  'Buea',
  'Limbe',
  'Maroua',
  'Ngaoundéré',
  'Bertoua',
  'Dschang'
];

const ROLE_TEMPLATES = {
  admin: {
    label: 'Administrateur',
    description: 'Accès total sans restriction à tous les onglets',
    permissions: {
      products: { view: true, add: true, edit: true, delete: true },
      wholesale: { view: true, edit: true },
      builder: { view: true, edit: true },
      orders_crm: { view: true, edit: true, delete: true },
      stats_ads: { view: true, launch: true }
    }
  },
  stock_manager: {
    label: 'Gestionnaire de Stock',
    description: 'Gère les articles et l\'inventaire sans accès aux finances',
    permissions: {
      products: { view: true, add: true, edit: true, delete: false },
      wholesale: { view: true, edit: false },
      builder: { view: true, edit: false },
      orders_crm: { view: true, edit: false, delete: false },
      stats_ads: { view: false, launch: false }
    }
  },
  sales_agent: {
    label: 'Vendeur / Caissier',
    description: 'Consulte les articles et traite les commandes clients',
    permissions: {
      products: { view: true, add: false, edit: false, delete: false },
      wholesale: { view: true, edit: false },
      builder: { view: false, edit: false },
      orders_crm: { view: true, edit: true, delete: false },
      stats_ads: { view: false, launch: false }
    }
  },
  delivery_agent: {
    label: 'Livreur',
    description: 'Accède uniquement aux coordonnées et statuts de livraison',
    permissions: {
      products: { view: true, add: false, edit: false, delete: false },
      wholesale: { view: false, edit: false },
      builder: { view: false, edit: false },
      orders_crm: { view: true, edit: true, delete: false },
      stats_ads: { view: false, launch: false }
    }
  },
  custom: {
    label: 'Personnalisé',
    description: 'Définissez manuellement les accès et actions autorisées',
    permissions: {
      products: { view: true, add: false, edit: false, delete: false },
      wholesale: { view: false, edit: false },
      builder: { view: false, edit: false },
      orders_crm: { view: false, edit: false, delete: false },
      stats_ads: { view: false, launch: false }
    }
  }
};

export default function ProfileModal({ isOpen, onClose, onOpenVendorModal, onOpenStorefront }) {
  const { userProfile, updateUserProfile, vendor, updateVendorShop, logout, firebaseUser, userRole } = useAuth();
  const { themeMode, setThemeMode } = useTheme();

  // Navigation interne par onglets : 'personal' | 'shop' | 'team' | 'security'
  const [activeTab, setActiveTab] = useState('personal');

  // ── État Formulaire Profil Personnel ──
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Douala');
  const [quarter, setQuarter] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // ── État Formulaire Boutique (si vendeur) ──
  const [shopName, setShopName] = useState('');
  const [shopSlogan, setShopSlogan] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  const [shopPhone, setShopPhone] = useState('');
  const [shopCity, setShopCity] = useState('Douala');
  const [shopQuarter, setShopQuarter] = useState('');
  const [shopCategory, setShopCategory] = useState('electronique');
  const [shopLogo, setShopLogo] = useState('');
  const [shopBanner, setShopBanner] = useState('');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  // ── État Gestion des Comptes Associés & Équipe ──
  const [teamMembers, setTeamMembers] = useState(() => {
    try {
      const saved = localStorage.getItem(`meetshop_team_${vendor?.id || vendor?.code || 'default'}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal / Formulaire d'ajout/édition de membre d'équipe
  const [editingMember, setEditingMember] = useState(null); // null = mode liste, object = en cours d'édition
  const [memberForm, setMemberForm] = useState({
    name: '',
    email: '',
    phone: '',
    roleKey: 'stock_manager',
    status: 'active',
    permissions: ROLE_TEMPLATES.stock_manager.permissions
  });

  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });
  const [copiedId, setCopiedId] = useState(null);

  // Synchronisation des états à l'ouverture
  useEffect(() => {
    if (isOpen) {
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
        setShopLogo(vendor.logo || vendor.logo_url || '');
        setShopBanner(vendor.banner || vendor.banner_url || '');

        try {
          const savedTeam = localStorage.getItem(`meetshop_team_${vendor.id || vendor.code}`);
          if (savedTeam) setTeamMembers(JSON.parse(savedTeam));
        } catch (e) {}
      }
    }
  }, [isOpen, userProfile, vendor, firebaseUser]);

  if (!isOpen) return null;

  const showFeedback = (text, type = 'success') => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg({ type: '', text: '' }), 3500);
  };

  // Téléversement d'Avatar Photo de Profil
  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    try {
      const url = await uploadImageToCloudinary(file, 'meetshop_avatars');
      if (url) {
        setAvatar(url);
        updateUserProfile({ photoURL: url });
        showFeedback('Photo de profil mise à jour avec succès !');
      }
    } catch (err) {
      showFeedback('Erreur lors du téléversement de la photo', 'error');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Téléversement Logo Boutique
  const handleLogoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    try {
      const url = await uploadImageToCloudinary(file, 'meetshop_logos');
      if (url) {
        setShopLogo(url);
        if (updateVendorShop) {
          updateVendorShop({ logo: url, logo_url: url });
        }
        showFeedback('Logo de la boutique mis à jour !');
      }
    } catch (err) {
      showFeedback('Erreur de téléversement du logo', 'error');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Téléversement Bannière Boutique
  const handleBannerFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingBanner(true);
    try {
      const url = await uploadImageToCloudinary(file, 'meetshop_banners');
      if (url) {
        setShopBanner(url);
        if (updateVendorShop) {
          updateVendorShop({ banner: url, banner_url: url });
        }
        showFeedback('Bannière de la boutique mise à jour !');
      }
    } catch (err) {
      showFeedback('Erreur de téléversement de la bannière', 'error');
    } finally {
      setIsUploadingBanner(false);
    }
  };

  // Enregistrer le profil personnel
  const handleSavePersonal = (e) => {
    e.preventDefault();
    updateUserProfile({
      name,
      phone,
      city,
      quarter,
      photoURL: avatar
    });
    showFeedback('Profil personnel enregistré avec succès !');
  };

  // Enregistrer les informations de la boutique
  const handleSaveShop = async (e) => {
    e.preventDefault();
    if (!vendor) return;

    const updates = {
      name: shopName,
      slogan: shopSlogan,
      description: shopDescription,
      phone: shopPhone,
      city: shopCity,
      quarter: shopQuarter,
      category: shopCategory,
      logo: shopLogo,
      logo_url: shopLogo,
      banner: shopBanner,
      banner_url: shopBanner
    };

    if (updateVendorShop) {
      await updateVendorShop(updates);
    }
    showFeedback('Informations de la boutique synchronisées avec succès !');
  };

  // ── GESTION DES COMPTES ASSOCIÉS / ÉQUIPE ──
  const handleStartAddMember = () => {
    setMemberForm({
      id: `USR-${Date.now().toString().slice(-6)}`,
      name: '',
      email: '',
      phone: '',
      roleKey: 'stock_manager',
      status: 'active',
      permissions: JSON.parse(JSON.stringify(ROLE_TEMPLATES.stock_manager.permissions))
    });
    setEditingMember('new');
  };

  const handleStartEditMember = (member) => {
    setMemberForm({
      ...member,
      permissions: JSON.parse(JSON.stringify(member.permissions || ROLE_TEMPLATES.custom.permissions))
    });
    setEditingMember(member.id);
  };

  const handleRoleTemplateChange = (roleKey) => {
    const template = ROLE_TEMPLATES[roleKey];
    setMemberForm(prev => ({
      ...prev,
      roleKey,
      permissions: template ? JSON.parse(JSON.stringify(template.permissions)) : prev.permissions
    }));
  };

  const handleTogglePermission = (tabKey, actionKey) => {
    setMemberForm(prev => {
      const nextPerms = { ...prev.permissions };
      if (!nextPerms[tabKey]) nextPerms[tabKey] = {};
      nextPerms[tabKey][actionKey] = !nextPerms[tabKey][actionKey];
      return {
        ...prev,
        roleKey: 'custom',
        permissions: nextPerms
      };
    });
  };

  const handleSaveMember = (e) => {
    e.preventDefault();
    if (!memberForm.name.trim() || !memberForm.email.trim()) {
      showFeedback('Le nom et l\'adresse email sont obligatoires', 'error');
      return;
    }

    let updatedList;
    if (editingMember === 'new') {
      const newMember = {
        ...memberForm,
        id: memberForm.id || `USR-${Date.now().toString().slice(-6)}`,
        addedAt: new Date().toISOString()
      };
      updatedList = [newMember, ...teamMembers];
      showFeedback(`Compte associé "${newMember.name}" créé avec succès !`);
    } else {
      updatedList = teamMembers.map(m => m.id === editingMember ? { ...m, ...memberForm } : m);
      showFeedback(`Permissions de "${memberForm.name}" mises à jour !`);
    }

    setTeamMembers(updatedList);
    if (vendor) {
      localStorage.setItem(`meetshop_team_${vendor.id || vendor.code}`, JSON.stringify(updatedList));
    }
    setEditingMember(null);
  };

  const handleDeleteMember = (memberId) => {
    if (window.confirm('Voulez-vous vraiment retirer l\'accès à ce compte associé ?')) {
      const updatedList = teamMembers.filter(m => m.id !== memberId);
      setTeamMembers(updatedList);
      if (vendor) {
        localStorage.setItem(`meetshop_team_${vendor.id || vendor.code}`, JSON.stringify(updatedList));
      }
      showFeedback('Compte associé supprimé de l\'équipe.');
    }
  };

  const handleToggleMemberStatus = (memberId) => {
    const updatedList = teamMembers.map(m => {
      if (m.id === memberId) {
        const nextStatus = m.status === 'active' ? 'suspended' : 'active';
        return { ...m, status: nextStatus };
      }
      return m;
    });
    setTeamMembers(updatedList);
    if (vendor) {
      localStorage.setItem(`meetshop_team_${vendor.id || vendor.code}`, JSON.stringify(updatedList));
    }
    showFeedback('Statut d\'accès du compte modifié.');
  };

  const handleCopyAccessCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl transition-colors">
        
        {/* ── HEADER PRINCIPAL ── */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              {avatar ? (
                <img 
                  src={avatar} 
                  alt={name || 'Avatar'} 
                  onError={(e) => { e.target.style.display = 'none'; }}
                  className="w-10 h-10 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-500/30 flex items-center justify-center font-black text-sm shadow-sm">
                  {name ? name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 dark:text-white text-base sm:text-lg">
                  {name || 'Mon Espace Compte'}
                </h3>
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${
                  vendor 
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                }`}>
                  {vendor ? 'Boutique Pro' : 'Client Acheteur'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {firebaseUser?.email || userProfile?.email || 'Compte MeetShop'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── MESSAGE DE FEEDBACK / SUCCÈS ── */}
        {feedbackMsg.text && (
          <div className={`px-5 py-2.5 flex items-center gap-2 text-xs font-bold shrink-0 transition-all ${
            feedbackMsg.type === 'error'
              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-b border-rose-500/30'
              : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-b border-emerald-500/30'
          }`}>
            {feedbackMsg.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* ── BARRE D'ONGLETS HORIZONTALE ── */}
        <div className="px-5 py-2 bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          
          {/* Onglet 1: Profil Personnel */}
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'personal'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Informations Personnelles</span>
          </button>

          {/* Onglet 2: Ma Boutique (si Boutique/Vendeur) */}
          {vendor && (
            <button
              type="button"
              onClick={() => setActiveTab('shop')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                activeTab === 'shop'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Ma Boutique</span>
            </button>
          )}

          {/* Onglet 3: Comptes Associés & Équipe (RBAC) */}
          {vendor && (
            <button
              type="button"
              onClick={() => setActiveTab('team')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                activeTab === 'team'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Comptes Associés & Rôles ({teamMembers.length})</span>
            </button>
          )}

          {/* Onglet 4: Préférences & Sécurité */}
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'security'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sécurité & Thème</span>
          </button>
        </div>

        {/* ── CONTENU DE L'ONGLET SÉLECTIONNÉ ── */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* ========================================================= */}
          {/* 1. INFORMATIONS PERSONNELLES                                */}
          {/* ========================================================= */}
          {activeTab === 'personal' && (
            <form onSubmit={handleSavePersonal} className="space-y-6">
              
              {/* Photo de profil (uniquement photo importée) */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-5">
                <div className="relative shrink-0">
                  {avatar ? (
                    <img 
                      src={avatar} 
                      alt="Profil" 
                      onError={(e) => { e.target.style.display = 'none'; }}
                      className="w-20 h-20 rounded-3xl object-cover border-2 border-emerald-500 shadow-md" 
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-3xl bg-emerald-500/15 dark:bg-emerald-500/20 border-2 border-dashed border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex flex-col items-center justify-center font-black text-xl shadow-inner">
                      {name ? name.charAt(0).toUpperCase() : <User className="w-8 h-8 opacity-60" />}
                    </div>
                  )}
                  <label 
                    className="absolute -bottom-2 -right-2 p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-lg transition-all active:scale-95 flex items-center justify-center"
                    title="Importer une photo de profil"
                  >
                    <Camera className="w-4 h-4" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleAvatarFileChange} 
                      className="hidden" 
                      disabled={isUploadingAvatar}
                    />
                  </label>
                </div>

                <div className="space-y-1.5 text-center sm:text-left flex-1">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    Photo de profil officielle
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Téléversez votre propre photo depuis votre appareil (JPG, PNG, WebP).
                  </p>

                  <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <label className="px-3.5 py-1.5 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs cursor-pointer transition-all flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{avatar ? 'Changer ma photo' : 'Importer ma photo'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarFileChange} 
                        className="hidden" 
                        disabled={isUploadingAvatar}
                      />
                    </label>

                    {avatar && (
                      <button
                        type="button"
                        onClick={() => {
                          setAvatar('');
                          updateUserProfile({ photoURL: '' });
                          showFeedback('Photo de profil retirée.');
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                      >
                        Retirer
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Formulaire Coordonnées */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre nom complet"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Adresse Email (Identifiant)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={firebaseUser?.email || userProfile?.email || ''}
                      disabled
                      className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 cursor-not-allowed"
                    />
                    <Lock className="w-3.5 h-3.5 absolute right-3.5 top-3 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Numéro WhatsApp / Téléphone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: 699123456"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Ville principale (Cameroun)
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {CITIES_LIST.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Quartier / Adresse de livraison favorite
                  </label>
                  <input
                    type="text"
                    value={quarter}
                    onChange={(e) => setQuarter(e.target.value)}
                    placeholder="Ex: Akwa (Face Hôtel Koumassi), Bonapriso, Bastos..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer mon profil</span>
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* 2. MA BOUTIQUE (POUR LES VENDEURS)                         */}
          {/* ========================================================= */}
          {activeTab === 'shop' && vendor && (
            <form onSubmit={handleSaveShop} className="space-y-6">
              
              {/* Logo & Bannière */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Logo Uploader */}
                <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Logo de la boutique
                  </span>
                  <div className="relative mx-auto w-20 h-20">
                    <img 
                      src={shopLogo || vendor.logo || 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=150'} 
                      alt="Logo" 
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                    />
                    <label className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-md active:scale-95">
                      <Camera className="w-3.5 h-3.5" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleLogoFileChange} 
                        className="hidden" 
                        disabled={isUploadingLogo}
                      />
                    </label>
                  </div>
                  <span className="text-[10px] text-slate-400 block">Format carré recommandé</span>
                </div>

                {/* Bannière Uploader */}
                <div className="sm:col-span-2 p-4 rounded-3xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Bannière d'en-tête de vitrine
                    </span>
                    <label className="px-3 py-1.5 rounded-xl bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] cursor-pointer hover:bg-emerald-600/25 transition-all flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Changer la bannière</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleBannerFileChange} 
                        className="hidden" 
                        disabled={isUploadingBanner}
                      />
                    </label>
                  </div>
                  <div className="h-20 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-800">
                    <img 
                      src={shopBanner || vendor.banner || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'} 
                      alt="Banner" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Formulaire Boutique */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nom commercial de la boutique
                  </label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Code Boutique Unique
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={`#${vendor.code || 'SHP'}`}
                      disabled
                      className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 cursor-not-allowed"
                    />
                    <Lock className="w-3.5 h-3.5 absolute right-3.5 top-3 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Numéro WhatsApp Commercial
                  </label>
                  <input
                    type="tel"
                    value={shopPhone}
                    onChange={(e) => setShopPhone(e.target.value)}
                    placeholder="Ex: 699123456"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Catégorie principale
                  </label>
                  <select
                    value={shopCategory}
                    onChange={(e) => setShopCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="electronique">Électronique & High-Tech</option>
                    <option value="mode">Mode, Vêtements & Chaussures</option>
                    <option value="beaute">Beauté, Cosmétiques & Parfums</option>
                    <option value="maison">Maison, Déco & Électroménager</option>
                    <option value="alimentation">Alimentation, Épicerie & Boissons</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Ville de la boutique
                  </label>
                  <select
                    value={shopCity}
                    onChange={(e) => setShopCity(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {CITIES_LIST.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Quartier de la boutique
                  </label>
                  <input
                    type="text"
                    value={shopQuarter}
                    onChange={(e) => setShopQuarter(e.target.value)}
                    placeholder="Ex: Akwa, Bonapriso, Mokolo, Bastos..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Slogan & Description de la boutique
                  </label>
                  <textarea
                    rows={2}
                    value={shopDescription}
                    onChange={(e) => setShopDescription(e.target.value)}
                    placeholder="Présentez votre boutique, vos garanties de livraison et vos spécialités..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {onOpenVendorModal && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenVendorModal();
                      }}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <Store className="w-4 h-4 text-emerald-500" />
                      <span>Ouvrir l'Espace Vendeur</span>
                    </button>
                  )}
                  {onOpenStorefront && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenStorefront(vendor);
                      }}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-4 h-4 text-cyan-500" />
                      <span>Voir ma Vitrine</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les infos boutique</span>
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* 3. COMPTES ASSOCIÉS, ÉQUIPE & GESTION DES ACCÈS (RBAC)    */}
          {/* ========================================================= */}
          {activeTab === 'team' && vendor && (
            <div className="space-y-6">
              
              {/* Formulaire d'ajout ou d'édition d'un membre */}
              {editingMember ? (
                <form onSubmit={handleSaveMember} className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-5 animate-fadeIn">
                  
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        <UserPlus className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          {editingMember === 'new' ? 'Ajouter un Compte Associé' : `Modifier les accès de ${memberForm.name}`}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Configurez les rôles et permissions par onglet
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setEditingMember(null)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                    >
                      Annuler
                    </button>
                  </div>

                  {/* Coordonnées du membre */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Nom complet du collaborateur
                      </label>
                      <input
                        type="text"
                        required
                        value={memberForm.name}
                        onChange={(e) => setMemberForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Jean Ndedi"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Email de connexion
                      </label>
                      <input
                        type="email"
                        required
                        value={memberForm.email}
                        onChange={(e) => setMemberForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="jean.ndedi@gmail.com"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Téléphone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={memberForm.phone}
                        onChange={(e) => setMemberForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+237 690 00 00 00"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Modèles de Rôles Pré-configurés */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Rôle principal & Profil de permissions
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {Object.entries(ROLE_TEMPLATES).map(([key, tpl]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleRoleTemplateChange(key)}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            memberForm.roleKey === key
                              ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="font-extrabold text-xs mb-0.5">{tpl.label}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                            {tpl.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* MATRICE DÉTAILLÉE DES PERMISSIONS PAR ONGLET */}
                  <div className="space-y-3 pt-2">
                    <h5 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Détail granulaire des autorisations par onglet :</span>
                    </h5>

                    <div className="space-y-2.5">
                      
                      {/* Section 1 : Articles & Stock */}
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                            <Package className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white block">
                              Articles & Stock
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                              Catalogue de produits, prix et images
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {[
                            { key: 'view', label: 'Voir' },
                            { key: 'add', label: 'Ajouter' },
                            { key: 'edit', label: 'Modifier' },
                            { key: 'delete', label: 'Supprimer' }
                          ].map(act => (
                            <button
                              key={act.key}
                              type="button"
                              onClick={() => handleTogglePermission('products', act.key)}
                              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${
                                memberForm.permissions?.products?.[act.key]
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {memberForm.permissions?.products?.[act.key] ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                              <span>{act.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Section 2 : Tarifs Grossiste (MOQ) */}
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                            <Percent className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white block">
                              Tarifs Grossiste (MOQ)
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                              Paliers de quantités et remises de prix
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {[
                            { key: 'view', label: 'Voir les remises' },
                            { key: 'edit', label: 'Modifier les paliers' }
                          ].map(act => (
                            <button
                              key={act.key}
                              type="button"
                              onClick={() => handleTogglePermission('wholesale', act.key)}
                              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${
                                memberForm.permissions?.wholesale?.[act.key]
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {memberForm.permissions?.wholesale?.[act.key] ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                              <span>{act.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Section 3 : Constructeur de Vitrine */}
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                            <Layout className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white block">
                              Constructeur de Vitrine
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                              Personnalisation du thème, blocs et bannières
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {[
                            { key: 'view', label: 'Voir vitrine' },
                            { key: 'edit', label: 'Modifier le design' }
                          ].map(act => (
                            <button
                              key={act.key}
                              type="button"
                              onClick={() => handleTogglePermission('builder', act.key)}
                              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${
                                memberForm.permissions?.builder?.[act.key]
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {memberForm.permissions?.builder?.[act.key] ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                              <span>{act.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Section 4 : Commandes & CRM Clients */}
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white block">
                              Commandes & CRM Clients
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                              Coordonnées des acheteurs et statuts de commandes
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {[
                            { key: 'view', label: 'Voir clients' },
                            { key: 'edit', label: 'Modifier statuts' },
                            { key: 'delete', label: 'Archiver' }
                          ].map(act => (
                            <button
                              key={act.key}
                              type="button"
                              onClick={() => handleTogglePermission('orders_crm', act.key)}
                              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${
                                memberForm.permissions?.orders_crm?.[act.key]
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {memberForm.permissions?.orders_crm?.[act.key] ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                              <span>{act.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Section 5 : Stats & Boost Ads */}
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400">
                            <BarChart2 className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white block">
                              Stats & Publicités Boost
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                              Chiffre d'affaires et lancement de campagnes
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {[
                            { key: 'view', label: 'Voir les chiffres' },
                            { key: 'launch', label: 'Lancer des Boosts' }
                          ].map(act => (
                            <button
                              key={act.key}
                              type="button"
                              onClick={() => handleTogglePermission('stats_ads', act.key)}
                              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${
                                memberForm.permissions?.stats_ads?.[act.key]
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {memberForm.permissions?.stats_ads?.[act.key] ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                              <span>{act.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditingMember(null)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>Enregistrer les accès</span>
                    </button>
                  </div>

                </form>
              ) : (
                
                /* LISTE DES COMPTES ASSOCIÉS */
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        Équipe & Comptes Associés de la Boutique
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Ajoutez vos collaborateurs et contrôlez leurs droits de modification par onglet
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleStartAddMember}
                      className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/25 active:scale-95 transition-all flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Ajouter un compte</span>
                    </button>
                  </div>

                  {teamMembers.length === 0 ? (
                    <div className="p-8 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                      <Users className="w-10 h-10 text-slate-400 dark:text-slate-500 mx-auto mb-2 opacity-50" />
                      <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Aucun collaborateur associé pour le moment
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
                        Vous pouvez créer des accès restreints pour vos gestionnaires de stock, caissiers, livreurs ou assistants sans partager votre compte principal.
                      </p>
                      <button
                        type="button"
                        onClick={handleStartAddMember}
                        className="px-4 py-2 rounded-xl bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs hover:bg-emerald-600/25 transition-all"
                      >
                        + Ajouter mon premier collaborateur
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {teamMembers.map(member => {
                        const template = ROLE_TEMPLATES[member.roleKey] || ROLE_TEMPLATES.custom;
                        const isSuspended = member.status === 'suspended';

                        return (
                          <div 
                            key={member.id}
                            className={`p-4 rounded-2xl border transition-all ${
                              isSuspended 
                                ? 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60' 
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                                    {member.name}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                    {template.label}
                                  </span>
                                  {isSuspended && (
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400">
                                      Accès Suspendu
                                    </span>
                                  )}
                                </div>

                                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                  <span className="flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    <span>{member.email}</span>
                                  </span>
                                  {member.phone && (
                                    <span className="flex items-center gap-1">
                                      <Phone className="w-3 h-3" />
                                      <span className="font-mono">{member.phone}</span>
                                    </span>
                                  )}
                                </div>

                                {/* Résumé des permissions actives */}
                                <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                                  {member.permissions?.products?.add && (
                                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                      + Ajout Articles
                                    </span>
                                  )}
                                  {member.permissions?.products?.edit && (
                                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                      Modif Articles
                                    </span>
                                  )}
                                  {member.permissions?.products?.delete && (
                                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                      Suppr Articles
                                    </span>
                                  )}
                                  {member.permissions?.wholesale?.edit && (
                                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                      Tarifs Grossiste
                                    </span>
                                  )}
                                  {member.permissions?.builder?.edit && (
                                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                      Modif Vitrine
                                    </span>
                                  )}
                                  {member.permissions?.orders_crm?.edit && (
                                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                      Traitement Commandes
                                    </span>
                                  )}
                                  {member.permissions?.stats_ads?.view && (
                                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                      Chiffres & Stats
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Actions sur le collaborateur */}
                              <div className="flex items-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                                
                                <button
                                  type="button"
                                  onClick={() => handleCopyAccessCode(member.id)}
                                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                  title="Copier l'identifiant d'accès"
                                >
                                  {copiedId === member.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleToggleMemberStatus(member.id)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                    isSuspended
                                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25'
                                      : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25'
                                  }`}
                                >
                                  {isSuspended ? 'Réactiver' : 'Suspendre'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleStartEditMember(member)}
                                  className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                  title="Modifier les permissions"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteMember(member.id)}
                                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                                  title="Supprimer le compte"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* 4. SÉCURITÉ, THÈME & PRÉFÉRENCES                           */}
          {/* ========================================================= */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              
              {/* Thème d'affichage de l'application */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <label className="block text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-emerald-500" />
                  <span>Thème d'affichage de l'application :</span>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setThemeMode('light')}
                    className={`py-3 px-4 rounded-2xl border flex items-center justify-center gap-2 text-center transition-all ${
                      themeMode === 'light'
                        ? 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300 font-black shadow-sm ring-2 ring-amber-500/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold">Mode Clair</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setThemeMode('dark')}
                    className={`py-3 px-4 rounded-2xl border flex items-center justify-center gap-2 text-center transition-all ${
                      themeMode === 'dark'
                        ? 'border-indigo-500 bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 font-black shadow-sm ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold">Mode Sombre</span>
                  </button>
                </div>
              </div>

              {/* État du Compte & Sécurité */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <h5 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Sécurité du Compte & Authentification</span>
                </h5>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                    <span>Type de compte :</span>
                    <strong className="text-slate-900 dark:text-white">
                      {vendor ? 'Boutique Partenaire Pro' : 'Client Particulier'}
                    </strong>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                    <span>Fournisseur d'authentification :</span>
                    <strong className="text-slate-900 dark:text-white">
                      {firebaseUser?.providerData?.[0]?.providerId === 'google.com' ? 'Google Authentification' : 'Email & Mot de passe'}
                    </strong>
                  </div>

                  <div className="flex justify-between py-1">
                    <span>Identifiant Unique (UID) :</span>
                    <span className="font-mono text-[10px] text-slate-500">{firebaseUser?.uid || 'local-guest'}</span>
                  </div>
                </div>
              </div>

              {/* Bouton de Déconnexion */}
              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
                      logout();
                      onClose();
                    }
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-extrabold text-xs border border-rose-500/20 transition-all flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Se déconnecter</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
