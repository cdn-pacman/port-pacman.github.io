/* Welcome screen, browser-language default, and English/Hindi UI labels. */
(() => {
  const translations = {
    en: { welcomeTitle:"Let’s go", welcomeSubtitle:"Your journey into custom ROMs starts here.", languageLabel:"Choose your language", letsGo:"Let’s go →", heroTitle:"Custom ROMs for Pacman", browseRoms:"Browse ROMs", telegramGroups:"Telegram groups", libraryKicker:"PACMAN BUILDS", libraryTitle:"ROM library", librarySubtitle:"Explore releases for Nothing Phone (2a).", searchLabel:"Search ROMs", searchPlaceholder:"Search ROMs…", libraryLoading:"Loading ROM releases…", categoryAll:"All", romCount:"ROMs", noRomsMatch:"No ROMs match your search.", viewRom:"View ROM", tabAbout:"About ROM", tabDownload:"Download", tabScreenshots:"Screenshots", swipeHint:"Swipe up/down to switch ROM · swipe left/right to change section" },
    hi: { welcomeTitle:"चलिए शुरू करें", welcomeSubtitle:"कस्टम ROM की आपकी यात्रा यहाँ से शुरू होती है।", languageLabel:"अपनी भाषा चुनें", letsGo:"चलिए →", heroTitle:"Pacman के लिए कस्टम ROM", browseRoms:"ROM देखें", telegramGroups:"Telegram समूह", libraryKicker:"PACMAN BUILDS", libraryTitle:"ROM लाइब्रेरी", librarySubtitle:"Nothing Phone (2a) के ROM रिलीज़ देखें।", searchLabel:"ROM खोजें", searchPlaceholder:"ROM खोजें…", libraryLoading:"ROM रिलीज़ लोड हो रहे हैं…", categoryAll:"सभी", romCount:"ROM", noRomsMatch:"आपकी खोज से कोई ROM नहीं मिला।", viewRom:"ROM देखें", tabAbout:"ROM जानकारी", tabDownload:"डाउनलोड", tabScreenshots:"स्क्रीनशॉट", swipeHint:"ROM बदलने के लिए ऊपर/नीचे स्वाइप करें · सेक्शन बदलने के लिए दाएँ/बाएँ स्वाइप करें" }
  };
  window.siteTranslations = translations;
  const saved = localStorage.getItem("pacman-site-language");
  const browserLanguage = (navigator.languages?.[0] || navigator.language || "en").toLowerCase();
  window.siteLanguage = saved || (browserLanguage.startsWith("hi") ? "hi" : "en");
  function applyLanguage(language) {
    window.siteLanguage = translations[language] ? language : "en";
    localStorage.setItem("pacman-site-language", window.siteLanguage);
    document.documentElement.lang = window.siteLanguage;
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const value = translations[window.siteLanguage][node.dataset.i18n];
      if (value) node.textContent = value;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      const value = translations[window.siteLanguage][node.dataset.i18nPlaceholder];
      if (value) node.placeholder = value;
    });
    window.dispatchEvent(new CustomEvent("site-language-change", { detail: { language: window.siteLanguage } }));
  }
  document.addEventListener("DOMContentLoaded", () => {
    const welcome = document.getElementById("welcome-screen");
    const select = document.getElementById("language-select");
    const go = document.getElementById("welcome-go");
    if (!welcome || !select || !go) return;
    select.value = window.siteLanguage;
    applyLanguage(window.siteLanguage);
    select.addEventListener("change", () => applyLanguage(select.value));
    welcome.classList.add("is-visible");
    welcome.setAttribute("aria-hidden", "false");
    document.body.classList.add("welcome-active");
    go.addEventListener("click", () => {
      welcome.classList.remove("is-visible");
      welcome.setAttribute("aria-hidden", "true");
      document.body.classList.remove("welcome-active");
      window.sessionStorage.setItem("pacman-welcome-seen", "1");
    });
  });
})();
