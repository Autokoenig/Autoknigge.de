(function () {
  var STORAGE_KEY = 'autoknigge_cookie_consent';

  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function setConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
  }

  function buildBanner() {
    var wrap = document.createElement('div');
    wrap.id = 'cookie-consent-banner';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-label', 'Cookie-Einstellungen');
    wrap.innerHTML =
      '<div class="cc-inner">' +
        '<p class="cc-text">Wir verwenden auf autoknigge.de nur technisch notwendige Cookies, um die Seite zuverlässig auszuliefern. ' +
        'Optionale Cookies (z. B. für eingebettete Inhalte oder spätere Reichweitenmessung) setzen wir ausschließlich mit Ihrer Zustimmung. ' +
        'Details finden Sie in unserer <a href="datenschutz.html">Datenschutzerklärung</a>.</p>' +
        '<div class="cc-buttons">' +
          '<button type="button" class="cc-btn cc-btn-secondary" id="cc-reject">Nur notwendige</button>' +
          '<button type="button" class="cc-btn cc-btn-primary" id="cc-accept">Alle akzeptieren</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);

    document.getElementById('cc-accept').addEventListener('click', function () {
      setConsent('all');
      wrap.remove();
    });
    document.getElementById('cc-reject').addEventListener('click', function () {
      setConsent('necessary');
      wrap.remove();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!getConsent()) {
      buildBanner();
    }

    // Ermöglicht erneutes Öffnen über einen Link im Footer,
    // z. B. <a href="#" id="cookie-settings-link">Cookie-Einstellungen</a>
    var reopenLink = document.getElementById('cookie-settings-link');
    if (reopenLink) {
      reopenLink.addEventListener('click', function (e) {
        e.preventDefault();
        if (!document.getElementById('cookie-consent-banner')) {
          buildBanner();
        }
      });
    }
  });
})();
