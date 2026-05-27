'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getDataKey } from '@/lib/storage'
import { SCIENCE_QUESTIONS } from '@/data/scienceData'
import { STORAGE_KEYS } from '@/lib/storageKeys'

const DOMAINS = [
  { key: '生物', emoji: '🌿', label: 'いきものの ふしぎ', desc: 'どうぶつ・しょくぶつ・からだのひみつをさがそう', color: '#DBF6F0', rot: '-1deg',  accent: '#4ECDC4' },
  { key: '地学', emoji: '🌤',  label: 'だいちと そら',     desc: 'てんき・ちそう・ほしのうごきをしらべよう',   color: '#E0F0FF', rot: '0.9deg',  accent: '#60a5fa' },
  { key: '化学', emoji: '🧪',  label: 'ものの へんしん',   desc: 'みずのへんか・とかす・もやすのひみつ',       color: '#FFF1E6', rot: '-1.3deg', accent: '#f59e0b' },
  { key: '物理', emoji: '⚡',  label: 'ちからと かがやき', desc: 'ちから・ひかり・でんきのふしぎをとこう',     color: '#EFE8FF', rot: '1.1deg',  accent: '#8b5cf6' },
] as const

type DomainProgress = { mastered: number; total: number }

function readProgress(): Record<string, DomainProgress> {
  try {
    const store = JSON.parse(
      localStorage.getItem(getDataKey(STORAGE_KEYS.SCIENCE_SRS)) || '{}'
    ) as Record<string, { b: number }>
    const out: Record<string, DomainProgress> = {}
    for (const d of ['生物', '地学', '化学', '物理'] as const) {
      const pool = SCIENCE_QUESTIONS.filter(q => q.domain === d)
      out[d] = { mastered: pool.filter(q => store[q.id]?.b === 2).length, total: pool.length }
    }
    return out
  } catch { return {} }
}

export default function ScienceDomains() {
  const [progress, setProgress] = useState<Record<string, DomainProgress>>({})

  useEffect(() => { setProgress(readProgress()) }, [])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
      {DOMAINS.map((d) => {
        const p = progress[d.key]
        const pct = p && p.total > 0 ? Math.round(p.mastered / p.total * 100) : 0
        const hasStarted = p && p.mastered > 0

        return (
          <Link
            key={d.key}
            href="/apps/science"
            className="card-sticker"
            style={{
              background: d.color,
              borderRadius: 'var(--radius-card)',
              padding: '1.5rem',
              textDecoration: 'none',
              color: 'var(--ink)',
              display: 'block',
              transform: `rotate(${d.rot})`,
            }}
          >
            <div style={{ fontSize: 44, marginBottom: '0.5rem' }}>{d.emoji}</div>
            <h3 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 17, color: 'var(--ink)', margin: '0 0 0.4rem', lineHeight: 1.3 }}>
              {d.label}
            </h3>
            <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.65, margin: '0 0 0.85rem' }}>{d.desc}</p>

            {p ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 4 }}>
                  <span>{hasStarted ? `⭐ おぼえた ${p.mastered}もん` : 'まだやっていないよ'}</span>
                  <span>{p.total}もん</span>
                </div>
                <div style={{ height: 7, borderRadius: 9999, background: 'rgba(58,46,42,0.12)', overflow: 'hidden', border: '1.5px solid rgba(58,46,42,0.25)' }}>
                  <div style={{ height: '100%', borderRadius: 9999, background: d.accent, width: `${pct}%`, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ) : (
              <div style={{ height: 7, borderRadius: 9999, background: 'rgba(58,46,42,0.08)', border: '1.5px solid rgba(58,46,42,0.15)' }} />
            )}
          </Link>
        )
      })}
    </div>
  )
}
