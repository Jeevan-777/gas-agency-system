import { auth, db } from './firebase-config.js';
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Please log in to view history.");
    window.location.href = "login.html";
    return;
  }

  const bookingsRef = collection(db, "bookings");
  const q = query(bookingsRef, where("userId", "==", user.uid));

  const snapshot = await getDocs(q);
  const tbody = document.getElementById("historyBody");

  if (snapshot.empty) {
    tbody.innerHTML = "<tr><td colspan='4'>No bookings found.</td></tr>";
    return;
  }

  snapshot.forEach(doc => {
    const data = doc.data();
    const row = `
      <tr>
        <td>${new Date(data.date).toLocaleDateString()}</td>
        <td>${data.address}</td>
        <td>${data.payment}</td>
        <td>${data.status}</td>
      </tr>
    `;
    tbody.innerHTML = row + tbody.innerHTML; // newest first
  });
});
