'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { getDataKey } from '@/lib/storage'
import { saveScore } from '@/lib/scoreApi'

// ===== SVG ヘルパー（app.js の svgWrap / em / lbl / bg を再現） =====

function bg(c: string) {
  return `<rect width="100" height="100" fill="${c}"/>`
}
function em(e: string, x: number, y: number, s: number) {
  return `<text x="${x}" y="${y}" font-size="${s}" text-anchor="middle">${e}</text>`
}
function lbl(t: string, c = '#555') {
  return `<text x="50" y="94" font-size="11" text-anchor="middle" fill="${c}" font-family="sans-serif" font-weight="bold">${t}</text>`
}
function svgWrap(bgC: string, body: string) {
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${bg(bgC)}${body}</svg>`
}

// ===== 小学1年生 漢字 80字 データ =====

interface KanjiItem {
  kanji: string
  reading: string
  illust: string
  questionSpeech: string
}

const KANJI_DATA: KanjiItem[] = [
  /* ── 自然 ── */
  {
    kanji: '山', reading: 'やま',
    illust: svgWrap('#E3F2FD',
      '<polygon points="50,8 15,80 85,80" fill="#6D8B74"/>' +
      '<polygon points="50,8 30,50 70,50" fill="#8FA87F"/>' +
      '<polygon points="50,8 42,30 58,30" fill="white"/>' +
      '<rect x="0" y="80" width="100" height="20" fill="#A0C878"/>' +
      '<circle cx="16" cy="28" r="9" fill="white" opacity=".8"/>' +
      '<circle cx="82" cy="22" r="7" fill="white" opacity=".75"/>'),
    questionSpeech: 'やまという漢字はどれかな？',
  },
  {
    kanji: '川', reading: 'かわ',
    illust: svgWrap('#E0F7FA',
      '<path d="M20,5 Q26,30 20,55 Q14,75 20,95" stroke="#42A5F5" stroke-width="13" fill="none" stroke-linecap="round"/>' +
      '<path d="M50,5 Q56,30 50,55 Q44,75 50,95" stroke="#1E88E5" stroke-width="15" fill="none" stroke-linecap="round"/>' +
      '<path d="M80,5 Q86,30 80,55 Q74,75 80,95" stroke="#42A5F5" stroke-width="13" fill="none" stroke-linecap="round"/>' +
      em('🐟', 70, 72, 16)),
    questionSpeech: 'かわという漢字はどれかな？',
  },
  {
    kanji: '木', reading: 'き',
    illust: svgWrap('#F1F8E9',
      '<rect x="46" y="56" width="8" height="38" rx="3" fill="#8B5E3C"/>' +
      '<circle cx="50" cy="36" r="30" fill="#4CAF50"/>' +
      '<circle cx="36" cy="46" r="18" fill="#388E3C"/>' +
      '<circle cx="64" cy="46" r="18" fill="#388E3C"/>' +
      '<circle cx="50" cy="22" r="20" fill="#66BB6A"/>'),
    questionSpeech: 'きという漢字はどれかな？',
  },
  {
    kanji: '林', reading: 'はやし',
    illust: svgWrap('#C8E6C9',
      '<rect x="20" y="58" width="8" height="36" rx="3" fill="#8B5E3C"/>' +
      '<circle cx="24" cy="40" r="22" fill="#388E3C"/>' +
      '<rect x="72" y="58" width="8" height="36" rx="3" fill="#8B5E3C"/>' +
      '<circle cx="76" cy="40" r="22" fill="#4CAF50"/>' +
      em('🐿', 50, 80, 16)),
    questionSpeech: 'はやしという漢字はどれかな？',
  },
  {
    kanji: '森', reading: 'もり',
    illust: svgWrap('#A5D6A7',
      '<rect x="46" y="60" width="7" height="34" rx="3" fill="#6D4C41"/>' +
      '<circle cx="50" cy="42" r="24" fill="#1B5E20"/>' +
      '<rect x="17" y="65" width="6" height="28" rx="3" fill="#6D4C41"/>' +
      '<circle cx="20" cy="50" r="18" fill="#2E7D32"/>' +
      '<rect x="77" y="65" width="6" height="28" rx="3" fill="#6D4C41"/>' +
      '<circle cx="80" cy="50" r="18" fill="#2E7D32"/>' +
      em('🦌', 50, 88, 14)),
    questionSpeech: 'もりという漢字はどれかな？',
  },
  {
    kanji: '花', reading: 'はな',
    illust: svgWrap('#FCE4EC',
      '<rect x="47" y="58" width="6" height="36" rx="3" fill="#558B2F"/>' +
      '<path d="M47,72 Q32,66 30,53 Q42,60 47,70" fill="#66BB6A"/>' +
      [0, 45, 90, 135, 180, 225, 270, 315].map(a =>
        `<ellipse cx="50" cy="32" rx="10" ry="18" fill="${a % 90 === 0 ? '#FF80AB' : '#FF4081'}" transform="rotate(${a},50,50)"/>`
      ).join('') +
      '<circle cx="50" cy="50" r="11" fill="#FFC107"/>' +
      '<circle cx="50" cy="50" r="6" fill="#FF8F00"/>'),
    questionSpeech: 'はなという漢字はどれかな？',
  },
  {
    kanji: '草', reading: 'くさ',
    illust: svgWrap('#E8F5E9',
      '<rect x="0" y="70" width="100" height="30" fill="#8BC34A"/>' +
      [[18, 68], [32, 52], [50, 58], [68, 52], [82, 66], [26, 42], [54, 40], [72, 44]].map(([x, y]) =>
        `<path d="M${x},${y + 20} Q${x - 5},${y + 5} ${x},${y}" stroke="#4CAF50" stroke-width="4" fill="none" stroke-linecap="round"/>` +
        `<path d="M${x},${y + 20} Q${x + 6},${y + 8} ${x + 9},${y + 2}" stroke="#66BB6A" stroke-width="3" fill="none" stroke-linecap="round"/>`
      ).join('') +
      em('🐛', 50, 88, 14)),
    questionSpeech: 'くさという漢字はどれかな？',
  },
  {
    kanji: '竹', reading: 'たけ',
    illust: svgWrap('#E8F5E9',
      [20, 50, 80].map(x =>
        `<rect x="${x - 5}" y="10" width="10" height="80" rx="5" fill="#8BC34A"/>` +
        [28, 48, 68].map(y => `<rect x="${x - 5}" y="${y}" width="10" height="4" fill="#7CB342"/>`).join('') +
        `<path d="M${x + 5},${x < 50 ? 28 : 38} Q${x + (x < 50 ? 20 : -20)},${x < 50 ? 18 : 25} ${x + (x < 50 ? 26 : -28)},${x < 50 ? 10 : 15}" stroke="#A5D6A7" stroke-width="3" fill="none"/>`
      ).join('') +
      em('🐼', 50, 82, 18)),
    questionSpeech: 'たけという漢字はどれかな？',
  },
  {
    kanji: '米', reading: 'こめ',
    illust: svgWrap('#FFF8E1',
      em('🌾', 28, 52, 36) + em('🌾', 72, 52, 36) + em('🍚', 50, 80, 28)),
    questionSpeech: 'こめという漢字はどれかな？',
  },
  {
    kanji: '糸', reading: 'いと',
    illust: svgWrap('#FCE4EC',
      em('🧵', 50, 48, 56) + em('🪡', 22, 72, 22) + em('✨', 76, 20, 20)),
    questionSpeech: 'いとという漢字はどれかな？',
  },

  /* ── 天体・天気 ── */
  {
    kanji: '日', reading: 'ひ',
    illust: svgWrap('#E3F2FD',
      '<circle cx="50" cy="50" r="26" fill="#FFEB3B"/>' +
      '<circle cx="50" cy="50" r="17" fill="#FFC107"/>' +
      [0, 45, 90, 135, 180, 225, 270, 315].map(a =>
        `<line x1="${50 + 30 * Math.cos(a * Math.PI / 180)}" y1="${50 + 30 * Math.sin(a * Math.PI / 180)}" x2="${50 + 38 * Math.cos(a * Math.PI / 180)}" y2="${50 + 38 * Math.sin(a * Math.PI / 180)}" stroke="#FFD740" stroke-width="4" stroke-linecap="round"/>`
      ).join('') +
      '<circle cx="43" cy="47" r="2.5" fill="#E65100"/>' +
      '<circle cx="57" cy="47" r="2.5" fill="#E65100"/>' +
      '<path d="M43,56 Q50,62 57,56" stroke="#E65100" stroke-width="2" fill="none"/>'),
    questionSpeech: 'ひという漢字はどれかな？',
  },
  {
    kanji: '月', reading: 'つき',
    illust: svgWrap('#1A1A2E',
      '<circle cx="55" cy="50" r="28" fill="#CFD8DC"/>' +
      '<circle cx="37" cy="48" r="28" fill="#1A1A2E"/>' +
      '<circle cx="62" cy="38" r="5" fill="#90A4AE" opacity=".5"/>' +
      em('⭐', 20, 22, 14) + em('✨', 85, 35, 12) + em('⭐', 12, 72, 10)),
    questionSpeech: 'つきという漢字はどれかな？',
  },
  {
    kanji: '火', reading: 'ひ',
    illust: svgWrap('#1C1C1C',
      '<path d="M50,15 Q70,35 65,55 Q80,40 72,65 Q65,80 50,85 Q35,80 28,65 Q20,40 35,55 Q30,35 50,15Z" fill="#FF6F00"/>' +
      '<path d="M50,28 Q64,44 60,58 Q70,46 63,67 Q57,78 50,80 Q43,78 37,67 Q30,46 40,58 Q36,44 50,28Z" fill="#FFA726"/>' +
      '<path d="M50,42 Q58,53 55,63 Q60,57 57,68 Q53,75 50,76 Q47,75 43,68 Q40,57 45,63 Q42,53 50,42Z" fill="#FFEE58"/>' +
      '<circle cx="50" cy="65" r="7" fill="#FFF9C4" opacity=".8"/>'),
    questionSpeech: 'ひという漢字はどれかな？',
  },
  {
    kanji: '水', reading: 'みず',
    illust: svgWrap('#E0F7FA',
      '<path d="M50,12 Q70,38 70,56 Q70,76 50,82 Q30,76 30,56 Q30,38 50,12Z" fill="#29B6F6"/>' +
      '<ellipse cx="42" cy="46" rx="5" ry="8" fill="white" opacity=".35" transform="rotate(-20,42,46)"/>' +
      '<path d="M22,48 Q30,60 22,66 Q14,60 22,48Z" fill="#4FC3F7"/>' +
      '<path d="M78,43 Q86,55 78,61 Q70,55 78,43Z" fill="#4FC3F7"/>' +
      em('💧', 50, 92, 14)),
    questionSpeech: 'みずという漢字はどれかな？',
  },
  {
    kanji: '土', reading: 'つち',
    illust: svgWrap('#FFF8E1',
      '<rect x="0" y="64" width="100" height="36" fill="#8D6E63"/>' +
      '<rect x="0" y="64" width="100" height="6" fill="#A1887F"/>' +
      '<rect x="47" y="28" width="6" height="38" fill="#558B2F"/>' +
      '<ellipse cx="50" cy="26" rx="16" ry="16" fill="#FFEE58"/>' +
      '<circle cx="50" cy="26" r="9" fill="#FF8F00"/>' +
      em('🌱', 22, 62, 18)),
    questionSpeech: 'つちという漢字はどれかな？',
  },
  {
    kanji: '空', reading: 'そら',
    illust: svgWrap('#87CEEB',
      '<circle cx="20" cy="42" r="14" fill="white"/><circle cx="36" cy="32" r="18" fill="white"/>' +
      '<circle cx="55" cy="30" r="20" fill="white"/><circle cx="73" cy="36" r="16" fill="white"/>' +
      '<circle cx="83" cy="45" r="12" fill="white"/>' +
      em('🐦', 50, 74, 22) +
      '<circle cx="70" cy="16" r="10" fill="#FFEB3B"/>' +
      [0, 60, 120, 180, 240, 300].map(a =>
        `<line x1="${70 + 14 * Math.cos(a * Math.PI / 180)}" y1="${16 + 14 * Math.sin(a * Math.PI / 180)}" x2="${70 + 18 * Math.cos(a * Math.PI / 180)}" y2="${16 + 18 * Math.sin(a * Math.PI / 180)}" stroke="#FFC107" stroke-width="2.5" stroke-linecap="round"/>`
      ).join('')),
    questionSpeech: 'そらという漢字はどれかな？',
  },
  {
    kanji: '雨', reading: 'あめ',
    illust: svgWrap('#B0BEC5',
      '<rect x="10" y="14" width="80" height="32" rx="16" fill="#78909C"/>' +
      [[25, 56], [40, 66], [55, 56], [70, 66], [32, 76], [62, 76], [47, 83]].map(([x, y]) =>
        `<ellipse cx="${x}" cy="${y}" rx="3" ry="6" fill="#42A5F5"/>`
      ).join('')),
    questionSpeech: 'あめという漢字はどれかな？',
  },

  /* ── 人・体 ── */
  {
    kanji: '人', reading: 'ひと',
    illust: svgWrap('#FFF3E0',
      '<circle cx="50" cy="22" r="14" fill="#FFCC80"/>' +
      '<path d="M28,78 Q35,45 50,40 Q65,45 72,78" fill="#42A5F5"/>' +
      '<path d="M50,50 Q28,63 22,74" stroke="#FFCC80" stroke-width="9" fill="none" stroke-linecap="round"/>' +
      '<path d="M50,50 Q72,63 78,74" stroke="#FFCC80" stroke-width="9" fill="none" stroke-linecap="round"/>' +
      '<rect x="36" y="76" width="11" height="18" rx="5" fill="#1565C0"/>' +
      '<rect x="53" y="76" width="11" height="18" rx="5" fill="#1565C0"/>'),
    questionSpeech: 'ひとという漢字はどれかな？',
  },
  {
    kanji: '女', reading: 'おんな',
    illust: svgWrap('#FCE4EC', em('👩', 50, 46, 52) + em('🌸', 78, 22, 20)),
    questionSpeech: 'おんなという漢字はどれかな？',
  },
  {
    kanji: '男', reading: 'おとこ',
    illust: svgWrap('#E3F2FD', em('👦', 50, 46, 52) + em('⚽', 78, 72, 22)),
    questionSpeech: 'おとこという漢字はどれかな？',
  },
  {
    kanji: '子', reading: 'こ',
    illust: svgWrap('#FCE4EC', em('👶', 50, 46, 52) + em('🎈', 30, 20, 20) + em('🎈', 72, 22, 18)),
    questionSpeech: 'こという漢字はどれかな？',
  },
  {
    kanji: '口', reading: 'くち',
    illust: svgWrap('#FCE4EC',
      '<circle cx="50" cy="48" r="38" fill="#FFCC80"/>' +
      '<circle cx="36" cy="40" r="7" fill="white"/><circle cx="64" cy="40" r="7" fill="white"/>' +
      '<circle cx="37" cy="41" r="4" fill="#333"/><circle cx="65" cy="41" r="4" fill="#333"/>' +
      '<rect x="26" y="56" width="48" height="28" rx="14" fill="#E53935"/>' +
      '<rect x="28" y="56" width="44" height="13" rx="8" fill="#FF8A80"/>' +
      '<rect x="30" y="56" width="10" height="11" rx="2" fill="white"/>' +
      '<rect x="44" y="56" width="12" height="11" rx="2" fill="white"/>' +
      '<rect x="60" y="56" width="10" height="11" rx="2" fill="white"/>' +
      '<ellipse cx="50" cy="76" rx="13" ry="7" fill="#FF7043"/>'),
    questionSpeech: 'くちという漢字はどれかな？',
  },
  {
    kanji: '目', reading: 'め',
    illust: svgWrap('#E8EAF6',
      '<ellipse cx="50" cy="50" rx="40" ry="26" fill="white" stroke="#3E2723" stroke-width="3"/>' +
      '<circle cx="50" cy="50" r="18" fill="#42A5F5"/>' +
      '<circle cx="50" cy="50" r="12" fill="#1565C0"/>' +
      '<circle cx="50" cy="50" r="7"  fill="#0D1B2A"/>' +
      '<circle cx="47" cy="46" r="3"  fill="white"/>' +
      '<circle cx="54" cy="52" r="2"  fill="white" opacity=".7"/>'),
    questionSpeech: 'めという漢字はどれかな？',
  },
  {
    kanji: '耳', reading: 'みみ',
    illust: svgWrap('#FFF8E1',
      em('🎵', 18, 28, 18) + em('🎶', 72, 20, 16) +
      '<ellipse cx="42" cy="50" rx="30" ry="38" fill="#FFCC80"/>' +
      '<path d="M65,28 Q82,34 84,50 Q82,66 65,72 Q74,66 72,50 Q74,34 65,28Z" fill="#FFB74D"/>' +
      '<path d="M68,36 Q78,42 78,50 Q78,58 68,64 Q73,58 72,50 Q73,42 68,36Z" fill="#FF8A65"/>'),
    questionSpeech: 'みみという漢字はどれかな？',
  },
  {
    kanji: '手', reading: 'て',
    illust: svgWrap('#E8F5E9',
      '<ellipse cx="50" cy="68" rx="26" ry="22" fill="#FFCC80"/>' +
      '<rect x="28" y="28" width="11" height="32" rx="5.5" fill="#FFCC80"/>' +
      '<rect x="41" y="22" width="11" height="34" rx="5.5" fill="#FFCC80"/>' +
      '<rect x="54" y="24" width="11" height="32" rx="5.5" fill="#FFCC80"/>' +
      '<rect x="67" y="30" width="11" height="28" rx="5.5" fill="#FFCC80"/>' +
      '<ellipse cx="22" cy="60" rx="8" ry="12" fill="#FFCC80" transform="rotate(-30,22,60)"/>' +
      em('✨', 80, 20, 18)),
    questionSpeech: 'てという漢字はどれかな？',
  },
  {
    kanji: '足', reading: 'あし',
    illust: svgWrap('#FFF3E0',
      '<rect x="36" y="10" width="18" height="55" rx="9" fill="#FFCC80"/>' +
      '<ellipse cx="55" cy="72" rx="28" ry="16" fill="#FFCC80"/>' +
      [[32, 68, 7], [42, 64, 7], [53, 62, 7], [64, 63, 6], [74, 66, 5]].map(([x, y, r]) =>
        `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFB74D"/>`
      ).join('')),
    questionSpeech: 'あしという漢字はどれかな？',
  },
  {
    kanji: '力', reading: 'ちから',
    illust: svgWrap('#FFF3E0', em('💪', 50, 52, 62) + lbl('ちから！', '#E65100')),
    questionSpeech: 'ちからという漢字はどれかな？',
  },

  /* ── 方向・場所 ── */
  {
    kanji: '上', reading: 'うえ',
    illust: svgWrap('#E3F2FD',
      '<rect x="10" y="72" width="80" height="7" rx="3" fill="#8D6E63"/>' +
      '<polygon points="50,8 34,32 66,32" fill="#2196F3"/>' +
      '<rect x="43" y="31" width="14" height="26" fill="#2196F3"/>' +
      em('🐦', 50, 56, 18)),
    questionSpeech: 'うえという漢字はどれかな？',
  },
  {
    kanji: '下', reading: 'した',
    illust: svgWrap('#FFF8E1',
      '<rect x="10" y="20" width="80" height="7" rx="3" fill="#8D6E63"/>' +
      '<rect x="43" y="27" width="14" height="26" fill="#FF7043"/>' +
      '<polygon points="50,82 34,58 66,58" fill="#FF7043"/>' +
      em('🍎', 30, 22, 18) + em('🍊', 65, 22, 16)),
    questionSpeech: 'したという漢字はどれかな？',
  },
  {
    kanji: '中', reading: 'なか',
    illust: svgWrap('#F3E5F5',
      '<rect x="18" y="18" width="64" height="64" rx="8" fill="none" stroke="#AB47BC" stroke-width="6"/>' +
      '<line x1="50" y1="8" x2="50" y2="92" stroke="#AB47BC" stroke-width="6"/>' +
      em('⭐', 50, 52, 28)),
    questionSpeech: 'なかという漢字はどれかな？',
  },
  {
    kanji: '右', reading: 'みぎ',
    illust: svgWrap('#FFF3E0', em('👉', 50, 50, 52) + lbl('みぎ', '#E65100')),
    questionSpeech: 'みぎという漢字はどれかな？',
  },
  {
    kanji: '左', reading: 'ひだり',
    illust: svgWrap('#E8F5E9', em('👈', 50, 50, 52) + lbl('ひだり', '#2E7D32')),
    questionSpeech: 'ひだりという漢字はどれかな？',
  },

  /* ── 数字 ── */
  {
    kanji: '一', reading: 'いち',
    illust: svgWrap('#FFF8E1',
      '<line x1="18" y1="50" x2="82" y2="50" stroke="#FF7043" stroke-width="10" stroke-linecap="round"/>' +
      em('🍎', 50, 24, 22) + lbl('１つ', '#E65100')),
    questionSpeech: 'いちという漢字はどれかな？',
  },
  {
    kanji: '二', reading: 'に',
    illust: svgWrap('#FFF3E0',
      '<line x1="18" y1="38" x2="82" y2="38" stroke="#FF7043" stroke-width="8" stroke-linecap="round"/>' +
      '<line x1="18" y1="60" x2="82" y2="60" stroke="#FF7043" stroke-width="8" stroke-linecap="round"/>' +
      em('🍎', 32, 22, 18) + em('🍊', 62, 22, 18) + lbl('２つ', '#E65100')),
    questionSpeech: 'にという漢字はどれかな？',
  },
  {
    kanji: '三', reading: 'さん',
    illust: svgWrap('#FFF8E1',
      '<line x1="18" y1="30" x2="82" y2="30" stroke="#FF7043" stroke-width="7" stroke-linecap="round"/>' +
      '<line x1="18" y1="50" x2="82" y2="50" stroke="#FF7043" stroke-width="7" stroke-linecap="round"/>' +
      '<line x1="18" y1="70" x2="82" y2="70" stroke="#FF7043" stroke-width="7" stroke-linecap="round"/>' +
      em('🎈', 22, 18, 14) + em('🎈', 50, 18, 14) + em('🎈', 78, 18, 14)),
    questionSpeech: 'さんという漢字はどれかな？',
  },
  {
    kanji: '四', reading: 'よん',
    illust: svgWrap('#FCE4EC',
      em('🐾', 28, 38, 26) + em('🐾', 65, 38, 26) + em('🐾', 28, 72, 26) + em('🐾', 65, 72, 26) + lbl('４つ', '#C2185B')),
    questionSpeech: 'よんという漢字はどれかな？',
  },
  {
    kanji: '五', reading: 'ご',
    illust: svgWrap('#E8F5E9',
      em('⭐', 22, 36, 22) + em('⭐', 50, 28, 22) + em('⭐', 78, 36, 22) + em('⭐', 32, 66, 22) + em('⭐', 68, 66, 22) + lbl('５つ', '#2E7D32')),
    questionSpeech: 'ごという漢字はどれかな？',
  },
  {
    kanji: '六', reading: 'ろく',
    illust: svgWrap('#E3F2FD',
      em('🍭', 18, 32, 20) + em('🍭', 50, 26, 20) + em('🍭', 82, 32, 20) +
      em('🍭', 18, 68, 20) + em('🍭', 50, 74, 20) + em('🍭', 82, 68, 20) + lbl('６つ', '#1565C0')),
    questionSpeech: 'ろくという漢字はどれかな？',
  },
  {
    kanji: '七', reading: 'なな',
    illust: svgWrap('#FFF8E1',
      em('🌟', 15, 30, 18) + em('🌟', 40, 22, 18) + em('🌟', 65, 28, 18) + em('🌟', 85, 20, 18) +
      em('🌟', 25, 58, 18) + em('🌟', 52, 64, 18) + em('🌟', 76, 55, 18) + lbl('７つ', '#F57F17')),
    questionSpeech: 'ななという漢字はどれかな？',
  },
  {
    kanji: '八', reading: 'はち',
    illust: svgWrap('#FCE4EC',
      em('🎀', 18, 34, 18) + em('🎀', 43, 28, 18) + em('🎀', 68, 34, 18) +
      em('🎀', 10, 62, 18) + em('🎀', 33, 68, 18) + em('🎀', 55, 62, 18) +
      em('🎀', 75, 56, 18) + em('🎀', 90, 68, 18) + lbl('８つ', '#C2185B')),
    questionSpeech: 'はちという漢字はどれかな？',
  },
  {
    kanji: '九', reading: 'きゅう',
    illust: svgWrap('#E8F5E9',
      [['🍓', 15, 30], ['🍓', 38, 24], ['🍓', 62, 28], ['🍓', 83, 22],
       ['🍓', 10, 58], ['🍓', 32, 65], ['🍓', 55, 62], ['🍓', 75, 58], ['🍓', 90, 68]
      ].map(([e, x, y]) => em(e as string, x as number, y as number, 18)).join('') +
      lbl('９つ', '#2E7D32')),
    questionSpeech: 'きゅうという漢字はどれかな？',
  },
  {
    kanji: '十', reading: 'じゅう',
    illust: svgWrap('#FFF3E0',
      '<line x1="50" y1="12" x2="50" y2="88" stroke="#FF7043" stroke-width="10" stroke-linecap="round"/>' +
      '<line x1="12" y1="50" x2="88" y2="50" stroke="#FF7043" stroke-width="10" stroke-linecap="round"/>' +
      lbl('10！', '#E65100')),
    questionSpeech: 'じゅうという漢字はどれかな？',
  },
  {
    kanji: '百', reading: 'ひゃく',
    illust: svgWrap('#E8EAF6', em('💯', 50, 52, 60) + lbl('100！', '#3949AB')),
    questionSpeech: 'ひゃくという漢字はどれかな？',
  },
  {
    kanji: '千', reading: 'せん',
    illust: svgWrap('#F3E5F5',
      em('🌸', 50, 40, 50) + em('✨', 20, 22, 20) + em('✨', 80, 18, 18) + lbl('1000！', '#7B1FA2')),
    questionSpeech: 'せんという漢字はどれかな？',
  },

  /* ── 大小 ── */
  {
    kanji: '大', reading: 'おおきい',
    illust: svgWrap('#FFF8E1', em('🐘', 50, 52, 60) + lbl('おおきい！', '#E65100')),
    questionSpeech: 'おおきいという漢字はどれかな？',
  },
  {
    kanji: '小', reading: 'ちいさい',
    illust: svgWrap('#E8F5E9',
      em('🐭', 50, 50, 44) + em('🐜', 22, 75, 24) + em('🌱', 76, 72, 22) + lbl('ちいさい', '#2E7D32')),
    questionSpeech: 'ちいさいという漢字はどれかな？',
  },

  /* ── 色 ── */
  {
    kanji: '白', reading: 'しろ',
    illust: svgWrap('#FAFAFA',
      '<circle cx="50" cy="45" r="32" fill="white" stroke="#E0E0E0" stroke-width="3"/>' +
      em('🐑', 50, 46, 40) + lbl('しろ', '#757575')),
    questionSpeech: 'しろという漢字はどれかな？',
  },
  {
    kanji: '赤', reading: 'あか',
    illust: svgWrap('#FFEBEE', em('🍎', 35, 45, 36) + em('🌹', 65, 48, 34) + em('❤️', 50, 82, 22)),
    questionSpeech: 'あかという漢字はどれかな？',
  },
  {
    kanji: '青', reading: 'あお',
    illust: svgWrap('#E3F2FD', em('🫐', 35, 45, 34) + em('🌊', 65, 52, 32) + em('💙', 50, 80, 22)),
    questionSpeech: 'あおという漢字はどれかな？',
  },

  /* ── 自然物・物 ── */
  {
    kanji: '石', reading: 'いし',
    illust: svgWrap('#ECEFF1',
      '<ellipse cx="38" cy="62" rx="28" ry="20" fill="#9E9E9E"/>' +
      '<ellipse cx="38" cy="56" rx="26" ry="18" fill="#BDBDBD"/>' +
      '<ellipse cx="33" cy="52" rx="10" ry="6" fill="#E0E0E0" opacity=".7"/>' +
      '<circle cx="68" cy="60" r="14" fill="#9E9E9E"/>' +
      '<circle cx="65" cy="55" r="8" fill="#BDBDBD"/>' +
      em('💎', 76, 26, 20)),
    questionSpeech: 'いしという漢字はどれかな？',
  },
  {
    kanji: '金', reading: 'きん',
    illust: svgWrap('#FFF8E1', em('🪙', 35, 45, 36) + em('💰', 68, 52, 34) + em('✨', 22, 22, 18)),
    questionSpeech: 'きんという漢字はどれかな？',
  },

  /* ── 動物 ── */
  {
    kanji: '犬', reading: 'いぬ',
    illust: svgWrap('#FFF8E1', em('🐶', 50, 54, 58) + lbl('わんわん！', '#8B4513')),
    questionSpeech: 'いぬという漢字はどれかな？',
  },
  {
    kanji: '貝', reading: 'かい',
    illust: svgWrap('#E0F7FA', em('🐚', 30, 52, 40) + em('🦀', 68, 60, 32) + em('🐠', 55, 25, 24)),
    questionSpeech: 'かいという漢字はどれかな？',
  },
  {
    kanji: '虫', reading: 'むし',
    illust: svgWrap('#F9FBE7',
      em('🐛', 30, 55, 36) + em('🐝', 68, 38, 28) + em('🦋', 55, 72, 24) + em('🐞', 22, 78, 20)),
    questionSpeech: 'むしという漢字はどれかな？',
  },

  /* ── 場所・建物 ── */
  {
    kanji: '田', reading: 'た',
    illust: svgWrap('#E8F5E9',
      '<rect x="12" y="12" width="76" height="76" rx="4" fill="#A5D6A7"/>' +
      '<line x1="12" y1="50" x2="88" y2="50" stroke="#558B2F" stroke-width="4"/>' +
      '<line x1="50" y1="12" x2="50" y2="88" stroke="#558B2F" stroke-width="4"/>' +
      '<rect x="12" y="12" width="76" height="76" rx="4" fill="none" stroke="#558B2F" stroke-width="4"/>' +
      em('🌾', 28, 35, 16) + em('🌾', 62, 35, 16) + em('🌾', 28, 66, 16) + em('🌾', 62, 66, 16)),
    questionSpeech: 'たという漢字はどれかな？',
  },
  {
    kanji: '町', reading: 'まち',
    illust: svgWrap('#FFF3E0', em('🏘️', 50, 46, 52) + lbl('まち', '#E65100')),
    questionSpeech: 'まちという漢字はどれかな？',
  },
  {
    kanji: '村', reading: 'むら',
    illust: svgWrap('#E8F5E9', em('🏡', 50, 46, 50) + em('🌲', 20, 58, 24) + em('🌲', 80, 55, 22)),
    questionSpeech: 'むらという漢字はどれかな？',
  },

  /* ── 学校・学習 ── */
  {
    kanji: '学', reading: 'まなぶ',
    illust: svgWrap('#E3F2FD', em('📚', 35, 45, 38) + em('✏️', 68, 52, 32) + em('🎓', 50, 18, 28)),
    questionSpeech: 'まなぶという漢字はどれかな？',
  },
  {
    kanji: '校', reading: 'こう',
    illust: svgWrap('#FFF3E0', em('🏫', 50, 48, 55) + lbl('がっこう', '#E65100')),
    questionSpeech: 'こうという漢字はどれかな？',
  },
  {
    kanji: '先', reading: 'さき',
    illust: svgWrap('#E8F5E9', em('🏃', 50, 50, 50) + em('➡️', 78, 50, 22) + lbl('さきにいく', '#2E7D32')),
    questionSpeech: 'さきという漢字はどれかな？',
  },
  {
    kanji: '生', reading: 'うまれる',
    illust: svgWrap('#F1F8E9', em('🐣', 50, 46, 52) + em('🌱', 22, 72, 22) + em('🌸', 78, 68, 22)),
    questionSpeech: 'うまれるという漢字はどれかな？',
  },
  {
    kanji: '本', reading: 'ほん',
    illust: svgWrap('#FFF3E0', em('📚', 50, 44, 52) + em('📖', 72, 72, 24)),
    questionSpeech: 'ほんという漢字はどれかな？',
  },
  {
    kanji: '文', reading: 'ぶん',
    illust: svgWrap('#E8EAF6', em('📜', 50, 44, 52) + em('✍️', 72, 68, 24)),
    questionSpeech: 'ぶんという漢字はどれかな？',
  },
  {
    kanji: '字', reading: 'じ',
    illust: svgWrap('#E3F2FD', em('🔤', 50, 44, 52) + em('✏️', 72, 22, 24)),
    questionSpeech: 'じという漢字はどれかな？',
  },
  {
    kanji: '名', reading: 'な',
    illust: svgWrap('#FCE4EC', em('📛', 50, 44, 52) + em('✨', 22, 22, 20)),
    questionSpeech: 'なという漢字はどれかな？',
  },
  {
    kanji: '書', reading: 'かく',
    illust: svgWrap('#FFF3E0', em('📝', 50, 46, 54) + em('✏️', 72, 22, 24)),
    questionSpeech: 'かくという漢字はどれかな？',
  },
  {
    kanji: '読', reading: 'よむ',
    illust: svgWrap('#E8F5E9', em('📖', 50, 46, 54) + em('🔖', 72, 30, 22)),
    questionSpeech: 'よむという漢字はどれかな？',
  },
  {
    kanji: '音', reading: 'おと',
    illust: svgWrap('#FFF8E1', em('🎵', 35, 44, 36) + em('🎶', 68, 50, 32) + em('🎸', 50, 78, 24)),
    questionSpeech: 'おとという漢字はどれかな？',
  },
  {
    kanji: '気', reading: 'き',
    illust: svgWrap('#E8F5E9', em('☁️', 35, 32, 36) + em('⚡', 65, 40, 30) + em('😊', 50, 72, 28)),
    questionSpeech: 'きという漢字はどれかな？',
  },

  /* ── 動作 ── */
  {
    kanji: '立', reading: 'たつ',
    illust: svgWrap('#FFF3E0', em('🧍', 50, 46, 56) + lbl('たっている', '#E65100')),
    questionSpeech: 'たつという漢字はどれかな？',
  },
  {
    kanji: '見', reading: 'みる',
    illust: svgWrap('#E8F5E9', em('👀', 50, 40, 44) + em('🔍', 65, 68, 28)),
    questionSpeech: 'みるという漢字はどれかな？',
  },
  {
    kanji: '聞', reading: 'きく',
    illust: svgWrap('#FFF8E1', em('👂', 40, 46, 44) + em('🎵', 70, 36, 26) + em('🎶', 72, 60, 20)),
    questionSpeech: 'きくという漢字はどれかな？',
  },
  {
    kanji: '話', reading: 'はなす',
    illust: svgWrap('#FCE4EC', em('🗣️', 38, 46, 42) + em('💬', 65, 32, 30)),
    questionSpeech: 'はなすという漢字はどれかな？',
  },
  {
    kanji: '食', reading: 'たべる',
    illust: svgWrap('#FFF3E0', em('🍜', 50, 44, 52) + em('😋', 50, 82, 22)),
    questionSpeech: 'たべるという漢字はどれかな？',
  },
  {
    kanji: '出', reading: 'でる',
    illust: svgWrap('#FFF8E1',
      em('🚪', 50, 55, 46) +
      '<polygon points="50,8 36,32 64,32" fill="#FF7043"/>' +
      '<rect x="43" y="30" width="14" height="18" fill="#FF7043"/>' +
      em('🏃', 70, 60, 26)),
    questionSpeech: 'でるという漢字はどれかな？',
  },
  {
    kanji: '入', reading: 'いる',
    illust: svgWrap('#E3F2FD',
      em('🏠', 50, 40, 50) +
      '<polygon points="50,74 36,55 64,55" fill="#2196F3"/>' +
      '<rect x="43" y="72" width="14" height="20" fill="#2196F3"/>'),
    questionSpeech: 'いるという漢字はどれかな？',
  },
  {
    kanji: '休', reading: 'やすむ',
    illust: svgWrap('#E8F5E9', em('😴', 50, 44, 48) + em('💤', 72, 28, 24) + em('🌳', 22, 60, 28)),
    questionSpeech: 'やすむという漢字はどれかな？',
  },

  /* ── 時間・年 ── */
  {
    kanji: '年', reading: 'とし',
    illust: svgWrap('#FFF8E1', em('📅', 50, 45, 50) + em('🎂', 50, 78, 22) + lbl('１ねん', '#F57F17')),
    questionSpeech: 'としという漢字はどれかな？',
  },
  {
    kanji: '早', reading: 'はやい',
    illust: svgWrap('#FFF8E1', em('🐆', 50, 46, 50) + em('💨', 72, 30, 24) + lbl('はやい！', '#E65100')),
    questionSpeech: 'はやいという漢字はどれかな？',
  },
  {
    kanji: '夕', reading: 'ゆう',
    illust: svgWrap('#FFCC80',
      '<circle cx="85" cy="60" r="20" fill="#FFCC02"/>' +
      '<circle cx="62" cy="40" r="22" fill="#FF7043"/>' +
      '<rect x="0" y="78" width="100" height="22" fill="#4E342E"/>' +
      em('🐦', 30, 35, 18)),
    questionSpeech: 'ゆうという漢字はどれかな？',
  },
  {
    kanji: '天', reading: 'てん',
    illust: svgWrap('#87CEEB', em('🌤️', 50, 42, 56) + em('✨', 20, 18, 20) + em('✨', 80, 14, 16)),
    questionSpeech: 'てんという漢字はどれかな？',
  },

  /* ── 王・玉 ── */
  {
    kanji: '王', reading: 'おう',
    illust: svgWrap('#FFF8E1', em('👑', 50, 38, 48) + em('💎', 50, 78, 24) + lbl('おうさま', '#F57F17')),
    questionSpeech: 'おうという漢字はどれかな？',
  },
  {
    kanji: '玉', reading: 'たま',
    illust: svgWrap('#E8EAF6', em('💎', 35, 45, 36) + em('🔮', 68, 52, 32) + em('✨', 22, 22, 18)),
    questionSpeech: 'たまという漢字はどれかな？',
  },
  {
    kanji: '円', reading: 'えん',
    illust: svgWrap('#FFF8E1', em('💴', 50, 48, 56) + lbl('おかね', '#F57F17')),
    questionSpeech: 'えんという漢字はどれかな？',
  },

  /* ── 正・車 ── */
  {
    kanji: '正', reading: 'ただしい',
    illust: svgWrap('#E8F5E9', em('✅', 50, 44, 56) + lbl('ただしい', '#2E7D32')),
    questionSpeech: 'ただしいという漢字はどれかな？',
  },
  {
    kanji: '車', reading: 'くるま',
    illust: svgWrap('#E3F2FD', em('🚗', 50, 46, 56) + lbl('ぶっぶー', '#1565C0')),
    questionSpeech: 'くるまという漢字はどれかな？',
  },
]

