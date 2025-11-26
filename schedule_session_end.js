// schedule_session_end.js — GLOBAL (simple: waits for Collect click)
(function (global) {
  function makeSessionEndSchedule(spec, ctx) {
    const activeKey = spec?.active_key || 'center';

    function showMsg() {
      const id = 'session-end-message';
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement('div');
        el.id = id;
        el.style.position = 'fixed';
        el.style.top = '50%';
        el.style.left = '50%';
        el.style.transform = 'translate(-50%, -50%)';
        el.style.fontSize = '1.4em';
        el.style.textAlign = 'center';
        el.style.padding = '1em 2em';
        el.style.background = 'rgba(255,255,255,0.95)';
        el.style.border = '2px solid #444';
        el.style.borderRadius = '12px';
        el.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
        el.style.zIndex = '9999';
        document.body.appendChild(el);
      }
      el.textContent = 'Session complete. Click on "collect" to finish the session. Thank you for your participation!';
    }

    function removeMsg() {
      const el = document.getElementById('session-end-message');
      if (el) el.remove();
    }

    return {
      initTrial(initSpec, ctx_) {
        ctx.setAvailable(true);
        UIManager.enableConsumptionButton();
        ctx.log('trial_start', {
          schedule_type: 'session_end',
          active_key: activeKey,
          started_at: ctx.now()
        });
        showMsg();
        return {
          schedule_type: 'session_end',
          active_key: activeKey,
          key_id: activeKey,
          started_at: ctx.now()
        };
      },

      onResponse(ev, ctx_) {
        ctx.log('response_ignored', { ...ev });
        return undefined;
      },

      onCollect(ev, ctx_) {
        ctx.deliver();
        ctx.log('collect', { active_key: activeKey, key_id: 'collect', at: ctx.now() });
        removeMsg();
        try { ctx.session?.endSession?.(); } catch (e) { console.error('[SESSION_END] endSession error:', e); }
      },

      onEnd(ev, ctx_) { removeMsg(); },
    };
  }

  global.makeSessionEndSchedule = makeSessionEndSchedule;
})(window);
