// バッジ体系の共通ライブラリ（A-7 一貫性改善）
// 各アプリにインライン定義されていた「習得数 → 5段階バッジ」のしきい値を一元化する。
// 表示は lab/page.tsx の BadgeChip が担当（こちらはデータのみ）。

export type BadgeDef = { emoji: string; label: string; color: string; earned: boolean }

// 「習得数」型アプリ（漢字・英語・理科など）の標準ティア。
// 全アプリで段階の意味（芽→好き→博士→王→全部）と色を揃え、横断的な達成感を作る。
export const MASTERY_TIERS = [
  { emoji: '🌱', threshold: 5,   color: '#7BE8B0' },
  { emoji: '🔥', threshold: 20,  color: '#FB923C' },
  { emoji: '⭐', threshold: 50,  color: '#F0C040' },
  { emoji: '👑', threshold: 100, color: '#B197FC' },
] as const

/**
 * 習得数ベースの標準バッジ列を生成する。
 * @param mastered 現在の習得数
 * @param total    全体数（「ぜんぶ！」バッジの達成判定に使う）
 * @param labels   各ティアのラベル（4段階＋全部の計5つ）。アプリごとに文言だけ差し替える
 */
export function masteryBadges(
  mastered: number,
  total: number,
  labels: [string, string, string, string, string],
): BadgeDef[] {
  const tiers: BadgeDef[] = MASTERY_TIERS.map((t, i) => ({
    emoji: t.emoji,
    label: labels[i],
    color: t.color,
    earned: mastered >= t.threshold,
  }))
  tiers.push({
    emoji: '🏆',
    label: labels[4],
    color: '#FF6F9C',
    earned: total > 0 && mastered >= total,
  })
  return tiers
}
