import React, { useState, useMemo } from 'react';
import { 
  Eye, 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  Zap, 
  Sparkles, 
  Search, 
  MessageCircle, 
  ArrowUpRight, 
  Target, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Layers, 
  Megaphone, 
  BarChart2, 
  ChevronRight, 
  Flame, 
  ShieldCheck, 
  Award,
  Store
} from 'lucide-react';
import { 
  getShopAnalytics, 
  getShopCustomers, 
  getSearchDemandInsights, 
  createBoostCampaign, 
  getActiveBoostCampaigns 
} from '../../services/analyticsService';
import { useCart } from '../../context/CartContext';

export default function VendorStatsTab({ vendor, products = [] }) {
  const { orders = [] } = useCart();
  const shopId = vendor?.id || vendor?.code || 'my-shop';
  const shopName = vendor?.name || 'Ma Boutique';
  const vendorProducts = products.filter(p => p.shopId === vendor?.id || p.shopName === vendor?.name);

  // Filtre temporel : '7d' | '30d' | 'all'
  const [period, setPeriod] = useState('7d');
  
  // Onglet interne dans la section Stats : 'overview' | 'ads' | 'customers'
  const [subTab, setSubTab] = useState('overview');

  // Campagne Boost State
  const [selectedProductId, setSelectedProductId] = useState(() => vendorProducts[0]?.id || '');
  const [boostBudget, setBoostBudget] = useState(2500); // FCFA
  const [boostDays, setBoostDays] = useState(3);
  const [boostCity, setBoostCity] = useState('all'); // 'all' | 'Douala' | 'Yaoundé'
  const [campaignSuccess, setCampaignSuccess] = useState('');

  // Récupération des données d'analytics et insights
  const analytics = useMemo(() => {
    return getShopAnalytics(shopId, shopName, orders, vendorProducts);
  }, [shopId, shopName, orders, vendorProducts]);

  const customers = useMemo(() => {
    return getShopCustomers(shopId, shopName, orders);
  }, [shopId, shopName, orders]);

  const demandInsights = useMemo(() => {
    const mainCategory = vendorProducts[0]?.category || 'electronique';
    return getSearchDemandInsights(mainCategory, vendorProducts);
  }, [vendorProducts]);

  const activeCampaigns = useMemo(() => {
    return getActiveBoostCampaigns(shopId);
  }, [shopId, campaignSuccess]);

  const selectedProduct = vendorProducts.find(p => p.id === selectedProductId) || vendorProducts[0] || null;

  // Calcul dynamique de la portée estimée (Style Facebook Ads)
  const estimatedReachMin = Math.round((boostBudget * boostDays) * 0.85);
  const estimatedReachMax = Math.round((boostBudget * boostDays) * 1.6);
  const estimatedClicks = Math.round((boostBudget * boostDays) / 120);

  // Lancer une campagne sponsorisée
  const handleLaunchBoost = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const newCamp = createBoostCampaign(shopId, {
      productName: selectedProduct.name,
      productImage: selectedProduct.image,
      productPrice: selectedProduct.price,
      budgetTotal: boostBudget * boostDays,
      budgetDaily: boostBudget,
      days: boostDays,
      targetCity: boostCity === 'all' ? 'Douala & Yaoundé' : boostCity,
      estimatedReach: `${estimatedReachMin.toLocaleString('fr-FR')} - ${estimatedReachMax.toLocaleString('fr-FR')}`
    });

    if (newCamp) {
      setCampaignSuccess(`Félicitations ! Votre campagne pour "${selectedProduct.name}" est activée. Le badge "SPONSORISÉ" est maintenant actif.`);
      setTimeout(() => setCampaignSuccess(''), 6000);
    }
  };

  // Formatage du contact WhatsApp pour relancer un client
  const handleContactCustomer = (customer) => {
    const cleanPhone = (customer.phone || '').replace(/\D/g, '');
    const msg = `Bonjour *${customer.name}* ! C'est ${shopName} sur MeetShop. Nous vous remercions pour votre commande. Tout s'est bien passé pour vos articles ? Nous avons de nouvelles arrivées qui pourraient vous plaire !`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Info Banner (Harmonisé avec le thème MeetShop) */}
      <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-gradient-to-r dark:from-emerald-950/70 dark:via-slate-900 dark:to-slate-900 border border-emerald-200 dark:border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Performances, Données Clients & Publicités Boost
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Consultez le chiffre d'affaires généré, analysez les intentions d'achat des clients à Douala & Yaoundé et sponsorisez vos produits pour booster vos ventes.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 dark:bg-emerald-500/10 px-3.5 py-1.5 rounded-xl border border-emerald-500/30 font-extrabold shadow-sm">
            #{vendor?.code || 'SHP'} • {shopName}
          </span>
        </div>
      </div>

      {/* 2. Cartes KPIs Principales (Finances, Vues, Commandes, Audience) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* KPI 1 : Chiffre d'Affaires Total */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Revenus Totaux
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white mb-1">
            {(analytics.totalRevenue || 0).toLocaleString('fr-FR')}{' '}
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">FCFA</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            <TrendingUp className="w-3 h-3" />
            <span>{analytics.revenueGrowth || '0%'}</span>
            <span className="text-slate-500 dark:text-slate-400 font-normal">vs mois dernier</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex justify-between">
            <span>Détail: {(analytics.detailRevenue || analytics.retailRevenue || 0).toLocaleString('fr-FR')} F</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Gros: {(analytics.wholesaleRevenue || 0).toLocaleString('fr-FR')} F</span>
          </div>
        </div>

        {/* KPI 2 : Vues Vitrine & Produits */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Vues Vitrine
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white mb-1">
            {(analytics.totalViews || 0).toLocaleString('fr-FR')}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-cyan-600 dark:text-cyan-400 font-bold">
            <TrendingUp className="w-3 h-3" />
            <span>{analytics.viewsGrowth || '0%'}</span>
            <span className="text-slate-500 dark:text-slate-400 font-normal">visiteurs uniques</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex justify-between">
            <span>Fiches articles: {analytics.productViewsCount || 0}</span>
            <span>Partages: {analytics.sharesCount || 0}</span>
          </div>
        </div>

        {/* KPI 3 : Commandes & Taux de Conversion */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Commandes Reçues
            </span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white mb-1">
            {analytics.totalOrders || 0}{' '}
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">ventes</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-bold">
            <Sparkles className="w-3 h-3" />
            <span>Taux conv. {analytics.conversionRate || '0.0%'}</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex justify-between">
            <span>Panier moyen: {(analytics.averageBasket || 0).toLocaleString('fr-FR')} F</span>
            <span>Articles: {analytics.itemsSold || 0}</span>
          </div>
        </div>

        {/* KPI 4 : Intentions d'Achat Live (Douala / Yaoundé) */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
              Demande en Direct
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-1">
            {demandInsights?.totalPotentialBuyers || 0}{' '}
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">recherches</span>
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
            Requêtes d'acheteurs à Douala & Yaoundé
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
            <span>Portée réseau: ~{(demandInsights?.estimatedReach || 0).toLocaleString('fr-FR')}</span>
            <span className="underline cursor-pointer" onClick={() => setSubTab('ads')}>Booster →</span>
          </div>
        </div>

      </div>

      {/* 3. Navigation Sous-Sections : Vue Générale | Publicité Boost (FB Ads) | CRM Clients */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSubTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            subTab === 'overview'
              ? 'bg-emerald-600 text-white font-black shadow-md shadow-emerald-600/25'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Graphique & Ventes</span>
        </button>

        <button
          onClick={() => setSubTab('ads')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 relative ${
            subTab === 'ads'
              ? 'bg-emerald-600 text-white font-black shadow-md shadow-emerald-600/25'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5 text-amber-500" />
          <span>Mise en Avant & Boost Ads</span>
          <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white font-black text-[9px]">
            HOT
          </span>
        </button>

        <button
          onClick={() => setSubTab('customers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            subTab === 'customers'
              ? 'bg-emerald-600 text-white font-black shadow-md shadow-emerald-600/25'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Clients & Commandes ({customers.length})</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* VUE 1 : GRAPHIQUE D'ÉVOLUTION DES 7 DERNIERS JOURS      */}
      {/* ======================================================== */}
      {subTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Histogramme des Ventes et Vues Journalières */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Activité des 7 derniers jours
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Évolution comparée des vues et du chiffre d'affaires
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-cyan-500" />
                  <span className="text-slate-600 dark:text-slate-300 text-[11px]">Vues</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-300 text-[11px]">Ventes (FCFA)</span>
                </div>
              </div>
            </div>

            {/* Barres Graphiques CSS */}
            <div className="grid grid-cols-7 gap-2 pt-6 pb-2 items-end h-48 border-b border-slate-100 dark:border-slate-800">
              {analytics.dailyStats.map((d, i) => {
                const maxSales = Math.max(...analytics.dailyStats.map(s => s.sales || 1));
                const heightPercent = Math.max(15, Math.min(100, Math.round((d.sales / maxSales) * 100)));
                
                return (
                  <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {d.sales.toLocaleString('fr-FR')} F
                    </div>
                    <div className="w-full max-w-[36px] bg-slate-100 dark:bg-slate-800 rounded-xl p-1 flex flex-col justify-end h-full">
                      <div 
                        className={`w-full rounded-lg transition-all duration-500 ${
                          d.isToday 
                            ? 'bg-gradient-to-t from-emerald-600 to-green-400 shadow-md shadow-emerald-500/20' 
                            : 'bg-gradient-to-t from-slate-400 to-slate-300 dark:from-slate-700 dark:to-slate-600 opacity-80 group-hover:opacity-100'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <div className="text-center">
                      <span className={`text-xs font-bold block ${d.isToday ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-slate-500 dark:text-slate-400'}`}>
                        {d.day}
                      </span>
                      {d.isToday && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Pic de visites hebdomadaire</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">Vendredi & Samedi (18h-22h)</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Moyen de paiement favori</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">Orange Money & MoMo (78%)</span>
              </div>
            </div>
          </div>

          {/* Mots-Clés Chauds en Direct sur le Marché */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-500" />
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Top Recherches Acheteurs dans votre Catégorie
                </h4>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Cameroun Live
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Voici ce que les clients recherchent activement sur MeetShop. Vous pouvez adapter vos stocks ou créer un boost ciblé sur ces mots-clés.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {demandInsights.keywords.map((kw, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                      « {kw.keyword} »
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{kw.city}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {kw.searchCount} recherches
                    </span>
                    <span className="block text-[9px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                      Intention {kw.intent}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* VUE 2 : SYSTEME DE BOOST & PUBLICITE (STYLE FACEBOOK ADS) */}
      {/* ======================================================== */}
      {subTab === 'ads' && (
        <div className="space-y-6">
          
          {/* Notification de succès de création */}
          {campaignSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div className="text-xs font-semibold">{campaignSuccess}</div>
            </div>
          )}

          {/* Bannière d'Opportunité Boost */}
          <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-gradient-to-r dark:from-emerald-950/70 dark:via-slate-900 dark:to-slate-900 border border-emerald-200 dark:border-emerald-500/30 text-slate-900 dark:text-white shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider">
                  <Flame className="w-3 h-3" />
                  Mise en Avant Sponsorisée
                </div>
                <h4 className="text-base sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  {demandInsights.totalPotentialBuyers > 0 
                    ? `${demandInsights.totalPotentialBuyers} clients recherchent actuellement vos articles !`
                    : "Boostez la visibilité de vos articles auprès des acheteurs de Douala & Yaoundé !"
                  }
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl">
                  Activez un <strong>Boost Sponsorisé</strong> pour placer vos produits en <strong>1ère position</strong> dans les résultats de recherche et dans le flux d'accueil de Douala et Yaoundé.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-500/30 text-center shrink-0 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">Portée Estimée</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">{estimatedReachMin.toLocaleString('fr-FR')} - {estimatedReachMax.toLocaleString('fr-FR')}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Acheteurs ciblés</span>
              </div>
            </div>
          </div>

          {/* Formulaire & Simulateur de Campagne Sponsorisée */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Colonne Gauche : Paramètres de la Campagne */}
            <form onSubmit={handleLaunchBoost} className="lg:col-span-7 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500" />
                <span>Créer une Campagne de Boost</span>
              </h4>

              {/* 1. Sélection de l'article à booster */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  1. Article à mettre en avant
                </label>
                {vendorProducts.length > 0 ? (
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {vendorProducts.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {Number(p.price || 0).toLocaleString('fr-FR')} FCFA
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-amber-500 font-semibold">
                    Ajoutez d'abord des articles dans l'onglet "Articles" pour lancer un boost.
                  </p>
                )}
              </div>

              {/* 2. Ciblage Géographique */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  2. Ville Ciblée
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setBoostCity('all')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      boostCity === 'all'
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Douala & Yaoundé
                  </button>
                  <button
                    type="button"
                    onClick={() => setBoostCity('Douala')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      boostCity === 'Douala'
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Douala (Seulement)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBoostCity('Yaoundé')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      boostCity === 'Yaoundé'
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Yaoundé (Seulement)
                  </button>
                </div>
              </div>

              {/* 3. Budget & Durée */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Budget / jour (FCFA)
                  </label>
                  <select
                    value={boostBudget}
                    onChange={(e) => setBoostBudget(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value={1000}>1 000 FCFA / jour (Starter)</option>
                    <option value={2500}>2 500 FCFA / jour (Recommandé)</option>
                    <option value={5000}>5 000 FCFA / jour (Pro Ultra)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Durée de la mise en avant
                  </label>
                  <select
                    value={boostDays}
                    onChange={(e) => setBoostDays(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value={1}>1 Jour</option>
                    <option value={3}>3 Jours (Recommandé)</option>
                    <option value={7}>7 Jours (1 Semaine)</option>
                  </select>
                </div>
              </div>

              {/* Résumé Budget Total & CTA */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-600 dark:text-slate-300 block">Investissement Total :</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    {(boostBudget * boostDays).toLocaleString('fr-FR')} FCFA
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={!selectedProduct}
                  className={`px-5 py-2.5 rounded-xl text-white font-black text-xs shadow-lg active:scale-95 transition-all flex items-center gap-1.5 ${
                    selectedProduct 
                      ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25 cursor-pointer' 
                      : 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60'
                  }`}
                >
                  <RocketIcon className="w-4 h-4" />
                  <span>Activer le Boost</span>
                </button>
              </div>
            </form>

            {/* Colonne Droite : Aperçu en Direct du Badge Sponsorisé */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                    Aperçu dans le flux acheteur
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-black text-[9px] uppercase tracking-wider">
                    Badge Sponsorisé
                  </span>
                </div>

                {/* Carte Produit avec badge Sponsorisé */}
                {selectedProduct ? (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-emerald-500/50 overflow-hidden shadow-md">
                    <div className="relative h-36 w-full bg-slate-100 dark:bg-slate-800">
                      <img 
                        src={selectedProduct.image || selectedProduct.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'} 
                        alt={selectedProduct.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';
                        }}
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px] font-black flex items-center gap-1 shadow-md">
                        <Sparkles className="w-3 h-3" />
                        SPONSORISÉ
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                        {shopName} • {boostCity === 'all' ? 'Douala & Yaoundé' : boostCity}
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white text-xs truncate mt-0.5">
                        {selectedProduct.name}
                      </div>
                      <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1">
                        {Number(selectedProduct.price || 0).toLocaleString('fr-FR')} FCFA
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 text-xs text-slate-500 dark:text-slate-400">
                    <ShoppingBag className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-2 opacity-50" />
                    <span className="font-bold block text-slate-700 dark:text-slate-300">Aucun article sélectionné</span>
                    <span className="text-[11px]">Ajoutez des articles dans l'onglet "Articles" pour prévisualiser le badge sponsorisé.</span>
                  </div>
                )}

                {/* Estimation des performances attendues */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Portée estimée :</span>
                    <strong className="text-slate-900 dark:text-white">{estimatedReachMin.toLocaleString('fr-FR')} à {estimatedReachMax.toLocaleString('fr-FR')} personnes</strong>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Contacts WhatsApp attendus :</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">{estimatedClicks} à {Math.round(estimatedClicks * 1.8)} prospects</strong>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Campagnes Déjà Actives */}
          {activeCampaigns.length > 0 && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Vos Campagnes Actives en Direct</span>
              </h4>

              <div className="space-y-2">
                {activeCampaigns.map(camp => (
                  <div key={camp.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={camp.productImage} alt={camp.productName} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-xs">
                          {camp.productName}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          {camp.targetCity} • {camp.budgetTotal?.toLocaleString('fr-FR')} FCFA ({camp.days} jours)
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        En Diffusion
                      </span>
                      <span className="block text-[9px] text-slate-400 mt-1">
                        {camp.viewsDelivered || 0} vues • {camp.clicksDelivered || 0} clics
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* VUE 3 : CRM CLIENTS & COMMANDES RECENTES                */}
      {/* ======================================================== */}
      {subTab === 'customers' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Répertoire & Historique des Clients
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Coordonnées des acheteurs ayant commandé dans votre boutique
                </p>
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
                {customers.length} clients uniques
              </span>
            </div>

            {/* Liste des Clients */}
            {customers.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                <Users className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Aucun client enregistré pour le moment
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Dès que vos premiers clients passeront commande ou vous contacteront sur MeetShop, leurs coordonnées et historiques d'achats apparaîtront automatiquement ici.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {customers.map((cust, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                          {cust.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                          {cust.ordersCount} commande{cust.ordersCount > 1 ? 's' : ''}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span className="font-mono">{cust.phone}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{cust.quarter}{cust.quarter && cust.city ? ', ' : ''}{cust.city}</span>
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600 dark:text-slate-300 pt-1">
                        <strong className="text-slate-900 dark:text-white">Derniers achats :</strong> {cust.items.join(', ')}
                      </div>
                    </div>

                    {/* Total Dépensé & Bouton Relance WhatsApp */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-700">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-slate-400 uppercase block">Total dépensé</span>
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          {cust.totalSpent.toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleContactCustomer(cust)}
                        className="px-3 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-green-600/20 active:scale-95 transition-all"
                        title="Ouvrir une discussion WhatsApp de suivi"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

function RocketIcon(props) {
  return (
    <svg 
      {...props} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}
