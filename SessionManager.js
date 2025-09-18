const SessionManager = (() => {
  let currentTrial = 0;
  let maxTrials = 1;

  // Exemple de plan de contingences par essai
  // const reinforcementSchedule = [
  //   { type: 'ratio', ratio: 1 }, // Essai 1
  //   { type: 'ratio', ratio: 2 }, // Essai 2
  //   { type: 'ratio', ratio: 3 }, // Essai 3
  //   { type: 'ratio', ratio: 4 }, // Essai 4
  //   { type: 'ratio', ratio: 5 }  // Essai 5
  // ];
 

const reinforcementSchedule = [];

for (let i = 0; i <= maxTrials; i++) {
  if (i < 2) {
    reinforcementSchedule.push({ type: 'ratio', Ratio_min: 1, Ratio_max: 1 });  // Essais 0, 1, 2
  } else {
    reinforcementSchedule.push({ type: 'ratio', Ratio_min: 1, Ratio_max: 2 });  // Essais 3, 4
  }
}

//const reinforcementSchedule = [{ type: 'ratio', ratio: 2 }];

  const reset = () => {
    currentTrial = 0;
  };

  const getCurrentTrialNumber = () => currentTrial;

  const incrementTrial = () => {
    currentTrial++;
  };

  const isSessionOver = () => currentTrial >= maxTrials;

  // const getReinforcementParamsForCurrentTrial = () => {
  //   return reinforcementSchedule[currentTrial] || { type: 'ratio', ratio: 1 };
  // };
const getReinforcementParamsForCurrentTrial = () => {
  const schedule = reinforcementSchedule[currentTrial];

  if (!schedule || schedule.type !== 'ratio') {
    return { type: 'ratio', ratio: 1 }; // Valeur par défaut
  }

  const min = schedule.Ratio_min;
  const max = schedule.Ratio_max;

  const ratio = Math.floor(Math.random() * (max - min + 1)) + min;

  return { type: 'ratio', ratio };
};

  return {
    reset,
    getCurrentTrialNumber,
    incrementTrial,
    isSessionOver,
    getReinforcementParamsForCurrentTrial
  };
})();