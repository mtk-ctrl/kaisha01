import type { Unit } from './types'

const unit3: Unit = {
  id: 's1u3',
  title: '空はなぜ青いの？',
  hook: '空は昼は青いのに、夕方はオレンジ。なんで！？',
  emoji: '🌤️',
  secretTitle: '光の<ruby>散乱<rt>さんらん</rt></ruby>のひみつ',
  secretPoints: [
    '光は波のように進む。波長によって色がちがう',
    '青い光は散らばりやすく、赤い光は散らばりにくい',
    '空全体に散らばった青い光が目に入るから、空は青く見える！',
  ],
  steps: [
    {
      id: 'hook',
      emotion: 'surprised',
      visual: '🌤️',
      messages: [
        'ねえ、不思議じゃない？',
        '空ってお昼は青いのに、夕方はオレンジ',
        'なんで色が変わるんだと思う！？',
      ],
      input: {
        type: 'choices',
        nextStep: 'sky_intro',
        choices: [
          {
            id: 'a',
            label: '空に青いペンキが塗ってある',
            feedback: {
              emotion: 'mischievous',
              messages: [
                'え〜〜〜！笑',
                'だったら毎日同じ青じゃん！',
                '実はもっと深い理由があるんだよ〜',
              ],
            },
          },
          {
            id: 'b',
            label: '太陽の光が空で色が変わる',
            feedback: {
              emotion: 'happy',
              messages: [
                'いいね、そういう発想！！',
                '実は「光の色」が関係してるんだよ',
              ],
            },
          },
          {
            id: 'c',
            label: 'わからない…',
            feedback: {
              emotion: 'mischievous',
              messages: [
                '正直でいいね！笑',
                '一緒に謎を解いちゃおう！',
              ],
            },
          },
        ],
      },
    },
    {
      id: 'sky_intro',
      emotion: 'mischievous',
      visual: '💡',
      messages: [
        '空の色は「光の<ruby>散乱<rt>さんらん</rt></ruby>」で決まるんだよ！',
        '太陽の光には色んな色が混じってる',
        'その光が空気にぶつかって、バーッと散らばる',
        '青い光は散らばりやすくて、赤い光は散らばりにくい',
        'だから空全体が青く見えるんだ！',
      ],
      input: { type: 'next', nextStep: 'scatter_question' },
    },
    {
      id: 'scatter_question',
      emotion: 'mischievous',
      visual: '🌅',
      messages: ['じゃあ、夕方はどうして空がオレンジになると思う？'],
      input: {
        type: 'choices',
        nextStep: 'logic_intro',
        choices: [
          {
            id: 'a',
            label: '太陽が赤くなるから',
            feedback: {
              emotion: 'sad',
              messages: [
                'えーん…',
                '太陽は実は色が変わってないんだよ',
                '光が散らばる方向がちがうんだ！',
              ],
            },
          },
          {
            id: 'b',
            label: '青い光が散らばっちゃって、赤い光だけ残る',
            feedback: {
              emotion: 'happy',
              messages: [
                'そうそう！！！',
                '太陽が低くなると、光が遠く通るから',
                '途中で青い光がぜんぶ散らばっちゃう！',
              ],
            },
          },
          {
            id: 'c',
            label: 'わからない',
            feedback: {
              emotion: 'mischievous',
              messages: [
                'いい質問だね！',
                'ヒント：青い光ともっともっと散らばっちゃうのかな…',
              ],
            },
          },
        ],
      },
    },
    {
      id: 'logic_intro',
      emotion: 'surprised',
      messages: [
        '最後！',
        '「なんで空は青いのか」を友だち 3 人に聞いたよ',
        'だれの説明が一番正しいと思う？',
      ],
      input: {
        type: 'choices',
        nextStep: 'collection',
        choices: [
          {
            id: 'a',
            label: 'モモちゃん「空に青いペンキが塗ってあるから」',
            feedback: {
              emotion: 'angry',
              messages: [
                'ちょっと…ちょっと待って…笑',
                'だったら毎日同じ色じゃん！',
                'ペンキじゃ時間で色が変わらないよ',
              ],
            },
          },
          {
            id: 'b',
            label: 'ハナちゃん「青い光だから空が青く見える」',
            feedback: {
              emotion: 'sad',
              messages: [
                'おしい！でも…',
                '「なぜ」青い光が多いのかまで言えてないんだよ',
                '<ruby>散乱<rt>さんらん</rt></ruby>まで言えてたら完璧！',
              ],
            },
          },
          {
            id: 'c',
            label: 'ソラくん「青い光は散らばりやすいから、空全体に青い光が広がって見える」',
            feedback: {
              emotion: 'happy',
              messages: [
                'ソラくん完璧！！',
                '青い光の<ruby>散乱<rt>さんらん</rt></ruby>が理由なんだ！',
                '受験理科「光と波」の基本だよ！',
              ],
            },
          },
        ],
      },
    },
    {
      id: 'collection',
      emotion: 'happy',
      visual: 'celebration',
      messages: ['ひみつ ゲット！！🎉'],
      input: { type: 'next', nextStep: null },
    },
  ],
}

export default unit3
