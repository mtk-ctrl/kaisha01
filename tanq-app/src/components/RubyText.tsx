import React from 'react'

// ふりがな（ルビ）表示の共通コンポーネント（A-6 基盤）
// `<ruby>漢字<rt>かんじ</rt></ruby>` 形式の文字列を安全に React 要素へ変換する。
// audio.ts が同じマークアップを読み上げ用に解釈するため、表記とのズレが起きない。
// dangerouslySetInnerHTML を使わず、自前パースで XSS を避ける。

const RUBY_RE = /<ruby>([^<]*)<rt>([^<]*)<\/rt><\/ruby>/g

export function RubyText({ text, className }: { text: string; className?: string }) {
  const nodes: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  // RegExp は使い回しを避けるためローカルに複製
  const re = new RegExp(RUBY_RE)
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }
    const [, base, reading] = match
    nodes.push(
      <ruby key={key++}>
        {base}
        <rt>{reading}</rt>
      </ruby>,
    )
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return <span className={className}>{nodes}</span>
}

export default RubyText
