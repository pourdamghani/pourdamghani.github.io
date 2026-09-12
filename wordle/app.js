import { translations } from './i18n.js';
import { request, downloadResults, sessionKey } from './local-store.js';

const lang = document.body.dataset.language;
const t = translations[lang];
const $ = (selector) => document.querySelector(selector);
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let state, signature = '', queue = [], draining = null, frozen = false;
let clockAnchor = { server: 0, local: performance.now() }, entry = [], cursor = 0, draftTimer;
let storageOK = true;
const memory = new Map();
const storage = {
  get(key, fallback = null) {
    if (!storageOK) return memory.get(key) ?? fallback;
    try {
      const value = localStorage.getItem(key);
      const result = value ? JSON.parse(value) : fallback;
      memory.set(key, result);
      return result;
    }
    catch { storageOK = false; return memory.get(key) ?? fallback; }
  },
  set(key, value) {
    memory.set(key, value);
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { storageOK = false; }
  },
  remove(key) { memory.delete(key); try { localStorage.removeItem(key); } catch { storageOK = false; } }
};
const queueKey = () => `wordle:outbox:${state.id}`;
const draftKey = (guess) => `wordle:draft:${state.id}:${guess.id}`;
const entryKey = () => `wordle:entry:${state.id}:${state.trial.id}:${state.trial.guesses.length}`;
const pending = () => state?.trial?.guesses.find(guess => guess.confidence_status === 'pending');
const editing = () => state?.trial?.status === 'active' && ['playing','practice'].includes(state.phase) && !pending() && !frozen && !queue.some(item => item.action !== 'confidence_draft');
const nowServer = () => clockAnchor.server + (performance.now() - clockAnchor.local) / 1000;

function timingKey() {
  const guess = pending();
  return `wordle:timing:${state.id}:${state.trial.id}:${guess ? guess.id : state.trial.guesses.length}:${guess ? 'confidence' : 'guess'}`;
}
let timing = null;
function startTiming() {
  if (!state.trial || state.trial.status !== 'active') return;
  const key = timingKey();
  if (timing?.key === key) return;
  const prior = storage.get(key);
  timing = { key, local: performance.now(), base: prior ? Math.max(0, Date.now() - prior) : 0 };
  if (prior === null) storage.set(key, Date.now());
}
function elapsed() { return timing ? timing.base + performance.now() - timing.local : 0; }
function message(text, retry = false) {
  $('#message').textContent = text;
  $('#retry').textContent = t.retry;
  $('#retry').hidden = !retry;
}

function receive(next, sentAt = performance.now()) {
  if (state && next.id === state.id && next.version < state.version) return;
  const changedSession = state?.id !== next.id;
  state = next;
  clockAnchor = { server: next.server_now + Math.max(0, performance.now() - sentAt)/2000, local: performance.now() };
  if (changedSession) { signature = ''; frozen = false; timing = null; document.body.classList.remove('expired'); }
  if (state.phase === 'block_done') frozen = false;
  $('#storage-warning').hidden = next.storage_available && storageOK;
  $('#storage-warning').textContent = t.storageWarning;
  render();
  tick();
  // A suspended tab may first learn about expiry when its saved state is read.
  // Preserve its last explicit choice for audit without confirming it.
  if (state.end_reason === 'time_expired') {
    const last = state.trial?.guesses.at(-1);
    const draft = last && storage.get(draftKey(last));
    if (draft && ['unfinished','missing'].includes(last.confidence_status) && draft.seq > last.draft_seq && !queue.some(item => item.guess_id === last.id && item.frozen)) {
      action('confidence_draft', {guess_id:last.id, ...draft, frozen:true, confidence_rt_ms:elapsed()});
    }
  }
}

