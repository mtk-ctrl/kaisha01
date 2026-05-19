/* ============================================================
   common/speech.js - 日本語音声選択ユーティリティ
   高品質な日本語ボイスを優先的に選択する
   ============================================================ */
'use strict';

const SpeechUtil = (() => {
  // 品質が良い順の優先ボイス名リスト（部分一致）
  const PRIORITY = [
    'Google 日本語',          // Android / Chrome (最高品質)
    'Microsoft Nanami Online', // Windows (Natural)
    'Microsoft Haruka Online', // Windows (Natural)
    'Microsoft Ayumi Online',  // Windows (Natural)
    'Microsoft Nanami',        // Windows Desktop
    'Microsoft Haruka',        // Windows Desktop
    'Microsoft Ayumi',         // Windows Desktop
    'O-Ren',                   // macOS
    'Kyoko',                   // macOS (旧)
  ];

  let _voiceCache = null;

  function pickBestVoice() {
    const voices = window.speechSynthesis.getVoices();
    const jaVoices = voices.filter(v => v.lang.startsWith('ja'));
    if (!jaVoices.length) return null;

    for (const name of PRIORITY) {
      const match = jaVoices.find(v => v.name.includes(name));
      if (match) return match;
    }

    // フォールバック: ja-JP の最初のボイス
    return jaVoices.find(v => v.lang === 'ja-JP') || jaVoices[0];
  }

  function getVoice() {
    if (_voiceCache) return _voiceCache;
    _voiceCache = pickBestVoice();
    return _voiceCache;
  }

  // ボイス一覧が非同期で読み込まれる場合に備えてキャッシュを更新
  if ('speechSynthesis' in window) {
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      _voiceCache = pickBestVoice();
    });
    // 初期ロード（同期で取得できる環境向け）
    _voiceCache = pickBestVoice();
  }

  return { getVoice };
})();
