// 都道府県データ — scripts/convert-todofuken-data.mjs で生成
// 名物データ: 難易度1は既存データより移行。難易度2・3はKenが追加予定
// SVGパス: src/data/todofukenPaths.ts を参照

export type FamousItem = {
  name: string
  emoji: string
  difficulty: 1 | 2 | 3   // 1=かんたん 2=ふつう(日本一系) 3=むずかしい(中学受験)
  note: string             // 答え合わせの解説文
}

export type Prefecture = {
  id: string          // 英語ID (hokkaido 等)
  jis: string         // JISコード (01〜47)
  name: string        // 都道府県名 (漢字)
  kana: string        // 読み (ひらがな)
  capital: string     // 県庁所在地 (漢字)
  capitalKana: string // 県庁所在地の読み
  capitalDiffers: boolean // 県名と県庁所在地が異なるか（18県）
  region: string      // 地方名
  regionColor: string // 地方カラー
  emoji: string       // 代表絵文字
  famous: FamousItem[]
  fact: string        // 豆知識（フラッシュカード裏面）
}

export const PREFECTURES: Prefecture[] = [
  {
    "id": "hokkaido",
    "jis": "01",
    "name": "北海道",
    "kana": "ほっかいどう",
    "capital": "札幌",
    "capitalKana": "さっぽろ",
    "capitalDiffers": false,
    "region": "北海道",
    "regionColor": "#0ea5e9",
    "emoji": "🦀",
    "famous": [
      {
        "name": "カニ",
        "emoji": "🦀",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "じゃがいも",
        "emoji": "🥔",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "ラベンダー",
        "emoji": "💜",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "ゆき（雪まつり）",
        "emoji": "❄️",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "石狩平野・酪農",
        "emoji": "🐄",
        "difficulty": 2,
        "note": "石狩平野は北海道最大の平野。広大な牧草地で酪農がさかん。バターやチーズなど乳製品の生産量も日本1位。"
      },
      {
        "name": "屯田兵・開拓の歴史",
        "emoji": "⚔️",
        "difficulty": 3,
        "note": "明治時代、政府が北海道を開拓するために「屯田兵」を送り込んだ。農業と防衛を兼ねた兵士が各地に入植した。"
      }
    ],
    "fact": "にほんで いちばん おおきな しゅうちょうそん！ほっかいどうは しこくの 2.2ばい もある！"
  },
  {
    "id": "aomori",
    "jis": "02",
    "name": "青森",
    "kana": "あおもり",
    "capital": "青森",
    "capitalKana": "あおもり",
    "capitalDiffers": false,
    "region": "東北",
    "regionColor": "#8b5cf6",
    "emoji": "🍎",
    "famous": [
      {
        "name": "りんご",
        "emoji": "🍎",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "ねぶた祭り",
        "emoji": "🎆",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "ほたて",
        "emoji": "🐚",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "津軽平野・りんご生産量1位",
        "emoji": "🌾",
        "difficulty": 2,
        "note": "津軽平野は青森西部の広い平野。昼夜の寒暖差を生かしたりんご栽培がさかんで、全国生産量の約55%を占める。"
      }
    ],
    "fact": "りんごのせいさんりょう にほん1い！あおもりのりんごは にほん全体の 約55%！"
  },
  {
    "id": "iwate",
    "jis": "03",
    "name": "岩手",
    "kana": "いわて",
    "capital": "盛岡",
    "capitalKana": "もりおか",
    "capitalDiffers": true,
    "region": "東北",
    "regionColor": "#8b5cf6",
    "emoji": "🏔️",
    "famous": [
      {
        "name": "わんこそば",
        "emoji": "🍜",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "さんりく海岸",
        "emoji": "🌊",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "なんぶてっき",
        "emoji": "⚱️",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "にほんで 2ばんめに おおきなけん！さんりく海岸は リアス式かいがんが美しい！"
  },
  {
    "id": "miyagi",
    "jis": "04",
    "name": "宮城",
    "kana": "みやぎ",
    "capital": "仙台",
    "capitalKana": "せんだい",
    "capitalDiffers": true,
    "region": "東北",
    "regionColor": "#8b5cf6",
    "emoji": "🍣",
    "famous": [
      {
        "name": "ずんだもち",
        "emoji": "🟢",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "かき",
        "emoji": "🦪",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "たなばた祭り",
        "emoji": "🎋",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "仙台平野・養殖業",
        "emoji": "🌊",
        "difficulty": 2,
        "note": "仙台平野は東北最大の平野。三陸沖の豊かな漁場でカキ・ホタテの養殖業がさかん。カキの生産量は広島に次いで2位。"
      }
    ],
    "fact": "ずんだもちと かきが ゆうめい！たなばた祭りは 日本三大祭りのひとつ！"
  },
  {
    "id": "akita",
    "jis": "05",
    "name": "秋田",
    "kana": "あきた",
    "capital": "秋田",
    "capitalKana": "あきた",
    "capitalDiffers": true,
    "region": "東北",
    "regionColor": "#8b5cf6",
    "emoji": "👺",
    "famous": [
      {
        "name": "なまはげ",
        "emoji": "👺",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "きりたんぽ",
        "emoji": "🍡",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "あきたこまち",
        "emoji": "🌾",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "なまはげが ゆうめい！「わるい子は いねが〜！」というこえで おとずれる！"
  },
  {
    "id": "yamagata",
    "jis": "06",
    "name": "山形",
    "kana": "やまがた",
    "capital": "山形",
    "capitalKana": "やまがた",
    "capitalDiffers": false,
    "region": "東北",
    "regionColor": "#8b5cf6",
    "emoji": "🍒",
    "famous": [
      {
        "name": "さくらんぼ",
        "emoji": "🍒",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "いもに",
        "emoji": "🫕",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "だし（郷土料理）",
        "emoji": "🥣",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "さくらんぼのせいさんりょう にほん1い！山形のさくらんぼは 全国の約70%！"
  },
  {
    "id": "fukushima",
    "jis": "07",
    "name": "福島",
    "kana": "ふくしま",
    "capital": "福島",
    "capitalKana": "ふくしま",
    "capitalDiffers": false,
    "region": "東北",
    "regionColor": "#8b5cf6",
    "emoji": "🍑",
    "famous": [
      {
        "name": "もも",
        "emoji": "🍑",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "あかべこ",
        "emoji": "🐄",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "わっぱめし",
        "emoji": "🍱",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "もものせいさんりょう にほん2い！あかべこは 福島のつたわる おまもり！"
  },
  {
    "id": "ibaraki",
    "jis": "08",
    "name": "茨城",
    "kana": "いばらき",
    "capital": "水戸",
    "capitalKana": "みと",
    "capitalDiffers": true,
    "region": "関東",
    "regionColor": "#ef4444",
    "emoji": "🌹",
    "famous": [
      {
        "name": "れんこん",
        "emoji": "🔗",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "なっとう",
        "emoji": "🫘",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "こうふくやまのバラ",
        "emoji": "🌹",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "霞ヶ浦",
        "emoji": "🏞️",
        "difficulty": 2,
        "note": "霞ヶ浦は琵琶湖に次いで日本で2番目に大きな湖。ワカサギやテナガエビの漁業がさかん。"
      },
      {
        "name": "ピーマン生産量1位",
        "emoji": "🫑",
        "difficulty": 2,
        "note": "茨城県はピーマンの生産量が日本1位。温暖な気候を生かしてメロンの生産量も日本1位。農業県として有名。"
      },
      {
        "name": "偕楽園（日本三名園）",
        "emoji": "🌿",
        "difficulty": 2,
        "note": "水戸にある偕楽園は、金沢の兼六園・岡山の後楽園とならぶ日本三名園のひとつ。梅の名所として有名。"
      }
    ],
    "fact": "れんこんのせいさんりょう にほん1い！こうふくやまは ばらのはなで ゆうめい！"
  },
  {
    "id": "tochigi",
    "jis": "09",
    "name": "栃木",
    "kana": "とちぎ",
    "capital": "宇都宮",
    "capitalKana": "うつのみや",
    "capitalDiffers": true,
    "region": "関東",
    "regionColor": "#ef4444",
    "emoji": "🍓",
    "famous": [
      {
        "name": "いちご（とちおとめ）",
        "emoji": "🍓",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "にっこうとうしょうぐう",
        "emoji": "⛩️",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "ぎょうざ（うつのみや）",
        "emoji": "🥟",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "いちごのせいさんりょう にほん1い！にっこうは 世界遺産にも なっているよ！"
  },
  {
    "id": "gunma",
    "jis": "10",
    "name": "群馬",
    "kana": "ぐんま",
    "capital": "前橋",
    "capitalKana": "まえばし",
    "capitalDiffers": true,
    "region": "関東",
    "regionColor": "#ef4444",
    "emoji": "🐴",
    "famous": [
      {
        "name": "こんにゃく",
        "emoji": "🟫",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "くさつおんせん",
        "emoji": "♨️",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "だるま（だるまいち）",
        "emoji": "🎎",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "こんにゃくのせいさんりょう にほん1い！くさつおんせんは 日本一の名湯！"
  },
  {
    "id": "saitama",
    "jis": "11",
    "name": "埼玉",
    "kana": "さいたま",
    "capital": "さいたま",
    "capitalKana": "さいたま",
    "capitalDiffers": false,
    "region": "関東",
    "regionColor": "#ef4444",
    "emoji": "🎋",
    "famous": [
      {
        "name": "ねぎ（かわごえねぎ）",
        "emoji": "🌿",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "かわごえ（小江戸）",
        "emoji": "🏯",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "ちちぶ",
        "emoji": "⛰️",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "まわりをぜんぶ おかのけんに かこまれた けん！うみがない けんのひとつ！"
  },
  {
    "id": "chiba",
    "jis": "12",
    "name": "千葉",
    "kana": "ちば",
    "capital": "千葉",
    "capitalKana": "ちば",
    "capitalDiffers": false,
    "region": "関東",
    "regionColor": "#ef4444",
    "emoji": "🌻",
    "famous": [
      {
        "name": "ディズニーランド",
        "emoji": "🏰",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "らっかせい",
        "emoji": "🥜",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "なし（なりたのなし）",
        "emoji": "🍐",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "銚子港・水揚げ量1位",
        "emoji": "⛵",
        "difficulty": 2,
        "note": "千葉県銚子港は日本一の水揚げ量を誇る漁港。サバ・イワシ・カツオなどが多く水揚げされる。"
      },
      {
        "name": "成田空港・京葉工業地帯",
        "emoji": "✈️",
        "difficulty": 2,
        "note": "成田国際空港は日本最大の国際空港。東京湾岸には京葉工業地帯が広がり、石油化学・鉄鋼業がさかん。"
      }
    ],
    "fact": "ディズニーランドがある！ちばは やさいとはなの せいさんりょうが にほん上位！"
  },
  {
    "id": "tokyo",
    "jis": "13",
    "name": "東京",
    "kana": "とうきょう",
    "capital": "東京",
    "capitalKana": "とうきょう",
    "capitalDiffers": false,
    "region": "関東",
    "regionColor": "#ef4444",
    "emoji": "🗼",
    "famous": [
      {
        "name": "スカイツリー",
        "emoji": "🗼",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "はなみ（うえのこうえん）",
        "emoji": "🌸",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "にぎすし",
        "emoji": "🍣",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "武蔵野台地・三大都市圏",
        "emoji": "🏙️",
        "difficulty": 2,
        "note": "東京は武蔵野台地に発展した都市。日本の三大都市圏（東京・大阪・名古屋）の中心で、人口・経済ともに日本最大。"
      },
      {
        "name": "印刷・出版業",
        "emoji": "📚",
        "difficulty": 2,
        "note": "東京は出版社・新聞社が集中し、印刷・出版業の生産額が日本1位。全国の本や雑誌の多くが東京で作られる。"
      }
    ],
    "fact": "にほんのしゅと！せかいで いちばん にぎやかなとかいのひとつ！スカイツリーはたかさ634m！"
  },
  {
    "id": "kanagawa",
    "jis": "14",
    "name": "神奈川",
    "kana": "かながわ",
    "capital": "横浜",
    "capitalKana": "よこはま",
    "capitalDiffers": true,
    "region": "関東",
    "regionColor": "#ef4444",
    "emoji": "⚓",
    "famous": [
      {
        "name": "よこはまちゅうかがい",
        "emoji": "🏮",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "かまくら（だいぶつ）",
        "emoji": "🙏",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "しゅうまい",
        "emoji": "🥟",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "よこはまは にほんで2ばんめに おおきなまち！かまくらの大仏は750年いじょうまえにつくられた！"
  },
  {
    "id": "niigata",
    "jis": "15",
    "name": "新潟",
    "kana": "にいがた",
    "capital": "新潟",
    "capitalKana": "にいがた",
    "capitalDiffers": true,
    "region": "中部",
    "regionColor": "#f59e0b",
    "emoji": "🌾",
    "famous": [
      {
        "name": "こしひかり（お米）",
        "emoji": "🌾",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "へぎそば",
        "emoji": "🍜",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "さかた（佐渡ヶ島）",
        "emoji": "🏝️",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "越後平野・米の生産量1位",
        "emoji": "🌾",
        "difficulty": 2,
        "note": "越後平野は日本最大級の稲作平野。信濃川が運ぶ栄養豊かな土壌と雪解け水でコシヒカリが育つ。米の生産量は全国1位。"
      },
      {
        "name": "燕三条・金属洋食器",
        "emoji": "🍴",
        "difficulty": 2,
        "note": "燕三条地域は金属加工の産地。フォーク・スプーンなど金属洋食器の生産量は日本1位。包丁や工具も有名。"
      }
    ],
    "fact": "おこめのせいさんりょう にほん1い！こしひかりは 日本で一番人気のお米！"
  },
  {
    "id": "toyama",
    "jis": "16",
    "name": "富山",
    "kana": "とやま",
    "capital": "富山",
    "capitalKana": "とやま",
    "capitalDiffers": false,
    "region": "中部",
    "regionColor": "#f59e0b",
    "emoji": "🦀",
    "famous": [
      {
        "name": "ますのすし",
        "emoji": "🍣",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "かにりょうり",
        "emoji": "🦀",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "くろべきょう（黒部峡谷）",
        "emoji": "🏔️",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "たてやまは 3000mいじょうある 高い山！くろべダムは にほんいちたかいダム！"
  },
  {
    "id": "ishikawa",
    "jis": "17",
    "name": "石川",
    "kana": "いしかわ",
    "capital": "金沢",
    "capitalKana": "かなざわ",
    "capitalDiffers": true,
    "region": "中部",
    "regionColor": "#f59e0b",
    "emoji": "🦀",
    "famous": [
      {
        "name": "かなざわ（ひがしちゃや）",
        "emoji": "🏯",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "かにりょうり",
        "emoji": "🦀",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "けんろくえん",
        "emoji": "🌿",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "能登半島・金箔",
        "emoji": "✨",
        "difficulty": 2,
        "note": "能登半島は日本海に突き出た半島で、豊かな漁業の宝庫。金沢市は金箔の生産量が日本の99%以上を占める。"
      }
    ],
    "fact": "けんろくえんは 日本三大名園のひとつ！かなざわは「にほんのきょうと」とよばれる！"
  },
  {
    "id": "fukui",
    "jis": "18",
    "name": "福井",
    "kana": "ふくい",
    "capital": "福井",
    "capitalKana": "ふくい",
    "capitalDiffers": false,
    "region": "中部",
    "regionColor": "#f59e0b",
    "emoji": "🦕",
    "famous": [
      {
        "name": "きょうりゅう（化石）",
        "emoji": "🦕",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "えちぜんがに",
        "emoji": "🦀",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "すいじょうきょう（水晶橋）",
        "emoji": "🌉",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "きょうりゅうの化石の発見数 にほん1い！えちぜんがにも ゆうめい！"
  },
  {
    "id": "yamanashi",
    "jis": "19",
    "name": "山梨",
    "kana": "やまなし",
    "capital": "甲府",
    "capitalKana": "こうふ",
    "capitalDiffers": true,
    "region": "中部",
    "regionColor": "#f59e0b",
    "emoji": "🍇",
    "famous": [
      {
        "name": "ぶどう",
        "emoji": "🍇",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "もも",
        "emoji": "🍑",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "ほうとう（郷土料理）",
        "emoji": "🥘",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "ぶどうのせいさんりょう にほん1い！ふじさんは やまなしとしずおかの さかいにある！"
  },
  {
    "id": "nagano",
    "jis": "20",
    "name": "長野",
    "kana": "ながの",
    "capital": "長野",
    "capitalKana": "ながの",
    "capitalDiffers": false,
    "region": "中部",
    "regionColor": "#f59e0b",
    "emoji": "🍎",
    "famous": [
      {
        "name": "りんご",
        "emoji": "🍎",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "そば",
        "emoji": "🍜",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "おやき",
        "emoji": "🥙",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "にほんのスイスとよばれる！むかしはオリンピックがひらかれた まち！"
  },
  {
    "id": "gifu",
    "jis": "21",
    "name": "岐阜",
    "kana": "ぎふ",
    "capital": "岐阜",
    "capitalKana": "ぎふ",
    "capitalDiffers": false,
    "region": "中部",
    "regionColor": "#f59e0b",
    "emoji": "🏘️",
    "famous": [
      {
        "name": "しらかわごう（合掌造り）",
        "emoji": "🏘️",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "かがみやき（陶器）",
        "emoji": "🏺",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "うどん（みのしまうどん）",
        "emoji": "🍜",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "しらかわごうは 世界遺産！合掌造りのいえは 雪でも こわれないように つくられてる！"
  },
  {
    "id": "shizuoka",
    "jis": "22",
    "name": "静岡",
    "kana": "しずおか",
    "capital": "静岡",
    "capitalKana": "しずおか",
    "capitalDiffers": false,
    "region": "中部",
    "regionColor": "#f59e0b",
    "emoji": "🗻",
    "famous": [
      {
        "name": "ふじさん",
        "emoji": "🗻",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "おちゃ（お茶）",
        "emoji": "🍵",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "うなぎ（はままつ）",
        "emoji": "🐍",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "茶の栽培面積1位・伊豆半島",
        "emoji": "🍵",
        "difficulty": 2,
        "note": "静岡は茶の栽培面積が日本1位。牧之原台地が主産地。伊豆半島は温泉・観光地として有名な半島。"
      },
      {
        "name": "天竜杉（人工林）",
        "emoji": "🌲",
        "difficulty": 3,
        "note": "天竜川流域の天竜杉は、人工的に植林・管理された美しい杉林。日本三大人工美林のひとつとして知られる。"
      }
    ],
    "fact": "ふじさんはにほんいちたかいやま！おちゃのせいさんりょうも にほん1い！"
  },
  {
    "id": "aichi",
    "jis": "23",
    "name": "愛知",
    "kana": "あいち",
    "capital": "名古屋",
    "capitalKana": "なごや",
    "capitalDiffers": true,
    "region": "中部",
    "regionColor": "#f59e0b",
    "emoji": "🚗",
    "famous": [
      {
        "name": "みそかつ",
        "emoji": "🍖",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "きしめん",
        "emoji": "🍜",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "トヨタじどうしゃ",
        "emoji": "🚗",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "濃尾平野・中京工業地帯",
        "emoji": "🏭",
        "difficulty": 2,
        "note": "濃尾平野は愛知・岐阜にまたがる広大な平野。中京工業地帯は工業出荷額が日本1位で、自動車を中心とした工業がさかん。"
      }
    ],
    "fact": "とよたじどうしゃのほんしゃがある！みそかつと きしめんが ゆうめい！"
  },
  {
    "id": "mie",
    "jis": "24",
    "name": "三重",
    "kana": "みえ",
    "capital": "津",
    "capitalKana": "つ",
    "capitalDiffers": true,
    "region": "近畿",
    "regionColor": "#ec4899",
    "emoji": "⛩️",
    "famous": [
      {
        "name": "いせじんぐう（伊勢神宮）",
        "emoji": "⛩️",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "てながえび（伊勢えび）",
        "emoji": "🦐",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "しんじゅ（真珠）",
        "emoji": "💎",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "いせじんぐうは 2000年いじょうのれきしがある！てながえびも ゆうめい！"
  },
  {
    "id": "shiga",
    "jis": "25",
    "name": "滋賀",
    "kana": "しが",
    "capital": "大津",
    "capitalKana": "おおつ",
    "capitalDiffers": false,
    "region": "近畿",
    "regionColor": "#ec4899",
    "emoji": "🏊",
    "famous": [
      {
        "name": "びわこ（琵琶湖）",
        "emoji": "🏊",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "おうみぎゅう（近江牛）",
        "emoji": "🐄",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "ひこにゃん（彦根城）",
        "emoji": "🏯",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "びわこは にほんいちおおきな湖！びわこのみずは ちかくの何百万人もの人が つかってる！"
  },
  {
    "id": "kyoto",
    "jis": "26",
    "name": "京都",
    "kana": "きょうと",
    "capital": "京都",
    "capitalKana": "きょうと",
    "capitalDiffers": false,
    "region": "近畿",
    "regionColor": "#ec4899",
    "emoji": "⛩️",
    "famous": [
      {
        "name": "きんかくじ（金閣寺）",
        "emoji": "🏯",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "げいしゃ（舞妓）",
        "emoji": "💃",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "にしきいちば（錦市場）",
        "emoji": "🛍️",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "京都盆地・西陣織",
        "emoji": "🧵",
        "difficulty": 2,
        "note": "京都は盆地の地形で夏暑く冬寒い。西陣織は高級絹織物の伝統工芸で、数百年の歴史を持つ京都を代表する産業。"
      }
    ],
    "fact": "むかしのみやこ！1000年いじょう まえからのおてらやじんじゃがいっぱい！"
  },
  {
    "id": "osaka",
    "jis": "27",
    "name": "大阪",
    "kana": "おおさか",
    "capital": "大阪",
    "capitalKana": "おおさか",
    "capitalDiffers": false,
    "region": "近畿",
    "regionColor": "#ec4899",
    "emoji": "🐙",
    "famous": [
      {
        "name": "たこやき",
        "emoji": "🐙",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "おこのみやき",
        "emoji": "🥞",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "ユニバーサルスタジオジャパン",
        "emoji": "🎡",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "阪神工業地帯・商業",
        "emoji": "🏭",
        "difficulty": 2,
        "note": "大阪・神戸を中心とする阪神工業地帯は工業出荷額が日本2位。大阪は「天下の台所」とよばれた商業の中心都市。"
      }
    ],
    "fact": "たこやき・おこのみやきのまち！なんばはとても にぎやか！ユニバーサルスタジオジャパンもある！"
  },
  {
    "id": "hyogo",
    "jis": "28",
    "name": "兵庫",
    "kana": "ひょうご",
    "capital": "神戸",
    "capitalKana": "こうべ",
    "capitalDiffers": true,
    "region": "近畿",
    "regionColor": "#ec4899",
    "emoji": "🧅",
    "famous": [
      {
        "name": "こうべぎゅう（神戸牛）",
        "emoji": "🥩",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "たまねぎ（あわじしま）",
        "emoji": "🧅",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "ひめじじょう（姫路城）",
        "emoji": "🏯",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "ひめじじょうは 世界遺産！日本で いちばん うつくしいお城とよばれてる！"
  },
  {
    "id": "nara",
    "jis": "29",
    "name": "奈良",
    "kana": "なら",
    "capital": "奈良",
    "capitalKana": "なら",
    "capitalDiffers": false,
    "region": "近畿",
    "regionColor": "#ec4899",
    "emoji": "🦌",
    "famous": [
      {
        "name": "しか（奈良公園）",
        "emoji": "🦌",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "だいぶつ（東大寺）",
        "emoji": "🙏",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "ならまち（古い町並み）",
        "emoji": "🏘️",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "しかが 1400頭いじょう くらしている！ならこうえんで えさをあげられるよ！"
  },
  {
    "id": "wakayama",
    "jis": "30",
    "name": "和歌山",
    "kana": "わかやま",
    "capital": "和歌山",
    "capitalKana": "わかやま",
    "capitalDiffers": false,
    "region": "近畿",
    "regionColor": "#ec4899",
    "emoji": "🍊",
    "famous": [
      {
        "name": "みかん",
        "emoji": "🍊",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "こうやさん（高野山）",
        "emoji": "⛩️",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "なちのたき（那智の滝）",
        "emoji": "💧",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "みかんのせいさんりょう にほん1い！こうやさんは 世界遺産のおてら！"
  },
  {
    "id": "tottori",
    "jis": "31",
    "name": "鳥取",
    "kana": "とっとり",
    "capital": "鳥取",
    "capitalKana": "とっとり",
    "capitalDiffers": false,
    "region": "中国",
    "regionColor": "#10b981",
    "emoji": "🏜️",
    "famous": [
      {
        "name": "とっとりさきゅう（砂丘）",
        "emoji": "🏜️",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "まつばがに",
        "emoji": "🦀",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "なし（二十世紀なし）",
        "emoji": "🍐",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "とっとりさきゅうは にほんいちおおきな 砂漠みたいなばしょ！なしのせいさんりょうも にほん1い！"
  },
  {
    "id": "shimane",
    "jis": "32",
    "name": "島根",
    "kana": "しまね",
    "capital": "松江",
    "capitalKana": "まつえ",
    "capitalDiffers": true,
    "region": "中国",
    "regionColor": "#10b981",
    "emoji": "⛩️",
    "famous": [
      {
        "name": "いずもたいしゃ（出雲大社）",
        "emoji": "⛩️",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "しじみ（宍道湖）",
        "emoji": "🐚",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "あかてがに",
        "emoji": "🦀",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "いずもたいしゃは ふしぎなえんむすびで ゆうめい！むかしは むすびの神様がたくさん あつまった！"
  },
  {
    "id": "okayama",
    "jis": "33",
    "name": "岡山",
    "kana": "おかやま",
    "capital": "岡山",
    "capitalKana": "おかやま",
    "capitalDiffers": false,
    "region": "中国",
    "regionColor": "#10b981",
    "emoji": "🍑",
    "famous": [
      {
        "name": "もも（白桃）",
        "emoji": "🍑",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "もむぎ（マスカット）",
        "emoji": "🍇",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "こうらくえん（後楽園）",
        "emoji": "🌿",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "瀬戸内海沿岸・温暖な気候",
        "emoji": "🌊",
        "difficulty": 2,
        "note": "岡山は瀬戸内海に面し、年間晴れの日数が日本有数。温暖な気候を生かしてマスカット・白桃など果物の栽培がさかん。"
      }
    ],
    "fact": "こうらくえんは 日本三大名園のひとつ！ももとぶどうのせいさんりょうが にほん上位！"
  },
  {
    "id": "hiroshima",
    "jis": "34",
    "name": "広島",
    "kana": "ひろしま",
    "capital": "広島",
    "capitalKana": "ひろしま",
    "capitalDiffers": false,
    "region": "中国",
    "regionColor": "#10b981",
    "emoji": "🕊️",
    "famous": [
      {
        "name": "おこのみやき",
        "emoji": "🥞",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "かき",
        "emoji": "🦪",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "へいわきねんこうえん（原爆ドーム）",
        "emoji": "🕊️",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "自動車工業・厳島神社",
        "emoji": "🚗",
        "difficulty": 2,
        "note": "広島はマツダの本社がある自動車工業の拠点。厳島神社（宮島）は海に鳥居が立つ絶景で、日本三景のひとつ。"
      },
      {
        "name": "中国山地・過疎化",
        "emoji": "⛰️",
        "difficulty": 3,
        "note": "中国山地は広島・島根・鳥取にまたがる山地。山間部は高齢化・過疎化が進み、日本の農山村問題の象徴として入試に出る。"
      }
    ],
    "fact": "おこのみやきとかきが ゆうめい！へいわきねんこうえんがある！"
  },
  {
    "id": "yamaguchi",
    "jis": "35",
    "name": "山口",
    "kana": "やまぐち",
    "capital": "山口",
    "capitalKana": "やまぐち",
    "capitalDiffers": false,
    "region": "中国",
    "regionColor": "#10b981",
    "emoji": "🐡",
    "famous": [
      {
        "name": "ふぐりょうり（下関）",
        "emoji": "🐡",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "あきよしどう（秋芳洞）",
        "emoji": "🦇",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "きんたいきょう（錦帯橋）",
        "emoji": "🌉",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "ふぐのせいさんりょう にほん1い！下関のふぐは「ふく」とよばれて えんぎがいい！"
  },
  {
    "id": "tokushima",
    "jis": "36",
    "name": "徳島",
    "kana": "とくしま",
    "capital": "徳島",
    "capitalKana": "とくしま",
    "capitalDiffers": false,
    "region": "四国",
    "regionColor": "#f97316",
    "emoji": "💃",
    "famous": [
      {
        "name": "あわおどり（阿波踊り）",
        "emoji": "💃",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "すだち",
        "emoji": "🍋",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "うずしお（鳴門）",
        "emoji": "🌀",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "あわおどりは 400年いじょうのれきしがある！なるとのうずしおは せかいでも大きいクラス！"
  },
  {
    "id": "kagawa",
    "jis": "37",
    "name": "香川",
    "kana": "かがわ",
    "capital": "高松",
    "capitalKana": "たかまつ",
    "capitalDiffers": true,
    "region": "四国",
    "regionColor": "#f97316",
    "emoji": "🍜",
    "famous": [
      {
        "name": "さぬきうどん",
        "emoji": "🍜",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "こんぴらさん（金刀比羅宮）",
        "emoji": "⛩️",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "しょうどしま（小豆島）",
        "emoji": "🏝️",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "うどんのせいさんりょう にほん1い！さぬきうどんは もちもちで あまい！"
  },
  {
    "id": "ehime",
    "jis": "38",
    "name": "愛媛",
    "kana": "えひめ",
    "capital": "松山",
    "capitalKana": "まつやま",
    "capitalDiffers": false,
    "region": "四国",
    "regionColor": "#f97316",
    "emoji": "🍊",
    "famous": [
      {
        "name": "みかん",
        "emoji": "🍊",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "どうごおんせん（道後温泉）",
        "emoji": "♨️",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "まつやまじょう（松山城）",
        "emoji": "🏯",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "みかんのせいさんりょう にほん2い！どうごおんせんは 3000年いじょうのれきしがある！"
  },
  {
    "id": "kochi",
    "jis": "39",
    "name": "高知",
    "kana": "こうち",
    "capital": "高知",
    "capitalKana": "こうち",
    "capitalDiffers": true,
    "region": "四国",
    "regionColor": "#f97316",
    "emoji": "🐟",
    "famous": [
      {
        "name": "かつおのたたき",
        "emoji": "🐟",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "よさこい祭り",
        "emoji": "🎊",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "しまんとがわ（四万十川）",
        "emoji": "🌊",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "かつおのたたきは 高知の名物！しまんとがわは にほんさいごの清流といわれてる！"
  },
  {
    "id": "fukuoka",
    "jis": "40",
    "name": "福岡",
    "kana": "ふくおか",
    "capital": "福岡",
    "capitalKana": "ふくおか",
    "capitalDiffers": false,
    "region": "九州",
    "regionColor": "#22c55e",
    "emoji": "🍜",
    "famous": [
      {
        "name": "とんこつラーメン",
        "emoji": "🍜",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "もつなべ",
        "emoji": "🍲",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "めんたいこ",
        "emoji": "🎣",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "筑紫平野・北九州工業地帯",
        "emoji": "🌾",
        "difficulty": 2,
        "note": "筑紫平野は九州最大の平野で米作りがさかん。北九州工業地帯は日本の近代工業の発祥地で、鉄鋼・化学工業で発展した。"
      },
      {
        "name": "筑後川（筑紫次郎）",
        "emoji": "🌊",
        "difficulty": 3,
        "note": "筑後川は九州最大の川。利根川（坂東太郎）・吉野川（四国三郎）とともに「日本三大暴れ川」とよばれ、「筑紫次郎」の異名がある。"
      }
    ],
    "fact": "とんこつラーメンのふるさと！しゅうがくりょこうでもにんきのスポット！"
  },
  {
    "id": "saga",
    "jis": "41",
    "name": "佐賀",
    "kana": "さが",
    "capital": "佐賀",
    "capitalKana": "さが",
    "capitalDiffers": true,
    "region": "九州",
    "regionColor": "#22c55e",
    "emoji": "🏺",
    "famous": [
      {
        "name": "ありたやき（有田焼）",
        "emoji": "🏺",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "むつごろう（有明海）",
        "emoji": "🐠",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "バルーン（気球）",
        "emoji": "🎈",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "ありたやきは 400年いじょうのれきしをもつ やきもの！せかいじゅうに ゆしゅつされた！"
  },
  {
    "id": "nagasaki",
    "jis": "42",
    "name": "長崎",
    "kana": "ながさき",
    "capital": "長崎",
    "capitalKana": "ながさき",
    "capitalDiffers": false,
    "region": "九州",
    "regionColor": "#22c55e",
    "emoji": "⛪",
    "famous": [
      {
        "name": "ちゃんぽん",
        "emoji": "🍜",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "グラバー邸（洋館）",
        "emoji": "⛪",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "かすてら",
        "emoji": "🍰",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "にほんで さいしょに がいこくとこうりゅうしたまち！かすてらは ポルトガルから つたわった！"
  },
  {
    "id": "kumamoto",
    "jis": "43",
    "name": "熊本",
    "kana": "くまもと",
    "capital": "熊本",
    "capitalKana": "くまもと",
    "capitalDiffers": false,
    "region": "九州",
    "regionColor": "#22c55e",
    "emoji": "🐻",
    "famous": [
      {
        "name": "くまもん（マスコット）",
        "emoji": "🐻",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "からしれんこん",
        "emoji": "🥬",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "あそさん（阿蘇山）",
        "emoji": "🌋",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "あそさんは 世界一大きなカルデラ！くまもんは 世界で一番有名な ゆるキャラ！"
  },
  {
    "id": "oita",
    "jis": "44",
    "name": "大分",
    "kana": "おおいた",
    "capital": "大分",
    "capitalKana": "おおいた",
    "capitalDiffers": false,
    "region": "九州",
    "regionColor": "#22c55e",
    "emoji": "♨️",
    "famous": [
      {
        "name": "べっぷおんせん（別府温泉）",
        "emoji": "♨️",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "とり天（とりのてんぷら）",
        "emoji": "🍗",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "ふぐりょうり",
        "emoji": "🐡",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "おんせんのゆりょう にほん1い！別府のおんせんは はでな「じごくめぐり」が ゆうめい！"
  },
  {
    "id": "miyazaki",
    "jis": "45",
    "name": "宮崎",
    "kana": "みやざき",
    "capital": "宮崎",
    "capitalKana": "みやざき",
    "capitalDiffers": false,
    "region": "九州",
    "regionColor": "#22c55e",
    "emoji": "🌴",
    "famous": [
      {
        "name": "マンゴー",
        "emoji": "🥭",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "チキン南蛮",
        "emoji": "🍗",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "さきとうばる（鬼の洗濯板）",
        "emoji": "🏖️",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "マンゴーのせいさんりょう にほん1い！チキン南蛮は 宮崎うまれの りょうり！"
  },
  {
    "id": "kagoshima",
    "jis": "46",
    "name": "鹿児島",
    "kana": "かごしま",
    "capital": "鹿児島",
    "capitalKana": "かごしま",
    "capitalDiffers": true,
    "region": "九州",
    "regionColor": "#22c55e",
    "emoji": "🌋",
    "famous": [
      {
        "name": "さくらじま（桜島）",
        "emoji": "🌋",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "いもじょうちゅう（芋焼酎）",
        "emoji": "🍶",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "さつまあげ",
        "emoji": "🍢",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "さくらじまは いつも けむりをあげている かつかざん！かごしまは さつまいもも ゆうめい！"
  },
  {
    "id": "okinawa",
    "jis": "47",
    "name": "沖縄",
    "kana": "おきなわ",
    "capital": "那覇",
    "capitalKana": "なは",
    "capitalDiffers": false,
    "region": "沖縄",
    "regionColor": "#06b6d4",
    "emoji": "🌺",
    "famous": [
      {
        "name": "ちんすこう",
        "emoji": "🍪",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "ゴーヤー",
        "emoji": "🥒",
        "difficulty": 1,
        "note": ""
      },
      {
        "name": "しゅりじょう（首里城）",
        "emoji": "🏯",
        "difficulty": 1,
        "note": ""
      }
    ],
    "fact": "にほんで いちばん みなみにある！うみが とてもきれいで サンゴしょうがたくさん！"
  }
]

// 地方グループ
export const REGIONS = ['北海道','東北','関東','中部','近畿','中国','四国','九州','沖縄'] as const
export type Region = typeof REGIONS[number]

export function getPrefecturesByRegion(region: Region): Prefecture[] {
  return PREFECTURES.filter(p => p.region === region)
}

export function getPrefectureById(id: string): Prefecture | undefined {
  return PREFECTURES.find(p => p.id === id)
}

// 県庁所在地が県名と異なる都道府県（クイズで重点出題）
export const CAPITAL_DIFFERS_PREFS = PREFECTURES.filter(p => p.capitalDiffers)
