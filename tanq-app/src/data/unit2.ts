import type { Unit } from './types'

const unit2: Unit = {
  id: 's1u2',
  title: '砂糖はどこに消えるの？',
  hook: '砂糖ってどこに消えるの？',
  emoji: '🍬',
  secretTitle: '<ruby>溶解<rt>ようかい</rt></ruby>のひみつ',
  secretPoints: [
    '溶けた砂糖は消えたんじゃなく、水の中に広がってる',
    '水を<ruby>蒸発<rt>じょうはつ</rt></ruby>させると溶けていたものが残る',
    '中学受験の「水<ruby>溶液<rt>ようえき</rt></ruby>の性質」につながるよ！',
  ],
  steps: [
    {
      id: 'hook',
      emotion: 'surprised',
      visual: 'sugar-emoji',
      messages: [
        'ねえ、コーヒーに砂糖入れると…',
        '砂糖ってどこに消えるんだと思う？',
        'まじで謎じゃない！？',
      ],
      input: {
        type: 'choices',
        nextStep: 'dissolve_intro',
        choices: [
          {
            id: 'a',
            label: '消えた 👻',
            feedback: {
              emotion: 'mischievous',
              messages: ['えーほんとに？', '実は「消えた」んじゃないんだよ！'],
            },
          },
          {
            id: 'b',
            label: '水の中にある',
            feedback: {
              emotion: 'happy',
              messages: ['そうそう！！！', '目に見えないけど、ちゃんとある！'],
            },
          },
          {
            id: 'c',
            label: 'わからない',
            feedback: {
              emotion: 'mischievous',
              messages: ['正直でいいね！笑', '一緒に考えよ！'],
            },
          },
        ],
      },
    },
    {
      id: 'dissolve_intro',
      emotion: 'mischievous',
      visual: 'dissolve-demo',
      messages: [
        '「溶ける」って「消える」んじゃないよ！',
        '砂糖が水の中に バーッて広がっただけ',
        '目に見えないくらい細かくなってるだけ！',
      ],
      input: { type: 'next', nextStep: 'dissolve_question' },
    },
    {
      id: 'dissolve_question',
      emotion: 'mischievous',
      messages: ['じゃあ、溶けた砂糖って取り出せると思う？'],
      input: {
        type: 'choices',
        nextStep: 'logic_intro',
        choices: [
          {
            id: 'a',
            label: 'もう取り出せない',
            feedback: {
              emotion: 'sad',
              messages: ['惜しい！', 'ある方法で取り出せるよ…！'],
            },
          },
          {
            id: 'b',
            label: 'フィルターで こせる',
            feedback: {
              emotion: 'angry',
              messages: ['ちがう！笑', 'フィルターは目で見えるものしか止められないよ'],
            },
          },
          {
            id: 'c',
            label: '水を<ruby>蒸発<rt>じょうはつ</rt></ruby>させたら出てくる',
            feedback: {
              emotion: 'happy',
              messages: ['天才！！！', '水だけ飛ばすと、砂糖だけ残るんだよ！'],
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
        '「溶けた砂糖を取り出す方法」を 3 人に聞いたよ',
        'だれが正しいと思う？',
      ],
      input: {
        type: 'choices',
        nextStep: 'collection',
        choices: [
          {
            id: 'a',
            label: 'モモちゃん「消えたから 無理」',
            feedback: {
              emotion: 'angry',
              messages: ['溶けた ＝ 消えた、は間違いだよ！', '砂糖はちゃんとある！'],
            },
          },
          {
            id: 'b',
            label: 'ハナちゃん「フィルターで こせる」',
            feedback: {
              emotion: 'sad',
              messages: ['惜しい！', 'フィルターじゃ細かすぎて通り抜けちゃう'],
            },
          },
          {
            id: 'c',
            label: 'ソラくん「水を<ruby>蒸発<rt>じょうはつ</rt></ruby>させると砂糖が残る」',
            feedback: {
              emotion: 'happy',
              messages: [
                'ソラくん完璧！！',
                '蒸発させると砂糖だけ残るんだよ！',
                '水<ruby>溶液<rt>ようえき</rt></ruby>の基本、バッチリ！',
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

export default unit2
