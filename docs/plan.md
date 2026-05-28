# frontend-learning-app 計画

自分のフロントエンド知識を「コードリーディング」と「設計判断」の軸で補強するための学習アプリ。スマホ移動時間に1日1レッスン消化する想定。Duolingo風UI（青系オリジナル配色）。

---

## 1. プロジェクトの目的とターゲット

- **対象ユーザー**: 自分1人（完全自分専用）
- **レベル感**: HTML/CSS/JS基礎理解、Nuxt触り始め
- **強化したい力**:
  - コードを「読んで意味を理解する」力（AI時代に価値が落ちにくい）
  - 「どっちの実装が適切か」を選ぶ設計判断力
- **学習対象スコープ**:
  - Vue 3 / Nuxt
  - TypeScript
  - モダンJS / モダンCSS / HTML / アクセシビリティ
  - 設計判断（コンポーネント分割、状態管理境界、SSR/SCR選定 等）
  - インフラ・ホスティング選定

---

## 2. プロダクト仕様

### 2.1 レッスン構造

1レッスン = 5-8分。以下の順で進む。

```
導入カード（1-2枚）   : 今回学ぶこと・なぜ重要か（30秒）
解説カード（2-4枚）   : 図やコード断片付き本文（2-3分）
演習（4-6問）         : 4択中心、コードリーディング軸（3-4分）
まとめカード（1枚）   : 要点と一次ソースリンク
```

### 2.2 カリキュラム構造

- **セクション内は線形**（順番に進む、ジャンプ率効いた進捗UI）
- **セクション間は自由**（弱点セクションに集中可）

### 2.3 出題形式（MVP）

| 種類            | 用途                                           |
| --------------- | ---------------------------------------------- |
| ① コード読解4択 | 「この出力は？」「このコードの意図は？」       |
| ② 設計判断4択   | 「より適切な実装は？」「この要件ならどっち？」 |

- 全選択肢に解説（なぜ○ / ×か）を必ず付ける
- 「最も適切なものを選べ」表現で正解1つに収束

### 2.4 マスタリー（★1〜★3）

```
★0 : 未着手
★1 : 1回完走（演習を最後まで通過、間違えてもOK）
★2 : ★1 達成後、別日に再挑戦して全問1回目で正解
★3 : ★2 達成後、さらに3日以上空けて再挑戦して全問1回目で正解
```

### 2.5 復習キュー（Leitner簡易版）

```
間違えた問題 → Box 1 → 正解で Box 2 → 正解で Box 3 → 卒業
不正解時はどこからでも Box 1 に戻る

Box 1: 翌日に再出題
Box 2: 3日後
Box 3: 7日後
```

- 1セッションでの差し込みは最大3問
- 下部ナビ「復習」タブからまとめて消化も可

### 2.6 ゲーミフィケーション（不採用）

採用しない: XP、ストリーク、ハート、バッジ、デイリークエスト、リーグ、ダークモード、PWA、Supabase同期。シンプル最優先。

### 2.7 利用形態

- 認証なし
- 進捗は **localStorage のみ**
- コンテンツは **Git管理のJSON**

---

## 3. UI / ビジュアル

### 3.1 カラーパレット

```
Primary:       #1CB0F6   明るいシアン
Primary-dark:  #0E84BD   押下/影
Success:       #58CC02   正解
Error:         #FF4B4B   不正解
Accent:        #FFC800   星等
BG:            #FFFFFF
Surface:       #F7F7F7
Text:          #3C3C3C
Text-muted:    #777777
```

### 3.2 タイポグラフィ（ジャンプ率重視）

- 英数: Inter（Google Fonts）
- 和文: Noto Sans JP
- 見出しに weight 700-800 を大胆に使う

### 3.3 採否

| 採用                           | 不採用                                 |
| ------------------------------ | -------------------------------------- |
| ジャンプ率の効いたタイポ       | マスコット・イラスト                   |
| 3D影付きボタン（下に厚みの影） | 進捗パスのクネクネ道（縦リストで代替） |
| 正解=緑シート、不正解=赤シート | 音                                     |
| 軽いマイクロアニメ（shake等）  | デイリー通知                           |

### 3.4 画面構成

```
下部ナビ: [ ホーム ][ 復習 ][ 設定 ]

ホーム
  └─ 復習バッジ（"今日の復習: 3問"）
  └─ セクション一覧
       └─ セクション内レッスン一覧（縦リスト、★1-3表示）
            └─ レッスン画面（カード遷移、下部に「続ける」固定）

復習
  └─ 復習キューの問題を連続消化

設定
  └─ 進捗リセット / JSONバージョン / ライセンス
```

