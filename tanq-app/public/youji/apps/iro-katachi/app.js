'use strict';
/* ============================================================
   いろと かたち — app.js
   3モード: いろ / かたち / まぜまぜ
   SVGで図形を描画。色+形の組み合わせで視覚的に楽しく。
   ============================================================ */

// ===== データ定義 =====

// いろ
const COLORS = [
  { id: 'red',    name: 'あか',     hex: '#ef4444', speech: 'あか' },
  { id: 'blue',   name: 'あお',     hex: '#3b82f6', speech: 'あお' },
  { id: 'yellow', name: 'きいろ',   hex: '#facc15', speech: 'きいろ' },
  { id: 'green',  name: 'みどり',   hex: '#22c55e', speech: 'みどり' },
  { id: 'orange', name: 'オレンジ', hex: '#f97316', speech: 'オレンジ' },
  { id: 'pink',   name: 'ピンク',   hex: '#ec4899', speech: 'ピンク' },
  { id: 'purple', name: 'むらさき', hex: '#a855f7', speech: 'むらさき' },
  { id: 'white',  name: 'しろ',     hex: '#f1f5f9', speech: 'しろ' },
  { id: 'black',  name: 'くろ',     hex: '#1e293b', speech: 'くろ' },
  { id: 'brown',  name: 'ちゃいろ', hex: '#92400e', speech: 'ちゃいろ' },
];

// かたち（SVGパスを返す関数付き）
const SHAPES = [
  { id: 'circle',   name: 'まる（えん）',     speech: 'まる',    svgFn: (c) =>
    `<circle cx="100" cy="100" r="80" fill="${c}"/>` },

  { id: 'square',   name: 'しかく（せいほうけい）', speech: 'しかく', svgFn: (c) =>
    `<rect x="20" y="20" width="160" height="160" rx="10" fill="${c}"/>` },

  { id: 'triangle', name: 'さんかく（さんかっけい）', speech: 'さんかく', svgFn: (c) =>
    `<polygon points="100,12 188,185 12,185" fill="${c}"/>` },

  { id: 'star',     name: 'ほし（スター）',   speech: 'ほし',    svgFn: (c) =>
    `<polygon points="100,10 122,75 192,75 137,116 158,182 100,142 42,182 63,116 8,75 78,75" fill="${c}"/>` },

  { id: 'heart',    name: 'ハート（こころ）', speech: 'ハート',  svgFn: (c) =>
    `<path d="M100 170 C60 145 20 110 20 75 C20 45 40 20 70 20 C85 20 100 35 100 35 C100 35 115 20 130 20 C160 20 180 45 180 75 C180 110 140 145 100 170Z" fill="${c}"/>` },

  { id: 'diamond',  name: 'ひし形（ダイヤ）', speech: 'ひしがた', svgFn: (c) =>
    `<polygon points="100,10 190,100 100,190 10,100" fill="${c}"/>` },

  { id: 'rectangle', name: 'ちょうほうけい（よこしかく）', speech: 'ちょうほうけい', svgFn: (c) =>
    `<rect x="10" y="55" width="180" height="100" rx="8" fill="${c}"/>` },

  { id: 'oval',     name: 'たまご形（だえん）', speech: 'だえん',  svgFn: (c) =>
    `<ellipse cx="100" cy="100" rx="85" ry="60" fill="${c}"/>` },
];

// ===== 設定 =====
const cfg = { mode: 'iro', count: 10 };

// ===== ゲーム状態 =====
const G = { questions: [], idx: 0, score: 0, combo: 0, maxCombo: 0, log: [] };

