'use client'

// 相棒育成画面（Phase C-1）
// 初訪問: キャラ選択（4種・性別を固定しないテーマ色）→ 名前入力（スキップ可）
// 以降: 育成画面（ごはん・きせかえ・なまえ変更）

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { loadCoins, type CoinState } from '@/lib/coins'
import {
  BUDDY_CHARACTERS,
  BUDDY_ACCESSORIES,
  BUDDY_STAGES,
  FEED_COST,
  FEED_LIMIT_PER_DAY,
  type BuddyState,
  type BuddyType,
  loadBuddy,
  saveBuddy,
  createBuddy,
  getCharacter,
  getBuddyXp,
  getStage,
  getNextStage,
  buddyEmoji,
  feedsLeftToday,
  feedBuddy,
  buyAccessory,
  equipAccessory,
} from '@/lib/buddy'

const INK = '#3A2E2A'
const SUB = '#6B5A52'
const PAPER = '#FFF6E5'

const STAGE_SIZE: Record<number, string> = {
  1: 'text-6xl',
  2: 'text-7xl',
  3: 'text-8xl',
  4: 'text-8xl',
  5: 'text-9xl',
}

function CoinChip({ balance }: { balance: number }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-black text-sm"
      style={{ background: '#FFF1B8', border: '2.5px solid #3A2E2A', color: '#C99700' }}>
      🪙 {balance}
    </span>
  )
}

// ─────────────────────────────────────────
// オンボーディング: キャラ選択 → 名前入力
// ─────────────────────────────────────────
function Onboarding({ onCreate }: { onCreate: (b: BuddyState) => void }) {
  const [selected, setSelected] = useState<BuddyType | null>(null)
  const [name, setName] = useState('')

  if (selected === null) {
    return (
      <div className="px-4 pt-6 pb-10">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🥚</div>
          <h1 className="font-black text-2xl" style={{ color: INK, fontFamily: 'var(--font-zen)' }}>あいぼうを えらぼう！</h1>
          <p className="text-xs font-bold mt-2" style={{ color: SUB }}>べんきょうすると コインがもらえて、あいぼうが そだつよ</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {BUDDY_CHARACTERS.map((c) => (
            <button key={c.type} onClick={() => setSelected(c.type)}
              className="rounded-[22px] p-5 text-center transition-all hover:-translate-y-1 active:translate-y-0"
              style={{ background: c.bg, border: '3px solid #3A2E2A', boxShadow: '4px 4px 0 0 #3A2E2A' }}>
              <div className="text-6xl mb-2">{c.emoji}</div>
              <div className="font-black text-lg" style={{ color: INK, fontFamily: 'var(--font-zen)' }}>{c.label}</div>
            </button>
          ))}
        </div>
        <p className="text-center text-[11px] font-bold mt-5" style={{ color: SUB }}>どれをえらんでも つよさはおなじ。すきなこで OK！</p>
      </div>
    )
  }

  const c = getCharacter(selected)
  return (
    <div className="px-4 pt-6 pb-10">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-28 h-28 rounded-full text-6xl mb-3"
          style={{ background: c.bg, border: '3px solid #3A2E2A', boxShadow: '4px 4px 0 0 #3A2E2A' }}>
          {c.emoji}
        </div>
        <h1 className="font-black text-xl" style={{ color: INK, fontFamily: 'var(--font-zen)' }}>なまえを つけよう</h1>
        <p className="text-xs font-bold mt-1" style={{ color: SUB }}>あとから かえられるよ</p>
      </div>
      <div className="rounded-[22px] p-5" style={{ background: '#FFFFFF', border: '3px solid #3A2E2A', boxShadow: '4px 4px 0 0 #3A2E2A' }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 10))}
          placeholder={c.defaultName}
          className="w-full rounded-2xl px-4 py-3 font-black text-lg text-center outline-none"
          style={{ border: '3px solid #3A2E2A', color: INK, background: PAPER }}
        />
        <button onClick={() => onCreate(createBuddy(selected, name || c.defaultName))}
          className="w-full mt-4 py-3 rounded-2xl font-black text-base transition-all hover:-translate-y-0.5 active:translate-y-0"
          style={{ background: c.color, border: '3px solid #3A2E2A', boxShadow: '3px 3px 0 0 #3A2E2A', color: '#FFFFFF' }}>
          ✨ けってい！
        </button>
        <button onClick={() => onCreate(createBuddy(selected, c.defaultName))}
          className="w-full mt-2 py-2 rounded-2xl font-bold text-xs" style={{ color: SUB }}>
          スキップ（「{c.defaultName}」になるよ）
        </button>
      </div>
      <button onClick={() => setSelected(null)} className="block mx-auto mt-4 text-xs font-bold hover:underline" style={{ color: SUB }}>
        ← べつのこに する
      </button>
    </div>
  )
}

