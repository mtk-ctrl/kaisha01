'use strict';
/* ============================================================
   カタカナ れんしゅう — app.js
   3モード: ひら→カタ / カタ→よみ / えことば
   ============================================================ */

// ===== かたかなデータ =====
const ROWS = [
  { id: 'ア', name: 'ア行', kana: [
    { hira:'あ', kata:'ア' }, { hira:'い', kata:'イ' }, { hira:'う', kata:'ウ' },
    { hira:'え', kata:'エ' }, { hira:'お', kata:'オ' }
  ]},
  { id: 'カ', name: 'カ行', kana: [
    { hira:'か', kata:'カ' }, { hira:'き', kata:'キ' }, { hira:'く', kata:'ク' },
    { hira:'け', kata:'ケ' }, { hira:'こ', kata:'コ' }
  ]},
  { id: 'サ', name: 'サ行', kana: [
    { hira:'さ', kata:'サ' }, { hira:'し', kata:'シ' }, { hira:'す', kata:'ス' },
    { hira:'せ', kata:'セ' }, { hira:'そ', kata:'ソ' }
  ]},
  { id: 'タ', name: 'タ行', kana: [
    { hira:'た', kata:'タ' }, { hira:'ち', kata:'チ' }, { hira:'つ', kata:'ツ' },
    { hira:'て', kata:'テ' }, { hira:'と', kata:'ト' }
  ]},
  { id: 'ナ', name: 'ナ行', kana: [
    { hira:'な', kata:'ナ' }, { hira:'に', kata:'ニ' }, { hira:'ぬ', kata:'ヌ' },
    { hira:'ね', kata:'ネ' }, { hira:'の', kata:'ノ' }
  ]},
  { id: 'ハ', name: 'ハ行', kana: [
    { hira:'は', kata:'ハ' }, { hira:'ひ', kata:'ヒ' }, { hira:'ふ', kata:'フ' },
    { hira:'へ', kata:'ヘ' }, { hira:'ほ', kata:'ホ' }
  ]},
  { id: 'マ', name: 'マ行', kana: [
    { hira:'ま', kata:'マ' }, { hira:'み', kata:'ミ' }, { hira:'む', kata:'ム' },
    { hira:'め', kata:'メ' }, { hira:'も', kata:'モ' }
  ]},
  { id: 'ヤ行', name: 'ヤ行', kana: [
    { hira:'や', kata:'ヤ' }, { hira:'ゆ', kata:'ユ' }, { hira:'よ', kata:'ヨ' }
  ]},
  { id: 'ラ', name: 'ラ行', kana: [
    { hira:'ら', kata:'ラ' }, { hira:'り', kata:'リ' }, { hira:'る', kata:'ル' },
    { hira:'れ', kata:'レ' }, { hira:'ろ', kata:'ロ' }
  ]},
  { id: 'ワ', name: 'ワ行', kana: [
    { hira:'わ', kata:'ワ' }, { hira:'ん', kata:'ン' }
  ]},
];

// 全かたかな一覧（4択の外れ選択肢を作るのに使う）
const ALL_KATA = ROWS.flatMap(r => r.kana.map(k => k.kata));
const ALL_HIRA = ROWS.flatMap(r => r.kana.map(k => k.hira));

