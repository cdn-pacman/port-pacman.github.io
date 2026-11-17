// Lightweight desktop pointer response plus performance guard for slow devices.
(() => {
  // Prevent the decorative full-page particle canvas from running an endless animation loop.
  const canvasPrototype = HTMLCanvasElement.prototype;
  const nativeGetContext = canvasPrototype.getContext;
  canvasPrototype.getContext = function (type, ...args) {
    if (this.id === "rain-canvas" && type === "2d") return null;
    return nativeGetContext.call(this, type, ...args);
  };

  // Load performance overrides dynamically so no index.html edits are required.
  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = "performance.css?v=lag-fix-2";
  document.head.append(stylesheet);

  // Refresh the featured artwork URL so browsers don't keep the old 4.0.0.10 image cached.
  document.addEventListener("DOMContentLoaded", () => {
    const image = document.querySelector(".feature-image");
    if (image) image.src = `assets/hyperos-pacman-card.svg?v=lag-fix-2`;
  }, { once: true });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  if (reducedMotion || !finePointer) return;

  let queued = false;
  let x = window.innerWidth / 2;
  let y = window.innerHeight * 0.3;
  window.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || queued) return;
    x = event.clientX;
    y = event.clientY + window.scrollY;
    queued = true;
    requestAnimationFrame(() => {
      document.documentElement.style.setProperty("--pointer-x", `${x}px`);
      document.documentElement.style.setProperty("--pointer-y", `${y}px`);
      queued = false;
    });
  }, { passive: true });
})();
