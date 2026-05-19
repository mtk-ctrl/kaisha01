/* ==========================================
   10のなかよし - app.js
   たして10になる数の組み合わせを学ぶアプリ
   ========================================== */
'use strict';

/* ===== 定数 ===== */
// 10の組み合わせ全パターン（0+10 〜 10+0）
const PAIRS = [
  { a:1, b:9 }, { a:2, b:8 }, { a:3, b:7 }, { a:4, b:6 }, { a:5, b:5 },
  { a:6, b:4 }, { a:7, b:3 }, { a:8, b:2 }, { a:9, b:1 },
];

const DOT_COLORS = ['#5B8DEF','#FF6B9D','#4ECDC4','#A855F7','#FF8C42','#FFD700'];

/* ===== 状態 ===== */
const State = {
  totalQuestions: 10,
  answered: 0,
  score: 0,
  combo: 0,
  maxCombo: 0,
  queue: [],
  currentPair: null,
  askRight: false, // true=右を問う, false=左を問う
};

/* ===== 画面切替 ===== */
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + name);
  if (el) el.classList.add('active');
  if (name === 'menu') initDemo();
}

/* ===== 音声 ===== */
function speak(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ja-JP'; u.rate = 0.85; u.pitch = 1.2;
  const v = typeof SpeechUtil !== 'undefined' ? SpeechUtil.getVoice() : null;
  if (v) u.voice = v;
  window.speechSynthesis.speak(u);
}

/* ===== デモアニメーション ===== */
let demoInterval = null;
function initDemo() {
  let idx = 0;
  const pairs = [...PAIRS];
  function update() {
    const p = pairs[idx % pairs.length];
    document.getElementById('num1').textContent = p.a;
    document.getElementById('num2').textContent = p.b;
    renderDots('demoDots', p.a, p.b);
    idx++;
  }
  update();
  if (demoInterval) clearInterval(demoInterval);
  demoInterval = setInterval(update, 2000);

  speak('たして じゅう！ いっしょに おぼえよう！');
}

function renderDots(containerId, filled, empty) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < filled; i++) {
    const d = document.createElement('div');
    d.className = 'dot dot-filled';
    d.style.background = DOT_COLORS[filled % DOT_COLORS.length];
    d.style.animationDelay = (i * 0.04) + 's';
    container.appendChild(d);
  }
  for (let i = 0; i < empty; i++) {
    const d = document.createElement('div');
    d.className = 'dot dot-empty';
    d.style.animationDelay = ((filled + i) * 0.04) + 's';
    container.appendChild(d);
  }
}

/* ===== ゲーム ===== */
function startGame() {
  if (demoInterval) { clearInterval(demoInterval); demoInterval = null; }

  // キューをシャッフルして生成（各ペアを左右両方問う）
  const questions = [];
  PAIRS.forEach(p => {
    questions.push({ pair: p, askRight: false });
    questions.push({ pair: p, askRight: true  });
  });
  // シャッフルして10問選ぶ
  State.queue = questions.sort(() => Math.random() - 0.5).slice(0, State.totalQuestions);
  State.answered = 0;
  State.score = 0;
  State.combo = 0;
  State.maxCombo = 0;

  showScreen('game');
  updateProgress();
  nextQuestion();
}

function nextQuestion() {
  if (State.answered >= State.totalQuestions) {
    endGame();
    return;
  }

  const q = State.queue[State.answered];
  State.currentPair = q.pair;
  State.askRight = q.askRight;

  const knownNum = q.askRight ? q.pair.a : q.pair.b;
  const answer   = q.askRight ? q.pair.b : q.pair.a;

  // 方程式表示
  const eqDisplay = document.getElementById('equationDisplay');
  if (q.askRight) {
    eqDisplay.innerHTML = `
      <span class="eq-num" style="background:linear-gradient(135deg,#5B8DEF,#A855F7)">${knownNum}</span>
      <span class="eq-op">＋</span>
      <span class="eq-blank">□</span>
      <span class="eq-op">＝</span>
      <span class="eq-num eq-ten">10</span>
    `;
  } else {
    eqDisplay.innerHTML = `
      <span class="eq-blank">□</span>
      <span class="eq-op">＋</span>
      <span class="eq-num" style="background:linear-gradient(135deg,#5B8DEF,#A855F7)">${knownNum}</span>
      <span class="eq-op">＝</span>
      <span class="eq-num eq-ten">10</span>
    `;
  }

  // 点表示（既知の数だけ塗る）
  renderDots('dotDisplay', knownNum, answer);

  // 選択肢生成（正解＋ダミー3つ）
  const choices = new Set([answer]);
  while (choices.size < 4) {
    choices.add(Math.floor(Math.random() * 10) + 1);
  }
  const choicesArr = [...choices].sort(() => Math.random() - 0.5);

  const grid = document.getElementById('choicesGrid');
  grid.innerHTML = '';
  choicesArr.forEach(n => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = n;
    btn.onclick = () => checkAnswer(btn, n, answer, knownNum);
    grid.appendChild(btn);
  });

  document.getElementById('comboDisplay').textContent = '';
  document.getElementById('speechText').textContent = '□ に はいる かずは どれかな？';
  updateProgress();
  setTimeout(() => speak(`${knownNum} たす いくつが じゅう に なるかな？`), 300);
}

