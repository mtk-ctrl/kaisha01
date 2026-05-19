'use strict';
/* ============================================================
   九九マスター — app.js
   2モード: れんしゅう（段指定）/ タイムアタック（81問全部）
   こたえ方: 4択 / 数字入力
   ============================================================ */

// ===== 九九全データ =====
// {a, b, ans} の形で 2の段〜9の段を生成
function buildKuku(dans) {
  const result = [];
  dans.forEach(a => {
    for (let b = 1; b <= 9; b++) {
      result.push({ a, b, ans: a * b });
    }
  });
  return result;
}

const ALL_KUKU = buildKuku([2,3,4,5,6,7,8,9]);
const DAN_MAP = {};
[2,3,4,5,6,7,8,9].forEach(a => {
  DAN_MAP[a] = buildKuku([a]);
});

// ===== 設定状態 =====
const cfg = {
  mode: 'practice',    // 'practice' | 'attack'
  dan: 'all',          // 'all' | 2〜9
  ansMode: '4choice',  // '4choice' | 'input'
  count: 18,           // 問題数（れんしゅうのみ）
  attackAnsMode: '4choice',
};

// ===== ゲーム状態 =====
const G = {
  questions: [],
  idx: 0,
  score: 0,
  combo: 0,
  maxCombo: 0,
  log: [],
  inputVal: '',
  answered: false,
  // タイムアタック
  isAttack: false,
  startTime: 0,
  elapsed: 0,
  timerInterval: null,
};

// ===== 音声 =====
function speak(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ja-JP'; u.rate = 0.9; u.pitch = 1.1;
  if (typeof SpeechUtil !== 'undefined') {
    const v = SpeechUtil.getVoice();
    if (v) u.voice = v;
  }
  window.speechSynthesis.speak(u);
}

// ===== 画面切替 =====
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + name);
  if (el) el.classList.add('active');
  if (name === 'records') renderRecords();
}

