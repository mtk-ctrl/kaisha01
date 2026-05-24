export type DiagramType = 'slide' | 'dot-line' | 'area' | 'line-seg' | 'arrow' | 'none'
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
  layer: 1 | 2 | 3 | 4
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
          { step: 3, text: '3 × 1000 ＝ 3000m！目盛りが右に動くと数字が大きくなるのを覚えよう。' },
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
          { step: 3, text: '5000 ÷ 1000 ＝ 5kg！目盛りが左に動くと数字が小さくなるよ。' },
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
          { step: 3, text: '2 × 1000 ＝ 2000mL！牛乳パック2本分だよ。' },
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
          { step: 3, text: '4.5 × 10 ＝ 45mm！小数点が右に1つ動いて整数になるよ。' },
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
          { step: 3, text: '7500 ÷ 1000 ＝ 7.5km！運動会のマラソンコースみたいな距離だね。' },
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
          { step: 3, text: '1000m ＋ 200m ＝ 1200m！単位をmに揃えてから足し算するのがコツ。' },
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
          { step: 3, text: '2300g ＋ 800g ＝ 3100g！単位をgに統一してから足し算。' },
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
          { step: 3, text: '500 × 4 ＝ 2000mL。3000 − 2000 ＝ 1000mL！' },
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
          { step: 3, text: '2 × 100 ＝ 200a！面積のスライド図は2マスずつずれるよ。' },
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
          { step: 3, text: '180 ＋ 45 ＝ 225分！時間の単位は×60を使おう。' },
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
          { step: 3, text: '2500 × 100 ＝ 250000cm！または最初から×100000（5マス右）でもOK。' },
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
          { step: 3, text: '4800 ÷ 1000 ＝ 4.8km！単位変換と距離計算の合わせ技だよ。' },
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
          { step: 3, text: '1000000 ÷ 1000 ＝ 1000L！1m³ ＝ 1000Lと覚えよう。' },
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
          { step: 3, text: '2400 − 1800 ＝ 600m！CはBよりA寄りにあることもイメージしよう。' },
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
          { step: 3, text: 'スキマ10個 ＋ 左はしの木1本 ＝ 11本！両端ありのときは「スキマ＋1」が答えだよ。' },
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
          { step: 3, text: '30m ÷ 6スキマ ＝ 5m！「スキマ数 ＝ 木の数 − 1」を使おう。' },
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
          { step: 3, text: 'スキマ8個の「あいだ」に旗がある → 旗 ＝ スキマ − 1 ＝ 7枚！両端なしは「スキマ−1」が旗の数。' },
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
          { step: 3, text: '8 × 4m ＝ 32m！「木の数−1」でスキマ数、×間隔で全長。' },
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
          { step: 2, text: 'かどの木は4本あって、それぞれ2回数えられてる。20 − 4 ＝ 16本。' },
          { step: 3, text: '正方形のまわりの木：（1辺の本数 − 1）× 4 ＝（5−1）× 4 ＝ 16本！' },
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
          { step: 3, text: 'スキマ6個、左の電柱1本。でも右はしには立てないから、電柱数 ＝ スキマ数 ＝ 6本！' },
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
          { step: 3, text: '240 ÷ 16 ＝ 15m！円形は旗数とスキマ数が同じだから計算が簡単。' },
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
          { step: 3, text: '50 ÷ 6 は割り切れないな…問題を再読。あ、「何m短くなる」だった。10 − (50÷6)ではなく、スキマ数の変化で考えよう。実は50÷5＝10、50÷6≈8.33、差≈1.67m。' },
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
          { step: 3, text: '1辺 ＝ 5＋1 ＝ 6本！逆算は「全体÷4して、+1」。' },
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
          { step: 3, text: '24本必要。今12本ある。追加 ＝ 24−12 ＝ 12本！全部の旗が5mおきの位置に重なるので引くだけ。' },
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
          { step: 2, text: '中は5×5＝25個。まわり ＝ 全体 − 中 ＝ 49 − 25 ＝ 24個。' },
          { step: 3, text: '24個！または（1辺−1）×4 ＝（7−1）×4 ＝ 24 で直接求めてもOK。' },
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
          { step: 3, text: '30 × 9m ＝ 270m！円形はスキマ＝木の数だから逆算が簡単。' },
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
          { step: 3, text: 'スキマ18 ＋ 1 ＝ 19本！小数が出ても考え方は同じだよ。' },
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
          { step: 3, text: '小さい方＝8。大きい方＝8＋4＝12。確かめ：8＋12＝20◎、12－8＝4◎' },
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
          { step: 1, text: '兄が多いので線分図では兄が長い線。弟を短い線で書いて、兄は弟より6個分長くなるよ。' },
          { step: 2, text: '弟を2本並べると：28－6＝22個分。弟は22÷2＝11個だよ。' },
          { step: 3, text: '弟＝11個。確かめ：兄＝11＋6＝17個、17＋11＝28◎' },
        ],
        explanationText: '小さい方（弟）＝(和－差)÷2＝(28－6)÷2＝11個。',
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
          { step: 3, text: '短い方＝20cm。長い方＝20＋20＝40cm。または(60＋20)÷2＝40cm！' },
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
          { step: 1, text: 'みかんが多いのでみかんが長い線。「和30・差4」を線分図に書き込もう。' },
          { step: 2, text: 'りんごを2本並べると：30－4＝26個。りんごは26÷2＝13個だよ。' },
          { step: 3, text: 'りんご＝13個。確かめ：みかん＝13＋4＝17個、17＋13＝30◎' },
        ],
        explanationText: '小さい方（りんご）＝(30－4)÷2＝13個。みかん＝13＋4＝17個。',
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
          { step: 1, text: '1組が多いので1組が長い線。和69・差5で線分図を書いてみよう。' },
          { step: 2, text: '2組を2本並べると：69－5＝64人。2組は64÷2＝32人だよ。' },
          { step: 3, text: '2組＝32人。確かめ：1組＝32＋5＝37人、37＋32＝69◎' },
        ],
        explanationText: '小さい方（2組）＝(69－5)÷2＝32人。',
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
          { step: 2, text: 'はなこを2本並べると：5000－600＝4400円。はなこは4400÷2＝2200円。' },
          { step: 3, text: 'はなこ＝2200円。確かめ：たろう＝2200＋600＝2800円、2800＋2200＝5000◎' },
        ],
        explanationText: '小さい方（はなこ）＝(5000－600)÷2＝2200円。',
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
          { step: 3, text: '面積＝縦×横＝8×16＝128cm²！和差算で辺の長さを求めてから掛け算するよ。' },
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
        diagramType: 'line-seg',
        diagramSpec: {
          sum: 180, diff: null,
          largeLabel: 'A', smallLabel: 'C',
          labels3: ['A', 'B', 'C'],
          diffs3: [18, 6, 0],
        },
        hints: [
          { step: 1, text: 'CをいちばんCを基準（短い線）にしよう。B＝C＋6点、A＝C＋6＋12＝C＋18点。' },
          { step: 2, text: '3人の合計：C＋(C＋6)＋(C＋18)＝3×C＋24＝180。3×C＝156。' },
          { step: 3, text: 'C＝156÷3＝52点！確かめ：B＝58、A＝70、合計70＋58＋52＝180◎' },
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
          { step: 3, text: '青＝62－(赤＋黄)＝62－41＝21個！「3つ全部の合計」から2つの合計を引くのがコツ。' },
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
          { step: 3, text: '38－30＝3×□－□ → 8＝2×□ → □＝4年後！確かめ：父42歳＝子14歳×3◎' },
        ],
        explanationText: '38＋□＝3(10＋□) → 8＝2□ → 4年後。父42歳＝子14歳×3。',
      },
    ],
  },
  {
    id: 'crane-turtle', order: 4, title: '鶴亀算', titleKana: 'つるかめさん',
    emoji: '🐢', color: '#00e5c3', layer: 2, prerequisiteIds: ['sum-diff'],
    isFree: false, coreConcept: '「もし全部〇〇なら」という仮定で差を蓄積する',
    approachText: '面積図3ステップで整理する。',
    primaryDiagram: 'area', problems: [],
  },
  {
    id: 'excess-deficit', order: 5, title: '差集め算・過不足算', titleKana: 'さあつめざん・かふそくざん',
    emoji: '📦', color: '#f87171', layer: 2, prerequisiteIds: ['crane-turtle'],
    isFree: false, coreConcept: '1人あたりの差が全体の余り・不足を生む',
    approachText: '配るイメージの線分図で視覚的に理解する。',
    primaryDiagram: 'line-seg', problems: [],
  },
  {
    id: 'equivalent', order: 6, title: '相当算', titleKana: 'そうとうざん',
    emoji: '🎯', color: '#c4a8ff', layer: 3, prerequisiteIds: ['excess-deficit'],
    isFree: false, coreConcept: '「全体の何分のいくつか」が具体的な数量と対応する',
    approachText: '全体を①とおいた線分図で逆算する。',
    primaryDiagram: 'line-seg', problems: [],
  },
  {
    id: 'ratio-basics', order: 7, title: '割合と比の基礎', titleKana: 'わりあいとひのきそ',
    emoji: '📊', color: '#6366f1', layer: 3, prerequisiteIds: ['equivalent'],
    isFree: false, coreConcept: '実際の数量（単位あり）と比の数字（丸数字）を区別する',
    approachText: '比の数字には必ず①のような丸数字を使う。',
    primaryDiagram: 'line-seg', problems: [],
  },
  {
    id: 'concentration', order: 8, title: '濃度算（食塩水）', titleKana: 'のうどざん',
    emoji: '🧪', color: '#0ea5e9', layer: 3, prerequisiteIds: ['ratio-basics'],
    isFree: false, coreConcept: '食塩水×濃度＝塩の重さ を面積図で可視化する',
    approachText: '鶴亀算と同じ面積図の発想を使う。',
    primaryDiagram: 'area', problems: [],
  },
  {
    id: 'profit-loss', order: 9, title: '損益算', titleKana: 'そんえきざん',
    emoji: '💰', color: '#f59e0b', layer: 3, prerequisiteIds: ['ratio-basics'],
    isFree: false, coreConcept: '原価・定価・売価・利益の流れを線分図で整理する',
    approachText: '一本道の線分図でお金の流れを追う。',
    primaryDiagram: 'line-seg', problems: [],
  },
  {
    id: 'work-newton', order: 10, title: '仕事算・ニュートン算', titleKana: 'しごとざん・にゅーとんざん',
    emoji: '⚙️', color: '#64748b', layer: 4, prerequisiteIds: ['ratio-basics'],
    isFree: false, coreConcept: '全体の仕事量を①とおき、1日あたりの処理量を比で表す',
    approachText: '矢印図で「増える要素」と「減る要素」を可視化する。',
    primaryDiagram: 'arrow', problems: [],
  },
  {
    id: 'travelers', order: 11, title: '旅人算', titleKana: 'たびびとざん',
    emoji: '🚶', color: '#fb923c', layer: 4, prerequisiteIds: ['work-newton'],
    isFree: false, coreConcept: '2つの動くものの距離の縮まり方・離れ方を時間で捉える',
    approachText: '「出会い＝速さの和」「追いつき＝速さの差」を矢印図で理解する。',
    primaryDiagram: 'arrow', problems: [],
  },
  {
    id: 'stream', order: 12, title: '流水算', titleKana: 'りゅうすいざん',
    emoji: '🌊', color: '#38bdf8', layer: 4, prerequisiteIds: ['travelers'],
    isFree: false, coreConcept: '静水速度に川の流れが加算・減算される関係を線分図で整理する',
    approachText: '上り・静水・下り・川の流れの4速度を線分図で並べる。',
    primaryDiagram: 'arrow', problems: [],
  },
]
