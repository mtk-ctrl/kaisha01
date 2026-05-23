/**
 * 都道府県SVGパス生成スクリプト
 * 使い方: node scripts/generate-todofuken-paths.mjs
 * 出力: src/data/todofukenPaths.ts
 *
 * データソース: jpn-atlas (国土地理院 Global Map Japan)
 * 精度: topojson-simplify threshold=0.5（111KB、試験対応品質）
 */

import { readFileSync, writeFileSync } from 'fs';
import topojson from 'topojson-client';
import simplify from 'topojson-simplify';
import { geoIdentity, geoPath } from 'd3-geo';

// ── JISコード → 都道府県ID マッピング ──────────────────────
const JIS_TO_ID = {
  '01': 'hokkaido',  '02': 'aomori',    '03': 'iwate',
  '04': 'miyagi',    '05': 'akita',     '06': 'yamagata',
  '07': 'fukushima', '08': 'ibaraki',   '09': 'tochigi',
  '10': 'gunma',     '11': 'saitama',   '12': 'chiba',
  '13': 'tokyo',     '14': 'kanagawa',  '15': 'niigata',
  '16': 'toyama',    '17': 'ishikawa',  '18': 'fukui',
  '19': 'yamanashi', '20': 'nagano',    '21': 'gifu',
  '22': 'shizuoka',  '23': 'aichi',     '24': 'mie',
  '25': 'shiga',     '26': 'kyoto',     '27': 'osaka',
  '28': 'hyogo',     '29': 'nara',      '30': 'wakayama',
  '31': 'tottori',   '32': 'shimane',   '33': 'okayama',
  '34': 'hiroshima', '35': 'yamaguchi', '36': 'tokushima',
  '37': 'kagawa',    '38': 'ehime',     '39': 'kochi',
  '40': 'fukuoka',   '41': 'saga',      '42': 'nagasaki',
  '43': 'kumamoto',  '44': 'oita',      '45': 'miyazaki',
  '46': 'kagoshima', '47': 'okinawa',
};

// ── TopoJSONの読み込みと簡略化 ─────────────────────────────
const atlasRaw = JSON.parse(
  readFileSync(new URL('../node_modules/jpn-atlas/japan/japan.json', import.meta.url))
);

const simplified = simplify.simplify(simplify.presimplify(atlasRaw), 0.5);
const prefFeatures = topojson.feature(simplified, simplified.objects.prefectures);

// ── 全国地図用パス（852×650ビューボックス） ──────────────────
const projFull = geoIdentity().reflectY(false).fitSize([852, 650], prefFeatures);
const pathGenFull = geoPath(projFull);

// ── 個別形状用パス（各都道府県を260×260にfit、300×300ビューボックス内）
const SHAPE_SIZE = 260;
const SHAPE_OFFSET = 20; // padding

function generateShapePath(feature) {
  const proj = geoIdentity()
    .reflectY(false)
    .fitSize([SHAPE_SIZE, SHAPE_SIZE], feature)
    .translate([
      projFull.translate()[0], // dummy, overridden by fitSize
      projFull.translate()[1],
    ]);
  // fitExtent で padding を適用
  const projPadded = geoIdentity()
    .reflectY(false)
    .fitExtent([[SHAPE_OFFSET, SHAPE_OFFSET], [SHAPE_OFFSET + SHAPE_SIZE, SHAPE_OFFSET + SHAPE_SIZE]], feature);
  return geoPath(projPadded)(feature);
}

// ── パスを生成して出力オブジェクトに収集 ──────────────────────
const paths = {};
let totalMapSize = 0;
let totalShapeSize = 0;

for (const feature of prefFeatures.features) {
  const jis = feature.id;
  const id = JIS_TO_ID[jis];
  if (!id) {
    console.warn(`Unknown JIS code: ${jis}`);
    continue;
  }

  const mapPath = pathGenFull(feature) || '';
  const shapePath = generateShapePath(feature) || '';

  paths[id] = {
    jis,
    mapPath,    // 全国地図用（852×650 viewBox）
    shapePath,  // 個別形状用（300×300 viewBox）
  };

  totalMapSize += mapPath.length;
  totalShapeSize += shapePath.length;
  console.log(`${jis} ${id.padEnd(12)} map:${(mapPath.length/1024).toFixed(1)}KB shape:${(shapePath.length/1024).toFixed(1)}KB`);
}

console.log('\n=== 合計 ===');
console.log(`地図用パス: ${(totalMapSize/1024).toFixed(0)}KB`);
console.log(`形状用パス: ${(totalShapeSize/1024).toFixed(0)}KB`);
console.log(`合計: ${((totalMapSize + totalShapeSize)/1024).toFixed(0)}KB`);

// ── TypeScript ファイルとして出力 ──────────────────────────────
const tsContent = `// 自動生成ファイル — scripts/generate-todofuken-paths.mjs で再生成
// データソース: jpn-atlas (国土地理院 Global Map Japan)
// 全国地図ビューボックス: 852×650 / 形状ビューボックス: 300×300

export type PrefPath = {
  jis: string     // JIS都道府県コード (01〜47)
  mapPath: string // 全国地図用SVGパス (852×650 viewBox)
  shapePath: string // 個別形状用SVGパス (300×300 viewBox)
}

export const PREF_PATHS: Record<string, PrefPath> = ${JSON.stringify(paths, null, 2)}
`;

const outPath = new URL('../src/data/todofukenPaths.ts', import.meta.url);
writeFileSync(outPath, tsContent);
console.log(`\n✅ 出力: src/data/todofukenPaths.ts`);
