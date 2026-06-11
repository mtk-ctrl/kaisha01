// 国語系クイズ（kokugo / kanyo / yoji）の共通ヘルパー

/** Fisher–Yates シャッフル（sort(() => Math.random() - 0.5) は偏るため使わない） */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * 1回目のまちがいで出す「考える足場」ヒント。
 * 答え（正解の選択肢）そのものは見せず、解説に含まれる使用例の文脈から
 * 「どんな場面で使う言葉か」を考えてもらう。
 * 解説文は「〜〜」のように…の形式が多いので、最初のカギかっこ内を使用例として取り出す。
 */
export function getUsageHint(explain: string): string {
  const m = explain.match(/「([^」]+)」/)
  if (m) {
    return `こんなふうに使うよ →「${m[1]}」。この文に合う意味はどれかな？`
  }
  return 'どんな場面で使う言葉か、そうぞうしてみよう！'
}