async function drain() {
  if (draining) return draining;
  draining = (async () => {
    while (queue.length) {
      const item = queue[0];
      if (item.version === null) {
        item.version = state.version;
        storage.set(queueKey(), queue);
      }
      updateControls();
      const sentAt = performance.now();
      let result;
      try {
        result = await request('action', lang, item);
      } catch {
        message(storageOK ? t.offline : t.offlineMemory, true);
        return false;
      }
      queue.shift();
      storage.set(queueKey(), queue);
      if (result.state) receive(result.state, sentAt);
      if (result.error) message(t.errors[result.error] || t.errors.invalid_response);
      else if (!queue.length) message('');
    }
    return true;
  })();
  try { return await draining; }
  finally { draining = null; updateControls(); }
}

async function action(name, fields = {}) {
  // A request retains its exact ID and body across uncertain network retries.
  queue.push({action:name, language:lang, session_id:state.id, request_id:crypto.randomUUID(), version:null, ...fields});
  storage.set(queueKey(), queue);
  updateControls();
  return drain();
}

async function poll() {
  if (!state || draining) return;
  if (queue.length) { await drain(); return; }
  const sentAt = performance.now();
  try {
    const result = await request('state', lang);
    receive(result.state, sentAt);
  } catch { message(t.offline, true); }
}

function tick() {
  if (!state) return;
  $('#progress').textContent = state.phase === 'practice' ? t.practice : ['playing','block_done'].includes(state.phase) ? `${t.round} ${state.trial.position} ${t.of} 20` : '';
  $('#timer-label').textContent = state.deadline_at ? t.timeRemaining : t.timeAllowance;
  $('#timer-status').textContent = state.deadline_at ? '' : t.timerStartsWithPractice;
  $('#timer-status').hidden = Boolean(state.deadline_at);
  const seconds = state.deadline_at
    ? Math.max(0, Math.ceil(state.deadline_at - (state.ended_at ?? nowServer())))
    : state.total_seconds;
  $('#timer').textContent = `${String(Math.floor(seconds / 60)).padStart(2,'0')}:${String(seconds % 60).padStart(2,'0')}`;
  if (state.deadline_at) {
    if (seconds === 0 && ['practice', 'ready', 'playing'].includes(state.phase) && !frozen) freezeAtDeadline();
  }
}

function freezeAtDeadline() {
  frozen = true;
  document.body.classList.add('expired');
  clearTimeout(draftTimer);
  const guess = pending();
  if (guess) {
    const draft = storage.get(draftKey(guess));
    if (draft && Number.isInteger(draft.value)) {
      action('confidence_draft', {guess_id:guess.id, value:draft.value, seq:draft.seq+1, frozen:true, confidence_rt_ms:elapsed()});
    }
  }
  updateControls();
  poll();
}

function legend() {
  return `<div class="legend"><span><i class="swatch correct"></i>${t.legendCorrect}</span><span><i class="swatch present"></i>${t.legendPresent}</span><span><i class="swatch absent"></i>${t.legendAbsent}</span></div>`;
}

function renderBoard() {
  const trial = state.trial;
  const editableRow = trial.guesses.length;
  $('#board').innerHTML = Array.from({length:10}, (_, row) => {
    const guess = trial.guesses[row];
    return `<div class="board-row" role="row" aria-label="${t.guess} ${row+1}">${Array.from({length:5}, (_, col) => {
      const active = !guess && row === editableRow && trial.status === 'active';
      const letter = guess ? guess.word[col] : active ? (entry[col] || '') : '';
      const status = guess?.feedback?.[col];
      const locked = active && trial.greens[col];
      return `<div class="cell ${status || ''} ${active ? 'current' : ''} ${active && col === cursor && editing() ? 'cursor' : ''} ${locked ? 'locked' : ''}" role="gridcell" data-column="${col}" data-active="${active}" aria-label="${esc(letter)} ${status ? t[status] : guess ? t.noFeedback : ''} ${locked ? t.lockedLetter : ''}">${esc(letter)}</div>`;
    }).join('')}</div>`;
  }).join('');
  $('#board').querySelectorAll('[data-active="true"]').forEach(cell => cell.addEventListener('click', () => {
    const index = Number(cell.dataset.column);
    if (editing() && !trial.greens[index]) { cursor = index; renderBoard(); $('#board').focus(); }
  }));
}

