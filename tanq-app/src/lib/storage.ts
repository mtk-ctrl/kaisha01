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
