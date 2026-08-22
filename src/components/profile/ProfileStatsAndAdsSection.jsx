import React, { useState, useMemo } from 'react';
import { 
  Eye, 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  Zap, 
  Sparkles, 
  Search, 
  ArrowUpRight, 
  Target, 
  DollarSign, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Megaphone, 
  Flame, 
  ShieldCheck, 
  Award,
  Store,
  BarChart2,
  Clock,
  Radio,
  Plus,
  TrendingDown,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { 
  getShopAnalytics, 
  getSearchDemandInsights, 
  createBoostCampaign, 
  getActiveBoostCampaigns,
  resetShopAnalytics
} from '../../services/analyticsService';
import { useCart } from '../../context/CartContext';

// ─── Composant interne sécurisé qui récupère les orders du CartContext ──────
// Séparé pour éviter que l'échec du hook CartContext ne fasse crasher toute la page
function StatsContent({ vendor, products, onOpenStorefront, orders = [] }) {
  const shopId = vendor?.id || vendor?.code || 'my-shop';
  const shopName = vendor?.name || 'Ma Boutique';
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Produits de cette boutique
  const vendorProducts = useMemo(() => {
    return products.filter(p => {
      const pShopId = p.shopId || p.shop_id || p.shop?.id;
      const pShopCode = p.shopCode || p.shop_code || p.shop?.code;
      const pShopName = (p.shopName || p.shop_name || p.shop?.name || '').trim().toLowerCase();
      const sId = vendor?.id;
      const sCode = vendor?.code;
      const sName = (vendor?.name || '').trim().toLowerCase();
      const sSellerId = vendor?.seller_id || vendor?.owner_uid;

      return (
        (sId && pShopId === sId) ||
        (sCode && pShopCode === sCode) ||
        (sSellerId && (p.vendor_id === sSellerId || p.seller_id === sSellerId)) ||
        (sName && pShopName === sName)
      );
    });
  }, [products, vendor]);

  // Filtre temporel : '7d' | '30d' | 'all'
  const [period, setPeriod] = useState('7d');

  // Campagne Boost State
  const [selectedProductId, setSelectedProductId] = useState(() => vendorProducts[0]?.id || '');
  const [boostBudget, setBoostBudget] = useState(2500); // FCFA/jour
  const [boostDays, setBoostDays] = useState(3);
  const [boostCity, setBoostCity] = useState('all'); // 'all' | 'Douala' | 'Yaoundé'
  const [campaignSuccess, setCampaignSuccess] = useState('');

  // Récupération des données d'analytics et insights
  const analytics = useMemo(() => {
    return getShopAnalytics(shopId, shopName, orders, vendorProducts);
  }, [shopId, shopName, orders, vendorProducts, refreshKey]);

  // Réinitialiser le compteur de test
  const handleResetCounter = () => {
    if (window.confirm('Voulez-vous remettre à zéro le compteur de vues de test ? Les futures vues de vrais visiteurs uniques seront comptabilisées de manière 100% réelle.')) {
      resetShopAnalytics(shopId);
      setRefreshKey(k => k + 1);
    }
  };

  const demandInsights = useMemo(() => {
    const mainCategory = vendorProducts[0]?.category || 'electronique';
    return getSearchDemandInsights(mainCategory, vendorProducts);
  }, [vendorProducts]);

  // Liste des mots-clés et recherches réelles des acheteurs (100% données réelles)
  const demandKeywordsList = useMemo(() => {
    if (Array.isArray(demandInsights)) return demandInsights;
    if (Array.isArray(demandInsights?.keywords)) {
      return demandInsights.keywords;
    }
    return [];
  }, [demandInsights]);

  const activeCampaigns = useMemo(() => {
    return getActiveBoostCampaigns(shopId);
  }, [shopId, campaignSuccess]);

  const selectedProduct = vendorProducts.find(p => p.id === selectedProductId) || vendorProducts[0] || null;

  // Calcul dynamique de la portée estimée (Style Meta / Google Ads)
  const totalBudget = boostBudget * boostDays;
  const estimatedReachMin = Math.round(totalBudget * 0.85);
  const estimatedReachMax = Math.round(totalBudget * 1.6);
  const estimatedClicks = Math.round(totalBudget / 120);

  // Lancer une campagne sponsorisée
  const handleLaunchBoost = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const newCamp = createBoostCampaign(shopId, {
      productName: selectedProduct.name,
      productImage: selectedProduct.image,
      productPrice: selectedProduct.price,
      budgetTotal: totalBudget,
      budgetDaily: boostBudget,
      days: boostDays,
      targetCity: boostCity === 'all' ? 'Douala & Yaoundé (Tout le Cameroun)' : boostCity,
      estimatedReach: `${estimatedReachMin.toLocaleString('fr-FR')} - ${estimatedReachMax.toLocaleString('fr-FR')}`
    });

    if (newCamp) {
      setCampaignSuccess(`Félicitations ! Votre campagne pour "${selectedProduct.name}" est activée. Le badge "SPONSORISÉ" est maintenant actif.`);
      setTimeout(() => setCampaignSuccess(''), 6000);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Pré-remplir la création de pub depuis un produit très recherché
  const handleQuickBoostProduct = (prodId) => {
    setSelectedProductId(prodId);
    const formElement = document.getElementById('boost-campaign-creator');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Bannière de confirmation de boost */}
      {campaignSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm font-bold flex items-center gap-3 animate-fadeIn shadow-sm">
          <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{campaignSuccess}</span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTION 1 : KPIs & VUE D'ENSEMBLE DES STATISTIQUES RÉELLES
         ═══════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Statistiques & Performances Réelles</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Métriques réelles de visites et de ventes de votre boutique sur MeetShop
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {/* Bouton de remise à zéro du compteur de test */}
            <button
              type="button"
              onClick={handleResetCounter}
              title="Remettre à zéro les statistiques de test"
              className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 hover:text-rose-600 border border-slate-200 dark:border-slate-700 text-slate-500 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Remettre à zéro</span>
            </button>

            {/* Filtre de période */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => setPeriod('7d')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  period === '7d' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                7 derniers jours
              </button>
              <button
                type="button"
                onClick={() => setPeriod('30d')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  period === '30d' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                30 jours
              </button>
              <button
                type="button"
                onClick={() => setPeriod('all')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  period === 'all' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Tout
              </button>
            </div>
          </div>
        </div>

        {/* Grille des 4 Métriques Clés Réelles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vues Vitrine</span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {(analytics?.totalViews ?? 0).toLocaleString('fr-FR')}
            </p>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1 block">
              {(analytics?.todayViews || 0) > 0 
                ? `${analytics.todayViews} vue${analytics.todayViews > 1 ? 's' : ''} aujourd'hui`
                : (analytics?.totalViews || 0) > 0 
                  ? `${analytics.totalViews} vue(s) enregistrée(s)`
                  : 'Aucune visite pour l\'instant'}
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Visiteurs Uniques</span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {(analytics?.uniqueVisitors ?? 0).toLocaleString('fr-FR')}
            </p>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1 block">
              {(analytics?.uniqueVisitors || 0) > 0
                ? `${analytics.uniqueVisitors} session${analytics.uniqueVisitors > 1 ? 's' : ''} unique${analytics.uniqueVisitors > 1 ? 's' : ''}`
                : 'En attente de visiteurs'}
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Taux de Conversion</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {analytics?.conversionRate || '0.0%'}
            </p>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1 block">
              {analytics?.totalOrders ?? 0} commande(s) / {analytics?.totalViews ?? 0} vue(s)
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Volume Ventes</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {(analytics?.totalRevenue ?? 0).toLocaleString('fr-FR')} <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">FCFA</span>
            </p>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
              {analytics?.totalOrders ?? 0} commande{(analytics?.totalOrders || 0) > 1 ? 's' : ''} enregistrée{(analytics?.totalOrders || 0) > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2 : RECHERCHES RÉELLES DES ACHETEURS
         ═══════════════════════════════════════════════════════ */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-transparent border border-amber-500/20 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Recherches Acheteurs en Direct</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-black uppercase">
                  Données Réelles
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Termes et produits réellement tapés par les acheteurs dans la barre de recherche MeetShop
              </p>
            </div>
          </div>
        </div>

        {/* Liste des recherches réelles */}
        {demandKeywordsList.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
            <Search className="w-6 h-6 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Aucune recherche acheteur enregistrée pour le moment
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Dès que des clients effectuent des recherches dans votre secteur sur la Marketplace, elles s'afficheront ici en direct.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {demandKeywordsList.slice(0, 6).map((item, idx) => (
              <div 
                key={item.id || idx}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black">
                      <Search className="w-3 h-3" /> {item.searchCount} recherche{item.searchCount > 1 ? 's' : ''}
                    </span>
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                      "{item.keyword}"
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Région : {item.city || 'Cameroun'} • Intention : {item.intent || 'Active'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3 : CRÉATEUR DE CAMPAGNES PUBLICITAIRES & BOOST
         ═══════════════════════════════════════════════════════ */}
      <div id="boost-campaign-creator" className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Créer une Campagne Publicitaire (Boost Produit)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Affichez votre produit en tête des résultats de recherche et dans la section "En Vedette" sur la Marketplace
          </p>
        </div>

        {vendorProducts.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
            <ShoppingBag className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Vous n'avez pas encore de produit dans votre boutique.
            </p>
            <p className="text-[11px] text-slate-500">
              Ajoutez des produits dans votre boutique pour pouvoir lancer des promotions et booster vos ventes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleLaunchBoost} className="space-y-5">
            
            {/* Étape 1 : Choisir le produit à promouvoir */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                1. Sélectionnez le produit à sponsoriser
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors cursor-pointer"
              >
                {vendorProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} • {Number(p.price).toLocaleString('fr-FR')} FCFA ({p.category || 'Général'})
                  </option>
                ))}
              </select>
            </div>

            {/* Aperçu du produit sélectionné */}
            {selectedProduct && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3.5">
                <img
                  src={selectedProduct.image || selectedProduct.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80'}
                  alt={selectedProduct.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-black uppercase">
                      Sponsorisé
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">{selectedProduct.category}</span>
                  </div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate mt-0.5">
                    {selectedProduct.name}
                  </h4>
                  <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    {Number(selectedProduct.price).toLocaleString('fr-FR')} FCFA
                  </p>
                </div>
              </div>
            )}

            {/* Étape 2 : Durée & Budget Quotidien */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  2. Budget Quotidien (FCFA)
                </label>
                <select
                  value={boostBudget}
                  onChange={(e) => setBoostBudget(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value={1000}>1 000 FCFA / jour (Starter)</option>
                  <option value={2500}>2 500 FCFA / jour (Recommandé ⭐)</option>
                  <option value={5000}>5 000 FCFA / jour (Pro Performance)</option>
                  <option value={10000}>10 000 FCFA / jour (Ultra Boost)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  3. Durée de la campagne
                </label>
                <select
                  value={boostDays}
                  onChange={(e) => setBoostDays(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value={1}>1 Jour (Flash Boost)</option>
                  <option value={3}>3 Jours (Idéal pour tester)</option>
                  <option value={7}>7 Jours (1 Semaine)</option>
                  <option value={14}>14 Jours (2 Semaines)</option>
                  <option value={30}>30 Jours (1 Mois)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  4. Ville cible
                </label>
                <select
                  value={boostCity}
                  onChange={(e) => setBoostCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="all">Tout le Cameroun (Douala & Yaoundé)</option>
                  <option value="Douala">Douala Uniquement</option>
                  <option value="Yaoundé">Yaoundé Uniquement</option>
                  <option value="Bafoussam">Bafoussam</option>
                  <option value="Kribi">Kribi</option>
                </select>
              </div>
            </div>

            {/* Simulateur de portée en direct (Reach Estimator) */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  Portée & Clics Estimés
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Environ <span className="text-emerald-600 dark:text-emerald-400 font-black">{estimatedReachMin.toLocaleString('fr-FR')} à {estimatedReachMax.toLocaleString('fr-FR')} acheteurs</span> ciblés
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Estimation de {estimatedClicks} clics WhatsApp et paniers directs générés.
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Total de la Campagne</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  {totalBudget.toLocaleString('fr-FR')} <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">FCFA</span>
                </span>
              </div>
            </div>

            {/* Bouton de lancement de la campagne */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-98 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Activer la Campagne Sponsorisée</span>
            </button>

          </form>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 4 : CAMPAGNES PUBLICITAIRES ACTIVES
         ═══════════════════════════════════════════════════════ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Campagnes Sponsorisées en Cours</span>
          </h3>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {activeCampaigns.length} campagne{activeCampaigns.length > 1 ? 's' : ''}
          </span>
        </div>

        {activeCampaigns.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
            Aucune campagne sponsorisée active pour le moment. Créez votre première publicité ci-dessus pour booster vos ventes !
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-500/30 shadow-sm flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {camp.productName}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Budget: {Number(camp.budgetTotal).toLocaleString('fr-FR')} FCFA • {camp.days} jours
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black shrink-0 border border-emerald-500/20">
                  En Diffusion
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

// ─── Error Boundary pour garantir 0 page blanche ────────────────────────
class StatsErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMsg: '' };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, errorMsg: error?.message || 'Erreur d\'affichage' };
  }
  componentDidCatch(error, info) {
    console.warn('StatsErrorBoundary caught error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-slate-800 dark:text-slate-200 space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black">
            <AlertCircle className="w-5 h-5" />
            <span>Chargement des Statistiques</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Les métriques de votre boutique sont en cours d'initialisation. Vos premières vues et commandes apparaîtront ici en temps réel.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs cursor-pointer shadow-sm transition-all"
          >
            Actualiser les statistiques
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Export sécurisé : récupère orders depuis CartContext et les passe en props ──
export default function ProfileStatsAndAdsSection(props) {
  let orders = [];
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const cartCtx = useCart();
    orders = cartCtx?.orders || [];
  } catch {
    orders = [];
  }
  return (
    <StatsErrorBoundary>
      <StatsContent {...props} orders={orders} />
    </StatsErrorBoundary>
  );
}
