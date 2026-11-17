/* Accessible, compact ROM detail modal with three sections and touch navigation. */
(() => {
  const REPO = "cdn-pacman/port-pacman.github.io";
  const CATALOG = "data/roms.json";
  const dialog = document.getElementById("rom-dialog");
  const panel = document.getElementById("rom-panel");
  const title = document.getElementById("rom-dialog-title");
  const subtitle = document.getElementById("rom-dialog-device");
  if (!dialog || !panel || !title || !subtitle) return;

  const tabs = [...dialog.querySelectorAll("[data-rom-tab]")];
  const tabNames = tabs.map((tab) => tab.dataset.romTab);
  const safeUrl = (value) => {
    try { const url = new URL(value, document.baseURI); return ["https:", "http:"].includes(url.protocol) ? url.href : ""; }
    catch { return ""; }
  };
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  let roms = [];
  let currentIndex = 0;
  let currentTab = "about";
  let touchStartX = 0;
  let touchStartY = 0;

  function selectTab(name) {
    if (!tabNames.includes(name)) return;
    currentTab = name;
    tabs.forEach((tab) => {
      const active = tab.dataset.romTab === name;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    const activeTab = tabs.find((tab) => tab.dataset.romTab === name);
    panel.setAttribute("aria-labelledby", activeTab.id);
    renderPanel();
  }

  function showRom(index) {
    if (!roms.length) return;
    currentIndex = (index + roms.length) % roms.length;
    const rom = roms[currentIndex];
    title.textContent = rom.name || "Custom ROM";
    const buildLabel = rom.version || rom.build || "ROM build";
    const maintainers = rom.maintainer || "CDN-Pacman";
    const testers = Array.isArray(rom.testers) ? rom.testers.join(", ") : rom.testers;
    subtitle.textContent = `${buildLabel} · Maintainer: ${maintainers}${testers ? ` · Testers: ${testers}` : ""}`;
    renderPanel();
  }

  function renderAbout(rom) {
    const wrapper = el("div", "rom-about-content");
    const summary = el("p", "rom-summary", rom.details || "Custom ROM for Nothing Phone (2a), codename PACMAN.");
    wrapper.append(summary);
    const specs = el("div", "rom-spec-grid");
    [["Android", rom.android], ["Device", rom.device || "Nothing Phone (2a) · PACMAN"], ["Build", rom.build || rom.version], ["Security patch", rom.securityPatch]].filter(([, value]) => value).forEach(([label, value]) => {
      const item = el("article", "rom-spec");
      item.append(el("span", "rom-spec-label", label), el("strong", "rom-spec-value", value));
      specs.append(item);
    });
    if (specs.childElementCount) wrapper.append(specs);
    return wrapper;
  }

  async function getScreenshots(rom) {
    const folder = String(rom.screenshotFolder || "").replace(/^\/+|\/+$/g, "");
    if (folder) {
      try {
        const path = folder.split("/").map(encodeURIComponent).join("/");
        const response = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}?ref=main`, { headers: { Accept: "application/vnd.github+json" } });
        if (response.ok) {
          const files = await response.json();
          const urls = files.filter((file) => file.type === "file" && /\.(png|jpe?g|webp|gif)$/i.test(file.name)).map((file) => safeUrl(file.download_url)).filter(Boolean);
          if (urls.length) return urls;
        }
      } catch { /* Use any catalog-provided images as a fallback. */ }
    }
    return Array.isArray(rom.screenshots) ? rom.screenshots.map((path) => safeUrl(/^https?:\/\//i.test(path) ? path : `${folder}/${path}`)).filter(Boolean) : [];
  }

  async function renderScreenshots(rom) {
    panel.replaceChildren(el("p", "rom-loading", "Loading screenshots…"));
    const urls = await getScreenshots(rom);
    if (!roms.length || roms[currentIndex] !== rom || currentTab !== "screenshots") return;
    if (!urls.length) {
      panel.replaceChildren(el("div", "rom-empty-state", "Screenshots for this build haven’t been added yet."));
      return;
    }
    const grid = el("div", "rom-screenshot-grid");
    urls.forEach((url, index) => {
      const image = el("img", "rom-screenshot");
      image.src = url;
      image.alt = `${rom.name || "ROM"} screenshot ${index + 1}`;
      image.loading = "lazy";
      image.addEventListener("click", () => window.open(url, "_blank", "noopener,noreferrer"));
      grid.append(image);
    });
    panel.replaceChildren(grid);
  }

  function renderDownloads(rom) {
    const downloads = (Array.isArray(rom.downloads) ? rom.downloads : []).map((asset) => ({ asset, url: safeUrl(asset.url) })).filter(({ url }) => url);
    if (!downloads.length) {
      panel.replaceChildren(el("div", "rom-empty-state", "Download link for this build will be added soon."));
      return;
    }
    const list = el("div", "rom-download-list");
    downloads.forEach(({ asset, url }) => {
      const link = el("a", "rom-download-action", `↓  Download ${asset.label || asset.part || "ROM"}${asset.size ? ` · ${asset.size}` : ""}`);
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      list.append(link);
    });
    panel.replaceChildren(list);
  }

  function renderPanel() {
    const rom = roms[currentIndex];
    if (!rom) return;
    if (currentTab === "about") panel.replaceChildren(renderAbout(rom));
    else if (currentTab === "screenshots") void renderScreenshots(rom);
    else renderDownloads(rom);
  }

  async function loadCatalog() {
    panel.replaceChildren(el("p", "rom-loading", "Loading ROM information…"));
    try {
      const response = await fetch(`${CATALOG}?v=1`, { cache: "no-store" });
      if (!response.ok) throw new Error("Catalog unavailable");
      const data = await response.json();
      roms = Array.isArray(data.devices?.pacman?.roms) ? data.devices.pacman.roms : [];
      if (!roms.length) throw new Error("No ROMs published");
      showRom(0);
      selectTab("about");
    } catch {
      panel.replaceChildren(el("div", "rom-empty-state", "ROM information is temporarily unavailable. Please try again later."));
    }
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".device-rom-button[data-device='pacman']");
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    if (!dialog.open) dialog.showModal();
    void loadCatalog();
  });
  tabs.forEach((tab) => tab.addEventListener("click", () => selectTab(tab.dataset.romTab)));
  dialog.querySelector("[data-close-dialog='rom-dialog']")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("touchstart", (event) => {
    if (!event.changedTouches.length) return;
    touchStartX = event.changedTouches[0].clientX;
    touchStartY = event.changedTouches[0].clientY;
  }, { passive: true });
  dialog.addEventListener("touchend", (event) => {
    if (!event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchStartX;
    const dy = event.changedTouches[0].clientY - touchStartY;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 55) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (roms.length > 1) showRom(currentIndex + (dx < 0 ? 1 : -1));
    } else {
      const tabIndex = tabNames.indexOf(currentTab);
      const direction = dy < 0 ? 1 : -1;
      selectTab(tabNames[(tabIndex + direction + tabNames.length) % tabNames.length]);
    }
  }, { passive: true });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      const index = tabNames.indexOf(currentTab);
      selectTab(tabNames[(index + (event.key === "ArrowDown" ? 1 : -1) + tabNames.length) % tabNames.length]);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      if (roms.length > 1) showRom(currentIndex + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
})();
