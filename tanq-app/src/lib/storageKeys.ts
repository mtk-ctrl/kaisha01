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
  HIRAGANA_BEST:    'tanq_hiragana_best_v1',
  JUUCOMBO_BEST:    'tanq_juucombo_best_v1',
  MATH_YOUJI_BEST:  'tanq_math_youji_best_v1',
  IRO_RECORDS:      'tanq_iro_records_v1',
  YOUJI_KANJI_BEST: 'tanq_youji_kanji_best_v1',
  KUKU_RECORDS:     'tanq_kuku_records_v1',
  CLOCK_RECORDS:    'tanq_clock_records_v1',
  ZOKUSEI_RECORDS:  'tanq_zokusei_records_v1',
  ROMAJI_RECORDS:   'tanq_romaji_records_v1',
  KOUBAI_RECORDS:   'tanq_koubai_records_v1',
} as const
