// Google Translate Integration & Language Persistence Engine for IT SCOPE

// 1. Initialize Google Translate Element
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'pt',
    includedLanguages: 'pt,en,es',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
  
  // Try syncing language immediately after initialization steps
  setTimeout(syncLanguage, 100);
  setTimeout(syncLanguage, 500);
  setTimeout(syncLanguage, 1000);
}

// 2. Sync Google Translate widget with the stored preferred language
function syncLanguage() {
  const preferredLang = localStorage.getItem('preferred_lang');
  if (!preferredLang) return false;
  
  const selectEl = document.querySelector('.goog-te-combo');
  if (selectEl) {
    const targetVal = preferredLang === 'pt' ? '' : preferredLang;
    if (selectEl.value !== targetVal) {
      selectEl.value = targetVal;
      selectEl.dispatchEvent(new Event('change'));
    }
    return true; // Successfully synced
  }
  return false; // Combo element not ready yet
}

// 3. User clicked a language flag
function translateLanguage(lang) {
  localStorage.setItem('preferred_lang', lang);
  
  // Try to write to cookie for server-side environments
  const expires = "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
  if (lang === 'pt') {
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + location.hostname;
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." + location.hostname.replace(/^www\./, '');
  } else {
    document.cookie = "googtrans=/pt/" + lang + "; path=/" + expires;
    document.cookie = "googtrans=/pt/" + lang + "; path=/; domain=" + location.hostname + expires;
    document.cookie = "googtrans=/pt/" + lang + "; path=/; domain=." + location.hostname.replace(/^www\./, '') + expires;
  }
  
  // Programmatically trigger Google Translate combo box change event
  const selectEl = document.querySelector('.goog-te-combo');
  if (selectEl) {
    selectEl.value = lang === 'pt' ? '' : lang;
    selectEl.dispatchEvent(new Event('change'));
  } else {
    // If the widget hasn't loaded yet, reload the page to apply cookie translation
    window.location.reload();
  }
}

// 4. Polling mechanism to sync language as early as possible during page load
(function() {
  let attempts = 0;
  const maxAttempts = 80; // 8 seconds
  const checkInterval = setInterval(() => {
    attempts++;
    if (syncLanguage() || attempts >= maxAttempts) {
      clearInterval(checkInterval);
    }
  }, 100);
})();

// 5. Monitor and correct document title translations to protect the "IT SCOPE" brand name
(function() {
  const targetNode = document.querySelector('title');
  if (!targetNode) return;

  const restoreTitle = () => {
    let currentTitle = document.title;
    // List of literal translations of "IT SCOPE" to restore
    const translatedNames = [
      /ALCANCE DE LAS TI/gi,
      /ALCANCE DE LA TI/gi,
      /ALCANCE DE TI/gi,
      /ALCANCE TI/gi,
      /IT ALCANCE/gi
    ];
    
    let changed = false;
    translatedNames.forEach((regex) => {
      if (regex.test(currentTitle)) {
        currentTitle = currentTitle.replace(regex, 'IT SCOPE');
        changed = true;
      }
    });
    
    if (changed && document.title !== currentTitle) {
      document.title = currentTitle;
    }
  };

  const observer = new MutationObserver((mutations) => {
    // Temporarily disconnect to prevent infinite recursion
    observer.disconnect();
    restoreTitle();
    observer.observe(targetNode, { subtree: true, characterData: true, childList: true });
  });

  observer.observe(targetNode, { subtree: true, characterData: true, childList: true });
  
  // Also run initially and on intervals to ensure it handles late script changes
  restoreTitle();
  setInterval(restoreTitle, 500);
})();

// 6. Google Analytics Custom Conversion Event Tracking (WhatsApp, Email, and Social links)
document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('click', function(e) {
    var target = e.target.closest('a');
    if (!target) return;
    
    var href = target.getAttribute('href') || '';
    
    if (href.indexOf('wa.me') !== -1 || href.indexOf('api.whatsapp.com') !== -1) {
      if (typeof gtag === 'function') {
        gtag('event', 'click_whatsapp', {
          'event_category': 'Contact',
          'event_label': href
        });
      }
    } else if (href.indexOf('mailto:') !== -1) {
      if (typeof gtag === 'function') {
        gtag('event', 'click_email', {
          'event_category': 'Contact',
          'event_label': href
        });
      }
    } else if (href.indexOf('linkedin.com') !== -1) {
      if (typeof gtag === 'function') {
        gtag('event', 'click_linkedin', {
          'event_category': 'Social',
          'event_label': href
        });
      }
    } else if (href.indexOf('instagram.com') !== -1) {
      if (typeof gtag === 'function') {
        gtag('event', 'click_instagram', {
          'event_category': 'Social',
          'event_label': href
        });
      }
    } else if (href.indexOf('youtube.com') !== -1) {
      if (typeof gtag === 'function') {
        gtag('event', 'click_youtube', {
          'event_category': 'Social',
          'event_label': href
        });
      }
    }
  });
});
