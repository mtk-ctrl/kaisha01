import React from 'react'

// `{漢字|かんじ}` 記法のふりがなを <ruby> でレンダリングする共通コンポーネント。
// kanyoData / yojiData の furigana フィールドがこの記法を使う。
// （RubyText.tsx は `<ruby>` タグ記法用。記法が異なるため別コンポーネント）
// dangerouslySetInnerHTML は使わず自前パースで XSS を避ける。

const FURIGANA_RE = /\{([^|{}]+)\|([^|{}]+)\}/g

export function Furigana({ text, className }: { text: string; className?: string }) {
  const nodes: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  const re = new RegExp(FURIGANA_RE)
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }
    const [, base, reading] = match
    nodes.push(
      <ruby key={key++}>
        {base}
        <rt style={{ fontSize: '0.5em', fontWeight: 'normal' }}>{reading}</rt>
      </ruby>,
    )
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return <span className={className}>{nodes}</span>
}

export default Furigana
