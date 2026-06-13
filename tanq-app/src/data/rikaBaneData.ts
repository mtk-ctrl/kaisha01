// 中学受験 理科〈ばねののび〉— 計算分野の単元データ（rika-teko のひな型を踏襲）
// 方式は算数/juku を踏襲: まなぶ（図解導入スライド）→ とく（演習・2段階ヒント）。
// テキストは Furigana コンポーネントの `{漢字|かんじ}` 記法。
// 全15問のフックの法則計算は Ken が検算済み（各問題のコメントに検算式を残す）。

// ばねの図解スペック。teko の TekoDiagramSpec に相当。
// natural = 自然長（cm） / nobi = のび（cm） / load = つるしたおもさ（null=もとめる値）
// connect: 'single' = 1本 / 'series' = 直列（縦に2本）/ 'parallel' = 並列（横に2本で支える）
export interface BaneSpec {
  connect: 'single' | 'series' | 'parallel'
  natural: number          // 自然長（cm）。1本ぶん
  nobi: number | null      // のび（cm）。null=もとめる値（図では「?」）
  load: number | null      // つるしたおもさ（g）。null=もとめる値
  labelNatural?: string    // 自然長ラベル上書き（例: 2種ばねで A/B）
  showTotal?: boolean      // 全長（自然長+のび）を図に注記するか
  totalLen?: number | null // 全長（cm）。showTotal 時に表示
  // この問題で「もとめる量」。解答前は図に実数を出さず「?」にする（答えバレ防止）。
  // reveal 時に answer を表示。null/未指定なら全て既知の量として表示。
  unknown?: 'nobi' | 'load' | 'natural' | 'total'
  noteLeft?: string        // 答え合わせで見せる式チップ（左）
  noteRight?: string       // 答え合わせで見せる式チップ（右）
}

export type BaneDifficulty = 1 | 2 | 3

export interface BaneProblem {
  id: string
  title: string
  difficulty: BaneDifficulty
  problemText: string          // ふりがな記法
  answer: string               // 数値文字列
  answerUnit: string
  choices: [string, string, string, string]  // 正解+誤答3（出題時に Fisher-Yates でシャッフル）
  scaffoldHint: string         // 1回目不正解 → 考える足場（答えは言わない）
  explanation: string          // 正解後 / 2回目不正解の答え開示で見せる説明
  diagram: BaneSpec
}

export interface BaneSlide {
  kind: 'hooke' | 'proportion' | 'formula' | 'series' | 'parallel'
  title: string
  points: string[]             // ふりがな記法
  diagram?: BaneSpec
}

