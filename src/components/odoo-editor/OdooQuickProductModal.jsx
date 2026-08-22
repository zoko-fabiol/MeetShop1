import React, { useState, useRef } from 'react';
import { 
  X, 
  Plus, 
  Upload, 
  Sparkles, 
  Tag, 
  ShoppingBag, 
  DollarSign, 
  Layers, 
  Image as ImageIcon, 
  Check, 
  AlertCircle,
  PackageCheck,
  Trash2,
  Star,
  Camera
} from 'lucide-react';
import { getTheme } from '../../config/themes';

export default function OdooQuickProductModal({
  isOpen,
  onClose,
  onAddProduct,
  shop,
  themeId = 'emerald',
  existingCategories = []
}) {
  const theme = getTheme(themeId);
  const fileInputRef = useRef(null);

  const MAX_IMAGES = 5;
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [category, setCategory] = useState(existingCategories[0] || 'Vêtements');
  const [customCategory, setCustomCategory] = useState('');
  const [images, setImages] = useState([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('10');
  const [badge, setBadge] = useState('Nouveau');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  if (!isOpen) return null;

  // Gestion de la sélection de fichiers photos depuis l'appareil (Max 5 images)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
    e.target.value = ''; // Réinitialiser pour permettre de ré-importer si besoin
  };

  const processFiles = (files) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    setImages(currentImages => {
      const remainingSlots = MAX_IMAGES - currentImages.length;
      if (remainingSlots <= 0) {
        setError(`Limite atteinte : Vous ne pouvez pas ajouter plus de ${MAX_IMAGES} photos par produit.`);
        return currentImages;
      }

      const filesToProcess = imageFiles.slice(0, remainingSlots);
      if (imageFiles.length > remainingSlots) {
        setError(`Seules les ${remainingSlots} premières photos ont été ajoutées (maximum ${MAX_IMAGES} photos par produit).`);
      } else {
        setError('');
      }

      filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          setImages(prev => {
            if (prev.length >= MAX_IMAGES) return prev;
            return [...prev, uploadEvent.target.result];
          });
        };
        reader.readAsDataURL(file);
      });

      return currentImages;
    });
  };

  // Drag and drop de fichiers
  const handleDragOver = (e) => {
    e.preventDefault();
    if (images.length < MAX_IMAGES) {
      setIsDraggingFile(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (images.length >= MAX_IMAGES) {
      setError(`Limite de ${MAX_IMAGES} photos par produit atteinte.`);
      return;
    }
    const files = Array.from(e.dataTransfer.files || []);
    processFiles(files);
  };

  const removeImage = (index, e) => {
    e.stopPropagation();
    setImages(prev => prev.filter((_, i) => i !== index));
    if (coverIndex >= index && coverIndex > 0) {
      setCoverIndex(coverIndex - 1);
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Veuillez renseigner le nom du produit.');
      return;
    }
    const numPrice = Number(price);
    if (!numPrice || numPrice <= 0) {
      setError('Veuillez renseigner un prix de vente valide.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const finalCategory = customCategory.trim() || category || 'Général';
    const mainImage = images[coverIndex] || images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';

    const newProduct = {
      id: `prod-${Date.now()}`,
      name: name.trim(),
      price: numPrice,
      old_price: oldPrice ? Number(oldPrice) : null,
      category: finalCategory,
      image: mainImage,
      images: images.length > 0 ? images : [mainImage],
      description: description.trim() || `Article certifié de qualité disponible chez ${shop?.name}.`,
      stock: Number(stock) || 10,
      badge: badge.trim() || null,
      isNew: badge === 'Nouveau',
      shopId: shop?.id || shop?.code,
      shop_id: shop?.id || shop?.code,
      shopCode: shop?.code,
      shopName: shop?.name,
      vendor_id: shop?.id || shop?.seller_id || shop?.owner_uid,
      created_at: new Date().toISOString()
    };

    try {
      await onAddProduct?.(newProduct);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Erreur lors de l\'enregistrement du produit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#16181D] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-colors">
        
        {/* En-tête style Odoo adaptatif (Clair / Sombre) */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
                <span>Ajouter un Produit style Odoo</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono font-bold border border-emerald-500/20">
                  {shop?.name}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Insertion directe et instantanée dans votre vitrine
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps du Formulaire */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Nom du produit */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Nom du Produit <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Sac à main Cuir Véritable Élégance"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold transition-colors"
            />
          </div>

          {/* Prix & Prix Barré */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Prix de Vente (FCFA) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ex: 25000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Prix d'origine / Barré (Optionnel)
              </label>
              <input
                type="number"
                min="0"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                placeholder="Ex: 35000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 line-through text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Catégorie & Badge Commercial */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Catégorie
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (e.target.value !== '__custom__') setCustomCategory('');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors cursor-pointer"
              >
                {existingCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                {!existingCategories.includes('Vêtements') && <option value="Vêtements">Vêtements</option>}
                {!existingCategories.includes('Chaussures') && <option value="Chaussures">Chaussures</option>}
                {!existingCategories.includes('Accessoires') && <option value="Accessoires">Accessoires</option>}
                {!existingCategories.includes('High-Tech') && <option value="High-Tech">High-Tech</option>}
                {!existingCategories.includes('Beauté & Santé') && <option value="Beauté & Santé">Beauté & Santé</option>}
                <option value="__custom__">+ Nouvelle catégorie...</option>
              </select>
            </div>

            {category === '__custom__' && (
              <div>
                <label className="block text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1.5">
                  Nom de la Catégorie
                </label>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Ex: Électroménager"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-emerald-500/50 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Badge Commercial
              </label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors cursor-pointer"
              >
                <option value="Nouveau">Nouveau</option>
                <option value="Bestseller">Bestseller 🔥</option>
                <option value="Promo -25%">Promo -25%</option>
                <option value="Coup de cœur">Coup de cœur ❤️</option>
                <option value="Stock Limité">Stock Limité ⚠️</option>
                <option value="">Aucun badge</option>
              </select>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════
              IMPORTATION DE PHOTOS DEPUIS L'APPAREIL (MAX 5 PHOTOS)
             ═══════════════════════════════════════════════════════ */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Photos du Produit (Depuis votre appareil)
              </label>
              <span className={`text-[11px] font-black px-2 py-0.5 rounded-full border ${
                images.length >= MAX_IMAGES
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
              }`}>
                {images.length} / {MAX_IMAGES} photos (Max 5)
              </span>
            </div>

            {/* Input fichier masqué */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              disabled={images.length >= MAX_IMAGES}
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Zone de Glisser-Déposer & Clic pour importer */}
            {images.length < MAX_IMAGES ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`p-5 sm:p-6 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-2 ${
                  isDraggingFile
                    ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]'
                    : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white">
                    Cliquez pour choisir des photos ({MAX_IMAGES - images.length} restante{MAX_IMAGES - images.length > 1 ? 's' : ''})
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Sélectionnez depuis votre galerie, appareil photo ou PC (Max 5 photos)
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Maximum de 5 photos atteint pour ce produit. Supprimez-en une pour en ajouter une autre.</span>
              </div>
            )}

            {/* Grille des photos importées avec aperçu */}
            {images.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  <span>{images.length} photo{images.length > 1 ? 's' : ''} sur {MAX_IMAGES}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-normal">⭐ Cliquez sur l'étoile pour définir la photo principale</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                  {images.map((imgSrc, idx) => {
                    const isCover = coverIndex === idx;
                    return (
                      <div
                        key={idx}
                        className={`relative aspect-square rounded-2xl overflow-hidden border-2 bg-slate-100 dark:bg-slate-950 group shadow-sm transition-all ${
                          isCover ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        <img src={imgSrc} alt="" className="w-full h-full object-cover" />

                        {/* Badge Photo Principale */}
                        {isCover && (
                          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-black uppercase shadow">
                            Cover
                          </span>
                        )}

                        {/* Actions au survol */}
                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCoverIndex(idx);
                            }}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isCover ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-200 hover:text-amber-400'
                            }`}
                            title="Définir comme photo principale"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => removeImage(idx, e)}
                            className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
                            title="Supprimer cette photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Description & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Description Courte
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description, matière, détails..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Quantité en Stock
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="10"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </form>

        {/* Pied de page Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer transition-colors"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <PackageCheck className="w-4 h-4" />
            )}
            <span>Insérer dans la Boutique</span>
          </button>
        </div>

      </div>
    </div>
  );
}
