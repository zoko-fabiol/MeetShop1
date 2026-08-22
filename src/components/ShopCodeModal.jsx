import React, { useState } from 'react';
import { X, Hash, Search, ArrowRight, Store } from 'lucide-react';

export default function ShopCodeModal({ isOpen, onClose, shops, onSelectShop }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');
    const cleanCode = code.trim().toUpperCase();
    const found = shops.find(s => s.code.toUpperCase() === cleanCode || s.name.toUpperCase().includes(cleanCode));
    
    if (found) {
      onClose();
      onSelectShop(found);
    } else {
      setError(`Aucune boutique trouvée pour le code "${cleanCode}". Exemple: ZOKO01, ANABA02`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl transition-colors">
        
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Code Boutique Direct</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Accédez directement à la vitrine d'un commerçant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSearch} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Entrez le code de la boutique
            </label>
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ex : ZOKO01 ou ANABA02"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 uppercase tracking-widest font-mono font-bold"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
              >
                Ouvrir
              </button>
            </div>
            {error && <p className="text-xs text-rose-500 dark:text-rose-400 mt-2">{error}</p>}
          </div>

          <div className="pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">Boutiques populaires suggérées :</p>
            <div className="space-y-1.5">
              {shops.slice(0, 3).map((shop) => (
                <div
                  key={shop.id}
                  onClick={() => {
                    onClose();
                    onSelectShop(shop);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/50 cursor-pointer text-xs transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <Store className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                    <span className="font-semibold text-slate-900 dark:text-white">{shop.name}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">({shop.city})</span>
                  </div>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                    #{shop.code}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
