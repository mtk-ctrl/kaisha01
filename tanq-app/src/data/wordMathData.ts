// 算数・文章題データ — 小1〜小3 各20問（計60問）
// テツ（アイデアリード）& Ken（コンテンツ品質）設計
// 文部科学省 小学校学習指導要領「数と計算」領域に準拠

export type Grade = '小1' | '小2' | '小3'

export interface WordProblem {
  id: string
  grade: Grade
  emoji: string
  question: string
  answer: number
  unit: string
  choices: [number, number, number, number]
  explanation: string
}

export const PROBLEMS: WordProblem[] = [

  // ── 小1（たし算・ひき算 1〜20） ─────────────────────────────────
  {
    id: 'g1_01', grade: '小1', emoji: '🍎',
    question: 'りんごが 3こ あります。さらに 5こ もらいました。ぜんぶで いくつに なりましたか？',
    answer: 8, unit: 'こ', choices: [6, 7, 8, 9],
    explanation: '3 + 5 = 8。もらったときはたし算だよ！',
  },
  {
    id: 'g1_02', grade: '小1', emoji: '🍪',
    question: 'クッキーが 12まい あります。4まい たべました。のこりは 何まいですか？',
    answer: 8, unit: 'まい', choices: [6, 7, 8, 9],
    explanation: '12 - 4 = 8。食べてへったときはひき算だよ！',
  },
  {
    id: 'g1_03', grade: '小1', emoji: '✏️',
    question: 'えんぴつが 7ほん あります。ともだちに 3ほん あげました。のこりは 何ほんですか？',
    answer: 4, unit: 'ほん', choices: [3, 4, 5, 6],
    explanation: '7 - 3 = 4。あげてへったときはひき算！',
  },
  {
    id: 'g1_04', grade: '小1', emoji: '🚌',
    question: 'バスに 9にん のっています。3にん おりました。いま のっているのは 何にんですか？',
    answer: 6, unit: 'にん', choices: [5, 6, 7, 8],
    explanation: '9 - 3 = 6。おりてへったのでひき算！',
  },
  {
    id: 'g1_05', grade: '小1', emoji: '🍓',
    question: 'いちごが 5こ あります。6こ もらいました。ぜんぶで いくつですか？',
    answer: 11, unit: 'こ', choices: [9, 10, 11, 12],
    explanation: '5 + 6 = 11。ふえたのでたし算！',
  },
  {
    id: 'g1_06', grade: '小1', emoji: '🌰',
    question: 'どんぐりを 8こ ひろいました。いもうとに 3こ あげました。のこりは 何こですか？',
    answer: 5, unit: 'こ', choices: [4, 5, 6, 7],
    explanation: '8 - 3 = 5。あげてへったのでひき算！',
  },
  {
    id: 'g1_07', grade: '小1', emoji: '🐟',
    question: 'きんぎょが 6ひき います。4ひき かいました。ぜんぶで 何ひきですか？',
    answer: 10, unit: 'ひき', choices: [8, 9, 10, 11],
    explanation: '6 + 4 = 10。ふえたのでたし算！',
  },
  {
    id: 'g1_08', grade: '小1', emoji: '🍫',
    question: 'チョコレートが 15こ あります。7こ たべました。のこりは 何こですか？',
    answer: 8, unit: 'こ', choices: [6, 7, 8, 9],
    explanation: '15 - 7 = 8。へったのでひき算！',
  },
  {
    id: 'g1_09', grade: '小1', emoji: '📚',
    question: 'えほんが 4さつ あります。3さつ かいました。ぜんぶで 何さつですか？',
    answer: 7, unit: 'さつ', choices: [5, 6, 7, 8],
    explanation: '4 + 3 = 7。ふえたのでたし算！',
  },
  {
    id: 'g1_10', grade: '小1', emoji: '🌳',
    question: 'こうえんに 7にん います。5にん きました。みんなで 何にんですか？',
    answer: 12, unit: 'にん', choices: [10, 11, 12, 13],
    explanation: '7 + 5 = 12。きてふえたのでたし算！',
  },
  {
    id: 'g1_11', grade: '小1', emoji: '🕊️',
    question: 'はとが 9わ います。4わ とんでいきました。のこりは 何わですか？',
    answer: 5, unit: 'わ', choices: [4, 5, 6, 7],
    explanation: '9 - 4 = 5。とんでいってへったのでひき算！',
  },
  {
    id: 'g1_12', grade: '小1', emoji: '🍊',
    question: 'みかんが 6こ あります。さらに 6こ もらいました。ぜんぶで 何こですか？',
    answer: 12, unit: 'こ', choices: [10, 11, 12, 13],
    explanation: '6 + 6 = 12。おなじかずのたし算だよ！',
  },
  {
    id: 'g1_13', grade: '小1', emoji: '⭐',
    question: 'シールが 15まい あります。8まい ともだちに あげました。のこりは 何まいですか？',
    answer: 7, unit: 'まい', choices: [6, 7, 8, 9],
    explanation: '15 - 8 = 7。あげてへったのでひき算！',
  },
  {
    id: 'g1_14', grade: '小1', emoji: '🔵',
    question: 'あおい おはじきが 9こ、あかい おはじきが 5こ あります。あわせて 何こですか？',
    answer: 14, unit: 'こ', choices: [12, 13, 14, 15],
    explanation: '9 + 5 = 14。あわせてはたし算！',
  },
  {
    id: 'g1_15', grade: '小1', emoji: '🥕',
    question: 'にんじんが 11ぽん あります。4ほん たべました。のこりは 何ほんですか？',
    answer: 7, unit: 'ほん', choices: [6, 7, 8, 9],
    explanation: '11 - 4 = 7。たべてへったのでひき算！',
  },
  {
    id: 'g1_16', grade: '小1', emoji: '🐦',
    question: 'すずめが 8わ います。6わ とまりに きました。みんなで 何わですか？',
    answer: 14, unit: 'わ', choices: [12, 13, 14, 15],
    explanation: '8 + 6 = 14。きてふえたのでたし算！',
  },
  {
    id: 'g1_17', grade: '小1', emoji: '🍬',
    question: 'おかしが 20こ あります。9こ たべました。のこりは 何こですか？',
    answer: 11, unit: 'こ', choices: [9, 10, 11, 12],
    explanation: '20 - 9 = 11。たべてへったのでひき算！',
  },
  {
    id: 'g1_18', grade: '小1', emoji: '🌸',
    question: 'あかい はなが 5ほん、しろい はなが 4ほん さいています。あわせて 何ほんですか？',
    answer: 9, unit: 'ほん', choices: [7, 8, 9, 10],
    explanation: '5 + 4 = 9。あわせてはたし算！',
  },
  {
    id: 'g1_19', grade: '小1', emoji: '✈️',
    question: 'かみひこうきを 6こ おりました。かぜで とんで 2こ なくなりました。のこりは 何こですか？',
    answer: 4, unit: 'こ', choices: [3, 4, 5, 6],
    explanation: '6 - 2 = 4。なくなってへったのでひき算！',
  },
  {
    id: 'g1_20', grade: '小1', emoji: '🍡',
    question: 'だんごが 3こ ずつ 4ほん あります。ぜんぶで 何こですか？',
    answer: 12, unit: 'こ', choices: [9, 10, 12, 13],
    explanation: '3 + 3 + 3 + 3 = 12。おなじかずを 4かい たすと 12！',
  },

  // ── 小2（2桁の計算・かけ算・簡単なわり算） ────────────────────
  {
    id: 'g2_01', grade: '小2', emoji: '📓',
    question: 'ノートが 24さつ あります。8さつ つかいました。のこりは 何さつですか？',
    answer: 16, unit: 'さつ', choices: [14, 15, 16, 17],
    explanation: '24 - 8 = 16。',
  },
  {
    id: 'g2_02', grade: '小2', emoji: '🍎',
    question: 'はこに りんごが 6こ はいっています。4はこ あります。りんごは ぜんぶで 何こですか？',
    answer: 24, unit: 'こ', choices: [20, 22, 24, 28],
    explanation: '6 × 4 = 24。おなじかずが 4はこ → かけ算！',
  },
  {
    id: 'g2_03', grade: '小2', emoji: '✏️',
    question: 'えんぴつが 35ほん あります。17ほん つかいました。のこりは 何ほんですか？',
    answer: 18, unit: 'ほん', choices: [16, 17, 18, 19],
    explanation: '35 - 17 = 18。',
  },
  {
    id: 'g2_04', grade: '小2', emoji: '🎂',
    question: '1まいの おさらに ケーキが 5こ のっています。3まいでは 何こですか？',
    answer: 15, unit: 'こ', choices: [12, 13, 15, 18],
    explanation: '5 × 3 = 15。おなじかずが 3まい → かけ算！',
  },
  {
    id: 'g2_05', grade: '小2', emoji: '🪙',
    question: '50えんの ガムを 3こ かいました。ぜんぶで いくらですか？',
    answer: 150, unit: 'えん', choices: [100, 130, 150, 200],
    explanation: '50 × 3 = 150。おなじねだんが 3こ → かけ算！',
  },
  {
    id: 'g2_06', grade: '小2', emoji: '🚌',
    question: '1だいの バスに 32にん のっています。2だいの バスでは 何にんですか？',
    answer: 64, unit: 'にん', choices: [60, 62, 64, 66],
    explanation: '32 × 2 = 64。',
  },
  {
    id: 'g2_07', grade: '小2', emoji: '🎨',
    question: '色紙が 80まい あります。24まい つかいました。のこりは 何まいですか？',
    answer: 56, unit: 'まい', choices: [54, 55, 56, 58],
    explanation: '80 - 24 = 56。',
  },
  {
    id: 'g2_08', grade: '小2', emoji: '🍓',
    question: 'いちごが 9こ ずつ 4パック あります。ぜんぶで 何こですか？',
    answer: 36, unit: 'こ', choices: [32, 34, 36, 40],
    explanation: '9 × 4 = 36。かけ算の九九だよ！',
  },
  {
    id: 'g2_09', grade: '小2', emoji: '💰',
    question: '100えん もっています。32えんの おかしを かいました。おつりは 何えんですか？',
    answer: 68, unit: 'えん', choices: [62, 65, 68, 72],
    explanation: '100 - 32 = 68。',
  },
  {
    id: 'g2_10', grade: '小2', emoji: '✏️',
    question: 'えんぴつが 8ほん はいった はこが 7つ あります。ぜんぶで 何ほんですか？',
    answer: 56, unit: 'ほん', choices: [48, 52, 56, 60],
    explanation: '8 × 7 = 56。かけ算の九九！',
  },
  {
    id: 'g2_11', grade: '小2', emoji: '👨‍👩‍👧',
    question: 'がっこうに 48にんの せいとが います。21にん かえりました。のこりは 何にんですか？',
    answer: 27, unit: 'にん', choices: [25, 26, 27, 28],
    explanation: '48 - 21 = 27。',
  },
  {
    id: 'g2_12', grade: '小2', emoji: '🌷',
    question: '1つの はなだんに 7ほんの はなが さいています。5つの はなだんでは 何ほんですか？',
    answer: 35, unit: 'ほん', choices: [30, 33, 35, 40],
    explanation: '7 × 5 = 35。九九だよ！',
  },
  {
    id: 'g2_13', grade: '小2', emoji: '🛍️',
    question: '70えんの あめと 45えんの ガムを かいました。ぜんぶで いくらですか？',
    answer: 115, unit: 'えん', choices: [110, 112, 115, 120],
    explanation: '70 + 45 = 115。',
  },
  {
    id: 'g2_14', grade: '小2', emoji: '🍊',
    question: 'みかんが 63こ あります。9こ ずつ ふくろに いれると 何ふくろ できますか？',
    answer: 7, unit: 'ふくろ', choices: [5, 6, 7, 8],
    explanation: '63 ÷ 9 = 7。おなじかずに わけるのはわり算！',
  },
  {
    id: 'g2_15', grade: '小2', emoji: '🏫',
    question: 'バスに おとな 15にん、こども 17にん のっています。みんなで 何にんですか？',
    answer: 32, unit: 'にん', choices: [30, 31, 32, 33],
    explanation: '15 + 17 = 32。',
  },
  {
    id: 'g2_16', grade: '小2', emoji: '🎀',
    question: '6cmの リボンを 4ほん つなぐと 何cmに なりますか？',
    answer: 24, unit: 'cm', choices: [20, 22, 24, 26],
    explanation: '6 × 4 = 24。',
  },
  {
    id: 'g2_17', grade: '小2', emoji: '⭐',
    question: '45えんの シールを 3まい かいました。ぜんぶで いくらですか？',
    answer: 135, unit: 'えん', choices: [120, 130, 135, 140],
    explanation: '45 × 3 = 135。',
  },
  {
    id: 'g2_18', grade: '小2', emoji: '🏊',
    question: 'プールに 42にん います。18にん でました。のこりは 何にんですか？',
    answer: 24, unit: 'にん', choices: [22, 23, 24, 25],
    explanation: '42 - 18 = 24。',
  },
  {
    id: 'g2_19', grade: '小2', emoji: '🍫',
    question: 'おかしが 9こ ずつ 6つの はこに はいっています。ぜんぶで 何こですか？',
    answer: 54, unit: 'こ', choices: [48, 50, 54, 56],
    explanation: '9 × 6 = 54。九九！',
  },
  {
    id: 'g2_20', grade: '小2', emoji: '🧃',
    question: '150えん もっています。80えんの ジュースを かいます。おつりは 何えんですか？',
    answer: 70, unit: 'えん', choices: [60, 65, 70, 80],
    explanation: '150 - 80 = 70。',
  },

  // ── 小3（かけ算・わり算・大きな数・時間） ─────────────────────
  {
    id: 'g3_01', grade: '小3', emoji: '📖',
    question: '1日に 8ページ ずつ 本を よみます。12日で 何ページ よめますか？',
    answer: 96, unit: 'ページ', choices: [84, 90, 96, 100],
    explanation: '8 × 12 = 96。',
  },
  {
    id: 'g3_02', grade: '小3', emoji: '🍎',
    question: '72この りんごを 8人で わけると、1人 何こに なりますか？',
    answer: 9, unit: 'こ', choices: [7, 8, 9, 10],
    explanation: '72 ÷ 8 = 9。等しくわけるのはわり算！',
  },
  {
    id: 'g3_03', grade: '小3', emoji: '✏️',
    question: 'えんぴつが 6ほん はいった はこが 15はこ あります。ぜんぶで 何ほんですか？',
    answer: 90, unit: 'ほん', choices: [80, 85, 90, 95],
    explanation: '6 × 15 = 90。',
  },
  {
    id: 'g3_04', grade: '小3', emoji: '🍬',
    question: 'あめが 135こ あります。5人で おなじかずずつ わけると、1人 何こですか？',
    answer: 27, unit: 'こ', choices: [23, 25, 27, 30],
    explanation: '135 ÷ 5 = 27。',
  },
  {
    id: 'g3_05', grade: '小3', emoji: '🌸',
    question: 'はなが 8ほんで 1たば です。12たばでは 何ほんですか？',
    answer: 96, unit: 'ほん', choices: [84, 90, 96, 100],
    explanation: '8 × 12 = 96。',
  },
  {
    id: 'g3_06', grade: '小3', emoji: '🚌',
    question: 'えんそくで バス 3だいに のりました。1だいに 42にん のっています。みんなで 何にんですか？',
    answer: 126, unit: 'にん', choices: [120, 123, 126, 130],
    explanation: '42 × 3 = 126。',
  },
  {
    id: 'g3_07', grade: '小3', emoji: '🧃',
    question: '250えんの ジュースを 4本 かいました。ぜんぶで いくらですか？',
    answer: 1000, unit: 'えん', choices: [800, 900, 1000, 1100],
    explanation: '250 × 4 = 1000。',
  },
  {
    id: 'g3_08', grade: '小3', emoji: '🎀',
    question: 'リボンが 96cm あります。8cmずつ きると 何ほんに なりますか？',
    answer: 12, unit: 'ほん', choices: [10, 11, 12, 13],
    explanation: '96 ÷ 8 = 12。',
  },
  {
    id: 'g3_09', grade: '小3', emoji: '📅',
    question: '1しゅうかんは 7日 です。4しゅうかんは 何日ですか？',
    answer: 28, unit: '日', choices: [24, 26, 28, 30],
    explanation: '7 × 4 = 28。',
  },
  {
    id: 'g3_10', grade: '小3', emoji: '🍫',
    question: 'おかしが 63こ あります。9こ ずつ はこに いれると 何はこ できますか？',
    answer: 7, unit: 'はこ', choices: [5, 6, 7, 8],
    explanation: '63 ÷ 9 = 7。',
  },
  {
    id: 'g3_11', grade: '小3', emoji: '📮',
    question: '1まい 85えんの きってが 12まい あります。ぜんぶで いくらですか？',
    answer: 1020, unit: 'えん', choices: [960, 990, 1020, 1060],
    explanation: '85 × 12 = 1020。',
  },
  {
    id: 'g3_12', grade: '小3', emoji: '🐟',
    question: 'みずそうに 水が 15L はいっています。3Lずつ びんに いれると 何びん できますか？',
    answer: 5, unit: 'びん', choices: [3, 4, 5, 6],
    explanation: '15 ÷ 3 = 5。',
  },
  {
    id: 'g3_13', grade: '小3', emoji: '🍅',
    question: 'のうかで 1日に 48この トマトが とれます。6日間で 何こ とれますか？',
    answer: 288, unit: 'こ', choices: [264, 276, 288, 300],
    explanation: '48 × 6 = 288。',
  },
  {
    id: 'g3_14', grade: '小3', emoji: '👨‍👩‍👧',
    question: 'せいとが 84にん います。4つの グループに おなじ 人数で わけると 1グループ 何にんですか？',
    answer: 21, unit: 'にん', choices: [18, 20, 21, 24],
    explanation: '84 ÷ 4 = 21。',
  },
  {
    id: 'g3_15', grade: '小3', emoji: '🍬',
    question: '1こ 35えんの あめを 12こ かいました。ぜんぶで いくらですか？',
    answer: 420, unit: 'えん', choices: [360, 390, 420, 450],
    explanation: '35 × 12 = 420。',
  },
  {
    id: 'g3_16', grade: '小3', emoji: '🏃',
    question: 'いけの まわりを 1しゅうするのに 8分 かかります。5しゅうすると 何分 かかりますか？',
    answer: 40, unit: 'ふん', choices: [32, 36, 40, 45],
    explanation: '8 × 5 = 40。',
  },
  {
    id: 'g3_17', grade: '小3', emoji: '📓',
    question: 'ノートが 7さつで 840えん です。1さつ いくらですか？',
    answer: 120, unit: 'えん', choices: [100, 110, 120, 130],
    explanation: '840 ÷ 7 = 120。',
  },
  {
    id: 'g3_18', grade: '小3', emoji: '👨‍👩‍👧',
    question: 'クラスに 36にん います。3にんずつ よこに ならぶと 何れつに なりますか？',
    answer: 12, unit: 'れつ', choices: [9, 10, 12, 15],
    explanation: '36 ÷ 3 = 12。',
  },
  {
    id: 'g3_19', grade: '小3', emoji: '🎁',
    question: 'プレゼントの はこが 1だんに 6こ、4だんに つまれています。ぜんぶで 何こですか？',
    answer: 24, unit: 'こ', choices: [20, 22, 24, 26],
    explanation: '6 × 4 = 24。',
  },
  {
    id: 'g3_20', grade: '小3', emoji: '⏰',
    question: '映画が 1時間 45分 あります。何分 ですか？',
    answer: 105, unit: 'ふん', choices: [90, 100, 105, 110],
    explanation: '60 + 45 = 105分。1時間 = 60分だよ！',
  },
]