### 3.5 レッスン中UX

- **解説カード**: 1画面 = 見出し+本文+（コード）+ソース、「続ける」で次へ。スワイプ進行は入れない（誤操作回避）
- **演習カード**: 上半分=問題、下半分=4択ボタン縦並び。選択 → 即時フィードバック（緑/赤シート滑り上がり、全選択肢の解説表示） → 「続ける」
- **不正解の問題**: そのレッスン末尾でもう一度出題（Duolingo流の即時リトライ） + 復習キュー登録
- **戻る**: 左上 × でモーダル「中断して終了？進捗は保存されません」
- **キーボード操作**: 1/2/3/4キーで選択、Enterで進む（PCテスト用）
- **触覚フィードバック**: Web Vibration API で短い振動（正/誤）

---

## 4. ディレクトリ構造

```
frontend-learning-app/
├── app.vue
├── nuxt.config.ts
├── package.json
├── tsconfig.json
├── eslint.config.ts
├── assets/
│   └── css/
│       ├── reset.css            # モダンreset
│       ├── tokens.css           # CSS変数（色/font/spacing/radius/shadow）
│       ├── typography.css       # 見出し・本文のジャンプ率
│       └── global.css           # ボタン3D影など頻出ユーティリティ
├── components/
│   ├── lesson/
│   │   ├── LessonRunner.vue     # カード遷移ロジックの親
│   │   ├── IntroCard.vue
│   │   ├── ExplanationCard.vue
│   │   ├── ExerciseCard.vue     # ①②共通の4択UI
│   │   ├── FeedbackSheet.vue    # 緑/赤の滑り上がりシート
│   │   └── SummaryCard.vue
│   ├── nav/
│   │   ├── BottomNav.vue
│   │   └── TopBar.vue           # × ボタン + 進捗バー
│   └── ui/
│       ├── PrimaryButton.vue    # Duolingo風3D影ボタン
│       ├── ChoiceButton.vue
│       └── StarRow.vue          # ★1-3表示
├── composables/
│   ├── useProgress.ts           # localStorage 読み書き（薄いラッパ）
│   ├── useReviewQueue.ts        # Leitner ロジック
│   └── useMastery.ts            # ★1-3 判定
├── stores/
│   └── progress.ts              # Pinia: 進捗 + 復習キューを一元管理
├── pages/
│   ├── index.vue                # ホーム（セクション一覧）
│   ├── section/
│   │   └── [slug].vue           # セクション内レッスン一覧
│   ├── lesson/
│   │   └── [section]/[slug].vue # レッスン実行画面
│   ├── review.vue               # 復習タブ
│   └── settings.vue             # 設定タブ
├── content/
│   └── sections/
│       ├── vue-reactivity/
│       │   ├── section.json
│       │   ├── 01-ref-vs-reactive/
│       │   │   └── lesson.json
│       │   ├── 02-computed-vs-watch/
│       │   ├── 03-lifecycle/
│       │   ├── 04-template-refs/
│       │   └── 05-anti-patterns/
│       ├── nuxt-data-fetching/
│       └── ts-type-inference/
├── lib/
│   ├── schema.ts                # Zod スキーマ（lesson.json検証）
│   ├── markdown.ts              # markdown-it ラッパ
│   └── shiki.ts                 # Shiki ラッパ
├── docs/
│   └── plan.md                  # このファイル
└── public/
    └── favicon.svg
```

---

## 5. JSON スキーマ

### 5.1 `section.json`

```json
{
  "id": "vue-reactivity",
  "title": "Vue 3 リアクティビティ基礎",
  "description": "ref と reactive の使い分け、computed と watch、ライフサイクル、SSR境界などを扱う。",
  "order": 1,
  "lessons": [
    "01-ref-vs-reactive",
    "02-computed-vs-watch",
    "03-lifecycle",
    "04-template-refs",
    "05-anti-patterns"
  ]
}
```

### 5.2 `lesson.json`

