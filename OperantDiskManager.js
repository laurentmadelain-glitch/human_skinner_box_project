// OperantDiskManager.js — V2 (délègue la décision au schedule via callback)
const OperantDiskManager = (() => {
  let lastIndex = null;      // index 0..11 de la position choisie
  let clickCount = 0;
  let trialStartTime = null;
  let isPaused = false;
  let currentKeyId = null;
  let onOperantResponse = null; // callback injectée par SessionManager

  const color = { r: 255, g: 80, b: 80 };

  const setOnOperantResponse = (fn) => { onOperantResponse = fn; };

  // Convertit l'index (0..11) en position cadran (1..12)
  // i=0 -> 3h, i=3 -> 6h, i=6 -> 9h, i=9 -> 12h
  function hourFromIndex(i) {
    const v = (i + 3) % 12;   // 0..11
    return v === 0 ? 12 : v;  // 1..12
  }

  const placeDisk = (keyId) => {
    if (isPaused) return;
    currentKeyId = keyId;

    const wrapper = document.getElementById(`response-key-${keyId}`);
    const positions = ResponseKeyManager.getPositions(keyId);
    if (!wrapper || positions.length === 0) return;

    const oldDisk = wrapper.querySelector('.circle[style*="z-index: 3"]');
    if (oldDisk) wrapper.removeChild(oldDisk);

    let index;
    do {
      index = Math.floor(Math.random() * positions.length);
    } while (index === lastIndex);
    lastIndex = index;

    const pos = positions[index];
    const disk = document.createElement("div");
    disk.className = "circle";
    disk.style.left = `${pos.x}px`;
    disk.style.top = `${pos.y}px`;
    disk.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
    disk.style.border = "2px solid #5e5e5e";
    disk.style.zIndex = 3;

    disk.addEventListener("click", (e) => {
      if (isPaused) return;

      clickCount++;
      const t0 = (typeof performance !== 'undefined' ? performance.now() : Date.now());
      const rt = Math.round(t0 - trialStartTime);           // ⏱️ ms entiers
      const targetLoc = hourFromIndex(lastIndex);           // 🕒 1..12

      onOperantResponse?.({
        key_id: currentKeyId,
        target_location: targetLoc,                         // <-- renommé
        clientX: e.clientX, clientY: e.clientY,
        rt, click_number: clickCount,
      });

      StatusDisplay.incrementClicks();

      if (!isPaused) {
        placeDisk(keyId);
      } else {
        const old = wrapper.querySelector('.circle[style*="z-index: 3"]');
        if (old) wrapper.removeChild(old);
      }
    });

    wrapper.appendChild(disk);
  };

  const resume = (keyId) => {
    pause(); // Nettoie avant d’afficher un nouveau disque
    isPaused = false;
    clickCount = 0;
    const t = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    trialStartTime = Math.round(t); // ⏱️ ms entiers
    placeDisk(keyId);
  };

  const pause = () => {
    isPaused = true;

    // Supprime tous les disques opérants présents (si un bloc change)
    document.querySelectorAll('.circle[style*="z-index: 3"]').forEach(el => el.remove());
  };


  return {
    setOnOperantResponse,
    placeDisk,
    resume,
    pause,
  };
})();
