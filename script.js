const TELEGRAM_RELEASES = "https://t.me/pacman_ports";
const TELEGRAM_SUPPORT = "https://t.me/nikki_chats";
const ROM_CATALOG_URL = "data/roms.json";
const RELEASES_API = "https://api.github.com/repos/cdn-pacman/port-pacman.github.io/releases?per_page=10";
const SEEN_RELEASE_KEY = "cdn-pacman-seen-release";

const assistantReply = (question) => {
    const text = question.toLowerCase();
    if (/(chip|cpu|processor|mediatek|mtk|7200)/.test(text)) return "The development target is the MediaTek Dimensity 7200 Pro platform.";
    if (/(release|rom|download|build|update)/.test(text)) return `Release announcements and download information are posted in the CDN-Pacman release group: ${TELEGRAM_RELEASES}`;
    if (/(support|help|contact|maintainer|question)/.test(text)) return `For help, contact the maintainer and community in the support group: ${TELEGRAM_SUPPORT}`;
    if (/(device|phone|2a|pacman|pro)/.test(text)) return "This project focuses on Nothing Phone (2a) and Nothing Phone (2a) Plus. Check the ROM catalog for current device-specific builds.";
    if (/(hello|hi|hey|namaste)/.test(text)) return "Hello! Ask me about supported devices, the chipset, releases, or project support.";
    return `I can answer basic questions about devices and the chipset. For the latest project details, visit the release group: ${TELEGRAM_RELEASES}`;
};

function addMessage(text, kind) {
    const messages = document.getElementById("chat-messages");
    const item = document.createElement("div");
    item.className = `message ${kind}-message`;
    const bubble = document.createElement("p");
    bubble.textContent = text;
    if (kind === "assistant") {
        const avatar = document.createElement("span");
        avatar.className = "message-avatar";
        avatar.textContent = "CP";
        item.append(avatar, bubble);
    } else item.append(bubble);
    messages.append(item);
    messages.scrollTop = messages.scrollHeight;
}

function initChat() {
    const form = document.getElementById("chat-form");
    const input = document.getElementById("chat-input");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const question = input.value.trim();
        if (!question) return;
        addMessage(question, "user");
        input.value = "";
        window.setTimeout(() => addMessage(assistantReply(question), "assistant"), 350);
    });
    document.querySelectorAll(".quick-questions button").forEach((button) => button.addEventListener("click", () => {
        const question = button.dataset.question;
        addMessage(question, "user");
        window.setTimeout(() => addMessage(assistantReply(question), "assistant"), 250);
    }));
}

function initTelegramDashboard() {
    const dialog = document.getElementById("telegram-dialog");
    const open = () => { if (!dialog.open) dialog.showModal(); };
    document.getElementById("open-telegram").addEventListener("click", open);
    document.getElementById("hero-telegram").addEventListener("click", open);
    document.getElementById("close-telegram").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
}

function safeExternalUrl(value) {
    try {
        const url = new URL(value, window.location.href);
        return ["https:", "http:"].includes(url.protocol) ? url.href : "";
    } catch { return ""; }
}

function openDialog(dialog) {
    if (dialog && !dialog.open) dialog.showModal();
}

async function initRomCatalog() {
    const dialog = document.getElementById("rom-dialog");
    const title = document.getElementById("rom-dialog-title");
    const deviceLabel = document.getElementById("rom-dialog-device");
    const list = document.getElementById("rom-list");
    let catalog;
    try {
        const response = await fetch(`${ROM_CATALOG_URL}?v=1`, { cache: "no-store" });
        if (!response.ok) throw new Error(`Catalog request failed (${response.status})`);
        catalog = await response.json();
    } catch {
        catalog = null;
    }

    document.querySelectorAll(".device-rom-button").forEach((button) => {
        button.addEventListener("click", () => {
            const device = catalog?.devices?.[button.dataset.device];
            title.textContent = device?.name || (button.dataset.device === "pacman-plus" ? "Nothing Phone (2a) Plus" : "Nothing Phone (2a)");
            deviceLabel.textContent = device?.codename ? `Codename: ${device.codename}` : "ROM builds and download links";
            list.replaceChildren();
            if (!device) {
                const message = document.createElement("p");
                message.className = "catalog-empty";
                message.textContent = "ROM catalog is temporarily unavailable. Please try again later.";
                list.append(message);
            } else if (!Array.isArray(device.roms) || device.roms.length === 0) {
                const message = document.createElement("p");
                message.className = "catalog-empty";
                message.textContent = "No ROMs added for this device yet. Builds will appear here when the catalog is updated.";
                list.append(message);
            } else {
                device.roms.forEach((rom) => {
                    const card = document.createElement("article");
                    card.className = "catalog-rom-card";
                    if (rom.screenshot) {
                        const imageUrl = safeExternalUrl(rom.screenshot);
                        if (imageUrl) {
                            const image = document.createElement("img");
                            image.src = imageUrl;
                            image.alt = `${rom.name || "ROM"} screenshot`;
                            image.loading = "lazy";
                            image.className = "catalog-screenshot";
                            card.append(image);
                        }
                    }
                    const details = document.createElement("div");
                    details.className = "catalog-rom-details";
                    const heading = document.createElement("h3");
                    heading.textContent = rom.name || "Custom ROM";
                    details.append(heading);
                    [rom.android, rom.version, rom.buildDate].filter(Boolean).forEach((value) => {
                        const detail = document.createElement("span");
                        detail.className = "catalog-tag";
                        detail.textContent = value;
                        details.append(detail);
                    });
                    if (rom.details) {
                        const description = document.createElement("p");
                        description.textContent = rom.details;
                        details.append(description);
                    }
                    if (rom.changelog) {
                        const changelog = document.createElement("p");
                        changelog.className = "catalog-changelog";
                        changelog.textContent = `Changelog: ${rom.changelog}`;
                        details.append(changelog);
                    }
                    const downloads = document.createElement("div");
                    downloads.className = "catalog-downloads";
                    (Array.isArray(rom.downloads) ? rom.downloads : []).forEach((asset) => {
                        const href = safeExternalUrl(asset.url);
                        if (!href) return;
                        const link = document.createElement("a");
                        link.href = href;
                        link.target = "_blank";
                        link.rel = "noopener noreferrer";
                        link.className = "catalog-download-button";
                        link.textContent = `Download ${asset.label || asset.part || "file"}${asset.size ? ` · ${asset.size}` : ""}`;
                        downloads.append(link);
                    });
                    if (downloads.childElementCount) details.append(downloads);
                    else {
                        const note = document.createElement("p");
                        note.className = "catalog-changelog";
                        note.textContent = "Download link will be added soon.";
                        details.append(note);
                    }
                    card.append(details);
                    list.append(card);
                });
            }
            openDialog(dialog);
        });
    });
}