```jsonc
{
  "id": "vue-reactivity.ref-vs-reactive",
  "version": 1,
  "title": "ref と reactive の使い分け",
  "estimatedMinutes": 6,
  "tags": ["vue3", "reactivity"],
  "prerequisites": [],

  "intro": {
    "headline": "なぜ ref と reactive が両方あるのか",
    "body": "Vue 3 のリアクティビティには ref と reactive の2つの入り口があり... (markdown 150-300字)",
  },

  "explanations": [
    {
      "heading": "ref はプリミティブ用、reactive はオブジェクト用",
      "body": "... (markdown 300-600字)",
      "code": {
        "lang": "ts",
        "src": "const count = ref(0)\nconst state = reactive({ count: 0 })",
      },
      "sources": [
        {
          "title": "Vue.js — Reactivity Fundamentals",
          "url": "https://vuejs.org/guide/essentials/reactivity-fundamentals.html",
        },
      ],
    },
  ],

  "exercises": [
    {
      "id": "ex1",
      "type": "code-reading-4choice",
      "prompt": "次のコードの console.log は何を出力する？",
      "code": {
        "lang": "ts",
        "src": "const s = reactive({ n: 1 })\nconst r = s\nr.n = 2\nconsole.log(s.n)",
      },
      "choices": [
        {
          "id": "a",
          "label": "1",
          "isCorrect": false,
          "explanation": "reactive は Proxy を返すが、同じ参照を介した変更はソースに反映される。",
        },
        {
          "id": "b",
          "label": "2",
          "isCorrect": true,
          "explanation": "r は s と同一参照（同じ Proxy）なので、r.n = 2 は s.n も 2 にする。",
        },
        {
          "id": "c",
          "label": "undefined",
          "isCorrect": false,
          "explanation": "n はオブジェクトに存在するキーで undefined にはならない。",
        },
        {
          "id": "d",
          "label": "エラー",
          "isCorrect": false,
          "explanation": "型エラー・実行時エラーは発生しない。",
        },
      ],
      "sources": [
        {
          "title": "Vue.js — reactive()",
          "url": "https://vuejs.org/api/reactivity-core.html#reactive",
        },
      ],
    },
    {
      "id": "ex2",
      "type": "design-judgment-4choice",
      "prompt": "フォーム入力（文字列1つ）を持つときに最も適切なのは？",
      "choices": [
        {
          "id": "a",
          "label": "ref('')",
          "isCorrect": true,
          "explanation": "プリミティブ単体は ref が公式推奨。再代入も自然。",
        },
        {
          "id": "b",
          "label": "reactive({ value: '' })",
          "isCorrect": false,
          "explanation": "可だが冗長。プリミティブを reactive で包む利点は薄い。",
        },
        {
          "id": "c",
          "label": "let s = ''",
          "isCorrect": false,
          "explanation": "リアクティブでなくテンプレに反映されない。",
        },
        {
          "id": "d",
          "label": "computed(() => '')",
          "isCorrect": false,
          "explanation": "computed は派生値用で書き込めない。",
        },
      ],
      "sources": [{ "title": "Vue.js Style Guide", "url": "https://vuejs.org/style-guide/" }],
    },
  ],

  "summary": {
    "keypoints": [
      "プリミティブは ref、オブジェクトは reactive または ref(オブジェクト)",
      "reactive は再代入できない（参照ごと差し替えると別物）",
      "テンプレ内では ref も自動 unwrap される",
    ],
    "furtherReading": [
      {
        "title": "Vue.js — Reactivity in Depth",
        "url": "https://vuejs.org/guide/extras/reactivity-in-depth.html",
      },
    ],
  },
}
```

### 5.3 Zod スキーマ（`lib/schema.ts` 雛形）

```ts
import { z } from "zod";

const Source = z.object({ title: z.string(), url: z.string().url() });

const Code = z.object({ lang: z.string(), src: z.string() });

const Choice = z.object({
  id: z.string(),
  label: z.string(),
  isCorrect: z.boolean(),
  explanation: z.string(),
});

const Exercise = z.object({
  id: z.string(),
  type: z.enum(["code-reading-4choice", "design-judgment-4choice"]),
  prompt: z.string(),
  code: Code.optional(),
  choices: z.array(Choice).length(4),
  sources: z.array(Source).min(1),
});

export const LessonSchema = z.object({
  id: z.string(),
  version: z.number(),
  title: z.string(),
  estimatedMinutes: z.number(),
  tags: z.array(z.string()),
  prerequisites: z.array(z.string()),
  intro: z.object({ headline: z.string(), body: z.string() }),
  explanations: z
    .array(
      z.object({
        heading: z.string(),
        body: z.string(),
        code: Code.optional(),
        sources: z.array(Source).min(1),
      })
    )
    .min(1),
  exercises: z.array(Exercise).min(1),
  summary: z.object({
    keypoints: z.array(z.string()).min(1),
    furtherReading: z.array(Source),
  }),
});
```

---

## 6. localStorage スキーマ

キー: `flap.progress.v1`（破壊的変更時は v2 にバンプ）

