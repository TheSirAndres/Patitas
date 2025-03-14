document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menuToggle");
  const closeSidebar = document.getElementById("closeSidebar");
  const btnNewPatient = document.getElementById("btnNewPatient");
  const btnViewPatients = document.getElementById("btnViewPatients");
  const formSection = document.getElementById("formSection");
  const patientsSection = document.getElementById("patientsSection");
  const modeButton = document.getElementById("checkboxInput");
  const savedTheme = localStorage.getItem("theme");
  const body = document.querySelector("body");
  const checkbox = document.querySelector("#checkboxInput");

  // Estado inicial
  let showForm = false;
  // 1. Manejo del Sidebar
  const toggleSidebar = () => sidebar.classList.toggle("active");
  menuToggle.addEventListener("click", toggleSidebar);
  closeSidebar.addEventListener("click", toggleSidebar);

  btnNewPatient.addEventListener("click", () => switchView(true));
  btnViewPatients.addEventListener("click", () => switchView(false));

  document.addEventListener("click", (e) => {
    if (
      window.innerWidth < 992 &&
      !sidebar.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      sidebar.classList.remove("active");
    }
  });
  if (savedTheme === "dark") {
    enableDarkMode();
  }

  // Función para modo oscuro
  function enableDarkMode() {
    body.classList.add("dark-mode");
    checkbox.checked = true;
    localStorage.setItem("theme", "dark");
  }

  // Función para modo claro
  function disableDarkMode() {
    body.classList.remove("dark-mode");
    checkbox.checked = false;
    localStorage.setItem("theme", "light");
  }

  // Event listener para el botón
  modeButton.addEventListener("click", () => {
    body.classList.contains("dark-mode") ? disableDarkMode() : enableDarkMode();
  });
  // Inicialización
  switchView(false);
});
export const switchView = (showFormView) => {
  formSection.classList.toggle("hidden", !showFormView);
  patientsSection.classList.toggle("hidden", showFormView);
};
