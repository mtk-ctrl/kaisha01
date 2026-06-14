export type DiagramType = 'slide' | 'dot-line' | 'area' | 'line-seg' | 'arrow' | 'gap' | 'ratio-bar' | 'ratio2' | 'noudo' | 'profit' | 'none'
export type Difficulty = 1 | 2 | 3

export interface HintStep {
  step: number
  text: string
}

export interface Problem {
  id: string
  title: string
  difficulty: Difficulty
  problemText: string
  answer: string
  answerUnit: string
  diagramType: DiagramType
  diagramSpec: Record<string, unknown>
  hints: HintStep[]
  explanationText: string
  choices?: string[] // 選択肢（指定時はこちらを優先）
}

export interface IntroSlide {
  title: string
  explanation: string[]   // 図の読み方を箇条書きで
  diagramSpec: Record<string, unknown>
}

export interface JukuUnit {
  id: string
  order: number
  title: string
  titleKana: string
  emoji: string
  color: string
  layer: 1 | 2 | 3 | 4 | 5
  prerequisiteIds: string[]
  coreConcept: string
  approachText: string
  primaryDiagram: DiagramType
  introSlide?: IntroSlide  // 図の読み方スライド
  problems: Problem[]
  isFree: boolean
}

export const JUKU_UNITS: JukuUnit[] = [
  // ─────────────────────────────────────
  // Unit 1: 単位変換
  // ─────────────────────────────────────
  {
    id: 'unit-conversion',
    order: 1,
    title: '単位変換',
    titleKana: 'たんいへんかん',
    emoji: '📏',
    color: '#60a5fa',
    layer: 1,
    prerequisiteIds: [],
    isFree: true,
    coreConcept: '大きい単位と小さい単位の「位（くらい）のずれ」をスライドで感じ取る',
    approachText:
      '「1km＝1000m」という数式を丸暗記するのではなく、\n目盛りをスライドさせるイメージで考えよう。\nkm → m に変換するときは、数字が1000倍（右に3つずれる）になる。',
    primaryDiagram: 'slide',
    problems: [
      // ★ かんたん
      {
        id: 'uc-01', title: 'km → m に変換しよう', difficulty: 1,
        problemText: '3km（キロメートル）は何m（メートル）ですか？',
        answer: '3000', answerUnit: 'm',
        diagramType: 'slide',
        diagramSpec: {
          units: ['km', 'm', 'cm', 'mm'],
          from: 'km', to: 'm',
          value: 3,
          steps: 1000,
          direction: 'down',
        },
        hints: [
          { step: 1, text: '目盛りを右（小さい単位の方向）へスライドさせてみよう。km → m は右に3マス進むよ。' },
          { step: 2, text: '右に3マス進むと、数字は10×10×10＝1000倍になるよ。3km なら…' },
          { step: 3, text: 'あとは 3 × 1000 を計算してみよう！' },
        ],
        explanationText: '1km ＝ 1000m。km から m に変換するとき、数字を1000倍するよ。',
      },
      {
        id: 'uc-02', title: 'g → kg に変換しよう', difficulty: 1,
        problemText: '5000g（グラム）は何kg（キログラム）ですか？',
        answer: '5', answerUnit: 'kg',
        diagramType: 'slide',
        diagramSpec: {
          units: ['kg', 'g'],
          from: 'g', to: 'kg',
          value: 5000,
          steps: 1000,
          direction: 'up',
        },
        hints: [
          { step: 1, text: '今度は左（大きい単位の方向）へスライドするよ。g → kg は左に3マス。' },
          { step: 2, text: '左に3マスだから、数字は1000分の1になるよ。5000g なら…' },
          { step: 3, text: 'あとは 5000 ÷ 1000 を計算してみよう！' },
        ],
        explanationText: '1kg ＝ 1000g。g から kg に変換するとき、数字を1000で割るよ。',
      },
      {
        id: 'uc-03', title: 'L → mL に変換しよう', difficulty: 1,
        problemText: '2L（リットル）は何mL（ミリリットル）ですか？',
        answer: '2000', answerUnit: 'mL',
        diagramType: 'slide',
        diagramSpec: {
          units: ['L', 'dL', 'mL'],
          from: 'L', to: 'mL',
          value: 2,
          steps: 1000,
          direction: 'down',
        },
        hints: [
          { step: 1, text: '1L ＝ 10dL（デシリットル）＝ 1000mL だよ。目盛りを右に動かそう。' },
          { step: 2, text: 'L → mL は右に3マス。数字は1000倍になるよ。' },
          { step: 3, text: 'あとは 2 × 1000 を計算してみよう！' },
        ],
        explanationText: '1L ＝ 1000mL。L から mL に変換するとき、数字を1000倍するよ。',
      },
      {
        id: 'uc-04', title: 'cm → mm に変換しよう', difficulty: 1,
        problemText: '4.5cm（センチメートル）は何mm（ミリメートル）ですか？',
        answer: '45', answerUnit: 'mm',
        diagramType: 'slide',
        diagramSpec: {
          units: ['m', 'cm', 'mm'],
          from: 'cm', to: 'mm',
          value: 4.5,
          steps: 10,
          direction: 'down',
        },
        hints: [
          { step: 1, text: 'cm → mm は右に1マス（×10）だよ。小数点に注意してね。' },
          { step: 2, text: '4.5 × 10 ＝ ? 小数点を右に1つ動かすと…' },
          { step: 3, text: 'あとは 4.5 × 10 を計算してみよう！' },
        ],
        explanationText: '1cm ＝ 10mm。cm から mm は×10。小数点が右に1つ動くよ。',
      },
      {
        id: 'uc-05', title: 'm → km に変換しよう', difficulty: 1,
        problemText: '7500m（メートル）は何km（キロメートル）ですか？',
        answer: '7.5', answerUnit: 'km',
        diagramType: 'slide',
        diagramSpec: {
          units: ['km', 'm'],
          from: 'm', to: 'km',
          value: 7500,
          steps: 1000,
          direction: 'up',
        },
        hints: [
          { step: 1, text: 'm → km は左に3マス（÷1000）だよ。' },
          { step: 2, text: '7500 ÷ 1000 ＝ ? 小数点を左に3つ動かすと…' },
          { step: 3, text: 'あとは 7500 ÷ 1000 を計算してみよう！' },
        ],
        explanationText: '1km ＝ 1000m。m → km は÷1000。小数点が左に3つ動くよ。',
      },
      // ★★ ふつう
      {
        id: 'uc-06', title: '単位を合わせて計算しよう', difficulty: 2,
        problemText: '1km200mの道のりを歩きました。何m歩きましたか？',
        answer: '1200', answerUnit: 'm',
        diagramType: 'slide',
        diagramSpec: {
          units: ['km', 'm'],
          from: 'km', to: 'm',
          value: 1,
          extra: 200,
          direction: 'down',
        },
        hints: [
          { step: 1, text: 'まず1kmを何mか計算しよう。1km ＝ ?m' },
          { step: 2, text: '1km ＝ 1000m だね。そこに200mを足すよ。' },
          { step: 3, text: 'あとは 1000m ＋ 200m を計算してみよう！' },
        ],
        explanationText: '混合単位の問題は、まず全部同じ単位に揃えてから計算しよう。',
      },
      {
        id: 'uc-07', title: '重さの単位を揃えよう', difficulty: 2,
        problemText: '2kg300gのリュックと800gの水筒があります。合わせて何gですか？',
        answer: '3100', answerUnit: 'g',
        diagramType: 'slide',
        diagramSpec: {
          units: ['kg', 'g'],
          from: 'kg', to: 'g',
          value: 2,
          extra: 300,
          direction: 'down',
        },
        hints: [
          { step: 1, text: '2kg300g を全部gにしよう。2kg ＝ ?g' },
          { step: 2, text: '2kg ＝ 2000g。なので2kg300g ＝ 2300g だよ。' },
          { step: 3, text: 'あとは 2300g ＋ 800g を計算してみよう！' },
        ],
        explanationText: 'kg と g が混じっているときは、全部gに変換してから計算しよう。',
      },
      {
        id: 'uc-08', title: '容積の問題', difficulty: 2,
        problemText: '3L入りのジュースから500mLずつ4本のコップに注ぎました。残りは何mLですか？',
        answer: '1000', answerUnit: 'mL',
        diagramType: 'slide',
        diagramSpec: {
          units: ['L', 'mL'],
          from: 'L', to: 'mL',
          value: 3,
          direction: 'down',
        },
        hints: [
          { step: 1, text: 'まず3LをmLに変換しよう。3L ＝ ?mL' },
          { step: 2, text: '3L ＝ 3000mL。4本に500mLずつ注いだ量は？' },
          { step: 3, text: 'コップ4はい分は 500 × 4 mL。それを 3000mL から引けば、のこりがわかるよ。500 × 4 を計算して、3000 から引いてみよう！' },
        ],
        explanationText: '計算の前に単位を揃えるのが鉄則。3L→3000mL にしてから引き算。',
      },
      {
        id: 'uc-09', title: '面積の単位（a・ha）', difficulty: 2,
        problemText: '2ha（ヘクタール）は何a（アール）ですか？',
        answer: '200', answerUnit: 'a',
        diagramType: 'slide',
        diagramSpec: {
          units: ['ha', 'a', 'm²'],
          from: 'ha', to: 'a',
          value: 2,
          steps: 100,
          direction: 'down',
        },
        hints: [
          { step: 1, text: '面積の単位は m²→a→ha の順に大きくなるよ。1ha ＝ ?a' },
          { step: 2, text: '1ha ＝ 100a。サッカーコート（約1ha）が100aだよ。' },
          { step: 3, text: 'あとは 2 × 100 を計算してみよう！' },
        ],
        explanationText: '1ha ＝ 100a ＝ 10000m²。面積は2ケタずつ変わるよ。',
      },
      {
        id: 'uc-10', title: '時間の単位変換', difficulty: 2,
        problemText: '3時間45分は何分ですか？',
        answer: '225', answerUnit: '分',
        diagramType: 'none',
        diagramSpec: {},
        hints: [
          { step: 1, text: '1時間 ＝ 60分。3時間は何分？' },
          { step: 2, text: '3 × 60 ＝ 180分。そこに45分を足すよ。' },
          { step: 3, text: 'あとは 180 ＋ 45 を計算してみよう！' },
        ],
        explanationText: '時間の換算は×60。3時間＝180分に45分を足して225分。',
      },
      // ★★★ むずかしい
      {
        id: 'uc-11', title: '3段階の変換', difficulty: 3,
        problemText: '2.5kmは何cmですか？',
        answer: '250000', answerUnit: 'cm',
        diagramType: 'slide',
        diagramSpec: {
          units: ['km', 'm', 'cm', 'mm'],
          from: 'km', to: 'cm',
          value: 2.5,
          direction: 'down',
        },
        hints: [
          { step: 1, text: 'km → m → cm と2段階変換しよう。km → m は×1000。' },
          { step: 2, text: '2.5 × 1000 ＝ 2500m。次に m → cm は×100。' },
          { step: 3, text: 'あとは 2500 × 100 を計算してみよう！' },
        ],
        explanationText: '2段階変換は順番に。km→m(×1000)→cm(×100)。合わせて×100000。',
      },
      {
        id: 'uc-12', title: '単位換算で大きさ比較', difficulty: 3,
        problemText: '1.2km、1050m、12000cmのうち、いちばん長いのはどれですか？',
        answer: '①1.2km', answerUnit: '',
        choices: ['①1.2km', '②1050m', '③12000cm'],
        diagramType: 'slide',
        diagramSpec: {
          units: ['km', 'm', 'cm'],
          comparisons: [
            { label: '①1.2km', valueM: 1200 },
            { label: '②1050m', valueM: 1050 },
            { label: '③12000cm', valueM: 120 },
          ],
        },
        hints: [
          { step: 1, text: 'バラバラな単位は全部mに揃えて比べよう。①1.2km ＝ ?m' },
          { step: 2, text: '①1.2km ＝ 1200m、②1050m、③12000cm ＝ 120m。並べると…' },
          { step: 3, text: '1200m ＞ 1050m ＞ 120m。いちばん長いのは①1.2kmだよ！' },
        ],
        explanationText: '比較するときは単位を揃えるのが基本。全部mにすると簡単に比べられるよ。',
      },
      {
        id: 'uc-13', title: '速さと単位変換の組合せ', difficulty: 3,
        problemText: '分速80mで走る人は、1時間に何km進みますか？',
        answer: '4.8', answerUnit: 'km',
        diagramType: 'none',
        diagramSpec: {},
        hints: [
          { step: 1, text: '1時間 ＝ 60分。まず1時間で何m進むか計算しよう。' },
          { step: 2, text: '80m × 60 ＝ 4800m。これをkmに変換するよ。' },
          { step: 3, text: 'あとは 4800 ÷ 1000 を計算してみよう！' },
        ],
        explanationText: '「分速 → 時速」は×60。「m → km」は÷1000。2段階でOK。',
      },
      {
        id: 'uc-14', title: '体積の単位', difficulty: 3,
        problemText: '1辺が1mの立方体（ブロック）の体積は何L（リットル）ですか？',
        answer: '1000', answerUnit: 'L',
        diagramType: 'none',
        diagramSpec: {},
        hints: [
          { step: 1, text: '1m ＝ 100cmだから、1m³（立方メートル）＝ 100cm × 100cm × 100cm。' },
          { step: 2, text: '100 × 100 × 100 ＝ 1000000cm³。また、1L ＝ 1000cm³ だよ。' },
          { step: 3, text: '1m³ ＝ 1000000cm³。1000cm³ ＝ 1L だから、あとは 1000000 ÷ 1000 を計算してみよう！' },
        ],
        explanationText: '1m³ ＝ 1000L。立体の単位変換は3乗になるので注意。',
      },
      {
        id: 'uc-15', title: '単位の混合文章題', difficulty: 3,
        problemText: 'A市からB市まで2.4km。A市からC市まで1800mです。BからCまでは何mですか？',
        answer: '600', answerUnit: 'm',
        diagramType: 'none',
        diagramSpec: {},
        hints: [
          { step: 1, text: '単位がバラバラ（km と m）。まず全部mに揃えよう。2.4km ＝ ?m' },
          { step: 2, text: '2.4km ＝ 2400m。A→B ＝ 2400m、A→C ＝ 1800m だね。' },
          { step: 3, text: 'あとは 2400 − 1800 を計算してみよう！' },
        ],
        explanationText: '単位を揃えてから引き算。2400m − 1800m ＝ 600m。',
      },
    ],
  },

  // ─────────────────────────────────────
  // Unit 2: 植木算
  // ─────────────────────────────────────
  {
    id: 'tree-planting',
    order: 2,
    title: '植木算',
    titleKana: 'うえきざん',
    emoji: '🌳',
    color: '#4ade80',
    layer: 1,
    prerequisiteIds: ['unit-conversion'],
    isFree: true,
    coreConcept: '「木の数」と「間（スキマ）の数」のペア関係を図で見抜く',
    approachText:
      '「木の数＝間の数＋1」という公式を丸暗記するのではなく、\n木1本とスキマ1つのセット（ペア）を作るイメージで考えよう。\n両端が木の直線、片端が木の直線、円形（1周）でルールが変わるよ。',
    primaryDiagram: 'dot-line',
    problems: [
      // ★ かんたん
      {
        id: 'tp-01', title: '直線・両端あり（基本）', difficulty: 1,
        problemText: '長さ20mの道に、両はしと間に2mおきに木を植えます。木は何本ひつようですか？',
        answer: '11', answerUnit: '本',
        diagramType: 'dot-line',
        diagramSpec: {
          type: 'line-both',
          totalLength: 20,
          interval: 2,
          showPairs: true,
        },
        hints: [
          { step: 1, text: '20m ÷ 2m ＝ 10。これは「スキマの数」だよ。図に10個のスキマを描いてみよう。' },
          { step: 2, text: 'スキマの右はしには必ず木がある。10個のスキマ → 木も10本。でも…左のはしの木を忘れてない？' },
          { step: 3, text: '両はしに木があるときは『スキマの数 ＋ 1』が木の数だよ。あとは 10 ＋ 1 を計算してみよう！' },
        ],
        explanationText: '両端あり：木の数 ＝ スキマの数 ＋ 1。20÷2＝10スキマ、10＋1＝11本。',
      },
      {
        id: 'tp-02', title: '直線・両端あり（木の数から間隔）', difficulty: 1,
        problemText: '30mの道に、両はしをふくめて7本の木を植えます。木と木の間は何mですか？',
        answer: '5', answerUnit: 'm',
        diagramType: 'dot-line',
        diagramSpec: {
          type: 'line-both',
          totalLength: 30,
          trees: 7,
          findInterval: true,
        },
        hints: [
          { step: 1, text: '木が7本あるとき、スキマは何個？木とスキマのペアを数えよう。' },
          { step: 2, text: '両端ありのとき、スキマ ＝ 木の数 − 1 ＝ 7 − 1 ＝ 6個。' },
          { step: 3, text: '木が7本ならスキマは 7 − 1 ＝ 6個。全長をスキマの数でわると間かくが出るよ。30 ÷ 6 を計算してみよう！' },
        ],
        explanationText: '両端あり：スキマの数 ＝ 木の数 − 1。30÷（7−1）＝30÷6＝5m。',
      },
      {
        id: 'tp-03', title: '直線・両端なし', difficulty: 1,
        problemText: '24mのロープに、両はしには結ばず、3mおきに旗（はた）をつけます。旗は何枚ひつようですか？',
        answer: '7', answerUnit: '枚',
        diagramType: 'dot-line',
        diagramSpec: {
          type: 'line-none',
          totalLength: 24,
          interval: 3,
          showPairs: true,
        },
        hints: [
          { step: 1, text: '24m ÷ 3m ＝ 8スキマ。はしに旗はないから、旗の数はスキマと同じ？ちょっと待って。' },
          { step: 2, text: '両端なしの場合、いちばん左のスキマに旗がない。スキマ8個、旗はスキマ−1？…いや、旗はスキマの「中」にあるよ。' },
          { step: 3, text: '両はしに旗を立てないときは『スキマの数 − 1』が旗の数。あとは 8 − 1 を計算してみよう！' },
        ],
        explanationText: '両端なし：旗（木）の数 ＝ スキマの数 − 1。24÷3＝8、8−1＝7枚。',
      },
      {
        id: 'tp-04', title: '円形（1周）', difficulty: 1,
        problemText: '池の周り（1周100m）に、5mおきに木を植えます。木は何本ひつようですか？',
        answer: '20', answerUnit: '本',
        diagramType: 'dot-line',
        diagramSpec: {
          type: 'circle',
          totalLength: 100,
          interval: 5,
        },
        hints: [
          { step: 1, text: '100m ÷ 5m ＝ 20スキマ。円は一周でスタートに戻ってくるよ。' },
          { step: 2, text: '円形のとき、木の数はスキマの数と同じ！なぜかというと、最後の木がスタートの木と同じだから。' },
          { step: 3, text: 'スキマ20個 ＝ 木20本！円のときは「スキマの数＝木の数」。' },
        ],
        explanationText: '円形：木の数 ＝ スキマの数。100÷5＝20本。はしがないから±1しない。',
      },
      {
        id: 'tp-05', title: '直線・両端あり（道の長さを求める）', difficulty: 1,
        problemText: '4mおきに9本の木を両はしに植えました。道の長さは何mですか？',
        answer: '32', answerUnit: 'm',
        diagramType: 'dot-line',
        diagramSpec: {
          type: 'line-both',
          trees: 9,
          interval: 4,
          findLength: true,
        },
        hints: [
          { step: 1, text: '木9本のとき、スキマは何個？両端ありのスキマの数は…' },
          { step: 2, text: 'スキマ ＝ 9 − 1 ＝ 8個。スキマ1つが4m だよ。' },
          { step: 3, text: 'あとは 8 × 4m を計算してみよう！' },
        ],
        explanationText: '全長 ＝ スキマの数 × 間隔。スキマ ＝ 9−1 ＝ 8。8×4＝32m。',
      },
      // ★★ ふつう
      {
        id: 'tp-06', title: '方陣算（まわりを囲む）', difficulty: 2,
        problemText: '1辺に5本の木を植えて正方形のまわりを囲みます（かどには1本）。木は全部で何本ですか？',
        answer: '16', answerUnit: '本',
        diagramType: 'dot-line',
        diagramSpec: {
          type: 'square',
          perSide: 5,
        },
        hints: [
          { step: 1, text: '1辺5本なら4辺で5×4＝20本？でも、かど（角）の木を2回数えてるよ。' },
          { step: 2, text: 'かどの木は4本あって、それぞれ2回数えているよ。20本から、重なって数えた4本を引いてみよう。' },
          { step: 3, text: '正方形のまわりは『（1辺の本数 − 1）× 4』で求められるよ。あとは （5 − 1）× 4 を計算してみよう！' },
        ],
        explanationText: '正方形のまわり：（1辺−1）×4。かどの重複カウントをなくすのがポイント。',
      },
      {
        id: 'tp-07', title: '電柱問題（片端あり・片端なし）', difficulty: 2,
        problemText: '道の左はしから右はしの手前まで、50mおきに電柱を立てます。道の全長は300mです。電柱は何本ですか？',
        answer: '6', answerUnit: '本',
        diagramType: 'dot-line',
        diagramSpec: {
          type: 'line-left',
          totalLength: 300,
          interval: 50,
        },
        hints: [
          { step: 1, text: '「右はしの手前まで」ということは、右はしには電柱がない。左はしにはある。これは片端あり。' },
          { step: 2, text: '300 ÷ 50 ＝ 6スキマ。左はしに電柱があって、右はしにはない。' },
          { step: 3, text: '片はし（右）には立てないから、電柱の数 ＝ スキマの数 になるよ。まず『全長 ÷ 間かく』でスキマの数を計算してみよう！' },
        ],
        explanationText: '片端あり：電柱数 ＝ スキマ数。両端ありと違い＋1しない。',
      },
      {
        id: 'tp-08', title: '円形（間隔を求める）', difficulty: 2,
        problemText: '円形の競技場（1周240m）に、同じ間隔で旗を16本立てます。旗と旗の間は何mですか？',
        answer: '15', answerUnit: 'm',
        diagramType: 'dot-line',
        diagramSpec: {
          type: 'circle',
          totalLength: 240,
          flags: 16,
          findInterval: true,
        },
        hints: [
          { step: 1, text: '円形では旗の数 ＝ スキマの数。旗16本 ＝ スキマ16個。' },
          { step: 2, text: '全長240m ÷ スキマ16個 ＝ ?m' },
          { step: 3, text: 'あとは 240 ÷ 16 を計算してみよう！' },
        ],
        explanationText: '円形：間隔 ＝ 全長 ÷ 旗の数。240÷16＝15m。',
      },
      {
        id: 'tp-09', title: '木を増やしたら何m短くなる？', difficulty: 2,
        problemText: '50mの道に、両はしをふくめて6本の木を植える予定でした。木を1本増やすと、木の間隔は何m短くなりますか？',
        answer: '2', answerUnit: 'm',
        diagramType: 'dot-line',
        diagramSpec: {
          type: 'compare',
          totalLength: 50,
          trees1: 6,
          trees2: 7,
        },
        hints: [
          { step: 1, text: 'もともと6本のとき、スキマは5個。50 ÷ 5 ＝ 10m間隔。' },
          { step: 2, text: '7本に増やすと、スキマは6個。50 ÷ 6 ＝ ?m（割り切れない？）' },
          { step: 3, text: '6本のときスキマ5個で間かくは 50 ÷ 5。7本のときスキマ6個で間かくは 50 ÷ 6。この2つの間かくの差が「何m短くなるか」だよ。それぞれ計算してくらべてみよう！' },
        ],
        explanationText: '6本→スキマ5→10m間隔。7本→スキマ6→約8.3m間隔。差≈1.7m。',
      },
      {
        id: 'tp-10', title: '方陣算（何本並べたか逆算）', difficulty: 2,
        problemText: '正方形のまわりに同じ間隔で木を植えたら、全部で20本になりました。1辺には何本の木がありますか？（かどをふくむ）',
        answer: '6', answerUnit: '本',
        diagramType: 'dot-line',
        diagramSpec: {
          type: 'square-reverse',
          total: 20,
        },
        hints: [
          { step: 1, text: '正方形のまわり：全体 ＝（1辺−1）×4。これを逆算しよう。' },
          { step: 2, text: '20 ＝（1辺−1）× 4 → 1辺−1 ＝ 20÷4 ＝ 5。' },
          { step: 3, text: 'まわりの本数 ÷ 4 ＝ 5（1辺のスキマ）。1辺の本数は『スキマ ＋ 1』だから、あとは 5 ＋ 1 を計算してみよう！' },
        ],
        explanationText: '（全体÷4）＋1 ＝ 1辺の木の数。20÷4＝5、5＋1＝6本。',
      },
      // ★★★ むずかしい
      {
        id: 'tp-11', title: '2種類の間隔', difficulty: 3,
        problemText: '100mの道の両はしに木を植え、残りを赤い木は5mおき、青い木は4mおきで植えます。赤と青の両方に植えられる場所（重なる場所）は何か所ですか？（両はしは除く）',
        answer: '4', answerUnit: 'か所',
        diagramType: 'dot-line',
        diagramSpec: {
          type: 'lcm',
          totalLength: 100,
          interval1: 5,
          interval2: 4,
        },
        hints: [
          { step: 1, text: '5mおきと4mおきで両方に植えられる場所は「最小公倍数」のところ。5と4の最小公倍数は？' },
          { step: 2, text: '5と4の最小公倍数は20。つまり20mおきの場所が重なるよ。100mの間で20mおきに何か所あるかな？' },
          { step: 3, text: '20m, 40m, 60m, 80m の4か所！（0mと100mの両はしは除く）最小公倍数が「重なり」問題のカギ。' },
        ],
        explanationText: '重なりは最小公倍数で考える。lcm(4,5)＝20。20m刻みで100mに4か所。',
      },
      {
        id: 'tp-12', title: '円形＋増設問題', difficulty: 3,
        problemText: '円形コース（1周120m）に10mおきに旗が立っています。旗を増やして5mおきにしたいとき、新たに何本の旗を追加する必要がありますか？',
        answer: '12', answerUnit: '本',
        diagramType: 'dot-line',
        diagramSpec: {
          type: 'circle-add',
          totalLength: 120,
          oldInterval: 10,
          newInterval: 5,
        },
        hints: [
          { step: 1, text: '今は10mおきなので120÷10＝12本。5mおきにすると120÷5＝24本。' },
          { step: 2, text: 'もともとある12本はそのまま使えるから、追加は24−12本？でも10mおきの場所は5mおきにも含まれるよ。' },
          { step: 3, text: 'ぜんぶで必要な旗は24本、今あるのは12本。あとは 24 − 12 を計算してみよう！' },
        ],
        explanationText: '5mおき→24本必要。既存12本は全て5m刻みの位置にある。追加＝24−12＝12本。',
      },
      {
        id: 'tp-13', title: '方陣算（中ぬき）', difficulty: 3,
        problemText: '1辺7個のマスを並べた正方形（7×7）のまわりにだけマスを置きます。まわりのマスは何個ですか？',
        answer: '24', answerUnit: '個',
        diagramType: 'dot-line',
        diagramSpec: {
          type: 'hollow-square',
          side: 7,
        },
        hints: [
          { step: 1, text: '全体は7×7＝49個。まわり以外（中の部分）は何個？中は(7−2)×(7−2)の正方形。' },
          { step: 2, text: '中は5×5＝25個。まわりは「全体 − 中」だから、49 − 25 を計算してみよう。' },
          { step: 3, text: '正方形のまわりは『（1辺の本数 − 1）× 4』。あとは （7 − 1）× 4 を計算してみよう！' },
        ],
        explanationText: 'まわりの数＝（1辺−1）×4。(7−1)×4＝24個。または全体−中心(5×5)＝24。',
      },
      {
        id: 'tp-14', title: '植木算の逆算（全長を求める）', difficulty: 3,
        problemText: '円形のコースに9mおきに木を植えたら、30本必要でした。コースの1周は何mですか？',
        answer: '270', answerUnit: 'm',
        diagramType: 'dot-line',
        diagramSpec: {
          type: 'circle-reverse',
          interval: 9,
          trees: 30,
        },
        hints: [
          { step: 1, text: '円形では木の数 ＝ スキマの数。30本 ＝ 30スキマ。' },
          { step: 2, text: 'スキマ1つが9m。全長 ＝ スキマの数 × 間隔。' },
          { step: 3, text: '円のまわりは「木の数 ＝ スキマの数」。間かく × スキマの数 で1周の長さが出るよ。あとは 30 × 9 を計算してみよう！' },
        ],
        explanationText: '円形：全長 ＝ 木の数 × 間隔。30×9＝270m。',
      },
      {
        id: 'tp-15', title: '植木の本数（両端あり・小数間隔）', difficulty: 3,
        problemText: '45mの道に2.5mおきで、両はしをふくめて木を植えます。木は何本いりますか？',
        answer: '19', answerUnit: '本',
        diagramType: 'dot-line',
        diagramSpec: {
          type: 'line-both',
          totalLength: 45,
          interval: 2.5,
        },
        hints: [
          { step: 1, text: '45 ÷ 2.5 ＝ ?スキマ。小数の割り算を整数に直すと 450÷25。' },
          { step: 2, text: '450÷25＝18スキマ。両端ありだから木の数は？' },
          { step: 3, text: 'あとは スキマ18 ＋ 1 を計算してみよう！' },
        ],
        explanationText: '45÷2.5＝18スキマ。両端あり→18＋1＝19本。小数でも考え方は同じ。',
      },
    ],
  },

  // ─────────────────────────────────────
  // Units 3〜12: プレースホルダー（Phase 2/3で実装）
  // ─────────────────────────────────────
  // ─────────────────────────────────────
  // Unit 3: 和差算
  // ─────────────────────────────────────
  {
    id: 'sum-diff',
    order: 3,
    title: '和差算',
    titleKana: 'わさざん',
    emoji: '⚖️',
    color: '#f0c040',
    layer: 2,
    prerequisiteIds: ['tree-planting'],
    isFree: false,
    coreConcept: '「和（合計）」と「差（ちがい）」の2つが分かれば、それぞれの数が求まる',
    approachText:
      '2本の線分を並べて図にしよう。\n長い線が「大きい方」、短い線が「小さい方」。\n大きい方＝（和＋差）÷2　小さい方＝（和－差）÷2\n公式より、図を書いて「なぜそうなるか」を理解しよう。',
    primaryDiagram: 'line-seg',
    introSlide: {
      title: '線分図（せんぶんず）の読み方',
      explanation: [
        '2本の線で2つの数量を表す（長い＝大きい方・短い＝小さい方）',
        '赤い点線部分が「差（ちがい）」——2本の線の長さのちがい',
        '黄色の全体が「和（合計）」——2本の線を足した長さ',
        '小さい方を2つ並べると「和－差」になる→（和－差）÷2＝小さい方',
      ],
      diagramSpec: {
        sum: 20, diff: 4,
        largeLabel: '大きい方', smallLabel: '小さい方',
        showValues: true,
      },
    },
    problems: [
      // ──────────────────────────────────
      // ★ かんたん
      // ──────────────────────────────────
      {
        id: 'sd-01',
        title: '2つの数の和と差',
        difficulty: 1,
        problemText: '2つの数があります。和（合計）は20、差（ちがい）は4です。大きい方の数はいくつですか？',
        answer: '12',
        answerUnit: '',
        diagramType: 'line-seg',
        diagramSpec: { sum: 20, diff: 4, largeLabel: '大きい数', smallLabel: '小さい数' },
        hints: [
          { step: 1, text: '線分図を書いてみよう。長い線が「大きい数」、短い線が「小さい数」。長い線は短い線より4だけ長くなるよ。' },
          { step: 2, text: '短い線を2本並べると：合計20－差4＝16。つまり短い線（小さい方）は16÷2＝8だよ。' },
          { step: 3, text: '小さい方は8だったね。大きい方は『小さい方 ＋ 差』だから、あとは 8 ＋ 4 を計算してみよう！' },
        ],
        explanationText: '（和＋差）÷2＝大きい方。(20＋4)÷2＝12。または小さい方＝(20－4)÷2＝8、大きい方＝8＋4＝12。',
      },
      {
        id: 'sd-02',
        title: 'おはじきの問題',
        difficulty: 1,
        problemText: '兄と弟のおはじきを合わせると28個あります。兄は弟より6個多く持っています。弟は何個ですか？',
        answer: '11',
        answerUnit: '個',
        diagramType: 'line-seg',
        diagramSpec: { sum: 28, diff: 6, largeLabel: '兄', smallLabel: '弟' },
        hints: [
          { step: 1, text: '兄が多いので兄が長い線。「兄＝弟＋6」という関係を線分図に書いてみよう。' },
          { step: 2, text: '「兄＝弟＋6」だから、合計28 ＝ 弟 ＋（弟＋6）＝ 2×弟＋6。だから 2×弟 ＝ 28−6 ＝ 22個。' },
          { step: 3, text: '弟2人ぶんが22個とわかったね。弟1人ぶんは 22 ÷ 2 だよ。計算してみよう！' },
        ],
        explanationText: '小さい方（弟）＝(和－差)÷2＝(28－6)÷2＝11個。 たしかめ：兄＝11＋6＝17個、17＋11＝28 ◎',
      },
      {
        id: 'sd-03',
        title: 'リボンの長さ',
        difficulty: 1,
        problemText: '2本のリボンの合計は60cmです。長い方は短い方より20cm長いです。長い方のリボンは何cmですか？',
        answer: '40',
        answerUnit: 'cm',
        diagramType: 'line-seg',
        diagramSpec: { sum: 60, diff: 20, largeLabel: '長い方', smallLabel: '短い方' },
        hints: [
          { step: 1, text: '「短い方」を基準に線分図を書こう。長い方＝短い方＋20cm。' },
          { step: 2, text: '短い方を2本並べると：60－20＝40cm分。短い方は40÷2＝20cmだよ。' },
          { step: 3, text: '短い方は20cm。長い方は『短い方 ＋ 差』だから、あとは 20 ＋ 20 を計算してみよう！' },
        ],
        explanationText: '大きい方（長い方）＝(和＋差)÷2＝(60＋20)÷2＝40cm。',
      },
      // ──────────────────────────────────
      // ★★ ふつう
      // ──────────────────────────────────
      {
        id: 'sd-04',
        title: 'くだものの個数',
        difficulty: 2,
        problemText: 'みかんとりんごを合わせると30個あります。みかんはりんごより4個多いです。りんごは何個ですか？',
        answer: '13',
        answerUnit: '個',
        diagramType: 'line-seg',
        diagramSpec: { sum: 30, diff: 4, largeLabel: 'みかん', smallLabel: 'りんご' },
        hints: [
          { step: 1, text: 'みかんが多いのでみかんが長い線。「みかん＝りんご＋4」という関係を線分図に書こう。' },
          { step: 2, text: '合計30 ＝ りんご＋（りんご＋4）＝ 2×りんご＋4。だから 2×りんご ＝ 30−4 ＝ 26個。' },
          { step: 3, text: 'りんご2人ぶんが26個とわかったね。りんごは 26 ÷ 2 だよ。計算してみよう！' },
        ],
        explanationText: '小さい方（りんご）＝(30－4)÷2＝13個。みかん＝13＋4＝17個。 たしかめ：みかん＝13＋4＝17個、17＋13＝30 ◎',
      },
      {
        id: 'sd-05',
        title: 'クラスの人数',
        difficulty: 2,
        problemText: '1組と2組の合計は69人です。1組は2組より5人多いです。2組は何人ですか？',
        answer: '32',
        answerUnit: '人',
        diagramType: 'line-seg',
        diagramSpec: { sum: 69, diff: 5, largeLabel: '1組', smallLabel: '2組' },
        hints: [
          { step: 1, text: '1組が多いので1組が長い線。「1組＝2組＋5人」だから、合計69 ＝ 2組＋(2組＋5) ＝ 2×2組＋5。' },
          { step: 2, text: '「2×2組 ＝ 69 − 5 ＝ 64人」になるね。これを2でわると2組の人数が出るよ。' },
          { step: 3, text: 'あとは 64 ÷ 2 を計算してみよう！' },
        ],
        explanationText: '小さい方（2組）＝(69－5)÷2＝32人。 たしかめ：1組＝32＋5＝37人、37＋32＝69◎',
      },
      {
        id: 'sd-06',
        title: '貯金の問題',
        difficulty: 2,
        problemText: 'たろうとはなこの貯金の合計は5000円です。たろうははなこより600円多く貯金しています。はなこの貯金は何円ですか？',
        answer: '2200',
        answerUnit: '円',
        diagramType: 'line-seg',
        diagramSpec: { sum: 5000, diff: 600, largeLabel: 'たろう', smallLabel: 'はなこ' },
        hints: [
          { step: 1, text: 'たろうが多いのでたろうが長い線。和5000・差600を線分図に書こう。' },
          { step: 2, text: 'はなこを2本ならべると 5000 − 600 ＝ 4400円分になるね。これを2でわるとはなこの貯金だよ。' },
          { step: 3, text: 'あとは 4400 ÷ 2 を計算してみよう！' },
        ],
        explanationText: '小さい方（はなこ）＝(5000－600)÷2＝2200円。 たしかめ：たろう＝2200＋600＝2800円、2800＋2200＝5000 ◎',
      },
      {
        id: 'sd-07',
        title: '長方形の面積',
        difficulty: 2,
        problemText: '縦と横を足すと24cmになる長方形があります。横は縦より8cm長いです。この長方形の面積は何cm²ですか？',
        answer: '128',
        answerUnit: 'cm²',
        diagramType: 'line-seg',
        diagramSpec: { sum: 24, diff: 8, largeLabel: '横', smallLabel: '縦' },
        hints: [
          { step: 1, text: 'まず縦と横の長さを和差算で求めよう。和24・差8で線分図を書いてみて。' },
          { step: 2, text: '縦＝(24－8)÷2＝8cm、横＝8＋8＝16cm。次に面積を求めよう。' },
          { step: 3, text: '縦は8cm、横は16cmと出たね。あとは 面積 ＝ 8 × 16 を計算してみよう！' },
        ],
        explanationText: '縦＝(24－8)÷2＝8cm、横＝16cm。面積＝8×16＝128cm²。',
      },
      // ──────────────────────────────────
      // ★★★ むずかしい
      // ──────────────────────────────────
      {
        id: 'sd-08',
        title: '3人の点数（差が連鎖）',
        difficulty: 3,
        problemText: 'A・B・Cの3人の算数テストの合計は180点です。AはBより12点多く、BはCより6点多いです。Cは何点ですか？',
        answer: '52',
        answerUnit: '点',
        diagramType: 'none',
        diagramSpec: {
          labels3: ['A', 'B', 'C'],
          diffs3: [18, 6, 0],
        },
        hints: [
          { step: 1, text: 'CをいちばんCを基準（短い線）にしよう。B＝C＋6点、A＝C＋6＋12＝C＋18点。' },
          { step: 2, text: '3人の合計：C＋(C＋6)＋(C＋18)＝3×C＋24＝180。3×C＝156。' },
          { step: 3, text: '3 × C ＝ 156 だったね。あとは 156 ÷ 3 を計算してみよう！' },
        ],
        explanationText: 'Cを基準に置く。C＋(C＋6)＋(C＋18)＝180 → 3C＝156 → C＝52点。',
      },
      {
        id: 'sd-09',
        title: '3色のビー玉（2つずつの和から逆算）',
        difficulty: 3,
        problemText: '赤・青・黄色のビー玉があります。赤と青の合計は45個、青と黄の合計は38個、赤と黄の合計は41個です。青は何個ですか？',
        answer: '21',
        answerUnit: '個',
        diagramType: 'none',
        diagramSpec: {},
        hints: [
          { step: 1, text: '3つの式を全部足してみよう。(赤＋青)＋(青＋黄)＋(赤＋黄)＝45＋38＋41＝124。' },
          { step: 2, text: '左辺は赤・青・黄が2回ずつあるから 2×(赤＋青＋黄)＝124 → 赤＋青＋黄＝62個。' },
          { step: 3, text: '赤＋青＋黄＝62個。青は『全体 − (赤＋黄)』だから、あとは 62 − 41 を計算してみよう！' },
        ],
        explanationText: '全体＝(45＋38＋41)÷2＝62個。青＝62－(赤＋黄)＝62－41＝21個。',
      },
      {
        id: 'sd-10',
        title: '年齢算（今と何年後）',
        difficulty: 3,
        problemText: '今、父は38歳、子は10歳です。父の年齢が子の年齢のちょうど3倍になるのは何年後ですか？',
        answer: '4',
        answerUnit: '年後',
        diagramType: 'line-seg',
        diagramSpec: {
          sum: null, diff: null,
          largeLabel: '父の年齢', smallLabel: '子の年齢×3',
          isAgeType: true,
          fatherNow: 38, childNow: 10, ratio: 3,
        },
        hints: [
          { step: 1, text: '「□年後」として考えよう。□年後の父は(38＋□)歳、子は(10＋□)歳。「父＝子の3倍」という式を作るよ。' },
          { step: 2, text: '38＋□＝3×(10＋□) を解こう。右辺を展開すると 38＋□＝30＋3×□。' },
          { step: 3, text: '38 ＋ □ ＝ 30 ＋ 3×□ を整理すると 8 ＝ 2×□ になるね。あとは 8 ÷ 2 を計算して □ を求めよう！' },
        ],
        explanationText: '38＋□＝3(10＋□) → 8＝2□ → 4年後。父42歳＝子14歳×3。',
      },
    ],
  },
  // ─────────────────────────────────────
  // Unit 4: 鶴亀算
  // ─────────────────────────────────────
  {
    id: 'crane-turtle',
    order: 4,
    title: '鶴亀算',
    titleKana: 'つるかめざん',
    emoji: '🐢',
    color: '#00e5c3',
    layer: 2,
    prerequisiteIds: ['sum-diff'],
    isFree: false,
    coreConcept: '全部「小さい方」と仮定して、実際との差を1つ分の差で割る',
    approachText:
      '「もし全部鶴なら足は何本？」と仮定して計算する。\n実際の足数との差が、亀に替えた分だけ生まれている。\n差 ÷ 1匹あたりの差 ＝ 亀の数！',
    primaryDiagram: 'area',
    introSlide: {
      title: '仮定法の図の読み方',
      explanation: [
        '上のバー「実際の足数」と下のバー「全部鶴なら」を比べる',
        '短い方（仮定）が届かない部分＝差。これが亀から生まれた余分な足！',
        '差 ÷ 1匹あたりの差（2本）＝ 亀の数。和差算と同じしくみ！',
      ],
      diagramSpec: {
        totalCount: 5, totalValue: 14,
        smallUnit: 2, largeUnit: 4,
        smallName: '鶴', largeName: '亀', unit: '本',
        showValues: true,
      },
    },
    problems: [
      // ★ やさしい
      {
        id: 'tk-01',
        title: '鶴と亀（基本）',
        difficulty: 1,
        problemText: '鶴と亀が合わせて5匹います。足の合計は14本です。亀は何匹ですか？',
        answer: '2',
        answerUnit: '匹',
        diagramType: 'area',
        diagramSpec: { totalCount: 5, totalValue: 14, smallUnit: 2, largeUnit: 4, smallName: '鶴', largeName: '亀', unit: '本' },
        hints: [
          { step: 1, text: '全部鶴と仮定すると足は5×2＝10本。でも実際は14本。4本多い！' },
          { step: 2, text: '鶴を1匹だけ亀に替えると足が 4 − 2 ＝ 2本ふえるよ。多い4本ぶんを「1匹あたり2本」でわれば亀の数だね。' },
          { step: 3, text: 'あとは 4 ÷ 2 を計算してみよう！' },
        ],
        explanationText: '全部鶴なら10本。差4本÷2＝亀2匹。鶴は5－2＝3羽。 たしかめ：4×2＋2×3＝14本 ◎',
      },
      {
        id: 'tk-02',
        title: '50円玉と10円玉',
        difficulty: 1,
        problemText: '50円玉と10円玉が合わせて8枚あります。合計は240円です。50円玉は何枚ですか？',
        answer: '4',
        answerUnit: '枚',
        diagramType: 'area',
        diagramSpec: { totalCount: 8, totalValue: 240, smallUnit: 10, largeUnit: 50, smallName: '10円', largeName: '50円', unit: '円' },
        hints: [
          { step: 1, text: '全部10円玉と仮定すると8×10＝80円。実際は240円。差は160円！' },
          { step: 2, text: '10円玉を50円玉に1枚替えると 50 − 10 ＝ 40円ふえるよ。多い160円ぶんを「1枚あたり40円」でわれば50円玉の数だね。' },
          { step: 3, text: 'あとは 160 ÷ 40 を計算してみよう！' },
        ],
        explanationText: '全部10円なら80円。差160円÷40＝50円玉4枚。 たしかめ：50×4＋10×4＝240円 ◎',
      },
      {
        id: 'tk-03',
        title: '自転車と三輪車',
        difficulty: 1,
        problemText: '自転車（車輪2つ）と三輪車（車輪3つ）が合わせて6台あります。車輪は合計15個です。三輪車は何台ですか？',
        answer: '3',
        answerUnit: '台',
        diagramType: 'area',
        diagramSpec: { totalCount: 6, totalValue: 15, smallUnit: 2, largeUnit: 3, smallName: '自転車', largeName: '三輪車', unit: '個' },
        hints: [
          { step: 1, text: '全部自転車と仮定すると6×2＝12個。実際は15個。差は3個！' },
          { step: 2, text: '自転車を1台三輪車に替えると車輪が 3 − 2 ＝ 1個ふえるよ。多い3個ぶんを「1台あたり1個」でわれば三輪車の数だね。' },
          { step: 3, text: 'あとは 3 ÷ 1 を計算してみよう！' },
        ],
        explanationText: '全部自転車なら12個。差3個÷1＝三輪車3台。 たしかめ：3×3＋2×3＝15個 ◎',
      },
      // ★★ ふつう
      {
        id: 'tk-04',
        title: '鶴と亀（鶴を求める）',
        difficulty: 2,
        problemText: '鶴と亀が合わせて10匹います。足の合計は28本です。鶴は何羽ですか？',
        answer: '6',
        answerUnit: '羽',
        diagramType: 'area',
        diagramSpec: { totalCount: 10, totalValue: 28, smallUnit: 2, largeUnit: 4, smallName: '鶴', largeName: '亀', unit: '本' },
        hints: [
          { step: 1, text: '全部鶴と仮定すると10×2＝20本。実際は28本。差は8本！' },
          { step: 2, text: '1羽を亀に替えると足が2本ふえる。多い8本を2でわると亀の数。それを全体10匹から引けば鶴だよ。' },
          { step: 3, text: 'あとは 8 ÷ 2 で亀の数を出して、10 − 亀 で鶴を求めよう！' },
        ],
        explanationText: '亀を先に求める。差8÷2＝亀4匹。鶴は10－4＝6羽。 たしかめ：2×6＋4×4＝28本 ◎',
      },
      {
        id: 'tk-05',
        title: '大人と子どもの入場料',
        difficulty: 2,
        problemText: '大人（300円）と子ども（200円）が合わせて12人います。料金の合計は3100円です。大人は何人ですか？',
        answer: '7',
        answerUnit: '人',
        diagramType: 'area',
        diagramSpec: { totalCount: 12, totalValue: 3100, smallUnit: 200, largeUnit: 300, smallName: '子ども', largeName: '大人', unit: '円' },
        hints: [
          { step: 1, text: '全員子どもと仮定すると12×200＝2400円。実際は3100円。差は700円！' },
          { step: 2, text: '子ども1人を大人に替えると 300 − 200 ＝ 100円ふえるよ。多い700円ぶんを「1人あたり100円」でわれば大人の数だね。' },
          { step: 3, text: 'あとは 700 ÷ 100 を計算してみよう！' },
        ],
        explanationText: '全員子どもなら2400円。差700÷100＝大人7人。 たしかめ：300×7＋200×5＝3100円 ◎',
      },
      {
        id: 'tk-06',
        title: '100円玉と50円玉',
        difficulty: 2,
        problemText: '100円玉と50円玉が合わせて10枚あります。合計は700円です。100円玉は何枚ですか？',
        answer: '4',
        answerUnit: '枚',
        diagramType: 'area',
        diagramSpec: { totalCount: 10, totalValue: 700, smallUnit: 50, largeUnit: 100, smallName: '50円', largeName: '100円', unit: '円' },
        hints: [
          { step: 1, text: '全部50円玉と仮定すると10×50＝500円。実際は700円。差は200円！' },
          { step: 2, text: '50円玉を100円玉に1枚替えると 100 − 50 ＝ 50円ふえるよ。多い200円ぶんを「1枚あたり50円」でわれば100円玉の数だね。' },
          { step: 3, text: 'あとは 200 ÷ 50 を計算してみよう！' },
        ],
        explanationText: '全部50円なら500円。差200÷50＝100円玉4枚。 たしかめ：100×4＋50×6＝700円 ◎',
      },
      {
        id: 'tk-07',
        title: 'クモとテントウムシ',
        difficulty: 2,
        problemText: 'クモ（8本足）とテントウムシ（6本足）が合わせて7匹います。足の合計は50本です。クモは何匹ですか？',
        answer: '4',
        answerUnit: '匹',
        diagramType: 'area',
        diagramSpec: { totalCount: 7, totalValue: 50, smallUnit: 6, largeUnit: 8, smallName: 'テントウムシ', largeName: 'クモ', unit: '本' },
        hints: [
          { step: 1, text: '全部テントウムシと仮定すると7×6＝42本。実際は50本。差は8本！' },
          { step: 2, text: 'テントウムシ1匹をクモに替えると足が 8 − 6 ＝ 2本ふえるよ。多い8本ぶんを「1匹あたり2本」でわればクモの数だね。' },
          { step: 3, text: 'あとは 8 ÷ 2 を計算してみよう！' },
        ],
        explanationText: '全部テントウムシなら42本。差8÷2＝クモ4匹。 たしかめ：8×4＋6×3＝50本 ◎',
      },
      // ★★★ むずかしい
      {
        id: 'tk-08',
        title: '鶴と亀（差を確認してから）',
        difficulty: 3,
        problemText: '鶴と亀が合わせて8匹います。足の合計は22本です。鶴は何羽ですか？',
        answer: '5',
        answerUnit: '羽',
        diagramType: 'area',
        diagramSpec: { totalCount: 8, totalValue: 22, smallUnit: 2, largeUnit: 4, smallName: '鶴', largeName: '亀', unit: '本' },
        hints: [
          { step: 1, text: '全部鶴と仮定すると8×2＝16本。実際は22本。差は6本！' },
          { step: 2, text: '1羽を亀に替えると足が2本ふえる。多い6本を2でわると亀の数。それを全体8匹から引けば鶴だよ。' },
          { step: 3, text: 'あとは 6 ÷ 2 で亀の数を出して、8 − 亀 で鶴を求めよう！' },
        ],
        explanationText: '差6÷2＝亀3匹。鶴は8－3＝5羽。 たしかめ：2×5＋4×3＝22本 ◎',
      },
      {
        id: 'tk-09',
        title: 'えんぴつとノート',
        difficulty: 3,
        problemText: 'えんぴつ（1本30円）とノート（1冊80円）を合わせて10個買いました。代金は600円です。ノートは何冊ですか？',
        answer: '6',
        answerUnit: '冊',
        diagramType: 'area',
        diagramSpec: { totalCount: 10, totalValue: 600, smallUnit: 30, largeUnit: 80, smallName: 'えんぴつ', largeName: 'ノート', unit: '円' },
        hints: [
          { step: 1, text: '全部えんぴつと仮定すると10×30＝300円。実際は600円。差は300円！' },
          { step: 2, text: 'えんぴつ1本をノートに替えると 80 − 30 ＝ 50円ふえるよ。多い300円ぶんを「1個あたり50円」でわればノートの数だね。' },
          { step: 3, text: 'あとは 300 ÷ 50 を計算してみよう！' },
        ],
        explanationText: '全部えんぴつなら300円。差300÷50＝ノート6冊。 たしかめ：80×6＋30×4＝600円 ◎',
      },
      {
        id: 'tk-10',
        title: '鶴・亀・金魚（和差算と合わせ技）',
        difficulty: 3,
        problemText: '鶴と亀と金魚が合わせて9匹います。鶴は亀より3羽多く、足の合計は18本です（金魚は足なし）。金魚は何匹ですか？',
        answer: '2',
        answerUnit: '匹',
        diagramType: 'none',
        diagramSpec: {},
        hints: [
          { step: 1, text: '亀をx匹とすると鶴はx＋3羽。足：2(x＋3)＋4x＝6x＋6＝18 → 6x＝12 → x＝2。' },
          { step: 2, text: '亀は2匹、鶴は5羽（亀＋3）で、合わせて2＋5＝7匹。金魚は「全体9匹 − 7匹」だよ。' },
          { step: 3, text: 'あとは 9 − 7 を計算してみよう！' },
        ],
        explanationText: '亀をxとおくと鶴＝x＋3。足の式 6x＋6＝18 → x＝2。金魚＝9－7＝2匹。 たしかめ：鶴5＋亀2＋金魚2＝9匹、足2×5＋4×2＝18本 ◎',
      },
    ],
  },
  {
    id: 'excess-deficit', order: 5, title: '差集め算・過不足算', titleKana: 'さあつめざん・かふそくざん',
    emoji: '📦', color: '#f87171', layer: 2, prerequisiteIds: ['crane-turtle'],
    isFree: false,
    coreConcept: '「1つあたりの差」が人数（個数）の分だけ集まって「全体の差」になる',
    approachText:
      '配り方を変えると、1人あたりの差が人数分だけ積み重なって全体の差になる。\nだから「全体の差 ÷ 1人あたりの差 ＝ 人数」で人数が分かる。\nまず「全体の差」がいくつになるかを、あまり・不足から正しく作ろう。',
    primaryDiagram: 'gap',
    introSlide: {
      title: '差あつめ図の読み方',
      explanation: [
        '配り方を①と②の2通りで考える（例：4個ずつ と 6個ずつ）',
        '1人あたりの差（6−4＝2個）が、人数の分だけ積み重なる',
        'その積み重なりの合計が「全体の差」——あまりと不足を足した数',
        '全体の差 ÷ 1人あたりの差 ＝ 人数。割り算で人数が出る！',
      ],
      diagramSpec: {
        perDiff: 2, totalDiff: 12, count: 6,
        per1: 4, per2: 6, rem1: 8, rem2: -4,
        method1Label: '4個ずつ', method2Label: '6個ずつ',
        diffText: '全体の差 ＝ あまり8 ＋ 不足4 ＝ 12',
        itemName: '人', unit: '個', showValues: true,
      },
    },
    problems: [
      // ──────────────────────────────────
      // ★ かんたん（過不足算の基本4型）
      // ──────────────────────────────────
      {
        id: 'ed-01',
        title: 'あまりと不足（基本）',
        difficulty: 1,
        problemText: 'おはじきを子どもに配ります。1人に4個ずつ配ると8個あまり、1人に6個ずつ配ると4個たりません。子どもは何人いますか？',
        answer: '6', answerUnit: '人',
        diagramType: 'gap',
        diagramSpec: {
          perDiff: 2, totalDiff: 12, count: 6,
          per1: 4, per2: 6, rem1: 8, rem2: -4,
          method1Label: '4個ずつ', method2Label: '6個ずつ',
          diffText: '全体の差 ＝ あまり8 ＋ 不足4 ＝ 12',
          itemName: '人', unit: '個',
        },
        hints: [
          { step: 1, text: '配る数を4個から6個に増やすと、1人あたり6－4＝2個よけいに必要になるよ。' },
          { step: 2, text: '4個ずつだと8個あまり、6個ずつだと4個たりない。あまりと不足の合計8＋4＝12個が「全体の差」だよ。' },
          { step: 3, text: 'あとは 12個 ÷ 2個（1人あたりの差） を計算してみよう！' },
        ],
        explanationText: '全体の差＝あまり8＋不足4＝12個。これを1人あたりの差2個で割って、12÷2＝6人。 たしかめ：4×6＋8＝32個、6×6－32＝4個たりない◎',
      },
      {
        id: 'ed-02',
        title: 'あまりと不足（色紙）',
        difficulty: 1,
        problemText: '色紙を子どもに配ります。1人に5枚ずつ配ると4枚あまり、1人に7枚ずつ配ると10枚たりません。子どもは何人いますか？',
        answer: '7', answerUnit: '人',
        diagramType: 'gap',
        diagramSpec: {
          perDiff: 2, totalDiff: 14, count: 7,
          per1: 5, per2: 7, rem1: 4, rem2: -10,
          method1Label: '5枚ずつ', method2Label: '7枚ずつ',
          diffText: '全体の差 ＝ あまり4 ＋ 不足10 ＝ 14',
          itemName: '人', unit: '枚',
        },
        hints: [
          { step: 1, text: '1人あたりの差は7－5＝2枚だよ。配る量を増やすと足りなくなるね。' },
          { step: 2, text: '「あまり4枚」と「不足10枚」を合わせると、全体の差は4＋10＝14枚。' },
          { step: 3, text: 'あとは 14枚 ÷ 2枚 を計算してみよう！' },
        ],
        explanationText: '全体の差＝4＋10＝14枚。1人あたりの差2枚で割って14÷2＝7人。 たしかめ：5×7＋4＝39枚、7×7＝49枚で49－39＝10枚たりない◎',
      },
      {
        id: 'ed-03',
        title: '両方あまる場合',
        difficulty: 1,
        problemText: 'あめを子どもに配ります。1人に4個ずつ配ると17個あまり、1人に7個ずつ配ると2個あまります。子どもは何人いますか？',
        answer: '5', answerUnit: '人',
        diagramType: 'gap',
        diagramSpec: {
          perDiff: 3, totalDiff: 15, count: 5,
          per1: 4, per2: 7, rem1: 17, rem2: 2,
          method1Label: '4個ずつ', method2Label: '7個ずつ',
          diffText: '全体の差 ＝ あまり17 − あまり2 ＝ 15',
          itemName: '人', unit: '個',
        },
        hints: [
          { step: 1, text: 'どちらもあまる場合は要注意。1人あたりの差は7－4＝3個だよ。' },
          { step: 2, text: '配る量を増やすと、あまりが17個から2個に減ったね。減った分17－2＝15個が「全体の差」だよ。' },
          { step: 3, text: 'あとは 15個 ÷ 3個 を計算してみよう！' },
        ],
        explanationText: '両方あまるときは、全体の差＝大きいあまり－小さいあまり＝17－2＝15個。15÷3＝5人。 たしかめ：4×5＋17＝37個、7×5＋2＝37個◎ どちらもあめは37個。',
      },
      {
        id: 'ed-04',
        title: '両方たりない場合',
        difficulty: 1,
        problemText: 'えんぴつを子どもに配ります。1人に6本ずつ配ると10本たりず、1人に5本ずつ配ると2本たりません。子どもは何人いますか？',
        answer: '8', answerUnit: '人',
        diagramType: 'gap',
        diagramSpec: {
          perDiff: 1, totalDiff: 8, count: 8,
          per1: 5, per2: 6, rem1: -2, rem2: -10,
          method1Label: '5本ずつ', method2Label: '6本ずつ',
          diffText: '全体の差 ＝ 不足10 − 不足2 ＝ 8',
          itemName: '人', unit: '本',
        },
        hints: [
          { step: 1, text: 'どちらもたりない場合だよ。1人あたりの差は6－5＝1本。' },
          { step: 2, text: '配る量を5本から6本に増やすと、不足が2本から10本に増えたね。増えた分10－2＝8本が「全体の差」。' },
          { step: 3, text: 'あとは 8本 ÷ 1本 を計算してみよう！' },
        ],
        explanationText: '両方たりないときは、全体の差＝大きい不足－小さい不足＝10－2＝8本。8÷1＝8人。 たしかめ：5×8－2＝38本、6×8－10＝38本◎ どちらもえんぴつは38本。',
      },
      // ──────────────────────────────────
      // ★★ ふつう（長椅子・全体量・差集め算本体）
      // ──────────────────────────────────
      {
        id: 'ed-05',
        title: '長いす（すわれない）',
        difficulty: 2,
        problemText: '長いすが何脚かあります。1脚に4人ずつ座ると12人が座れません。1脚に6人ずつ座るとちょうど全員座れます。長いすは何脚ありますか？',
        answer: '6', answerUnit: '脚',
        diagramType: 'gap',
        diagramSpec: {
          perDiff: 2, totalDiff: 12, count: 6,
          per1: 4, per2: 6, rem1: 12, rem2: 0,
          method1Label: '4人ずつ', method2Label: '6人ずつ',
          diffText: '全体の差 ＝ 座れない12 ＋ ちょうど0 ＝ 12',
          itemName: '脚', unit: '人',
        },
        hints: [
          { step: 1, text: '長いすを「配る箱」、人を「配るもの」と考えよう。1脚あたりの差は6－4＝2人だよ。' },
          { step: 2, text: '4人ずつだと12人あぶれ（不足12）、6人ずつだとちょうど（不足0）。全体の差は12＋0＝12人。' },
          { step: 3, text: 'あとは 12人 ÷ 2人 を計算してみよう！' },
        ],
        explanationText: '1脚あたり2人の差が脚数だけ集まって12人の差に。12÷2＝6脚（人数は36人）。 たしかめ：人数は4×6＋12＝36人、6×6＝36人でちょうど◎',
      },
      {
        id: 'ed-06',
        title: '長いす（席があまる）',
        difficulty: 2,
        problemText: '長いすに4人ずつ座ると18人が座れません。7人ずつ座ると3人分の席があまります。長いすは何脚ありますか？',
        answer: '7', answerUnit: '脚',
        diagramType: 'gap',
        diagramSpec: {
          perDiff: 3, totalDiff: 21, count: 7,
          per1: 4, per2: 7, rem1: 18, rem2: -3,
          method1Label: '4人ずつ', method2Label: '7人ずつ',
          diffText: '全体の差 ＝ 座れない18 ＋ あまり席3 ＝ 21',
          itemName: '脚', unit: '人',
        },
        hints: [
          { step: 1, text: '1脚あたりの差は7－4＝3人。座れる人数が1脚につき3人ずつ増えるよ。' },
          { step: 2, text: '4人ずつだと18人あぶれ、7人ずつだと席が3人分あまる。全体の差は18＋3＝21人。' },
          { step: 3, text: 'あとは 21人 ÷ 3人 を計算してみよう！' },
        ],
        explanationText: '「座れない人」と「あまる席」を足すと全体の差21人。1脚あたり3人で割って7脚。 たしかめ：人数は4×7＋18＝46人、7×7－3＝46人◎',
      },
      {
        id: 'ed-07',
        title: '全部でいくつ？（個数を問う）',
        difficulty: 2,
        problemText: 'えんぴつを子どもに配ります。1人に5本ずつ配ると3本あまり、1人に7本ずつ配ると9本たりません。えんぴつは全部で何本ありますか？',
        answer: '33', answerUnit: '本',
        diagramType: 'gap',
        diagramSpec: {
          perDiff: 2, totalDiff: 12, count: 6,
          per1: 5, per2: 7, rem1: 3, rem2: -9,
          method1Label: '5本ずつ', method2Label: '7本ずつ',
          diffText: '全体の差 ＝ あまり3 ＋ 不足9 ＝ 12',
          itemName: '人', unit: '本',
        },
        hints: [
          { step: 1, text: 'まず人数を求めよう。1人あたりの差は7－5＝2本、全体の差は3＋9＝12本だよ。' },
          { step: 2, text: '12本 ÷ 2本 ＝ 6人。人数が分かったね。次にえんぴつの本数を出すよ。' },
          { step: 3, text: '配る人数は6人。「5本ずつ配って3本あまる」から、あとは 5 × 6 ＋ 3 を計算してみよう！' },
        ],
        explanationText: '人数＝12÷2＝6人。えんぴつ＝5×6＋3＝33本。あまる方の式で本数を求めるのが安全。',
      },
      {
        id: 'ed-08',
        title: '差集め算（ねだんの差）',
        difficulty: 2,
        problemText: '1個80円のチョコと1個50円のあめを、同じ個数ずつ買います。代金の差が450円になるのは、何個ずつ買うときですか？',
        answer: '15', answerUnit: '個',
        diagramType: 'gap',
        diagramSpec: {
          mode: 'collect',
          perDiff: 30, totalDiff: 450, count: 15,
          per1: 50, per2: 80,
          method1Label: 'あめ50円', method2Label: 'チョコ80円',
          diffText: '全体の差 ＝ 代金のちがい ＝ 450円',
          itemName: '個', unit: '円',
        },
        hints: [
          { step: 1, text: 'これが「差集め算」の名前のもと。1個あたりのねだんの差は80－50＝30円だよ。' },
          { step: 2, text: '同じ個数ずつ買うと、1個30円の差が個数の分だけ集まって、代金の差450円になるんだ。' },
          { step: 3, text: 'あとは 450円 ÷ 30円 を計算してみよう！' },
        ],
        explanationText: '1個あたりの差30円が個数分集まって450円。450÷30＝15個。これが差集め算の基本形。 たしかめ：80×15＝1200円、50×15＝750円、差は450円◎',
      },
      {
        id: 'ed-09',
        title: '差集め算（予算と冊数）',
        difficulty: 2,
        problemText: 'ノートを何冊か買います。1冊120円のノートにすると140円たりず、1冊90円のノートにすると220円あまります。ノートを何冊買いますか？',
        answer: '12', answerUnit: '冊',
        diagramType: 'gap',
        diagramSpec: {
          perDiff: 30, totalDiff: 360, count: 12,
          per1: 90, per2: 120, rem1: 220, rem2: -140,
          method1Label: '90円ノート', method2Label: '120円ノート',
          diffText: '全体の差 ＝ 不足140 ＋ あまり220 ＝ 360',
          itemName: '冊', unit: '円',
        },
        hints: [
          { step: 1, text: '1冊あたりのねだんの差は120－90＝30円。高い方にすると1冊ごとに30円よけいにかかるね。' },
          { step: 2, text: '高い方で140円不足、安い方で220円あまる。全体の差は140＋220＝360円だよ。' },
          { step: 3, text: 'あとは 360円 ÷ 30円 を計算してみよう！' },
        ],
        explanationText: '全体の差＝140＋220＝360円。1冊あたりの差30円で割って360÷30＝12冊（予算は1300円）。 たしかめ：持っているお金は90×12＋220＝1300円、120×12＝1440円で140円たりない◎',
      },
      // ──────────────────────────────────
      // ★★★ むずかしい（最後の1人型・差集め発展・部屋割り）
      // ──────────────────────────────────
      {
        id: 'ed-10',
        title: '最後の1人だけ少ない',
        difficulty: 3,
        problemText: 'あめを子どもに配ります。1人に4個ずつ配ると12個あまります。1人に6個ずつ配ると、最後の1人だけ2個しかもらえません（ほかの子は6個）。子どもは何人いますか？',
        answer: '8', answerUnit: '人',
        diagramType: 'gap',
        diagramSpec: {
          perDiff: 2, totalDiff: 16, count: 8,
          per1: 4, per2: 6, rem1: 12, rem2: -4,
          method1Label: '4個ずつ', method2Label: '6個ずつ',
          diffText: '全体の差 ＝ あまり12 ＋ 不足4 ＝ 16',
          itemName: '人', unit: '個',
        },
        hints: [
          { step: 1, text: '「最後の1人が2個」は、本当は6個ほしいのに2個 → 6－2＝4個たりない、と読みかえよう。' },
          { step: 2, text: 'すると4個ずつで12個あまり、6個ずつで4個不足。全体の差は12＋4＝16個。1人あたりの差は6－4＝2個。' },
          { step: 3, text: 'あとは 16個 ÷ 2個 を計算してみよう！' },
        ],
        explanationText: '最後の1人が2個＝不足4個と読みかえる。全体の差＝12＋4＝16。16÷2＝8人。 たしかめ：あめは4×8＋12＝44個、6×8＝48個で48－44＝4個たりない（最後の子が4個少ない）◎',
      },
      {
        id: 'ed-11',
        title: '最後の1人型（画用紙）',
        difficulty: 3,
        problemText: '画用紙を配ります。1人に5枚ずつ配ると12枚あまります。1人に6枚ずつ配ると、最後の1人だけ4枚しかもらえません。子どもは何人いますか？',
        answer: '14', answerUnit: '人',
        diagramType: 'gap',
        diagramSpec: {
          perDiff: 1, totalDiff: 14, count: 14,
          per1: 5, per2: 6, rem1: 12, rem2: -2,
          method1Label: '5枚ずつ', method2Label: '6枚ずつ',
          diffText: '全体の差 ＝ あまり12 ＋ 不足2 ＝ 14',
          itemName: '人', unit: '枚',
        },
        hints: [
          { step: 1, text: '最後の1人が4枚は「本当は6枚ほしいのに4枚 → 6－4＝2枚たりない」と読みかえよう。' },
          { step: 2, text: '5枚ずつで12枚あまり、6枚ずつで2枚不足。全体の差は12＋2＝14枚。1人あたりの差は6－5＝1枚。' },
          { step: 3, text: 'あとは 14枚 ÷ 1枚 を計算してみよう！' },
        ],
        explanationText: '最後の1人が4枚＝不足2枚。全体の差＝12＋2＝14枚。1人あたりの差1枚で割って14人。 たしかめ：画用紙は5×14＋12＝82枚、6×14＝84枚で2枚たりない◎',
      },
      {
        id: 'ed-12',
        title: '差集め算（同じ金額で個数が変わる）',
        difficulty: 3,
        problemText: '持っているお金で1個70円のりんごを買うと、ちょうど使い切ります。同じお金で1個50円のみかんを買うと、りんごより6個多く買えて、ちょうど使い切ります。りんごは何個買えますか？',
        answer: '15', answerUnit: '個',
        diagramType: 'gap',
        diagramSpec: {
          mode: 'collect',
          perDiff: 20, totalDiff: 300, count: 15,
          per1: 50, per2: 70,
          method1Label: 'みかん50円', method2Label: 'りんご70円',
          diffText: '全体の差 ＝ 多く買えた6個分 ＝ 50×6 ＝ 300円',
          itemName: '個', unit: '円',
        },
        hints: [
          { step: 1, text: '同じ金額なのに、安いみかんにすると6個多く買える。この「6個多く」がヒントだよ。' },
          { step: 2, text: 'りんご1個をみかん1個に替えるごとに70－50＝20円うく。ういたお金で多く買える6個分は50×6＝300円。' },
          { step: 3, text: 'あとは 300円 ÷ 20円 を計算してみよう！' },
        ],
        explanationText: '1個あたり20円うき、その合計＝多く買えた6個分の代金300円。300÷20＝15個。 たしかめ：70×15＝1050円、1050÷50＝21個＝15＋6◎',
      },
      {
        id: 'ed-13',
        title: '部屋わり（あまる部屋）',
        difficulty: 3,
        problemText: '子どもを部屋に分けます。1部屋に5人ずつ入れると8人が入れません。1部屋に7人ずつ入れると、ちょうど2部屋あまります。部屋は何室ありますか？',
        answer: '11', answerUnit: '室',
        diagramType: 'gap',
        diagramSpec: {
          perDiff: 2, totalDiff: 22, count: 11,
          per1: 5, per2: 7, rem1: 8, rem2: -14,
          method1Label: '5人ずつ', method2Label: '7人ずつ',
          diffText: '全体の差 ＝ 入れない8 ＋ あまり部屋分(7×2=14) ＝ 22',
          itemName: '室', unit: '人',
        },
        hints: [
          { step: 1, text: '1部屋あたりの差は7－5＝2人。部屋数を□として、入る人数を2通りで表そう。' },
          { step: 2, text: '5人ずつだと8人不足。7人ずつだと2部屋あまる＝7×2＝14人分の席があまる。全体の差は8＋14＝22人。' },
          { step: 3, text: 'あとは 22人 ÷ 2人 を計算してみよう！' },
        ],
        explanationText: 'あまる2部屋は7×2＝14人分の席。全体の差＝8＋14＝22人。1部屋あたり2人で割って11室。 たしかめ：人数は5×11＋8＝63人、使う部屋は11－2＝9室で7×9＝63人◎',
      },
    ],
  },
  {
    id: 'equivalent', order: 6, title: '相当算', titleKana: 'そうとうざん',
    emoji: '🎯', color: '#c4a8ff', layer: 3, prerequisiteIds: ['excess-deficit'],
    isFree: false,
    coreConcept: '「全体の何分のいくつか（割合）」が、具体的な数量に対応する',
    approachText:
      '全体を①とおいた帯図で考える。わかっている「割合」と「数量」を対応させると、\n①にあたる量 ＝ 数量 ÷ その割合 で全体が逆算できる。\nのこりが問われたら、まず「のこりの割合」を作ってから対応させよう。',
    primaryDiagram: 'ratio-bar',
    introSlide: {
      title: 'わりあいの帯図の読み方',
      explanation: [
        '全体を①（まるいち）とおいて、1本の帯で表す',
        '帯を「分母」の数だけ区切り、わかっている部分の割合をぬる',
        'その部分にあたる「実際の数」を対応させる（例：3/5 が 60）',
        '①にあたる量 ＝ 数 ÷ 割合。60 ÷ 3 × 5 ＝ 100 で全体が出る！',
      ],
      diagramSpec: {
        mode: 'single', denom: 5,
        segs: [
          { span: 3, label: '3/5', role: 'part' },
          { span: 2, label: 'のこり 2/5', role: 'rest' },
        ],
        known: { role: 'part', value: 60, text: '3/5 ＝ 60' },
        answerValue: 100, unit: '', findLabel: 'ある数', showValues: true,
      },
    },
    problems: [
      // ──────────────────────────────────
      // ★ かんたん（部分の割合 ↔ 実数）
      // ──────────────────────────────────
      {
        id: 'eq-01',
        title: '部分の割合から全体（基本）',
        difficulty: 1,
        problemText: 'ある数の 3/5 が 60 です。ある数はいくつですか？',
        answer: '100', answerUnit: '',
        diagramType: 'ratio-bar',
        diagramSpec: {
          mode: 'single', denom: 5,
          segs: [
            { span: 3, label: '3/5 ＝ 60', role: 'part' },
            { span: 2, label: 'のこり 2/5', role: 'rest' },
          ],
          known: { role: 'part', value: 60, text: '3/5 ＝ 60' },
          answerValue: 100, unit: '', findLabel: 'ある数',
        },
        hints: [
          { step: 1, text: '全体（ある数）を①とおくよ。①を5つに区切ると、そのうち3つぶんが60にあたるね。' },
          { step: 2, text: '1区画（1/5）は 60 ÷ 3 ＝ 20。' },
          { step: 3, text: 'あとは ①は5区画だから 20 × 5 を計算してみよう！' },
        ],
        explanationText: '①にあたる量 ＝ 60 ÷ 3 × 5 ＝ 100。3/5 が 60 なら全体は 100。 たしかめ：100 × 3/5 ＝ 60 ◎',
      },
      {
        id: 'eq-02',
        title: 'テープの長さ',
        difficulty: 1,
        problemText: 'あるテープの 2/7 の長さが 14cm でした。テープ全体の長さは何cmですか？',
        answer: '49', answerUnit: 'cm',
        diagramType: 'ratio-bar',
        diagramSpec: {
          mode: 'single', denom: 7,
          segs: [
            { span: 2, label: '2/7 ＝ 14cm', role: 'part' },
            { span: 5, label: 'のこり 5/7', role: 'rest' },
          ],
          known: { role: 'part', value: 14, text: '2/7 ＝ 14cm' },
          answerValue: 49, unit: 'cm', findLabel: 'テープ全体',
        },
        hints: [
          { step: 1, text: 'テープ全体を①として7区画に分けると、2区画ぶんが14cmだよ。' },
          { step: 2, text: '1区画（1/7）は 14 ÷ 2 ＝ 7cm。' },
          { step: 3, text: 'あとは 全体は7区画だから 7 × 7 を計算してみよう！' },
        ],
        explanationText: '①にあたる量 ＝ 14 ÷ 2 × 7 ＝ 49cm。',
      },
      {
        id: 'eq-03',
        title: 'クラスの人数',
        difficulty: 1,
        problemText: 'あるクラスの 5/9 が女子で、女子は 20 人です。クラス全体は何人ですか？',
        answer: '36', answerUnit: '人',
        diagramType: 'ratio-bar',
        diagramSpec: {
          mode: 'single', denom: 9,
          segs: [
            { span: 5, label: '女子 5/9 ＝ 20人', role: 'part' },
            { span: 4, label: '男子 4/9', role: 'rest' },
          ],
          known: { role: 'part', value: 20, text: '5/9 ＝ 20人' },
          answerValue: 36, unit: '人', findLabel: 'クラス全体',
        },
        hints: [
          { step: 1, text: 'クラス全体を①として9区画に分けると、女子は5区画ぶん＝20人。' },
          { step: 2, text: '1区画（1/9）は 20 ÷ 5 ＝ 4人。' },
          { step: 3, text: '①あたりが4人で全体は9区画ぶん。あとは 4 × 9 を計算してみよう！' },
        ],
        explanationText: '①にあたる量 ＝ 20 ÷ 5 × 9 ＝ 36人。',
      },
      {
        id: 'eq-04',
        title: '水そうの水',
        difficulty: 1,
        problemText: '水そうに入る水の 3/4 は 54L です。水そういっぱいでは何L入りますか？',
        answer: '72', answerUnit: 'L',
        diagramType: 'ratio-bar',
        diagramSpec: {
          mode: 'single', denom: 4,
          segs: [
            { span: 3, label: '3/4 ＝ 54L', role: 'part' },
            { span: 1, label: 'のこり 1/4', role: 'rest' },
          ],
          known: { role: 'part', value: 54, text: '3/4 ＝ 54L' },
          answerValue: 72, unit: 'L', findLabel: '満水',
        },
        hints: [
          { step: 1, text: '満水を①として4区画に分けると、3区画ぶんが54L。' },
          { step: 2, text: '1区画（1/4）は 54 ÷ 3 ＝ 18L。' },
          { step: 3, text: 'あとは 満水は4区画だから 18 × 4 を計算してみよう！' },
        ],
        explanationText: '①にあたる量 ＝ 54 ÷ 3 × 4 ＝ 72L。',
      },
      // ──────────────────────────────────
      // ★★ ふつう（のこりが実数 / 差が割合）
      // ──────────────────────────────────
      {
        id: 'eq-05',
        title: 'お金を使ったのこり',
        difficulty: 2,
        problemText: '持っていたお金の 3/8 を使ったら、のこりは 50 円になりました。はじめにいくら持っていましたか？',
        answer: '80', answerUnit: '円',
        diagramType: 'ratio-bar',
        diagramSpec: {
          mode: 'single', denom: 8,
          segs: [
            { span: 3, label: '使った 3/8', role: 'used' },
            { span: 5, label: 'のこり 5/8 ＝ 50円', role: 'remain' },
          ],
          known: { role: 'remain', value: 50, text: 'のこり 5/8 ＝ 50円' },
          answerValue: 80, unit: '円', findLabel: 'はじめのお金',
        },
        hints: [
          { step: 1, text: '問われているのは「はじめのお金」。使った 3/8 の“のこり”は 1－3/8 ＝ 5/8 だね。' },
          { step: 2, text: 'のこり 5/8 が 50 円。1区画（1/8）は 50 ÷ 5 ＝ 10円。' },
          { step: 3, text: 'あとは はじめは8区画だから 10 × 8 を計算してみよう！' },
        ],
        explanationText: 'のこりの割合 5/8 を作る。①にあたる量 ＝ 50 ÷ 5 × 8 ＝ 80円。 たしかめ：80×3/8＝30使い、のこり50◎',
      },
      {
        id: 'eq-06',
        title: '本を読んだのこり',
        difficulty: 2,
        problemText: 'ある本の 2/5 を読んだら、のこりは 36 ページでした。この本は全部で何ページですか？',
        answer: '60', answerUnit: 'ページ',
        diagramType: 'ratio-bar',
        diagramSpec: {
          mode: 'single', denom: 5,
          segs: [
            { span: 2, label: '読んだ 2/5', role: 'used' },
            { span: 3, label: 'のこり 3/5 ＝ 36', role: 'remain' },
          ],
          known: { role: 'remain', value: 36, text: 'のこり 3/5 ＝ 36ページ' },
          answerValue: 60, unit: 'ページ', findLabel: '本全体',
        },
        hints: [
          { step: 1, text: 'のこりの割合は 1－2/5 ＝ 3/5 だよ。' },
          { step: 2, text: 'のこり 3/5 が 36 ページ。1区画（1/5）は 36 ÷ 3 ＝ 12ページ。' },
          { step: 3, text: 'あとは 全体は5区画だから 12 × 5 を計算してみよう！' },
        ],
        explanationText: 'のこり 3/5 ＝ 36。①にあたる量 ＝ 36 ÷ 3 × 5 ＝ 60ページ。',
      },
      {
        id: 'eq-07',
        title: 'リボンを使ったのこり',
        difficulty: 2,
        problemText: 'リボンの 4/9 を使ったら、のこりは 35cm でした。リボンははじめ何cmありましたか？',
        answer: '63', answerUnit: 'cm',
        diagramType: 'ratio-bar',
        diagramSpec: {
          mode: 'single', denom: 9,
          segs: [
            { span: 4, label: '使った 4/9', role: 'used' },
            { span: 5, label: 'のこり 5/9 ＝ 35cm', role: 'remain' },
          ],
          known: { role: 'remain', value: 35, text: 'のこり 5/9 ＝ 35cm' },
          answerValue: 63, unit: 'cm', findLabel: 'リボン全体',
        },
        hints: [
          { step: 1, text: 'のこりの割合は 1－4/9 ＝ 5/9 だよ。' },
          { step: 2, text: 'のこり 5/9 が 35cm。1区画（1/9）は 35 ÷ 5 ＝ 7cm。' },
          { step: 3, text: 'あとは はじめは9区画だから 7 × 9 を計算してみよう！' },
        ],
        explanationText: 'のこり 5/9 ＝ 35。①にあたる量 ＝ 35 ÷ 5 × 9 ＝ 63cm。',
      },
      {
        id: 'eq-08',
        title: '差が割合（男女の差）',
        difficulty: 2,
        problemText: 'あるクラスの男子は全体の 4/7 です。男子は女子より 6 人多いそうです。クラス全体は何人ですか？',
        answer: '42', answerUnit: '人',
        diagramType: 'ratio-bar',
        diagramSpec: {
          mode: 'diff', denom: 7,
          segs: [
            { span: 4, label: '男子 4/7', role: 'A' },
            { span: 3, label: '女子 3/7', role: 'B' },
          ],
          knownDiff: { value: 6, text: '男子が6人多い' },
          answerValue: 42, unit: '人', findLabel: 'クラス全体',
        },
        hints: [
          { step: 1, text: '男子は 4/7、女子はのこりの 3/7。割合の差は 4/7－3/7 ＝ 1/7（1区画）だよ。' },
          { step: 2, text: 'その1区画ぶんの差が6人。1区画（1/7）＝ 6 ÷ 1 ＝ 6人。' },
          { step: 3, text: 'あとは 全体は7区画だから 6 × 7 を計算してみよう！' },
        ],
        explanationText: '差の割合 1/7 が6人。①にあたる量 ＝ 6 × 7 ＝ 42人。',
      },
      {
        id: 'eq-09',
        title: '2回使ったのこり（逐次の入口）',
        difficulty: 2,
        problemText: '持っていたお金の 1/2 を使い、つぎにのこりの 1/3 を使ったら、まだ 20 円のこりました。はじめにいくら持っていましたか？',
        answer: '60', answerUnit: '円',
        diagramType: 'ratio-bar',
        diagramSpec: {
          mode: 'seq',
          bars: [
            { usedSpan: 1, denom: 2, usedLabel: '1回目 1/2', remainLabel: 'のこり' },
            { usedSpan: 1, denom: 3, usedLabel: '2回目 のこりの1/3', remainLabel: 'のこり', remainValue: 20, remainText: '20円' },
          ],
          finalFracText: '1/3', answerValue: 60, unit: '円', findLabel: 'はじめのお金',
        },
        hints: [
          { step: 1, text: '1回目でのこりは 1/2。その「のこり」を新しい①とみるのがコツだよ。' },
          { step: 2, text: '2回目はのこりの 1/3 を使うので、のこるのは 2/3。最後ののこりは 1/2 × 2/3 ＝ 1/3（全体に対して）。' },
          { step: 3, text: 'あとは 全体の 1/3 が 20 円だから、はじめは 20 ÷ 1 × 3 を計算してみよう！' },
        ],
        explanationText: '最後ののこりは全体の 1/2×2/3 ＝ 1/3。20 ÷ 1/3 ＝ 60円。 たしかめ：60→30使い残30→10使い残20◎',
      },
      // ──────────────────────────────────
      // ★★★ むずかしい（逐次消費）
      // ──────────────────────────────────
      {
        id: 'eq-10',
        title: '2段階で使う（個数）',
        difficulty: 3,
        problemText: 'あめ全体の 2/5 を配り、つぎにのこりの 1/4 を配ったら、まだ 18 個のこりました。あめははじめ何個ありましたか？',
        answer: '40', answerUnit: '個',
        diagramType: 'ratio-bar',
        diagramSpec: {
          mode: 'seq',
          bars: [
            { usedSpan: 2, denom: 5, usedLabel: '1回目 2/5', remainLabel: 'のこり 3/5' },
            { usedSpan: 1, denom: 4, usedLabel: '2回目 のこりの1/4', remainLabel: 'のこり', remainValue: 18, remainText: '18個' },
          ],
          finalFracText: '9/20', answerValue: 40, unit: '個', findLabel: 'はじめの個数',
        },
        hints: [
          { step: 1, text: '1回目でのこりは 1－2/5 ＝ 3/5。それを新しい①とみよう。' },
          { step: 2, text: '2回目はのこりの 1/4 を配るので、のこるのは 3/4。最後ののこりは 3/5 × 3/4 ＝ 9/20（全体に対して）。' },
          { step: 3, text: 'あとは 全体の 9/20 が 18 個だから 18 ÷ 9 × 20 を計算してみよう！' },
        ],
        explanationText: '最後ののこりは全体の 3/5×3/4 ＝ 9/20。18 ÷ 9/20 ＝ 40個。 たしかめ：40→16配り残24→6配り残18◎',
      },
      {
        id: 'eq-11',
        title: '2日で読む本',
        difficulty: 3,
        problemText: '1日目に本全体の 1/3 を読み、2日目にのこりの 2/5 を読むと、まだ 36 ページのこっています。この本は全部で何ページですか？',
        answer: '90', answerUnit: 'ページ',
        diagramType: 'ratio-bar',
        diagramSpec: {
          mode: 'seq',
          bars: [
            { usedSpan: 1, denom: 3, usedLabel: '1日目 1/3', remainLabel: 'のこり 2/3' },
            { usedSpan: 2, denom: 5, usedLabel: '2日目 のこりの2/5', remainLabel: 'のこり', remainValue: 36, remainText: '36ページ' },
          ],
          finalFracText: '2/5', answerValue: 90, unit: 'ページ', findLabel: '本全体',
        },
        hints: [
          { step: 1, text: '1日目でのこりは 2/3。それを新しい①とみよう。' },
          { step: 2, text: '2日目はのこりの 2/5 を読むので、のこるのは 3/5。最後ののこりは 2/3 × 3/5 ＝ 2/5（全体に対して）。' },
          { step: 3, text: 'あとは 全体の 2/5 が 36 ページだから 36 ÷ 2 × 5 を計算してみよう！' },
        ],
        explanationText: '最後ののこりは全体の 2/3×3/5 ＝ 2/5。36 ÷ 2/5 ＝ 90ページ。 たしかめ：90→30読み残60→24読み残36◎',
      },
      {
        id: 'eq-12',
        title: '所持金を2回使う',
        difficulty: 3,
        problemText: '所持金の 1/4 を使い、さらにのこりの 2/3 を使うと、最後に 150 円のこりました。はじめにいくら持っていましたか？',
        answer: '600', answerUnit: '円',
        diagramType: 'ratio-bar',
        diagramSpec: {
          mode: 'seq',
          bars: [
            { usedSpan: 1, denom: 4, usedLabel: '1回目 1/4', remainLabel: 'のこり 3/4' },
            { usedSpan: 2, denom: 3, usedLabel: '2回目 のこりの2/3', remainLabel: 'のこり', remainValue: 150, remainText: '150円' },
          ],
          finalFracText: '1/4', answerValue: 600, unit: '円', findLabel: 'はじめのお金',
        },
        hints: [
          { step: 1, text: '1回目でのこりは 3/4。それを新しい①とみよう。' },
          { step: 2, text: '2回目はのこりの 2/3 を使うので、のこるのは 1/3。最後ののこりは 3/4 × 1/3 ＝ 1/4（全体に対して）。' },
          { step: 3, text: 'あとは 全体の 1/4 が 150 円だから 150 × 4 を計算してみよう！' },
        ],
        explanationText: '最後ののこりは全体の 3/4×1/3 ＝ 1/4。150 ÷ 1/4 ＝ 600円。 たしかめ：600→150使い残450→300使い残150◎',
      },
      {
        id: 'eq-13',
        title: '2日でする仕事',
        difficulty: 3,
        problemText: 'ある仕事を1日目に全体の 3/8、2日目にのこりの 2/5 を終わらせると、まだ全体の一部が30こぶんのこりました。仕事全体は何こぶんですか？',
        answer: '80', answerUnit: 'こ',
        diagramType: 'ratio-bar',
        diagramSpec: {
          mode: 'seq',
          bars: [
            { usedSpan: 3, denom: 8, usedLabel: '1日目 3/8', remainLabel: 'のこり 5/8' },
            { usedSpan: 2, denom: 5, usedLabel: '2日目 のこりの2/5', remainLabel: 'のこり', remainValue: 30, remainText: '30こ' },
          ],
          finalFracText: '3/8', answerValue: 80, unit: 'こ', findLabel: '仕事全体',
        },
        hints: [
          { step: 1, text: '1日目でのこりは 5/8。それを新しい①とみよう。' },
          { step: 2, text: '2日目はのこりの 2/5 を終えるので、のこるのは 3/5。最後ののこりは 5/8 × 3/5 ＝ 3/8（全体に対して）。' },
          { step: 3, text: 'あとは 全体の 3/8 が 30 こだから 30 ÷ 3 × 8 を計算してみよう！' },
        ],
        explanationText: '最後ののこりは全体の 5/8×3/5 ＝ 3/8。30 ÷ 3/8 ＝ 80こ。 たしかめ：80→30終え残50→20終え残30◎',
      },
    ],
  },
  {
    id: 'ratio-basics', order: 7, title: '割合と比の基礎', titleKana: 'わりあいとひのきそ',
    emoji: '📊', color: '#6366f1', layer: 3, prerequisiteIds: ['equivalent'],
    isFree: false,
    coreConcept: '「実際の数量（単位あり）」と「比の数字（丸数字）」をはっきり区別する',
    approachText:
      '割合は「もとにする量」を100%（または①）として、くらべる量がどれだけかを表す。\n比は「②：③」のように丸数字で書き、実際の数量と混ぜない。\n比を実数にするときは「①あたりの量」をまず求めるのがすべての土台になる。',
    primaryDiagram: 'ratio2',
    introSlide: {
      title: 'わりあい・比の図の読み方',
      explanation: [
        'もとにする量を100%（①）として、くらべる量の割合を見る',
        '割合の三用法：くらべる量＝もと×割合／もと＝くらべる量÷割合',
        '比は丸数字（②：③）で書き、実際の数量（単位つき）と区別する',
        '比を実数にするときは「①あたりの量」を先に求める',
      ],
      diagramSpec: {
        mode: 'percent', ratioPct: 30,
        baseText: 'もとにする量 20人（100%）', compareText: 'くらべる量 6人',
        ratioText: '30%', unit: '人', showValues: true,
        step2Text: 'くらべる量 ＝ もと × 割合', step3Text: '20 × 0.3 ＝ 6人',
      },
    },
    problems: [
      // ──────────────────────────────────
      // ★ かんたん（割合の三用法・百分率/歩合）
      // ──────────────────────────────────
      {
        id: 'rb-01',
        title: 'くらべる量を求める',
        difficulty: 1,
        problemText: 'ある学校の生徒は 20 人です。そのうち 30% が委員会に入っています。委員は何人ですか？',
        answer: '6', answerUnit: '人',
        diagramType: 'ratio2',
        diagramSpec: {
          mode: 'percent', ratioPct: 30,
          baseText: 'もとにする量 20人（100%）', compareText: 'くらべる量 ＝ ?',
          ratioText: '30%', unit: '人',
          step2Text: 'くらべる量 ＝ もと × 割合', step3Text: '20 × 0.3 ＝ 6人',
        },
        hints: [
          { step: 1, text: 'もとにする量は「生徒20人」。これを100%とみるよ。' },
          { step: 2, text: '割合 30% は小数で 0.3。くらべる量 ＝ もと × 割合 だね。' },
          { step: 3, text: 'あとは 20 × 0.3 を計算してみよう！' },
        ],
        explanationText: 'くらべる量 ＝ もとにする量 × 割合 ＝ 20 × 0.3 ＝ 6人。',
      },
      {
        id: 'rb-02',
        title: 'もとにする量を求める',
        difficulty: 1,
        problemText: 'ある数の 40% が 12 です。ある数はいくつですか？',
        answer: '30', answerUnit: '',
        diagramType: 'ratio2',
        diagramSpec: {
          mode: 'percent', ratioPct: 40,
          baseText: 'もとにする量 ＝ ?（100%）', compareText: 'くらべる量 12',
          ratioText: '40%', unit: '',
          step2Text: 'もと ＝ くらべる量 ÷ 割合', step3Text: '12 ÷ 0.4 ＝ 30',
        },
        hints: [
          { step: 1, text: '求めるのは「もとにする量」。100%にあたる数だよ。' },
          { step: 2, text: '40% ＝ 0.4。もと ＝ くらべる量 ÷ 割合 で逆算するよ。' },
          { step: 3, text: 'あとは 12 ÷ 0.4 を計算してみよう！' },
        ],
        explanationText: 'もとにする量 ＝ くらべる量 ÷ 割合 ＝ 12 ÷ 0.4 ＝ 30。 たしかめ：30 × 0.4 ＝ 12 ◎',
      },
      {
        id: 'rb-03',
        title: '割合（何%）を求める',
        difficulty: 1,
        problemText: '15 は 20 の何 % ですか？',
        answer: '75', answerUnit: '%',
        diagramType: 'ratio2',
        diagramSpec: {
          mode: 'percent', ratioPct: 75,
          baseText: 'もとにする量 20（100%）', compareText: 'くらべる量 15',
          ratioText: '? %', unit: '',
          step2Text: '割合 ＝ くらべる量 ÷ もと', step3Text: '15 ÷ 20 ＝ 0.75 → 75%',
        },
        hints: [
          { step: 1, text: '「20 の何%」なので、もとにする量（100%）は 20 だよ。くらべる量は 15 だね。' },
          { step: 2, text: '割合 ＝ くらべる量 ÷ もと ＝ 15 ÷ 20。これで小数の割合が出るよ。' },
          { step: 3, text: '15 ÷ 20 を計算して小数の割合を出そう。その後、×100 すると % になるよ！' },
        ],
        explanationText: '割合 ＝ くらべる量 ÷ もとにする量 ＝ 15 ÷ 20 ＝ 0.75 ＝ 75%。',
      },
      {
        id: 'rb-04',
        title: '小数・百分率・歩合の変換',
        difficulty: 1,
        problemText: '小数で 0.25 にあたる割合を、百分率と歩合で正しく表したものはどれ？',
        answer: '25%・2割5分', answerUnit: '',
        choices: ['25%・2割5分', '2.5%・2割5分', '25%・2割5厘', '250%・25割'],
        diagramType: 'ratio2',
        diagramSpec: {
          mode: 'percent', convert: true, ratioPct: 25,
          decText: '0.25', pctText: '25%', buText: '2割5分', unit: '',
        },
        hints: [
          { step: 1, text: '小数を百分率にするには ×100。0.25 × 100 ＝ 25%。' },
          { step: 2, text: '歩合は、小数第1位が「割（0.1）」、第2位が「分（0.01）」、第3位が「厘（0.001）」だよ。' },
          { step: 3, text: '0.25 は「0.2（2割）＋ 0.05（5分）」。2割と5分をくっつけると歩合で表せるね。選択肢から正しい組み合わせを選ぼう！' },
        ],
        explanationText: '0.25 ＝ 25%（×100）＝ 2割5分（割→0.1・分→0.01）。',
      },
      // ──────────────────────────────────
      // ★★ ふつう（比の意味・比例配分）
      // ──────────────────────────────────
      {
        id: 'rb-05',
        title: '比をかんたんにする',
        difficulty: 2,
        problemText: '12 : 18 を、いちばんかんたんな整数の比で表すとどれ？',
        answer: '2:3', answerUnit: '',
        choices: ['2:3', '3:2', '4:6', '6:9'],
        diagramType: 'ratio2',
        diagramSpec: {
          mode: 'bunpai', anchorKind: 'none',
          items: [{ r: 2, label: '12→2' }, { r: 3, label: '18→3' }],
          unit: '',
          step2Text: '両方を 6（最大公約数）でわる', step3Text: '12÷6 : 18÷6 ＝ 2 : 3',
        },
        hints: [
          { step: 1, text: '比は、両方を同じ数でわっても大きさが変わらないよ。' },
          { step: 2, text: '12 と 18 の最大公約数は 6。両方を 6 でわろう。' },
          { step: 3, text: '12 と 18 を最大公約数の 6 で両方わると、いちばん簡単な比になるよ。12 ÷ 6 と 18 ÷ 6 を計算して「□ : □」にしてみよう！' },
        ],
        explanationText: '12 と 18 を最大公約数 6 でわって、2 : 3。',
      },
      {
        id: 'rb-06',
        title: '比の値',
        difficulty: 2,
        problemText: '比 2 : 3 の「比の値」はどれですか？',
        answer: '2/3', answerUnit: '',
        choices: ['2/3', '3/2', '2/5', '1/3'],
        diagramType: 'ratio2',
        diagramSpec: {
          mode: 'bunpai', anchorKind: 'none',
          items: [{ r: 2, label: '前の数' }, { r: 3, label: 'うしろの数' }],
          unit: '',
          step2Text: '比の値 ＝ 前の数 ÷ うしろの数', step3Text: '2 ÷ 3 ＝ 2/3',
        },
        hints: [
          { step: 1, text: '比の値は「前の数 ÷ うしろの数」で求めるよ。' },
          { step: 2, text: 'a : b の比の値は a/b。' },
          { step: 3, text: 'あとは 2 : 3 の比の値は 2 ÷ 3 を計算してみよう！' },
        ],
        explanationText: '比の値 ＝ 前の数 ÷ うしろの数 ＝ 2 ÷ 3 ＝ 2/3。',
      },
      {
        id: 'rb-07',
        title: '比と実数（①あたり）',
        difficulty: 2,
        problemText: 'あめを兄と弟で 3 : 5 に分けたら、弟は 20 個になりました。兄は何個ですか？',
        answer: '12', answerUnit: '個',
        diagramType: 'ratio2',
        diagramSpec: {
          mode: 'bunpai', anchorKind: 'part', knownIndex: 1,
          items: [{ r: 3, label: '兄' }, { r: 5, label: '弟' }],
          anchorText: '弟 ＝ 20個', unit: '個',
          step2Text: '①あたり ＝ 20 ÷ 5 ＝ 4個', step3Text: '兄 ＝ 4 × 3 ＝ 12個',
        },
        hints: [
          { step: 1, text: '弟は比の 5 にあたる部分で、それが 20 個だね。' },
          { step: 2, text: '①（1つぶん）あたりは 20 ÷ 5 ＝ 4個。' },
          { step: 3, text: 'あとは 兄は比の 3 ぶんだから 4 × 3 を計算してみよう！' },
        ],
        explanationText: '①あたり ＝ 20 ÷ 5 ＝ 4個。兄は 4 × 3 ＝ 12個。',
      },
      {
        id: 'rb-08',
        title: '比例配分（2つに分ける）',
        difficulty: 2,
        problemText: '3000 円を兄と弟で 2 : 3 に分けます。少ない方は何円になりますか？',
        answer: '1200', answerUnit: '円',
        diagramType: 'ratio2',
        diagramSpec: {
          mode: 'bunpai', anchorKind: 'total',
          items: [{ r: 2, label: '兄' }, { r: 3, label: '弟' }],
          anchorText: '合計 3000円', unit: '円', oneValue: 600,
          step2Text: '①あたり ＝ 3000 ÷ 5 ＝ 600円', step3Text: '少ない方（兄）＝ 600 × 2 ＝ 1200円',
        },
        hints: [
          { step: 1, text: '比の合計は 2 ＋ 3 ＝ 5。全体 3000 円が 5 ぶんにあたるよ。' },
          { step: 2, text: '①あたりは 3000 ÷ 5 ＝ 600円。' },
          { step: 3, text: 'あとは 少ない方は比の 2 ぶんだから 600 × 2 を計算してみよう！' },
        ],
        explanationText: '①あたり ＝ 3000 ÷ 5 ＝ 600円。少ない方 ＝ 600 × 2 ＝ 1200円。',
      },
      {
        id: 'rb-09',
        title: '比例配分（3つに分ける）',
        difficulty: 2,
        problemText: 'おはじき 24 個を 1 : 2 : 3 で分けます。いちばん多い人は何個もらえますか？',
        answer: '12', answerUnit: '個',
        diagramType: 'ratio2',
        diagramSpec: {
          mode: 'bunpai', anchorKind: 'total',
          items: [{ r: 1, label: 'A' }, { r: 2, label: 'B' }, { r: 3, label: 'C' }],
          anchorText: '合計 24個', unit: '個', oneValue: 4,
          step2Text: '①あたり ＝ 24 ÷ 6 ＝ 4個', step3Text: 'いちばん多いC ＝ 4 × 3 ＝ 12個',
        },
        hints: [
          { step: 1, text: '比の合計は 1 ＋ 2 ＋ 3 ＝ 6。24 個が 6 ぶんにあたるよ。' },
          { step: 2, text: '①あたりは 24 ÷ 6 ＝ 4個。' },
          { step: 3, text: 'あとは いちばん多いのは比の 3 ぶんだから 4 × 3 を計算してみよう！' },
        ],
        explanationText: '①あたり ＝ 24 ÷ 6 ＝ 4個。いちばん多い人 ＝ 4 × 3 ＝ 12個。',
      },
      // ──────────────────────────────────
      // ★★★ むずかしい（連比・比＋差和）
      // ──────────────────────────────────
      {
        id: 'rb-10',
        title: '連比（A:B:C にまとめる）',
        difficulty: 3,
        problemText: 'A : B ＝ 2 : 3、B : C ＝ 4 : 5 のとき、A : B : C はどれですか？',
        answer: '8:12:15', answerUnit: '',
        choices: ['8:12:15', '2:3:5', '8:12:20', '2:12:5'],
        diagramType: 'ratio2',
        diagramSpec: {
          mode: 'renpi',
          rows: [
            { label: 'A:B', segs: [{ name: 'A', r: 2 }, { name: 'B', r: 3, hl: true }] },
            { label: 'B:C', segs: [{ name: 'B', r: 4, hl: true }, { name: 'C', r: 5 }] },
          ],
          finalRow: { label: 'A:B:C', segs: [{ name: 'A', r: 8 }, { name: 'B', r: 12 }, { name: 'C', r: 15 }] },
          unit: '',
          step2Text: 'A:B＝2:3 を ×4、B:C＝4:5 を ×3 → B を最小公倍数 12 にそろえる',
          step3Text: 'A:B:C ＝ 8 : 12 : 15',
        },
        hints: [
          { step: 1, text: '共通する B の数をそろえるよ。B は 3 と 4 だから、最小公倍数の 12 にそろえよう。' },
          { step: 2, text: 'A:B ＝ 2:3 を 4倍 → 8:12。B:C ＝ 4:5 を 3倍 → 12:15。' },
          { step: 3, text: 'あとは B が 12 でそろったので A:B:C を計算してみよう！' },
        ],
        explanationText: 'B を 12（3と4の最小公倍数）にそろえる。2:3→8:12、4:5→12:15。よって 8:12:15。',
      },
      {
        id: 'rb-11',
        title: '比と差（差から実数）',
        difficulty: 3,
        problemText: '兄と弟の所持金の比は 5 : 3 で、兄は弟より 400 円多く持っています。兄はいくら持っていますか？',
        answer: '1000', answerUnit: '円',
        diagramType: 'ratio2',
        diagramSpec: {
          mode: 'bunpai', anchorKind: 'diff',
          items: [{ r: 5, label: '兄' }, { r: 3, label: '弟' }],
          anchorText: '差 400円', unit: '円',
          step2Text: '比の差 5－3＝2 が 400円 → ①あたり ＝ 200円', step3Text: '兄 ＝ 200 × 5 ＝ 1000円',
        },
        hints: [
          { step: 1, text: '兄は比の 5、弟は比の 3。比の差は 5 － 3 ＝ 2 だよ。' },
          { step: 2, text: 'その 2 ぶんの差が 400 円。①あたりは 400 ÷ 2 ＝ 200円。' },
          { step: 3, text: 'あとは 兄は比の 5 ぶんだから 200 × 5 を計算してみよう！' },
        ],
        explanationText: '比の差 2 が 400円 → ①あたり 200円。兄 ＝ 200 × 5 ＝ 1000円。 たしかめ：弟600、差400 ◎',
      },
      {
        id: 'rb-12',
        title: '比と和（和から実数）',
        difficulty: 3,
        problemText: '姉と妹の年れいの比は 4 : 3 で、2人の年れいの和は 35 才です。姉は何才ですか？',
        answer: '20', answerUnit: '才',
        diagramType: 'ratio2',
        diagramSpec: {
          mode: 'bunpai', anchorKind: 'sum',
          items: [{ r: 4, label: '姉' }, { r: 3, label: '妹' }],
          anchorText: '和 35才', unit: '才', oneValue: 5,
          step2Text: '比の和 4＋3＝7 が 35才 → ①あたり ＝ 5才', step3Text: '姉 ＝ 5 × 4 ＝ 20才',
        },
        hints: [
          { step: 1, text: '姉は比の 4、妹は比の 3。比の和は 4 ＋ 3 ＝ 7 だよ。' },
          { step: 2, text: 'その 7 ぶんが 35 才。①あたりは 35 ÷ 7 ＝ 5才。' },
          { step: 3, text: 'あとは 姉は比の 4 ぶんだから 5 × 4 を計算してみよう！' },
        ],
        explanationText: '比の和 7 が 35才 → ①あたり 5才。姉 ＝ 5 × 4 ＝ 20才。 たしかめ：妹15、和35 ◎',
      },
      {
        id: 'rb-13',
        title: '連比＋実数（応用）',
        difficulty: 3,
        problemText: 'A : B ＝ 3 : 4、B : C ＝ 2 : 5 です。A が 18 のとき、C はいくつですか？',
        answer: '60', answerUnit: '',
        diagramType: 'ratio2',
        diagramSpec: {
          mode: 'renpi',
          rows: [
            { label: 'A:B', segs: [{ name: 'A', r: 3 }, { name: 'B', r: 4, hl: true }] },
            { label: 'B:C', segs: [{ name: 'B', r: 2, hl: true }, { name: 'C', r: 5 }] },
          ],
          finalRow: { label: 'A:B:C', segs: [{ name: 'A', r: 3 }, { name: 'B', r: 4 }, { name: 'C', r: 10 }] },
          unit: '',
          step2Text: 'B:C＝2:5 を ×2 → B を最小公倍数 4 にそろえる（A:B:C＝3:4:10）',
          step3Text: 'A の 3 が 18 → ①あたり6 → C ＝ 10 × 6 ＝ 60',
        },
        hints: [
          { step: 1, text: 'まず連比にまとめよう。B は 4 と 2 だから、最小公倍数の 4 にそろえるよ。' },
          { step: 2, text: 'B:C ＝ 2:5 を 2倍 → 4:10。よって A:B:C ＝ 3 : 4 : 10。' },
          { step: 3, text: 'Aの比3が18にあたるね。まず①あたり ＝ 18 ÷ 3 を出して、Cは比の10ぶんだから「①あたり × 10」を計算してみよう！' },
        ],
        explanationText: 'B を 4 にそろえ A:B:C ＝ 3:4:10。Aの3が18 → ①あたり6 → C ＝ 10×6 ＝ 60。',
      },
    ],
  },
  {
    id: 'concentration', order: 8, title: '濃度算（食塩水）', titleKana: 'のうどざん',
    emoji: '🧪', color: '#0ea5e9', layer: 3, prerequisiteIds: ['ratio-basics'],
    isFree: false,
    coreConcept: '食塩水の重さ × 濃度 ＝ 食塩の重さ（よこ×たて＝面積）',
    approachText:
      '食塩水を「よこ＝重さ・たて＝濃度・面積＝食塩」の長方形で考える。\n水を加えても蒸発させても「食塩の重さ」は変わらないのがカギ。\n2つを混ぜるときは、食塩どうし・食塩水どうしを合計してから割る。',
    primaryDiagram: 'noudo',
    introSlide: {
      title: '濃度の面積図の読み方',
      explanation: [
        'よこ＝食塩水の重さ（g）、たて＝濃度（%）の長方形であらわすよ',
        'その面積が「食塩の重さ（g）」。食塩水 × 濃度 ＝ 食塩',
        '濃度をもとめるときは 食塩 ÷ 食塩水 × 100（%）',
        '水を加える・蒸発させても、食塩の重さは変わらない！',
      ],
      diagramSpec: {
        mode: 'box',
        boxes: [{ weight: 200, pct: 15, salt: 30, label: '食塩水' }],
        unit: '%', showValues: true,
        step2Text: '濃度 ＝ 食塩 ÷ 食塩水 × 100', step3Text: '30 ÷ 200 × 100 ＝ 15%',
      },
    },
    problems: [
      // ──────────────────────────────────
      // ★ かんたん（3用法）
      // ──────────────────────────────────
      {
        id: 'nd-01',
        title: '濃度を求める',
        difficulty: 1,
        problemText: '200g の食塩水に、食塩が 30g とけています。この食塩水の濃度は何 % ですか？',
        answer: '15', answerUnit: '%',
        diagramType: 'noudo',
        diagramSpec: {
          mode: 'box', boxes: [{ weight: 200, pct: 15, salt: 30, label: '食塩水', unknown: 'pct' }], unit: '%',
          step2Text: '濃度 ＝ 食塩 ÷ 食塩水 × 100', step3Text: '30 ÷ 200 × 100 ＝ 15%',
        },
        hints: [
          { step: 1, text: '濃度は「食塩 ÷ 食塩水ぜんぶ」で出る割合だよ。何を何でわればいい？' },
          { step: 2, text: '食塩 ÷ 食塩水 をして、最後に ×100 で % になるよ。' },
          { step: 3, text: '30 ÷ 200 ＝ 0.15。これを % にすると？' },
        ],
        explanationText: '濃度 ＝ 食塩 ÷ 食塩水 × 100 ＝ 30 ÷ 200 × 100 ＝ 15%。',
      },
      {
        id: 'nd-02',
        title: '食塩の重さを求める',
        difficulty: 1,
        problemText: '8% の食塩水が 250g あります。この中に食塩は何 g ふくまれていますか？',
        answer: '20', answerUnit: 'g',
        diagramType: 'noudo',
        diagramSpec: {
          mode: 'box', boxes: [{ weight: 250, pct: 8, salt: 20, label: '食塩水', unknown: 'salt' }], unit: 'g',
          step2Text: '食塩 ＝ 食塩水 × 濃度', step3Text: '250 × 0.08 ＝ 20g',
        },
        hints: [
          { step: 1, text: '図の「面積（食塩）」をさがす問題。面積 ＝ よこ（食塩水）× たて（濃度）だよ。' },
          { step: 2, text: '8% は小数で 0.08。食塩 ＝ 食塩水 × 0.08 で出るね。' },
          { step: 3, text: '250 × 0.08 を計算しよう。' },
        ],
        explanationText: '食塩 ＝ 食塩水 × 濃度 ＝ 250 × 0.08 ＝ 20g。',
      },
      {
        id: 'nd-03',
        title: '食塩水の重さを求める',
        difficulty: 1,
        problemText: '食塩が 12g とけている 6% の食塩水は、全部で何 g ありますか？',
        answer: '200', answerUnit: 'g',
        diagramType: 'noudo',
        diagramSpec: {
          mode: 'box', boxes: [{ weight: 200, pct: 6, salt: 12, label: '食塩水', unknown: 'weight' }], unit: 'g',
          step2Text: '食塩水 ＝ 食塩 ÷ 濃度', step3Text: '12 ÷ 0.06 ＝ 200g',
        },
        hints: [
          { step: 1, text: '面積（食塩）と たて（濃度）がわかっていて、よこ（食塩水）をさがす問題だよ。' },
          { step: 2, text: 'よこ ＝ 面積 ÷ たて。6% は 0.06 だから 食塩水 ＝ 12 ÷ 0.06。' },
          { step: 3, text: '12 ÷ 0.06 を計算しよう。' },
        ],
        explanationText: '食塩水 ＝ 食塩 ÷ 濃度 ＝ 12 ÷ 0.06 ＝ 200g。',
      },
      {
        id: 'nd-04',
        title: '水と食塩から濃度を求める',
        difficulty: 1,
        problemText: '水 190g に食塩 10g をとかしました。この食塩水の濃度は何 % ですか？',
        answer: '5', answerUnit: '%',
        diagramType: 'noudo',
        diagramSpec: {
          mode: 'box', boxes: [{ weight: 200, pct: 5, salt: 10, label: '水190＋塩10', unknown: 'pct' }], unit: '%',
          step2Text: '食塩水 ＝ 水 ＋ 食塩 ＝ 190 ＋ 10 ＝ 200g', step3Text: '10 ÷ 200 × 100 ＝ 5%',
        },
        hints: [
          { step: 1, text: '気をつけて！わる数は「水の190g」じゃないよ。食塩水ぜんぶは何と何を合わせた重さ？' },
          { step: 2, text: '食塩水 ＝ 水 ＋ 食塩。全体の重さを出してから 食塩 ÷ 食塩水 × 100。' },
          { step: 3, text: '190 ＋ 10 ＝ 200g。10 ÷ 200 ＝ 0.05 を % にしよう。' },
        ],
        explanationText: '食塩水 ＝ 190 ＋ 10 ＝ 200g。濃度 ＝ 10 ÷ 200 × 100 ＝ 5%。',
      },
      // ──────────────────────────────────
      // ★★ ふつう（加水・蒸発・食塩追加・混合）
      // ──────────────────────────────────
      {
        id: 'nd-05',
        title: '水を加える',
        difficulty: 2,
        problemText: '8% の食塩水 200g に、水を 200g 加えました。濃度は何 % になりますか？',
        answer: '4', answerUnit: '%',
        diagramType: 'noudo',
        diagramSpec: {
          mode: 'box', unit: '%',
          boxes: [
            { weight: 200, pct: 8, salt: 16, label: 'はじめ' },
            { weight: 400, pct: 4, salt: 16, label: '水を加えた後', op: '水＋200g', unknown: 'pct' },
          ],
          step2Text: '水を加えても食塩は 16g のまま。食塩水は 400g に', step3Text: '16 ÷ 400 × 100 ＝ 4%',
        },
        hints: [
          { step: 1, text: '水を加えると、ふえるのは「食塩水ぜんぶ」。「食塩」そのものは変わるかな？ まず食塩が何gか考えよう。' },
          { step: 2, text: '食塩はずっと同じ。食塩水だけ 200 ＋ 200 ＝ 400g にふえるよ。' },
          { step: 3, text: '食塩は 200 × 0.08 ＝ 16g。16 ÷ 400 を % にしよう。' },
        ],
        explanationText: '食塩は 16g のまま、食塩水は 400g。16 ÷ 400 × 100 ＝ 4%。',
      },
      {
        id: 'nd-06',
        title: '水を蒸発させる',
        difficulty: 2,
        problemText: '6% の食塩水 500g から、水を 100g 蒸発させました。濃度は何 % になりますか？',
        answer: '7.5', answerUnit: '%',
        diagramType: 'noudo',
        diagramSpec: {
          mode: 'box', unit: '%',
          boxes: [
            { weight: 500, pct: 6, salt: 30, label: 'はじめ' },
            { weight: 400, pct: 7.5, salt: 30, label: '蒸発後', op: '水－100g', unknown: 'pct' },
          ],
          step2Text: '蒸発しても食塩は 30g のまま。食塩水は 400g に', step3Text: '30 ÷ 400 × 100 ＝ 7.5%',
        },
        hints: [
          { step: 1, text: '蒸発して出ていくのは水だけ。食塩の重さは変わるかな？ まず食塩を出そう。' },
          { step: 2, text: '食塩はそのまま。食塩水は 500 － 100 ＝ 400g にへるよ。' },
          { step: 3, text: '食塩は 500 × 0.06 ＝ 30g。30 ÷ 400 を % にしよう。' },
        ],
        explanationText: '食塩は 30g のまま、食塩水は 400g。30 ÷ 400 × 100 ＝ 7.5%。',
      },
      {
        id: 'nd-07',
        title: '食塩を加える',
        difficulty: 2,
        problemText: '10% の食塩水 180g に、食塩を 20g 加えました。濃度は何 % になりますか？',
        answer: '19', answerUnit: '%',
        diagramType: 'noudo',
        diagramSpec: {
          mode: 'box', unit: '%',
          boxes: [
            { weight: 180, pct: 10, salt: 18, label: 'はじめ' },
            { weight: 200, pct: 19, salt: 38, label: '食塩追加後', op: '塩＋20g', unknown: 'pct' },
          ],
          step2Text: '食塩 18＋20＝38g、食塩水 180＋20＝200g（加えた食塩のぶん両方ふえる）', step3Text: '38 ÷ 200 × 100 ＝ 19%',
        },
        hints: [
          { step: 1, text: '食塩を加えると、ふえるのは「食塩」だけかな？ それとも「食塩水ぜんぶ」もふえる？' },
          { step: 2, text: '両方ふえるよ。食塩は 18 ＋ 20、食塩水は 180 ＋ 20。' },
          { step: 3, text: '食塩 38g、食塩水 200g。38 ÷ 200 を % にしよう。' },
        ],
        explanationText: '食塩 18＋20＝38g、食塩水 180＋20＝200g。38 ÷ 200 × 100 ＝ 19%。',
      },
      {
        id: 'nd-08',
        title: '2つを混ぜる（基本）',
        difficulty: 2,
        problemText: '5% の食塩水 200g と、10% の食塩水 300g を混ぜました。濃度は何 % になりますか？',
        answer: '8', answerUnit: '%',
        diagramType: 'noudo',
        diagramSpec: {
          mode: 'mix', unit: '%',
          a: { weight: 200, pct: 5, salt: 10, label: '5%' },
          b: { weight: 300, pct: 10, salt: 30, label: '10%' },
          result: { weight: 500, pct: 8, salt: 40, unknown: 'pct' },
          step2Text: '食塩 10＋30＝40g、食塩水 200＋300＝500g', step3Text: '40 ÷ 500 × 100 ＝ 8%',
        },
        hints: [
          { step: 1, text: '混ぜたら、食塩どうし・食塩水どうしをそれぞれ合計するよ。まずそれぞれの食塩は何g？' },
          { step: 2, text: '食塩の合計 ÷ 食塩水の合計 × 100 で出るよ。' },
          { step: 3, text: '食塩 10 ＋ 30 ＝ 40g、食塩水 500g。40 ÷ 500 を % にしよう。' },
        ],
        explanationText: '食塩 10＋30＝40g、食塩水 500g。40 ÷ 500 × 100 ＝ 8%。',
      },
      {
        id: 'nd-09',
        title: '2つを混ぜる（こい＋うすい）',
        difficulty: 2,
        problemText: '12% の食塩水 100g と、4% の食塩水 300g を混ぜました。濃度は何 % になりますか？',
        answer: '6', answerUnit: '%',
        diagramType: 'noudo',
        diagramSpec: {
          mode: 'mix', unit: '%',
          a: { weight: 100, pct: 12, salt: 12, label: '12%' },
          b: { weight: 300, pct: 4, salt: 12, label: '4%' },
          result: { weight: 400, pct: 6, salt: 24, unknown: 'pct' },
          step2Text: '食塩 12＋12＝24g、食塩水 100＋300＝400g', step3Text: '24 ÷ 400 × 100 ＝ 6%',
        },
        hints: [
          { step: 1, text: '2つの食塩をそれぞれ出して合計する。食塩水も合計するよ。まず食塩から。' },
          { step: 2, text: '食塩の合計 ÷ 食塩水の合計 × 100。' },
          { step: 3, text: '食塩 12 ＋ 12 ＝ 24g、食塩水 400g。24 ÷ 400 を % にしよう。' },
        ],
        explanationText: '食塩 12＋12＝24g、食塩水 400g。24 ÷ 400 × 100 ＝ 6%。',
      },
      // ──────────────────────────────────
      // ★★★ むずかしい（逆算・目標濃度）
      // ──────────────────────────────────
      {
        id: 'nd-10',
        title: '混ぜて目標の濃度にする',
        difficulty: 3,
        problemText: '8% の食塩水と 3% の食塩水を混ぜて、5% の食塩水を 500g 作ります。8% の食塩水は何 g 必要ですか？',
        answer: '200', answerUnit: 'g',
        diagramType: 'noudo',
        diagramSpec: {
          mode: 'mix', unit: 'g',
          a: { weight: 200, pct: 8, salt: 16, label: '8%', unknown: 'weight' },
          b: { weight: 300, pct: 3, salt: 9, label: '3%', unknown: 'weight' },
          result: { weight: 500, pct: 5, salt: 25 },
          step2Text: 'できあがりの食塩 ＝ 500×0.05 ＝ 25g。もし全部3%なら 500×0.03 ＝ 15g', step3Text: 'たりない 25−15＝10g ÷（0.08−0.03）＝ 10 ÷ 0.05 ＝ 200g（8%）',
        },
        hints: [
          { step: 1, text: 'まず、できあがり（500g・5%）の中に食塩が何g入るか考えよう。500 × 0.05 だね。' },
          { step: 2, text: 'つぎに「もし500g全部が、うすい方の3%だったら」を考える。食塩は 500 × 0.03 ＝ 15g。本当は25gだから、何g足りない？' },
          { step: 3, text: '足りない 10g は、3%を8%にかえた量がうめているよ。1gかえるごとに 0.08−0.03＝0.05g ふえるから、8%の量 ＝ 10 ÷ 0.05 ＝ ?' },
        ],
        explanationText: 'できあがりの食塩25g。全部3%なら15g。たりない10gを、濃さの差0.05でわると 10÷0.05＝200g が8%の量。',
      },
      {
        id: 'nd-11',
        title: '水を加えて目標の濃度にする',
        difficulty: 3,
        problemText: '12% の食塩水 300g に水を加えて、9% の食塩水にします。水を何 g 加えればよいですか？',
        answer: '100', answerUnit: 'g',
        diagramType: 'noudo',
        diagramSpec: {
          mode: 'box', unit: 'g',
          boxes: [
            { weight: 300, pct: 12, salt: 36, label: 'はじめ' },
            { weight: 400, pct: 9, salt: 36, label: '9%にする', op: '水＋□g', unknown: 'weight' },
          ],
          step2Text: '食塩 36g は変わらない。9% にするには 36 ÷ 0.09 ＝ 400g 必要', step3Text: '加える水 ＝ 400 − 300 ＝ 100g',
        },
        hints: [
          { step: 1, text: '水を加えても食塩は変わらない。まず食塩が何gか出そう。' },
          { step: 2, text: '9% にするのに必要な「食塩水ぜんぶ」は 食塩 ÷ 0.09。そこから今の 300g をひけば加える水。' },
          { step: 3, text: '食塩 36g。36 ÷ 0.09 ＝ 400g。400 − 300 ＝ ?' },
        ],
        explanationText: '食塩36gは一定。9%にするには 36÷0.09＝400g 必要。水 ＝ 400−300 ＝ 100g。',
      },
      {
        id: 'nd-12',
        title: '蒸発させて目標の濃度にする',
        difficulty: 3,
        problemText: '8% の食塩水 400g から水を蒸発させて、10% の食塩水にします。水を何 g 蒸発させればよいですか？',
        answer: '80', answerUnit: 'g',
        diagramType: 'noudo',
        diagramSpec: {
          mode: 'box', unit: 'g',
          boxes: [
            { weight: 400, pct: 8, salt: 32, label: 'はじめ' },
            { weight: 320, pct: 10, salt: 32, label: '10%にする', op: '水－□g', unknown: 'weight' },
          ],
          step2Text: '食塩 32g は変わらない。10% にするには 32 ÷ 0.10 ＝ 320g にする', step3Text: '蒸発させる水 ＝ 400 − 320 ＝ 80g',
        },
        hints: [
          { step: 1, text: '蒸発しても食塩は変わらない。まず食塩を出そう。' },
          { step: 2, text: '10% にするのに必要な食塩水は 食塩 ÷ 0.10。今の 400g からそこまでへらすよ。' },
          { step: 3, text: '食塩 32g。32 ÷ 0.10 ＝ 320g。400 − 320 ＝ ?' },
        ],
        explanationText: '食塩32gは一定。10%にするには 32÷0.10＝320g。蒸発 ＝ 400−320 ＝ 80g。',
      },
      {
        id: 'nd-13',
        title: '混ぜて目標の濃度にする（応用）',
        difficulty: 3,
        problemText: '10% の食塩水と 20% の食塩水を混ぜて、16% の食塩水を 450g 作ります。20% の食塩水は何 g 必要ですか？',
        answer: '270', answerUnit: 'g',
        diagramType: 'noudo',
        diagramSpec: {
          mode: 'mix', unit: 'g',
          a: { weight: 180, pct: 10, salt: 18, label: '10%', unknown: 'weight' },
          b: { weight: 270, pct: 20, salt: 54, label: '20%', unknown: 'weight' },
          result: { weight: 450, pct: 16, salt: 72 },
          step2Text: 'できあがりの食塩 ＝ 450×0.16 ＝ 72g。もし全部10%なら 450×0.10 ＝ 45g', step3Text: '多い 72−45＝27g ÷（0.20−0.10）＝ 27 ÷ 0.10 ＝ 270g（20%）',
        },
        hints: [
          { step: 1, text: 'まず、できあがり（450g・16%）の食塩が何gか考えよう。450 × 0.16 だね。' },
          { step: 2, text: '「もし450g全部が、うすい方の10%だったら」食塩は 450 × 0.10 ＝ 45g。本当は72gだから、何g多い？' },
          { step: 3, text: '多い 27g は、10%を20%にかえた量がうめているよ。1gかえるごとに 0.20−0.10＝0.10g ふえるから、20%の量 ＝ 27 ÷ 0.10 ＝ ?' },
        ],
        explanationText: 'できあがりの食塩72g。全部10%なら45g。多い27gを、濃さの差0.10でわると 27÷0.10＝270g が20%の量。',
      },
    ],
  },
  // ─────────────────────────────────────
  // Unit 9: 損益算
  // ─────────────────────────────────────
  {
    id: 'profit-loss',
    order: 9,
    title: '損益算',
    titleKana: 'そんえきざん',
    emoji: '💰',
    color: '#f59e0b',
    layer: 3,
    prerequisiteIds: ['ratio-basics'],
    isFree: false,
    coreConcept: '原価→定価→売価の流れをラダー図で整理。「何を100%の基準にするか」が解くカギ。',
    approachText:
      '損益算は「お金の3段階」がすべて。\n' +
      '① 原価（仕入れ値）を100%と考え、利益を乗せると定価になる。\n' +
      '② 定価を100%と考えて値引きすると売価になる。\n' +
      '図の色分け（緑＝利益ゾーン、赤＝値引きゾーン）で基準を確認してから式を立てよう。',
    primaryDiagram: 'profit',
    introSlide: {
      title: '損益ラダー図の読み方',
      explanation: [
        '横バーの一番下が「原価（仕入れ値）」。これを①（100%）とおく。',
        '緑ゾーンが「利益（もうけ）」。原価＋利益＝定価になる。',
        '定価から赤ゾーン（値引き）を引いたのが「売価（実際の売り値）」。',
        '「？」のマスを求めるのが損益算のゴール。基準（%の元）を間違えないように！',
      ],
      diagramSpec: {
        mode: 'ladder',
        genka: 600, teika: 780, baika: 702,
        riekiRate: 30, waribikiRate: 10,
        unknown: 'none',
        showValues: true,
      },
    },
    problems: [
      // ── ★ かんたん（4問） ──
      {
        id: 'sp-01',
        title: '定価を求めよう',
        difficulty: 1,
        problemText: '原価600円の品物に、原価の25%の利益を乗せて定価をつけました。定価は何円ですか？',
        answer: '750',
        answerUnit: '円',
        diagramType: 'profit',
        diagramSpec: {
          mode: 'ladder',
          genka: 600, riekiRate: 25,
          teika: 750, baika: 750,
          waribikiRate: 0,
          unknown: 'teika',
          step1Text: '定価＝原価×(1＋0.25)＝原価×1.25',
          step2Text: '600 × 1.25 ＝ ？',
          step3Text: '600 × 1.25 ＝ 750円',
        },
        hints: [
          { step: 1, text: '原価を①（100%）とおくと、利益は25%だから定価は何%になるかな？' },
          { step: 2, text: '定価＝原価×（1＋0.25）＝原価×1.25 だよ。600×1.25 を計算してみよう。' },
          { step: 3, text: '原価600円の25%増しが定価だよ。あとは 600 × 1.25 を計算してみよう！' },
        ],
        explanationText: '原価600円の25%増し。定価 ＝ 600 × 1.25 ＝ 750円。',
      },
      {
        id: 'sp-02',
        title: '売価を求めよう',
        difficulty: 1,
        problemText: '定価1500円の品物を2割引きで売りました。売価は何円ですか？',
        answer: '1200',
        answerUnit: '円',
        diagramType: 'profit',
        diagramSpec: {
          mode: 'ladder',
          genka: 0, riekiRate: 0,
          teika: 1500, baika: 1200,
          waribikiRate: 20,
          unknown: 'baika',
          hideGenka: true,
          step1Text: '定価を100%とおく→売価は80%',
          step2Text: '売価＝1500×0.8＝？',
          step3Text: '1500×0.8＝1200円（2割引き＝8掛け）',
        },
        hints: [
          { step: 1, text: '2割引きとは、定価の20%を引くということ。定価を①（100%）とおくと、売価は何%？' },
          { step: 2, text: '売価 ＝ 定価 × （1 − 0.2）＝ 定価 × 0.8 だよ。1500 × 0.8 を計算しよう。' },
          { step: 3, text: '2割引きは「定価 × 0.8」（8掛け）だよ。あとは 1500 × 0.8 を計算してみよう！' },
        ],
        explanationText: '定価1500円の2割引き。売価 ＝ 1500 × 0.8 ＝ 1200円。',
      },
      {
        id: 'sp-03',
        title: '利益を求めよう',
        difficulty: 1,
        problemText: '800円で仕入れた品物を1050円で売りました。利益は何円ですか？',
        answer: '250',
        answerUnit: '円',
        diagramType: 'profit',
        diagramSpec: {
          mode: 'ladder',
          genka: 800, riekiRate: 0,
          teika: 1050, baika: 1050,
          waribikiRate: 0,
          unknown: 'rieki',
          showRieki: true,
          step1Text: '利益＝売価−原価',
          step2Text: '利益＝1050−800＝？',
          step3Text: '1050−800＝250円',
        },
        hints: [
          { step: 1, text: '利益 ＝ 売価 − 原価 だよ。売価と原価はそれぞれ何円？' },
          { step: 2, text: '売価は1050円、原価は800円。1050 − 800 ＝ ？' },
          { step: 3, text: 'あとは 1050 − 800 を計算してみよう！' },
        ],
        explanationText: '利益 ＝ 売価 − 原価 ＝ 1050 − 800 ＝ 250円。',
      },
      {
        id: 'sp-04',
        title: '定価をつけよう（4割の利益）',
        difficulty: 1,
        problemText: '原価700円の品物に、原価の4割の利益を乗せて定価をつけました。定価は何円ですか？',
        answer: '980',
        answerUnit: '円',
        diagramType: 'profit',
        diagramSpec: {
          mode: 'ladder',
          genka: 700, riekiRate: 40,
          teika: 980, baika: 980,
          waribikiRate: 0,
          unknown: 'teika',
          step1Text: '定価＝原価×(1＋0.4)＝原価×1.4',
          step2Text: '700×1.4＝？',
          step3Text: '700×1.4＝980円',
        },
        hints: [
          { step: 1, text: '4割の利益とは40%増しということ。定価 ＝ 原価 × 1.4 だよ。' },
          { step: 2, text: '700 × 1.4 ＝ 700 + 700 × 0.4 ＝ 700 + 280 ＝ ？' },
          { step: 3, text: 'あとは 700 + 280 を計算してみよう！' },
        ],
        explanationText: '4割増し。定価 ＝ 700 × 1.4 ＝ 980円。',
      },

      // ── ★★ ふつう（5問） ──
      {
        id: 'sp-05',
        title: '2段階計算（値上げして値引き）',
        difficulty: 2,
        problemText:
          '原価400円の品物に3割の利益を乗せて定価をつけ、定価の1割引きで売りました。利益は何円ですか？',
        answer: '68',
        answerUnit: '円',
        diagramType: 'profit',
        diagramSpec: {
          mode: 'ladder',
          genka: 400, riekiRate: 30,
          teika: 520, baika: 468,
          waribikiRate: 10,
          unknown: 'rieki',
          showRieki: true,
          step1Text: '定価＝400×1.3＝520円（先に計算！）',
          step2Text: '売価＝520×0.9＝468円',
          step3Text: '利益＝468−400＝68円',
        },
        hints: [
          { step: 1, text: 'まず定価を求めよう。定価 ＝ 原価 × 1.3 ＝ 400 × 1.3 ＝ ？' },
          { step: 2, text: '定価520円の1割引き。売価 ＝ 520 × 0.9 ＝ ？円。' },
          { step: 3, text: 'あとは 売価468円 − 原価400円 を計算してみよう！' },
        ],
        explanationText:
          '定価＝400×1.3＝520円。売価＝520×0.9＝468円。利益＝468−400＝68円。',
      },
      {
        id: 'sp-06',
        title: '売価から定価を逆算',
        difficulty: 2,
        problemText:
          '原価2400円の品物に定価をつけ、定価の2割引きで売ったところ120円の利益が出ました。定価は何円ですか？',
        answer: '3150',
        answerUnit: '円',
        diagramType: 'profit',
        diagramSpec: {
          mode: 'ladder',
          genka: 2400, riekiRate: 0,
          teika: 3150, baika: 2520,
          waribikiRate: 20,
          unknown: 'teika',
          step1Text: '売価＝原価＋利益＝2400＋120＝2520円',
          step2Text: '定価×0.8＝2520→定価＝2520÷0.8',
          step3Text: '2520÷0.8＝3150円',
        },
        hints: [
          { step: 1, text: '売価 ＝ 原価 ＋ 利益 ＝ 2400 ＋ 120 ＝ 2520円。まず売価を出そう。' },
          { step: 2, text: '売価2520円は、定価の2割引き後。定価×0.8 ＝ 2520 だから、定価 ＝ 2520 ÷ 0.8 ＝ ？' },
          { step: 3, text: 'あとは 2520 ÷ 0.8 を計算してみよう！' },
        ],
        explanationText:
          '売価＝2400＋120＝2520円。定価×0.8＝2520 → 定価＝2520÷0.8＝3150円。',
      },
      {
        id: 'sp-07',
        title: '利益率を求めよう',
        difficulty: 2,
        problemText:
          '原価に3割の利益を乗せて定価をつけ、定価の1割引きで売りました。利益は原価の何%ですか？',
        answer: '17',
        answerUnit: '%',
        diagramType: 'profit',
        diagramSpec: {
          mode: 'ladder',
          genka: 100, riekiRate: 30,
          teika: 130, baika: 117,
          waribikiRate: 10,
          unknown: 'riekiRate2',
          step1Text: '原価を100円と仮定→定価＝130円',
          step2Text: '売価＝130×0.9＝117円→利益17円',
          step3Text: '利益率＝17÷100＝17%',
        },
        choices: ['17%', '20%', '13%', '27%'],
        hints: [
          { step: 1, text: '原価を100円と仮定して考えよう。定価 ＝ 100 × 1.3 ＝ 130円。' },
          { step: 2, text: '定価130円の1割引き。売価 ＝ 130 × 0.9 ＝ 117円。' },
          { step: 3, text: '利益は 117 − 100 ＝ 17円。利益率は「利益 ÷ 原価」だから、あとは 17 ÷ 100 を % にしてみよう！' },
        ],
        explanationText:
          '原価100円仮定。定価130円。売価＝130×0.9＝117円。利益率＝（117−100）÷100＝17%。',
      },
      {
        id: 'sp-08',
        title: '原価を求めよう（逆算）',
        difficulty: 2,
        problemText:
          '原価に4割の利益を乗せて定価をつけました。定価の1割5分引きで売ったところ、利益が170円でした。原価は何円ですか？',
        answer: '1000',
        answerUnit: '円',
        diagramType: 'profit',
        diagramSpec: {
          mode: 'ladder',
          genka: 1000, riekiRate: 40,
          teika: 1400, baika: 1190,
          waribikiRate: 15,
          unknown: 'genka',
          step1Text: '原価を①とおく→売価＝①×1.4×0.85＝①×1.19',
          step2Text: '利益＝①×0.19＝170円',
          step3Text: '原価＝170÷0.19＝1000円',
        },
        hints: [
          { step: 1, text: '原価を①とおくと、定価は①×1.4。売価は定価の15%引き＝①×1.4×0.85。' },
          { step: 2, text: '①×1.4×0.85 ＝ ①×1.19。利益 ＝ 売価 − 原価 ＝ ①×1.19 − ① ＝ ①×0.19 ＝ 170円。' },
          { step: 3, text: '原価を①とすると、19%（0.19）にあたる金額が170円。あとは 170 ÷ 0.19 を計算してみよう！' },
        ],
        explanationText:
          '原価①。定価＝①×1.4、売価＝①×1.4×0.85＝①×1.19。利益①×0.19＝170→①＝1000円。',
      },
      {
        id: 'sp-09',
        title: '定価の1割引きで売ると利益が出る',
        difficulty: 2,
        problemText:
          '原価1800円の品物に定価をつけ、定価の1割引きで売ったところ180円の利益が出ました。定価は何円ですか？',
        answer: '2200',
        answerUnit: '円',
        diagramType: 'profit',
        diagramSpec: {
          mode: 'ladder',
          genka: 1800, riekiRate: 0,
          teika: 2200, baika: 1980,
          waribikiRate: 10,
          unknown: 'teika',
          step1Text: '売価＝原価＋利益＝1800＋180＝1980円',
          step2Text: '定価×0.9＝1980→定価＝1980÷0.9',
          step3Text: '1980÷0.9＝2200円',
        },
        hints: [
          { step: 1, text: '売価 ＝ 原価 ＋ 利益 ＝ 1800 ＋ 180 ＝ 1980円。' },
          { step: 2, text: '売価1980円 ＝ 定価の1割引き＝定価×0.9。' },
          { step: 3, text: '1割引き（×0.9）して1980円になった。もとの定価は「÷0.9」でもどせるよ。あとは 1980 ÷ 0.9 を計算してみよう！' },
        ],
        explanationText:
          '売価＝1980円。定価×0.9＝1980 → 定価＝2200円。',
      },

      // ── ★★★ むずかしい（4問） ──
      {
        id: 'sp-10',
        title: '何%引きにすれば目標の利益が出る？',
        difficulty: 3,
        problemText:
          '原価に4割の利益を乗せて定価をつけました。定価の何%引きで売れば、原価の12%の利益になりますか？',
        answer: '20',
        answerUnit: '%',
        diagramType: 'profit',
        diagramSpec: {
          mode: 'ladder',
          genka: 100, riekiRate: 40,
          teika: 140, baika: 112,
          waribikiRate: 20,
          unknown: 'waribikiRate',
          step1Text: '定価140円。目標売価＝100×1.12＝112円',
          step2Text: '売価÷定価＝112÷140＝0.8＝80%で売る',
          step3Text: '値引き率＝1−0.8＝20%引き',
        },
        choices: ['20%', '16%', '12%', '28%'],
        hints: [
          { step: 1, text: '原価を100円と仮定。定価＝100×1.4＝140円。目標売価＝100×1.12＝112円。' },
          { step: 2, text: '売価112円が定価140円の何%になるか → 112 ÷ 140 ＝ 0.8 → 80%。' },
          { step: 3, text: '定価の80%で売る＝20%引き＝「定価 × 0.8」だよ。定価を 0.8倍して計算してみよう！' },
        ],
        explanationText:
          '原価100円仮定。定価140円。必要売価＝112円。112÷140＝0.8→定価の80%＝20%引き。',
      },
      {
        id: 'sp-11',
        title: '定価販売と割引販売の組み合わせ',
        difficulty: 3,
        problemText:
          '原価500円の品物を30個仕入れ、原価の4割の利益を見込んで定価をつけました。20個は定価で、残りの10個は定価の2割引きで売りました。全体の利益は何円ですか？',
        answer: '4600',
        answerUnit: '円',
        diagramType: 'profit',
        diagramSpec: {
          mode: 'batch',
          genka: 500, riekiRate: 40,
          teika: 700, waribikiRate: 20,
          baika2: 560,
          lots: 30, teikaSell: 20, waribikiSell: 10,
          unknown: 'totalRieki',
          totalRieki: 4600,
          step1Text: '定価700円。割引売価＝700×0.8＝560円',
          step2Text: '定価販売利益＝200×20＝4000円',
          step3Text: '割引販売利益＝60×10＝600円。合計4600円',
        },
        hints: [
          { step: 1, text: '定価 ＝ 500 × 1.4 ＝ 700円。割引売価 ＝ 700 × 0.8 ＝ 560円。' },
          { step: 2, text: '定価で売ったときの1個あたりの利益 ＝ 700 − 500 ＝ 200円 × 20個 ＝ 4000円。' },
          { step: 3, text: '割引品1個の利益は 560 − 500 ＝ 60円。それが10個ぶんと、定価ぶんの利益4000円をたすよ。60 × 10 ＋ 4000 を計算してみよう！' },
        ],
        explanationText:
          '定価700円。割引売価560円。定価販売利益200×20＝4000円、割引販売利益60×10＝600円。計4600円。',
      },
      {
        id: 'sp-12',
        title: '売れ残りが出た場合の利益計算',
        difficulty: 3,
        problemText:
          '原価400円の品物を20個仕入れ、原価の2割5分の利益を乗せて定価をつけました。売れ残りを定価の4割引きで売ったところ、全体で1200円の利益が出ました。売れ残りは何個ですか？',
        answer: '4',
        answerUnit: '個',
        diagramType: 'profit',
        diagramSpec: {
          mode: 'batch',
          genka: 400, riekiRate: 25,
          teika: 500, waribikiRate: 40,
          baika2: 300,
          lots: 20, teikaSell: 0, waribikiSell: 0,
          unknown: 'waribikiSell',
          totalRieki: 1200,
          step1Text: '売れ残りをx個とすると定価販売＝(20−x)個',
          step2Text: '100(20−x)−100x＝2000−200x＝1200',
          step3Text: '200x＝800→x＝4個',
        },
        hints: [
          { step: 1, text: '定価＝400×1.25＝500円。4割引き売価＝500×0.6＝300円（原価400円より安い＝損失）。' },
          { step: 2, text: '売れ残りをx個とする。定価販売(20-x個)の利益＝100(20-x)円。割引販売(x個)の損失＝(400-300)×x＝100x円。' },
          { step: 3, text: '式 100(20−x) − 100x ＝ 1200 を整理すると 2000 − 200x ＝ 1200、つまり 200x ＝ 800。あとは 800 ÷ 200 を計算して x を求めよう！' },
        ],
        explanationText:
          '定価500円、割引売価300円（損失100円/個）。方程式 100(20-x)−100x＝1200 → x＝4個。',
      },
      {
        id: 'sp-13',
        title: '定価の何割引きで売っても利益が出る（逆算応用）',
        difficulty: 3,
        problemText:
          '原価に3割の利益を見込んで定価をつけました。セールで定価の2割引きで売っても1個あたり160円の利益が出ました。原価は何円ですか？',
        answer: '4000',
        answerUnit: '円',
        diagramType: 'profit',
        diagramSpec: {
          mode: 'ladder',
          genka: 4000, riekiRate: 30,
          teika: 5200, baika: 4160,
          waribikiRate: 20,
          unknown: 'genka',
          step1Text: '原価を①とおく→売価＝①×1.3×0.8＝①×1.04',
          step2Text: '利益＝①×0.04＝160円',
          step3Text: '原価＝160÷0.04＝4000円',
        },
        hints: [
          { step: 1, text: '原価を①とおくと、定価 ＝ ①×1.3。売価（2割引き）＝ ①×1.3×0.8 ＝ ①×1.04。' },
          { step: 2, text: '利益 ＝ 売価 − 原価 ＝ ①×1.04 − ① ＝ ①×0.04 ＝ 160円。' },
          { step: 3, text: '4%（0.04）にあたる金額が160円。もとの①（原価）は「160 ÷ 0.04」で出るよ。計算してみよう！' },
        ],
        explanationText:
          '原価①。売価＝①×1.3×0.8＝①×1.04。利益＝①×0.04＝160 → 原価＝4000円。',
      },
    ],
  },
  {
    id: 'work-newton', order: 10, title: '仕事算・ニュートン算', titleKana: 'しごとざん・にゅーとんざん',
    emoji: '⚙️', color: '#64748b', layer: 4, prerequisiteIds: ['ratio-basics'],
    isFree: false, coreConcept: '全体の仕事量を「最小公倍数」とおいて、1日あたりの仕事量を整数で表す',
    approachText:
      '仕事算のコツは「全体の仕事量を1とおくのではなく、かかる日数の最小公倍数とおく」こと。\n' +
      'こうすると、1人が1日にする仕事量が分数ではなく整数になって考えやすい。\n' +
      '・1日あたりの仕事量 ＝ 全体 ÷ かかる日数\n' +
      '・2人ですると、1日あたりの仕事量は「たし算」できる\n' +
      '・かかる日数 ＝ 全体 ÷（1日あたりの仕事量の合計）\n' +
      'いつも「1日でどれだけ進むか」をそろえてから計算しよう。',
    primaryDiagram: 'none',
    introSlide: {
      title: '仕事算の考え方（全体＝最小公倍数）',
      explanation: [
        'まず「全体の仕事量」をかかる日数の最小公倍数とおく',
        '（例）Aが10日・Bが15日 → 全体を30とおく',
        '1日あたり：A＝30÷10＝3、B＝30÷15＝2',
        '2人ですると 1日 3＋2＝5 → 全体30 ÷ 5 ＝ 6日で終わる',
      ],
      diagramSpec: {},
    },
    problems: [
      // ──────────────────────────────────
      // ★ 1人/1日あたりの仕事量・2人での合計
      // ──────────────────────────────────
      {
        id: 'wk-01', title: '1日あたりの仕事量（基本）', difficulty: 1,
        problemText: 'ある仕事を、Aさんは10日、Bさんは15日で終わらせます。全体の仕事量を「最小公倍数の30」とおくと、Aさんが1日にする仕事量はいくつですか？',
        answer: '3', answerUnit: '（30のうち）',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '全体を最小公倍数の30とおくと、A・Bの1日量が整数で出て計算しやすい！Aは10日で全部（30）終わらせるね。' },
          { step: 2, text: '毎日同じペースで仕事をすると仮定するから、1日量 ＝ 全体 ÷ 日数。30を10日に均等に分けるから…' },
          { step: 3, text: 'あとは 30 ÷ 10 を計算してみよう！（これがAさんの1日でできる仕事量）' },
        ],
        explanationText: 'Aの1日量 ＝ 全体30 ÷ 10日 ＝ 3。全体を最小公倍数にすると整数になる。 たしかめ：3 × 10日 ＝ 30（全体）でぴったり ◎',
      },
      {
        id: 'wk-02', title: 'もう1人の1日あたりの仕事量', difficulty: 1,
        problemText: 'ある仕事を、Aさんは10日、Bさんは15日で終わらせます。全体の仕事量を「30」とおくと、Bさんが1日にする仕事量はいくつですか？',
        answer: '2', answerUnit: '（30のうち）',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: 'Bさんは15日で全部（30）終わらせるよ。' },
          { step: 2, text: '1日あたり ＝ 全体 ÷ 日数 ＝ 30 ÷ 15。' },
          { step: 3, text: 'あとは 30 ÷ 15 を計算してみよう！' },
        ],
        explanationText: 'Bの1日量 ＝ 全体30 ÷ 15日 ＝ 2。 たしかめ：2 × 15日 ＝ 30 ◎',
      },
      {
        id: 'wk-03', title: '2人ですると1日にどれだけ', difficulty: 1,
        problemText: '全体を30とおくと、Aさんは1日に3、Bさんは1日に2の仕事をします。2人で一緒にすると、1日にいくつの仕事ができますか？',
        answer: '5', answerUnit: '（30のうち）',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '2人が同時に作業すると、1日にできる量はそれぞれの量をたし合わせられる（Aがやる分＋Bがやる分）。' },
          { step: 2, text: 'AはA、BはBで別々の仕事をしているから、1日量はたし算できる。A の 3 と B の 2 をたそう。' },
          { step: 3, text: 'あとは 3 ＋ 2 を計算してみよう！（これが2人で1日できる量）' },
        ],
        explanationText: '2人の1日量は「たし算」できる。3 ＋ 2 ＝ 5。',
      },
      {
        id: 'wk-04', title: '2人で何日で終わる（基本）', difficulty: 1,
        problemText: 'ある仕事を、Aさんは10日、Bさんは15日で終わらせます。この仕事を2人で一緒にすると、何日で終わりますか？',
        answer: '6', answerUnit: '日',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '全体を最小公倍数30とおくと A＝30÷10＝3・B＝30÷15＝2 と整数で出る（分数計算を避けるコツ！）。' },
          { step: 2, text: '2人が同時に作業するから1日量はたし算できる。A3＋B2＝1日に5 できるよ。' },
          { step: 3, text: '全体30を1日5ずつこなすなら、かかる日数 ＝ 全体 ÷ 1日量 ＝ 30 ÷ 5。計算してみよう！' },
        ],
        explanationText: '全体30、2人で1日5 → 30 ÷ 5 ＝ 6日。 たしかめ：5 × 6日 ＝ 30（全体）◎',
      },
      // ──────────────────────────────────
      // ★★ いろいろな2人・1人ぶんを逆算
      // ──────────────────────────────────
      {
        id: 'wk-05', title: '日数がちがう2人', difficulty: 2,
        problemText: 'ある仕事を、Aさんは12日、Bさんは6日で終わらせます。2人で一緒にすると何日で終わりますか？',
        answer: '4', answerUnit: '日',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '全体を最小公倍数12とおくと A＝12÷12＝1・B＝12÷6＝2 と整数で出る。' },
          { step: 2, text: '2人で同時に作業するから1日量はたし算できる。A1＋B2＝1日に3 できるよ。' },
          { step: 3, text: '全体12を1日3ずつこなすから、かかる日数 ＝ 全体 ÷ 1日量 ＝ 12 ÷ 3。計算してみよう！' },
        ],
        explanationText: '全体12、A＝1・B＝2、2人で1日3 → 12 ÷ 3 ＝ 4日。 たしかめ：3 × 4日 ＝ 12 ◎',
      },
      {
        id: 'wk-06', title: '日数が大きい2人', difficulty: 2,
        problemText: 'ある仕事を、Aさんは20日、Bさんは30日で終わらせます。2人で一緒にすると何日で終わりますか？',
        answer: '12', answerUnit: '日',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '全体を最小公倍数60とおくと A＝60÷20＝3・B＝60÷30＝2 と整数で出る。' },
          { step: 2, text: '2人で同時に作業するから1日量はたし算できる。A3＋B2＝1日に5 できるよ。' },
          { step: 3, text: '全体60を1日5ずつこなすから、かかる日数 ＝ 全体 ÷ 1日量 ＝ 60 ÷ 5。計算してみよう！' },
        ],
        explanationText: '全体60、A＝3・B＝2、2人で1日5 → 60 ÷ 5 ＝ 12日。 たしかめ：5 × 12日 ＝ 60 ◎',
      },
      {
        id: 'wk-07', title: 'もう1人の日数を逆算', difficulty: 2,
        problemText: 'ある仕事を、Aさん1人だと12日かかります。AさんとBさんの2人ですると4日で終わります。Bさん1人だと何日かかりますか？',
        answer: '6', answerUnit: '日',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '全体を12とおこう。Aの1日量と「2人の1日量」を出すよ。' },
          { step: 2, text: 'A ＝ 12÷12 ＝ 1、2人で ＝ 12÷4 ＝ 3。Bの1日量 ＝ 2人 － A ＝ 3 － 1。' },
          { step: 3, text: '2人で1日3、Aが1日1だから Bは1日 3 − 1 ＝ 2すすむ。全体12をBの「1日2」でわれば日数だよ。あとは 12 ÷ 2 を計算してみよう！' },
        ],
        explanationText: '全体12、2人で1日3、A＝1 → B＝2。B1人なら 12 ÷ 2 ＝ 6日。',
      },
      {
        id: 'wk-08', title: '途中から1人にかわる', difficulty: 2,
        problemText: 'ある仕事を、Aさんは8日、Bさんは24日で終わらせます。はじめの4日間は2人で一緒にやり、残りはBさん1人でやりました。Bさん1人でやったのは何日間ですか？',
        answer: '8', answerUnit: '日間',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '8と24の最小公倍数は24。全体を48にしてもよいけど、24でOK。A＝24÷8、B＝24÷24。' },
          { step: 2, text: 'A ＝ 3、B ＝ 1、2人で1日 4。はじめ4日で 4×4 ＝ 16 やった。残りは 24 － 16 ＝ 8。' },
          { step: 3, text: 'あとは 残り8をBだけ（1日1）でやると 8 ÷ 1 を計算してみよう！' },
        ],
        explanationText: '全体24、A＝3・B＝1。2人4日で16、残り8をBが 8 ÷ 1 ＝ 8日間。 たしかめ：16 ＋ 1×8 ＝ 24（全体）◎',
      },
      {
        id: 'wk-09', title: '途中で1人ぬける（全部で何日）', difficulty: 2,
        problemText: 'ある仕事を、Aさんは12日、Bさんは6日で終わらせます。はじめは2人で2日間やりましたが、Bさんがぬけて、残りをAさん1人でやりました。仕事が全部終わるまで、全部で何日かかりましたか？',
        answer: '8', answerUnit: '日',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '12と6の最小公倍数は12。A＝12÷12＝1、B＝12÷6＝2。2人で1日3。' },
          { step: 2, text: 'はじめ2日で 3×2 ＝ 6 やった。残り 12 － 6 ＝ 6 をAだけ（1日1）で。' },
          { step: 3, text: '残り6をAだけ（1日1）でやると 6 ÷ 1 日かかる。それに最初の2日をたせば全部の日数だよ。あとは 6 ÷ 1 を計算して、2 をたしてみよう！' },
        ],
        explanationText: '2人2日で6、残り6をAが6日 → 全部で 2 ＋ 6 ＝ 8日。聞かれているのは合計日数。',
      },
      // ──────────────────────────────────
      // ★★★ 交代・逆算・ニュートン算の基礎
      // ──────────────────────────────────
      {
        id: 'wk-10', title: '1日ずつ交代でやる', difficulty: 3,
        problemText: 'ある仕事を、Aさんは10日、Bさんは15日で終わらせます。この仕事を、Aさん→Bさん→Aさん→Bさん…と1日ずつ交代でやります（Aさんが先）。全部で何日で終わりますか？',
        answer: '12', answerUnit: '日',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '全体を30とおくと A＝3、B＝2。「2日で1セット」と考えよう。1セットでいくつ進む？' },
          { step: 2, text: '2日（A＋B）で 3＋2＝5 進む。全体30を5でわると、何セットでちょうど終わる？' },
          { step: 3, text: '1セット（2日）で 3 ＋ 2 ＝ 5すすむ。全体30は 30 ÷ 5 ＝ 6セット。1セットは2日だから、あとは 6 × 2 を計算してみよう！' },
        ],
        explanationText: '全体30、2日1セットで5進む → 6セット＝12日でちょうど終わる。',
      },
      {
        id: 'wk-11', title: 'はたらいた日数を逆算', difficulty: 3,
        problemText: 'ある仕事を、Aさんは24日、Bさんは8日で終わらせます。はじめAさんが1人で何日かやり、そのあとBさんが1人で4日やって、ちょうど仕事が終わりました。Aさんがはたらいたのは何日間ですか？',
        answer: '12', answerUnit: '日間',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '24と8の最小公倍数は24。A＝24÷24＝1、B＝24÷8＝3。まずBがやった分を出そう。' },
          { step: 2, text: 'Bは4日やったから 3×4 ＝ 12 やった。残りはAがやった分。全体は24。' },
          { step: 3, text: 'Bがやった量を全体24から引くと、Aがやった量。Aは1日1だから「その量 ÷ 1」が日数だよ。あとは 24 − 12 を計算して、1でわってみよう！' },
        ],
        explanationText: '全体24、B4日で12、残り12をAが（1日1）→ 12日間。',
      },
      {
        id: 'wk-12', title: 'ニュートン算の基礎（窓口の行列）', difficulty: 3,
        problemText: '行列に毎分同じ人数ずつ人が並びにきます。窓口を1つ開けると60分で行列がなくなり、2つ開けると20分でなくなります。窓口3つを開けると、何分で行列がなくなりますか？（はじめの行列の人数と、毎分くる人数・窓口1つが1分に通せる人数は、それぞれ一定です）',
        answer: '12', answerUnit: '分',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '「もとの行列」＋「毎分ふえる人」＝「窓口が通した人」。窓口1つが1分に通す人数を1とおくと、1つ60分＝60、2つ20分＝40 を通したことになる。' },
          { step: 2, text: 'もとの行列を○、毎分くる人を△とすると ○＋60△＝60、○＋20△＝40。引き算すると 40△＝20 → △＝0.5。○＝40－20×0.5＝30。' },
          { step: 3, text: 'もとの行列○＝30、毎分くる△＝0.5。窓口3つはx分で「30＋0.5x」人を、「3x」人通す。等しいから 30＋0.5x＝3x → 30＝2.5x。あとは 30 ÷ 2.5 を計算して x を求めよう！' },
        ],
        explanationText: 'もとの行列30・毎分0.5ふえる。3窓口は毎分3通す → 30＋0.5x＝3x → x＝12分。ふえ続ける仕事＝ニュートン算。 たしかめ：30＋0.5×12＝36、3×12＝36 ◎',
      },
    ],
  },
  {
    id: 'travelers', order: 11, title: '旅人算', titleKana: 'たびびとざん',
    emoji: '🚶', color: '#fb923c', layer: 4, prerequisiteIds: ['work-newton'],
    isFree: false, coreConcept: '2つの動くものの距離の縮まり方・離れ方を時間で捉える',
    approachText:
      '旅人算のカギは「1分（1時間）に2人の間が何mちぢまるか・ひろがるか」。\n' +
      '・向かい合って進む→ 1分に「速さの和」だけ近づく（出会い算）\n' +
      '・同じ向きに進む→ 1分に「速さの差」だけ近づく（追いつき算）\n' +
      'はじめの道のり ÷（和または差）＝ かかる時間。検算は「速さ×時間＝進んだ道のり」でかならず確かめる。',
    primaryDiagram: 'arrow',
    introSlide: {
      title: '矢印図の読み方（出会い・追いつき）',
      explanation: [
        '道のりを1本の線で表し、2人を矢印で書く',
        '向かい合わせ（→ ←）＝出会い。1分に「速さの和」だけ近づく',
        '同じ向き（→ →）＝追いつき。1分に「速さの差」だけ近づく',
        'はじめの間の道のり ÷（和 or 差）＝ かかる時間',
      ],
      diagramSpec: {
        mode: 'meet', aName: 'A', bName: 'B',
        aSpeed: 60, bSpeed: 40, speedUnit: 'm/分',
        gapLabel: 'はじめの間', gapText: '1000m',
        combinedLabel: '速さの和', combinedText: '60＋40＝100m/分',
        answerText: '1000 ÷ 100 ＝ 10分で出会う',
        showValues: true,
      },
    },
    problems: [
      // ──────────────────────────────────
      // ★ 出会い算（速さの和）
      // ──────────────────────────────────
      {
        id: 'tr-01', title: '出会うまでの時間（基本）', difficulty: 1,
        problemText: '1800mはなれた2地点から、AさんとBさんが向かい合って同時に出発します。Aさんは分速60m、Bさんは分速60mです。2人が出会うのは何分後ですか？',
        answer: '15', answerUnit: '分後',
        diagramType: 'arrow',
        diagramSpec: {
          mode: 'meet', aName: 'A', bName: 'B', aEmoji: '🚶', bEmoji: '🚶',
          aSpeed: 60, bSpeed: 60, speedUnit: 'm/分',
          gapLabel: 'はじめの間', gapText: '1800m',
          combinedLabel: '速さの和', combinedText: '60＋60＝120m/分',
          answerText: '1800 ÷ 120 ＝ 15分',
        },
        hints: [
          { step: 1, text: '向かい合って進むと、Aが進む分もBが進む分も「2人の間」を縮めるよ。1分で何mずつ近づくかな？' },
          { step: 2, text: '1分でAが60m、Bも60m、合わせて 60＋60＝120m ちぢまる（これが「速さの和」）。はじめの間は1800m。' },
          { step: 3, text: '1800mを1分間に120mずつちぢめていくから、かかる時間 ＝ 距離 ÷ 速さ ＝ 1800 ÷ 120。計算してみよう！' },
        ],
        explanationText: '出会い算は「速さの和」。1800 ÷（60＋60）＝ 15分。 たしかめ：Aは60×15＝900m、Bは60×15＝900m、合わせて1800m ◎',
      },
      {
        id: 'tr-02', title: '速さがちがう2人の出会い', difficulty: 1,
        problemText: '2400mはなれたところから、兄は分速70m、弟は分速50mで向かい合って同時に歩き出しました。2人が出会うのは何分後ですか？',
        answer: '20', answerUnit: '分後',
        diagramType: 'arrow',
        diagramSpec: {
          mode: 'meet', aName: '兄', bName: '弟', aEmoji: '🧑', bEmoji: '👦',
          aSpeed: 70, bSpeed: 50, speedUnit: 'm/分',
          gapLabel: 'はじめの間', gapText: '2400m',
          combinedLabel: '速さの和', combinedText: '70＋50＝120m/分',
          answerText: '2400 ÷ 120 ＝ 20分',
        },
        hints: [
          { step: 1, text: '向かい合って進むと、兄が70m・弟が50m、どちらも間を縮める。1分で何m近づくか計算しよう！' },
          { step: 2, text: '兄70m＋弟50m ＝ 1分で120m ちぢまる（速さの和）。はじめの間2400mを120m/分で縮めていくよ。' },
          { step: 3, text: '2400mを毎分120mずつちぢめるから、かかる時間 ＝ 距離 ÷ 速さ ＝ 2400 ÷ 120。計算してみよう！' },
        ],
        explanationText: '2400 ÷（70＋50）＝ 20分。速さがちがっても「和」でわるのは同じ。 たしかめ：70×20＝1400m、50×20＝1000m、合計2400m ◎',
      },
      {
        id: 'tr-03', title: '相手の速さを求める', difficulty: 1,
        problemText: '1200mはなれた2地点から向かい合って同時に出発し、8分後に出会いました。Aさんは分速80mです。Bさんの分速は何mですか？',
        answer: '70', answerUnit: 'm',
        diagramType: 'arrow',
        diagramSpec: {
          mode: 'meet', aName: 'A', bName: 'B', aEmoji: '🚶', bEmoji: '🚴',
          aSpeed: 80, bSpeed: 70, speedUnit: 'm/分',
          gapLabel: 'はじめの間', gapText: '1200m',
          combinedLabel: '速さの和', combinedText: '1200 ÷ 8 ＝ 150m/分',
          answerText: '150 － 80 ＝ 70m/分',
          unknown: 'bSpeed',
        },
        hints: [
          { step: 1, text: '向かい合って進んで8分で1200m縮まったんだね。1分間に何m縮まった？（これが2人の速さの和）' },
          { step: 2, text: '速さの和 ＝ 1200 ÷ 8 ＝ 150m/分。向かい合いだからAとBの速さを足すと150m/分。Aは80m/分だから…' },
          { step: 3, text: '「AとBの速さの和 ＝ 150m/分」がわかったね。BはAが引いた残り。あとは 150 − 80 を計算してみよう！' },
        ],
        explanationText: '速さの和 ＝ 1200 ÷ 8 ＝ 150。Bの速さ ＝ 150 － 80 ＝ 70m/分。 たしかめ：（80＋70）×8＝1200m ◎',
      },
      // ──────────────────────────────────
      // ★ 追いつき算（速さの差）
      // ──────────────────────────────────
      {
        id: 'tr-04', title: '追いつくまでの時間（基本）', difficulty: 1,
        problemText: '弟が家を出てしばらく進み、600m先にいます。そこへ兄が分速80mで追いかけ、弟は分速50mで同じ向きに進みます。兄が弟に追いつくのは何分後ですか？',
        answer: '20', answerUnit: '分後',
        diagramType: 'arrow',
        diagramSpec: {
          mode: 'chase', aName: '兄', bName: '弟', aEmoji: '🧑', bEmoji: '👦',
          aSpeed: 80, bSpeed: 50, speedUnit: 'm/分',
          gapLabel: 'はじめの差', gapText: '600m',
          combinedLabel: '速さの差', combinedText: '80－50＝30m/分',
          answerText: '600 ÷ 30 ＝ 20分',
        },
        hints: [
          { step: 1, text: '同じ向きに進むとき、兄が80m進む間に弟も50m進む。差は 80−50＝30m しかちぢまらない（「速さの差」）。1分で何mちぢまる？' },
          { step: 2, text: '兄80−弟50＝30m/分ずつちぢまるね（速さの差）。はじめの差は600m。' },
          { step: 3, text: '600mの差を毎分30mずつちぢめるから、かかる時間 ＝ 差 ÷ 速さの差 ＝ 600 ÷ 30。計算してみよう！' },
        ],
        explanationText: '追いつき算は「速さの差」。600 ÷（80－50）＝ 20分。 たしかめ：兄80×20＝1600m、弟は600＋50×20＝1600m で同じ位置 ◎',
      },
      {
        id: 'tr-05', title: '速さの差を求める', difficulty: 1,
        problemText: '240m前にいる人を、後ろから追いかけて12分で追いつきました。2人の分速の差は何mですか？',
        answer: '20', answerUnit: 'm',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '同じ向きに進むとき1分で縮まるのは「速い方 − 遅い方 ＝ 速さの差」ぶん。12分で240mちぢめたんだね。' },
          { step: 2, text: '1分あたりの縮まり量 ＝ 速さの差。求め方は「縮まった距離 ÷ 時間」だよ。240 ÷ 12 で出るよ。' },
          { step: 3, text: 'あとは 240 ÷ 12 を計算してみよう！（これが2人の速さの差）' },
        ],
        explanationText: '速さの差 ＝ はじめの差 ÷ 時間 ＝ 240 ÷ 12 ＝ 20m/分。 たしかめ：20×12 ＝ 240m ◎',
      },
      // ──────────────────────────────────
      // ★★ 時間差で出発・往復・池のまわり
      // ──────────────────────────────────
      {
        id: 'tr-06', title: '先に出た人を追いかける', difficulty: 2,
        problemText: '弟が分速60mで家を出発しました。その5分後に、兄が分速90mで同じ道を追いかけます。兄が弟に追いつくのは、兄が出発してから何分後ですか？',
        answer: '10', answerUnit: '分後',
        diagramType: 'arrow',
        diagramSpec: {
          mode: 'chase', aName: '兄', bName: '弟', aEmoji: '🧑', bEmoji: '👦',
          aSpeed: 90, bSpeed: 60, speedUnit: 'm/分',
          gapLabel: '兄が出るときの差', gapText: '60×5＝300m',
          combinedLabel: '速さの差', combinedText: '90－60＝30m/分',
          answerText: '300 ÷ 30 ＝ 10分',
        },
        hints: [
          { step: 1, text: '兄が出発するとき、弟はもう5分歩いている。先行距離を出そう（弟の速さ × 先行時間）。' },
          { step: 2, text: '弟は 60×5＝300m 先。同じ向きだから、兄が縮める速さは 90−60＝30m/分（速さの差）。' },
          { step: 3, text: '300mの差を毎分30mずつちぢめるから、かかる時間 ＝ 差 ÷ 速さの差 ＝ 300 ÷ 30。計算してみよう！' },
        ],
        explanationText: 'まず先行ぶん 60×5＝300m を出す。次に 300 ÷（90－60）＝ 10分。 たしかめ：兄90×10＝900m、弟60×（5＋10）＝900m ◎',
      },
      {
        id: 'tr-07', title: '池のまわりで出会う', difficulty: 2,
        problemText: '1周1200mの池のまわりを、AさんとBさんが同じ場所から反対向きに同時に出発します。Aさんは分速80m、Bさんは分速70mです。2人がはじめて出会うのは何分後ですか？',
        answer: '8', answerUnit: '分後',
        diagramType: 'arrow',
        diagramSpec: {
          mode: 'meet', aName: 'A', bName: 'B', aEmoji: '🚶', bEmoji: '🏃',
          aSpeed: 80, bSpeed: 70, speedUnit: 'm/分',
          gapLabel: '池1周', gapText: '1200m',
          combinedLabel: '速さの和', combinedText: '80＋70＝150m/分',
          answerText: '1200 ÷ 150 ＝ 8分',
        },
        hints: [
          { step: 1, text: '反対向きに進むと、2人が合わせて1周ぶん進んだとき出会う（どちらの分も「縮まる距離」になる）。' },
          { step: 2, text: '1分でAが80m、Bが70m、合わせて 80＋70＝150m 進む（速さの和）。2人で池1周1200mを埋めていくよ。' },
          { step: 3, text: '1200mを毎分150mずつ2人で埋めるから、かかる時間 ＝ 1200 ÷ 150。計算してみよう！' },
        ],
        explanationText: '反対向きの出会いは「速さの和」で1周ぶん。1200 ÷（80＋70）＝ 8分。 たしかめ：80×8＝640m、70×8＝560m、合計1200m＝1周 ◎',
      },
      {
        id: 'tr-08', title: '池のまわりで追いこす', difficulty: 2,
        problemText: '1周1500mの池のまわりを、2人が同じ場所から同じ向きに同時に出発します。速いほうは分速90m、おそいほうは分速60mです。速いほうがおそいほうをはじめて追いこすのは何分後ですか？',
        answer: '50', answerUnit: '分後',
        diagramType: 'arrow',
        diagramSpec: {
          mode: 'chase', aName: '速い', bName: 'おそい', aEmoji: '🏃', bEmoji: '🚶',
          aSpeed: 90, bSpeed: 60, speedUnit: 'm/分',
          gapLabel: '追いこすには池', gapText: '1周1500m',
          combinedLabel: '速さの差', combinedText: '90－60＝30m/分',
          answerText: '1500 ÷ 30 ＝ 50分',
        },
        hints: [
          { step: 1, text: '同じ向きでは「速い方 − 遅い方」だけしか差は縮まらない（速さの差）。追いこすには、相手より池1周ぶん多く進めばいい。' },
          { step: 2, text: '1分で差が 90−60＝30m ひらく（速さの差）。この差が1周ぶん（1500m）になると追いこせる。' },
          { step: 3, text: '1500mの差をつけるのに、毎分30mずつ差がひらくから、かかる時間 ＝ 1500 ÷ 30。計算してみよう！' },
        ],
        explanationText: '同じ向きの追いこしは「速さの差」で1周ぶん。1500 ÷（90－60）＝ 50分。 たしかめ：90×50＝4500m、60×50＝3000m、差は1500m＝ちょうど1周 ◎',
      },
      {
        id: 'tr-09', title: '往復してすれちがう', difficulty: 2,
        problemText: 'A地点とB地点は1000mはなれています。AさんはA地点から分速75m、BさんはB地点から分速125mで、向かい合って同時に出発しました。2人がはじめてすれちがうのは何分後ですか？',
        answer: '5', answerUnit: '分後',
        diagramType: 'arrow',
        diagramSpec: {
          mode: 'meet', aName: 'A', bName: 'B', aEmoji: '🚶', bEmoji: '🚴',
          aSpeed: 75, bSpeed: 125, speedUnit: 'm/分',
          gapLabel: 'A〜B', gapText: '1000m',
          combinedLabel: '速さの和', combinedText: '75＋125＝200m/分',
          answerText: '1000 ÷ 200 ＝ 5分',
        },
        hints: [
          { step: 1, text: '最初のすれちがいは、2人が合わせて1000mちぢめたとき。向かい合いだからAもBも間を縮める → 速さの和で考えよう！' },
          { step: 2, text: '1分でAが75m、Bが125m、合わせて 75＋125＝200m ちぢまる（速さの和）。間は1000m。' },
          { step: 3, text: '1000mを毎分200mずつちぢめるから、かかる時間 ＝ 距離 ÷ 速さ ＝ 1000 ÷ 200。計算してみよう！' },
        ],
        explanationText: '最初のすれちがいは出会い算。1000 ÷（75＋125）＝ 5分。 たしかめ：75×5＝375m、125×5＝625m、合計1000m ◎',
      },
      // ──────────────────────────────────
      // ★★★ ダイヤグラム・時計算の基礎
      // ──────────────────────────────────
      {
        id: 'tr-10', title: 'ダイヤグラムを読む', difficulty: 3,
        problemText: '兄は家を出て9時に駅（家から1800m）に着きました。家を8時45分に出たとすると、兄の歩く速さは分速何mですか？',
        answer: '120', answerUnit: 'm',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: 'ダイヤグラムは「たて＝道のり」「よこ＝時刻」のグラフ。まずかかった時間を出そう（9時 − 8時45分）。' },
          { step: 2, text: '8時45分→9時は15分間。この15分間に1800m進んだ。速さ ＝ 道のり ÷ 時間 の関係を使うよ。' },
          { step: 3, text: '15分間で1800m進んだから、速さ ＝ 道のり÷時間 ＝ 1800÷15。計算してみよう！' },
        ],
        explanationText: 'グラフの「たて1800m・よこ15分」から、速さ ＝ 1800 ÷ 15 ＝ 120m/分。 たしかめ：120×15 ＝ 1800m ◎',
      },
      {
        id: 'tr-11', title: '時計算の基礎（1分の角度差）', difficulty: 3,
        problemText: '時計の長針は1分で6度、短針は1分で0.5度進みます。長針は短針より1分で何度多く進みますか？',
        answer: '5.5', answerUnit: '度',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '時計の針も「速い長針が遅い短針を追いかける」追いつき算！速さが「角度（度/分）」になっただけ。' },
          { step: 2, text: '長針は1分で6度、短針は0.5度ずつ進む。1分で開く角度の差＝速さの差を求めよう。' },
          { step: 3, text: '長針が1分で進む6度 − 短針が1分で進む0.5度 ＝ 1分で何度多く進む？計算してみよう！' },
        ],
        explanationText: '長針と短針の角度の差は1分で 6 － 0.5 ＝ 5.5度。針の追いつき＝追いつき算と同じ考え方。',
      },
      {
        id: 'tr-12', title: '時計算（3時から重なるまで）', difficulty: 3,
        problemText: '時計算では、3時ちょうどのとき長針は短針より90度うしろにいます。長針は1分で短針より5.5度多く進みます。長針が短針に追いつく（重なる）のは3時の何分後ですか？　答えは「□と△/11」の形で、分子（△）の数を答えなさい。',
        answer: '4', answerUnit: '（4/11分）',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '長針は短針より90度うしろ。この90度を「1分で5.5度ちぢむ」速さでうめる追いつき算だよ。' },
          { step: 2, text: '時間 ＝ 90 ÷ 5.5 ＝ 180/11 ＝ 16と4/11（分）。帯分数になおすと整数部と分子が出るね。' },
          { step: 3, text: '90 ÷ 5.5 ＝ 180/11分。これを帯分数になおすと「16と □/11」。180 ÷ 11 の「あまり」が分子（□）だよ。あまりを計算してみよう！' },
        ],
        explanationText: '90 ÷ 5.5 ＝ 180/11 ＝ 16と4/11分。時計算の重なりも追いつき算（速さの差）。',
      },
    ],
  },
  {
    id: 'stream', order: 12, title: '流水算', titleKana: 'りゅうすいざん',
    emoji: '🌊', color: '#38bdf8', layer: 4, prerequisiteIds: ['travelers'],
    isFree: false, coreConcept: '上り＝静水時の速さ−流れ、下り＝静水時の速さ＋流れ。この4つの速さを線分でならべて整理する',
    approachText:
      '流水算のカギは「上り・下り・静水時・流れ」の4つの速さの関係。\n' +
      '・下り ＝ 静水時の速さ ＋ 流れの速さ（流れが背中をおしてくれる）\n' +
      '・上り ＝ 静水時の速さ － 流れの速さ（流れに逆らうので遅くなる）\n' +
      'だから「下り ＋ 上り」の半分が静水時の速さ、「下り − 上り」の半分が流れの速さ（和差算！）。\n' +
      '速さ × 時間 ＝ 道のり でいつも検算しよう。',
    primaryDiagram: 'none',
    problems: [
      // ──────────────────────────────────
      // ★ 上り・下りの速さを求める基本
      // ──────────────────────────────────
      {
        id: 'st-01', title: '下りの速さ（基本）', difficulty: 1,
        problemText: '静水時（しずかな水）での速さが分速80mの船が、流れの速さが分速20mの川を下ります。下るときの船の速さは分速何mですか？',
        answer: '100', answerUnit: 'm',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '川を下るときは、流れが背中をおしてくれるね。だから速くなるよ。' },
          { step: 2, text: '下り ＝ 静水時の速さ ＋ 流れの速さ。80 と 20 をどうする？' },
          { step: 3, text: 'あとは 80 ＋ 20 を計算してみよう！' },
        ],
        explanationText: '下り ＝ 静水時 ＋ 流れ ＝ 80 ＋ 20 ＝ 100m/分。 たしかめ：流れがある分、静水時より20速い ◎',
      },
      {
        id: 'st-02', title: '上りの速さ（基本）', difficulty: 1,
        problemText: '静水時の速さが分速90mの船が、流れの速さが分速30mの川を上ります。上るときの船の速さは分速何mですか？',
        answer: '60', answerUnit: 'm',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '川を上るときは、流れに逆らうから遅くなるよ。' },
          { step: 2, text: '上り ＝ 静水時の速さ － 流れの速さ。90 と 30 をどうする？' },
          { step: 3, text: 'あとは 90 － 30 を計算してみよう！' },
        ],
        explanationText: '上り ＝ 静水時 － 流れ ＝ 90 － 30 ＝ 60m/分。 たしかめ：流れに逆らう分、静水時より30おそい ◎',
      },
      {
        id: 'st-03', title: 'かかる時間を求める', difficulty: 1,
        problemText: '静水時の速さが分速70mの船が、流れの速さ分速10mの川を3000m下ります。何分かかりますか？',
        answer: '37.5', answerUnit: '分',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: 'まず下りの速さを出そう。下り ＝ 静水時 ＋ 流れ だね。' },
          { step: 2, text: '下り ＝ 70 ＋ 10 ＝ 80m/分。あとは 道のり ÷ 速さ ＝ 時間。' },
          { step: 3, text: 'あとは 3000 ÷ 80 を計算してみよう！' },
        ],
        explanationText: '下り ＝ 70 ＋ 10 ＝ 80。時間 ＝ 3000 ÷ 80 ＝ 37.5分。 たしかめ：80 × 37.5 ＝ 3000m ◎',
      },
      {
        id: 'st-04', title: '流れの速さを求める（基本）', difficulty: 1,
        problemText: '静水時の速さが分速100mの船が、ある川を下ると分速130mになりました。この川の流れの速さは分速何mですか？',
        answer: '30', answerUnit: 'm',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '下り ＝ 静水時 ＋ 流れ。下りが静水時より速くなったぶんが「流れ」だよ。' },
          { step: 2, text: '流れ ＝ 下り － 静水時。130 と 100 をどうする？' },
          { step: 3, text: 'あとは 130 － 100 を計算してみよう！' },
        ],
        explanationText: '流れ ＝ 下り － 静水時 ＝ 130 － 100 ＝ 30m/分。 たしかめ：100 ＋ 30 ＝ 130（下り）◎',
      },
      // ──────────────────────────────────
      // ★ 上り・下りから静水・流れを和差算で
      // ──────────────────────────────────
      {
        id: 'st-05', title: '静水時の速さを求める（和差算）', difficulty: 1,
        problemText: 'ある船は、川を下ると分速120m、上ると分速80mでした。この船の静水時の速さは分速何mですか？',
        answer: '100', answerUnit: 'm',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '下り ＝ 静水 ＋ 流れ、上り ＝ 静水 − 流れ。たすと流れが消えるよ！' },
          { step: 2, text: '下り ＋ 上り ＝ （静水 ＋ 流れ）＋（静水 − 流れ）＝ 静水 × 2。だから静水 ＝（下り ＋ 上り）÷ 2。' },
          { step: 3, text: 'あとは （120 ＋ 80）÷ 2 を計算してみよう！' },
        ],
        explanationText: '静水時 ＝（下り ＋ 上り）÷ 2 ＝（120 ＋ 80）÷ 2 ＝ 100m/分。 たしかめ：静水100、流れ20 → 下り120・上り80 ◎',
      },
      {
        id: 'st-06', title: '流れの速さを求める（和差算）', difficulty: 1,
        problemText: 'ある船は、川を下ると分速120m、上ると分速80mでした。この川の流れの速さは分速何mですか？',
        answer: '20', answerUnit: 'm',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '下り ＝ 静水 ＋ 流れ、上り ＝ 静水 − 流れ。今度はひくと静水が消えるよ。' },
          { step: 2, text: '下り − 上り ＝（静水 ＋ 流れ）−（静水 − 流れ）＝ 流れ × 2。だから流れ ＝（下り − 上り）÷ 2。' },
          { step: 3, text: 'あとは （120 － 80）÷ 2 を計算してみよう！' },
        ],
        explanationText: '流れ ＝（下り − 上り）÷ 2 ＝（120 － 80）÷ 2 ＝ 20m/分。 たしかめ：静水100、流れ20 → 下り120・上り80 ◎',
      },
      {
        id: 'st-07', title: '時間から速さ→静水時', difficulty: 2,
        problemText: 'A町とB町は川にそって3600mはなれています。船で下ると30分、上ると45分かかりました。この船の静水時の速さは分速何mですか？',
        answer: '100', answerUnit: 'm',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: 'まず下りと上りの速さを別々に出そう。速さ ＝ 道のり ÷ 時間 だね。' },
          { step: 2, text: '下り ＝ 3600 ÷ 30 ＝ 120m/分、上り ＝ 3600 ÷ 45 ＝ 80m/分。' },
          { step: 3, text: '静水時の速さは「（下り ＋ 上り）÷ 2」。あとは （120 ＋ 80）÷ 2 を計算してみよう！' },
        ],
        explanationText: '下り120・上り80を出してから、静水 ＝（120 ＋ 80）÷ 2 ＝ 100m/分。 たしかめ：流れ＝（120−80）÷2＝20 ◎',
      },
      // ──────────────────────────────────
      // ★★ 往復・平均の速さ
      // ──────────────────────────────────
      {
        id: 'st-08', title: '往復にかかる時間', difficulty: 2,
        problemText: '静水時の速さが分速100mの船が、流れの速さ分速20mの川にそって2400mはなれたA・B間を往復します。往復にかかる時間は合わせて何分ですか？',
        answer: '50', answerUnit: '分',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '行きと帰りで、片方は下り、もう片方は上り。それぞれの速さを出そう。' },
          { step: 2, text: '下り ＝ 100 ＋ 20 ＝ 120、上り ＝ 100 － 20 ＝ 80。時間は別々に出してたすよ。' },
          { step: 3, text: '下りと上りでかかる時間は別べつ。下り＝2400÷120、上り＝2400÷80。それぞれ計算して、たし算しよう！' },
        ],
        explanationText: '下り20分 ＋ 上り30分 ＝ 50分。往復は時間どうしをたす（速さの平均ではない）。',
      },
      {
        id: 'st-09', title: '流れの速さを往復から求める', difficulty: 2,
        problemText: 'ある船が川を1200m下るのに10分、同じ1200mを上るのに15分かかりました。この川の流れの速さは分速何mですか？',
        answer: '20', answerUnit: 'm',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '下りと上りの速さをそれぞれ出そう。速さ ＝ 道のり ÷ 時間。' },
          { step: 2, text: '下り ＝ 1200 ÷ 10 ＝ 120、上り ＝ 1200 ÷ 15 ＝ 80m/分。' },
          { step: 3, text: '流れの速さは「（下り − 上り）÷ 2」。あとは （120 − 80）÷ 2 を計算してみよう！' },
        ],
        explanationText: '下り120・上り80 → 流れ ＝（120 － 80）÷ 2 ＝ 20m/分。 たしかめ：静水＝（120＋80）÷2＝100 ◎',
      },
      // ──────────────────────────────────
      // ★★★ 流れが変わる・エンジンが止まる・2艘
      // ──────────────────────────────────
      {
        id: 'st-10', title: 'とちゅうで流れが速くなる', difficulty: 3,
        problemText: '静水時の速さが分速90mの船が川を下ります。はじめの1200mは流れが分速10m、残りの1200mは流れが分速30mでした。下りきるのに合わせて何分かかりますか？',
        answer: '22', answerUnit: '分',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '流れがちがう2つの区間を、別々に計算してあとでたすよ。どちらも「下り」だね。' },
          { step: 2, text: '前半の下り ＝ 90 ＋ 10 ＝ 100m/分、後半の下り ＝ 90 ＋ 30 ＝ 120m/分。' },
          { step: 3, text: '前半と後半でかかる時間を別べつに出すよ。前半＝1200÷100、後半＝1200÷120。それぞれ計算してたしてみよう！' },
        ],
        explanationText: '前半下り100で12分、後半下り120で10分。合計22分。区間ごとに分けるのがコツ。',
      },
      {
        id: 'st-11', title: 'エンジンが止まって流される', difficulty: 3,
        problemText: '静水時の速さが分速80mの船が、流れの速さ分速20mの川を上っていました。とちゅうでエンジンが3分間止まり、その間は流れに下流へ流されました。エンジンが止まっている3分間で、船は何m下流へ流されますか？',
        answer: '60', answerUnit: 'm',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: 'エンジンが止まると、船は自分では進めない。流れの速さでただ流されるだけだよ。' },
          { step: 2, text: '流れは分速20m。それが3分間つづくと…？' },
          { step: 3, text: 'あとは 20 × 3 を計算してみよう！' },
        ],
        explanationText: 'エンジンが止まると流れの速さ（20m/分）だけで流される。20 × 3 ＝ 60m。 たしかめ：エンジンが動いていれば上っているが、止まると流れだけ＝20m/分 ◎',
      },
      {
        id: 'st-12', title: '2艘の船が出会う', difficulty: 3,
        problemText: '川にそって4500mはなれたA地点（上流）とB地点（下流）から、2艘の船が向かい合って同時に出発します。Aから下る船は分速120m、Bから上る船は分速80mです。2艘が出会うのは何分後ですか？',
        answer: '22.5', answerUnit: '分後',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '向かい合って進むから、ここは旅人算の出会い算と同じ！「速さの和」で近づくよ。' },
          { step: 2, text: '下る船120、上る船80。1分で 120 ＋ 80 ＝ 200m ずつ近づくね。間は4500m。' },
          { step: 3, text: 'あとは 4500 ÷ 200 を計算してみよう！' },
        ],
        explanationText: '流水算でも出会いは「速さの和」。4500 ÷（120 ＋ 80）＝ 22.5分。旅人算とつながる。 たしかめ：120×22.5＝2700m、80×22.5＝1800m、合計4500m ◎',
      },
    ],
  },
  // ─────────────────────────────────────
  // Unit 13: 数の性質（約数・倍数・あまり）
  // ─────────────────────────────────────
  {
    id: 'number-properties', order: 13, title: '数の性質', titleKana: 'かずのせいしつ',
    emoji: '🔢', color: '#10b981', layer: 1, prerequisiteIds: [],
    isFree: true, coreConcept: '約数・倍数・公約数・公倍数・あまりの関係を使って、整数の問題を整理して解く',
    approachText:
      '数の性質では「約数（わり切れる数）」と「倍数（整数倍した数）」が土台になる。\n' +
      '・大きい数の約数は「素数のかけ算（素因数分解）」にすると数えやすい\n' +
      '・約数の個数 ＝（それぞれの素数の個数＋1）のかけ算\n' +
      '・「○でわって△あまる」数は、△を引くと○でわり切れる（公倍数・公約数の考えが使える）\n' +
      'まよったら、小さい数で実際に書き出して規則を見つけよう。',
    primaryDiagram: 'none',
    introSlide: {
      title: '数の性質の考え方（約数・倍数・あまり）',
      explanation: [
        '約数 ＝ その数をわり切れる整数（12なら 1,2,3,4,6,12）',
        '倍数 ＝ その数を整数倍した数（7なら 7,14,21…）',
        '大きい数は「素数のかけ算（素因数分解）」にすると約数を数えやすい',
        '「○でわって△あまる」は、△を引くと○でわり切れる（公倍数・公約数が使える）',
      ],
      diagramSpec: {},
    },
    problems: [
      // ── ★ 約数・倍数・公約数・公倍数の基本 ──
      {
        id: 'nb-01', title: '約数の個数（基本）', difficulty: 1,
        problemText: '12の約数（12をわり切れる整数）を全部見つけると、何個ありますか？',
        answer: '6', answerUnit: '個',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '約数とは「その数をわり切れる整数」のこと。12を1から順にわって、わり切れる数をさがそう。' },
          { step: 2, text: 'かけて12になるペアでさがすともれない。1×12、2×6、3×4 …のように「かけて12」になる組をさがそう。' },
          { step: 3, text: '1×12・2×6・3×4 の3ペアが見つかったね。ペアの数字を全部かぞえてみよう！' },
        ],
        explanationText: '12の約数は 1,2,3,4,6,12 の6個。かけて12になるペア（1と12・2と6・3と4）でもれなく見つかる。 たしかめ：どれも12をわり切る ◎',
      },
      {
        id: 'nb-02', title: '倍数の個数', difficulty: 1,
        problemText: '1から50までの整数のうち、7の倍数は何個ありますか？',
        answer: '7', answerUnit: '個',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '7の倍数は 7, 14, 21 … と7ずつふえる数。50までにいくつあるか数えるよ。' },
          { step: 2, text: '個数は「50 ÷ 7 の商」で出せる。なぜなら7の倍数は7おきにならぶから、50の中に7が何回入るかが個数になる。' },
          { step: 3, text: 'あとは 50 ÷ 7 の商（あまりは気にしない）を考えてみよう！' },
        ],
        explanationText: '50 ÷ 7 ＝ 7あまり1 → 7の倍数は7個（7,14,21,28,35,42,49）。 たしかめ：7×7＝49≦50、7×8＝56>50 ◎',
      },
      {
        id: 'nb-03', title: '最小公倍数', difficulty: 1,
        problemText: '4でも6でもわり切れる数のうち、いちばん小さい数（0をのぞく）はいくつですか？',
        answer: '12', answerUnit: '',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '「4でも6でもわり切れる」＝4の倍数でも6の倍数でもある数（公倍数）。いちばん小さいのが最小公倍数だよ。' },
          { step: 2, text: '4の倍数（4,8,12,16…）と6の倍数（6,12,18…）を書き出すと、両方に出てくる数が公倍数。' },
          { step: 3, text: '両方の倍数を小さい順にならべて、最初にそろう数をさがしてみよう！' },
        ],
        explanationText: '4の倍数 4,8,12…／6の倍数 6,12… → 最小公倍数は12。 たしかめ：12÷4＝3、12÷6＝2 どちらもわり切れる ◎',
      },
      {
        id: 'nb-04', title: '最大公約数', difficulty: 1,
        problemText: '18と24の両方をわり切れる数のうち、いちばん大きい数はいくつですか？',
        answer: '6', answerUnit: '',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '「両方をわり切れる数」＝公約数。そのうちいちばん大きいのが最大公約数だよ。' },
          { step: 2, text: '18の約数（1,2,3,6,9,18）と24の約数（1,2,3,4,6,8,12,24）を書くと、両方に出る数が公約数。' },
          { step: 3, text: '共通の約数のうち、いちばん大きいものをさがしてみよう！' },
        ],
        explanationText: '共通の約数は 1,2,3,6 → 最大公約数は6。 たしかめ：18÷6＝3、24÷6＝4 どちらもわり切れる ◎',
      },
      // ── ★★ 素因数分解・あまりの応用 ──
      {
        id: 'nb-05', title: '約数の個数（素因数分解）', difficulty: 2,
        problemText: '72の約数は全部で何個ありますか？',
        answer: '12', answerUnit: '個',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '大きい数の約数の数は、まず素数のかけ算（素因数分解）にすると速く数えられる。72を素数だけのかけ算にしてみよう。' },
          { step: 2, text: '72 ＝ 2×2×2×3×3 ＝ 2³×3²。約数の個数は、それぞれの素数の「個数＋1」をかけ算で出せる（2は0〜3個の4通り、3は0〜2個の3通り）。' },
          { step: 3, text: 'あとは（3＋1）×（2＋1）を計算してみよう！' },
        ],
        explanationText: '72＝2³×3² → 約数の個数 ＝（3+1）×（2+1）＝12個。 たしかめ：1,2,3,4,6,8,9,12,18,24,36,72 で12個 ◎',
      },
      {
        id: 'nb-06', title: '100にいちばん近い倍数', difficulty: 2,
        problemText: '12の倍数のうち、100にいちばん近い数はいくつですか？',
        answer: '96', answerUnit: '',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: 'まず100が12の何倍くらいか見当をつけよう。100 ÷ 12 を考えると、すぐ下と上の倍数がわかる。' },
          { step: 2, text: '100 ÷ 12 ＝ 8あまり4。だから 12×8 と 12×9 が100をはさむ2つの倍数。どちらが100に近いか差をくらべよう。' },
          { step: 3, text: '12×8 と 12×9 を計算して、100との差が小さいほうを選んでみよう！' },
        ],
        explanationText: '12×8＝96（差4）、12×9＝108（差8）→ 96が近い。 たしかめ：100−96＝4 < 108−100＝8 ◎',
      },
      {
        id: 'nb-07', title: 'あまりが共通（2けた最小）', difficulty: 2,
        problemText: '5でわっても6でわっても3あまる数のうち、いちばん小さい2けたの数はいくつですか？',
        answer: '33', answerUnit: '',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '「5でも6でもわって3あまる」数は、3を引くと5でも6でもわり切れる（公倍数になる）。まず5と6の最小公倍数を考えよう。' },
          { step: 2, text: '5と6の最小公倍数は30。だから「30の倍数＋3」が条件に合う数（3, 33, 63…）。30の倍数は5でも6でもわり切れ、そこに3をたすと必ず3あまるから。' },
          { step: 3, text: '3, 33, 63… のうち、2けたでいちばん小さいものをさがしてみよう！' },
        ],
        explanationText: '30の倍数＋3 → 3,33,63… 2けた最小は33。 たしかめ：33÷5＝6あまり3、33÷6＝5あまり3 ◎',
      },
      {
        id: 'nb-08', title: 'あまりの条件（最小）', difficulty: 2,
        problemText: '2でわると1あまり、3でわると2あまる整数のうち、いちばん小さい数（1より大きい数）はいくつですか？',
        answer: '5', answerUnit: '',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '「2でわって1あまり、3でわって2あまる」…どちらも「あと1たせばわり切れる」ことに注目。1たすと2でも3でもわり切れる数になるね。' },
          { step: 2, text: '1をたすと2でも3でもわり切れる＝6の倍数。だから「6の倍数−1」が答えの形（5, 11, 17…）。' },
          { step: 3, text: '6の倍数（6,12…）から1を引いた数のうち、いちばん小さいものをさがしてみよう！' },
        ],
        explanationText: '1たすと6の倍数 → 6−1＝5。 たしかめ：5÷2＝2あまり1、5÷3＝1あまり2 ◎',
      },
      // ── ★★★ わる数の逆算・範囲・平方数・連続数 ──
      {
        id: 'nb-09', title: 'わる数を逆算（最大）', difficulty: 3,
        problemText: 'ある整数で47をわると2あまり、58をわると3あまります。このような整数のうち、いちばん大きいものはいくつですか？',
        answer: '5', answerUnit: '',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '「47をわると2あまる」＝47から2を引いた45は、その整数でわり切れる。「58をわると3あまる」＝55がわり切れる。あまりを引くのがコツ。' },
          { step: 2, text: '45も55もわり切れる整数＝45と55の公約数。いちばん大きいのは最大公約数。さらに「3あまる」のだから、わる数は3より大きい必要がある。' },
          { step: 3, text: '45と55の最大公約数を求めて、それが3より大きいか確かめてみよう！' },
        ],
        explanationText: '45＝5×9、55＝5×11 → 最大公約数5（3より大きいのでOK）。 たしかめ：47÷5＝9あまり2、58÷5＝11あまり3 ◎',
      },
      {
        id: 'nb-10', title: '範囲の中の公倍数の個数', difficulty: 3,
        problemText: '1から100までの整数のうち、6でも8でもわり切れる数は何個ありますか？',
        answer: '4', answerUnit: '個',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '「6でも8でもわり切れる」＝6と8の公倍数。まず最小公倍数を出そう。' },
          { step: 2, text: '6と8の最小公倍数は24。公倍数は24の倍数（24,48,72…）だから、100までに24が何個入るかを数える。' },
          { step: 3, text: 'あとは 100 ÷ 24 の商を考えてみよう！' },
        ],
        explanationText: '6と8の最小公倍数24 → 24,48,72,96 の4個（100÷24＝4あまり4）。 たしかめ：96≦100、24×5＝120>100 ◎',
      },
      {
        id: 'nb-11', title: '平方数にする', difficulty: 3,
        problemText: '72に整数をかけて、同じ整数を2回かけた数（平方数）にしたいです。かける最小の整数はいくつですか？',
        answer: '2', answerUnit: '',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '平方数は素因数分解すると、どの素数も「偶数個」ずつそろう（例 36＝2²×3²）。まず72を素因数分解しよう。' },
          { step: 2, text: '72＝2³×3²。3は2個（偶数）でOKだが、2は3個（奇数）で1個たりない。たりない2をおぎなえば全部偶数個になる。' },
          { step: 3, text: '2を何個かければ、2が偶数個になるか考えてみよう！' },
        ],
        explanationText: '72＝2³×3²、2が奇数個 → ×2で 2⁴×3²＝144＝12²。最小は2。 たしかめ：72×2＝144＝12×12 ◎',
      },
      {
        id: 'nb-12', title: '連続する整数の和', difficulty: 3,
        problemText: '連続する3つの整数の和が48です。いちばん小さい整数はいくつですか？',
        answer: '15', answerUnit: '',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '連続する3つの整数は「まん中の数」を基準にすると、まん中−1・まん中・まん中＋1。3つの和はまん中の数の何倍になる？' },
          { step: 2, text: '和 ＝（まん中−1）＋まん中＋（まん中＋1）＝ まん中×3。だから まん中 ＝ 48 ÷ 3。' },
          { step: 3, text: 'まん中の数を出したら、それより1小さい数が答え。まず 48 ÷ 3 を計算してみよう！' },
        ],
        explanationText: 'まん中＝48÷3＝16 → 3つは 15,16,17。いちばん小さいのは15。 たしかめ：15＋16＋17＝48 ◎',
      },
    ],
  },
  // ─────────────────────────────────────
  // Unit 14: 規則性（等差数列・周期）
  // ─────────────────────────────────────
  {
    id: 'sequences', order: 14, title: '規則性', titleKana: 'きそくせい',
    emoji: '🔁', color: '#f59e0b', layer: 4, prerequisiteIds: ['tree-planting'],
    isFree: false, coreConcept: '等差数列・周期・図形のならびから「きまり」を見つけ、□番目や和を式で求める',
    approachText:
      '規則性は「どんなきまりでふえる（くり返す）か」を見つけるのが第一歩。\n' +
      '・等差数列（同じ数ずつふえる）：□番目 ＝ 最初 ＋ 差 ×（□−1）\n' +
      '・等差の和 ＝（最初 ＋ 最後）× 個数 ÷ 2（端どうしをペアにすると同じ和）\n' +
      '・周期（くり返し）：□ ÷ 周期 の「あまり」でセットの中の位置がわかる\n' +
      '図形やマッチ棒のならびも「最初の数 ＋ ふえる数 × 回数」で式にできる。',
    primaryDiagram: 'none',
    introSlide: {
      title: '規則性の考え方（等差・周期）',
      explanation: [
        '等差数列：同じ数ずつふえる。□番目 ＝ 最初 ＋ 差 ×（□−1）',
        '等差の和 ＝（最初 ＋ 最後）× 個数 ÷ 2（端どうしのペアは同じ和）',
        '周期：くり返しは「□ ÷ 周期」のあまりで位置がわかる',
        '図形やマッチ棒も「最初の数 ＋ ふえる数 × 回数」で式にできる',
      ],
      diagramSpec: {},
    },
    problems: [
      // ── ★ 等差・周期の基本 ──
      {
        id: 'sq-01', title: '等差数列の□番目', difficulty: 1,
        problemText: '3, 7, 11, 15, … と4ずつふえる数がならんでいます。10番目の数はいくつですか？',
        answer: '39', answerUnit: '',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: 'となりとの差を見ると、いつも4ずつふえているね（等差数列）。1番目から10番目までで、4を何回たすことになる？' },
          { step: 2, text: '1番目から10番目までは「間」が9つ。だから4を9回たす。10番目 ＝ 最初3 ＋ 4×（10−1）。' },
          { step: 3, text: 'あとは 3 ＋ 4×9 を計算してみよう！' },
        ],
        explanationText: '10番目 ＝ 3 ＋ 4×9 ＝ 39。□番目 ＝ 最初＋差×（□−1）。 たしかめ：3,7,11,15,19,23,27,31,35,39 で10番目39 ◎',
      },
      {
        id: 'sq-02', title: '1から10までの和', difficulty: 1,
        problemText: '1から10までの整数を全部たすといくつですか？',
        answer: '55', answerUnit: '',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '1＋2＋…＋10。はしとはしをペアにすると同じ数になるよ（1＋10、2＋9…）。1組はいくつ？' },
          { step: 2, text: '1＋10＝11 のペアが、全部で5組できる（10個÷2）。だから 11×5。端どうしをたすとどのペアも11になるから。' },
          { step: 3, text: 'あとは 11 × 5 を計算してみよう！' },
        ],
        explanationText: '（1＋10）×10÷2 ＝ 11×5 ＝ 55。和 ＝（最初＋最後）×個数÷2。 たしかめ：11×5＝55 ◎',
      },
      {
        id: 'sq-03', title: '周期（□番目）', difficulty: 1,
        problemText: '1, 2, 3, 1, 2, 3, 1, 2, 3, … と3つの数がくり返します。20番目の数はいくつですか？',
        answer: '2', answerUnit: '',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '「1,2,3」の3つで1セットがくり返す（周期3）。20番目が何セット目の何番目かを考えよう。' },
          { step: 2, text: '20 ÷ 3 ＝ 6あまり2。あまりがセットの中の位置を表す。あまり2なら、セットの2番目の数。' },
          { step: 3, text: '20 ÷ 3 のあまりを出して、「1,2,3」のうち何番目かを見てみよう！' },
        ],
        explanationText: '20÷3＝6あまり2 → セットの2番目＝2（あまり0なら最後の3）。 たしかめ：18番目=3,19番目=1,20番目=2 ◎',
      },
      {
        id: 'sq-04', title: '何番目かを逆算', difficulty: 1,
        problemText: '5, 8, 11, 14, … と3ずつふえます。50は何番目の数ですか？',
        answer: '16', answerUnit: '番目',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '3ずつふえる等差数列。50は最初の5から「3を何回たした数」かを考えよう。' },
          { step: 2, text: '50 − 5 ＝ 45 が、3を何回たした分か。45 ÷ 3 ＝ 15回。たした回数より番号は1つ多い（1番目は0回）。' },
          { step: 3, text: '45 ÷ 3 ＝ 15回 とわかったら、それに1をたしてみよう！' },
        ],
        explanationText: '（50−5）÷3＝15回 → 番号は 15＋1＝16番目。 たしかめ：5＋3×15＝50 ◎',
      },
      // ── ★★ 等差の和・周期の和・図形 ──
      {
        id: 'sq-05', title: '等差数列の和', difficulty: 2,
        problemText: '2, 5, 8, … と3ずつふえる数を、29までぜんぶたすといくつですか？',
        answer: '155', answerUnit: '',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: 'まず「2から29まで3おきに何個あるか」を出そう。個数がわからないと和は出せない。' },
          { step: 2, text: '個数 ＝（29−2）÷3＋1 ＝ 10個。和は（最初＋最後）×個数÷2。端どうしをペアにすると同じ和になるから。' },
          { step: 3, text: 'あとは（2＋29）×10÷2 を計算してみよう！' },
        ],
        explanationText: '個数（29−2）÷3＋1＝10。和（2＋29）×10÷2＝31×5＝155。 たしかめ：2,5,…,29 は10個 ◎',
      },
      {
        id: 'sq-06', title: '周期の和', difficulty: 2,
        problemText: '1, 2, 3, 4, 1, 2, 3, 4, … と4つの数がくり返します。1番目から30番目までを全部たすといくつですか？',
        answer: '73', answerUnit: '',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '「1,2,3,4」の1セットの和はいくつ？ そしてセットが何回くり返すかを考えよう（周期4）。' },
          { step: 2, text: '1セットの和 ＝ 1＋2＋3＋4 ＝ 10。30 ÷ 4 ＝ 7あまり2 → 7セット（28個）と、あまり2個（1,2）。' },
          { step: 3, text: '10×7 に、あまりの2個ぶん（1＋2）をたしてみよう！' },
        ],
        explanationText: '1セット和10、30÷4＝7あまり2 → 10×7＋（1＋2）＝70＋3＝73。 たしかめ：28個で70、29番目1・30番目2 ◎',
      },
      {
        id: 'sq-07', title: 'ご石の三角形（まわり）', difficulty: 2,
        problemText: 'ご石を、1辺に5個ならぶ正三角形のふちの形にならべます。ご石は全部で何個いりますか？',
        answer: '12', answerUnit: '個',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '三角形のふちにならべると、かどのご石を2回数えてしまいやすい。まず「1辺5個 × 3辺」を考えてから重なりを直そう。' },
          { step: 2, text: '5×3＝15 だと、3つのかどを2回ずつ数えている。かど3個ぶんを引けばよい。各かどは2つの辺で共有されるから。' },
          { step: 3, text: 'あとは 5×3 − 3 を計算してみよう！' },
        ],
        explanationText: '5×3−3＝12。かど3個の重なりを引く（公式：1辺n個なら 3n−3）。 たしかめ：各辺5個、かど共有で12個 ◎',
      },
      {
        id: 'sq-08', title: 'マッチ棒の正方形', difficulty: 2,
        problemText: 'マッチ棒で正方形を横に1列につなげて作ります。1個目は4本、2個目からは3本ずつ足していきます。正方形を5個作るには何本いりますか？',
        answer: '16', answerUnit: '本',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '最初の1個は4本。2個目からは、となりと1辺を共有するので3本ずつふえるね。何回ふえる？' },
          { step: 2, text: '1個目4本に、3本のふえ方が（5−1）＝4回起きる。だから 4 ＋ 3×4。2〜5個目の4回ふえるから。' },
          { step: 3, text: 'あとは 4 ＋ 3×4 を計算してみよう！' },
        ],
        explanationText: '4＋3×（5−1）＝4＋12＝16本。最初＋ふえる分×（個数−1）。 たしかめ：4,7,10,13,16 で5個目16 ◎',
      },
      // ── ★★★ 逆算・周期の数え・群数列・倍数の和 ──
      {
        id: 'sq-09', title: '等差数列を逆算', difficulty: 3,
        problemText: 'ある等差数列の3番目は11、7番目は27です。1番目の数はいくつですか？',
        answer: '3', answerUnit: '',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '3番目から7番目までで、数は 27−11＝16 ふえた。その間に「差」を何回たした？' },
          { step: 2, text: '3番目から7番目は間が4つ（7−3）。だから 差 ＝ 16 ÷ 4 ＝ 4。1番目は3番目から差を2回もどす（3番目−差×2）。' },
          { step: 3, text: '差4を出したら、11 − 4×2 を計算してみよう！' },
        ],
        explanationText: '差＝（27−11）÷（7−3）＝4。1番目＝11−4×2＝3。 たしかめ：3,7,11,15,19,23,27 で3番目11・7番目27 ◎',
      },
      {
        id: 'sq-10', title: '周期（黒玉の数）', difficulty: 3,
        problemText: '●○○●○○●○○ … と「●○○」の3個をくり返してならべます。1番目から50番目までに、●（黒い玉）は何個ありますか？',
        answer: '17', answerUnit: '個',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '「●○○」の1セットに●は1個。50個が何セットと、あまり何個かを考えよう（周期3）。' },
          { step: 2, text: '50 ÷ 3 ＝ 16あまり2。16セットには●が16個。あまり2個は「●○」だから●がもう1個ある。' },
          { step: 3, text: '16セットぶんの●（16個）に、あまり2個の中の●（先頭の1個）をたしてみよう！' },
        ],
        explanationText: '50÷3＝16あまり2。16セットで16個、あまり「●○」に●1個 → 17個。 たしかめ：48番目までに16個、49番目●で17個 ◎',
      },
      {
        id: 'sq-11', title: '群数列', difficulty: 3,
        problemText: '1, 2, 2, 3, 3, 3, 4, 4, 4, 4, … と「同じ数をその数の個数だけ」ならべます。20番目の数はいくつですか？',
        answer: '6', answerUnit: '',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '「○のグループ」は○が○個。1の終わりは1番目、2の終わりは3番目、3の終わりは6番目…と、各グループの最後の位置に注目しよう。' },
          { step: 2, text: 'グループkの最後は 1＋2＋…＋k ＝ k×(k+1)÷2 番目。5までで15番目、6までで21番目。20はどのグループに入る？' },
          { step: 3, text: '15＜20≦21 だから、20番目はどのグループの数か考えてみよう！' },
        ],
        explanationText: '5グループ終わり15番目、6グループ終わり21番目 → 20番目は6のグループ＝6。 たしかめ：16〜21番目はすべて6 ◎',
      },
      {
        id: 'sq-12', title: '3の倍数の和', difficulty: 3,
        problemText: '1から100までの整数のうち、3でわり切れる数を全部たすといくつですか？',
        answer: '1683', answerUnit: '',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '3でわり切れる数は 3,6,9,…,99 の等差数列。まず100までに3の倍数が何個あるか出そう。' },
          { step: 2, text: '個数 ＝ 100 ÷ 3 の商 ＝ 33個（3×33＝99）。和は（最初3＋最後99）×個数33÷2。' },
          { step: 3, text: 'あとは（3＋99）×33÷2 を計算してみよう！' },
        ],
        explanationText: '3の倍数は33個（3〜99）。和＝（3＋99）×33÷2＝102×33÷2＝1683。 たしかめ：51×33＝1683 ◎',
      },
    ],
  },
  // ─────────────────────────────────────
  // Unit 15: 平面図形（角度・面積）
  // ─────────────────────────────────────
  {
    id: 'plane-figure', order: 15, title: '平面図形', titleKana: 'へいめんずけい',
    emoji: '📐', color: '#8b5cf6', layer: 5, prerequisiteIds: [],
    isFree: false, coreConcept: '角度の和と面積・円周の公式を使い分けて、平面の図形の量を求める',
    approachText:
      '平面図形は「公式」を場面で正しく使い分けるのがポイント。\n' +
      '・三角形の角の和は180°、四角形は360°、□角形は（□−2）×180°\n' +
      '・三角形＝底辺×高さ÷2、平行四辺形＝底辺×高さ、台形＝（上底＋下底）×高さ÷2\n' +
      '・円周＝直径×円周率、円の面積＝半径×半径×円周率\n' +
      '・おうぎ形は円の一部：中心角 ÷ 360 をかける\n' +
      'まず「どの形か」を見て、合う公式を選ぼう。',
    primaryDiagram: 'none',
    introSlide: {
      title: '平面図形の考え方（角度と面積の公式）',
      explanation: [
        '三角形の角の和は180°、四角形は360°、□角形は（□−2）×180°',
        '三角形＝底辺×高さ÷2、平行四辺形＝底辺×高さ、台形＝（上底＋下底）×高さ÷2',
        '円周＝直径×円周率、円の面積＝半径×半径×円周率',
        'おうぎ形は円の一部：中心角 ÷ 360 をかける',
      ],
      diagramSpec: {},
    },
    problems: [
      // ── ★ 角度・基本の面積・円周 ──
      {
        id: 'pf-01', title: '三角形の内角', difficulty: 1,
        problemText: '三角形の3つの角のうち、2つが50°と70°です。残りの1つの角は何度ですか？',
        answer: '60', answerUnit: '度',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '三角形の3つの角を全部たすと、いつも決まった数（180°）になるよ。それを思い出そう。' },
          { step: 2, text: '3つの角の和は180°。わかっている2つの和を180から引けば残りが出る。まず 50＋70 を計算。' },
          { step: 3, text: 'あとは 180 −（50 ＋ 70）を計算してみよう！' },
        ],
        explanationText: '180−（50＋70）＝60°。三角形の内角の和は180°。 たしかめ：50＋70＋60＝180 ◎',
      },
      {
        id: 'pf-02', title: '長方形の面積', difficulty: 1,
        problemText: 'たて6cm、横9cmの長方形の面積は何cm²ですか？',
        answer: '54', answerUnit: 'cm²',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '長方形の面積は「たて × 横」。1cm四方のマスが何個分かを数えるのと同じ意味だよ。' },
          { step: 2, text: 'たて6cm・横9cmだから、6 × 9 で求められる。' },
          { step: 3, text: 'あとは 6 × 9 を計算してみよう！' },
        ],
        explanationText: '6×9＝54cm²。長方形の面積＝たて×横。 たしかめ：1cm²のマスが54個分 ◎',
      },
      {
        id: 'pf-03', title: '三角形の面積', difficulty: 1,
        problemText: '底辺8cm、高さ5cmの三角形の面積は何cm²ですか？',
        answer: '20', answerUnit: 'cm²',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '三角形は、同じものをもう1つ合わせると長方形（平行四辺形）になる。だから面積は長方形の半分だよ。' },
          { step: 2, text: '三角形の面積 ＝ 底辺 × 高さ ÷ 2。8 と 5 をかけて、半分にする。' },
          { step: 3, text: 'あとは 8 × 5 ÷ 2 を計算してみよう！' },
        ],
        explanationText: '8×5÷2＝20cm²。三角形＝底辺×高さ÷2。 たしかめ：長方形40の半分 ◎',
      },
      {
        id: 'pf-04', title: '円のまわりの長さ', difficulty: 1,
        problemText: '半径10cmの円のまわりの長さ（円周）は何cmですか？円周率は3.14とします。',
        answer: '62.8', answerUnit: 'cm',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '円のまわりの長さは「直径 × 円周率」。まず半径から直径を出そう（直径＝半径×2）。' },
          { step: 2, text: '直径 ＝ 10×2 ＝ 20cm。円周 ＝ 直径 × 3.14。' },
          { step: 3, text: 'あとは 20 × 3.14 を計算してみよう！' },
        ],
        explanationText: '直径20×3.14＝62.8cm。円周＝直径×円周率。 たしかめ：20×3.14＝62.8 ◎',
      },
      // ── ★★ 円の面積・多角形・おうぎ形・台形 ──
      {
        id: 'pf-05', title: '円の面積', difficulty: 2,
        problemText: '半径6cmの円の面積は何cm²ですか？円周率は3.14とします。',
        answer: '113.04', answerUnit: 'cm²',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '円の面積は「半径 × 半径 × 円周率」。直径ではなく半径を2回かけることに注意。' },
          { step: 2, text: '半径6を2回かけて 6×6＝36、それに3.14をかける。' },
          { step: 3, text: 'あとは 6 × 6 × 3.14 を計算してみよう！' },
        ],
        explanationText: '6×6×3.14＝36×3.14＝113.04cm²。面積＝半径×半径×円周率。 たしかめ：36×3.14＝113.04 ◎',
      },
      {
        id: 'pf-06', title: '多角形の内角の和', difficulty: 2,
        problemText: '正六角形（6つの角がある図形）の角を全部たすと何度ですか？',
        answer: '720', answerUnit: '度',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: 'どんな多角形も、1つの頂点から対角線を引くと三角形に分けられる。六角形はいくつの三角形に分かれる？' },
          { step: 2, text: '□角形は（□−2）個の三角形に分かれる。六角形は 6−2＝4個。三角形1つは180°。' },
          { step: 3, text: 'あとは 180 ×（6 − 2）を計算してみよう！' },
        ],
        explanationText: '（6−2）×180＝4×180＝720°。多角形の内角の和＝（角の数−2）×180。 たしかめ：4個の三角形 ◎',
      },
      {
        id: 'pf-07', title: '平行四辺形の面積', difficulty: 2,
        problemText: '底辺12cm、高さ7cmの平行四辺形の面積は何cm²ですか？',
        answer: '84', answerUnit: 'cm²',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '平行四辺形は、はしの三角形を切って反対側にうつすと長方形になる。だから面積は長方形と同じ考え方。' },
          { step: 2, text: '平行四辺形の面積 ＝ 底辺 × 高さ（÷2はしない）。12 と 7 をかける。' },
          { step: 3, text: 'あとは 12 × 7 を計算してみよう！' },
        ],
        explanationText: '12×7＝84cm²。平行四辺形＝底辺×高さ。 たしかめ：長方形に直すと12×7 ◎',
      },
      {
        id: 'pf-08', title: 'おうぎ形の面積', difficulty: 2,
        problemText: '半径6cm、中心角90°のおうぎ形の面積は何cm²ですか？円周率は3.14とします。',
        answer: '28.26', answerUnit: 'cm²',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: 'おうぎ形は円の一部。中心角が360°のうち何度分かで、円の何分の1かが決まる。90°は円の何分の1？' },
          { step: 2, text: '90 ÷ 360 ＝ 1/4。だから「円全体の面積 × 1/4」。円の面積は 6×6×3.14。' },
          { step: 3, text: 'あとは 6 × 6 × 3.14 ÷ 4 を計算してみよう！' },
        ],
        explanationText: '6×6×3.14×(90/360)＝113.04÷4＝28.26cm²。円の1/4。 たしかめ：113.04÷4＝28.26 ◎',
      },
      {
        id: 'pf-09', title: '台形の面積', difficulty: 2,
        problemText: '上底4cm、下底10cm、高さ6cmの台形の面積は何cm²ですか？',
        answer: '42', answerUnit: 'cm²',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '台形は、同じ台形をさかさにして合わせると平行四辺形になる。その底辺は「上底＋下底」になるよ。' },
          { step: 2, text: '台形の面積 ＝（上底 ＋ 下底）× 高さ ÷ 2。まず 4＋10 をたす。' },
          { step: 3, text: 'あとは（4 ＋ 10）× 6 ÷ 2 を計算してみよう！' },
        ],
        explanationText: '（4＋10）×6÷2＝14×6÷2＝42cm²。台形＝（上底＋下底）×高さ÷2。 たしかめ：84の半分 ◎',
      },
      // ── ★★★ 二等辺・弧の長さ・複合・外角 ──
      {
        id: 'pf-10', title: '二等辺三角形の底角', difficulty: 3,
        problemText: '二等辺三角形で、頂角（長さの等しい2辺の間の角）が40°です。底角の1つは何度ですか？',
        answer: '70', answerUnit: '度',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '二等辺三角形は2つの底角が等しい。3つの角の和は180°だから、まず頂角をのぞいた「底角2つ分」を出そう。' },
          { step: 2, text: '底角2つの合計 ＝ 180 − 40 ＝ 140°。底角は等しい2つだから、その半分が1つ分。' },
          { step: 3, text: '（180 − 40）を2でわってみよう！' },
        ],
        explanationText: '（180−40）÷2＝70°。底角は等しいので2でわる。 たしかめ：70＋70＋40＝180 ◎',
      },
      {
        id: 'pf-11', title: 'おうぎ形の弧の長さ', difficulty: 3,
        problemText: '半径9cm、中心角120°のおうぎ形の弧（曲がった辺）の長さは何cmですか？円周率は3.14とします。',
        answer: '18.84', answerUnit: 'cm',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '弧は円周の一部。中心角120°は360°のうち何分の1かを考えよう。' },
          { step: 2, text: '120 ÷ 360 ＝ 1/3。だから「円周 × 1/3」。円周は 直径（9×2）× 3.14。' },
          { step: 3, text: 'あとは 9 × 2 × 3.14 ÷ 3 を計算してみよう！' },
        ],
        explanationText: '直径18×3.14×(120/360)＝56.52÷3＝18.84cm。円周の1/3。 たしかめ：56.52÷3＝18.84 ◎',
      },
      {
        id: 'pf-12', title: '正方形から円をのぞく', difficulty: 3,
        problemText: '1辺10cmの正方形の中に、半径5cmの円がぴったり入っています。正方形から円をのぞいた部分の面積は何cm²ですか？円周率は3.14とします。',
        answer: '21.5', answerUnit: 'cm²',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '「のぞいた部分」＝正方形の面積から円の面積を引けばよい。まずそれぞれ別々に出そう。' },
          { step: 2, text: '正方形 ＝ 10×10 ＝ 100、円 ＝ 5×5×3.14 ＝ 78.5。大きいほうから小さいほうを引く。' },
          { step: 3, text: 'あとは 100 − 78.5 を計算してみよう！' },
        ],
        explanationText: '正方形100 − 円78.5 ＝ 21.5cm²。全体から円を引く。 たしかめ：100−78.5＝21.5 ◎',
      },
      {
        id: 'pf-13', title: '三角形の外角', difficulty: 3,
        problemText: '三角形ABCで、頂点Bの外側にできる角（外角）が110°、頂点Cの角が45°です。頂点Aの角は何度ですか？',
        answer: '65', answerUnit: '度',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '三角形の外角は「となりにない2つの内角の和」に等しい（外角の定理）。Bの外角は、AとCの角の和と等しいよ。' },
          { step: 2, text: 'Bの外角110° ＝ ∠A ＋ ∠C。∠Cは45°とわかっているので、110から45を引けば∠A。' },
          { step: 3, text: 'あとは 110 − 45 を計算してみよう！' },
        ],
        explanationText: '外角の定理：∠A＝Bの外角110−∠C45＝65°。 たしかめ：∠B＝180−110＝70、70＋45＋65＝180 ◎',
      },
    ],
  },
  // ─────────────────────────────────────
  // Unit 16: 場合の数（ならべ方・組み合わせ）
  // ─────────────────────────────────────
  {
    id: 'counting', order: 16, title: '場合の数', titleKana: 'ばあいのかず',
    emoji: '🎲', color: '#ec4899', layer: 5, prerequisiteIds: [],
    isFree: false, coreConcept: '順番に決めて「かけ算」し、えらぶだけのときは同じ組のダブりを「÷」で消す',
    approachText:
      '場合の数は「順番に決めて、それぞれの選び方をかけ算する（積の法則）」が基本。\n' +
      '・「ならべる」（順番あり）はかけ算のまま：3×2×1 など\n' +
      '・「えらぶだけ」（順番なし）は同じ組のダブりを「÷」で消す：4×3÷2 など\n' +
      '・0をふくむ数づくりは「先頭に0を置けない」に注意\n' +
      '・「○○できない」場合は〈全部 − ダメな場合〉で数えると速い\n' +
      'まよったら樹形図でかいて、規則を見つけてからかけ算にしよう。',
    primaryDiagram: 'none',
    introSlide: {
      title: '場合の数の考え方（かけ算とダブり消し）',
      explanation: [
        '順番に決めて、それぞれの選び方を「かけ算」する（積の法則）',
        '「ならべる」（順番あり）はかけ算のまま：3×2×1 など',
        '「えらぶだけ」（順番なし）は同じ組のダブりを「÷」で消す：4×3÷2 など',
        '「○○できない」は〈全部 − ダメな場合〉で数えると速い',
      ],
      diagramSpec: {},
    },
    problems: [
      // ── ★ 樹形図・積の法則・基本の組み合わせ ──
      {
        id: 'cn-01', title: '3人のならべ方', difficulty: 1,
        problemText: 'A, B, C の3人を横一列にならべます。ならべ方は何通りですか？',
        answer: '6', answerUnit: '通り',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '1番目に立てる人は何人いる？ それが決まると、2番目・3番目とだんだん選べる人がへっていくよ。' },
          { step: 2, text: '1番目は3人から、次は残り2人、最後は残り1人。それぞれを「かけ算」する（積の法則）。1番目の選び方ごとに枝分かれするから。' },
          { step: 3, text: 'あとは 3 × 2 × 1 を計算してみよう！' },
        ],
        explanationText: '3×2×1＝6通り。樹形図でも ABC,ACB,BAC,BCA,CAB,CBA の6通り。 たしかめ：6通り ◎',
      },
      {
        id: 'cn-02', title: '2けたの数づくり', difficulty: 1,
        problemText: '1, 2, 3 の3まいのカードから2まいえらんで、2けたの整数を作ります。何通りできますか？',
        answer: '6', answerUnit: '通り',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '十の位に置けるのは何通り？ 置いたら、一の位に使えるカードは何まい残る？' },
          { step: 2, text: '十の位は3通り、一の位は残り2まいから2通り。位ごとの選び方をかけ算する。' },
          { step: 3, text: 'あとは 3 × 2 を計算してみよう！' },
        ],
        explanationText: '3×2＝6通り（12,13,21,23,31,32）。位ごとにかけ算。 たしかめ：6通り ◎',
      },
      {
        id: 'cn-03', title: '2人をえらぶ', difficulty: 1,
        problemText: '4人の中から、そうじ係を2人えらびます。えらび方は何通りですか？',
        answer: '6', answerUnit: '通り',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '「ならべる」のではなく「えらぶだけ」だから、AとB・BとAは同じ組だね。まず順番つきで数えて、あとで重なりを直すよ。' },
          { step: 2, text: '順番つきなら 4×3＝12通り。でも2人組は順番を区別しないので、AB・BAのように2回ずつ数えている。だから2でわる。' },
          { step: 3, text: 'あとは 4×3 ÷ 2 を計算してみよう！' },
        ],
        explanationText: '4×3÷2＝6通り。「えらぶだけ」は順番のダブりを÷で消す。 たしかめ：AB,AC,AD,BC,BD,CD の6組 ◎',
      },
      {
        id: 'cn-04', title: '服の組み合わせ', difficulty: 1,
        problemText: 'シャツが3まい、ズボンが2本あります。シャツとズボンの組み合わせは何通りですか？',
        answer: '6', answerUnit: '通り',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: 'シャツ1まいを選ぶごとに、ズボンは何通り選べる？ 枝分かれを考えよう。' },
          { step: 2, text: 'シャツ3まいのどれにも、ズボン2通りが組み合わさる。だから「シャツの数 × ズボンの数」（積の法則）。' },
          { step: 3, text: 'あとは 3 × 2 を計算してみよう！' },
        ],
        explanationText: '3×2＝6通り。それぞれの選び方をかけ算するのが積の法則。 たしかめ：6通り ◎',
      },
      // ── ★★ 順列・0をふくむ数・総当たり・道順 ──
      {
        id: 'cn-05', title: 'リレーの順番', difficulty: 2,
        problemText: '5人の中から、リレーの走者を3人えらんで走る順番も決めます。何通りですか？',
        answer: '60', answerUnit: '通り',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '1走・2走・3走と、順番も決めるよ。1走に選べるのは何人？ 選ぶごとに残りがへる。' },
          { step: 2, text: '1走5人、2走は残り4人、3走は残り3人。順番つきだから、それぞれかけ算する（÷はしない）。' },
          { step: 3, text: 'あとは 5 × 4 × 3 を計算してみよう！' },
        ],
        explanationText: '5×4×3＝60通り。順番を決めるならかけ算のまま（ダブりなし）。 たしかめ：60通り ◎',
      },
      {
        id: 'cn-06', title: '0をふくむ3けた', difficulty: 2,
        problemText: '0, 1, 2, 3 の4まいのカードから3まいえらんで3けたの整数を作ります。何通りできますか？',
        answer: '18', answerUnit: '通り',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: 'ちゅうい！ 百の位に0を置くと3けたにならない（012は12になってしまう）。百の位だけ別あつかいしよう。' },
          { step: 2, text: '百の位は0以外の3通り。十の位は「残り3まい（0をふくむ）」から3通り、一の位は残り2通り。位ごとにかけ算。' },
          { step: 3, text: 'あとは 3 × 3 × 2 を計算してみよう！' },
        ],
        explanationText: '百の位3通り×十の位3通り×一の位2通り＝18通り。0は先頭に置けないのがコツ。 たしかめ：18通り ◎',
      },
      {
        id: 'cn-07', title: '総当たり戦の試合数', difficulty: 2,
        problemText: '6チームが、どのチームとも1回ずつ試合をします（総当たり戦）。試合は全部で何試合ですか？',
        answer: '15', answerUnit: '試合',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '1試合は「2チームの組」。AとBの試合とBとAの試合は同じ1試合だね。まず順番つきで数えてから重なりを直す。' },
          { step: 2, text: '順番つきなら 6×5＝30。でもAB・BAは同じ試合だから2回ずつ数えている。2でわる。' },
          { step: 3, text: 'あとは 6×5 ÷ 2 を計算してみよう！' },
        ],
        explanationText: '6×5÷2＝15試合。「2チームの組み合わせ」を数えるので÷2。 たしかめ：5＋4＋3＋2＋1＝15 ◎',
      },
      {
        id: 'cn-08', title: '碁盤の目の道順', difficulty: 2,
        problemText: '碁盤の目の道を、左下のスタートから右上のゴールまで遠回りせずに行きます。横に3区画、たてに2区画進むとき、行き方は何通りですか？',
        answer: '10', answerUnit: '通り',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '遠回りしないので「右に進む」か「上に進む」だけ。右に3回・上に2回、合わせて5回の進み方の順番を決める問題になる。' },
          { step: 2, text: '5回のうち「どの2回を上にするか」を選べば道順が決まる。これは5個から2個を選ぶ組み合わせ ＝ 5×4÷2。' },
          { step: 3, text: 'あとは 5×4 ÷ 2 を計算してみよう！' },
        ],
        explanationText: '右3・上2の計5回から上2回を選ぶ → 5×4÷2＝10通り。 たしかめ：10通り ◎',
      },
      // ── ★★★ 組み合わせの積・偶数づくり・色ぬり・通れない点 ──
      {
        id: 'cn-09', title: '男女をえらぶ', difficulty: 3,
        problemText: '男子4人、女子3人の中から、男子2人と女子1人をえらんで委員にします。何通りのえらび方がありますか？',
        answer: '18', answerUnit: '通り',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '男子のえらび方と女子のえらび方は別々に数えて、最後にかけ算する（それぞれ独立に選べるから）。まず男子から。' },
          { step: 2, text: '男子2人の選び方 ＝ 4×3÷2 ＝ 6通り。女子1人 ＝ 3通り。男子の選び方ごとに女子3通りが組み合わさる。' },
          { step: 3, text: '男子6通り、女子3通りとわかったら、6 × 3 を計算してみよう！' },
        ],
        explanationText: '男子4×3÷2＝6通り、女子3通り → 6×3＝18通り。別々に数えてかけ算。 たしかめ：18通り ◎',
      },
      {
        id: 'cn-10', title: '偶数を作る', difficulty: 3,
        problemText: '1, 2, 3, 4, 5 の5まいのカードから3まいえらんで3けたの整数を作ります。偶数は何通りできますか？',
        answer: '24', answerUnit: '通り',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '偶数になるかどうかは「一の位」で決まる（一の位が偶数なら偶数）。だから一の位から先に決めるのがコツ。' },
          { step: 2, text: '一の位は2か4の2通り。残り4まいから百の位4通り・十の位3通り。一の位の決め方ごとに百十がかけ算される。' },
          { step: 3, text: '一の位2通り、百の位4通り、十の位3通りをかけ算してみよう！' },
        ],
        explanationText: '一の位2通り×百の位4通り×十の位3通り＝2×12＝24通り。偶数は一の位から決める。 たしかめ：24通り ◎',
      },
      {
        id: 'cn-11', title: '色のぬり分け', difficulty: 3,
        problemText: '横に3つならんだマスを、赤・青・黄の3色でぬります。となり合うマスは色をかえるとき、ぬり方は何通りですか？',
        answer: '12', answerUnit: '通り',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: '左のマスから順に決めよう。1つ目は自由に3色。2つ目は「1つ目とちがう色」だから何通りになる？' },
          { step: 2, text: '1つ目3通り、2つ目は左とちがう2通り、3つ目は「まん中とちがう」2通り（左はしと同じでもOK）。順に決めてかけ算。' },
          { step: 3, text: 'あとは 3 × 2 × 2 を計算してみよう！' },
        ],
        explanationText: '3×2×2＝12通り。3つ目は「まん中とだけ」ちがえばよい（左はしと同じでもよい）。 たしかめ：12通り ◎',
      },
      {
        id: 'cn-12', title: '通れない交差点がある道順', difficulty: 3,
        problemText: '碁盤の目の道を、左下から右上まで遠回りせずに行きます。横2区画・たて2区画の道で、ちょうどまん中の交差点が工事で通れません。行き方は何通りですか？',
        answer: '2', answerUnit: '通り',
        diagramType: 'none', diagramSpec: {},
        hints: [
          { step: 1, text: 'まず工事がない場合の全部の行き方を出し、そこから「まん中を通る行き方」を引くと、通れない場合が出る。' },
          { step: 2, text: '全部は 右2・上2の4回から上2回を選ぶ ＝ 4×3÷2 ＝ 6通り。まん中を通る道は「スタート→まん中」×「まん中→ゴール」＝2×2＝4通り。' },
          { step: 3, text: '全部6通りから、まん中を通る4通りを引いてみよう！' },
        ],
        explanationText: '全6通り − まん中経由4通り ＝ 2通り。「全部 − ダメな場合」で数える。 たしかめ：まん中を通らない道は2本 ◎',
      },
    ],
  },
]
