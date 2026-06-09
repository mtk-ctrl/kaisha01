'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'

// ---- Math helpers ----
function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b) }
function lcm(a: number, b: number): number { return (a / gcd(a, b)) * b }
function simplify(n: number, d: number): [number, number] {
  const g = gcd(Math.abs(n), d); return [n / g, d / g]
}

// ---- SVG: Pizza ----
function PizzaSvg({ n, d, color = '#ef4444', size = 130 }: { n: number; d: number; color?: string; size?: number }) {
  const cx = size / 2, cy = size / 2, r = size * 0.44
  if (d <= 1) return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill={n > 0 ? color : '#f3f4f6'} stroke="#d1d5db" strokeWidth={1.5} />
    </svg>
  )
  return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="#f3f4f6" />
      {Array.from({ length: d }, (_, i) => {
        const a1 = (i / d) * 2 * Math.PI - Math.PI / 2
        const a2 = ((i + 1) / d) * 2 * Math.PI - Math.PI / 2
        const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1)
        const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2)
        return (
          <path key={i} d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${1/d > 0.5 ? 1 : 0},1 ${x2},${y2}Z`}
            fill={i < n ? color : '#f3f4f6'} stroke="white" strokeWidth={2} />
        )
      })}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#d1d5db" strokeWidth={1.5} />
    </svg>
  )
}

// ---- SVG: Bar ----
function BarSvg({ n, d, color = '#f59e0b', w = 220, h = 64 }: { n: number; d: number; color?: string; w?: number; h?: number }) {
  const sw = w / d
  return (
    <svg width={w} height={h}>
      <rect x={0} y={0} width={w} height={h} rx={6} fill="#f3f4f6" stroke="#d1d5db" strokeWidth={1.5} />
      {Array.from({ length: d }, (_, i) => (
        <rect key={i} x={i * sw + 2} y={2} width={sw - 4} height={h - 4} rx={3} fill={i < n ? color : 'transparent'} />
      ))}
      {Array.from({ length: d - 1 }, (_, i) => (
        <line key={i} x1={(i + 1) * sw} y1={4} x2={(i + 1) * sw} y2={h - 4} stroke="#d1d5db" strokeWidth={1.5} />
      ))}
    </svg>
  )
}

// ---- Fraction display ----
function Frac({ n, d, size = 28, color = '#1f2937' }: { n: number; d: number; size?: number; color?: string }) {
  if (d === 1) return <span style={{ fontSize: size, fontWeight: 'bold', color }}>{n}</span>
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 2, lineHeight: 1.1, color }}>
      <span style={{ fontSize: size, fontWeight: 'bold', lineHeight: 1 }}>{n}</span>
      <span style={{ display: 'block', height: 2.5, background: color, borderRadius: 1, minWidth: size * 0.9 }} />
      <span style={{ fontSize: size, fontWeight: 'bold', lineHeight: 1 }}>{d}</span>
    </span>
  )
}

// ---- Types ----
type VisType = 'pizza' | 'bar'
type Phase = 'top' | 'levelSelect' | 'countSelect' | 'quiz' | 'result'
type Feedback = 'correct' | 'wrong' | null
type CalcOp = '+' | '−' | '×' | '÷'

interface ReadQ    { kind: 'read';    n: number; d: number; vis: VisType; choices: { n: number; d: number }[]; answerIdx: number; hint: string }
interface CompareQ { kind: 'compare'; left: { n: number; d: number }; right: { n: number; d: number }; vis: VisType; answer: 'left' | 'right'; hint: string }
interface CalcQ    { kind: 'calc'; op: CalcOp; ln: number; ld: number; rn: number; rd: number; an: number; ad: number; choices: [number, number][]; hint: string; showVis: boolean }
interface YakubunQ { kind: 'yakubun'; n: number; d: number; an: number; ad: number; choices: [number, number][]; hint: string }
type Question = ReadQ | CompareQ | CalcQ | YakubunQ

// ---- Utilities ----
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }; return a
}
function ri(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }
function pick<T>(a: T[]): T { return a[Math.floor(Math.random() * a.length)] }

// ---- Choice builders ----
function buildReadChoices(n: number, d: number): { n: number; d: number }[] {
  const seen = new Set([`${n}/${d}`]); const wrong: { n: number; d: number }[] = []
  for (let w = 1; w <= d && wrong.length < 3; w++) { if (w !== n) { wrong.push({ n: w, d }); seen.add(`${w}/${d}`) } }
  const fillers = [2,3,4,6,8,12].filter(od => od !== d)
  for (const od of fillers) {
    if (wrong.length >= 3) break
    const on = ri(1, od - 1); const key = `${on}/${od}`
    if (on * d !== n * od && !seen.has(key)) { wrong.push({ n: on, d: od }); seen.add(key) }
  }
  const all = shuffle([{ n, d }, ...wrong.slice(0, 3)])
  return all
}

function buildCalcChoices(an: number, ad: number, distractors: [number, number][]): [number, number][] {
  const seen = new Set([`${an}/${ad}`, '0/1']); const wrong: [number, number][] = []
  for (const [cn, cd] of distractors) {
    if (cn <= 0 || cd <= 0) continue
    const [sn, sd] = simplify(cn, cd); if (sn <= 0) continue
    const key = `${sn}/${sd}`
    if (!seen.has(key)) { seen.add(key); wrong.push([sn, sd]) }
    if (wrong.length >= 3) break
  }
  for (let tries = 0; wrong.length < 3 && tries < 40; tries++) {
    const sn = ri(1, Math.max(an + 3, 5)), sd = ri(1, Math.max(ad + 2, 6))
    const [rn, rd] = simplify(sn, sd); const key = `${rn}/${rd}`
    if (!seen.has(key)) { seen.add(key); wrong.push([rn, rd]) }
  }
  return shuffle([[an, ad], ...wrong.slice(0, 3)])
}

// 約分専用：候補はraw値のまま保持（4/6を「約分し忘れ」として表示できる）
function buildYakubunChoices(an: number, ad: number, n: number, d: number, g: number): [number, number][] {
  const seen = new Set([`${an}/${ad}`])
  const wrong: [number, number][] = []
  const candidates: [number, number][] = [
    [n, d],           // 約分し忘れ（4/6のまま）
    [n / g, d],       // 分子だけ割った
    [n, d / g],       // 分母だけ割った
    [an + 1, ad],
    [an, ad + 1],
    [an - 1 > 0 ? an - 1 : an + 2, ad],
  ]
  for (const [cn, cd] of candidates) {
    if (!Number.isInteger(cn) || !Number.isInteger(cd)) continue
    if (cn <= 0 || cd <= 1 || cn >= cd) continue  // 真分数のみ
    const key = `${cn}/${cd}`  // raw値のまま（simpifyしない）
    if (!seen.has(key)) { seen.add(key); wrong.push([cn, cd]) }
    if (wrong.length >= 3) break
  }
  // 補充：wider範囲でランダム真分数
  for (let tries = 0; wrong.length < 3 && tries < 40; tries++) {
    const sd = ri(2, Math.max(d + 2, 8)), sn = ri(1, sd - 1)
    const [rn, rd] = simplify(sn, sd); const key = `${rn}/${rd}`
    if (!seen.has(key)) { seen.add(key); wrong.push([rn, rd]) }
  }
  return shuffle([[an, ad], ...wrong.slice(0, 3)])
}

// ---- Question generators ----
function makeReadQ(denoms: number[]): ReadQ {
  const d = pick(denoms); const n = ri(1, d - 1)
  const vis: VisType = Math.random() < 0.5 ? 'pizza' : 'bar'
  const choices = buildReadChoices(n, d)
  const answerIdx = choices.findIndex(c => c.n === n && c.d === d)
  return { kind: 'read', n, d, vis, choices, answerIdx, hint: `${d}つに等分されていて、色がついているのが${n}つ分 → ${d}分の${n}` }
}

function makeCompareQ(denoms: number[], sameDenom: boolean): CompareQ {
  const vis: VisType = Math.random() < 0.5 ? 'pizza' : 'bar'
  let ld: number, rd: number, ln: number, rn: number
  if (sameDenom || denoms.length < 2) {
    ld = rd = pick(denoms); ln = ri(1, ld - 1); do { rn = ri(1, rd - 1) } while (rn === ln)
  } else {
    const sd = shuffle(Array.from(new Set(denoms))); ld = sd[0]; rd = sd[1] ?? sd[0]
    if (ld === rd) rd = sd[2] ?? sd[0]
    ln = ri(1, ld - 1); rn = ri(1, rd - 1)
    let t = 0; while (ln * rd === rn * ld && t < 20) { rn = ri(1, rd - 1); t++ }
    if (ln * rd === rn * ld) rn = Math.max(1, rn === rd - 1 ? rn - 1 : rn + 1)
  }
  const answer: 'left' | 'right' = ln / ld >= rn / rd ? 'left' : 'right'
  const [w, l] = answer === 'left' ? [{ n: ln, d: ld }, { n: rn, d: rd }] : [{ n: rn, d: rd }, { n: ln, d: ld }]
  const hint = ld === rd
    ? `分母（下）が同じ ${ld}。分子（上）が大きいほう → ${w.n}/${w.d} > ${l.n}/${l.d}`
    : `図で比べると ${w.n}/${w.d}（${Math.round(w.n/w.d*100)}%）のほうが ${l.n}/${l.d}（${Math.round(l.n/l.d*100)}%）より大きい`
  return { kind: 'compare', left: { n: ln, d: ld }, right: { n: rn, d: rd }, vis, answer, hint }
}

function makeAddSameQ(denoms: number[]): CalcQ {
  let d = pick(denoms), a = 1, b = 1, tries = 0
  do { d = pick(denoms); a = ri(1, d - 2); b = ri(1, d - 1 - a); tries++ } while (b < 1 && tries < 40)
  if (b < 1) { d = 4; a = 1; b = 1 }
  const [an, ad] = simplify(a + b, d)
  const dist: [number, number][] = [[a + b, d * 2], [Math.abs(a - b), d], [an + 1, ad], [a, d], [b, d]]
  const hint = (an !== a + b || ad !== d)
    ? `分母はそのまま → ${a}+${b}=${a+b}。${a+b}/${d} = ${an}/${ad}（約分）`
    : `分母はそのまま、分子をたす → ${a}+${b} = ${an}`
  return { kind: 'calc', op: '+', ln: a, ld: d, rn: b, rd: d, an, ad, choices: buildCalcChoices(an, ad, dist), hint, showVis: true }
}

function makeSubSameQ(denoms: number[]): CalcQ {
  let d = pick(denoms), a = 2, b = 1, tries = 0
  do { d = pick(denoms); a = ri(2, d - 1); b = ri(1, a - 1); tries++ } while (a <= b && tries < 40)
  if (a <= b) { d = 4; a = 3; b = 1 }
  const [an, ad] = simplify(a - b, d)
  const dist: [number, number][] = [[a + b, d], [b - a + d, d], [an + 1, ad], [an - 1 > 0 ? an - 1 : an + 2, ad]]
  const hint = (an !== a - b || ad !== d)
    ? `分母はそのまま → ${a}−${b}=${a-b}。${a-b}/${d} = ${an}/${ad}（約分）`
    : `分母はそのまま、分子をひく → ${a}−${b} = ${an}`
  return { kind: 'calc', op: '−', ln: a, ld: d, rn: b, rd: d, an, ad, choices: buildCalcChoices(an, ad, dist), hint, showVis: true }
}

const DIFF_PAIRS: [number, number][] = [[2,3],[2,4],[2,6],[3,4],[3,6],[4,6],[2,8],[4,8]]

function makeAddDiffQ(): CalcQ {
  const [d1, d2] = pick(DIFF_PAIRS); const lc = lcm(d1, d2)
  let a = 1, b = 1, tries = 0
  do { a = ri(1, d1 - 1); b = ri(1, d2 - 1); tries++ } while ((a * lc/d1 + b * lc/d2 >= lc) && tries < 40)
  if (a * lc/d1 + b * lc/d2 >= lc) { a = 1; b = 1 }
  const rawN = a * (lc/d1) + b * (lc/d2)
  const [an, ad] = simplify(rawN, lc)
  const dist: [number, number][] = [[a + b, d1 + d2], [rawN, lc], [rawN + 1, lc], [rawN - 1 > 0 ? rawN - 1 : rawN + 2, lc]]
  const aConv = a * (lc/d1), bConv = b * (lc/d2)
  const hint = `通分（公倍数）: ${d1}と${d2}の最小公倍数=${lc}。${a}/${d1}=${aConv}/${lc}、${b}/${d2}=${bConv}/${lc}。たすと ${rawN}/${lc}${an !== rawN || ad !== lc ? ` = ${an}/${ad}（約分）` : ''}`
  return { kind: 'calc', op: '+', ln: a, ld: d1, rn: b, rd: d2, an, ad, choices: buildCalcChoices(an, ad, dist), hint, showVis: false }
}

function makeSubDiffQ(): CalcQ {
  const [d1, d2] = pick(DIFF_PAIRS); const lc = lcm(d1, d2)
  let a = 1, b = 1, tries = 0
  do { a = ri(1, d1 - 1); b = ri(1, d2 - 1); tries++ } while ((a * lc/d1 <= b * lc/d2) && tries < 40)
  if (a * lc/d1 <= b * lc/d2) { a = d1 - 1; b = 1 }
  const rawN = a * (lc/d1) - b * (lc/d2)
  const [an, ad] = simplify(Math.max(rawN, 1), lc)
  const aConv = a * (lc/d1), bConv = b * (lc/d2)
  const dist: [number, number][] = [[a + b, d1 + d2], [aConv + bConv, lc], [aConv, lc], [an + 1, ad]]
  const hint = `通分: ${d1}と${d2}の最小公倍数=${lc}。${a}/${d1}=${aConv}/${lc}、${b}/${d2}=${bConv}/${lc}。ひくと ${rawN}/${lc}${an !== rawN || ad !== lc ? ` = ${an}/${ad}（約分）` : ''}`
  return { kind: 'calc', op: '−', ln: a, ld: d1, rn: b, rd: d2, an, ad, choices: buildCalcChoices(an, ad, dist), hint, showVis: false }
}

function makeMulIntQ(): CalcQ {
  const d = pick([2,3,4,6,8]); const a = ri(1, d - 1); const k = ri(2, 4)
  const [an, ad] = simplify(a * k, d)
  const dist: [number, number][] = [[a, d * k], [a * k + 1, d], [a * (k - 1), d], [a + k, d]]
  const hint = `分子を${k}倍する → (${a}×${k})/${d} = ${a*k}/${d}${an !== a*k || ad !== d ? ` = ${an}/${ad}（約分）` : ''}`
  return { kind: 'calc', op: '×', ln: a, ld: d, rn: k, rd: 1, an, ad, choices: buildCalcChoices(an, ad, dist), hint, showVis: false }
}

function makeDivIntQ(): CalcQ {
  const d = pick([2,3,4,6,8])
  const k = pick([2, 3])
  const a = ri(1, d - 1)
  const [an, ad] = simplify(a, d * k)
  const dist: [number, number][] = [[a * k, d], [a, d - k > 0 ? d - k : d + k], [an + 1, ad], [an, ad + 1]]
  const hint = `${d}分の${a} ÷ ${k} → 分母を${k}倍する → ${a}/${d}÷${k} = ${a}/${d*k}${an !== a || ad !== d*k ? ` = ${an}/${ad}（約分）` : ''}`
  return { kind: 'calc', op: '÷', ln: a, ld: d, rn: k, rd: 1, an, ad, choices: buildCalcChoices(an, ad, dist), hint, showVis: false }
}

function makeMulFracQ(): CalcQ {
  const d1 = pick([2,3,4,6]), d2 = pick([2,3,4,6])
  const a = ri(1, d1 - 1), c = ri(1, d2 - 1)
  const [an, ad] = simplify(a * c, d1 * d2)
  const dist: [number, number][] = [
    [a * c, d1 + d2], [a + c, d1 * d2], [an + 1, ad], [an, ad + 1],
  ]
  const hint = `分子どうし・分母どうしをかける → (${a}×${c})/(${d1}×${d2}) = ${a*c}/${d1*d2}${an !== a*c || ad !== d1*d2 ? ` = ${an}/${ad}（約分）` : ''}`
  return { kind: 'calc', op: '×', ln: a, ld: d1, rn: c, rd: d2, an, ad, choices: buildCalcChoices(an, ad, dist), hint, showVis: false }
}

function makeDivFracQ(): CalcQ {
  const d1 = pick([2,3,4,6]), d2 = pick([2,3,4,6])
  const a = ri(1, d1 - 1), c = ri(1, d2 - 1)
  // a/d1 ÷ c/d2 = a/d1 × d2/c = (a×d2)/(d1×c)
  const rawN = a * d2, rawD = d1 * c
  const [an, ad] = simplify(rawN, rawD)
  const dist: [number, number][] = [
    [a * c, d1 * d2], [an + 1, ad], [rawN + 1, rawD], [an, ad + 1],
  ]
  const hint = `わる分数をひっくりかえして×にする → ${a}/${d1} × ${d2}/${c} = (${a}×${d2})/(${d1}×${c}) = ${rawN}/${rawD}${an !== rawN || ad !== rawD ? ` = ${an}/${ad}（約分）` : ''}`
  return { kind: 'calc', op: '÷', ln: a, ld: d1, rn: c, rd: d2, an, ad, choices: buildCalcChoices(an, ad, dist), hint, showVis: false }
}

function makeYakubunQ(denoms: number[]): YakubunQ {
  let n = 2, d = 4, g = 2, tries = 0
  do {
    d = pick(denoms); n = ri(2, d - 2); g = gcd(n, d); tries++
  } while (g <= 1 && tries < 80)
  if (g <= 1) { n = 2; d = 4; g = 2 }
  const [an, ad] = simplify(n, d)
  const hint = `${n}と${d}の 最大公約数は ${g}。分子・分母を${g}でわる → ${n}÷${g}=${an}、${d}÷${g}=${ad}`
  return { kind: 'yakubun', n, d, an, ad, choices: buildYakubunChoices(an, ad, n, d, g), hint }
}

// ---- Levels ----
interface LevelDef { id: number; name: string; badge: string; desc: string; color: string; kind: string; denoms?: number[]; sameDenom?: boolean }

const LEVELS: LevelDef[] = [
  { id:1,  name:'レベル1',        badge:'⭐',       desc:'図を見て分数を読もう（分母 2〜4）',    color:'#fef9c3', kind:'read',       denoms:[2,3,4] },
  { id:2,  name:'レベル2',        badge:'⭐⭐',      desc:'図を見て分数を読もう（分母 4〜12）',   color:'#fef08a', kind:'read',       denoms:[4,6,8,12] },
  { id:3,  name:'レベル3',        badge:'⭐⭐⭐',     desc:'どちらが大きい？（同じ分母）',         color:'#fed7aa', kind:'compare',    denoms:[2,3,4,6,8],    sameDenom:true },
  { id:4,  name:'レベル4',        badge:'⭐⭐⭐⭐',    desc:'どちらが大きい？（ちがう分母）',       color:'#fca5a5', kind:'compare',    denoms:[2,3,4,6,8,12], sameDenom:false },
  { id:5,  name:'ぜんぶまぜまぜ①', badge:'🌀',      desc:'レベル1〜4をシャッフル',               color:'#fef9c3', kind:'mix-read',   denoms:[2,3,4,6,8,12] },
  { id:6,  name:'レベル5',        badge:'🍕',       desc:'たし算（同じ分母）',                   color:'#dcfce7', kind:'add-same',   denoms:[2,3,4,6,8] },
  { id:7,  name:'レベル6',        badge:'🍕🍕',     desc:'ひき算（同じ分母）',                   color:'#bbf7d0', kind:'sub-same',   denoms:[3,4,6,8] },
  { id:8,  name:'レベル7',        badge:'🍕🍕🍕',    desc:'たし算・ひき算（通分が必要）',         color:'#86efac', kind:'add-sub-diff' },
  { id:9,  name:'レベル8',        badge:'🍕🍕🍕🍕',   desc:'かけ算・わり算（×÷整数）',           color:'#4ade80', kind:'mul-div-int' },
  { id:10, name:'ぜんぶまぜまぜ②', badge:'🌀🌀',    desc:'四則レベルをシャッフル',              color:'#dcfce7', kind:'mix-calc' },
  { id:11, name:'かけ算（分数×分数）', badge:'🌟',       desc:'分数どうしのかけ算',                   color:'#d1fae5', kind:'mul-frac' },
  { id:12, name:'わり算（分数÷分数）', badge:'🌟🌟',     desc:'ひっくりかえして×にしよう',            color:'#a7f3d0', kind:'div-frac' },
  { id:13, name:'かけ算・わり算まぜ',  badge:'🌟🌟🌟',   desc:'分数どうしのかけ算・わり算シャッフル',  color:'#6ee7b7', kind:'mul-div-frac' },
  { id:14, name:'約分①',             badge:'✂️',       desc:'2でわってかんたんにしよう（小さい数）', color:'#e0e7ff', kind:'yakubun',    denoms:[4,6,8,10] },
  { id:15, name:'約分②',             badge:'✂️✂️',     desc:'2・3・5でわってかんたんにしよう',      color:'#c7d2fe', kind:'yakubun',    denoms:[6,9,10,12,15] },
  { id:16, name:'約分③',             badge:'✂️✂️✂️',   desc:'大きな数もかんたんにしよう',           color:'#a5b4fc', kind:'yakubun',    denoms:[12,15,18,20,24,30] },
]

const SECTIONS = [
  { name: '読み取り・比較',       start: 0,  end: 5  },
  { name: '四則計算（×÷整数）',  start: 5,  end: 10 },
  { name: '分数×分数（小6）',    start: 10, end: 13 },
  { name: '約分',                 start: 13, end: 16 },
] as const

function buildQuestions(lv: LevelDef, count: number): Question[] {
  return Array.from({ length: count }, (_, i): Question => {
    switch (lv.kind) {
      case 'read':         return makeReadQ(lv.denoms!)
      case 'compare':      return makeCompareQ(lv.denoms!, lv.sameDenom ?? false)
      case 'mix-read':     return i % 2 === 0 ? makeReadQ(lv.denoms!) : makeCompareQ(lv.denoms!, Math.random() < 0.5)
      case 'add-same':     return makeAddSameQ(lv.denoms!)
      case 'sub-same':     return makeSubSameQ(lv.denoms!)
      case 'add-sub-diff': return Math.random() < 0.5 ? makeAddDiffQ() : makeSubDiffQ()
      case 'mul-div-int':  return Math.random() < 0.5 ? makeMulIntQ() : makeDivIntQ()
      case 'mix-calc': {
        const idx = i % 4
        if (idx === 0) return makeAddSameQ([2,3,4,6,8])
        if (idx === 1) return makeSubSameQ([3,4,6,8])
        if (idx === 2) return Math.random() < 0.5 ? makeAddDiffQ() : makeSubDiffQ()
        return Math.random() < 0.5 ? makeMulIntQ() : makeDivIntQ()
      }
      case 'mul-frac':     return makeMulFracQ()
      case 'div-frac':     return makeDivFracQ()
      case 'mul-div-frac': return Math.random() < 0.5 ? makeMulFracQ() : makeDivFracQ()
      case 'yakubun':      return makeYakubunQ(lv.denoms!)
      default: return makeReadQ([2,3,4])
    }
  })
}

const COUNTS = [5, 10]
const ACCENT = '#22c55e'
const PIZZA_COLOR = '#ef4444'
const BAR_COLOR = '#f59e0b'
const YAKUBUN_COLOR = '#6366f1'

export default function BunsuuPage() {
  const [phase, setPhase] = useState<Phase>('top')
  const [selLv, setSelLv] = useState(0)
  const [count, setCount] = useState(10)
  const [questions, setQuestions] = useState<Question[]>([])
  const [qi, setQi] = useState(0)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [selAns, setSelAns] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)
  const [waiting, setWaiting] = useState(false)

  function startQuiz(lvIdx: number, cnt: number) {
    setQuestions(buildQuestions(LEVELS[lvIdx], cnt))
    setQi(0); setScore(0); setCombo(0); setMaxCombo(0)
    setFeedback(null); setSelAns(null); setCorrect(0); setWaiting(false)
    setPhase('quiz')
  }

  const handleAnswer = useCallback((key: string) => {
    if (waiting) return
    const q = questions[qi]
    let ok = false
    if (q.kind === 'read')    ok = key === String(q.answerIdx)
    else if (q.kind === 'compare') ok = key === q.answer
    else { const [an, ad] = key.split('/').map(Number); ok = an === q.an && ad === q.ad }
    setSelAns(key)
    if (ok) {
      const nc = combo + 1
      setScore(s => s + 10 + Math.min(nc - 1, 5) * 2)
      setCombo(nc); setMaxCombo(mc => Math.max(mc, nc)); setCorrect(c => c + 1); setFeedback('correct')
    } else { setCombo(0); setFeedback('wrong') }
    setWaiting(true)
  }, [waiting, questions, qi, combo])

  const handleNext = useCallback(() => {
    setFeedback(null); setSelAns(null); setWaiting(false)
    if (qi + 1 >= questions.length) setPhase('result'); else setQi(i => i + 1)
  }, [qi, questions.length])

  function stars(): number { const p = questions.length > 0 ? correct / questions.length : 0; return p >= 0.9 ? 3 : p >= 0.6 ? 2 : p >= 0.3 ? 1 : 0 }

  const diagram = (n: number, d: number, vis: VisType, sm?: boolean) =>
    vis === 'pizza' ? <PizzaSvg n={n} d={d} color={PIZZA_COLOR} size={sm ? 88 : 140} />
                    : <BarSvg   n={n} d={d} color={BAR_COLOR}   w={sm ? 150 : 240} h={sm ? 50 : 68} />

  // ---- TOP ----
  if (phase === 'top') return (
    <div style={{ minHeight: '100vh', background: '#f0fdf4', padding: 20 }}>
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <Link href="/lab" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14 }}>← ラボへもどる</Link>
        <div style={{ textAlign: 'center', padding: '24px 0 16px' }}>
          <div style={{ fontSize: 52 }}>🍕</div>
          <h1 style={{ fontSize: 30, fontWeight: 'bold', margin: '8px 0 4px' }}>分数</h1>
          <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>ぶんすう — 図で理解して計算まで</p>
        </div>
        <div style={{ background: 'white', borderRadius: 16, padding: 16, marginBottom: 20, display: 'flex', justifyContent: 'space-around', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <div style={{ textAlign: 'center' }}>
            <PizzaSvg n={3} d={4} color={PIZZA_COLOR} size={68} />
            <div style={{ marginTop: 6, display: 'flex', justifyContent: 'center' }}><Frac n={3} d={4} size={15} /></div>
          </div>
          <div style={{ fontSize: 20, color: '#d1d5db' }}>=</div>
          <div style={{ textAlign: 'center' }}>
            <BarSvg n={3} d={4} color={BAR_COLOR} w={100} h={40} />
            <div style={{ marginTop: 6, display: 'flex', justifyContent: 'center' }}><Frac n={3} d={4} size={15} /></div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {[
            ['📖 読み取り・比較', 'レベル1〜4'],
            ['🍕 たし算・ひき算', 'レベル5〜7'],
            ['× ÷ 整数のかけ算わり算', 'レベル8（小5）'],
            ['🌟 分数どうし', 'かけ算・わり算（小6）'],
            ['✂️ 約分', '約分①〜③'],
          ].map(([t, s]) => (
            <div key={t} style={{ background: 'white', borderRadius: 10, padding: '10px 12px', fontSize: 12, color: '#374151', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ fontWeight: 'bold', marginBottom: 2 }}>{t}</div>
              <div style={{ color: '#6b7280', fontSize: 11 }}>{s}</div>
            </div>
          ))}
        </div>
        <button onClick={() => setPhase('levelSelect')}
          style={{ width: '100%', padding: 18, background: ACCENT, color: 'white', border: 'none', borderRadius: 16, cursor: 'pointer', fontSize: 18, fontWeight: 'bold', boxShadow: '0 4px 12px rgba(34,197,94,0.35)' }}>
          レベルをえらぶ →
        </button>
      </div>
    </div>
  )

  // ---- LEVEL SELECT ----
  if (phase === 'levelSelect') return (
    <div style={{ minHeight: '100vh', background: '#f0fdf4', padding: 20 }}>
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <button onClick={() => setPhase('top')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#6b7280', marginBottom: 14 }}>← もどる</button>
        <h2 style={{ fontSize: 20, fontWeight: 'bold', color: ACCENT, marginBottom: 2 }}>分数</h2>
        <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 16 }}>ぶんすう — レベルをえらぼう</p>
        {SECTIONS.map(({ name, start, end }, si) => (
          <div key={name}>
            <div style={{ fontSize: 12, fontWeight: 'bold', color: '#6b7280', marginBottom: 8, marginTop: si > 0 ? 16 : 0 }}>── {name}</div>
            {LEVELS.slice(start, end).map((lv, idx) => (
              <button key={lv.id} onClick={() => { setSelLv(start + idx); setPhase('countSelect') }}
                style={{ width: '100%', padding: '16px 18px', marginBottom: 8, background: lv.color, border: `2px solid ${ACCENT}`, borderRadius: 14, cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div><div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 1 }}>{lv.name}</div><div style={{ fontSize: 12, color: '#374151' }}>{lv.desc}</div></div>
                  <div style={{ fontSize: 16 }}>{lv.badge}</div>
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )

  // ---- COUNT SELECT ----
  if (phase === 'countSelect') return (
    <div style={{ minHeight: '100vh', background: '#f0fdf4', padding: 20 }}>
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <button onClick={() => setPhase('levelSelect')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#6b7280', marginBottom: 16 }}>← もどる</button>
        <h2 style={{ fontSize: 17, fontWeight: 'bold', marginBottom: 24 }}>{LEVELS[selLv].name} — なんもん？</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {COUNTS.map(cnt => (
            <button key={cnt} onClick={() => { setCount(cnt); startQuiz(selLv, cnt) }}
              style={{ padding: '28px 20px', background: 'white', border: `2px solid ${ACCENT}`, borderRadius: 14, cursor: 'pointer', fontSize: 26, fontWeight: 'bold', color: ACCENT }}>
              {cnt}もん
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  // ---- QUIZ ----
  if (phase === 'quiz' && questions.length > 0) {
    const q = questions[qi]
    const bg = feedback === 'correct' ? '#d1fae5' : feedback === 'wrong' ? '#fee2e2' : '#f0fdf4'

    return (
      <div style={{ minHeight: '100vh', background: bg, padding: 20, transition: 'background 0.3s' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <button onClick={() => setPhase('top')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#9ca3af' }}>✕</button>
            <div style={{ fontSize: 13, color: '#6b7280' }}>{qi + 1} / {questions.length}もん</div>
            <div style={{ fontSize: 14, fontWeight: 'bold', color: ACCENT }}>{score}点 {combo > 1 && <span style={{ fontSize: 12, color: '#f59e0b' }}>🔥×{combo}</span>}</div>
          </div>
          <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3, marginBottom: 18 }}>
            <div style={{ height: '100%', borderRadius: 3, background: ACCENT, width: `${(qi / questions.length) * 100}%`, transition: 'width 0.3s' }} />
          </div>

          {/* Question card */}
          <div style={{ background: 'white', borderRadius: 20, padding: 24, textAlign: 'center', marginBottom: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
            {q.kind === 'read' && (
              <>
                <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 14 }}>この図は 何分の何？</p>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>{diagram(q.n, q.d, q.vis)}</div>
              </>
            )}
            {q.kind === 'compare' && (
              <>
                <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 14 }}>どちらが 大きい？</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 20, alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    {diagram(q.left.n, q.left.d, q.vis, true)}
                    <div style={{ marginTop: 6, display: 'flex', justifyContent: 'center' }}><Frac n={q.left.n} d={q.left.d} size={18} /></div>
                  </div>
                  <div style={{ fontSize: 22, color: '#d1d5db', fontWeight: 'bold' }}>?</div>
                  <div style={{ textAlign: 'center' }}>
                    {diagram(q.right.n, q.right.d, q.vis, true)}
                    <div style={{ marginTop: 6, display: 'flex', justifyContent: 'center' }}><Frac n={q.right.n} d={q.right.d} size={18} /></div>
                  </div>
                </div>
              </>
            )}
            {q.kind === 'calc' && (
              <>
                <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 14 }}>
                  {q.op === '+' ? 'たし算' : q.op === '−' ? 'ひき算' : q.op === '×' ? 'かけ算' : 'わり算'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 14, flexWrap: 'wrap' }}>
                  <Frac n={q.ln} d={q.ld} size={30} />
                  <span style={{ fontSize: 28, fontWeight: 'bold', color: '#374151' }}>{q.op}</span>
                  {q.rd === 1
                    ? <span style={{ fontSize: 34, fontWeight: 'bold', color: '#374151' }}>{q.rn}</span>
                    : <Frac n={q.rn} d={q.rd} size={30} />
                  }
                  <span style={{ fontSize: 24, color: '#9ca3af' }}>=</span>
                  <span style={{ fontSize: 30, color: '#9ca3af' }}>?</span>
                </div>
                {q.showVis && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                    <PizzaSvg n={q.ln} d={q.ld} color={PIZZA_COLOR} size={72} />
                    <span style={{ fontSize: 22, fontWeight: 'bold', color: '#374151' }}>{q.op}</span>
                    <PizzaSvg n={q.rn} d={q.rd} color={PIZZA_COLOR} size={72} />
                  </div>
                )}
              </>
            )}
            {q.kind === 'yakubun' && (
              <>
                <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 18 }}>この分数を <strong style={{ color: YAKUBUN_COLOR }}>約分</strong> しよう</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 8 }}>
                  <div style={{ background: '#eef2ff', borderRadius: 12, padding: '16px 24px' }}>
                    <Frac n={q.n} d={q.d} size={38} color={YAKUBUN_COLOR} />
                  </div>
                  <span style={{ fontSize: 26, color: '#9ca3af' }}>=</span>
                  <span style={{ fontSize: 34, color: '#9ca3af' }}>?</span>
                </div>
              </>
            )}

            {/* Feedback */}
            {waiting && (
              <div style={{ marginTop: 14 }}>
                {feedback === 'correct'
                  ? <div style={{ fontSize: 26 }}>⭕ <span style={{ fontSize: 16, fontWeight: 'bold', color: '#059669' }}>せいかい！</span></div>
                  : <div style={{ fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span>❌</span>
                      <span style={{ fontSize: 14, color: '#dc2626' }}>せいかいは</span>
                      {q.kind === 'read' && <Frac n={q.choices[q.answerIdx].n} d={q.choices[q.answerIdx].d} size={16} color="#dc2626" />}
                      {q.kind === 'compare' && <span style={{ fontSize: 14, color: '#dc2626' }}>{q.answer === 'left' ? '左' : '右'}（<Frac n={q.answer === 'left' ? q.left.n : q.right.n} d={q.answer === 'left' ? q.left.d : q.right.d} size={14} color="#dc2626" />）が大きい</span>}
                      {(q.kind === 'calc' || q.kind === 'yakubun') && <Frac n={q.an} d={q.ad} size={16} color="#dc2626" />}
                    </div>
                }
                <div style={{ marginTop: 10, padding: '10px 14px', background: '#fef3c7', borderRadius: 10, fontSize: 12, color: '#92400e', lineHeight: 1.8, textAlign: 'left' }}>
                  💡 {q.hint}
                </div>
              </div>
            )}
          </div>

          {/* Choices */}
          {q.kind === 'read' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              {q.choices.map((c, idx) => {
                let bg2 = 'white', border = '2px solid #e5e7eb', col = '#1f2937'
                if (waiting) {
                  if (idx === q.answerIdx) { bg2 = '#d1fae5'; border = '2px solid #10b981'; col = '#065f46' }
                  else if (selAns === String(idx)) { bg2 = '#fee2e2'; border = '2px solid #ef4444'; col = '#991b1b' }
                }
                return (
                  <button key={idx} onClick={() => handleAnswer(String(idx))} disabled={waiting}
                    style={{ padding: '18px 8px', background: bg2, border, borderRadius: 12, cursor: waiting ? 'default' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'all 0.2s' }}>
                    <Frac n={c.n} d={c.d} size={28} color={col} />
                  </button>
                )
              })}
            </div>
          ) : q.kind === 'compare' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              {(['left', 'right'] as const).map(side => {
                let bg2 = 'white', border = '2px solid #e5e7eb', col = '#374151'
                if (waiting) {
                  if (q.answer === side) { bg2 = '#d1fae5'; border = '2px solid #10b981'; col = '#065f46' }
                  else if (selAns === side) { bg2 = '#fee2e2'; border = '2px solid #ef4444'; col = '#991b1b' }
                }
                return (
                  <button key={side} onClick={() => handleAnswer(side)} disabled={waiting}
                    style={{ padding: '18px 8px', background: bg2, border, borderRadius: 12, cursor: waiting ? 'default' : 'pointer', fontSize: 13, fontWeight: 'bold', color: col, transition: 'all 0.2s' }}>
                    {side === 'left' ? '← 左が大きい' : '右が大きい →'}
                  </button>
                )
              })}
            </div>
          ) : (
            /* CalcQ / YakubunQ choices */
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              {q.choices.map(([cn, cd], idx) => {
                const key = `${cn}/${cd}`
                const isCorrect = cn === q.an && cd === q.ad
                let bg2 = 'white', border = '2px solid #e5e7eb', col = '#1f2937'
                if (waiting) {
                  if (isCorrect) { bg2 = '#d1fae5'; border = '2px solid #10b981'; col = '#065f46' }
                  else if (selAns === key) { bg2 = '#fee2e2'; border = '2px solid #ef4444'; col = '#991b1b' }
                }
                return (
                  <button key={idx} onClick={() => handleAnswer(key)} disabled={waiting}
                    style={{ padding: '18px 8px', background: bg2, border, borderRadius: 12, cursor: waiting ? 'default' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'all 0.2s' }}>
                    <Frac n={cn} d={cd} size={28} color={col} />
                  </button>
                )
              })}
            </div>
          )}

          {waiting && (
            <button onClick={handleNext}
              style={{ width: '100%', padding: 16, background: ACCENT, color: 'white', border: 'none', borderRadius: 14, cursor: 'pointer', fontSize: 16, fontWeight: 'bold' }}>
              {qi + 1 >= questions.length ? 'けっかを見る →' : 'つぎへ →'}
            </button>
          )}
        </div>
      </div>
    )
  }

  // ---- RESULT ----
  if (phase === 'result') {
    const pct = Math.round((correct / questions.length) * 100); const sc = stars()
    return (
      <div style={{ minHeight: '100vh', background: '#f0fdf4', padding: 20 }}>
        <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 50, marginBottom: 8 }}>{'⭐'.repeat(sc)}{'☆'.repeat(3 - sc)}</div>
          <h2 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 4 }}>{sc >= 3 ? 'かんぺき！' : sc >= 2 ? 'よくできました！' : 'がんばったね！'}</h2>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 24 }}>分数 / {LEVELS[selLv].name}</p>
          <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.07)', marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div><div style={{ fontSize: 28, fontWeight: 'bold', color: ACCENT }}>{score}</div><div style={{ fontSize: 11, color: '#6b7280' }}>てん</div></div>
              <div><div style={{ fontSize: 28, fontWeight: 'bold' }}>{pct}%</div><div style={{ fontSize: 11, color: '#6b7280' }}>せいかいりつ</div></div>
              <div><div style={{ fontSize: 28, fontWeight: 'bold', color: '#f59e0b' }}>{maxCombo}</div><div style={{ fontSize: 11, color: '#6b7280' }}>さいこうコンボ</div></div>
            </div>
            <div style={{ marginTop: 12, fontSize: 13, color: '#6b7280' }}>{correct} / {questions.length} もん せいかい</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button onClick={() => startQuiz(selLv, count)}
              style={{ padding: 16, background: ACCENT, color: 'white', border: 'none', borderRadius: 14, cursor: 'pointer', fontSize: 16, fontWeight: 'bold' }}>もういちど</button>
            <button onClick={() => setPhase('levelSelect')}
              style={{ padding: 16, background: 'white', color: ACCENT, border: `2px solid ${ACCENT}`, borderRadius: 14, cursor: 'pointer', fontSize: 14 }}>レベルをえらぶ</button>
            <Link href="/lab" style={{ display: 'block', padding: 16, background: '#f3f4f6', color: '#6b7280', borderRadius: 14, textDecoration: 'none', fontSize: 14 }}>ラボへもどる</Link>
          </div>
        </div>
      </div>
    )
  }

  return null
}
