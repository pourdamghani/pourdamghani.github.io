export const translations = {
  en: {
    title: 'Word study', welcome: 'Welcome to the word study', intro: 'Find a hidden five-letter word. After each guess, tell us how confident you are before you see the clues.',
    preview: 'Preview only — these responses are not part of a Prolific study.',
    instructions: 'How the study works', rules: [
      'Complete one practice word, followed by 20 study words. Practice is unscored and uses the same timer.',
      'You have 100 minutes for all 20 study words together. There is no separate time limit for a word. The timer keeps running if you leave the page.',
      'You may submit up to 10 valid guesses per word. Words outside the study dictionary do not use a guess.',
      'After each valid guess, rate the chance that this exact guess is the hidden word, from 0 (0%) to 10 (100%). Feedback appears only after you confirm your rating.',
      'You may give up a word before making any guesses. This counts as an unsuccessful round.',
      'Use only this game, without dictionaries, solvers, or help from another person. You may stop participating at any time.'
    ],
    standard: 'You may try words that do not reuse earlier clues. Green letters are not copied into the next guess.',
    locked: 'Green letters are copied and locked in their correct positions. Other letters remain editable.',
    spelling: 'Use five letters A–Z. Accented spellings are not included in this study dictionary.',
    consentTitle: 'Taking part', consentInfo: 'We record your language background, guesses, confidence ratings, response times, and study progress. Your Prolific identifiers link your responses to your submission. We do not ask for your name.',
    previewConsent: 'This preview uses demonstration consent information. Approved study-specific information is required before recruitment.',
    consent: 'I have read the study information and agree to participate.', background: 'Language background', nativeLanguages: 'Native language(s)', proficiency: 'English proficiency', choose: 'Select an option', fluent: 'Fluent', native: 'Native / bilingual from childhood', notFluent: 'Not fluent', experience: 'How often have you played Wordle?', never: 'Never', occasionally: 'Occasionally', regularly: 'Regularly',
    check: 'Check your understanding', checkGuesses: 'How many valid guesses may you make per word?', checkConfidence: 'When do you rate your confidence?', before: 'Before the clues appear', after: 'After the clues appear', checkSurrender: 'After how many guesses does giving up become available?',
    startPractice: 'Start practice', practice: 'Practice · unscored', ready: 'Ready for the study?', readyText: 'The practice is finished. Start when you are ready: the 100-minute timer begins with the first study word and will keep running until the block ends.', start: 'Start the 20 study words', notStarted: 'Not started', untimed: 'Untimed', round: 'Round', of: 'of', guessesLeft: 'guesses left',
    typeWord: 'Type a five-letter word', board: 'Wordle board', submit: 'Submit guess', delete: 'Delete', keyboard: 'Letter keyboard', guess: 'Guess', lockedLetter: 'locked', correct: 'correct position', present: 'in the word, different position', absent: 'not matched in the word', noFeedback: 'feedback not yet shown', legendCorrect: 'Correct position', legendPresent: 'Different position', legendAbsent: 'Not matched',
    confidence: 'How confident are you that this guess is the hidden word?', confidenceInstruction: 'Choose a value before revealing the clues.', notSelected: 'No rating selected', selectRating: 'Choose a value', confirm: 'Confirm confidence & show clues', chance: 'chance of being correct',
    solved: 'You found the word.', exhausted: 'You have used all 10 guesses.', surrendered: 'You gave up this word.', answer: 'The word was', next: 'Next word', practiceDone: 'Finish practice', blockDone: 'Finish study', surrender: 'Give up this word', surrenderHelp: 'Available from the start of each word. Confirm any pending confidence rating first.', surrenderConfirm: 'Give up this word? It will count as an unsuccessful round.',
    saved: 'Saved', saving: 'Saving…', offline: 'Connection interrupted. Your pending response is saved on this device. The study timer continues. Reconnect to continue.', retry: 'Retry connection',
    offlineMemory: 'Connection interrupted. Keep this page open: browser storage is unavailable, so your pending response cannot survive a refresh. The study timer continues.',
    debrief: 'Thank you for taking part', debriefText: 'This study examines word solving, confidence, and how performance changes over a session. The difficulty scores are estimates and do not determine how well you should perform.', expiry: 'The study time has ended. Your saved responses will be included, and words you did not reach are recorded separately.', finishing: 'Saving the end of your study…', redirect: 'Your responses are saved. You will return to Prolific shortly.', return: 'Return to Prolific', code: 'Completion code', previewDone: 'This preview is complete. No submission was sent to Prolific.', restart: 'Start a new preview', contact: 'Study contact',
    errors: {invalid_language: 'This language route is not available.', invalid_ids: 'The Prolific link could not be verified. Open the study from your Prolific submission.', wrong_study: 'This Prolific link does not belong to this language study.', prolific_unavailable: 'Prolific verification is temporarily unavailable. Please retry; the study timer has not started.', preview_ids: 'This is a preview server. Real Prolific links must use the production study address.', duplicate_participation: 'You already have a submission for this study. Open your original study link to resume.', session_required: 'Your session could not be restored. Reload this page or reopen your original Prolific study link.', state_changed: 'The session changed, possibly in another tab or because time expired. The latest saved state is shown.', request_conflict: 'This request conflicts with an earlier response. Reload to restore your session.', consent_required: 'Please read the study information and indicate your consent.', fluency_required: 'This study requires fluency in the played language.', comprehension: 'Please review the instructions and check your three answers.', profile_required: 'Please complete your language background and Wordle experience.', five_letters: 'Enter exactly five letters.', invalid_word: 'This word is not in the study dictionary. No guess was used.', greens_locked: 'Keep the locked green letters in their positions.', choose_confidence: 'Choose a confidence rating from 0 to 10.', invalid_response: 'The response could not be saved. Please retry.', invalid_request: 'The request could not be accepted. Reload to restore your session.', surrender_locked: 'Confirm your pending confidence rating before giving up.'}
  },
  de: {
    title: 'Wortstudie', welcome: 'Willkommen zur Wortstudie', intro: 'Finden Sie ein verborgenes Wort mit fünf Buchstaben. Geben Sie nach jedem Versuch Ihre Sicherheit an, bevor Sie die Hinweise sehen.',
    preview: 'Nur Vorschau — diese Antworten gehören nicht zu einer Prolific-Studie.',
    instructions: 'So funktioniert die Studie', rules: [
      'Bearbeiten Sie ein Übungswort und anschließend 20 Studienwörter. Die Übung wird nicht gewertet und nutzt dieselbe Uhr.',
      'Sie haben insgesamt 100 Minuten für alle 20 Studienwörter. Für einzelne Wörter gibt es kein Zeitlimit. Die Uhr läuft weiter, wenn Sie die Seite verlassen.',
      'Pro Wort sind bis zu 10 gültige Versuche möglich. Wörter außerhalb des Studienwörterbuchs verbrauchen keinen Versuch.',
      'Bewerten Sie nach jedem gültigen Versuch die Wahrscheinlichkeit, dass genau dieses Wort die Lösung ist: von 0 (0 %) bis 10 (100 %). Die Hinweise erscheinen erst nach Ihrer Bestätigung.',
      'Sie können ein Wort schon vor dem ersten Versuch aufgeben. Die Runde zählt dann als nicht gelöst.',
      'Benutzen Sie nur dieses Spiel, ohne Wörterbuch, Lösungsprogramm oder Hilfe anderer Personen. Sie können Ihre Teilnahme jederzeit beenden.'
    ],
    standard: 'Sie dürfen Wörter ausprobieren, die frühere Hinweise nicht verwenden. Grüne Buchstaben werden nicht in die nächste Zeile übernommen.',
    locked: 'Grüne Buchstaben werden an der richtigen Position übernommen und gesperrt. Die anderen Positionen bleiben bearbeitbar.',
    spelling: 'Schreiben Sie Ä als AE, Ö als OE, Ü als UE und ß als SS. Nach dieser Umwandlung muss ein Wort genau fünf Felder belegen.',
    consentTitle: 'Ihre Teilnahme', consentInfo: 'Wir erfassen Ihren Sprachhintergrund, Ihre Versuche, Sicherheitseinschätzungen, Antwortzeiten und Ihren Studienfortschritt. Ihre Prolific-Kennungen verknüpfen die Antworten mit Ihrer Teilnahme. Ihren Namen fragen wir nicht ab.',
    previewConsent: 'Diese Vorschau verwendet beispielhafte Teilnahmeinformationen. Vor der Rekrutierung sind genehmigte studienspezifische Informationen erforderlich.',
    consent: 'Ich habe die Studieninformationen gelesen und stimme der Teilnahme zu.', background: 'Sprachhintergrund', nativeLanguages: 'Muttersprache(n)', proficiency: 'Deutschkenntnisse', choose: 'Bitte auswählen', fluent: 'Fließend', native: 'Muttersprache / seit der Kindheit zweisprachig', notFluent: 'Nicht fließend', experience: 'Wie oft haben Sie Wordle gespielt?', never: 'Noch nie', occasionally: 'Gelegentlich', regularly: 'Regelmäßig',
    check: 'Verständnisfragen', checkGuesses: 'Wie viele gültige Versuche sind pro Wort möglich?', checkConfidence: 'Wann schätzen Sie Ihre Sicherheit ein?', before: 'Bevor die Hinweise erscheinen', after: 'Nachdem die Hinweise erschienen sind', checkSurrender: 'Nach wie vielen Versuchen können Sie ein Wort aufgeben?',
    startPractice: 'Übung starten', practice: 'Übung · ungewertet', ready: 'Bereit für die Studie?', readyText: 'Die Übung ist beendet. Starten Sie, wenn Sie bereit sind: Mit dem ersten Studienwort beginnt die 100-Minuten-Uhr. Sie läuft bis zum Ende des Studienblocks weiter.', start: 'Die 20 Studienwörter starten', notStarted: 'Noch nicht gestartet', untimed: 'Ohne Zeitlimit', round: 'Runde', of: 'von', guessesLeft: 'Versuche übrig',
    typeWord: 'Ein Wort mit fünf Buchstaben eingeben', board: 'Wordle-Spielfeld', submit: 'Versuch absenden', delete: 'Löschen', keyboard: 'Buchstabentastatur', guess: 'Versuch', lockedLetter: 'gesperrt', correct: 'richtige Position', present: 'im Wort, andere Position', absent: 'kein passendes Vorkommen', noFeedback: 'Hinweise noch nicht angezeigt', legendCorrect: 'Richtige Position', legendPresent: 'Andere Position', legendAbsent: 'Kein Treffer',
    confidence: 'Wie sicher sind Sie, dass dieser Versuch das verborgene Wort ist?', confidenceInstruction: 'Wählen Sie einen Wert, bevor Sie die Hinweise ansehen.', notSelected: 'Noch keine Bewertung ausgewählt', selectRating: 'Einen Wert auswählen', confirm: 'Sicherheit bestätigen und Hinweise zeigen', chance: 'Wahrscheinlichkeit für die richtige Lösung',
    solved: 'Sie haben das Wort gefunden.', exhausted: 'Sie haben alle 10 Versuche verbraucht.', surrendered: 'Sie haben dieses Wort aufgegeben.', answer: 'Das Wort war', next: 'Nächstes Wort', practiceDone: 'Übung abschließen', blockDone: 'Studie abschließen', surrender: 'Dieses Wort aufgeben', surrenderHelp: 'Ab Beginn jedes Wortes verfügbar. Bestätigen Sie zuerst eine noch ausstehende Sicherheitseinschätzung.', surrenderConfirm: 'Dieses Wort aufgeben? Die Runde zählt dann als nicht gelöst.',
    saved: 'Gespeichert', saving: 'Wird gespeichert …', offline: 'Verbindung unterbrochen. Ihre ausstehende Antwort ist auf diesem Gerät gespeichert. Die Studienzeit läuft weiter. Stellen Sie die Verbindung wieder her, um fortzufahren.', retry: 'Verbindung erneut versuchen',
    offlineMemory: 'Verbindung unterbrochen. Lassen Sie diese Seite geöffnet: Der Browserspeicher ist nicht verfügbar; beim Neuladen würde Ihre ausstehende Antwort verloren gehen. Die Studienzeit läuft weiter.',
    debrief: 'Vielen Dank für Ihre Teilnahme', debriefText: 'Diese Studie untersucht das Lösen von Wörtern, Sicherheitseinschätzungen und Veränderungen der Leistung im Verlauf einer Sitzung. Die Schwierigkeitswerte sind Schätzungen und legen nicht fest, wie gut Sie abschneiden sollten.', expiry: 'Die Studienzeit ist abgelaufen. Ihre gespeicherten Antworten werden berücksichtigt. Nicht erreichte Wörter werden gesondert erfasst.', finishing: 'Der Abschluss Ihrer Studie wird gespeichert …', redirect: 'Ihre Antworten sind gespeichert. Sie werden gleich zu Prolific zurückgeleitet.', return: 'Zurück zu Prolific', code: 'Abschlusscode', previewDone: 'Die Vorschau ist beendet. Es wurde keine Teilnahme an Prolific übermittelt.', restart: 'Neue Vorschau starten', contact: 'Studienkontakt',
    errors: {invalid_language: 'Diese Sprachversion ist nicht verfügbar.', invalid_ids: 'Der Prolific-Link konnte nicht bestätigt werden. Öffnen Sie die Studie über Ihre Prolific-Teilnahme.', wrong_study: 'Dieser Prolific-Link gehört nicht zu dieser Sprachstudie.', prolific_unavailable: 'Prolific ist vorübergehend nicht erreichbar. Bitte versuchen Sie es erneut. Die Studienzeit hat noch nicht begonnen.', preview_ids: 'Dies ist ein Vorschau-Server. Echte Prolific-Links müssen die Adresse der produktiven Studie verwenden.', duplicate_participation: 'Für Sie besteht bereits eine Teilnahme an dieser Studie. Öffnen Sie Ihren ursprünglichen Studienlink.', session_required: 'Ihre Sitzung konnte nicht wiederhergestellt werden. Laden Sie die Seite neu oder öffnen Sie Ihren ursprünglichen Prolific-Link.', state_changed: 'Die Sitzung hat sich geändert, möglicherweise in einem anderen Tab oder durch Ablauf der Zeit. Sie sehen den aktuellen gespeicherten Stand.', request_conflict: 'Diese Anfrage steht im Konflikt mit einer früheren Antwort. Laden Sie die Seite neu.', consent_required: 'Bitte lesen Sie die Studieninformationen und geben Sie Ihre Zustimmung an.', fluency_required: 'Für diese Studie müssen Sie die Sprache des Spiels fließend beherrschen.', comprehension: 'Bitte lesen Sie die Anleitung erneut und prüfen Sie Ihre drei Antworten.', profile_required: 'Bitte vervollständigen Sie Ihren Sprachhintergrund und Ihre Wordle-Erfahrung.', five_letters: 'Geben Sie genau fünf Buchstaben ein.', invalid_word: 'Dieses Wort ist nicht im Studienwörterbuch. Es wurde kein Versuch verbraucht.', greens_locked: 'Lassen Sie die gesperrten grünen Buchstaben an ihrer Position.', choose_confidence: 'Wählen Sie eine Sicherheit von 0 bis 10.', invalid_response: 'Die Antwort konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.', invalid_request: 'Die Anfrage konnte nicht angenommen werden. Laden Sie die Seite neu.', surrender_locked: 'Bestätigen Sie Ihre ausstehende Sicherheitseinschätzung, bevor Sie aufgeben.'}
  }
};

