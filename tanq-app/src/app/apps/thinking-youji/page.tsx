'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { loadYoujiProgress, isYoujiLevelUnlocked, getYoujiLevelProgress, getYoujiLevelStars } from '@/lib/thinkingYoujiProgress'
import { YOUJI_TOTAL_LEVELS, YOUJI_UNLOCK_THRESHOLD, YOUJI_QUESTIONS_PER_LEVEL } from '@/data/thinkingYoujiData'
import { YOUJI_BADGES } from '@/data/thinkingYoujiBadges'
import type { YoujiProgress } from '@/lib/thinkingYoujiProgress'

const SESSION_KEY = 'tanq-lab-auth'
const GUEST_FREE_LEVELS = 2

function getUserType(): 'guest' | 'tester' | 'member' {
  if (typeof window === 'undefined') return 'guest'
  const v = localStorage.getItem(SESSION_KEY)
  if (v === 'member') return 'member'
  if (v === 'tester') return 'tester'
  return 'guest'
}

export default function YoujiThinkingTopPage() {
  const [progress, setProgress] = useState<YoujiProgress | null>(null)
  const [tab, setTab] = useState<'levels' | 'badges'>('levels')
  const [userType, setUserType] = useState<'guest' | 'tester' | 'member'>('guest')

  useEffect(() => {
    setProgress(loadYoujiProgress())
    setUserType(getUserType())
  }, [])

  if (!progress) return null

  const goldCount = YOUJI_BADGES.filter(b => progress.badges[b.id]?.gold).length
  const silverCount = YOUJI_BADGES.filter(b => progress.badges[b.id]?.silver && !progress.badges[b.id]?.gold).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-orange-50 pb-20">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/lab" className="text-gray-400 hover:text-gray-600 text-lg">←</Link>
          <h1 className="text-lg font-bold text-gray-800 flex-1">🐰 ようちえん かんがえるジム</h1>
          <div className="text-sm text-gray-500">
            🥇{goldCount} 🥈{silverCount}
          </div>
        </div>
        <div className="bg-yellow-50 border-t border-yellow-100 px-4 py-2 text-center">
          <span className="text-xs text-yellow-700 font-medium">
            ⭐ 5もんのうち <span className="text-yellow-800 font-bold">{YOUJI_UNLOCK_THRESHOLD}もんいじょう</span> せいかいで、つぎがひらくよ！
          </span>
        </div>
        <div className="flex border-t border-gray-100">
          <button
            className={`flex-1 py-2 text-sm font-medium transition-colors ${tab === 'levels' ? 'text-pink-600 border-b-2 border-pink-500' : 'text-gray-400'}`}
            onClick={() => setTab('levels')}
          >
            レベルいちらん
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium transition-colors ${tab === 'badges' ? 'text-pink-600 border-b-2 border-pink-500' : 'text-gray-400'}`}
            onClick={() => setTab('badges')}
          >
            バッジ ({goldCount + silverCount}/{YOUJI_BADGES.length})
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4">
        {tab === 'levels' ? (
          <LevelGrid progress={progress} userType={userType} />
        ) : (
          <BadgeGrid progress={progress} />
        )}
      </div>
    </div>
  )
}

function LevelGrid({ progress, userType }: { progress: YoujiProgress; userType: 'guest' | 'tester' | 'member' }) {
  const isGuest = userType === 'guest'
  return (
    <>
      {isGuest && (
        <div className="mb-4 bg-pink-50 border border-pink-200 rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-xl">🔓</span>
          <div className="flex-1">
            <div className="text-sm font-bold text-pink-700">Lv1・Lv2が　むりょうで　たいけんできるよ！</div>
            <Link href="/register" className="text-xs text-pink-500 font-bold hover:underline">
              むりょうとうろくで　Lv3〜10も　ぜんぶひらく →
            </Link>
          </div>
        </div>
      )}
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: YOUJI_TOTAL_LEVELS }, (_, i) => i + 1).map(level => {
          const guestLocked = isGuest && level > GUEST_FREE_LEVELS
          const unlocked = !guestLocked && isYoujiLevelUnlocked(level, progress)
          const lp = getYoujiLevelProgress(level, progress)
          const stars = getYoujiLevelStars(lp.bestScore)
          const done = lp.bestScore >= YOUJI_UNLOCK_THRESHOLD

          return (
            <div key={level}>
              {unlocked ? (
                <Link href={`/apps/thinking-youji/${level}`}>
                  <LevelCard level={level} stars={stars} done={done} score={lp.bestScore} />
                </Link>
              ) : guestLocked ? (
                <Link href="/register">
                  <LevelCard level={level} locked guestLocked />
                </Link>
              ) : (
                <LevelCard level={level} locked />
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

function LevelCard({
  level, stars = 0, done = false, locked = false, guestLocked = false, score = 0
}: {
  level: number; stars?: number; done?: boolean; locked?: boolean; guestLocked?: boolean; score?: number
}) {
  return (
    <div className={`rounded-2xl p-3 text-center transition-all select-none
      ${locked
        ? guestLocked
          ? 'bg-pink-50 border border-pink-200 cursor-pointer active:scale-95'
          : 'bg-gray-100 text-gray-300 cursor-not-allowed'
        : done
          ? 'bg-gradient-to-br from-pink-400 to-orange-400 text-white shadow-md active:scale-95'
          : 'bg-white text-gray-700 shadow-md border-2 border-pink-200 active:scale-95'
      }`}
    >
      <div className={`text-xs font-bold mb-1 ${locked ? (guestLocked ? 'text-pink-400' : 'text-gray-300') : done ? 'text-pink-100' : 'text-pink-400'}`}>
        Lv{level}
      </div>
      {locked ? (
        <div className="text-xl">{guestLocked ? '🔐' : '🔒'}</div>
      ) : (
        <>
          <div className="text-lg font-bold">{score > 0 ? `${score}/${YOUJI_QUESTIONS_PER_LEVEL}` : '━'}</div>
          <div className="text-xs mt-1">
            {stars >= 1 ? '⭐' : '☆'}
            {stars >= 2 ? '⭐' : '☆'}
            {stars >= 3 ? '⭐' : '☆'}
          </div>
        </>
      )}
    </div>
  )
}

function BadgeGrid({ progress }: { progress: YoujiProgress }) {
  return (
    <>
      {progress.allBadgesGold && (
        <div className="mb-4 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl p-4 text-white text-center shadow-lg">
          <div className="text-3xl mb-1">👑</div>
          <div className="font-bold text-lg">おめでとう！かんがえるおうじゃ！</div>
          <div className="text-sm text-yellow-100">ぜんぶの　バッジを　ゴールドにしたね！</div>
        </div>
      )}
      <div className="grid grid-cols-3 gap-3">
        {YOUJI_BADGES.map(badge => {
          const bp = progress.badges[badge.id]
          const silver = bp?.silver ?? false
          const gold = bp?.gold ?? false

          return (
            <div
              key={badge.id}
              className={`rounded-2xl p-3 text-center transition-all relative overflow-hidden
                ${gold
                  ? 'bg-gradient-to-br from-yellow-300 to-amber-400 shadow-md'
                  : silver
                    ? 'bg-gradient-to-br from-gray-200 to-gray-300 shadow-sm'
                    : 'bg-gray-100'
                }`}
            >
              {gold && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute text-xs opacity-60 animate-pulse"
                      style={{
                        top: `${10 + (i * 15) % 70}%`,
                        left: `${5 + (i * 17) % 85}%`,
                        animationDelay: `${i * 0.3}s`
                      }}
                    >✨</div>
                  ))}
                </div>
              )}
              <div className={`text-2xl mb-1 ${!silver ? 'grayscale opacity-30' : ''}`}>
                {badge.emoji}
              </div>
              <div className={`text-xs font-bold leading-tight ${gold ? 'text-amber-800' : silver ? 'text-gray-600' : 'text-gray-300'}`}>
                {silver ? badge.name : '???'}
              </div>
              {silver && (
                <div className={`text-[10px] mt-0.5 leading-tight line-clamp-2 ${gold ? 'text-amber-700' : 'text-gray-500'}`}>
                  {badge.description}
                </div>
              )}
              {(silver || gold) && (
                <div className="mt-1 text-xs">{gold ? '🥇' : '🥈'}</div>
              )}
              {!silver && (
                <div className="mt-1 text-xs text-gray-300">まだかくとく前</div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
