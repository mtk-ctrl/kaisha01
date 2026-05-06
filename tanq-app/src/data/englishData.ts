// 英語クイズ単語データ — Phase 1: 120語
// Ken（コンテンツディレクター）仕様: 文科省「小学校英語」必修600語の20%
// 8カテゴリ: 身の回り20 / 食べ物20 / 動物15 / 自然15 / 動作15 / 気持ち15 / 家族10 / 場所10

export interface WordEntry {
  emoji: string
  japanese: string
  english: string
  category: string
  tip: string
  sentence: string
  sentenceJP: string
}

export const WORDS: WordEntry[] = [

  // ── 身の回りのもの（20語） ───────────────────────────────────────
  { emoji: '📚', japanese: 'ほん', english: 'book', category: '身の回り', tip: '"ブック"と読む。1冊・2冊はone book / two books。複数形はsをつけよう📖', sentence: 'She reads a book before bed.', sentenceJP: '彼女は寝る前に本を読みます。' },
  { emoji: '✏️', japanese: 'えんぴつ', english: 'pencil', category: '身の回り', tip: '"ペンスル"と読む。pen（ペン）との違いは消せること。stationery（文房具）の仲間！', sentence: 'Please write with a pencil.', sentenceJP: 'えんぴつで書いてください。' },
  { emoji: '🎒', japanese: 'ランドセル・リュック', english: 'backpack', category: '身の回り', tip: '"バックパック"と読む。ランドセルは日本独特！海外ではbackpackと呼ぶよ🎒', sentence: 'I put my books in my backpack.', sentenceJP: 'リュックに本を入れました。' },
  { emoji: '🎮', japanese: 'ゲーム', english: 'game', category: '身の回り', tip: '"ゲイム"と読む。video game・board game・card game—色々なゲームがあるね🎮', sentence: 'Let\'s play a game together.', sentenceJP: '一緒にゲームをしましょう。' },
  { emoji: '🚗', japanese: 'くるま', english: 'car', category: '身の回り', tip: '"カー"と読む。automobile（オートモービル）とも言う。go for a drive =ドライブに行く！', sentence: 'We went to the park by car.', sentenceJP: '私たちは車で公園に行きました。' },
  { emoji: '✈️', japanese: 'ひこうき', english: 'airplane', category: '身の回り', tip: '"エアプレイン"と読む。aeroplane（英）= airplane（米）。空港はairport🛫', sentence: 'The airplane flew over the clouds.', sentenceJP: 'ひこうきは雲の上を飛んだ。' },
  { emoji: '🎵', japanese: 'おんがく', english: 'music', category: '身の回り', tip: '"ミュージック"と読む。musician（音楽家）、musical（ミュージカル）—仲間の言葉がたくさん！', sentence: 'I love listening to music.', sentenceJP: '私は音楽を聴くのが大好きです。' },
  { emoji: '🪑', japanese: 'つくえ', english: 'desk', category: '身の回り', tip: '"デスク"と読む。chair（いす）とセットで覚えよう。desk=勉強机、table=食卓🖥️', sentence: 'My desk is next to the window.', sentenceJP: '私の机は窓の横にあります。' },
  { emoji: '🪑', japanese: 'いす', english: 'chair', category: '身の回り', tip: '"チェア"と読む。deskとセットで覚えよう。"Please take a seat" =「座ってください」💺', sentence: 'Please sit on the chair.', sentenceJP: 'いすに座ってください。' },
  { emoji: '🪟', japanese: 'まど', english: 'window', category: '身の回り', tip: '"ウィンドウ"と読む。コンピュータの「ウィンドウ」も同じ単語！open the window=窓を開ける🪟', sentence: 'Please open the window.', sentenceJP: 'まどを開けてください。' },
  { emoji: '🚪', japanese: 'ドア', english: 'door', category: '身の回り', tip: '"ドア"と読む。indoor=室内、outdoor=屋外。knock on the door=ドアをノックする🚪', sentence: 'Please close the door.', sentenceJP: 'ドアを閉めてください。' },
  { emoji: '👜', japanese: 'かばん', english: 'bag', category: '身の回り', tip: '"バッグ"と読む。handbag（ハンドバッグ）、shopping bag（買い物袋）など種類がたくさん👜', sentence: 'I bought a new bag yesterday.', sentenceJP: '昨日新しいかばんを買いました。' },
  { emoji: '🍽️', japanese: 'テーブル', english: 'table', category: '身の回り', tip: '"テイブル"と読む。desk（机）は勉強用、tableは食事用。table manners=食事のマナー🍽️', sentence: 'We eat dinner at the table.', sentenceJP: '私たちはテーブルで夕食を食べます。' },
  { emoji: '🖊️', japanese: 'ペン', english: 'pen', category: '身の回り', tip: '"ペン"と読む。pencilとの違いは消せないこと。"The pen is mightier than the sword"（ペンは剣より強し）🖊️', sentence: 'Can I borrow your pen?', sentenceJP: 'あなたのペンを借りてもいいですか？' },
  { emoji: '🩹', japanese: 'けしゴム', english: 'eraser', category: '身の回り', tip: '"イレイザー"と読む。英国では rubber（ラバー）とも言う。erase=消すの意味✏️', sentence: 'I need an eraser for this mistake.', sentenceJP: 'この間違いをけしゴムで消す必要があります。' },
  { emoji: '⏰', japanese: 'とけい', english: 'clock', category: '身の回り', tip: '"クロック"と読む。clock（置き時計・壁時計）とwatch（腕時計）を区別しよう⏰', sentence: 'The clock on the wall shows three o\'clock.', sentenceJP: '壁のとけいは3時を示しています。' },
  { emoji: '⚽', japanese: 'ボール', english: 'ball', category: '身の回り', tip: '"ボール"と読む。baseball（野球）、basketball（バスケ）、football（サッカー）—スポーツの中心⚽', sentence: 'Kick the ball into the goal.', sentenceJP: 'ゴールにボールをけり入れてください。' },
  { emoji: '☕', japanese: 'カップ', english: 'cup', category: '身の回り', tip: '"カップ"と読む。cup（お茶・コーヒー用）とglass（水・ジュース用）で使い分けるよ☕', sentence: 'She drinks coffee from a cup.', sentenceJP: '彼女はカップでコーヒーを飲みます。' },
  { emoji: '☂️', japanese: 'かさ', english: 'umbrella', category: '身の回り', tip: '"アンブレラ"と読む。雨の日には I have an umbrella.（かさを持っている）！☂️', sentence: 'Don\'t forget your umbrella today.', sentenceJP: '今日はかさを忘れないでください。' },
  { emoji: '✂️', japanese: 'はさみ', english: 'scissors', category: '身の回り', tip: '"シザーズ"と読む。常に複数形（a pair of scissors）で使うよ。cut with scissors=はさみで切る✂️', sentence: 'I need scissors to cut the paper.', sentenceJP: '紙を切るためにはさみが必要です。' },

  // ── 食べ物・飲み物（20語） ───────────────────────────────────────
  { emoji: '🍎', japanese: 'リンゴ', english: 'apple', category: '食べ物', tip: '"アップル"と読む。ニュートンがリンゴを見て重力を発見！Apple社のロゴもリンゴ🍏', sentence: 'I eat an apple every day.', sentenceJP: '私は毎日リンゴを食べます。' },
  { emoji: '🍙', japanese: 'おにぎり', english: 'rice ball', category: '食べ物', tip: '"ライスボール"と読む。onigiriがそのまま英語になってきてるよ🍙', sentence: 'I made a rice ball for lunch.', sentenceJP: '昼食におにぎりを作りました。' },
  { emoji: '🍊', japanese: 'みかん・オレンジ', english: 'orange', category: '食べ物', tip: '"オレンジ"と読む。色のオレンジも同じ単語！The sky turned orange（空がオレンジ色に）🍊', sentence: 'An orange is sweet and juicy.', sentenceJP: 'みかんは甘くてジューシーです。' },
  { emoji: '🎂', japanese: 'ケーキ', english: 'cake', category: '食べ物', tip: '"ケイク"と読む。piece of cake は「超かんたん」の意味も！It\'s a piece of cake!😄', sentence: 'We ate cake at the birthday party.', sentenceJP: '誕生日パーティーでケーキを食べました。' },
  { emoji: '🍕', japanese: 'ピザ', english: 'pizza', category: '食べ物', tip: '"ピーツァ"と読む。イタリア語から来た言葉！pizza parlor=ピザ屋🍕', sentence: 'Pizza is popular all over the world.', sentenceJP: 'ピザは世界中で人気があります。' },
  { emoji: '🥛', japanese: 'ぎゅうにゅう', english: 'milk', category: '食べ物', tip: '"ミルク"と読む。Milky Way（天の川）も"ミルクの道"から！カルシウムたっぷり🥛', sentence: 'I drink a glass of milk every morning.', sentenceJP: '私は毎朝コップ1杯の牛乳を飲みます。' },
  { emoji: '🍞', japanese: 'パン', english: 'bread', category: '食べ物', tip: '"ブレッド"と読む。slice of bread=パン1枚。toast（トースト）はbreadを焼いたもの🍞', sentence: 'I eat bread for breakfast.', sentenceJP: '私は朝食にパンを食べます。' },
  { emoji: '💧', japanese: 'みず', english: 'water', category: '食べ物', tip: '"ウォーター"と読む。a glass of water=コップ1杯の水。体の約60%は水！💧', sentence: 'Please give me a glass of water.', sentenceJP: 'コップ1杯の水をください。' },
  { emoji: '🥚', japanese: 'たまご', english: 'egg', category: '食べ物', tip: '"エッグ"と読む。boiled egg=ゆでたまご、fried egg=目玉焼き、scrambled egg=いり卵🥚', sentence: 'I like fried eggs for breakfast.', sentenceJP: '私は朝食に目玉焼きが好きです。' },
  { emoji: '🍚', japanese: 'ごはん', english: 'rice', category: '食べ物', tip: '"ライス"と読む。rice paddy=田んぼ。日本のコメはJapanese rice（短粒種）が有名🌾', sentence: 'We eat rice every day in Japan.', sentenceJP: '日本では毎日ごはんを食べます。' },
  { emoji: '🍲', japanese: 'スープ', english: 'soup', category: '食べ物', tip: '"スープ"と読む。miso soup=みそ汁。soup spoon=スープ用の大きなスプーンで食べるよ🥣', sentence: 'This soup is hot and delicious.', sentenceJP: 'このスープは熱くておいしいです。' },
  { emoji: '🍌', japanese: 'バナナ', english: 'banana', category: '食べ物', tip: '"バナナ"と読む。エネルギー補給にぴったり！banana split=バナナサンデーは人気デザート🍌', sentence: 'Monkeys love to eat bananas.', sentenceJP: 'さるはバナナを食べるのが大好きです。' },
  { emoji: '🍇', japanese: 'ぶどう', english: 'grape', category: '食べ物', tip: '"グレイプ"と読む。grapefruit（グレープフルーツ）も同じ語源。wine（ワイン）はぶどうから作る🍇', sentence: 'These grapes are very sweet.', sentenceJP: 'このぶどうはとても甘いです。' },
  { emoji: '🥔', japanese: 'じゃがいも', english: 'potato', category: '食べ物', tip: '"ポテイトウ"と読む。french fries=フライドポテト（フランス料理ではない）。chip(英)とも言うよ🍟', sentence: 'I like mashed potato.', sentenceJP: '私はマッシュポテトが好きです。' },
  { emoji: '🍗', japanese: 'とりにく', english: 'chicken', category: '食べ物', tip: '"チキン"と読む。chicken=鶏肉・ニワトリ。fried chicken（フライドチキン）は世界中で人気🍗', sentence: 'Fried chicken is my favorite food.', sentenceJP: 'フライドチキンは私の大好物です。' },
  { emoji: '🧃', japanese: 'ジュース', english: 'juice', category: '食べ物', tip: '"ジュース"と読む。orange juice=オレンジジュース。100% juice が本当のジュース！🧃', sentence: 'I drink orange juice every morning.', sentenceJP: '私は毎朝オレンジジュースを飲みます。' },
  { emoji: '🍵', japanese: 'おちゃ', english: 'tea', category: '食べ物', tip: '"ティー"と読む。green tea=緑茶、black tea=紅茶。英国は tea time（午後3時）が文化！☕', sentence: 'Would you like some tea?', sentenceJP: 'おちゃはいかがですか？' },
  { emoji: '🍦', japanese: 'アイスクリーム', english: 'ice cream', category: '食べ物', tip: '"アイスクリーム"と読む。ice（氷）+ cream（クリーム）。soft serve=ソフトクリーム🍦', sentence: 'I love eating ice cream in summer.', sentenceJP: '私は夏にアイスクリームを食べるのが大好きです。' },
  { emoji: '🍫', japanese: 'チョコレート', english: 'chocolate', category: '食べ物', tip: '"チョコレット"と読む。カカオから作る。dark chocolate=ビター、milk chocolate=ミルク🍫', sentence: 'She gave me a box of chocolate.', sentenceJP: '彼女はチョコレートの箱をくれました。' },
  { emoji: '🥪', japanese: 'サンドイッチ', english: 'sandwich', category: '食べ物', tip: '"サンドウィッチ"と読む。Sandwich伯爵（英国の貴族）が考案したと言われてるよ🥪', sentence: 'I made a sandwich for lunch.', sentenceJP: '昼食にサンドイッチを作りました。' },

  // ── 動物（15語） ────────────────────────────────────────────────
  { emoji: '🐕', japanese: 'イヌ', english: 'dog', category: '動物', tip: '"ドッグ"と読む。"It\'s raining cats and dogs"（土砂降り）という慣用句があるよ！', sentence: 'My dog loves to run in the park.', sentenceJP: '私のイヌは公園を走るのが大好きです。' },
  { emoji: '🐱', japanese: 'ネコ', english: 'cat', category: '動物', tip: '"キャット"と読む。英語でネコの鳴き声は meow（ミャオ）と書くよ🐾', sentence: 'The cat is sleeping on the sofa.', sentenceJP: 'ネコはソファの上で寝ています。' },
  { emoji: '🐟', japanese: 'さかな', english: 'fish', category: '動物', tip: '"フィッシュ"と読む。fish は単複同形が多い（1 fish, 2 fish）。fish and chips は英国名物！', sentence: 'There are many fish in the river.', sentenceJP: '川にはたくさんの魚がいます。' },
  { emoji: '🐰', japanese: 'うさぎ', english: 'rabbit', category: '動物', tip: '"ラビット"と読む。pull a rabbit out of a hat=奇跡を起こす慣用句。rabbit ears=うさ耳🐰', sentence: 'The rabbit jumped over the fence.', sentenceJP: 'うさぎはフェンスを飛び越えました。' },
  { emoji: '🐴', japanese: 'うま', english: 'horse', category: '動物', tip: '"ホース"と読む。horsepower（馬力）はエンジンの単位！horseback riding=乗馬🐴', sentence: 'The horse runs very fast.', sentenceJP: 'うまはとても速く走ります。' },
  { emoji: '🐦', japanese: 'とり', english: 'bird', category: '動物', tip: '"バード"と読む。"A bird in hand is worth two in the bush"（一鳥は藪の二鳥に値する）ことわざ🐦', sentence: 'The bird is singing in the tree.', sentenceJP: 'とりは木の中でさえずっています。' },
  { emoji: '🦁', japanese: 'ライオン', english: 'lion', category: '動物', tip: '"ライオン"と読む。"The Lion King"（ライオンキング）！百獣の王。roar=ほえる声🦁', sentence: 'The lion is the king of the jungle.', sentenceJP: 'ライオンはジャングルの王様です。' },
  { emoji: '🐘', japanese: 'ゾウ', english: 'elephant', category: '動物', tip: '"エレファント"と読む。陸上最大の動物。elephant never forgets=記憶力が非常に良い🐘', sentence: 'Elephants have long noses.', sentenceJP: 'ゾウは長い鼻を持っています。' },
  { emoji: '🐧', japanese: 'ペンギン', english: 'penguin', category: '動物', tip: '"ペングウィン"と読む。南極に住む鳥だけど飛べない。泳ぎが得意！swim fast🐧', sentence: 'Penguins live in cold places.', sentenceJP: 'ペンギンは寒い場所に住んでいます。' },
  { emoji: '🐒', japanese: 'さる', english: 'monkey', category: '動物', tip: '"マンキー"と読む。"monkey around"（ふざける）。copycat=まねをする人🐒', sentence: 'The monkey is climbing the tree.', sentenceJP: 'さるは木を登っています。' },
  { emoji: '🐸', japanese: 'カエル', english: 'frog', category: '動物', tip: '"フロッグ"と読む。tadpole=オタマジャクシ。"Prince turned into a frog"（かえるの王様）童話🐸', sentence: 'The frog jumped into the pond.', sentenceJP: 'カエルは池に飛び込みました。' },
  { emoji: '🦋', japanese: 'チョウ', english: 'butterfly', category: '動物', tip: '"バタフライ"と読む。butterfly stroke=バタフライ（水泳）。caterpillar=イモムシ→さなぎ→蝶🦋', sentence: 'The butterfly is very beautiful.', sentenceJP: 'チョウはとても美しいです。' },
  { emoji: '🐝', japanese: 'ハチ', english: 'bee', category: '動物', tip: '"ビー"と読む。spelling bee=スペリングコンテスト（英語）。busy as a bee=とても忙しい🐝', sentence: 'Bees make honey.', sentenceJP: 'ハチははちみつを作ります。' },
  { emoji: '🐻', japanese: 'クマ', english: 'bear', category: '動物', tip: '"ベア"と読む。teddy bear=テディベア（ぬいぐるみ）。polar bear=白熊。bear hug=強いハグ🐻', sentence: 'A bear sleeps all winter.', sentenceJP: 'クマは冬中眠ります。' },
  { emoji: '🐢', japanese: 'カメ', english: 'turtle', category: '動物', tip: '"タートル"と読む。tortoise=陸のカメ、turtle=海のカメ。"slow and steady wins the race"🐢', sentence: 'Turtles live for a very long time.', sentenceJP: 'カメはとても長生きします。' },

  // ── 自然・天気（15語） ───────────────────────────────────────────
  { emoji: '🌸', japanese: 'はな', english: 'flower', category: '自然', tip: '"フラワー"と読む。桜は cherry blossom（チェリーブロッサム）。お花見は blossom viewing🌸', sentence: 'The flowers in the garden are beautiful.', sentenceJP: '庭の花は美しいです。' },
  { emoji: '🌙', japanese: 'つき', english: 'moon', category: '自然', tip: '"ムーン"と読む。月曜日は Monday — Moon\'s day（月の日）が語源！full moon=満月🌙', sentence: 'The moon is bright tonight.', sentenceJP: '今夜は月が明るい。' },
  { emoji: '☀️', japanese: 'たいよう', english: 'sun', category: '自然', tip: '"サン"と読む。日曜日はSunday—Sun\'s day（太陽の日）。sunflower=ひまわり☀️', sentence: 'The sun rises in the east.', sentenceJP: '太陽は東から昇ります。' },
  { emoji: '🌊', japanese: 'うみ', english: 'sea', category: '自然', tip: '"スィー"と読む。海の水はsaltwater（塩水）。ocean（オーシャン）はより大きな海域🌊', sentence: 'We swim in the sea every summer.', sentenceJP: '私たちは毎年夏に海で泳ぎます。' },
  { emoji: '⛰️', japanese: 'やま', english: 'mountain', category: '自然', tip: '"マウンテン"と読む。富士山はMount Fuji！mountain climbing=登山🏔️', sentence: 'Mount Fuji is a famous mountain.', sentenceJP: '富士山は有名な山です。' },
  { emoji: '⭐', japanese: 'ほし', english: 'star', category: '自然', tip: '"スター"と読む。Twinkle twinkle little star🎵 starfish=ヒトデ。star-shaped=星形⭐', sentence: 'I can see many stars at night.', sentenceJP: '夜には星がたくさん見えます。' },
  { emoji: '🌈', japanese: 'にじ', english: 'rainbow', category: '自然', tip: '"レインボー"と読む。rain（雨）+ bow（弓）= rainbow。光が屈折してできる！🌈', sentence: 'A rainbow appeared after the rain.', sentenceJP: '雨の後ににじが現れました。' },
  { emoji: '☁️', japanese: 'くも', english: 'cloud', category: '自然', tip: '"クラウド"と読む。cloud computing（クラウドコンピューティング）も同じ単語！on cloud nine=とても幸せ☁️', sentence: 'There are many clouds in the sky today.', sentenceJP: '今日は空にくもがたくさんあります。' },
  { emoji: '🌧️', japanese: 'あめ', english: 'rain', category: '自然', tip: '"レイン"と読む。rainbow（虹）のrain！rainy day=雨の日。umbrella=かさが必要☔', sentence: 'It will rain tomorrow.', sentenceJP: '明日は雨が降るでしょう。' },
  { emoji: '💨', japanese: 'かぜ', english: 'wind', category: '自然', tip: '"ウィンド"と読む。window（まど）の語源はwind＋eye（風の目）！windy=風が強い💨', sentence: 'The wind is blowing strongly today.', sentenceJP: '今日は風が強く吹いています。' },
  { emoji: '❄️', japanese: 'ゆき', english: 'snow', category: '自然', tip: '"スノー"と読む。snowflake=雪の結晶（6角形）。snowman=雪だるま。snowball=雪玉❄️', sentence: 'It snowed a lot last winter.', sentenceJP: '去年の冬はたくさん雪が降りました。' },
  { emoji: '🌳', japanese: 'き', english: 'tree', category: '自然', tip: '"トゥリー"と読む。Christmas tree=クリスマスツリー。family tree=家系図。tree house=ツリーハウス🌳', sentence: 'The tree in our garden is very tall.', sentenceJP: '私たちの庭の木はとても高いです。' },
  { emoji: '🏞️', japanese: 'かわ', english: 'river', category: '自然', tip: '"リバー"と読む。riverbank=川岸。Amazon River（アマゾン川）は世界最大の川。river fish=川魚🏞️', sentence: 'We caught fish in the river.', sentenceJP: '私たちは川で魚を釣りました。' },
  { emoji: '🌤️', japanese: 'そら', english: 'sky', category: '自然', tip: '"スカイ"と読む。skyline=スカイライン（都市の輪郭）。the sky is the limit=可能性は無限大！🌤️', sentence: 'The sky is clear and blue today.', sentenceJP: '今日は空が澄んで青い。' },
  { emoji: '🍂', japanese: 'はっぱ・葉', english: 'leaf', category: '自然', tip: '"リーフ"と読む。leaflet=チラシ（小さな葉）。four-leaf clover=四つ葉のクローバー（幸運）🍃', sentence: 'The leaves turn red in autumn.', sentenceJP: '葉は秋に赤くなります。' },

  // ── 動作・動詞（15語） ───────────────────────────────────────────
  { emoji: '🏃', japanese: 'はしる', english: 'run', category: '動作', tip: '"ラン"と読む。run も多義語！プログラムを実行するもrun（run a program）と言うよ💻', sentence: 'She runs five kilometers every morning.', sentenceJP: '彼女は毎朝5キロ走ります。' },
  { emoji: '🏊', japanese: 'およぐ', english: 'swim', category: '動作', tip: '"スウィム"と読む。swimmer（水泳選手）、swimming pool（プール）。I can swim!=泳げる！🏊', sentence: 'I can swim very fast.', sentenceJP: '私はとても速く泳げます。' },
  { emoji: '🤸', japanese: 'とぶ・ジャンプする', english: 'jump', category: '動作', tip: '"ジャンプ"と読む。jump rope=なわとび。high jump=走り高跳び。bungee jumping=バンジージャンプ🤸', sentence: 'Can you jump over this rope?', sentenceJP: 'このなわを飛び越えられますか？' },
  { emoji: '🍽️', japanese: 'たべる', english: 'eat', category: '動作', tip: '"イート"と読む。eat out=外食する。eat up=全部食べる。Let\'s eat!=食べましょう！🍽️', sentence: 'I eat lunch at twelve o\'clock.', sentenceJP: '私は12時に昼食を食べます。' },
  { emoji: '😴', japanese: 'ねる', english: 'sleep', category: '動作', tip: '"スリープ"と読む。go to sleep=眠る。sleep tight=ぐっすり眠る。sleepy=眠い😴', sentence: 'I sleep eight hours every night.', sentenceJP: '私は毎晩8時間眠ります。' },
  { emoji: '📖', japanese: 'よむ', english: 'read', category: '動作', tip: '"リード"と読む。reading=読書。readingは大事なskill（スキル）！read aloud=音読する📖', sentence: 'I read books every day.', sentenceJP: '私は毎日本を読みます。' },
  { emoji: '✍️', japanese: 'かく', english: 'write', category: '動作', tip: '"ライト"と読む。writer=作家。write a letter=手紙を書く。handwriting=手書き✍️', sentence: 'Please write your name here.', sentenceJP: 'ここにあなたの名前を書いてください。' },
  { emoji: '🎮', japanese: 'あそぶ', english: 'play', category: '動作', tip: '"プレイ"と読む。play soccer=サッカーをする。play the piano=ピアノを弾く（楽器はthe）🎸', sentence: 'The children play in the park every day.', sentenceJP: '子供たちは毎日公園で遊びます。' },
  { emoji: '🚶', japanese: 'あるく', english: 'walk', category: '動作', tip: '"ウォーク"と読む。take a walk=散歩する。walkway=歩道。moonwalk=ムーンウォーク🚶', sentence: 'I walk to school every day.', sentenceJP: '私は毎日学校まで歩きます。' },
  { emoji: '🎤', japanese: 'うたう', english: 'sing', category: '動作', tip: '"スィング"と読む。singer=歌手。sing a song=歌を歌う。karaoke=カラオケは日本語！🎤', sentence: 'She sings very well.', sentenceJP: '彼女はとても上手に歌います。' },
  { emoji: '💃', japanese: 'おどる', english: 'dance', category: '動作', tip: '"ダンス"と読む。dancer=ダンサー。dance moves=ダンスの動き。shall we dance?=踊りましょうか💃', sentence: 'I love to dance to music.', sentenceJP: '私は音楽に合わせて踊るのが大好きです。' },
  { emoji: '🍳', japanese: 'りょうりする', english: 'cook', category: '動作', tip: '"クック"と読む。cooker=調理器具。cookbook=料理本。cook dinner=夕食を作る🍳', sentence: 'My mother cooks dinner every evening.', sentenceJP: '私の母は毎晩夕食を作ります。' },
  { emoji: '📚', japanese: 'べんきょうする', english: 'study', category: '動作', tip: '"スタディ"と読む。student=生徒（勉強する人）。study hard=一生懸命勉強する📚', sentence: 'I study English every day.', sentenceJP: '私は毎日英語を勉強します。' },
  { emoji: '👂', japanese: 'きく', english: 'listen', category: '動作', tip: '"リッスン"と読む。listen to music=音楽を聴く。listen carefully=注意深く聞く👂', sentence: 'Please listen to your teacher.', sentenceJP: '先生の言うことをよく聞いてください。' },
  { emoji: '👁️', japanese: 'みる・みている', english: 'watch', category: '動作', tip: '"ウォッチ"と読む。watch TV=テレビを見る。wristwatch=腕時計。watch out!=気をつけて！👀', sentence: 'We watch TV after dinner.', sentenceJP: '私たちは夕食後にテレビを見ます。' },

  // ── 気持ち・形容詞（15語） ───────────────────────────────────────
  { emoji: '😊', japanese: 'うれしい・しあわせ', english: 'happy', category: '気持ち', tip: '"ハッピー"と読む。Happy birthday! Happy New Year! お祝いの定番表現😊', sentence: 'I am very happy today!', sentenceJP: '今日はとてもうれしいです！' },
  { emoji: '😢', japanese: 'かなしい', english: 'sad', category: '気持ち', tip: '"サッド"と読む。I\'m sad.（かなしいな）、Don\'t be sad!（かなしまないで）😢', sentence: 'He looked sad after losing the game.', sentenceJP: '彼は試合に負けた後かなしそうにしていた。' },
  { emoji: '🔴', japanese: 'あかい', english: 'red', category: '気持ち', tip: '"レッド"と読む。red card（レッドカード）、red carpet（レッドカーペット）🔴', sentence: 'The traffic light is red.', sentenceJP: '信号が赤です。' },
  { emoji: '💙', japanese: 'あおい', english: 'blue', category: '気持ち', tip: '"ブルー"と読む。"I\'m feeling blue"は「気分が落ち込んでいる」という慣用句💙', sentence: 'The sky is blue on a sunny day.', sentenceJP: '晴れた日は空が青いです。' },
  { emoji: '💚', japanese: 'みどり', english: 'green', category: '気持ち', tip: '"グリーン"と読む。"go green"（エコにする）。Green energy=再生可能エネルギー💚', sentence: 'The grass is green in spring.', sentenceJP: '春には草が緑色です。' },
  { emoji: '😠', japanese: 'おこっている', english: 'angry', category: '気持ち', tip: '"アングリー"と読む。Angry Birds=アングリーバード！Don\'t be angry.（怒らないで）😠', sentence: 'She was angry because I was late.', sentenceJP: '私が遅刻したので彼女は怒っていました。' },
  { emoji: '🔷', japanese: 'おおきい', english: 'big', category: '気持ち', tip: '"ビッグ"と読む。big dream=大きな夢。Big Mac=ビッグマック。think big!=大きく考えよう🔷', sentence: 'That is a very big dog.', sentenceJP: 'あれはとても大きいイヌです。' },
  { emoji: '🔹', japanese: 'ちいさい', english: 'small', category: '気持ち', tip: '"スモール"と読む。small talk=世間話。small step=小さな一歩。bigの反対🔹', sentence: 'This room is too small.', sentenceJP: 'この部屋は小さすぎます。' },
  { emoji: '🔥', japanese: 'あつい', english: 'hot', category: '気持ち', tip: '"ホット"と読む。hot dog=ホットドッグ。hot spring=温泉。hot and cold=冷熱🌡️', sentence: 'It is very hot today.', sentenceJP: '今日はとても暑いです。' },
  { emoji: '🧊', japanese: 'つめたい・さむい', english: 'cold', category: '気持ち', tip: '"コールド"と読む。cold water=冷たい水。I have a cold=かぜをひいた。hotの反対❄️', sentence: 'This water is very cold.', sentenceJP: 'この水はとても冷たいです。' },
  { emoji: '⚡', japanese: 'はやい', english: 'fast', category: '気持ち', tip: '"ファスト"と読む。fast food=ファストフード。run fast=速く走る。slowの反対⚡', sentence: 'Cheetahs are very fast animals.', sentenceJP: 'チーターはとても速い動物です。' },
  { emoji: '🌸', japanese: 'うつくしい・きれい', english: 'beautiful', category: '気持ち', tip: '"ビューティフル"と読む。beauty=美しさ。beautiful day=素晴らしい日！🌸', sentence: 'What a beautiful sunset!', sentenceJP: 'なんて美しい夕日でしょう！' },
  { emoji: '😄', japanese: 'おかしい・たのしい', english: 'funny', category: '気持ち', tip: '"ファニー"と読む。funny face=おかしい顔。funny story=おかしい話。That\'s funny!=おかしい！😄', sentence: 'He told a very funny joke.', sentenceJP: '彼はとてもおかしいジョークを言いました。' },
  { emoji: '✨', japanese: 'あたらしい', english: 'new', category: '気持ち', tip: '"ニュー"と読む。new year=新年。brand new=新品。news=ニュース（新しいできごと）✨', sentence: 'I got a new smartphone.', sentenceJP: '新しいスマートフォンを買いました。' },
  { emoji: '🥰', japanese: 'かわいい', english: 'cute', category: '気持ち', tip: '"キュート"と読む。cuteness=かわいさ。Cute!（かわいい！）は英語でもよく使う表現🥰', sentence: 'That puppy is so cute!', sentenceJP: 'その子犬はとてもかわいいです！' },

  // ── 家族・人（10語） ─────────────────────────────────────────────
  { emoji: '👩', japanese: 'おかあさん', english: 'mother', category: '家族', tip: '"マザー"と読む。mom（ママ）・mum（英）とも言う。Mother\'s Day=母の日（5月第2日曜日）👩', sentence: 'My mother cooks delicious food.', sentenceJP: '私の母はおいしい料理を作ります。' },
  { emoji: '👨', japanese: 'おとうさん', english: 'father', category: '家族', tip: '"ファーザー"と読む。dad（パパ）とも言う。Father\'s Day=父の日（6月第3日曜日）👨', sentence: 'My father goes to work by train.', sentenceJP: '私の父は電車で仕事に行きます。' },
  { emoji: '👦', japanese: 'おにいさん・あに', english: 'brother', category: '家族', tip: '"ブラザー"と読む。older brother=兄、younger brother=弟。brothers=兄弟👦', sentence: 'My brother plays soccer every day.', sentenceJP: '私の兄は毎日サッカーをします。' },
  { emoji: '👧', japanese: 'おねえさん・あね', english: 'sister', category: '家族', tip: '"スィスター"と読む。older sister=姉、younger sister=妹。sisters=姉妹👧', sentence: 'My sister is good at drawing.', sentenceJP: '私の姉は絵を描くのが得意です。' },
  { emoji: '🤝', japanese: 'ともだち', english: 'friend', category: '家族', tip: '"フレンド"と読む。best friend=親友。friendly=親しみやすい。make friends=友達を作る🤝', sentence: 'She is my best friend.', sentenceJP: '彼女は私の親友です。' },
  { emoji: '👶', japanese: 'あかちゃん', english: 'baby', category: '家族', tip: '"ベイビー"と読む。baby brother=弟（赤ちゃん）。babysitter=赤ちゃんの世話をする人👶', sentence: 'The baby is sleeping now.', sentenceJP: '赤ちゃんは今眠っています。' },
  { emoji: '👦', japanese: 'おとこのこ', english: 'boy', category: '家族', tip: '"ボーイ"と読む。boy band=ボーイバンド。boyhood=少年時代。boy scout=ボーイスカウト👦', sentence: 'The boy is playing in the park.', sentenceJP: '男の子は公園で遊んでいます。' },
  { emoji: '👧', japanese: 'おんなのこ', english: 'girl', category: '家族', tip: '"ガール"と読む。girl scout=ガールスカウト。girlfriend=ガールフレンド。girl power!👧', sentence: 'The girl is reading a book.', sentenceJP: '女の子は本を読んでいます。' },
  { emoji: '👩‍🏫', japanese: 'せんせい', english: 'teacher', category: '家族', tip: '"ティーチャー"と読む。teach=教える→teacher=教える人。Thank you, teacher!（先生ありがとう）👩‍🏫', sentence: 'My teacher is very kind.', sentenceJP: '私の先生はとても親切です。' },
  { emoji: '🎒', japanese: 'せいと・がくせい', english: 'student', category: '家族', tip: '"ストゥーデント"と読む。study=勉強する→student=勉強する人。elementary student=小学生📚', sentence: 'I am a student at this school.', sentenceJP: '私はこの学校の生徒です。' },

  // ── 場所・施設（10語） ───────────────────────────────────────────
  { emoji: '🏠', japanese: 'いえ・おうち', english: 'house', category: '場所', tip: '"ハウス"と読む。house=建物、home=「家（場所+気持ち）」。Home is where the heart is💙', sentence: 'My house has a big garden.', sentenceJP: '私の家には大きな庭があります。' },
  { emoji: '🏫', japanese: 'がっこう', english: 'school', category: '場所', tip: '"スクール"と読む。elementary school=小学校。school bus=スクールバス。after school=放課後🏫', sentence: 'I go to school by bicycle.', sentenceJP: '私は自転車で学校に行きます。' },
  { emoji: '🏥', japanese: 'びょういん', english: 'hospital', category: '場所', tip: '"ホスピタル"と読む。hospitality=おもてなし（同じ語源）。nurse=看護師。doctor=医師🏥', sentence: 'My grandfather is in the hospital.', sentenceJP: '私の祖父は病院にいます。' },
  { emoji: '🌳', japanese: 'こうえん', english: 'park', category: '場所', tip: '"パーク"と読む。amusement park=遊園地。car park（英）=駐車場。park bench=公園のベンチ🌳', sentence: 'Children play in the park.', sentenceJP: '子供たちは公園で遊びます。' },
  { emoji: '📚', japanese: 'としょかん', english: 'library', category: '場所', tip: '"ライブラリー"と読む。librarian=図書館員。borrow books=本を借りる。be quiet in the library!🤫', sentence: 'I borrow books from the library.', sentenceJP: '私は図書館から本を借ります。' },
  { emoji: '🏪', japanese: 'おみせ', english: 'shop', category: '場所', tip: '"ショップ"と読む。shopping=買い物。go shopping=買い物に行く。shop online=ネットで買い物🛍️', sentence: 'I bought shoes at the shoe shop.', sentenceJP: '私は靴屋で靴を買いました。' },
  { emoji: '🚉', japanese: 'えき', english: 'station', category: '場所', tip: '"ステイション"と読む。train station=鉄道の駅。police station=警察署。gas station=ガソリンスタンド🚉', sentence: 'I meet my friend at the station.', sentenceJP: '私は駅で友達と会います。' },
  { emoji: '🦁', japanese: 'どうぶつえん', english: 'zoo', category: '場所', tip: '"ズー"と読む。zoology=動物学（zooの語源）。zookeeper=飼育員。zoo map=園内マップ🦁', sentence: 'We saw many animals at the zoo.', sentenceJP: '私たちは動物園でたくさんの動物を見ました。' },
  { emoji: '🍽️', japanese: 'レストラン', english: 'restaurant', category: '場所', tip: '"レストラン"と読む。フランス語から来た言葉！reserve a table=席を予約する。menu=メニュー🍽️', sentence: 'We had dinner at a nice restaurant.', sentenceJP: '私たちは素敵なレストランで夕食を食べました。' },
  { emoji: '📮', japanese: 'ゆうびんきょく', english: 'post office', category: '場所', tip: '"ポストオフィス"と読む。post=郵便。postcard=はがき。mailman（米）=郵便配達員📮', sentence: 'I sent a letter from the post office.', sentenceJP: '私は郵便局から手紙を送りました。' },
]
