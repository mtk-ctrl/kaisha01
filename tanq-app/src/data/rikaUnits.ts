// 中学受験 理科 — 単元マップ（構造転換のひな型）
// 「教科 = 単元マップ」方式（logs/decisions/2026-06-11_chuju-vision.md 0-2）。
// 既存 scienceData.ts の260問は1問も動かさず、unit タグ（34種）→ 本マップ21単元へ割当てる。
// SRS キー（question id）・進捗キー（tanq_science_srs_v1）は変更しない（互換維持）。

import { SCIENCE_QUESTIONS } from './scienceData'
import type { ScienceQuestion } from './scienceData'

export type RikaField = '生物' | '地学' | '物理' | '化学'

// full      = まなぶ（図解導入）＋とく（計算・思考演習）まで公開
// knowledge = 知識演習（一問一答）のみ公開（図解・計算演習は準備中と正直に表示する）
export type RikaUnitStatus = 'full' | 'knowledge'

export interface RikaUnit {
  id: string
  field: RikaField
  name: string
  nameKana: string
  emoji: string
  status: RikaUnitStatus
  href: string                 // 公開中コンテンツへの導線
  sourceUnits: string[]        // scienceData.ts の unit タグ（既存問題の割当て元）
}

export const RIKA_FIELDS: RikaField[] = ['生物', '地学', '物理', '化学']

export const RIKA_UNITS: RikaUnit[] = [
  // ── 🌿 生物（6単元）──────────────────────────────
  {
    id: 'rika-bio-plants', field: '生物',
    name: '植物のつくりとはたらき', nameKana: 'しょくぶつのつくりとはたらき', emoji: '🌱',
    status: 'knowledge', href: '/apps/science?unit=rika-bio-plants',
    sourceUnits: ['植物の基礎', '植物のつくりとはたらき', '植物の生殖'],
  },
  {
    id: 'rika-bio-insects', field: '生物',
    name: 'こん虫のからだと育ち方', nameKana: 'こんちゅうのからだとそだちかた', emoji: '🐛',
    status: 'knowledge', href: '/apps/science?unit=rika-bio-insects',
    sourceUnits: ['昆虫のからだ'],
  },
  {
    id: 'rika-bio-animals', field: '生物',
    name: '動物のなかまと分類', nameKana: 'どうぶつのなかまとぶんるい', emoji: '🐬',
    status: 'knowledge', href: '/apps/science?unit=rika-bio-animals',
    sourceUnits: ['動物の基礎', '動物の分類'],
  },
  {
    id: 'rika-bio-human', field: '生物',
    name: '人のからだ', nameKana: 'ひとのからだ', emoji: '🫀',
    status: 'knowledge', href: '/apps/science?unit=rika-bio-human',
    sourceUnits: ['ヒトのからだ', '細胞・遺伝基礎'],
  },
  {
    id: 'rika-bio-seasons', field: '生物',
    name: '季節と生き物', nameKana: 'きせつといきもの', emoji: '🍂',
    status: 'knowledge', href: '/apps/science?unit=rika-bio-seasons',
    sourceUnits: ['季節と生き物'],
  },
  {
    id: 'rika-bio-ecosystem', field: '生物',
    name: '生物のつながり（食物連鎖）', nameKana: 'せいぶつのつながり', emoji: '🕸️',
    status: 'knowledge', href: '/apps/science?unit=rika-bio-ecosystem',
    sourceUnits: ['食物連鎖'],
  },

  // ── 🌍 地学（5単元）──────────────────────────────
  {
    id: 'rika-earth-astro', field: '地学',
    name: '天体（太陽・月・星）', nameKana: 'てんたい', emoji: '🌙',
    status: 'knowledge', href: '/apps/science?unit=rika-earth-astro',
    sourceUnits: ['太陽・月・地球の動き', '月と星'],
  },
  {
    id: 'rika-earth-weather', field: '地学',
    name: '気象（天気の変化）', nameKana: 'きしょう', emoji: '⛅',
    status: 'knowledge', href: '/apps/science?unit=rika-earth-weather',
    sourceUnits: ['天気と気温', '天気の変化'],
  },
  {
    id: 'rika-earth-strata', field: '地学',
    name: '地層と岩石', nameKana: 'ちそうとがんせき', emoji: '🪨',
    status: 'knowledge', href: '/apps/science?unit=rika-earth-strata',
    sourceUnits: ['地層・化石', '岩石と土'],
  },
  {
    id: 'rika-earth-volcano', field: '地学',
    name: '火山と地震', nameKana: 'かざんとじしん', emoji: '🌋',
    status: 'knowledge', href: '/apps/science?unit=rika-earth-volcano',
    sourceUnits: ['火山・地震'],
  },
  {
    id: 'rika-earth-water', field: '地学',
    name: '流れる水のはたらき', nameKana: 'ながれるみずのはたらき', emoji: '🏞️',
    status: 'knowledge', href: '/apps/science?unit=rika-earth-water',
    sourceUnits: ['流れる水のはたらき'],
  },

  // ── ⚡ 物理（5単元）──────────────────────────────
  {
    id: 'rika-phys-teko', field: '物理',
    name: 'てこのつり合い', nameKana: 'てこのつりあい', emoji: '⚖️',
    status: 'full', href: '/apps/rika-teko',
    sourceUnits: ['てこ'],
  },
  {
    id: 'rika-phys-bane', field: '物理',
    name: 'ばねののび', nameKana: 'ばねののび', emoji: '🪝',
    status: 'full', href: '/apps/rika-bane',
    sourceUnits: [],
  },
  {
    id: 'rika-phys-spring', field: '物理',
    name: '滑車・輪軸・ばね・ふりこ', nameKana: 'かっしゃ・りんじく・ばね・ふりこ', emoji: '🪝',
    status: 'knowledge', href: '/apps/science?unit=rika-phys-spring',
    sourceUnits: ['滑車・輪軸', '振り子・ばね'],
  },
  {
    id: 'rika-phys-circuit-calc', field: '物理',
    name: '電気回路（豆電球と乾電池）', nameKana: 'でんきかいろ', emoji: '🔋',
    status: 'full', href: '/apps/rika-circuit',
    sourceUnits: [],
  },
  {
    id: 'rika-phys-circuit', field: '物理',
    name: '電気回路と磁石', nameKana: 'でんきかいろとじしゃく', emoji: '🔋',
    status: 'knowledge', href: '/apps/science?unit=rika-phys-circuit',
    sourceUnits: ['電流・電気回路', '電磁気', '磁石'],
  },
  {
    id: 'rika-phys-light', field: '物理',
    name: '光と音', nameKana: 'ひかりとおと', emoji: '🔦',
    status: 'knowledge', href: '/apps/science?unit=rika-phys-light',
    sourceUnits: ['光と音'],
  },
  {
    id: 'rika-phys-buoyancy', field: '物理',
    name: '浮力と圧力', nameKana: 'ふりょくとあつりょく', emoji: '🛟',
    status: 'knowledge', href: '/apps/science?unit=rika-phys-buoyancy',
    sourceUnits: ['浮力・密度'],
  },

  // ── ⚗️ 化学（5単元）──────────────────────────────
  {
    id: 'rika-chem-chukan', field: '化学',
    name: '水溶液と中和', nameKana: 'すいようえきとちゅうわ', emoji: '🧪',
    status: 'full', href: '/apps/rika-chukan',
    sourceUnits: [],
  },
  {
    id: 'rika-chem-suiyoueki', field: '化学',
    name: '水溶液の性質と中和', nameKana: 'すいようえきのせいしつとちゅうわ', emoji: '🧪',
    status: 'knowledge', href: '/apps/science?unit=rika-chem-suiyoueki',
    sourceUnits: ['水溶液の性質'],
  },
  {
    id: 'rika-chem-gas', field: '化学',
    name: '気体の性質', nameKana: 'きたいのせいしつ', emoji: '💨',
    status: 'knowledge', href: '/apps/science?unit=rika-chem-gas',
    sourceUnits: ['気体の性質'],
  },
  {
    id: 'rika-chem-combustion', field: '化学',
    name: 'ものの燃え方', nameKana: 'もののもえかた', emoji: '🔥',
    status: 'knowledge', href: '/apps/science?unit=rika-chem-combustion',
    sourceUnits: ['燃焼・酸化'],
  },
  {
    id: 'rika-chem-solution', field: '化学',
    name: 'もののとけ方と溶解度', nameKana: 'ものののとけかたとようかいど', emoji: '🧂',
    status: 'knowledge', href: '/apps/science?unit=rika-chem-solution',
    sourceUnits: ['溶け方とろ過', '溶解度・再結晶'],
  },
  {
    id: 'rika-chem-states', field: '化学',
    name: 'ものの性質と状態変化', nameKana: 'もののせいしつとじょうたいへんか', emoji: '🧊',
    status: 'knowledge', href: '/apps/science?unit=rika-chem-states',
    sourceUnits: ['物の状態変化', '物の性質', '金属の性質'],
  },
]

