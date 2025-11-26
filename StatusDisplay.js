const StatusDisplay = (() => {
  let clicks = 0;
  let points = 0;
  let collectCallback = null;

  let clicksEl = null;
  let elapsedEl = null;      // ✅ nouvel élément pour l'elapsed
  let pointsEl = null;
  let buttonEl = null;

  let trialStartTime = null; // ✅ chrono début d’essai

  const create = (container) => {
    // 🧱 Création du bloc principal
    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.bottom = '30px';
    wrapper.style.left = '50%';
    wrapper.style.transform = 'translateX(-50%)';
    wrapper.style.textAlign = 'center';

    // 🔢 Affichage du nombre de clics (debug, déplacé en haut à gauche)
    clicksEl = document.createElement('div');
    clicksEl.textContent = 'Clicks: 0';
    clicksEl.style.position = 'absolute';
    clicksEl.style.top = '10px';
    clicksEl.style.left = '10px';
    clicksEl.style.fontSize = '14px';
    clicksEl.style.color = '#888';
    clicksEl.style.color = '#f0f0f0';
    clicksEl.style.background = 'rgba(255,255,255,0.7)';
    clicksEl.style.background = '#f0f0f0';
    clicksEl.style.padding = '2px 8px';
    clicksEl.style.borderRadius = '4px';
    clicksEl.style.zIndex = '1000';
    document.body.appendChild(clicksEl);

    // ⏱️ Affichage du temps écoulé (juste sous "Clicks")
    elapsedEl = document.createElement('div');
    elapsedEl.textContent = 'Elapsed: 0 ms';
    elapsedEl.style.position = 'absolute';
    elapsedEl.style.top = '34px';
    elapsedEl.style.left = '10px';
    elapsedEl.style.fontSize = '13px';
    elapsedEl.style.color = '#666';
    elapsedEl.style.color = '#f0f0f0';
    elapsedEl.style.background = 'rgba(255,255,255,0.7)';
    elapsedEl.style.background = '#f0f0f0';
    elapsedEl.style.padding = '2px 8px';
    elapsedEl.style.borderRadius = '4px';
    elapsedEl.style.zIndex = '1000';
    document.body.appendChild(elapsedEl);

    // 🟡 Affichage du nombre de points (zone attractive) — inchangé
    pointsEl = document.createElement('div');
    pointsEl.textContent = 'Points: 0';
    pointsEl.style.fontSize = '32px'; // réduit d'un tiers
    pointsEl.style.fontWeight = 'bold';
    pointsEl.style.color = '#fff';
    pointsEl.style.background = 'linear-gradient(90deg, #ff9800 0%, #ffd700 100%)';
    pointsEl.style.border = '4px solid #ff9800';
    pointsEl.style.borderRadius = '24px';
    pointsEl.style.boxShadow = '0 0 32px #ffd70088, 0 0 12px #ff9800';
    pointsEl.style.padding = '16px 32px'; // réduit d'un tiers
    pointsEl.style.marginBottom = '16px'; // réduit d'un tiers
    pointsEl.style.display = 'inline-block';
    wrapper.appendChild(pointsEl);

    // 🟢 Bouton "Collect" — inchangé
    buttonEl = document.createElement('button');
    buttonEl.textContent = 'Collect';
    buttonEl.disabled = true;
    buttonEl.style.marginTop = '0px';
    buttonEl.style.padding = '8px 24px'; // réduit d'un tiers
    buttonEl.style.fontSize = '16px'; // réduit d'un tiers
    buttonEl.style.borderRadius = '8px';
    buttonEl.style.background = 'linear-gradient(90deg, #ff9800 0%, #ffd700 100%)'; // même fond que points
    buttonEl.style.border = '4px solid #ff9800'; // même bordure que points
    buttonEl.style.color = '#fff';
    buttonEl.style.cursor = 'pointer';
    buttonEl.style.display = 'block';
    buttonEl.style.marginLeft = 'auto';
    buttonEl.style.marginRight = 'auto';

    buttonEl.addEventListener('click', () => {
      if (collectCallback) {
        disableCollect(); // on le désactive immédiatement
        collectCallback();
      }
    });

    wrapper.appendChild(buttonEl);
    container.appendChild(wrapper);

    // ✅ initialise le chrono de l’essai
    trialStartTime = (typeof performance !== 'undefined' ? performance.now() : Date.now());
  };

  const resetClicks = () => {
    clicks = 0;
    updateDisplay();
    // ✅ reset du chrono d’essai et de l’affichage elapsed
    trialStartTime = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    if (elapsedEl) elapsedEl.textContent = 'Elapsed: 0 ms';
  };

  const incrementClicks = () => {
    clicks++;
    updateDisplay();
    // ✅ met à jour le temps écoulé à chaque clic
    if (elapsedEl && trialStartTime != null) {
      const now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
      const elapsed = Math.round(now - trialStartTime);
      elapsedEl.textContent = `Elapsed: ${elapsed} ms`;
    }
  };

  const incrementPoints = () => {
    points++;
    updateDisplay();
    if (pointsEl) {
      // Animation JS : agrandit brièvement (inchangé)
      pointsEl.style.transition = 'transform 0.2s, color 0.2s';
      pointsEl.style.transform = 'scale(1.5)';
      pointsEl.style.color = '#ff9800';
      setTimeout(() => {
        pointsEl.style.transform = 'scale(1)';
        pointsEl.style.color = '#fff';
      }, 200);
    }
  };

  const updateDisplay = () => {
    if (clicksEl) clicksEl.textContent = `Clicks: ${clicks}`;
    if (pointsEl) pointsEl.textContent = `Points: ${points}`;
  };

  const enableCollect = () => {
    if (buttonEl) {
      buttonEl.disabled = false;
      buttonEl.style.background = 'linear-gradient(90deg, #ff9800 0%, #ffd700 100%)';
      buttonEl.style.border = '4px solid #ff9800';
      buttonEl.style.color = '#fff';
      buttonEl.style.boxShadow = '0 0 10px #ffd70088, 0 0 4px #ff9800';
      buttonEl.style.transform = 'scale(1.1)';
      buttonEl.style.transition = 'all 0.2s';
    }
  };

  const disableCollect = () => {
    if (buttonEl) {
      buttonEl.disabled = true;
      buttonEl.style.background = '#fff';
      buttonEl.style.border = '2px solid #bbb';
      buttonEl.style.color = '#ff9800';
      buttonEl.style.boxShadow = '';
      buttonEl.style.transform = '';
      buttonEl.style.transition = '';
    }
  };

  const onConsume = (callback) => {
    collectCallback = callback;
  };

  return {
    create,
    resetClicks,
    incrementClicks,
    incrementPoints,
    enableCollect,
    disableCollect,
    onConsume
  };
})();
