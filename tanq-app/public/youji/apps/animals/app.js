/* ==========================================
   どうぶつかぞえ - app.js
   ========================================== */

// ===== 動物データ (SVGイラスト) =====
const ANIMALS = [
  {
    name: 'ネコ', color: '#FF6B9D', bg: '#FFE5EF',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <polygon points="12,46 24,14 38,44" fill="#FFACC7"/>
      <polygon points="62,44 76,14 88,46" fill="#FFACC7"/>
      <polygon points="16,44 24,20 36,43" fill="#FF85A1"/>
      <polygon points="64,43 76,20 84,44" fill="#FF85A1"/>
      <circle cx="50" cy="58" r="35" fill="#FFD4E8"/>
      <ellipse cx="36" cy="54" rx="7" ry="8" fill="#222"/>
      <ellipse cx="64" cy="54" rx="7" ry="8" fill="#222"/>
      <circle cx="38" cy="51" r="2.5" fill="white"/>
      <circle cx="66" cy="51" r="2.5" fill="white"/>
      <ellipse cx="50" cy="65" rx="4" ry="3" fill="#FF85A1"/>
      <path d="M43,71 Q50,77 57,71" stroke="#FF85A1" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <line x1="5" y1="61" x2="36" y2="65" stroke="#ddd" stroke-width="2"/>
      <line x1="5" y1="69" x2="36" y2="69" stroke="#ddd" stroke-width="2"/>
      <line x1="64" y1="65" x2="95" y2="61" stroke="#ddd" stroke-width="2"/>
      <line x1="64" y1="69" x2="95" y2="69" stroke="#ddd" stroke-width="2"/>
    </svg>`,
  },
  {
    name: 'イヌ', color: '#FF8C42', bg: '#FFF0E5',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <ellipse cx="17" cy="52" rx="15" ry="23" fill="#C97D1A" transform="rotate(-18,17,52)"/>
      <ellipse cx="83" cy="52" rx="15" ry="23" fill="#C97D1A" transform="rotate(18,83,52)"/>
      <circle cx="50" cy="50" r="33" fill="#F5B942"/>
      <ellipse cx="50" cy="62" rx="15" ry="11" fill="#F5DC80"/>
      <ellipse cx="50" cy="57" rx="8" ry="6" fill="#444"/>
      <circle cx="48" cy="55.5" r="2" fill="#666"/>
      <circle cx="37" cy="44" r="6.5" fill="#4a3010"/>
      <circle cx="63" cy="44" r="6.5" fill="#4a3010"/>
      <circle cx="38.5" cy="41.5" r="2.5" fill="white"/>
      <circle cx="64.5" cy="41.5" r="2.5" fill="white"/>
      <path d="M40,70 Q50,78 60,70" stroke="#b06820" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="37" cy="82" rx="7" ry="5" fill="#FF6B9D" opacity="0.5"/>
      <ellipse cx="63" cy="82" rx="7" ry="5" fill="#FF6B9D" opacity="0.5"/>
    </svg>`,
  },
  {
    name: 'ハムスター', color: '#D97706', bg: '#FFFBE5',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="22" cy="20" r="16" fill="#FFD4A0"/>
      <circle cx="78" cy="20" r="16" fill="#FFD4A0"/>
      <circle cx="22" cy="20" r="9" fill="#FFB6C1"/>
      <circle cx="78" cy="20" r="9" fill="#FFB6C1"/>
      <ellipse cx="14" cy="64" rx="15" ry="12" fill="#FFE5B4"/>
      <ellipse cx="86" cy="64" rx="15" ry="12" fill="#FFE5B4"/>
      <ellipse cx="50" cy="58" rx="34" ry="30" fill="#FFEAA0"/>
      <circle cx="38" cy="50" r="7" fill="#222"/>
      <circle cx="62" cy="50" r="7" fill="#222"/>
      <circle cx="40" cy="47" r="2.5" fill="white"/>
      <circle cx="64" cy="47" r="2.5" fill="white"/>
      <ellipse cx="50" cy="62" rx="4" ry="3.5" fill="#FF9EC1"/>
      <path d="M44,68 Q50,74 56,68" stroke="#FF9EC1" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <line x1="22" y1="64" x2="40" y2="66" stroke="#ddd" stroke-width="1.5"/>
      <line x1="22" y1="70" x2="40" y2="70" stroke="#ddd" stroke-width="1.5"/>
      <line x1="60" y1="66" x2="78" y2="64" stroke="#ddd" stroke-width="1.5"/>
      <line x1="60" y1="70" x2="78" y2="70" stroke="#ddd" stroke-width="1.5"/>
    </svg>`,
  },
  {
    name: 'ゾウ', color: '#A855F7', bg: '#F5E5FF',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <ellipse cx="9" cy="44" rx="14" ry="24" fill="#C084FC"/>
      <ellipse cx="91" cy="44" rx="14" ry="24" fill="#C084FC"/>
      <ellipse cx="9" cy="44" rx="8" ry="16" fill="#DDD6FE"/>
      <ellipse cx="91" cy="44" rx="8" ry="16" fill="#DDD6FE"/>
      <circle cx="50" cy="42" r="30" fill="#E9D5FF"/>
      <path d="M34,63 Q23,79 28,91 Q34,98 40,88 Q42,78 36,70" stroke="#C084FC" stroke-width="10" fill="none" stroke-linecap="round"/>
      <circle cx="36" cy="33" r="6" fill="#333"/>
      <circle cx="64" cy="33" r="6" fill="#333"/>
      <circle cx="37.5" cy="30.5" r="2.5" fill="white"/>
      <circle cx="65.5" cy="30.5" r="2.5" fill="white"/>
      <path d="M40,52 Q50,58 60,52" stroke="#C084FC" stroke-width="2" fill="none" stroke-linecap="round"/>
      <ellipse cx="36" cy="82" rx="6" ry="4" fill="#FF6B9D" opacity="0.4"/>
      <ellipse cx="64" cy="82" rx="6" ry="4" fill="#FF6B9D" opacity="0.4"/>
    </svg>`,
  },
  {
    name: 'キリン', color: '#0D9488', bg: '#E5FFFD',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="32" y="1" width="8" height="16" rx="4" fill="#78716C"/>
      <rect x="60" y="1" width="8" height="16" rx="4" fill="#78716C"/>
      <circle cx="36" cy="1" r="5.5" fill="#78716C"/>
      <circle cx="64" cy="1" r="5.5" fill="#78716C"/>
      <ellipse cx="50" cy="58" rx="29" ry="35" fill="#FDE68A"/>
      <ellipse cx="26" cy="40" rx="8" ry="6" fill="#92400E" opacity="0.5"/>
      <ellipse cx="70" cy="35" rx="6" ry="8" fill="#92400E" opacity="0.5"/>
      <ellipse cx="32" cy="62" rx="7" ry="5" fill="#92400E" opacity="0.5"/>
      <ellipse cx="68" cy="66" rx="6" ry="7" fill="#92400E" opacity="0.5"/>
      <ellipse cx="52" cy="28" rx="5" ry="6" fill="#92400E" opacity="0.5"/>
      <ellipse cx="36" cy="30" rx="6" ry="5" fill="#222"/>
      <ellipse cx="64" cy="30" rx="6" ry="5" fill="#222"/>
      <circle cx="37.5" cy="27.5" r="2.5" fill="white"/>
      <circle cx="65.5" cy="27.5" r="2.5" fill="white"/>
      <circle cx="43" cy="73" r="3.5" fill="#B45309"/>
      <circle cx="57" cy="73" r="3.5" fill="#B45309"/>
      <path d="M40,80 Q50,87 60,80" stroke="#B45309" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    </svg>`,
  },
];

// ===== 状態 =====
const State = {
  mode:       'add',   // 'add' | 'sub'
  answerType: '4',     // '4'   | 'input'
  level:      10,      // 10    | 20
  count:      5,       // 5     | 10
  questions:  [],
  current:    0,
  score:      0,
  numpadVal:  '',
  results:    [],      // [{ correct, formula }]
  answered:   false,
  mute:       false,   // 音声ミュート
  streak:     0,       // 連続正解数
};

// ===== 正解/不正解メッセージ =====
const CORRECT_MSGS = ['せいかい！', 'やったね！', 'すごい！', 'かんぺき！', 'ナイス！', 'さすが！', 'よくできた！'];
const WRONG_MSGS   = ['おしい！もうすこし！', 'つぎはできる！', 'もういちどかんがえよう！'];

// ===== スクリーン切替 =====
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + name);
  if (el) el.classList.add('active');
  // メニュー以外でback-to-hubボタンを表示
  const hub = document.getElementById('back-to-hub');
  if (hub) hub.style.display = (name === 'menu') ? 'none' : 'flex';
}

// ===== セットアップ トグル =====
function selectOpt(key, value, btn) {
  State[key] = (key === 'level' || key === 'count') ? parseInt(value) : value;
  btn.closest('.toggle-group').querySelectorAll('.toggle-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.value === value);
  });
}

// ===== 音声 =====
function speak(text) {
  if (State.mute) return;
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ja-JP'; u.rate = 0.85; u.pitch = 1.2;
  const v = typeof SpeechUtil !== 'undefined' ? SpeechUtil.getVoice() : null;
  if (v) u.voice = v;
  window.speechSynthesis.speak(u);
}

// ===== 音声ミュートトグル =====
function toggleMute(btn) {
  State.mute = !State.mute;
  btn.textContent = State.mute ? '🔇 おんせい なし' : '🔊 おんせい あり';
  btn.classList.toggle('active', !State.mute);
}

// ===== 問題生成 =====
function pickAnimal(exclude) {
  const pool = exclude ? ANIMALS.filter(a => a !== exclude) : ANIMALS;
  return pool[Math.floor(Math.random() * pool.length)];
}

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function makeQuestion() {
  const max = State.level;

  if (State.mode === 'add') {
    const answer = Math.floor(Math.random() * (max - 1)) + 2;
    const a      = Math.floor(Math.random() * (answer - 1)) + 1;
    const b      = answer - a;
    const a1     = pickAnimal(null);
    const a2     = pickAnimal(a1);

    // 足し算バリエーション
    const tmpl = rand([
      {
        questionText: `${a1.name}が ${a}ひき、${a2.name}が ${b}ひきいます。\nあわせて なんひきですか？`,
        speechText:   `${a1.name}が${a}ひき、${a2.name}が${b}ひき。あわせてなんひきですか？`,
      },
      {
        questionText: `${a1.name}が ${a}ひきいます。\nそこへ ${a2.name}が ${b}ひき やってきました。\nぜんぶで なんひきですか？`,
        speechText:   `${a1.name}が${a}ひき。${a2.name}が${b}ひきやってきました。ぜんぶでなんひきですか？`,
      },
      {
        questionText: `${a1.name}のどうぶつえんに ${a}ひき、\n${a2.name}のどうぶつえんに ${b}ひきいます。\nあわせて なんひきですか？`,
        speechText:   `${a1.name}のどうぶつえんに${a}ひき、${a2.name}のどうぶつえんに${b}ひき。あわせてなんひきですか？`,
      },
      {
        questionText: `${a1.name}が ${a}ひきと ${a2.name}が ${b}ひきが\nなかよく あそんでいます。\nみんなで なんひきですか？`,
        speechText:   `${a1.name}が${a}ひきと${a2.name}が${b}ひき、なかよくあそんでいます。みんなでなんひきですか？`,
      },
      {
        questionText: `はこの なかに ${a1.name}が ${a}ひき、\nそとに ${a2.name}が ${b}ひきいます。\nぜんいんで なんひきですか？`,
        speechText:   `はこのなかに${a1.name}が${a}ひき、そとに${a2.name}が${b}ひき。ぜんいんでなんひきですか？`,
      },
    ]);

    return {
      type: 'add', a, b, answer, animal1: a1, animal2: a2,
      formula:       `${a1.name} ${a} ＋ ${a2.name} ${b} ＝ ${answer}`,
      formulaSpeech: `${a}たす${b}は${answer}`,
      questionText:  tmpl.questionText,
      speechText:    tmpl.speechText,
    };

  } else {
    // 引き算：「帰った」系か「ちがい」系か選ぶ
    const useDiff = Math.random() < 0.4; // 40%の確率でちがい問題

    if (useDiff) {
      // ちがい系：A匹とB匹、どちらが何匹おおい？
      const aCount = Math.floor(Math.random() * (max - 1)) + 2;
      const bCount = Math.floor(Math.random() * (aCount - 1)) + 1;
      const answer = aCount - bCount;
      const a1     = pickAnimal(null);
      const a2     = pickAnimal(a1);
      const tmpl   = rand([
        {
          questionText: `${a1.name}が ${aCount}ひき、${a2.name}が ${bCount}ひきいます。\n${a1.name}は ${a2.name}より なんひきおおいですか？`,
          speechText:   `${a1.name}が${aCount}ひき、${a2.name}が${bCount}ひき。${a1.name}は${a2.name}よりなんひきおおいですか？`,
        },
        {
          questionText: `${a1.name}が ${aCount}ひき、${a2.name}が ${bCount}ひきいます。\nちがいは なんひきですか？`,
          speechText:   `${a1.name}が${aCount}ひき、${a2.name}が${bCount}ひき。ちがいはなんひきですか？`,
        },
        {
          questionText: `${a1.name}が ${aCount}ひき、${a2.name}が ${bCount}ひきいます。\n${a2.name}は ${a1.name}より なんひきすくないですか？`,
          speechText:   `${a1.name}が${aCount}ひき、${a2.name}が${bCount}ひき。${a2.name}は${a1.name}よりなんひきすくないですか？`,
        },
      ]);
      return {
        type: 'sub', subType: 'difference',
        a: aCount, b: bCount, answer, animal1: a1, animal2: a2,
        formula:       `${a1.name} ${aCount} ー ${a2.name} ${bCount} ＝ ${answer}`,
        formulaSpeech: `${aCount}ひく${bCount}は${answer}`,
        questionText:  tmpl.questionText,
        speechText:    tmpl.speechText,
      };

    } else {
      // 帰った系
      const total   = Math.floor(Math.random() * (max - 1)) + 2;
      const removed = Math.floor(Math.random() * (total - 1)) + 1;
      const answer  = total - removed;
      const a1      = pickAnimal(null);
      const tmpl    = rand([
        {
          questionText: `${a1.name}が ${total}ひきいます。\n${removed}ひきかえりました。\nのこりは なんひきですか？`,
          speechText:   `${a1.name}が${total}ひき。${removed}ひきかえりました。のこりはなんひきですか？`,
        },
        {
          questionText: `${a1.name}が ${total}ひきいます。\n${removed}ひきが ほかの ばしょへ いきました。\nのこりは なんひきですか？`,
          speechText:   `${a1.name}が${total}ひき。${removed}ひきがほかのばしょへいきました。のこりはなんひきですか？`,
        },
        {
          questionText: `${a1.name}が ${total}ひきいます。\nともだちに ${removed}ひき あげました。\nのこりは なんひきですか？`,
          speechText:   `${a1.name}が${total}ひき。ともだちに${removed}ひきあげました。のこりはなんひきですか？`,
        },
        {
          questionText: `${a1.name}が ${total}ひきいます。\n${removed}ひきが にげてしまいました！\nのこりは なんひきですか？`,
          speechText:   `${a1.name}が${total}ひき。${removed}ひきがにげてしまいました！のこりはなんひきですか？`,
        },
      ]);
      return {
        type: 'sub', subType: 'leaving',
        a: total, b: removed, answer, animal1: a1,
        formula:       `${a1.name} ${total} ー ${removed} ＝ ${answer}`,
        formulaSpeech: `${total}ひく${removed}は${answer}`,
        questionText:  tmpl.questionText,
        speechText:    tmpl.speechText,
      };
    }
  }
}

function generateQuestions() {
  const qs = [];
  for (let i = 0; i < State.count; i++) qs.push(makeQuestion());
  return qs;
}

// ===== ゲーム開始 =====
function startGame() {
  State.questions = generateQuestions();
  State.current   = 0;
  State.score     = 0;
  State.results   = [];
  State.numpadVal = '';
  State.answered  = false;
  State.streak    = 0;

  document.getElementById('q-total').textContent = State.count;
  Fireworks.stop();
  showScreen('game');
  loadQuestion();
}

// ===== 問題読み込み =====
function loadQuestion() {
  State.answered = false;
  const q = State.questions[State.current];

  document.getElementById('q-current').textContent  = State.current + 1;
  document.getElementById('q-score').textContent    = State.score;

  const pct = (State.current / State.count) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';

  document.getElementById('game-question-text').textContent = q.questionText;
  renderAnimalDisplay(q);

  const is4 = State.answerType === '4';
  document.getElementById('area-4choice').style.display = is4  ? 'block' : 'none';
  document.getElementById('area-input').style.display   = !is4 ? 'flex'  : 'none';

  if (is4) {
    renderChoices(q);
  } else {
    State.numpadVal = '';
    document.getElementById('numpad-display').textContent = '？';
  }

  document.getElementById('answer-overlay').style.display = 'none';
  speak(q.speechText);
}

// ===== 動物表示 =====
function renderAnimalDisplay(q) {
  const c = document.getElementById('game-animal-display');
  c.innerHTML = '';

  const top = document.createElement('div');
  top.className = 'formula-top';
  const bottom = document.createElement('div');
  bottom.className = 'formula-bottom';

  if (q.type === 'add') {
    top.appendChild(makeAnimalGroup(q.animal1, q.a));
    top.appendChild(makeOpEl('＋'));
    top.appendChild(makeAnimalGroup(q.animal2, q.b));
  } else if (q.subType === 'difference') {
    // ちがい問題：2グループ並べてマイナス表示
    top.appendChild(makeAnimalGroup(q.animal1, q.a));
    top.appendChild(makeOpEl('－'));
    top.appendChild(makeAnimalGroup(q.animal2, q.b));
  } else {
    top.appendChild(makeSubGroup(q.animal1, q.a, q.b));
  }

  bottom.appendChild(makeOpEl('＝'));
  bottom.appendChild(makeQMark());

  c.appendChild(top);
  c.appendChild(bottom);
}

function makeAnimalGroup(animal, count) {
  const div = document.createElement('div');
  div.className = 'animal-group';

  const grid = document.createElement('div');
  grid.className = 'ag-icon-grid';

  const small = count > 10;
  for (let i = 0; i < count; i++) {
    const icon = document.createElement('div');
    icon.className = 'ag-icon' + (small ? ' small' : '');
    icon.style.animationDelay = (i * 0.1) + 's';
    icon.innerHTML = animal.svg;
    grid.appendChild(icon);
  }

  const label = document.createElement('div');
  label.className = 'ag-name-label';
  label.style.color = animal.color;
  label.textContent = `${animal.name} ${count}ひき`;

  div.appendChild(grid);
  div.appendChild(label);
  return div;
}

function makeSubGroup(animal, total, leaving) {
  const div = document.createElement('div');
  div.className = 'animal-group';

  const label = document.createElement('div');
  label.className = 'ag-name-label';
  label.style.color = animal.color;
  label.textContent = `${animal.name} ${total}ひき`;

  const grid = document.createElement('div');
  grid.className = 'ag-icon-grid';

  const small = total > 10;
  const staying = total - leaving;
  for (let i = 0; i < total; i++) {
    const icon = document.createElement('div');
    icon.className = 'ag-icon' + (small ? ' small' : '') + (i >= staying ? ' leaving' : '');
    icon.style.animationDelay = (i * 0.1) + 's';
    icon.innerHTML = animal.svg;
    grid.appendChild(icon);
  }

  const note = document.createElement('div');
  note.className = 'ag-leaving-note';
  note.textContent = `${leaving}ひき かえった 👋`;

  div.appendChild(label);
  div.appendChild(grid);
  div.appendChild(note);
  return div;
}

function makeOpEl(t) {
  const d = document.createElement('div');
  d.className = 'ag-operator';
  d.textContent = t;
  return d;
}

function makeQMark() {
  const d = document.createElement('div');
  d.className = 'ag-question-mark';
  d.textContent = '？';
  return d;
}

// ===== 4択ボタン =====
function renderChoices(q) {
  const grid = document.getElementById('choices-grid');
  grid.innerHTML = '';

  const correct = q.answer;
  const max = State.level + 5;
  const wrongs = new Set();

  let attempts = 0;
  while (wrongs.size < 3 && attempts < 200) {
    attempts++;
    const offset = Math.floor(Math.random() * 8) - 4;
    const w = correct + (offset === 0 ? 1 : offset);
    if (w > 0 && w <= max && w !== correct) wrongs.add(w);
  }

  const choices = [...wrongs, correct].sort(() => Math.random() - 0.5);
  choices.forEach(val => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = val;
    btn.onclick = () => checkAnswer(val, btn);
    grid.appendChild(btn);
  });
}

// ===== 答えチェック =====
function checkAnswer(selected, btnEl) {
  if (State.answered) return;
  State.answered = true;

  const q       = State.questions[State.current];
  const correct = q.answer;
  const isOK    = selected === correct;

  // ボタン無効化
  document.querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = true;
    if (b !== btnEl) b.style.opacity = '0.45';
  });

  if (isOK) {
    State.score++;
    if (btnEl) btnEl.classList.add('correct');
    Fireworks.fire(6, false);
  } else {
    if (btnEl) btnEl.classList.add('wrong');
    document.querySelectorAll('.choice-btn').forEach(b => {
      if (parseInt(b.textContent) === correct) b.classList.add('correct');
    });
  }

  State.results.push({ correct: isOK, formula: q.formula });
  setTimeout(() => showAnswerResult(isOK, q), 420);
}

// ===== 数字入力 =====
function numpadPress(n) {
  if (State.answered) return;
  if (State.numpadVal.length >= 2) return;
  State.numpadVal += n;
  document.getElementById('numpad-display').textContent = State.numpadVal;
}

function numpadDelete() {
  if (State.answered) return;
  State.numpadVal = State.numpadVal.slice(0, -1);
  document.getElementById('numpad-display').textContent = State.numpadVal || '？';
}

function numpadConfirm() {
  if (State.answered || !State.numpadVal) return;
  checkAnswer(parseInt(State.numpadVal), null);
}

// ===== 正解/不正解オーバーレイ =====
function showAnswerResult(isOK, q) {
  const overlay   = document.getElementById('answer-overlay');
  const mark      = document.getElementById('answer-mark');
  const formula   = document.getElementById('answer-formula');
  const streakEl  = document.getElementById('answer-streak');
  const streakNum = document.getElementById('streak-count');

  mark.textContent = isOK ? '○' : '✕';
  mark.className   = 'answer-mark ' + (isOK ? 'correct' : 'wrong');
  formula.textContent = q.formula;

  // 連続正解バッジ
  if (isOK) {
    State.streak++;
    if (State.streak >= 3) {
      streakNum.textContent = State.streak;
      streakEl.style.display = 'block';
      // アニメリセット
      streakEl.style.animation = 'none';
      void streakEl.offsetWidth;
      streakEl.style.animation = '';
    } else {
      streakEl.style.display = 'none';
    }
  } else {
    State.streak = 0;
    streakEl.style.display = 'none';
  }

  overlay.style.display = 'flex';

  // ランダムメッセージ + 連続正解時は特別音声
  if (isOK) {
    const msg = rand(CORRECT_MSGS);
    const streakMsg = State.streak >= 3 ? `${State.streak}もんれんぞく！` : '';
    speak(streakMsg + msg + q.formulaSpeech);
  } else {
    speak(rand(WRONG_MSGS) + 'こたえは' + q.formulaSpeech);
  }
}

// ===== 次の問題 =====
function nextQuestion() {
  State.current++;
  if (State.current >= State.count) {
    showFinalResult();
  } else {
    loadQuestion();
  }
}

// ===== やめる確認（カスタムダイアログ） =====
function confirmQuit() {
  // スコアに応じてアイコン変える
  const pct = State.score / Math.max(State.current, 1);
  const icon = pct >= 0.7 ? '😿' : pct >= 0.4 ? '🤔' : '😢';
  document.getElementById('quit-icon').textContent = icon;
  document.getElementById('quit-overlay').style.display = 'flex';
}

function closeQuitDialog() {
  document.getElementById('quit-overlay').style.display = 'none';
}

function doQuit() {
  closeQuitDialog();
  Fireworks.stop();
  showScreen('menu');
}

// ===== 最終結果 =====
function showFinalResult() {
  const correct   = State.score;
  const total     = State.count;
  const pct       = correct / total;
  const isPerfect = pct === 1;

  let title, emoji;
  if (isPerfect)    { title = '🎉 ぜんもんせいかい！！！ 🎉'; emoji = '🌈'; }
  else if (pct >= 0.8) { title = '✨ すごい！！'; emoji = '😄'; }
  else if (pct >= 0.5) { title = '👍 よくできました！'; emoji = '😊'; }
  else               { title = '😊 れんしゅうしよう！'; emoji = '💪'; }

  document.getElementById('result-title').textContent    = title;
  document.getElementById('result-emoji-big').textContent = emoji;
  document.getElementById('result-score').textContent    = correct;
  document.getElementById('result-total').textContent    = total;

  const stars = Math.round(pct * 3);
  document.getElementById('result-stars').textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);

  const list = document.getElementById('result-list');
  list.innerHTML = State.results.map((r, i) =>
    `<div class="result-item ${r.correct ? 'ok' : 'ng'}">
      <span class="ri-mark">${r.correct ? '○' : '✕'}</span>
      <span class="ri-formula">${r.formula}</span>
    </div>`
  ).join('');

  showScreen('result');

  if (isPerfect) {
    celebratePerfect();
    speak('すばらしい！ぜんもんせいかいです！おめでとう！');
  } else if (pct >= 0.8) {
    Fireworks.fire(8, true);
    speak('すごい！よくできました！おめでとう！');
  } else if (pct >= 0.5) {
    Fireworks.fire(4, false);
    speak('よくできました！またれんしゅうしてね！');
  } else {
    Fireworks.fire(2, false);   // 低スコアでも少し花火
    speak('またれんしゅうしてね！');
  }
}

// ===== 全問正解祝福 =====
function celebratePerfect() {
  // 虹表示
  document.getElementById('result-rainbow').style.display = 'block';

  // 花火連発
  let count = 0;
  const iv = setInterval(() => {
    Fireworks.fire(3, true);
    count++;
    if (count >= 10) clearInterval(iv);
  }, 500);

  // 拍手エモジ
  const container  = document.getElementById('result-applause');
  const emojiList  = ['👏', '🎊', '🎉', '⭐', '🌟', '💫', '🌈', '✨', '🎁', '🏆'];
  for (let i = 0; i < 24; i++) {
    setTimeout(() => {
      const span = document.createElement('span');
      span.className  = 'applause-emoji';
      span.textContent = emojiList[Math.floor(Math.random() * emojiList.length)];
      span.style.left  = (5 + Math.random() * 90) + '%';
      span.style.setProperty('--dur', (1.8 + Math.random() * 2.2) + 's');
      span.style.fontSize = (22 + Math.random() * 28) + 'px';
      container.appendChild(span);
      setTimeout(() => span.remove(), 5000);
    }, i * 180);
  }
}

// ===========================
// 花火システム
// ===========================
const Fireworks = (() => {
  const canvas = document.getElementById('fireworks-canvas');
  const ctx    = canvas.getContext('2d');
  let particles = [];
  let animId    = null;

  const COLORS = [
    '#FF6B9D', '#FFD700', '#5B8DEF', '#4ECDC4',
    '#A855F7', '#FF8C42', '#FF4757', '#00D2FF',
    '#43E97B', '#F9CA24',
  ];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function burst(x, y, big) {
    const count  = big ? 90 : 55;
    const col1   = COLORS[Math.floor(Math.random() * COLORS.length)];
    const col2   = COLORS[Math.floor(Math.random() * COLORS.length)];
    const spd    = big ? 6 : 3.5;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.4;
      const v     = spd + Math.random() * spd;
      particles.push({
        x, y,
        vx: Math.cos(angle) * v, vy: Math.sin(angle) * v,
        color: Math.random() < 0.5 ? col1 : col2,
        alpha: 1,
        size:  (big ? 4 : 3) + Math.random() * 3,
        decay: 0.013 + Math.random() * 0.012,
        shape: Math.random() < 0.6 ? 'circle' : 'rect',
      });
    }
    // 尾引きパーティクル
    for (let i = 0; i < (big ? 22 : 10); i++) {
      const angle = Math.random() * Math.PI * 2;
      const v     = (big ? 9 : 6) + Math.random() * 5;
      particles.push({
        x, y, px: x, py: y,
        vx: Math.cos(angle) * v, vy: Math.sin(angle) * v,
        color: '#FFFDE7',
        alpha: 1, size: 2.5, decay: 0.025, shape: 'line',
      });
    }
  }

  function launch(big) {
    const x = canvas.width  * (0.12 + Math.random() * 0.76);
    const y = canvas.height * (0.06 + Math.random() * 0.42);
    burst(x, y, big);
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      if (p.shape === 'line') { p.px = p.x; p.py = p.y; }
      p.x  += p.vx; p.y  += p.vy;
      p.vy += 0.11;
      p.vx *= 0.98;
      p.alpha -= p.decay;

      if (p.alpha <= 0) { particles.splice(i, 1); continue; }

      ctx.globalAlpha = p.alpha;
      ctx.fillStyle   = p.color;
      ctx.strokeStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      } else if (p.shape === 'rect') {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.vx * 0.3);
        ctx.fillRect(-p.size, -p.size * 0.5, p.size * 2, p.size);
        ctx.restore();
      } else {
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    if (particles.length > 0) animId = requestAnimationFrame(tick);
    else animId = null;
  }

  function fire(count, big) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => launch(big), i * 240);
    }
    if (!animId) animId = requestAnimationFrame(tick);
  }

  function stop() {
    particles = [];
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  window.addEventListener('resize', resize);
  resize();
  return { fire, stop };
})();

// ===== メニュー動物アニメ (SVG) =====
function initMenuAnimals() {
  const row = document.getElementById('menu-animals');
  ANIMALS.forEach((a, i) => {
    const s = document.createElement('span');
    s.className = 'menu-animal';
    s.innerHTML = a.svg;
    s.style.animationDelay = (i * 0.3) + 's';
    row.appendChild(s);
  });
}

// ===== 初期化 =====
window.onload = () => {
  initMenuAnimals();
  speak('どうぶつを かぞえよう！');
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../../sw.js').catch(() => {});
  }
};
