(function() {
  var html = document.documentElement;
  var themeChip = document.getElementById('theme-chip');
  var pagecolorChip = document.getElementById('pagecolor-chip');

  function getTheme() {
    var params = new URLSearchParams(window.location.search);
    var param = params.get('theme');
    if (param === 'personal') return 'personal';
    if (param === 'latex') return 'latex';
    try {
      var stored = localStorage.getItem('theme');
      if (stored === 'personal' || stored === 'latex') return stored;
    } catch(e) {}
    return 'latex';
  }

  function getMode() {
    var params = new URLSearchParams(window.location.search);
    var param = params.get('mode');
    if (param === 'dark') return 'dark';
    if (param === 'light') return 'light';
    try {
      var stored = localStorage.getItem('mode');
      if (stored === 'dark' || stored === 'light') return stored;
    } catch(e) {}
    return 'light';
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch(e) {}
    if (themeChip) {
      themeChip.textContent = theme === 'latex'
        ? '\\end{document}'
        : '\\documentclass{article}';
    }
  }

  function applyMode(mode) {
    html.setAttribute('data-mode', mode);
    try { localStorage.setItem('mode', mode); } catch(e) {}
    if (pagecolorChip) {
      pagecolorChip.textContent = mode === 'dark'
        ? '\\pagecolor{light}'
        : '\\pagecolor{dark}';
    }
  }

  applyTheme(getTheme());
  applyMode(getMode());

  if (themeChip) {
    themeChip.onclick = function() {
      var next = html.getAttribute('data-theme') === 'latex'
        ? 'personal'
        : 'latex';
      applyTheme(next);
      return false;
    };
  }

  if (pagecolorChip) {
    pagecolorChip.onclick = function() {
      var next = html.getAttribute('data-mode') === 'dark'
        ? 'light'
        : 'dark';
      applyMode(next);
      return false;
    };
  }

  // back-to-top (auto-hide until scrolled 300px)
  var topChip = document.getElementById('top-chip');
  if (topChip) {
    topChip.onclick = function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    };
    function checkScroll() {
      if (window.scrollY > 300) {
        topChip.classList.add('visible');
      } else {
        topChip.classList.remove('visible');
      }
    }
    checkScroll();
    window.addEventListener('scroll', checkScroll, { passive: true });
  }

  // nav popup (\begin{document})
  var navChip = document.getElementById('nav-chip');
  var navPopup = document.getElementById('latex-nav-popup');
  if (navChip && navPopup) {
    navChip.onclick = function(e) {
      e.preventDefault();
      navPopup.classList.toggle('show');
      return false;
    };
    document.addEventListener('click', function(e) {
      if (!navPopup.contains(e.target) && e.target !== navChip) {
        navPopup.classList.remove('show');
      }
    });
  }

  // table of contents
  var tocChip = document.getElementById('toc-chip');
  var tocBox = document.getElementById('latex-toc');
  if (tocChip && tocBox) {
    // build TOC from <b> section headers + <hr> structure
    if (!tocBox.getAttribute('data-built')) {
      var items = [];
      var nodes = document.querySelectorAll('#personal-layer b, #latex-layer b, body > b, td b');
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        var text = n.textContent.trim();
        if (!text || text.length > 60) continue;
        // skip nav/menu items (they're short link texts)
        var parent = n.parentElement;
        if (parent && parent.tagName === 'A') continue;
        if (text.match(/^(Menu|Friends|Status|Now Playing|Stuff|BGM)$/i)) continue;
        items.push(text);
      }
      if (items.length > 0) {
        var html_ = '<div class="toc-title">Catalogue of Sections</div>';
        html_ += items.map(function(t, i) {
          return '<a href="#top" data-idx="' + i + '">\\ref{' + t + '}</a>';
        }).join('\n');
        tocBox.innerHTML = html_;
        tocBox.setAttribute('data-built', '1');
      } else {
        tocChip.style.display = 'none';
        tocBox.style.display = 'none';
      }
    }
    tocChip.onclick = function(e) {
      e.preventDefault();
      tocBox.classList.toggle('show');
      return false;
    };
    // close TOC when clicking a link inside
    var tocLinks = tocBox.querySelectorAll('a[data-idx]');
    for (var j = 0; j < tocLinks.length; j++) {
      (function(link, idx) {
        link.onclick = function(e) {
          e.preventDefault();
          // find the actual <b> element by index
          var allB = document.querySelectorAll('td b, body > b');
          var target = null;
          var count = 0;
          for (var k = 0; k < allB.length; k++) {
            var t = allB[k].textContent.trim();
            if (!t || t.length > 60) continue;
            if (t.match(/^(Menu|Friends|Status|Now Playing|Stuff|BGM)$/i)) continue;
            if (count === idx) { target = allB[k]; break; }
            count++;
          }
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          tocBox.classList.remove('show');
          return false;
        };
      })(tocLinks[j], j);
    }
    // close TOC when clicking outside
    document.addEventListener('click', function(e) {
      if (!tocBox.contains(e.target) && e.target !== tocChip) {
        tocBox.classList.remove('show');
      }
    });
  }

  // live clock
  var clock = document.getElementById('latex-clock');
  if (clock) {
    function updateClock() {
      var now = new Date();
      var h = now.getHours();
      var m = now.getMinutes().toString().padStart(2, '0');
      var ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      h = h ? h : 12;
      clock.textContent = h + ':' + m + ' ' + ampm;
    }
    updateClock();
    setInterval(updateClock, 1000);
  }
})();