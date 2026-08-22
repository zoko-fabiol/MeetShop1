import React, { useState } from 'react';
import { 
  Star, 
  Share2, 
  Search, 
  Highlighter, 
  BarChart3, 
  Percent, 
  Award, 
  Users, 
  Quote, 
  Code, 
  Calendar, 
  Heart, 
  ShoppingBag, 
  Facebook, 
  Instagram, 
  MapPin, 
  Zap, 
  CheckSquare, 
  Check, 
  Sparkles, 
  MessageSquare, 
  ExternalLink,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Send,
  PhoneCall,
  Flame
} from 'lucide-react';
import { getDesignVariant } from '../../config/blockDesignStyles';
import { getTheme } from '../../config/themes';
import { getSnippetShape, getSnippetBorderStyle, getSnippetShadowStyle } from '../../config/snippetShapes';
import { getCustomColorStyle } from '../../config/colorTokens';
import CountdownClockRenderer from './CountdownClockRenderer';

export default function InnerSnippetRenderer({
  snippetType = 'rating',
  props = {},
  shop = {},
  themeId = 'emerald',
  designVariant = 'modern_minimal',
  onSelectProduct,
  onOpenWhatsApp,
  onNavigateToCatalog
}) {
  const [copied, setCopied] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [inputText, setInputText] = useState('');
  
  const dv = getDesignVariant(props.designVariant || designVariant || 'modern_minimal');
  const theme = getTheme(themeId);
  const shape = getSnippetShape(props.shape || 'rounded_modern');
  const border = getSnippetBorderStyle(props.borderStyle || 'default');
  const shadow = getSnippetShadowStyle(props.shadowStyle || 'default');

  const titleStyle = getCustomColorStyle(props.titleColor);
  const textStyle = getCustomColorStyle(props.textColor);

  const spacingClass = props.spacing === 'compact' 
    ? 'p-2.5 sm:p-3' 
    : props.spacing === 'spacious' 
      ? 'p-5 sm:p-6' 
      : 'p-3.5 sm:p-4';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: shop.name || 'MeetShop',
        text: `Découvrez la boutique ${shop.name} sur MeetShop !`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isPill = ['facebook', 'instagram', 'whatsapp', 'tiktok', 'youtube'].includes(snippetType);

  if (isPill) {
    return (
      <div className="inline-flex items-center">
        {/* PILULE FACEBOOK */}
        {snippetType === 'facebook' && (
          <a
            href={props.url || props.facebookUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!props.url && !props.facebookUrl) e.preventDefault();
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1877F2] text-white hover:bg-[#166fe5] shadow-md hover:shadow-lg transition-all active:scale-95 text-xs font-black select-none cursor-pointer"
          >
            <Facebook className="w-3.5 h-3.5 fill-white" />
            <span>{props.label || props.title || 'Facebook'}</span>
          </a>
        )}

        {/* PILULE INSTAGRAM */}
        {snippetType === 'instagram' && (
          <a
            href={props.url || (props.username ? `https://instagram.com/${props.username.replace('@', '')}` : '#')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!props.url && !props.username) e.preventDefault();
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-md hover:shadow-lg transition-all active:scale-95 text-xs font-black select-none cursor-pointer"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>{props.label || (props.username ? `@${props.username.replace('@', '')}` : 'Instagram')}</span>
          </a>
        )}

        {/* PILULE WHATSAPP */}
        {snippetType === 'whatsapp' && (
          <button
            type="button"
            onClick={() => onOpenWhatsApp?.(props.phone || shop?.phone, shop?.name)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#25D366] text-white hover:bg-[#20bd5a] shadow-md hover:shadow-lg transition-all active:scale-95 text-xs font-black select-none cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-white" />
            <span>{props.label || props.phone || shop?.phone || 'WhatsApp'}</span>
          </button>
        )}

        {/* PILULE TIKTOK */}
        {snippetType === 'tiktok' && (
          <a
            href={props.url || (props.username ? `https://tiktok.com/@${props.username.replace('@', '')}` : '#')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!props.url && !props.username) e.preventDefault();
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 dark:bg-black text-white hover:bg-slate-800 shadow-md hover:shadow-lg border border-slate-700 transition-all active:scale-95 text-xs font-black select-none cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-[#FE2C55]" />
            <span>{props.label || (props.username ? `@${props.username.replace('@', '')}` : 'TikTok')}</span>
          </a>
        )}

        {/* PILULE YOUTUBE */}
        {snippetType === 'youtube' && (
          <a
            href={props.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!props.url) e.preventDefault();
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF0000] text-white hover:bg-[#e60000] shadow-md hover:shadow-lg transition-all active:scale-95 text-xs font-black select-none cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>{props.label || 'YouTube'}</span>
          </a>
        )}
      </div>
    );
  }

  return (
    <div className={`w-full max-w-full min-w-0 overflow-hidden break-words transition-all duration-300 ${spacingClass} ${shape.class} ${border.class} ${shadow.class} ${dv.containerClass}`}>
      
      {/* 1. ÉVALUATION (ÉTOILES & AVIS) */}
      {snippetType === 'rating' && (
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-0.5 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div>
              <span style={titleStyle} className={`text-sm sm:text-base ${dv.headerClass}`}>
                {props.ratingScore || '4.9'} / 5
              </span>
              <span style={textStyle} className={`text-[11px] ml-1.5 ${dv.subTextClass}`}>
                ({props.reviewsCount || '142'} avis vérifiés)
              </span>
            </div>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${dv.accentBadgeClass}`}>
            ★ 100% Recommandé
          </span>
        </div>
      )}

      {/* 2. CARD DE CONTENU ENRICHI */}
      {snippetType === 'card' && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className={`px-2 py-0.5 rounded-xl text-[11px] font-black ${dv.accentBadgeClass}`}>
              {props.badge || 'À la une'}
            </span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <h3 style={titleStyle} className={`text-base sm:text-lg ${dv.headerClass}`}>
            {props.title || 'Notre Engagement Qualité & Service'}
          </h3>
          <p style={textStyle} className={`text-xs leading-relaxed ${dv.subTextClass}`}>
            {props.subtitle || 'Chaque article de notre boutique est contrôlé et certifié avec garantie de satisfaction et livraison express sur tout le Cameroun.'}
          </p>
          {props.ctaText && (
            <button
              type="button"
              onClick={() => onOpenWhatsApp?.(shop.phone, shop.name)}
              className={`px-3.5 py-1.5 text-xs flex items-center gap-2 ${dv.buttonClass}`}
            >
              <span>{props.ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* 3. PARTAGER SUR LES RÉSEAUX */}
      {snippetType === 'share' && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h4 style={titleStyle} className={`text-xs sm:text-sm ${dv.headerClass}`}>Partagez notre boutique</h4>
              <p style={textStyle} className={`text-[11px] ${dv.subTextClass}`}>Faites découvrir nos offres à vos contacts</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleShare}
            className={`px-3.5 py-1.5 text-xs flex items-center gap-1.5 ${dv.buttonClass}`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Lien copié !' : 'Partager'}</span>
          </button>
        </div>
      )}

      {/* 4. RÉSEAUX SOCIAUX COMPLETS */}
      {snippetType === 'social_networks' && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 style={titleStyle} className={`text-xs sm:text-sm ${dv.headerClass}`}>Suivez notre boutique</h4>
            <p style={textStyle} className={`text-[11px] ${dv.subTextClass}`}>Restez connectés à nos actualités</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenWhatsApp?.(shop.phone, shop.name)}
              className="p-2 rounded-xl bg-emerald-600 text-white hover:scale-105 active:scale-95 transition-all shadow-sm"
              title="WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
            {shop.facebook_url && (
              <a
                href={shop.facebook_url}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-blue-600 text-white hover:scale-105 active:scale-95 transition-all shadow-sm"
                title="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
            )}
            {shop.instagram_url && (
              <a
                href={shop.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white hover:scale-105 active:scale-95 transition-all shadow-sm"
                title="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* 5. FACEBOOK DÉDIÉ */}
      {snippetType === 'facebook' && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 style={titleStyle} className={`text-xs sm:text-sm ${dv.headerClass}`}>Rejoignez notre page Facebook</h4>
            <p style={textStyle} className={`text-[11px] ${dv.subTextClass}`}>Offres exclusives & arrivages en direct</p>
          </div>
          <a
            href={shop.facebook_url || 'https://facebook.com'}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Facebook className="w-3.5 h-3.5" />
            <span>Voir sur Facebook</span>
          </a>
        </div>
      )}

      {/* 6. INSTAGRAM DÉDIÉ */}
      {snippetType === 'instagram' && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 style={titleStyle} className={`text-xs sm:text-sm ${dv.headerClass}`}>Notre univers Instagram</h4>
            <p style={textStyle} className={`text-[11px] ${dv.subTextClass}`}>Photos haute résolution et stories boutique</p>
          </div>
          <a
            href={shop.instagram_url || 'https://instagram.com'}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-90 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Suivre sur Instagram</span>
          </a>
        </div>
      )}

      {/* 7. BARRE DE RECHERCHE RAPIDE */}
      {snippetType === 'search' && (
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 opacity-50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Rechercher un produit, une référence, une taille..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/5 dark:bg-white/10 border border-current/20 text-xs text-current placeholder-current/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span style={textStyle} className="text-[10px] opacity-70 text-current">Tendances :</span>
            {['Nouveautés', 'Promos du jour', 'Meilleures Ventes'].map((t) => (
              <span key={t} className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-current border border-current/15 text-[10px] font-medium cursor-pointer hover:bg-emerald-500/20">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 8. SURLIGNAGE / CALLOUT */}
      {snippetType === 'highlight' && (
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500 shrink-0">
            <Highlighter className="w-4 h-4" />
          </div>
          <div>
            <h4 style={titleStyle} className={`text-xs sm:text-sm ${dv.headerClass}`}>
              {props.title || 'Information Importante Boutique'}
            </h4>
            <p style={textStyle} className={`text-xs leading-relaxed pt-0.5 ${dv.subTextClass}`}>
              {props.subtitle || 'Nos expéditions sont traitées et remises aux livreurs partenaires sous 30 minutes après confirmation de votre commande sur WhatsApp.'}
            </p>
          </div>
        </div>
      )}

      {/* 9. GRAPHIQUE & CHIFFRES CLÉS */}
      {snippetType === 'chart' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 style={titleStyle} className={`text-xs sm:text-sm ${dv.headerClass}`}>Performance & Chiffres Clés</h4>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${dv.accentBadgeClass}`}>Certifié 2026</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-current border border-current/10">
              <span style={titleStyle} className="text-base sm:text-lg font-black block text-emerald-500">99.2%</span>
              <span style={textStyle} className="text-[10px] opacity-80 text-current">Clients Satisfaits</span>
            </div>
            <div className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-current border border-current/10">
              <span style={titleStyle} className="text-base sm:text-lg font-black block text-cyan-500">&lt; 45m</span>
              <span style={textStyle} className="text-[10px] opacity-80 text-current">Délai Moyen</span>
            </div>
            <div className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-current border border-current/10">
              <span style={titleStyle} className="text-base sm:text-lg font-black block text-amber-500">100%</span>
              <span style={textStyle} className="text-[10px] opacity-80 text-current">Authenticité</span>
            </div>
          </div>
        </div>
      )}

      {/* 10. BARRE DE PROGRESSION */}
      {snippetType === 'progress' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span style={titleStyle} className={`font-bold ${dv.headerClass}`}>
              {props.title || 'Stock & Commandes du Jour'}
            </span>
            <span style={titleStyle} className="font-mono font-black text-emerald-500">
              {props.progressPercent || 82}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${props.progressPercent || 82}%` }}
            />
          </div>
          <p style={textStyle} className={`text-[10px] ${dv.subTextClass}`}>
            Forte affluence aujourd'hui — Commandez vite vos articles favoris avant rupture !
          </p>
        </div>
      )}

      {/* 11. BADGE DE CONFIANCE */}
      {snippetType === 'badge' && (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 style={titleStyle} className={`text-xs sm:text-sm ${dv.headerClass}`}>
              {props.title || 'Commerçant Vérifié MeetShop'}
            </h4>
            <p style={textStyle} className={`text-[11px] ${dv.subTextClass}`}>
              {props.subtitle || 'Identité commerciale certifiée et politique de retour respectée.'}
            </p>
          </div>
        </div>
      )}

      {/* 12. BADGE CTA ANIMÉ */}
      {snippetType === 'badge_cta' && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase ${dv.accentBadgeClass} animate-bounce`}>
              ⚡ Spécial
            </span>
            <div>
              <h4 style={titleStyle} className={`text-xs sm:text-sm ${dv.headerClass}`}>Offre Limitée du Jour</h4>
              <p style={textStyle} className={`text-[11px] ${dv.subTextClass}`}>Profitez des remises exclusives sur WhatsApp</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenWhatsApp?.(shop.phone, shop.name)}
            className={`px-4 py-2 text-xs flex items-center gap-1.5 ${dv.buttonClass}`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>En Profiter</span>
          </button>
        </div>
      )}

      {/* 13. AVATARS COMMUNAUTÉ */}
      {snippetType === 'avatars' && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 overflow-hidden">
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Client" />
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Client" />
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Client" />
            </div>
            <div>
              <h4 style={titleStyle} className={`text-xs sm:text-sm ${dv.headerClass}`}>+850 Clients Satisfaits</h4>
              <p style={textStyle} className={`text-[11px] ${dv.subTextClass}`}>Rejoignez notre communauté d'acheteurs au Cameroun</p>
            </div>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${dv.accentBadgeClass}`}>
            Communauté VIP
          </span>
        </div>
      )}

      {/* 14. CITATION */}
      {snippetType === 'quote' && (
        <div className="relative pl-6 border-l-2 border-emerald-500 space-y-1">
          <Quote className="w-4 h-4 text-emerald-500 absolute -top-1 left-0 opacity-70" />
          <p style={textStyle} className={`text-xs sm:text-sm italic leading-relaxed ${dv.subTextClass}`}>
            "{props.subtitle || 'Le service client a été irréprochable et mes articles sont arrivés en moins de 45 minutes à Bonapriso.'}"
          </p>
          <span style={titleStyle} className={`text-[11px] font-bold block ${dv.headerClass}`}>
            — {props.title || 'Client Vérifié MeetShop'}
          </span>
        </div>
      )}

      {/* 15. FORMULAIRE RAPIDE */}
      {snippetType === 'form' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 style={titleStyle} className={`text-xs sm:text-sm ${dv.headerClass}`}>
              {props.title || 'Demande Rapide de Devis / Commande'}
            </h4>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${dv.accentBadgeClass}`}>Direct WhatsApp</span>
          </div>
          {feedbackSent ? (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center">
              ✓ Demande envoyée ! Nous vous recontactons immédiatement.
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Indiquez l'article recherché ou votre question..."
                className="flex-1 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 border border-current/20 text-xs text-current placeholder-current/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => {
                  if (inputText.trim()) {
                    onOpenWhatsApp?.(shop.phone, shop.name);
                    setFeedbackSent(true);
                  }
                }}
                className={`px-4 py-2 text-xs flex items-center gap-1.5 ${dv.buttonClass}`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Envoyer</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 16. COMPTE À REBOURS */}
      {snippetType === 'countdown' && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${dv.accentBadgeClass}`}>
              Flash Promo
            </span>
            <h4 style={titleStyle} className={`text-xs sm:text-sm mt-0.5 ${dv.headerClass}`}>
              {props.title || 'Vente Flash du Jour'}
            </h4>
          </div>
          <div>
            <CountdownClockRenderer
              hours={props.hours || 14}
              minutes={props.minutes || 59}
              seconds={props.seconds || 8}
              clockStyle={props.clockStyle || 'flip_card'}
              themeId={themeId}
              dv={dv}
            />
          </div>
        </div>
      )}

      {/* 17. EMBED CODE / WIDGET */}
      {snippetType === 'embed' && (
        <div className="space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span style={titleStyle} className="text-[10px] font-bold">Widget HTML / Iframe</span>
            <Code className="w-3.5 h-3.5" />
          </div>
          <div className="p-3 rounded-xl bg-slate-950 text-emerald-400 border border-slate-800 text-[11px] overflow-x-auto">
            <code>&lt;!-- Widget Externe {shop.name} connecté --&gt;</code>
          </div>
        </div>
      )}

      {/* 18. CARTE GPS & LOCALISATION */}
      {snippetType === 'map' && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 style={titleStyle} className={`text-xs sm:text-sm ${dv.headerClass}`}>{shop.name}</h4>
              <p style={textStyle} className={`text-[11px] ${dv.subTextClass}`}>{shop.quarter || 'Akwa'}, {shop.city || 'Douala'}</p>
            </div>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.name} ${shop.quarter} ${shop.city}`)}`}
            target="_blank"
            rel="noreferrer"
            className={`px-3.5 py-1.5 text-xs flex items-center gap-1.5 ${dv.buttonClass}`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Itinéraire</span>
          </a>
        </div>
      )}

      {/* 19. PRISE DE RENDEZ-VOUS */}
      {snippetType === 'booking' && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h4 style={titleStyle} className={`text-xs sm:text-sm ${dv.headerClass}`}>
                {props.title || 'Réservation & Essayage'}
              </h4>
              <p style={textStyle} className={`text-[11px] ${dv.subTextClass}`}>
                {props.subtitle || 'Réservez votre créneau de passage en boutique'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenWhatsApp?.(shop.phone, shop.name)}
            className={`px-3.5 py-1.5 text-xs flex items-center gap-1.5 ${dv.buttonClass}`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Prendre RDV</span>
          </button>
        </div>
      )}

      {/* 20. DONATION & POURBOIRE */}
      {snippetType === 'donation' && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
            <div>
              <h4 style={titleStyle} className={`text-xs sm:text-sm ${dv.headerClass}`}>Soutenez notre commerce local</h4>
              <p style={textStyle} className={`text-[11px] ${dv.subTextClass}`}>Merci pour votre fidélité et vos encouragements</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenWhatsApp?.(shop.phone, shop.name)}
            className={`px-3.5 py-1.5 text-xs flex items-center gap-1.5 ${dv.buttonClass}`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Soutenir</span>
          </button>
        </div>
      )}

      {/* 21. BOUTON PANIER RAPIDE */}
      {snippetType === 'cart' && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h4 style={titleStyle} className={`text-xs sm:text-sm ${dv.headerClass}`}>Consultez le Catalogue</h4>
              <p style={textStyle} className={`text-[11px] ${dv.subTextClass}`}>Tous les articles en stock prêts à être expédiés</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onNavigateToCatalog) onNavigateToCatalog();
              else {
                const catBlock = document.querySelector('[data-block-type="CategoryCatalog"]');
                if (catBlock) catBlock.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className={`px-3.5 py-1.5 text-xs flex items-center gap-1.5 ${dv.buttonClass}`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Voir les articles</span>
          </button>
        </div>
      )}

    </div>
  );
}
