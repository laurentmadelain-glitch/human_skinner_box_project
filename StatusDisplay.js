const StatusDisplay = (() => {
  let clicks = 0;
  let points = 0;
  let collectCallback = null;

  let clicksEl = null;
  let pointsEl = null;
  let buttonEl = null;

  const create = (container) => {
    // 🧱 Création du bloc principal
    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.bottom = '30px';
    wrapper.style.left = '50%';
    wrapper.style.transform = 'translateX(-50%)';
    wrapper.style.textAlign = 'center';

    // 🔢 Affichage du nombre de clics
    clicksEl = document.createElement('div');
    clicksEl.textContent = 'Clicks: 0';
    clicksEl.style.fontSize = '18px';
    wrapper.appendChild(clicksEl);

    // 🟡 Affichage du nombre de points
    pointsEl = document.createElement('div');
    pointsEl.textContent = 'Points: 0';
    pointsEl.style.fontSize = '18px';
    wrapper.appendChild(pointsEl);

    // 🟢 Bouton "Collect"
    buttonEl = document.createElement('button');
    buttonEl.textContent = 'Collect';
    buttonEl.disabled = true;
    buttonEl.style.marginTop = '12px';
    buttonEl.style.padding = '8px 20px';
    buttonEl.style.fontSize = '16px';
    buttonEl.style.borderRadius = '6px';
    buttonEl.style.border = '1px solid #aaa';
    buttonEl.style.cursor = 'pointer';

    buttonEl.addEventListener('click', () => {
      if (collectCallback) {
        disableCollect(); // on le désactive immédiatement
        collectCallback();
      }
    });

    wrapper.appendChild(buttonEl);
    container.appendChild(wrapper);
  };

  const resetClicks = () => {
    clicks = 0;
    updateDisplay();
  };

  const incrementClicks = () => {
    clicks++;
    updateDisplay();
  };

  const incrementPoints = () => {
    points++;
    updateDisplay();
  };

  const updateDisplay = () => {
    if (clicksEl) clicksEl.textContent = `Clicks: ${clicks}`;
    if (pointsEl) pointsEl.textContent = `Points: ${points}`;
  };

  const enableCollect = () => {
    if (buttonEl) buttonEl.disabled = false;
  };

  const disableCollect = () => {
    if (buttonEl) buttonEl.disabled = true;
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