// ===== セットアップ =====
function selectDan(btn) {
  document.querySelectorAll('.dan-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  cfg.dan = btn.dataset.dan === 'all' ? 'all' : parseInt(btn.dataset.dan, 10);
}

function selectAnsMode(btn) {
  document.querySelectorAll('#ans-mode-btns .ans-mode-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  cfg.ansMode = btn.dataset.mode;
}

function selectAnsModeAttack(btn) {
  document.querySelectorAll('#ans-mode-btns-attack .ans-mode-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  cfg.attackAnsMode = btn.dataset.mode;
}

function selectCount(type, btn) {
  document.querySelectorAll('#count-btns-dan .count-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  cfg.count = parseInt(btn.dataset.count, 10);
}

// ===== 問題生成 =====
function buildQuestions(pool, count) {
  // poolをシャッフルして足りなければ繰り返す
  let qs = [];
  while (qs.length < count) {
    qs = qs.concat(shuffle([...pool]));
  }
  return qs.slice(0, count).map(q => ({ ...q }));
}

function makeChoices4(correct) {
  // 全九九の答えから外れを3つ選ぶ
  const all = [...new Set(ALL_KUKU.map(q => q.ans))].filter(v => v !== correct);
  const distractors = shuffle(all).slice(0, 3);
  return shuffle([correct, ...distractors]);
}

// ===== ゲーム開始 =====
function startPractice() {
  cfg.mode = 'practice';
  const pool = cfg.dan === 'all' ? ALL_KUKU : DAN_MAP[cfg.dan];
  G.questions = buildQuestions(pool, cfg.count);
  G.questions.forEach(q => { q.choices = makeChoices4(q.ans); });
  initGame(false, cfg.ansMode);
}

function startAttack() {
  cfg.mode = 'attack';
  // 全81問をシャッフル
  G.questions = shuffle([...ALL_KUKU]).map(q => ({
    ...q,
    choices: makeChoices4(q.ans),
  }));
  initGame(true, cfg.attackAnsMode);
}

function restartSame() {
  if (G.isAttack) startAttack();
  else startPractice();
}

function initGame(isAttack, ansMode) {
  G.idx = 0;
  G.score = 0;
  G.combo = 0;
  G.maxCombo = 0;
  G.log = [];
  G.inputVal = '';
  G.answered = false;
  G.isAttack = isAttack;
  G.elapsed = 0;

  // こたえ方の表示切替
  const use4choice = ansMode === '4choice';
  document.getElementById('area-4choice').style.display = use4choice ? '' : 'none';
  document.getElementById('area-input').style.display   = use4choice ? 'none' : '';

  // タイマー表示
  const timerDisp = document.getElementById('timer-disp');
  if (isAttack) {
    timerDisp.classList.remove('hidden');
    G.startTime = Date.now();
    if (G.timerInterval) clearInterval(G.timerInterval);
    G.timerInterval = setInterval(() => {
      const sec = ((Date.now() - G.startTime) / 1000).toFixed(1);
      document.getElementById('timer-num').textContent = sec;
    }, 100);
  } else {
    timerDisp.classList.add('hidden');
    if (G.timerInterval) clearInterval(G.timerInterval);
  }

  showScreen('game');
  renderQuestion();
}

// ===== 問題描画 =====
function renderQuestion() {
  const q = G.questions[G.idx];
  const total = G.questions.length;

  // プログレス
  document.getElementById('game-progress-fill').style.width = (G.idx / total * 100) + '%';
  document.getElementById('g-current').textContent = G.idx + 1;
  document.getElementById('g-total').textContent = total;
  document.getElementById('g-score').textContent = G.score;

  // コンボ
  const comboBadge = document.getElementById('combo-badge');
  if (G.combo >= 2) {
    comboBadge.classList.remove('hidden');
    document.getElementById('combo-num').textContent = G.combo;
  } else {
    comboBadge.classList.add('hidden');
  }

  // 計算式
  document.getElementById('eq-left').textContent = q.a;
  document.getElementById('eq-right').textContent = q.b;

  // 4択ボタン
  const use4choice = document.getElementById('area-4choice').style.display !== 'none';
  if (use4choice) {
    const btns = document.querySelectorAll('.choice-btn');
    btns.forEach((btn, i) => {
      btn.textContent = q.choices[i];
      btn.className = 'choice-btn';
      btn.disabled = false;
    });
  } else {
    // 入力モード
    G.inputVal = '';
    G.answered = false;
    document.getElementById('numpad-display').textContent = '?';
  }

  // フィードバック非表示
  document.getElementById('feedback-overlay').classList.add('hidden');

  // 音声
  speak(q.a + ' かける ' + q.b + ' は？');
}

// ===== 4択 回答 =====
function answer(idx) {
  if (G.answered) return;
  const q = G.questions[G.idx];
  const chosen = q.choices[idx];
  const ok = chosen === q.ans;
  G.answered = true;

  // ボタン視覚
  document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
  document.getElementById('c' + idx).classList.add(ok ? 'correct' : 'wrong');
  if (!ok) {
    const ci = q.choices.indexOf(q.ans);
    document.getElementById('c' + ci).classList.add('correct');
  }

  processAnswer(ok, chosen, q);
}

// ===== 数字入力 =====
function numpadPress(n) {
  if (G.answered) return;
  if (G.inputVal.length >= 2) return; // 最大2桁
  G.inputVal += n;
  document.getElementById('numpad-display').textContent = G.inputVal;
}
function numpadDelete() {
  if (G.answered) return;
  G.inputVal = G.inputVal.slice(0, -1);
  document.getElementById('numpad-display').textContent = G.inputVal || '?';
}
function numpadConfirm() {
  if (G.answered || !G.inputVal) return;
  G.answered = true;
  const q = G.questions[G.idx];
  const chosen = parseInt(G.inputVal, 10);
  const ok = chosen === q.ans;

  document.getElementById('numpad-display').textContent = G.inputVal;
  document.getElementById('numpad-display').style.color = ok ? '#22c55e' : '#ef4444';

  processAnswer(ok, chosen, q);
}

// ===== 正誤処理 =====
function processAnswer(ok, chosen, q) {
  if (ok) {
    G.combo++;
    if (G.combo > G.maxCombo) G.maxCombo = G.combo;
    const comboBonus = Math.min(G.combo - 1, 9) * 10;
    G.score += 100 + comboBonus;
  } else {
    G.combo = 0;
  }

  G.log.push({ q, chosen, ok });

  showFeedback(ok, q);
  if (!ok || G.combo < 3) {
    speak(ok ? 'せいかい！' : q.a + ' かける ' + q.b + ' は ' + q.ans);
  } else {
    speak(G.combo + 'れんぞく！すごい！');
  }
}

function showFeedback(ok, q) {
  const overlay = document.getElementById('feedback-overlay');
  const mark    = document.getElementById('feedback-mark');
  const formula = document.getElementById('feedback-formula');
  const combo   = document.getElementById('feedback-combo');

  mark.textContent = ok ? '⭕' : '❌';
  mark.style.color = ok ? '#22c55e' : '#ef4444';

  formula.innerHTML = ok
    ? `<span style="color:#22c55e">せいかい！</span><br>${q.a} × ${q.b} = <strong>${q.ans}</strong>`
    : `${q.a} × ${q.b} = <span style="color:#22c55e"><strong>${q.ans}</strong></span>`;

  if (ok && G.combo >= 3) {
    combo.style.display = '';
    combo.textContent = '🔥 ' + G.combo + 'れんぞく！！';
  } else {
    combo.style.display = 'none';
  }

  overlay.classList.remove('hidden');
}

// ===== 次の問題 =====
function nextQuestion() {
  G.answered = false;
  // 入力欄リセット
  const disp = document.getElementById('numpad-display');
  if (disp) { disp.textContent = '?'; disp.style.color = ''; }

  G.idx++;
  if (G.idx >= G.questions.length) {
    finishGame();
  } else {
    renderQuestion();
  }
}

// ===== ゲーム終了 =====
function finishGame() {
  if (G.timerInterval) {
    clearInterval(G.timerInterval);
    G.timerInterval = null;
  }
  G.elapsed = G.isAttack ? (Date.now() - G.startTime) / 1000 : 0;

  const total   = G.questions.length;
  const correct = G.log.filter(l => l.ok).length;
  const pct = correct / total;

  let stars = 1;
  if (pct >= 0.95) stars = 3;
  else if (pct >= 0.75) stars = 2;

  let emoji = '😊', title = 'よくできました！';
  if (stars === 3) { emoji = '🎉'; title = 'かんぺき！！'; }
  else if (stars === 2) { emoji = '😄'; title = 'よくできました！'; }
  else { emoji = '💪'; title = 'もっとれんしゅうしよう！'; }

  document.getElementById('result-emoji').textContent = emoji;
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-stars').textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
  document.getElementById('r-correct').textContent = correct;
  document.getElementById('r-total').textContent = total;
  document.getElementById('r-score').textContent = G.score + 'てん';
  document.getElementById('r-combo').textContent = G.maxCombo + 'コンボ';

  // タイムアタック時間
  const timeRow = document.getElementById('result-time-row');
  if (G.isAttack) {
    timeRow.style.display = '';
    document.getElementById('result-time').textContent = G.elapsed.toFixed(1);
  } else {
    timeRow.style.display = 'none';
  }

  // ミス一覧
  const misses = G.log.filter(l => !l.ok);
  const missWrap = document.getElementById('miss-list-wrap');
  const missList = document.getElementById('miss-list');
  if (misses.length) {
    missWrap.style.display = '';
    missList.innerHTML = misses.map(l =>
      `<div class="miss-item">${l.q.a}×${l.q.b}=<span style="color:#22c55e">${l.q.ans}</span></div>`
    ).join('');
  } else {
    missWrap.style.display = 'none';
  }

  // 記録保存
  saveRecord({
    type: G.isAttack ? 'attack' : 'practice',
    dan: cfg.dan,
    ansMode: G.isAttack ? cfg.attackAnsMode : cfg.ansMode,
    total, correct, score: G.score, stars, maxCombo: G.maxCombo,
    elapsed: G.elapsed,
  });

  speak(stars === 3 ? 'かんぺき！すごいね！' : stars >= 2 ? 'よくできました！' : 'もっとれんしゅうしよう！');
  showScreen('result');
}

// ===== 記録 =====
const RECORD_KEY = 'tanq_kuku_records_v1';

function saveRecord(data) {
  try {
    const records = loadRecords();
    records.unshift({ ...data, date: new Date().toLocaleDateString('ja-JP') });
    localStorage.setItem(RECORD_KEY, JSON.stringify(records.slice(0, 30)));
  } catch(e) {}
}
function loadRecords() {
  try { return JSON.parse(localStorage.getItem(RECORD_KEY) || '[]'); } catch { return []; }
}

function renderRecords() {
  const records = loadRecords();
  const el = document.getElementById('records-content');
  if (!records.length) {
    el.innerHTML = '<p class="no-record">まだきろくがないよ。あそんでみよう！</p>';
    return;
  }
  el.innerHTML = records.map(r => {
    const danLabel = r.dan === 'all' ? 'ぜんぶの段' : r.dan + 'の段';
    const timeStr  = r.type === 'attack' ? ` | ⏱ ${r.elapsed.toFixed(1)}s` : '';
    const typeLabel = r.type === 'attack' ? '⚡タイムアタック' : '📘れんしゅう';
    return `<div class="record-row">
      <div class="record-type">${typeLabel} | ${danLabel}</div>
      <div class="record-stars">${'⭐'.repeat(r.stars || 0)}</div>
      <div class="record-detail">せいかい: ${r.correct}/${r.total} | ${r.score}てん${timeStr} | ${r.date}</div>
    </div>`;
  }).join('');
}

// ===== やめる =====
function confirmQuit() { document.getElementById('quit-overlay').style.display = 'flex'; }
function closeQuitDialog() { document.getElementById('quit-overlay').style.display = 'none'; }
function doQuit() {
  if (G.timerInterval) { clearInterval(G.timerInterval); G.timerInterval = null; }
  closeQuitDialog();
  showScreen('menu');
}

// ===== ユーティリティ =====
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ===== 初期化 =====
document.addEventListener('DOMContentLoaded', () => {
  speak('九九マスター！れんしゅうしよう！');
});
