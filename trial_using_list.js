const trial_using_list = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div id="ui-container">
      <div id="keys-area"></div>
      <div id="reinforcement-area"></div>
    </div>
  `,
  choices: "NO_KEYS",
  on_load: async () => {
    const keysArea = document.getElementById("keys-area");
    const reinforcementArea = document.getElementById("reinforcement-area");

    // Initialisation UI
    UIManager.init(keysArea, reinforcementArea);
    UIManager.setKeyActive('left', false);
    UIManager.setKeyActive('right', false);
    UIManager.setKeyActive('center', true);

    // Chargement du planning à partir du CSV
    await SessionManagerListe.loadScheduleFromCSV('Schedule.csv');
    SessionManagerListe.reset();
    SessionManagerListe.incrementTrial();

    // Paramètres de l’essai courant
    const params = SessionManagerListe.getReinforcementParamsForCurrentTrial();
    ReinforcementManager.init(params);

    // Placement initial du disque
    OperantDiskManager.placeDisk('center');

    // Consommation du renforçateur
    UIManager.onConsume(() => {
      StatusDisplay.incrementPoints();
      ReinforcementManager.reset();
      UIManager.resetClickCounter();

      if (SessionManagerListe.isSessionOver()) {
        jsPsych.finishTrial();
        alert("Session terminée !");
      } else {
        SessionManagerListe.incrementTrial();
        const nextParams = SessionManagerListe.getReinforcementParamsForCurrentTrial();
        ReinforcementManager.init(nextParams);
        OperantDiskManager.resume('center');
      }
    });
  }
};