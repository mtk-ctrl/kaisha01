'use client'

// 中学受験ハブ — 4教科の単元全体像と進捗が一目で見えるページ（Phase A: 構造改革）
// 凝った地図UIは Phase C。ここでは「全体像が見える・今日やることに迷わない」を最優先。

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { JUKU_UNITS } from '@/data/jukuData'
import { useStats } from '@/hooks/useStats'
import { getDataKey } from '@/lib/storage'

const INK = '#3A2E2A'
const SOFT = '#6B5A52'
const MUTE = '#B0A49C'

const JUKU_PROGRESS_KEY = 'tanq_juku_progress_v1'
type JukuProgress = Record<string, { cleared: number; total: number }>

function loadJukuProgress(): JukuProgress {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(getDataKey(JUKU_PROGRESS_KEY)) || '{}') } catch { return {} }
}

// 歴史〈旧石器〜平安〉のクリア済みレベル数（/apps/rekishi のセーブから読む）
const REKISHI_KEY = 'tanq_rekishi_v1'
function loadRekishiCleared(): number {
  if (typeof window === 'undefined') return 0
  try {
    const raw = JSON.parse(localStorage.getItem(getDataKey(REKISHI_KEY)) || '{}')
    return Object.values(raw.levelStars ?? {}).filter(v => Number(v) >= 1).length
  } catch { return 0 }
}

// ─── 教科メタ ───────────────────────────────────────────
const SUBJECTS = [
  { id: 'sansuu', emoji: '🧮', name: '算数', color: '#C99700', bg: '#FFF1B8' },
  { id: 'kokugo', emoji: '📖', name: '国語', color: '#7C5CD6', bg: '#EFE8FF' },
  { id: 'rika',   emoji: '🔬', name: '理科', color: '#2BA39A', bg: '#DBF6F0' },
  { id: 'shakai', emoji: '🗾', name: '社会', color: '#E0527E', bg: '#FFE3EE' },
] as const

// 近日公開の単元（正直に「近日公開」と表示する。実装済みに見せない）
// 速さ系（旅人算・流水算・仕事算）は JUKU_UNITS 側の未公開単元として自動表示されるため、ここには含めない
const SANSUU_SOON = ['平面図形', '数の性質', '場合の数', '規則性']
const KOKUGO_SOON = ['文法・敬語', '読解 ステップ3（短文読解）']
const RIKA_SOON = ['てこ・ばね（計算）', '電気回路（計算）', '水溶液（計算）']
const SHAKAI_SOON = ['歴史〈鎌倉〜現代〉', '公民・時事']

// ─── 小さな部品 ─────────────────────────────────────────
function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-black mt-4 mb-2 flex items-center gap-1.5" style={{ color: SOFT }}>
      {children}
    </p>
  )
}

function UnitRow({ href, emoji, title, sub, done, total, color, tag }: {
  href: string; emoji: string; title: string; sub?: string
  done?: number; total?: number; color: string; tag?: string
}) {
  const hasProgress = typeof done === 'number' && typeof total === 'number' && total > 0
  const pct = hasProgress ? Math.round((done! / total!) * 100) : 0
  const allDone = hasProgress && done! >= total!
  return (
    <Link href={href}
      className="block rounded-[18px] px-3.5 py-3 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
      style={{
        background: allDone ? '#DBF6F0' : '#FFFFFF',
        border: `2.5px solid ${INK}`, boxShadow: `3px 3px 0 0 ${INK}`,
        textDecoration: 'none',
      }}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{ background: '#FFF6E5', border: `2px solid ${INK}` }}>
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-black text-[13px] leading-tight flex items-center gap-1.5 flex-wrap" style={{ color: INK }}>
            {title}
            {tag && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-black shrink-0"
                style={{ background: '#FDE68A', border: '1px solid #F59E0B', color: '#92400E' }}>
                {tag}
              </span>
            )}
          </div>
          {sub && <div className="text-[10px] font-bold mt-0.5" style={{ color: SOFT }}>{sub}</div>}
        </div>
        {hasProgress ? (
          <div className="text-right shrink-0">
            <div className="text-[11px] font-black" style={{ color: allDone ? '#2BA39A' : color }}>
              {allDone ? '✓ クリア' : `${pct}%`}
            </div>
            <div className="text-[9px] font-bold" style={{ color: SOFT }}>{done}/{total}</div>
          </div>
        ) : (
          <span className="text-[11px] font-black shrink-0" style={{ color: SOFT }}>とりくむ →</span>
        )}
      </div>
      {hasProgress && (
        <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(58,46,42,0.12)' }}>
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: allDone ? '#2BA39A' : color }} />
        </div>
      )}
    </Link>
  )
}