// ===== 音声 =====
function speak(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ja-JP'; u.rate = 0.85; u.pitch = 1.2;
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

// ===== メニューから直接モード指定でスタート =====
function startWithMode(mode) {
  cfg.mode = mode;
  startGame();
}

// ===== セットアップ =====
function selectMode(btn) {
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  cfg.mode = btn.dataset.mode;
}
function selectCount(btn) {
  document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  cfg.count = parseInt(btn.dataset.count, 10);
}

// ===== 問題生成 =====
function buildIroQuestion() {
  // ランダムな色のランダムな形を表示 → 「いろは？」
  const color = pick(COLORS);
  const shape = pick(SHAPES);
  const correctIdx = COLORS.indexOf(color);

  // 外れ3つ（色）
  const distractors = shuffle([...COLORS].filter(c => c !== color)).slice(0, 3);
  const choices = shuffle([color, ...distractors]);

  return {
    type: 'iro',
    color, shape,
    prompt: 'これは なにいろ？',
    speech: 'この かたちは なにいろですか？',
    correctId: color.id,
    choices,
    displayText: (c) => {
      return `<span class="choice-swatch" style="background:${c.hex};${c.id === 'white' ? 'border-color:#aaa' : ''}"></span>${c.name}`;
    },
  };
}

function buildKatachiQuestion() {
  // ランダムな形をランダムな色で表示 → 「かたちは？」
  const shape = pick(SHAPES);
  const color = pick(COLORS);
  const distractors = shuffle([...SHAPES].filter(s => s !== shape)).slice(0, 3);
  const choices = shuffle([shape, ...distractors]);

  return {
    type: 'katachi',
    color, shape,
    prompt: 'この かたちは なあに？',
    speech: 'この かたちの なまえは なんですか？',
    correctId: shape.id,
    choices,
    displayText: (s) => s.name,
  };
}

function buildQuestions() {
  const qs = [];
  const total = cfg.count;
  for (let i = 0; i < total; i++) {
    if (cfg.mode === 'iro') {
      qs.push(buildIroQuestion());
    } else if (cfg.mode === 'katachi') {
      qs.push(buildKatachiQuestion());
    } else {
      // まぜまぜ: 交互
      qs.push(i % 2 === 0 ? buildIroQuestion() : buildKatachiQuestion());
    }
  }
  return qs;
}

// ===== SVG描画ヘルパー =====
function makeShapeSVG(shape, color, size = 200) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    ${shape.svgFn(color.hex)}
  </svg>`;
}

// ===== ゲーム開始 =====
function startGame() {
  G.questions = buildQuestions();
  G.idx = 0;
  G.score = 0;
  G.combo = 0;
  G.maxCombo = 0;
  G.log = [];
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

  // 問いかけ文
  document.getElementById('q-prompt').textContent = q.prompt;

  // 図形表示
  document.getElementById('shape-display').innerHTML = makeShapeSVG(q.shape, q.color);

  // 選択肢ボタン
  const btns = document.querySelectorAll('.choice-btn');
  btns.forEach((btn, i) => {
    btn.innerHTML = q.displayText(q.choices[i]);
    btn.className = 'choice-btn';
    btn.disabled = false;
  });

  // フィードバック非表示
  document.getElementById('feedback-overlay').classList.add('hidden');

  // 音声
  speak(q.speech);
}

// ===== 回答処理 =====
function answer(idx) {
  const q = G.questions[G.idx];
  const chosen = q.choices[idx];
  const correctId = q.correctId;
  const chosenId = q.type === 'iro' ? chosen.id : chosen.id;
  const ok = chosenId === correctId;

  // ボタン無効化・色付け
  document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
  document.getElementById('c' + idx).classList.add(ok ? 'correct' : 'wrong');
  if (!ok) {
    const ci = q.choices.findIndex(c => c.id === correctId);
    if (ci >= 0) document.getElementById('c' + ci).classList.add('correct');
  }

  // スコア・コンボ
  if (ok) {
    G.combo++;
    if (G.combo > G.maxCombo) G.maxCombo = G.combo;
    G.score += 100 + Math.min(G.combo - 1, 5) * 20;
  } else {
    G.combo = 0;
  }

  G.log.push({ q, chosen, ok });

  // フィードバック表示
  showFeedback(ok, q);

  // 音声
  if (ok) {
    const answer = q.type === 'iro' ? q.color.speech : q.shape.speech;
    speak(ok ? (G.combo >= 3 ? 'すごい！' + G.combo + 'れんぞく！' : 'せいかい！' + answer + '！') : '');
  } else {
    const correctItem = q.type === 'iro'
      ? COLORS.find(c => c.id === correctId)
      : SHAPES.find(s => s.id === correctId);
    speak('ざんねん。' + correctItem.speech + ' だよ！');
  }
}

function showFeedback(ok, q) {
  const overlay = document.getElementById('feedback-overlay');
  const mark    = document.getElementById('feedback-mark');
  const text    = document.getElementById('feedback-text');
  const shapeEl = document.getElementById('feedback-shape');

  mark.textContent = ok ? '⭕' : '❌';
  mark.style.color = ok ? '#22c55e' : '#ef4444';

  const correctName = q.type === 'iro' ? q.color.name : q.shape.name;
  if (ok) {
    text.innerHTML = `<span style="color:#22c55e">せいかい！</span><br>「${correctName}」だよ！`;
  } else {
    text.innerHTML = `せいかいは<br><span style="color:#22c55e">「${correctName}」</span>だよ！`;
  }

  // 正解の図形を小さく表示
  shapeEl.innerHTML = makeShapeSVG(q.shape, q.color, 70);

  // コンボ
  if (ok && G.combo >= 3) {
    text.innerHTML += `<br><span style="color:#fbbf24">🔥 ${G.combo}れんぞく！！</span>`;
  }

  overlay.classList.remove('hidden');
}

// ===== 次の問題 =====
function nextQuestion() {
  G.idx++;
  if (G.idx >= G.questions.length) {
    showResult();
  } else {
    renderQuestion();
  }
}

// ===== リザルト =====
function showResult() {
  const total   = G.questions.length;
  const correct = G.log.filter(l => l.ok).length;
  const pct = correct / total;

  let stars = 1;
  if (pct >= 0.9) stars = 3;
  else if (pct >= 0.65) stars = 2;

  let emoji = '😊', title = 'よくがんばりました！';
  if (stars === 3) { emoji = '🌈'; title = 'かんぺき！すごい！！'; }
  else if (stars === 2) { emoji = '😄'; title = 'よくできました！'; }

  document.getElementById('result-emoji').textContent = emoji;
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-stars').textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
  document.getElementById('r-correct').textContent = correct;
  document.getElementById('r-total').textContent = total;
  document.getElementById('r-score').textContent = G.score + 'てん';

  const modeLabel = { iro: 'いろ', katachi: 'かたち', mix: 'まぜまぜ' };
  saveRecord({ mode: cfg.mode, count: total, correct, score: G.score, stars });

  speak(stars === 3 ? 'かんぺき！すごいね！' : 'よくがんばりました！');
  showScreen('result');
}

// ===== 記録 =====
const RECORD_KEY = 'tanq_iro_katachi_records_v1';
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
  const modeLabel = { iro: '🎨いろ', katachi: '🔷かたち', mix: '🌈まぜまぜ' };
  el.innerHTML = records.map(r =>
    `<div class="record-row">
      <div class="record-mode">${modeLabel[r.mode] || r.mode} | ${r.count}もん</div>
      <div class="record-stars">${'⭐'.repeat(r.stars || 0)}</div>
      <div class="record-detail">せいかい: ${r.correct}/${r.count} | ${r.score}てん | ${r.date}</div>
    </div>`
  ).join('');
}

// ===== やめる =====
function confirmQuit() { document.getElementById('quit-overlay').style.display = 'flex'; }
function closeQuitDialog() { document.getElementById('quit-overlay').style.display = 'none'; }
function doQuit() { closeQuitDialog(); showScreen('menu'); }

// ===== ユーティリティ =====
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ===== 初期化 =====
document.addEventListener('DOMContentLoaded', () => {
  speak('いろと かたち！ いっしょに おぼえよう！');
});
