const trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
      <div id="ui-container">
        <div id="keys-area"></div>
        <div id="reinforcement-area"></div>
      </div>
    `,
    choices: "NO_KEYS",
    on_load: () => {
      const keysArea = document.getElementById("keys-area");
      const reinforcementArea = document.getElementById("reinforcement-area");

      UIManager.init(keysArea, reinforcementArea);
      SessionManager.reset();
      //SessionManager.incrementTrial();

      // 👇 Ne garde que la touche centrale active
    UIManager.setKeyActive('left', false);
    UIManager.setKeyActive('right', false);
    UIManager.setKeyActive('center', true);

      //ReinforcementManager.init({ ratio: 2 });
    const reinforcementParams = SessionManager.getReinforcementParamsForCurrentTrial();
      ReinforcementManager.init(reinforcementParams);
      OperantDiskManager.placeDisk('center');

        UIManager.onConsume(() => {
        StatusDisplay.incrementPoints();
        ReinforcementManager.reset();
        UIManager.resetClickCounter();

        if (SessionManager.isSessionOver()) {
          jsPsych.finishTrial();
          alert("Session terminée !");
        } else {
          SessionManager.incrementTrial();
          const newParams = SessionManager.getReinforcementParamsForCurrentTrial();
          ReinforcementManager.init(newParams);
          //OperantDiskManager.resume();
          OperantDiskManager.resume('center');
        }
      });
    }
  };
