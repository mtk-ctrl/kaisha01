// 都道府県GeoJSON → data.js SVGポイント変換スクリプト
// 使い方: node scripts/generate-prefecture-shapes.js

const https = require('https');
const fs = require('fs');
const path = require('path');

const GEOJSON_URL = 'https://raw.githubusercontent.com/dataofjapan/land/master/japan.geojson';
const DATA_JS_PATH = path.join(__dirname, '../tanq-app/public/youji/apps/todofuken/data.js');
const PREVIEW_PATH = path.join(__dirname, 'prefecture-shapes-preview.json');

// data.jsコメントと同じ変換式
function lonLatToSvg(lon, lat) {
  return {
    x: (lon - 129) / 17 * 600,
    y: (46 - lat) / 16 * 760
  };
}

function perpDist(pt, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return Math.sqrt((pt.x - a.x) ** 2 + (pt.y - a.y) ** 2);
  return Math.abs(dx * (a.y - pt.y) - (a.x - pt.x) * dy) / len;
}

// Ramer-Douglas-Peucker 間引きアルゴリズム
function rdp(pts, eps) {
  if (pts.length < 3) return pts;
  let maxD = 0, maxI = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = perpDist(pts[i], pts[0], pts[pts.length - 1]);
    if (d > maxD) { maxD = d; maxI = i; }
  }
  if (maxD > eps) {
    const L = rdp(pts.slice(0, maxI + 1), eps);
    const R = rdp(pts.slice(maxI), eps);
    return [...L.slice(0, -1), ...R];
  }
  return [pts[0], pts[pts.length - 1]];
}

function polyArea(ring) {
  let a = 0;
  for (let i = 0; i < ring.length - 1; i++)
    a += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  return Math.abs(a / 2);
}

// MultiPolygonの場合は最大ポリゴン（本土）を取得
function getLargestRing(geom) {
  if (geom.type === 'Polygon') return geom.coordinates[0];
  let best = null, bestArea = 0;
  for (const poly of geom.coordinates) {
    const a = polyArea(poly[0]);
    if (a > bestArea) { bestArea = a; best = poly[0]; }
  }
  return best;
}

// GeoJSONの県名 → data.jsのname に合わせる（県/都/府 除去、北海道はそのまま）
function normalizeName(n) {
  return n.replace(/[県都府]$/, '');
}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let buf = '';
      res.on('data', c => buf += c);
      res.on('end', () => { try { resolve(JSON.parse(buf)); } catch (e) { reject(e); } });
    }).on('error', reject);
  });
}

async function main() {
  console.log('GeoJSONをフェッチ中...');
  console.log(`URL: ${GEOJSON_URL}\n`);

  const geojson = await fetchJSON(GEOJSON_URL);
  const props0 = geojson.features[0].properties;
  const nameCol = 'nam_ja' in props0 ? 'nam_ja' : ('name' in props0 ? 'name' : Object.keys(props0)[0]);
  console.log(`名前フィールド: ${nameCol} (例: "${props0[nameCol]}")\n`);

  const shapeMap = {};

  for (const f of geojson.features) {
    const rawName = String(f.properties[nameCol] || '');
    const name = normalizeName(rawName);
    const ring = getLargestRing(f.geometry);
    if (!ring) { console.warn(`  スキップ: ${name} (ポリゴンなし)`); continue; }

    const svgPts = ring.map(([lon, lat]) => lonLatToSvg(lon, lat));
    const simplified = rdp(svgPts, 1.5);
    const pointsStr = simplified.map(p => `${Math.round(p.x)},${Math.round(p.y)}`).join(' ');

    shapeMap[name] = pointsStr;
    process.stdout.write(`  ${name.padEnd(5)}: ${String(svgPts.length).padStart(4)}点 → ${String(simplified.length).padStart(3)}点\n`);
  }

  fs.writeFileSync(PREVIEW_PATH, JSON.stringify(shapeMap, null, 2), 'utf-8');
  console.log(`\nプレビュー保存: ${PREVIEW_PATH}`);
  console.log(`取得件数: ${Object.keys(shapeMap).length}件\n`);

  // data.js の points: '...' を置換
  let src = fs.readFileSync(DATA_JS_PATH, 'utf-8');
  let replaced = 0;
  const notFound = [];

  for (const [name, pts] of Object.entries(shapeMap)) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // name: 'X' から 600文字以内の points: '...' を対象にする
    const re = new RegExp(
      `(name:\\s*'${escaped}'[\\s\\S]{0,600}?points:\\s*')[^']+(')`,
      'g'
    );
    const before = src;
    src = src.replace(re, `$1${pts}$2`);
    if (src !== before) {
      replaced++;
    } else {
      notFound.push(name);
    }
  }

  fs.writeFileSync(DATA_JS_PATH, src, 'utf-8');
  console.log(`data.js 更新: ${replaced}件置換`);
  if (notFound.length) {
    console.warn(`マッチなし (data.jsに存在しない or 名前不一致): ${notFound.join(', ')}`);
  }

  console.log('\n完了。');
}

main().catch(e => { console.error('エラー:', e); process.exit(1); });
