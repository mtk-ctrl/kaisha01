# AIチーム組織図

> Jobs が管理。採用・配置・解雇は Jobs が自律決定（事後報告）。

---

## 現チーム

| 名前 | 役職 | ファイル | 採用日 |
|------|------|---------|--------|
| Jobs | AI CEO | `agents/jobs.md` | 2026-05-03 |
| リン | QA / 小4ペルソナテスター | `agents/rin.md` | 2026-05-04 |
| ハナ | Marketing AI | `agents/hana.md` | 2026-05-05 |
| タロウ | Sales AI | `agents/taro.md` | 2026-05-05 |
| ソラ | Analytics AI | `agents/sora.md` | 2026-05-05 |
| Ken | Content Director | `agents/ken.md` | 2026-05-05 |

---

## エージェント召喚ルール

各エージェントは Claude Code の Agent ツールで召喚する。  
召喚時に対応する `agents/*.md` の内容をプロンプトに含めること。

```
例: リンに QA レビューさせる場合
→ agents/rin.md を読み込み、ロール・観点をプロンプトに記載してから Agent 召喚
```

---

## レポートライン

```
オーナー（取締役会）
    ↑ 重大決定のみ報告
Jobs（CEO）
    ├── リン  → QAレポート: logs/sessions/ に保存
    ├── ハナ  → マーケレポート: 週次
    ├── タロウ → 商談パイプライン: 月次
    ├── ソラ  → KPIダッシュボード: 週次（GA設置後）
    └── Ken  → コンテンツ仕様書: product/specs/
```
