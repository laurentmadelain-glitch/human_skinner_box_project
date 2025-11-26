// schedule_vr.js — GLOBAL version (no export)
(function (global) {
  function makeVRSchedule(spec, ctx) {
    const scheduleCriterion = Math.max(1, Number(spec?.ratio || 1)); // nb de réponses
    const activeKey = spec?.active_key || 'center';
    //const activeKey = spec?.active_key || 'left';
    const sequence = Array.isArray(spec?.sequence) && spec.sequence.length ? [...spec.sequence] : null;

    let targetCount = scheduleCriterion; // interne uniquement
    let count = 0;
    let responseIndex = 0;

    function drawTarget() {
      return sequence ? (sequence.shift() ?? scheduleCriterion) : scheduleCriterion;
    }

    return {
      initTrial(initSpec, ctx_) {
        count = 0;
        responseIndex = 0;
        targetCount = drawTarget();

        ctx.setAvailable(false);
        ctx.resetCollect();

        const its = {
          schedule_type: 'vr',
          schedule_criterion: scheduleCriterion,
          active_key: activeKey,
          key_id: activeKey,
          started_at: ctx.now(), // ms entiers
        };
        ctx.log('trial_start', its);
        return its;
      },

      onResponse(ev, ctx_) {
        responseIndex += 1;
        count += 1;

        const thresholdReached = count >= targetCount;
        if (thresholdReached && !ctx.isAvailable()) ctx.setAvailable(true);

        ctx.log('operant_response', {
          active_key: activeKey,
          ...ev, // key_id, target_location, response_index, irt_ms, click_x, click_y
          reinforcement_available: ctx.isAvailable(),
        });

        return ctx.isAvailable() ? 'available' : undefined;
      },

      onCollect(ev, ctx_) {
        if (!ctx.isAvailable()) return;

        ctx.deliver(); // points++

        ctx.log('collect', {
          active_key: activeKey,
          key_id: 'collect'
        });

        count = 0;
        targetCount = drawTarget();
        ctx.setAvailable(false);
      },

      onEnd(ev, ctx_) { /* no-op */ },
    };
  }

  global.makeVRSchedule = makeVRSchedule;
})(window);
