import type { Unit } from './types'

const unit4: Unit = {
  id: 's1u4',
  title: '植物って何食べてるの？',
  hook: '植物って土を食べてると思う？実は全然ちがう！',
  emoji: '🌱',
  secretTitle: '<ruby>光合成<rt>こうごうせい</rt></ruby>のひみつ',
  secretPoints: [
    '植物は土を食べてない。根から吸収するのは水と栄養',
    '光と空気と水から、自分でごはんを作ってる！',
    'これが<ruby>光合成<rt>こうごうせい</rt></ruby>。中学受験の必出単語だよ！',
  ],
  steps: [
    {
      id: 'hook',
      emotion: 'surprised',
      visual: '🌱',
      messages: [
        'ねえ、植物ってどうやって生きてると思う？',
        '土を食べてる…って思ってない？笑',
        'えーん、全然ちがうんだよ！',
      ],
      input: {
        type: 'choices',
        nextStep: 'plant_intro',
        choices: [
          {
            id: 'a',
            label: '土を食べてる',
            feedback: {
              emotion: 'mischievous',
              messages: [
                'あるあるだね…その気持ちわかる〜！',
                'でも実はね…',
                '土は「ごはん」じゃないんだよ',
              ],
            },
          },
          {
            id: 'b',
            label: '水を飲んでる',
            feedback: {
              emotion: 'mischievous',
              messages: [
                'あ〜ちょっと近い！',
                '水は使うけど…',
                'それだけじゃ生きられないんだよ',
              ],
            },
          },
          {
            id: 'c',
            label: '光と空気と水から自分で作ってる',
            feedback: {
              emotion: 'happy',
              messages: [
                'わ〜〜！天才！！！',
                'その通り！植物は自分でごはん作るんだよ！',
              ],
            },
          },
        ],
      },
    },
    {
      id: 'plant_intro',
      emotion: 'mischievous',
      visual: '🌞',
      messages: [
        '植物ってすごいんだよ、自分でごはんを作るんだ！',
        '必要なもの：①光 ②空気 ③水',
        'この 3 つを使って、<ruby>葉<rt>は</rt></ruby>で「ごはん」を作ってる！',
        'これを「<ruby>光合成<rt>こうごうせい</rt></ruby>」っていうんだよ',
      ],
      input: { type: 'next', nextStep: 'photosynthesis_question' },
    },
    {
      id: 'photosynthesis_question',
      emotion: 'mischievous',
      visual: '🍃',
      messages: ['じゃあ、根っこから吸収するのは何だと思う？'],
      input: {
        type: 'choices',
        nextStep: 'logic_intro',
        choices: [
          {
            id: 'a',
            label: '栄養になる土',
            feedback: {
              emotion: 'sad',
              messages: [
                'えーん…違うんだよ',
                '土は<ruby>根<rt>ね</rt></ruby>を支えるためのもの',
                'ごはんじゃなくて、栄養素と水なんだ！',
              ],
            },
          },
          {
            id: 'b',
            label: '水と栄養素（ミネラルなど）',
            feedback: {
              emotion: 'happy',
              messages: [
                'そっそう！！！',
                '<ruby>根<rt>ね</rt></ruby>から吸収するのは水と栄養素！',
                'ごはんは<ruby>葉<rt>は</rt></ruby>で作るんだよ',
              ],
            },
          },
          {
            id: 'c',
            label: 'わからない',
            feedback: {
              emotion: 'mischievous',
              messages: [
                '正直でいいね！',
                'ヒント：土の中から、液体が上がってくるんだよ',
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
        '「植物ってどうやってごはんを作ってるの？」を友だち 3 人に聞いたよ',
        'だれが一番詳しいと思う？',
      ],
      input: {
        type: 'choices',
        nextStep: 'collection',
        choices: [
          {
            id: 'a',
            label: 'モモちゃん「<ruby>根<rt>ね</rt></ruby>っこから土を食べてる」',
            feedback: {
              emotion: 'angry',
              messages: [
                'あ〜あ…',
                '土は「食べ物」じゃなくて「<ruby>根<rt>ね</rt></ruby>の支え」なんだよ',
                '栄養が必要ならその先を考えてみて！',
              ],
            },
          },
          {
            id: 'b',
            label: 'ハナちゃん「水を吸収して生きてる」',
            feedback: {
              emotion: 'sad',
              messages: [
                'おしい！ハナちゃんも部分的には正しい',
                'でも水だけじゃ足りないんだよ',
                '光と空気と水で「ごはん」を作るんだ！',
              ],
            },
          },
          {
            id: 'c',
            label: 'ソラくん「光と空気と水から<ruby>光合成<rt>こうごうせい</rt></ruby>でごはんを作ってる」',
            feedback: {
              emotion: 'happy',
              messages: [
                'ソラくん完璧！！！',
                '植物は<ruby>光合成<rt>こうごうせい</rt></ruby>で自分のごはんを作ってる',
                'これは中学受験・理科の絶対単語だよ！',
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

export default unit4
