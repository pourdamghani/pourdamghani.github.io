// Browser-only edition: the device owns the clock, answers, and saved results.
export function normalizeWord(value, language) {
  let word = String(value).normalize('NFC').trim().toUpperCase();
  if (language === 'de') word = word.replaceAll('Ä', 'AE').replaceAll('Ö', 'OE').replaceAll('Ü', 'UE').replaceAll('ẞ', 'SS');
  return /^[A-Z]{5}$/.test(word) ? word : null;
}

export function feedback(answer, guess) {
  const result = Array(5).fill('absent'), remaining = {};
  [...answer].forEach((letter, i) => {
    if (letter === guess[i]) result[i] = 'correct';
    else remaining[letter] = (remaining[letter] || 0) + 1;
  });
  [...guess].forEach((letter, i) => {
    if (result[i] !== 'correct' && remaining[letter]) {
      result[i] = 'present';
      remaining[letter]--;
    }
  });
  return result;
}

const fail = (code) => { throw new Error(code); };
const uuid = () => crypto.randomUUID();
const terminal = (trial) => ['solved', 'exhausted', 'surrendered'].includes(trial?.status);

export function createSession(language, materials, now = Date.now() / 1000, random = Math.random) {
  const block = materials.manifest.languages[language];
  if (!block) fail('invalid_language');
  const set = random() < 0.5 ? 'A' : 'B';
  const words = Object.entries(block.sets[set]).flatMap(([category, words]) => words.map(word => ({word, category})));
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
  return {
    schema: 1, edition: 'browser-local', id: uuid(), language, set_name: set,
    manifest_version: materials.manifest.version, created_at: now,
    phase: 'onboarding', version: 0, current: 0, started_at: null,
    deadline_at: null, ended_at: null, end_reason: null, requests: {},
    trials: [{word: block.practice, category: 'practice'}, ...words].map((item, position) => ({
      ...item, id: uuid(), position, practice: position === 0, status: 'not_started',
      started_at: null, ended_at: null, ready_at: null, guesses: []
    }))
  };
}

export function expire(session, now) {
  if (session.phase !== 'playing' || now < session.deadline_at) return false;
  for (const trial of session.trials) {
    if (trial.status === 'active') {
      trial.status = 'time_expired';
      trial.ended_at = session.deadline_at;
      for (const guess of trial.guesses) if (guess.confidence_status === 'pending') {
        guess.confidence_status = guess.confidence_value === null ? 'missing' : 'unfinished';
        guess.confidence_ended_at = session.deadline_at;
      }
    } else if (trial.status === 'not_started') trial.status = 'not_reached';
  }
  Object.assign(session, {phase: 'debrief', ended_at: session.deadline_at, end_reason: 'time_expired', version: session.version + 1});
  return true;
}

export function snapshot(session, now) {
  const trial = session.trials[session.current];
  return {
    id: session.id, language: session.language, phase: session.phase, version: session.version,
    server_now: now, deadline_at: session.deadline_at, ended_at: session.ended_at,
    end_reason: session.end_reason, total_seconds: 6000, total_rounds: 20,
    lock_greens: false, scores_need_recalculation: true,
    trial: trial.started_at === null ? null : {
      id: trial.id, position: trial.position, practice: trial.practice, status: trial.status,
      guesses: structuredClone(trial.guesses), remaining: 10 - trial.guesses.length,
      can_surrender: trial.status === 'active' && trial.guesses.length >= 6 && !trial.guesses.some(g => g.confidence_status === 'pending'),
      greens: Array(5).fill(null), answer: terminal(trial) ? trial.word : null
    },
    summary: {
      solved: session.trials.filter(t => !t.practice && t.status === 'solved').length,
      started: session.trials.filter(t => !t.practice && t.started_at !== null).length,
      guesses: session.trials.filter(t => !t.practice).reduce((sum, t) => sum + t.guesses.length, 0)
    }
  };
}

