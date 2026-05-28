# 実装 Issue 分割（並行実行可能版）

`docs/plan.md` で決めた内容を、**並行実行できる粒度** に切り出した Issue 一覧。

3トラックを同時に走らせる前提:

- **R系（リサーチ）**: 仕様調査・検証。コードを書かないか書いても捨てる可能性あり
- **F系（実装）**: アプリ本体のコード
- **C系（コンテンツ）**: lesson.json の執筆

依存関係を明示。`blockedBy` がなければ即着手可能。

---

## 依存グラフ（要約）

```
F-001 (init)
   │
   ├─ F-002 CSS基盤        ┐
   ├─ F-003 Zod + Loader   │
   ├─ F-004 Pinia store    ├─ 全部並行OK
   ├─ F-005 UIプリミティブ │
   ├─ F-006 ページ雛形     │
   └─ F-007 Markdown/Shiki ┘
                │
                ▼
       F-008 LessonRunner（統合）
                │
                ▼
       F-009/010/011/012 演習挙動・進捗・マスタリー・復習
                │
                ▼
       F-013/014/015 仕上げ・デプロイ

R-001..R-005  : 着手日から並行で進められる（F-001 すら待たない）
C-001..C-003  : スキーマ確定済みなので、F-001 と無関係に並行可
```

---

# R 系: リサーチトラック（並行で動く / コード書く前から進められる）

## R-001 — AI下書きプロンプトのチューニング

- **目的**: `plan.md` 10.3 のプロンプトテンプレートを、実際に1〜2回回して質を確認。出力JSONが Zod パースを通る・`sources` が実URLである・コードが動く、を満たすまで詰める
- **成果物**:
  - `docs/ai-prompt.md`（最終版プロンプト）
  - 検証用に AI で生成した代替案 lesson.json（参考。本採用は人間レビュー後）
- **完了条件**:
  - 同じプロンプトで 3 回連続、Zod パスかつ全URLが200を返す
  - 生成コードが Vue SFC Playground で動く
- **blockedBy**: なし
- **並行可能**: 全 F 系・C 系
- **見積**: 0.5d

## R-002 — モバイル UX 検証（触覚 / フォーカス / セーフエリア）

- **目的**: 実機（iOS Safari / Android Chrome）で以下の挙動を確認し、実装方針を決める
  - Web Vibration API の対応状況（iOS Safari は鳴らない確認）
  - `safe-area-inset-*` の扱い（下部ナビが iPhone のホームバーに被らないか）
  - 4択ボタンの最小ヒット領域（44×44 推奨）
  - 入力フォーカスでスクロールが暴れるか（このアプリでは入力は使わない見込みだが念のため）
- **成果物**: `docs/mobile-ux-findings.md` に検証結果と採用方針
- **完了条件**: 上記4項目に「採用 / 不採用」「代替手段」が書かれている
- **blockedBy**: なし
- **並行可能**: 全 F 系・C 系
- **見積**: 0.5d

## R-003 — Vercel SSG デプロイ設定の検証

- **目的**: `nuxt generate` の出力を Vercel にデプロイする最小構成を検証。プレビューデプロイがPRごとに自動で出る挙動を確認
- **成果物**: `docs/deploy.md` にビルドコマンド・出力ディレクトリ・環境変数（なくてもよい）・ドメイン設定の手順
- **完了条件**:
  - `main` ブランチへの push でデプロイされる
  - PR で preview URL が出る
  - 静的アセットのキャッシュが効いている
- **blockedBy**: F-001（最小限の Nuxt プロジェクトが必要）
- **並行可能**: F-002 以降の全実装と並行
- **見積**: 0.5d

## R-004 — SSG × localStorage のハイドレーション戦略

- **目的**: SSG で出した HTML は「進捗が読まれていない初期状態」を含む。クライアント側で localStorage を読んで描画を切り替える際の「Hydration mismatch」を避ける方針を確定する
- **検討論点**:
  - `<ClientOnly>` で進捗依存部分を包む？
  - `onMounted` 後に store を hydrate する？
  - SSG の初回表示は「未着手状態」で出して、JS 起動後に上書きする方針で OK か
