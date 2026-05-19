'use strict';
/* ============================================================
   ぞくせい仕分け工場  app.js
   ベン図で属性を仕分ける知育ゲーム（7〜9歳向け）
   ============================================================ */

const App = (() => {

  /* ======================================================
     ステージデータ
     left/right: そのアイテムが各円の属性を持つか
     ====================================================== */
  const STAGES = [
    {
      id: 1,
      name: 'ステージ 1',
      difficulty: 'やさしい ⭐',
      icon: '🌸',
      leftAttr:  { label: 'あかい',   color: '#FF6464', bg: 'rgba(255,100,100,0.22)' },
      rightAttr: { label: 'まるい',   color: '#6496FF', bg: 'rgba(100,150,255,0.22)' },
      speed: 8,   // タイムリミット(秒)
      items: [
        { emoji: '🍎', name: 'りんご',          left: true,  right: true  },
        { emoji: '🍊', name: 'みかん',           left: false, right: true  },
        { emoji: '🚒', name: 'しょうぼうしゃ',   left: true,  right: false },
        { emoji: '📦', name: 'はこ',             left: false, right: false },
        { emoji: '🍓', name: 'いちご',           left: true,  right: true  },
        { emoji: '🏀', name: 'バスケットボール',  left: false, right: true  },
        { emoji: '🌹', name: 'バラ',             left: true,  right: false },
        { emoji: '📚', name: 'ほん',             left: false, right: false },
      ],
    },
    {
      id: 2,
      name: 'ステージ 2',
      difficulty: 'ふつう ⭐⭐',
      icon: '⚡',
      leftAttr:  { label: 'いきもの',   color: '#51CF66', bg: 'rgba(81,207,102,0.22)' },
      rightAttr: { label: 'みずにいる', color: '#339AF0', bg: 'rgba(51,154,240,0.22)' },
      speed: 6,
      items: [
        { emoji: '🐟', name: 'さかな',    left: true,  right: true  },
        { emoji: '🐱', name: 'ねこ',      left: true,  right: false },
        { emoji: '⛵', name: 'ヨット',    left: false, right: true  },
        { emoji: '🪨', name: 'いし',      left: false, right: false },
        { emoji: '🐙', name: 'たこ',      left: true,  right: true  },
        { emoji: '🦁', name: 'ライオン',  left: true,  right: false },
        { emoji: '🚤', name: 'ボート',    left: false, right: true  },
        { emoji: '🏠', name: 'いえ',      left: false, right: false },
      ],
    },
    {
      id: 3,
      name: 'ステージ 3',
      difficulty: 'むずかしい ⭐⭐⭐',
      icon: '🏆',
      leftAttr:  { label: 'のりもの',   color: '#FF922B', bg: 'rgba(255,146,43,0.22)' },
      rightAttr: { label: 'そらをとぶ', color: '#CC5DE8', bg: 'rgba(204,93,232,0.22)' },
      speed: 5,
      items: [
        { emoji: '✈️', name: 'ひこうき',      left: true,  right: true  },
        { emoji: '🚗', name: 'くるま',         left: true,  right: false },
        { emoji: '🦅', name: 'わし',           left: false, right: true  },
        { emoji: '🏔️', name: 'やま',           left: false, right: false },
        { emoji: '🚁', name: 'ヘリコプター',   left: true,  right: true  },
        { emoji: '🚢', name: 'ふね',           left: true,  right: false },
        { emoji: '🦋', name: 'ちょうちょ',     left: false, right: true  },
        { emoji: '🌳', name: 'き',             left: false, right: false },
      ],
    },
  ];

  /* ======================================================
     ゲーム状態
     ====================================================== */
  const st = {
    stageIdx:        0,
    items:           [],
    qIdx:            0,
    score:           0,
    combo:           0,
    maxCombo:        0,
    correct:         0,
    consecutive:     0,   // 連続誤答カウント
    answered:        false,
    timeRaf:         null,
    timeStart:       0,
    timeLimitMs:     8000,
    questionStart:   0,
  };

  /* ======================================================
     ビュー切替
     ====================================================== */
  function switchView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  /* ======================================================
     ステージ選択
     ====================================================== */
  function showStageSelect() {
    _renderStageList();
    switchView('view-stages');
  }

  function _renderStageList() {
    const saved = _loadRecords();
    document.getElementById('stage-list').innerHTML = STAGES.map((s, i) => {
      const rec      = saved[i];
      const unlocked = (i === 0) || !!saved[i - 1];
      const stars    = rec ? '⭐'.repeat(rec.stars) + '☆'.repeat(3 - rec.stars) : '';
      return `
        <button class="stage-card${unlocked ? '' : ' locked'}"
                ${unlocked ? `onclick="App.startStage(${i})"` : ''}>
          <span class="stage-icon">${s.icon}</span>
          <div class="stage-info">
            <div class="stage-name">${s.name}</div>
            <div class="stage-diff">${s.difficulty}</div>
            <div class="stage-attrs">${s.leftAttr.label} ／ ${s.rightAttr.label}</div>
          </div>
          <div class="stage-rec">
            ${rec    ? `${stars}<br>${rec.score}てん`
              : unlocked ? 'まだ'
              : '🔒'}
          </div>
        </button>`;
    }).join('');
  }

  /* ======================================================
     ゲーム開始
     ====================================================== */
  function startStage(idx) {
    st.stageIdx   = idx;
    st.items      = _shuffle([...STAGES[idx].items]);
    st.qIdx       = 0;
    st.score      = 0;
    st.combo      = 0;
    st.maxCombo   = 0;
    st.correct    = 0;
    st.consecutive = 0;
    st.timeLimitMs = STAGES[idx].speed * 1000;

    const stage = STAGES[idx];

    // SVGの色を更新
    const cL = document.getElementById('svg-left');
    const cR = document.getElementById('svg-right');
    cL.setAttribute('fill',   stage.leftAttr.bg);
    cL.setAttribute('stroke', stage.leftAttr.color);
    cR.setAttribute('fill',   stage.rightAttr.bg);
    cR.setAttribute('stroke', stage.rightAttr.color);

    // ゾーンラベル（SVG内テキスト）
    const texts = document.querySelectorAll('.vt');
    // texts[0]=ひだりだけ, texts[1]=りょう, texts[2]=ほう, texts[3]=みぎだけ
    // (left label is already in SVG static text; update programmatically)

    document.getElementById('stage-label').textContent = stage.name;

    switchView('view-game');
    _showQuestion();
  }

  /* ======================================================
     問題表示
     ====================================================== */
  function _showQuestion() {
    if (st.qIdx >= st.items.length) {
      _showResult();
      return;
    }

    st.answered      = false;
    st.questionStart = performance.now();

    const item  = st.items[st.qIdx];
    const stage = STAGES[st.stageIdx];

    // スコア・コンボ更新
    document.getElementById('score-disp').textContent = `⭐ ${st.score}`;
    _updateCombo();
    _updateProgress();

    // アイテム表示
    const card = document.getElementById('item-card');
    card.classList.remove('item-card'); // アニメーションリセット
    void card.offsetWidth;              // reflow
    card.classList.add('item-card');

    document.getElementById('item-emoji').textContent = item.emoji;
    document.getElementById('item-name').textContent  = item.name;

    // ゾーンラベル更新（SVGテキスト）
    _updateVennLabels(stage);

    // フィードバック非表示
    _hideFeedback();

    // ゾーンボタンを有効化
    _setZonesEnabled(true);

    // タイムバー開始
    _startTimeBar();

    // 音声読み上げ
    _speak(item.name);
  }

  function _updateVennLabels(stage) {
    // SVGのvt(ビジュアルテキスト)を更新
    // viewBox内テキスト4要素: ひだりだけ / りょう / ほう / みぎだけ
    const vts = document.querySelectorAll('.vt');
    if (vts.length >= 4) {
      // 左ラベル: ステージの leftAttr.label をひらがなで
      vts[0].textContent = stage.leftAttr.label;
      vts[1].textContent = 'りょう';
      vts[2].textContent = 'ほう';
      vts[3].textContent = stage.rightAttr.label;
    }
  }

  /* ======================================================
     回答処理
     ====================================================== */
  function answer(zone) {
    if (st.answered) return;
    st.answered = true;

    _stopTimeBar();
    _setZonesEnabled(false);

    const item     = st.items[st.qIdx];
    const correct  = _getCorrectZone(item);
    const isOk     = zone === correct;

    // 反応時間(ms)
    const reactionMs = performance.now() - st.questionStart;

    if (isOk) {
      st.correct++;
      st.combo++;
      st.consecutive = 0;
      if (st.combo > st.maxCombo) st.maxCombo = st.combo;

      // スコア計算 (spec §4.1)
      const zoneBonus  = zone === 'both' ? 1.5 : zone === 'neither' ? 1.2 : 1.0;
      const timeBonus  = reactionMs < 2000 ? 1.5 : reactionMs < 4000 ? 1.2 : 1.0;
      const comboIdx   = Math.min(st.combo - 1, 4);
      const comboMult  = [1.0, 1.2, 1.5, 2.0, 3.0][comboIdx];
      const pts        = Math.round(100 * zoneBonus * timeBonus * comboMult);
      st.score        += pts;

      document.getElementById('score-disp').textContent = `⭐ ${st.score}`;
      _updateCombo();
      _flashZone(zone, true);
      _showFeedback('correct', zone, pts);
      _speak('せいかい');
      _vibrate(50);

    } else {
      st.combo       = 0;
      st.consecutive++;
      _updateCombo();
      _flashZone(zone,    false);   // 誤答ゾーン
      _flashZone(correct, true,  true); // 正解ゾーンをゴールド
      _showFeedback('wrong', correct, 0);
      _speak('ざんねん');
      _vibrate([50, 50, 50]);
    }

    setTimeout(() => {
      st.qIdx++;
      _showQuestion();
    }, 1800);
  }

  function _getCorrectZone(item) {
    if (item.left && item.right) return 'both';
    if (item.left)               return 'left';
    if (item.right)              return 'right';
    return 'neither';
  }

  /* ======================================================
     タイムバー
     ====================================================== */
  function _startTimeBar() {
    _stopTimeBar();
    const bar = document.getElementById('time-bar');
    bar.style.transition = 'none';
    bar.style.width      = '100%';
    bar.style.background = '#51CF66';
    st.timeStart = performance.now();
    st.timeRaf   = requestAnimationFrame(_tickTimeBar);
  }

  function _tickTimeBar(ts) {
    if (st.answered) return;
    const elapsed = ts - st.timeStart;
    const pct     = Math.max(0, 1 - elapsed / st.timeLimitMs);
    const bar     = document.getElementById('time-bar');
    bar.style.width      = (pct * 100) + '%';
    bar.style.background = pct > 0.5 ? '#51CF66' : pct > 0.25 ? '#FFD43B' : '#FF6464';

    if (pct > 0) {
      st.timeRaf = requestAnimationFrame(_tickTimeBar);
    } else {
      _onTimeout();
    }
  }

  function _stopTimeBar() {
    if (st.timeRaf) {
      cancelAnimationFrame(st.timeRaf);
      st.timeRaf = null;
    }
  }

  function _onTimeout() {
    if (st.answered) return;
    st.answered    = true;
    st.combo       = 0;
    st.consecutive++;
    _updateCombo();
    _setZonesEnabled(false);

    const item    = st.items[st.qIdx];
    const correct = _getCorrectZone(item);
    _flashZone(correct, true, true);
    _showFeedback('timeout', correct, 0);
    _speak('おちちゃった');

    setTimeout(() => {
      st.qIdx++;
      _showQuestion();
    }, 1800);
  }

  /* ======================================================
     フィードバック
     ====================================================== */
  function _showFeedback(type, zone, pts) {
    const stage    = STAGES[st.stageIdx];
    const el       = document.getElementById('feedback');
    const zoneDesc = _zoneDesc(zone, stage);

    let html = '';
    if (type === 'correct') {
      html = `
        <div class="fb-icon">⭕</div>
        <div class="fb-main">せいかい！ <small style="font-size:14px">+${pts}てん</small></div>
        ${st.combo >= 3 ? `<div class="fb-combo">🔥 ${st.combo}コンボ！</div>` : ''}`;
    } else if (type === 'wrong') {
      html = `
        <div class="fb-icon">❌</div>
        <div class="fb-main">ちがうよ！</div>
        <div class="fb-sub">こたえは「${zoneDesc}」だよ</div>
        ${st.consecutive >= 3 ? '<div class="fb-hint">💡 ゾーンのラベルをよく見てみよう！</div>' : ''}`;
    } else {
      html = `
        <div class="fb-icon">💨</div>
        <div class="fb-main">おちちゃった！</div>
        <div class="fb-sub">こたえは「${zoneDesc}」だったよ</div>`;
    }

    el.className      = `feedback ${type}`;
    el.innerHTML      = html;
    el.style.display  = 'block';
    el.classList.remove('hidden');
  }

  function _hideFeedback() {
    const el = document.getElementById('feedback');
    el.classList.add('hidden');
  }

  function _zoneDesc(zone, stage) {
    if (zone === 'both')    return `${stage.leftAttr.label}で ${stage.rightAttr.label}`;
    if (zone === 'left')    return `${stage.leftAttr.label}だけ`;
    if (zone === 'right')   return `${stage.rightAttr.label}だけ`;
    return 'どちらでもない';
  }

  /* ======================================================
     ゾーンのフラッシュ演出
     ====================================================== */
  function _flashZone(zone, correct, gold) {
    const map = {
      left:    'btn-left',
      both:    'btn-both',
      right:   'btn-right',
      neither: 'btn-neither',
    };
    const el = document.getElementById(map[zone]);
    if (!el) return;

    const cls = gold ? 'correct-flash' : correct ? 'correct-flash' : 'wrong-flash';
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), 1200);
  }

  /* ======================================================
     UI ヘルパー
     ====================================================== */
  function _setZonesEnabled(on) {
    ['btn-left', 'btn-both', 'btn-right', 'btn-neither'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.disabled = !on;
    });
  }

  function _updateCombo() {
    const el = document.getElementById('combo-badge');
    if (st.combo >= 2) {
      el.textContent = `🔥 ${st.combo}コンボ！`;
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  }

  function _updateProgress() {
    // タイムバーはゾーンの上にあるが、進捗はステージラベルに含む
    // （progress-text がなければstage-labelに付記）
    const total   = st.items.length;
    const current = st.qIdx + 1;
    document.getElementById('stage-label').textContent =
      `${STAGES[st.stageIdx].name}  ${current}/${total}`;
  }

  /* ======================================================
     リザルト
     ====================================================== */
  function _showResult() {
    const total = st.items.length;
    const pct   = st.correct / total;
    const stars = pct >= 0.8 ? 3 : pct >= 0.6 ? 2 : pct >= 0.4 ? 1 : 0;

    let title, emoji;
    if (pct === 1)       { title = 'かんぺき！ 100%！'; emoji = '🎉'; }
    else if (pct >= 0.8) { title = 'すばらしい！';      emoji = '✨'; }
    else if (pct >= 0.6) { title = 'よくできました！';  emoji = '😊'; }
    else if (pct >= 0.4) { title = 'がんばったね！';    emoji = '💪'; }
    else                 { title = 'もういちど！';       emoji = '🔄'; }

    document.getElementById('res-emoji').textContent   = emoji;
    document.getElementById('res-title').textContent   = title;
    document.getElementById('res-correct').textContent = st.correct;
    document.getElementById('res-total').textContent   = total;
    document.getElementById('res-score').textContent   = `${st.score}てん`;
    document.getElementById('res-combo').textContent   = `${st.maxCombo}コンボ`;
    document.getElementById('res-stars').innerHTML     =
      '⭐'.repeat(stars) + '☆'.repeat(3 - stars);

    _saveRecord(st.stageIdx, st.score, stars, st.maxCombo);
    switchView('view-result');
  }

  function retry() {
    startStage(st.stageIdx);
  }

  function quitGame() {
    _stopTimeBar();
    showStageSelect();
  }

  /* ======================================================
     きろく (localStorage)
     ====================================================== */
  function _loadRecords() {
    try { return JSON.parse(localStorage.getItem('zokusei_records') || '{}'); }
    catch { return {}; }
  }

  function _saveRecord(idx, score, stars, maxCombo) {
    const rec  = _loadRecords();
    const prev = rec[idx];
    if (!prev || score > prev.score) {
      rec[idx] = { score, stars, maxCombo, date: new Date().toLocaleDateString('ja-JP') };
      localStorage.setItem('zokusei_records', JSON.stringify(rec));
    }
  }

  function showRecords() {
    const rec = _loadRecords();
    document.getElementById('records-content').innerHTML =
      STAGES.map((s, i) => {
        const r = rec[i];
        return `
          <div class="rec-row">
            <span class="rec-stage">${s.icon} ${s.name}</span>
            ${r
              ? `<span class="rec-stars">${'⭐'.repeat(r.stars)}${'☆'.repeat(3 - r.stars)}</span>
                 <span class="rec-score">${r.score}てん</span>`
              : '<span class="rec-none">まだ</span>'}
          </div>`;
      }).join('');
    switchView('view-records');
  }

  /* ======================================================
     音声
     ====================================================== */
  function _speak(text) {
    if (!window.speechSynthesis) return;
    try {
      speechSynthesis.cancel();
      const u  = new SpeechSynthesisUtterance(text);
      u.lang   = 'ja-JP';
      u.rate   = 0.88;
      u.pitch  = 1.1;
      if (window.SpeechUtil) {
        const v = SpeechUtil.getVoice();
        if (v) u.voice = v;
      }
      speechSynthesis.speak(u);
    } catch (_) {}
  }

  /* ======================================================
     バイブレーション
     ====================================================== */
  function _vibrate(pattern) {
    if (navigator.vibrate) navigator.vibrate(pattern);
  }

  /* ======================================================
     ユーティリティ
     ====================================================== */
  function _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /* ======================================================
     公開 API
     ====================================================== */
  return {
    switchView,
    showStageSelect,
    showRecords,
    startStage,
    answer,
    retry,
    quitGame,
  };

})();
