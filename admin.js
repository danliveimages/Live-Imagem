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

const clearHistoryBtn =
  document.getElementById("clearHistoryBtn");

const dateFilterBtn =
  document.getElementById("dateFilterBtn");

const dateFilterMenu =
  document.getElementById("dateFilterMenu");

const selectedDate =
  document.getElementById("selectedDate");

const dateFilterScroll =
  document.getElementById("dateFilterScroll");

let currentDateFilter = "all";

function buildDateFilterMenu(
  queueDates,
  historyDates
){

  dateFilterScroll.innerHTML = `
    <div
      class="dateOption"
      data-value="all"
    >
      Todos
    </div>

    <div
      class="dateOption"
      data-value="today"
    >
      Hoje
    </div>

    <div
      class="dateOption"
      data-value="yesterday"
    >
      Ontem
    </div>
  `;

  const today =
    new Date().toLocaleDateString(
      "pt-BR"
    );

  const yesterdayDate =
    new Date();

  yesterdayDate.setDate(
    yesterdayDate.getDate() - 1
  );

  const yesterday =
    yesterdayDate.toLocaleDateString(
      "pt-BR"
    );

  const activeDates =

    historyBtn.classList.contains(
      "activeTab"
    )

      ? historyDates

      : queueDates;

  [...activeDates]
    .reverse()
    .forEach(date => {

      if(
        date === today ||
        date === yesterday
      ){
        return;
      }

      dateFilterScroll.innerHTML += `
        <div
          class="dateOption"
          data-value="${date}"
        >
          ${date}
        </div>
      `;

    });

  document
    .querySelectorAll(".dateOption")
    .forEach(option => {

      option.onclick = () => {

        currentDateFilter =
          option.dataset.value;

        selectedDate.textContent =
          option.textContent.trim();

        dateFilterMenu.classList.remove(
          "open"
        );

        if(lastSnapshot){

          if(
            historyBtn.classList.contains(
              "activeTab"
            )
          ){

            renderHistory(
              lastSnapshot
            );

          }

          else{

            renderQueue(
              lastSnapshot
            );

          }

        }

      };

    });

}

let queueDatesGlobal =
  new Set();

let historyDatesGlobal =
  new Set();

function renderHistory(snapshot){

  historyList.innerHTML = "";

  snapshot.forEach((docSnap) => {

    const data =
      docSnap.data();

    if(
      !data.approved &&
      !data.rejected
    ){
      return;
    }

    const cardDate =

      data.createdAt &&
      typeof data.createdAt.toDate === "function"

        ? data.createdAt
            .toDate()
            .toLocaleDateString("pt-BR")

        : null;

    let showCard = false;

    const today =
      new Date().toLocaleDateString("pt-BR");

    const yesterdayDate =
      new Date();

    yesterdayDate.setDate(
      yesterdayDate.getDate() - 1
    );

    const yesterday =
      yesterdayDate.toLocaleDateString("pt-BR");

    if(currentDateFilter === "all"){

      showCard = true;

    }

    else if(
      currentDateFilter === "today"
    ){

      showCard =
        cardDate === today;

    }

    else if(
      currentDateFilter === "yesterday"
    ){

      showCard =
        cardDate === yesterday;

    }

    else{

      showCard =
        cardDate === currentDateFilter;

    }

    if(showCard){

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

        <button onclick="approve('${docSnap.id}')">
          Reaprovar
        </button>

        <button
          class="rejectBtn"
          onclick="deleteSubmission('${docSnap.id}')"
        >
          Excluir
        </button>

      </div>

    </div>

  `;

  historyList.prepend(card);

  requestAnimationFrame(() => {

    card.classList.add(
      "cardEntering"
    );

  });

}

  });

}

let lastSnapshot = null;

function renderQueue(snapshot){

  list.innerHTML = "";

  snapshot.forEach((docSnap) => {

    const data =
      docSnap.data();

    if(
      data.approved ||
      data.rejected
    ){
      return;
    }

    const cardDate =

      data.createdAt &&
      typeof data.createdAt.toDate === "function"

        ? data.createdAt
            .toDate()
            .toLocaleDateString("pt-BR")

        : null;

    let showCard = false;

    const today =
      new Date().toLocaleDateString("pt-BR");

    const yesterdayDate =
      new Date();

    yesterdayDate.setDate(
      yesterdayDate.getDate() - 1
    );

    const yesterday =
      yesterdayDate.toLocaleDateString("pt-BR");

    if(currentDateFilter === "all"){

      showCard = true;

    }

    else if(
      currentDateFilter === "today"
    ){

      showCard =
        cardDate === today;

    }

    else if(
      currentDateFilter === "yesterday"
    ){

      showCard =
        cardDate === yesterday;

    }

    else{

      showCard =
        cardDate === currentDateFilter;

    }

    if(showCard){

      let formattedDate =
        "Sem data";

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

      const card =
        document.createElement("div");

      card.className = "card";

      card.dataset.id =
        docSnap.id;

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

            <button onclick="approve('${docSnap.id}')">
              Aprovar
            </button>

            <button
              class="rejectBtn"
              onclick="reject('${docSnap.id}')"
            >
              Recusar
            </button>

          </div>

        </div>

      `;

      list.appendChild(card);

      requestAnimationFrame(() => {

        card.classList.add(
          "cardEntering"
        );

      });

    }

  });

}

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