// ── 個別問題の割当て上書き（unit タグより問題内容が他単元に近いもの。Ken 検証済み）──
// chem_1_012「鉄・アルミ・銅のうち磁石につくのは？」… 磁石の知識 → 電気回路と磁石
// chem_1_017「木炭を燃やすと何が出る？」… 燃焼の知識 → ものの燃え方
// chem_1_020「コーラを冷やすと炭酸が強く感じる理由は？」… 気体の溶解度 → もののとけ方と溶解度
const QUESTION_OVERRIDES: Record<string, string> = {
  chem_1_012: 'rika-phys-circuit',
  chem_1_017: 'rika-chem-combustion',
  chem_1_020: 'rika-chem-solution',
}

// unit タグ → 単元マップ id の逆引き（モジュール初期化時に1度だけ構築）
const TAG_TO_UNIT: Record<string, string> = {}
for (const u of RIKA_UNITS) {
  for (const tag of u.sourceUnits) TAG_TO_UNIT[tag] = u.id
}

/** 既存の理科問題がどの単元マップに属するかを返す */
export function rikaUnitIdOf(q: ScienceQuestion): string | null {
  return QUESTION_OVERRIDES[q.id] ?? TAG_TO_UNIT[q.unit] ?? null
}

/** 単元 id → その単元に属する既存問題（知識演習プール） */
export function questionsOfRikaUnit(unitId: string): ScienceQuestion[] {
  return SCIENCE_QUESTIONS.filter(q => rikaUnitIdOf(q) === unitId)
}

/** 単元 id → 知識演習の問題数（/juken の単元マップ表示用） */
export const RIKA_UNIT_QUESTION_COUNT: Record<string, number> = (() => {
  const counts: Record<string, number> = {}
  for (const u of RIKA_UNITS) counts[u.id] = 0
  for (const q of SCIENCE_QUESTIONS) {
    const id = rikaUnitIdOf(q)
    if (id && id in counts) counts[id] += 1
  }
  return counts
})()

export function getRikaUnit(unitId: string): RikaUnit | undefined {
  return RIKA_UNITS.find(u => u.id === unitId)
}