// ===== 型 =====

type Phase = 'menu' | 'game' | 'result'

interface Question {
  item: KanjiItem
  choices: string[]
}

interface LogEntry {
  item: KanjiItem
  chosenKanji: string
  ok: boolean
}

interface KanjiRecord {
  count: number
  correct: number
  score: number
  stars: number
  date: string
}

const RECORD_KEY = 'tanq_youji_kanji_best_v1'

function saveRecord(data: Omit<KanjiRecord, 'date'>) {
  try {
    const key = getDataKey(RECORD_KEY)
    const records: KanjiRecord[] = JSON.parse(localStorage.getItem(key) || '[]')
    records.unshift({ ...data, date: new Date().toLocaleDateString('ja-JP') })
    localStorage.setItem(key, JSON.stringify(records.slice(0, 30)))
  } catch {}
}

// ===== ユーティリティ =====

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function speak(text: string) {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'ja-JP'
    u.rate = 0.85
    u.pitch = 1.2
    window.speechSynthesis.speak(u)
  } catch {}
}

function buildQuestions(count: number): Question[] {
  const pool = shuffle([...KANJI_DATA]).slice(0, count)
  return pool.map((item) => {
    const correct = item.kanji
    const distractors = shuffle(KANJI_DATA.filter((k) => k.kanji !== correct))
      .slice(0, 3)
      .map((k) => k.kanji)
    return {
      item,
      choices: shuffle([correct, ...distractors]),
    }
  })
}

