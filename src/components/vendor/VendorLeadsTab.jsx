import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Search, 
  Filter, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  Archive, 
  User, 
  Phone, 
  Calendar, 
  Sparkles,
  ArrowRight,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { getShopFormLeads, updateLeadStatus } from '../../services/formsService';

export default function VendorLeadsTab({ vendor }) {
  const shopId = vendor?.id || vendor?.code || 'default';
  const [leads, setLeads] = useState(() => getShopFormLeads(shopId));
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'nouveau' | 'traite' | 'archive'
  const [searchQuery, setSearchQuery] = useState('');

  // Recharger lors des événements de stockage
  useEffect(() => {
    const handleStorage = () => {
      setLeads(getShopFormLeads(shopId));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [shopId]);

  const handleStatusChange = (leadId, newStatus) => {
    updateLeadStatus(shopId, leadId, newStatus);
    setLeads(getShopFormLeads(shopId));
  };

  const handleReplyWhatsApp = (lead) => {
    const cleanPhone = (lead.customer?.phone || '').replace(/\D/g, '');
    if (!cleanPhone) return;

    let msg = `Bonjour *${lead.customer?.name || ''}* ! C'est la boutique *${vendor?.name || 'MeetShop'}* concernant votre demande "${lead.formTitle}".\n`;
    msg += `Nous avons bien reçu vos réponses et nous sommes à votre disposition pour vous conseiller.`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    if (lead.status === 'nouveau') {
      handleStatusChange(lead.id, 'traite');
    }
  };

  // Filtrage
  const filteredLeads = leads.filter(lead => {
    const matchesStatus = statusFilter === 'all' || (lead.status || 'nouveau') === statusFilter;
    const matchesSearch = 
      lead.formTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.customer?.phone?.includes(searchQuery) ||
      lead.answers?.some(a => a.answer?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const newCount = leads.filter(l => (l.status || 'nouveau') === 'nouveau').length;
  const processedCount = leads.filter(l => l.status === 'traite').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* ── BANNIÈRE STATISTIQUES LEADS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Total Demandes</span>
            <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {leads.length} <span className="text-xs font-medium text-slate-500">questionnaires</span>
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Nouveaux Prospects</span>
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {newCount} <span className="text-xs font-medium text-slate-500">à recontacter</span>
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Prospects Traités</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {processedCount} <span className="text-xs font-medium text-slate-500">qualifiés</span>
          </p>
        </div>
      </div>

      {/* ── BARRE D'OUTILS ET FILTRES ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher (Nom, Téléphone, Réponse...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'nouveau', label: `Nouveaux (${newCount})` },
            { id: 'traite', label: 'Traités' },
            { id: 'archive', label: 'Archivés' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── LISTE DES RÉPONSES AUX QUESTIONNAIRES ── */}
      {filteredLeads.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-slate-950/40 border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <HelpCircle className="w-7 h-7" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
            {searchQuery || statusFilter !== 'all' ? 'Aucune demande ne correspond à ce filtre' : 'Aucun formulaire soumis pour le moment'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Ajoutez un bloc "Questionnaire & Devis Interactif" sur votre vitrine pour collecter automatiquement les besoins de vos clients.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLeads.map((lead) => {
            const isNew = (lead.status || 'nouveau') === 'nouveau';
            const isProcessed = lead.status === 'traite';

            return (
              <div
                key={lead.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-emerald-500/40 transition-colors"
              >
                {/* En-tête du Lead */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                      #{lead.id}
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {lead.formTitle}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Récent'}</span>
                    </div>
                  </div>

                  {/* Sélecteur de statut */}
                  <div className="flex items-center gap-2">
                    <select
                      value={lead.status || 'nouveau'}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="nouveau">Nouveau Prospect</option>
                      <option value="traite">Traité / Qualifié</option>
                      <option value="archive">Archivé</option>
                    </select>
                  </div>
                </div>

                {/* Corps : Réponses du questionnaire & Coordonnées */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  
                  {/* Détail des Réponses */}
                  <div className="md:col-span-2 space-y-2">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Réponses au questionnaire</span>
                    </span>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {lead.answers?.map((ans, aIdx) => (
                        <div key={aIdx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
                          <p className="font-semibold text-slate-600 dark:text-slate-400 text-[11px]">
                            {ans.question}
                          </p>
                          <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                            {ans.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Coordonnées & Relance WhatsApp */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-2">
                        <User className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Coordonnées du Prospect</span>
                      </span>
                      <div className="space-y-1.5 text-slate-600 dark:text-slate-400">
                        <p><strong className="text-slate-900 dark:text-white">{lead.customer?.name || 'Prospect'}</strong></p>
                        <p className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono font-bold text-slate-900 dark:text-white">{lead.customer?.phone || 'N/A'}</span>
                        </p>
                        {lead.customer?.city && (
                          <p className="text-[11px] text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{lead.customer.city} {lead.customer.quarter ? `(${lead.customer.quarter})` : ''}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {lead.customer?.phone && (
                      <button
                        type="button"
                        onClick={() => handleReplyWhatsApp(lead)}
                        className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/25 active:scale-95"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Répondre sur WhatsApp</span>
                      </button>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
