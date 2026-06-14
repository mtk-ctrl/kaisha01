'use client'

// 中学受験ハブ — 4教科の単元全体像と進捗が一目で見えるページ（Phase A: 構造改革）
// 凝った地図UIは Phase C。ここでは「全体像が見える・今日やることに迷わない」を最優先。

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { JUKU_UNITS } from '@/data/jukuData'
import { RIKA_UNITS, RIKA_FIELDS, questionsOfRikaUnit } from '@/data/rikaUnits'
import { TEKO_PROBLEMS } from '@/data/rikaTekoData'
import { BANE_PROBLEMS } from '@/data/rikaBaneData'
import { CIRCUIT_PROBLEMS } from '@/data/rikaCircuitData'
import { CHUKAN_PROBLEMS } from '@/data/rikaChukanData'
import { BUOY_PROBLEMS } from '@/data/rikaBuoyData'
import { FURIKO_PROBLEMS } from '@/data/rikaFurikoData'
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

// 地理〈地形と気候〉のクリア済みレベル数（/apps/chiri のセーブから読む）
const CHIRI_KEY = 'tanq_chiri_v1'
function loadChiriCleared(): number {
  if (typeof window === 'undefined') return 0
  try {
    const raw = JSON.parse(localStorage.getItem(getDataKey(CHIRI_KEY)) || '{}')
    return Object.values(raw.levelStars ?? {}).filter(v => Number(v) >= 1).length
  } catch { return 0 }
}

