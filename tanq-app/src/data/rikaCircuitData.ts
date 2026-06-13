// 中学受験 理科〈電気回路（豆電球と乾電池）〉— 計算・思考分野の単元データ
// rika-bane のひな型を踏襲。まなぶ（図解導入スライド）→ とく（演習・2段階ヒント）。
// テキストは Furigana コンポーネントの `{漢字|かんじ}` 記法。
//
// 【Ken 検証ルール（電気回路の中受標準）】
//  ・電流の大きさ ＝ 豆電球の明るさ（電流が大きいほど明るい）。
//  ・乾電池を直列 → 電圧が増える → 回路の電流が増える → 明るい・電池の持ちは短い。
//  ・乾電池を並列 → 電圧は1個ぶんのまま → 電流は変わらない → 明るさ同じ・長持ち。
//  ・豆電球を直列 → 抵抗が増える → 電流が減る → 各電球は暗い（2個直列なら電流は半分）。
//  ・豆電球を並列 → 各電球は1個のときと同じ明るさ（各枝の電流は基準と同じ）。
//    ただし電池から出る電流の合計は増えるので電池の持ちは短い。
//  基準（電池1個・電球1個）の電流＝明るさを「1」とおいて比で考える。
//  全15問を上記ルールで1問ずつ検証（各問題のコメントに検算を残す）。

// 回路図スペック。batteries=乾電池の個数, bulbs=豆電球の個数,
// batteryConnect/bulbConnect = 'single' | 'series'（直列）| 'parallel'（並列）。
// brightness = この回路の豆電球1個あたりの明るさ（基準=電池1電球1を 1 とした相対値）。
//   解答前は figure に光（明るさ）を出さず中立に描く（答えバレ防止）。
//   reveal 時にのみ光の強さ glow を表示する。
export interface CircuitSpec {
  batteries: number
  batteryConnect: 'single' | 'series' | 'parallel'
  bulbs: number
  bulbConnect: 'single' | 'series' | 'parallel'
  // 豆電球1個あたりの明るさ（基準=1）。reveal 後のみ図にグロー表示。null=図では示さない。
  brightness: number | null
  label?: string          // 回路の見出し（例: 「回路A」）
  caption?: string        // 図の下に出す中立な説明（明るさは書かない）
}

export type CircuitDifficulty = 1 | 2 | 3

export interface CircuitProblem {
  id: string
  title: string
  difficulty: CircuitDifficulty
  problemText: string          // ふりがな記法
  answer: string               // 選択肢の正解（文字列）
  answerUnit: string           // 単位（明るさ判定は '' 、電流比は '倍' など）
  choices: string[]            // 正解+誤答（出題時に Fisher-Yates でシャッフル）
  scaffoldHint: string         // 1回目不正解 → 考える足場（答えは言わない）
  explanation: string          // 正解後 / 2回目不正解の答え開示で見せる説明
  // 図は0〜2個。比較問題は2つ並べる。reveal でのみ明るさ glow を出す。
  diagrams: CircuitSpec[]
}

export interface CircuitSlide {
  kind: 'battery-series' | 'battery-parallel' | 'bulb-series' | 'bulb-parallel' | 'summary'
  title: string
  points: string[]             // ふりがな記法
  diagrams?: CircuitSpec[]
}

