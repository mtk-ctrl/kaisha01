import { readFileSync } from 'fs';
import topojson from 'topojson-client';
import simplify from 'topojson-simplify';
import { geoIdentity, geoPath } from 'd3-geo';

const atlas = JSON.parse(readFileSync('./node_modules/jpn-atlas/japan/japan.json', 'utf8'));

// Simplify: planarTriangleArea threshold — higher = more simplification
// Try a few thresholds and measure resulting path sizes
for (const threshold of [0.1, 0.5, 1.0, 2.0]) {
  const simplified = simplify.simplify(
    simplify.presimplify(structuredClone(atlas)),
    threshold
  );
  const prefFeatures = topojson.feature(simplified, simplified.objects.prefectures);
  const proj = geoIdentity().reflectY(false).fitSize([852, 650], prefFeatures);
  const pathGen = geoPath(proj);

  let total = 0;
  let maxLen = 0;
  let maxId = '';
  prefFeatures.features.forEach(f => {
    const d = pathGen(f);
    const len = d?.length || 0;
    total += len;
    if (len > maxLen) { maxLen = len; maxId = f.id; }
  });
  console.log(`threshold=${threshold}: total=${(total/1024).toFixed(0)}KB  max=${maxId}(${(maxLen/1024).toFixed(0)}KB)`);
}