```json
{
  "lessons": {
    "vue-reactivity.ref-vs-reactive": {
      "mastery": 2,
      "lastCompletedAt": "2026-05-28T09:00:00Z",
      "attempts": 3,
      "firstCompletedAt": "2026-05-25T08:00:00Z"
    }
  },
  "reviewQueue": [
    {
      "exerciseRef": "vue-reactivity.ref-vs-reactive#ex1",
      "box": 1,
      "dueAt": "2026-05-29T00:00:00Z",
      "lastResult": "wrong"
    }
  ],
  "schemaVersion": 1
}
```

- `box` は 1/2/3。卒業時はキューから削除
- `dueAt` 未来分は当日の差し込みからは除外、復習タブで全部見える

---

## 7. CSS 設計トークン（`assets/css/tokens.css`）

```css
:root {
  --color-primary: #1cb0f6;
  --color-primary-dark: #0e84bd;
  --color-success: #58cc02;
  --color-error: #ff4b4b;
  --color-accent: #ffc800;
  --color-bg: #ffffff;
  --color-surface: #f7f7f7;
  --color-text: #3c3c3c;
  --color-text-muted: #777777;

  --font-sans: "Inter", "Noto Sans JP", system-ui, sans-serif;

  --fs-display: 32px;
  --fs-h1: 24px;
  --fs-h2: 20px;
  --fs-body: 16px;
  --fs-label: 13px;

  --fw-bold: 800;
  --fw-regular: 400;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  --shadow-button: 0 4px 0 var(--color-primary-dark);
  --shadow-button-pressed: 0 0 0 var(--color-primary-dark);
}
```

---

## 8. Tech Stack 詳細

| 項目           | 採用                                                  |
| -------------- | ----------------------------------------------------- |
| Framework      | Nuxt 3                                                |
| Language       | TypeScript                                            |
| Rendering      | SSG（`npm run generate`）                             |
| Styling        | 生CSS（SFC scoped + tokens.css + BEM風命名）          |
| State          | Pinia (`@pinia/nuxt`)                                 |
| Persistence    | localStorage（`useProgress` composable で薄くラップ） |
| Markdown       | markdown-it                                           |
| Code highlight | Shiki                                                 |
| Icons          | Iconify (`@nuxt/icon`)                                |
| Validation     | Zod（lesson.json 読込時に検証）                       |
| Font           | Inter + Noto Sans JP                                  |
| Linter         | ESLint flat config + `@nuxt/eslint`                   |
| Test           | Vitest（ロジック層のみ最小限）                        |
| Host           | Vercel（GitHub連携、push to main で自動デプロイ）     |

**不採用**: Tailwind / UnoCSS / Tailwind以外のCSSフレームワーク、@nuxt/content、Dark mode、PWA、Supabase、認証。

---

## 9. 最初の3セクション（MVP = 15レッスン）

### Section 1: Vue 3 リアクティビティ基礎

1. ref と reactive の使い分け
2. computed と watch の使い分け（とよくある誤用）
3. ライフサイクルフックと SSR / クライアントの境界
4. テンプレート refs と DOM 操作の正しい入り口
5. リアクティビティを壊すアンチパターン（分割代入・配列インデックス代入等）

### Section 2: Nuxt データフェッチとレンダリング

1. SSR / SSG / CSR / ISR の違いと選び方
2. `useFetch` vs `useAsyncData` vs `$fetch`
3. ハイドレーション不整合（Hydration mismatch）の原因と対策
4. Route middleware と Server middleware
5. Nuxt の auto-import と「魔法を信用しすぎない」設計

### Section 3: TypeScript 型推論の読解

1. `as const` と literal types
2. ジェネリクスの読み方（関数シグネチャから推論を追う）
3. ユーティリティ型（`Partial`, `Pick`, `Omit`, `ReturnType`, `Awaited`）
4. 型ガード（`is`述語、`in`、`typeof`、discriminated union）
5. Vue 3 の `defineProps<T>()` / `defineEmits<T>()` の型読解

各セクション・各レッスンに「設計判断問題」を最低1問は含める運用。

---

## 10. コンテンツ作成ワークフロー

### 10.1 原則

1. **ソースを書けない主張は載せない**: 各解説・各演習に `sources` を必ず付ける
2. **動かしてないコードは載せない**: コード例は Vue SFC Playground / Nuxt Playground / TS Playground で実行確認
3. **設計判断問題は複数の信頼できる立場を解説に併記**

### 10.2 一次ソースの優先順位

| ジャンル         | 一次ソース                                                          |
| ---------------- | ------------------------------------------------------------------- |
| Vue 3            | <https://vuejs.org/> （公式ガイド・API・Style Guide）               |
| Nuxt 3           | <https://nuxt.com/docs>                                             |
| TypeScript       | <https://www.typescriptlang.org/docs/>                              |
| Web Platform     | MDN <https://developer.mozilla.org/>                                |
| ブラウザ互換性   | MDN BCD / caniuse.com                                               |
| 設計判断（補助） | patterns.dev、Vue公式 Style Guide、Anthony Fu / Evan You の公式発信 |

