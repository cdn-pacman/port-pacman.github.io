/* ROM library: searchable, category-filtered build cards placed below the Telegram action. */
(() => {
  const grid = document.getElementById("rom-library-grid");
  const search = document.getElementById("rom-search");
  const categories = document.getElementById("rom-categories");
  const count = document.getElementById("rom-count");
  if (!grid || !search || !categories || !count) return;
  let roms = [];
  let activeCategory = "All";
  const t = (key, fallback) => window.siteTranslations?.[window.siteLanguage]?.[key] || fallback;
  const make = (tag, className, text) => { const el = document.createElement(tag); if (className) el.className = className; if (text !== undefined) el.textContent = text; return el; };
  const categoryOf = (rom) => rom.category || (rom.name || "ROM").split(/[\s-]/)[0] || "Other";
  function renderCategories() {
    const names = ["All", ...new Set(roms.map(categoryOf))];
    categories.replaceChildren();
    names.forEach((name) => { const button = make("button", `category-chip${activeCategory === name ? " is-active" : ""}`, name === "All" ? t("categoryAll", "All") : name); button.type = "button"; button.setAttribute("aria-pressed", String(activeCategory === name)); button.addEventListener("click", () => { activeCategory = name; renderCategories(); renderCards(); }); categories.append(button); });
  }
  function renderCards() {
    const query = search.value.trim().toLowerCase();
    const matches = roms.map((rom, index) => ({ rom, index })).filter(({ rom }) => (activeCategory === "All" || categoryOf(rom) === activeCategory) && [rom.name, rom.version, rom.android, rom.device, rom.category, rom.details].filter(Boolean).join(" ").toLowerCase().includes(query));
    count.textContent = `${matches.length} ${t("romCount", "ROMs")}`;
    if (!matches.length) { grid.replaceChildren(make("p", "rom-library-empty", t("noRomsMatch", "No ROMs match your search."))); return; }
    const fragment = document.createDocumentFragment();
    matches.forEach(({ rom, index }) => {
      const card = make("article", "library-rom-card");
      const category = make("span", "library-rom-category", categoryOf(rom));
      const heading = make("h3", "library-rom-title", rom.name || "Custom ROM");
      const meta = make("p", "library-rom-meta", [rom.version, rom.android].filter(Boolean).join(" · "));
      const description = make("p", "library-rom-description", rom.details || "Custom ROM build for Nothing Phone (2a), codename PACMAN.");
      const button = make("button", "library-view-button", t("viewRom", "View ROM")); button.type = "button"; button.dataset.openRomIndex = String(index); button.setAttribute("aria-label", `${t("viewRom", "View ROM")}: ${rom.name || "Custom ROM"}`);
      card.append(category, heading, meta, description, button);
      fragment.append(card);
    });
    grid.replaceChildren(fragment);
  }
  async function init() {
    try { const response = await fetch("data/roms.json?v=1", { cache: "no-store" }); if (!response.ok) throw new Error("Catalog unavailable"); const data = await response.json(); roms = Array.isArray(data.devices?.pacman?.roms) ? data.devices.pacman.roms : []; activeCategory = "All"; renderCategories(); renderCards(); }
    catch { grid.replaceChildren(make("p", "rom-library-empty", "ROM releases are temporarily unavailable.")); count.textContent = "0 ROMs"; }
  }
  search.addEventListener("input", renderCards);
  window.addEventListener("site-language-change", () => { renderCategories(); renderCards(); });
  void init();
})();
