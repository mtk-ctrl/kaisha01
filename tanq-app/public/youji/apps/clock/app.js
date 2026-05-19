'use strict';

// ===== 定数 =====
const LEVELS = [
  { id:1, name:'ちょうど',        desc:'〇じ ちょうど',          stars:'⭐',     type:'read', minStep:60 },
  { id:2, name:'はん',            desc:'〇じはん',               stars:'⭐⭐',   type:'read', minStep:30 },
  { id:3, name:'5ふんきざみ',     desc:'5ふんごと',              stars:'⭐⭐',   type:'read', minStep:5  },
  { id:4, name:'1ふんきざみ',     desc:'1ふんごと',              stars:'⭐⭐⭐', type:'read', minStep:1  },
  { id:5, name:'午前・午後',      desc:'ごぜん・ごごをこたえる', stars:'⭐⭐',   type:'ampm', minStep:5  },
  { id:6, name:'なんぷんご？',    desc:'〇ふんごは なんじ？',    stars:'⭐⭐⭐', type:'after', minStep:5  },
  { id:7, name:'なんぷんまえ？',  desc:'〇ふんまえは なんじ？',  stars:'⭐⭐⭐', type:'before', minStep:5 },
  { id:8, name:'かかった時間',    desc:'どれだけかかった？',     stars:'⭐⭐⭐', type:'duration', minStep:5 },
];

// ===== 状態 =====
const state = {
  level: LEVELS[0],
  style: 'mixed',
  count: 7,
  sound: true,
  questionIndex: 0,
  questions: [],
  correct: 0,
  score: 0,
  combo: 0,
  inputField: 'hour',  // 'hour' | 'min' | 'dhour' | 'dmin'
  inputHour: '',
  inputMin: '',
  inputDHour: '',
  inputDMin: '',
  answered: false,
};

