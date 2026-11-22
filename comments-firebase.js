
import { initializeApp } from
  "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxXDbhbu_ZHWPCrsUQ7ORLn1p9hVsQrBU",
  authDomain: "saddiah-portfolio-comments.firebaseapp.com",
  projectId: "saddiah-portfolio-comments",
  storageBucket: "saddiah-portfolio-comments.firebasestorage.app",
  messagingSenderId: "902356641901",
  appId: "1:902356641901:web:365c3a73f335a7cca73764"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const commentsRef = collection(db, "comments");

const commentForm = document.getElementById("commentForm");
const commentsList = document.getElementById("commentsList");
const successMessage = document.getElementById("successMessage");
const submitButton = commentForm.querySelector(
  'button[type="submit"]'
);

const ratingInputs = document.querySelectorAll(
  '#starRating input[name="rating"]'
);

// Hide part of visitor's name before saving
function maskName(name) {
  const cleanName = name.trim().replace(/\s+/g, " ");
  const letters = Array.from(cleanName);

  if (letters.length === 0) {
    return "";
  }

  // Single-character names are not accepted
  if (letters.length === 1) {
    return "";
  }

  if (letters.length === 2) {
    return letters[0] + "*" + letters[1];
  }

  return (
    letters[0] +
    "*".repeat(Math.min(letters.length - 2, 20)) +
    letters[letters.length - 1]
  );
}

// Update star colours
function updateStars() {
  const selected = document.querySelector(
    '#starRating input[name="rating"]:checked'
  );

  const rating = selected ? Number(selected.value) : 0;

  ratingInputs.forEach(input => {
    const label = input.closest("label");

    label.classList.toggle(
      "selected",
      Number(input.value) <= rating
    );
  });
}

ratingInputs.forEach(input => {
  input.addEventListener("change", updateStars);
});

// Display one comment safely
function createCommentCard(comment) {
  const card = document.createElement("article");
  card.className = "visitor-card";

  const name = document.createElement("h3");
  name.textContent = comment.maskedName || "Anonymous";

  const stars = document.createElement("div");
  stars.className = "visitor-stars";

  const rating = Number(comment.rating) || 0;
  const safeRating = Math.max(0, Math.min(5, rating));

  stars.textContent =
    "★".repeat(safeRating) +
    "☆".repeat(5 - safeRating);

  const message = document.createElement("p");
  message.textContent = comment.message || "";

  const date = document.createElement("span");
  date.className = "comment-date";

  if (comment.createdAt?.toDate) {
    date.textContent = comment.createdAt
      .toDate()
      .toLocaleDateString("en-MY");
  } else {
    date.textContent = "Just now";
  }

  card.append(name, stars, message, date);
  return card;
}

// Show comments from Firebase in real time
const commentsQuery = query(
  commentsRef,
  orderBy("createdAt", "desc"),
  limit(50)
);

commentsList.textContent = "Loading lovely messages... 💗";

onSnapshot(
  commentsQuery,
  snapshot => {
    commentsList.innerHTML = "";

    if (snapshot.empty) {
      const empty = document.createElement("p");
      empty.className = "empty-comments";
      empty.textContent =
        "No messages yet. Be the first to leave one! 💗";

      commentsList.appendChild(empty);
      return;
    }

    snapshot.forEach(doc => {
      commentsList.appendChild(
        createCommentCard(doc.data())
      );
    });
  },
  error => {
    console.error("Error loading comments:", error);
    commentsList.textContent =
      "Unable to load messages. Please refresh the page.";
  }
);

// Submit comment to Firestore
commentForm.addEventListener("submit", async event => {
  event.preventDefault();

  const name = document
    .getElementById("visitorName")
    .value.trim();

  const message = document
    .getElementById("visitorMessage")
    .value.trim();

  const selectedRating = document.querySelector(
    '#starRating input[name="rating"]:checked'
  );

  const maskedName = maskName(name);

  if (
    !maskedName ||
    maskedName.length > 30 ||
    !message ||
    message.length > 500 ||
    !selectedRating
  ) {
    successMessage.textContent =
      "Please enter a name of at least 2 characters, " +
      "a message and a star rating.";
    return;
  }

  const rating = Number(selectedRating.value);

  submitButton.disabled = true;
  submitButton.textContent = "Sending... 💌";
  successMessage.textContent = "";

  try {
    await addDoc(commentsRef, {
      maskedName: maskedName,
      message: message,
      rating: rating,
      createdAt: serverTimestamp()
    });

    successMessage.textContent =
      "Thank you! Your message is now public. 💗";

    commentForm.reset();
    updateStars();

  } catch (error) {
    console.error("Error sending comment:", error);

    successMessage.textContent =
      "Unable to send your message. Please try again.";

  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Send My Message 💌";
  }
});