// ===== えことばデータ =====
// 子どもが知っている外来語（カタカナ語）と絵文字
const WORD_DATA = [
  // ア行
  { kata:'アイスクリーム', hira:'あいすくりーむ', emoji:'🍦' },
  { kata:'アリ',           hira:'あり',          emoji:'🐜' },
  { kata:'イチゴ',         hira:'いちご',         emoji:'🍓' },
  { kata:'ウサギ',         hira:'うさぎ',         emoji:'🐰' },
  { kata:'エビ',           hira:'えび',           emoji:'🦐' },
  { kata:'オレンジ',       hira:'おれんじ',       emoji:'🍊' },
  // カ行
  { kata:'カメラ',         hira:'かめら',         emoji:'📷' },
  { kata:'キリン',         hira:'きりん',         emoji:'🦒' },
  { kata:'クッキー',       hira:'くっきー',       emoji:'🍪' },
  { kata:'ケーキ',         hira:'けーき',         emoji:'🎂' },
  { kata:'コアラ',         hira:'こあら',         emoji:'🐨' },
  // サ行
  { kata:'サッカー',       hira:'さっかー',       emoji:'⚽' },
  { kata:'スイカ',         hira:'すいか',         emoji:'🍉' },
  { kata:'スープ',         hira:'すーぷ',         emoji:'🍲' },
  // タ行
  { kata:'チーズ',         hira:'ちーず',         emoji:'🧀' },
  { kata:'チョコレート',   hira:'ちょこれーと',   emoji:'🍫' },
  { kata:'テレビ',         hira:'てれび',         emoji:'📺' },
  { kata:'トマト',         hira:'とまと',         emoji:'🍅' },
  // ナ行
  { kata:'ナイフ',         hira:'ないふ',         emoji:'🔪' },
  { kata:'ノート',         hira:'のーと',         emoji:'📒' },
  // ハ行
  { kata:'ハンバーガー',   hira:'はんばーがー',   emoji:'🍔' },
  { kata:'ピザ',           hira:'ぴざ',           emoji:'🍕' },
  { kata:'ピアノ',         hira:'ぴあの',         emoji:'🎹' },
  { kata:'フルーツ',       hira:'ふるーつ',       emoji:'🍎' },
  { kata:'ホットケーキ',   hira:'ほっとけーき',   emoji:'🥞' },
  // マ行
  { kata:'メダル',         hira:'めだる',         emoji:'🏅' },
  { kata:'メロン',         hira:'めろん',         emoji:'🍈' },
  // ヤ行
  { kata:'ヨーグルト',     hira:'よーぐると',     emoji:'🥛' },
  { kata:'ヨット',         hira:'よっと',         emoji:'⛵' },
  // ラ行
  { kata:'ライオン',       hira:'らいおん',       emoji:'🦁' },
  { kata:'ラーメン',       hira:'らーめん',       emoji:'🍜' },
  { kata:'リボン',         hira:'りぼん',         emoji:'🎀' },
  { kata:'リンゴ',         hira:'りんご',         emoji:'🍎' },
  { kata:'レモン',         hira:'れもん',         emoji:'🍋' },
  { kata:'ロボット',       hira:'ろぼっと',       emoji:'🤖' },
  { kata:'ロケット',       hira:'ろけっと',       emoji:'🚀' },
  // ワ行
  { kata:'ワニ',           hira:'わに',           emoji:'🐊' },
  { kata:'ワッフル',       hira:'わっふる',       emoji:'🧇' },
];

// ===== 設定状態 =====
const cfg = {
  mode: 'hira2kata',
  row: 'all',
  count: 10,
};

// ===== ゲーム状態 =====
const G = {
  questions: [],
  idx: 0,
  score: 0,
  combo: 0,
  maxCombo: 0,
  log: [],   // { q, correct, chosen, ok }
};