// 理科の進捗: 知識演習は science の SRS（おぼえた=b2）、てこ計算は rika-teko のクリア数
const SCIENCE_SRS_KEY = 'tanq_science_srs_v1'
function loadScienceMasteredIds(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = JSON.parse(localStorage.getItem(getDataKey(SCIENCE_SRS_KEY)) || '{}') as Record<string, { b?: number }>
    return new Set(Object.keys(raw).filter(id => raw[id]?.b === 2))
  } catch { return new Set() }
}
const RIKA_TEKO_KEY = 'tanq_rika_teko_progress_v1'
function loadTekoCleared(): number {
  if (typeof window === 'undefined') return 0
  try {
    const raw = JSON.parse(localStorage.getItem(getDataKey(RIKA_TEKO_KEY)) || '{}')
    return Array.isArray(raw.solvedIds) ? raw.solvedIds.length : 0
  } catch { return 0 }
}
const RIKA_BANE_KEY = 'tanq_rika_bane_progress_v1'
function loadBaneCleared(): number {
  if (typeof window === 'undefined') return 0
  try {
    const raw = JSON.parse(localStorage.getItem(getDataKey(RIKA_BANE_KEY)) || '{}')
    return Array.isArray(raw.solvedIds) ? raw.solvedIds.length : 0
  } catch { return 0 }
}
const RIKA_CIRCUIT_KEY = 'tanq_rika_circuit_progress_v1'
function loadCircuitCleared(): number {
  if (typeof window === 'undefined') return 0
  try {
    const raw = JSON.parse(localStorage.getItem(getDataKey(RIKA_CIRCUIT_KEY)) || '{}')
    return Array.isArray(raw.solvedIds) ? raw.solvedIds.length : 0
  } catch { return 0 }
}
const RIKA_CHUKAN_KEY = 'tanq_rika_chukan_progress_v1'
function loadChukanCleared(): number {
  if (typeof window === 'undefined') return 0
  try {
    const raw = JSON.parse(localStorage.getItem(getDataKey(RIKA_CHUKAN_KEY)) || '{}')
    return Array.isArray(raw.solvedIds) ? raw.solvedIds.length : 0
  } catch { return 0 }
}
const RIKA_BUOY_KEY = 'tanq_rika_buoy_progress_v1'
function loadBuoyCleared(): number {
  if (typeof window === 'undefined') return 0
  try {
    const raw = JSON.parse(localStorage.getItem(getDataKey(RIKA_BUOY_KEY)) || '{}')
    return Array.isArray(raw.solvedIds) ? raw.solvedIds.length : 0
  } catch { return 0 }
}
const RIKA_FURIKO_KEY = 'tanq_rika_furiko_progress_v1'
function loadFurikoCleared(): number {
  if (typeof window === 'undefined') return 0
  try {
    const raw = JSON.parse(localStorage.getItem(getDataKey(RIKA_FURIKO_KEY)) || '{}')
    return Array.isArray(raw.solvedIds) ? raw.solvedIds.length : 0
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
const KOKUGO_SOON = ['文法・敬語']
// 理科は全21単元の知識演習を公開済み。計算・図解演習（まなぶ＋とく）の追加待ちを正直に表示
const RIKA_SOON: string[] = []
const SHAKAI_SOON = ['地理〈農業・水産業〉', '地理〈工業・貿易〉', '地理〈地形図の読み方〉', '歴史〈安土桃山〜現代〉', '公民・時事']

const RIKA_FIELD_META: Record<string, { emoji: string; label: string }> = {
  '生物': { emoji: '🌿', label: '生物' },
  '地学': { emoji: '🌍', label: '地学' },
  '物理': { emoji: '⚡', label: '物理' },
  '化学': { emoji: '⚗️', label: '化学' },
}

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
  const [chiriCleared, setChiriCleared] = useState(0)
  const [scienceMastered, setScienceMastered] = useState<Set<string>>(new Set())
  const [tekoCleared, setTekoCleared] = useState(0)
  const [baneCleared, setBaneCleared] = useState(0)
  const [circuitCleared, setCircuitCleared] = useState(0)
  const [chukanCleared, setChukanCleared] = useState(0)
  const [buoyCleared, setBuoyCleared] = useState(0)
  const [furikoCleared, setFurikoCleared] = useState(0)

  useEffect(() => {
    setJukuProgress(loadJukuProgress())
    setRekishiCleared(loadRekishiCleared())
    setChiriCleared(loadChiriCleared())
    setScienceMastered(loadScienceMasteredIds())
    setTekoCleared(loadTekoCleared())
    setBaneCleared(loadBaneCleared())
    setCircuitCleared(loadCircuitCleared())
    setChukanCleared(loadChukanCleared())
    setBuoyCleared(loadBuoyCleared())
    setFurikoCleared(loadFurikoCleared())
  }, [])

  // 公開済みの特殊算単元（問題が入っているもののみ。過大表示しない）
  const jukuLiveUnits = JUKU_UNITS.filter(u => u.problems.length > 0)
  const jukuSoonTitles = JUKU_UNITS.filter(u => u.problems.length === 0).map(u => u.title)
  const sansuuSoon = [...jukuSoonTitles, ...SANSUU_SOON]

  // 理科 単元マップ: full=まなぶ＋とく / knowledge=知識演習のみ（内訳まで正直に表示する）
  const rikaFullCount = RIKA_UNITS.filter(u => u.status === 'full').length
  const rikaTotalCount = RIKA_UNITS.length

  // 公開中・近日公開の単元数（ページ内のカード数から動的に算出）
  const liveCount = jukuLiveUnits.length + 3 /* 基礎たいりょく */ + 5 /* 国語（読解ためしてみる版含む） */ + rikaTotalCount /* 理科 */ + 3 /* 社会（都道府県・歴史・地形と気候） */
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
            <UnitRow href="/apps/kokugo" emoji="📖" title="ことば" sub="受験頻出のことば・20レベル"
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
            <UnitRow href="/apps/dokkai" emoji="📚" title="読解〈3文・だんらく・短文〉" sub="ステップ1〜3・オリジナル文46問・根きょの文をさがす練習"
              color="#7C5CD6" tag="ためしてみる版" />
          </div>

          <GroupLabel>🔭 これから公開される単元</GroupLabel>
          <div className="space-y-2">
            {KOKUGO_SOON.map(t => <SoonRow key={t} title={t} />)}
          </div>
        </section>

        {/* ── 理科（単元マップ: 構造転換のひな型）── */}
        <section id="rika" className="mt-8" style={{ scrollMarginTop: 84 }}>
          <SubjectHead emoji="🔬" name="理科" color="#2BA39A" bg="#DBF6F0"
            sub={`単元マップ ${rikaTotalCount}/${rikaTotalCount}単元 公開中（まなぶ＋とく ${rikaFullCount}・知識演習 ${rikaTotalCount - rikaFullCount}）`} />

          {RIKA_FIELDS.map(field => {
            const meta = RIKA_FIELD_META[field]
            const units = RIKA_UNITS.filter(u => u.field === field)
            return (
              <React.Fragment key={field}>
                <GroupLabel>{meta.emoji} {meta.label}</GroupLabel>
                <div className="space-y-2">
                  {units.map(unit => {
                    if (unit.status === 'full') {
                      // まなぶ（図解導入）＋とく（計算演習）まで公開された単元
                      const isBane = unit.id === 'rika-phys-bane'
                      const isCircuit = unit.id === 'rika-phys-circuit-calc'
                      const isChukan = unit.id === 'rika-chem-chukan'
                      const isBuoy = unit.id === 'rika-phys-buoy-calc'
                      const isFuriko = unit.id === 'rika-phys-furiko-calc'
                      const fullDone = isFuriko ? furikoCleared : isBuoy ? buoyCleared : isChukan ? chukanCleared : isCircuit ? circuitCleared : isBane ? baneCleared : tekoCleared
                      const fullTotal = isFuriko ? FURIKO_PROBLEMS.length : isBuoy ? BUOY_PROBLEMS.length : isChukan ? CHUKAN_PROBLEMS.length : isCircuit ? CIRCUIT_PROBLEMS.length : isBane ? BANE_PROBLEMS.length : TEKO_PROBLEMS.length
                      return (
                        <UnitRow key={unit.id} href={unit.href} emoji={unit.emoji}
                          title={unit.name} sub={`図解で学んで計算でとく・演習${fullTotal}問`}
                          done={fullDone} total={fullTotal}
                          color="#2BA39A" tag="まなぶ＋とく" />
                      )
                    }
                    // 知識演習のみ公開（図解・計算は準備中であることを隠さない）
                    const pool = questionsOfRikaUnit(unit.id)
                    const mastered = pool.filter(q => scienceMastered.has(q.id)).length
                    return (
                      <UnitRow key={unit.id} href={unit.href} emoji={unit.emoji}
                        title={unit.name} sub={`知識演習 ${pool.length}問`}
                        done={mastered} total={pool.length} color="#2BA39A" />
                    )
                  })}
                </div>
              </React.Fragment>
            )
          })}

          {RIKA_SOON.length > 0 && (
            <>
              <GroupLabel>🔭 これから公開（計算・図解の演習）</GroupLabel>
              <div className="space-y-2">
                {RIKA_SOON.map(t => <SoonRow key={t} title={t} />)}
              </div>
            </>
          )}
          <p className="text-[10px] font-bold mt-2" style={{ color: MUTE }}>
            ※「まなぶ＋とく」は図解導入つきの計算演習。主要な計算分野（てこ・ばね・電気・中和・浮力・ふりこ）が公開中です
          </p>
        </section>

        {/* ── 社会 ── */}
        <section id="shakai" className="mt-8" style={{ scrollMarginTop: 84 }}>
          <SubjectHead emoji="🗾" name="社会" color="#E0527E" bg="#FFE3EE"
            sub="地理・歴史〈旧石器〜戦国〉公開中／公民は近日公開" />

          <GroupLabel>🗺️ 地理</GroupLabel>
          <div className="space-y-2">
            <UnitRow href="/apps/todofuken" emoji="🗾" title="都道府県マスター" sub="47都道府県・かたち・名物・県庁所在地" color="#E0527E" />
            <UnitRow href="/apps/chiri" emoji="🗺️" title="地形と気候" sub="国土・山地・川と平野・気候区分・防災・72問"
              done={chiriCleared} total={7} color="#0ea5e9" />
          </div>

          <GroupLabel>📜 歴史（通史）</GroupLabel>
          <div className="space-y-2">
            <UnitRow href="/apps/rekishi" emoji="🏛️" title="歴史〈旧石器〜戦国〉" sub="通史・11レベル・133問・年代ならべかえ"
              done={rekishiCleared} total={11} color="#E0527E" />
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
