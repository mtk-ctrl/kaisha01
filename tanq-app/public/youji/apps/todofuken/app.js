// ===== 都道府県マスター app.js =====

const RECORDS_KEY = 'tanq_todofuken_records_v1';
const MAX_RECORDS = 30;

// ===== グローバル状態 =====
let currentMode = 'shape';   // 'shape' | 'location' | 'famous'
let selectedRegion = 'all';
let questionCount = 10;
let questions = [];
let currentIdx = 0;
let score = 0;
let combo = 0;
let missedPrefs = [];
let lastSetup = null;  // 再プレイ用

// フラッシュカード
let fcList = [];
let fcIdx = 0;
let fcFlipped = false;

// ===== セットアップ =====
function openSetup(mode) {
  currentMode = mode;
  const labels = {
    shape: '🔷 かたちクイズ せってい',
    location: '🗾 どこかなクイズ せってい',
    famous: '🍎 めいぶつクイズ せってい',
  };
  document.getElementById('setup-mode-label').textContent = labels[mode] || 'クイズのせってい';
  showScreen('screen-setup');
}

function selectRegion(btn) {
  document.querySelectorAll('.region-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedRegion = btn.dataset.region;
}

function selectCount(btn) {
  document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  questionCount = parseInt(btn.dataset.count, 10);
}

// ===== ゲーム開始 =====
function startGame() {
  lastSetup = { mode: currentMode, region: selectedRegion, count: questionCount };

  let pool = PREFECTURES.filter(p => {
    if (selectedRegion === 'all') return true;
    return p.region === selectedRegion;
  });

  if (pool.length < 4) {
    alert('このはんいは 4けん以上 ひつようです。ぜんぶを えらんでね！');
    return;
  }

  // シャッフルして問題数分取得
  const shuffled = shuffle([...pool]);
  const total = Math.min(questionCount, shuffled.length);
  questions = shuffled.slice(0, total);

  currentIdx = 0;
  score = 0;
  combo = 0;
  missedPrefs = [];

  document.getElementById('feedback-overlay').classList.add('hidden');

  document.getElementById('g-total').textContent = total;
  document.getElementById('g-score').textContent = '0';

  // 地図を生成（locationモード）
  if (currentMode === 'location') {
    buildMap();
  }

  showScreen('screen-game');
  renderQuestion();
}

function restartSame() {
  if (lastSetup) {
    currentMode = lastSetup.mode;
    selectedRegion = lastSetup.region;
    questionCount = lastSetup.count;
    startGame();
  } else {
    showScreen('screen-menu');
  }
}

// ===== SVG地図生成 =====
function buildMap() {
  const mapEl = document.getElementById('japan-map');
  // 沖縄以外を描画
  mapEl.innerHTML = '';
  PREFECTURES.forEach(pref => {
    if (pref.id === 'okinawa') return;
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    poly.setAttribute('points', pref.points);
    poly.setAttribute('fill', pref.regionColor);
    poly.setAttribute('class', 'map-pref');
    poly.setAttribute('id', 'map-' + pref.id);
    poly.setAttribute('data-id', pref.id);
    mapEl.appendChild(poly);
  });
}

// ===== 問題描画 =====
function renderQuestion() {
  const pref = questions[currentIdx];
  const total = questions.length;

  // プログレス
  document.getElementById('g-current').textContent = currentIdx + 1;
  document.getElementById('game-progress-fill').style.width = ((currentIdx / total) * 100) + '%';

  // コンボバッジ
  const comboBadge = document.getElementById('combo-badge');
  if (combo >= 2) {
    comboBadge.classList.remove('hidden');
    document.getElementById('combo-num').textContent = combo;
  } else {
    comboBadge.classList.add('hidden');
  }

  // 問題表示を全部隠す
  document.getElementById('q-shape').classList.add('hidden');
  document.getElementById('q-location').classList.add('hidden');
  document.getElementById('q-famous').classList.add('hidden');

  if (currentMode === 'shape') {
    renderShapeQuestion(pref);
  } else if (currentMode === 'location') {
    renderLocationQuestion(pref);
  } else if (currentMode === 'famous') {
    renderFamousQuestion(pref);
  }

  // 選択肢
  const choices = buildChoices(pref);
  for (let i = 0; i < 4; i++) {
    const btn = document.getElementById('c' + i);
    btn.textContent = choices[i].name + '\n' + choices[i].kana;
    btn.style.whiteSpace = 'pre-line';
    btn.dataset.id = choices[i].id;
    btn.className = 'choice-btn';
    btn.disabled = false;
  }
}

function renderShapeQuestion(pref) {
  document.getElementById('q-shape').classList.remove('hidden');

  const svg = document.getElementById('shape-svg');
  const poly = document.getElementById('shape-polygon');

  // points を 200x200 のビューボックスに正規化
  const pts = parsePoints(pref.points);
  const scaled = scalePoints(pts, 200, 200, 12);
  poly.setAttribute('points', scaled);
  poly.setAttribute('fill', '#3b82f6');
}

function renderLocationQuestion(pref) {
  document.getElementById('q-location').classList.remove('hidden');

  // 地図上でハイライト
  document.querySelectorAll('.map-pref').forEach(p => {
    if (p.dataset.id === pref.id) {
      p.classList.add('highlight');
      p.classList.remove('dimmed');
      p.setAttribute('fill', pref.regionColor);
    } else {
      p.classList.remove('highlight');
      p.classList.add('dimmed');
    }
  });

  // 沖縄の場合はインセットをハイライト、それ以外はリセット
  const okinawaInset = document.querySelector('.okinawa-inset');
  if (pref.id === 'okinawa') {
    document.querySelectorAll('.map-pref').forEach(p => {
      p.classList.add('dimmed');
      p.classList.remove('highlight');
    });
    if (okinawaInset) okinawaInset.classList.add('highlight');
  } else {
    if (okinawaInset) okinawaInset.classList.remove('highlight');
  }
}

function renderFamousQuestion(pref) {
  document.getElementById('q-famous').classList.remove('hidden');

  // ランダムで名物を選ぶ
  const idx = Math.floor(Math.random() * pref.famous.length);
  const item = pref.famous[idx];
  document.getElementById('famous-emoji').textContent = item.emoji;
  document.getElementById('famous-name').textContent = item.name;
}

// ===== 選択肢生成 =====
function buildChoices(correctPref) {
  const pool = PREFECTURES.filter(p => p.id !== correctPref.id);

  // 同じ地方から1つ
  const sameRegion = pool.filter(p => p.region === correctPref.region);
  const diffRegion = pool.filter(p => p.region !== correctPref.region);

  const chosen = [];
  if (sameRegion.length > 0) {
    chosen.push(pickRandom(sameRegion, chosen));
  }
  while (chosen.length < 3) {
    const pick = pickRandom(diffRegion.length > 0 ? diffRegion : pool, chosen);
    if (pick) chosen.push(pick);
  }

  const all = [correctPref, ...chosen.slice(0, 3)];
  return shuffle(all);
}

function pickRandom(arr, exclude = []) {
  const excludeIds = exclude.map(e => e.id);
  const available = arr.filter(p => !excludeIds.includes(p.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

// ===== 回答 =====
function answer(btnIdx) {
  const pref = questions[currentIdx];
  const btn = document.getElementById('c' + btnIdx);
  const isCorrect = btn.dataset.id === pref.id;

  // ボタン全部無効化
  for (let i = 0; i < 4; i++) {
    const b = document.getElementById('c' + i);
    b.disabled = true;
    if (b.dataset.id === pref.id) {
      b.classList.add('correct');
    } else if (i === btnIdx && !isCorrect) {
      b.classList.add('wrong');
    }
  }

  if (isCorrect) {
    combo++;
    const comboBonus = Math.min((combo - 1) * 20, 100);
    score += 100 + comboBonus;
    document.getElementById('g-score').textContent = score;
  } else {
    combo = 0;
    missedPrefs.push(pref);
  }

  // フィードバック
  showFeedback(pref, isCorrect);

  // 音声
  if (window.tanqSpeak) {
    tanqSpeak(pref.name);
  }
}

function showFeedback(pref, isCorrect) {
  const overlay = document.getElementById('feedback-overlay');
  overlay.classList.remove('hidden');

  document.getElementById('feedback-mark').textContent = isCorrect ? '⭕' : '❌';
  document.getElementById('feedback-pref').textContent = pref.name;
  document.getElementById('feedback-pref').style.color = isCorrect ? '#4ade80' : '#f87171';
  document.getElementById('feedback-kana').textContent = pref.kana;
  document.getElementById('feedback-capital').textContent = '県庁所在地: ' + pref.capital + '（' + pref.capitalKana + '）';
  document.getElementById('feedback-fact').textContent = pref.fact;

  const comboEl = document.getElementById('feedback-combo');
  if (isCorrect && combo >= 2) {
    comboEl.style.display = 'block';
    comboEl.textContent = '🔥 ' + combo + 'れんぞく！ボーナス +' + Math.min((combo-1)*20,100) + 'てん';
  } else {
    comboEl.style.display = 'none';
  }
}

function nextQuestion() {
  document.getElementById('feedback-overlay').classList.add('hidden');
  currentIdx++;

  if (currentIdx >= questions.length) {
    showResult();
  } else {
    renderQuestion();
  }
}

// ===== 結果 =====
function showResult() {
  const total = questions.length;
  const correct = total - missedPrefs.length;
  const pct = correct / total;

  let stars = '⭐';
  let emoji = '👍';
  let title = 'がんばった！';
  if (pct >= 0.9) { stars = '⭐⭐⭐'; emoji = '🎉'; title = 'かんぺき！' }
  else if (pct >= 0.7) { stars = '⭐⭐'; emoji = '😊'; title = 'すごい！' }

  document.getElementById('result-emoji').textContent = emoji;
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-stars').textContent = stars;
  document.getElementById('r-correct').textContent = correct;
  document.getElementById('r-total').textContent = total;
  document.getElementById('r-score').textContent = score + 'てん';

  const missWrap = document.getElementById('miss-wrap');
  const missList = document.getElementById('miss-list');
  if (missedPrefs.length === 0) {
    missWrap.style.display = 'none';
  } else {
    missWrap.style.display = '';
    missList.innerHTML = missedPrefs.map(p =>
      `<span class="miss-chip">${p.name}</span>`
    ).join('');
  }

  // 記録保存
  saveRecord({ mode: currentMode, region: selectedRegion, correct, total, score, stars, date: new Date().toLocaleDateString('ja-JP') });

  showScreen('screen-result');
}

// ===== やめる =====
function confirmQuit() {
  document.getElementById('quit-overlay').classList.remove('hidden');
}
function closeQuit() {
  document.getElementById('quit-overlay').classList.add('hidden');
}
function doQuit() {
  document.getElementById('quit-overlay').classList.add('hidden');
  showScreen('screen-menu');
}

// ===== きろく =====
function saveRecord(rec) {
  let records = loadRecords();
  records.unshift(rec);
  if (records.length > MAX_RECORDS) records = records.slice(0, MAX_RECORDS);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

function loadRecords() {
  try { return JSON.parse(localStorage.getItem(RECORDS_KEY) || '[]'); } catch { return []; }
}

function renderRecords() {
  const records = loadRecords();
  const el = document.getElementById('records-content');
  if (records.length === 0) {
    el.innerHTML = '<p style="color:var(--muted);text-align:center;font-size:13px;padding:20px 0">まだきろくがないよ。クイズに チャレンジしよう！</p>';
    return;
  }
  const modeLabel = { shape: 'かたちクイズ', location: 'どこかなクイズ', famous: 'めいぶつクイズ' };
  el.innerHTML = records.map(r => `
    <div class="record-item">
      <div class="record-left">
        <div style="font-weight:900;color:var(--text);margin-bottom:2px">${modeLabel[r.mode]||r.mode} ${r.stars}</div>
        <div>${r.date} | ${r.region==='all'?'ぜんぶ':r.region}</div>
      </div>
      <div class="record-right">${r.correct}/${r.total}<br><span style="font-size:12px">${r.score}てん</span></div>
    </div>
  `).join('');
}

// screen-records を開く前に renderRecords
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
  if (id === 'screen-records') renderRecords();
}

// ===== フラッシュカード =====
function openFlashcard() {
  fcList = [...PREFECTURES];
  fcIdx = 0;
  document.getElementById('fc-region-filter').value = 'all';
  fcFlipped = false;
  renderFlashcard();
  showScreen('screen-flashcard');
}

function fcFilterChange() {
  const val = document.getElementById('fc-region-filter').value;
  fcList = val === 'all' ? [...PREFECTURES] : PREFECTURES.filter(p => p.region === val);
  fcIdx = 0;
  fcFlipped = false;
  renderFlashcard();
}

function renderFlashcard() {
  if (fcList.length === 0) return;
  const pref = fcList[fcIdx];
  const card = document.getElementById('fc-card');

  // 表示前にフリップをリセット
  card.classList.remove('flipped');
  fcFlipped = false;

  document.getElementById('fc-name').textContent = pref.name;
  document.getElementById('fc-kana').textContent = pref.kana;
  document.getElementById('fc-current').textContent = fcIdx + 1;
  document.getElementById('fc-total').textContent = fcList.length;

  // 形SVG
  const poly = document.getElementById('fc-polygon');
  const pts = parsePoints(pref.points);
  const scaled = scalePoints(pts, 200, 200, 16);
  poly.setAttribute('points', scaled);
  poly.setAttribute('fill', pref.regionColor);

  // 裏
  const regionEl = document.getElementById('fc-region');
  regionEl.textContent = pref.region;
  regionEl.style.color = pref.regionColor;
  regionEl.style.borderColor = pref.regionColor + '60';
  regionEl.style.background = pref.regionColor + '15';

  document.getElementById('fc-capital-val').textContent = pref.capital + '（' + pref.capitalKana + '）';

  const famousEl = document.getElementById('fc-famous-list');
  famousEl.innerHTML = pref.famous.map(f =>
    `<span class="fc-famous-chip">${f.emoji} ${f.name}</span>`
  ).join('');

  document.getElementById('fc-fact').textContent = pref.fact;
}

function fcFlip() {
  const card = document.getElementById('fc-card');
  fcFlipped = !fcFlipped;
  card.classList.toggle('flipped', fcFlipped);
}

function fcPrev() {
  if (fcList.length === 0) return;
  fcIdx = (fcIdx - 1 + fcList.length) % fcList.length;
  renderFlashcard();
}

function fcNext() {
  if (fcList.length === 0) return;
  fcIdx = (fcIdx + 1) % fcList.length;
  renderFlashcard();
}

// ===== SVGポイント ユーティリティ =====
function parsePoints(pointsStr) {
  return pointsStr.trim().split(/\s+/).map(pair => {
    const [x, y] = pair.split(',').map(Number);
    return { x, y };
  });
}

function scalePoints(pts, targetW, targetH, padding) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  pts.forEach(p => {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  });
  const w = maxX - minX || 1;
  const h = maxY - minY || 1;
  const pad = padding || 10;
  const scaleX = (targetW - pad * 2) / w;
  const scaleY = (targetH - pad * 2) / h;
  const scale = Math.min(scaleX, scaleY);
  const offX = pad + (targetW - pad * 2 - w * scale) / 2;
  const offY = pad + (targetH - pad * 2 - h * scale) / 2;
  return pts.map(p => `${Math.round((p.x - minX) * scale + offX)},${Math.round((p.y - minY) * scale + offY)}`).join(' ');
}

// ===== 汎用ユーティリティ =====
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
