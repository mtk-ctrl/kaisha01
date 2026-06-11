'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { getDataKey } from '@/lib/storage'
import { PREFECTURES } from '@/data/todofukenData'

const PROGRESS_KEY = 'tanq_todofuken_progress_v1'

type TodofukenProgress = {
  shapeMastered: string[]
  capitalMastered: string[]
  famousMastered: string[]
}

function loadProgress(): TodofukenProgress {
  if (typeof window === 'undefined') return { shapeMastered: [], capitalMastered: [], famousMastered: [] }
  try {
    return { shapeMastered: [], capitalMastered: [], famousMastered: [], ...JSON.parse(localStorage.getItem(getDataKey(PROGRESS_KEY)) || '{}') }
  } catch { return { shapeMastered: [], capitalMastered: [], famousMastered: [] } }
}

const TOTAL = PREFECTURES.length

const MODES = [
  { id: 'shape',     emoji: '🗾', name: 'かたちあて',     desc: 'この形はどこの都道府県？', color: 'bg-sky-500',    href: '/apps/todofuken/shape' },
  { id: 'famous',    emoji: '🍱', name: 'めいぶつチャレンジ', desc: '名物・特産・日本一を学ぼう', color: 'bg-amber-400', href: '/apps/todofuken/famous' },
  { id: 'capital',   emoji: '🏛️', name: '県庁所在地',     desc: '県庁所在地を答えよう',       color: 'bg-purple-500', href: '/apps/todofuken/capital' },
  { id: 'flashcard', emoji: '📇', name: 'フラッシュカード', desc: '47都道府県を まとめて復習',  color: 'bg-emerald-500', href: '/apps/todofuken/flashcard' },
]

export default function TodofukenMenu() {
  const [progress, setProgress] = useState<TodofukenProgress | null>(null)

  useEffect(() => { setProgress(loadProgress()) }, [])

  const shapeCount   = progress?.shapeMastered.length   ?? 0
  const capitalCount = progress?.capitalMastered.length ?? 0
  const famousCount  = progress?.famousMastered.length  ?? 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50 pb-20">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/lab" className="text-gray-400 hover:text-gray-600 text-lg">←</Link>
          <h1 className="text-lg font-bold text-gray-800">🗾 都道府県マスター</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5">
        {/* Progress summary */}
        <div className="bg-white rounded-2xl shadow p-4 mb-5 grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-2xl font-black text-sky-500">{shapeCount}<span className="text-base text-gray-400">/{TOTAL}</span></div>
            <div className="text-xs text-gray-500 mt-1">かたち</div>
          </div>
          <div>
            <div className="text-2xl font-black text-purple-500">{capitalCount}<span className="text-base text-gray-400">/{TOTAL}</span></div>
            <div className="text-xs text-gray-500 mt-1">県庁所在地</div>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-500">{famousCount}<span className="text-base text-gray-400">/{TOTAL}</span></div>
            <div className="text-xs text-gray-500 mt-1">めいぶつ</div>
          </div>
        </div>

        {/* Mode cards */}
        <div className="grid grid-cols-2 gap-3">
          {MODES.map(mode => (
            <Link key={mode.id} href={mode.href}
              className="bg-white rounded-2xl shadow hover:shadow-md active:scale-95 transition-all p-4 flex flex-col items-center text-center gap-2 border border-gray-100">
              <div className="text-4xl">{mode.emoji}</div>
              <div className="font-bold text-gray-800 text-sm leading-tight">{mode.name}</div>
              <div className="text-xs text-gray-500 leading-tight">{mode.desc}</div>
            </Link>
          ))}
        </div>

        {/* Info */}
        <div className="mt-5 bg-blue-50 rounded-2xl p-3 text-center">
          <p className="text-xs text-blue-600 leading-relaxed">
            同じ都道府県に <span className="font-bold">2回正解</span> するとマスター扱いになるよ！<br />
            全47都道府県を制覇しよう 🏆
          </p>
        </div>
      </div>
    </div>
  )
}
