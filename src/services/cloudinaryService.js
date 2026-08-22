/**
 * SERVICE D'UPLOAD D'IMAGES CLOUDINARY
 * Téléverse directement vers Cloudinary CDN (https://api.cloudinary.com/v1_1/{cloud_name}/image/upload)
 * Avec fallback local instantané en cas de preset non encore passé en "Unsigned".
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'p0dhtw3i';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

/**
 * Compresse une image localement via Canvas en WebP optimisé (< 80 Ko)
 */
export async function compressImageLocally(file, maxWidth = 1000, quality = 0.82) {
  return new Promise((resolve) => {
    if (!file) return resolve('');
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/webp', quality);
          resolve(dataUrl);
        } catch {
          resolve(e.target.result);
        }
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

/**
 * Upload une image vers Cloudinary
 * @param {File|Blob} file - Le fichier image sélectionné par l'utilisateur
 * @param {string} folder - Dossier optionnel
 * @returns {Promise<string>} - L'URL sécurisée Cloudinary ou DataURL optimisée
 */
export async function uploadImageToCloudinary(file, folder = 'meetshop_products') {
  if (!file) throw new Error('Aucun fichier fourni pour l\'upload');

  try {
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (response.ok && (data.secure_url || data.url)) {
      let finalUrl = data.secure_url || data.url;
      // Optimisation CDN Cloudinary automatique
      if (finalUrl.includes('/upload/')) {
        finalUrl = finalUrl.replace('/upload/', '/upload/f_auto,q_auto,w_1000,c_limit/');
      }
      return finalUrl;
    } else {
      console.warn('Information Cloudinary API:', data.error?.message || data);
      // Fallback local immédiat haute performance
      return await compressImageLocally(file);
    }
  } catch (error) {
    console.warn('Erreur réseau Cloudinary (fallback local activé):', error);
    return await compressImageLocally(file);
  }
}

