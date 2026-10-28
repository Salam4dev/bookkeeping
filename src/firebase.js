// src/firebase.js
// ============================================================
// FIREBASE CONFIGURATION
// ============================================================
// Steps to get your config:
// 1. Go to https://console.firebase.google.com/
// 2. Click "Add project" → name it (e.g. "LedgerPro")
// 3. Disable Google Analytics (optional) → Create project
// 4. Click "Web" icon (</>)  to add a web app
// 5. Register app (name it) → Copy the config object below
// 6. In Firebase Console → Authentication → Get started
//    → Sign-in method → Enable "Email/Password"
// ============================================================

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_AUTH_DOMAIN_HERE",
  projectId: "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket: "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "PASTE_YOUR_APP_ID_HERE",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