// ─────────────────────────────────────────
// 育成画面
// ─────────────────────────────────────────
function BuddyHome({ buddy, setBuddy, coins, refreshCoins }: {
  buddy: BuddyState
  setBuddy: (b: BuddyState) => void
  coins: CoinState
  refreshCoins: () => void
}) {
  const [hearts, setHearts] = useState(0) // ごはん演出のトリガー（連番）
  const [message, setMessage] = useState<string | null>(null)
  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState(buddy.name)

  const c = getCharacter(buddy.type)
  const xp = getBuddyXp(buddy)
  const stage = getStage(xp)
  const next = getNextStage(xp)
  const left = feedsLeftToday(buddy)
  const pct = next
    ? Math.min(100, Math.round(((xp - stage.minXp) / (next.minXp - stage.minXp)) * 100))
    : 100
  const equipped = BUDDY_ACCESSORIES.find((a) => a.id === buddy.equipped)

  function flash(msg: string) {
    setMessage(msg)
    setTimeout(() => setMessage(null), 2200)
  }

  function handleFeed() {
    const r = feedBuddy(buddy)
    if (r.ok) {
      setBuddy(r.buddy)
      refreshCoins()
      setHearts((h) => h + 1)
      flash(`${buddy.name} は よろこんでいる！ ❤️ XP +5`)
    } else if (r.reason === 'limit') {
      flash('きょうの ごはんは おしまい。また あした！')
    } else {
      flash('コインが たりないよ。べんきょうして あつめよう！')
    }
  }

  function handleBuy(id: string) {
    const r = buyAccessory(buddy, id)
    if (r.ok) {
      setBuddy(r.buddy)
      refreshCoins()
      flash('かったよ！ にあってる！ ✨')
    } else if (r.reason === 'coins') {
      flash('コインが たりないよ。べんきょうして あつめよう！')
    }
  }

  return (
    <div className="px-4 pt-4 pb-10">
      {/* 相棒カード */}
      <div className="rounded-[26px] p-6 text-center relative overflow-hidden"
        style={{ background: c.bg, border: '3px solid #3A2E2A', boxShadow: '6px 6px 0 0 #3A2E2A' }}>
        {/* マスター期だけ控えめなキラキラ背景 */}
        {stage.level === 5 && (
          <div className="absolute inset-0 pointer-events-none text-xl" aria-hidden>
            <span className="absolute top-3 left-5">✨</span>
            <span className="absolute top-8 right-6">✨</span>
            <span className="absolute bottom-6 left-10">⭐</span>
          </div>
        )}
        <div className="relative inline-block">
          <div className={`${STAGE_SIZE[stage.level]} leading-none select-none`}>{buddyEmoji(buddy, stage)}</div>
          {equipped && stage.level > 1 && (
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl select-none">{equipped.emoji}</span>
          )}
          {/* ハート演出（3つだけ・ふわっと消える） */}
          {hearts > 0 && (
            <div key={hearts} className="absolute inset-x-0 -top-2 pointer-events-none" aria-hidden>
              <span className="heart" style={{ left: '10%', animationDelay: '0s' }}>❤️</span>
              <span className="heart" style={{ left: '45%', animationDelay: '0.15s' }}>💖</span>
              <span className="heart" style={{ left: '75%', animationDelay: '0.3s' }}>❤️</span>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-center gap-2">
          <h2 className="font-black text-2xl" style={{ color: INK, fontFamily: 'var(--font-zen)' }}>{buddy.name}</h2>
          <button onClick={() => { setNameDraft(buddy.name); setEditingName(true) }}
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: '#FFFFFF', border: '2px solid #3A2E2A', color: SUB }}>
            ✏️ なまえ
          </button>
        </div>
        <div className="mt-1 inline-flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-black" style={{ background: '#FFFFFF', border: '2.5px solid #3A2E2A', color: c.color }}>
            Lv.{stage.level} {stage.label}
          </span>
        </div>

        {/* XPバー */}
        <div className="mt-4 px-2">
          <div className="flex justify-between text-[10px] font-bold mb-1" style={{ color: SUB }}>
            <span>XP {xp}</span>
            <span>{next ? `つぎ: ${next.label}まで あと${next.minXp - xp}` : 'さいだいまで そだったよ！'}</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(58,46,42,0.15)', border: '2px solid #3A2E2A' }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: c.color }} />
          </div>
        </div>
      </div>

      {/* メッセージ */}
      {message && (
        <div className="mt-3 rounded-2xl px-4 py-2 text-center font-black text-sm"
          style={{ background: '#FFFFFF', border: '2.5px solid #3A2E2A', color: INK }}>
          {message}
        </div>
      )}

      {/* ごはん */}
      <div className="mt-4 rounded-[22px] p-4" style={{ background: '#FFFFFF', border: '3px solid #3A2E2A', boxShadow: '4px 4px 0 0 #3A2E2A' }}>
        <button onClick={handleFeed} disabled={left <= 0 || coins.balance < FEED_COST}
          className="w-full py-3 rounded-2xl font-black text-lg transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
          style={{ background: '#FFC83D', border: '3px solid #3A2E2A', boxShadow: '3px 3px 0 0 #3A2E2A', color: INK }}>
          🍖 ごはんを あげる（🪙{FEED_COST}）
        </button>
        <div className="mt-2 flex items-center justify-center gap-2 text-xs font-bold" style={{ color: SUB }}>
          <span>きょうは あと</span>
          {Array.from({ length: FEED_LIMIT_PER_DAY }).map((_, i) => (
            <span key={i} className="text-base">{i < left ? '🍖' : '⚪'}</span>
          ))}
          {left <= 0 && <span>— また あした！</span>}
        </div>
        {left > 0 && coins.balance < FEED_COST && (
          <p className="mt-1 text-center text-[11px] font-bold" style={{ color: SUB }}>
            コインが たりないよ。<Link href="/lab" className="underline" style={{ color: c.color }}>べんきょうして あつめよう →</Link>
          </p>
        )}
      </div>

      {/* きせかえ */}
      <div className="mt-4 rounded-[22px] p-4" style={{ background: '#FFFFFF', border: '3px solid #3A2E2A', boxShadow: '4px 4px 0 0 #3A2E2A' }}>
        <h3 className="font-black text-base mb-3" style={{ color: INK, fontFamily: 'var(--font-zen)' }}>🎩 きせかえ</h3>
        <div className="grid grid-cols-2 gap-3">
          {BUDDY_ACCESSORIES.map((a) => {
            const isOwned = buddy.owned.includes(a.id)
            const isEquipped = buddy.equipped === a.id
            return (
              <div key={a.id} className="rounded-2xl p-3 text-center"
                style={{ background: isEquipped ? c.bg : PAPER, border: '2.5px solid #3A2E2A' }}>
                <div className="text-3xl mb-1">{a.emoji}</div>
                <div className="font-black text-xs mb-2" style={{ color: INK }}>{a.label}</div>
                {isOwned ? (
                  <button onClick={() => setBuddy(equipAccessory(buddy, isEquipped ? null : a.id))}
                    className="w-full py-1.5 rounded-xl text-xs font-black transition-all"
                    style={{
                      background: isEquipped ? c.color : '#FFFFFF',
                      border: '2px solid #3A2E2A',
                      color: isEquipped ? '#FFFFFF' : INK,
                    }}>
                    {isEquipped ? '✓ つけてる' : 'つける'}
                  </button>
                ) : (
                  <button onClick={() => handleBuy(a.id)} disabled={coins.balance < a.price}
                    className="w-full py-1.5 rounded-xl text-xs font-black disabled:opacity-50"
                    style={{ background: '#FFF1B8', border: '2px solid #3A2E2A', color: '#C99700' }}>
                    🪙{a.price} でかう
                  </button>
                )}
              </div>
            )
          })}
        </div>
        <p className="mt-3 text-[10px] font-bold text-center" style={{ color: SUB }}>
          コインは べんきょうすると もらえるよ（1もん せいかい = 🪙1）
        </p>
      </div>

      {/* なまえ変更モーダル */}
      {editingName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: 'rgba(58,46,42,0.5)' }}>
          <div className="w-full max-w-sm rounded-[22px] p-5" style={{ background: '#FFFFFF', border: '3px solid #3A2E2A', boxShadow: '6px 6px 0 0 #3A2E2A' }}>
            <h3 className="font-black text-base mb-3 text-center" style={{ color: INK }}>なまえを かえる</h3>
            <input
              type="text"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value.slice(0, 10))}
              className="w-full rounded-2xl px-4 py-3 font-black text-lg text-center outline-none"
              style={{ border: '3px solid #3A2E2A', color: INK, background: PAPER }}
            />
            <div className="flex gap-2 mt-4">
              <button onClick={() => setEditingName(false)}
                className="flex-1 py-2.5 rounded-2xl font-black text-sm"
                style={{ background: PAPER, border: '2.5px solid #3A2E2A', color: SUB }}>
                やめる
              </button>
              <button onClick={() => {
                const next = { ...buddy, name: nameDraft.trim().slice(0, 10) || c.defaultName }
                saveBuddy(next); setBuddy(next); setEditingName(false)
              }}
                className="flex-1 py-2.5 rounded-2xl font-black text-sm"
                style={{ background: c.color, border: '2.5px solid #3A2E2A', boxShadow: '2px 2px 0 0 #3A2E2A', color: '#FFFFFF' }}>
                けってい
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .heart {
          position: absolute;
          font-size: 22px;
          opacity: 0;
          animation: floatHeart 1.4s ease-out forwards;
        }
        @keyframes floatHeart {
          0% { opacity: 0; transform: translateY(0) scale(0.6); }
          20% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-60px) scale(1.2); }
        }
      `}</style>
    </div>
  )
}

// ─────────────────────────────────────────
// エントリポイント
// ─────────────────────────────────────────
export default function BuddyPage() {
  const [ready, setReady] = useState(false)
  const [buddy, setBuddy] = useState<BuddyState | null>(null)
  const [coins, setCoins] = useState<CoinState>({ balance: 0, lifetime: 0, log: [] })

  useEffect(() => {
    setBuddy(loadBuddy())
    setCoins(loadCoins())
    setReady(true)
  }, [])

  return (
    <div className="min-h-screen font-sans"
      style={{
        background: PAPER,
        backgroundImage: 'radial-gradient(circle, rgba(58,46,42,0.06) 1px, transparent 1.5px)',
        backgroundSize: '22px 22px',
        color: INK,
      }}>
      <div className="min-h-screen max-w-md mx-auto relative"
        style={{ borderLeft: '1px solid rgba(58,46,42,0.08)', borderRight: '1px solid rgba(58,46,42,0.08)' }}>
        {/* Top bar */}
        <div className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between"
          style={{ background: 'rgba(255,246,229,0.95)', backdropFilter: 'blur(10px)', borderBottom: '3px solid #3A2E2A' }}>
          <Link href="/lab" className="font-black text-base hover:opacity-70 transition-opacity" style={{ color: INK, fontFamily: 'var(--font-zen)' }}>
            ← ラボ
          </Link>
          <CoinChip balance={coins.balance} />
        </div>

        {ready && (buddy
          ? <BuddyHome buddy={buddy} setBuddy={setBuddy} coins={coins} refreshCoins={() => setCoins(loadCoins())} />
          : <Onboarding onCreate={(b) => setBuddy(b)} />
        )}
      </div>
    </div>
  )
}
