function setTheme(theme) {
    document.body.classList.remove('dark-mode', 'dark-wallpaper-mode', 'light-wallpaper-mode');

  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
  } else if (theme === 'dark-wallpaper') {
    document.body.classList.add('dark-wallpaper-mode');
  } else if (theme === 'light-wallpaper') {
    document.body.classList.add('light-wallpaper-mode');
  }

  var btn = document.getElementById('dark-mode-btn');
  if (btn) {
    if (theme === 'light') btn.textContent = '[dark mode]';
    else if (theme === 'dark') btn.textContent = '[tsukhime-dark]';
    else if (theme === 'dark-wallpaper') btn.textContent = '[tsukhime-light]';
    else btn.textContent = '[light mode]';
  }

  localStorage.setItem('theme', theme);
}

function toggleDarkMode() {
  var current = localStorage.getItem('theme') || 'light';
  if (current === 'light') setTheme('dark');
  else if (current === 'dark') setTheme('dark-wallpaper');
  else if (current === 'dark-wallpaper') setTheme('light-wallpaper');
  else setTheme('light');
}

setTheme(localStorage.getItem('theme') || 'light');
