import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'プライバシーポリシー | TANQ Inc.',
  description: 'TANQ Inc. のプライバシーポリシーです。個人情報の取り扱いについてご説明します。',
}

const SECTIONS = [
  {
    title: '1. 事業者情報',
    content: `本サービス「TANQ」（以下「本サービス」）は、TANQ Inc.（以下「当社」）が運営します。\n\n所在地：福岡県福岡市\nお問い合わせ：contact@tanq.jp`,
  },
  {
    title: '2. 収集する個人情報',
    content: `当社は、以下の情報を収集することがあります。\n\n【アカウント登録時】\n・メールアドレス\n・パスワード（暗号化して保管。当社は平文では保管しません）\n\n【サービス利用時】\n・学習記録（正解数・利用アプリ・学年設定など）\n・アクセスログ（IPアドレス・ブラウザ情報・閲覧ページ）`,
  },
  {
    title: '3. 個人情報の利用目的',
    content: `収集した情報は以下の目的にのみ使用します。\n\n・サービスの提供および改善\n・学習進捗の記録・表示\n・パスワードリセット等のアカウント管理\n・利用状況の統計的な分析（個人を特定しない形で）\n・お問い合わせへの対応`,
  },
  {
    title: '4. 第三者への情報提供',
    content: `当社は、以下の場合を除き、お客様の個人情報を第三者に提供しません。\n\n・お客様の同意がある場合\n・法令に基づき開示が必要な場合\n\n【利用している外部サービス】\n本サービスの運営にあたり、以下の外部サービスにデータが送信される場合があります。\n\n・Supabase（データベース・認証）：学習記録・メールアドレスを保管します。\n・Google Analytics 4（アクセス解析）：ページ閲覧状況・操作ログを収集します。収集されたデータはGoogleのプライバシーポリシーに従って処理されます。\n・Vercel（ホスティング）：サービスの配信基盤として利用しています。`,
  },
  {
    title: '5. お子様の個人情報について',
    content: `本サービスは主に小学生を対象としています。18歳未満のお子様がご利用になる場合は、保護者の方の同意のもとでご登録ください。\n\n当社はお子様の個人情報を広告目的で利用しません。また、お子様の情報を学習サービス提供以外の目的で第三者に提供しません。`,
  },
  {
    title: '6. Cookieおよびトラッキング技術',
    content: `当社は、サービスの利便性向上および利用状況の分析のためにCookieおよび類似の技術を使用します。\n\nGoogle Analytics 4 による計測を行っています。これにより、閲覧ページ・滞在時間・操作内容などが匿名で収集されます。ブラウザの設定によりCookieを無効にすることができますが、サービスの一部機能が正常に動作しない場合があります。`,
  },
  {
    title: '7. 個人情報の開示・訂正・削除',
    content: `お客様は、当社が保有する自己の個人情報について、開示・訂正・追加・削除・利用停止を請求することができます。\n\nアカウントの削除は、ログイン後の設定画面から、または contact@tanq.jp にメールにてご連絡ください。削除依頼から30日以内にデータを消去します。`,
  },
  {
    title: '8. 個人情報の管理',
    content: `当社は、個人情報の紛失・破壊・改ざん・漏洩を防ぐため、適切なセキュリティ対策を講じます。パスワードは業界標準の暗号化方式で保管し、当社スタッフも閲覧できません。`,
  },
  {
    title: '9. プライバシーポリシーの変更',
    content: `本ポリシーは、法令の改正やサービス内容の変更に応じて改訂することがあります。重要な変更がある場合はサービス上でお知らせします。変更後も継続してサービスをご利用いただいた場合、変更後のポリシーに同意したものとみなします。`,
  },
  {
    title: '10. お問い合わせ',
    content: `個人情報の取り扱いに関するご質問・ご要望は、以下の連絡先までお問い合わせください。\n\nTANQ Inc.\nメール：contact@tanq.jp\n所在地：福岡県福岡市`,
  },
]

export default function PrivacyPage() {
  return (
    <div className="bg-corp-navy text-corp-text font-sans overflow-x-hidden">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-corp-forest opacity-20 blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-corp-lavender opacity-10 blur-[100px]" />
        <div className="absolute inset-0 grid-overlay opacity-30" />
      </div>

      <main className="relative z-10 px-6 py-40">
        <div className="max-w-3xl mx-auto">

          <div className="text-center mb-16">
            <p className="text-corp-teal text-xs uppercase tracking-[0.3em] font-semibold mb-4">Privacy Policy</p>
            <h1 className="text-4xl lg:text-5xl font-black mb-6">
              <span className="text-gradient">プライバシーポリシー</span>
            </h1>
            <p className="text-corp-muted text-sm">制定日：2026年5月14日</p>
          </div>

          <div className="glass-card rounded-3xl p-8 lg:p-12 space-y-10">
            {SECTIONS.map((section) => (
              <section key={section.title}>
                <h2 className="text-lg font-black text-corp-teal mb-4">{section.title}</h2>
                <div className="text-corp-muted text-sm leading-relaxed space-y-2">
                  {section.content.split('\n').map((line, i) => (
                    <p key={i} className={line === '' ? 'h-2' : line.startsWith('・') || line.startsWith('【') ? 'pl-0' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/" className="text-corp-teal hover:underline text-sm">
              ← トップページへ戻る
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
