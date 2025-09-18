const UIManager = (() => {
  let consumeCallback = null;

  const init = (keysContainer, reinforcementContainer) => {
    ResponseKeyManager.drawKeys(keysContainer);
    StatusDisplay.create(reinforcementContainer);
    StatusDisplay.onConsume(() => {
      if (consumeCallback) consumeCallback();
    });
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

  return {
    init,
    setKeyActive,
    moveOperantDiskOnClick,
    resetClickCounter,
    enableConsumptionButton,
    disableConsumptionButton,
    onConsume
  };
})();
