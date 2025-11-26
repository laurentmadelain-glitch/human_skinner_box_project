// SessionManager.js — V3 (avec fin de session unifiée + support schedule_session_end)
const SessionManager = (() => {
  const DEFAULT_BLOCK_MS = 10_000;

  let blockTimerId = null;
  let trialTimerId = null;
  let blockDeadlineAt = 0;
  let blockIndex = 0;
  let currentTrial = 0;
  let schedule = null;
  let ctx = null;
  let activeKey = 'center';
  let totalPoints = 0;
  let currentTrialStart = null;
  let currentBlockStart = null;
  let reinforcementPending = false;
  let currentTrialDeadlineAt = 0;
  let isStartingTrial = false;
  let sessionEnded = false;


  // =====================
  // === LOGGER
  // =====================
  function makeLogger() {
    return {
      write: (event_type, payload = {}) => {
        const t = (typeof performance !== 'undefined' ? performance.now() : Date.now());
        const timestamp = Math.round(t);

        let elapsed_since_trial_start = null;
        if (Object.prototype.hasOwnProperty.call(payload, 'started_at')) {
          currentTrialStart = Number(payload.started_at) || timestamp;
          elapsed_since_trial_start = 0;
        } else if (currentTrialStart != null) {
          elapsed_since_trial_start = Math.max(0, timestamp - currentTrialStart);
        }

        let elapsed_since_block_start = null;
        if (Object.prototype.hasOwnProperty.call(payload, 'block_started_at')) {
          currentBlockStart = Number(payload.block_started_at) || timestamp;
          elapsed_since_block_start = 0;
        } else if (currentBlockStart != null) {
          elapsed_since_block_start = Math.max(0, timestamp - currentBlockStart);
        }

        const record = {
          timestamp,
          trial_number: currentTrial + 1,
          event_type,
          points: totalPoints,
          elapsed_since_trial_start,
          elapsed_since_block_start,
          block_index: blockIndex + 1,
          ...payload,
        };

        if (window.JSP && window.JSP.data) {
          window.JSP.data.write(record);
        }
      }
    };
  }

  // =====================
  // === TIMERS
  // =====================
  function clearBlockTimer() {
    if (blockTimerId) {
      clearTimeout(blockTimerId);
      blockTimerId = null;
    }
  }

  function clearTrialTimer() {
    if (trialTimerId) {
      clearTimeout(trialTimerId);
      trialTimerId = null;
    }
  }

  function armTrialTimer(ms) {
    if (!Number.isFinite(ms) || ms <= 0) return;
    clearTrialTimer();
    const now = performance.now();
    currentTrialDeadlineAt = now + ms;
    trialTimerId = setTimeout(() => {
      endTrial('trial_timeout');
    }, ms);
  }

  // =====================
  // === HELPERS
  // =====================
  function getCurrentBlockSpec() {
    return (trial_list || [])[blockIndex] || {};
  }

  function getActiveKeyForCurrentBlock() {
  const currentBlock = (trial_list || [])[blockIndex];
  // on récupère key_id depuis trial_list
  const key = String(currentBlock?.key_id || '').toLowerCase();

  if (["left", "center", "right"].includes(key)) {
    return key;
  }

  // fallback : si key_id absent ou invalide
  console.warn(`[SessionManager] key_id non défini pour blockIndex=${blockIndex}, utilisation de 'center' par défaut`);
  return 'center';
}

  function getBlockDurationMs() {
    const spec = getCurrentBlockSpec();
    let ms = Number(spec.block_duration ?? spec.duration ?? spec.block_ms);
    if (!Number.isFinite(ms) || ms <= 0) ms = DEFAULT_BLOCK_MS;
    return ms;
  }

  // =====================
  // === BLOCK CONTROL
  // =====================
  function armBlockTimer() {
    const now = performance.now();
    const BLOCK_MS = getBlockDurationMs();
    if (blockTimerId && now < blockDeadlineAt) return;

    if (!blockDeadlineAt || now >= blockDeadlineAt) {
      blockDeadlineAt = now + BLOCK_MS;
      const block = getCurrentBlockSpec();
      const type = String(block.type || '').toLowerCase();

      (ctx.log || ctx.logger?.write)?.('block_start', {
        block_index: blockIndex + 1,
        block_ms: BLOCK_MS,
        started_at: Math.round(now),
        block_started_at: Math.round(now),
        schedule_type: type,
        schedule_min: (type === 'vr' || type === 'ratio') ? block.ratio_min
          : (type === 'vi' || type === 'interval') ? block.interval_min
          : null,
        schedule_max: (type === 'vr' || type === 'ratio') ? block.ratio_max
          : (type === 'vi' || type === 'interval') ? block.interval_max
          : null,
      });
    }

    const delay = Math.max(0, Math.round(blockDeadlineAt - now));
    clearBlockTimer();
    blockTimerId = setTimeout(() => {
      endTrial('block_timeout');
    }, delay);
  }

  function updateUIForActiveKey() {
    activeKey = getActiveKeyForCurrentBlock();
    OperantDiskManager.pause();
    ["left", "center", "right"].forEach(k => UIManager.setKeyActive(k, k === activeKey));
    OperantDiskManager.resume(activeKey);
    setActiveKey(activeKey);
  }

  // =====================
  // === BLOCK SWITCH
  // =====================
  function gotoNextBlock(endReason = 'natural') {
      if (sessionEnded) {
    console.warn('[SessionManager] gotoNextBlock() ignoré — session déjà terminée');
    return;
  }

    //console.log(`[gotoNextBlock] called (endReason=${endReason})`);
    clearBlockTimer();
    blockDeadlineAt = 0;

    try {
      schedule?.stop?.(endReason);
    } catch (e) {
      console.error('[SessionManager] schedule.stop error:', e);
    }

    blockIndex += 1;
    currentTrial = blockIndex;

    const totalBlocks = trial_list?.length || 0;
    //console.log(`[gotoNextBlock] blockIndex=${blockIndex}, totalBlocks=${totalBlocks}`);

    if (blockIndex >= totalBlocks) {
      console.log('[SessionManager] Fin de session — attente flush logger...');

      ctx?.log?.('session_end', {
        block_index: blockIndex,
        total_blocks: totalBlocks,
        ended_at: Math.round(performance.now())
      });
      return;
    }

    reinforcementPending = false;
    ctx?.log?.('block_end', { block_index: blockIndex, reason: endReason });
    startCurrentTrial();
  }

  // =====================
  // === RESET
  // =====================
  const reset = () => {
    clearBlockTimer();
    clearTrialTimer();
    currentTrial = 0;
    totalPoints = 0;
    blockIndex = 0;
    currentTrialStart = null;
    currentBlockStart = null;
    reinforcementPending = false;
  };

  // =====================
  // === REINFORCEMENT PARAMETERS
  // =====================
  const getReinforcementParamsForCurrentTrial = () => {
    const config = trial_list[blockIndex] || {};
    const t = String(config.type || '').toLowerCase();

    if (t === 'ratio' || t === 'vr') {
      const min = Number(config.ratio_min ?? config.ratio ?? 1);
      const max = Number(config.ratio_max ?? config.ratio ?? min);
      const drawnRatio = Math.floor(Math.random() * (max - min + 1)) + min;
      return { type: 'vr', ratio: drawnRatio };
    }

    if (t === 'interval' || t === 'vi') {
      const min = Number(config.interval_min ?? config.ms ?? 1000);
      const max = Number(config.interval_max ?? config.ms ?? min);
      const drawnMs = Math.floor(Math.random() * (max - min + 1)) + min;
      return { type: 'vi', interval_ms: drawnMs };
    }

    if (t === 'vt' || t === 'time') {
      const min = Number(config.interval_min ?? config.ms ?? 1000);
      const max = Number(config.interval_max ?? config.ms ?? min);
      const drawnMs = Math.floor(Math.random() * (max - min + 1)) + min;
      return { type: 'vt', interval_ms: drawnMs };
    }

    if (t === 'ext' || t === 'extinction') {
      return { type: 'extinction' };
    }

    if (t === 'session_end') {
      return { type: 'session_end' };
    }

    return { type: 'vr', ratio: 1 }; // fallback safe
  };


  // =====================
  // === TRIAL CONTROL
  // =====================
  function endTrial(reason) {
        isStartingTrial = false;
    console.log("[SessionManager] Fin de l’essai");
    if (blockIndex >= (trial_list?.length || 0)) {
      console.warn(`[endTrial ignored] reason=${reason} — session déjà terminée`);
      clearBlockTimer();
      clearTrialTimer();
      return;
    }
    clearTrialTimer();
    const now = performance.now();
    ctx.log(`trial_end_${reason}`, { ended_at: Math.round(now), reason });

    if (reason === 'response') {
      reinforcementPending = true;
      UIManager.enableConsumptionButton();
      return;
    }

    if (reason === 'block_timeout' || reason === 'duration_elapsed') {
      reinforcementPending = false;
      gotoNextBlock(reason);
      return;
    }

    const tempsRestantBloc = Math.max(0, blockDeadlineAt - now);

    if (tempsRestantBloc > 100) {
      reinforcementPending = false;
      startCurrentTrial();
    } else {
      console.log("[SessionManager] Bloc terminé pendant essai — fin de bloc forcée");
      reinforcementPending = false;
      gotoNextBlock('block_timeout');
    }
    console.log(`[SessionManager] endTrial → reason=${reason}, blockIndex=${blockIndex}, total=${trial_list?.length}`);
  }

  // =====================
  // === TRIAL START
  // =====================
  const startCurrentTrial = () => {
    if (sessionEnded) {
    console.warn('[SessionManager] startCurrentTrial() ignoré — session terminée');
    return;
  }
    if (isStartingTrial) {
    console.warn('[SessionManager] startCurrentTrial() ignoré — déjà en cours');
    return;
  }
  isStartingTrial = true;
    console.log("[SessionManager] Nouveau trial lancé");
    clearTrialTimer();
    updateUIForActiveKey();
    const params = getReinforcementParamsForCurrentTrial();
    const spec = { ...params, active_key: activeKey };

    UIManager?.disableConsumptionButton?.();

    const rmProxy = {
      deliver: () => {
        reinforcementPending = true;
        totalPoints += 1;
        ReinforcementManager.deliver?.();
      }
    };

    ctx = createTrialContext({
      logger: makeLogger(),
      ui: UIManager,
      reinforcementManager: rmProxy,
      clock: null,
      activeKey: activeKey,
      session: SessionManager
    });

    armBlockTimer();

    const now = performance.now();
    const tempsRestantBloc = Math.max(0, blockDeadlineAt - now);
    const trialCfg = trial_list[blockIndex] || {};
    let trialDuration = Number(trialCfg.trial_duration ?? Infinity);
    if (String(trialCfg.type).toLowerCase() !== 'vt') {
      trialDuration = Math.min(trialDuration, tempsRestantBloc);
    }

    currentTrialStart = now;

    if (Number.isFinite(trialDuration) && trialDuration > 0 && trialDuration !== Infinity) {
      armTrialTimer(trialDuration);
    }

    schedule = routeSchedule(spec, ctx);
    schedule.initTrial(spec, ctx);

    OperantDiskManager.setOnOperantResponse((rawEv) => {
      const ev = {
        key_id: rawEv.key_id,
        target_location: rawEv.target_location,
        response_index: rawEv.click_number,
        irt_ms: rawEv.rt,
        click_x: rawEv.clientX,
        click_y: rawEv.clientY,
      };
      const decision = schedule.onResponse(ev, ctx);
      if (decision === 'available') {
        OperantDiskManager.pause();
        endTrial('response');
      }
    });

    return spec;
  };

  // =====================
  // === MANUAL COLLECT
  // =====================
  const collectNow = () => {
      if (sessionEnded) {
    console.warn('[collectNow] ignoré — session terminée');
    return;
  }

    if (!schedule || !ctx) return;
    try { schedule.onCollect?.({}, ctx); } catch (e) { console.error('[collectNow] error:', e); }
    reinforcementPending = false;
    startCurrentTrial();
  };

  // =====================
  // === SESSION END (explicit, utilisé par schedule_session_end)
  // =====================
  const endSession = () => {
    if (sessionEnded) return; // empêche appels multiples
  sessionEnded = true;
    console.log('[SessionManager] endSession() called — closing session');
    clearBlockTimer();
    clearTrialTimer();

    const now = performance.now();
    ctx?.log?.('session_end', {
      block_index: blockIndex + 1,
      total_blocks: trial_list?.length || 0,
      ended_at: Math.round(now)
    });

    setTimeout(() => {
  console.log('[SessionManager] Fin de session — ajout trial final');
  window.jsPsych?.addNodeToEndOfTimeline?.({
    timeline: [{
      type: jsPsychCallFunction,
      func: () => {
        console.log('[SessionManager] Trial final — on_finish sera déclenché');
                jsPsych.endExperiment(); // <== necessaire pour on_finish
      }
    }]
  });
}, 100);
};

 // =====================
 // === SIGNAL: reinforcement available (sans fin d’essai)
 // =====================
 function makeReinforcementAvailable() {
   if (reinforcementPending) return; // déjà dispo
   reinforcementPending = true;

   try {
     UIManager.enableConsumptionButton();
     console.log('[SessionManager] Reinforcement available -> Collect enabled');
   } catch (e) {
     console.error('[SessionManager] enableConsumptionButton failed:', e);
   }
 }


  // =====================
  // === EXPORTS
  // =====================
  const getSchedule = () => schedule;
  const setActiveKey = (keyId) => { activeKey = keyId; };
  const isSessionOver = () => blockIndex >= (trial_list?.length || 0);
  const incrementTrial = () => { currentTrial++; };
  const incrementBlock = () => { blockIndex++; };

  return {
    reset,
    startCurrentTrial,
    collectNow,
    endTrial,
    endSession,   // ← permet la fin propre par schedule_session_end
    getSchedule,
    getReinforcementParamsForCurrentTrial,
    isSessionOver,
    incrementTrial,
    incrementBlock,
    makeReinforcementAvailable,
  };
})();