// ─────────────────────────────────────
// まなぶ: 図解導入スライド（5枚）
// ─────────────────────────────────────
export const BANE_SLIDES: BaneSlide[] = [
  {
    kind: 'hooke',
    title: 'ばねは おもさで のびる',
    points: [
      'ばねに おもりをつるすと、その{重|おも}さのぶんだけ ばねが「のびる」よ。',
      'なにもつるしていないときの{長|なが}さを「{自然長|しぜんちょう}」というよ。',
      'のびた{長|なが}さを「のび」、ぜんぶの{長|なが}さを「{全長|ぜんちょう}」とよぶよ。',
    ],
    diagram: { connect: 'single', natural: 10, nobi: 5, load: 10, showTotal: true, totalLen: 15 },
  },
  {
    kind: 'proportion',
    title: 'おもさ2倍で のびも2倍',
    points: [
      'ばねの「のび」は、つるした おもさに「{比例|ひれい}」するよ。',
      'おもさを2{倍|ばい}にすると、のびも きっちり2{倍|ばい}になる。',
      '10g で 5cm のびるばねなら、20g では 10cm のびる、ということ。',
    ],
    diagram: { connect: 'single', natural: 10, nobi: 10, load: 20, showTotal: true, totalLen: 20 },
  },
  {
    kind: 'formula',
    title: 'のび ＝ 1gあたりのび × おもさ',
    points: [
      'まず「1g で{何|なん}cm のびるか」をもとめると、どんな おもさでも{計算|けいさん}できるよ。',
      '10g で 5cm のびるなら、1g では 5 ÷ 10 ＝ 0.5cm のびる。',
      'のび ＝ 0.5 × おもさ。{全長|ぜんちょう} ＝ {自然長|しぜんちょう} ＋ のび だよ。',
    ],
    diagram: { connect: 'single', natural: 10, nobi: 5, load: 10, noteLeft: '1g で 0.5cm', noteRight: '0.5 × 10 ＝ 5cm' },
  },
  {
    kind: 'series',
    title: '直列つなぎ：のびが 2倍',
    points: [
      '{同|おな}じばねを たてに2本つなぐ（{直列|ちょくれつ}）と、{両方|りょうほう}のばねに おもさが「{全部|ぜんぶ}」かかるよ。',
      'だから それぞれが 1本のときと{同|おな}じだけ のびる。のびの{合計|ごうけい}は2{倍|ばい}！',
      '1本が 60g で 30cm のびるなら、2本{直列|ちょくれつ}では 30 ＋ 30 ＝ 60cm のびる。',
    ],
    diagram: { connect: 'series', natural: 10, nobi: 60, load: 60, noteLeft: 'それぞれに 60g', noteRight: '30 ＋ 30 ＝ 60cm' },
  },
  {
    kind: 'parallel',
    title: '並列つなぎ：おもさは 半分ずつ',
    points: [
      '{同|おな}じばねを よこに2本ならべて{支|ささ}える（{並列|へいれつ}）と、おもさは2本で「{半分|はんぶん}ずつ」になるよ。',
      'だから のびは 1本のときの{半分|はんぶん}になる。',
      '1本なら 60g で 30cm のびるばねでも、2本{並列|へいれつ}なら 1本に 30g ＝ のび 15cm だよ。',
    ],
    diagram: { connect: 'parallel', natural: 10, nobi: 15, load: 60, noteLeft: '1本に 30g ずつ', noteRight: '0.5 × 30 ＝ 15cm' },
  },
]

