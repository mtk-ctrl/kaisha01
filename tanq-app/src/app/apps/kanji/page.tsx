'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'

type Grade = '小1' | '小2' | '小3' | '小4' | '小5' | '小6'

interface KanjiEntry {
  kanji: string
  reading: string
  meaning: string
  example: string
  tip: string
}

const KANJI_DATA: Record<Grade, KanjiEntry[]> = {
  '小1': [
    { kanji: '山', reading: 'やま', meaning: '山（mountain）', example: '富士山（ふじさん）', tip: '漢字の形を見て！山の頂上と斜面が3本の線になってるよ⛰️ 音読みは「サン」（富士山）' },
    { kanji: '川', reading: 'かわ', meaning: '川（river）', example: '川べり・荒川（あらかわ）', tip: '川が流れる3本の線！音読みは「セン」（河川）。大きな川を「河（かわ）」とも書くよ🌊' },
    { kanji: '田', reading: 'た', meaning: '田んぼ（rice field）', example: '田んぼ・田中さん', tip: '上から見た田んぼの形！音読みは「デン」。日本の名字に多い漢字だよ🌾' },
    { kanji: '日', reading: 'にち', meaning: '太陽・日（sun/day）', example: '日曜日・誕生日', tip: '太陽の丸い形から生まれた漢字。訓読みは「ひ（日光）」や「か（三日）」もあるよ☀️' },
    { kanji: '月', reading: 'つき', meaning: '月（moon）', example: '月曜日・三日月', tip: '三日月の形から。音読みは「ゲツ」（月曜日）。1ヶ月の「月」も同じ漢字🌙' },
    { kanji: '火', reading: 'ひ', meaning: '火（fire）', example: '火曜日・花火', tip: '燃える炎の形から。音読みは「カ」（火曜・火力）。花火の「火」もこれ！🔥' },
    { kanji: '水', reading: 'みず', meaning: '水（water）', example: '水曜日・水泳', tip: '水が流れる様子から。音読みは「スイ」（水泳・水道）。体の70%は水！💧' },
    { kanji: '木', reading: 'き', meaning: '木（tree）', example: '木曜日・木の葉', tip: '木が立っている形。音読みは「モク」（木曜）や「ボク」（木材）。根・幹・枝の形🌳' },
    { kanji: '金', reading: 'きん', meaning: '金・お金（gold）', example: '金曜日・金メダル', tip: '音読みは「キン」（金曜・金銀）。お金（かね）とも読む。金・銀・銅の金！🥇' },
    { kanji: '土', reading: 'つち', meaning: '土（earth/soil）', example: '土曜日・土の中', tip: '土地を表す形。音読みは「ド」（土曜）や「ト」（土地）。植物は土から育つ🌱' },
    { kanji: '花', reading: 'はな', meaning: '花（flower）', example: '桜の花・花火', tip: '草かんむり（艹）に「化」。「化」は変化の意味。花が咲くのは変化だね！🌸' },
    { kanji: '空', reading: 'そら', meaning: '空（sky）', example: '青空・空港', tip: '音読みは「クウ」（空気・空港）。「空（から）」は「中身がない」という意味もあるよ🌤️' },
    { kanji: '犬', reading: 'いぬ', meaning: '犬（dog）', example: '犬小屋・愛犬', tip: '音読みは「ケン」（愛犬・犬種）。犬は人類最古のペット！英語では dog🐕' },
    { kanji: '猫', reading: 'ねこ', meaning: '猫（cat）', example: '猫じゃらし・野良猫', tip: '猫の正式な読みは「びょう」（音読み）。猫はエジプトで神様として大切にされてたよ🐱' },
    { kanji: '人', reading: 'ひと', meaning: '人（person）', example: '人間・人口', tip: '人が二本足で立っている形！音読みは「ジン」（人間）や「ニン」（人気）🚶' },
  ],
  '小2': [
    { kanji: '海', reading: 'うみ', meaning: '海（sea）', example: '海水浴・日本海', tip: '音読みは「カイ」（海外・海岸）。さんずい（氵）は水の意味。海の面積は地球の71%！🌊' },
    { kanji: '岩', reading: 'いわ', meaning: '岩（rock）', example: '岩山・岩場', tip: '山（やま）＋石（いし）＝岩。音読みは「ガン」（岩石）。火山が冷えて固まってできるよ🪨' },
    { kanji: '星', reading: 'ほし', meaning: '星（star）', example: '北極星・流れ星', tip: '音読みは「セイ」（星座・明星）。太陽も星の一つ。星座は全部で88個あるよ⭐' },
    { kanji: '風', reading: 'かぜ', meaning: '風（wind）', example: '台風・北風', tip: '音読みは「フウ」（台風）や「フ」（風景）。風速は m/s（メートル毎秒）で表すよ💨' },
    { kanji: '雨', reading: 'あめ', meaning: '雨（rain）', example: '大雨・梅雨', tip: '雨粒が落ちている形！音読みは「ウ」（降雨・大雨）。梅雨は「ばいう」とも読む☔' },
    { kanji: '雪', reading: 'ゆき', meaning: '雪（snow）', example: '大雪・雪だるま', tip: '雨（あめかんむり）＋ヨ（形）。音読みは「セツ」（降雪・積雪）。雪の結晶は六角形❄️' },
    { kanji: '春', reading: 'はる', meaning: '春（spring）', example: '春分・春休み', tip: '音読みは「シュン」（青春・春分）。春は草木が芽吹く季節。英語では spring🌸' },
    { kanji: '夏', reading: 'なつ', meaning: '夏（summer）', example: '夏休み・夏祭り', tip: '音読みは「カ」や「ゲ」（夏至・夏期）。真夏の最高気温は40℃を超えることも！☀️' },
    { kanji: '秋', reading: 'あき', meaning: '秋（autumn）', example: '秋分・食欲の秋', tip: '音読みは「シュウ」（秋分・秋季）。英語では autumn（英）か fall（米）と言うよ🍂' },
    { kanji: '冬', reading: 'ふゆ', meaning: '冬（winter）', example: '冬休み・冬至', tip: '音読みは「トウ」（冬至・冬季）。冬至は一年で最も夜が長い日。英語では winter❄️' },
    { kanji: '朝', reading: 'あさ', meaning: '朝（morning）', example: '朝食・毎朝', tip: '音読みは「チョウ」（朝食・朝礼）。草の間から月と太陽が見える形から来ているよ🌅' },
    { kanji: '夜', reading: 'よる', meaning: '夜（night）', example: '夜中・深夜', tip: '音読みは「ヤ」（深夜・夜間）。月と夜空の形から。night（英）とおぼえよう🌙' },
    { kanji: '光', reading: 'ひかり', meaning: '光（light）', example: '日光・光速', tip: '音読みは「コウ」（光速・光線）。光の速さは秒速約30万km！月まで約1.3秒🌟' },
    { kanji: '色', reading: 'いろ', meaning: '色（color）', example: '虹色・原色', tip: '音読みは「ショク」（色彩・原色）や「シキ」（色彩）。虹は7色？実は連続した光のグラデーション🌈' },
    { kanji: '声', reading: 'こえ', meaning: '声（voice）', example: '大声・歌声', tip: '音読みは「セイ」（声優・声援）や「ショウ」。のどの声帯が振動して音が出るよ🎤' },
  ],
  '小3': [
    { kanji: '島', reading: 'しま', meaning: '島（island）', example: '島国・沖縄島', tip: '音読みは「トウ」（島国・半島）。日本は島が約6800個ある島国！英語では island🏝️' },
    { kanji: '谷', reading: 'たに', meaning: '谷（valley）', example: '渋谷・谷川', tip: '音読みは「コク」（渓谷）。山と山の間の低い部分。渋谷の「谷」もこれ！' },
    { kanji: '港', reading: 'みなと', meaning: '港（harbor）', example: '横浜港・漁港', tip: '音読みは「コウ」（空港・港町）。さんずいは水。船や飛行機が行き来する場所🚢' },
    { kanji: '橋', reading: 'はし', meaning: '橋（bridge）', example: '鉄橋・吊り橋', tip: '音読みは「キョウ」（鉄橋・陸橋）。世界最長の吊り橋は明石海峡大橋（約4km）！🌉' },
    { kanji: '坂', reading: 'さか', meaning: '坂（slope）', example: '急坂・大阪', tip: '音読みは「ハン」（急坂）。つちへん（土）は地面の意味。大阪の「坂」はこれ！' },
    { kanji: '湖', reading: 'みずうみ', meaning: '湖（lake）', example: '琵琶湖・湖畔', tip: '音読みは「コ」（湖畔・湖水）。さんずいは水。日本最大の湖は琵琶湖（滋賀県）🌊' },
    { kanji: '池', reading: 'いけ', meaning: '池（pond）', example: '不忍池・池の鯉', tip: '音読みは「チ」（池塘）。湖より小さい水の溜まり。さんずいは水を表すよ🐸' },
    { kanji: '森', reading: 'もり', meaning: '森（forest）', example: '原生林・森林', tip: '木（き）が3つで森！音読みは「シン」（森林）。木2つは「林（はやし）」。多いほど深い🌲' },
    { kanji: '畑', reading: 'はたけ', meaning: '畑（field）', example: '野菜畑・花畑', tip: '田（田んぼ）＋火（ひ）＝畑。火入れして作った農地！日本で作られた漢字（国字）だよ🥕' },
    { kanji: '薬', reading: 'くすり', meaning: '薬（medicine）', example: '薬局・漢方薬', tip: '音読みは「ヤク」（薬局・薬品）。草かんむり（艹）は植物の意味。昔は植物が薬だった💊' },
    { kanji: '悪', reading: 'わる', meaning: '悪い（bad）', example: '悪天候・善悪', tip: '音読みは「アク」（悪化・悪人）や「オ」（嫌悪）。「悪」の反対は「善（ぜん）」だよ' },
    { kanji: '急', reading: 'きゅう', meaning: '急ぐ（hurry）', example: '急行・緊急', tip: '音読みは「キュウ」（急行・緊急・急速）。「急いては事を仕損じる」ということわざがあるよ！' },
    { kanji: '暗', reading: 'くら', meaning: '暗い（dark）', example: '暗闇・暗号', tip: '音読みは「アン」（暗号・暗黒）。日へんは明るさ。「暗」は光が少ない状態。暗号＝secret code💡' },
    { kanji: '温', reading: 'あたた', meaning: '温かい（warm）', example: '温泉・体温', tip: '音読みは「オン」（温度・体温・温泉）。さんずいは水。温泉のお湯は地熱で温まるよ♨️' },
    { kanji: '荷', reading: 'に', meaning: '荷物（load）', example: '荷物・入荷', tip: '音読みは「カ」（荷物・出荷）。草かんむりは「重く背負うもの」の意味。宅配便の荷物もこれ📦' },
  ],
  '小4': [
    { kanji: '航', reading: 'こう', meaning: '航行・飛行', example: '航空・航海', tip: '「舟（ふね）」＋「亢（たかい）」の組み合わせ。航空（こうくう）は空を飛ぶこと。aviation🛫' },
    { kanji: '灯', reading: 'とう', meaning: '灯り（lamp）', example: '信号灯・街灯', tip: '火（ひ）＋丁（ちょう）。灯台（とうだい）は lighthouse。信号灯・街灯にも使うよ💡' },
    { kanji: '漁', reading: 'りょう', meaning: '漁業（fishing）', example: '漁業・漁港', tip: '「魚（さかな）」＋さんずい。漁師（りょうし）さんは海で魚を捕る仕事🎣' },
    { kanji: '縄', reading: 'なわ', meaning: '縄（rope）', example: '縄跳び・沖縄', tip: '音読みは「ジョウ」（縄文・沖縄）。縄文時代は縄の模様の土器が特徴。jump rope🪢' },
    { kanji: '陸', reading: 'りく', meaning: '陸地（land）', example: '陸地・着陸', tip: '音読みは「リク」（陸地・着陸）。海の反対が陸。地球の陸地は表面の約30%だよ🌍' },
    { kanji: '菜', reading: 'な', meaning: '野菜（vegetable）', example: '野菜・菜の花', tip: '音読みは「サイ」（野菜・菜食）。草かんむりは植物。菜の花は春を告げる花🌿' },
    { kanji: '倉', reading: 'くら', meaning: '倉庫（warehouse）', example: '倉庫・鎌倉', tip: '音読みは「ソウ」（倉庫・鎌倉）。食べ物や荷物を保管する建物。warehouse🏠' },
    { kanji: '械', reading: 'かい', meaning: '機械（machine）', example: '機械・器械', tip: '音読みは「カイ」（機械・器械）。きへん（木）は道具の素材。機械は人の仕事を助けるよ⚙️' },
    { kanji: '熱', reading: 'ねつ', meaning: '熱（heat/fever）', example: '体温・熱心', tip: '音読みは「ネツ」（体温・熱心・情熱）。火（れっか）は下にある熱の形🔥' },
    { kanji: '塩', reading: 'しお', meaning: '塩（salt）', example: '食塩・塩分', tip: '音読みは「エン」（食塩・塩分）。海水を蒸発させると塩ができるよ。NaClが化学式🧂' },
    { kanji: '類', reading: 'るい', meaning: '種類（kind/type）', example: '種類・人類', tip: '音読みは「ルイ」（種類・人類・分類）。「類は友を呼ぶ」（似た者同士が集まる）ということわざも！' },
    { kanji: '浴', reading: 'よく', meaning: '入浴（bathe）', example: '入浴・海水浴', tip: '音読みは「ヨク」（入浴・海水浴・日光浴）。さんずいは水。お風呂に入ることだよ🛁' },
    { kanji: '察', reading: 'さつ', meaning: '観察（observe）', example: '観察・警察', tip: '音読みは「サツ」（観察・警察・診察）。しっかり見て判断すること。detective work🔍' },
    { kanji: '季', reading: 'き', meaning: '季節（season）', example: '季節・四季', tip: '音読みは「キ」（季節・四季・季語）。日本には春夏秋冬の四季がある。季語は俳句に使う季節語🌸' },
    { kanji: '節', reading: 'せつ', meaning: '節（joint/season）', example: '季節・関節', tip: '音読みは「セツ」（季節・関節・調節）や「セチ」（お節）。竹の節から来た字🎋' },
  ],
  '小5': [
    { kanji: '圧', reading: 'あつ', meaning: '圧力（pressure）', example: '気圧・水圧', tip: '音読みは「アツ」（気圧・水圧・圧力）。気圧が変わると天気が変わる。高気圧=晴れ!🌤️' },
    { kanji: '移', reading: 'い', meaning: '移動（move）', example: '移動・移住', tip: '音読みは「イ」（移動・移住・移転）。禾（のぎへん）は穀物の意味。場所を変えること🚚' },
    { kanji: '因', reading: 'いん', meaning: '原因（cause）', example: '原因・因果', tip: '音読みは「イン」（原因・因果・要因）。囲まれた中に「大」。原因と結果（因果関係）🔗' },
    { kanji: '営', reading: 'えい', meaning: '経営（manage）', example: '経営・営業', tip: '音読みは「エイ」（経営・営業・運営）。会社を経営する=manage a business。CEO！' },
    { kanji: '応', reading: 'おう', meaning: '反応（respond）', example: '反応・応援', tip: '音読みは「オウ」（反応・応援・応用）。「応える（こたえる）」とも読む。response📣' },
    { kanji: '仮', reading: 'か', meaning: '仮（temporary）', example: '仮定・仮面', tip: '音読みは「カ」（仮定・仮面）や「ケ」（仮病）。にんべんは人。一時的・仮の状態🎭' },
    { kanji: '価', reading: 'か', meaning: '価格（value）', example: '価格・評価', tip: '音読みは「カ」（価格・評価・物価）。にんべんは人。物の価値を人が決めること💰' },
    { kanji: '快', reading: 'かい', meaning: '快適（pleasant）', example: '快適・快晴', tip: '音読みは「カイ」（快適・快晴・痛快）。りっしんべんは心の意味。気持ちよい状態😊' },
    { kanji: '解', reading: 'かい', meaning: '解決（solve）', example: '解決・理解', tip: '音読みは「カイ」（解決・理解）。「つのへん（角）＋刀＋牛」。牛の角をほどく=解く🔓' },
    { kanji: '格', reading: 'かく', meaning: '格式（status）', example: '格差・資格', tip: '音読みは「カク」（格差・資格・格式・価格）。きへんは木。木の形が整っている=秩序ある状態' },
    { kanji: '確', reading: 'かく', meaning: '確認（confirm）', example: '確認・正確', tip: '音読みは「カク」（確認・正確・確実）。いしへんは石。石のように固く定まった状態✅' },
    { kanji: '額', reading: 'がく', meaning: '金額（amount）', example: '金額・額縁', tip: '音読みは「ガク」（金額・額縁）。おでこ（ひたい）も「額（ひたい）」と書くよ！面白い💡' },
    { kanji: '刊', reading: 'かん', meaning: '発刊（publish）', example: '週刊・発刊', tip: '音読みは「カン」（週刊・発刊・月刊）。りっとう（刀）は切ること。本を刷って世に出す📰' },
    { kanji: '幹', reading: 'かん', meaning: '幹（trunk/main）', example: '幹線・新幹線', tip: '音読みは「カン」（幹線・新幹線・根幹）。木の幹（みき）から来た字。新幹線の幹！🚅' },
    { kanji: '績', reading: 'せき', meaning: '成績（result）', example: '成績・業績', tip: '音読みは「セキ」（成績・業績・功績）。糸へんは仕事。努力して積み重ねた結果📊' },
  ],
  '小6': [
    { kanji: '異', reading: 'い', meaning: '異なる（different）', example: '異なる・異常', tip: '音読みは「イ」（異常・特異・異国）。「田（たんぼ）＋共（きょう）」の形。違う・変わった状態🌍' },
    { kanji: '遺', reading: 'い', meaning: '遺産（legacy）', example: '遺産・世界遺産', tip: '音読みは「イ」（遺産・世界遺産）や「ユイ」（遺言）。遺産は残されたもの。UNESCO🏛️' },
    { kanji: '域', reading: 'いき', meaning: '地域（area）', example: '地域・区域', tip: '音読みは「イキ」（地域・区域・領域）。くにがまえ（囗）は囲まれた範囲。boundary🗺️' },
    { kanji: '宇', reading: 'う', meaning: '宇宙（universe）', example: '宇宙・宇宙人', tip: '音読みは「ウ」（宇宙・宇宙人）。宇宙は英語で universe か space。宇宙の広さは想像を超える！🚀' },
    { kanji: '映', reading: 'えい', meaning: '映画（movie）', example: '映画・上映', tip: '音読みは「エイ」（映画・上映・反映）。ひへんは光。光が映る=映写・映画。cinema🎬' },
    { kanji: '沿', reading: 'えん', meaning: '沿岸（along）', example: '沿岸・沿線', tip: '音読みは「エン」（沿岸・沿線・沿道）。さんずいは水。川や道に沿って進む🚶' },
    { kanji: '我', reading: 'が', meaning: '自我（ego/self）', example: '自我・我慢', tip: '音読みは「ガ」（自我・我慢）や「ワ」（我）。「我慢（がまん）」は辛抱すること💪' },
    { kanji: '灰', reading: 'はい', meaning: '灰（ash/gray）', example: '灰色・火山灰', tip: '音読みは「カイ」（灰色・火山灰）。火山灰（かざんばい）は噴火でできる。灰色=gray🌋' },
    { kanji: '拡', reading: 'かく', meaning: '拡大（expand）', example: '拡大・拡張', tip: '音読みは「カク」（拡大・拡張・拡散）。てへんは手。手を広げるように広げる=expand🔍' },
    { kanji: '革', reading: 'かく', meaning: '改革（reform）', example: '改革・革命', tip: '音読みは「カク」（改革・革命）や「かわ」（皮革）。革（かわ）は動物の皮。変革=reform🔄' },
    { kanji: '閣', reading: 'かく', meaning: '内閣（cabinet）', example: '内閣・楼閣', tip: '音読みは「カク」（内閣・楼閣）。もんがまえは門。高い建物・内閣（政府）の意味🏛️' },
    { kanji: '割', reading: 'わり', meaning: '割合（ratio）', example: '割合・分割', tip: '音読みは「カツ」（分割・割愛）や「わり」（割合・2割）。りっとうは刃物。切って分けること✂️' },
    { kanji: '株', reading: 'かぶ', meaning: '株（stock）', example: '株式・株価', tip: '音読みは「シュ」（株式）。きへんは木。木の根元（かぶ）から→株式（かぶしき）は会社の権利💹' },
    { kanji: '干', reading: 'ほ', meaning: '干す（dry）', example: '干潮・干す', tip: '音読みは「カン」（干潮・干渉・干ばつ）。洗濯物を干す・のりを干す。乾燥させること☀️' },
    { kanji: '巻', reading: 'まき', meaning: '巻く（roll）', example: '巻物・一巻', tip: '音読みは「カン」（巻物・第一巻）。くるくる巻いた形から。漫画の第1巻もこれ！📜' },
  ],
}

