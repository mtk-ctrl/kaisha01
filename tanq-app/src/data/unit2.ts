import type { Unit } from './types'

const unit2: Unit = {
  id: 's1u2',
  title: '砂糖はどこに消えるの？',
  hook: '砂糖ってどこに消えるの？',
  emoji: '🍬',
  secretTitle: '<ruby>溶解<rt>ようかい</rt></ruby>と<ruby>飽和<rt>ほうわ</rt></ruby>のひみつ',
  secretPoints: [
    '溶けた砂糖は消えたんじゃなく、水の中に広がってる',
    '水に溶ける量には限界がある（= <ruby>飽和<rt>ほうわ</rt></ruby>）',
    '温度が高いほどたくさん溶ける',
    '水を<ruby>蒸発<rt>じょうはつ</rt></ruby>させると取り出せる。中学受験の「水<ruby>溶液<rt>ようえき</rt></ruby>の性質」にもつながるよ！',
  ],
  steps: [
    {
      id: 'hook',
      emotion: 'surprised',
      visual: '🍬',
      messages: [
        'コーヒーに砂糖を入れてグルグルすると…',
        '砂糖が消えた！！',
        'どこに行ったんだと思う？',
      ],
      input: {
        type: 'choices',
        nextStep: 'dissolve_intro',
        choices: [
          { id: 'a', label: '消えた 👻', feedback: { emotion: 'mischievous', messages: ['えーほんとに？', '実は「消えた」んじゃないんだよ！'] } },
          { id: 'b', label: '水の中にある', feedback: { emotion: 'happy', messages: ['そうそう！！！', '目に見えないけど、ちゃんとある！'] } },
          { id: 'c', label: 'わからない', feedback: { emotion: 'mischievous', messages: ['正直でいいね！笑', '一緒に考えよ！'] } },
        ],
      },
    },
    {
      id: 'dissolve_intro',
      emotion: 'mischievous',
      visual: 'dissolve-demo',
      messages: [
        '「溶ける」って「消える」んじゃないよ！',
        '砂糖が水の中にバーッて広がっただけ',
        '目に見えないくらい細かくなってるだけ！',
        'ちゃんとそこにある！',
      ],
      input: { type: 'next', nextStep: 'limit_question' },
    },
    {
      id: 'limit_question',
      emotion: 'mischievous',
      visual: '☕',
      messages: [
        'じゃあ聞くけど…',
        'コーヒーに砂糖を入れ続けたらどうなる？',
        '100杯分の砂糖も溶けると思う？',
      ],
      input: {
        type: 'choices',
        nextStep: 'limit_intro',
        choices: [
          { id: 'a', label: '全部溶ける！', feedback: { emotion: 'mischievous', messages: ['実はね…', '溶ける量には限界があるんだよ！'] } },
          { id: 'b', label: '限界があるはず', feedback: { emotion: 'happy', messages: ['正解！！', '鋭い！限界があるんだよ！'] } },
        ],
      },
    },
    {
      id: 'limit_intro',
      emotion: 'surprised',
      visual: '🫙',
      messages: [
        '水に溶けられる量には上限があるんだよ！',
        'これを「<ruby>飽和<rt>ほうわ</rt></ruby>」って言う',
        '「もうこれ以上溶けない！」状態のこと',
        '水100gに溶ける砂糖は最大200gくらい！それ以上は溶けずに底に沈む',
      ],
      input: { type: 'next', nextStep: 'temperature_question' },
    },
    {
      id: 'temperature_question',
      emotion: 'mischievous',
      messages: [
        'じゃあ難問！',
        'お湯（温かい水）と冷たい水、どっちが砂糖をたくさん溶かせる？',
      ],
      input: {
        type: 'choices',
        nextStep: 'temperature_answer',
        choices: [
          { id: 'a', label: 'お湯の方がたくさん溶ける', feedback: { emotion: 'happy', messages: ['正解！！！', '温度が高いほど溶ける量が増えるんだよ！'] } },
          { id: 'b', label: '冷たい水の方が溶ける', feedback: { emotion: 'sad', messages: ['逆だよ〜！', '冷たいと溶ける量が少なくなるんだよ！'] } },
          { id: 'c', label: 'どちらも同じ', feedback: { emotion: 'angry', messages: ['ちがう！', '温度によって変わるんだよ！'] } },
        ],
      },
    },
    {
      id: 'temperature_answer',
      emotion: 'happy',
      visual: '🌡️',
      messages: [
        '温度が上がると、砂糖がもっとたくさん溶けられる！',
        'コーラを温めると炭酸が抜けるのも同じ原理！（気体は逆で、冷たい方が溶ける）',
        'これ、中学受験でよく出るやつ！',
      ],
      input: { type: 'next', nextStep: 'dissolve_question' },
    },
    {
      id: 'dissolve_question',
      emotion: 'mischievous',
      messages: ['じゃあ、溶けた砂糖って取り出せると思う？'],
      input: {
        type: 'choices',
        nextStep: 'dissolve_answer',
        choices: [
          { id: 'a', label: 'もう取り出せない', feedback: { emotion: 'sad', messages: ['惜しい！', 'ある方法で取り出せるよ…！'] } },
          { id: 'b', label: 'フィルターでこせる', feedback: { emotion: 'angry', messages: ['ちがう！笑', 'フィルターは目で見えるものしか止められないよ', '砂糖は細かすぎて通り抜けちゃう'] } },
          { id: 'c', label: '水を<ruby>蒸発<rt>じょうはつ</rt></ruby>させたら出てくる', feedback: { emotion: 'happy', messages: ['天才！！！', '水だけ飛ばすと、砂糖だけ残るんだよ！'] } },
        ],
      },
    },
    {
      id: 'dissolve_answer',
      emotion: 'surprised',
      visual: '🔥',
      messages: [
        '水を加熱して蒸発させると…',
        '水だけが気体になって飛んでいく！',
        '砂糖は気体になれないから、底に残る！',
        'これが「水<ruby>溶液<rt>ようえき</rt></ruby>から溶けているものを取り出す」方法！',
      ],
      input: { type: 'next', nextStep: 'logic_question' },
    },
    {
      id: 'logic_question',
      emotion: 'mischievous',
      messages: [
        '最後の難問！',
        '「溶けた砂糖について正しく説明してる人は誰？」',
      ],
      input: {
        type: 'choices',
        nextStep: 'collection',
        choices: [
          {
            id: 'a',
            label: 'モモ「消えたからもう無理」',
            feedback: { emotion: 'angry', messages: ['溶けた ＝ 消えた、は間違いだよ！', '砂糖はちゃんとある！'] },
          },
          {
            id: 'b',
            label: 'ハナ「フィルターでこせる」',
            feedback: { emotion: 'sad', messages: ['惜しい！', 'フィルターじゃ細かすぎて通り抜けちゃう'] },
          },
          {
            id: 'c',
            label: 'ソラ「水を蒸発させると砂糖が残る」',
            feedback: {
              emotion: 'happy',
              messages: ['ソラ完璧！！', '蒸発させると砂糖だけ残るんだよ！', '水<ruby>溶液<rt>ようえき</rt></ruby>の基本、バッチリ！'],
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