// ─────────────────────────────────────
// まなぶ: 図解導入スライド（5枚）
// ─────────────────────────────────────
export const CIRCUIT_SLIDES: CircuitSlide[] = [
  {
    kind: 'battery-series',
    title: '電池の直列：電流がふえて明るい',
    points: [
      '{豆電球|まめでんきゅう}の「{明|あか}るさ」は、ながれる「{電流|でんりゅう}」の{大|おお}きさで{決|き}まるよ。{電流|でんりゅう}が{大|おお}きいほど{明|あか}るい。',
      '{乾電池|かんでんち}を「{直列|ちょくれつ}」（たてに2{個|こ}）につなぐと、{電流|でんりゅう}が2{倍|ばい}になって{豆電球|まめでんきゅう}は{明|あか}るくなるよ。',
      'でも{電池|でんち}が はやく{減|へ}るので、{長|なが}もちは しないんだ。',
    ],
    diagrams: [
      { batteries: 1, batteryConnect: 'single', bulbs: 1, bulbConnect: 'single', brightness: 1, label: '電池1個', caption: '電池1個・電球1個（きほん）' },
      { batteries: 2, batteryConnect: 'series', bulbs: 1, bulbConnect: 'single', brightness: 2, label: '電池2個 直列', caption: '電池を直列に2個' },
    ],
  },
  {
    kind: 'battery-parallel',
    title: '電池の並列：明るさそのまま・長もち',
    points: [
      '{乾電池|かんでんち}を「{並列|へいれつ}」（よこにならべて）につなぐと、{電圧|でんあつ}は1{個|こ}ぶんのまま。',
      'だから{電流|でんりゅう}は{変|か}わらず、{明|あか}るさは{電池|でんち}1{個|こ}のときと「{同|おな}じ」だよ。',
      'そのかわり2{個|こ}で{分担|ぶんたん}するので、{電池|でんち}が「{長|なが}もち」するんだ。',
    ],
    diagrams: [
      { batteries: 1, batteryConnect: 'single', bulbs: 1, bulbConnect: 'single', brightness: 1, label: '電池1個', caption: '電池1個・電球1個（きほん）' },
      { batteries: 2, batteryConnect: 'parallel', bulbs: 1, bulbConnect: 'single', brightness: 1, label: '電池2個 並列', caption: '電池を並列に2個' },
    ],
  },
  {
    kind: 'bulb-series',
    title: '豆電球の直列：電流がへって暗い',
    points: [
      '{豆電球|まめでんきゅう}を「{直列|ちょくれつ}」（たてに2{個|こ}）につなぐと、{電流|でんりゅう}が ながれにくくなるよ。',
      '{電流|でんりゅう}は{半分|はんぶん}になり、2{個|こ}とも1{個|こ}のときより「{暗|くら}く」なる。',
      '{豆電球|まめでんきゅう}がふえるほど、1{個|こ}あたりは{暗|くら}くなるんだ。',
    ],
    diagrams: [
      { batteries: 1, batteryConnect: 'single', bulbs: 1, bulbConnect: 'single', brightness: 1, label: '電球1個', caption: '電池1個・電球1個（きほん）' },
      { batteries: 1, batteryConnect: 'single', bulbs: 2, bulbConnect: 'series', brightness: 0.5, label: '電球2個 直列', caption: '電球を直列に2個' },
    ],
  },
  {
    kind: 'bulb-parallel',
    title: '豆電球の並列：それぞれは同じ明るさ',
    points: [
      '{豆電球|まめでんきゅう}を「{並列|へいれつ}」（よこにならべて）につなぐと、それぞれの{電球|でんきゅう}には1{個|こ}のときと{同|おな}じ{電流|でんりゅう}がながれるよ。',
      'だから どの{電球|でんきゅう}も1{個|こ}のときと「{同|おな}じ{明|あか}るさ」だよ。',
      'ただし{電池|でんち}から{出|で}る{電流|でんりゅう}の{合計|ごうけい}はふえるので、{電池|でんち}は はやく{減|へ}る。',
    ],
    diagrams: [
      { batteries: 1, batteryConnect: 'single', bulbs: 1, bulbConnect: 'single', brightness: 1, label: '電球1個', caption: '電池1個・電球1個（きほん）' },
      { batteries: 1, batteryConnect: 'single', bulbs: 2, bulbConnect: 'parallel', brightness: 1, label: '電球2個 並列', caption: '電球を並列に2個' },
    ],
  },
  {
    kind: 'summary',
    title: 'まとめ：電流の大きさ＝明るさ',
    points: [
      '{電流|でんりゅう}が{大|おお}きい＝{明|あか}るい。これが すべての{基本|きほん}だよ。',
      '{電池|でんち}を{直列|ちょくれつ}→{電流|でんりゅう}{大|おお}（{明|あか}るい）/ {電池|でんち}を{並列|へいれつ}→{電流|でんりゅう}そのまま（{長|なが}もち）。',
      '{電球|でんきゅう}を{直列|ちょくれつ}→{電流|でんりゅう}{小|しょう}（{暗|くら}い）/ {電球|でんきゅう}を{並列|へいれつ}→それぞれ1{個|こ}と{同|おな}じ{明|あか}るさ。',
    ],
    diagrams: [
      { batteries: 2, batteryConnect: 'series', bulbs: 1, bulbConnect: 'single', brightness: 2, label: '電池 直列', caption: '電池を直列＝明るい' },
      { batteries: 1, batteryConnect: 'single', bulbs: 2, bulbConnect: 'series', brightness: 0.5, label: '電球 直列', caption: '電球を直列＝暗い' },
    ],
  },
]