clearHistoryBtn.style.display =
  "none";

/* =========================
   FILTRO DATA
========================= */

dateFilterBtn.addEventListener("click", (e) => {

  e.stopPropagation();

  dateFilterMenu.classList.toggle("open");

});

document.addEventListener("click", () => {

  dateFilterMenu.classList.remove("open");

});

/* =========================
   TROCA DE TELAS
========================= */

queueBtn.addEventListener("click", () => {

  list.classList.add("activeSection");

  historyList.classList.remove("activeSection");

  queueBtn.classList.add("activeTab");

  historyBtn.classList.remove("activeTab");

clearHistoryBtn.style.display =
  "none";

currentDateFilter = "all";

selectedDate.textContent =
  "Todos";

buildDateFilterMenu(
  queueDatesGlobal,
  historyDatesGlobal
);

if(lastSnapshot){

  renderQueue(
    lastSnapshot
  );

}

});

historyBtn.addEventListener("click", () => {

  historyList.classList.add("activeSection");

  list.classList.remove("activeSection");

  historyBtn.classList.add("activeTab");

  queueBtn.classList.remove("activeTab");

clearHistoryBtn.style.display =
  "flex";

currentDateFilter = "all";

selectedDate.textContent =
  "Todos";

buildDateFilterMenu(
  queueDatesGlobal,
  historyDatesGlobal
);

if(lastSnapshot){

  renderHistory(
    lastSnapshot
  );

}

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

lastSnapshot = snapshot;

const queueDates =
  new Set();

const historyDates =
  new Set();

console.log(
  "SNAPSHOT",
  Date.now()
);

const onlyShownUpdate =

  snapshot.docChanges().length === 1 &&

  snapshot.docChanges()[0].type === "modified" &&

  snapshot.docChanges()[0].doc.data().shown === true;

if(onlyShownUpdate){

  console.log(
    "IGNORANDO UPDATE SHOWN"
  );

  return;
}

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

console.log(
  "DOC:",
  change.doc.id,
  "APPROVED:",
  data.approved,
  "SHOWN:",
  data.shown
);

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

console.log(
  "RENDER FILA",
  Date.now()
);
  
snapshot.forEach((docSnap) => {

    const data = docSnap.data();

    if(data.createdAt){

  const date =
    data.createdAt.toDate();

  const formattedDate =
    date.toLocaleDateString("pt-BR");

  if(
    !data.approved &&
    !data.rejected
  ){

    queueDates.add(
      formattedDate
    );

  }

  else{

    historyDates.add(
      formattedDate
    );

  }

}

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

const cardDate =

  data.createdAt &&
  typeof data.createdAt.toDate === "function"

    ? data.createdAt
        .toDate()
        .toLocaleDateString("pt-BR")

    : null;

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

  let showCard = false;

  const today =
    new Date().toLocaleDateString("pt-BR");

  const yesterdayDate =
    new Date();

  yesterdayDate.setDate(
    yesterdayDate.getDate() - 1
  );

  const yesterday =
    yesterdayDate.toLocaleDateString("pt-BR");

  if(currentDateFilter === "all"){

    showCard = true;

  }

  else if(
    currentDateFilter === "today"
  ){

    showCard =
      cardDate === today;

  }

  else if(
    currentDateFilter === "yesterday"
  ){

    showCard =
      cardDate === yesterday;

  }

  else{

    showCard =
      cardDate === currentDateFilter;

  }

  if(showCard){

    list.appendChild(card);

    requestAnimationFrame(() => {

      card.classList.add(
        "cardEntering"
      );

    });

  }

}

    /* =========================
       HISTÓRICO
    ========================= */

    else {

  let showCard = false;

  const today =
    new Date().toLocaleDateString("pt-BR");

  const yesterdayDate =
    new Date();

  yesterdayDate.setDate(
    yesterdayDate.getDate() - 1
  );

  const yesterday =
    yesterdayDate.toLocaleDateString("pt-BR");

  if(currentDateFilter === "all"){

    showCard = true;

  }

  else if(
    currentDateFilter === "today"
  ){

    showCard =
      cardDate === today;

  }

  else if(
    currentDateFilter === "yesterday"
  ){

    showCard =
      cardDate === yesterday;

  }

  else{

    showCard =
      cardDate === currentDateFilter;

  }

  if(showCard){

    historyList.prepend(card);

    requestAnimationFrame(() => {

      card.classList.add(
        "cardEntering"
      );

    });

  }

}

    });

  dateFilterScroll.innerHTML = `
  <div
    class="dateOption"
    data-value="all"
  >
    Todos
  </div>

  <div
    class="dateOption"
    data-value="today"
  >
    Hoje
  </div>

  <div
    class="dateOption"
    data-value="yesterday"
  >
    Ontem
  </div>
`;

  const today =
  new Date().toLocaleDateString("pt-BR");

const yesterdayDate =
  new Date();

yesterdayDate.setDate(
  yesterdayDate.getDate() - 1
);

const yesterday =
  yesterdayDate.toLocaleDateString("pt-BR");

const activeDates =

  historyBtn.classList.contains(
    "activeTab"
  )

    ? historyDates

    : queueDates;

[...activeDates]
  .reverse()
  .forEach(date => {

    if(
      date === today ||
      date === yesterday
    ){
      return;
    }

    dateFilterScroll.innerHTML += `
      <div
        class="dateOption"
        data-value="${date}"
      >
        ${date}
      </div>
    `;

  });

document
  .querySelectorAll(".dateOption")
  .forEach(option => {

    option.onclick = () => {

  currentDateFilter =
    option.dataset.value;

  selectedDate.textContent =
    option.textContent.trim();

  dateFilterMenu.classList.remove(
    "open"
  );

  console.log(
    "FILTRO:",
    currentDateFilter
  );

  if(lastSnapshot){

  if(
    historyBtn.classList.contains(
      "activeTab"
    )
  ){

    renderHistory(
      lastSnapshot
    );

  }

  else{

    renderQueue(
      lastSnapshot
    );

  }

}

};

  });

queueDatesGlobal =
  queueDates;

historyDatesGlobal =
  historyDates;

buildDateFilterMenu(
  queueDatesGlobal,
  historyDatesGlobal
);

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