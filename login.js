import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* =========================
   FIREBASE
========================= */

const firebaseConfig = {
  apiKey: "AIzaSyAUCs2sD0dbVXwf6wD8ESaPVbb3oZG1xtQ",
  authDomain: "imagens---live.firebaseapp.com",
  projectId: "imagens---live",
  storageBucket: "imagens---live.firebasestorage.app",
  messagingSenderId: "715296463455",
  appId: "1:715296463455:web:87fe2bfa0274e8788159ea"
};

const app =
  initializeApp(firebaseConfig);

const auth =
  getAuth(app);

/* =========================
   LOGIN
========================= */

const emailInput =
  document.getElementById("email");

const passwordInput =
  document.getElementById("password");

const loginBtn =
  document.getElementById("loginBtn");

loginBtn.addEventListener(
  "click",
  async () => {

    const email =
      emailInput.value.trim();

    const password =
      passwordInput.value;

    if(
      !email ||
      !password
    ){

      alert(
        "Preencha email e senha"
      );

      return;
    }

    try{

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      window.location.href =
        "admin.html";

    }

    catch(error){

      console.error(error);

      alert(
        "Email ou senha inválidos"
      );

    }

  }
);