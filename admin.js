import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

/* =========================
   ELEMENTOS
========================= */

const list =
  document.getElementById("list");

const historyList =
  document.getElementById("historyList");

const queueBtn =
  document.getElementById("queueBtn");

const historyBtn =
  document.getElementById("historyBtn");

/* =========================
   CONTROLE ALERTA
========================= */

const paymentAlertsTriggered =
  new Set();

/* =========================
   ABA INICIAL
========================= */

list.classList.add("activeSection");

queueBtn.classList.add("activeTab");

/* =========================
   TROCA DE TELAS
========================= */

queueBtn.addEventListener("click", () => {

  list.classList.add("activeSection");

  historyList.classList.remove("activeSection");

  queueBtn.classList.add("activeTab");

  historyBtn.classList.remove("activeTab");

});

historyBtn.addEventListener("click", () => {

  historyList.classList.add("activeSection");

  list.classList.remove("activeSection");

  historyBtn.classList.add("activeTab");

  queueBtn.classList.remove("activeTab");

});

/* =========================
   QUERY
========================= */

const q = query(

  collection(db, "submissions"),

  orderBy("createdAt", "asc")

);

/* =========================
   WEBSOCKET STREAMER.BOT
========================= */

function triggerStreamerBotAction(actionName){

  try {

    const ws =
      new WebSocket("ws://127.0.0.1:8080");

    ws.onopen = () => {

      console.log(
        "Conectado ao Streamer.bot"
      );

      ws.send(JSON.stringify({

        request: "DoAction",

        action: {
          name: actionName
        },

        id: String(Date.now())

      }));

    };

    ws.onmessage = (event) => {

      console.log(
        "Resposta:",
        event.data
      );

      ws.close();

    };

    ws.onerror = (error) => {

      console.error(
        "Erro WebSocket:",
        error
      );

    };

  }

  catch(error){

    console.error(
      "Erro Streamer.bot:",
      error
    );

  }

}

/* =========================
   REALTIME
========================= */

onSnapshot(q, (snapshot) => {

console.log("SNAPSHOT");

  list.innerHTML = "";

  historyList.innerHTML = "";

  /* =========================
     ALTERAÇÕES REALTIME
  ========================= */

  snapshot.docChanges().forEach(async (change) => {

    if(
  change.type === "added" ||
  change.type === "modified"
){

      const data =
        change.doc.data();

      /* =========================
         SOM PAGAMENTO
      ========================= */

      if(
  data.paymentConfirmed === true &&
  data.paymentAlertSent !== true &&
  !paymentAlertsTriggered.has(change.doc.id)
){

        paymentAlertsTriggered.add(
          change.doc.id
        );

        triggerStreamerBotAction(
          "Pay Live Imagem"
        );

await updateDoc(
  doc(db, "submissions", change.doc.id),
  {
    paymentAlertSent: true
  }
);

      }

    }

  });

  /* =========================
     RENDERIZA CARDS
  ========================= */

  snapshot.forEach((docSnap) => {

    const data = docSnap.data();

    /* =========================
       DATA SEGURA
    ========================= */

    let formattedDate = "Sem data";

    if(
      data.createdAt &&
      typeof data.createdAt.toDate === "function"
    ){

      const createdAt =
        data.createdAt.toDate();

      formattedDate =

        createdAt.toLocaleDateString("pt-BR") +

        " • " +

        createdAt.toLocaleTimeString("pt-BR");

    }

    /* =========================
       CARD
    ========================= */

    const card =
  document.createElement("div");

card.className = "card";

card.dataset.id = docSnap.id;

    card.innerHTML = `

      <img src="${data.imageUrl}">

      <div class="cardContent">

        <div class="cardTop">

          <h3>
            ${data.nickname || "Sem nickname"}
          </h3>

          <span class="date">
            ${formattedDate}
          </span>

        </div>

        <p>
          ${data.message || ""}
        </p>

        <div class="actions">

  ${
    !data.approved && !data.rejected
    ? `
      <button onclick="approve('${docSnap.id}')">
        Aprovar
      </button>

      <button
        class="rejectBtn"
        onclick="reject('${docSnap.id}')"
      >
        Recusar
      </button>
    `
    : `
      <button onclick="approve('${docSnap.id}')">
        Reaprovar
      </button>

      <button
        class="rejectBtn"
        onclick="deleteSubmission('${docSnap.id}')"
      >
        Excluir
      </button>
    `
  }

</div>

      </div>

    `;

    /* =========================
       FILA
    ========================= */

    if(
  !data.approved &&
  !data.rejected
){

  list.appendChild(card);

  requestAnimationFrame(() => {

    card.classList.add(
      "cardEntering"
    );

  });

}

    /* =========================
       HISTÓRICO
    ========================= */

    else {

      historyList.prepend(card);

requestAnimationFrame(() => {

  card.classList.add(
    "cardEntering"
  );

});

    }

  });

});

/* =========================
   APROVAR
========================= */

window.approve = async function(id){

  const card =
    document.querySelector(
      `[data-id="${id}"]`
    );

  if(card){

    card.classList.add(
      "removing"
    );

    await new Promise(
  resolve =>
    setTimeout(resolve, 700)
);
  }

  try {

    await updateDoc(

      doc(db, "submissions", id),

      {
        approved: true,
        rejected: false,
        shown: false
      }

    );

    console.log(
      "Imagem aprovada"
    );

    triggerStreamerBotAction(
      "Live Images"
    );

  }

  catch(err){

    console.error(err);

    alert("Erro ao aprovar");

  }

};


/* =========================
   RECUSAR
========================= */

window.reject = async function(id){

  const card =
    document.querySelector(
      `[data-id="${id}"]`
    );

  if(card){

    card.classList.add(
      "removing"
    );

    await new Promise(
      resolve =>
        setTimeout(resolve, 700)
    );
  }

  try {

    await updateDoc(

      doc(db, "submissions", id),

      {
        rejected: true,
        approved: false
      }

    );

    console.log(
      "Imagem recusada"
    );

  }

  catch(err){

    console.error(err);

    alert("Erro ao recusar");

  }

};

/* =========================
   EXCLUIR
========================= */

window.deleteSubmission = async function(id){

  if(
    !confirm(
      "Deseja realmente excluir este item?"
    )
  ){
    return;
  }

  try{

    await deleteDoc(
      doc(db, "submissions", id)
    );

    console.log(
      "Item excluído"
    );

  }

  catch(err){

    console.error(err);

    alert(
      "Erro ao excluir"
    );

  }

};