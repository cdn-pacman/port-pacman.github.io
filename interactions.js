// Subtle pointer-following glow and gentle 3D card tilt on mouse/trackpad.
(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  if (reducedMotion || !finePointer) return;

  let moveQueued = false;
  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight * 0.3;
  const updateGlow = () => {
    document.documentElement.style.setProperty("--pointer-x", `${pointerX}px`);
    document.documentElement.style.setProperty("--pointer-y", `${pointerY + window.scrollY}px`);
    moveQueued = false;
  };
  window.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!moveQueued) {
      moveQueued = true;
      window.requestAnimationFrame(updateGlow);
    }
  }, { passive: true });

  document.querySelectorAll(".device-card, .feature-image-link, .project-info-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse") return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 4;
      const rotateX = (0.5 - y) * 3;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
})();
