import { switchView } from "./script.js";
import UI from "./UI-component.js";
// Variables
const patientForm = document.getElementById("patientForm");
const petName = document.getElementById("petName");
const ownerName = document.getElementById("ownerName");
const email = document.getElementById("email");
const date = document.getElementById("date");
const symptoms = document.getElementById("symptoms");
const formSection = document.getElementById("formSection");
export const patientsList = [];
const patientsSection = document.getElementById("patientsSection");
export let DB;
// DB start
window.onload = () => {
  createDB();
  ui.displayPatients();
};
// Classes

class Pet {
  constructor(name, owner, email, date, symptoms, id) {
    this.petName = name;
    this.ownerName = owner;
    this.email = email;
    this.date = date;
    this.symptoms = symptoms;
    this.id = id;
  }
  registerPet(pet) {
    patientsList.push(pet);
    const transaction = DB.transaction(["patients"], "readwrite");
    const objectStore = transaction.objectStore("patients");
    objectStore.add(pet);
    transaction.oncomplete = function (e) {
      console.log(DB);
      showsucceeded("paciente agregado");
      resetForm();
      switchView(false);
    };
    ui.displayPatients();
  }
}

// initialize
const ui = new UI();
// Event listeners
patientForm.addEventListener("change", (e) => {
  if (e.target.type === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(e.target.value)) {
      const error = document.createElement("p");
      error.textContent = "el email es invalido";
      error.classList.add("error");
      e.target.parentNode.appendChild(error);
      return;
    } else {
      const error = document.querySelector(".error");
      if (error) {
        error.parentNode.removeChild(error);
      }
    }
  } else if (e.target.type === "text") {
    if (e.target.value === "") {
      const error = document.createElement("p");
      error.textContent = "Este campo es obligatorio";
      error.classList.add("error");
      e.target.parentNode.appendChild(error);
      return;
    } else {
      const error = document.querySelector(".error");
      if (error) {
        error.parentNode.removeChild(error);
      }
    }
  } else if (e.target.type === "textarea") {
    if (e.target.value === "") {
      const error = document.createElement("p");
      error.textContent = "Este campo es obligatorio";
      error.classList.add("error");
      e.target.parentNode.appendChild(error);
      return;
    } else {
      const error = document.querySelector(".error");
      if (error) {
        error.parentNode.removeChild(error);
      }
    }
  } else if (e.target.type === "date") {
    if (e.target.value === "") {
      const error = document.createElement("p");
      error.textContent = "Este campo es obligatorio";
      error.classList.add("error");
      e.target.parentNode.appendChild(error);
      return;
    } else {
      const error = document.querySelector(".error");
      if (error) {
        error.parentNode.removeChild(error);
      }
    }
  }
});
patientForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (document.querySelector(".update-button")) {
    if (
      email.value !== "" &&
      petName.value !== "" &&
      ownerName.value !== "" &&
      date.value !== "" &&
      symptoms.value !== ""
    ) {
      const transaction = DB.transaction(["patients"], "readwrite");
      const objectStore = transaction.objectStore("patients");
      objectStore.put(
        new Pet(
          petName.value,
          ownerName.value,
          email.value,
          date.value,
          symptoms.value,
          document.querySelector(".update-button").id
        )
      );
      transaction.oncomplete = function (e) {
        resetForm();
        switchView(false);
        showsucceeded("Paciente editado");
        document.querySelector(".btn-submit").textContent =
          "Registrar Paciente";
        document.querySelector(".btn-submit").classList.remove("update-button");
        document.querySelector(".btn-submit").id = "";
        ui.displayPatients();
      };
    }
  } else {
    if (
      email.value !== "" &&
      petName.value !== "" &&
      ownerName.value !== "" &&
      date.value !== "" &&
      symptoms.value !== ""
    ) {
      const id = Math.random().toString(36).substring(2) + Date.now();
      const pet = new Pet(
        petName.value,
        ownerName.value,
        email.value,
        date.value,
        symptoms.value,
        id
      );
      console.log(pet);
      pet.registerPet(pet);
    }
  }
});
// Search Functionality
document.getElementById("searchInput").addEventListener("input", (e) => {
  ui.displayPatients(e.target.value);
});

// funtions

function resetForm() {
  patientForm.reset();
}

function showsucceeded(text) {
  document.querySelector("#successBox").textContent = text;
  document.querySelector("#successBox").classList.add("showsucced");
  setTimeout(() => {
    document.querySelector("#successBox").classList.remove("showsucced");
  }, 3000);
}

export function editing(pet) {
  switchView(true);
  petName.value = pet.petName;
  ownerName.value = pet.ownerName;
  email.value = pet.email;
  date.value = pet.date;
  symptoms.value = pet.symptoms;
  document.querySelector(".btn-submit").textContent = "Actualizar";
  document.querySelector(".btn-submit").classList.add("update-button");
  document.querySelector(".btn-submit").id = pet.id;
}

export function confirmation(id) {
  const card = document.createElement("div");
  card.classList.add("confirmation-card");
  const text = document.createElement("p");
  text.textContent = "¿Estás seguro de eliminar este paciente?";
  card.appendChild(text);
  const buttons = document.createElement("div");
  buttons.classList.add("buttons");
  const yesBtn = document.createElement("button");
  yesBtn.textContent = "Si";
  yesBtn.classList.add("card-button");
  const noBtn = document.createElement("button");
  noBtn.textContent = "No";
  noBtn.classList.add("card-button", "cancel-button");
  buttons.appendChild(yesBtn);
  buttons.appendChild(noBtn);
  card.appendChild(buttons);
  yesBtn.onclick = () => deletePet(id);
  noBtn.onclick = () => cancelDelete();
  patientsSection.appendChild(card);
}
function deletePet(id) {
  const transaction = DB.transaction(["patients"], "readwrite");
  const objectStore = transaction.objectStore("patients");
  objectStore.delete(id);
  transaction.oncomplete = function (e) {
    showsucceeded("Paciente eliminado");
    document.querySelector(".confirmation-card").remove();
    ui.displayPatients();
  };
  transaction.onerror = function (e) {
    console.error("Error al eliminar el paciente");
  }
}

function cancelDelete() {
  if (document.querySelector(".confirmation-card")) {
    document.querySelector(".confirmation-card").remove();
  }
}
function createDB() {
  const createDB = window.indexedDB.open("patients", "1");
  createDB.onerror = function () {
    alert(
      "Su navegador no es apto para este sitio web, por favor actualice o use un navegador web mas moderno"
    );
  };
  createDB.onsuccess = function () {
    DB = createDB.result;
  };
  createDB.onupgradeneeded = function (e) {
    const db = e.target.result;
    const objectStore = db.createObjectStore("patients", {
      keyPath: "id",
      autoIncrement: true,
    });
    objectStore.createIndex("petName", "petName", { unique: false });
    objectStore.createIndex("ownerName", "ownerName", { unique: false });
    objectStore.createIndex("email", "email", { unique: false });
    objectStore.createIndex("date", "date", { unique: false });
    objectStore.createIndex("symptoms", "symptoms", { unique: false });
    objectStore.createIndex("id", "id", { unique: true });
  };
}
// intitial steps
