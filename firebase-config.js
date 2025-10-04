// scripts/firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAElS3wVv1QWQklYXF2UXeSuS5Poo8ba6k",
  authDomain: "gas-agency-system-9bab0.firebaseapp.com",
  projectId: "gas-agency-system-9bab0",
  storageBucket: "gas-agency-system-9bab0.firebasestorage.app",
  messagingSenderId: "434544579062",
  appId: "1:434544579062:web:c187fdaae2060014e4b7d7"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
