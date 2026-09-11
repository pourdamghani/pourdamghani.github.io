import {createSession, applyAction, expire, snapshot, exportResults} from './engine.mjs';

export const sessionKey = language => `wordle-pages:v1:${language}`;
let materialsPromise;
let storageAvailable = true;
const memory = new Map();

async function materials() {
  if (!materialsPromise) materialsPromise = fetch(new URL('./materials.json', import.meta.url))
    .then(response => { if (!response.ok) throw new Error('load_error'); return response.json(); })
    .then(data => ({...data, vocabularies: Object.fromEntries(Object.entries(data.words).map(([lang, words]) => [lang, new Set(words)]))}))
    .catch(error => { materialsPromise = null; throw error; });
  return materialsPromise;
}

function read(key) {
  let text;
  try { text = localStorage.getItem(key); }
  catch { storageAvailable = false; return memory.get(key) ?? null; }
  if (!storageAvailable) return memory.get(key) ?? null;
  if (!text) return null;
  try {
    const session = JSON.parse(text);
    if (session.schema !== 1 || !Array.isArray(session.trials) || session.trials.length !== 21 ||
      !Number.isInteger(session.current) || !session.trials[session.current] || !session.requests) throw new Error();
    return session;
  } catch { throw new Error('saved_data_error'); }
}

function write(key, session) {
  memory.set(key, session);
  try { localStorage.setItem(key, JSON.stringify(session)); }
  catch { storageAvailable = false; }
}

export async function request(operation, language, body = {}) {
  const data = await materials();
  const key = sessionKey(language);
  const transaction = () => {
    let session = body.fresh ? null : read(key);
    if (!session) session = createSession(language, data);
    const now = Date.now() / 1000;
    expire(session, now);
    let error;
    if (operation === 'action') {
      if (body.session_id !== session.id) error = 'state_changed';
      else {
        const next = structuredClone(session);
        try { applyAction(next, body, data.vocabularies[language], now); session = next; }
        catch (failure) { error = failure.message; }
      }
    }
    write(key, session);
    if (operation === 'export') return exportResults(session, now);
    return {state: {...snapshot(session, now), storage_available: storageAvailable}, error};
  };
  // Serialize read/modify/write across tabs where Web Locks are supported.
  return navigator.locks ? navigator.locks.request(key, transaction) : transaction();
}

export async function downloadResults(language, format) {
  const result = await request('export', language);
  let content = JSON.stringify(result, null, 2), type = 'application/json';
  if (format === 'csv') {
    const rows = [['session_id', 'edition', 'language', 'set', 'round', 'practice', 'category', 'outcome', 'answer',
      'guess_number', 'guess', 'confidence', 'confidence_status', 'feedback', 'guess_rt_ms', 'confidence_rt_ms']];
    for (const trial of result.trials) for (const guess of trial.guesses.length ? trial.guesses : [{}]) {
      rows.push([result.id, result.edition, language, result.set_name, trial.position, trial.practice, trial.category,
        trial.status, trial.word, guess.number, guess.word, guess.confidence_value, guess.confidence_status,
        guess.feedback?.join(' '), guess.guess_rt_ms, guess.confidence_rt_ms]);
    }
    content = '\uFEFF' + rows.map(row => row.map(value => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n');
    type = 'text/csv;charset=utf-8';
  }
  const url = URL.createObjectURL(new Blob([content], {type}));
  const link = document.createElement('a');
  link.href = url; link.download = `wordle-${language}-${result.id}.${format}`;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
