import type { Unit } from './types'

export type { Emotion, ChoiceFeedback, Choice, Step, Unit } from './types'

const unit1: Unit = {
  id: 's1u1',
  title: '氷はなぜ水に浮くの？',
  hook: 'うんちって水に浮く？',
  emoji: '💩',
  secretTitle: '<ruby>密度<rt>みつど</rt></ruby>のひみつ',
  secretPoints: [
    '<ruby>密度<rt>みつど</rt></ruby>＝「同じ大きさで比べたときの重さ」。水は1.0',
    '氷の<ruby>密度<rt>みつど</rt></ruby>は約0.9 → 水より軽いから浮く！',
    '冷やすと縮むのに、水だけは凍ると膨らむ → だから氷は軽くなる',
    '中学受験「浮力・水溶液」にもつながるよ！',
  ],
  steps: [
    {
      id: 'hook',
      emotion: 'mischievous',
      visual: '💩',
      messages: [
        'ねえねえ、ちょっと聞いていい？',
        'うんちって…水に浮くと思う？笑',
        'これ実はガチの理科の問題なんだけど！',
      ],
      input: {
        type: 'choices',
        nextStep: 'hook_reveal',
        choices: [
          { id: 'a', label: '浮く！', feedback: { emotion: 'mischievous', messages: ['おしいっ！', '実はね…「人によってちがう！」が正解なんだよ笑'] } },
          { id: 'b', label: '沈む！', feedback: { emotion: 'mischievous', messages: ['ちがうちがう！', '「人によってちがう！」が正解なんだよ笑笑'] } },
          { id: 'c', label: '人によるでしょ 笑', feedback: { emotion: 'happy', messages: ['そうそう！！！さすがすぎる！', '食べたものによって変わるんだよ！'] } },
        ],
      },
    },
    {
      id: 'hook_reveal',
      emotion: 'mischievous',
      messages: [
        'で、なんで「人によってちがう」のかっていうと…',
        '「浮くかどうか」はその物の<ruby>密度<rt>みつど</rt></ruby>で決まるから！',
        '<ruby>密度<rt>みつど</rt></ruby>って聞いたことある？',
      ],
      input: {
        type: 'choices',
        nextStep: 'density_what',
        choices: [
          { id: 'a', label: '聞いたことある！', feedback: { emotion: 'happy', messages: ['おっ！じゃあ一緒に確認していこう！'] } },
          { id: 'b', label: 'はじめて聞いた', feedback: { emotion: 'happy', messages: ['大丈夫！一緒に覚えよう！絶対わかるから！'] } },
        ],
      },
    },
    {
      id: 'density_what',
      emotion: 'surprised',
      visual: 'density-tank',
      messages: [
        '<ruby>密度<rt>みつど</rt></ruby>っていうのはね…',
        '「同じ大きさで比べたときの重さ」のこと！',
        '水の<ruby>密度<rt>みつど</rt></ruby>は1.0。これより低いと浮く、高いと沈む！',
      ],
      input: { type: 'next', nextStep: 'density_examples' },
    },
    {
      id: 'density_examples',
      emotion: 'happy',
      visual: '🪵🪨🧊',
      messages: [
        '身のまわりでやってみるよ！',
        '木（<ruby>密度<rt>みつど</rt></ruby>0.5）→ 水より軽い → 浮く！',
        '石（<ruby>密度<rt>みつど</rt></ruby>2.7）→ 水より重い → 沈む！',
        '氷は…どっちだと思う？',
      ],
      input: {
        type: 'choices',
        nextStep: 'ice_answer',
        choices: [
          { id: 'a', label: '浮く（水より軽い）', feedback: { emotion: 'happy', messages: ['正解！！！', '氷の<ruby>密度<rt>みつど</rt></ruby>は約0.9！水の1.0より軽いから浮く！'] } },
          { id: 'b', label: '沈む（水より重い）', feedback: { emotion: 'sad', messages: ['ちがうよ〜！', '氷って実は水より少しだけ軽いんだよ！', '<ruby>密度<rt>みつど</rt></ruby>は約0.9！'] } },
        ],
      },
    },
    {
      id: 'ice_answer',
      emotion: 'surprised',
      visual: '🧊',
      messages: [
        'でもちょっと待って！',
        '氷と水って…同じH₂O（水）だよね？',
        'なんで凍ったら軽くなるの！？',
      ],
      input: { type: 'next', nextStep: 'why_ice_light' },
    },
    {
      id: 'why_ice_light',
      emotion: 'mischievous',
      visual: '❄️',
      messages: [
        'ふつうは冷やすと縮んで密度が上がるんだよね',
        'でも水だけは特別！凍ると逆に膨らむんだよ！',
        '同じ重さなのに体積が増える → <ruby>密度<rt>みつど</rt></ruby>が下がる！',
        'これ、水だけの超レアな性質！',
      ],
      input: { type: 'next', nextStep: 'real_world' },
    },
    {
      id: 'real_world',
      emotion: 'happy',
      visual: '🐟',
      messages: [
        'これって実はすごく大事な話でね…',
        '冬に池が全部凍らないのも、魚が冬を越せるのも',
        '氷が上に浮いてくれるおかげなんだよ！',
        '氷が水面を覆って、下の水は0℃以上を保てる → 魚が生きられる！',
      ],
      input: { type: 'next', nextStep: 'logic_question' },
    },
    {
      id: 'logic_question',
      emotion: 'mischievous',
      messages: [
        'じゃあ最後の難問！',
        '友だち3人に「なんで氷が浮くの？」って聞いたよ',
        'だれの答えが一番正しい？',
      ],
      input: {
        type: 'choices',
        nextStep: 'logic_reveal',
        choices: [
          {
            id: 'a',
            label: 'モモ「冷たいから軽くなって浮く」',
            feedback: {
              emotion: 'angry',
              messages: ['惜しいけど！', '「冷たい＝軽い」は正しくないよ〜', 'ふつうは冷やすと重くなるんだから！'],
            },
          },
          {
            id: 'b',
            label: 'ハナ「凍ると膨らむから浮く」',
            feedback: {
              emotion: 'sad',
              messages: ['おしい！！', '「膨らむ」は合ってる！', 'でも「膨らむ＝<ruby>密度<rt>みつど</rt></ruby>が下がる＝浮く」まで言えてほしかった！'],
            },
          },
          {
            id: 'c',
            label: 'ソラ「密度が0.9で水の1.0より低いから浮く」',
            feedback: {
              emotion: 'happy',
              messages: ['ソラ完璧すぎる！！！', '<ruby>密度<rt>みつど</rt></ruby>の数字まで言える人、なかなかいないよ！', 'モモは感覚、ハナは現象止まり。ソラだけが原理まで言えた！'],
            },
          },
        ],
      },
    },
    {
      id: 'logic_reveal',
      emotion: 'happy',
      messages: [
        'まとめると…',
        '氷が浮く理由：「<ruby>密度<rt>みつど</rt></ruby>が0.9で水の1.0より低いから」',
        '凍ると膨らむ水の特別な性質のおかげ！',
        'これ中学受験でも絶対出るやつ！覚えといてね！',
      ],
      input: { type: 'next', nextStep: 'collection' },
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
