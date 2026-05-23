/**
 * 既存 data.js を TypeScript に変換 + 難易度フィールド追加
 * 出力: src/data/todofukenData.ts
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

// data.js を読み込んで PREFECTURES 配列を eval で取得
const dataJs = readFileSync(join(__dir, '../public/youji/apps/todofuken/data.js'), 'utf8');
// strip the "const PREFECTURES = " and trailing code after the array
const match = dataJs.match(/const PREFECTURES = (\[[\s\S]+?\]);/);
if (!match) throw new Error('PREFECTURES not found');

// Safe eval via Function
const PREFECTURES = Function('return ' + match[1])();
console.log(`Loaded ${PREFECTURES.length} prefectures`);

// 県名≠県庁所在地 の18県（首都クイズで重点出題）
const CAPITAL_DIFFERS = new Set([
  'iwate','miyagi','akita','ibaraki','tochigi','gunma',
  'kanagawa','niigata','ishikawa','yamanashi','aichi',
  'mie','hyogo','shimane','kagawa','kochi','saga','kagoshima'
]);

// 地方順序
const REGION_ORDER = ['北海道','東北','関東','中部','近畿','中国','四国','九州','沖縄'];

// 既存の famous を難易度1（かんたん）として扱い、TypeScript 型付きオブジェクトに変換
const prefData = PREFECTURES.map(p => ({
  id: p.id,
  jis: String(PREFECTURES.indexOf(p) + 1).padStart(2, '0'),
  name: p.name,
  kana: p.kana,
  capital: p.capital,
  capitalKana: p.capitalKana,
  capitalDiffers: CAPITAL_DIFFERS.has(p.id),
  region: p.region,
  regionColor: p.regionColor,
  emoji: p.emoji,
  // famous: 既存データは難易度1として移行。難易度2・3はKenが後で追加
  famous: (p.famous || []).map(f => ({
    name: f.name,
    emoji: f.emoji,
    difficulty: 1,
    note: '',
  })),
  fact: p.fact || '',
}));

// TypeScript 出力
const ts = `// 都道府県データ — scripts/convert-todofuken-data.mjs で生成
// 名物データ: 難易度1は既存データより移行。難易度2・3はKenが追加予定
// SVGパス: src/data/todofukenPaths.ts を参照

export type FamousItem = {
  name: string
  emoji: string
  difficulty: 1 | 2 | 3   // 1=かんたん 2=ふつう(日本一系) 3=むずかしい(中学受験)
  note: string             // 答え合わせの解説文
}

export type Prefecture = {
  id: string          // 英語ID (hokkaido 等)
  jis: string         // JISコード (01〜47)
  name: string        // 都道府県名 (漢字)
  kana: string        // 読み (ひらがな)
  capital: string     // 県庁所在地 (漢字)
  capitalKana: string // 県庁所在地の読み
  capitalDiffers: boolean // 県名と県庁所在地が異なるか（18県）
  region: string      // 地方名
  regionColor: string // 地方カラー
  emoji: string       // 代表絵文字
  famous: FamousItem[]
  fact: string        // 豆知識（フラッシュカード裏面）
}

export const PREFECTURES: Prefecture[] = ${JSON.stringify(prefData, null, 2)}

// 地方グループ
export const REGIONS = ['北海道','東北','関東','中部','近畿','中国','四国','九州','沖縄'] as const
export type Region = typeof REGIONS[number]

export function getPrefecturesByRegion(region: Region): Prefecture[] {
  return PREFECTURES.filter(p => p.region === region)
}

export function getPrefectureById(id: string): Prefecture | undefined {
  return PREFECTURES.find(p => p.id === id)
}

// 県庁所在地が県名と異なる都道府県（クイズで重点出題）
export const CAPITAL_DIFFERS_PREFS = PREFECTURES.filter(p => p.capitalDiffers)
`;

const outPath = join(__dir, '../src/data/todofukenData.ts');
writeFileSync(outPath, ts);
console.log('✅ src/data/todofukenData.ts を生成しました');
console.log('  capitalDiffers 都道府県:', prefData.filter(p => p.capitalDiffers).map(p => p.name).join('、'));
