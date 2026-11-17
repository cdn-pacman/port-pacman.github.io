/* ROM library and compact ROM detail modal with category/search and touch gestures. */
(() => {
  const REPO = "cdn-pacman/port-pacman.github.io";
  const CATALOG = "data/roms.json";
  const dialog = document.getElementById("rom-dialog");
  const panel = document.getElementById("rom-panel");
  const title = document.getElementById("rom-dialog-title");
  const subtitle = document.getElementById("rom-dialog-device");
  const position = document.getElementById("rom-position");
  if (!dialog || !panel || !title || !subtitle) return;

  const tabs = [...dialog.querySelectorAll("[data-rom-tab]")];
  const tabNames = tabs.map((tab) => tab.dataset.romTab);
  const $ = (tag, cls, text) => { const node = document.createElement(tag); if (cls) node.className = cls; if (text !== undefined) node.textContent = text; return node; };
  const safeUrl = (value) => { try { const url = new URL(value, document.baseURI); return ["https:", "http:"].includes(url.protocol) ? url.href : ""; } catch { return ""; } };
  let roms = [];
  let currentIndex = 0;
  let currentTab = "about";
  let startX = 0, startY = 0;
  let screenshotUrls = [], screenshotIndex = 0;
  const viewer = document.getElementById("screenshot-viewer");
  const viewerImage = viewer?.querySelector(".viewer-image");
  const viewerCount = viewer?.querySelector(".viewer-count");

  function selectTab(name) {
    if (!tabNames.includes(name)) return;
    currentTab = name;
    tabs.forEach((tab) => { const active = tab.dataset.romTab === name; tab.classList.toggle("is-active", active); tab.setAttribute("aria-selected", String(active)); tab.tabIndex = active ? 0 : -1; });
    panel.setAttribute("aria-labelledby", tabs.find((tab) => tab.dataset.romTab === name).id);
    renderPanel();
  }
  function updateRom(index) {
    if (!roms.length) return;
    currentIndex = (index + roms.length) % roms.length;
    const rom = roms[currentIndex];
    title.textContent = rom.name || "Custom ROM";
    const maintainers = rom.maintainer || "CDN-Pacman";
    const testers = Array.isArray(rom.testers) ? rom.testers.join(", ") : rom.testers;
    subtitle.textContent = `${rom.version || rom.build || "ROM build"} · Maintainer: ${maintainers}${testers ? ` · Testers: ${testers}` : ""}`;
    if (position) position.textContent = `${currentIndex + 1} / ${roms.length}`;
    renderPanel();
  }
  function renderAbout(rom) {
    const content = $("div", "rom-about-content");
    content.append($("p", "rom-summary", rom.details || "Custom ROM for Nothing Phone (2a), codename PACMAN."));
    const specs = $("div", "rom-spec-grid");
    [["Android", rom.android], ["Device", rom.device || "Nothing Phone (2a) · PACMAN"], ["Build", rom.build || rom.version], ["Security patch", rom.securityPatch]].filter(([, value]) => value).forEach(([label, value]) => { const item = $("article", "rom-spec"); item.append($("span", "rom-spec-label", label), $("strong", "rom-spec-value", value)); specs.append(item); });
    if (specs.childElementCount) content.append(specs);
    return content;
  }
  async function getScreenshots(rom) {
    const folder = String(rom.screenshotFolder || "").replace(/^\/+|\/+$/g, "");
    if (folder) {
      try {
        const path = folder.split("/").map(encodeURIComponent).join("/");
        const response = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}?ref=main`, { headers: { Accept: "application/vnd.github+json" } });
        if (response.ok) { const files = await response.json(); const urls = files.filter((file) => file.type === "file" && /\.(png|jpe?g|webp|gif)$/i.test(file.name)).map((file) => safeUrl(file.download_url)).filter(Boolean); if (urls.length) return urls; }
      } catch { /* Fall back to catalog-provided screenshot URLs. */ }
    }
    return Array.isArray(rom.screenshots) ? rom.screenshots.map((path) => safeUrl(/^https?:\/\//i.test(path) ? path : `${folder}/${path}`)).filter(Boolean) : [];
  }
  function showViewerImage(index) {
    if (!screenshotUrls.length || !viewerImage) return;
    screenshotIndex = (index + screenshotUrls.length) % screenshotUrls.length;
    viewerImage.src = screenshotUrls[screenshotIndex];
    viewerImage.alt = `${roms[currentIndex]?.name || "ROM"} screenshot ${screenshotIndex + 1}`;
    if (viewerCount) viewerCount.textContent = `${screenshotIndex + 1} / ${screenshotUrls.length}`;
  }
  async function renderScreenshots(rom) {
    panel.replaceChildren($("p", "rom-loading", "Loading screenshots…"));
    const urls = await getScreenshots(rom);
    if (roms[currentIndex] !== rom || currentTab !== "screenshots") return;
    screenshotUrls = urls;
    if (!urls.length) { panel.replaceChildren($("div", "rom-empty-state", "Screenshots for this build haven’t been added yet.")); return; }
    const stage = $("div", "rom-screenshot-stage");
    const image = $("img", "rom-screenshot"); image.src = urls[0]; image.alt = `${rom.name || "ROM"} screenshot 1`; image.loading = "lazy";
    const open = () => { showViewerImage(0); if (!viewer.open) viewer.showModal(); };
    image.addEventListener("click", open);
    const button = $("button", "rom-open-screenshots", `Open screenshot viewer · ${urls.length}`); button.type = "button"; button.addEventListener("click", open);
    stage.append(image, button);
    if (urls.length > 1) stage.append($("p", "rom-gallery-note", "Swipe left/right in the viewer to browse screenshots."));
    panel.replaceChildren(stage);
  }
  function renderDownloads(rom) {
    const downloads = (Array.isArray(rom.downloads) ? rom.downloads : []).map((asset) => ({ asset, url: safeUrl(asset.url) })).filter(({ url }) => url);
    if (!downloads.length) { panel.replaceChildren($("div", "rom-empty-state", "Download link for this build will be added soon.")); return; }
    const list = $("div", "rom-download-list");
    downloads.forEach(({ asset, url }) => { const link = $("a", "rom-download-action", `↓  Download ${asset.label || asset.part || "ROM"}${asset.size ? ` · ${asset.size}` : ""}`); link.href = url; link.target = "_blank"; link.rel = "noopener noreferrer"; list.append(link); });
    panel.replaceChildren(list);
  }
  function renderPanel() { const rom = roms[currentIndex]; if (!rom) return; if (currentTab === "about") panel.replaceChildren(renderAbout(rom)); else if (currentTab === "screenshots") void renderScreenshots(rom); else renderDownloads(rom); }
  async function loadCatalog(selectedIndex = 0) {
    panel.replaceChildren($("p", "rom-loading", "Loading ROM information…"));
    try { const response = await fetch(`${CATALOG}?v=1`, { cache: "no-store" }); if (!response.ok) throw new Error("Catalog unavailable"); const data = await response.json(); roms = Array.isArray(data.devices?.pacman?.roms) ? data.devices.pacman.roms : []; if (!roms.length) throw new Error("No ROMs published"); currentIndex = Math.min(Math.max(0, selectedIndex), roms.length - 1); updateRom(currentIndex); selectTab("about"); }
    catch { panel.replaceChildren($("div", "rom-empty-state", "ROM information is temporarily unavailable. Please try again later.")); }
  }
  function openRom(index = 0) { if (!dialog.open) dialog.showModal(); void loadCatalog(index); }
  document.addEventListener("click", (event) => { const button = event.target.closest(".device-rom-button[data-device='pacman'], [data-open-rom-index]"); if (!button) return; event.preventDefault(); event.stopPropagation(); openRom(Number(button.dataset.romIndex || button.dataset.openRomIndex || 0)); });
  tabs.forEach((tab) => tab.addEventListener("click", () => selectTab(tab.dataset.romTab)));
  document.getElementById("rom-prev")?.addEventListener("click", () => updateRom(currentIndex - 1));
  document.getElementById("rom-next")?.addEventListener("click", () => updateRom(currentIndex + 1));
  dialog.querySelector("[data-close-dialog='rom-dialog']")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("touchstart", (event) => { if (!event.changedTouches.length) return; startX = event.changedTouches[0].clientX; startY = event.changedTouches[0].clientY; }, { passive: true });
  dialog.addEventListener("touchend", (event) => {
    if (!event.changedTouches.length || event.target.closest("button,a,img,.rom-panel")) return;
    const dx = event.changedTouches[0].clientX - startX, dy = event.changedTouches[0].clientY - startY;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 55) return;
    if (Math.abs(dy) > Math.abs(dx)) { if (roms.length > 1) updateRom(currentIndex + (dy < 0 ? 1 : -1)); }
    else { const i = tabNames.indexOf(currentTab); selectTab(tabNames[(i + (dx < 0 ? 1 : -1) + tabNames.length) % tabNames.length]); }
  }, { passive: true });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") { if (roms.length > 1) { event.preventDefault(); updateRom(currentIndex + (event.key === "ArrowDown" ? 1 : -1)); } }
    else if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); const i = tabNames.indexOf(currentTab); selectTab(tabNames[(i + (event.key === "ArrowRight" ? 1 : -1) + tabNames.length) % tabNames.length]); }
  });
  if (viewer) {
    let viewerStartX = 0;
    viewer.querySelector(".viewer-close")?.addEventListener("click", () => viewer.close());
    viewer.querySelector(".viewer-prev")?.addEventListener("click", () => showViewerImage(screenshotIndex - 1));
    viewer.querySelector(".viewer-next")?.addEventListener("click", () => showViewerImage(screenshotIndex + 1));
    viewer.addEventListener("touchstart", (event) => { viewerStartX = event.changedTouches[0]?.clientX || 0; }, { passive: true });
    viewer.addEventListener("touchend", (event) => { const dx = (event.changedTouches[0]?.clientX || viewerStartX) - viewerStartX; if (Math.abs(dx) > 45) showViewerImage(screenshotIndex + (dx < 0 ? 1 : -1)); }, { passive: true });
    viewer.addEventListener("click", (event) => { if (event.target === viewer) viewer.close(); });
    viewer.addEventListener("keydown", (event) => { if (event.key === "ArrowLeft") showViewerImage(screenshotIndex - 1); if (event.key === "ArrowRight") showViewerImage(screenshotIndex + 1); });
  }
  window.addEventListener("site-language-change", () => { if (dialog.open && roms.length) { tabs.forEach((tab) => { const key = `tab${tab.dataset.romTab[0].toUpperCase()}${tab.dataset.romTab.slice(1)}`; if (window.siteTranslations?.[window.siteLanguage]?.[key]) tab.textContent = window.siteTranslations[window.siteLanguage][key]; }); } });
})();
