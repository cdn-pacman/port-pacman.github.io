/* Independent popup wiring: keeps header dialogs working even if unrelated page scripts fail. */
(() => {
  const openDialog = (dialog) => {
    if (!dialog || dialog.open || typeof dialog.showModal !== "function") return;
    try { dialog.showModal(); } catch { dialog.setAttribute("open", ""); }
  };
  const closeDialog = (dialog) => {
    if (!dialog) return;
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
    else dialog.removeAttribute("open");
  };

  document.addEventListener("DOMContentLoaded", () => {
    // The welcome screen is shown once per tab. Avoid leaving its overlay over the UI on later visits.
    const welcome = document.getElementById("welcome-screen");
    try {
      if (welcome && sessionStorage.getItem("pacman-welcome-seen") === "1") {
        welcome.classList.remove("is-visible");
        welcome.setAttribute("aria-hidden", "true");
        document.body.classList.remove("welcome-active");
      }
    } catch { /* Continue if browser storage is disabled. */ }

    const telegramDialog = document.getElementById("telegram-dialog");
    const telegramOpeners = [document.getElementById("open-telegram"), document.getElementById("hero-telegram")].filter(Boolean);
    telegramOpeners.forEach((button) => {
      if (button.dataset.popupWired) return;
      button.dataset.popupWired = "true";
      button.addEventListener("click", (event) => { event.preventDefault(); openDialog(telegramDialog); });
    });
    document.getElementById("close-telegram")?.addEventListener("click", () => closeDialog(telegramDialog));
    telegramDialog?.addEventListener("click", (event) => { if (event.target === telegramDialog) closeDialog(telegramDialog); });

    const releaseDialog = document.getElementById("release-dialog");
    const releaseList = document.getElementById("release-list");
    const badge = document.getElementById("notification-count");
    const notificationButton = document.getElementById("open-notifications");
    if (notificationButton && !notificationButton.dataset.popupWired) {
      notificationButton.dataset.popupWired = "true";
      notificationButton.addEventListener("click", async () => {
        openDialog(releaseDialog);
        if (!releaseList || releaseList.dataset.loaded === "true") return;
        releaseList.dataset.loaded = "true";
        releaseList.replaceChildren();
        const status = document.createElement("p");
        status.className = "catalog-empty";
        status.textContent = "Loading releases…";
        releaseList.append(status);
        try {
          const response = await fetch("https://api.github.com/repos/cdn-pacman/port-pacman.github.io/releases?per_page=10", {
            headers: { Accept: "application/vnd.github+json" }, cache: "no-store"
          });
          if (!response.ok) throw new Error(`Request failed (${response.status})`);
          const releases = (await response.json()).filter((release) => !release.draft);
          releaseList.replaceChildren();
          if (!releases.length) {
            const empty = document.createElement("p");
            empty.className = "catalog-empty";
            empty.textContent = "No published releases yet.";
            releaseList.append(empty);
          } else {
            releases.forEach((release) => {
              const link = document.createElement("a");
              link.className = "release-notice";
              link.href = release.html_url;
              link.target = "_blank";
              link.rel = "noopener noreferrer";
              const heading = document.createElement("strong");
              heading.textContent = release.name || release.tag_name || "GitHub release";
              const date = document.createElement("time");
              const parsedDate = new Date(release.published_at || release.created_at);
              date.textContent = Number.isNaN(parsedDate.getTime()) ? "" : parsedDate.toLocaleDateString();
              const description = document.createElement("span");
              description.textContent = release.body?.trim().split("\n")[0].slice(0, 150) || "Open release details and download assets";
              link.append(heading, date, description);
              releaseList.append(link);
            });
          }
        } catch {
          releaseList.dataset.loaded = "false";
          releaseList.replaceChildren();
          const error = document.createElement("p");
          error.className = "catalog-empty";
          error.textContent = "Could not load releases right now. Please try again.";
          releaseList.append(error);
        }
        if (badge) badge.hidden = true;
      });
    }

    document.querySelectorAll("[data-close-dialog]").forEach((button) => {
      if (button.dataset.popupCloseWired) return;
      button.dataset.popupCloseWired = "true";
      button.addEventListener("click", () => closeDialog(document.getElementById(button.dataset.closeDialog)));
    });
    [releaseDialog, telegramDialog].filter(Boolean).forEach((dialog) => {
      dialog.addEventListener("click", (event) => { if (event.target === dialog) closeDialog(dialog); });
    });
  });
})();
