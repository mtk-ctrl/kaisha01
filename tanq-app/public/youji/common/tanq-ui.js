/**
 * tanq-ui.js — TANQ ミニヘッダー自動インジェクション
 * 各幼稚園ミニアプリのHTMLに <script src="../../common/tanq-ui.js"></script> で読み込む
 */
(function () {
  'use strict';

  /* ── スタイル注入 ── */
  const style = document.createElement('style');
  style.textContent = `
    #tanq-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 36px;
      background: rgba(5, 11, 20, 0.96);
      border-bottom: 1px solid rgba(0, 229, 195, 0.20);
      display: flex;
      align-items: center;
      padding: 0 14px;
      z-index: 10000;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      font-family: -apple-system, 'Helvetica Neue', 'Noto Sans JP', sans-serif;
      gap: 10px;
    }
    #tanq-header a.tanq-back {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: #00e5c3;
      text-decoration: none;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.04em;
      opacity: 0.85;
      transition: opacity 0.15s;
      -webkit-tap-highlight-color: transparent;
    }
    #tanq-header a.tanq-back:hover { opacity: 1; }
    #tanq-header .tanq-sep {
      width: 1px;
      height: 16px;
      background: rgba(0, 229, 195, 0.20);
    }
    #tanq-header .tanq-brand {
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.08em;
      background: linear-gradient(90deg, #00e5c3, #c4a8ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    /* ゲーム画面がヘッダーと重ならないよう body に余白 */
    body { padding-top: 36px !important; }
  `;
  document.head.appendChild(style);

  /* ── ヘッダー DOM ── */
  function buildHeader() {
    const header = document.createElement('div');
    header.id = 'tanq-header';

    const back = document.createElement('a');
    back.className = 'tanq-back';
    back.href = '/lab';
    back.innerHTML = '<span>←</span><span>TANQラボ</span>';

    const sep = document.createElement('div');
    sep.className = 'tanq-sep';

    const brand = document.createElement('div');
    brand.className = 'tanq-brand';
    brand.textContent = 'TANQ';

    header.appendChild(back);
    header.appendChild(sep);
    header.appendChild(brand);
    return header;
  }

  if (document.body) {
    document.body.insertBefore(buildHeader(), document.body.firstChild);
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      document.body.insertBefore(buildHeader(), document.body.firstChild);
    });
  }
})();