function checkAnswer(btn, chosen, answer, knownNum) {
  document.querySelectorAll('.choice-btn').forEach(b => b.onclick = null);

  if (chosen === answer) {
    btn.classList.add('correct');
    State.score++;
    State.combo++;
    if (State.combo > State.maxCombo) State.maxCombo = State.combo;

    document.getElementById('comboDisplay').textContent =
      State.combo >= 3 ? `🔥 ${State.combo}れんぞく せいかい！` : '';
    document.getElementById('speechText').textContent = `せいかい！ ${knownNum} ＋ ${answer} ＝ 10 だよ！`;
    speak(`せいかい！ ${knownNum} と ${answer} で じゅう！`);

    // 全ドットを塗る
    renderDots('dotDisplay', 10, 0);
  } else {
    btn.classList.add('wrong');
    State.combo = 0;
    document.getElementById('comboDisplay').textContent = '';
    document.getElementById('speechText').textContent = `ざんねん！ ${knownNum} ＋ ${answer} ＝ 10 だよ！`;
    speak(`ざんねん！ こたえは ${answer} だよ！ ${knownNum} と ${answer} で じゅう！`);
    document.querySelectorAll('.choice-btn').forEach(b => {
      if (parseInt(b.textContent) === answer) b.classList.add('correct');
    });
  }

  State.answered++;
  document.getElementById('scoreChip').textContent = `⭐ ${State.score}`;
  updateProgress();
  setTimeout(() => { document.getElementById('nextBtn').style.display = 'block'; }, 600);
}

function goNext() {
  document.getElementById('nextBtn').style.display = 'none';
  nextQuestion();
}

function goSetup() {
  if (demoInterval) { clearInterval(demoInterval); demoInterval = null; }
  document.querySelectorAll('.setup-cnt-btn').forEach(b =>
    b.classList.toggle('active', parseInt(b.dataset.n) === State.totalQuestions));
  showScreen('setup');
}

function selectCount(n) {
  State.totalQuestions = n;
  document.querySelectorAll('.setup-cnt-btn').forEach(b =>
    b.classList.toggle('active', parseInt(b.dataset.n) === n));
}

function updateProgress() {
  document.getElementById('progressBar').style.width =
    (State.answered / State.totalQuestions * 100) + '%';
}

function quitGame() {
  window.speechSynthesis && window.speechSynthesis.cancel();
  showScreen('menu');
}

function endGame() {
  const pct = State.score / State.totalQuestions;
  const title = pct === 1 ? '💯 かんぺき！！！' :
                pct >= 0.8 ? '✨ すごい！' :
                pct >= 0.5 ? '👍 よくできました！' : '😊 れんしゅうしよう！';
  const emoji = pct === 1 ? '🎊' : pct >= 0.8 ? '🌟' : pct >= 0.5 ? '😊' : '💪';

  document.getElementById('resultEmoji').textContent = emoji;
  document.getElementById('resultTitle').textContent = title;
  document.getElementById('resultScore').textContent =
    `${State.score} / ${State.totalQuestions}`;

  showScreen('result');
  speak(title + (pct >= 0.8 ? 'おめでとう！' : 'またれんしゅうしてね！'));
}

/* ===== 初期化 ===== */
document.addEventListener('DOMContentLoaded', () => {
  showScreen('menu');
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../../sw.js').catch(() => {});
  }
});
