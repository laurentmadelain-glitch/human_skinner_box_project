// schedule_extinction.js — Extinction schedule (no reinforcement)
(function (global) {
  function makeExtinctionSchedule(spec, ctx) {
    let responseCount = 0;

    return {
      initTrial(initSpec, ctx_) {
        console.log('[EXT] initTrial called — no reinforcement will be delivered');
        const info = {
          schedule_type: 'extinction',
          started_at: ctx.now(),
        };
        ctx.log('trial_start', info);
        return info;
      },

      onResponse(ev, ctx_) {
        responseCount += 1;
        ctx.log('operant_response', {
          ...ev,
          response_index: responseCount,
          reinforcement_available: false,
        });
        return undefined;
      },

      onCollect(ev, ctx_) {
        // aucun renforcement
        ctx.log('collect_ignored', { reason: 'extinction schedule' });
      },

      onEnd(ev, ctx_) {
        console.log('[EXT] onEnd called');
      },
    };
  }

  global.makeExtinctionSchedule = makeExtinctionSchedule;
})(window);