function renderGame() {
  const trial = state.trial;
  entry = storage.get(entryKey(), [...trial.greens]);
  if (!Array.isArray(entry) || entry.length !== 5) entry = [...trial.greens];
  entry = entry.map((letter, index) => trial.greens[index] || (/^[A-Z]$/.test(letter || '') ? letter : null));
  cursor = entry.findIndex((letter,index) => !letter && !trial.greens[index]);
  if (cursor < 0) cursor = Math.max(0, trial.greens.findIndex(letter => !letter));
  $('#main').innerHTML = `<section class="game"><div id="board" class="board" role="grid" tabindex="0" aria-label="${t.board}"></div><div class="controls"><div id="round-panel"></div><div id="keyboard" class="keyboard" aria-label="${t.keyboard}"></div>${legend()}<div class="surrender"><button id="surrender" class="secondary">${t.surrender}</button></div><div id="save-status" class="save-status" aria-live="polite"></div></div></section>`;
  renderBoard();
  const guess = pending();
  $('#keyboard').hidden = Boolean(guess) || trial.status !== 'active';
  $('#surrender').parentElement.hidden = Boolean(guess) || trial.status !== 'active';
  if (guess) {
    $('#round-panel').innerHTML = `<section class="confidence-panel"><h2 id="confidence-question">${t.confidence}</h2><p>${t.confidenceInstruction}</p><output id="rating-output" for="confidence-range">${t.selectRating}</output><input type="range" min="0" max="10" step="1" value="5" id="confidence-range" class="unselected" aria-labelledby="confidence-question" aria-valuetext="${t.notSelected}"><div class="range-labels"><span>0 · 0%</span><span>5 · 50%</span><span>10 · 100%</span></div><button id="confirm-confidence" disabled>${t.confirm}</button></section>`;
    const chooseRating = event => {
      if (frozen) return;
      const old = storage.get(draftKey(guess));
      if (old?.value === Number(event.target.value)) return;
      const draft = {value:Number(event.target.value), seq:Math.max(old?.seq ?? -1, guess.draft_seq)+1};
      storage.set(draftKey(guess), draft);
      paintRating();
      clearTimeout(draftTimer);
      draftTimer = setTimeout(() => action('confidence_draft', {guess_id:guess.id, ...draft, confidence_rt_ms:elapsed()}), 150);
    };
    $('#confidence-range').addEventListener('input', chooseRating);
    // Clicking the native slider's initial midpoint may not emit an input event.
    $('#confidence-range').addEventListener('pointerup', chooseRating);
    $('#confirm-confidence').addEventListener('click', () => {
      const draft = storage.get(draftKey(guess));
      if (!draft || frozen) return;
      clearTimeout(draftTimer);
      action('confidence', {guess_id:guess.id, value:draft.value, confidence_rt_ms:elapsed()});
    });
    paintRating();
  } else if (trial.status !== 'active') {
    $('#round-panel').innerHTML = `<section class="result"><h2>${t[trial.status] || t.expiry}</h2>${trial.answer ? `<p>${t.answer}</p><p class="answer">${esc(trial.answer)}</p>` : ''}<button id="next">${trial.practice ? t.practiceDone : trial.position === 20 ? t.blockDone : t.next}</button></section>`;
    $('#next').addEventListener('click', () => action('next'));
  } else $('#round-panel').innerHTML = '';
  const keyStatuses = {};
  const rank = {absent:1,present:2,correct:3};
  for (const prior of trial.guesses) {
    prior.feedback?.forEach((status,index) => {
      const letter = prior.word[index];
      if ((rank[keyStatuses[letter]] || 0) < rank[status]) keyStatuses[letter] = status;
    });
  }
  const rows = lang === 'de' ? ['QWERTZUIOP','ASDFGHJKL','YXCVBNM'] : ['QWERTYUIOP','ASDFGHJKL','ZXCVBNM'];
  $('#keyboard').innerHTML = rows.map(row => `<div class="keyboard-row">${[...row].map(letter => `<button class="key ${keyStatuses[letter] || ''}" data-letter="${letter}" aria-label="${letter} ${keyStatuses[letter] ? t[keyStatuses[letter]] : ''}">${letter}</button>`).join('')}</div>`).join('') + `<div class="keyboard-actions"><button id="submit-guess">${t.submit}</button><button id="delete-letter" class="secondary">${t.delete}</button></div>`;
  document.querySelectorAll('[data-letter]').forEach(button => button.addEventListener('click', () => writeLetters(button.dataset.letter)));
  $('#submit-guess').addEventListener('click', submitGuess);
  $('#delete-letter').addEventListener('click', deleteLetter);
  $('#surrender').addEventListener('click', () => { if (!frozen && window.confirm(t.surrenderConfirm)) action('surrender'); });
  startTiming();
}

