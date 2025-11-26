const UIManager = (() => {
  let consumeCallback = null;

  const init = (keysContainer, reinforcementContainer) => {
    ResponseKeyManager.drawKeys(keysContainer);
    StatusDisplay.create(reinforcementContainer);
    StatusDisplay.onConsume(() => { if (consumeCallback) consumeCallback(); });
    // par défaut, bouton collect inactif
    StatusDisplay.disableCollect?.();
  };

  const setKeyActive = (keyId, isActive) => {
    ResponseKeyManager.setActive(keyId, isActive);
  };

  const moveOperantDiskOnClick = (keyId) => {
    OperantDiskManager.resume(keyId);
  };

  const resetClickCounter = () => {
    StatusDisplay.resetClicks();
  };

  const enableConsumptionButton = () => {
    StatusDisplay.enableCollect();
  };

  const disableConsumptionButton = () => {
    StatusDisplay.disableCollect();
  };

  const onConsume = (callback) => {
    consumeCallback = callback;
  };

  // === Nouveautés V2 pour le contexte ===
  const setReinforcementAvailable = (v) => {
    if (v) enableConsumptionButton(); else disableConsumptionButton();
  };

  const resetCollect = () => {
    disableConsumptionButton();
  };

  return {
    init,
    setKeyActive,
    moveOperantDiskOnClick,
    resetClickCounter,
    enableConsumptionButton,
    disableConsumptionButton,
    onConsume,
    setReinforcementAvailable,
    resetCollect,
  };
})();
