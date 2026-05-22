'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { loadProgress, isLevelUnlocked, getLevelProgress, getLevelStars } from '@/lib/thinkingProgress'
import { TOTAL_LEVELS, UNLOCK_THRESHOLD, QUESTIONS_PER_LEVEL } from '@/data/thinkingData'
import { BADGES } from '@/data/thinkingBadges'
import type { ThinkingProgress } from '@/lib/thinkingProgress'

const SESSION_KEY = 'tanq-lab-auth'
const GUEST_FREE_LEVELS = 2  // ゲストはLv1〜2まで無料体験

function getUserType(): 'guest' | 'tester' | 'member' {
  if (typeof window === 'undefined') return 'guest'
  const v = localStorage.getItem(SESSION_KEY)
  if (v === 'member') return 'member'
  if (v === 'tester') return 'tester'
  return 'guest'
}

export default function ThinkingTopPage() {
  const [progress, setProgress] = useState<ThinkingProgress | null>(null)
  const [tab, setTab] = useState<'levels' | 'badges'>('levels')
  const [userType, setUserType] = useState<'guest' | 'tester' | 'member'>('guest')

  useEffect(() => {
    setProgress(loadProgress())
    setUserType(getUserType())
  }, [])

  if (!progress) return null

  const goldCount = BADGES.filter(b => progress.badges[b.id]?.gold).length
  const silverCount = BADGES.filter(b => progress.badges[b.id]?.silver && !progress.badges[b.id]?.gold).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50 pb-20">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/lab" className="text-gray-400 hover:text-gray-600 text-lg">←</Link>
          <h1 className="text-lg font-bold text-gray-800 flex-1">🧩 かんがえる力ジム</h1>
          <div className="text-sm text-gray-500">
            🥇{goldCount} 🥈{silverCount}
          </div>
        </div>
        {/* ルール説明 */}
        <div className="bg-yellow-50 border-t border-yellow-100 px-4 py-2 text-center">
          <span className="text-xs text-yellow-700 font-medium">
            ⭐ 5問中 <span className="text-yellow-800 font-bold">{UNLOCK_THRESHOLD}問以上</span> せいかいで、つぎのレベルがひらくよ！
          </span>
        </div>
        {/* タブ */}
        <div className="flex border-t border-gray-100">
          <button
            className={`flex-1 py-2 text-sm font-medium transition-colors ${tab === 'levels' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
            onClick={() => setTab('levels')}
          >
            レベル一覧
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium transition-colors ${tab === 'badges' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
            onClick={() => setTab('badges')}
          >
            バッジ ({goldCount + silverCount}/{BADGES.length})
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

function LevelGrid({ progress, userType }: { progress: ThinkingProgress; userType: 'guest' | 'tester' | 'member' }) {
  const isGuest = userType === 'guest'
  return (
    <>
      {isGuest && (
        <div className="mb-4 bg-indigo-50 border border-indigo-200 rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-xl">🔓</span>
          <div className="flex-1">
            <div className="text-sm font-bold text-indigo-700">Lv1・Lv2が無料で体験できるよ！</div>
            <Link href="/register" className="text-xs text-indigo-500 font-bold hover:underline">
              無料登録でLv3〜20も全部解放 →
            </Link>
          </div>
        </div>
      )}
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1).map(level => {
          const guestLocked = isGuest && level > GUEST_FREE_LEVELS
          const unlocked = !guestLocked && isLevelUnlocked(level, progress)
          const lp = getLevelProgress(level, progress)
          const stars = getLevelStars(lp.bestScore)
          const done = lp.bestScore >= UNLOCK_THRESHOLD

          return (
            <div key={level}>
              {unlocked ? (
                <Link href={`/apps/thinking/${level}`}>
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
          ? 'bg-indigo-50 border border-indigo-200 cursor-pointer active:scale-95'
          : 'bg-gray-100 text-gray-300 cursor-not-allowed'
        : done
          ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-md active:scale-95'
          : 'bg-white text-gray-700 shadow-md border-2 border-blue-200 active:scale-95'
      }`}
    >
      <div className={`text-xs font-bold mb-1 ${locked ? (guestLocked ? 'text-indigo-400' : 'text-gray-300') : done ? 'text-blue-100' : 'text-blue-400'}`}>
        Lv{level}
      </div>
      {locked ? (
        <div className="text-xl">{guestLocked ? '🔐' : '🔒'}</div>
      ) : (
        <>
          <div className="text-lg font-bold">{score > 0 ? `${score}/${QUESTIONS_PER_LEVEL}` : '━'}</div>
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

function BadgeGrid({ progress }: { progress: ThinkingProgress }) {
  return (
    <>
      {progress.allBadgesGold && (
        <div className="mb-4 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl p-4 text-white text-center shadow-lg">
          <div className="text-3xl mb-1">👑</div>
          <div className="font-bold text-lg">おめでとう！思考王バッジ獲得！</div>
          <div className="text-sm text-yellow-100">全25バッジをゴールドにしたね！</div>
        </div>
      )}
      <div className="grid grid-cols-3 gap-3">
        {BADGES.map(badge => {
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
                <div className="mt-1 text-xs">
                  {gold ? '🥇' : '🥈'}
                </div>
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
