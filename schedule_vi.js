// schedule_vi.js — GLOBAL version (Variable Interval)
(function (global) {
  function makeVISchedule(spec, ctx) {
    const baseInterval = Math.max(1, Number(spec?.interval_ms || 1000)); // ms
    const activeKey = spec?.active_key || 'center';
    const sequence = Array.isArray(spec?.sequence) && spec.sequence.length ? [...spec.sequence] : null;

    let currentDelay = baseInterval;  // ms du cycle courant
    let responseIndex = 0;
    let timerId = null;

    function drawInterval() {
      return sequence ? (sequence.shift() ?? baseInterval) : baseInterval;
    }
    function clearTimer() { if (timerId !== null) { clearTimeout(timerId); timerId = null; } }
    function armTimer() {
      clearTimer();
      currentDelay = drawInterval();
      ctx.setAvailable(false);
      timerId = setTimeout(() => { ctx.setAvailable(true); }, currentDelay);
      console.log('[VI] reinforcement available');
    }

    return {
      initTrial(initSpec, ctx_) {
        console.log('[VI] initTrial called, interval =', baseInterval);

        responseIndex = 0;
        armTimer();

        const its = {
          schedule_type: 'vi',
          schedule_criterion: currentDelay, // ms de l’intervalle tiré
          active_key: activeKey,
          key_id: activeKey,
          started_at: ctx.now(),
        };
        ctx.log('trial_start', its);
        return its;
      },

      onResponse(ev, ctx_) {
        responseIndex += 1;
        ctx.log('operant_response', {
          active_key: activeKey,
          ...ev,
          reinforcement_available: ctx.isAvailable(),
        });
        console.log('[VI] response detected, available=', ctx.isAvailable());

        return ctx.isAvailable() ? 'available' : undefined;
      },

      onCollect(ev, ctx_) {
        if (!ctx.isAvailable()) return;

        ctx.deliver();

        ctx.log('collect', {
          active_key: activeKey,
          key_id: 'collect'
        });

        armTimer(); // nouvel intervalle
      },

      onEnd(ev, ctx_) { clearTimer(); },
    };
  }

  global.makeVISchedule = makeVISchedule;
})(window);
