// ようちえん かんがえるジム — 10バッジ定義

export interface YoujiBadge {
  id: string
  name: string
  emoji: string
  description: string
  totalQuestions: number
}

export const YOUJI_BADGES: YoujiBadge[] = [
  { id: 'Y1', name: 'かぞえるバッジ',       emoji: '🔢', description: 'かずをかぞえるちから',           totalQuestions: 7 },
  { id: 'Y2', name: 'くらべるバッジ',       emoji: '⚖️', description: 'おおきさをくらべるちから',       totalQuestions: 5 },
  { id: 'Y3', name: 'いろはかせバッジ',     emoji: '🎨', description: 'いろをしるちから',               totalQuestions: 5 },
  { id: 'Y4', name: 'なかまはずれバッジ',   emoji: '🔎', description: 'なかまはずれをみつけるちから',   totalQuestions: 5 },
  { id: 'Y5', name: 'つぎはなにバッジ',     emoji: '🔮', description: 'つぎをよそうするちから',         totalQuestions: 5 },
  { id: 'Y6', name: 'どうぶつはかせバッジ', emoji: '🐾', description: 'どうぶつのことをしるちから',     totalQuestions: 6 },
  { id: 'Y7', name: 'どこどこバッジ',       emoji: '📍', description: 'ばしょをしるちから',             totalQuestions: 5 },
  { id: 'Y8', name: 'かたちはかせバッジ',   emoji: '🔷', description: 'かたちをしるちから',             totalQuestions: 4 },
  { id: 'Y9', name: 'おかしいぞバッジ',     emoji: '❗', description: 'おかしいところをみつけるちから', totalQuestions: 4 },
  { id: 'Y10', name: 'しぜんはかせバッジ',  emoji: '🌿', description: 'しぜんのふしぎをしるちから',     totalQuestions: 4 },
]

export const YOUJI_TYPE_TO_BADGE: Record<string, string> = {
  Y1: 'Y1', Y2: 'Y2', Y3: 'Y3', Y4: 'Y4', Y5: 'Y5',
  Y6: 'Y6', Y7: 'Y7', Y8: 'Y8', Y9: 'Y9', Y10: 'Y10',
}