export default function YoujiKanjiPage() {
  const [phase, setPhase] = useState<Phase>('menu')
  const [count, setCount] = useState<number>(5)

  const [questions, setQuestions] = useState<Question[]>([])
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [log, setLog] = useState<LogEntry[]>([])

  const [chosenKanji, setChosenKanji] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const startGame = useCallback(() => {
    const qs = buildQuestions(count)
    setQuestions(qs)
    setIdx(0)
    setScore(0)
    setCombo(0)
    setMaxCombo(0)
    setLog([])
    setChosenKanji(null)
    setShowFeedback(false)
    setPhase('game')
    if (qs[0]) {
      speak(qs[0].item.questionSpeech)
    }
  }, [count])

  const handleAnswer = useCallback(
    (kanji: string) => {
      if (chosenKanji !== null) return
      const q = questions[idx]
      const ok = kanji === q.item.kanji

      setChosenKanji(kanji)
      setShowFeedback(true)

      let newCombo = combo
      let newMaxCombo = maxCombo
      let newScore = score

      if (ok) {
        newCombo = combo + 1
        if (newCombo > maxCombo) newMaxCombo = newCombo
        const comboBonus = Math.min(newCombo - 1, 5) * 20
        newScore = score + 100 + comboBonus
        setCombo(newCombo)
        setMaxCombo(newMaxCombo)
        setScore(newScore)
        speak(
          newCombo >= 3
            ? 'すごい！' + newCombo + 'れんぞく！'
            : 'せいかい！' + q.item.reading + '！',
        )
      } else {
        setCombo(0)
        newCombo = 0
        speak('ざんねん。' + q.item.reading + ' だよ！')
      }

      setLog((prev) => [...prev, { item: q.item, chosenKanji: kanji, ok }])
    },
    [chosenKanji, questions, idx, combo, maxCombo, score],
  )

  const nextQuestion = useCallback(() => {
    const nextIdx = idx + 1
    if (nextIdx >= questions.length) {
      const total = questions.length
      const correctCount = log.filter((l) => l.ok).length
      const pct = correctCount / total
      let stars = 1
      if (pct >= 0.9) stars = 3
      else if (pct >= 0.7) stars = 2

      saveRecord({ count: total, correct: correctCount, score, stars })
      saveScore('youji-kanji', correctCount, total, 'kanji')

      speak(stars === 3 ? 'かんぺき！すごいね！' : 'よくがんばりました！')
      setPhase('result')
    } else {
      setIdx(nextIdx)
      setChosenKanji(null)
      setShowFeedback(false)
      speak(questions[nextIdx].item.questionSpeech)
    }
  }, [idx, questions, log, score])

  // ===== MENU =====
  if (phase === 'menu') {
    return (
      <div className="bg-gradient-to-b from-red-50 to-orange-50 min-h-screen pb-20">
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-10">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
            <Link href="/lab" className="text-gray-400 hover:text-gray-600 text-lg">←</Link>
            <h1 className="text-lg font-bold text-gray-800 flex-1">📖 はじめての かんじ</h1>
          </div>
        </div>
        <div className="max-w-md mx-auto px-4 pt-6 space-y-4">
          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-sm font-bold text-gray-600 mb-2">あそびかた</p>
            <p className="text-sm text-gray-500">
              イラストを見て、かんじを4つの中からえらぼう！
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-sm font-bold text-gray-600 mb-3">もんだいの かず</p>
            <div className="flex gap-3">
              {[5, 8, 12].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${
                    count === n ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {n}もん
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 rounded-2xl font-black text-xl text-white shadow-md transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #f87171, #fca5a5)' }}
          >
            スタート！
          </button>
        </div>
      </div>
    )
  }

  // ===== GAME =====
  if (phase === 'game') {
    const q = questions[idx]
    const total = questions.length
    const pct = (idx / total) * 100

    return (
      <div className="bg-gradient-to-b from-red-50 to-orange-50 min-h-screen pb-20">
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-10">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => {
                window.speechSynthesis?.cancel()
                setPhase('menu')
              }}
              className="text-gray-400 hover:text-gray-600 text-lg"
            >
              ←
            </button>
            <div className="flex-1">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{idx + 1} / {total}</span>
                <span>スコア: {score}</span>
                {combo >= 2 && <span className="text-orange-500 font-black">🔥 {combo}れんぞく</span>}
              </div>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #f87171, #fca5a5)' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 pt-6 space-y-4">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <p className="text-sm text-gray-500 mb-4">これは なんという かんじ？</p>
            {/* Illustration */}
            <div className="flex justify-center mb-4">
              <div
                className="w-40 h-40 rounded-2xl overflow-hidden"
                dangerouslySetInnerHTML={{ __html: q.item.illust }}
              />
            </div>
          </div>

          {/* Choices — large kanji text */}
          <div className="grid grid-cols-2 gap-3">
            {q.choices.map((c) => {
              let btnClass =
                'w-full py-5 rounded-2xl text-4xl font-black transition-all '
              if (chosenKanji === null) {
                btnClass += 'bg-white shadow-md text-gray-800 active:scale-95 hover:shadow-lg'
              } else if (c === q.item.kanji) {
                btnClass += 'bg-green-100 text-green-700 border-2 border-green-400'
              } else if (c === chosenKanji && c !== q.item.kanji) {
                btnClass += 'bg-red-100 text-red-600 border-2 border-red-400'
              } else {
                btnClass += 'bg-gray-100 text-gray-400'
              }
              return (
                <button
                  key={c}
                  className={btnClass}
                  onClick={() => handleAnswer(c)}
                  disabled={chosenKanji !== null}
                >
                  {c}
                </button>
              )
            })}
          </div>

          {/* Feedback */}
          {showFeedback && chosenKanji !== null && (
            <div
              className={`rounded-2xl p-4 text-center ${
                chosenKanji === q.item.kanji ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <div className="text-3xl mb-1">{chosenKanji === q.item.kanji ? '⭕' : '❌'}</div>
              <p className="text-sm font-bold text-gray-700">
                {chosenKanji === q.item.kanji
                  ? `せいかい！「${q.item.kanji}（${q.item.reading}）」だよ！`
                  : `せいかいは「${q.item.kanji}（${q.item.reading}）」だよ！`}
              </p>
              {combo >= 3 && chosenKanji === q.item.kanji && (
                <p className="text-orange-500 font-black mt-1">🔥 {combo}れんぞく！！</p>
              )}
              <button
                onClick={nextQuestion}
                className="mt-3 px-8 py-2 rounded-full font-black text-white text-sm active:scale-95"
                style={{ background: 'linear-gradient(135deg, #f87171, #fca5a5)' }}
              >
                つぎへ →
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ===== RESULT =====
  const correctCount = log.filter((l) => l.ok).length
  const total = questions.length
  const pct = correctCount / total
  let stars = 1
  if (pct >= 0.9) stars = 3
  else if (pct >= 0.7) stars = 2
  let emoji = '😊'
  let title = 'またれんしゅうしよう！'
  if (stars === 3) { emoji = '🎉'; title = 'かんぺき！すごい！！' }
  else if (stars === 2) { emoji = '😄'; title = 'よくできました！' }

  return (
    <div className="bg-gradient-to-b from-red-50 to-orange-50 min-h-screen pb-20">
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <h1 className="text-lg font-bold text-gray-800 flex-1">📖 けっか</h1>
        </div>
      </div>
      <div className="max-w-md mx-auto px-4 pt-6 space-y-4">
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <div className="text-5xl mb-2">{emoji}</div>
          <h2 className="text-xl font-black text-gray-800 mb-2">{title}</h2>
          <div className="text-3xl mb-4">
            {'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}
          </div>
          <div className="flex justify-around text-center">
            <div>
              <div className="text-3xl font-black text-red-600">{correctCount}/{total}</div>
              <div className="text-xs text-gray-500">せいかい</div>
            </div>
            <div>
              <div className="text-3xl font-black text-orange-500">{score}</div>
              <div className="text-xs text-gray-500">てん</div>
            </div>
            <div>
              <div className="text-3xl font-black text-yellow-500">{maxCombo}</div>
              <div className="text-xs text-gray-500">コンボ</div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">{total}もん | かんじ</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4 space-y-2">
          {log.map((l, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 text-sm p-2 rounded-xl ${
                l.ok ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <span>{l.ok ? '⭕' : '❌'}</span>
              <span className="text-2xl font-black text-gray-800">{l.item.kanji}</span>
              <span className="flex-1 text-gray-600 text-xs">{l.item.reading}</span>
              {!l.ok && (
                <span className="text-xs text-red-500">
                  → こたえ: {l.chosenKanji}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={startGame}
            className="flex-1 py-4 rounded-2xl font-black text-white text-lg active:scale-95"
            style={{ background: 'linear-gradient(135deg, #f87171, #fca5a5)' }}
          >
            もういちど
          </button>
          <Link
            href="/lab"
            className="flex-1 py-4 rounded-2xl font-black text-red-700 text-lg text-center bg-red-100 active:scale-95"
          >
            もどる
          </Link>
        </div>
      </div>
    </div>
  )
}