function paintRating() {
  const guess = pending();
  if (!guess || !$('#confidence-range')) return;
  let draft = storage.get(draftKey(guess));
  if (guess.confidence_value !== null && (!draft || guess.draft_seq > draft.seq)) {
    draft = {value:guess.confidence_value, seq:guess.draft_seq};
    storage.set(draftKey(guess), draft);
  }
  if (draft && Number.isInteger(draft.value)) {
    $('#confidence-range').value = draft.value;
    $('#confidence-range').classList.remove('unselected');
    $('#confidence-range').setAttribute('aria-valuetext', `${draft.value} / 10, ${draft.value*10}%`);
    $('#rating-output').textContent = `${draft.value} / 10 — ${draft.value*10}% ${t.chance}`;
  }
  updateControls();
}

function updateControls() {
  const busy = queue.some(item => item.action !== 'confidence_draft');
  document.querySelectorAll('#keyboard button').forEach(button => { button.disabled = !editing(); });
  if ($('#surrender')) $('#surrender').disabled = !state.trial.can_surrender || frozen || busy;
  if ($('#next')) $('#next').disabled = busy || frozen;
  if ($('#start')) $('#start').disabled = busy || frozen;
  const guess = pending();
  if ($('#confidence-range')) $('#confidence-range').disabled = frozen || busy;
  if ($('#confirm-confidence')) $('#confirm-confidence').disabled = frozen || busy || !storage.get(draftKey(guess));
  if ($('#save-status')) $('#save-status').textContent = queue.length ? t.saving : state.storage_available && storageOK ? t.saved : t.memoryOnly;
}

function render() {
  const nextSignature = JSON.stringify([state.id,state.phase,state.trial?.id,state.trial?.status,state.trial?.guesses.map(g => [g.id,g.confidence_status])]);
  if (nextSignature === signature) { paintRating(); updateControls(); return; }
  signature = nextSignature;
  clearTimeout(draftTimer);
  if (state.phase === 'ready') {
    action('start');
  } else if (['practice','playing','block_done'].includes(state.phase)) renderGame();
  else {
    $('#main').innerHTML = `<section class="debrief"><h2>${t.debrief}</h2>${state.end_reason === 'time_expired' ? `<p>${t.expiry}</p>` : ''}<p>${t.debriefText}</p><p id="completion-status">${t.finishing}</p><div id="completion-actions"></div></section>`;
    if (state.phase === 'debrief') setTimeout(() => action('finish'), 0);
    else {
      $('#completion-status').textContent = `${state.summary.solved} / 20 ${t.wordsSolved} · ${state.summary.guesses} ${t.totalGuesses}`;
      $('#completion-actions').innerHTML = `<p>${t.completeLocal}</p><div class="links"><button id="download-json">${t.downloadJSON}</button><button id="download-csv" class="secondary">${t.downloadCSV}</button><button id="restart" class="secondary">${t.restart}</button></div>`;
      $('#download-json').addEventListener('click', () => downloadResults(lang, 'json').catch(() => message(t.offline, true)));
      $('#download-csv').addEventListener('click', () => downloadResults(lang, 'csv').catch(() => message(t.offline, true)));
      $('#restart').addEventListener('click', () => boot(true));
    }
  }
  updateControls();
  window.scrollTo({top:0,behavior:'instant'});
}

