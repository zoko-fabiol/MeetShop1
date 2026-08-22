import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { supabase, isSupabaseConfigured } from '../config/supabase';
import { getDefaultLayoutConfig } from '../config/shopBlocks';

const AuthContext = createContext();

const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }) {
  // ── Firebase Auth State ──────────────────────────────────────────────
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ── Rôle : 'client' | 'vendor' ───────────────────────────────────────
  const [userRole, setUserRole] = useState(() => localStorage.getItem('meetshop_role') || null);

  // ── Données Boutique (Vendor) ─────────────────────────────────────────
  const [vendor, setVendor] = useState(() => {
    try {
      const saved = localStorage.getItem('meetshop_vendor');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  // ── Profil Client ─────────────────────────────────────────────────────
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('meetshop_user');
      return saved ? JSON.parse(saved) : { name: 'Client MeetShop', city: 'Douala', phone: '' };
    } catch {
      return { name: 'Client MeetShop', city: 'Douala', phone: '' };
    }
  });

  const [authError, setAuthError] = useState('');

  // ── Écoute Firebase Auth ──────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setAuthLoading(false);

      if (user) {
        // ─────────────────────────────────────────────────────────────────
        // 🔒 SOURCE DE VÉRITÉ PHOTO — PRIORITÉ CROSS-APPAREIL :
        //   1. Supabase profiles (avatar_url) & Firebase Auth (user.photoURL)
        //   2. Cache local (localStorage)
        //   3. Fallback Google Auth photo si rien d'autre n'est configuré
        // ─────────────────────────────────────────────────────────────────
        const isCustomPhoto = (url) =>
          url && !url.includes('googleusercontent.com') && !url.includes('google.com/a/');

        const firebaseAuthPhoto = user.photoURL || null;
        const isFirebasePhotoCustom = isCustomPhoto(firebaseAuthPhoto);

        setUserProfile(prev => {
          let localCache = {};
          try {
            localCache = JSON.parse(localStorage.getItem('meetshop_user') || '{}');
          } catch {}

          const bestPhoto = isFirebasePhotoCustom
            ? firebaseAuthPhoto
            : isCustomPhoto(localCache.photoURL)
              ? localCache.photoURL
              : isCustomPhoto(prev.photoURL)
                ? prev.photoURL
                : firebaseAuthPhoto;

          const merged = {
            ...localCache,
            ...prev,
            name: localCache.name || prev.name || user.displayName || 'Client MeetShop',
            email: user.email || prev.email || localCache.email,
            uid: user.uid,
            photoURL: bestPhoto,
            phone: localCache.phone || prev.phone || '',
            city: localCache.city || prev.city || 'Douala',
            quarter: localCache.quarter || prev.quarter || ''
          };

          localStorage.setItem('meetshop_user', JSON.stringify(merged));
          return merged;
        });

        // 🌟 Synchronisation immédiate depuis Supabase (Cloud Database)
        if (isSupabaseConfigured()) {
          supabase.from('profiles').select('name,phone,city,quarter,avatar_url')
            .eq('id', user.uid).single()
            .then(({ data }) => {
              if (data) {
                setUserProfile(prev => {
                  const cloudAvatar = data.avatar_url || null;
                  const finalPhoto = cloudAvatar || (isFirebasePhotoCustom ? firebaseAuthPhoto : null) || (isCustomPhoto(prev.photoURL) ? prev.photoURL : firebaseAuthPhoto);

                  const merged = {
                    ...prev,
                    name: data.name || prev.name,
                    phone: data.phone || prev.phone,
                    city: data.city || prev.city,
                    quarter: data.quarter || prev.quarter,
                    photoURL: finalPhoto
                  };
                  localStorage.setItem('meetshop_user', JSON.stringify(merged));
                  return merged;
                });
              }
            }).catch(() => {});
        }

        // 🌟 Vérifier si l'utilisateur possède une boutique enregistrée
        findExistingVendorForUser(user.uid, user.email).then(existingShop => {
          if (existingShop) {
            setVendor(existingShop);
            localStorage.setItem('meetshop_vendor', JSON.stringify(existingShop));
            const savedRole = localStorage.getItem('meetshop_role');
            if (savedRole === 'vendor') {
              setUserRole('vendor');
            }
          }
        }).catch(() => {});
      }
    });
    return unsubscribe;
  }, []);

  // ── Écoute en Temps Réel Supabase (Cross-Devices Realtime Sync) ───────────
  useEffect(() => {
    if (!isSupabaseConfigured() || !firebaseUser?.uid) return;

    const uid = firebaseUser.uid;

    // 1. Canal Realtime pour le profil utilisateur (Photo, nom, coordonnées)
    const profileChannel = supabase
      .channel(`rt-profile-${uid}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${uid}`
      }, (payload) => {
        if (payload.new) {
          const row = payload.new;
          setUserProfile(prev => {
            const updated = {
              ...prev,
              name: row.name || prev.name,
              phone: row.phone || prev.phone,
              city: row.city || prev.city,
              quarter: row.quarter || prev.quarter,
              photoURL: row.avatar_url !== undefined ? row.avatar_url : prev.photoURL
            };
            localStorage.setItem('meetshop_user', JSON.stringify(updated));
            return updated;
          });
        }
      })
      .subscribe();

    // 2. Canal Realtime pour la boutique du commerçant (Logo, bannière, infos)
    const shopChannel = supabase
      .channel(`rt-shop-${uid}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'shops',
        filter: `owner_id=eq.${uid}`
      }, (payload) => {
        if (payload.new) {
          const row = payload.new;
          setVendor(prev => {
            const updated = {
              ...(prev || {}),
              id: row.id,
              name: row.name,
              code: row.code,
              city: row.city,
              quarter: row.quarter,
              phone: row.phone_whatsapp,
              rating: row.rating,
              isLive: row.is_live,
              logo: row.logo_url,
              banner: row.banner_url,
              description: row.description,
              layout_config: row.layout_config,
              owner_uid: row.owner_id
            };
            localStorage.setItem('meetshop_vendor', JSON.stringify(updated));
            return updated;
          });
        }
      })
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(profileChannel);
        supabase.removeChannel(shopChannel);
      } catch (e) {}
    };
  }, [firebaseUser?.uid]);

  // ── Persistance localStorage ──────────────────────────────────────────
  useEffect(() => {
    if (vendor) localStorage.setItem('meetshop_vendor', JSON.stringify(vendor));
    else localStorage.removeItem('meetshop_vendor');
  }, [vendor]);

  useEffect(() => {
    localStorage.setItem('meetshop_user', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    if (userRole) localStorage.setItem('meetshop_role', userRole);
    else localStorage.removeItem('meetshop_role');
  }, [userRole]);

  // ────────────────────────────────────────────────────────────────────
  // INSCRIPTION CLIENT (Email + Password)
  // ────────────────────────────────────────────────────────────────────
  const signUpClient = async ({ email, password, name, city }) => {
    setAuthError('');
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      setUserRole('client');
      localStorage.setItem('meetshop_role', 'client');
      setUserProfile({ name, city: city || 'Douala', email, uid: cred.user.uid });
      return { success: true };
    } catch (err) {
      const msg = firebaseErrorFR(err.code);
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // ────────────────────────────────────────────────────────────────────
  // CONNEXION CLIENT (Email + Password)
  // ────────────────────────────────────────────────────────────────────
  const signInClient = async ({ email, password }) => {
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setUserRole('client');
      localStorage.setItem('meetshop_role', 'client');
      return { success: true };
    } catch (err) {
      const msg = firebaseErrorFR(err.code);
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // ────────────────────────────────────────────────────────────────────
  // CONNEXION / INSCRIPTION GOOGLE (Client OU Vendor avec Séparation Stricte)
  // ────────────────────────────────────────────────────────────────────
  const signInWithGoogle = async (role = 'client') => {
    setAuthError('');
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      setUserRole(role);
      localStorage.setItem('meetshop_role', role);

      const profileData = {
        name: cred.user.displayName || 'Utilisateur MeetShop',
        email: cred.user.email,
        uid: cred.user.uid,
        photoURL: cred.user.photoURL
      };
      
      setUserProfile(prev => {
        const merged = { ...prev, ...profileData };
        localStorage.setItem('meetshop_user', JSON.stringify(merged));
        return merged;
      });

      // 🌟 Si l'utilisateur choisit de se connecter en tant que Boutique (role === 'vendor') :
      if (role === 'vendor') {
        const existingShop = await findExistingVendorForUser(cred.user.uid, cred.user.email);
        if (existingShop) {
          setVendor(existingShop);
          setUserRole('vendor');
          localStorage.setItem('meetshop_vendor', JSON.stringify(existingShop));
          localStorage.setItem('meetshop_role', 'vendor');
          return { success: true, user: cred.user, vendor: existingShop, isNewVendor: false };
        } else {
          // L'utilisateur n'a pas encore configuré sa boutique Google
          return { success: true, user: cred.user, vendor: null, isNewVendor: true };
        }
      } else {
        // Rôle Client strict
        setUserRole('client');
        localStorage.setItem('meetshop_role', 'client');
        return { success: true, user: cred.user, vendor: null, isNewVendor: false };
      }
    } catch (err) {
      const msg = firebaseErrorFR(err.code);
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // ────────────────────────────────────────────────────────────────────
  // INSCRIPTION BOUTIQUE (Email + Password)
  // ────────────────────────────────────────────────────────────────────
  const signUpVendor = async ({ email, password, shopName, city, quarter, phone }) => {
    setAuthError('');
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: shopName });

      const code = shopName.trim().replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 6)
        || `SHP${Math.floor(100 + Math.random() * 900)}`;

      const newShop = {
        id: `shop-${cred.user.uid}`,
        name: shopName.trim(),
        code,
        city: city || 'Douala',
        quarter: quarter || 'Akwa (Centre)',
        phone: phone || '+237690000000',
        rating: 5.0,
        isLive: true,
        description: `Boutique officielle de ${shopName.trim()} sur MeetShop Marketplace.`,
        logo: cred.user.photoURL || 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=150&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
        owner_email: email,
        owner_uid: cred.user.uid
      };
      newShop.layout_config = getDefaultLayoutConfig('emerald', newShop);

      // Sauvegarder dans Supabase si connecté
      try {
        await supabase.from('shops').upsert([{
          name: newShop.name,
          code: newShop.code,
          city: newShop.city,
          quarter: newShop.quarter,
          phone_whatsapp: newShop.phone,
          owner_id: cred.user.uid,
          layout_config: newShop.layout_config,
          is_live: true
        }], { onConflict: 'code' });
      } catch (dbErr) {
        console.warn('Supabase vendor insert:', dbErr);
      }

      // Sauvegarder localement
      const savedShops = JSON.parse(localStorage.getItem('meetshop_shops') || '[]');
      localStorage.setItem('meetshop_shops', JSON.stringify([newShop, ...savedShops]));

      setVendor(newShop);
      setUserRole('vendor');
      return { success: true, vendor: newShop };
    } catch (err) {
      const msg = firebaseErrorFR(err.code);
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // ────────────────────────────────────────────────────────────────────
  // CONNEXION BOUTIQUE (Email + Code boutique existante)
  // ────────────────────────────────────────────────────────────────────
  const signInVendor = async ({ email, password }) => {
    setAuthError('');
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      // Chercher la boutique associée à ce compte
      const savedShops = JSON.parse(localStorage.getItem('meetshop_shops') || '[]');
      let foundShop = savedShops.find(s => s.owner_uid === cred.user.uid || s.owner_email === email);

      if (!foundShop) {
        // Tenter Supabase
        const { data } = await supabase.from('shops').select('*').eq('owner_id', cred.user.uid).single();
        if (data) {
          foundShop = {
            id: data.id,
            name: data.name,
            code: data.code,
            city: data.city,
            quarter: data.quarter,
            phone: data.phone_whatsapp,
            rating: data.rating,
            isLive: data.is_live,
            logo: data.logo_url,
            banner: data.banner_url,
            description: data.description,
            layout_config: data.layout_config,
            owner_uid: cred.user.uid,
            owner_email: email
          };
        }
      }

      if (foundShop) {
        setVendor(foundShop);
        setUserRole('vendor');
        return { success: true };
      } else {
        setAuthError('Aucune boutique trouvée pour ce compte. Veuillez d\'abord créer votre boutique.');
        return { success: false, error: 'Boutique introuvable' };
      }
    } catch (err) {
      const msg = firebaseErrorFR(err.code);
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // ── Connexion legacy (code boutique local — rétrocompatibilité) ───────
  const loginVendor = (codeOrName) => {
    const rawInput = (codeOrName || '').trim().toUpperCase();
    if (!rawInput) return { success: false };
    const savedShops = JSON.parse(localStorage.getItem('meetshop_shops') || '[]');
    const foundShop = savedShops.find(s =>
      s.code?.toUpperCase() === rawInput ||
      s.name?.toUpperCase() === rawInput ||
      s.name?.toUpperCase().includes(rawInput) ||
      rawInput.includes(s.code?.toUpperCase())
    );
    if (foundShop) {
      setVendor(foundShop);
      setUserRole('vendor');
      return { success: true, vendor: foundShop };
    }
    const formattedCode = rawInput.replace(/[^A-Z0-9]/g, '').slice(0, 6) || `SHP${Math.floor(100 + Math.random() * 900)}`;
    const newShop = {
      id: `shop-${Date.now()}`,
      name: codeOrName.trim(),
      code: formattedCode,
      city: 'Douala',
      quarter: 'Akwa (Centre)',
      phone: '+237690000000',
      rating: 5.0,
      isLive: true,
      description: `Boutique officielle de ${codeOrName.trim()} sur MeetShop Marketplace.`,
      logo: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=150&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80'
    };
    const { getDefaultLayoutConfig: gd } = { getDefaultLayoutConfig };
    newShop.layout_config = getDefaultLayoutConfig('emerald', newShop);
    localStorage.setItem('meetshop_shops', JSON.stringify([newShop, ...savedShops]));
    setVendor(newShop);
    setUserRole('vendor');
    return { success: true, vendor: newShop };
  };

  // ────────────────────────────────────────────────────────────────────
  // FINALISATION PROFIL GOOGLE - CLIENT
  // ────────────────────────────────────────────────────────────────────
  const completeClientGoogleProfile = async ({ name, phone, city, quarter }) => {
    setAuthError('');
    try {
      const updatedProfile = {
        ...userProfile,
        name: name || userProfile.name || (firebaseUser?.displayName) || 'Client MeetShop',
        phone: phone || userProfile.phone || '',
        city: city || userProfile.city || 'Douala',
        quarter: quarter || userProfile.quarter || '',
        email: firebaseUser?.email || userProfile.email,
        uid: firebaseUser?.uid || userProfile.uid,
        photoURL: firebaseUser?.photoURL || userProfile.photoURL
      };

      if (firebaseUser && name && name !== firebaseUser.displayName) {
        try {
          await updateProfile(firebaseUser, { displayName: name });
        } catch (e) {}
      }

      setUserProfile(updatedProfile);
      setUserRole('client');
      localStorage.setItem('meetshop_user', JSON.stringify(updatedProfile));
      localStorage.setItem('meetshop_role', 'client');
      return { success: true };
    } catch (err) {
      console.error('Error completing Google Client profile:', err);
      setAuthError('Erreur lors de la mise à jour du profil.');
      return { success: false, error: err.message };
    }
  };

  // ────────────────────────────────────────────────────────────────────
  // FINALISATION / CRÉATION BOUTIQUE GOOGLE - VENDOR
  // ────────────────────────────────────────────────────────────────────
  const completeVendorGoogleProfile = async ({ shopName, phone, city, quarter, description, category }) => {
    setAuthError('');
    try {
      const sName = (shopName || firebaseUser?.displayName || 'Ma Boutique').trim();
      const code = sName.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 6)
        || `SHP${Math.floor(100 + Math.random() * 900)}`;

      const newShop = {
        id: `shop-${firebaseUser?.uid || Date.now()}`,
        name: sName,
        code,
        city: city || 'Douala',
        quarter: quarter || 'Akwa (Centre)',
        phone: phone || '+237690000000',
        category: category || 'general',
        rating: 5.0,
        isLive: true,
        description: description || `Boutique officielle de ${sName} sur MeetShop Marketplace.`,
        logo: firebaseUser?.photoURL || 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=150&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
        owner_email: firebaseUser?.email || '',
        owner_uid: firebaseUser?.uid || ''
      };

      newShop.layout_config = getDefaultLayoutConfig('emerald', newShop);

      // Sauvegarder dans Supabase si connecté
      try {
        await supabase.from('shops').upsert([{
          name: newShop.name,
          code: newShop.code,
          city: newShop.city,
          quarter: newShop.quarter,
          phone_whatsapp: newShop.phone,
          owner_id: firebaseUser?.uid || null,
          layout_config: newShop.layout_config,
          is_live: true
        }], { onConflict: 'code' });
      } catch (dbErr) {
        console.warn('Supabase vendor insert from Google:', dbErr);
      }

      // Sauvegarder localement
      const savedShops = JSON.parse(localStorage.getItem('meetshop_shops') || '[]');
      const filtered = savedShops.filter(s => s.code !== newShop.code && s.owner_uid !== newShop.owner_uid);
      localStorage.setItem('meetshop_shops', JSON.stringify([newShop, ...filtered]));

      setVendor(newShop);
      setUserRole('vendor');
      localStorage.setItem('meetshop_role', 'vendor');
      return { success: true, vendor: newShop };
    } catch (err) {
      console.error('Error creating Google Vendor profile:', err);
      setAuthError('Erreur lors de la création de la boutique.');
      return { success: false, error: err.message };
    }
  };

  // ── Recherche boutique existante pour l'utilisateur ──────────────────
  const findExistingVendorForUser = async (uid, email) => {
    const savedShops = JSON.parse(localStorage.getItem('meetshop_shops') || '[]');
    let found = savedShops.find(s => (uid && s.owner_uid === uid) || (email && s.owner_email === email));
    if (found) return found;

    if (uid) {
      try {
        const { data } = await supabase.from('shops').select('*').eq('owner_id', uid).single();
        if (data) {
          return {
            id: data.id,
            name: data.name,
            code: data.code,
            city: data.city,
            quarter: data.quarter,
            phone: data.phone_whatsapp,
            rating: data.rating,
            isLive: data.is_live,
            logo: data.logo_url,
            banner: data.banner_url,
            description: data.description,
            layout_config: data.layout_config,
            owner_uid: uid,
            owner_email: email
          };
        }
      } catch (e) {}
    }
    return null;
  };

  // ── Déconnexion ───────────────────────────────────────────────────────
  const logout = async () => {
    try { await signOut(auth); } catch (e) { /* ignore */ }
    setVendor(null);
    setUserRole(null);
    setAuthError('');
  };
  const logoutVendor = logout;

  const updateUserProfile = async (newProfile) => {
    const uid = firebaseUser?.uid || auth.currentUser?.uid;

    // ── 1. Firebase Auth (source de vérité cross-device) ─────────────────
    // Écrire d'abord dans Firebase Auth : user.photoURL est synchronisé
    // automatiquement sur TOUS les appareils via onAuthStateChanged.
    if (auth.currentUser) {
      const fbUpdates = {};
      if (newProfile.name !== undefined && newProfile.name) fbUpdates.displayName = newProfile.name;
      if (newProfile.photoURL) fbUpdates.photoURL = newProfile.photoURL;
      if (Object.keys(fbUpdates).length > 0) {
        try {
          await updateProfile(auth.currentUser, fbUpdates);
          // Recharger l'état Firebase pour que onAuthStateChanged reçoive user.photoURL mis à jour
          await auth.currentUser.reload();
          setFirebaseUser(auth.currentUser);
        } catch (e) {
          console.warn('Firebase Auth updateProfile error:', e);
        }
      }
    }

    // ── 2. État React + localStorage (cache local seulement) ──────────────
    setUserProfile(prev => {
      const updated = { ...prev, ...newProfile };
      localStorage.setItem('meetshop_user', JSON.stringify(updated));
      return updated;
    });

    // ── 3. Supabase (backup cloud pour nom/téléphone/ville + avatar) ──────
    if (isSupabaseConfigured() && uid) {
      const payload = { id: uid, updated_at: new Date().toISOString() };
      if (newProfile.name !== undefined) payload.name = newProfile.name || null;
      if (newProfile.phone !== undefined) payload.phone = newProfile.phone || null;
      if (newProfile.city !== undefined) payload.city = newProfile.city || null;
      if (newProfile.quarter !== undefined) payload.quarter = newProfile.quarter || null;
      if (newProfile.photoURL !== undefined) payload.avatar_url = newProfile.photoURL || null;
      try {
        await supabase.from('profiles').upsert(payload, { onConflict: 'id' });
      } catch (err) {
        console.warn('Supabase profile update error:', err);
      }
    }
  };

  // ── Mise à jour des informations et du layout de la boutique ─────────
  const updateVendorShop = async (updates) => {
    if (!vendor) return null;
    const updatedVendor = { ...vendor, ...updates };
    setVendor(updatedVendor);
    localStorage.setItem('meetshop_vendor', JSON.stringify(updatedVendor));

    // Mettre à jour dans la liste générale des boutiques locale
    const savedShops = JSON.parse(localStorage.getItem('meetshop_shops') || '[]');
    const newShops = savedShops.map(s => {
      if (s.id === vendor.id || s.code === vendor.code || (s.owner_uid && s.owner_uid === vendor.owner_uid)) {
        return { ...s, ...updates };
      }
      return s;
    });
    localStorage.setItem('meetshop_shops', JSON.stringify(newShops));

    // Mettre à jour Supabase si connecté
    if (isSupabaseConfigured()) {
      try {
        const payload = {};
        if (updates.layout_config !== undefined) payload.layout_config = updates.layout_config;
        if (updates.logo !== undefined) payload.logo_url = updates.logo;
        if (updates.banner !== undefined) payload.banner_url = updates.banner;
        if (updates.name !== undefined) payload.name = updates.name;
        if (updates.description !== undefined) payload.description = updates.description;
        if (updates.phone !== undefined) payload.phone_whatsapp = updates.phone;
        if (updates.city !== undefined) payload.city = updates.city;
        if (updates.quarter !== undefined) payload.quarter = updates.quarter;

        if (vendor.code) {
          await supabase.from('shops').update(payload).eq('code', vendor.code);
        } else if (vendor.owner_uid) {
          await supabase.from('shops').update(payload).eq('owner_id', vendor.owner_uid);
        }
      } catch (err) {
        console.warn('Erreur updateVendorShop Supabase:', err);
      }
    }

    return updatedVendor;
  };

  const switchActiveRole = (targetRole) => {
    if (targetRole === 'vendor') {
      setUserRole('vendor');
      localStorage.setItem('meetshop_role', 'vendor');
      return true;
    } else {
      setUserRole('client');
      localStorage.setItem('meetshop_role', 'client');
      return true;
    }
  };

  return (
    <AuthContext.Provider value={{
      // State
      firebaseUser,
      authLoading,
      userRole,
      setUserRole,
      vendor,
      setVendor,
      switchActiveRole,
      userProfile,
      authError,
      setAuthError,
      // Actions Client
      signUpClient,
      signInClient,
      signInWithGoogle,
      completeClientGoogleProfile,
      // Actions Vendor
      signUpVendor,
      signInVendor,
      completeVendorGoogleProfile,
      findExistingVendorForUser,
      loginVendor,   // legacy
      updateVendorShop,
      // Common
      logout,
      logoutVendor,  // alias
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// ─── Traductions des erreurs Firebase ────────────────────────────────────────
function firebaseErrorFR(code) {
  const msgs = {
    'auth/email-already-in-use': 'Cette adresse email est déjà utilisée.',
    'auth/invalid-email': 'Adresse email invalide.',
    'auth/weak-password': 'Mot de passe trop faible (min. 6 caractères).',
    'auth/user-not-found': 'Aucun compte trouvé avec cet email.',
    'auth/wrong-password': 'Mot de passe incorrect.',
    'auth/invalid-credential': 'Email ou mot de passe incorrect.',
    'auth/too-many-requests': 'Trop de tentatives. Veuillez réessayer plus tard.',
    'auth/popup-closed-by-user': 'Connexion Google annulée.',
    'auth/network-request-failed': 'Erreur réseau. Vérifiez votre connexion.'
  };
  return msgs[code] || 'Une erreur est survenue. Veuillez réessayer.';
}
