// 25バッジ定義
// silver: タイプ初回正解で取得
// gold:   タイプ全問正解で取得

export interface Badge {
  id: string        // タイプID（A1, B1, etc.）
  name: string      // バッジ名（ひらがな）
  emoji: string
  description: string  // 何の力がつくか
  totalQuestions: number  // このタイプの総問題数
}

export const BADGES: Badge[] = [
  { id: 'A1', name: 'えをよむバッジ',          emoji: '🖼️', description: '絵を見て式が選べる力',       totalQuestions: 3 },
  { id: 'A2', name: 'ばめんそうぞうバッジ',    emoji: '📖', description: '文章から場面を想像する力',   totalQuestions: 5 },
  { id: 'A3', name: 'じょうほうよりわけバッジ', emoji: '🔍', description: '必要な情報を選び出す力',     totalQuestions: 4 },
  { id: 'A4', name: 'しきからばめんバッジ',    emoji: '🔄', description: '式から場面を逆に読む力',     totalQuestions: 4 },
  { id: 'B1', name: 'かげたんていバッジ',      emoji: '☀️', description: '太陽とかげの関係がわかる力', totalQuestions: 5 },
  { id: 'B2', name: 'そらのめバッジ',          emoji: '🦅', description: '上から見た形がわかる力',     totalQuestions: 3 },
  { id: 'B3', name: 'つみきバッジ',            emoji: '🧱', description: '積み木の数を数える力',       totalQuestions: 3 },
  { id: 'B4', name: 'かがみバッジ',            emoji: '🪞', description: '鏡に映った形がわかる力',     totalQuestions: 3 },
  { id: 'B5', name: 'めせんバッジ',            emoji: '👀', description: '人の目線から考える力',       totalQuestions: 3 },
  { id: 'C1', name: 'せいちょうバッジ',        emoji: '🦋', description: '生き物の成長順がわかる力',   totalQuestions: 4 },
  { id: 'C2', name: 'てじゅんバッジ',          emoji: '👨‍🍳', description: '物事の正しい手順がわかる力', totalQuestions: 3 },
  { id: 'C3', name: 'しぜんのながれバッジ',    emoji: '🌧️', description: '自然現象の順序がわかる力',   totalQuestions: 3 },
  { id: 'C45', name: 'まえとあとバッジ',       emoji: '⏰', description: '前後の場面を想像する力',     totalQuestions: 6 },
  { id: 'D1', name: 'どうぶつのひみつバッジ',  emoji: '🦁', description: '動物の体の理由がわかる力',   totalQuestions: 5 },
  { id: 'D2', name: 'しぜんのひみつバッジ',    emoji: '🌈', description: '自然現象の理由がわかる力',   totalQuestions: 4 },
  { id: 'D3', name: 'スポーツのなぜバッジ',    emoji: '⚽', description: 'スポーツのルールの理由がわかる力', totalQuestions: 2 },
  { id: 'D4', name: 'もしもバッジ',            emoji: '🤔', description: '「もし〜なければ？」を考える力', totalQuestions: 4 },
  { id: 'E1', name: 'はずれみっけバッジ',      emoji: '🔎', description: '仲間はずれを見つける力',     totalQuestions: 5 },
  { id: 'E2', name: 'なかまバッジ',            emoji: '💡', description: '共通点を見つける力',         totalQuestions: 4 },
  { id: 'E3', name: 'せいりバッジ',            emoji: '📂', description: '情報を仕分ける力',           totalQuestions: 3 },
  { id: 'F1', name: 'こたえからさかのぼるバッジ', emoji: '⬅️', description: '答えから場面を逆に想像する力', totalQuestions: 4 },
  { id: 'F23', name: 'いるじょうほうえらびバッジ', emoji: '🗂️', description: '必要・不要な情報を判断する力', totalQuestions: 6 },
  { id: 'G1', name: 'パターンバッジ',          emoji: '🔢', description: '数や形のパターンを見つける力', totalQuestions: 3 },
  { id: 'G2', name: 'おかしいぞバッジ',        emoji: '❗', description: 'おかしいところを見つける力',  totalQuestions: 5 },
  { id: 'G3', name: 'かんけいさがしバッジ',    emoji: '🔗', description: 'ものごとの関係を見つける力',  totalQuestions: 3 },
]

// 問題タイプ → バッジIDのマッピング（C4/C5 → C45, F2/F3 → F23 に統合）
export const TYPE_TO_BADGE: Record<string, string> = {
  A1: 'A1', A2: 'A2', A3: 'A3', A4: 'A4',
  B1: 'B1', B2: 'B2', B3: 'B3', B4: 'B4', B5: 'B5',
  C1: 'C1', C2: 'C2', C3: 'C3', C4: 'C45', C5: 'C45',
  D1: 'D1', D2: 'D2', D3: 'D3', D4: 'D4',
  E1: 'E1', E2: 'E2', E3: 'E3',
  F1: 'F1', F2: 'F23', F3: 'F23',
  G1: 'G1', G2: 'G2', G3: 'G3',
}
