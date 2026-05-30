'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { JUKU_UNITS, JukuUnit } from '@/data/jukuData'
import { getDataKey } from '@/lib/storage'

const JUKU_PROGRESS_KEY = 'tanq_juku_progress_v1'

type ProgressStore = Record<string, { cleared: number; total: number }>

function loadProgress(): ProgressStore {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(getDataKey(JUKU_PROGRESS_KEY)) || '{}') } catch { return {} }
}

function isUnlocked(unit: JukuUnit, progress: ProgressStore, userType: string): boolean {
  // 無料単元は誰でも解放
  if (unit.isFree) return true
  // テスターは全単元解放（前提条件なし）
  if (userType === 'tester') return true
  // メンバーは前提単元を60%クリアで順次解放
  if (userType === 'member') {
    return unit.prerequisiteIds.every(pid => {
      const p = progress[pid]
      const prereqUnit = JUKU_UNITS.find(u => u.id === pid)
      if (!prereqUnit) return true
      const total = prereqUnit.problems.length
      return p && p.cleared >= Math.ceil(total * 0.6)
    })
  }
  // ゲストは無料単元のみ
  return false
}

function getUserType(): string {
  if (typeof window === 'undefined') return 'guest'
  return localStorage.getItem('tanq-lab-auth') || 'guest'
}

const LAYER_LABELS: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: '第1層：数の土台', color: '#60a5fa', bg: '#EFF6FF' },
  2: { label: '第2層：文章題の基本', color: '#4ade80', bg: '#F0FDF4' },
  3: { label: '第3層：割合と比', color: '#c4a8ff', bg: '#F5F3FF' },
  4: { label: '第4層：速さと規則性', color: '#f87171', bg: '#FEF2F2' },
}

