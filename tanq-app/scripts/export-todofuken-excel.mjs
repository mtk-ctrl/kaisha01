/**
 * 都道府県めいぶつデータをExcelに書き出す
 * 使い方: node scripts/export-todofuken-excel.mjs
 * 出力: scripts/todofuken-data.xlsx
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import xlsx from 'xlsx';

const __dir = dirname(fileURLToPath(import.meta.url));

// ── 1. TypeScriptファイルから都道府県データを抽出 ─────────────────
const tsContent = readFileSync(join(__dir, '../src/data/todofukenData.ts'), 'utf-8');

// prefectures配列をJSONとして抽出（PREFECTURES = [...] の部分）
const arrMatch = tsContent.match(/export const PREFECTURES: Prefecture\[\] = (\[[\s\S]*?\])\n\n/);
if (!arrMatch) throw new Error('PREFECTURES array not found');
const PREFECTURES = JSON.parse(arrMatch[1]);

// ── 2. 難易度2・3の追加データ ──────────────────────────────────────
// 各都道府県のID => 追加アイテム配列
const EXTRA = {
  hokkaido: [
    { name: '面積日本一', emoji: '📐', difficulty: 2, note: '都道府県で最も広い。四国の約2.2倍' },
    { name: '牛乳・乳製品生産量日本一', emoji: '🐄', difficulty: 2, note: '根釧台地・十勝平野の酪農が日本最大' },
    { name: '知床（世界自然遺産）', emoji: '🦅', difficulty: 2, note: '2005年にユネスコ世界自然遺産に登録' },
    { name: '石狩平野', emoji: '🌾', difficulty: 2, note: '北海道最大の平野。米作地帯' },
    { name: 'アイヌ民族', emoji: '🏹', difficulty: 3, note: '北海道の先住民族。独自の言語・文化を持つ' },
    { name: '大雪山系', emoji: '⛰️', difficulty: 3, note: '北海道最高峰・旭岳（2291m）を含む山群' },
  ],
  aomori: [
    { name: 'りんご生産量日本一', emoji: '🍎', difficulty: 2, note: '全国シェア約60%。津軽平野が主産地' },
    { name: '本州最北端（大間岬）', emoji: '📍', difficulty: 2, note: '大間崎は本州の最北端。マグロ一本釣りで有名' },
    { name: '白神山地（世界自然遺産）', emoji: '🌲', difficulty: 2, note: 'ブナの原生林。1993年世界自然遺産登録' },
    { name: '三内丸山遺跡', emoji: '🏛️', difficulty: 3, note: '日本最大級の縄文時代集落跡（約5500〜4000年前）。世界文化遺産' },
    { name: '青函トンネル', emoji: '🚇', difficulty: 3, note: '津軽海峡の海底を通る世界最長級の鉄道トンネル（全長53.85km）' },
  ],
  iwate: [
    { name: '面積全国2位', emoji: '📐', difficulty: 2, note: '北海道に次ぐ広さ。四国とほぼ同じ' },
    { name: '三陸海岸（リアス海岸）', emoji: '🌊', difficulty: 2, note: '入り組んだ地形で養殖業が盛ん' },
    { name: '北上川', emoji: '🏞️', difficulty: 2, note: '東北最長の川。流域に北上平野が広がる' },
    { name: '南部鉄器', emoji: '⚙️', difficulty: 2, note: '伝統工芸品。急須・フライパンなど世界で人気' },
    { name: '平泉（世界文化遺産）', emoji: '🏯', difficulty: 3, note: '中尊寺金色堂（1124年建立）。藤原氏の都。2011年世界文化遺産' },
    { name: '東日本大震災の津波被害', emoji: '🌊', difficulty: 3, note: '2011年3月11日。三陸海岸が甚大な被害' },
  ],
  miyagi: [
    { name: '松島（日本三景）', emoji: '🏝️', difficulty: 2, note: '260余の島が浮かぶ景勝地。日本三景のひとつ' },
    { name: 'カキ（牡蠣）養殖', emoji: '🦪', difficulty: 2, note: '三陸の養殖カキは日本有数の生産量' },
    { name: '仙台平野・ひとめぼれ', emoji: '🌾', difficulty: 2, note: '東北最大の平野。ブランド米「ひとめぼれ」の産地' },
    { name: '東日本大震災（2011年）', emoji: '🌊', difficulty: 3, note: 'M9.0の巨大地震と津波。約2万人が犠牲に' },
    { name: '伊達政宗（仙台藩）', emoji: '⚔️', difficulty: 3, note: '「独眼竜」仙台藩初代藩主。仙台城（青葉城）を築く' },
  ],
  akita: [
    { name: '八郎潟（日本最大の干拓地）', emoji: '🌿', difficulty: 2, note: 'かつて日本第2位の湖。戦後に干拓され大潟村に' },
    { name: '白神山地（世界自然遺産）', emoji: '🌲', difficulty: 2, note: '青森と跨るブナ原生林。1993年世界自然遺産' },
    { name: '秋田杉（日本三大美林）', emoji: '🌲', difficulty: 2, note: '木曽ヒノキ・青森ヒバと並ぶ日本三大美林のひとつ' },
    { name: '大潟村（干拓の歴史）', emoji: '🏗️', difficulty: 3, note: '八郎潟を干拓した村。当時の農業政策と減反問題の象徴' },
    { name: '人口減少・少子高齢化', emoji: '📉', difficulty: 3, note: '高齢化率が全国トップ水準。人口減少が最も進む県のひとつ' },
  ],
  yamagata: [
    { name: 'さくらんぼ生産量日本一', emoji: '🍒', difficulty: 2, note: '全国シェア約70%。山形盆地が主産地' },
    { name: '最上川', emoji: '🌊', difficulty: 2, note: '山形県のほぼ全域を流れる川。芭蕉の俳句「五月雨をあつめて早し最上川」' },
    { name: '西洋なし（ラ・フランス）生産量日本一', emoji: '🍐', difficulty: 2, note: '全国シェア約70%。山形県が発祥の地' },
    { name: '上杉鷹山（米沢藩）', emoji: '👑', difficulty: 3, note: '財政危機の藩を立て直した名君。ケネディ大統領が尊敬した日本人' },
    { name: '出羽三山', emoji: '⛰️', difficulty: 3, note: '羽黒山・月山・湯殿山。修験道の聖地' },
  ],
  fukushima: [
    { name: '猪苗代湖（日本第4位の湖）', emoji: '🏞️', difficulty: 2, note: '面積104km²。日本で4番目に大きい湖' },
    { name: '磐梯山（活火山）', emoji: '🌋', difficulty: 2, note: '1888年に大爆発した活火山。「会津富士」とも呼ばれる' },
    { name: 'もも・なし生産上位', emoji: '🍑', difficulty: 2, note: '福島盆地は全国有数の果物産地' },
    { name: '東日本大震災・原発事故（2011年）', emoji: '☢️', difficulty: 3, note: '東京電力福島第一原発が事故。広範囲に避難区域が設定された' },
    { name: '会津藩（戊辰戦争）', emoji: '⚔️', difficulty: 3, note: '明治維新の際、新政府軍と戦った藩。会津若松城が舞台' },
  ],
  ibaraki: [
    { name: 'メロン生産量日本一', emoji: '🍈', difficulty: 2, note: '鉾田市など水はけのよい砂地で栽培。全国シェア約25%' },
    { name: 'レンコン生産量日本一', emoji: '🌿', difficulty: 2, note: '霞ヶ浦周辺の水田地帯で全国シェア約50%' },
    { name: '霞ヶ浦（日本第2位の湖）', emoji: '🏞️', difficulty: 2, note: '面積約220km²。琵琶湖に次いで日本で2番目に大きい' },
    { name: '筑波研究学園都市', emoji: '🔬', difficulty: 2, note: '国の研究機関・大学が集まる科学都市' },
    { name: '足尾銅山鉱毒事件', emoji: '⚠️', difficulty: 3, note: '日本初の公害問題（明治時代）。渡良瀬川流域の農地・漁業に被害' },
    { name: '田中正造', emoji: '👨', difficulty: 3, note: '足尾鉱毒問題を天皇に直訴した政治家。日本の公害運動の原点' },
  ],
  tochigi: [
    { name: 'いちご生産量日本一', emoji: '🍓', difficulty: 2, note: '全国シェア約15%。とちおとめ・スカイベリーが有名' },
    { name: '那須岳（活火山群）', emoji: '🌋', difficulty: 2, note: '栃木北部の活火山群。観光地・牧場が広がる' },
    { name: '鬼怒川温泉', emoji: '♨️', difficulty: 2, note: '日光国立公園内の温泉地' },
    { name: '足尾銅山鉱毒事件', emoji: '⚠️', difficulty: 3, note: '日本初の公害問題。栃木の渡良瀬川流域が最大の被害地' },
    { name: '田中正造', emoji: '👨', difficulty: 3, note: '足尾鉱毒問題を天皇に直訴した政治家（栃木県選出の代議士）' },
  ],
  gunma: [
    { name: 'キャベツ生産量日本一', emoji: '🥬', difficulty: 2, note: '嬬恋村は夏キャベツの全国最大産地' },
    { name: '富岡製糸場（世界文化遺産）', emoji: '🏭', difficulty: 2, note: '1872年設立の官営工場。2014年世界文化遺産登録' },
    { name: '利根川の源流', emoji: '🏔️', difficulty: 2, note: '「坂東太郎」と呼ばれる日本最大流域面積の川の源流が群馬にある' },
    { name: '富岡製糸場と絹産業遺産群', emoji: '🧵', difficulty: 3, note: 'フランスの技術を導入した官営工場。日本の近代産業化の象徴' },
    { name: '上州のからっ風', emoji: '💨', difficulty: 3, note: '冬に吹く乾燥した北西風。「上州名物かかあ天下とからっ風」' },
  ],
  saitama: [
    { name: '内陸県（海なし県）', emoji: '🗺️', difficulty: 2, note: '海に面していない8都県のひとつ' },
    { name: '深谷ねぎ生産全国上位', emoji: '🌱', difficulty: 2, note: '深谷市は全国有数のねぎ産地。渋沢栄一の出身地' },
    { name: '荒川', emoji: '🌊', difficulty: 2, note: '秩父山地を源流とし東京湾に注ぐ。流域に川越など歴史ある街' },
    { name: '渋沢栄一（深谷市出身）', emoji: '💴', difficulty: 3, note: '日本資本主義の父。2024年発行の新一万円札の肖像' },
    { name: '関東平野の中心・首都圏', emoji: '🏙️', difficulty: 3, note: '東京のベッドタウンとして発展。人口は全国5位前後' },
  ],
  chiba: [
    { name: '落花生（ピーナッツ）生産量日本一', emoji: '🥜', difficulty: 2, note: '全国シェア約80%。八街市が主産地' },
    { name: 'なし生産量日本一（時期による）', emoji: '🍐', difficulty: 2, note: '市川・松戸・白井などが産地。「幸水」「豊水」が有名' },
    { name: '九十九里浜', emoji: '🏖️', difficulty: 2, note: '約66kmの砂浜海岸。日本の代表的砂浜のひとつ' },
    { name: '成田国際空港', emoji: '✈️', difficulty: 2, note: '国際線の発着数が多い日本最大級の国際空港' },
    { name: '房総半島', emoji: '🗺️', difficulty: 3, note: '太平洋と東京湾に挟まれた半島。温暖な気候で野菜の促成栽培' },
  ],
  tokyo: [
    { name: '日本の首都・最大都市', emoji: '🏙️', difficulty: 2, note: '人口約1400万人（都のみ）。周辺含む首都圏は約3500万人' },
    { name: '小笠原諸島（世界自然遺産）', emoji: '🏝️', difficulty: 2, note: '東京から約1000km南。2011年世界自然遺産登録。固有種が多い' },
    { name: '東京湾（埋め立て地）', emoji: '🌊', difficulty: 2, note: '江戸時代から埋め立てで拡大。羽田空港も埋め立て地' },
    { name: '小笠原諸島の固有種', emoji: '🦎', difficulty: 3, note: '大陸と一度も陸続きになったことがない海洋島。固有種・固有亜種の宝庫' },
    { name: '江戸幕府（1603〜1868年）', emoji: '🏯', difficulty: 3, note: '徳川家康が開いた幕府。江戸（現東京）を中心に265年間続いた' },
  ],
  kanagawa: [
    { name: '横浜市（人口日本一の市）', emoji: '🏙️', difficulty: 2, note: '人口約380万人。全国の市の中で最多（政令指定都市）' },
    { name: '箱根温泉・関所', emoji: '♨️', difficulty: 2, note: '江戸時代の東海道の難所「箱根の関」。現在も温泉地として有名' },
    { name: '相模川・多摩川', emoji: '🏞️', difficulty: 2, note: '神奈川県内を流れる主要な川' },
    { name: '黒船来航・横浜開港（1853・1859年）', emoji: '⛵', difficulty: 3, note: 'ペリーが浦賀に来航。横浜港が開港し文明開化が始まる' },
    { name: '横須賀（米軍基地）', emoji: '🚢', difficulty: 3, note: '日米安保条約に基づく米海軍基地が置かれる' },
  ],
  niigata: [
    { name: 'コシヒカリ（米）生産量日本一', emoji: '🌾', difficulty: 2, note: '越後平野が主産地。コシヒカリ発祥の地（育成は新潟・長野）' },
    { name: '信濃川（日本最長の川）', emoji: '🏞️', difficulty: 2, note: '全長367km。長野県では千曲川と呼ばれる' },
    { name: '佐渡島・トキ', emoji: '🦢', difficulty: 2, note: '国の特別天然記念物トキを保護・繁殖。佐渡金山も有名' },
    { name: '新潟水俣病（四大公害病）', emoji: '⚠️', difficulty: 3, note: '阿賀野川流域で発生した有機水銀中毒（第二水俣病）。昭和電工が原因' },
    { name: '上越・中越・下越の区分', emoji: '🗺️', difficulty: 3, note: '新潟を3地域に分ける呼び方。上越市・中越地震など' },
  ],
  toyama: [
    { name: '黒部ダム（日本一高いアーチ式）', emoji: '🏗️', difficulty: 2, note: '高さ186m。1963年完成。日本最高のアーチ式ダム' },
    { name: '立山連峰（3000m級）', emoji: '⛰️', difficulty: 2, note: '富山湾から立山（3015m）まで標高差が一気に3000m以上' },
    { name: '富山湾（天然の生け簀）', emoji: '🐟', difficulty: 2, note: '深海魚・ホタルイカ・ブリが獲れる。水深1000m超の湾' },
    { name: 'イタイイタイ病（四大公害病）', emoji: '⚠️', difficulty: 3, note: '神通川流域でカドミウム中毒により発生。神岡鉱山（岐阜県）が原因' },
    { name: '北前船の寄港地', emoji: '⛵', difficulty: 3, note: '江戸〜明治時代、大阪〜北海道の海上交易で栄えた' },
  ],
  ishikawa: [
    { name: '兼六園（日本三名園）', emoji: '🌸', difficulty: 2, note: '江戸時代に加賀藩が整備した大名庭園。水戸偕楽園・岡山後楽園と並ぶ' },
    { name: '輪島塗', emoji: '🏺', difficulty: 2, note: '日本を代表する漆器。国の重要無形文化財' },
    { name: '能登半島', emoji: '🗺️', difficulty: 2, note: '日本海に突き出た半島。能登半島国定公園' },
    { name: '加賀百万石（前田家）', emoji: '🏯', difficulty: 3, note: '徳川家に次ぐ大藩。金沢城を中心に文化が栄えた' },
    { name: '能登半島地震（2024年）', emoji: '🌍', difficulty: 3, note: '2024年1月1日に発生したM7.6の地震。甚大な被害' },
  ],
  fukui: [
    { name: '眼鏡フレーム生産量日本一', emoji: '👓', difficulty: 2, note: '鯖江市が全国シェア約96%。世界有数の産地' },
    { name: '恐竜化石の産地', emoji: '🦕', difficulty: 2, note: '勝山市で多数の恐竜化石が発見。県立恐竜博物館は世界三大恐竜博物館' },
    { name: '東尋坊', emoji: '🌊', difficulty: 2, note: '柱状節理の断崖絶壁が続く海岸。国の天然記念物' },
    { name: '越前ガニ（ズワイガニ）', emoji: '🦀', difficulty: 2, note: '日本海の冬の味覚。オスのズワイガニのブランド名' },
    { name: '一乗谷朝倉氏遺跡', emoji: '🏯', difficulty: 3, note: '戦国時代の城下町跡。朝倉氏5代が栄えた（1471〜1573年）' },
  ],
  yamanashi: [
    { name: 'ぶどう生産量日本一', emoji: '🍇', difficulty: 2, note: '甲府盆地が主産地。巨峰・甲州ぶどうが有名' },
    { name: '富士山（日本最高峰3776m）', emoji: '🗻', difficulty: 2, note: '静岡県と跨る成層火山。2013年世界文化遺産登録' },
    { name: '甲府盆地（フルーツ王国）', emoji: '🍑', difficulty: 2, note: '桃・ぶどう・すもも。盆地特有の昼夜の温度差が果物を甘くする' },
    { name: '武田信玄', emoji: '⚔️', difficulty: 3, note: '甲斐国（山梨）の戦国大名。「風林火山」の旗印。上杉謙信と川中島で合戦' },
    { name: '富士山の世界文化遺産', emoji: '🗻', difficulty: 3, note: '2013年に「富士山―信仰の対象と芸術の源泉」として世界文化遺産登録' },
  ],
  nagano: [
    { name: 'レタス生産量日本一', emoji: '🥬', difficulty: 2, note: '川上村など高原野菜の日本最大産地。夏でも涼しい高地が適地' },
    { name: '日本アルプス（北・中・南）', emoji: '⛰️', difficulty: 2, note: '3000m級の山々が連なる。「日本の屋根」' },
    { name: '内陸県・面積全国4位', emoji: '🗺️', difficulty: 2, note: '海なし県。面積は全国4位の広さ（海なし県の中で最大）' },
    { name: '松本城（国宝）', emoji: '🏯', difficulty: 3, note: '戦国時代に建てられた現存する天守閣。国宝5城のひとつ' },
    { name: '善光寺', emoji: '⛩️', difficulty: 3, note: '宗派を超えた信仰を集める古刹。「一生に一度は善光寺参り」' },
  ],
  gifu: [
    { name: '白川郷（世界文化遺産）', emoji: '🏠', difficulty: 2, note: '合掌造り集落。1995年世界文化遺産登録' },
    { name: '木曽三川（木曽川・長良川・揖斐川）', emoji: '🏞️', difficulty: 2, note: '3本の川が濃尾平野を流れる。洪水対策の輪中集落が有名' },
    { name: '飛騨高山（古い町並み）', emoji: '🏘️', difficulty: 2, note: '江戸時代の商家が残る。外国人観光客にも人気' },
    { name: '関ヶ原の戦い（1600年）', emoji: '⚔️', difficulty: 3, note: '東軍（徳川家康）vs西軍（石田三成）。天下分け目の戦い' },
    { name: '輪中（洪水対策集落）', emoji: '🏡', difficulty: 3, note: '木曽三川の洪水に備え、堤防で囲まれた集落。水屋（高床式蔵）を持つ' },
  ],
  shizuoka: [
    { name: '茶（緑茶）生産量日本一', emoji: '🍵', difficulty: 2, note: '牧之原台地が最大産地。静岡茶は全国ブランド' },
    { name: '富士山（日本最高峰3776m）', emoji: '🗻', difficulty: 2, note: '山梨県と跨る成層火山。2013年世界文化遺産' },
    { name: '駿河湾（日本最深の湾）', emoji: '🌊', difficulty: 2, note: '最大水深約2500m。日本で最も深い湾' },
    { name: '徳川家康（駿府城）', emoji: '🏯', difficulty: 3, note: '江戸幕府を開いた後も晩年は駿府（静岡）に隠居' },
    { name: '東海道五十三次', emoji: '🛣️', difficulty: 3, note: '江戸〜京都の53の宿場町。静岡県内に最多の宿場が置かれた' },
  ],
  aichi: [
    { name: '自動車生産（トヨタ・中京工業地帯）', emoji: '🚗', difficulty: 2, note: '豊田市を中心とした中京工業地帯は製造品出荷額が日本最大' },
    { name: '名古屋港（輸出額）', emoji: '🚢', difficulty: 2, note: '自動車の輸出港として全国屈指。輸出額で長年日本一' },
    { name: '伊勢湾', emoji: '🌊', difficulty: 2, note: '愛知・三重・岐阜に囲まれた湾。1959年の伊勢湾台風の被害でも知られる' },
    { name: '三英傑（信長・秀吉・家康）', emoji: '⚔️', difficulty: 3, note: '織田信長（尾張）・豊臣秀吉（尾張）・徳川家康（三河）全員が愛知出身' },
    { name: '中京工業地帯', emoji: '🏭', difficulty: 3, note: '自動車・航空機・窯業など。製造品出荷額が長年日本最大' },
  ],
  mie: [
    { name: '真珠養殖の発祥地', emoji: '💎', difficulty: 2, note: '御木本幸吉が1893年に世界初の真珠養殖に成功（英虞湾）' },
    { name: '松阪牛', emoji: '🐄', difficulty: 2, note: '神戸牛・近江牛と並ぶ日本三大和牛' },
    { name: '志摩半島（リアス海岸）', emoji: '🌊', difficulty: 2, note: '英虞湾などの複雑な地形で真珠・海女漁が盛ん' },
    { name: '四日市ぜんそく（四大公害病）', emoji: '⚠️', difficulty: 3, note: '石油コンビナートの亜硫酸ガスによる大気汚染（1960年代）' },
    { name: '御木本幸吉（真珠王）', emoji: '👨', difficulty: 3, note: '「海の発明王」。養殖真珠を世界に広め、ミキモトを創業' },
  ],
  shiga: [
    { name: '琵琶湖（日本最大の湖）', emoji: '🏞️', difficulty: 2, note: '面積670km²。滋賀県面積の約6分の1。近畿の水がめ' },
    { name: '近江牛', emoji: '🐄', difficulty: 2, note: '日本最古の牛肉ブランドのひとつ' },
    { name: '彦根城（国宝）', emoji: '🏯', difficulty: 2, note: '国宝5城のひとつ。ひこにゃんのモデルとなった城' },
    { name: '比叡山延暦寺', emoji: '⛩️', difficulty: 3, note: '天台宗の総本山。1994年世界文化遺産。法然・親鸞・道元など多くの名僧が修行' },
    { name: '琵琶湖の環境問題と保全', emoji: '🌿', difficulty: 3, note: '1970〜80年代の水質汚染。石けん運動など住民活動で改善。条例制定の先例に' },
  ],
  kyoto: [
    { name: '西陣織・京友禅', emoji: '👘', difficulty: 2, note: '日本を代表する伝統工芸の織物・染め物' },
    { name: '宇治茶（抹茶）', emoji: '🍵', difficulty: 2, note: '茶道の抹茶の主要産地。宇治市' },
    { name: '古都京都の文化財（世界遺産）', emoji: '🏛️', difficulty: 2, note: '金閣寺・銀閣寺・二条城など17件（1994年登録）' },
    { name: '平安京（794年遷都）', emoji: '🏯', difficulty: 3, note: '桓武天皇が奈良から遷都。約1100年間の都' },
    { name: '応仁の乱（1467〜1477年）', emoji: '⚔️', difficulty: 3, note: '室町幕府の衰退と戦国時代の始まり。京都が焼け野原に' },
  ],
  osaka: [
    { name: '天下の台所（商業・経済）', emoji: '💰', difficulty: 2, note: '江戸時代から全国の物資が集まる経済の中心地' },
    { name: '大阪城', emoji: '🏯', difficulty: 2, note: '豊臣秀吉が築城。現在の天守は徳川時代に再建されたもの' },
    { name: '淀川', emoji: '🏞️', difficulty: 2, note: '琵琶湖を水源とし大阪湾に注ぐ。大阪の水源' },
    { name: '豊臣秀吉（大坂城）', emoji: '⚔️', difficulty: 3, note: '全国統一を果たした武将。大坂（現大阪）を拠点とした' },
    { name: '大阪万博（1970年・2025年）', emoji: '🌐', difficulty: 3, note: '1970年は日本初の万博（千里丘陵）。2025年に夢洲で再び開催' },
  ],
  hyogo: [
    { name: '神戸港（国際貿易港）', emoji: '🚢', difficulty: 2, note: '明治以降の日本有数の国際貿易港' },
    { name: '淡路島（玉ねぎ）', emoji: '🧅', difficulty: 2, note: '瀬戸内海最大の島。玉ねぎの一大産地' },
    { name: '六甲山', emoji: '⛰️', difficulty: 2, note: '神戸市の背後にある山地。夜景スポットとして有名' },
    { name: '阪神・淡路大震災（1995年）', emoji: '🌍', difficulty: 3, note: 'M7.3の直下型地震。6400人以上が犠牲に。震災復興・耐震化の教訓' },
    { name: '神戸開港・異人館', emoji: '🏠', difficulty: 3, note: '幕末の開港で外国人居留地が生まれ、西洋文化が広まった（1868年）' },
  ],
  nara: [
    { name: '吉野山（桜・世界遺産）', emoji: '🌸', difficulty: 2, note: '「千本桜」で有名。吉野・大峰の修験道（2004年世界遺産）' },
    { name: '法隆寺（世界最古の木造建築）', emoji: '⛩️', difficulty: 2, note: '607年建立。1993年に日本初の世界文化遺産登録' },
    { name: '大和平野（農業地帯）', emoji: '🌾', difficulty: 2, note: '奈良盆地の農業地帯。古代から開拓された' },
    { name: '平城京（710年遷都）', emoji: '🏯', difficulty: 3, note: '元明天皇が藤原京から遷都。奈良時代の都（約80年間）' },
    { name: '天平文化・正倉院', emoji: '🏛️', difficulty: 3, note: '奈良時代の仏教文化。正倉院にはシルクロード経由の宝物が保管' },
  ],
  wakayama: [
    { name: '梅干し（南高梅）生産量日本一', emoji: '🍋', difficulty: 2, note: '全国シェア約60%。みなべ町・田辺市が主産地' },
    { name: '熊野古道（世界遺産）', emoji: '🌿', difficulty: 2, note: '霊場を結ぶ参詣道。2004年に世界文化遺産登録' },
    { name: '高野山（世界遺産）', emoji: '⛩️', difficulty: 2, note: '弘法大師空海が開いた真言宗の聖地。2004年世界文化遺産' },
    { name: '紀伊山地の霊場と参詣道', emoji: '🌲', difficulty: 3, note: '吉野・大峰・高野山・熊野三山をむすぶ世界遺産（和歌山・奈良・三重に跨る）' },
    { name: 'みかん（有田みかん）生産上位', emoji: '🍊', difficulty: 2, note: '温暖な紀伊半島の南斜面で栽培。有田みかんが有名' },
  ],
  tottori: [
    { name: '鳥取砂丘（日本最大の砂丘）', emoji: '🏜️', difficulty: 2, note: '南北2.4km・東西16km。国内最大級の砂丘' },
    { name: '二十世紀梨生産量日本一', emoji: '🍐', difficulty: 2, note: '全国シェア約50%' },
    { name: '人口最少の都道府県', emoji: '📉', difficulty: 2, note: '47都道府県中、最も人口が少ない（約55万人）' },
    { name: '大山（伯耆富士）', emoji: '⛰️', difficulty: 3, note: '中国地方最高峰（1729m）。ブナ林で有名' },
    { name: '山陰海岸（世界ジオパーク）', emoji: '🌊', difficulty: 3, note: 'ユネスコ世界ジオパークに認定された地質学的景観' },
  ],
  shimane: [
    { name: '石見銀山（世界文化遺産）', emoji: '⛏️', difficulty: 2, note: '戦国〜江戸時代に世界の銀生産の1/3を占めた。2007年世界文化遺産' },
    { name: '宍道湖（シジミ）', emoji: '🐚', difficulty: 2, note: 'ヤマトシジミの全国有数産地' },
    { name: '隠岐（離島）', emoji: '🏝️', difficulty: 2, note: '後醍醐天皇・後鳥羽上皇が流された島。独自の生態系' },
    { name: '石見銀山の歴史的意義', emoji: '🌍', difficulty: 3, note: '大航海時代の世界貿易網に組み込まれた日本の銀山。16〜17世紀に繁栄' },
    { name: '人口が少ない（最少水準）', emoji: '📉', difficulty: 3, note: '鳥取に次ぐ人口規模。農山村の過疎化が深刻' },
  ],
  okayama: [
    { name: '後楽園（日本三名園）', emoji: '🌸', difficulty: 2, note: '1700年に岡山藩主が造営した大名庭園。水戸偕楽園・金沢兼六園と並ぶ' },
    { name: '白桃・マスカット生産上位', emoji: '🍑', difficulty: 2, note: '「晴れの国おかやま」の果物。岡山平野と吉備高原の温暖な気候' },
    { name: '瀬戸内式気候（晴れの日が多い）', emoji: '☀️', difficulty: 2, note: '雨が少なく温暖。「晴れの国おかやま」のキャッチコピー' },
    { name: '吉備路（古代吉備国）', emoji: '🏛️', difficulty: 3, note: '古墳時代の強大な勢力「吉備国」。造山古墳は全国4位の規模' },
    { name: '児島湾干拓', emoji: '🌾', difficulty: 3, note: '江戸〜明治にかけての大規模干拓事業。農地造成の歴史' },
  ],
  hiroshima: [
    { name: 'カキ（牡蠣）生産量日本一', emoji: '🦪', difficulty: 2, note: '全国シェア約60%。江田島など瀬戸内海の養殖が盛ん' },
    { name: '宮島・厳島神社（世界遺産）', emoji: '⛩️', difficulty: 2, note: '海に浮かぶ朱の大鳥居。1996年世界文化遺産' },
    { name: '瀬戸内海（多島海）', emoji: '🏝️', difficulty: 2, note: '大小700以上の島が点在する国立公園' },
    { name: '原爆投下（1945年8月6日）', emoji: '☮️', difficulty: 3, note: '世界初の核兵器使用。約14万人が亡くなった' },
    { name: '広島平和記念公園・原爆ドーム', emoji: '🏛️', difficulty: 3, note: '核兵器廃絶と平和を訴える場。1996年世界文化遺産' },
  ],
  yamaguchi: [
    { name: '秋吉台（日本最大のカルスト台地）', emoji: '🌿', difficulty: 2, note: '石灰岩の台地。地下には秋芳洞（鍾乳洞）が広がる' },
    { name: '関門海峡', emoji: '🌊', difficulty: 2, note: '本州（山口）と九州（福岡）を隔てる海峡。最も狭い部分は約600m' },
    { name: '長州藩（明治維新）', emoji: '⚔️', difficulty: 2, note: '薩摩藩と協力して倒幕。伊藤博文・山縣有朋など多くの元勲を輩出' },
    { name: '壇ノ浦の戦い（1185年）', emoji: '⚔️', difficulty: 3, note: '源氏が平氏を滅ぼした海戦。関門海峡で行われた' },
    { name: '萩の城下町・松下村塾', emoji: '🏛️', difficulty: 3, note: '吉田松陰が塾を開き、伊藤博文・高杉晋作ら明治の志士を育てた' },
  ],
  tokushima: [
    { name: 'すだち生産量日本一', emoji: '🍋', difficulty: 2, note: '全国シェア98%以上' },
    { name: '鳴門の渦潮', emoji: '🌊', difficulty: 2, note: '鳴門海峡に世界最大級の渦潮が発生。直径20mを超えることも' },
    { name: '吉野川（四国三郎）', emoji: '🏞️', difficulty: 2, note: '四国最大の川。利根川（坂東太郎）・筑後川（筑紫次郎）と並ぶ三大暴れ川' },
    { name: '四国遍路（88か所）', emoji: '🚶', difficulty: 3, note: '弘法大師空海ゆかりの88か寺を巡る巡礼。全長約1400km' },
    { name: '鳴門の渦潮の仕組み', emoji: '🔬', difficulty: 3, note: '大潮の干満で潮が太平洋と瀬戸内海を行き来する際に生じる自然現象' },
  ],
  kagawa: [
    { name: 'ため池の数日本一', emoji: '💧', difficulty: 2, note: '約14000か所。瀬戸内式気候で雨が少ないため古くから造られた' },
    { name: '面積最小の都道府県', emoji: '📐', difficulty: 2, note: '47都道府県中、最も面積が小さい（約1877km²）' },
    { name: '瀬戸大橋', emoji: '🌉', difficulty: 2, note: '1988年開通。本州（岡山）と四国（香川）を結ぶ鉄道・道路併用橋' },
    { name: '讃岐平野の農業（ため池・二毛作）', emoji: '🌾', difficulty: 3, note: '温暖・少雨の気候を生かした農業。ため池を利用した二毛作が盛ん' },
    { name: '小豆島（オリーブ）', emoji: '🫒', difficulty: 3, note: '日本のオリーブ栽培発祥の地（1908年）。素麺・醤油の産地でもある' },
  ],
  ehime: [
    { name: 'みかん生産量日本一（時期による）', emoji: '🍊', difficulty: 2, note: '宇和海沿岸の段々畑でみかんを栽培。愛媛みかんが全国ブランド' },
    { name: '今治タオル生産量日本一', emoji: '🧴', difficulty: 2, note: '今治市は日本最大のタオル生産地。GIマーク取得' },
    { name: '石鎚山（西日本最高峰）', emoji: '⛰️', difficulty: 2, note: '標高1982m。西日本最高峰の霊山' },
    { name: '道後温泉と夏目漱石', emoji: '📖', difficulty: 3, note: '夏目漱石「坊っちゃん」の舞台。松山（愛媛）の街の描写が有名' },
    { name: '段々畑（棚田）', emoji: '🌄', difficulty: 3, note: '急傾斜地を切り開いた段々畑でみかんを生産。宇和島周辺が有名' },
  ],
  kochi: [
    { name: 'カツオ水揚げ量日本一（時期）', emoji: '🐟', difficulty: 2, note: '一本釣りカツオ漁で有名。カツオのたたきは高知の名物' },
    { name: 'ゆず生産量日本一', emoji: '🍋', difficulty: 2, note: '物部川流域の山村地帯。全国シェア約50%' },
    { name: '四万十川（日本最後の清流）', emoji: '🏞️', difficulty: 2, note: '支流も含め自然堤防が残る清流。沈下橋が特徴的' },
    { name: '坂本龍馬', emoji: '🗡️', difficulty: 3, note: '幕末の志士。薩長同盟を仲介し明治維新に貢献。高知市出身' },
    { name: '高知平野の促成栽培', emoji: '🌶️', difficulty: 3, note: '黒潮の影響で温暖。なす・ピーマン・しょうがを早期出荷' },
  ],
  fukuoka: [
    { name: '博多港・玄界灘', emoji: '🚢', difficulty: 2, note: 'アジアに近い九州最大の港。古くから大陸交流の窓口' },
    { name: '筑豊炭田', emoji: '⛏️', difficulty: 2, note: '明治〜昭和に国内最大の石炭産地。エネルギー革命で衰退' },
    { name: '九州最大の都市', emoji: '🏙️', difficulty: 2, note: '福岡市は九州・沖縄で最多人口の都市' },
    { name: '元寇（1274年・1281年）', emoji: '⚔️', difficulty: 3, note: '鎌倉時代にモンゴル・高麗軍が博多湾に来襲。「神風」で撃退' },
    { name: '大宰府（西日本の政治・軍事拠点）', emoji: '🏯', difficulty: 3, note: '奈良〜平安時代に九州全体を統括した機関。菅原道真が流された' },
  ],
  saga: [
    { name: '有明海（日本最大の干潟）', emoji: '🌊', difficulty: 2, note: 'ムツゴロウ・有明海苔が有名。干満差が最大6m' },
    { name: '吉野ヶ里遺跡', emoji: '🏛️', difficulty: 2, note: '日本最大規模の弥生時代の環濠集落跡' },
    { name: '有明海の干潟の生態系', emoji: '🦀', difficulty: 2, note: '干満差が大きく独特の生態系。ムツゴロウ・シオマネキが生息' },
    { name: '有田焼（日本最古の磁器）', emoji: '🏺', difficulty: 3, note: 'ヨーロッパにも輸出された日本磁器（1616年〜）' },
    { name: '佐賀藩の近代化・反射炉', emoji: '🏭', difficulty: 3, note: '明治維新前から西洋の鉄製造技術（反射炉）を導入した先進的な藩' },
  ],
  nagasaki: [
    { name: '出島（江戸時代の貿易）', emoji: '⛵', difficulty: 2, note: '1641〜1859年、オランダとの唯一の貿易窓口' },
    { name: '軍艦島（端島・世界遺産）', emoji: '🏭', difficulty: 2, note: '炭鉱の島。廃墟となった建物群。明治産業革命遺産（世界文化遺産）' },
    { name: '島が多い（日本最多水準）', emoji: '🏝️', difficulty: 2, note: '971の島があり日本最多水準。対馬・壱岐・五島列島など' },
    { name: '長崎原爆（1945年8月9日）', emoji: '☮️', difficulty: 3, note: 'プルトニウム型原爆が投下。約7.5万人が亡くなった（広島の翌々日）' },
    { name: '潜伏キリシタン（世界遺産）', emoji: '✝️', difficulty: 3, note: '江戸時代の禁教下で信仰を守った。2018年世界文化遺産登録' },
  ],
  kumamoto: [
    { name: '阿蘇山（世界最大級のカルデラ）', emoji: '🌋', difficulty: 2, note: '東西18km・南北25kmの世界最大級のカルデラ' },
    { name: 'い草生産量日本一', emoji: '🌿', difficulty: 2, note: '八代平野が主産地。全国シェア約90%。畳の原料' },
    { name: '熊本城（日本三名城）', emoji: '🏯', difficulty: 2, note: '加藤清正が築城。2016年の熊本地震で大きな被害' },
    { name: '水俣病（四大公害病）', emoji: '⚠️', difficulty: 3, note: 'チッソ工場の有機水銀が不知火海に流出。1956年に発覚した日本最大の公害' },
    { name: '熊本地震（2016年）', emoji: '🌍', difficulty: 3, note: 'M7.3（最大震度7）。熊本城が大きな被害を受けた' },
  ],
  oita: [
    { name: '温泉湧出量・源泉数日本一', emoji: '♨️', difficulty: 2, note: '別府・由布院が有名。源泉数・湧出量ともに日本一' },
    { name: 'しいたけ生産量日本一', emoji: '🍄', difficulty: 2, note: '大分の山林を生かした原木シイタケ栽培' },
    { name: '豊後水道・関サバ・関アジ', emoji: '🐟', difficulty: 2, note: '速い潮流で身が締まったブランド魚' },
    { name: '別府温泉・地獄めぐり', emoji: '🔥', difficulty: 3, note: '「海地獄」「血の池地獄」など8つの源泉地。温泉の多様性を示す' },
    { name: '大友宗麟（キリシタン大名）', emoji: '✝️', difficulty: 3, note: '戦国時代の大名。九州でキリスト教を広め、南蛮貿易を行った' },
  ],
  miyazaki: [
    { name: 'きゅうり生産量日本一（時期）', emoji: '🥒', difficulty: 2, note: '温暖な気候を生かした促成栽培' },
    { name: '畜産（宮崎牛・地頭鶏）', emoji: '🐄', difficulty: 2, note: '宮崎牛・宮崎地頭鶏・宮崎豚など畜産が盛ん' },
    { name: '高千穂峡（神話の地）', emoji: '🌊', difficulty: 2, note: '天孫降臨の地とされる。柱状節理の断崖と滝が美しい' },
    { name: 'シラス台地', emoji: '🌋', difficulty: 3, note: '火山灰が堆積した水はけの良い台地。芋・茶の栽培に適する（鹿児島と共有）' },
    { name: '神武天皇神話（日向・高千穂）', emoji: '🏹', difficulty: 3, note: '初代天皇が高千穂に降臨した神話。「日向神話」の舞台' },
  ],
  kagoshima: [
    { name: 'さつまいも生産量日本一', emoji: '🍠', difficulty: 2, note: 'シラス台地の水はけを生かした栽培。全国シェア約40%' },
    { name: '屋久島（世界自然遺産）', emoji: '🌲', difficulty: 2, note: '樹齢7200年の縄文杉。1993年世界自然遺産（日本初）' },
    { name: '種子島（宇宙センター）', emoji: '🚀', difficulty: 2, note: 'JAXA種子島宇宙センター。ロケット発射場として有名' },
    { name: '西郷隆盛・薩摩藩', emoji: '⚔️', difficulty: 3, note: '明治維新の立役者。西南戦争（1877年）で城山に散る。薩長同盟の一方' },
    { name: 'シラス台地と農業', emoji: '🌋', difficulty: 3, note: '桜島の噴火でできた火山灰台地。水はけが良すぎて稲作に不向きのため芋栽培' },
  ],
  okinawa: [
    { name: 'さとうきび生産量日本一', emoji: '🌿', difficulty: 2, note: '全国シェア約70%（鹿児島と競う）' },
    { name: '珊瑚礁（サンゴ礁）', emoji: '🐠', difficulty: 2, note: '日本最大のサンゴ礁地帯。温暖な黒潮が育む' },
    { name: '西表島（イリオモテヤマネコ）', emoji: '🐆', difficulty: 2, note: '国の特別天然記念物。世界自然遺産（2021年登録）' },
    { name: '沖縄戦（1945年）', emoji: '☮️', difficulty: 3, note: '太平洋戦争末期の地上戦。約20万人（県民の約4人に1人）が犠牲に' },
    { name: '琉球王国（1429〜1879年）', emoji: '👑', difficulty: 3, note: '中国・日本・東南アジアと交易した独立王国。薩摩藩征服後も王国として存続' },
    { name: '米軍基地問題', emoji: '🗺️', difficulty: 3, note: '日本の米軍基地の約70%が沖縄に集中（面積は全国の0.6%）' },
  ],
};

// ── 3. 全データを統合してExcel行データを作成 ─────────────────────
const rows = [
  ['JIS', '都道府県', 'よみ', '地方', 'ID', '難易度', '項目名', '絵文字', '解説文（note）', 'ステータス']
];

for (const pref of PREFECTURES) {
  const extraItems = EXTRA[pref.id] || [];
  const allItems = [...pref.famous, ...extraItems];

  for (const item of allItems) {
    rows.push([
      pref.jis,
      pref.name,
      pref.kana,
      pref.region,
      pref.id,
      item.difficulty,
      item.name,
      item.emoji,
      item.note || '',
      item.difficulty === 1 ? '✅ 既存' : '⬜ 要追加'
    ]);
  }
}

// ── 4. Excelファイルを生成 ──────────────────────────────────────
const wb = xlsx.utils.book_new();
const ws = xlsx.utils.aoa_to_sheet(rows);

// 列幅設定
ws['!cols'] = [
  { wch: 5 },   // JIS
  { wch: 8 },   // 都道府県
  { wch: 10 },  // よみ
  { wch: 8 },   // 地方
  { wch: 12 },  // ID
  { wch: 6 },   // 難易度
  { wch: 28 },  // 項目名
  { wch: 5 },   // 絵文字
  { wch: 50 },  // 解説文
  { wch: 10 },  // ステータス
];

// ヘッダー行の高さ
ws['!rows'] = [{ hpt: 20 }];

xlsx.utils.book_append_sheet(wb, ws, '都道府県めいぶつデータ');

// 四大公害シート
const kougai = [
  ['四大公害病', '発生地域', '都道府県', '原因物質', '原因企業・施設', '発覚年'],
  ['水俣病', '不知火海沿岸', '熊本県', '有機水銀（メチル水銀）', 'チッソ工場', '1956年'],
  ['新潟水俣病', '阿賀野川流域', '新潟県', '有機水銀（メチル水銀）', '昭和電工・鹿瀬工場', '1965年'],
  ['イタイイタイ病', '神通川流域', '富山県', 'カドミウム', '神岡鉱山（三井金属）', '1955年頃〜'],
  ['四日市ぜんそく', '四日市市', '三重県', '亜硫酸ガス（SO₂）', '石油コンビナート', '1960年代'],
];
const ws2 = xlsx.utils.aoa_to_sheet(kougai);
ws2['!cols'] = [{ wch: 16 }, { wch: 14 }, { wch: 8 }, { wch: 20 }, { wch: 22 }, { wch: 10 }];
xlsx.utils.book_append_sheet(wb, ws2, '四大公害病（難易度3必出）');

// 日本一まとめシート
const nihonichi = [
  ['項目', '都道府県', '備考'],
  ['面積最大', '北海道', '約83424km²（四国の約2.2倍）'],
  ['面積最小', '香川県', '約1877km²'],
  ['人口最多の市', '横浜市（神奈川県）', '約380万人'],
  ['人口最少の都道府県', '鳥取県', '約55万人'],
  ['日本最長の川', '信濃川（新潟・長野）', '全長367km'],
  ['日本最大の湖', '琵琶湖（滋賀県）', '面積670km²'],
  ['日本最高峰', '富士山（山梨・静岡）', '3776m'],
  ['日本最深の湾', '駿河湾（静岡県）', '最大深度約2500m'],
  ['温泉湧出量・源泉数日本一', '大分県', '別府・由布院'],
  ['真珠養殖発祥', '三重県', '御木本幸吉・英虞湾（1893年）'],
  ['りんご生産量日本一', '青森県', '全国シェア約60%'],
  ['さくらんぼ生産量日本一', '山形県', '全国シェア約70%'],
  ['いちご生産量日本一', '栃木県', 'とちおとめ・スカイベリー'],
  ['米（コシヒカリ）生産量日本一', '新潟県', '越後平野'],
  ['茶（緑茶）生産量日本一', '静岡県', '牧之原台地'],
  ['みかん生産量日本一（時期）', '愛媛県 or 和歌山県', '競い合う'],
  ['ぶどう生産量日本一', '山梨県', '甲府盆地'],
  ['もも生産量日本一', '山梨県', '甲府盆地'],
  ['落花生生産量日本一', '千葉県', '全国シェア約80%'],
  ['メロン生産量日本一', '茨城県', '鉾田市'],
  ['レンコン生産量日本一', '茨城県', '霞ヶ浦周辺'],
  ['こんにゃく生産量日本一', '群馬県', '全国シェア約90%'],
  ['キャベツ生産量日本一', '群馬県', '嬬恋村（夏キャベツ）'],
  ['眼鏡フレーム生産量日本一', '福井県', '鯖江市・全国シェア約96%'],
  ['タオル生産量日本一', '愛媛県', '今治市'],
  ['い草生産量日本一', '熊本県', '八代平野・全国シェア約90%'],
  ['しいたけ生産量日本一', '大分県', '原木シイタケ'],
  ['さつまいも生産量日本一', '鹿児島県', '約40%'],
  ['さとうきび生産量日本一', '沖縄県', '約70%（鹿児島と競う）'],
  ['梅干し（南高梅）生産量日本一', '和歌山県', '全国シェア約60%'],
  ['ゆず生産量日本一', '高知県', '約50%'],
  ['カキ（牡蠣）生産量日本一', '広島県', '約60%'],
];
const ws3 = xlsx.utils.aoa_to_sheet(nihonichi);
ws3['!cols'] = [{ wch: 24 }, { wch: 18 }, { wch: 28 }];
xlsx.utils.book_append_sheet(wb, ws3, '日本一まとめ（難易度2頻出）');

const outPath = join(__dir, 'todofuken-data.xlsx');
xlsx.writeFile(wb, outPath);
console.log(`✅ ${outPath} を生成しました`);
console.log(`総行数: ${rows.length - 1}件（ヘッダー除く）`);
const diff1 = rows.filter(r => r[5] === 1).length;
const diff2 = rows.filter(r => r[5] === 2).length;
const diff3 = rows.filter(r => r[5] === 3).length;
console.log(`  難易度1: ${diff1}件（既存）`);
console.log(`  難易度2: ${diff2}件（要追加）`);
console.log(`  難易度3: ${diff3}件（要追加）`);
