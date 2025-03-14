const patients = document.getElementById("patientsList");
import { patientsList, editing, confirmation, DB } from "./app.js";
export default class UI {
  displayPatients(filter = "") {
    patientsList.length = 0;
    waitForDB(() => {
      const objectStore = DB.transaction("patients").objectStore("patients");
      objectStore.openCursor().onsuccess = function (e) {
        const cursor = e.target.result;
        if (cursor) {
          patientsList.push(cursor.value);
          printData(filter);
          cursor.continue();
        }
      };
    });
  }
}
function waitForDB(callback, retryInterval = 100, maxRetries = 50) {
  let retries = 0;

  const interval = setInterval(() => {
    if (DB) {
      // Check if DB is defined
      clearInterval(interval); // Stop the interval
      callback(); // Execute your code
    } else if (retries >= maxRetries) {
      clearInterval(interval); // Stop after max retries
      console.error("Failed to initialize DB after retries");
    }
    retries++;
  }, retryInterval);
}

function printData(filter) {
  patients.innerHTML = "";
  const filteredPatients = patientsList.filter((pet) =>
    pet.petName.toLowerCase().includes(filter.toLowerCase())
  );
  filteredPatients.forEach((pet) => {
    const card = document.createElement("div");
    card.classList.add("patient-card");
    card.innerHTML = `
          <h3>${pet.petName}</h3>
          <p><strong>Dueño:</strong> ${pet.ownerName}</p>
          <p><strong>Email:</strong> ${pet.email}</p>
          <p><strong>Fecha:</strong> ${pet.date}</p>
          <p><strong>Síntomas:</strong> ${pet.symptoms}</p>
          `;
    const editDeleteCaonstainer = document.createElement("div");
    editDeleteCaonstainer.classList.add("edit-delete-container");
    const editBtn = document.createElement("button");
    editBtn.innerHTML =
      'Editar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';
    editBtn.classList.add("card-button", "edit-button");
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML =
      'Eliminar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
    deleteBtn.classList.add("card-button", "delete-button");
    editDeleteCaonstainer.appendChild(editBtn);
    editDeleteCaonstainer.appendChild(deleteBtn);
    card.appendChild(editDeleteCaonstainer);
    const clone = structuredClone(pet);
    editBtn.onclick = () => editing(clone);
    deleteBtn.onclick = () => confirmation(pet.id);
    patients.appendChild(card);
  });
}
