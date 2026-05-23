'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { PREFECTURES, REGIONS, type Prefecture } from '@/data/todofukenData'
import { PREF_PATHS } from '@/data/todofukenPaths'

const ALL_REGIONS = ['全て', ...REGIONS] as const

export default function Flashcard() {
  const [regionFilter, setRegionFilter] = useState<string>('全て')
  const [cardIndex, setCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const prefs: Prefecture[] = regionFilter === '全て'
    ? PREFECTURES
    : PREFECTURES.filter(p => p.region === regionFilter)

  useEffect(() => { setCardIndex(0); setFlipped(false) }, [regionFilter])

  if (prefs.length === 0) return null

  const pref = prefs[cardIndex]
  const shapePath = PREF_PATHS[pref.id]?.shapePath ?? ''
  const easyFamous = pref.famous.filter(f => f.difficulty === 1).slice(0, 5)

  function next() { setCardIndex(i => (i + 1) % prefs.length); setFlipped(false) }
  function prev() { setCardIndex(i => (i - 1 + prefs.length) % prefs.length); setFlipped(false) }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 pb-20">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/apps/todofuken" className="text-gray-400 hover:text-gray-600">←</Link>
          <h1 className="font-bold text-gray-800 flex-1">📇 フラッシュカード</h1>
          <span className="text-sm text-gray-500">{cardIndex + 1}/{prefs.length}</span>
        </div>
        {/* Region filter */}
        <div className="overflow-x-auto pb-2 px-4">
          <div className="flex gap-2 min-w-max">
            {ALL_REGIONS.map(r => (
              <button key={r} onClick={() => setRegionFilter(r)}
                className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap transition-colors ${
                  regionFilter === r ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5">
        {/* Card */}
        <button
          className="w-full bg-white rounded-3xl shadow-lg overflow-hidden active:scale-[0.98] transition-transform text-left"
          onClick={() => setFlipped(f => !f)}
          style={{ minHeight: 340 }}
        >
          {!flipped ? (
            <div className="flex flex-col items-center justify-center p-6" style={{ minHeight: 340 }}>
              <svg viewBox="0 0 300 300" style={{ width: 160, height: 160 }}>
                <path d={shapePath} fill="#6ee7b7" stroke="#047857" strokeWidth="1.5" fillRule="evenodd" />
              </svg>
              <p className="text-3xl font-black text-gray-800 mt-4">{pref.name}</p>
              <p className="text-gray-500 text-sm mt-1">{pref.kana}</p>
              <span className="mt-3 px-3 py-1 rounded-full text-xs text-gray-500 bg-gray-100">{pref.region}</span>
              <p className="text-xs text-gray-400 mt-5">タップして うらを見る 👇</p>
            </div>
          ) : (
            <div className="p-5" style={{ minHeight: 340 }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{pref.emoji}</span>
                <div>
                  <p className="font-black text-gray-800 text-lg">{pref.name}</p>
                  <p className="text-xs text-gray-400">{pref.region}</p>
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-3 mb-3">
                <p className="text-xs text-purple-600 font-bold mb-1">🏛️ 県庁所在地</p>
                <p className="font-black text-gray-800 text-lg">{pref.capital}
                  {pref.capitalDiffers && (
                    <span className="text-xs text-purple-400 font-normal ml-2">（県名とちがう）</span>
                  )}
                </p>
              </div>

              {easyFamous.length > 0 && (
                <div className="bg-amber-50 rounded-2xl p-3 mb-3">
                  <p className="text-xs text-amber-600 font-bold mb-2">🍱 主な名物</p>
                  <div className="flex flex-wrap gap-1.5">
                    {easyFamous.map(f => (
                      <span key={f.name}
                        className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                        {f.emoji} {f.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-sky-50 rounded-2xl p-3">
                <p className="text-xs text-sky-600 font-bold mb-1">💡 豆知識</p>
                <p className="text-sm text-gray-700 leading-relaxed">{pref.fact}</p>
              </div>
            </div>
          )}
        </button>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4">
          <button onClick={prev}
            className="bg-white rounded-2xl shadow px-6 py-3 font-bold text-gray-600 active:scale-95 transition-all">
            ← まえ
          </button>
          <div className="flex gap-1.5">
            {prefs.slice(Math.max(0, cardIndex - 2), Math.min(prefs.length, cardIndex + 3)).map((_, i) => {
              const idx = Math.max(0, cardIndex - 2) + i
              return (
                <div key={idx} className={`rounded-full ${idx === cardIndex ? 'w-4 h-2 bg-emerald-500' : 'w-2 h-2 bg-gray-300'} transition-all`} />
              )
            })}
          </div>
          <button onClick={next}
            className="bg-emerald-500 text-white rounded-2xl shadow px-6 py-3 font-bold active:scale-95 transition-all">
            つぎ →
          </button>
        </div>
      </div>
    </div>
  )
}