- **成果物**: `docs/hydration-strategy.md` に採用方針 + 該当コンポーネントへの適用ルール
- **完了条件**: F-008 着手前に方針が固まっている
- **blockedBy**: なし
- **並行可能**: F-001..F-007
- **見積**: 0.5d
- **重要度**: 高（Section 2 の教材題材にもなる）

## R-005 — markdown-it / Shiki のセキュリティと表示品質

- **目的**: 解説本文の Markdown を信頼源（自分が書いた JSON）から描画する際の、HTML サニタイズ要否と、Shiki のテーマ・言語ロード戦略を決める
- **検討論点**:
  - 自前コンテンツのみなら sanitize 不要か（基本はそうだが原則は守りたい）
  - Shiki の theme は `light-plus` 1個でよいか、TS/Vue/CSS の言語パックだけロードできるか
  - SSG ビルド時にハイライト済みHTMLを出すか、ランタイムで Shiki を走らせるか（前者推奨）
- **成果物**: `lib/markdown.ts` / `lib/shiki.ts` の設計メモ
- **blockedBy**: なし
- **並行可能**: F-001..F-006
- **見積**: 0.5d

---

# F 系: 実装トラック

## F-001 — プロジェクト初期化（**唯一の serial 起点**）

- **目的**: 雛形と依存を入れ、`npm run dev` でブランクページが立ち上がる状態
- **タスク**:
  - `npx nuxi init .`（既存の docs/, content/ を保持）
  - 依存追加: `typescript`, `@pinia/nuxt`, `pinia`, `@nuxt/icon`, `@iconify-json/lucide`, `zod`, `markdown-it`, `@types/markdown-it`, `shiki`, `@nuxt/eslint`
  - `nuxt.config.ts` にモジュール登録（pinia, icon, eslint）
  - フォント設定（Inter + Noto Sans JP）— `@nuxt/fonts` または手書き `<link>`
  - `tsconfig.json` に必要なら paths 追加
  - `package.json` の scripts: `dev`, `generate`, `lint`, `typecheck`
- **完了条件**:
  - `npm run dev` でトップが表示
  - `npm run typecheck` がパス
  - `npm run lint` がパス
- **blockedBy**: なし
- **並行可能**: R 系・C 系
- **見積**: 0.5d

## F-002 — CSS 基盤（reset / tokens / typography / global）

- **目的**: Duolingo風スタイリングの土台
- **タスク**:
  - `assets/css/reset.css`（Andy Bell風モダンリセット）
  - `assets/css/tokens.css`（`:root` に CSS変数、`plan.md` 7章をそのまま）
  - `assets/css/typography.css`（見出し・本文のジャンプ率設定）
  - `assets/css/global.css`（3D影ボタンの共通スタイル等）
  - `nuxt.config.ts` の `css` 配列で読み込み
- **完了条件**:
  - `app.vue` で `<h1>` `<p>` `<button>` を素で書いたときに、Duolingo風タイポと3D影ボタンが出る
- **blockedBy**: F-001
- **並行可能**: F-003, F-004, F-005, F-006, F-007（コードを互いに触らない）
- **見積**: 0.5d

## F-003 — Zod スキーマ + lesson.json ローダー

- **目的**: コンテンツの「壊れ検知」を仕組み化
- **タスク**:
  - `lib/schema.ts`（`plan.md` 5.3 をベースに完成版）
  - `composables/useLesson.ts`（id を渡すと該当 JSON を Zod パースして返す）
  - `composables/useSection.ts`（section.json を返す）
  - JSONのインポートは Vite の `import.meta.glob` で eager 読み込み
  - 起動時に全 lesson.json をパースしてエラーがあれば dev 画面に出す薄い helper
- **完了条件**:
  - サンプル `vue-reactivity/01-ref-vs-reactive/lesson.json` を `useLesson('vue-reactivity.ref-vs-reactive')` で取得し、型推論が効く
  - JSON を壊すと dev で目に見えるエラーになる
- **blockedBy**: F-001
- **並行可能**: F-002, F-004, F-005, F-006, F-007
- **見積**: 1d