function initReleaseNotifications() {
    const dialog = document.getElementById("release-dialog");
    const list = document.getElementById("release-list");
    const badge = document.getElementById("notification-count");
    let loaded = false;

    const dateText = (date) => {
        const parsed = new Date(date);
        return Number.isNaN(parsed.getTime()) ? "" : parsed.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    };

    const loadReleases = async () => {
        if (loaded) return;
        loaded = true;
        try {
            const response = await fetch(RELEASES_API, { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" });
            if (!response.ok) throw new Error(`GitHub API request failed (${response.status})`);
            const releases = (await response.json()).filter((release) => !release.draft);
            list.replaceChildren();
            if (!releases.length) {
                const empty = document.createElement("p");
                empty.className = "catalog-empty";
                empty.textContent = "No published GitHub releases yet.";
                list.append(empty);
                badge.hidden = true;
                return;
            }
            const newest = releases[0];
            const seen = localStorage.getItem(SEEN_RELEASE_KEY);
            if (newest.id && String(newest.id) !== seen) {
                badge.hidden = false;
                badge.textContent = "!";
                badge.setAttribute("aria-label", "New release available");
            } else badge.hidden = true;

            releases.forEach((release) => {
                const link = document.createElement("a");
                link.className = "release-notice";
                link.href = safeExternalUrl(release.html_url);
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                const heading = document.createElement("strong");
                heading.textContent = release.name || release.tag_name || "GitHub release";
                const date = document.createElement("time");
                date.textContent = dateText(release.published_at || release.created_at);
                const description = document.createElement("span");
                description.textContent = release.body?.trim().split("\n")[0].slice(0, 150) || "Open release details and download assets";
                link.append(heading, date, description);
                list.append(link);
            });
        } catch {
            loaded = false;
            list.replaceChildren();
            const error = document.createElement("p");
            error.className = "catalog-empty";
            error.textContent = "Could not load releases right now. Check your connection and try again.";
            list.append(error);
        }
    };

    document.getElementById("open-notifications").addEventListener("click", async () => {
        openDialog(dialog);
        await loadReleases();
        const newestId = list.querySelector(".release-notice")?.href;
        if (newestId) {
            try {
                const response = await fetch(RELEASES_API, { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" });
                if (response.ok) {
                    const releases = (await response.json()).filter((release) => !release.draft);
                    if (releases[0]?.id) localStorage.setItem(SEEN_RELEASE_KEY, String(releases[0].id));
                }
            } catch { /* Leave notifications unread when the API is unavailable. */ }
        }
        badge.hidden = true;
    });
}

function initRain() {
    const canvas = document.getElementById("rain-canvas");
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0, height = 0, drops = [], frame = 0;
    const resize = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
        width = window.innerWidth;
        height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
        canvas.width = Math.floor(width * ratio);
        canvas.height = Math.floor(height * ratio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        drops = Array.from({ length: Math.min(150, Math.ceil(width / 9)) }, () => ({ x: Math.random()*width, y: Math.random()*height, radius: Math.random()*1.7+.6, speed: Math.random()*.75+.3, alpha: Math.random()*.45+.12, drift: (Math.random()-.5)*.18 }));
        if (reducedMotion) draw(false);
    };
    const draw = (animate = true) => {
        context.clearRect(0, 0, width, height);
        drops.forEach((drop) => {
            context.beginPath(); context.fillStyle = `rgba(255,255,255,${drop.alpha})`; context.arc(drop.x,drop.y,drop.radius,0,Math.PI*2); context.fill();
            if (animate) { drop.y += drop.speed; drop.x += drop.drift; if (drop.y > height+4) { drop.y=-4; drop.x=Math.random()*width; } }
        });
        if (animate) frame = requestAnimationFrame(() => draw(true));
    };
    resize();
    if (!reducedMotion) frame = requestAnimationFrame(() => draw(true));
    window.addEventListener("resize", () => { cancelAnimationFrame(frame); resize(); if (!reducedMotion) frame=requestAnimationFrame(() => draw(true)); }, { passive: true });
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(document.body);
}

document.addEventListener("DOMContentLoaded", () => {
    initChat();
    initTelegramDashboard();
    initRain();
    initRomCatalog();
    initReleaseNotifications();
    document.querySelectorAll("[data-close-dialog]").forEach((button) => button.addEventListener("click", () => document.getElementById(button.dataset.closeDialog)?.close()));
    document.querySelectorAll("dialog.site-dialog").forEach((dialog) => dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); }));
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") document.querySelectorAll("dialog[open]").forEach((dialog) => dialog.close()); });
});
