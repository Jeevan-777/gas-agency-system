// scripts/admin.js
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ✅ Check if the logged-in user is admin
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("You must be logged in.");
    window.location.href = "login.html";
    return;
  }

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists() || userDoc.data().type !== "admin") {
    alert("Access denied.");
    window.location.href = "index.html";
    return;
  }

  console.log("✅ Admin logged in:", user.uid);

  // Load everything after successful admin check
  loadBookings();
  loadUsers();
  setupNoticeForm();
});

// ✅ 1. Handle Notice Posting
function setupNoticeForm() {
  const noticeForm = document.getElementById("noticeForm");
  if (!noticeForm) return;

  noticeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("noticeTitle").value.trim();
    const message = document.getElementById("noticeMessage").value.trim();

    if (!title || !message) {
      alert("Please fill in both fields");
      return;
    }

    try {
      await addDoc(collection(db, "notices"), {
        title,
        message,
        date: new Date().toISOString()
      });

      alert("✅ Notice posted successfully!");
      noticeForm.reset();
    } catch (err) {
      console.error("Error posting notice:", err);
      alert("Failed to post notice.");
    }
  });
}

// ✅ 2. Load and Display Bookings
async function loadBookings() {
  const bookingTable = document.getElementById("bookingTable");
  bookingTable.innerHTML = "";

  try {
    console.log("📥 Fetching bookings...");
    const bookingSnap = await getDocs(collection(db, "bookings"));

    if (bookingSnap.empty) {
      bookingTable.innerHTML = "<tr><td colspan='6'>No bookings found.</td></tr>";
      return;
    }

    bookingSnap.forEach(docSnap => {
      const data = docSnap.data();
      console.log("📄 Booking:", data);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${data.userId}</td>
        <td>${data.address}</td>
        <td>${data.payment}</td>
        <td>${new Date(data.date).toLocaleString()}</td>
        <td>${data.status}</td>
        <td>
          <button class="approve" onclick="updateStatus('${docSnap.id}', 'Approved')">Approve</button>
          <button class="reject" onclick="updateStatus('${docSnap.id}', 'Rejected')">Reject</button>
        </td>
      `;
      bookingTable.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading bookings:", err);
    bookingTable.innerHTML = "<tr><td colspan='6'>Failed to load bookings.</td></tr>";
  }
}

// ✅ 3. Approve / Reject Booking
window.updateStatus = async (id, status) => {
  try {
    await updateDoc(doc(db, "bookings", id), { status });
    alert(`Booking ${status}`);
    loadBookings(); // reload without full page refresh
  } catch (err) {
    console.error("Error updating status:", err);
    alert("Error updating status.");
  }
};

// ✅ 4. Load Users
async function loadUsers() {
  const userList = document.getElementById("userList");
  userList.innerHTML = "";

  try {
    console.log("📥 Fetching users...");
    const userSnap = await getDocs(collection(db, "users"));

    if (userSnap.empty) {
      userList.innerHTML = "<li>No users found.</li>";
      return;
    }

    userSnap.forEach(docSnap => {
      const user = docSnap.data();
      const li = document.createElement("li");
      li.textContent = `${user.name} (${user.email}) — Cylinders left: ${user.barrelsLeft}`;
      userList.appendChild(li);
    });
  } catch (err) {
    console.error("Error loading users:", err);
    userList.innerHTML = "<li>Failed to load users.</li>";
  }
}

// ✅ 5. Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
  });
}
