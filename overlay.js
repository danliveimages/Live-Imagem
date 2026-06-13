import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAUCs2sD0dbVXwf6wD8ESaPVbb3oZG1xtQ",
  authDomain: "imagens---live.firebaseapp.com",
  projectId: "imagens---live",
  storageBucket: "imagens---live.firebasestorage.app",
  messagingSenderId: "715296463455",
  appId: "1:715296463455:web:87fe2bfa0274e8788159ea"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const q = query(
  collection(db, "submissions"),
  where("approved", "==", true),
  where("shown", "==", false),
  orderBy("createdAt", "asc"),
  limit(1)
);

let currentTimeout = null;

// ÁUDIO DO ALERTA
const alertAudio = new Audio("chegou-mensagem-pra-voce.mp3");

alertAudio.volume = 1;

// DESBLOQUEIA O ÁUDIO NO PRIMEIRO CLIQUE
document.addEventListener("click", ()=>{

  alertAudio.play()
    .then(()=>{

      alertAudio.pause();

      alertAudio.currentTime = 0;

      console.log("Áudio desbloqueado");

    })
    .catch(err=>console.log(err));

},{ once:true });

onSnapshot(q, async (snapshot)=>{

  snapshot.forEach(async (docSnap)=>{

    const data = docSnap.data();

    const image =
      document.getElementById("image");

    const nickname =
      document.getElementById("nickname");

    const message =
      document.getElementById("message");

    const textWrapper =
      document.getElementById("textWrapper");

    const oldTimer =
      document.getElementById("timerBorder");

    if(currentTimeout){

      clearTimeout(currentTimeout);

      image.classList.remove("show");

      textWrapper.classList.remove("showText");

      await new Promise(resolve=>
        setTimeout(resolve,800)
      );
    }

    image.src = data.imageUrl;

    nickname.innerText = data.nickname;

    message.innerText = data.message;

if(!data.message?.trim()){

  textWrapper.classList.add(
    "nicknameOnly"
  );

}else{

  textWrapper.classList.remove(
    "nicknameOnly"
  );
}

    const newTimer =
      oldTimer.cloneNode(true);

    oldTimer.parentNode.replaceChild(
      newTimer,
      oldTimer
    );

    image.classList.add("show");

    textWrapper.classList.add("showText");

    // TOCA O ÁUDIO
    alertAudio.currentTime = 0;

    alertAudio.play()
      .catch(err=>console.log(err));

    await updateDoc(
      doc(db, "submissions", docSnap.id),
      {
        shown:true
      }
    );

    currentTimeout = setTimeout(()=>{

      image.classList.remove("show");

      textWrapper.classList.remove("showText");

    },150000);

  });

});