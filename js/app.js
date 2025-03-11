import { switchView } from "./script.js";
// Variables
const patientForm = document.getElementById('patientForm');
const petName = document.getElementById('petName');
const ownerName = document.getElementById('ownerName');
const email = document.getElementById('email');
const date = document.getElementById('date');
const symptoms = document.getElementById('symptoms');
const patientsList = JSON.parse(localStorage.getItem('patientsList')) || [];
const patients = document.getElementById('patientsList')
const formSection = document.getElementById('formSection');
const patientsSection = document.getElementById('patientsSection');

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
    localStorage.setItem('patientsList', JSON.stringify(patientsList));
    ui.displayPatients();
  }
}
class UI{
    displayPatients(filter = '') {
        patients.innerHTML = ''
        const filteredPatients = patientsList.filter(pet =>
            pet.petName.toLowerCase().includes(filter.toLowerCase()));
        filteredPatients.forEach(pet => {
            const card = document.createElement('div');
            card.classList.add('patient-card');
            card.innerHTML = `
            <h3>${pet.petName}</h3>
            <p><strong>Dueño:</strong> ${pet.ownerName}</p>
            <p><strong>Email:</strong> ${pet.email}</p>
            <p><strong>Fecha:</strong> ${pet.date}</p>
            <p><strong>Síntomas:</strong> ${pet.symptoms}</p>
            `;
            const editDeleteCaonstainer = document.createElement('div');
            editDeleteCaonstainer.classList.add('edit-delete-container');
            const editBtn = document.createElement('button')
            editBtn.innerHTML = 'Editar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';
            editBtn.classList.add('card-button', 'edit-button');
            const deleteBtn = document.createElement('button')
            deleteBtn.innerHTML = 'Eliminar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
            deleteBtn.classList.add('card-button', 'delete-button');
            editDeleteCaonstainer.appendChild(editBtn);
            editDeleteCaonstainer.appendChild(deleteBtn);
            card.appendChild(editDeleteCaonstainer);
            const clone = structuredClone(pet)
            editBtn.onclick = () => editing(clone);
            deleteBtn.onclick = () => confirmation(pet.id);
            patients.appendChild(card);
        }
    )
}
}

// initialize
const ui = new UI
// Event listeners
patientForm.addEventListener('change', (e) => {
    if (e.target.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(e.target.value)) {
            const error = document.createElement('p');
            error.textContent = 'el email es invalido';
            error.classList.add('error')
            e.target.parentNode.appendChild(error);
            return;
        } else {
            const error = document.querySelector('.error');
            if (error) {
                error.parentNode.removeChild(error);
            }
        }
        ;
    } else if (e.target.type === 'text'){
        if (e.target.value === ''){
            const error = document.createElement('p');
            error.textContent = 'Este campo es obligatorio';
            error.classList.add('error')
            e.target.parentNode.appendChild(error);
            return;
        } else {
            const error = document.querySelector('.error');
            if (error) {
                error.parentNode.removeChild(error);
            }
        }
    } else if (e.target.type === 'textarea'){
        if (e.target.value === ''){
            const error = document.createElement('p');
            error.textContent = 'Este campo es obligatorio';
            error.classList.add('error')
            e.target.parentNode.appendChild(error);
            return;
        } else {
            const error = document.querySelector('.error');
            if (error) {
                error.parentNode.removeChild(error);
            }
        }
    } else if (e.target.type === 'date'){
        if (e.target.value === ''){
            const error = document.createElement('p');
            error.textContent = 'Este campo es obligatorio';
            error.classList.add('error')
            e.target.parentNode.appendChild(error);
            return;
        } else {
            const error = document.querySelector('.error');
            if (error) {
                error.parentNode.removeChild(error);
            }
        }
    }
});
patientForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (document.querySelector('.update-button')){
        if (email.value !== '' && petName.value !== '' && ownerName.value !== '' && date.value !== '' && symptoms.value !== ''){
            const index = patientsList.findIndex(obj => obj.id === document.querySelector('.update-button').id);
            if (index > -1) {
                patientsList[index].petName = petName.value;
                patientsList[index].ownerName = ownerName.value;
                patientsList[index].email = email.value;
                patientsList[index].date = date.value;
                patientsList[index].symptoms = symptoms.value;
                localStorage.setItem('patientsList', JSON.stringify(patientsList));
            }
        resetForm();
        switchView(false)
        showsucceeded('Paciente editado');
        document.querySelector('.btn-submit').textContent = 'Registrar Paciente';
        document.querySelector('.btn-submit').classList.remove('update-button');
        document.querySelector('.btn-submit').id = '';
        ui.displayPatients();
        }
    } else {
        if (email.value !== '' && petName.value !== '' && ownerName.value !== '' && date.value !== '' && symptoms.value !== '') {
            const id = Math.random().toString(36).substring(2) + Date.now();
            const pet = new Pet(petName.value, ownerName.value, email.value, date.value, symptoms.value, id);
            console.log(pet)
            pet.registerPet(pet);
            resetForm();
            switchView(false)
            showsucceeded('paciente agregado');
        }
    }

}
);
    // Search Functionality
document.getElementById('searchInput').addEventListener('input', (e) => {
    ui.displayPatients(e.target.value);
});


// funtions

function resetForm() {
    patientForm.reset();
}


function showsucceeded(text) {
    document.querySelector('#successBox').textContent = text;
    document.querySelector('#successBox').classList.add('showsucced');
    console.log(document.querySelector('#successBox').classList);
    setTimeout(() => {
        document.querySelector('#successBox').classList.remove('showsucced');
    }, 3000);
}

function editing(pet) {
    switchView(true);
    petName.value = pet.petName;
    ownerName.value = pet.ownerName;
    email.value = pet.email;
    date.value = pet.date;
    symptoms.value = pet.symptoms;
    console.log(pet);
    document.querySelector('.btn-submit').textContent = 'Actualizar';
    document.querySelector('.btn-submit').classList.add('update-button');
    document.querySelector('.btn-submit').id = pet.id;
}

function confirmation(id) {
    const card = document.createElement('div');
    card.classList.add('confirmation-card');
    const text = document.createElement('p');
    text.textContent = '¿Estás seguro de eliminar este paciente?';
    card.appendChild(text);
    const buttons = document.createElement('div');
    buttons.classList.add('buttons');
    const yesBtn = document.createElement('button');
    yesBtn.textContent = 'Si';
    yesBtn.classList.add('card-button');
    const noBtn = document.createElement('button');
    noBtn.textContent = 'No';
    noBtn.classList.add('card-button', 'cancel-button');
    buttons.appendChild(yesBtn);
    buttons.appendChild(noBtn);
    card.appendChild(buttons);
    yesBtn.onclick = () => deletePet(id);
    noBtn.onclick = () => cancelDelete();
    patientsSection.appendChild(card);

}
function deletePet(id) {
    const index = patientsList.findIndex(obj => obj.id === id);
    if (index > -1) {
        console.log('Deleting pet')
        patientsList.splice(index, 1);
        localStorage.setItem('patientsList', JSON.stringify(patientsList));
        showsucceeded('Paciente eliminado');
        document.querySelector('.confirmation-card').remove();
        ui.displayPatients();
    } else {
        console.error('No se encontro el paciente');
    }
}

function cancelDelete() {
    if (document.querySelector('.confirmation-card')){
        document.querySelector('.confirmation-card').remove()
    };
}


// intitial steps

ui.displayPatients();

