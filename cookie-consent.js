(function () {
  var STORAGE_KEY = 'autoknigge_cookie_consent_v2';
  var ADSENSE_CLIENT = 'ca-pub-7178658520690671';
  var adsenseLoaded = false;

  function loadAdsense() {
    if (adsenseLoaded) return;
    adsenseLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADSENSE_CLIENT;
    s.crossOrigin = 'anonymous';
    document.head.appendChild(s);
  }

  function maybeLoadAdsense(consent) {
    if (consent && consent.marketing) {
      loadAdsense();
    }
  }

  function getConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function setConsent(obj) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); } catch (e) {}
    // Für spätere Skripte (z. B. AdSense, Analytics) global verfügbar machen:
    window.autoknigge_consent = obj;
    document.dispatchEvent(new CustomEvent('autoknigge:consent-updated', { detail: obj }));
    maybeLoadAdsense(obj);
  }

  function buildBanner() {
    var wrap = document.createElement('div');
    wrap.id = 'cookie-consent-banner';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-label', 'Cookie-Einstellungen');
    wrap.innerHTML =
      '<div class="cc-inner">' +
        '<div class="cc-main">' +
          '<p class="cc-text">Wir verwenden technisch notwendige Cookies für den Betrieb der Seite. ' +
          'Mit Ihrer Einwilligung nutzen wir außerdem Cookies für Statistik und personalisierte Werbung. ' +
          'Details und Widerruf jederzeit in unserer <a href="datenschutz.html">Datenschutzerklärung</a>.</p>' +
          '<div class="cc-buttons">' +
            '<button type="button" class="cc-btn cc-btn-text" id="cc-settings-toggle">Auswahl anpassen</button>' +
            '<button type="button" class="cc-btn cc-btn-secondary" id="cc-reject">Nur notwendige</button>' +
            '<button type="button" class="cc-btn cc-btn-primary" id="cc-accept">Alle akzeptieren</button>' +
          '</div>' +
        '</div>' +
        '<div class="cc-details" id="cc-details" hidden>' +
          '<label class="cc-option cc-option-disabled">' +
            '<input type="checkbox" checked disabled>' +
            '<span><strong>Notwendig</strong> — für den Betrieb der Seite erforderlich, immer aktiv</span>' +
          '</label>' +
          '<label class="cc-option">' +
            '<input type="checkbox" id="cc-cat-statistik">' +
            '<span><strong>Statistik</strong> — hilft uns zu verstehen, welche Inhalte gut ankommen</span>' +
          '</label>' +
          '<label class="cc-option">' +
            '<input type="checkbox" id="cc-cat-marketing">' +
            '<span><strong>Marketing</strong> — ermöglicht personalisierte Werbung (z. B. Google AdSense)</span>' +
          '</label>' +
          '<button type="button" class="cc-btn cc-btn-primary" id="cc-save-selection">Auswahl speichern</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);

    document.getElementById('cc-accept').addEventListener('click', function () {
      setConsent({ necessary: true, statistics: true, marketing: true });
      wrap.remove();
    });
    document.getElementById('cc-reject').addEventListener('click', function () {
      setConsent({ necessary: true, statistics: false, marketing: false });
      wrap.remove();
    });
    document.getElementById('cc-settings-toggle').addEventListener('click', function () {
      var details = document.getElementById('cc-details');
      details.hidden = !details.hidden;
    });
    document.getElementById('cc-save-selection').addEventListener('click', function () {
      setConsent({
        necessary: true,
        statistics: document.getElementById('cc-cat-statistik').checked,
        marketing: document.getElementById('cc-cat-marketing').checked
      });
      wrap.remove();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var existing = getConsent();
    if (existing) {
      window.autoknigge_consent = existing;
      maybeLoadAdsense(existing);
    } else {
      buildBanner();
    }

    // Erneutes Öffnen über Footer-Link, z. B. <a href="#" id="cookie-settings-link">Cookie-Einstellungen</a>
    var reopenLink = document.getElementById('cookie-settings-link');
    if (reopenLink) {
      reopenLink.addEventListener('click', function (e) {
        e.preventDefault();
        if (!document.getElementById('cookie-consent-banner')) {
          buildBanner();
          var details = document.getElementById('cc-details');
          details.hidden = false;
          var current = getConsent();
          if (current) {
            document.getElementById('cc-cat-statistik').checked = !!current.statistics;
            document.getElementById('cc-cat-marketing').checked = !!current.marketing;
          }
        }
      });
    }
  });
})();