export function applyAction(session, body, vocabulary, now = Date.now() / 1000) {
  expire(session, now);
  const fingerprint = JSON.stringify(body);
  if (!body.request_id || typeof body.request_id !== 'string') fail('invalid_request');
  if (Object.hasOwn(session.requests, body.request_id)) {
    if (session.requests[body.request_id] !== fingerprint) fail('request_conflict');
    return;
  }
  if (body.action !== 'confidence_draft' && body.version !== session.version) fail('state_changed');
  const trial = session.trials[session.current];
  const pending = trial.guesses.find(g => g.confidence_status === 'pending');
  const activate = (trial) => Object.assign(trial, {status: 'active', started_at: now, ready_at: now});
  const active = () => {
    if (!['practice', 'playing'].includes(session.phase) || trial.status !== 'active') fail('state_changed');
  };
  const duration = (key, start) => {
    const value = body[key] ?? Math.max(0, (now - start) * 1000);
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1e10) fail('invalid_response');
    return value;
  };
  switch (body.action) {
    case 'practice':
      if (session.phase !== 'onboarding') fail('state_changed');
      session.phase = 'practice'; activate(trial); break;
    case 'start':
      if (session.phase !== 'ready') fail('state_changed');
      Object.assign(session, {phase: 'playing', current: 1, started_at: now, deadline_at: now + 6000});
      activate(session.trials[1]); break;
    case 'next':
      if (!['practice', 'playing', 'block_done'].includes(session.phase) || !terminal(trial)) fail('state_changed');
      if (trial.practice) session.phase = 'ready';
      else if (trial.position === 20) session.phase = 'debrief';
      else activate(session.trials[++session.current]);
      break;
    case 'finish':
      if (session.phase !== 'debrief') fail('state_changed');
      session.phase = 'complete'; session.completed_at = now; break;
    case 'guess': {
      active();
      if (pending || trial.guesses.length >= 10) fail('state_changed');
      const word = normalizeWord(body.word, session.language);
      if (!word) fail('five_letters');
      if (!vocabulary.has(word)) fail('invalid_word');
      const rt = duration('guess_rt_ms', trial.ready_at);
      trial.guesses.push({id: uuid(), number: trial.guesses.length + 1, word, submitted_at: now,
        guess_rt_ms: rt, confidence_value: null, confidence_status: 'pending', draft_seq: -1, feedback: null});
      break;
    }
    case 'confidence_draft':
    case 'confidence': {
      const late = body.action === 'confidence_draft' && body.frozen === true && session.end_reason === 'time_expired';
      if (!late) active();
      const target = late ? trial.guesses.at(-1) : pending;
      if (!target || target.id !== body.guess_id || (late && !['unfinished', 'missing'].includes(target.confidence_status))) fail('state_changed');
      if (!Number.isInteger(body.value) || body.value < 0 || body.value > 10) fail('choose_confidence');
      const rt = duration('confidence_rt_ms', target.submitted_at);
      if (body.action === 'confidence_draft') {
        if (!Number.isInteger(body.seq) || body.seq < 0 || body.seq > 1e6) fail('invalid_request');
        if (body.seq > target.draft_seq) Object.assign(target, {confidence_value: body.value, draft_seq: body.seq,
          confidence_rt_ms: rt, confidence_status: late ? 'unfinished' : 'pending', draft_received_late: late});
      } else {
        Object.assign(target, {confidence_value: body.value, confidence_status: 'confirmed', confidence_rt_ms: rt,
          confidence_ended_at: now, feedback: feedback(trial.word, target.word)});
        trial.status = target.word === trial.word ? 'solved' : target.number === 10 ? 'exhausted' : 'active';
        trial.ready_at = now;
        if (terminal(trial)) trial.ended_at = now;
      }
      break;
    }
    case 'surrender':
      active();
      if (pending || trial.guesses.length < 6) fail('surrender_locked');
      trial.status = 'surrendered'; trial.ended_at = now; break;
    default: fail('invalid_request');
  }
  if (trial.position === 20 && terminal(trial) && ['confidence', 'surrender'].includes(body.action)) {
    Object.assign(session, {phase: 'block_done', ended_at: now, end_reason: 'rounds_completed'});
  }
  session.version++;
  session.requests[body.request_id] = fingerprint;
}

export function exportResults(session, now = Date.now() / 1000) {
  const result = structuredClone(session);
  delete result.requests;
  result.exported_at = now;
  result.summary = snapshot(session, now).summary;
  return result;
}
