function setDarkMode(enabled) {
  document.body.classList.toggle('dark-mode', enabled);
  var btn = document.getElementById('dark-mode-btn');
  if (btn) {
    btn.textContent = enabled ? '[light mode]' : '[dark mode]';
  }
  localStorage.setItem('dark-mode', enabled ? 'on' : 'off');
}

function toggleDarkMode() {
  setDarkMode(!document.body.classList.contains('dark-mode'));
}

setDarkMode(localStorage.getItem('dark-mode') === 'on');
