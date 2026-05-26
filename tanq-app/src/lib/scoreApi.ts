// ログイン済み member のみ /api/scores に POST する fire-and-forget ユーティリティ
// guest / tester はスキップ（エラーにしない）
export async function saveScore(
  appId: string,
  score: number,
  total: number,
  difficulty?: string,
): Promise<void> {
  if (typeof window === 'undefined') return
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
