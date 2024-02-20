// Debounce function to limit the rate at which a function can fire
function debounce(func, wait) {
  let timeout;
  return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
  };
}


document.addEventListener('DOMContentLoaded', function() {
    // Reset mechanisms if this is a fresh page load or re-entry
    if (!sessionStorage.getItem('navigatingWithinSite')) {
        resetMechanisms();
    }
    sessionStorage.setItem('navigatingWithinSite', 'true');

    // Original code for handling switches and device control
    let toggle = document.querySelector(".toggle");
    let toggle1 = document.querySelector(".toggle1");
    let toggle2 = document.querySelector(".toggle2");
    let toggle3 = document.querySelector(".toggle3");
    let txt = document.querySelector(".text");
    let txt1 = document.querySelector(".text1");
    let txt2 = document.querySelector(".text2");
    let txt3 = document.querySelector(".text3");

    // Debounced function for toggling devices
    const debouncedToggleDevice = debounce(toggleDevice, 250); // Adjust the delay as needed

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
      debouncedToggleDevice('motor', toggle.classList.contains("active") ? 'on' : 'off');
    });

    toggle1.addEventListener("click", function () {
      toggle1.classList.toggle("active");
      localStorage.setItem("toggle1State", toggle1.classList.contains("active"));
      txt1.innerHTML = toggle1.classList.contains("active") ? "ON" : "OFF";
      debouncedToggleDevice('fan', toggle1.classList.contains("active") ? 'on' : 'off');
    });

    toggle2.addEventListener("click", function () {
      toggle2.classList.toggle("active");
      localStorage.setItem("toggle2State", toggle2.classList.contains("active"));
      txt2.innerHTML = toggle2.classList.contains("active") ? "ON" : "OFF";
      debouncedToggleDevice('pump', toggle2.classList.contains("active") ? 'on' : 'off');
    });

    toggle3.addEventListener("click", function () {
      toggle3.classList.toggle("active");
      localStorage.setItem("toggle3State", toggle3.classList.contains("active"));
      txt3.innerHTML = toggle3.classList.contains("active") ? "ON" : "OFF";
      debouncedToggleDevice('heater', toggle3.classList.contains("active") ? 'on' : 'off');
    });

    // Initial setup to retrieve and apply stored switch states
    updateSwitchState(toggle, txt, "toggleState");
    updateSwitchState(toggle1, txt1, "toggle1State");
    updateSwitchState(toggle2, txt2, "toggle2State");
    updateSwitchState(toggle3, txt3, "toggle3State");
});

function resetMechanisms() {
    // List all devices you need to reset
    const devices = ['motor', 'fan', 'pump', 'heater'];
    devices.forEach(device => {
        // Directly send 'off' command without waiting for user interaction
        toggleDevice(device, 'off');
    });
}

function toggleDevice(device, state) {
  fetch(`http://192.168.1.128:5000/control/${device}/${state}`, { method: 'GET' })
  .then(response => response.text())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
}

// Debounce function to limit the rate at which a function can fire
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// Function to update the slider's visual appearance and value display
function setSliderAppearance(slider, valueDisplay) {
  const valPercent = (slider.value / slider.max) * 100;
  slider.style.background = `linear-gradient(to right, rgb(120, 128, 160) ${valPercent}%, #012970 ${valPercent}%)`;
  valueDisplay.textContent = slider.value;
}

// Function to initialize sliders with debounce
function initSliders() {
  const debouncedUpdate = debounce((id, value) => {
    sessionStorage.setItem(id, value); // Save to Session Storage
    localStorage.setItem(id, value); // Save to Local Storage
  }, 250);

  // Define your sliders and their corresponding value display elements
  const sliders = [
    { sliderId: 'Slide', valueId: 'slider-value-mixer' },
    { sliderId: 'Slide1', valueId: 'slider-value-fan' },
    { sliderId: 'Slide2', valueId: 'slider-value-pump' },
    { sliderId: 'Slide3', valueId: 'slider-value-heater' }
  ];

  sliders.forEach(({ sliderId, valueId }) => {
    const slider = document.getElementById(sliderId);
    const valueDisplay = document.getElementById(valueId);

    // Set slider value from Session Storage or Local Storage or default to max
    slider.value = sessionStorage.getItem(sliderId) || localStorage.getItem(sliderId) || slider.max;
    setSliderAppearance(slider, valueDisplay);

    // Event listener for slider input
    slider.addEventListener('input', function() {
      setSliderAppearance(slider, valueDisplay);
      debouncedUpdate(sliderId, slider.value);
    });
  });
}

// Clear Local Storage when the user is about to leave the page
window.addEventListener('beforeunload', () => {
  localStorage.clear();
});

// Initialize sliders on page load
window.addEventListener('DOMContentLoaded', initSliders);
