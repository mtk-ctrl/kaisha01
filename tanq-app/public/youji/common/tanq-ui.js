/**
 * tanq-ui.js — TANQ ミニヘッダー自動インジェクション（Round 3 最終版）
 *
 * 対応するレイアウト構造を自動検出:
 *   A) position:fixed .screen 型（kanji / juucombo / clock / animals）
 *      → CSS: .screen { top: H }
 *   B) #app overflow:hidden 型（math / no5 / clock）
 *      → JS: #app を margin-top + height で押し下げ
 *   C) #app スクロール型（zokusei）
 *      → JS: body padding-top で押し下げ
 */
(function () {
  'use strict';

  var H = 36; // TANQヘッダー高さ (px)

  /* ────────────────────────────────
     1. スタイル注入
  ──────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    /* ===== TANQ ヘッダー ===== */
    '#tanq-header{',
    '  position:fixed;top:0;left:0;right:0;height:36px;',
    '  background:rgba(5,11,20,.96);',
    '  border-bottom:1px solid rgba(0,229,195,.20);',
    '  display:flex;align-items:center;padding:0 14px;gap:10px;',
    '  z-index:99999;',
    '  backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);',
    '  font-family:-apple-system,"Helvetica Neue","Noto Sans JP",sans-serif;',
    '  box-sizing:border-box;',
    '}',
    '#tanq-header a.tanq-back{',
    '  display:inline-flex;align-items:center;gap:4px;',
    '  color:#00e5c3;text-decoration:none;',
    '  font-size:11px;font-weight:900;letter-spacing:.04em;',
    '  opacity:.85;transition:opacity .15s;',
    '  -webkit-tap-highlight-color:transparent;',
    '}',
    '#tanq-header a.tanq-back:hover{opacity:1;}',
    '#tanq-header .tanq-sep{width:1px;height:16px;background:rgba(0,229,195,.20);}',
    '#tanq-header .tanq-brand{',
    '  font-size:11px;font-weight:900;letter-spacing:.08em;',
    '  background:linear-gradient(90deg,#00e5c3,#c4a8ff);',
    '  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;',
    '}',

    /* ===== レイアウト調整 ===== */
    /* A型: position:fixed の .screen を押し下げ */
    '.screen{top:36px !important;}',

    /* 重複する「ハブに戻る」系ボタンを非表示 */
    /* back-to-hub.css の #back-to-hub と animals の .menu-hub-btn */
    '#back-to-hub{display:none !important;}',
    '.menu-hub-btn{display:none !important;}',

    /* メニュー説明文の可読性向上（全アプリ共通） */
    '.menu-subtitle,.menu-sub,.sub-title{',
    '  font-size:clamp(1rem,3.5vw,1.3rem) !important;',
    '  font-weight:700 !important;',
    '  line-height:1.5 !important;',
    '  margin-bottom:8px !important;',
    '}',

    /* body padding-top はJSで制御するためここではリセット */
    'body{padding-top:0 !important;}',
  ].join('\n');

  document.head.appendChild(style);

  /* ────────────────────────────────
     2. レイアウト自動検出 & 補正（DOMContentLoaded後）
  ──────────────────────────────── */
  function adjustLayout() {
    var app = document.getElementById('app');
    if (!app) return; // A型はCSSのみで対処済み

    var bodyOvf = window.getComputedStyle(document.body).overflow;
    var bodyOvfY = window.getComputedStyle(document.body).overflowY;
    var isHidden = (bodyOvf === 'hidden' || bodyOvfY === 'hidden');

    if (isHidden) {
      /* B型: overflow:hidden — #app を直接オフセット */
      app.style.setProperty('margin-top',  H + 'px',                 'important');
      app.style.setProperty('height',      'calc(100vh - ' + H + 'px)', 'important');
      app.style.setProperty('min-height',  'calc(100vh - ' + H + 'px)', 'important');
    } else {
      /* C型: スクロール可 — body padding で対処 */
      document.body.style.setProperty('padding-top', H + 'px', 'important');
    }
  }

  /* ────────────────────────────────
     3. ヘッダー DOM 生成
  ──────────────────────────────── */
  function buildHeader() {
    var header = document.createElement('div');
    header.id = 'tanq-header';

    var back = document.createElement('a');
    back.className = 'tanq-back';
    back.href = '/lab';
    back.innerHTML = '<span>&#8592;</span><span>TANQラボ</span>';

    var sep = document.createElement('div');
    sep.className = 'tanq-sep';

    var brand = document.createElement('div');
    brand.className = 'tanq-brand';
    brand.textContent = 'TANQ';

    header.appendChild(back);
    header.appendChild(sep);
    header.appendChild(brand);
    return header;
  }

  function init() {
    if (!document.getElementById('tanq-header')) {
      document.body.insertBefore(buildHeader(), document.body.firstChild);
    }
    adjustLayout();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
