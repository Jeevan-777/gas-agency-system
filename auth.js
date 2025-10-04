// scripts/auth.js

import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ✅ Handle Registration
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save extra user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        type: "user", // default type
        barrelsLeft: 12
      });

      alert("Registration successful!");
      window.location.href = "login.html";
    } catch (error) {
      console.error(error);
      alert("Registration failed: " + error.message);
    }
  });
}

// ✅ Handle Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user type from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userType = userDoc.data().type;

      if (userType === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "user.html";
      }
    } catch (error) {
      console.error(error);
      alert("Login failed: " + error.message);
    }
  });
}
