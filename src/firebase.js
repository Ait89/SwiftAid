// src/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwPHNMZVktaQ8y5IC60mPwLPv4BQlNHpQ",
  authDomain: "swiftaid-71922.firebaseapp.com",
  projectId: "swiftaid-71922",
  storageBucket: "swiftaid-71922.firebasestorage.app",
  messagingSenderId: "47498923075",
  appId: "1:47498923075:web:58f503bdf0674329f058f6"
};

// ⚠️  initialize only once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);