function SoonRow({ title }: { title: string }) {
  return (
    <div className="rounded-[18px] px-3.5 py-3 flex items-center gap-3"
      style={{ background: '#F0EDE8', border: '2px dashed #C4B8AE' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 grayscale opacity-60"
        style={{ background: '#FFFFFF', border: '2px solid #C4B8AE' }}>
        🔭
      </div>
      <div className="flex-1 font-black text-[13px]" style={{ color: MUTE }}>{title}</div>
      <span className="text-[9px] px-2 py-0.5 rounded-full font-black shrink-0"
        style={{ background: '#C4B8AE', color: '#FFFFFF' }}>
        近日公開
      </span>
    </div>
  )
}

function SubjectHead({ emoji, name, sub, color, bg }: {
  emoji: string; name: string; sub: string; color: string; bg: string
}) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0"
        style={{ background: bg, border: `3px solid ${INK}`, boxShadow: `2px 2px 0 0 ${INK}`, transform: 'rotate(-3deg)' }}>
        {emoji}
      </div>
      <div>
        <h2 className="font-black text-xl leading-tight" style={{ color: INK, fontFamily: 'var(--font-zen)' }}>{name}</h2>
        <p className="text-[11px] font-bold" style={{ color }}>{sub}</p>
      </div>
    </div>
  )
}

