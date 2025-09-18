const OperantDiskManager = (() => {
  let lastIndex = null;
  let clickCount = 0;
  let trialStartTime = null;
  let isPaused = false;
  let currentKeyId = null;

  const color = { r: 255, g: 80, b: 80 };

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
    const disk = document.createElement('div');
    disk.className = 'circle';
    disk.style.left = `${pos.x}px`;
    disk.style.top = `${pos.y}px`;
    disk.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
    disk.style.border = '2px solid #5e5e5e';
    disk.style.zIndex = 3;

    disk.addEventListener('click', (e) => {
      if (isPaused) return;

      clickCount++;
      const rt = Math.round(performance.now() - trialStartTime);

      const reinforced = ReinforcementManager.registerOperantResponse();

      jsPsych.data.write({
        trial_index: jsPsych.getProgress().current_trial_global,
        event_type: 'operant_response',
        click_number: clickCount,
        click_x: e.clientX,
        click_y: e.clientY,
        rt: rt,
        trial_number: SessionManager.getCurrentTrialNumber?.() ?? 0,
        reinforcement_available: reinforced
      });

      StatusDisplay.incrementClicks();

      if (reinforced) {
        isPaused = true;
        const oldDisk = wrapper.querySelector('.circle[style*="z-index: 3"]');
        if (oldDisk) wrapper.removeChild(oldDisk);

        UIManager.enableConsumptionButton();
      } else {
        placeDisk(keyId);
      }
    });

    wrapper.appendChild(disk);
  };

  const resume = (keyId) => {
  isPaused = false;
  clickCount = 0;
  trialStartTime = performance.now();

  // 🔽 Log du début d’essai
  const params = SessionManager.getReinforcementParamsForCurrentTrial?.() || {};
  jsPsych.data.write({
    event_type: 'trial_start',
    trial_number: SessionManager.getCurrentTrialNumber?.() ?? 0,
    schedule_type: params.type || 'unknown',
    ratio_min: params.Ratio_min ?? null,
    ratio_max: params.Ratio_max ?? null,
    timestamp: performance.now()
  });

  placeDisk(keyId);
};

  const pause = () => {
    isPaused = true;
  };

  return {
    placeDisk,
    resume,
    pause
  };
})();
