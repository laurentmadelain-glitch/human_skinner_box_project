// trial_context.js — GLOBAL version (no export)
// FIX: setAvailable() ne modifie plus l’UI => en VI, Collect ne s’active qu’après une RÉPONSE suivant l’intervalle
(function (global) {
  function createTrialContext({ logger, ui, reinforcementManager, clock, session }) {
    let reinforcementAvailable = false;

    return {
      // ms entiers
      now: () => {
        const t = (typeof performance !== 'undefined' ? performance.now() : Date.now());
        return Math.round(t);
      },

      // journalisation unifiée
      log: (eventType, payload) => { logger.write(eventType, payload); },

      // disponibilité (état interne UNIQUEMENT)
      setAvailable: (v) => {
        reinforcementAvailable = !!v;
        // NE RIEN FAIRE COTE UI ICI !
        // L’UI (Collect) est activée uniquement par SessionManager
        // quand schedule.onResponse(...) retourne 'available'.
      },

      isAvailable: () => reinforcementAvailable,

      // délivrance (points, feedback)
      deliver: () => {
        if (reinforcementManager && typeof reinforcementManager.deliver === 'function') {
          reinforcementManager.deliver();
        }
      },

      // reset UI collecte (désactive le bouton)
      resetCollect: () => {
        if (ui && typeof ui.disableConsumptionButton === 'function') ui.disableConsumptionButton();
      },

      clock,

      // ✅ AJOUT : référence directe à SessionManager
      session, 
    };
  }

  global.createTrialContext = createTrialContext;
})(window);