## F-004 — Pinia store: 進捗・マスタリー・復習キュー

- **目的**: localStorage を真実のソースにする状態管理
- **タスク**:
  - `stores/progress.ts`（state: `lessons`, `reviewQueue`, `schemaVersion`）
  - `composables/useProgress.ts`（localStorage 読み書きの薄ラップ）
  - マスタリー判定ロジック（`computed` で星を算出 or action で再評価）
  - 復習キュー操作（`addWrong`, `markCorrect`, `getDueToday`）
  - 単体テスト（Vitest）: マスタリー昇格条件、Box遷移、`dueAt` 判定
- **完了条件**:
  - Vitest で主要ロジックがパス
  - 開発時にブラウザ DevTools で `localStorage.flap.progress.v1` を眺めれば変化が観測できる
- **blockedBy**: F-001
- **並行可能**: F-002, F-003, F-005, F-006, F-007
- **見積**: 1.5d

## F-005 — UI プリミティブ（モック駆動で単体構築）

- **目的**: 統合前に部品を完成させる
- **タスク**（モックデータで Storybook 風に確認）:
  - `components/ui/PrimaryButton.vue`（Duolingo風3D影、押下で影が消える）
  - `components/ui/ChoiceButton.vue`（4択ボタン、選択中/正解/不正解の3状態）
  - `components/ui/StarRow.vue`（★1-3）
  - `components/nav/BottomNav.vue`（ホーム / 復習 / 設定）
  - `components/nav/TopBar.vue`（× + 進捗バー）
  - `components/lesson/FeedbackSheet.vue`（緑/赤の下から滑り上がり）
  - `app.vue` 直下にデモ用ルートを置いて手動確認
- **完了条件**:
  - 各コンポーネントが props 駆動で見た目を切り替えられる
  - スマホ実機で押下感が違和感ない
- **blockedBy**: F-001（F-002 を待たずに着手可。tokens が無くてもデフォルト値で代用）
- **並行可能**: F-002, F-003, F-004, F-006, F-007
- **見積**: 1.5d

## F-006 — ページルーティング雛形（中身ダミー）

- **目的**: URLとレイアウトの骨格を先に固定
- **タスク**:
  - `pages/index.vue`（セクション一覧、ダミー）
  - `pages/section/[slug].vue`（レッスン一覧、ダミー）
  - `pages/lesson/[section]/[slug].vue`（レッスン画面、ダミー）
  - `pages/review.vue`（復習タブ、ダミー）
  - `pages/settings.vue`（設定タブ、ダミー）
  - `app.vue` で下部ナビ常時表示、ただしレッスン画面では非表示にするロジック
- **完了条件**:
  - URL を直打ちで全ページが開く
  - 下部ナビでタブ切替できる
- **blockedBy**: F-001
- **並行可能**: F-002, F-003, F-004, F-005, F-007
- **見積**: 0.5d

## F-007 — Markdown + Shiki 統合

- **目的**: 解説本文の Markdown 文字列を、構文ハイライト付きHTMLとして安全に描画
- **タスク**:
  - `lib/markdown.ts`（markdown-it インスタンス、コードブロックは Shiki に委譲）
  - `lib/shiki.ts`（必要言語: ts, vue, css, html, json）
  - `components/lesson/MarkdownBlock.vue`（`<MarkdownBlock :src="..." />`）
  - SSG ビルド時に変換を済ませる方針（ランタイム重さ回避）
- **完了条件**:
  - サンプルlessonの解説本文がハイライト付きで出る
  - SSG ビルド時間が許容範囲
- **blockedBy**: F-001
- **並行可能**: F-002, F-003, F-004, F-005, F-006
- **見積**: 1d

## F-008 — LessonRunner 統合（intro → 解説 → 演習 → summary）

- **目的**: ここで初めて F-002〜F-007 が合流する
- **タスク**:
  - `components/lesson/LessonRunner.vue`（状態機械的にカードを進める）
  - `IntroCard`, `ExplanationCard`, `ExerciseCard`, `SummaryCard`
  - 進捗バーを上に表示、× で離脱モーダル
  - 「続ける」で次へ、キーボード Enter も
