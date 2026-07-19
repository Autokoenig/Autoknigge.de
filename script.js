document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('.site-header');
  if (!header) return;

  // Zwei unterschiedliche Schwellenwerte (Hysterese) verhindern das
  // Flackern/Zittern, das entsteht, wenn scrollY genau um einen
  // einzelnen Grenzwert herum schwankt.
  var ENTER = 60; // ab hier wird der Header kompakt
  var EXIT = 20;  // erst ab hier wird er wieder groß

  var ticking = false;

  function updateHeader() {
    var y = window.scrollY;
    if (y > ENTER) {
      header.classList.add('is-scrolled');
    } else if (y < EXIT) {
      header.classList.remove('is-scrolled');
    }
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateHeader();
});