export default function JukuMenu() {
  const [progress, setProgress] = useState<ProgressStore>({})
  const [userType, setUserType] = useState('guest')

  useEffect(() => {
    setProgress(loadProgress())
    setUserType(getUserType())
  }, [])

  const layers = [1, 2, 3, 4] as const

  // 実際に問題が入っている（公開済みの）単元数。「12単元」と過大表示しないため動的に算出
  const liveUnitCount = JUKU_UNITS.filter(u => u.problems.length > 0).length
  const freeUnitCount = JUKU_UNITS.filter(u => u.isFree && u.problems.length > 0).length
  const totalUnitCount = JUKU_UNITS.length

  return (
    <div
      className="min-h-screen pb-20"
      style={{
        background: '#FFF6E5',
        backgroundImage: 'radial-gradient(circle, rgba(58,46,42,0.06) 1px, transparent 1.5px)',
        backgroundSize: '22px 22px',
      }}
    >
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <Link href="/lab" className="inline-flex items-center gap-1 text-sm font-bold mb-4"
          style={{ color: '#6B5A52' }}>
          ← ラボにもどる
        </Link>
        <div className="rounded-[26px] p-5 mb-2"
          style={{ background: '#FFFFFF', border: '3px solid #3A2E2A', boxShadow: '6px 6px 0 0 #3A2E2A' }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🏆</span>
            <div>
              <h1 className="font-black text-2xl leading-tight" style={{ color: '#3A2E2A', fontFamily: 'var(--font-zen)' }}>
                中学受験 算数①
              </h1>
              <p className="text-xs font-bold mt-0.5" style={{ color: '#6B5A52' }}>
                文章題・特殊算 公開中{liveUnitCount}単元（全{totalUnitCount}単元・順次公開）
              </p>
            </div>
          </div>
          <p className="text-xs font-bold leading-relaxed" style={{ color: '#6B5A52' }}>
            図を使ってイメージしながら考える力を育てよう。<br />
            前の単元をクリアすると次が解放されるよ！
          </p>
          {userType === 'guest' && (
            <div className="mt-3 rounded-2xl px-3 py-2"
              style={{ background: '#FFF1B8', border: '2px solid #3A2E2A' }}>
              <p className="text-[11px] font-black" style={{ color: '#3A2E2A' }}>
                🔓 第1層（{freeUnitCount}単元）は無料で体験できます
              </p>
              <Link href="/register" className="text-[11px] font-black hover:underline" style={{ color: '#FF6F9C' }}>
                公開中の全単元を使うには → 無料登録
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Unit cards by layer */}
      <div className="px-4 space-y-6">
        {layers.map(layer => {
          const layerInfo = LAYER_LABELS[layer]
          const layerUnits = JUKU_UNITS.filter(u => u.layer === layer)
          return (
            <div key={layer}>
              {/* Layer header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="h-0.5 flex-1 rounded-full" style={{ background: layerInfo.color, opacity: 0.4 }} />
                <span className="text-[11px] font-black px-3 py-1 rounded-full"
                  style={{ background: layerInfo.bg, border: `2px solid ${layerInfo.color}`, color: layerInfo.color }}>
                  {layerInfo.label}
                </span>
                <div className="h-0.5 flex-1 rounded-full" style={{ background: layerInfo.color, opacity: 0.4 }} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {layerUnits.map(unit => {
                  const unlocked = isUnlocked(unit, progress, userType)
                  const prog = progress[unit.id]
                  const total = unit.problems.length
                  const cleared = prog?.cleared ?? 0
                  const pct = total > 0 ? Math.round(cleared / total * 100) : 0
                  const isComingSoon = total === 0

                  return (
                    <UnitCard
                      key={unit.id}
                      unit={unit}
                      unlocked={unlocked}
                      cleared={cleared}
                      total={total}
                      pct={pct}
                      isComingSoon={isComingSoon}
                      userType={userType}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer note */}
      <div className="px-4 mt-8">
        <p className="text-center text-[10px] font-bold" style={{ color: '#B0A49C' }}>
          第2〜4層は順次公開予定
        </p>
      </div>
    </div>
  )
}

function UnitCard({
  unit, unlocked, cleared, total, pct, isComingSoon, userType,
}: {
  unit: JukuUnit
  unlocked: boolean
  cleared: number
  total: number
  pct: number
  isComingSoon: boolean
  userType: string
}) {
  const allDone = total > 0 && cleared >= total

  if (!unlocked || isComingSoon) {
    return (
      <div className="relative rounded-[22px] p-4 opacity-60"
        style={{ background: '#F0EDE8', border: '3px solid #C4B8AE', boxShadow: '3px 3px 0 0 #C4B8AE' }}>
        <span className="absolute top-2 right-2 text-[9px] px-2 py-0.5 rounded-full font-black"
          style={{ background: '#C4B8AE', color: '#FFFFFF' }}>
          {isComingSoon ? '近日公開' : userType === 'guest' ? '🔒 登録で解放' : '🔒 前の単元をクリア'}
        </span>
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-2 text-xl grayscale"
          style={{ background: '#FFFFFF', border: '2px solid #C4B8AE' }}>
          {unit.emoji}
        </div>
        <div className="text-[10px] font-bold mb-0.5" style={{ color: '#B0A49C' }}>第{unit.order}単元</div>
        <div className="font-black text-xs leading-tight" style={{ color: '#6B5A52' }}>{unit.title}</div>
        <div className="text-[9px] mt-1" style={{ color: '#B0A49C' }}>{unit.titleKana}</div>
      </div>
    )
  }

  return (
    <Link href={`/apps/juku/${unit.id}`}
      className="block relative rounded-[22px] p-4 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
      style={{
        background: allDone ? '#DBF6F0' : '#FFFFFF',
        border: `3px solid #3A2E2A`,
        boxShadow: '3px 3px 0 0 #3A2E2A',
        textDecoration: 'none',
      }}>
      {allDone && (
        <span className="absolute top-2 right-2 text-[9px] px-2 py-0.5 rounded-full font-black"
          style={{ background: '#2BA39A', color: '#FFFFFF' }}>
          ✓ クリア
        </span>
      )}
      {unit.isFree && !allDone && (
        <span className="absolute top-2 right-2 text-[9px] px-2 py-0.5 rounded-full font-black"
          style={{ background: '#FFF1B8', border: '1.5px solid #3A2E2A', color: '#C99700' }}>
          無料
        </span>
      )}
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-2 text-xl"
        style={{
          background: unit.color + '33',
          border: `2.5px solid #3A2E2A`,
          boxShadow: '2px 2px 0 0 #3A2E2A',
        }}>
        {unit.emoji}
      </div>
      <div className="text-[10px] font-bold mb-0.5" style={{ color: '#6B5A52' }}>第{unit.order}単元</div>
      <div className="font-black text-xs leading-tight" style={{ color: '#3A2E2A' }}>{unit.title}</div>
      <div className="text-[9px] mb-2" style={{ color: '#6B5A52' }}>{unit.titleKana}</div>
      {total > 0 && (
        <>
          <div className="flex justify-between text-[9px] mb-1" style={{ color: '#6B5A52' }}>
            <span>{cleared}/{total}問</span>
            <span style={{ color: unit.color }}>{pct}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(58,46,42,0.15)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: unit.color }} />
          </div>
        </>
      )}
    </Link>
  )
}
