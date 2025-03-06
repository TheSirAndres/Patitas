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
  constructor(name, owner, email, date, symptoms) {
    this.petName = name;
    this.ownerName = owner;
    this.email = email;
    this.date = date;
    this.symptoms = symptoms;
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
            patients.appendChild(card);
        }
    )}
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
    // const errors = document.querySelectorAll('.error');
    // errors.forEach(error => error.parentNode.removeChild(error));
    if (email.value !== '' && petName.value !== '' && ownerName.value !== '' && date.value !== '' && symptoms.value !== '') {
        const pet = new Pet(petName.value, ownerName.value, email.value, date.value, symptoms.value);
        console.log(pet)
        pet.registerPet(pet);
        resetForm();
        switchView(false)
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
const switchView = (showFormView) => {
    formSection.classList.toggle('hidden', !showFormView);
    patientsSection.classList.toggle('hidden', showFormView);
}

// intitial steps

ui.displayPatients();

