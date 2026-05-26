// SRS（間隔反復）関連の共通型定義

/** 基本 SRS ボックス: 0=未学習 / 1=学習中 / 2=習得済み */
export interface SRSItem {
  b: 0 | 1 | 2
}

/** 詳細 SRS（science などで使用）*/
export interface SRSItemFull extends SRSItem {
  c: number  // 正解回数
  t: number  // 最終出題タイムスタンプ (ms)
}

export type StarRating = 0 | 1 | 2 | 3

export interface LevelSave {
  levelStars: Record<number, StarRating>
}
