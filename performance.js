// Avoid the continuously redrawn, full-page particle canvas that can slow mobile browsers.
// The site's gradients and card highlights provide a lightweight ambient background instead.
(() => {
  const disableParticleCanvas = () => {
    const canvas = document.getElementById("rain-canvas");
    if (!canvas) return;
    canvas.style.display = "none";
    // script.js initializes the canvas on DOMContentLoaded; return null so it skips the animation loop.
    const originalGetContext = canvas.getContext.bind(canvas);
    canvas.getContext = (...args) => args[0] === "2d" ? null : originalGetContext(...args);
  };
  disableParticleCanvas();
  document.addEventListener("DOMContentLoaded", disableParticleCanvas, { once: true });
})();