// ─────────────────────────────────────
// とく: 演習15問（★5・★★5・★★★5）
// ─────────────────────────────────────
export const BANE_PROBLEMS: BaneProblem[] = [

  // ── ★ 基本（5問）─────────────────────
  {
    // 検算: 1g=0.5cm → 20g で 0.5×20=10cm ✓
    id: 'bane-01', title: 'のびは おもさに比例', difficulty: 1,
    problemText: 'あるばねは 10g つるすと 5cm のびます。20g つるすと{何|なん}cm のびますか？',
    answer: '10', answerUnit: 'cm',
    choices: ['10', '5', '15', '20'],
    scaffoldHint: 'おもさが 10g から 20g になると、{何|なん}{倍|ばい}になったかな？ のびも{同|おな}じ{倍|ばい}になるよ。',
    explanation: 'おもさが 10g → 20g で2{倍|ばい}。のびも2{倍|ばい}だから 5 × 2 ＝ 10cm。のびは おもさに{比例|ひれい}するんだね。',
    diagram: { connect: 'single', natural: 10, nobi: 10, load: 20, unknown: 'nobi', noteLeft: '10g で 5cm', noteRight: '5 × 2 ＝ 10cm' },
  },
  {
    // 検算: 1g=0.5cm → 30g で 0.5×30=15cm ✓
    id: 'bane-02', title: '3倍のおもさ', difficulty: 1,
    problemText: 'あるばねは 10g つるすと 5cm のびます。30g つるすと{何|なん}cm のびますか？',
    answer: '15', answerUnit: 'cm',
    choices: ['15', '10', '5', '30'],
    scaffoldHint: '30g は 10g の{何|なん}{倍|ばい}かな？ のびも{同|おな}じ{倍|ばい}にしてみよう。',
    explanation: '30g は 10g の3{倍|ばい}。のびも3{倍|ばい}で 5 × 3 ＝ 15cm。',
    diagram: { connect: 'single', natural: 10, nobi: 15, load: 30, unknown: 'nobi', noteLeft: '10g で 5cm', noteRight: '5 × 3 ＝ 15cm' },
  },
  {
    // 検算: 自然長12cm。20gで全長20cm → のび=20-12=8cm ✓
    id: 'bane-03', title: '自然長をもとめる', difficulty: 1,
    problemText: 'あるばねに 20g つるすと、ぜんぶの{長|なが}さ（{全長|ぜんちょう}）が 20cm になりました。このとき ばねは 8cm のびています。なにもつるさないときの{長|なが}さ（{自然長|しぜんちょう}）は{何|なん}cm ですか？',
    answer: '12', answerUnit: 'cm',
    choices: ['12', '20', '8', '28'],
    scaffoldHint: '{全長|ぜんちょう} ＝ {自然長|しぜんちょう} ＋ のび だよ。20cm から のびの 8cm をひくと？',
    explanation: '{全長|ぜんちょう} ＝ {自然長|しぜんちょう} ＋ のび。20 ＝ {自然長|しぜんちょう} ＋ 8 だから、{自然長|しぜんちょう} ＝ 20 − 8 ＝ 12cm。',
    diagram: { connect: 'single', natural: 12, nobi: 8, load: 20, unknown: 'natural', showTotal: true, totalLen: 20 },
  },
  {
    // 検算: 自然長15cm、30gで のび6cm → 全長=15+6=21cm ✓
    id: 'bane-04', title: '全長 ＝ 自然長 ＋ のび', difficulty: 1,
    problemText: '{自然長|しぜんちょう} 15cm のばねに 30g つるすと 6cm のびました。このときの{全長|ぜんちょう}（ぜんぶの{長|なが}さ）は{何|なん}cm ですか？',
    answer: '21', answerUnit: 'cm',
    choices: ['21', '15', '6', '9'],
    scaffoldHint: '{全長|ぜんちょう} ＝ {自然長|しぜんちょう} ＋ のび。15 と 6 を{足|た}してみよう。',
    explanation: '{全長|ぜんちょう} ＝ {自然長|しぜんちょう} ＋ のび ＝ 15 ＋ 6 ＝ 21cm。「のび」と「{全長|ぜんちょう}」をまちがえないようにね。',
    diagram: { connect: 'single', natural: 15, nobi: 6, load: 30, unknown: 'total', showTotal: true, totalLen: 21 },
  },
  {
    // 検算: 10gで6cmのび → 30gは3倍 → 18cm ✓
    id: 'bane-05', title: '★のしあげ', difficulty: 1,
    problemText: 'あるばねは 10g つるすと 6cm のびます。30g つるすと{何|なん}cm のびますか？',
    answer: '18', answerUnit: 'cm',
    choices: ['18', '12', '6', '30'],
    scaffoldHint: '30g は 10g の3{倍|ばい}。のびも3{倍|ばい}にしてみよう。',
    explanation: '30g は 10g の3{倍|ばい}だから、のびも 6 × 3 ＝ 18cm。{比例|ひれい}の{考|かんが}え{方|かた}、もうばっちりだね！',
    diagram: { connect: 'single', natural: 10, nobi: 18, load: 30, unknown: 'nobi', noteLeft: '10g で 6cm', noteRight: '6 × 3 ＝ 18cm' },
  },

  // ── ★★ 練習（5問）─────────────────────
  {
    // 検算: 10gで5cm → 1gで 5÷10=0.5cm ✓
    id: 'bane-06', title: '1gあたりののび', difficulty: 2,
    problemText: 'あるばねは 10g つるすと 5cm のびます。このばねは 1g あたり{何|なん}cm のびますか？',
    answer: '0.5', answerUnit: 'cm',
    choices: ['0.5', '2', '5', '50'],
    scaffoldHint: '1g あたりののび ＝ のび ÷ おもさ。5 ÷ 10 を けいさんしてみよう。',
    explanation: '1g あたりののび ＝ 5 ÷ 10 ＝ 0.5cm。これがわかれば、どんな おもさでも「0.5 × おもさ」で のびがもとまるよ。',
    diagram: { connect: 'single', natural: 10, nobi: 5, load: 10, noteLeft: '5 ÷ 10', noteRight: '1g で 0.5cm' },
  },
  {
    // 検算: 表 10g→2cm,20g→4cm,30g→6cm → 1g=0.2cm。40gで 0.2×40=8cm ✓
    id: 'bane-07', title: '表からのびを読む', difficulty: 2,
    problemText: 'ばねに いろいろな おもりをつるして のびを{調|しら}べました。10g で 2cm、20g で 4cm、30g で 6cm のびました。では 40g つるすと{何|なん}cm のびますか？',
    answer: '8', answerUnit: 'cm',
    choices: ['8', '6', '10', '4'],
    scaffoldHint: '{表|ひょう}を見ると、10g ふえるごとに のびは{何|なん}cm ずつ ふえているかな？ そのきまりを 40g までのばしてみよう。',
    explanation: '10g ごとに のびは 2cm ずつ ふえている（1g で 0.2cm）。40g なら 0.2 × 40 ＝ 8cm。{表|ひょう}は「1g あたりのび」を見つけるのがコツ。',
    diagram: { connect: 'single', natural: 12, nobi: 8, load: 40, unknown: 'nobi', noteLeft: '1g で 0.2cm', noteRight: '0.2 × 40 ＝ 8cm' },
  },
  {
    // 検算: 直列。1本 60gで30cmのび。同じばね2本直列→各60g→各30cm→合計60cm ✓
    id: 'bane-08', title: '直列つなぎ（たてに2本）', difficulty: 2,
    problemText: '1本だと 60g つるすと 30cm のびるばねがあります。{同|おな}じばねを たてに2本つなぎ（{直列|ちょくれつ}）、その{下|した}に 60g をつるすと、ばね{全体|ぜんたい}で{何|なん}cm のびますか？',
    answer: '60', answerUnit: 'cm',
    choices: ['60', '30', '15', '120'],
    scaffoldHint: '{直列|ちょくれつ}では どちらのばねにも おもさが「{全部|ぜんぶ}」（60g）かかるよ。だから 1本が 30cm のびる。それが2本ぶん…？',
    explanation: '{直列|ちょくれつ}は{両方|りょうほう}のばねに 60g がかかるので、それぞれ 30cm のびる。{合計|ごうけい}は 30 ＋ 30 ＝ 60cm。たてにつなぐと のびは2{倍|ばい}になるんだ。',
    diagram: { connect: 'series', natural: 10, nobi: 60, load: 60, unknown: 'nobi', noteLeft: 'それぞれに 60g', noteRight: '30 ＋ 30 ＝ 60cm' },
  },
  {
    // 検算: 自然長8cm、1g=0.3cm。20gで のび6cm → 全長14cm ✓
    id: 'bane-09', title: '1gあたりから全長まで', difficulty: 2,
    problemText: '{自然長|しぜんちょう} 8cm のばねは、1g あたり 0.3cm のびます。20g つるしたときの{全長|ぜんちょう}は{何|なん}cm ですか？',
    answer: '14', answerUnit: 'cm',
    choices: ['14', '6', '8', '20'],
    scaffoldHint: 'まず のびをもとめよう。0.3 × 20 ＝ いくつ？ そのあと {自然長|しぜんちょう} 8cm を{足|た}すよ。',
    explanation: 'のび ＝ 0.3 × 20 ＝ 6cm。{全長|ぜんちょう} ＝ {自然長|しぜんちょう} ＋ のび ＝ 8 ＋ 6 ＝ 14cm。「のび→{全長|ぜんちょう}」の2ステップだね。',
    diagram: { connect: 'single', natural: 8, nobi: 6, load: 20, unknown: 'total', showTotal: true, totalLen: 14, noteLeft: '0.3 × 20 ＝ 6cm', noteRight: '8 ＋ 6 ＝ 14cm' },
  },
  {
    // 検算: 直列。1g=0.4cm。40gで1本16cm。2本直列→各40g→各16cm→合計32cm ✓
    id: 'bane-10', title: '★★のしあげ（直列ののび）', difficulty: 2,
    problemText: '1g あたり 0.4cm のびるばねを、たてに2本つなぎ（{直列|ちょくれつ}）、40g をつるしました。ばね{全体|ぜんたい}で{何|なん}cm のびますか？',
    answer: '32', answerUnit: 'cm',
    choices: ['32', '16', '8', '64'],
    scaffoldHint: '{直列|ちょくれつ}は どちらのばねにも 40g かかるよ。まず 1本の のび（0.4 × 40）を{出|だ}して、2本ぶんに しよう。',
    explanation: '1本の のび ＝ 0.4 × 40 ＝ 16cm。{直列|ちょくれつ}は{両方|りょうほう}に 40g かかるので 2本で 16 ＋ 16 ＝ 32cm。',
    diagram: { connect: 'series', natural: 10, nobi: 32, load: 40, unknown: 'nobi', noteLeft: 'それぞれに 40g', noteRight: '16 ＋ 16 ＝ 32cm' },
  },

  // ── ★★★ 応用（5問）─────────────────────
  {
    // 検算: 並列。1本 60gで30cmのび（1g=0.5cm）。2本並列→各30g→0.5×30=15cm ✓
    id: 'bane-11', title: '並列つなぎ（よこに2本）', difficulty: 3,
    problemText: '1本だと 60g つるすと 30cm のびるばねがあります。{同|おな}じばねを よこに2本ならべて（{並列|へいれつ}）、その{下|した}に 60g をつるすと、ばねは{何|なん}cm のびますか？',
    answer: '15', answerUnit: 'cm',
    choices: ['15', '30', '60', '7.5'],
    scaffoldHint: '{並列|へいれつ}は2本で{支|ささ}えるから、1本にかかる おもさは「{半分|はんぶん}」だよ。60g の{半分|はんぶん}は？ それで のびをもとめよう。',
    explanation: '{並列|へいれつ}は2本で{支|ささ}えるので、1本には 60 ÷ 2 ＝ 30g。1本は 60g で 30cm のびる（1g で 0.5cm）から、30g では 0.5 × 30 ＝ 15cm。よこに ならべると のびは{半分|はんぶん}！',
    diagram: { connect: 'parallel', natural: 10, nobi: 15, load: 60, unknown: 'nobi', noteLeft: '1本に 30g ずつ', noteRight: '0.5 × 30 ＝ 15cm' },
  },
  {
    // 検算: 並列。1g=0.2cm。40gを2本並列→各20g→0.2×20=4cm ✓
    id: 'bane-12', title: '並列ののび', difficulty: 3,
    problemText: '1g あたり 0.2cm のびるばねを、よこに2本ならべて（{並列|へいれつ}）、40g をつるしました。ばねは{何|なん}cm のびますか？',
    answer: '4', answerUnit: 'cm',
    choices: ['4', '8', '2', '16'],
    scaffoldHint: '{並列|へいれつ}は1本に おもさの{半分|はんぶん}しかかからないよ。40g の{半分|はんぶん}は 20g。0.2 × 20 を けいさんしてみよう。',
    explanation: '{並列|へいれつ}は1本に 40 ÷ 2 ＝ 20g。のび ＝ 0.2 × 20 ＝ 4cm。「{半分|はんぶん}にしてから のびを{計算|けいさん}」が{並列|へいれつ}のコツ。',
    diagram: { connect: 'parallel', natural: 10, nobi: 4, load: 40, unknown: 'nobi', noteLeft: '1本に 20g ずつ', noteRight: '0.2 × 20 ＝ 4cm' },
  },
  {
    // 検算: 直列+全長。自然長10cmのばね2本直列、1g=0.5cm、20g。
    // 各20g→0.5×20=10cm のび。全長=自然長10×2 + のび10×2 = 20+20=40cm ✓
    id: 'bane-13', title: '直列の全長をもとめる', difficulty: 3,
    problemText: '{自然長|しぜんちょう} 10cm・1g あたり 0.5cm のびるばねを、たてに2本つなぎ（{直列|ちょくれつ}）、20g をつるしました。ばね2本ぶんの{全長|ぜんちょう}（ぜんぶの{長|なが}さ）は{何|なん}cm ですか？',
    answer: '40', answerUnit: 'cm',
    choices: ['40', '30', '20', '50'],
    scaffoldHint: 'まず1本の のび（0.5 × 20）を{出|だ}そう。{直列|ちょくれつ}は2本とも{同|おな}じだけ のびる。{自然長|しぜんちょう}も2本ぶん（10 × 2）あるよ。',
    explanation: '1本の のび ＝ 0.5 × 20 ＝ 10cm。{直列|ちょくれつ}は{両方|りょうほう}に 20g かかるので2本とも 10cm のびる。{全長|ぜんちょう} ＝ {自然長|しぜんちょう}2本（10 ＋ 10）＋ のび2本（10 ＋ 10）＝ 40cm。',
    diagram: { connect: 'series', natural: 10, nobi: 20, load: 20, unknown: 'total', showTotal: true, totalLen: 40, noteLeft: 'のび 10 ＋ 10', noteRight: '20 ＋ 20 ＝ 40cm' },
  },
  {
    // 検算: 2種ばね直列。A:1g=0.5cm、B:1g=0.3cm。30gが両方にかかる。
    // A:0.5×30=15cm、B:0.3×30=9cm。のび合計=24cm ✓
    id: 'bane-14', title: '2種類のばねを直列に', difficulty: 3,
    problemText: 'ばねA（1g あたり 0.5cm のびる）と ばねB（1g あたり 0.3cm のびる）を たてにつなぎ（{直列|ちょくれつ}）、30g をつるしました。AとB をあわせて{何|なん}cm のびますか？',
    answer: '24', answerUnit: 'cm',
    choices: ['24', '15', '9', '12'],
    scaffoldHint: '{直列|ちょくれつ}では AにもBにも 30g が「{全部|ぜんぶ}」かかるよ。Aののび（0.5×30）と Bののび（0.3×30）をそれぞれ{出|だ}して{足|た}そう。',
    explanation: 'A は 0.5 × 30 ＝ 15cm、B は 0.3 × 30 ＝ 9cm のびる。{直列|ちょくれつ}は{両方|りょうほう}に 30g かかるので、{合計|ごうけい}は 15 ＋ 9 ＝ 24cm。ばねが ちがっても「それぞれ{計算|けいさん}して{足|た}す」だけ。',
    diagram: { connect: 'series', natural: 10, nobi: 24, load: 30, unknown: 'nobi', labelNatural: 'A・B', noteLeft: 'A 15cm ＋ B 9cm', noteRight: '15 ＋ 9 ＝ 24cm' },
  },
  {
    // 検算: 並列+全長。自然長10cm・1g=0.4cmのばね、同じもの2本並列で50g支える。
    // 各25g→0.4×25=10cm のび。全長=自然長10+のび10=20cm（1本ぶんの長さ）✓
    id: 'bane-15', title: '★★★のしあげ（並列の全長）', difficulty: 3,
    problemText: '{自然長|しぜんちょう} 10cm・1g あたり 0.4cm のびるばねを、よこに2本ならべて（{並列|へいれつ}）、50g をつるしました。このときの ばね1本の{全長|ぜんちょう}（ぜんぶの{長|なが}さ）は{何|なん}cm ですか？',
    answer: '20', answerUnit: 'cm',
    choices: ['20', '30', '15', '25'],
    scaffoldHint: '{並列|へいれつ}は2本で{支|ささ}えるから、1本には 50 ÷ 2 ＝ 25g。のび（0.4 × 25）を{出|だ}して、{自然長|しぜんちょう} 10cm を{足|た}そう。',
    explanation: '{並列|へいれつ}は1本に 50 ÷ 2 ＝ 25g。のび ＝ 0.4 × 25 ＝ 10cm。{全長|ぜんちょう} ＝ {自然長|しぜんちょう} ＋ のび ＝ 10 ＋ 10 ＝ 20cm。「{半分|はんぶん}にする→のび→{全長|ぜんちょう}」の3ステップ、これができたら ばねは{合格|ごうかく}レベル！',
    diagram: { connect: 'parallel', natural: 10, nobi: 10, load: 50, unknown: 'total', showTotal: true, totalLen: 20, noteLeft: '1本に 25g', noteRight: '10 ＋ 10 ＝ 20cm' },
  },
]
