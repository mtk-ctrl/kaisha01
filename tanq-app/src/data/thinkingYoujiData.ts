// ようちえん かんがえるジム — 50問データ
// difficulty: 1=かんたん 2=ふつう 3=むずかしい
// type: Y1〜Y10（10タイプ→10バッジ対応）

export type YoujiDifficulty = 1 | 2 | 3

export interface YoujiQuestion {
  id: number
  level: number        // 1〜10
  type: string         // バッジID対応 Y1〜Y10
  question: string
  options: [string, string, string, string]
  correctIndex: 0 | 1 | 2 | 3
  difficulty: YoujiDifficulty
  feedback: {
    correct: string
    incorrect: string
  }
}

export const YOUJI_TOTAL_LEVELS = 10
export const YOUJI_QUESTIONS_PER_LEVEL = 5
export const YOUJI_UNLOCK_THRESHOLD = 4  // 5問中4問正解でアンロック

export const YOUJI_QUESTIONS: YoujiQuestion[] = [
  // ── Lv1 ──────────────────────────────────────────────
  {
    id: 1, level: 1, type: 'Y1', difficulty: 1,
    question: '🍎🍎🍎 りんごは　いくつ？',
    options: ['3こ', '2こ', '4こ', '1こ'],
    correctIndex: 0,
    feedback: {
      correct: 'すごい！🍎🍎🍎で　3こだね！かぞえられたね！',
      incorrect: '🍎🍎🍎と　ゆびをさしながら　かぞえてみよう。1・2・3で　3こだよ！',
    }
  },
  {
    id: 2, level: 1, type: 'Y3', difficulty: 1,
    question: '🍌バナナの　いろは　なに？',
    options: ['きいろ', 'あか', 'あお', 'みどり'],
    correctIndex: 0,
    feedback: {
      correct: 'やったね！🍌バナナは　きいろだね！🌟',
      incorrect: 'バナナの　いろを　おもいだして。🍌は　きいろだよ！',
    }
  },
  {
    id: 3, level: 1, type: 'Y6', difficulty: 1,
    question: '🐶 いぬの　こえは　どれ？',
    options: ['わんわん', 'にゃあにゃあ', 'もーもー', 'ぴよぴよ'],
    correctIndex: 0,
    feedback: {
      correct: 'せいかい！🐶いぬは　わんわんとなくよ！',
      incorrect: '🐶いぬは　わんわんとなくよ。にゃあにゃあは🐱ねこ、もーもーは🐮うし、ぴよぴよは🐣ひよこだよ！',
    }
  },
  {
    id: 4, level: 1, type: 'Y8', difficulty: 1,
    question: '⚽ボールと　おなじ　かたちは　どれ？',
    options: ['まる', 'しかく', 'さんかく', 'ほし'],
    correctIndex: 0,
    feedback: {
      correct: 'すごい！⚽ボールは　まる（えんけい）のかたちだね！',
      incorrect: '⚽ボールを　みてみよう。まるいかたちだよ。まるだね！',
    }
  },
  {
    id: 5, level: 1, type: 'Y2', difficulty: 1,
    question: '🐘ぞうと　🐭ねずみ、どっちが　おおきい？',
    options: ['🐘ぞう', '🐭ねずみ', 'おなじおおきさ', 'わからない'],
    correctIndex: 0,
    feedback: {
      correct: 'やったね！🐘ぞうは　とても　おおきいね！🐭ねずみは　ちいさいよ。',
      incorrect: '🐘ぞうは　とても　おおきいどうぶつ。🐭ねずみは　とても　ちいさいよ。だから　ぞうのほうが　おおきい！',
    }
  },

  // ── Lv2 ──────────────────────────────────────────────
  {
    id: 6, level: 2, type: 'Y1', difficulty: 1,
    question: '⭐⭐⭐⭐ ほしは　いくつ？',
    options: ['4こ', '3こ', '5こ', '2こ'],
    correctIndex: 0,
    feedback: {
      correct: 'せいかい！⭐⭐⭐⭐で　4こだね！じょうず！',
      incorrect: '⭐ひとつずつ　ゆびでさしながら　かぞえてみよう。1・2・3・4で　4こだよ！',
    }
  },
  {
    id: 7, level: 2, type: 'Y3', difficulty: 1,
    question: '🍅トマトの　いろは　なに？',
    options: ['あか', 'きいろ', 'みどり', 'あお'],
    correctIndex: 0,
    feedback: {
      correct: 'やったね！🍅トマトは　あかいろだね！',
      incorrect: '🍅トマトは　あかくてまるいやさい。いろは　あかだよ！',
    }
  },
  {
    id: 8, level: 2, type: 'Y6', difficulty: 1,
    question: '🐱 ねこの　こえは　どれ？',
    options: ['にゃあにゃあ', 'わんわん', 'もーもー', 'ぶーぶー'],
    correctIndex: 0,
    feedback: {
      correct: 'せいかい！🐱ねこは　にゃあにゃあとなくよ！',
      incorrect: '🐱ねこは　にゃあにゃあとなくよ。わんわんは🐶いぬ、もーもーは🐮うし、ぶーぶーは🐷ぶただよ！',
    }
  },
  {
    id: 9, level: 2, type: 'Y4', difficulty: 1,
    question: '🍎りんご・🍊みかん・🍌バナナ・🚗くるま　なかまはずれは　どれ？',
    options: ['🚗くるま', '🍎りんご', '🍊みかん', '🍌バナナ'],
    correctIndex: 0,
    feedback: {
      correct: 'すごい！🍎🍊🍌は　たべもの（くだもの）のなかま。🚗くるまだけ　なかまはずれだね！',
      incorrect: '🍎りんご・🍊みかん・🍌バナナは　みんな　くだもの（たべもの）だよ。🚗くるまは　たべものじゃないから　なかまはずれ！',
    }
  },
  {
    id: 10, level: 2, type: 'Y7', difficulty: 1,
    question: '🐱ねこが　テーブルの　うえに　います。ねこは　どこ？',
    options: ['テーブルのうえ', 'テーブルのした', 'テーブルのよこ', 'テーブルのなか'],
    correctIndex: 0,
    feedback: {
      correct: 'やったね！🐱ねこは　テーブルのうえに　いるね！',
      incorrect: 'うえというのは　たかいところ。テーブルのうえ（てっぺん）にいるよ！',
    }
  },

  // ── Lv3 ──────────────────────────────────────────────
  {
    id: 11, level: 3, type: 'Y1', difficulty: 1,
    question: '🌸🌸🌸🌸🌸 はなは　いくつ？',
    options: ['5ほん', '4ほん', '6ほん', '3ほん'],
    correctIndex: 0,
    feedback: {
      correct: 'すごい！🌸が　5こ（5ほん）あるね！',
      incorrect: 'ゆびをさして　かぞえてみよう。1・2・3・4・5で　5ほんだよ！',
    }
  },
  {
    id: 12, level: 3, type: 'Y3', difficulty: 1,
    question: '🌿はっぱの　いろは　なに？',
    options: ['みどり', 'あか', 'きいろ', 'あお'],
    correctIndex: 0,
    feedback: {
      correct: 'やったね！🌿はっぱは　みどりいろだね！',
      incorrect: '🌿はっぱを　みてみよう。みどりいろだよ！きのはっぱや　くさは　みどりだね。',
    }
  },
  {
    id: 13, level: 3, type: 'Y6', difficulty: 1,
    question: '🐮 うしの　こえは　どれ？',
    options: ['もーもー', 'わんわん', 'ぶーぶー', 'ぴよぴよ'],
    correctIndex: 0,
    feedback: {
      correct: 'せいかい！🐮うしは　もーもーとなくよ！',
      incorrect: '🐮うしは　もーもーとなくよ。わんわんは🐶いぬ、ぶーぶーは🐷ぶた、ぴよぴよは🐣ひよこだよ！',
    }
  },
  {
    id: 14, level: 3, type: 'Y5', difficulty: 1,
    question: '🍎🍊🍎🍊🍎　つぎは　どれ？',
    options: ['🍊みかん', '🍎りんご', '🍋レモン', '🍇ぶどう'],
    correctIndex: 0,
    feedback: {
      correct: 'すごい！🍎🍊🍎🍊🍎🍊と　こうごに　ならんでいるね！',
      incorrect: '🍎→🍊→🍎→🍊→🍎→…のじゅんばんをみて。りんごのつぎは　みかん（🍊）だよ！',
    }
  },
  {
    id: 15, level: 3, type: 'Y8', difficulty: 1,
    question: '📺テレビと　おなじ　かたちは　どれ？',
    options: ['しかく', 'まる', 'さんかく', 'ほし'],
    correctIndex: 0,
    feedback: {
      correct: 'やったね！📺テレビは　しかく（ほうけい）のかたちだね！',
      incorrect: '📺テレビのかたちを　みてみよう。しかく（ほうけい）のかたちだよ！',
    }
  },

  // ── Lv4 ──────────────────────────────────────────────
  {
    id: 16, level: 4, type: 'Y1', difficulty: 1,
    question: '🐟🐟🐟🐟🐟🐟 さかなは　いくつ？',
    options: ['6ひき', '5ひき', '7ひき', '4ひき'],
    correctIndex: 0,
    feedback: {
      correct: 'すごい！🐟が6ひきいるね！かぞえられた！',
      incorrect: 'ゆびをさして　かぞえてみよう。1・2・3・4・5・6で　6ひきだよ！',
    }
  },
  {
    id: 17, level: 4, type: 'Y4', difficulty: 1,
    question: '🐶いぬ・🐱ねこ・🐰うさぎ・✈ひこうき　なかまはずれは　どれ？',
    options: ['✈ひこうき', '🐶いぬ', '🐱ねこ', '🐰うさぎ'],
    correctIndex: 0,
    feedback: {
      correct: 'やったね！🐶🐱🐰は　みんな　どうぶつ。✈ひこうきは　のりものだから　なかまはずれ！',
      incorrect: '🐶🐱🐰は　みんな　いきているどうぶつ。✈ひこうきは　のりもので　いきていないから　なかまはずれだよ！',
    }
  },
  {
    id: 18, level: 4, type: 'Y2', difficulty: 1,
    question: '🏠いえと　🏢ビル、どっちが　たかい？',
    options: ['🏢ビル', '🏠いえ', 'おなじたかさ', 'わからない'],
    correctIndex: 0,
    feedback: {
      correct: 'せいかい！🏢ビルは　たくさんのかいがあって　とても　たかいね！',
      incorrect: '🏢ビルは　たくさんの　かいがあって　🏠いえより　ずっとたかいよ！',
    }
  },
  {
    id: 19, level: 4, type: 'Y10', difficulty: 1,
    question: '🌱しょくぶつは　なにを　すって　そだつ？',
    options: ['たいようのひかりと　みず', 'にく', 'おかし', 'かぜだけ'],
    correctIndex: 0,
    feedback: {
      correct: 'すごい！🌱しょくぶつは　☀ひかりと💧みずで　そだつよ！',
      incorrect: '🌱しょくぶつは　☀たいようのひかりと💧みずを　すって　おおきくなるよ！にくやおかしは　たべないよ。',
    }
  },
  {
    id: 20, level: 4, type: 'Y9', difficulty: 1,
    question: '🐟さかなが　そらを　とんでいます。おかしいのは　どれ？',
    options: ['さかなは　そらをとばない', 'さかなは　そらをとべる', 'おかしくない', 'わからない'],
    correctIndex: 0,
    feedback: {
      correct: 'やったね！🐟さかなは　みずのなかにすんでいて　そらはとべないね！',
      incorrect: '🐟さかなは　みずのなか（うみやかわ）にすんでいるよ。そらをとぶのは🐦とりだね。さかなはそらをとべないよ！',
    }
  },

  // ── Lv5 ──────────────────────────────────────────────
  {
    id: 21, level: 5, type: 'Y1', difficulty: 2,
    question: '🌟🌟🌟🌟🌟🌟🌟 ほしは　いくつ？',
    options: ['7こ', '6こ', '8こ', '5こ'],
    correctIndex: 0,
    feedback: {
      correct: 'すごい！🌟が7こ　あるね！かぞえられた！',
      incorrect: 'ゆびをさして　かぞえてみよう。1・2・3・4・5・6・7で　7こだよ！',
    }
  },
  {
    id: 22, level: 5, type: 'Y3', difficulty: 1,
    question: '🍇ぶどうの　いろは　なに？',
    options: ['むらさき', 'あか', 'きいろ', 'みどり'],
    correctIndex: 0,
    feedback: {
      correct: 'やったね！🍇ぶどうは　むらさきいろだね！',
      incorrect: '🍇ぶどうを　おもいだして。むらさきいろの　つぶつぶしたくだものだよ！',
    }
  },
  {
    id: 23, level: 5, type: 'Y7', difficulty: 1,
    question: '🐦とりが　🌳きのうえで　うたっています。とりは　どこ？',
    options: ['きのうえ', 'きのした', 'きのなか', 'きのよこ'],
    correctIndex: 0,
    feedback: {
      correct: 'せいかい！🐦とりは　🌳きのうえ（たかいところ）にいるね！',
      incorrect: 'うえというのは　たかいところ。🐦とりは　🌳きのうえのほうで　うたっているよ！',
    }
  },
  {
    id: 24, level: 5, type: 'Y5', difficulty: 1,
    question: '1・2・3・4・　つぎのかずは？',
    options: ['5', '4', '6', '3'],
    correctIndex: 0,
    feedback: {
      correct: 'すごい！1・2・3・4・5と　じゅんばんに　かぞえられるね！',
      incorrect: '1・2・3・4・…のつぎは　5だよ！かずは　じゅんばんに　1ずつ　おおきくなるね。',
    }
  },
  {
    id: 25, level: 5, type: 'Y6', difficulty: 1,
    question: '🐧ペンギンは　どこに　すんでいる？',
    options: ['こおりのある　つめたいところ', 'あつあつの　さばく', 'ふかい　うみのそこ', 'たかい　やまのうえ'],
    correctIndex: 0,
    feedback: {
      correct: 'やったね！🐧ペンギンは　こおりのある　つめたいところ（みなみきょく）にすんでいるよ！',
      incorrect: '🐧ペンギンは　とても　つめたい　こおりのあるところにすんでいるよ。みなみきょくという　さむーいところだよ！',
    }
  },

  // ── Lv6 ──────────────────────────────────────────────
  {
    id: 26, level: 6, type: 'Y2', difficulty: 2,
    question: '🍓いちごが　4こと　🍊みかんが　6こ。どっちが　おおい？',
    options: ['🍊みかんのほうが　おおい', '🍓いちごのほうが　おおい', 'おなじかず', 'わからない'],
    correctIndex: 0,
    feedback: {
      correct: 'すごい！4こより　6このほうが　おおいね！みかんが　おおいよ！',
      incorrect: '4こと6こ、どちらが　おおいかな？4→5→6と　かぞえると　6のほうが　おおいとわかるね。みかんは6こ！',
    }
  },
  {
    id: 27, level: 6, type: 'Y4', difficulty: 2,
    question: '🍑もも・🍓いちご・🍒さくらんぼ・⚽ボール　なかまはずれは　どれ？',
    options: ['⚽ボール', '🍑もも', '🍓いちご', '🍒さくらんぼ'],
    correctIndex: 0,
    feedback: {
      correct: 'やったね！🍑🍓🍒は　みんな　くだもの。⚽ボールだけ　たべものじゃないから　なかまはずれ！',
      incorrect: '🍑もも・🍓いちご・🍒さくらんぼは　みんな　くだもの（たべもの）だよ。⚽ボールは　あそびどうぐだから　なかまはずれ！',
    }
  },
  {
    id: 28, level: 6, type: 'Y9', difficulty: 1,
    question: '🌸はるに　⛄ゆきだるまを　つくっています。おかしいのは　どれ？',
    options: ['はるに　ゆきは　ふらない', 'ゆきだるまは　いつでもつくれる', 'おかしくない', 'わからない'],
    correctIndex: 0,
    feedback: {
      correct: 'すごい！🌸はるは　あたたかいきせつだから　ゆきは　ふらないね！⛄ゆきだるまは　ふゆにつくるものだよ。',
      incorrect: '🌸はるは　あたたかくなるきせつ。ゆきが　ふるのは　さむい❄ふゆだよ。だから　はるに　ゆきだるまは　つくれないね！',
    }
  },
  {
    id: 29, level: 6, type: 'Y8', difficulty: 1,
    question: '🍙おにぎりと　おなじ　かたちは　どれ？',
    options: ['さんかく', 'まる', 'しかく', 'ほし'],
    correctIndex: 0,
    feedback: {
      correct: 'やったね！🍙おにぎりは　さんかくのかたちだね！',
      incorrect: '🍙おにぎりのかたちを　みてみよう。とがったかどが　3つある　さんかくだよ！',
    }
  },
  {
    id: 30, level: 6, type: 'Y6', difficulty: 2,
    question: '🐸カエルは　どこで　くらしている？',
    options: ['かわや　いけのそば（みずのちかく）', 'きたきょくの　こおりのうえ', 'さばくの　あつい　すな', 'たかい　そらのなか'],
    correctIndex: 0,
    feedback: {
      correct: 'せいかい！🐸カエルは　かわや　いけなど　みずのちかくでくらしているよ！',
      incorrect: '🐸カエルは　みずがすき。かわや　いけのちかく（しめったところ）にすんでいるよ！',
    }
  },

  // ── Lv7 ──────────────────────────────────────────────
  {
    id: 31, level: 7, type: 'Y1', difficulty: 2,
    question: '🍬🍬🍬🍬🍬🍬🍬🍬🍬 あめは　いくつ？',
    options: ['9こ', '8こ', '10こ', '7こ'],
    correctIndex: 0,
    feedback: {
      correct: 'すごい！🍬が9こ　あるね！おおいのに　かぞえられた！',
      incorrect: 'ゆびをさして　かぞえてみよう。1・2・3・4・5・6・7・8・9で　9こだよ！',
    }
  },
  {
    id: 32, level: 7, type: 'Y5', difficulty: 2,
    question: '🌞☁🌞☁🌞☁　つぎは　なに？',
    options: ['☁くも', '🌞たいよう', '🌧あめ', '⭐ほし'],
    correctIndex: 0,
    feedback: {
      correct: 'やったね！🌞☁🌞☁🌞☁…と　こうごに　くりかえすパターンだね！',
      incorrect: '🌞☁🌞☁🌞…のパターンをみて。たいよう→くも→たいよう→くも→たいよう→つぎは　くも（☁）だよ！',
    }
  },
  {
    id: 33, level: 7, type: 'Y2', difficulty: 2,
    question: '🍎りんごが　3こと　🍊みかんが　5こ。どっちが　おおい？',
    options: ['🍊みかんのほうが　おおい', '🍎りんごのほうが　おおい', 'おなじかず', 'わからない'],
    correctIndex: 0,
    feedback: {
      correct: 'せいかい！3こより　5このほうが　おおいね！みかんが　おおいよ！',
      incorrect: '3こと5こをくらべよう。1・2・3（りんご）…4・5（みかん）と　かぞえると　みかんが　おおいとわかるね！',
    }
  },
  {
    id: 34, level: 7, type: 'Y7', difficulty: 2,
    question: '🐱ねこが　🛏ベッドのした　にいます。ねこは　どこ？',
    options: ['ベッドのした', 'ベッドのうえ', 'ベッドのなか', 'ベッドのよこ'],
    correctIndex: 0,
    feedback: {
      correct: 'やったね！🐱ねこは　🛏ベッドのした（ひくいところ）にいるね！',
      incorrect: 'した（下）というのは　ひくいところ。🛏ベッドのした、うらがわに　🐱ねこがかくれているよ！',
    }
  },
  {
    id: 35, level: 7, type: 'Y10', difficulty: 1,
    question: '🌧あめが　ふったあと、そらに　みえるのは　なに？',
    options: ['🌈にじ', '❄ゆき', '🌪たつまき', '🌕まんまるのつき'],
    correctIndex: 0,
    feedback: {
      correct: 'すごい！🌧あめのあと　☀ひかりがさすと　🌈にじが　でることがあるよ！',
      incorrect: '🌧あめのあと、きれいな🌈がそらにかかることがあるよ。あかいろ・きいろ・みどり・あおなど　たくさんのいろがならんでいるね！',
    }
  },

  // ── Lv8 ──────────────────────────────────────────────
  {
    id: 36, level: 8, type: 'Y3', difficulty: 2,
    question: '🌊うみの　いろは　ふつう　なに？',
    options: ['あお・みずいろ', 'あか', 'きいろ', 'みどり'],
    correctIndex: 0,
    feedback: {
      correct: 'やったね！🌊うみは　あお（みずいろ）に　みえるね！',
      incorrect: '🌊うみをおもいだして。そらのいろをはんしゃして　あお（みずいろ）にみえるんだよ！',
    }
  },
  {
    id: 37, level: 8, type: 'Y4', difficulty: 2,
    question: '🐶いぬ・🐱ねこ・🐹ハムスター・🚂でんしゃ　なかまはずれは　どれ？',
    options: ['🚂でんしゃ', '🐶いぬ', '🐱ねこ', '🐹ハムスター'],
    correctIndex: 0,
    feedback: {
      correct: 'すごい！🐶🐱🐹は　みんな　どうぶつ。🚂でんしゃは　のりものだから　なかまはずれ！',
      incorrect: '🐶いぬ・🐱ねこ・🐹ハムスターは　みんな　かわいいどうぶつ。🚂でんしゃは　のりもので　いきていないから　なかまはずれだよ！',
    }
  },
  {
    id: 38, level: 8, type: 'Y10', difficulty: 2,
    question: '❄ゆきは　なにが　かたまったもの？',
    options: ['みず（がこおったもの）', 'すな', 'しろいはな', 'ちり'],
    correctIndex: 0,
    feedback: {
      correct: 'やったね！❄ゆきは　💧みずが　とても　さむくなって　こおった　ものだよ！',
      incorrect: '❄ゆきは　そらから　ふってくるけど、もとは💧みずだよ。きおんがとても　さがると　みずが　こおって　しろいゆきになるんだ！',
    }
  },
  {
    id: 39, level: 8, type: 'Y5', difficulty: 2,
    question: 'あか・あお・あか・あお・あか・　つぎは　なに？',
    options: ['あお', 'あか', 'きいろ', 'みどり'],
    correctIndex: 0,
    feedback: {
      correct: 'せいかい！あか→あお→あか→あお…と　くりかえすパターンだね！',
      incorrect: 'あか・あお・あか・あお・あか…のパターン。あかのあとは　あおがくるよ！つぎは　あおだね。',
    }
  },
  {
    id: 40, level: 8, type: 'Y9', difficulty: 2,
    question: '🌊うみのなかで　⛷スキーを　しています。おかしいのは　どれ？',
    options: ['スキーは　ゆきのうえで　するもの', 'うみでスキーができる', 'おかしくない', 'わからない'],
    correctIndex: 0,
    feedback: {
      correct: 'やったね！⛷スキーは❄ゆきのうえで　すべるスポーツ。🌊うみのなかでは　できないよ！',
      incorrect: '⛷スキーは❄ゆきのある　やまで　すべるスポーツだよ。🌊うみのなかでは　できないね。これは　おかしいよ！',
    }
  },

  // ── Lv9 ──────────────────────────────────────────────
  {
    id: 41, level: 9, type: 'Y2', difficulty: 2,
    question: '🐋くじらと　🐬イルカ、どっちが　おおきい？',
    options: ['🐋くじら', '🐬イルカ', 'おなじおおきさ', 'わからない'],
    correctIndex: 0,
    feedback: {
      correct: 'すごい！🐋くじらは　せかいでいちばんおおきな　どうぶつ。🐬イルカより　ずっとおおきいよ！',
      incorrect: '🐋くじらは　とても　とても　おおきな　どうぶつ。🐬イルカも　おおきいけど、くじらのほうが　ずっとおおきいよ！',
    }
  },
  {
    id: 42, level: 9, type: 'Y7', difficulty: 2,
    question: '🔴あかい　はこの　うえに　🔵あおい　はこ、そのうえに　🟡きいろい　はこが　あります。したから　2ばんめの　はこは　どれ？',
    options: ['🔵あおいはこ', '🔴あかいはこ', '🟡きいろいはこ', 'わからない'],
    correctIndex: 0,
    feedback: {
      correct: 'すごい！したから　1ばんめ🔴あか・2ばんめ🔵あお・3ばんめ🟡きいろ。したから　2ばんめは　🔵あおいはこだね！',
      incorrect: 'したから　じゅんに　かぞえると：1ばんめ🔴あか・2ばんめ🔵あお・3ばんめ🟡きいろ。したから　2ばんめは　🔵あおいはこだよ！',
    }
  },
  {
    id: 43, level: 9, type: 'Y8', difficulty: 2,
    question: '🔺このかたちと　おなじ　かたちの　たべものは　どれ？',
    options: ['🍙おにぎり', '⚽ボール', '📦はこ', '🍕ピザ（まるごと）'],
    correctIndex: 0,
    feedback: {
      correct: 'せいかい！🔺さんかくのかたちは　🍙おにぎりと　おなじだね！',
      incorrect: '🔺さんかくは　とがったかどが3つある。🍙おにぎりも　さんかくのかたちだよ！⚽ボールはまる、📦はこはしかくだね。',
    }
  },
  {
    id: 44, level: 9, type: 'Y6', difficulty: 2,
    question: '🐻くまは　ふゆに　なにをする？',
    options: ['あなのなかで　ながいあいだ　ねむる', 'みなみの　あたたかいくにへ　とぶ', 'うみで　さかなをとる', 'こおりのうえで　あそぶ'],
    correctIndex: 0,
    feedback: {
      correct: 'やったね！🐻くまは　さむい❄ふゆのあいだ、あなのなかで　ながいあいだ　ねむるよ（ふゆごもり）！',
      incorrect: '🐻くまは　ふゆになると　あなのなかにはいって、はるになるまで　ながいあいだ　ねむるよ。これを「ふゆごもり」というよ！',
    }
  },
  {
    id: 45, level: 9, type: 'Y10', difficulty: 2,
    question: '🌱めが　でてから、しょくぶつは　どうなる？',
    options: ['くきがのびて　はっぱがしげり　はながさく', 'すぐに　なくなってしまう', 'さかなに　なる', 'そらへ　とんでいく'],
    correctIndex: 0,
    feedback: {
      correct: 'すごい！🌱めが　でて→くきがのびて→はっぱがしげって→🌸はながさくよ！',
      incorrect: '🌱めが　でたあと、くきがのびて、はっぱがしげって、さいごに🌸はながさくよ。じゅんばんがあるんだね！',
    }
  },

  // ── Lv10 ──────────────────────────────────────────────
  {
    id: 46, level: 10, type: 'Y1', difficulty: 3,
    question: '🍎りんごが　5こ　あります。3こ　たべました。のこりは　いくつ？',
    options: ['2こ', '3こ', '4こ', '1こ'],
    correctIndex: 0,
    feedback: {
      correct: 'すごい！5こから　3こたべると　2このこるね！5－3＝2だよ！',
      incorrect: '🍎🍎🍎🍎🍎から　3このけてみよう。のこった　🍎🍎は　2こだよ！',
    }
  },
  {
    id: 47, level: 10, type: 'Y5', difficulty: 3,
    question: '2・4・6・8・　つぎのかずは？',
    options: ['10', '9', '11', '7'],
    correctIndex: 0,
    feedback: {
      correct: 'すごい！2・4・6・8・10と　2ずつ　おおきくなっているパターンだね！',
      incorrect: '2→4→6→8→？と　2ずつ　ふえているよ。8のつぎは　8＋2で　10だね！',
    }
  },
  {
    id: 48, level: 10, type: 'Y9', difficulty: 3,
    question: '🐟さかなが　りくのうえを　あるいています。おかしいのは　どれ？',
    options: ['さかなは　あるけない・りくでは　いきできない', 'さかなは　あるける', 'おかしくない', 'わからない'],
    correctIndex: 0,
    feedback: {
      correct: 'やったね！🐟さかなは　みずのなかで　えらで　いきをして　ひれで　およぐよ。りくでは　いきできないし　あるけないね！',
      incorrect: '🐟さかなは　みずのなかで　すごすいきもの。えらで　みずのなかの　くうきをすうよ。だから　りくのうえでは　あるけないし　いきもできないよ！',
    }
  },
  {
    id: 49, level: 10, type: 'Y4', difficulty: 2,
    question: '🌳き・🌻ひまわり・🌺ばら・🐕いぬ　なかまはずれは　どれ？',
    options: ['🐕いぬ', '🌳き', '🌻ひまわり', '🌺ばら'],
    correctIndex: 0,
    feedback: {
      correct: 'すごい！🌳🌻🌺は　みんな　しょくぶつ（うごかないいきもの）。🐕いぬは　どうぶつだから　なかまはずれ！',
      incorrect: '🌳き・🌻ひまわり・🌺ばらは　みんな　しょくぶつ。🐕いぬは　あるいたりする　どうぶつだから　なかまはずれだよ！',
    }
  },
  {
    id: 50, level: 10, type: 'Y7', difficulty: 3,
    question: '🐰うさぎ・🐱ねこ・🐶いぬが　まえから　じゅんに　ならんでいます。うしろから　かぞえて　2ばんめは？',
    options: ['🐱ねこ', '🐰うさぎ', '🐶いぬ', 'わからない'],
    correctIndex: 0,
    feedback: {
      correct: 'すごい！まえから　うさぎ・ねこ・いぬ。うしろから　じゅんに　いぬ・ねこ・うさぎ。うしろから　2ばんめは　🐱ねこだね！',
      incorrect: 'まえから　うさぎ・ねこ・いぬ。うしろから　かぞえると　1ばんめ🐶いぬ・2ばんめ🐱ねこ・3ばんめ🐰うさぎ。2ばんめは　🐱ねこだよ！',
    }
  },
]