- **完了条件**:
  - サンプルlessonを最初から最後まで通せる
  - 不正解選択でも先に進める（演習挙動は F-009 で）
- **blockedBy**: F-002, F-003, F-005, F-006, F-007
- **並行可能**: F-004（store 連動は F-010 で後付け）, C 系全部
- **見積**: 1.5d

## F-009 — 演習挙動（4択 / 即時フィードバック / 末尾リトライ）

- **目的**: ChoiceButton と FeedbackSheet を ExerciseCard に組み込み、正誤判定と再出題を回す
- **タスク**:
  - 選択で即時フィードバック（緑/赤シート）
  - 全選択肢の `explanation` を表示
  - 不正解の問題をレッスン末尾の「リトライキュー」に積み、最後に再出題
  - 1/2/3/4 のキーボードショートカット
- **完了条件**:
  - サンプルlessonでわざと間違えると、末尾でもう一度出る
  - 正解するまでリトライキューに残る
- **blockedBy**: F-008
- **並行可能**: F-010, F-011
- **見積**: 1d

## F-010 — 進捗の永続化（store ↔ localStorage 結合）

- **目的**: LessonRunner の完走で `lessons[id].attempts++`、`lastCompletedAt` を更新
- **タスク**:
  - レッスン完走時に store action を叩く
  - ページ初回マウントで store を localStorage から hydrate（R-004 の方針に従う）
  - サンプルlessonを2回通して `attempts: 2` が localStorage に書かれることを確認
- **完了条件**:
  - リロード後も進捗が残る
  - DevTools で localStorage の中身が読める
- **blockedBy**: F-004, F-008, R-004
- **並行可能**: F-009, F-011, F-012
- **見積**: 0.5d

## F-011 — マスタリー判定の結合（★1-3 表示）

- **目的**: ホーム/セクション一覧でレッスンの星が出る
- **タスク**:
  - レッスン完走時、当日全問1回目で正解だったかを判定
  - 「別日」「3日以上空けた」の条件を `lastCompletedAt` から計算
  - `StarRow` を一覧に組み込む
- **完了条件**:
  - サンプルlessonで条件を満たすと★が増える
  - 条件を満たさない再挑戦では★が増えない
- **blockedBy**: F-004, F-008, F-010
- **並行可能**: F-009, F-012
- **見積**: 1d

## F-012 — 復習キュー結合（差し込み + 復習タブ）

- **目的**: 間違えた問題が翌日以降のレッスン冒頭に差し込まれる + 復習タブで一括消化できる
- **タスク**:
  - レッスン開始時に `getDueToday()` から最大3問を取得し、本編の前に出題
  - 各正誤で Box 1→2→3→卒業 の遷移
  - 復習タブで `getAllDue()` を順に出題（レッスンUI流用）
  - ホームに「今日の復習: N問」表示
- **完了条件**:
  - サンプルlessonで意図的に間違えた問題が翌日（dev では日付固定で擬似的に）出題される
  - 復習タブからも消化できる
- **blockedBy**: F-004, F-008, F-009
- **並行可能**: F-011
- **見積**: 1.5d

## F-013 — 設定画面

- **目的**: 進捗リセット、JSONバージョン表示、ライセンス
- **タスク**:
  - `pages/settings.vue` の中身を実装
  - 進捗リセットは確認モーダル → `localStorage.removeItem('flap.progress.v1')`
- **完了条件**: 上記が動く
- **blockedBy**: F-004
- **並行可能**: F-005..F-012
- **見積**: 0.5d

## F-014 — アクセシビリティ最終確認

- **目的**: VoiceOver / TalkBack で完走可能、フォーカスリングが見える、ランドマークが正しい
- **タスク**:
  - 主要ボタンに `aria-label`
  - ChoiceButton の選択状態を `aria-pressed`
  - FeedbackSheet を `role="status"` で読み上げ
  - Tab 移動でフォーカスが論理的に進むか確認
  - コントラスト比チェック
- **完了条件**:
  - スマホ実機でスクリーンリーダーが意味のある読み上げをする