// ===== 音声 =====
function speak(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ja-JP'; u.rate = 0.88; u.pitch = 1.15;
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
function selectMode(btn) {
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  cfg.mode = btn.dataset.mode;

  // えことばモードでは行選択を非表示
  const rowSection = document.getElementById('row-section');
  if (rowSection) {
    rowSection.style.display = (cfg.mode === 'word') ? 'none' : '';
  }
}

function selectRow(btn) {
  document.querySelectorAll('.row-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  cfg.row = btn.dataset.row;
}

function selectCount(btn) {
  document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  cfg.count = parseInt(btn.dataset.count, 10);
}

// ===== 問題生成 =====
function buildQuestions() {
  if (cfg.mode === 'word') {
    // えことばモード: WORD_DATAからランダム選択
    return shuffle([...WORD_DATA]).slice(0, cfg.count).map(w => ({
      type: 'word',
      emoji: w.emoji,
      kata: w.kata,
      hira: w.hira,
      // 正解はkata文字列、外れはランダムなkata語
      choices: null, // 後で生成
    }));
  }

  // ひら→カタ or カタ→ひら
  let pool;
  if (cfg.row === 'all') {
    pool = ROWS.flatMap(r => r.kana);
  } else {
    const found = ROWS.find(r => r.id === cfg.row);
    pool = found ? [...found.kana] : ROWS.flatMap(r => r.kana);
  }

  // プールが少ない場合は繰り返して補充
  let q = [];
  while (q.length < cfg.count) {
    q = q.concat(shuffle([...pool]));
  }
  q = q.slice(0, cfg.count);

  return q.map(item => ({
    type: cfg.mode, // 'hira2kata' | 'kata2hira'
    hira: item.hira,
    kata: item.kata,
    choices: null,
  }));
}

function makeChoices(q, allQuestions) {
  if (q.type === 'word') {
    // えことばモード: 同じ問題セット内から外れを3つ選ぶ
    const correct = q.kata;
    const others = WORD_DATA
      .filter(w => w.kata !== correct)
      .map(w => w.kata);
    const distractors = shuffle(others).slice(0, 3);
    return shuffle([correct, ...distractors]);
  }

  if (q.type === 'hira2kata') {
    const correct = q.kata;
    const distractors = shuffle(ALL_KATA.filter(k => k !== correct)).slice(0, 3);
    return shuffle([correct, ...distractors]);
  }

  // kata2hira
  const correct = q.hira;
  const distractors = shuffle(ALL_HIRA.filter(h => h !== correct)).slice(0, 3);
  return shuffle([correct, ...distractors]);
}

// ===== メニューから直接モード指定でスタート =====
function startWithMode(mode) {
  cfg.mode = mode;
  startGame();
}

// ===== ゲーム開始 =====
function startGame() {
  G.questions = buildQuestions();
  // 選択肢を付与
  G.questions.forEach(q => {
    q.choices = makeChoices(q, G.questions);
  });
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

  // プログレスバー
  const pct = (G.idx / total) * 100;
  document.getElementById('game-progress-fill').style.width = pct + '%';

  // カウンター
  document.getElementById('g-current').textContent = G.idx + 1;
  document.getElementById('g-total').textContent = total;
  document.getElementById('g-score').textContent = G.score;

  // コンボバッジ
  const comboBadge = document.getElementById('combo-badge');
  if (G.combo >= 2) {
    comboBadge.classList.remove('hidden');
    document.getElementById('combo-num').textContent = G.combo;
  } else {
    comboBadge.classList.add('hidden');
  }

  // 問題カード
  const qMain = document.getElementById('q-main');
  const qHint = document.getElementById('q-hint');
  const qSub  = document.getElementById('q-sub');

  qMain.className = 'q-main';

  if (q.type === 'word') {
    qMain.classList.add('word-mode');
    qMain.textContent = q.emoji;
    qHint.textContent = 'この えを カタカナで かくと？';
    qSub.textContent  = '（ひらがな：' + q.hira + '）';
    speak(q.hira);
  } else if (q.type === 'hira2kata') {
    qMain.textContent = q.hira;
    qHint.textContent = 'この もじを カタカナに すると？';
    qSub.textContent  = '';
    speak(q.hira);
  } else { // kata2hira
    qMain.textContent = q.kata;
    qHint.textContent = 'この カタカナの よみかたは？';
    qSub.textContent  = '';
    speak(q.kata);
  }

  // 選択肢ボタン
  const btns = document.querySelectorAll('.choice-btn');
  btns.forEach((btn, i) => {
    btn.textContent = q.choices[i];
    btn.className = 'choice-btn';
    btn.disabled = false;
    if (q.type === 'word') btn.classList.add('word-choice');
  });

  // フィードバック非表示
  document.getElementById('feedback-overlay').classList.add('hidden');
}

// ===== 回答処理 =====
function answer(idx) {
  const q = G.questions[G.idx];
  const chosen = q.choices[idx];
  const correct = (q.type === 'kata2hira') ? q.hira : q.kata;
  const ok = chosen === correct;

  // ボタン無効化
  document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);

  // 視覚フィードバック
  const btn = document.getElementById('c' + idx);
  btn.classList.add(ok ? 'correct' : 'wrong');

  // 不正解時に正解を光らせる
  if (!ok) {
    const correctIdx = q.choices.indexOf(correct);
    document.getElementById('c' + correctIdx).classList.add('correct');
  }

  // スコア・コンボ
  if (ok) {
    G.combo++;
    if (G.combo > G.maxCombo) G.maxCombo = G.combo;
    const base = 100;
    const comboBonus = Math.min(G.combo - 1, 5) * 20;
    G.score += base + comboBonus;
    speak(ok ? (G.combo >= 3 ? 'すごい！' + G.combo + 'れんぞく！' : 'せいかい！') : '');
  } else {
    G.combo = 0;
    speak('ざんねん。せいかいは ' + correct);
  }

  // ログ
  G.log.push({ q, correct, chosen, ok });

  // フィードバック表示
  showFeedback(ok, correct, chosen, q);
}

function showFeedback(ok, correct, chosen, q) {
  const overlay = document.getElementById('feedback-overlay');
  const mark = document.getElementById('feedback-mark');
  const ans  = document.getElementById('feedback-answer');
  const combo = document.getElementById('feedback-combo');

  mark.textContent = ok ? '⭕' : '❌';
  mark.style.color = ok ? '#22c55e' : '#ef4444';

  if (q.type === 'word') {
    ans.innerHTML = ok
      ? '<span style="color:#22c55e">せいかい！</span><br>' + q.emoji + ' ＝ ' + correct
      : '【せいかい】' + q.emoji + ' ＝ <span style="color:#22c55e">' + correct + '</span>';
  } else if (q.type === 'hira2kata') {
    ans.innerHTML = ok
      ? '<span style="color:#22c55e">せいかい！</span><br>「' + q.hira + '」→「' + correct + '」'
      : '【せいかい】「' + q.hira + '」→<span style="color:#22c55e">「' + correct + '」</span>';
  } else {
    ans.innerHTML = ok
      ? '<span style="color:#22c55e">せいかい！</span><br>「' + q.kata + '」＝「' + correct + '」'
      : '【せいかい】「' + q.kata + '」＝<span style="color:#22c55e">「' + correct + '」</span>';
  }

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
  G.idx++;
  if (G.idx >= G.questions.length) {
    showResult();
  } else {
    renderQuestion();
  }
}

// ===== リザルト =====
function showResult() {
  const total = G.questions.length;
  const correct = G.log.filter(l => l.ok).length;
  const pct = correct / total;

  // 星評価
  let stars = 1;
  if (pct >= 0.9) stars = 3;
  else if (pct >= 0.7) stars = 2;

  // メッセージ
  let emoji = '😊', title = 'よくできました！';
  if (stars === 3)  { emoji = '🎉'; title = 'かんぺき！すごい！！'; }
  else if (stars === 2) { emoji = '😄'; title = 'よくできました！'; }
  else              { emoji = '😊'; title = 'またれんしゅうしよう！'; }

  document.getElementById('result-emoji').textContent = emoji;
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-stars').textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
  document.getElementById('r-correct').textContent = correct;
  document.getElementById('r-total').textContent = total;
  document.getElementById('r-score').textContent = G.score + 'てん';
  document.getElementById('r-combo').textContent = G.maxCombo + 'コンボ';

  // 問題ログリスト
  const list = document.getElementById('result-list');
  list.innerHTML = G.log.map(l => {
    let qStr = '', aStr = '';
    if (l.q.type === 'word') {
      qStr = l.q.emoji + ' ' + l.q.hira;
      aStr = l.correct;
    } else if (l.q.type === 'hira2kata') {
      qStr = l.q.hira + '→?';
      aStr = l.correct;
    } else {
      qStr = l.q.kata + '→?';
      aStr = l.correct;
    }
    return `<div class="result-item ${l.ok ? 'ok' : 'ng'}">
      <span class="result-item-mark">${l.ok ? '⭕' : '❌'}</span>
      <span class="result-item-q">${qStr}</span>
      <span class="result-item-a" style="color:${l.ok ? '#22c55e' : '#ef4444'}">${aStr}</span>
    </div>`;
  }).join('');

  // 記録保存
  saveRecord({ mode: cfg.mode, row: cfg.row, count: total, correct, score: G.score, stars, maxCombo: G.maxCombo });

  speak(stars === 3 ? 'かんぺき！すごいね！' : stars === 2 ? 'よくできました！' : 'またれんしゅうしよう！');
  showScreen('result');
}

// ===== 記録 =====
const RECORD_KEY = 'tanq_katakana_records_v1';

function saveRecord(data) {
  try {
    const records = loadRecords();
    records.unshift({ ...data, date: new Date().toLocaleDateString('ja-JP') });
    const trimmed = records.slice(0, 30); // 最大30件
    localStorage.setItem(RECORD_KEY, JSON.stringify(trimmed));
  } catch(e) {}
}

function loadRecords() {
  try {
    return JSON.parse(localStorage.getItem(RECORD_KEY) || '[]');
  } catch { return []; }
}

function renderRecords() {
  const records = loadRecords();
  const el = document.getElementById('records-content');
  if (!records.length) {
    el.innerHTML = '<p class="no-record">まだきろくがないよ。あそんでみよう！</p>';
    return;
  }

  const modeLabel = { hira2kata: 'ひら→カタ', kata2hira: 'カタ→よみ', word: 'えことば' };
  el.innerHTML = records.map(r => `
    <div class="record-row">
      <div class="record-mode">${modeLabel[r.mode] || r.mode} | ${r.row === 'all' ? 'ぜんぶ' : r.row + '行'} | ${r.count}もん</div>
      <div class="record-stars">${'⭐'.repeat(r.stars || 0)}</div>
      <div class="record-detail">せいかい: ${r.correct}/${r.count} | ${r.score}てん | ${r.date}</div>
    </div>
  `).join('');
}

// ===== やめる =====
function confirmQuit() { document.getElementById('quit-overlay').style.display = 'flex'; }
function closeQuitDialog() { document.getElementById('quit-overlay').style.display = 'none'; }
function doQuit() {
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
  speak('カタカナ れんしゅう！ いっしょに おぼえよう！');
});
