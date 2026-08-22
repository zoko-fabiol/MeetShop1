import React from 'react';
import { Radio, ArrowRight, Star, MapPin, Phone } from 'lucide-react';

export default function LiveShops({ shops, onSelectShop, onOpenAllShops }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Header section */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Boutiques à la Une
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/30 text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
              En direct
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Commerçants vérifiés disponibles pour expédition immédiate</p>
        </div>

        <button
          onClick={onOpenAllShops}
          className="text-xs font-bold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center gap-1 group transition-colors"
        >
          <span>TOUT VOIR</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Carrousel / Grille des Boutiques */}
      {shops.length === 0 ? (
        <div className="p-8 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Aucune boutique enregistrée pour le moment</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Soyez le premier commerçant à ouvrir votre boutique sur MeetShop !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {shops.map((shop) => {
            const heroBlock = shop?.layout_config?.blocks?.find(b => b && b.type === 'HeroBanner');
            const shopCover = heroBlock?.props?.customCoverUrl || shop?.banner || shop?.banner_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80';
            const shopLogo = heroBlock?.props?.customLogoUrl || shop?.logo || shop?.logo_url || 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=150&auto=format&fit=crop&q=80';

            return (
              <div
                key={shop.id || shop.code}
                onClick={() => onSelectShop(shop)}
                className="group relative bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-green-500/40 overflow-hidden shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
              >
                {/* Bannière boutique */}
                <div className="h-24 w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                  <img
                    src={shopCover}
                    alt={shop.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-slate-900 via-transparent to-transparent" />
                  
                  {shop.isLive && (
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-green-600 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      LIVE
                    </div>
                  )}
                </div>

                {/* Corps boutique */}
                <div className="p-4 relative">
                  {/* Logo superposé */}
                  <div className="absolute -top-7 left-4 w-12 h-12 rounded-2xl border-2 border-white dark:border-slate-900 overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-md">
                    <img
                      src={shopLogo}
                      alt={shop.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=150&auto=format&fit=crop&q=80';
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="pt-5">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {shop.name}
                      </h4>
                      <div className="flex items-center gap-0.5 text-amber-500 text-xs font-semibold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{shop.rating || 5.0}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mb-2">
                      <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
                      <span className="truncate">{shop.quarter || ''}{shop.quarter && shop.city ? ', ' : ''}{shop.city || 'Cameroun'}</span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                      {shop.description || `Boutique officielle ${shop.name} sur MeetShop.`}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
                      <span className="font-mono text-green-600 dark:text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded-md">
                        #{shop.code}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 font-medium flex items-center gap-1">
                        Visiter <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}
