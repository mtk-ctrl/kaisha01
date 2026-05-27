// localStorage キーをここで一元管理する
// 新アプリ追加時はここにキーを追加するだけでよい

export const STORAGE_KEYS = {
  // Auth — getDataKey 不要（ユーザー共通）
  LAB_AUTH:     'tanq-lab-auth',
  TESTER_NAME:  'tanq-tester-name',

  // Profile — getDataKey 不要
  PROFILE: 'tanq_profile_v1',

  // SRS ストア — getDataKey 必須
  KANJI_SRS:   'tanq_kanji_srs_v1',
  ENGLISH_SRS: 'tanq_english_srs_v1',
  WORDMATH_SRS:'tanq_wordmath_srs_v1',
  SCIENCE_SRS: 'tanq_science_srs_v1',

  // 進捗ストア — getDataKey 必須
  KOKUGO:         'tanq_kokugo_v1',
  KANYO:          'tanq_kanyo_v1',
  YOJI:           'tanq_yoji_v1',
  THINKING:       'tanq_thinking_progress_v1',
  THINKING_YOUJI: 'tanq_thinking_youji_progress_v1',
  CODING_CLEARED: 'tanq_coding_cleared_v1',
  JUKU:           'tanq_juku_progress_v1',

  // ベストスコア — getDataKey 必須
  MATH_BEST:   'tanq_math_best_v1',
  CLOCK_BEST:  'tanq_clock_best_v1',
  SHAPES_BEST: 'tanq_shapes_best_v1',

  // 連続記録 — getDataKey 必須
  KANJI_STREAK:   'tanq_kanji_streak_v1',
  ENGLISH_STREAK: 'tanq_english_streak_v1',
  WORDMATH_STREAK:'tanq_wordmath_streak_v1',

  // youji アプリ記録 — getDataKey 必須
  KATAKANA_RECORDS: 'tanq_katakana_records_v1',
  ANIMALS_BEST:     'tanq_animals_best_v1',
} as const
