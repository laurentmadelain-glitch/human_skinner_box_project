// schedule_vt.js — Variable Time (VT) non contingent (Collect activé via SessionManager)
(function (global) {
  function makeVTSchedule(spec, ctx) {
    const baseInterval = Math.max(1, Number(spec?.interval_ms || 1000));
    const sequence = Array.isArray(spec?.sequence) && spec.sequence.length ? [...spec.sequence] : null;
    const activeKey = spec?.active_key || 'center';

    let timerId = null;
    let currentDelay = baseInterval;
    let available = false;

    function drawInterval() { return sequence ? (sequence.shift() ?? baseInterval) : baseInterval; }

    function clearTimer() {
      if (timerId !== null) { clearTimeout(timerId); timerId = null; }
    }

    function armTimer() {
      clearTimer();
      available = false;
      ctx.setAvailable(false);

      currentDelay = drawInterval();
      timerId = setTimeout(() => {
        // VT: renforcement devient disponible sans réponse
        available = true;
        ctx.setAvailable(true);
        ctx.log('reinforcement_available', { schedule_type: 'vt', interval_ms: currentDelay });

        // -> Notifie le SessionManager (chemin “propre”)
        if (ctx.session?.makeReinforcementAvailable) {
          console.log('[VT] calling session.makeReinforcementAvailable()');
          ctx.session.makeReinforcementAvailable();
        } else {
          // Fallback interface si jamais non câblé
          console.warn('[VT] session.makeReinforcementAvailable missing, enabling UI directly');
          ctx.ui?.enableConsumptionButton?.();
        }
      }, currentDelay);
    }

    return {
      initTrial(initSpec, ctx_) {
        available = false;
        ctx.setAvailable(false);
        ctx.ui?.disableConsumptionButton?.();

        armTimer();

        const info = {
          schedule_type: 'vt',
          schedule_criterion: currentDelay,
          active_key: activeKey,
          started_at: ctx.now(),
        };
        ctx.log('trial_start', info);
        return info;
      },

      onResponse(ev, ctx_) {
        // VT: réponse non contingente, on log seulement
        ctx.log('operant_response', { active_key: activeKey, ...ev, reinforcement_available: available });
        return undefined;
      },

      onCollect(ev, ctx_) {
        if (!available) {
          ctx.log('collect_ignored', { reason: 'not available' });
          return;
        }
        available = false;
        ctx.setAvailable(false);

        ctx.deliver();
        ctx.log('collect', { schedule_type: 'vt', interval_ms: currentDelay, key_id: 'collect' });

        // On reste dans le même essai → on réarme l’intervalle suivant
        ctx.ui?.disableConsumptionButton?.();
        armTimer();
      },

      onEnd(ev, ctx_) {
        clearTimer();
        available = false;
        ctx.setAvailable(false);
        ctx.ui?.disableConsumptionButton?.();
      },
    };
  }

  global.makeVTSchedule = makeVTSchedule;
})(window);