- **blockedBy**: F-008, F-009
- **並行可能**: F-010..F-013
- **見積**: 1d

## F-015 — 本番デプロイ

- **目的**: Vercel で公開（ベーシック認証 or 非公開ドメインで自分のみアクセス）
- **タスク**:
  - GitHub repo 作成・push
  - Vercel 連携、build command `npm run generate`、output `.output/public` または `dist/`
  - 自分のみアクセスする運用（Vercel password protection or プライベートリポでURL秘匿）
- **完了条件**: 公開URLでスマホから動く
- **blockedBy**: F-002..F-012（実用最小限が揃っている）
- **並行可能**: F-013, F-014
- **見積**: 0.5d

---

# C 系: コンテンツトラック（実装と完全並行）

スキーマは確定済みなので、F 系と完全に並行で書ける。書いた JSON は CI 等で Zod パースだけかけておけば、F-003 完成前にも品質確認できる。

## C-001 — Section 1 残り4レッスン執筆

- レッスン 02: `computed と watch の使い分け（とよくある誤用）`
- レッスン 03: `ライフサイクルフックと SSR / クライアントの境界`
- レッスン 04: `テンプレート refs と DOM 操作の正しい入り口`
- レッスン 05: `リアクティビティを壊すアンチパターン`
- **手順**: `plan.md` 10章のワークフローに従う（AI下書き → 一次ソース照合 → コード動作確認 → コミット）
- **完了条件**: 4本とも Zod パスかつ全URLが200、コードは Playground で動く
- **blockedBy**: なし（R-001 の成果を取り込めるとなお良い）
- **並行可能**: F 系全部、C-002, C-003
- **見積**: 4d（1レッスン1日想定）

## C-002 — Section 2 全5レッスン執筆

- レッスン 01: SSR / SSG / CSR / ISR の違いと選び方
- レッスン 02: useFetch vs useAsyncData vs $fetch
- レッスン 03: ハイドレーション不整合の原因と対策
- レッスン 04: Route middleware と Server middleware
- レッスン 05: auto-import と「魔法を信用しすぎない」設計
- **blockedBy**: なし
- **並行可能**: F 系全部、C-001, C-003
- **見積**: 5d

## C-003 — Section 3 全5レッスン執筆

- レッスン 01: `as const` と literal types
- レッスン 02: ジェネリクスの読み方
- レッスン 03: ユーティリティ型
- レッスン 04: 型ガード
- レッスン 05: `defineProps<T>()` / `defineEmits<T>()` の型読解
- **blockedBy**: なし
- **並行可能**: F 系全部、C-001, C-002
- **見積**: 5d

---

# 並行実行レーンの早見表

| Day | R 系                               | F 系                       | C 系                   |
| --- | ---------------------------------- | -------------------------- | ---------------------- |
| 0.5 | R-001 / R-002 / R-004 / R-005 着手 | F-001                      | C-001/002/003 同時開始 |
| 1   | R-002 完了, R-005 完了             | F-002 / F-005 / F-006 並行 | continue               |
| 2   | R-001 完了, R-003 着手             | F-003 / F-004 / F-007 並行 | continue               |
| 3   | R-003 完了, R-004 完了             | F-008 統合                 | continue               |
| 4   | —                                  | F-009 / F-010 並行         | continue               |
| 5   | —                                  | F-011 / F-012 並行         | continue               |
| 6   | —                                  | F-013 / F-014 並行         | C-001 完了見込み       |
| 7   | —                                  | F-015 デプロイ             | C-002 進行中           |

「並行」とは1人開発でも作業文脈の切替が容易な単位を意味する。Issue分割はそれぞれが独立してコミットできる粒度になっている。

---

# 着手順の推奨

1. **今すぐ**: F-001 / R-001 / R-002 / R-004 / R-005 / C-001 を全部開始可能
2. **F-001 完了後（半日）**: F-002〜F-007 を好きな順で並行
3. **F-002,3,5,6,7 揃ったら**: F-008（最初の統合点）
4. **F-008 動いたら**: F-009/010/011/012 並行
5. **仕上げ**: F-013/014 並行、F-015 で公開