### 10.3 AI下書き用プロンプトテンプレート

```markdown
あなたは Vue 3 / Nuxt 3 / TypeScript の正確性に強くこだわる教材ライターです。
以下の制約に厳密に従い、JSON を返してください。

# 制約

- 出力は `LessonSchema`（後述）に完全準拠する JSON のみ
- 各 explanation・各 exercise に `sources` を最低1つ含める
- `sources.url` は必ず以下の公式サイトのいずれかから引用:
  - https://vuejs.org/
  - https://nuxt.com/docs
  - https://www.typescriptlang.org/docs/
  - https://developer.mozilla.org/
- 一次ソースに記載が確認できない主張は書かない
- コード例は Vue 3 / Nuxt 3 / TypeScript 5系で動く構文を使う
- 演習の不正解選択肢の `explanation` は「なぜ違うか」を技術的に説明する
- 日本語で書く。コード内コメントも日本語可

# このレッスンのテーマ

{ここにテーマを記述。例: 「ref と reactive の使い分け。プリミティブ vs オブジェクト。reactive を let で再代入するアンチパターン。」}

# 想定読者

- HTML/CSS/JS 基礎理解あり、Nuxt 触り始めの初級者
- コードを「読む力」を鍛えたい
- 設計判断のトレードオフを学びたい

# LessonSchema（参照のみ、出力には含めない）

{ここに `lib/schema.ts` の構造を貼る}

# 出力

JSON のみ。前後の説明文・コードフェンスは不要。
```

### 10.4 レビューチェックリスト（人間が必ず通す）

- [ ] `sources` のURLが実際に開ける
- [ ] 解説の各段落の主張が `sources` のページに書かれている
- [ ] コード例を実行して期待通り動く
- [ ] 不正解選択肢の `explanation` が「正解との差」を技術的に説明している
- [ ] 設計判断問題なら、正解の根拠が「広く合意された見解」であり、Style Guide等で裏取りできる
- [ ] Zod スキーマでパースが通る（CIで自動化）

---

## 11. 実装ロードマップ

### Phase 0: プロジェクト初期化（半日）

- [ ] `npx nuxi init` で雛形
- [ ] TypeScript / ESLint / Pinia / Iconify / Zod / markdown-it / Shiki 導入
- [ ] フォント設定（Inter + Noto Sans JP）
- [ ] `assets/css/tokens.css`, `reset.css`, `typography.css`, `global.css`
- [ ] `lib/schema.ts`（Zod）

### Phase 1: コンテンツ1本＋静的ビュー（1-2日）

- [ ] `content/sections/vue-reactivity/section.json`
- [ ] `content/sections/vue-reactivity/01-ref-vs-reactive/lesson.json`
- [ ] ホーム（セクション一覧）/ セクション内一覧 / レッスン画面の静的レイアウト
- [ ] `LessonRunner.vue` で intro → explanation → exercise → summary を順に表示

### Phase 2: 演習ロジック（1-2日）

- [ ] 4択UI（`ChoiceButton.vue`, `FeedbackSheet.vue`）
- [ ] 即時フィードバック・全選択肢解説表示
- [ ] レッスン末尾での不正解再出題
- [ ] レッスン完了画面

### Phase 3: 進捗・マスタリー・復習（2-3日）

- [ ] Pinia `progress` store + localStorage 永続化
- [ ] マスタリー判定（★1-3、別日・3日間隔判定）
- [ ] 復習キュー（Leitner 1-3-7日）
- [ ] 復習タブ
- [ ] ホームに「今日の復習: N問」表示

### Phase 4: コンテンツ充填（2-3週間、平行作業）

- [ ] 残り14レッスン分の AI下書き → 一次ソース照合 → 動作確認 → コミット
- [ ] Vercel本番デプロイ

### Phase 5: 仕上げ

- [ ] 設定画面（進捗リセット等）
- [ ] キーボード操作 / 触覚フィードバック
- [ ] アクセシビリティ最終確認（スクリーンリーダー、ランドマーク、フォーカス管理）

---

## 12. 後回しでよいこと（MVPに含めない）

- ダークモード（CSS変数構造で後付け容易だが今は不要）
- PWA化
- Supabase連携・複数端末同期
- 認証・複数ユーザー対応
- マスコット・イラスト
- 進捗パスのクネクネ道UI
- 音声・BGM
- デイリー通知
- ランキング・リーグ
- 公開・SEO最適化
