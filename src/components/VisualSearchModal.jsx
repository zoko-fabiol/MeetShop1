import React, { useState, useRef } from 'react';
import { X, Camera, Upload, Sparkles, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { searchByImage } from '../services/visualSearch';

export default function VisualSearchModal({ 
  isOpen, 
  onClose, 
  allProducts, 
  onSelectProduct 
}) {
  const [imagePreview, setImagePreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [detectedTags, setDetectedTags] = useState([]);
  const [scanTime, setScanTime] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Aperçu
    const reader = new FileReader();
    reader.onload = async (event) => {
      setImagePreview(event.target.result);
      setIsScanning(true);
      setSearchResults(null);

      // Simulation du temps de scan IA rapide (~0.4s)
      const res = await searchByImage(file, allProducts);
      
      setTimeout(() => {
        setSearchResults(res.results);
        setDetectedTags(res.detectedTags || ['Article Détecté']);
        setScanTime(res.executionTime || '0.38');
        setIsScanning(false);
      }, 400);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setImagePreview(null);
    setSearchResults(null);
    setIsScanning(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative transition-colors">
        
        {/* Header Modal */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-green-500/15 text-green-600 dark:text-green-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Recherche Visuelle IA</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Vise l'objet, trouve la boutique en 0.4s</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps Modal */}
        <div className="p-5 max-h-[75vh] overflow-y-auto">
          
          {!imagePreview ? (
            <div className="text-center py-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-green-500/60 rounded-3xl p-8 cursor-pointer bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all flex flex-col items-center justify-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="w-8 h-8" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Prendre une photo ou importer une image</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-4">
                  Capturez n'importe quel vêtement, gadget, appareil ou produit pour voir les boutiques qui l'ont en stock.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 hover:bg-green-400 text-slate-950 font-bold text-xs shadow-md">
                  <Upload className="w-4 h-4" />
                  <span>Choisir une photo</span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Image scannée et animation */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 h-48 flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="Aperçu photo"
                  className="max-h-full max-w-full object-contain"
                />
                
                {isScanning && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-green-400 animate-spin mb-2" />
                    <p className="text-xs font-bold text-green-400 animate-pulse">
                      Analyse neuronale & reconnaissance en cours...
                    </p>
                  </div>
                )}

                {!isScanning && (
                  <button
                    onClick={handleReset}
                    className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-slate-900/80 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 backdrop-blur-sm shadow-sm"
                  >
                    Changer de photo
                  </button>
                )}
              </div>

              {/* Résultat du Scan */}
              {!isScanning && searchResults && (
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{searchResults.length} articles trouvés en {scanTime}s</span>
                    </div>
                    <div className="flex gap-1">
                      {detectedTags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onClose();
                          onSelectProduct(item);
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 hover:border-green-500/50 cursor-pointer transition-all group shadow-sm"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-xl object-cover bg-slate-100 dark:bg-slate-900 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-green-600 dark:text-green-400 font-bold">
                              {Math.round((item.similarity || 0.92) * 100)}% match
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                              {item.shopCity}
                            </span>
                          </div>
                          <h5 className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-green-600 dark:group-hover:text-green-300">
                            {item.name}
                          </h5>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {item.shopName}
                          </p>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {item.price.toLocaleString('fr-FR')} FCFA
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer Modal */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-500">
          Technologie IA visuelle intégrée • Détection de proximité Douala & Yaoundé
        </div>

      </div>
    </div>
  );
}
