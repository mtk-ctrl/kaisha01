"""
TANQ Inc. — X投稿文案生成スクリプト
GitHub Actions から呼び出される。Claude API で文案を生成し Resend でメール送信。

環境変数:
  ANTHROPIC_API_KEY  — Claude API キー
  RESEND_API_KEY     — Resend API キー
  TIME_SLOT          — 朝 / 昼 / 夕 / 夜
  TO_EMAIL           — 送信先メールアドレス (デフォルト: mtk551141@gmail.com)
"""

import os
import sys
import json
import urllib.request
import urllib.error
from datetime import datetime, timezone, timedelta

JST = timezone(timedelta(hours=9))

TIME_SLOT = os.environ.get("TIME_SLOT", "朝")
TO_EMAIL = os.environ.get("TO_EMAIL", "mtk551141@gmail.com")
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")

SLOT_CONFIG = {
    "朝": {
        "subject": "☀️ 朝のXポスト文案 — TANQ",
        "context": "朝7時。通勤前か子どもを送り出した直後。前向きなスタートの雰囲気。",
        "theme": "今日への前向きな気持ち、子どもの成長、MLBの今夜（日本時間）の試合への期待感",
    },
    "昼": {
        "subject": "🍱 昼のXポスト文案 — TANQ",
        "context": "昼12時。ランチタイム。ちょっと息抜きしながらスマホを見る時間帯。",
        "theme": "日常のちょっとした発見、子育てあるある、教育のちょっとしたTips、数学・算数ネタ",
    },
    "夕": {
        "subject": "⚾ 夕方のXポスト文案 — TANQ",
        "context": "夕方18時。仕事終わり。MLB（メジャーリーグ）の試合結果が出始める時間帯。",
        "theme": "MLB日本人選手の結果への反応（大谷・山本・今永など）、野球と子育て・教育の絡め方",
    },
    "夜": {
        "subject": "🌙 夜のXポスト文案 — TANQ",
        "context": "夜21時。子どもを寝かしつけた後。一日を振り返る時間帯。",
        "theme": "今日の子どもとの会話・学習エピソード、TANQアプリの紹介（押し付けがましくなく自然に）、明日への小さな期待",
    },
}

PERSONA = """
あなたは以下のペルソナを持つXユーザーです：
- 40代のサラリーマン・3人の子どもを持つ父親
- 地方在住・普通の会社員
- 数学が好き（仕事や日常で数学的思考を活かす）
- MLBが大好き（日本人選手の成績を毎日チェック：大谷翔平・山本由伸・今永昇太など）
- 副業で子ども向け教育アプリ「TANQ」を作っている（小学生向けAI学習アプリ）
- ポジティブだけど少しおちゃめ・等身大
- 宣伝臭が出ないよう、日常の延長でTANQに触れることもある
- フォロワー数は少ない（まだ始めたばかり）・共感されることを大切にしている
"""

def generate_drafts(slot: str) -> str:
    config = SLOT_CONFIG.get(slot, SLOT_CONFIG["朝"])
    today = datetime.now(JST).strftime("%Y年%m月%d日")

    prompt = f"""
{PERSONA}

今日は {today} です。
時間帯: {slot}（{config['context']}）
テーマ候補: {config['theme']}

この時間帯にふさわしいXポスト文案を **3パターン** 作ってください。

【制約】
- 各ポスト 140文字以内
- ハッシュタグは 1〜2個まで（なくてもOK）
- 宣伝・売り込み感ゼロ。リアルな父親の言葉で
- 絵文字は自然な範囲で（多用しない）
- MLB関連なら選手名は実名でOK（大谷、山本、今永など文脈に合わせて）
- 夕方パターンは「今日の結果：〔ここを自分で書き換えてください〕」という空欄プレースホルダーを入れる

【出力形式】
パターン1:
（ポスト本文）

パターン2:
（ポスト本文）

パターン3:
（ポスト本文）

---
💡 使い方のヒント: 気に入ったものをそのままコピペするか、一言アレンジして投稿してください。夕方パターンは今日のMLB結果を入れてください。
"""

    payload = json.dumps({
        "model": "claude-haiku-4-5-20251001",
        "max_tokens": 800,
        "messages": [{"role": "user", "content": prompt}],
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=payload,
        headers={
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read().decode("utf-8"))

    return result["content"][0]["text"]


def send_email(subject: str, body_text: str, slot: str) -> None:
    config = SLOT_CONFIG.get(slot, SLOT_CONFIG["朝"])
    today = datetime.now(JST).strftime("%Y/%m/%d")

    html_body = f"""
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
  <div style="background: #f0f9ff; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
    <h2 style="margin: 0 0 4px; font-size: 18px;">{config['subject']}</h2>
    <p style="margin: 0; color: #555; font-size: 13px;">{today} — テーマ: {config['theme']}</p>
  </div>

  <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; white-space: pre-wrap; font-size: 15px; line-height: 1.8;">
{body_text}
  </div>

  <p style="margin-top: 20px; font-size: 12px; color: #999;">
    このメールは TANQ Inc. の自動システムが生成しました。<br>
    Xアプリを開いて投稿してください 📱
  </p>
</body>
</html>
"""

    payload = json.dumps({
        "from": "TANQ Jobs <onboarding@resend.dev>",
        "to": [TO_EMAIL],
        "subject": f"[{today}] {config['subject']}",
        "html": html_body,
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=payload,
        headers={
            "Authorization": f"Bearer {RESEND_API_KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read().decode("utf-8"))
        print(f"Email sent: id={result.get('id')}")


def main():
    if not ANTHROPIC_API_KEY:
        print("ERROR: ANTHROPIC_API_KEY が設定されていません", file=sys.stderr)
        sys.exit(1)
    if not RESEND_API_KEY:
        print("ERROR: RESEND_API_KEY が設定されていません", file=sys.stderr)
        sys.exit(1)

    print(f"[{TIME_SLOT}] 文案生成中...")
    drafts = generate_drafts(TIME_SLOT)
    print(drafts)

    config = SLOT_CONFIG[TIME_SLOT]
    print(f"\nメール送信中 → {TO_EMAIL}")
    send_email(config["subject"], drafts, TIME_SLOT)
    print("完了 ✅")


if __name__ == "__main__":
    main()
