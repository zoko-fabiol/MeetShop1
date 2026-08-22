import React, { useState, useEffect } from 'react';
import { Camera, Store, Zap } from 'lucide-react';

const FEATURES = [
  {
    id: 1,
    tag: "RECHERCHE VISUELLE IA",
    metric: "0.4s Détection",
    title: "Trouvez par photo",
    desc: "Prenez une photo d'un article pour trouver immédiatement sa boutique à Douala ou Yaoundé.",
    icon: Camera,
    color: "from-green-500/10 via-emerald-500/5 to-transparent dark:from-green-500/20 dark:to-emerald-500/5",
    border: "border-green-500/30",
    textCol: "text-green-600 dark:text-green-400"
  },
  {
    id: 2,
    tag: "ACHETEZ LOCALEMENT",
    metric: "150+ Boutiques",
    title: "Vente de Proximité",
    desc: "Accédez aux offres exclusives de boutiques locales vérifiées avec contact direct et commande via WhatsApp.",
    icon: Store,
    color: "from-blue-500/10 via-cyan-500/5 to-transparent dark:from-blue-500/20 dark:to-cyan-500/5",
    border: "border-blue-500/30",
    textCol: "text-blue-600 dark:text-blue-400"
  },
  {
    id: 3,
    tag: "LOGISTIQUE IA EXPRESS",
    metric: "Livré < 2h",
    title: "Expédition Intelligente",
    desc: "Système automatisé de suivi et de gestion de coursiers urbains pour des livraisons rapides à domicile.",
    icon: Zap,
    color: "from-amber-500/10 via-orange-500/5 to-transparent dark:from-amber-500/20 dark:to-orange-500/5",
    border: "border-amber-500/30",
    textCol: "text-amber-600 dark:text-amber-400"
  }
];

export default function FeaturesSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FEATURES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Grille Desktop / Slider Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FEATURES.map((item, idx) => {
          const Icon = item.icon;
          const isSelected = activeIndex === idx;

          return (
            <div
              key={item.id}
              onClick={() => setActiveIndex(idx)}
              className={`p-5 rounded-3xl bg-white dark:bg-slate-900 bg-gradient-to-br ${item.color} border ${item.border} cursor-pointer transition-all duration-300 shadow-sm ${
                isSelected ? 'scale-[1.02] shadow-lg ring-1 ring-slate-400/20 dark:ring-white/10' : 'opacity-90 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900/80 ${item.textCol} border border-slate-200 dark:border-slate-800`}>
                  {item.tag}
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800/90 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  {item.metric}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className={`p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/90 ${item.textCol} shadow-inner shrink-0 border border-slate-200 dark:border-slate-800`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