// ===== アプリオブジェクト =====
const app = {
  // ---------- ビュー切替 ----------
  switchView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  },

  // ---------- 設定画面 ----------
  goToSettings() {
    this.switchView('view-settings');
    // ラジオ初期化
    document.getElementById('radio-' + state.style).checked = true;
    // カウントボタン初期化
    document.querySelectorAll('.btn-count').forEach(b => b.classList.remove('active'));
    const countBtn = document.getElementById('count-' + state.count);
    if (countBtn) countBtn.classList.add('active');
    // レベルリスト描画
    this._renderLevelListInSettings();
  },

  toggleSound() {
    state.sound = !state.sound;
    document.getElementById('btn-sound').textContent = state.sound ? 'ON' : 'OFF';
  },

  setCount(n) {
    state.count = n;
    document.querySelectorAll('.btn-count').forEach(b => b.classList.remove('active'));
    document.getElementById('count-' + n).classList.add('active');
  },

  // ---------- レベル選択（設定画面内） ----------
  _renderLevelListInSettings() {
    const records = this._loadRecords();
    const list = document.getElementById('level-list-settings');
    if (!list) return;
    list.innerHTML = '';
    LEVELS.forEach(lv => {
      const rec = records[lv.id] || {};
      const stars = rec.bestStars ? '⭐'.repeat(rec.bestStars) : '－';
      const btn = document.createElement('button');
      btn.className = 'level-btn' + (state.level.id === lv.id ? ' selected' : '');
      btn.innerHTML = `
        <span class="lv-num">Lv${lv.id}</span>
        <span><div class="lv-name">${lv.name}</div><div class="lv-desc">${lv.desc}</div></span>
        <span class="level-stars">${stars}</span>
      `;
      btn.onclick = () => {
        state.level = lv;
        list.querySelectorAll('.level-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      };
      list.appendChild(btn);
    });
  },

  // ---------- レベル選択（独立画面） ----------
  renderLevelList() {
    const records = this._loadRecords();
    const list = document.getElementById('level-list');
    list.innerHTML = '';
    LEVELS.forEach(lv => {
      const rec = records[lv.id] || {};
      const stars = rec.bestStars ? '⭐'.repeat(rec.bestStars) : '－';
      const btn = document.createElement('button');
      btn.className = 'level-btn' + (state.level.id === lv.id ? ' selected' : '');
      btn.innerHTML = `
        <span class="lv-num">Lv${lv.id}</span>
        <span><div class="lv-name">${lv.name}</div><div class="lv-desc">${lv.desc}</div></span>
        <span class="level-stars">${stars}</span>
      `;
      btn.onclick = () => {
        state.level = lv;
        document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      };
      list.appendChild(btn);
    });
  },

  // ---------- ゲーム開始 ----------
  startGame() {
    state.questionIndex = 0;
    state.correct = 0;
    state.score = 0;
    state.combo = 0;
    state.questions = this._generateQuestions();
    this.switchView('view-game');
    const nextBtn = document.getElementById('btn-next');
    if (nextBtn) nextBtn.classList.add('hidden');
    this._renderClockFace('clock-ticks', 'clock-numbers');
    this._renderClockFace('clock2-ticks', 'clock2-numbers');
    this._renderClockFace('clock3-ticks', 'clock3-numbers');
    this._showQuestion();
  },

  quitGame() {
    this.switchView('view-menu');
  },

  // ---------- 問題生成 ----------
  _generateQuestions() {
    const qs = [];
    for (let i = 0; i < state.count; i++) {
      qs.push(this._makeQuestion(state.level, state.style));
    }
    return qs;
  },

  _makeQuestion(lv, style) {
    // 問題スタイル
    let qStyle = style;
    if (style === 'mixed') {
      qStyle = Math.random() < 0.5 ? 'choice' : 'input';
    }

    const step = lv.minStep;

    if (lv.type === 'duration') {
      // 経過時間問題
      const fromH = this._rand(7, 17);
      const fromM = this._randStep(step);
      const durationMin = this._randStep(step === 1 ? 1 : 5) + step;
      const toM = (fromM + durationMin) % 60;
      const toH = fromH + Math.floor((fromM + durationMin) / 60);
      return { type:'duration', qStyle, fromH, fromM, toH: toH % 24, toM, durationMin };
    }
    if (lv.type === 'after') {
      const h = this._rand(7, 17), m = this._randStep(step);
      const addMin = [5,10,15,20,30][Math.floor(Math.random()*5)];
      const nm = (m + addMin) % 60;
      const nh = (h + Math.floor((m + addMin) / 60)) % 24;
      return { type:'after', qStyle, h, m, addMin, ansH: nh, ansM: nm };
    }
    if (lv.type === 'before') {
      const h = this._rand(8, 18), m = this._randStep(step);
      const subMin = [5,10,15,20,30][Math.floor(Math.random()*5)];
      let nm = (m - subMin + 60) % 60;
      let nh = h - (m < subMin ? 1 : 0);
      if (nh < 0) nh = 0;
      return { type:'before', qStyle, h, m, subMin, ansH: nh, ansM: nm };
    }
    if (lv.type === 'ampm') {
      const h = this._rand(0, 23), m = this._randStep(step);
      return { type:'ampm', qStyle, h, m };
    }
    // 基本：時計を読む
    const h = this._rand(1, 12), m = this._randStep(step);
    return { type:'read', qStyle, h, m };
  },

  _rand(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); },
  _randStep(step) {
    const slots = 60 / step;
    return Math.floor(Math.random() * slots) * step;
  },

  // ---------- 問題表示 ----------
  _showQuestion() {
    const q = state.questions[state.questionIndex];
    state.answered = false;

    document.getElementById('question-counter').textContent =
      `${state.questionIndex + 1} / ${state.count}`;
    document.getElementById('combo-display').textContent = `🔥 ${state.combo}コンボ`;
    document.getElementById('combo-display').classList.toggle('hidden', state.combo < 2);
    document.getElementById('score-display').textContent = `⭐ ${state.score}`;
    document.getElementById('level-indicator').textContent =
      `Lv${state.level.id}「${state.level.name}」`;
    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('feedback').className = 'feedback hidden';

    // 時計2つ表示の切り替え
    const single = document.getElementById('clock-container');
    const dual   = document.getElementById('clock2-container');
    if (q.type === 'duration') {
      single.classList.add('hidden');
      dual.classList.remove('hidden');
      this._setClock('hour-hand2', 'minute-hand2', q.fromH % 12, q.fromM);
      this._setClock('hour-hand3', 'minute-hand3', q.toH % 12, q.toM);
    } else {
      single.classList.remove('hidden');
      dual.classList.add('hidden');
      const dispH = (q.h !== undefined ? q.h : (q.fromH !== undefined ? q.fromH : 0)) % 12;
      const dispM = q.m !== undefined ? q.m : 0;
      this._setClock('hour-hand', 'minute-hand', dispH, dispM);
    }

    // 問題文
    document.getElementById('question-text').innerHTML = this._makeQuestionText(q);

    // ヒント
    const hintArea = document.getElementById('hint-area');
    const hintText = document.getElementById('hint-text');
    hintArea.classList.toggle('hidden', state.level.id <= 2);
    hintText.classList.add('hidden');
    document.getElementById('btn-hint').disabled = false;

    // 回答エリア
    const choicesEl = document.getElementById('choices-container');
    const inputEl   = document.getElementById('input-container');

    if (q.qStyle === 'choice') {
      choicesEl.classList.remove('hidden');
      inputEl.classList.add('hidden');
      this._renderChoices(q);
    } else {
      choicesEl.classList.add('hidden');
      inputEl.classList.remove('hidden');
      this._resetInput(q);
    }
  },

  _makeQuestionText(q) {
    if (q.type === 'duration') return 'どれだけ じかんが かかりましたか？';
    if (q.type === 'after')    return `${q.addMin}ぷん ごは なんじ なんぷん？`;
    if (q.type === 'before')   return `${q.subMin}ぷん まえは なんじ なんぷん？`;
    if (q.type === 'ampm') {
      const ap = q.h < 12 ? 'ごぜん' : 'ごご';
      const dh = q.h % 12 || 12;
      return `この とけいは <b>${ap} ${dh}じ ${q.m}ぷん</b> ですか？`;
    }
    return 'なんじ なんぷんですか？';
  },

  // ---------- 時計描画 ----------
  _setClock(hourId, minId, h12, m) {
    const hDeg = (h12 * 30) + (m * 0.5);  // 時針：30°/時 + 0.5°/分
    const mDeg = m * 6;                     // 分針：6°/分

    const toXY = (deg, r) => ({
      x: 100 + r * Math.sin((deg * Math.PI) / 180),
      y: 100 - r * Math.cos((deg * Math.PI) / 180),
    });

    const hp = toXY(hDeg, 42);
    const mp = toXY(mDeg, 62);

    const hEl = document.getElementById(hourId);
    const mEl = document.getElementById(minId);
    if (hEl) { hEl.setAttribute('x2', hp.x); hEl.setAttribute('y2', hp.y); }
    if (mEl) { mEl.setAttribute('x2', mp.x); mEl.setAttribute('y2', mp.y); }
  },

  _renderClockFace(ticksId, numsId) {
    const ticks = document.getElementById(ticksId);
    const nums  = document.getElementById(numsId);
    if (!ticks || !nums) return;

    // 目盛り
    let ticksHTML = '';
    for (let i = 0; i < 60; i++) {
      const deg = i * 6;
      const rad = (deg - 90) * Math.PI / 180;
      const isMajor = i % 5 === 0;
      const r1 = isMajor ? 78 : 84;
      const r2 = 90;
      const x1 = 100 + r1 * Math.cos(rad);
      const y1 = 100 + r1 * Math.sin(rad);
      const x2 = 100 + r2 * Math.cos(rad);
      const y2 = 100 + r2 * Math.sin(rad);
      ticksHTML += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"
        stroke="${isMajor ? '#2c3e50' : '#bbb'}" stroke-width="${isMajor ? 2.5 : 1}"/>`;
    }
    ticks.innerHTML = ticksHTML;

    // 数字
    let numsHTML = '';
    for (let n = 1; n <= 12; n++) {
      const deg = (n * 30 - 90) * Math.PI / 180;
      const r = 68;
      const x = 100 + r * Math.cos(deg);
      const y = 100 + r * Math.sin(deg);
      numsHTML += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}"
        text-anchor="middle" dominant-baseline="central"
        font-size="13" font-weight="bold" fill="#2c3e50"
        font-family="sans-serif">${n}</text>`;
    }
    nums.innerHTML = numsHTML;
  },

  // ---------- 4択生成 ----------
  _renderChoices(q) {
    const correct = this._getAnswer(q);
    const choices = this._makeChoices(q, correct);
    const el = document.getElementById('choices-container');
    el.innerHTML = '';
    choices.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'btn-choice';
      btn.textContent = c.label;
      btn._answerValue = c.value;
      btn.onclick = () => this._checkChoice(btn, c.value, correct, el);
      el.appendChild(btn);
    });
  },

  _getAnswer(q) {
    if (q.type === 'duration') return { h: Math.floor(q.durationMin / 60), m: q.durationMin % 60 };
    if (q.type === 'after')    return { h: q.ansH, m: q.ansM };
    if (q.type === 'before')   return { h: q.ansH, m: q.ansM };
    if (q.type === 'ampm')     return { ampm: q.h < 12 ? 'ごぜん' : 'ごご' };
    return { h: q.h, m: q.m };
  },

  _makeChoices(q, correct) {
    if (q.type === 'ampm') {
      return [
        { label: 'ごぜん', value: { ampm: 'ごぜん' } },
        { label: 'ごご',   value: { ampm: 'ごご'   } },
      ];
    }

    const pool = new Set();
    const toKey = v => `${v.h}-${v.m}`;
    pool.add(toKey(correct));
    const choices = [correct];

    while (choices.length < 4) {
      let dh = correct.h + this._randOffset([-1,0,0,1][Math.floor(Math.random()*4)]);
      let dm = correct.m + this._randOffset([-10,-5,5,10][Math.floor(Math.random()*4)]);
      if (dm < 0) { dm += 60; dh -= 1; }
      if (dm >= 60) { dm -= 60; dh += 1; }
      dh = ((dh - 1 + 12) % 12) + 1;
      const v = { h: dh, m: dm };
      const k = toKey(v);
      if (!pool.has(k)) {
        pool.add(k);
        choices.push(v);
      }
    }

    // シャッフル
    choices.sort(() => Math.random() - 0.5);

    return choices.map(v => ({
      value: v,
      label: this._formatAnswer(v, q),
    }));
  },

  _randOffset(delta) { return delta; },

  _formatAnswer(v, q) {
    if (v.ampm) return v.ampm;
    if (q.type === 'duration') {
      if (v.h === 0) return `${v.m}ふん`;
      if (v.m === 0) return `${v.h}じかん`;
      return `${v.h}じかん ${v.m}ふん`;
    }
    return `${v.h}じ ${v.m === 0 ? 'ちょうど' : v.m + 'ふん'}`;
  },

  _checkChoice(btn, value, correct, container) {
    if (state.answered) return;
    state.answered = true;

    const isCorrect = this._isCorrect(value, correct);
    // 全ボタン無効化
    container.querySelectorAll('.btn-choice').forEach(b => { b.onclick = null; });

    if (isCorrect) {
      btn.classList.add('correct');
      this._onCorrect();
    } else {
      btn.classList.add('wrong');
      // 正解を緑に
      container.querySelectorAll('.btn-choice').forEach(b => {
        if (b._answerValue && this._isCorrect(b._answerValue, correct)) b.classList.add('correct');
      });
      this._onWrong();
    }

    this._showNextButton();
  },

  _isCorrect(value, correct) {
    if (correct.ampm) return value.ampm === correct.ampm;
    return value.h === correct.h && value.m === correct.m;
  },

  // ---------- テンキー入力 ----------
  _resetInput(q) {
    state.inputHour = '';
    state.inputMin  = '';
    state.inputDHour = '';
    state.inputDMin  = '';
    state.inputField = q.type === 'duration' ? 'dhour' : 'hour';

    const durRow = document.getElementById('duration-input-row');
    durRow.classList.toggle('hidden', q.type !== 'duration');

    this._updateInputDisplay();
  },

  numpadInput(digit) {
    if (state.answered) return;
    const f = state.inputField;
    if (f === 'hour') {
      if (state.inputHour.length < 2) state.inputHour += digit;
    } else if (f === 'min') {
      if (state.inputMin.length < 2) state.inputMin += digit;
    } else if (f === 'dhour') {
      if (state.inputDHour.length < 2) state.inputDHour += digit;
    } else if (f === 'dmin') {
      if (state.inputDMin.length < 2) state.inputDMin += digit;
    }
    this._updateInputDisplay();
  },

  numpadDelete() {
    if (state.answered) return;
    const f = state.inputField;
    if (f === 'hour')  { state.inputHour  = state.inputHour.slice(0,-1);  }
    if (f === 'min') {
      if (state.inputMin === '') {
        // 「分」が空なら「時」フィールドに戻る
        state.inputField = 'hour';
      } else {
        state.inputMin = state.inputMin.slice(0,-1);
      }
    }
    if (f === 'dhour') { state.inputDHour = state.inputDHour.slice(0,-1); }
    if (f === 'dmin') {
      if (state.inputDMin === '') {
        // 「分」が空なら「時間」フィールドに戻る
        state.inputField = 'dhour';
      } else {
        state.inputDMin = state.inputDMin.slice(0,-1);
      }
    }
    this._updateInputDisplay();
  },

  // 入力フィールドを直接選択する（タップでクリアして再入力）
  setInputField(field) {
    if (state.answered) return;
    state.inputField = field;
    // タップ時にそのフィールドをクリアして再入力できるようにする
    if (field === 'hour')  state.inputHour  = '';
    else if (field === 'min')   state.inputMin   = '';
    else if (field === 'dhour') state.inputDHour = '';
    else if (field === 'dmin')  state.inputDMin  = '';
    this._updateInputDisplay();
  },

  numpadOK() {
    if (state.answered) return;
    const q = state.questions[state.questionIndex];
    const f = state.inputField;

    // フィールド切替（未入力なら切り替えず待機）
    if (f === 'hour') {
      if (state.inputHour === '') return;
      state.inputField = 'min';
      this._updateInputDisplay();
      return;
    }
    if (f === 'dhour') {
      if (state.inputDHour === '') return;
      state.inputField = 'dmin';
      this._updateInputDisplay();
      return;
    }

    // 答え合わせ（「時」が未入力なら送信しない）
    let value;
    if (q.type === 'duration') {
      if (state.inputDHour === '') return;
      value = { h: parseInt(state.inputDHour), m: parseInt(state.inputDMin||'0') };
    } else {
      if (state.inputHour === '') return;
      value = { h: parseInt(state.inputHour), m: parseInt(state.inputMin||'0') };
    }
    const correct = this._getAnswer(q);
    state.answered = true;

    if (this._isCorrect(value, correct)) {
      this._onCorrect();
    } else {
      this._onWrong();
    }
    this._showNextButton();
  },

  _updateInputDisplay() {
    const f = state.inputField;
    const hEl = document.getElementById('input-hour');
    const mEl = document.getElementById('input-minute');
    const dhEl = document.getElementById('input-dhour');
    const dmEl = document.getElementById('input-dmin');
    const focusLabel = document.getElementById('input-focus-label');

    if (hEl) { hEl.textContent = state.inputHour || '__'; hEl.classList.toggle('active-field', f === 'hour'); }
    if (mEl) { mEl.textContent = state.inputMin   || '__'; mEl.classList.toggle('active-field', f === 'min');  }
    if (dhEl){ dhEl.textContent = state.inputDHour || '__'; dhEl.classList.toggle('active-field', f === 'dhour'); }
    if (dmEl){ dmEl.textContent = state.inputDMin  || '__'; dmEl.classList.toggle('active-field', f === 'dmin');  }

    const labels = { hour:'「じ」をいれてね', min:'「ふん」をいれてね', dhour:'「じかん」をいれてね', dmin:'「ふん」をいれてね' };
    if (focusLabel) focusLabel.textContent = labels[f] || '';
  },

  // ---------- 正解・不正解 ----------
  _onCorrect() {
    state.correct++;
    state.combo++;
    const bonus = state.combo >= 3 ? 20 : state.combo >= 2 ? 10 : 0;
    state.score += 10 + bonus;
    this._showFeedback(true, bonus);
    if (state.sound) this._beep(880, 0.15);
  },
  _onWrong() {
    state.combo = 0;
    this._showFeedback(false, 0);
    if (state.sound) this._beep(220, 0.2);
  },

  _showFeedback(isOk, bonus) {
    const el = document.getElementById('feedback');
    el.className = 'feedback ' + (isOk ? 'feedback-correct' : 'feedback-wrong');
    const msgs = isOk
      ? ['やったね！🎉','すごい！✨','せいかい！🌟','ばっちり！👍','かんぺき！💫']
      : ['ざんねん…😢','もう一回！💪','がんばれ！🔥','つぎはできる！⭐'];
    el.textContent = msgs[Math.floor(Math.random()*msgs.length)];
    if (bonus > 0) el.textContent += ` +${bonus}ボーナス！`;
    el.classList.remove('hidden');
  },

  // ---------- 次へボタン ----------
  _showNextButton() {
    const btn = document.getElementById('btn-next');
    if (!btn) return;
    const isLast = state.questionIndex >= state.count - 1;
    btn.textContent = isLast ? 'けっかをみる！🎉' : 'つぎへ →';
    btn.classList.remove('hidden');
  },

  nextQuestion() {
    const btn = document.getElementById('btn-next');
    if (btn) btn.classList.add('hidden');
    this._nextOrResult();
  },

  _nextOrResult() {
    state.questionIndex++;
    if (state.questionIndex >= state.count) {
      this._showResult();
    } else {
      this._showQuestion();
    }
  },

  // ---------- ヒント ----------
  showHint() {
    const q = state.questions[state.questionIndex];
    const hints = {
      read:     '長い針が「ふん」、短い針が「じ」を指しています。',
      ampm:     'ひるの12じより前はごぜん、後はごごです。',
      after:    '分針を足して60を超えたら、時針も1つ進みます。',
      before:   '分針を引いて0より小さくなったら、時針も1つ戻ります。',
      duration: '2つの時計の間の時間を計算しましょう。',
    };
    const hintText = document.getElementById('hint-text');
    hintText.textContent = hints[q.type] || '時計の針をよく見てね！';
    hintText.classList.remove('hidden');
    document.getElementById('btn-hint').disabled = true;
  },

  // ---------- リザルト ----------
  _showResult() {
    this.switchView('view-result');

    const total = state.count;
    const rate  = state.correct / total;

    const stars = rate === 1 ? 3 : rate >= 0.7 ? 2 : 1;
    const titles = ['もう少し！', 'よくできました！', 'すごい！✨'];
    document.getElementById('result-title').textContent   = titles[stars - 1];
    document.getElementById('result-correct').textContent = state.correct;
    document.getElementById('result-total').textContent   = total;
    document.getElementById('result-stars').textContent   = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    document.getElementById('result-point').textContent   = `${state.score} てん`;

    // バッジ
    const badges = document.getElementById('result-badges');
    badges.innerHTML = '';
    if (stars === 3) this._addBadge(badges, '🏆 かんぺき！', 'badge-ok');
    if (state.combo >= 3) this._addBadge(badges, `🔥 ${state.combo}コンボ`, 'badge-ok');
    if (rate < 0.5) this._addBadge(badges, '💪 もう一回！', 'badge-ng');

    // 記録保存
    this._saveRecord(state.level.id, stars, state.score);

    if (stars === 3) this._confetti(document.getElementById('result-confetti'));
  },

  _addBadge(el, text, cls) {
    const b = document.createElement('div');
    b.className = `result-badge ${cls}`;
    b.textContent = text;
    el.appendChild(b);
  },

  // ---------- 記録 ----------
  _loadRecords() {
    try { return JSON.parse(localStorage.getItem('clock_records') || '{}'); } catch(e) { return {}; }
  },
  _saveRecord(lvId, stars, score) {
    const rec = this._loadRecords();
    const prev = rec[lvId] || {};
    rec[lvId] = {
      bestStars: Math.max(prev.bestStars || 0, stars),
      bestScore: Math.max(prev.bestScore || 0, score),
      date: new Date().toLocaleDateString('ja-JP'),
    };
    localStorage.setItem('clock_records', JSON.stringify(rec));
  },

  renderRecords() {
    const rec = this._loadRecords();
    const el = document.getElementById('records-content');
    el.innerHTML = '';
    if (Object.keys(rec).length === 0) {
      el.innerHTML = '<p style="color:#aaa;text-align:center;">まだ きろくがありません</p>';
      return;
    }
    LEVELS.forEach(lv => {
      const r = rec[lv.id];
      if (!r) return;
      const row = document.createElement('div');
      row.className = 'record-row';
      row.innerHTML = `
        <div>
          <div class="record-lv-name">Lv${lv.id} ${lv.name}</div>
          <div class="record-detail">${r.date}｜${r.bestScore}てん</div>
        </div>
        <div class="record-stars">${'⭐'.repeat(r.bestStars)}</div>
      `;
      el.appendChild(row);
    });
  },

  // ---------- 音 ----------
  _beep(freq, dur) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch(e) {}
  },

  // ---------- 紙吹雪 ----------
  _confetti(canvas) {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const pieces = Array.from({length:80}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      w: 8 + Math.random() * 8,
      h: 4 + Math.random() * 4,
      color: ['#FF6B6B','#FFD700','#5BA4EF','#4ECDC4','#FF8C42'][Math.floor(Math.random()*5)],
      speed: 2 + Math.random() * 3,
      angle: Math.random() * Math.PI * 2,
      spin:  (Math.random() - 0.5) * 0.2,
    }));

    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        ctx.restore();
        p.y += p.speed;
        p.angle += p.spin;
        if (p.y > canvas.height + 20) p.y = -20;
      });
      frame++;
      if (frame < 180) requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    draw();
  },

  // ---------- ふくろうSVG ----------
  _renderOwl(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = `
      <svg viewBox="0 0 100 100" width="100" height="100">
        <ellipse cx="50" cy="60" rx="30" ry="32" fill="#F4A460"/>
        <ellipse cx="50" cy="58" rx="22" ry="24" fill="#FFDEAD"/>
        <circle cx="38" cy="48" r="11" fill="white"/>
        <circle cx="62" cy="48" r="11" fill="white"/>
        <circle cx="38" cy="49" r="7" fill="#2c3e50"/>
        <circle cx="62" cy="49" r="7" fill="#2c3e50"/>
        <circle cx="40" cy="47" r="2.5" fill="white"/>
        <circle cx="64" cy="47" r="2.5" fill="white"/>
        <ellipse cx="50" cy="58" rx="5" ry="3" fill="#FF8C00"/>
        <polygon points="40,28 50,18 60,28" fill="#8B4513"/>
        <polygon points="44,29 50,22 56,29" fill="#F4A460"/>
      </svg>
    `;
  },

  // ---------- 初期化 ----------
  init() {
    this._renderOwl('menu-owl');
    this._renderOwl('result-owl');
    this.renderLevelList();

    document.getElementById('btn-sound').textContent = state.sound ? 'ON' : 'OFF';

    // ラジオボタンのイベントリスナー（1度だけ登録）
    document.querySelectorAll('[name="style"]').forEach(r =>
      r.addEventListener('change', e => { state.style = e.target.value; })
    );
  },
};

// 起動
document.addEventListener('DOMContentLoaded', () => {
  app.init();
  // choices に _answerValue をセット（正解ハイライト用）
  // → renderChoices で都度作るので不要、シンプルにテキスト比較で処理済み
});
