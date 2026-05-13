// 文部科学省 学年別漢字配当表（2020年施行）に基づく配当漢字データ
// 各学年ファイルは src/data/kanji/ 以下に分割管理

export type { Grade, KanjiEntry } from './kanji/index'

import type { Grade, KanjiEntry } from './kanji/index'
import { grade1Kanji } from './kanji/grade1'
import { grade2Kanji } from './kanji/grade2'
import { grade3Kanji } from './kanji/grade3'
import { grade4Kanji } from './kanji/grade4'
import { grade5Kanji } from './kanji/grade5'
import { grade6Kanji } from './kanji/grade6'

export const KANJI_DATA: Record<Grade, KanjiEntry[]> = {
  '小1': grade1Kanji,
  '小2': grade2Kanji,
  '小3': grade3Kanji,
  '小4': grade4Kanji,
  '小5': grade5Kanji,
  '小6': grade6Kanji,
}
