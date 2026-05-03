export type Emotion = 'happy' | 'angry' | 'sad' | 'mischievous' | 'surprised'

export type ChoiceFeedback = {
  emotion: Emotion
  messages: string[]
}

export type Choice = {
  id: string
  label: string
  feedback: ChoiceFeedback
}

export type Step = {
  id: string
  emotion: Emotion
  messages: string[]
  input:
    | { type: 'next'; nextStep: string | null }
    | { type: 'choices'; choices: Choice[]; nextStep: string | null }
}

export type Unit = {
  id: string
  title: string
  secretTitle: string
  secretPoints: string[]
  steps: Step[]
}

const unit1: Unit = {
  id: 's1u1',
  title: '氷はなぜ水に浮くの？',
  secretTitle: '密度のひみつ',
  secretPoints: [
    '密度が水（1.0）より低いものは浮く',
    '氷の密度は約0.9 → 水より軽いから浮く！',
    '中受の理科「浮力」単元に直結してるよ',
  ],
  steps: [
    {
      id: 'hook',
      emotion: 'surprised',
      messages: [
        'ねえねえ、一個だけ聞いていい？',
        'うんちって水に浮くと思う？笑',
        'え待って、マジで面白い話があるんだけど！',
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
              messages: ['惜し〜〜！実はね…', '「人によって違う！」が正解なんだよ笑笑'],
            },
          },
          {
            id: 'b',
            label: '沈む',
            feedback: {
              emotion: 'mischievous',
              messages: ['え〜〜！実はね…', '「人によって違う！」が正解なんだよ笑笑'],
            },
          },
          {
            id: 'c',
            label: '人による 笑',
            feedback: {
              emotion: 'happy',
              messages: ['そうそう！！よく知ってたね！！', '人によって違うんだよ〜！'],
            },
          },
        ],
      },
    },
    {
      id: 'density_intro',
      emotion: 'mischievous',
      messages: [
        '浮くかどうかは「密度」で決まるんだよ',
        '密度って「同じ大きさで比べたときの重さ」のこと',
        '水の密度は 1.0。これより低いと浮く！',
      ],
      input: { type: 'next', nextStep: 'ice_question' },
    },
    {
      id: 'ice_question',
      emotion: 'mischievous',
      messages: ['じゃあ、氷の密度はどっちだと思う？'],
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
                '密度は約 0.9 なんだ',
              ],
            },
          },
          {
            id: 'b',
            label: '1.0 と同じ',
            feedback: {
              emotion: 'angry',
              messages: [
                'ちがう！笑',
                '氷と水は同じ物質だけど、密度はちがうんだよ！',
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
                '氷の密度は約 0.9！',
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
        'じゃあ最後に一個！',
        'TANQuu の友達 3 人に「なんで氷が水に浮くの？」って聞いたよ',
        '3 人ともちがう答えが返ってきた…',
        'だれの考え方が一番正しいと思う？',
      ],
      input: {
        type: 'choices',
        nextStep: 'collection',
        choices: [
          {
            id: 'a',
            label: 'モモちゃん「氷は冷たいから軽くなって浮く」',
            feedback: {
              emotion: 'angry',
              messages: [
                '「冷たい ＝ 軽い」は関係ないんだよ〜！笑',
                '冷たさと重さは別の話！',
                'ヒントは「密度」だよ',
              ],
            },
          },
          {
            id: 'b',
            label: 'ハナちゃん「氷は固まると少し軽くなるから浮く」',
            feedback: {
              emotion: 'sad',
              messages: [
                '惜しい！ハナちゃんも惜しい…',
                'でも「なんで軽くなるか」＝ 密度！まで言えてないんだよね',
              ],
            },
          },
          {
            id: 'c',
            label: 'ソラくん「氷の密度が 0.9 で水の 1.0 より低いから浮く」',
            feedback: {
              emotion: 'happy',
              messages: [
                'ソラくん完璧すぎる！！！！',
                '密度が 1.0 より低いと浮く！',
                'モモちゃんは冷たさ、ハナちゃんは軽さで止まってた',
                'ソラくんだけが密度まで言えた！！',
              ],
            },
          },
        ],
      },
    },
    {
      id: 'collection',
      emotion: 'happy',
      messages: ['ひみつ ゲット！！🎉'],
      input: { type: 'next', nextStep: null },
    },
  ],
}

export default unit1
