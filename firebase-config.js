import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =========================
   FIREBASE CONFIG
========================= */

const firebaseConfig = {

  apiKey: "AIzaSyAUCs2sD0dbVXwf6wD8ESaPVbb3oZG1xtQ",

  authDomain: "imagens---live.firebaseapp.com",

  projectId: "imagens---live",

  storageBucket: "imagens---live.firebasestorage.app",

  messagingSenderId: "715296463455",

  appId: "1:715296463455:web:87fe2bfa0274e8788159ea"

};

/* =========================
   INICIAR FIREBASE
========================= */

const app =
  initializeApp(firebaseConfig);

export const db =
  getFirestore(app);