// ─────────────────────────────────────
// とく: 演習15問（★5・★★5・★★★5）
// ─────────────────────────────────────
export const CIRCUIT_PROBLEMS: CircuitProblem[] = [

  // ── ★ 基本（5問）─────────────────────
  {
    // 検算: 電池直列2個→電流2倍→明るい。基準A=1 < B=2。明るいのはB ✓
    id: 'circuit-01', title: '電池を直列にすると', difficulty: 1,
    problemText: '回路A は{乾電池|かんでんち}1{個|こ}に{豆電球|まめでんきゅう}1{個|こ}。回路B は{乾電池|かんでんち}2{個|こ}を{直列|ちょくれつ}につないで{豆電球|まめでんきゅう}1{個|こ}。{豆電球|まめでんきゅう}が{明|あか}るいのはどっち？',
    answer: 'B', answerUnit: '',
    choices: ['B', 'A', 'おなじ', 'どちらも消える'],
    scaffoldHint: '{乾電池|かんでんち}を{直列|ちょくれつ}にすると{電流|でんりゅう}はどうなるかな？ {電流|でんりゅう}が{大|おお}きいほど{明|あか}るいよ。',
    explanation: '{電池|でんち}を{直列|ちょくれつ}にすると{電流|でんりゅう}が2{倍|ばい}になり{明|あか}るくなる。だから B のほうが{明|あか}るい。',
    diagrams: [
      { batteries: 1, batteryConnect: 'single', bulbs: 1, bulbConnect: 'single', brightness: 1, label: '回路A', caption: '電池1個' },
      { batteries: 2, batteryConnect: 'series', bulbs: 1, bulbConnect: 'single', brightness: 2, label: '回路B', caption: '電池2個 直列' },
    ],
  },
  {
    // 検算: 電池並列→電流不変→明るさ同じ。A=1, B=1。答え「おなじ」✓
    id: 'circuit-02', title: '電池を並列にすると', difficulty: 1,
    problemText: '回路A は{乾電池|かんでんち}1{個|こ}に{豆電球|まめでんきゅう}1{個|こ}。回路B は{乾電池|かんでんち}2{個|こ}を{並列|へいれつ}につないで{豆電球|まめでんきゅう}1{個|こ}。{豆電球|まめでんきゅう}の{明|あか}るさをくらべると？',
    answer: 'おなじ', answerUnit: '',
    choices: ['おなじ', 'B が明るい', 'A が明るい', 'B は消える'],
    scaffoldHint: '{電池|でんち}を{並列|へいれつ}にしても{電圧|でんあつ}は1{個|こ}ぶんのまま。{電流|でんりゅう}は{変|か}わるかな？',
    explanation: '{電池|でんち}を{並列|へいれつ}にしても{電流|でんりゅう}は{変|か}わらないので、{明|あか}るさは「{同|おな}じ」。ちがいは B のほうが{長|なが}もちすること。',
    diagrams: [
      { batteries: 1, batteryConnect: 'single', bulbs: 1, bulbConnect: 'single', brightness: 1, label: '回路A', caption: '電池1個' },
      { batteries: 2, batteryConnect: 'parallel', bulbs: 1, bulbConnect: 'single', brightness: 1, label: '回路B', caption: '電池2個 並列' },
    ],
  },
  {
    // 検算: 電球直列2個→電流半分→各暗い。A=1 > B=0.5。明るいのはA ✓
    id: 'circuit-03', title: '豆電球を直列にすると', difficulty: 1,
    problemText: '回路A は{乾電池|かんでんち}1{個|こ}に{豆電球|まめでんきゅう}1{個|こ}。回路B は{同|おな}じ{電池|でんち}1{個|こ}に{豆電球|まめでんきゅう}2{個|こ}を{直列|ちょくれつ}につなぎました。1{個|こ}の{豆電球|まめでんきゅう}が{明|あか}るいのはどっち？',
    answer: 'A', answerUnit: '',
    choices: ['A', 'B', 'おなじ', 'どちらも同じく暗い'],
    scaffoldHint: '{豆電球|まめでんきゅう}を{直列|ちょくれつ}にすると{電流|でんりゅう}はながれにくくなるよ。{電流|でんりゅう}がへると{明|あか}るさは？',
    explanation: '{豆電球|まめでんきゅう}を{直列|ちょくれつ}に2{個|こ}つなぐと{電流|でんりゅう}は{半分|はんぶん}になり、どちらの{電球|でんきゅう}も{暗|くら}くなる。だから1{個|こ}だけの A のほうが{明|あか}るい。',
    diagrams: [
      { batteries: 1, batteryConnect: 'single', bulbs: 1, bulbConnect: 'single', brightness: 1, label: '回路A', caption: '電球1個' },
      { batteries: 1, batteryConnect: 'single', bulbs: 2, bulbConnect: 'series', brightness: 0.5, label: '回路B', caption: '電球2個 直列' },
    ],
  },
  {
    // 検算: 電球並列→各電球は基準と同じ明るさ。A=1, B各=1。答え「おなじ」✓
    id: 'circuit-04', title: '豆電球を並列にすると', difficulty: 1,
    problemText: '回路A は{乾電池|かんでんち}1{個|こ}に{豆電球|まめでんきゅう}1{個|こ}。回路B は{同|おな}じ{電池|でんち}1{個|こ}に{豆電球|まめでんきゅう}2{個|こ}を{並列|へいれつ}につなぎました。B の{豆電球|まめでんきゅう}1{個|こ}の{明|あか}るさは A とくらべて？',
    answer: 'おなじ', answerUnit: '',
    choices: ['おなじ', '明るい', '暗い', '消える'],
    scaffoldHint: '{豆電球|まめでんきゅう}を{並列|へいれつ}にすると、それぞれの{電球|でんきゅう}にながれる{電流|でんりゅう}は1{個|こ}のときと くらべてどうなるかな？',
    explanation: '{豆電球|まめでんきゅう}を{並列|へいれつ}にすると、それぞれの{電球|でんきゅう}には1{個|こ}のときと{同|おな}じ{電流|でんりゅう}がながれるので、{明|あか}るさは「{同|おな}じ」。{電池|でんち}の{減|へ}りは はやくなるよ。',
    diagrams: [
      { batteries: 1, batteryConnect: 'single', bulbs: 1, bulbConnect: 'single', brightness: 1, label: '回路A', caption: '電球1個' },
      { batteries: 1, batteryConnect: 'single', bulbs: 2, bulbConnect: 'parallel', brightness: 1, label: '回路B', caption: '電球2個 並列' },
    ],
  },
  {
    // 検算: 長もち＝電流が小さいほど電池が減らない。電池並列は長もち。A(電池1)とB(電池2並列)ではBが長もち ✓
    id: 'circuit-05', title: '電池が長もちするのは', difficulty: 1,
    problemText: '回路A は{乾電池|かんでんち}1{個|こ}に{豆電球|まめでんきゅう}1{個|こ}。回路B は{乾電池|かんでんち}2{個|こ}を{並列|へいれつ}につないで{豆電球|まめでんきゅう}1{個|こ}。{電池|でんち}が{長|なが}もちするのはどっち？',
    answer: 'B', answerUnit: '',
    choices: ['B', 'A', 'おなじ', 'どちらもすぐ切れる'],
    scaffoldHint: '{電池|でんち}を{並列|へいれつ}にすると、{明|あか}るさは{同|おな}じだけど2{個|こ}で{分担|ぶんたん}するよ。どちらが{減|へ}りにくいかな？',
    explanation: '{電池|でんち}を{並列|へいれつ}にすると{明|あか}るさは{同|おな}じまま、2{個|こ}で{電流|でんりゅう}を{分担|ぶんたん}するので{長|なが}もちする。だから B。',
    diagrams: [
      { batteries: 1, batteryConnect: 'single', bulbs: 1, bulbConnect: 'single', brightness: 1, label: '回路A', caption: '電池1個' },
      { batteries: 2, batteryConnect: 'parallel', bulbs: 1, bulbConnect: 'single', brightness: 1, label: '回路B', caption: '電池2個 並列' },
    ],
  },

  // ── ★★ 練習（5問・電流の比）─────────────────────
  {
    // 検算: 電池直列2個→電流2倍。基準=1なら2倍 ✓
    id: 'circuit-06', title: '電池直列の電流の比', difficulty: 2,
    problemText: '{電池|でんち}1{個|こ}・{電球|でんきゅう}1{個|こ}のときの{電流|でんりゅう}を「1」とします。{電池|でんち}を{直列|ちょくれつ}に2{個|こ}にすると、{電流|でんりゅう}は{何|なん}{倍|ばい}になりますか？',
    answer: '2', answerUnit: '倍',
    choices: ['2', '1', '0.5', '4'],
    scaffoldHint: '{電池|でんち}を{直列|ちょくれつ}にすると{電圧|でんあつ}は{電池|でんち}の{個数|こすう}ぶんになるよ。{電球|でんきゅう}は1{個|こ}のままだね。',
    explanation: '{電池|でんち}を{直列|ちょくれつ}2{個|こ}にすると{電圧|でんあつ}が2{倍|ばい}、{電球|でんきゅう}は1{個|こ}のままなので{電流|でんりゅう}も2{倍|ばい}。{明|あか}るさも2{倍|ばい}（とても{明|あか}るい）。',
    diagrams: [
      { batteries: 2, batteryConnect: 'series', bulbs: 1, bulbConnect: 'single', brightness: 2, label: '電池2個 直列', caption: '電池を直列に2個' },
    ],
  },
  {
    // 検算: 電球直列2個→電流半分=0.5。基準1の0.5倍 ✓
    id: 'circuit-07', title: '電球直列の電流の比', difficulty: 2,
    problemText: '{電池|でんち}1{個|こ}・{電球|でんきゅう}1{個|こ}のときの{電流|でんりゅう}を「1」とします。{同|おな}じ{電池|でんち}に{電球|でんきゅう}を{直列|ちょくれつ}に2{個|こ}つなぐと、ながれる{電流|でんりゅう}は{何|なん}{倍|ばい}ですか？',
    answer: '0.5', answerUnit: '倍',
    choices: ['0.5', '1', '2', '0.25'],
    scaffoldHint: '{電球|でんきゅう}を{直列|ちょくれつ}にすると{電流|でんりゅう}はながれにくくなるよ。2{個|こ}{直列|ちょくれつ}なら{電流|でんりゅう}は{半分|はんぶん}。',
    explanation: '{電球|でんきゅう}を{直列|ちょくれつ}2{個|こ}にすると{電流|でんりゅう}が とおりにくくなり、{電流|でんりゅう}は{半分|はんぶん}（0.5{倍|ばい}）。だから2{個|こ}とも{暗|くら}い。',
    diagrams: [
      { batteries: 1, batteryConnect: 'single', bulbs: 2, bulbConnect: 'series', brightness: 0.5, label: '電球2個 直列', caption: '電球を直列に2個' },
    ],
  },
  {
    // 検算: 電球並列→各枝の電流は基準と同じ=1倍 ✓
    id: 'circuit-08', title: '電球並列・1個あたりの電流', difficulty: 2,
    problemText: '{電池|でんち}1{個|こ}・{電球|でんきゅう}1{個|こ}のときの{電流|でんりゅう}を「1」とします。{同|おな}じ{電池|でんち}に{電球|でんきゅう}を{並列|へいれつ}に2{個|こ}つなぐと、{電球|でんきゅう}1{個|こ}にながれる{電流|でんりゅう}は{何|なん}{倍|ばい}ですか？',
    answer: '1', answerUnit: '倍',
    choices: ['1', '0.5', '2', '0.25'],
    scaffoldHint: '{並列|へいれつ}では それぞれの{電球|でんきゅう}が{電池|でんち}と じかにつながっているのと{同|おな}じだよ。1{個|こ}のときと{比|くら}べてみよう。',
    explanation: '{並列|へいれつ}では{電球|でんきゅう}1{個|こ}ずつに1{個|こ}のときと{同|おな}じ{電流|でんりゅう}（1{倍|ばい}）がながれる。だから{明|あか}るさも{同|おな}じ。',
    diagrams: [
      { batteries: 1, batteryConnect: 'single', bulbs: 2, bulbConnect: 'parallel', brightness: 1, label: '電球2個 並列', caption: '電球を並列に2個' },
    ],
  },
  {
    // 検算: 電球並列の電池から出る合計電流=各1×2=2倍 ✓
    id: 'circuit-09', title: '電球並列・電池が出す電流', difficulty: 2,
    problemText: '{電池|でんち}1{個|こ}・{電球|でんきゅう}1{個|こ}のときの{電流|でんりゅう}を「1」とします。{電球|でんきゅう}を{並列|へいれつ}に2{個|こ}つないだとき、{電池|でんち}から{出|で}る{電流|でんりゅう}の{合計|ごうけい}は{何|なん}{倍|ばい}ですか？',
    answer: '2', answerUnit: '倍',
    choices: ['2', '1', '0.5', '4'],
    scaffoldHint: '{電球|でんきゅう}1{個|こ}ずつには「1」の{電流|でんりゅう}がながれるよ。それが2{個|こ}ぶん{電池|でんち}から{出|で}ていくね。',
    explanation: '{並列|へいれつ}は{電球|でんきゅう}1{個|こ}ずつに「1」がながれ、{電池|でんち}からはその{合計|ごうけい}2{倍|ばい}が{出|で}ていく。だから{明|あか}るさは{同|おな}じでも{電池|でんち}は はやく{減|へ}る。',
    diagrams: [
      { batteries: 1, batteryConnect: 'single', bulbs: 2, bulbConnect: 'parallel', brightness: 1, label: '電球2個 並列', caption: '電球を並列に2個' },
    ],
  },
  {
    // 検算: 電池直列2個＋電球直列2個。電圧2倍、抵抗2倍→電流=2/2=1倍 ✓
    id: 'circuit-10', title: '★★のしあげ（電池も電球も2個）', difficulty: 2,
    problemText: '{電池|でんち}1{個|こ}・{電球|でんきゅう}1{個|こ}のときの{電流|でんりゅう}を「1」とします。{電池|でんち}を{直列|ちょくれつ}2{個|こ}にして、{電球|でんきゅう}も{直列|ちょくれつ}2{個|こ}にすると、ながれる{電流|でんりゅう}は{何|なん}{倍|ばい}ですか？',
    answer: '1', answerUnit: '倍',
    choices: ['1', '2', '0.5', '4'],
    scaffoldHint: '{電池|でんち}{直列|ちょくれつ}2{個|こ}で{電流|でんりゅう}は2{倍|ばい}の{力|ちから}、{電球|でんきゅう}{直列|ちょくれつ}2{個|こ}で{電流|でんりゅう}は{半分|はんぶん}。{両方|りょうほう}を かけあわせると？',
    explanation: '{電池|でんち}{直列|ちょくれつ}で2{倍|ばい}、{電球|でんきゅう}{直列|ちょくれつ}で{半分|はんぶん}（0.5{倍|ばい}）。2 × 0.5 ＝ 1{倍|ばい}でつりあい、{電流|でんりゅう}は{基準|きじゅん}と{同|おな}じ。{電球|でんきゅう}1{個|こ}の{明|あか}るさも{基準|きじゅん}と{同|おな}じになるよ。',
    diagrams: [
      { batteries: 2, batteryConnect: 'series', bulbs: 2, bulbConnect: 'series', brightness: 1, label: '電池2個・電球2個（直列）', caption: '電池も電球も直列に2個ずつ' },
    ],
  },

  // ── ★★★ 応用（5問・複合回路と明るさ順位）─────────────────────
  {
    // 検算: A=電池1電球1→1。B=電池2直列電球1→2。C=電池1電球2直列→各0.5。明るい順 B>A>C ✓
    id: 'circuit-11', title: '3つの回路の明るさ順位', difficulty: 3,
    problemText: '回路A（{電池|でんち}1・{電球|でんきゅう}1）、回路B（{電池|でんち}2{個|こ}{直列|ちょくれつ}・{電球|でんきゅう}1）、回路C（{電池|でんち}1・{電球|でんきゅう}2{個|こ}{直列|ちょくれつ}）。{電球|でんきゅう}1{個|こ}が{明|あか}るい{順|じゅん}に{正|ただ}しいのはどれ？',
    answer: 'B → A → C', answerUnit: '',
    choices: ['B → A → C', 'A → B → C', 'C → A → B', 'B → C → A'],
    scaffoldHint: 'それぞれの{電流|でんりゅう}を「1」を{基準|きじゅん}に{出|だ}そう。{電池|でんち}{直列|ちょくれつ}は2{倍|ばい}、{電球|でんきゅう}{直列|ちょくれつ}は{半分|はんぶん}だね。',
    explanation: 'A＝1、B＝2（{電池|でんち}{直列|ちょくれつ}で2{倍|ばい}）、C＝0.5（{電球|でんきゅう}{直列|ちょくれつ}で{半分|はんぶん}）。{明|あか}るい{順|じゅん}は B → A → C。',
    diagrams: [
      { batteries: 1, batteryConnect: 'single', bulbs: 1, bulbConnect: 'single', brightness: 1, label: '回路A', caption: '電池1・電球1' },
      { batteries: 2, batteryConnect: 'series', bulbs: 1, bulbConnect: 'single', brightness: 2, label: '回路B', caption: '電池2直列・電球1' },
      { batteries: 1, batteryConnect: 'single', bulbs: 2, bulbConnect: 'series', brightness: 0.5, label: '回路C', caption: '電池1・電球2直列' },
    ],
  },
  {
    // 検算: 電池2直列(2倍)＋電球2並列。各電球には電池の電圧がかかる→各電球=2倍の明るさ。基準より明るい ✓
    id: 'circuit-12', title: '電池直列×電球並列', difficulty: 3,
    problemText: '{電池|でんち}1・{電球|でんきゅう}1のときの{明|あか}るさを「1」とします。{電池|でんち}を{直列|ちょくれつ}2{個|こ}にして、{電球|でんきゅう}を{並列|へいれつ}に2{個|こ}つなぎました。{電球|でんきゅう}1{個|こ}の{明|あか}るさは{何|なん}{倍|ばい}ですか？',
    answer: '2', answerUnit: '倍',
    choices: ['2', '1', '0.5', '4'],
    scaffoldHint: '{並列|へいれつ}の{電球|でんきゅう}は それぞれ{電池|でんち}と じかにつながっているのと{同|おな}じ。その{電池|でんち}は{直列|ちょくれつ}2{個|こ}だね。',
    explanation: '{並列|へいれつ}の{電球|でんきゅう}1{個|こ}ずつには{電池|でんち}（{直列|ちょくれつ}2{個|こ}＝2{倍|ばい}）の{電流|でんりゅう}がかかるので、それぞれ2{倍|ばい}の{明|あか}るさ。{並列|へいれつ}は「{電球|でんきゅう}どうしが{影響|えいきょう}しない」のがポイント。',
    diagrams: [
      { batteries: 2, batteryConnect: 'series', bulbs: 2, bulbConnect: 'parallel', brightness: 2, label: '電池2直列・電球2並列', caption: '電池を直列2個・電球を並列2個' },
    ],
  },
  {
    // 検算: 電球並列2個のうち1個を外す（ソケットから抜く）と、もう1個は変わらず点灯（並列は独立）✓
    id: 'circuit-13', title: '並列で1個外すと', difficulty: 3,
    problemText: '{電池|でんち}1{個|こ}に{電球|でんきゅう}2{個|こ}を{並列|へいれつ}につないで、{両方|りょうほう}{光|ひか}っています。ここで{片方|かたほう}の{電球|でんきゅう}をソケットから{外|はず}すと、もう{片方|かたほう}の{電球|でんきゅう}はどうなりますか？',
    answer: 'そのまま光る', answerUnit: '',
    choices: ['そのまま光る', '消える', '明るくなる', '暗くなる'],
    scaffoldHint: '{並列|へいれつ}は それぞれの{電球|でんきゅう}が べつべつの{道|みち}（{回路|かいろ}）で{電池|でんち}とつながっているよ。{片方|かたほう}の{道|みち}を{切|き}っても もう{片方|かたほう}は…？',
    explanation: '{並列|へいれつ}は それぞれが べつの{道|みち}でつながっているので、{片方|かたほう}を{外|はず}しても もう{片方|かたほう}は{同|おな}じ{明|あか}るさで「そのまま{光|ひか}る」。（{直列|ちょくれつ}なら{片方|かたほう}を{外|はず}すと{両方|りょうほう}{消|き}える点とちがうよ。）',
    diagrams: [
      { batteries: 1, batteryConnect: 'single', bulbs: 2, bulbConnect: 'parallel', brightness: 1, label: '電球2個 並列', caption: '電球を並列に2個' },
    ],
  },
  {
    // 検算: 直列の電球2個のうち1個を外す（断線）と回路が切れて両方消える ✓
    id: 'circuit-14', title: '直列で1個外すと', difficulty: 3,
    problemText: '{電池|でんち}1{個|こ}に{電球|でんきゅう}2{個|こ}を{直列|ちょくれつ}につないで{光|ひか}っています。{片方|かたほう}の{電球|でんきゅう}をソケットから{外|はず}すと、もう{片方|かたほう}の{電球|でんきゅう}はどうなりますか？',
    answer: '消える', answerUnit: '',
    choices: ['消える', 'そのまま光る', '明るくなる', '暗くなる'],
    scaffoldHint: '{直列|ちょくれつ}は1{本|ぽん}の{道|みち}に{電球|でんきゅう}が ならんでいるよ。{道|みち}のとちゅうを{切|き}ると{電流|でんりゅう}は ながれるかな？',
    explanation: '{直列|ちょくれつ}は1{本|ぽん}の{道|みち}なので、{片方|かたほう}を{外|はず}すと{道|みち}が{切|き}れて{電流|でんりゅう}がながれず、もう{片方|かたほう}も「{消|き}える」。だから{豆電球|まめでんきゅう}の{直列|ちょくれつ}は1{個|こ}{切|き}れると{全部|ぜんぶ}{消|き}えるんだ。',
    diagrams: [
      { batteries: 1, batteryConnect: 'single', bulbs: 2, bulbConnect: 'series', brightness: 0.5, label: '電球2個 直列', caption: '電球を直列に2個' },
    ],
  },
  {
    // 検算: A=電池2直列電球1→2。B=電池1電球2並列→各1。C=電池2並列電球1→1。
    // 明るい順 A(2) > B=C(1)。一番明るいのはA、Bと同じはC ✓
    id: 'circuit-15', title: '★★★のしあげ（一番明るいのは）', difficulty: 3,
    problemText: '回路A（{電池|でんち}2{個|こ}{直列|ちょくれつ}・{電球|でんきゅう}1）、回路B（{電池|でんち}1・{電球|でんきゅう}2{個|こ}{並列|へいれつ}）、回路C（{電池|でんち}2{個|こ}{並列|へいれつ}・{電球|でんきゅう}1）。{電球|でんきゅう}1{個|こ}が いちばん{明|あか}るい{回路|かいろ}はどれ？',
    answer: 'A', answerUnit: '',
    choices: ['A', 'B', 'C', 'ぜんぶ同じ'],
    scaffoldHint: 'それぞれの{電球|でんきゅう}1{個|こ}にながれる{電流|でんりゅう}を「1」を{基準|きじゅん}に{出|だ}そう。{電池|でんち}{直列|ちょくれつ}だけが{電流|でんりゅう}を2{倍|ばい}にするよ。',
    explanation: 'A＝2（{電池|でんち}{直列|ちょくれつ}で2{倍|ばい}）、B＝1（{電球|でんきゅう}{並列|へいれつ}は各1{倍|ばい}）、C＝1（{電池|でんち}{並列|へいれつ}は{電流|でんりゅう}{変|か}わらず1{倍|ばい}）。いちばん{明|あか}るいのは A。{電池|でんち}{直列|ちょくれつ}だけが{明|あか}るさを{上|あ}げる、と{覚|おぼ}えよう。',
    diagrams: [
      { batteries: 2, batteryConnect: 'series', bulbs: 1, bulbConnect: 'single', brightness: 2, label: '回路A', caption: '電池2直列・電球1' },
      { batteries: 1, batteryConnect: 'single', bulbs: 2, bulbConnect: 'parallel', brightness: 1, label: '回路B', caption: '電池1・電球2並列' },
      { batteries: 2, batteryConnect: 'parallel', bulbs: 1, bulbConnect: 'single', brightness: 1, label: '回路C', caption: '電池2並列・電球1' },
    ],
  },
]
