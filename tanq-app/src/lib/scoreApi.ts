// スコア保存ユーティリティ（fire-and-forget）。
// - コイン獲得（Phase C-1）: 全ユーザー種別（家族テストはテスター運用のため）
// - 学習データ同期: member/tester は Supabase へ push（進捗・コイン・相棒を端末をまたいで失わない）
// - スコア履歴: member は scores テーブル、tester は tester_scores テーブル（テスター名キー）
import { earnCoins } from './coins'
import { pushToSupabase } from './learningSync'

export async function saveScore(
  appId: string,
  score: number,
  total: number,
  difficulty?: string,
): Promise<void> {
  if (typeof window === 'undefined') return
  try {
    earnCoins(appId, score) // 1正解=1コイン + セッション完了ボーナス5コイン
  } catch {
    // コイン付与の失敗でゲームを止めない
  }
  const auth = localStorage.getItem('tanq-lab-auth')
  // member / tester は、セッション完了のたびに最新の進捗・コインをクラウドへ保存する
  // （beforeunload 頼みだとモバイルで取りこぼすため）。fire-and-forget。
  if (auth === 'member' || auth === 'tester') {
    pushToSupabase().catch(() => {})
  }
  if (auth === 'member') {
    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId, score, total, difficulty: difficulty ?? null }),
      })
    } catch {
      // スコア保存失敗はサイレントスキップ（ゲームを止めない）
    }
  } else if (auth === 'tester') {
    // テスターも member と同様にスコア履歴を残す（auth ユーザーが無いためテスター名で保存）
    const name = (localStorage.getItem('tanq-tester-name') || '').trim()
    if (name) {
      try {
        await fetch('/api/tester/scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, appId, score, total, difficulty: difficulty ?? null }),
        })
      } catch {
        // サイレントスキップ
      }
    }
  }
}
