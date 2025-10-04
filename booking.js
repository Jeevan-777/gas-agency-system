// scripts/booking.js

import { auth, db } from './firebase-config.js';
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc,
  addDoc,
  updateDoc,
  collection,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Wait until user is logged in
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("You must be logged in to book a cylinder.");
    window.location.href = "login.html";
    return;
  }

  const bookingForm = document.getElementById("bookingForm");

  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const address = document.getElementById("address").value;
    const payment = document.getElementById("payment").value;

    try {
      // Get current barrels
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      const currentBarrels = userDoc.data().barrelsLeft;

      if (currentBarrels <= 0) {
        alert("You have no cylinders left!");
        return;
      }

      // Save booking
      await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        address,
        payment,
        date: new Date().toISOString(),
        status: "Pending"
      });

      // Reduce barrel count
      await updateDoc(userRef, {
        barrelsLeft: currentBarrels - 1
      });

      alert("Booking successful!");
      window.location.href = "user.html";
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Something went wrong. Try again.");
    }
  });
});
