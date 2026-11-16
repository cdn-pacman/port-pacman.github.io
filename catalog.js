/* Pacman-only ROM popup. Opens immediately; reads catalog and auto-discovers screenshot files in the selected version folder. */
(() => {
  const REPO = "cdn-pacman/port-pacman.github.io";
  const CATALOG = "data/roms.json";
  const dialog = document.getElementById("rom-dialog");
  const list = document.getElementById("rom-list");
  const title = document.getElementById("rom-dialog-title");
  const subtitle = document.getElementById("rom-dialog-device");
  if (!dialog || !list || !title || !subtitle) return;

  const make = (tag, cls, text) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text !== undefined) el.textContent = text;
    return el;
  };
  const showDialog = () => {
    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
      dialog.classList.add("dialog-fallback-open");
    }
  };
  const safeUrl = (value) => {
    try {
      const url = new URL(value, document.baseURI);
      return ["https:", "http:"].includes(url.protocol) ? url.href : "";
    } catch { return ""; }
  };
  const message = (text, cls = "catalog-empty") => list.replaceChildren(make("p", cls, text));

  async function screenshotsFor(rom) {
    const folder = String(rom.screenshotFolder || "").replace(/^\/+|\/+$/g, "");
    if (!folder) return Array.isArray(rom.screenshots) ? rom.screenshots.map(safeUrl).filter(Boolean) : [];
    try {
      const path = folder.split("/").map(encodeURIComponent).join("/");
      const response = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}?ref=main`, { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" });
      if (!response.ok) throw new Error("Folder listing unavailable");
      const files = await response.json();
      const found = Array.isArray(files) ? files.filter((file) => file.type === "file" && /\.(png|jpe?g|webp|gif|avif)$/i.test(file.name)).sort((a,b) => a.name.localeCompare(b.name)).map((file) => safeUrl(file.download_url)).filter(Boolean) : [];
      if (found.length) return found;
    } catch { /* use explicitly listed images below */ }
    return Array.isArray(rom.screenshots) ? rom.screenshots.map((path) => safeUrl(/^https?:\/\//i.test(path) ? path : `${folder}/${path}`)).filter(Boolean) : [];
  }

  async function renderRom(rom) {
    const card = make("article", "catalog-rom-card");
    const details = make("div", "catalog-rom-details");
    details.append(make("h3", "", rom.name || "Custom ROM"));
    const tags = make("div", "catalog-tags");
    [rom.version, rom.android].filter(Boolean).forEach((value) => tags.append(make("span", "catalog-tag", value)));
    if (tags.childElementCount) details.append(tags);
    const specs = make("dl", "catalog-specs");
    [["OS", rom.os], ["Device", rom.device], ["Build", rom.build], ["Security patch", rom.securityPatch]].filter(([, value]) => value).forEach(([label, value]) => specs.append(make("dt", "", label), make("dd", "", value)));
    if (specs.childElementCount) details.append(specs);
    if (rom.details) details.append(make("p", "", rom.details));
    card.append(details);

    const images = await screenshotsFor(rom);
    if (images.length) {
      const gallery = make("div", "catalog-screenshot-grid");
      images.forEach((url, i) => {
        const img = make("img", "catalog-screenshot");
        img.src = url;
        img.alt = `${rom.name || "ROM"} screenshot ${i + 1}`;
        img.loading = "lazy";
        img.onerror = () => img.remove();
        gallery.append(img);
      });
      card.append(gallery);
    } else card.append(make("p", "screenshot-hint", `No screenshots yet. Upload PNG/JPG/WebP images to ${rom.screenshotFolder || "this ROM's screenshot folder"}.`));

    const downloads = make("div", "catalog-downloads");
    (Array.isArray(rom.downloads) ? rom.downloads : []).forEach((asset) => {
      const href = safeUrl(asset.url);
      if (!href) return;
      const link = make("a", "catalog-download-button", `Download ${asset.label || asset.part || "ROM"}${asset.size ? ` · ${asset.size}` : ""}`);
      link.href = href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      downloads.append(link);
    });
    if (downloads.childElementCount) card.append(downloads);
    return card;
  }

  document.addEventListener("click", async (event) => {
    const button = event.target.closest(".device-rom-button[data-device='pacman']");
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    title.textContent = "Nothing Phone (2a) ROMs";
    subtitle.textContent = "Codename: PACMAN · MediaTek Dimensity 7200 Pro";
    message("Loading Pacman ROMs…", "loading-state");
    showDialog();
    button.disabled = true;
    try {
      const response = await fetch(`${CATALOG}?v=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`Catalog unavailable (${response.status})`);
      const catalog = await response.json();
      const roms = catalog?.devices?.pacman?.roms;
      if (!Array.isArray(roms) || !roms.length) return message("No ROMs have been added to the Pacman catalog yet.");
      list.replaceChildren(...await Promise.all(roms.map(renderRom)));
    } catch {
      message("ROM catalog load nahi hua. Internet check karke dobara try karein.");
    } finally { button.disabled = false; }
  }, true);

  dialog.querySelector("[data-close-dialog='rom-dialog']")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
})();
