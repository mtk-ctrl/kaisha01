import { earnCoins } from './coins'
import { pushToSupabase } from './learningSync'

export async function saveScore(appId: string, score: number, total: number, difficulty?: string): Promise<void> {
  if (typeof window === 'undefined') return
  try { earnCoins(appId, score) } catch {}
  const auth = localStorage.getItem('tanq-lab-auth')
  if (auth === 'member' || auth === 'tester') pushToSupabase().catch(() => {})
  if (auth === 'member') {
    try { await fetch('/api/scores', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ appId, score, total, difficulty: difficulty ?? null }) }) } catch {}
  } else if (auth === 'tester') {
    try { await fetch('/api/tester/scores', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ appId, score, total, difficulty: difficulty ?? null }) }) } catch {}
  }
}
