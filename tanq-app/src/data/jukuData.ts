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
        diagramType: 'none',
        diagramSpec: {
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
          { step: 2, text: '鶴を1匹亀に替えると足が4－2＝2本増える。4÷2＝2匹が亀だ！' },
          { step: 3, text: '亀2匹、鶴3羽。確かめ：4×2＋2×3＝8＋6＝14本 ✓' },
        ],
        explanationText: '全部鶴なら10本。差4本÷2＝亀2匹。鶴は5－2＝3羽。',
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
          { step: 2, text: '10円を50円に替えると1枚あたり40円増える。160÷40＝4枚が50円玉！' },
          { step: 3, text: '50円玉4枚、10円玉4枚。確かめ：50×4＋10×4＝200＋40＝240円 ✓' },
        ],
        explanationText: '全部10円なら80円。差160円÷40＝50円玉4枚。',
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
          { step: 2, text: '自転車を1台三輪車に替えると車輪が1個増える。3÷1＝3台が三輪車！' },
          { step: 3, text: '三輪車3台、自転車3台。確かめ：3×3＋2×3＝9＋6＝15個 ✓' },
        ],
        explanationText: '全部自転車なら12個。差3個÷1＝三輪車3台。',
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
          { step: 2, text: '1羽を亀に替えると2本増える。8÷2＝4匹が亀。だから鶴＝10－4＝6羽！' },
          { step: 3, text: '鶴6羽、亀4匹。確かめ：2×6＋4×4＝12＋16＝28本 ✓' },
        ],
        explanationText: '亀を先に求める。差8÷2＝亀4匹。鶴は10－4＝6羽。',
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
          { step: 2, text: '子ども1人を大人に替えると100円増える。700÷100＝7人が大人！' },
          { step: 3, text: '大人7人、子ども5人。確かめ：300×7＋200×5＝2100＋1000＝3100円 ✓' },
        ],
        explanationText: '全員子どもなら2400円。差700÷100＝大人7人。',
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
          { step: 2, text: '50円を100円に替えると1枚50円増える。200÷50＝4枚が100円玉！' },
          { step: 3, text: '100円玉4枚、50円玉6枚。確かめ：100×4＋50×6＝400＋300＝700円 ✓' },
        ],
        explanationText: '全部50円なら500円。差200÷50＝100円玉4枚。',
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
          { step: 2, text: '1匹をクモに替えると2本増える。8÷2＝4匹がクモ！' },
          { step: 3, text: 'クモ4匹、テントウムシ3匹。確かめ：8×4＋6×3＝32＋18＝50本 ✓' },
        ],
        explanationText: '全部テントウムシなら42本。差8÷2＝クモ4匹。',
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
          { step: 2, text: '1羽を亀に替えると2本増える。6÷2＝3匹が亀。鶴は8－3＝5羽！' },
          { step: 3, text: '鶴5羽、亀3匹。確かめ：2×5＋4×3＝10＋12＝22本 ✓' },
        ],
        explanationText: '差6÷2＝亀3匹。鶴は8－3＝5羽。',
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
          { step: 2, text: 'えんぴつ1本をノートに替えると80－30＝50円増える。300÷50＝6冊がノート！' },
          { step: 3, text: 'ノート6冊、えんぴつ4本。確かめ：80×6＋30×4＝480＋120＝600円 ✓' },
        ],
        explanationText: '全部えんぴつなら300円。差300÷50＝ノート6冊。',
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
          { step: 2, text: '亀2匹、鶴5羽。合計2＋5＝7匹。金魚＝9－7＝2匹！' },
          { step: 3, text: '確かめ：鶴5＋亀2＋金魚2＝9匹、足2×5＋4×2＝10＋8＝18本 ✓' },
        ],
        explanationText: '亀をxとおくと鶴＝x＋3。足の式 6x＋6＝18 → x＝2。金魚＝9－7＝2匹。',
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
          { step: 3, text: '12個 ÷ 2個（1人あたりの差）＝ 6人！確かめ：4×6＋8＝32個、6×6－32＝4個たりない◎' },
        ],
        explanationText: '全体の差＝あまり8＋不足4＝12個。これを1人あたりの差2個で割って、12÷2＝6人。',
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
          { step: 3, text: '14枚 ÷ 2枚 ＝ 7人！確かめ：5×7＋4＝39枚、7×7＝49枚で49－39＝10枚たりない◎' },
        ],
        explanationText: '全体の差＝4＋10＝14枚。1人あたりの差2枚で割って14÷2＝7人。',
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
          { step: 3, text: '15個 ÷ 3個 ＝ 5人！確かめ：4×5＋17＝37個、7×5＋2＝37個◎ どちらもあめは37個。' },
        ],
        explanationText: '両方あまるときは、全体の差＝大きいあまり－小さいあまり＝17－2＝15個。15÷3＝5人。',
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
          { step: 3, text: '8本 ÷ 1本 ＝ 8人！確かめ：5×8－2＝38本、6×8－10＝38本◎ どちらもえんぴつは38本。' },
        ],
        explanationText: '両方たりないときは、全体の差＝大きい不足－小さい不足＝10－2＝8本。8÷1＝8人。',
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
          { step: 3, text: '12人 ÷ 2人 ＝ 6脚！確かめ：人数は4×6＋12＝36人、6×6＝36人でちょうど◎' },
        ],
        explanationText: '1脚あたり2人の差が脚数だけ集まって12人の差に。12÷2＝6脚（人数は36人）。',
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
          { step: 3, text: '21人 ÷ 3人 ＝ 7脚！確かめ：人数は4×7＋18＝46人、7×7－3＝46人◎' },
        ],
        explanationText: '「座れない人」と「あまる席」を足すと全体の差21人。1脚あたり3人で割って7脚。',
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
          { step: 3, text: '5本ずつ配って3本あまるから、5×6＋3＝33本！（7×6－9＝33本でも確かめられる◎）' },
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
          { step: 3, text: '450円 ÷ 30円 ＝ 15個！確かめ：80×15＝1200円、50×15＝750円、差は450円◎' },
        ],
        explanationText: '1個あたりの差30円が個数分集まって450円。450÷30＝15個。これが差集め算の基本形。',
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
          { step: 3, text: '360円 ÷ 30円 ＝ 12冊！確かめ：持っているお金は90×12＋220＝1300円、120×12＝1440円で140円たりない◎' },
        ],
        explanationText: '全体の差＝140＋220＝360円。1冊あたりの差30円で割って360÷30＝12冊（予算は1300円）。',
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
          { step: 3, text: '16個 ÷ 2個 ＝ 8人！確かめ：あめは4×8＋12＝44個、6×8＝48個で48－44＝4個たりない（最後の子が4個少ない）◎' },
        ],
        explanationText: '最後の1人が2個＝不足4個と読みかえる。全体の差＝12＋4＝16。16÷2＝8人。',
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
          { step: 3, text: '14枚 ÷ 1枚 ＝ 14人！確かめ：画用紙は5×14＋12＝82枚、6×14＝84枚で2枚たりない◎' },
        ],
        explanationText: '最後の1人が4枚＝不足2枚。全体の差＝12＋2＝14枚。1人あたりの差1枚で割って14人。',
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
          { step: 3, text: '300円 ÷ 20円 ＝ 15個（りんごの数）！確かめ：70×15＝1050円、1050÷50＝21個＝15＋6◎' },
        ],
        explanationText: '1個あたり20円うき、その合計＝多く買えた6個分の代金300円。300÷20＝15個。',
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
          { step: 3, text: '22人 ÷ 2人 ＝ 11室！確かめ：人数は5×11＋8＝63人、使う部屋は11－2＝9室で7×9＝63人◎' },
        ],
        explanationText: 'あまる2部屋は7×2＝14人分の席。全体の差＝8＋14＝22人。1部屋あたり2人で割って11室。',
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
          { step: 3, text: '①は5区画だから 20 × 5 ＝ 100。確かめ：100 × 3/5 ＝ 60 ◎' },
        ],
        explanationText: '①にあたる量 ＝ 60 ÷ 3 × 5 ＝ 100。3/5 が 60 なら全体は 100。',
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
          { step: 3, text: '全体は7区画だから 7 × 7 ＝ 49cm。' },
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
          { step: 3, text: '全体は9区画だから 4 × 9 ＝ 36人。男子は4×4＝16人、16＋20＝36◎' },
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
          { step: 3, text: '満水は4区画だから 18 × 4 ＝ 72L。' },
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
          { step: 3, text: 'はじめは8区画だから 10 × 8 ＝ 80円。確かめ：80×3/8＝30使い、のこり50◎' },
        ],
        explanationText: 'のこりの割合 5/8 を作る。①にあたる量 ＝ 50 ÷ 5 × 8 ＝ 80円。',
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
          { step: 3, text: '全体は5区画だから 12 × 5 ＝ 60ページ。' },
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
          { step: 3, text: 'はじめは9区画だから 7 × 9 ＝ 63cm。' },
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
          { step: 3, text: '全体は7区画だから 6 × 7 ＝ 42人。男子24・女子18で差6◎' },
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
          { step: 3, text: '全体の 1/3 が 20 円だから、はじめは 20 ÷ 1 × 3 ＝ 60円。確かめ：60→30使い残30→10使い残20◎' },
        ],
        explanationText: '最後ののこりは全体の 1/2×2/3 ＝ 1/3。20 ÷ 1/3 ＝ 60円。',
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
          { step: 3, text: '全体の 9/20 が 18 個だから 18 ÷ 9 × 20 ＝ 40個。確かめ：40→16配り残24→6配り残18◎' },
        ],
        explanationText: '最後ののこりは全体の 3/5×3/4 ＝ 9/20。18 ÷ 9/20 ＝ 40個。',
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
          { step: 3, text: '全体の 2/5 が 36 ページだから 36 ÷ 2 × 5 ＝ 90ページ。確かめ：90→30読み残60→24読み残36◎' },
        ],
        explanationText: '最後ののこりは全体の 2/3×3/5 ＝ 2/5。36 ÷ 2/5 ＝ 90ページ。',
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
          { step: 3, text: '全体の 1/4 が 150 円だから 150 × 4 ＝ 600円。確かめ：600→150使い残450→300使い残150◎' },
        ],
        explanationText: '最後ののこりは全体の 3/4×1/3 ＝ 1/4。150 ÷ 1/4 ＝ 600円。',
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
          { step: 3, text: '全体の 3/8 が 30 こだから 30 ÷ 3 × 8 ＝ 80こ。確かめ：80→30終え残50→20終え残30◎' },
        ],
        explanationText: '最後ののこりは全体の 5/8×3/5 ＝ 3/8。30 ÷ 3/8 ＝ 80こ。',
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
          { step: 3, text: '20 × 0.3 ＝ 6人。' },
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
          { step: 3, text: '12 ÷ 0.4 ＝ 30。確かめ：30 × 0.4 ＝ 12 ◎' },
        ],
        explanationText: 'もとにする量 ＝ くらべる量 ÷ 割合 ＝ 12 ÷ 0.4 ＝ 30。',
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
          { step: 1, text: '「20 の何%」なので、もとにする量は 20 だよ。' },
          { step: 2, text: '割合 ＝ くらべる量 ÷ もと ＝ 15 ÷ 20。' },
          { step: 3, text: '15 ÷ 20 ＝ 0.75。百分率にすると 75%。' },
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
          { step: 1, text: '小数を百分率にするには 100 をかけるよ。0.25 × 100 ＝ 25%。' },
          { step: 2, text: '歩合は、小数第1位が「割」、第2位が「分」、第3位が「厘」。' },
          { step: 3, text: '0.25 → 2割5分。だから 25%・2割5分。' },
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
          { step: 3, text: '12÷6 ＝ 2、18÷6 ＝ 3。だから 2 : 3。' },
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
          { step: 3, text: '2 : 3 の比の値は 2 ÷ 3 ＝ 2/3。' },
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
          { step: 3, text: '兄は比の 3 ぶんだから 4 × 3 ＝ 12個。' },
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
          { step: 3, text: '少ない方は比の 2 ぶんだから 600 × 2 ＝ 1200円。' },
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
          { step: 3, text: 'いちばん多いのは比の 3 ぶんだから 4 × 3 ＝ 12個。' },
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
          { step: 3, text: 'B が 12 でそろったので A:B:C ＝ 8 : 12 : 15。' },
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
          { step: 3, text: '兄は比の 5 ぶんだから 200 × 5 ＝ 1000円。確かめ：弟600、差400 ◎' },
        ],
        explanationText: '比の差 2 が 400円 → ①あたり 200円。兄 ＝ 200 × 5 ＝ 1000円。',
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
          { step: 3, text: '姉は比の 4 ぶんだから 5 × 4 ＝ 20才。確かめ：妹15、和35 ◎' },
        ],
        explanationText: '比の和 7 が 35才 → ①あたり 5才。姉 ＝ 5 × 4 ＝ 20才。',
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
          { step: 3, text: 'A の比 3 が 18 だから ①あたり ＝ 18 ÷ 3 ＝ 6。C ＝ 10 × 6 ＝ 60。' },
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
          { step: 3, text: '600 × 1.25 ＝ 600 + 600×0.25 ＝ 600 + 150 ＝ 750円！' },
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
          { step: 3, text: '1500 × 0.8 ＝ 1200円。2割引き＝8掛けと覚えよう！' },
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
          { step: 3, text: '1050 − 800 ＝ 250円の利益！' },
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
          { step: 3, text: '700 + 280 ＝ 980円！' },
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
          { step: 3, text: '売価468円 − 原価400円 ＝ 68円の利益！定価で売らなくても利益は出るよ。' },
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
          { step: 3, text: '2520 ÷ 0.8 ＝ 3150円！「×0.8した後」から戻すには「÷0.8」だよ。' },
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
          { step: 3, text: '利益 ＝ 117 − 100 ＝ 17円。原価100円に対して17円だから、利益率は17%！' },
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
          { step: 3, text: '① ＝ 170 ÷ 0.19 ＝ 1000 — 原価は1000円！' },
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
          { step: 3, text: '定価 ＝ 1980 ÷ 0.9 ＝ 2200円！' },
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
          { step: 3, text: '定価の80%で売るということは、20%引き！定価×（1−0.2）＝定価×0.8 ＝ 112円。' },
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
          { step: 3, text: '割引で売ったときの利益 ＝ 560 − 500 ＝ 60円 × 10個 ＝ 600円。合計 ＝ 4000 ＋ 600 ＝ 4600円！' },
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
          { step: 3, text: '100(20-x) − 100x ＝ 1200 → 2000 − 200x ＝ 1200 → x ＝ 4個！' },
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
          { step: 3, text: '① ＝ 160 ÷ 0.04 ＝ 4000円！「0.04（4%）に当たる金額が160円」と読もう。' },
        ],
        explanationText:
          '原価①。売価＝①×1.3×0.8＝①×1.04。利益＝①×0.04＝160 → 原価＝4000円。',
      },
    ],
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
