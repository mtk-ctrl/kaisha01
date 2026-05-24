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
        "name": "面積日本一",
        "emoji": "📐",
        "difficulty": 2,
        "note": "都道府県で最も広い。四国の約2.2倍"
      },
      {
        "name": "牛乳・乳製品生産量日本一",
        "emoji": "🐄",
        "difficulty": 2,
        "note": "根釧台地・十勝平野の酪農が日本最大"
      },
      {
        "name": "知床（世界自然遺産）",
        "emoji": "🦅",
        "difficulty": 2,
        "note": "2005年ユネスコ世界自然遺産登録。ヒグマ・シャチ・流氷が有名"
      },
      {
        "name": "石狩平野",
        "emoji": "🌾",
        "difficulty": 2,
        "note": "北海道最大の平野。米作地帯"
      },
      {
        "name": "アイヌ民族",
        "emoji": "🏹",
        "difficulty": 3,
        "note": "北海道の先住民族。独自の言語・文化を持つ。2019年にアイヌ民族支援法制定"
      },
      {
        "name": "大雪山系・旭岳",
        "emoji": "⛰️",
        "difficulty": 3,
        "note": "北海道最高峰・旭岳（2291m）を含む山群。世界有数の雪質のスキー場"
      },
      {
        "name": "屯田兵・開拓の歴史",
        "emoji": "⚔️",
        "difficulty": 3,
        "note": "明治時代、政府が北海道開拓のために「屯田兵」を送り込んだ。農業と防衛を兼ねた兵士が各地に入植し、現在の北海道の基盤を作った。"
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
        "name": "りんご生産量日本一",
        "emoji": "🍎",
        "difficulty": 2,
        "note": "全国シェア約60%。津軽平野が主産地"
      },
      {
        "name": "本州最北端（大間岬）",
        "emoji": "📍",
        "difficulty": 2,
        "note": "大間崎は本州の最北端。マグロの一本釣りで有名"
      },
      {
        "name": "白神山地（世界自然遺産）",
        "emoji": "🌲",
        "difficulty": 2,
        "note": "ブナの原生林。1993年世界自然遺産登録（日本初）"
      },
      {
        "name": "三内丸山遺跡",
        "emoji": "🏛️",
        "difficulty": 3,
        "note": "日本最大級の縄文時代集落跡（約5500〜4000年前）。2021年世界文化遺産登録"
      },
      {
        "name": "青函トンネル",
        "emoji": "🚇",
        "difficulty": 3,
        "note": "津軽海峡の海底を通る世界最長級の鉄道トンネル（全長53.85km）。1988年開通"
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
      },
      {
        "name": "面積全国2位",
        "emoji": "📐",
        "difficulty": 2,
        "note": "北海道に次ぐ広さ。四国とほぼ同じ面積"
      },
      {
        "name": "三陸海岸（リアス海岸）",
        "emoji": "🌊",
        "difficulty": 2,
        "note": "入り組んだ地形で養殖業が盛ん。ワカメ・ホタテ・カキが有名"
      },
      {
        "name": "北上川",
        "emoji": "🏞️",
        "difficulty": 2,
        "note": "東北最長の川。流域に北上平野が広がる"
      },
      {
        "name": "南部鉄器",
        "emoji": "⚙️",
        "difficulty": 2,
        "note": "伝統工芸品。急須・フライパンなど世界で人気"
      },
      {
        "name": "平泉（世界文化遺産）",
        "emoji": "🏯",
        "difficulty": 3,
        "note": "中尊寺金色堂（1124年建立）。奥州藤原氏の都。2011年世界文化遺産"
      },
      {
        "name": "東日本大震災の津波被害",
        "emoji": "🌊",
        "difficulty": 3,
        "note": "2011年3月11日。三陸海岸が甚大な被害。リアス海岸の地形が津波を増幅した"
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
        "name": "松島（日本三景）",
        "emoji": "🏝️",
        "difficulty": 2,
        "note": "260余の島が浮かぶ景勝地。日本三景（天橋立・宮島）のひとつ"
      },
      {
        "name": "カキ（牡蠣）養殖",
        "emoji": "🦪",
        "difficulty": 2,
        "note": "三陸の養殖カキは日本有数の生産量"
      },
      {
        "name": "仙台平野・ひとめぼれ",
        "emoji": "🌾",
        "difficulty": 2,
        "note": "東北最大の平野。ブランド米「ひとめぼれ」の産地"
      },
      {
        "name": "東日本大震災（2011年）",
        "emoji": "🌊",
        "difficulty": 3,
        "note": "M9.0の巨大地震と津波。約2万人が犠牲に。仙台平野も津波に呑まれた"
      },
      {
        "name": "伊達政宗（仙台藩）",
        "emoji": "⚔️",
        "difficulty": 3,
        "note": "「独眼竜」仙台藩初代藩主。仙台城（青葉城）を築く。江戸時代最大の外様大名の一つ"
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
      },
      {
        "name": "八郎潟（日本最大の干拓地）",
        "emoji": "🌿",
        "difficulty": 2,
        "note": "かつて日本第2位の湖。戦後に干拓され大潟村に。広大な農地が生まれた"
      },
      {
        "name": "白神山地（世界自然遺産）",
        "emoji": "🌲",
        "difficulty": 2,
        "note": "青森と跨るブナ原生林。1993年世界自然遺産"
      },
      {
        "name": "秋田杉（日本三大美林）",
        "emoji": "🌲",
        "difficulty": 2,
        "note": "木曽ヒノキ・青森ヒバと並ぶ日本三大美林のひとつ"
      },
      {
        "name": "大潟村（干拓の歴史）",
        "emoji": "🏗️",
        "difficulty": 3,
        "note": "八郎潟を干拓した村。干拓完了後に減反政策が始まり、農業政策の矛盾を示す象徴に"
      },
      {
        "name": "高齢化率・人口減少",
        "emoji": "📉",
        "difficulty": 3,
        "note": "高齢化率が全国トップ水準。少子化・過疎化問題を考える上でのモデルケース"
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
      },
      {
        "name": "さくらんぼ生産量日本一",
        "emoji": "🍒",
        "difficulty": 2,
        "note": "全国シェア約70%。山形盆地が主産地。佐藤錦が有名"
      },
      {
        "name": "最上川",
        "emoji": "🌊",
        "difficulty": 2,
        "note": "山形県のほぼ全域を流れる川。松尾芭蕉「五月雨をあつめて早し最上川」"
      },
      {
        "name": "西洋なし（ラ・フランス）生産量日本一",
        "emoji": "🍐",
        "difficulty": 2,
        "note": "全国シェア約70%。山形がラ・フランス普及の中心地"
      },
      {
        "name": "上杉鷹山（米沢藩）",
        "emoji": "👑",
        "difficulty": 3,
        "note": "財政危機の藩を立て直した名君。「なせば成る」の言葉でも有名。ケネディ大統領が尊敬した日本人"
      },
      {
        "name": "出羽三山（羽黒山・月山・湯殿山）",
        "emoji": "⛰️",
        "difficulty": 3,
        "note": "修験道の聖地。全国から修行者が集まる信仰の山"
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
      },
      {
        "name": "猪苗代湖（日本第4位の湖）",
        "emoji": "🏞️",
        "difficulty": 2,
        "note": "面積104km²。日本で4番目に大きい湖。磐梯山のふもとにある"
      },
      {
        "name": "磐梯山（活火山）",
        "emoji": "🌋",
        "difficulty": 2,
        "note": "1888年に大爆発した活火山。爆発で山体崩壊し、裏磐梯に多くの湖が誕生した"
      },
      {
        "name": "もも・梨生産上位",
        "emoji": "🍑",
        "difficulty": 2,
        "note": "福島盆地は全国有数の果物産地"
      },
      {
        "name": "東日本大震災・原発事故（2011年）",
        "emoji": "☢️",
        "difficulty": 3,
        "note": "東京電力福島第一原発が事故。広範囲に避難区域が設定され、多くの人が故郷を離れた"
      },
      {
        "name": "会津藩（戊辰戦争）",
        "emoji": "⚔️",
        "difficulty": 3,
        "note": "明治維新の際、新政府軍と戦った藩。会津若松城（鶴ヶ城）が舞台。白虎隊の悲劇でも有名"
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
        "name": "メロン生産量日本一",
        "emoji": "🍈",
        "difficulty": 2,
        "note": "鉾田市など水はけのよい砂地で栽培。全国シェア約25%"
      },
      {
        "name": "レンコン生産量日本一",
        "emoji": "🌿",
        "difficulty": 2,
        "note": "霞ヶ浦周辺の水田地帯で全国シェア約50%"
      },
      {
        "name": "霞ヶ浦（日本第2位の湖）",
        "emoji": "🏞️",
        "difficulty": 2,
        "note": "面積約220km²。琵琶湖に次ぎ日本で2番目に大きい"
      },
      {
        "name": "筑波研究学園都市",
        "emoji": "🔬",
        "difficulty": 2,
        "note": "国の研究機関・大学が集まる科学都市。つくばエクスプレスで東京と接続"
      },
      {
        "name": "足尾銅山鉱毒事件",
        "emoji": "⚠️",
        "difficulty": 3,
        "note": "日本初の公害問題（明治時代）。渡良瀬川が氾濫し茨城・栃木・群馬・埼玉の農地を汚染"
      },
      {
        "name": "水戸藩（徳川御三家）",
        "emoji": "🏯",
        "difficulty": 3,
        "note": "徳川光圀（水戸黄門）で有名な御三家のひとつ。日本最大の大名庭園「偕楽園」（日本三名園）"
      },
      {
        "name": "偕楽園（日本三名園）",
        "emoji": "🌿",
        "difficulty": 2,
        "note": "水戸市にある偕楽園は、金沢の兼六園・岡山の後楽園とならぶ日本三名園のひとつ。約3000本の梅が咲く梅の名所。"
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
      },
      {
        "name": "いちご生産量日本一",
        "emoji": "🍓",
        "difficulty": 2,
        "note": "全国シェア約15%。とちおとめ・スカイベリーが有名"
      },
      {
        "name": "那須岳（活火山群）",
        "emoji": "🌋",
        "difficulty": 2,
        "note": "栃木北部の活火山群。観光地・牧場が広がる高原リゾート"
      },
      {
        "name": "日光東照宮（世界遺産）",
        "emoji": "⛩️",
        "difficulty": 2,
        "note": "1999年世界文化遺産。徳川家康を祀る神社。「眠り猫」「三猿」「陽明門」が有名"
      },
      {
        "name": "足尾銅山鉱毒事件",
        "emoji": "⚠️",
        "difficulty": 3,
        "note": "日本初の公害問題（明治時代）。渡良瀬川流域の農地・漁業が壊滅的被害"
      },
      {
        "name": "田中正造",
        "emoji": "👨",
        "difficulty": 3,
        "note": "足尾鉱毒問題を天皇に直訴した栃木県選出の代議士。日本の公害運動・住民運動の原点"
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
      },
      {
        "name": "キャベツ生産量日本一",
        "emoji": "🥬",
        "difficulty": 2,
        "note": "嬬恋村は夏キャベツの全国最大産地。標高が高く冷涼な気候が適している"
      },
      {
        "name": "富岡製糸場（世界文化遺産）",
        "emoji": "🏭",
        "difficulty": 2,
        "note": "1872年設立の官営工場。フランスの技術を導入。2014年世界文化遺産登録"
      },
      {
        "name": "利根川の源流",
        "emoji": "🏔️",
        "difficulty": 2,
        "note": "「坂東太郎」と呼ばれる日本最大流域面積の川の源流が群馬の大水上山にある"
      },
      {
        "name": "草津温泉（日本三名泉）",
        "emoji": "♨️",
        "difficulty": 2,
        "note": "有馬温泉・下呂温泉と並ぶ日本三名泉のひとつ。強酸性の泉質が特徴"
      },
      {
        "name": "富岡製糸場と近代産業化",
        "emoji": "🧵",
        "difficulty": 3,
        "note": "明治政府が殖産興業政策として建設。フランス人技師ブリューナが指導。蚕の繭から生糸を生産"
      },
      {
        "name": "上州のからっ風",
        "emoji": "💨",
        "difficulty": 3,
        "note": "冬に吹く乾燥した北西風（赤城おろし）。「上州名物かかあ天下とからっ風」"
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
      },
      {
        "name": "内陸県（海なし県）",
        "emoji": "🗺️",
        "difficulty": 2,
        "note": "海に面していない8都県のひとつ"
      },
      {
        "name": "深谷ねぎ生産全国上位",
        "emoji": "🌱",
        "difficulty": 2,
        "note": "深谷市は全国有数のねぎ産地。渋沢栄一の出身地でもある"
      },
      {
        "name": "荒川",
        "emoji": "🌊",
        "difficulty": 2,
        "note": "秩父山地を源流とし東京湾に注ぐ。流域に川越など歴史ある街が点在"
      },
      {
        "name": "渋沢栄一（深谷市出身）",
        "emoji": "💴",
        "difficulty": 3,
        "note": "日本資本主義の父。多くの会社設立に関わった実業家。2024年発行の新一万円札の肖像"
      },
      {
        "name": "川越（小江戸）と江戸時代の交通",
        "emoji": "🏘️",
        "difficulty": 3,
        "note": "蔵造りの街並みが残る。江戸時代に江戸への物資供給地として栄えた"
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
        "name": "落花生（ピーナッツ）生産量日本一",
        "emoji": "🥜",
        "difficulty": 2,
        "note": "全国シェア約80%。八街市が主産地"
      },
      {
        "name": "なし生産量日本一（時期）",
        "emoji": "🍐",
        "difficulty": 2,
        "note": "市川・松戸・白井などが産地。「幸水」「豊水」が有名"
      },
      {
        "name": "九十九里浜",
        "emoji": "🏖️",
        "difficulty": 2,
        "note": "約66kmの砂浜海岸。日本の代表的な砂浜のひとつ"
      },
      {
        "name": "成田国際空港",
        "emoji": "✈️",
        "difficulty": 2,
        "note": "国際線の発着数が多い日本最大級の国際空港。1978年開港"
      },
      {
        "name": "房総半島と暖流（黒潮）",
        "emoji": "🌊",
        "difficulty": 3,
        "note": "太平洋と東京湾に挟まれた半島。黒潮の影響で温暖。花卉・野菜の促成栽培が盛ん"
      },
      {
        "name": "千葉港（輸入コンテナ取扱量）",
        "emoji": "🚢",
        "difficulty": 3,
        "note": "東京湾岸に位置する大規模港湾。製鉄所・石油コンビナートが集積する京葉工業地域の一部"
      },
      {
        "name": "銚子港・水揚げ量日本一",
        "emoji": "⛵",
        "difficulty": 2,
        "note": "千葉県銚子港は年間水揚げ量が日本一を争う日本最大級の漁港。サバ・イワシ・カツオなどが多く水揚げされる。"
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
        "name": "日本の首都・最大都市",
        "emoji": "🏙️",
        "difficulty": 2,
        "note": "人口約1400万人（都のみ）。周辺含む首都圏は約3500万人で世界最大規模"
      },
      {
        "name": "小笠原諸島（世界自然遺産）",
        "emoji": "🏝️",
        "difficulty": 2,
        "note": "東京から約1000km南。2011年世界自然遺産登録。固有種が多い「東洋のガラパゴス」"
      },
      {
        "name": "東京湾（埋め立て地）",
        "emoji": "🌊",
        "difficulty": 2,
        "note": "江戸時代から埋め立てで拡大。羽田空港・夢の島も埋め立て地"
      },
      {
        "name": "江戸幕府（1603〜1868年）",
        "emoji": "🏯",
        "difficulty": 3,
        "note": "徳川家康が開いた幕府。江戸（現東京）を中心に265年間続いた日本の政治の中心地"
      },
      {
        "name": "小笠原諸島の固有種・生態系",
        "emoji": "🦎",
        "difficulty": 3,
        "note": "大陸と一度も陸続きになったことがない海洋島。オガサワラオオコウモリ・グリーンアノールなど固有種が多い"
      },
      {
        "name": "武蔵野台地・三大都市圏の中心",
        "emoji": "🏙️",
        "difficulty": 2,
        "note": "東京は武蔵野台地の東端に発展した都市。三大都市圏（東京・大阪・名古屋）の中心で、人口・経済・文化のあらゆる面で日本の中心。"
      },
      {
        "name": "印刷・出版業",
        "emoji": "📚",
        "difficulty": 2,
        "note": "東京は出版社・新聞社が集中し、印刷・出版業の生産額が日本一。全国で読まれる本・雑誌・新聞の多くが東京で作られ全国に流通する。"
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
      },
      {
        "name": "横浜市（人口日本一の市）",
        "emoji": "🏙️",
        "difficulty": 2,
        "note": "人口約380万人。全国の市の中で最多（政令指定都市）"
      },
      {
        "name": "箱根温泉・関所",
        "emoji": "♨️",
        "difficulty": 2,
        "note": "江戸時代の東海道の難所「箱根の関」。現在も温泉地として有名"
      },
      {
        "name": "相模川・多摩川",
        "emoji": "🏞️",
        "difficulty": 2,
        "note": "神奈川県内を流れる主要な川。丹沢山地が源流"
      },
      {
        "name": "黒船来航・横浜開港（1853・1859年）",
        "emoji": "⛵",
        "difficulty": 3,
        "note": "ペリーが浦賀に来航し開国を迫った。翌年に横浜港が開港し文明開化が始まる"
      },
      {
        "name": "横須賀・米軍基地",
        "emoji": "🚢",
        "difficulty": 3,
        "note": "日米安保条約に基づく米海軍基地が置かれる。日本の安全保障政策と深く関わる"
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
        "name": "コシヒカリ（米）生産量日本一",
        "emoji": "🌾",
        "difficulty": 2,
        "note": "越後平野が主産地。コシヒカリ発祥の地（育成は新潟・長野）"
      },
      {
        "name": "信濃川（日本最長の川）",
        "emoji": "🏞️",
        "difficulty": 2,
        "note": "全長367km。長野県では千曲川と呼ばれる。流域に越後平野を形成"
      },
      {
        "name": "佐渡島・トキ",
        "emoji": "🦢",
        "difficulty": 2,
        "note": "国の特別天然記念物トキを保護・繁殖。佐渡金山も世界遺産申請中"
      },
      {
        "name": "新潟水俣病（四大公害病）",
        "emoji": "⚠️",
        "difficulty": 3,
        "note": "阿賀野川流域で発生した有機水銀中毒（第二水俣病）。昭和電工鹿瀬工場が原因。1965年発覚"
      },
      {
        "name": "佐渡金山の歴史",
        "emoji": "⛏️",
        "difficulty": 3,
        "note": "江戸時代に幕府の直轄金山。当時世界最大級の金山のひとつ。現在世界文化遺産登録を目指す"
      },
      {
        "name": "燕三条・金属洋食器",
        "emoji": "🍴",
        "difficulty": 2,
        "note": "燕三条地域は金属加工の一大産地。フォーク・スプーンなど金属洋食器の生産量は日本一。ステンレス包丁・工具も全国シェアが高い。"
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
      },
      {
        "name": "黒部ダム（日本一高いアーチ式）",
        "emoji": "🏗️",
        "difficulty": 2,
        "note": "高さ186m。1963年完成。日本最高のアーチ式コンクリートダム"
      },
      {
        "name": "立山連峰（3000m級）",
        "emoji": "⛰️",
        "difficulty": 2,
        "note": "富山湾から立山（3015m）まで標高差が一気に3000m以上。「日本の屋根」"
      },
      {
        "name": "富山湾（天然の生け簀）",
        "emoji": "🐟",
        "difficulty": 2,
        "note": "深海魚・ホタルイカ・ブリが獲れる深い湾。水深1000m超"
      },
      {
        "name": "イタイイタイ病（四大公害病）",
        "emoji": "⚠️",
        "difficulty": 3,
        "note": "神通川流域でカドミウム中毒により発生。骨がもろくなる病気。神岡鉱山（岐阜県）が原因。1950年代〜"
      },
      {
        "name": "北前船の寄港地",
        "emoji": "⛵",
        "difficulty": 3,
        "note": "江戸〜明治時代、大阪〜北海道の海上交易で栄えた。富山の薬売りも全国に広まった"
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
        "name": "兼六園（日本三名園）",
        "emoji": "🌸",
        "difficulty": 2,
        "note": "江戸時代に加賀藩が整備した大名庭園。水戸偕楽園・岡山後楽園と並ぶ日本三名園"
      },
      {
        "name": "輪島塗",
        "emoji": "🏺",
        "difficulty": 2,
        "note": "日本を代表する漆器。国の重要無形文化財。輪島市で生産"
      },
      {
        "name": "能登半島",
        "emoji": "🗺️",
        "difficulty": 2,
        "note": "日本海に突き出た半島。能登半島国定公園。里山里海の文化"
      },
      {
        "name": "加賀百万石（前田家）",
        "emoji": "🏯",
        "difficulty": 3,
        "note": "徳川家に次ぐ大藩（102万石）。金沢城を中心に文化・工芸が栄えた。江戸時代に大名として残存"
      },
      {
        "name": "能登半島地震（2024年）",
        "emoji": "🌍",
        "difficulty": 3,
        "note": "2024年1月1日に発生したM7.6の地震。能登半島に甚大な被害。輪島・珠洲が特に大きな被害を受けた"
      },
      {
        "name": "金箔生産量日本一（金沢）",
        "emoji": "✨",
        "difficulty": 2,
        "note": "金沢市は日本の金箔生産量の99%以上を占める。加賀藩の伝統工芸として発展し、仏壇・漆器・料理など幅広く使われる。"
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
      },
      {
        "name": "眼鏡フレーム生産量日本一",
        "emoji": "👓",
        "difficulty": 2,
        "note": "鯖江市が全国シェア約96%。世界有数の産地として国際的に知られる"
      },
      {
        "name": "恐竜化石の産地",
        "emoji": "🦕",
        "difficulty": 2,
        "note": "勝山市で多数の恐竜化石が発見。県立恐竜博物館は世界三大恐竜博物館"
      },
      {
        "name": "東尋坊",
        "emoji": "🌊",
        "difficulty": 2,
        "note": "柱状節理の断崖絶壁が続く海岸。国の天然記念物"
      },
      {
        "name": "越前ガニ（ズワイガニ）",
        "emoji": "🦀",
        "difficulty": 2,
        "note": "日本海の冬の味覚。オスのズワイガニのブランド名"
      },
      {
        "name": "一乗谷朝倉氏遺跡",
        "emoji": "🏯",
        "difficulty": 3,
        "note": "戦国時代の城下町跡。朝倉氏5代が栄えた（1471〜1573年）。一向一揆が多発した地域でもある"
      },
      {
        "name": "原子力発電所の集中立地",
        "emoji": "⚛️",
        "difficulty": 3,
        "note": "若狭湾沿岸に日本最多の原発が集中（「原発銀座」）。エネルギー政策と地域との関係が問われてきた"
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
      },
      {
        "name": "ぶどう生産量日本一",
        "emoji": "🍇",
        "difficulty": 2,
        "note": "甲府盆地が主産地。巨峰・甲州ぶどうが有名。全国シェア約25%"
      },
      {
        "name": "富士山（日本最高峰3776m）",
        "emoji": "🗻",
        "difficulty": 2,
        "note": "静岡県と跨る成層火山。2013年「信仰の対象と芸術の源泉」として世界文化遺産登録"
      },
      {
        "name": "甲府盆地（フルーツ王国）",
        "emoji": "🍑",
        "difficulty": 2,
        "note": "桃・ぶどう・すもも。盆地特有の昼夜の温度差が果物を甘くする"
      },
      {
        "name": "武田信玄",
        "emoji": "⚔️",
        "difficulty": 3,
        "note": "甲斐国（山梨）の戦国大名。「風林火山」の旗印。川中島の戦いで上杉謙信と激突"
      },
      {
        "name": "富士五湖（富士山の北側）",
        "emoji": "🏞️",
        "difficulty": 3,
        "note": "富士山の噴火で生まれた5つの湖（山中湖・河口湖・西湖・精進湖・本栖湖）。世界文化遺産の構成資産"
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
      },
      {
        "name": "レタス生産量日本一",
        "emoji": "🥬",
        "difficulty": 2,
        "note": "川上村など高原野菜の日本最大産地。夏でも涼しい高地が適地"
      },
      {
        "name": "日本アルプス（北・中・南）",
        "emoji": "⛰️",
        "difficulty": 2,
        "note": "3000m級の山々が連なる。「日本の屋根」。北アルプス（飛騨山脈）・中央アルプス・南アルプス（赤石山脈）"
      },
      {
        "name": "内陸県・面積全国4位",
        "emoji": "🗺️",
        "difficulty": 2,
        "note": "海なし県。面積は全国4位の広さ（海なし県の中で最大）"
      },
      {
        "name": "松本城（国宝）",
        "emoji": "🏯",
        "difficulty": 3,
        "note": "戦国時代に建てられた現存する天守閣。国宝5城（姫路・彦根・犬山・松江・松本）のひとつ"
      },
      {
        "name": "善光寺と宗派を超えた信仰",
        "emoji": "⛩️",
        "difficulty": 3,
        "note": "宗派を超えた信仰を集める古刹。「一生に一度は善光寺参り」。阿弥陀如来を本尊とする"
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
      },
      {
        "name": "白川郷（世界文化遺産）",
        "emoji": "🏠",
        "difficulty": 2,
        "note": "合掌造り集落。1995年世界文化遺産登録。豪雪地帯に適応した急傾斜の茅葺き屋根が特徴"
      },
      {
        "name": "木曽三川（木曽川・長良川・揖斐川）",
        "emoji": "🏞️",
        "difficulty": 2,
        "note": "3本の川が濃尾平野を流れる。洪水対策の輪中集落が有名"
      },
      {
        "name": "飛騨高山（古い町並み）",
        "emoji": "🏘️",
        "difficulty": 2,
        "note": "江戸時代の商家が残る観光地。外国人観光客にも人気"
      },
      {
        "name": "関ヶ原の戦い（1600年）",
        "emoji": "⚔️",
        "difficulty": 3,
        "note": "東軍（徳川家康）vs西軍（石田三成）。天下分け目の戦い。江戸幕府成立の決定的な戦い"
      },
      {
        "name": "輪中（洪水対策集落）",
        "emoji": "🏡",
        "difficulty": 3,
        "note": "木曽三川の洪水に備え、堤防で囲まれた集落。水屋（高床式蔵）を持ち、非常時に備えた生活の知恵"
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
        "name": "茶（緑茶）生産量日本一",
        "emoji": "🍵",
        "difficulty": 2,
        "note": "牧之原台地が最大産地。静岡茶は全国ブランド。全国シェア約40%"
      },
      {
        "name": "富士山（日本最高峰3776m）",
        "emoji": "🗻",
        "difficulty": 2,
        "note": "山梨県と跨る成層火山。2013年世界文化遺産登録"
      },
      {
        "name": "駿河湾（日本最深の湾）",
        "emoji": "🌊",
        "difficulty": 2,
        "note": "最大水深約2500m。日本で最も深い湾。深海魚が多い"
      },
      {
        "name": "徳川家康（駿府城）",
        "emoji": "🏯",
        "difficulty": 3,
        "note": "江戸幕府を開いた後も晩年は駿府（静岡）に隠居。「大御所政治」を行った"
      },
      {
        "name": "東海道五十三次と宿場町",
        "emoji": "🛣️",
        "difficulty": 3,
        "note": "江戸〜京都の53の宿場町。静岡県内に最多の宿場が置かれ、東海道交通の要所だった"
      },
      {
        "name": "伊豆半島",
        "emoji": "🏖️",
        "difficulty": 2,
        "note": "太平洋に突き出た半島。温泉・観光地として有名。伊豆諸島・小笠原諸島とともに東京都・静岡県に属する。"
      },
      {
        "name": "天竜杉（日本三大人工美林）",
        "emoji": "🌲",
        "difficulty": 3,
        "note": "天竜川流域に広がる人工杉林。吉野杉・尾鷲ヒノキとならぶ日本三大人工美林のひとつ。計画的な植林・管理の歴史を持つ。"
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
        "name": "自動車生産（トヨタ・中京工業地帯）",
        "emoji": "🚗",
        "difficulty": 2,
        "note": "豊田市を中心とした中京工業地帯は製造品出荷額が長年日本最大"
      },
      {
        "name": "名古屋港（輸出額）",
        "emoji": "🚢",
        "difficulty": 2,
        "note": "自動車の輸出港として全国屈指。輸出額で長年日本一"
      },
      {
        "name": "伊勢湾台風（1959年）",
        "emoji": "🌪️",
        "difficulty": 2,
        "note": "戦後最大の自然災害。死者・行方不明者約5000人。伊勢湾沿岸の低地が大きな被害を受けた"
      },
      {
        "name": "三英傑（信長・秀吉・家康）",
        "emoji": "⚔️",
        "difficulty": 3,
        "note": "織田信長（尾張）・豊臣秀吉（尾張）・徳川家康（三河）全員が愛知出身。天下統一の舞台"
      },
      {
        "name": "中京工業地帯と製造業",
        "emoji": "🏭",
        "difficulty": 3,
        "note": "自動車・航空機・窯業（瀬戸焼・常滑焼）など。製造品出荷額が長年日本最大の工業地帯"
      },
      {
        "name": "濃尾平野",
        "emoji": "🌾",
        "difficulty": 2,
        "note": "愛知・岐阜にまたがる中部地方最大の平野。木曽三川（木曽川・長良川・揖斐川）が流れ込む。洪水対策の輪中集落が有名。"
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
      },
      {
        "name": "真珠養殖の発祥地",
        "emoji": "💎",
        "difficulty": 2,
        "note": "御木本幸吉が1893年に世界初の真珠養殖に成功（英虞湾・志摩）"
      },
      {
        "name": "松阪牛",
        "emoji": "🐄",
        "difficulty": 2,
        "note": "神戸牛・近江牛と並ぶ日本三大和牛"
      },
      {
        "name": "志摩半島（リアス海岸）",
        "emoji": "🌊",
        "difficulty": 2,
        "note": "英虞湾などの複雑な地形で真珠・海女漁が盛ん"
      },
      {
        "name": "四日市ぜんそく（四大公害病）",
        "emoji": "⚠️",
        "difficulty": 3,
        "note": "石油コンビナートの亜硫酸ガスによる大気汚染（1960年代）。呼吸器疾患が多発した日本の代表的公害"
      },
      {
        "name": "御木本幸吉と真珠産業",
        "emoji": "👨",
        "difficulty": 3,
        "note": "「海の発明王」。養殖真珠を世界に広め、ミキモトを創業。20年に一度の伊勢神宮の式年遷宮も有名"
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
      },
      {
        "name": "琵琶湖（日本最大の湖）",
        "emoji": "🏞️",
        "difficulty": 2,
        "note": "面積670km²。滋賀県面積の約6分の1。近畿の水がめ。古代から「淡海（おうみ）」と呼ばれた"
      },
      {
        "name": "彦根城（国宝）",
        "emoji": "🏯",
        "difficulty": 2,
        "note": "国宝5城のひとつ。ひこにゃんのモデル。井伊直弼がここから大老となり、日米修好通商条約を締結"
      },
      {
        "name": "近江牛",
        "emoji": "🐄",
        "difficulty": 2,
        "note": "日本最古の牛肉ブランドのひとつ。霜降りが美しい黒毛和牛"
      },
      {
        "name": "比叡山延暦寺",
        "emoji": "⛩️",
        "difficulty": 3,
        "note": "天台宗の総本山（788年創建）。1994年世界文化遺産。法然・親鸞・道元・日蓮など多くの名僧が修行した「日本仏教の母山」"
      },
      {
        "name": "琵琶湖の水質保全・石けん運動",
        "emoji": "🌿",
        "difficulty": 3,
        "note": "1977年に赤潮が発生。住民が合成洗剤に反対し石けん運動を展開。1980年に富栄養化防止条例が制定された"
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
        "name": "西陣織・京友禅",
        "emoji": "👘",
        "difficulty": 2,
        "note": "日本を代表する伝統工芸の織物・染め物。国の伝統的工芸品"
      },
      {
        "name": "宇治茶（抹茶）",
        "emoji": "🍵",
        "difficulty": 2,
        "note": "茶道の抹茶の主要産地。宇治市。宇治川沿いの茶畑が有名"
      },
      {
        "name": "古都京都の文化財（世界遺産）",
        "emoji": "🏛️",
        "difficulty": 2,
        "note": "金閣寺・銀閣寺・二条城など17件（1994年登録）。鹿苑寺・嵐山・伏見稲荷など"
      },
      {
        "name": "平安京（794年遷都）",
        "emoji": "🏯",
        "difficulty": 3,
        "note": "桓武天皇が奈良から遷都。約1100年間の都。碁盤の目状の都市計画（条坊制）が特徴"
      },
      {
        "name": "応仁の乱（1467〜1477年）",
        "emoji": "⚔️",
        "difficulty": 3,
        "note": "室町幕府の衰退と戦国時代の始まり。将軍足利義政の後継者争いが原因。京都が焼け野原に"
      },
      {
        "name": "京都盆地・盆地特有の気候",
        "emoji": "🏔️",
        "difficulty": 2,
        "note": "京都は三方を山に囲まれた盆地の地形。夏は蒸し暑く冬は底冷えする盆地特有の厳しい気候。この気候が西陣織など伝統工芸の発展を支えた。"
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
        "name": "天下の台所（商業・経済）",
        "emoji": "💰",
        "difficulty": 2,
        "note": "江戸時代から全国の物資が集まる経済の中心地。蔵屋敷が立ち並んだ"
      },
      {
        "name": "大阪城",
        "emoji": "🏯",
        "difficulty": 2,
        "note": "豊臣秀吉が築城。現在の天守は徳川時代に再建されたもの"
      },
      {
        "name": "淀川",
        "emoji": "🏞️",
        "difficulty": 2,
        "note": "琵琶湖を水源とし大阪湾に注ぐ。大阪の水源。氾濫を防ぐ治水工事の歴史が長い"
      },
      {
        "name": "豊臣秀吉（大坂城）",
        "emoji": "⚔️",
        "difficulty": 3,
        "note": "全国統一を果たした武将。大坂（現大阪）を拠点とした。検地・刀狩など太閤政治の象徴"
      },
      {
        "name": "大阪万博（1970年・2025年）",
        "emoji": "🌐",
        "difficulty": 3,
        "note": "1970年は日本初の万博（千里丘陵）。「太陽の塔」が有名。2025年に夢洲で再び開催"
      },
      {
        "name": "大阪平野・阪神工業地帯",
        "emoji": "🏭",
        "difficulty": 2,
        "note": "大阪平野は大阪湾に面した低地。大阪・神戸を中心とする阪神工業地帯は工業出荷額が日本2位。鉄鋼・化学・繊維工業が発展した。"
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
      },
      {
        "name": "神戸港（国際貿易港）",
        "emoji": "🚢",
        "difficulty": 2,
        "note": "明治以降の日本有数の国際貿易港。コンテナ取扱量で長年上位"
      },
      {
        "name": "淡路島（玉ねぎ）",
        "emoji": "🧅",
        "difficulty": 2,
        "note": "瀬戸内海最大の島。玉ねぎの一大産地"
      },
      {
        "name": "六甲山",
        "emoji": "⛰️",
        "difficulty": 2,
        "note": "神戸市の背後にある山地。夜景スポット・登山地として有名"
      },
      {
        "name": "阪神・淡路大震災（1995年）",
        "emoji": "🌍",
        "difficulty": 3,
        "note": "M7.3の直下型地震。6434人が犠牲に。震災復興・都市直下型地震対策の教訓として世界に知られる"
      },
      {
        "name": "神戸開港・異人館・文明開化",
        "emoji": "🏠",
        "difficulty": 3,
        "note": "1868年の開港で外国人居留地が生まれ、西洋文化が広まった。「北野の異人館街」が残る"
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
      },
      {
        "name": "吉野山（桜・世界遺産）",
        "emoji": "🌸",
        "difficulty": 2,
        "note": "「千本桜」で有名。吉野・大峰の修験道（2004年世界文化遺産）"
      },
      {
        "name": "法隆寺（世界最古の木造建築）",
        "emoji": "⛩️",
        "difficulty": 2,
        "note": "607年建立。1993年に日本初の世界文化遺産登録。聖徳太子が建てたとされる"
      },
      {
        "name": "大和平野（農業地帯）",
        "emoji": "🌾",
        "difficulty": 2,
        "note": "奈良盆地の農業地帯。古代から開拓された。桜井市に三輪素麺の産地"
      },
      {
        "name": "平城京（710年遷都）",
        "emoji": "🏯",
        "difficulty": 3,
        "note": "元明天皇が藤原京から遷都。奈良時代の都（約80年間）。唐（中国）の長安をモデルにした碁盤目状の都市"
      },
      {
        "name": "天平文化・正倉院",
        "emoji": "🏛️",
        "difficulty": 3,
        "note": "奈良時代の仏教文化。東大寺の正倉院にはシルクロード経由の宝物が保管されている"
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
      },
      {
        "name": "梅干し（南高梅）生産量日本一",
        "emoji": "🍋",
        "difficulty": 2,
        "note": "全国シェア約60%。みなべ町・田辺市が主産地。南高梅が最高級品種"
      },
      {
        "name": "みかん（有田みかん）生産上位",
        "emoji": "🍊",
        "difficulty": 2,
        "note": "温暖な紀伊半島の南斜面で栽培。有田みかんが有名"
      },
      {
        "name": "熊野古道（世界遺産）",
        "emoji": "🌿",
        "difficulty": 2,
        "note": "霊場を結ぶ参詣道。2004年世界文化遺産登録。現在も世界中からの巡礼者が訪れる"
      },
      {
        "name": "高野山（真言宗の聖地）",
        "emoji": "⛩️",
        "difficulty": 2,
        "note": "弘法大師空海が開いた真言宗の聖地。2004年世界文化遺産"
      },
      {
        "name": "紀州藩（徳川御三家）",
        "emoji": "🏯",
        "difficulty": 3,
        "note": "水戸・尾張と並ぶ徳川御三家のひとつ。8代将軍吉宗（享保の改革）は紀州藩主から将軍になった"
      },
      {
        "name": "那智の滝と熊野信仰",
        "emoji": "💧",
        "difficulty": 3,
        "note": "日本最大の落差（133m）を誇る滝。熊野三山の信仰と結びつき、天皇や貴族も参詣した"
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
      },
      {
        "name": "鳥取砂丘（日本最大の砂丘）",
        "emoji": "🏜️",
        "difficulty": 2,
        "note": "南北2.4km・東西16km。国内最大級の砂丘。風紋や砂の彫刻で有名"
      },
      {
        "name": "二十世紀梨生産量日本一",
        "emoji": "🍐",
        "difficulty": 2,
        "note": "全国シェア約50%。鳥取市・倉吉市周辺が産地"
      },
      {
        "name": "人口最少の都道府県",
        "emoji": "📉",
        "difficulty": 2,
        "note": "47都道府県中、最も人口が少ない（約55万人）。過疎化対策の先進事例も多い"
      },
      {
        "name": "大山（伯耆富士）",
        "emoji": "⛰️",
        "difficulty": 3,
        "note": "中国地方最高峰（1729m）。西側の火山砕屑物が崩落しやすく、登山ルートは限られる"
      },
      {
        "name": "山陰海岸ジオパーク",
        "emoji": "🌊",
        "difficulty": 3,
        "note": "ユネスコ世界ジオパークに認定。浦富海岸の断崖・砂丘・玄武岩が地球の歴史を示す"
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
      },
      {
        "name": "石見銀山（世界文化遺産）",
        "emoji": "⛏️",
        "difficulty": 2,
        "note": "戦国〜江戸時代に世界の銀生産の1/3を占めた。2007年世界文化遺産"
      },
      {
        "name": "宍道湖（シジミ）",
        "emoji": "🐚",
        "difficulty": 2,
        "note": "ヤマトシジミの全国有数産地。汽水湖（淡水と海水が混じる）"
      },
      {
        "name": "隠岐（離島・流配の地）",
        "emoji": "🏝️",
        "difficulty": 2,
        "note": "後醍醐天皇・後鳥羽上皇が流された島。独自の生態系・文化を持つ離島"
      },
      {
        "name": "石見銀山と大航海時代",
        "emoji": "🌍",
        "difficulty": 3,
        "note": "16〜17世紀に世界の銀流通を支えた。ポルトガル・オランダなどとの貿易品として世界に流通した"
      },
      {
        "name": "出雲大社と神在月",
        "emoji": "⛩️",
        "difficulty": 3,
        "note": "旧暦10月（神無月）に全国の神が出雲に集まるとされる（出雲では神在月）。縁結びの神として全国に信仰される"
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
        "name": "後楽園（日本三名園）",
        "emoji": "🌸",
        "difficulty": 2,
        "note": "1700年に岡山藩主・池田綱政が造営した大名庭園。水戸偕楽園・金沢兼六園と並ぶ日本三名園"
      },
      {
        "name": "白桃・マスカット生産上位",
        "emoji": "🍑",
        "difficulty": 2,
        "note": "「晴れの国おかやま」の果物。温暖・少雨の瀬戸内式気候が適している"
      },
      {
        "name": "瀬戸内式気候（晴れの日が多い）",
        "emoji": "☀️",
        "difficulty": 2,
        "note": "年間降水量が少なく温暖。「晴れの国おかやま」のキャッチコピー。ため池も多い"
      },
      {
        "name": "吉備路（古代吉備国）",
        "emoji": "🏛️",
        "difficulty": 3,
        "note": "古墳時代の強大な勢力「吉備国」。造山古墳（全国4位）など前方後円墳が多い。大和政権への統合に抵抗した"
      },
      {
        "name": "瀬戸大橋・倉敷美観地区",
        "emoji": "🌉",
        "difficulty": 3,
        "note": "1988年開通の瀬戸大橋（岡山〜香川）。倉敷の江戸時代の白壁の街並みは国の特別重要文化財"
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
        "name": "カキ（牡蠣）生産量日本一",
        "emoji": "🦪",
        "difficulty": 2,
        "note": "全国シェア約60%。江田島など瀬戸内海の恵まれた環境での養殖が盛ん"
      },
      {
        "name": "宮島・厳島神社（世界遺産）",
        "emoji": "⛩️",
        "difficulty": 2,
        "note": "海に浮かぶ朱の大鳥居。1996年世界文化遺産。平清盛が整備した海上の社殿"
      },
      {
        "name": "瀬戸内海（多島海）",
        "emoji": "🏝️",
        "difficulty": 2,
        "note": "大小700以上の島が点在する国立公園。穏やかな内海が養殖業・交通路として発展"
      },
      {
        "name": "原爆投下（1945年8月6日）",
        "emoji": "☮️",
        "difficulty": 3,
        "note": "世界初の核兵器（ウラン型）使用。年内に約14万人が亡くなった。8月6日は「広島平和記念日」"
      },
      {
        "name": "原爆ドーム（世界文化遺産）",
        "emoji": "🏛️",
        "difficulty": 3,
        "note": "爆心地近くで奇跡的に残った建物。1996年世界文化遺産登録。核廃絶の象徴として世界に知られる"
      },
      {
        "name": "自動車工業（マツダ）",
        "emoji": "🚗",
        "difficulty": 2,
        "note": "広島はマツダの本社がある自動車工業の拠点。府中町（広島市隣接）に本社・工場が置かれ、瀬戸内工業地域の中核を担う。"
      },
      {
        "name": "中国山地・過疎化",
        "emoji": "⛰️",
        "difficulty": 3,
        "note": "中国山地は広島・島根・鳥取などにまたがる山地。山間部は高齢化・過疎化が深刻で、日本の農山村問題の象徴。中学受験でも農業・過疎問題として頻出。"
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
      },
      {
        "name": "秋吉台（日本最大のカルスト台地）",
        "emoji": "🌿",
        "difficulty": 2,
        "note": "石灰岩の台地。地下に秋芳洞（鍾乳洞）が広がる。国定公園"
      },
      {
        "name": "関門海峡",
        "emoji": "🌊",
        "difficulty": 2,
        "note": "本州（山口）と九州（福岡）を隔てる海峡。最も狭い部分は約600m"
      },
      {
        "name": "長州藩（明治維新）",
        "emoji": "⚔️",
        "difficulty": 2,
        "note": "薩摩藩と協力して倒幕（薩長同盟）。伊藤博文・山縣有朋など多くの元勲を輩出"
      },
      {
        "name": "壇ノ浦の戦い（1185年）",
        "emoji": "⚔️",
        "difficulty": 3,
        "note": "関門海峡で源義経が平氏を滅ぼした海戦。源平合戦の終結。安徳天皇が入水した悲劇の舞台"
      },
      {
        "name": "吉田松陰・松下村塾",
        "emoji": "🏛️",
        "difficulty": 3,
        "note": "吉田松陰が萩で塾を開き、伊藤博文・高杉晋作・山縣有朋ら明治の志士を育てた。2015年世界文化遺産"
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
      },
      {
        "name": "すだち生産量日本一",
        "emoji": "🍋",
        "difficulty": 2,
        "note": "全国シェア98%以上"
      },
      {
        "name": "鳴門の渦潮",
        "emoji": "🌊",
        "difficulty": 2,
        "note": "鳴門海峡に世界最大級の渦潮が発生。直径20mを超えることも"
      },
      {
        "name": "吉野川（四国三郎）",
        "emoji": "🏞️",
        "difficulty": 2,
        "note": "四国最大の川。利根川（坂東太郎）・筑後川（筑紫次郎）と並ぶ三大暴れ川"
      },
      {
        "name": "四国遍路（88か所）",
        "emoji": "🚶",
        "difficulty": 3,
        "note": "弘法大師空海ゆかりの88か寺を巡る巡礼。全長約1400km。徳島（発心の道場）から始まる"
      },
      {
        "name": "鳴門海峡と渦潮の仕組み",
        "emoji": "🔬",
        "difficulty": 3,
        "note": "大潮の干満で潮が太平洋と瀬戸内海を行き来する際に速度差が生じて渦になる。潮速は世界屈指"
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
      },
      {
        "name": "ため池の数日本一",
        "emoji": "💧",
        "difficulty": 2,
        "note": "約14000か所。瀬戸内式気候で雨が少ないため古くから造られた。農業用水の確保に不可欠"
      },
      {
        "name": "面積最小の都道府県",
        "emoji": "📐",
        "difficulty": 2,
        "note": "47都道府県中、最も面積が小さい（約1877km²）"
      },
      {
        "name": "瀬戸大橋",
        "emoji": "🌉",
        "difficulty": 2,
        "note": "1988年開通。本州（岡山）と四国（香川）を結ぶ鉄道・道路併用橋（世界最長級）"
      },
      {
        "name": "讃岐平野の農業（ため池・二毛作）",
        "emoji": "🌾",
        "difficulty": 3,
        "note": "温暖・少雨の気候を生かした農業。ため池を利用した二毛作が盛ん。麦と米を作る"
      },
      {
        "name": "小豆島（オリーブ・醤油・素麺）",
        "emoji": "🫒",
        "difficulty": 3,
        "note": "日本のオリーブ栽培発祥の地（1908年）。醤油・手延べそうめんの産地でもある。映画「二十四の瞳」の舞台"
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
      },
      {
        "name": "みかん生産量日本一（時期）",
        "emoji": "🍊",
        "difficulty": 2,
        "note": "宇和海沿岸の段々畑でみかんを栽培。愛媛みかんが全国ブランド"
      },
      {
        "name": "今治タオル生産量日本一",
        "emoji": "🧴",
        "difficulty": 2,
        "note": "今治市は日本最大のタオル生産地。GIマーク取得。綿花栽培の伝統から発展"
      },
      {
        "name": "石鎚山（西日本最高峰）",
        "emoji": "⛰️",
        "difficulty": 2,
        "note": "標高1982m。西日本最高峰。修験道の霊山として古くから信仰される"
      },
      {
        "name": "道後温泉と夏目漱石「坊っちゃん」",
        "emoji": "📖",
        "difficulty": 3,
        "note": "夏目漱石「坊っちゃん」（1906年）の舞台が松山（愛媛）。道後温泉は「坊っちゃんの湯」とも呼ばれる"
      },
      {
        "name": "段々畑（棚田）と農業の工夫",
        "emoji": "🌄",
        "difficulty": 3,
        "note": "急傾斜地を切り開いた段々畑でみかんを生産。機械が入れない急斜面をモノレールで対応。人力農業の象徴"
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
      },
      {
        "name": "カツオ水揚げ量日本一（時期）",
        "emoji": "🐟",
        "difficulty": 2,
        "note": "一本釣りカツオ漁で有名。かつおのたたきは高知の名物"
      },
      {
        "name": "ゆず生産量日本一",
        "emoji": "🍋",
        "difficulty": 2,
        "note": "物部川流域の山村地帯が主産地。全国シェア約50%"
      },
      {
        "name": "四万十川（日本最後の清流）",
        "emoji": "🏞️",
        "difficulty": 2,
        "note": "支流も含め自然堤防（沈下橋）が残る清流。大規模なダムがない川"
      },
      {
        "name": "坂本龍馬",
        "emoji": "🗡️",
        "difficulty": 3,
        "note": "幕末の志士。薩長同盟を仲介し明治維新に貢献。高知市出身。土佐勤王党→海援隊を率いた"
      },
      {
        "name": "高知平野の促成栽培",
        "emoji": "🌶️",
        "difficulty": 3,
        "note": "黒潮の影響で温暖な気候を生かし、なす・ピーマン・しょうがを早期出荷（促成栽培）。ビニールハウス農業が盛ん"
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
        "name": "博多港・玄界灘",
        "emoji": "🚢",
        "difficulty": 2,
        "note": "アジアに近い九州最大の港。古くから大陸交流の窓口。博多商人が交易で栄えた"
      },
      {
        "name": "筑豊炭田",
        "emoji": "⛏️",
        "difficulty": 2,
        "note": "明治〜昭和に国内最大の石炭産地。エネルギー革命（石炭→石油）で衰退"
      },
      {
        "name": "九州最大の都市（福岡市）",
        "emoji": "🏙️",
        "difficulty": 2,
        "note": "福岡市は九州・沖縄で最多人口の都市。政令指定都市。近年人口増加が著しい"
      },
      {
        "name": "元寇（1274年・1281年）",
        "emoji": "⚔️",
        "difficulty": 3,
        "note": "鎌倉時代にモンゴル帝国（フビライ・ハン）・高麗軍が博多湾に来襲。「神風（台風）」で撃退されたとされる"
      },
      {
        "name": "大宰府（西日本の政治・軍事拠点）",
        "emoji": "🏯",
        "difficulty": 3,
        "note": "奈良〜平安時代に九州全体を統括した機関。外交・防衛の要衝。菅原道真が左遷された地でもある"
      },
      {
        "name": "筑紫平野・北九州工業地帯",
        "emoji": "🌾",
        "difficulty": 2,
        "note": "筑紫平野は九州最大の平野で米作りがさかん。北九州工業地帯は官営八幡製鉄所（1901年）を起源とする日本近代工業の発祥地。鉄鋼・化学工業で発展した。"
      },
      {
        "name": "筑後川（筑紫次郎）",
        "emoji": "🌊",
        "difficulty": 3,
        "note": "九州最大の川。利根川（坂東太郎）・吉野川（四国三郎）とともに「日本三大暴れ川」とよばれ「筑紫次郎」の異名を持つ。筑紫平野を流れ有明海に注ぐ。"
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
      },
      {
        "name": "有明海（日本最大の干潟）",
        "emoji": "🌊",
        "difficulty": 2,
        "note": "ムツゴロウ・有明海苔が有名。干満差が最大6m。日本最大規模の干潟"
      },
      {
        "name": "吉野ヶ里遺跡",
        "emoji": "🏛️",
        "difficulty": 2,
        "note": "日本最大規模の弥生時代の環濠集落跡。邪馬台国との関連が注目される"
      },
      {
        "name": "有明海の干潟の生態系",
        "emoji": "🦀",
        "difficulty": 2,
        "note": "干満差が大きく独特の生態系。ムツゴロウ・シオマネキ（カニ）が生息。干潟は水質浄化機能を持つ"
      },
      {
        "name": "有田焼（日本最古の磁器）と海外輸出",
        "emoji": "🏺",
        "difficulty": 3,
        "note": "1616年、朝鮮人陶工・李参平が日本初の磁器を焼いた。江戸時代にオランダ東インド会社を通じ欧州に輸出"
      },
      {
        "name": "佐賀藩の近代化・反射炉",
        "emoji": "🏭",
        "difficulty": 3,
        "note": "幕末に西洋の鉄製造技術（反射炉）をいち早く導入した先進的な藩。のちに軍艦建造・大砲製造につながった"
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
      },
      {
        "name": "出島（江戸時代の唯一の貿易窓口）",
        "emoji": "⛵",
        "difficulty": 2,
        "note": "1641〜1859年、オランダとの唯一の貿易窓口。鎖国の中でも西洋の情報が入ってきた「蘭学」の源"
      },
      {
        "name": "軍艦島（端島・世界遺産）",
        "emoji": "🏭",
        "difficulty": 2,
        "note": "炭鉱の島。廃墟となった建物群が残る。2015年「明治日本の産業革命遺産」として世界文化遺産登録"
      },
      {
        "name": "島が多い（日本最多水準）",
        "emoji": "🏝️",
        "difficulty": 2,
        "note": "971の島があり日本最多水準。対馬・壱岐・五島列島など多様な島がある"
      },
      {
        "name": "長崎原爆（1945年8月9日）",
        "emoji": "☮️",
        "difficulty": 3,
        "note": "プルトニウム型原爆が投下（広島の3日後）。約7.5万人が亡くなった。8月9日は「長崎原爆の日」"
      },
      {
        "name": "潜伏キリシタン（世界文化遺産）",
        "emoji": "✝️",
        "difficulty": 3,
        "note": "江戸時代の禁教下で約250年間信仰を守った。2018年世界文化遺産登録。「かくれキリシタン」とも呼ばれる"
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
      },
      {
        "name": "阿蘇山（世界最大級のカルデラ）",
        "emoji": "🌋",
        "difficulty": 2,
        "note": "東西18km・南北25kmの世界最大級のカルデラ。現在も活動中の火山"
      },
      {
        "name": "い草生産量日本一",
        "emoji": "🌿",
        "difficulty": 2,
        "note": "八代平野が主産地。全国シェア約90%。畳の原料"
      },
      {
        "name": "熊本城（日本三名城）",
        "emoji": "🏯",
        "difficulty": 2,
        "note": "加藤清正が築城。「難攻不落の城」と呼ばれた。2016年の熊本地震で大きな被害を受け、現在も復旧中"
      },
      {
        "name": "水俣病（四大公害病）",
        "emoji": "⚠️",
        "difficulty": 3,
        "note": "チッソ工場の有機水銀が不知火海に流出。1956年に発覚。国内最大の公害病。手足のしびれ・視野狭窄が症状"
      },
      {
        "name": "熊本地震（2016年）",
        "emoji": "🌍",
        "difficulty": 3,
        "note": "2016年4月14日・16日にM7.3（最大震度7）の地震が連続して発生。「前震・本震」の連続地震として初の記録"
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
      },
      {
        "name": "温泉湧出量・源泉数日本一",
        "emoji": "♨️",
        "difficulty": 2,
        "note": "別府・由布院が有名。源泉数・湧出量ともに日本一。「おんせん県」をキャッチコピーに観光振興"
      },
      {
        "name": "しいたけ生産量日本一",
        "emoji": "🍄",
        "difficulty": 2,
        "note": "大分の山林を生かした原木シイタケ栽培。全国有数の産地"
      },
      {
        "name": "豊後水道・関サバ・関アジ",
        "emoji": "🐟",
        "difficulty": 2,
        "note": "速い潮流で身が締まったブランド魚。一本釣りで水揚げ後すぐ出荷する品質管理が評価される"
      },
      {
        "name": "別府温泉・地獄めぐり",
        "emoji": "🔥",
        "difficulty": 3,
        "note": "「海地獄」「血の池地獄」「龍巻地獄」など個性的な8つの源泉地。世界最大級の温泉湧出量を誇る"
      },
      {
        "name": "一村一品運動（大分発）",
        "emoji": "🌿",
        "difficulty": 3,
        "note": "1979年に大分県知事・平松守彦が提唱した地域振興政策。各市町村が地域の特産品を育てる考え方が世界に広まった"
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
      },
      {
        "name": "きゅうり生産量日本一（時期）",
        "emoji": "🥒",
        "difficulty": 2,
        "note": "温暖な気候を生かした促成栽培。宮崎市周辺が産地"
      },
      {
        "name": "畜産（宮崎牛・地頭鶏・宮崎豚）",
        "emoji": "🐄",
        "difficulty": 2,
        "note": "宮崎牛・宮崎地頭鶏・宮崎豚など多様な畜産物が有名"
      },
      {
        "name": "高千穂峡（神話の地）",
        "emoji": "🌊",
        "difficulty": 2,
        "note": "天孫降臨の地とされる。柱状節理の断崖と真名井の滝が美しい。日本神話の重要な舞台"
      },
      {
        "name": "シラス台地",
        "emoji": "🌋",
        "difficulty": 3,
        "note": "火山灰が堆積した水はけの良い台地。稲作に不向きだが芋・茶・畜産に適している（鹿児島と共有）"
      },
      {
        "name": "日向灘・南海トラフ地震",
        "emoji": "⚠️",
        "difficulty": 3,
        "note": "宮崎沖の日向灘は南海トラフ地震の震源域の一部。将来の巨大地震への備えが重要な地域"
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
      },
      {
        "name": "さつまいも生産量日本一",
        "emoji": "🍠",
        "difficulty": 2,
        "note": "シラス台地の水はけを生かした栽培。全国シェア約40%"
      },
      {
        "name": "屋久島（世界自然遺産）",
        "emoji": "🌲",
        "difficulty": 2,
        "note": "樹齢7200年の縄文杉。1993年世界自然遺産（白神山地と共に日本初）"
      },
      {
        "name": "種子島（宇宙センター）",
        "emoji": "🚀",
        "difficulty": 2,
        "note": "JAXA種子島宇宙センター。H-IIAロケットの発射場として有名"
      },
      {
        "name": "西郷隆盛・薩摩藩",
        "emoji": "⚔️",
        "difficulty": 3,
        "note": "明治維新の立役者。薩長同盟の一方を担った。西南戦争（1877年）で城山に散る。元日本最大藩（77万石）"
      },
      {
        "name": "シラス台地と農業の工夫",
        "emoji": "🌋",
        "difficulty": 3,
        "note": "桜島の噴火でできた火山灰台地。雨が降ると栄養が流れやすいが、芋・茶の栽培に適応した農業が発展した"
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
      },
      {
        "name": "さとうきび生産量日本一",
        "emoji": "🌿",
        "difficulty": 2,
        "note": "全国シェア約70%（鹿児島と競う）"
      },
      {
        "name": "珊瑚礁（サンゴ礁）",
        "emoji": "🐠",
        "difficulty": 2,
        "note": "日本最大のサンゴ礁地帯。温暖な黒潮が育む。世界的なダイビングスポット"
      },
      {
        "name": "西表島（イリオモテヤマネコ）",
        "emoji": "🐆",
        "difficulty": 2,
        "note": "国の特別天然記念物。2021年「奄美大島・徳之島・沖縄島北部及び西表島」として世界自然遺産登録"
      },
      {
        "name": "沖縄戦（1945年）",
        "emoji": "☮️",
        "difficulty": 3,
        "note": "太平洋戦争末期の地上戦。約20万人（県民の約4人に1人）が犠牲に。唯一の地上戦が行われた都道府県"
      },
      {
        "name": "琉球王国（1429〜1879年）",
        "emoji": "👑",
        "difficulty": 3,
        "note": "中国・日本・東南アジアと交易した独立王国。薩摩藩征服後も王国として存続。1879年に明治政府が廃藩置県で「沖縄県」に"
      },
      {
        "name": "米軍基地問題",
        "emoji": "🗺️",
        "difficulty": 3,
        "note": "日本の米軍専用施設面積の約70%が沖縄に集中（面積は全国の0.6%）。日米安保と地域住民の生活の問題"
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
