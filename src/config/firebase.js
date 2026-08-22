import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyMockKeyForMeetshopDemo12345",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "meetshop-42019.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://meetshop-42019-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "meetshop-42019",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "meetshop-42019.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "963456801352",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:963456801352:web:8c2d7bf5d58ecd15ab167d"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);
export default app;
