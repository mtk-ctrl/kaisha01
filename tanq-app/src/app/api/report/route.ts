import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// app_id → 保護者向けの分かりやすい日本語名
const APP_LABELS: Record<string, string> = {
  kanji: '漢字マスター',
  english: '英語ボキャブラリー',
  science: '中学受験 理科',
  math: '計算チャレンジ',
  clock: '時計・時間',
  shapes: '図形トレーニング',
  coding: 'プログラミング',
  kokugo: '国語〈ことば〉',
  kanyo: '慣用句',
  yoji: '四字熟語',
  thinking: 'かんがえる力ジム',
  'word-math': '算数文章題',
  juku: '中学受験 算数',
  todofuken: '都道府県マスター',
  kuku: '九九マスター',
  'youji-hiragana': 'ひらがな',
  'youji-katakana': 'カタカナ',
  'youji-kanji': 'はじめての かんじ',
  'youji-math': 'たべものと かずあそび',
  'youji-juucombo': '10になる かず',
  'youji-iro': 'いろと かたち',
  'youji-clock': 'なんじ かな？',
  'youji-animals': 'どうぶつ さんすう',
  'youji-zokusei': 'ぞくせい仕分け工場',
}

function labelFor(appId: string): string {
  return APP_LABELS[appId] ?? appId
}

type ScoreRow = { app_id: string; score: number; total: number; created_at: string }

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const now = Date.now()
  const WEEK = 7 * 24 * 60 * 60 * 1000
  const thisWeekStart = now - WEEK
  const lastWeekStart = now - 2 * WEEK

  // 過去28日分だけ取得（レポートに十分・転送量を抑える）
  const since = new Date(now - 4 * WEEK).toISOString()
  const { data, error } = await supabase
    .from('scores')
    .select('app_id, score, total, created_at')
    .eq('user_id', user.id)
    .gte('created_at', since)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[api/report] GET error', error.message)
    return NextResponse.json({ error: 'failed to load' }, { status: 500 })
  }

  const rows = (data ?? []) as ScoreRow[]

  const inThisWeek = (t: number) => t >= thisWeekStart
  const inLastWeek = (t: number) => t >= lastWeekStart && t < thisWeekStart

  let thisWeekQuestions = 0
  let lastWeekQuestions = 0
  let thisWeekSessions = 0
  let lastWeekSessions = 0
  const activeDays = new Set<string>()
  const perApp: Record<string, { sessions: number; questions: number; correct: number }> = {}

  for (const r of rows) {
    const t = new Date(r.created_at).getTime()
    if (inThisWeek(t)) {
      thisWeekQuestions += r.total
      thisWeekSessions += 1
      activeDays.add(new Date(r.created_at).toISOString().slice(0, 10))
      const a = (perApp[r.app_id] ??= { sessions: 0, questions: 0, correct: 0 })
      a.sessions += 1
      a.questions += r.total
      a.correct += r.score
    } else if (inLastWeek(t)) {
      lastWeekQuestions += r.total
      lastWeekSessions += 1
    }
  }

  const apps = Object.entries(perApp)
    .map(([appId, v]) => ({
      appId,
      label: labelFor(appId),
      sessions: v.sessions,
      questions: v.questions,
      accuracy: v.questions > 0 ? Math.round((v.correct / v.questions) * 100) : 0,
    }))
    .sort((a, b) => b.questions - a.questions)

  return NextResponse.json({
    generatedAt: new Date(now).toISOString(),
    thisWeek: {
      questions: thisWeekQuestions,
      sessions: thisWeekSessions,
      activeDays: activeDays.size,
    },
    lastWeek: {
      questions: lastWeekQuestions,
      sessions: lastWeekSessions,
    },
    deltaQuestions: thisWeekQuestions - lastWeekQuestions,
    apps,
  })
}
