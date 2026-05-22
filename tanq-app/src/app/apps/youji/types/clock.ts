/**
 * Clock App Type Definitions
 * 
 * Youji (幼稚園児向け) 時計アプリの型定義
 * - グローバル状態を廃止、useReducer で管理可能な型構造
 * - TypeScript による型安全性の確保
 */

export type ClockType = 'read' | 'ampm' | 'after' | 'before' | 'duration';
export type QuestionStyle = 'choice' | 'input' | 'mixed';
export type InputField = 'hour' | 'min' | 'dhour' | 'dmin';

export interface ClockLevel {
  id: number;
  name: string;
  desc: string;
  stars: string;
  type: ClockType;
  minStep: number;
}

export interface ClockQuestion {
  type: ClockType;
  qStyle: QuestionStyle;
  h?: number;        // 時（read, ampm用）
  m?: number;        // 分（read, ampm用）
  fromH?: number;    // 開始時刻（duration用）
  fromM?: number;
  toH?: number;      // 終了時刻（duration用）
  toM?: number;
  durationMin?: number;
  addMin?: number;   // after用
  ansH?: number;
  ansM?: number;
  subMin?: number;   // before用
}

export interface ClockAnswer {
  h?: number;
  m?: number;
  ampm?: string;
}

export interface GameState {
  level: ClockLevel;
  style: QuestionStyle;
  count: number;
  sound: boolean;
  questionIndex: number;
  questions: ClockQuestion[];
  correct: number;
  score: number;
  combo: number;
  inputField: InputField;
  inputHour: string;
  inputMin: string;
  inputDHour: string;
  inputDMin: string;
  answered: boolean;
}

export interface GameRecord {
  bestStars: number;
  bestScore: number;
  date: string;
}

export type GamePhase = 'menu' | 'level' | 'settings' | 'records' | 'game' | 'result';

export const CLOCK_LEVELS: ClockLevel[] = [
  { id: 1, name: 'ちょうど', desc: '〇じ ちょうど', stars: '⭐', type: 'read', minStep: 60 },
  { id: 2, name: 'はん', desc: '〇じはん', stars: '⭐⭐', type: 'read', minStep: 30 },
  { id: 3, name: '5ふんきざみ', desc: '5ふんごと', stars: '⭐⭐', type: 'read', minStep: 5 },
  { id: 4, name: '1ふんきざみ', desc: '1ふんごと', stars: '⭐⭐⭐', type: 'read', minStep: 1 },
  { id: 5, name: '午前・午後', desc: 'ごぜん・ごごをこたえる', stars: '⭐⭐', type: 'ampm', minStep: 5 },
  { id: 6, name: 'なんぷんご？', desc: '〇ふんごは なんじ？', stars: '⭐⭐⭐', type: 'after', minStep: 5 },
  { id: 7, name: 'なんぷんまえ？', desc: '〇ふんまえは なんじ？', stars: '⭐⭐⭐', type: 'before', minStep: 5 },
  { id: 8, name: 'かかった時間', desc: 'どれだけかかった？', stars: '⭐⭐⭐', type: 'duration', minStep: 5 },
];