// Public edition copy: no participant registration or submission to a study.
Object.assign(translations.en, {
  timeRemaining: 'Time remaining', timeAllowance: 'Total time',
  timerStartsWithPractice: 'Starts with practice',
  title: 'Wordle', welcome: 'Wordle with confidence',
  intro: 'Find the hidden five-letter word, then see how well your confidence matches your guesses.',
  instructions: 'How to play',
  ready: 'Continue to the 20 words', start: 'Continue',
  readyText: 'Practice is finished. The timer is still running. Continue with the 20 words; they share the same 100-minute limit with practice.',
  saved: 'Saved on this device', memoryOnly: 'Kept in this tab only',
  storageWarning: 'Browser storage is unavailable. Keep this tab open: reloading or closing it will lose your progress.',
  offline: 'The game could not load or save. Keep this tab open and try again. The timer keeps running.', retry: 'Try again',
  offlineMemory: 'The game could not save. Keep this tab open to retain your progress.',
  debrief: 'Your results', blockDone: 'See results',
  debriefText: 'Compare your guesses with your confidence ratings. Practice is excluded from the totals below.',
  expiry: 'Time is up. Unfinished guesses are not confirmed, and words you did not reach are recorded separately.',
  finishing: 'Preparing your results…', restart: 'Play again',
  completeLocal: 'Your results stay on this device. Download them before starting a new game.',
  wordsSolved: 'words solved', totalGuesses: 'guesses', downloadJSON: 'Download JSON', downloadCSV: 'Download CSV',
  resetConfirm: 'Replace the unreadable saved game and start again?'
});
translations.en.rules[0] = 'Play one practice word, followed by 20 words. Practice uses the same timer but is excluded from your score.';
translations.en.rules[1] = 'You have 100 minutes for practice and all 20 words together. The timer starts when you begin practice and keeps running between words and if you leave the page.';
translations.en.rules[5] = 'Progress and responses are saved in this browser only. No responses are submitted to a research study.';
Object.assign(translations.en.errors, {
  load_error: 'Could not load the word list. Check your connection and try again.',
  saved_data_error: 'The saved game could not be read. You can start a new game below.'
});
Object.assign(translations.de, {
  timeRemaining: 'Verbleibende Zeit', timeAllowance: 'Gesamtzeit',
  timerStartsWithPractice: 'Startet mit der Übung',
  title: 'Wordle', welcome: 'Wordle mit Sicherheitseinschätzung',
  intro: 'Finden Sie das verborgene Wort mit fünf Buchstaben und vergleichen Sie Ihre Sicherheit mit Ihren Versuchen.',
  instructions: 'So funktioniert das Spiel',
  ready: 'Weiter zu den 20 Wörtern', start: 'Weiter',
  readyText: 'Die Übung ist beendet. Die Uhr läuft weiter. Die Übung und die folgenden 20 Wörter teilen sich ein Zeitlimit von 100 Minuten.',
  saved: 'Auf diesem Gerät gespeichert', memoryOnly: 'Nur in diesem Tab gespeichert',
  storageWarning: 'Der Browserspeicher ist nicht verfügbar. Lassen Sie diesen Tab geöffnet: Beim Neuladen oder Schließen geht Ihr Fortschritt verloren.',
  offline: 'Das Spiel konnte nicht geladen oder gespeichert werden. Lassen Sie diesen Tab geöffnet und versuchen Sie es erneut. Die Uhr läuft weiter.', retry: 'Erneut versuchen',
  offlineMemory: 'Das Spiel konnte nicht speichern. Lassen Sie diesen Tab geöffnet, um Ihren Fortschritt zu behalten.',
  debrief: 'Ihre Ergebnisse', blockDone: 'Ergebnisse ansehen',
  debriefText: 'Vergleichen Sie Ihre Versuche mit Ihren Sicherheitseinschätzungen. Die Übung zählt nicht zu den Ergebnissen unten.',
  expiry: 'Die Zeit ist abgelaufen. Unbestätigte Versuche werden nicht gewertet; nicht erreichte Wörter werden gesondert erfasst.',
  finishing: 'Ergebnisse werden vorbereitet …', restart: 'Erneut spielen',
  completeLocal: 'Ihre Ergebnisse bleiben auf diesem Gerät. Laden Sie sie herunter, bevor Sie ein neues Spiel starten.',
  wordsSolved: 'Wörter gelöst', totalGuesses: 'Versuche', downloadJSON: 'JSON herunterladen', downloadCSV: 'CSV herunterladen',
  resetConfirm: 'Den unlesbaren Spielstand ersetzen und neu starten?'
});
translations.de.rules[0] = 'Spielen Sie ein Übungswort und anschließend 20 Wörter. Die Übung nutzt dieselbe Uhr, zählt aber nicht zu Ihrem Ergebnis.';
translations.de.rules[1] = 'Sie haben insgesamt 100 Minuten für die Übung und alle 20 Wörter. Die Uhr startet mit der Übung und läuft zwischen den Wörtern sowie beim Verlassen der Seite weiter.';
translations.de.rules[5] = 'Fortschritt und Antworten werden nur in diesem Browser gespeichert. Es werden keine Antworten an eine Forschungsstudie übermittelt.';
Object.assign(translations.de.errors, {
  load_error: 'Die Wortliste konnte nicht geladen werden. Prüfen Sie Ihre Verbindung und versuchen Sie es erneut.',
  saved_data_error: 'Der Spielstand konnte nicht gelesen werden. Sie können unten ein neues Spiel starten.'
});
