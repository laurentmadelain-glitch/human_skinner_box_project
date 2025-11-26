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
    console.log("[trial.js] on_load called");

    const keysArea = document.getElementById("keys-area");
    const reinforcementArea = document.getElementById("reinforcement-area");

    // Initialisation de l'UI
    UIManager.init(keysArea, reinforcementArea);

    // Réinitialisation de la session (remise à 0 des compteurs, timers, etc.)
    SessionManager.reset();

    // Démarre le premier essai/bloc
    SessionManager.startCurrentTrial();

    // Connecte le bouton de collecte à l'enchaînement
    UIManager.onConsume(() => {
      SessionManager.collectNow();
      StatusDisplay.incrementPoints();
      ReinforcementManager.reset();
      UIManager.resetClickCounter();

      if (SessionManager.isSessionOver()) {
        JSP.finishTrial();
        alert("Session terminée !");
      } else {
        SessionManager.incrementTrial();         // avance à l’essai suivant
        SessionManager.startCurrentTrial();      // relance un essai
      }
    });
  },
};
