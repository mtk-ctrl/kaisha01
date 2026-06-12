// ログイン済み member のみ /api/scores に POST する fire-and-forget ユーティリティ
// guest / tester はスキップ（エラーにしない）
// コイン獲得（Phase C-1）はここに統合: 全ユーザー種別が対象（家族テストはテスター運用のため）
import { earnCoins } from './coins'

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
  if (localStorage.getItem('tanq-lab-auth') !== 'member') return
  try {
    await fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appId, score, total, difficulty: difficulty ?? null }),
    })
  } catch {
    // スコア保存失敗はサイレントスキップ（ゲームを止めない）
  }
}
