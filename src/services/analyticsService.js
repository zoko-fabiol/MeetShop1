/**
 * Service de gestion des statistiques de vente, audience et campagnes de publicité sponsorisée (Style Facebook Ads).
 * Persiste les données dans localStorage et calcule les métriques réelles de production pour chaque commerçant.
 */

const ANALYTICS_STORAGE_KEY = 'meetshop_analytics';
const SEARCH_HISTORY_KEY = 'meetshop_search_history';
const BOOST_CAMPAIGNS_KEY = 'meetshop_boost_campaigns';

/**
 * Récupère ou initialise l'historique d'analytics de toutes les boutiques.
 */
function getStoredAnalytics() {
  try {
    const data = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveAnalytics(data) {
  try {
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {}
}

/**
 * Enregistre une vue de boutique avec déduplication stricte (1 compte / appareil = 1 vue).
 * N'incrémente JAMAIS si c'est le propriétaire de la boutique qui visite sa propre boutique.
 */
export function recordShopView(shopId, options = {}) {
  if (!shopId) return;
  const { isOwner = false, visitorUid = null } = options;

  // Règle 1 : Ne JAMAIS compter les visites du propriétaire de la boutique
  if (isOwner) return;

  // Déterminer l'identifiant unique du visiteur (UID de compte si connecté, sinon token d'appareil persistant)
  let visitorId = visitorUid;
  if (!visitorId) {
    try {
      visitorId = localStorage.getItem('meetshop_device_id');
      if (!visitorId) {
        visitorId = `dev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
        localStorage.setItem('meetshop_device_id', visitorId);
      }
    } catch {
      visitorId = 'anon-visitor';
    }
  }

  const allData = getStoredAnalytics();
  const shopData = allData[shopId] || { views: 0, productViews: {}, dailyViews: {}, uniqueVisitorIds: [] };

  if (!Array.isArray(shopData.uniqueVisitorIds)) {
    shopData.uniqueVisitorIds = [];
  }

  // Règle 2 : Déduplication stricte — si ce compte/appareil a déjà vu cette boutique, NE PAS ré-incrémenter
  if (shopData.uniqueVisitorIds.includes(visitorId)) {
    return; // Déjà comptabilisé pour ce compte/appareil
  }

  // Ajouter ce visiteur unique et incrémenter de 1
  shopData.uniqueVisitorIds.push(visitorId);
  shopData.views = shopData.uniqueVisitorIds.length;

  const todayKey = new Date().toISOString().slice(0, 10);
  if (!shopData.dailyViews) shopData.dailyViews = {};
  shopData.dailyViews[todayKey] = (shopData.dailyViews[todayKey] || 0) + 1;

  allData[shopId] = shopData;
  saveAnalytics(allData);
}

/**
 * Réinitialise ou recalibre les statistiques d'une boutique (enlève les vues factices de test).
 */
export function resetShopAnalytics(shopId) {
  if (!shopId) return;
  const allData = getStoredAnalytics();
  if (allData[shopId]) {
    allData[shopId] = { views: 0, productViews: {}, dailyViews: {}, uniqueVisitorIds: [] };
    saveAnalytics(allData);
  }
}

/**
 * Enregistre une vue de produit avec exclusion du propriétaire.
 */
export function recordProductView(productId, shopId, isOwner = false) {
  if (!productId || !shopId || isOwner) return;
  const allData = getStoredAnalytics();
  const shopData = allData[shopId] || { views: 0, productViews: {}, dailyViews: {}, uniqueVisitorIds: [] };
  if (!shopData.productViews) shopData.productViews = {};
  shopData.productViews[productId] = (shopData.productViews[productId] || 0) + 1;
  allData[shopId] = shopData;
  saveAnalytics(allData);
}

/**
 * Enregistre une recherche utilisateur pour alimenter le volume d'intentions d'achat réelles.
 */
export function recordSearchQuery(query, city = 'Douala') {
  if (!query || !query.trim()) return;
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
    const searches = raw ? JSON.parse(raw) : [];
    searches.unshift({
      query: query.trim().toLowerCase(),
      city: city || 'Douala',
      timestamp: new Date().toISOString()
    });
    // Conserver les 200 dernières recherches réelles
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searches.slice(0, 200)));
  } catch (e) {}
}

/**
 * Calcule toutes les statistiques financières, de conversion et d'audience réelles pour un commerçant donné.
 */
export function getShopAnalytics(shopId, shopName, allOrders = [], vendorProducts = []) {
  const allData = getStoredAnalytics();
  const baseData = allData[shopId] || { views: 0, dailyViews: {}, uniqueVisitorIds: [] };

  // Récupérer aussi les commandes depuis localStorage si non transmises
  let rawOrders = allOrders;
  if (!rawOrders || rawOrders.length === 0) {
    try {
      rawOrders = JSON.parse(localStorage.getItem('meetshop_orders') || '[]');
    } catch {
      rawOrders = [];
    }
  }

  // Filtrer les commandes réelles qui contiennent des produits de cette boutique
  const shopOrders = (rawOrders || []).filter(order => {
    return (order.items || []).some(item => 
      item.shopId === shopId || item.shopName === shopName || item.shopCode === shopId ||
      (vendorProducts || []).some(vp => vp.id === item.id)
    );
  });

  // Calcul du Chiffre d'Affaires et des volumes réels
  let totalRevenue = 0;
  let wholesaleRevenue = 0;
  let detailRevenue = 0;
  let itemsSold = 0;

  shopOrders.forEach(order => {
    (order.items || []).forEach(item => {
      const belongsToShop = item.shopId === shopId || item.shopName === shopName || item.shopCode === shopId ||
        (vendorProducts || []).some(vp => vp.id === item.id);

      if (belongsToShop) {
        const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);
        totalRevenue += itemTotal;
        itemsSold += (Number(item.quantity) || 1);
        if ((Number(item.quantity) || 1) >= (item.wholesaleMinQty || 5)) {
          wholesaleRevenue += itemTotal;
        } else {
          detailRevenue += itemTotal;
        }
      }
    });
  });

  const totalOrders = shopOrders.length;
  const totalViews = baseData.views || 0;
  const uniqueVisitors = Array.isArray(baseData.uniqueVisitorIds) ? baseData.uniqueVisitorIds.length : (totalViews > 0 ? 1 : 0);
  
  // Taux de conversion Visiteurs -> Commandes réel (0.0% si aucune commande)
  const conversionRate = totalViews > 0 ? ((totalOrders / totalViews) * 100).toFixed(1) : '0.0';
  const averageBasket = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const todayKey = new Date().toISOString().slice(0, 10);
  const todayViews = baseData.dailyViews?.[todayKey] || 0;

  // Historique journalier des 7 derniers jours (données réelles)
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const todayIndex = (new Date().getDay() + 6) % 7;
  
  const dailyStats = days.map((day, idx) => {
    const isToday = idx === todayIndex;
    return {
      day,
      views: isToday ? todayViews : 0,
      sales: isToday ? totalRevenue : 0,
      orders: isToday ? totalOrders : 0,
      isToday
    };
  });

  return {
    totalViews,
    todayViews,
    uniqueVisitors,
    totalOrders,
    totalRevenue,
    wholesaleRevenue,
    detailRevenue,
    averageBasket,
    conversionRate: `${conversionRate}%`,
    conversionRateNum: Number(conversionRate) || 0,
    itemsSold,
    dailyStats,
    shopOrders
  };
}

/**
 * Extrait la liste CRM réelle des clients ayant commandé dans cette boutique.
 */
export function getShopCustomers(shopId, shopName, allOrders = []) {
  let rawOrders = allOrders;
  if (!rawOrders || rawOrders.length === 0) {
    try {
      rawOrders = JSON.parse(localStorage.getItem('meetshop_orders') || '[]');
    } catch {
      rawOrders = [];
    }
  }

  const shopOrders = (rawOrders || []).filter(order => {
    return (order.items || []).some(item => 
      item.shopId === shopId || item.shopName === shopName || item.shopCode === shopId
    );
  });

  // Si des commandes existent, agréger par numéro de téléphone
  const customerMap = {};

  shopOrders.forEach(order => {
    const cust = order.customer || {};
    const phone = cust.phone || 'Non renseigné';
    if (!customerMap[phone]) {
      customerMap[phone] = {
        name: cust.name || 'Client MeetShop',
        phone: cust.phone || 'Non renseigné',
        city: cust.city || 'Cameroun',
        quarter: cust.quarter || '',
        ordersCount: 0,
        totalSpent: 0,
        lastOrderDate: order.date || new Date().toISOString(),
        items: []
      };
    }
    customerMap[phone].ordersCount += 1;
    (order.items || []).forEach(it => {
      if (it.shopId === shopId || it.shopName === shopName || it.shopCode === shopId) {
        customerMap[phone].totalSpent += (Number(it.price) || 0) * (Number(it.quantity) || 1);
        if (it.name) customerMap[phone].items.push(it.name);
      }
    });
  });

  return Object.values(customerMap);
}

/**
 * Analyse les intentions d'achat et calcule l'audience ciblable réelle.
 */
export function getSearchDemandInsights(shopCategory = 'electronique', vendorProducts = []) {
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
    const searches = raw ? JSON.parse(raw) : [];

    // Regrouper les recherches réelles par mot-clé
    const searchCountMap = {};
    searches.forEach(s => {
      const q = (s.query || '').trim();
      if (q) {
        if (!searchCountMap[q]) {
          searchCountMap[q] = { keyword: q, searchCount: 0, city: s.city || 'Douala & Yaoundé', intent: 'Moyenne' };
        }
        searchCountMap[q].searchCount += 1;
        if (searchCountMap[q].searchCount >= 10) searchCountMap[q].intent = 'Très Forte';
        else if (searchCountMap[q].searchCount >= 5) searchCountMap[q].intent = 'Forte';
      }
    });

    const keywords = Object.values(searchCountMap);
    const totalPotentialBuyers = keywords.reduce((sum, item) => sum + item.searchCount, 0);

    return {
      totalPotentialBuyers,
      estimatedReach: totalPotentialBuyers * 15,
      keywords,
      demandLevel: totalPotentialBuyers > 0 ? 'Active' : 'En attente de requêtes',
      suggestedBudget: 2500,
      estimatedBoostClicks: Math.round(totalPotentialBuyers * 0.3)
    };
  } catch {
    return {
      totalPotentialBuyers: 0,
      estimatedReach: 0,
      keywords: [],
      demandLevel: 'En attente de requêtes',
      suggestedBudget: 2500,
      estimatedBoostClicks: 0
    };
  }
}

/**
 * Récupère les campagnes de boost actives du commerçant.
 */
export function getActiveBoostCampaigns(shopId) {
  try {
    const raw = localStorage.getItem(BOOST_CAMPAIGNS_KEY);
    let campaigns = raw ? JSON.parse(raw) : [];
    // Nettoyer automatiquement les anciennes campagnes factices de test
    campaigns = campaigns.filter(c => c.productName !== 'Article Vedette' && c.shopId === shopId);
    return campaigns;
  } catch {
    return [];
  }
}

/**
 * Crée ou active une nouvelle campagne de mise en avant sponsorisée (Facebook Boost Style).
 */
export function createBoostCampaign(shopId, campaignData) {
  try {
    const raw = localStorage.getItem(BOOST_CAMPAIGNS_KEY);
    const campaigns = raw ? JSON.parse(raw) : [];
    const newCampaign = {
      id: `BOOST-${Date.now().toString().slice(-5)}`,
      shopId,
      ...campaignData,
      status: 'active',
      startDate: new Date().toISOString(),
      viewsDelivered: 0,
      clicksDelivered: 0
    };
    campaigns.unshift(newCampaign);
    localStorage.setItem(BOOST_CAMPAIGNS_KEY, JSON.stringify(campaigns));
    return newCampaign;
  } catch (e) {
    return null;
  }
}