function writeLetters(text) {
  if (!editing()) return;
  text = text.toUpperCase();
  if (lang === 'de') text = text.replaceAll('Ä','AE').replaceAll('Ö','OE').replaceAll('Ü','UE').replaceAll('ẞ','SS').replaceAll('ß','SS');
  if (!/^[A-Z]+$/.test(text)) return;
  for (const letter of text) {
    while (cursor < 5 && state.trial.greens[cursor]) cursor++;
    if (cursor >= 5) break;
    entry[cursor] = letter;
    cursor++;
    while (cursor < 5 && state.trial.greens[cursor]) cursor++;
  }
  storage.set(entryKey(), entry); renderBoard(); message('');
}
function deleteLetter() {
  if (!editing()) return;
  let index = Math.min(cursor - 1, 4);
  while (index >= 0 && state.trial.greens[index]) index--;
  if (index >= 0) { entry[index] = null; cursor = index; storage.set(entryKey(),entry); renderBoard(); }
}
function submitGuess() {
  if (!editing()) return;
  if (entry.some(letter => !letter)) { message(t.errors.five_letters); return; }
  action('guess', {word:entry.join(''), guess_rt_ms:elapsed()});
}
document.addEventListener('keydown', event => {
  if (!editing() || event.ctrlKey || event.metaKey || event.altKey || /INPUT|SELECT|TEXTAREA/.test(event.target.tagName)) return;
  if (event.key === 'Enter') {
    if (event.target.tagName === 'BUTTON') return;
    event.preventDefault(); submitGuess();
  } else if (event.key === 'Backspace') { event.preventDefault(); deleteLetter(); }
  else if (/^[a-zA-ZäöüÄÖÜßẞ]$/.test(event.key)) { event.preventDefault(); writeLetters(event.key); }
});

async function boot(fresh = false) {
  try {
    const previousID = state?.id;
    const sentAt = performance.now();
    const result = await request('session', lang, {fresh});
    if (fresh && previousID) {
      // Remove only this edition's per-session UI drafts and timing entries.
      try {
        for (const key of Object.keys(localStorage)) if (key.startsWith('wordle:') && key.includes(previousID)) storage.remove(key);
      } catch { storageOK = false; }
    }
    queue = storage.get(`wordle:outbox:${result.state.id}`, []);
    receive(result.state, sentAt);
    await drain();
  } catch (error) {
    message(t.errors[error.message] || t.offline, true);
    if (error.message === 'saved_data_error') {
      $('#main').innerHTML = `<section class="prose"><h2>${t.welcome}</h2><button id="recover">${t.restart}</button></section>`;
      $('#recover').addEventListener('click', () => { if (window.confirm(t.resetConfirm)) boot(true); });
    }
  }
}

$('#retry').addEventListener('click', () => state ? (queue.length ? drain() : poll()) : boot());
window.addEventListener('storage', event => {
  if (state && event.key === sessionKey(lang)) poll();
  else if (state && event.key?.startsWith(`wordle:draft:${state.id}`)) paintRating();
});
document.addEventListener('visibilitychange', () => { if (!document.hidden) { tick(); poll(); } });
setInterval(tick, 250);
setInterval(poll, 15000);
boot();
