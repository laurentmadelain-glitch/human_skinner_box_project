// ReinforcementManager.js — V2 (ne décide plus, exécute la délivrance)
const ReinforcementManager = (() => {
  // Placeholder: branchements son/visuel/points réels si besoin.
  // Ici, UI (StatusDisplay) gère déjà l'incrément de points sur consume.
  const deliver = () => {
    // Ex: jouer un son ou flash visuel -> ici minimal
    // console.log('[RM] deliver()');
  };

  const reset = () => {
    // reset interne si nécessaire (buffer son, cooldown, etc.)
  };

  return { deliver, reset };
})();