// ─── ページ本体 ─────────────────────────────────────────
export default function JukenHubPage() {
  const { stats } = useStats()
  const [jukuProgress, setJukuProgress] = useState<JukuProgress>({})
  const [rekishiCleared, setRekishiCleared] = useState(0)

  useEffect(() => {
    setJukuProgress(loadJukuProgress())
    setRekishiCleared(loadRekishiCleared())
  }, [])

  // 公開済みの特殊算単元（問題が入っているもののみ。過大表示しない）
  const jukuLiveUnits = JUKU_UNITS.filter(u => u.problems.length > 0)
  const jukuSoonTitles = JUKU_UNITS.filter(u => u.problems.length === 0).map(u => u.title)
  const sansuuSoon = [...jukuSoonTitles, ...SANSUU_SOON]

  // 公開中・近日公開の単元数（ページ内のカード数から動的に算出）
  const liveCount = jukuLiveUnits.length + 3 /* 基礎たいりょく */ + 5 /* 国語（読解ためしてみる版含む） */ + 1 /* 理科 */ + 2 /* 社会 */
  const soonCount = sansuuSoon.length + KOKUGO_SOON.length + RIKA_SOON.length + SHAKAI_SOON.length

  return (
    <div className="min-h-screen pb-16 font-sans"
      style={{
        background: '#FFF6E5',
        backgroundImage: 'radial-gradient(circle, rgba(58,46,42,0.06) 1px, transparent 1.5px)',
        backgroundSize: '22px 22px',
        color: INK,
      }}>
      <div className="max-w-md mx-auto px-4">

        {/* ヘッダー */}
        <div className="pt-6 pb-2">
          <Link href="/lab" className="inline-flex items-center gap-1 text-sm font-bold mb-4" style={{ color: SOFT }}>
            ← ラボにもどる
          </Link>
          <div className="rounded-[26px] p-5"
            style={{ background: '#FFFFFF', border: `3px solid ${INK}`, boxShadow: `6px 6px 0 0 ${INK}` }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">🎓</span>
              <div>
                <h1 className="font-black text-2xl leading-tight" style={{ color: INK, fontFamily: 'var(--font-zen)' }}>
                  TANQ 中学受験
                </h1>
                <p className="text-xs font-bold mt-0.5" style={{ color: SOFT }}>
                  小4〜小6｜算数・国語・理科・社会
                </p>
              </div>
            </div>
            <p className="text-xs font-bold leading-relaxed mb-3" style={{ color: SOFT }}>
              4教科を単元ごとに攻略。塾の予習・復習にも、これからの本格対策にも。
            </p>
            <div className="flex gap-2">
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full"
                style={{ background: '#DBF6F0', border: `2px solid ${INK}`, color: '#2BA39A' }}>
                公開中 {liveCount}単元
              </span>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full"
                style={{ background: '#F0EDE8', border: '2px solid #C4B8AE', color: MUTE }}>
                近日公開 {soonCount}単元
              </span>
            </div>
          </div>
        </div>

        {/* 教科ナビ */}
        <div className="grid grid-cols-4 gap-2 py-3 sticky top-0 z-30"
          style={{ background: 'rgba(255,246,229,0.95)', backdropFilter: 'blur(8px)' }}>
          {SUBJECTS.map(s => (
            <a key={s.id} href={`#${s.id}`}
              className="rounded-2xl py-2 text-center transition-all hover:-translate-y-0.5"
              style={{ background: s.bg, border: `2.5px solid ${INK}`, boxShadow: `2px 2px 0 0 ${INK}`, textDecoration: 'none' }}>
              <div className="text-lg leading-none">{s.emoji}</div>
              <div className="text-[11px] font-black mt-1" style={{ color: INK }}>{s.name}</div>
            </a>
          ))}
        </div>

        {/* ── 算数 ── */}
        <section id="sansuu" className="mt-5" style={{ scrollMarginTop: 84 }}>
          <SubjectHead emoji="🧮" name="算数" color="#C99700" bg="#FFF1B8"
            sub={`特殊算 ${jukuLiveUnits.length}単元 公開中・図で考える`} />

          <GroupLabel>📐 特殊算（文章題の核）</GroupLabel>
          <div className="space-y-2">
            {jukuLiveUnits.map(u => {
              const p = jukuProgress[u.id]
              return (
                <UnitRow key={u.id} href={`/apps/juku/${u.id}`} emoji={u.emoji}
                  title={u.title} sub={u.titleKana}
                  done={p?.cleared ?? 0} total={u.problems.length} color="#C99700" />
              )
            })}
            <Link href="/apps/juku"
              className="block rounded-[18px] px-3.5 py-3 text-center font-black text-[12px] transition-all hover:-translate-y-0.5"
              style={{ background: '#FFF1B8', border: `2.5px solid ${INK}`, boxShadow: `3px 3px 0 0 ${INK}`, color: INK, textDecoration: 'none' }}>
              単元マップ全体を見る →
            </Link>
          </div>

          <GroupLabel>💪 基礎たいりょく（毎日の計算・数の感覚）</GroupLabel>
          <div className="space-y-2">
            <UnitRow href="/apps/bunsuu" emoji="🍕" title="分数" sub="図で理解" color="#C99700" />
            <UnitRow href="/apps/koubai" emoji="🔢" title="こうばいすう・こうやくすう" sub="素因数分解あり" color="#C99700" />
            <UnitRow href="/apps/math" emoji="⚡" title="計算チャレンジ" sub="タイムアタック" color="#C99700" />
          </div>

          <GroupLabel>🔭 これから公開される単元</GroupLabel>
          <div className="space-y-2">
            {sansuuSoon.map(t => <SoonRow key={t} title={t} />)}
          </div>
        </section>

        {/* ── 国語 ── */}
        <section id="kokugo" className="mt-8" style={{ scrollMarginTop: 84 }}>
          <SubjectHead emoji="📖" name="国語" color="#7C5CD6" bg="#EFE8FF"
            sub="ことば・漢字 公開中／読解は ためしてみる版" />

          <GroupLabel>🗣️ ことば（語彙・慣用句・四字熟語）</GroupLabel>
          <div className="space-y-2">
            <UnitRow href="/apps/kokugo" emoji="📖" title="語彙" sub="受験頻出のことば・20レベル"
              done={stats?.kokugoCleared} total={stats?.kokugoTotal} color="#7C5CD6" />
            <UnitRow href="/apps/kanyo" emoji="🗣️" title="慣用句" sub="体・動物・色など・20レベル"
              done={stats?.kanyoCleared} total={stats?.kanyoTotal} color="#7C5CD6" />
            <UnitRow href="/apps/yoji" emoji="📝" title="四字熟語" sub="故事・受験頻出・20レベル"
              done={stats?.yojiCleared} total={stats?.yojiTotal} color="#7C5CD6" />
          </div>

          <GroupLabel>✏️ 漢字</GroupLabel>
          <div className="space-y-2">
            <UnitRow href="/apps/kanji" emoji="📖" title="漢字マスター" sub="小1〜小6の配当漢字・くり返しで定着"
              done={stats?.kanjiMastered} total={stats?.kanjiTotal} color="#7C5CD6" />
          </div>

          <GroupLabel>📚 読解（AI生成オリジナル文）</GroupLabel>
          <div className="space-y-2">
            <UnitRow href="/apps/dokkai" emoji="📚" title="読解〈3文・だんらく〉" sub="オリジナル文22問・根きょの文をさがす練習"
              color="#7C5CD6" tag="ためしてみる版" />
          </div>

          <GroupLabel>🔭 これから公開される単元</GroupLabel>
          <div className="space-y-2">
            {KOKUGO_SOON.map(t => <SoonRow key={t} title={t} />)}
          </div>
        </section>

        {/* ── 理科 ── */}
        <section id="rika" className="mt-8" style={{ scrollMarginTop: 84 }}>
          <SubjectHead emoji="🔬" name="理科" color="#2BA39A" bg="#DBF6F0"
            sub="知識4領域 公開中／計算分野は近日公開" />

          <GroupLabel>🧪 知識分野</GroupLabel>
          <div className="space-y-2">
            <UnitRow href="/apps/science" emoji="⚗️" title="中学受験 理科" sub="生物・地学・化学・物理の4領域"
              done={stats?.scienceMastered} total={stats?.scienceTotal} color="#2BA39A" />
          </div>

          <GroupLabel>🔭 これから公開される単元（計算分野）</GroupLabel>
          <div className="space-y-2">
            {RIKA_SOON.map(t => <SoonRow key={t} title={t} />)}
          </div>
        </section>

        {/* ── 社会 ── */}
        <section id="shakai" className="mt-8" style={{ scrollMarginTop: 84 }}>
          <SubjectHead emoji="🗾" name="社会" color="#E0527E" bg="#FFE3EE"
            sub="地理・歴史〈旧石器〜平安〉公開中／公民は近日公開" />

          <GroupLabel>🗺️ 地理</GroupLabel>
          <div className="space-y-2">
            <UnitRow href="/apps/todofuken" emoji="🗾" title="都道府県マスター" sub="47都道府県・かたち・名物・県庁所在地" color="#E0527E" />
          </div>

          <GroupLabel>📜 歴史（通史）</GroupLabel>
          <div className="space-y-2">
            <UnitRow href="/apps/rekishi" emoji="🏛️" title="歴史〈旧石器〜平安〉" sub="通史前半・76問・年代ならべかえ"
              done={rekishiCleared} total={6} color="#E0527E" />
          </div>

          <GroupLabel>🔭 これから公開される単元</GroupLabel>
          <div className="space-y-2">
            {SHAKAI_SOON.map(t => <SoonRow key={t} title={t} />)}
          </div>
        </section>

        {/* フッターノート */}
        <p className="text-center text-[10px] font-bold mt-10" style={{ color: MUTE }}>
          近日公開の単元は、準備ができたものから順に追加していきます
        </p>
      </div>
    </div>
  )
}
