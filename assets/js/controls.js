
/**
 * Machine Controls CSS Toggle
 */
let toggle = document.querySelector(".toggle");
let toggle1 = document.querySelector(".toggle1");
let toggle2 = document.querySelector(".toggle2");
let toggle3 = document.querySelector(".toggle3");
let txt = document.querySelector(".text");
let txt1 = document.querySelector(".text1");
let txt2 = document.querySelector(".text2");
let txt3 = document.querySelector(".text3");

// Function to update the switch state based on localStorage
function updateSwitchState(element, textElement, storageKey) {
  const isSwitchActive = localStorage.getItem(storageKey) === "true";
  element.classList.toggle("active", isSwitchActive);
  textElement.innerHTML = isSwitchActive ? "ON" : "OFF";
}

// Event listeners for toggling switches
toggle.addEventListener("click", function () {
  toggle.classList.toggle("active");
  localStorage.setItem("toggleState", toggle.classList.contains("active"));
  txt.innerHTML = toggle.classList.contains("active") ? "ON" : "OFF";
});

toggle1.addEventListener("click", function () {
  toggle1.classList.toggle("active");
  localStorage.setItem("toggle1State", toggle1.classList.contains("active"));
  txt1.innerHTML = toggle1.classList.contains("active") ? "ON" : "OFF";
});

toggle2.addEventListener("click", function () {
  toggle2.classList.toggle("active");
  localStorage.setItem("toggle2State", toggle2.classList.contains("active"));
  txt2.innerHTML = toggle2.classList.contains("active") ? "ON" : "OFF";
});

toggle3.addEventListener("click", function () {
  toggle3.classList.toggle("active");
  localStorage.setItem("toggle3State", toggle3.classList.contains("active"));
  txt3.innerHTML = toggle3.classList.contains("active") ? "ON" : "OFF";
});

// Initial setup to retrieve and apply stored switch states
updateSwitchState(toggle, txt, "toggleState");
updateSwitchState(toggle1, txt1, "toggle1State");
updateSwitchState(toggle2, txt2, "toggle2State");
updateSwitchState(toggle3, txt3, "toggle3State");

document.addEventListener('DOMContentLoaded', function() {
  const toggleSwitches = document.querySelectorAll('.toggle-btn');
  toggleSwitches.forEach(switchElement => {
      switchElement.addEventListener('click', function() {
          const device = this.dataset.device;
          const isActive = this.classList.toggle('active');
          const state = isActive ? 'on' : 'off';
          // Find the sibling .text div inside the same container
          const textElement = this.parentElement.nextElementSibling;
          textElement.textContent = state.toUpperCase();
          toggleDevice(device, state);
      });
  });
});

function toggleDevice(device, state) {
  fetch(`http://192.168.1.128:5000/control/${device}/${state}`, { method: 'GET' })
  .then(response => response.text())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
}
