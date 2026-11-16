/* PACMAN ROM popup: bind immediately, open first, fetch catalog after click. */
(() => {
    const CATALOG_URL = "data/roms.json";
    const dialog = document.getElementById("rom-dialog");
    const list = document.getElementById("rom-list");
    const title = document.getElementById("rom-dialog-title");
    const subtitle = document.getElementById("rom-dialog-device");
    if (!dialog || !list || !title || !subtitle) return;

    const safeUrl = (value) => {
        try {
            const parsed = new URL(value, document.baseURI);
            return ["https:", "http:"].includes(parsed.protocol) ? parsed.href : "";
        } catch { return ""; }
    };
    const node = (tag, className, text) => {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;
        return element;
    };
    const showMessage = (text, className = "catalog-empty") => {
        list.replaceChildren(node("p", className, text));
    };
    const addScreenshots = (card, rom) => {
        const paths = Array.isArray(rom.screenshots) ? rom.screenshots : (rom.screenshot ? [rom.screenshot] : []);
        const valid = paths.map(safeUrl).filter(Boolean);
        if (!valid.length) {
            if (rom.screenshotFolder) {
                const hint = node("p", "screenshot-hint", `Screenshots folder: ${rom.screenshotFolder} — add image paths in data/roms.json.`);
                card.append(hint);
            }
            return;
        }
        const gallery = node("div", "catalog-screenshot-grid");
        valid.forEach((url, index) => {
            const image = node("img", "catalog-screenshot");
            image.src = url;
            image.alt = `${rom.name || "ROM"} screenshot ${index + 1}`;
            image.loading = "lazy";
            image.onerror = () => image.remove();
            gallery.append(image);
        });
        card.append(gallery);
    };
    const renderRom = (rom) => {
        const card = node("article", "catalog-rom-card");
        const details = node("div", "catalog-rom-details");
        details.append(node("h3", "", rom.name || "Custom ROM"));
        const tags = node("div", "catalog-tags");
        [rom.version, rom.android, rom.buildDate].filter(Boolean).forEach((value) => tags.append(node("span", "catalog-tag", value)));
        if (tags.childElementCount) details.append(tags);
        const specs = node("dl", "catalog-specs");
        [["OS", rom.os], ["Device", rom.device], ["Build", rom.build], ["Security patch", rom.securityPatch]].filter(([, value]) => value).forEach(([label, value]) => {
            specs.append(node("dt", "", label), node("dd", "", value));
        });
        if (specs.childElementCount) details.append(specs);
        if (rom.details) details.append(node("p", "", rom.details));
        if (rom.changelog) details.append(node("p", "catalog-changelog", `Changelog: ${rom.changelog}`));
        card.append(details);
        addScreenshots(card, rom);
        const downloads = node("div", "catalog-downloads");
        (Array.isArray(rom.downloads) ? rom.downloads : []).forEach((asset) => {
            const href = safeUrl(asset.url);
            if (!href) return;
            const link = node("a", "catalog-download-button", `Download ${asset.label || asset.part || "ROM"}${asset.size ? ` · ${asset.size}` : ""}`);
            link.href = href;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            downloads.append(link);
        });
        if (downloads.childElementCount) card.append(downloads);
        return card;
    };

    document.addEventListener("click", async (event) => {
        const button = event.target.closest(".device-rom-button[data-device='pacman']");
        if (!button) return;
        event.preventDefault();
        event.stopPropagation();
        title.textContent = "Nothing Phone (2a) ROMs";
        subtitle.textContent = "Codename: PACMAN · MediaTek Dimensity 7200 Pro";
        showMessage("Loading Pacman ROMs…", "loading-state");
        if (!dialog.open) dialog.showModal();
        button.disabled = true;
        try {
            const response = await fetch(`${CATALOG_URL}?v=${Date.now()}`, { cache: "no-store" });
            if (!response.ok) throw new Error(`Catalog unavailable (${response.status})`);
            const catalog = await response.json();
            const roms = catalog?.devices?.pacman?.roms;
            if (!Array.isArray(roms) || roms.length === 0) {
                showMessage("No Pacman ROMs have been added to the catalog yet.");
                return;
            }
            list.replaceChildren(...roms.map(renderRom));
        } catch (error) {
            showMessage("Could not load the ROM list. Refresh the page and try again.");
        } finally {
            button.disabled = false;
        }
    }, true);

    dialog.querySelector("[data-close-dialog='rom-dialog']")?.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
})();
