const SessionManager = (() => {
  let currentTrial = 0;

  const reset = () => {
    currentTrial = 0;
  };

  const getCurrentTrialNumber = () => currentTrial;

  const incrementTrial = () => {
    currentTrial++;
  };

  const isSessionOver = () => currentTrial >= trial_list.length-1;

  const getReinforcementParamsForCurrentTrial = () => {
    const config = trial_list[currentTrial];

    // Tirage aléatoire si ratio variable
    if (config.type === "ratio") {
      const min = config.ratio_min;
      const max = config.ratio_max;
      const drawnRatio = Math.floor(Math.random() * (max - min + 1)) + min;
      return { type: "ratio", ratio: drawnRatio };
    }

    return { type: "ratio", ratio: 1 }; // fallback
  };

  return {
    reset,
    getCurrentTrialNumber,
    incrementTrial,
    isSessionOver,
    getReinforcementParamsForCurrentTrial
  };
})();