// scripts/notices.js

import { db } from './firebase-config.js';
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const noticeList = document.getElementById("noticeList");

async function loadNotices() {
  const snapshot = await getDocs(collection(db, "notices"));

  if (snapshot.empty) {
    noticeList.innerHTML = "<li>No notices yet.</li>";
    return;
  }

  snapshot.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `<strong>${data.title}</strong><br>${data.message}<br><em>${new Date(data.date).toLocaleDateString()}</em>`;
    noticeList.appendChild(li);
  });
}

loadNotices();
