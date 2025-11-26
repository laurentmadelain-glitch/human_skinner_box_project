// schedules_router.js — GLOBAL router (no import)
(function (global) {
  /**
   * Aiguillage des programmes de renforcement selon `spec.type`.
   * Attend que les factories globales (makeVRSchedule, makeVISchedule, etc.) soient chargées.
   */
  function routeSchedule(spec, ctx) {
    const type = String(spec?.type || 'vr').toLowerCase();

    switch (type) {
      // ======================
      // VARIABLE RATIO (VR)
      // ======================
      case 'vr':
      case 'ratio': // compatibilité
        if (typeof global.makeVRSchedule !== 'function') {
          throw new Error('makeVRSchedule is not loaded');
        }
        return global.makeVRSchedule(spec, ctx);

      // ======================
      // VARIABLE INTERVAL (VI)
      // ======================
      case 'vi':
      case 'interval': // compatibilité
        if (typeof global.makeVISchedule !== 'function') {
          throw new Error('makeVISchedule is not loaded');
        }
        return global.makeVISchedule(spec, ctx);

      // ======================
      // VARIABLE TIME (VT)
      // ======================
      case 'vt':
      case 'time':
        if (typeof global.makeVTSchedule !== 'function') throw new Error('makeVTSchedule is not loaded');
        return global.makeVTSchedule(spec, ctx);

      // ======================
      // EXTINCTION (EXT)
      // ======================
      case 'ext':
      case 'extinction':
        if (typeof global.makeExtinctionSchedule !== 'function') {
          throw new Error('makeExtinctionSchedule is not loaded');
        }
        return global.makeExtinctionSchedule(spec, ctx);

      // ======================
      // SESSION END
      // ======================
      case 'session_end':
        if (typeof global.makeSessionEndSchedule !== 'function') {
          throw new Error('makeSessionEndSchedule is not loaded');
        }
        return global.makeSessionEndSchedule(spec, ctx);

      // ======================
      // DEFAULT / ERROR
      // ======================
      default:
        console.warn(`[routeSchedule] Unknown schedule type "${type}". Fallback to extinction.`);
        if (typeof global.makeExtinctionSchedule !== 'function') {
          throw new Error('makeExtinctionSchedule is not loaded');
        }
        return global.makeExtinctionSchedule(spec, ctx);
    }
  }

  // expose globally
  global.routeSchedule = routeSchedule;
})(window);
