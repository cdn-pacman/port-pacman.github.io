const TELEGRAM_RELEASES = "https://t.me/pacman_ports";
const TELEGRAM_SUPPORT = "https://t.me/nikki_chats";

const assistantReply = (question) => {
    const text = question.toLowerCase();
    if (/(device|phone|support|2a|pacman|pro)/.test(text)) {
        return "This project focuses on Nothing Phone (2a) and Nothing Phone (2a) Pro (Pacman family). Check the release group for current model-specific compatibility details.";
    }
    if (/(chip|cpu|processor|mediatek|mtk|7200)/.test(text)) {
        return "The development target is the MediaTek Dimensity 7200 Pro platform.";
    }
    if (/(release|rom|download|build|update)/.test(text)) {
        return `Release announcements and download information are posted in the CDN-Pacman release group: ${TELEGRAM_RELEASES}`;
    }
    if (/(support|help|contact|maintainer|question)/.test(text)) {
        return `For help, contact the maintainer and community in the support group: ${TELEGRAM_SUPPORT}`;
    }
    if (/(hello|hi|hey|namaste)/.test(text)) {
        return "Hello! Ask me about supported devices, the chipset, releases, or project support.";
    }
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
    } else {
        item.append(bubble);
    }
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
    document.querySelectorAll(".quick-questions button").forEach((button) => {
        button.addEventListener("click", () => {
            const question = button.dataset.question;
            addMessage(question, "user");
            window.setTimeout(() => addMessage(assistantReply(question), "assistant"), 250);
        });
    });
}

function initTelegramDashboard() {
    const dialog = document.getElementById("telegram-dialog");
    const open = () => { if (!dialog.open) dialog.showModal(); };
    document.getElementById("open-telegram").addEventListener("click", open);
    document.getElementById("hero-telegram").addEventListener("click", open);
    document.getElementById("close-telegram").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
}

function initRain() {
    const canvas = document.getElementById("rain-canvas");
    const context = canvas.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let drops = [];
    let frame = 0;

    const resize = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
        width = window.innerWidth;
        height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
        canvas.width = Math.floor(width * ratio);
        canvas.height = Math.floor(height * ratio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        const count = Math.min(150, Math.ceil(width / 9));
        drops = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.7 + 0.6,
            speed: Math.random() * 0.75 + 0.3,
            alpha: Math.random() * 0.45 + 0.12,
            drift: (Math.random() - 0.5) * 0.18,
        }));
        if (reducedMotion) draw(false);
    };

    const draw = (animate = true) => {
        context.clearRect(0, 0, width, height);
        for (const drop of drops) {
            context.beginPath();
            context.fillStyle = `rgba(255,255,255,${drop.alpha})`;
            context.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
            context.fill();
            if (animate) {
                drop.y += drop.speed;
                drop.x += drop.drift;
                if (drop.y > height + 4) { drop.y = -4; drop.x = Math.random() * width; }
                if (drop.x < -4) drop.x = width + 4;
                if (drop.x > width + 4) drop.x = -4;
            }
        }
        if (animate) frame = window.requestAnimationFrame(() => draw(true));
    };

    resize();
    if (!reducedMotion) frame = window.requestAnimationFrame(() => draw(true));
    window.addEventListener("resize", () => {
        window.cancelAnimationFrame(frame);
        resize();
        if (!reducedMotion) frame = window.requestAnimationFrame(() => draw(true));
    }, { passive: true });
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(document.body);
}

document.addEventListener("DOMContentLoaded", () => {
    initChat();
    initTelegramDashboard();
    initRain();
});
