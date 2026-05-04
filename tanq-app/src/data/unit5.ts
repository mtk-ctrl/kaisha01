import type { Unit } from './types'

const unit5: Unit = {
  id: 's1u5',
  title: '磁石ってなんでくっつくの？',
  hook: '磁石って、なんで離れてるのに引っ張り合うの？',
  emoji: '🧲',
  secretTitle: '<ruby>磁力<rt>じりょく</rt></ruby>・<ruby>磁場<rt>じば</rt></ruby>のひみつ',
  secretPoints: [
    '磁石の周りには「目に見えない力」<ruby>磁場<rt>じば</rt></ruby>が広がってる',
    '<ruby>磁場<rt>じば</rt></ruby>に鉄が引き寄せられると、くっついたように見える',
    '中学受験「電磁石」につながる＝電流でも磁場は作れる！',
  ],
  steps: [
    {
      id: 'hook',
      emotion: 'surprised',
      visual: '🧲',
      messages: [
        'ねえ、これ不思議じゃない？',
        '磁石ってさ…',
        'くっついてないのに引っ張り合う。なんで！？',
      ],
      input: {
        type: 'choices',
        nextStep: 'magnet_intro',
        choices: [
          {
            id: 'a',
            label: 'くっつく液体が出てる',
            feedback: {
              emotion: 'mischievous',
              messages: [
                'あ〜〜〜！笑',
                'そういう発想、好きだ〜！',
                'でも…もっとシンプルなんだよ',
              ],
            },
          },
          {
            id: 'b',
            label: '形が合ってるからくっつく',
            feedback: {
              emotion: 'mischievous',
              messages: [
                'え〜ちょっと待ってよ…笑',
                '形だったら、くっついてない時点で引かれないじゃん',
                '実は「見えない力」があるんだよ',
              ],
            },
          },
          {
            id: 'c',
            label: '目に見えない力が周りに広がってる',
            feedback: {
              emotion: 'happy',
              messages: [
                'わ〜〜！その通り！！',
                '目に見えない力…それが<ruby>磁場<rt>じば</rt></ruby>だよ！',
              ],
            },
          },
        ],
      },
    },
    {
      id: 'magnet_intro',
      emotion: 'mischievous',
      visual: '⚡',
      messages: [
        '磁石には「<ruby>磁場<rt>じば</rt></ruby>」っていう見えない力が広がってる！',
        'その力の范囲に鉄が入ると…引き寄せられちゃう',
        '接触しなくても力が働く。それが磁力なんだよ！',
        '重力みたいに、見えないけど確かに存在する力！',
      ],
      input: { type: 'next', nextStep: 'magnet_question' },
    },
    {
      id: 'magnet_question',
      emotion: 'mischievous',
      visual: '🔧',
      messages: ['じゃあ、磁場って本当に「周り全体」に広がってると思う？'],
      input: {
        type: 'choices',
        nextStep: 'logic_intro',
        choices: [
          {
            id: 'a',
            label: 'いや、磁石にくっついてる面だけ',
            feedback: {
              emotion: 'sad',
              messages: [
                'えーん…',
                'もし面だけなら…',
                '下から来た鉄も引かれないはずだよ',
              ],
            },
          },
          {
            id: 'b',
            label: 'はい。周りぜんぶに広がってる',
            feedback: {
              emotion: 'happy',
              messages: [
                'そう！その通り！！',
                '磁石の周りぜんぶに<ruby>磁場<rt>じば</rt></ruby>が広がってて',
                'その中の鉄がぜんぶ引かれる！',
              ],
            },
          },
          {
            id: 'c',
            label: 'わからない',
            feedback: {
              emotion: 'mischievous',
              messages: [
                '正直だね！',
                'ヒント：鉄は上からも下からも引かれるよね？',
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
        '「磁石ってなんでくっつくのか」を友だち 3 人に聞いたよ',
        'だれの説明が一番正しいと思う？',
      ],
      input: {
        type: 'choices',
        nextStep: 'collection',
        choices: [
          {
            id: 'a',
            label: 'モモちゃん「引っ付く液体が出てるから」',
            feedback: {
              emotion: 'angry',
              messages: [
                'あ〜あ…',
                'そしたら濡れてるはずだし…笑',
                'それに液体は「力」じゃないじゃん',
              ],
            },
          },
          {
            id: 'b',
            label: 'ハナちゃん「形が合ってるからくっつく」',
            feedback: {
              emotion: 'sad',
              messages: [
                'おしい！でも…',
                '「形」なら、すでにくっついてなきゃ駄目だよ',
                '実は周りに「力」が広がってるんだ',
              ],
            },
          },
          {
            id: 'c',
            label: 'ソラくん「<ruby>磁場<rt>じば</rt></ruby>が周りに広がってて、その力で鉄が引き寄せられる」',
            feedback: {
              emotion: 'happy',
              messages: [
                'ソラくん完璧！！！',
                '<ruby>磁場<rt>じば</rt></ruby>が鉄を引き寄せるんだよ！',
                'これは中学で「電磁石」「電流」につながる！',
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

export default unit5
