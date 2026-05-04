import type { Unit } from './types'

// Re-export types for backward compatibility
export type { Emotion, ChoiceFeedback, Choice, Step, Unit } from './types'

const unit1: Unit = {
  id: 's1u1',
  title: '氷はなぜ水に浮くの？',
  hook: 'うんちって水に浮く？',
  emoji: '💩',
  secretTitle: '<ruby>密度<rt>みつど</rt></ruby>のひみつ',
  secretPoints: [
    '<ruby>密度<rt>みつど</rt></ruby>が水（1.0）より低いものは浮く',
    '氷の<ruby>密度<rt>みつど</rt></ruby>は約 0.9 → 水より軽いから浮く！',
    '中学受験の理科「浮力」にもつながるよ！',
  ],
  steps: [
    {
      id: 'hook',
      emotion: 'surprised',
      visual: 'hook-emoji',
      messages: [
        'ねえねえ、ちょっと聞いていい？',
        'うんちって水に浮くと思う〜？笑',
        'これ、ガチで面白いんだけど！',
      ],
      input: {
        type: 'choices',
        nextStep: 'density_intro',
        choices: [
          {
            id: 'a',
            label: '浮く 🤔',
            feedback: {
              emotion: 'mischievous',
              messages: ['おしい〜〜！実はね…', '「人によってちがう！」が正解なんだよ笑笑'],
            },
          },
          {
            id: 'b',
            label: '沈む',
            feedback: {
              emotion: 'mischievous',
              messages: ['え〜〜！実はね…', '「人によってちがう！」が正解なんだよ笑笑'],
            },
          },
          {
            id: 'c',
            label: '人による 笑',
            feedback: {
              emotion: 'happy',
              messages: ['そうそう！！よく知ってたね！！', '人によってちがうんだよ〜！'],
            },
          },
        ],
      },
    },
    {
      id: 'density_intro',
      emotion: 'mischievous',
      visual: 'density-tank',
      messages: [
        '浮くかどうかは「<ruby>密度<rt>みつど</rt></ruby>」で決まるんだよ！',
        '<ruby>密度<rt>みつど</rt></ruby>って「おなじ大きさで くらべたときの重さ」のこと',
        '水の<ruby>密度<rt>みつど</rt></ruby>は 1.0。これより低いと浮く！',
      ],
      input: { type: 'next', nextStep: 'ice_question' },
    },
    {
      id: 'ice_question',
      emotion: 'mischievous',
      visual: 'ice-emoji',
      messages: ['じゃあ、氷の<ruby>密度<rt>みつど</rt></ruby>はどっちだと思う？'],
      input: {
        type: 'choices',
        nextStep: 'logic_intro',
        choices: [
          {
            id: 'a',
            label: '1.0 より大きい（重い）',
            feedback: {
              emotion: 'sad',
              messages: [
                'えーん…',
                '氷って実は水より少し軽いんだよ！',
                '<ruby>密度<rt>みつど</rt></ruby>は約 0.9 なんだ',
              ],
            },
          },
          {
            id: 'b',
            label: '1.0 とおなじ',
            feedback: {
              emotion: 'angry',
              messages: [
                'ちがう！笑',
                '氷と水はおなじ物質だけど、<ruby>密度<rt>みつど</rt></ruby>はちがうんだよ！',
              ],
            },
          },
          {
            id: 'c',
            label: '1.0 より小さい（軽い）',
            feedback: {
              emotion: 'happy',
              messages: [
                '正解！！！',
                '氷の<ruby>密度<rt>みつど</rt></ruby>は約 0.9！',
                '水より軽いから浮くんだよ！！',
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
        'じゃあ最後に一問！',
        'TANQuu の友だち 3 人に「なんで氷が水に浮くの？」って聞いたよ',
        '3 人ともちがう答えが返ってきた…',
        'だれの考えが一番正しいと思う？',
      ],
      input: {
        type: 'choices',
        nextStep: 'collection',
        choices: [
          {
            id: 'a',
            label: 'モモちゃん「冷たいから 軽くなって浮く」',
            feedback: {
              emotion: 'angry',
              messages: [
                '「冷たい ＝ 軽い」は関係ないんだよ〜！笑',
                '冷たさと重さは別の話！',
                'ヒントは「<ruby>密度<rt>みつど</rt></ruby>」だよ',
              ],
            },
          },
          {
            id: 'b',
            label: 'ハナちゃん「かたまると少し 軽くなるから浮く」',
            feedback: {
              emotion: 'sad',
              messages: [
                'おしい！ハナちゃんも おしい…',
                'でも「なんで軽くなるか」＝ <ruby>密度<rt>みつど</rt></ruby>！まで言えてないんだよね',
              ],
            },
          },
          {
            id: 'c',
            label: 'ソラくん「<ruby>密度<rt>みつど</rt></ruby>が 0.9 で 水の 1.0 より低いから浮く」',
            feedback: {
              emotion: 'happy',
              messages: [
                'ソラくん 完璧すぎる！！！！',
                '<ruby>密度<rt>みつど</rt></ruby>が 1.0 より低いと浮く！',
                'モモちゃんは冷たさ、ハナちゃんは軽さで止まってた',
                'ソラくんだけが<ruby>密度<rt>みつど</rt></ruby>まで言えた！！',
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

export default unit1
