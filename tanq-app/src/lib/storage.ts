// テスターはログイン名ごとにデータを分離する
// ゲスト・メンバーは通常キーをそのまま使う

export function getDataKey(baseKey: string): string {
  if (typeof window === 'undefined') return baseKey
  if (localStorage.getItem('tanq-lab-auth') === 'tester') {
    const name = localStorage.getItem('tanq-tester-name') || 'unknown'
    return `${baseKey}::t::${name}`
  }
  return baseKey
}

/** JSON.parse のボイラープレートを集約。失敗時は fallback を返す */
export function parseStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