const GRADE_COLORS: Record<Grade, string> = {
  '小1': '#4ade80',
  '小2': '#34d399',
  '小3': '#60a5fa',
  '小4': '#c4a8ff',
  '小5': '#f0c040',
  '小6': '#f87171',
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function makeChoices(correct: KanjiEntry, pool: KanjiEntry[]): string[] {
  const others = shuffle(pool.filter((k) => k.reading !== correct.reading)).slice(0, 3)
  return shuffle([correct.reading, ...others.map((o) => o.reading)])
}

type Phase = 'select' | 'playing' | 'result'

export default function KanjiQuiz() {
  const [phase, setPhase] = useState<Phase>('select')
  const [grade, setGrade] = useState<Grade>('小3')
  const [queue, setQueue] = useState<KanjiEntry[]>([])
  const [index, setIndex] = useState(0)
  const [choices, setChoices] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [miss, setMiss] = useState(0)

  const TOTAL = 10

  const startQuiz = useCallback((g: Grade) => {
    const q = shuffle(KANJI_DATA[g]).slice(0, TOTAL)
    setGrade(g)
    setQueue(q)
    setIndex(0)
    setScore(0)
    setMiss(0)
    setSelected(null)
    setChoices(makeChoices(q[0], KANJI_DATA[g]))
    setPhase('playing')
  }, [])

  function choose(choice: string) {
    if (selected !== null) return
    setSelected(choice)
    if (choice === queue[index].reading) setScore((s) => s + 1)
    else setMiss((m) => m + 1)
  }

  function goNext() {
    if (index + 1 >= TOTAL) { setPhase('result'); return }
    const next = index + 1
    setIndex(next)
    setChoices(makeChoices(queue[next], KANJI_DATA[grade]))
    setSelected(null)
  }

  const color = GRADE_COLORS[grade]

  if (phase === 'select') {
    return (
      <div className="min-h-screen bg-[#071628] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6">
        <Link href="/lab" className="absolute top-6 left-6 text-[#8892b0] hover:text-[#c4a8ff] text-sm transition-colors">← ラボに戻る</Link>
        <div className="text-6xl mb-4">📖</div>
        <h1 className="text-4xl font-black mb-2 text-[#c4a8ff]">漢字クイズ</h1>
        <p className="text-[#8892b0] mb-3 text-center">学年を選んでスタート！<br />読み方を4択で答えて解説もチェック</p>
        <p className="text-[#8892b0] text-sm mb-8">全10問・解説付き</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-sm">
          {(Object.keys(KANJI_DATA) as Grade[]).map((g) => (
            <button key={g} onClick={() => startQuiz(g)}
              className="py-5 rounded-2xl font-black text-xl text-[#050b14] transition-all hover:scale-[1.05]"
              style={{ background: GRADE_COLORS[g], boxShadow: `0 0 20px ${GRADE_COLORS[g]}40` }}>
              {g}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (phase === 'result') {
    const rank = score >= 9 ? '🏆 完璧！' : score >= 7 ? '🥇 すごい！' : score >= 5 ? '🥈 よくできました' : '🥉 もう一回！'
    return (
      <div className="min-h-screen bg-[#071628] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">{rank.split(' ')[0]}</div>
        <h2 className="text-3xl font-black mb-1" style={{ color }}>{rank.split(' ').slice(1).join(' ')}</h2>
        <p className="text-[#8892b0] mb-8">{grade} の漢字 {TOTAL}問</p>
        <div className="flex gap-10 mb-10">
          <div className="text-center"><div className="text-5xl font-black text-[#4ade80]">{score}</div><div className="text-[#8892b0] text-sm mt-1">正解</div></div>
          <div className="text-center"><div className="text-5xl font-black text-[#f87171]">{miss}</div><div className="text-[#8892b0] text-sm mt-1">まちがい</div></div>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button onClick={() => startQuiz(grade)}
            className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] transition-all hover:scale-[1.02]"
            style={{ background: color }}>もう一回！</button>
          <button onClick={() => setPhase('select')}
            className="w-full py-4 rounded-2xl font-bold text-lg border border-white/20 text-[#8892b0] hover:text-white hover:border-white/40 transition-all">
            学年を変える
          </button>
          <Link href="/lab" className="w-full py-4 rounded-2xl font-bold text-lg border border-white/10 text-[#8892b0] hover:text-[#c4a8ff] transition-all text-center">ラボに戻る</Link>
        </div>
      </div>
    )
  }

  const current = queue[index]
  if (!current) return null
  const isCorrect = selected === current.reading

  return (
    <div className="min-h-screen bg-[#071628] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-4 py-20">
      <div className="fixed top-0 left-0 right-0 px-6 py-4 flex items-center justify-between bg-[#071628]/90 backdrop-blur-sm">
        <button onClick={() => setPhase('select')} className="text-[#8892b0] hover:text-white text-sm transition-colors">← やめる</button>
        <span className="text-sm text-[#8892b0]">{index + 1} / {TOTAL}</span>
        <div className="flex gap-4 text-sm font-bold">
          <span className="text-[#4ade80]">○ {score}</span>
          <span className="text-[#f87171]">✗ {miss}</span>
        </div>
      </div>
      <div className="fixed top-14 left-0 right-0 h-1.5 bg-white/10">
        <div className="h-full transition-all duration-500" style={{ width: `${(index / TOTAL) * 100}%`, background: color }} />
      </div>

      <div className="w-full max-w-sm text-center">
        <p className="text-[#8892b0] text-sm mb-4 tracking-widest uppercase">{grade} — 読み方は？</p>

        <div className="text-[9rem] font-black leading-none mb-2"
          style={{ color: selected ? (isCorrect ? '#4ade80' : '#f87171') : '#e8f0fe' }}>
          {current.kanji}
        </div>
        <p className="text-[#8892b0] text-sm mb-1">{current.meaning}</p>
        <p className="text-xs mb-5" style={{ color: `${color}99` }}>例）{current.example}</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {choices.map((c) => {
            const isCor = c === current.reading
            const isSel = c === selected
            let bg = 'rgba(255,255,255,0.06)'
            let border = 'rgba(255,255,255,0.12)'
            let textColor = '#e8f0fe'
            if (selected !== null) {
              if (isCor) { bg = `${color}30`; border = color; textColor = color }
              else if (isSel) { bg = 'rgba(248,113,113,0.2)'; border = '#f87171'; textColor = '#f87171' }
            }
            return (
              <button key={c} onClick={() => choose(c)} disabled={selected !== null}
                className="py-4 rounded-2xl font-bold text-lg transition-all hover:scale-[1.03] disabled:cursor-default"
                style={{ background: bg, border: `2px solid ${border}`, color: textColor }}>
                {c}
              </button>
            )
          })}
        </div>

        {selected !== null && (
          <div className={`rounded-2xl p-4 mb-4 text-left ${isCorrect ? 'border' : 'border'}`}
            style={{
              background: isCorrect ? `${color}15` : 'rgba(248,113,113,0.1)',
              borderColor: isCorrect ? `${color}50` : 'rgba(248,113,113,0.4)',
            }}>
            <p className="font-black text-sm mb-1" style={{ color: isCorrect ? color : '#f87171' }}>
              {isCorrect ? `✓ 正解！「${current.reading}」` : `✗ 正解は「${current.reading}」だよ`}
            </p>
            <p className="text-[#e8f0fe] text-sm leading-relaxed">{current.tip}</p>
          </div>
        )}

        {selected !== null && (
          <button onClick={goNext}
            className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] transition-all hover:scale-[1.02]"
            style={{ background: color, boxShadow: `0 0 25px ${color}50` }}>
            {index + 1 < TOTAL ? '次の問題 →' : '結果を見る！'}
          </button>
        )}
      </div>
    </div>
  )
}
