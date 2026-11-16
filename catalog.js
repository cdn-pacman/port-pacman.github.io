/* Pacman-only ROM popup. Opens immediately, then loads catalog and discovers screenshots in each ROM's folder. */
(() => {
    const CATALOG_URL = "data/roms.json";
    const GITHUB_CONTENTS = "https://api.github.com/repos/cdn-pacman/port-pacman.github.io/contents/";
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

    async function discoverScreenshots(rom) {
        const folder = String(rom.screenshotFolder || "").replace(/^\/+|\/+$/g, "");
        if (!folder) return Array.isArray(rom.screenshots) ? rom.screenshots.map(safeUrl).filter(Boolean) : [];

        try {
            const endpoint = `${GITHUB_CONTENTS}${folder.split("/").map(encodeURIComponent).join("/")}?ref=main`;
            const response = await fetch(endpoint, { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" });
            if (!response.ok) throw new Error("Screenshot folder listing unavailable");
            const files = await response.json();
            const discovered = Array.isArray(files)
                ? files.filter((file) => file.type === "file" && /\.(png|jpe?g|webp|gif|avif)$/i.test(file.name)).sort((a, b) => a.name.localeCompare(b.name)).map((file) => safeUrl(file.download_url)).filter(Boolean)
                : [];
            if (discovered.length) return discovered;
        } catch { /* Use explicitly listed screenshot URLs if API listing is unavailable. */ }

        return Array.isArray(rom.screenshots)
            ? rom.screenshots.map((path) => safeUrl(path.startsWith("http") ? path : `${folder}/${path}`)).filter(Boolean)
            : [];
    }

    async function renderRom(rom) {
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

        const screenshotUrls = await discoverScreenshots(rom);
        if (screenshotUrls.length) {
            const gallery = node("div", "catalog-screenshot-grid");
            screenshotUrls.forEach((url, index) => {
                const image = node("img", "catalog-screenshot");
                image.src = url;
                image.alt = `${rom.name || "ROM"} screenshot ${index + 1}`;
                image.loading = "lazy";
                image.onerror = () => image.remove();
                gallery.append(image);
            });
            card.append(gallery);
        } else {
            card.append(node("p", "screenshot-hint", `No screenshots uploaded yet. Add PNG/JPG/WebP images to ${rom.screenshotFolder || "the ROM screenshot folder"}.`));
        }

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
    }

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
            const cards = await Promise.all(roms.map(renderRom));
            list.replaceChildren(...cards);
        } catch (error) {
            showMessage("Could not load the ROM list. Check your connection and try again.");
        } finally {
            button.disabled = false;
        }
    }, true);

    dialog.querySelector("[data-close-dialog='rom-dialog']")?.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
})();
