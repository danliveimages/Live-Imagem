import { db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =========================
   ELEMENTOS
========================= */

const continueBtn =
  document.getElementById("continueBtn");

const copyBtn =
  document.getElementById("copyBtn");

const sendBtn =
  document.getElementById("sendBtn");

const page1 =
  document.getElementById("page1");

const page2 =
  document.getElementById("page2");

const step2Ball =
  document.getElementById("step2Ball");

const progressLine =
  document.querySelector(".progressLine");

const status =
  document.getElementById("status");

const imageInput =
  document.getElementById("image");

const uploadLabel =
  document.querySelector(
    ".uploadLabel"
  );

imageInput.addEventListener(
  "change",
  () => {

    if(
      imageInput.files.length > 0
    ){

      uploadLabel.innerHTML = `

  <span class="uploadSuccess">
    Foto Selecionada ✓
  </span>

`;

uploadLabel.classList.add(
  "fileSelected"
);

    }

    else{

      uploadLabel.textContent =
        "Escolher Foto 📷";

uploadLabel.classList.remove(
  "fileSelected"
);

    }

  }
);

/* =========================
   CONTINUAR
========================= */

continueBtn.addEventListener("click", () => {

  const nickname =
    document.getElementById("nickname").value.trim();

  const message =
    document.getElementById("message").value.trim();

  const image =
    document.getElementById("image").files[0];

  if (!nickname || !image) {

  alert("Preencha o nickname e escolha uma foto.");

  return;

}

  /* REMOVE ETAPA 1 */

page1.classList.remove("activePage");

/* MOSTRA ETAPA 2 */

const container =
  document.querySelector(
    ".container"
  );

setTimeout(() => {

  page2.classList.add("activePage");

  if(window.innerWidth <= 700){

    container.style.height = "750px";

  }

  else{

    container.style.height = "760px";

  }

}, 10);

/* PROGRESSO */

  step2Ball.classList.add("active");

  progressLine.classList.add("progressComplete");

});

/* =========================
   COPIAR PIX
========================= */

copyBtn.addEventListener("click", async () => {

  await navigator.clipboard.writeText(
    "d5d7dc22-155f-45ee-8e1f-cdc8433bd8b3"
  );

  alert("Chave Pix copiada!");

});

/* =========================
   CONFIRMAR PAGAMENTO
========================= */

sendBtn.addEventListener("click", async () => {

  const nickname =
    document.getElementById("nickname").value.trim();

  const message =
    document.getElementById("message").value.trim();

  const image =
    document.getElementById("image").files[0];

  if (!image) {

    alert("Imagem não encontrada.");

    return;

  }

  sendBtn.disabled = true;

  sendBtn.innerText = "ENVIANDO...";

  status.innerText = "";

  try {

    /* =========================
       CLOUDINARY
    ========================= */

    const formData = new FormData();

    formData.append(
      "file",
      image
    );

    formData.append(
      "upload_preset",
      "Liveuploads"
    );

    const cloudinaryResponse =
      await fetch(
        "https://api.cloudinary.com/v1_1/dntxzc2hj/image/upload",
        {
          method: "POST",
          body: formData
        }
      );

    const cloudinaryData =
      await cloudinaryResponse.json();

    const imageUrl =
      cloudinaryData.secure_url;

    /* =========================
       FIREBASE
    ========================= */

    await addDoc(
      collection(db, "submissions"),
      {
        nickname,
        message,
        imageUrl,

        approved: false,

        rejected: false,

        shown: false,

        paymentConfirmed: true,

        paymentAlertSent: false,

        createdAt: serverTimestamp()
      }
    );

    /* =========================
       SUCESSO
    ========================= */

    status.style.color =
      "#16a34a";

    status.innerText =
      "Imagem enviada para aprovação!";

    sendBtn.innerText =
      "ENVIADO COM SUCESSO";

  } catch (error) {

    console.error(error);

    status.style.color =
      "red";

    status.innerText =
      "Erro ao enviar.";

    sendBtn.disabled = false;

    sendBtn.innerText =
      "CONFIRMAR PAGAMENTO";

  }

});