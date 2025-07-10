// src/config/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyB6QZYvm1sd4ARKYmPeS5MJLz1h-oCfs8U',
  authDomain: 'aiinvapp.firebaseapp.com',
  projectId: 'aiinvapp',
  storageBucket: 'aiinvapp.appspot.com',
  messagingSenderId: '497498007772',
  appId: '1:497498007772:android:f0d46420d4ea8dca8a2c19',
  measurementId: 'G-1MTSL7GX79', // ⛔️ You must add this in Firebase Console → Project settings
};

// Prevent reinitializing Firebase during hot reload
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);

let analytics: ReturnType<typeof getAnalytics> | undefined = undefined;

if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, analytics };
