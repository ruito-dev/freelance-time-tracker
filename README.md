# Freelance Time Tracker

[![CI](https://github.com/ruito-dev/freelance-time-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/ruito-dev/freelance-time-tracker/actions/workflows/ci.yml)

フリーランス向けのタスク管理 & 時間トラッキングアプリケーション

## 概要

このアプリケーションは、フリーランスエンジニアが複数のプロジェクトとタスクを管理し、作業時間を記録・分析するためのツールです。React + TypeScriptのモダンなフロントエンドと、Ruby on RailsのAPIバックエンドを疎結合で構築しています。

## 技術スタック

### Frontend
- **React 19.2.0** - UIライブラリ
- **TypeScript 5.9.3** - 型安全性
- **Vite 7.2.4** - 高速ビルドツール
- **Tailwind CSS 4.1.18** - ユーティリティファーストCSS
- **TanStack Query 5.90.19** - サーバーステート管理
- **React Router 7.12.0** - ルーティング
- **Axios 1.13.2** - HTTP通信
- **Vitest 4.0.17** - テストフレームワーク
- **React Testing Library 16.3.2** - コンポーネントテスト

### Backend
- **Ruby on Rails 8.1** - APIモード
- **PostgreSQL 17** - データベース
- **JWT** - 認証（bcrypt + jwt gem）
- **RSpec 6.0** - テストフレームワーク
- **FactoryBot** - テストデータ生成
- **SimpleCov** - カバレッジ測定

### Infrastructure
- **Docker & Docker Compose** - コンテナ化

## 主要機能

### ✅ 認証機能
- ユーザー登録・ログイン
- JWT認証によるセキュアなAPI通信
- トークンの自動更新

### ✅ プロジェクト管理
- プロジェクトの作成・編集・削除
- クライアント名、説明、時間単価の設定
- プロジェクトステータス管理（進行中・完了）

### ✅ タスク管理
- カンバンボード表示（未着手・進行中・完了）
- タスクの作成・編集・削除
- 優先度設定（低・中・高）
- 期限設定と期限切れ警告
- プロジェクト別フィルター

### ✅ 時間トラッキング
- タスクごとの作業時間記録
- 開始時刻・終了時刻の設定
- 作業内容の記録
- プロジェクト・期間別フィルター
- 合計時間の自動計算

### ✅ レポート機能
- プロジェクト別の作業時間集計
- タスク別の作業時間集計
- 日別の作業時間推移
- 視覚的なグラフ表示（プログレスバー）
- CSVエクスポート機能

### ✅ テスト & CI/CD
- **フロントエンド**: 70テスト、97.59%カバレッジ
- **バックエンド**: 127テスト、93.52%カバレッジ
- **CI/CD**: GitHub Actionsによる自動テスト・Lint実行

## セットアップ

### 前提条件
- Docker Desktop がインストールされていること
- Git がインストールされていること

### 1. リポジトリのクローン

```bash
git clone https://github.com/ruito-dev/freelance-time-tracker.git
cd freelance-time-tracker
```

### 2. 環境変数の設定

バックエンドの環境変数を設定します（必要に応じて）：

```bash
# backend/.env.example をコピー
cp backend/.env.example backend/.env
```

フロントエンドの環境変数を設定します（必要に応じて）：

```bash
# frontend/.env.example をコピー
cp frontend/.env.example frontend/.env
```

### 3. Docker Composeで起動

```bash
# コンテナをビルドして起動
docker-compose up --build
```

初回起動時は、フロントエンドの依存関係のインストールに時間がかかる場合があります。

### 4. データベースのセットアップ

別のターミナルを開いて、以下のコマンドを実行します：

```bash
# データベースの作成
docker-compose exec backend rails db:create

# マイグレーションの実行
docker-compose exec backend rails db:migrate

# サンプルデータの投入（オプション）
docker-compose exec backend rails db:seed
```

### 5. アクセス

ブラウザで以下のURLにアクセスします：

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

### 6. 初回ログイン

新規ユーザー登録画面からアカウントを作成してください。

サンプルデータを投入した場合は、以下のアカウントでログインできます：
- Email: `test@example.com`
- Password: `password`

## 開発

### バックエンド開発

```bash
# Railsコンソール
docker-compose exec backend rails console

# マイグレーション作成
docker-compose exec backend rails g migration CreateXXX

# マイグレーション実行
docker-compose exec backend rails db:migrate

# ルーティング確認
docker-compose exec backend rails routes

# テスト実行
docker-compose exec backend bundle exec rspec

# カバレッジ付きテスト実行
docker-compose exec backend bundle exec rspec
# カバレッジレポートは backend/coverage/index.html に生成されます
```

### フロントエンド開発

```bash
# 依存関係のインストール
docker-compose exec frontend npm install

# 型チェック
docker-compose exec frontend npm run type-check

# Lintチェック
docker-compose exec frontend npm run lint

# ビルド
docker-compose exec frontend npm run build

# テスト実行
docker-compose exec frontend npm test

# カバレッジ付きテスト実行
docker-compose exec frontend npm run test:coverage

# テストUIモード
docker-compose exec frontend npm run test:ui
```

### コンテナの停止

```bash
# コンテナを停止
docker-compose down

# コンテナとボリュームを削除（データベースもリセット）
docker-compose down -v
```

## プロジェクト構成

```
freelance-time-tracker/
├── backend/              # Rails APIバックエンド
│   ├── app/
│   │   ├── controllers/  # APIコントローラー
│   │   ├── models/       # データモデル
│   │   └── ...
│   ├── config/           # Rails設定
│   ├── db/               # マイグレーション・スキーマ
│   └── Dockerfile
├── frontend/             # React + TypeScriptフロントエンド
│   ├── src/
│   │   ├── api/          # API通信
│   │   ├── components/   # Reactコンポーネント
│   │   ├── hooks/        # カスタムフック
│   │   ├── pages/        # ページコンポーネント
│   │   ├── types/        # TypeScript型定義
│   │   └── utils/        # ユーティリティ
│   ├── public/
│   ├── Dockerfile
│   └── vite.config.ts
├── docs/                 # ドキュメント
│   ├── architecture.md   # アーキテクチャ設計
│   ├── database-design.md # データベース設計
│   └── api-design.md     # API設計
├── docker-compose.yml
└── README.md
```

## アーキテクチャ

このプロジェクトは、フロントエンドとバックエンドを完全に分離した**疎結合アーキテクチャ**を採用しています。

### 設計の特徴

1. **フロントエンド（Vite + React）**
   - SPAとして独立して動作
   - TanStack Queryでサーバーステートを管理
   - Tailwind CSSでスタイリング

2. **バックエンド（Rails API）**
   - APIモードで軽量に動作
   - RESTful APIを提供
   - JWT認証でセキュリティを確保

3. **疎結合設計のメリット**
   - フロントエンドとバックエンドを独立して開発・デプロイ可能
   - マイクロサービス的な拡張性
   - 技術スタックの柔軟な変更が可能

### データベース設計

主要なテーブル：
- `users` - ユーザー情報
- `projects` - プロジェクト情報
- `tasks` - タスク情報
- `time_entries` - 時間記録

詳細は [`docs/database-design.md`](docs/database-design.md) を参照してください。

### API設計

RESTful APIエンドポイント：
- `POST /api/v1/auth/signup` - ユーザー登録
- `POST /api/v1/auth/login` - ログイン
- `GET /api/v1/auth/me` - 現在のユーザー情報
- `GET /api/v1/projects` - プロジェクト一覧
- `POST /api/v1/projects` - プロジェクト作成
- `GET /api/v1/tasks` - タスク一覧
- `POST /api/v1/projects/:project_id/tasks` - タスク作成
- `GET /api/v1/time_entries` - 時間記録一覧
- `POST /api/v1/time_entries` - 時間記録作成

詳細は [`docs/api-design.md`](docs/api-design.md) を参照してください。

## ポートフォリオとしての活用

このプロジェクトは、以下のスキルをアピールできます：

### フロントエンド
- ✅ React + TypeScriptでの型安全な開発
- ✅ TanStack Queryを使ったサーバーステート管理
- ✅ Tailwind CSSでのモダンなUI実装
- ✅ React Routerでのルーティング
- ✅ カスタムフックでのロジック分離
- ✅ Vitest + React Testing Libraryでのテスト（97.59%カバレッジ）

### バックエンド
- ✅ Rails APIモードでのRESTful API設計
- ✅ JWT認証の実装
- ✅ PostgreSQLでのデータベース設計
- ✅ ActiveRecordでのリレーション管理
- ✅ RSpecでのテスト駆動開発（93.52%カバレッジ）
- ✅ RuboCop、Brakeman、Bundler Auditによるコード品質管理

### インフラ・DevOps
- ✅ Dockerでのコンテナ化
- ✅ Docker Composeでのマルチコンテナ管理
- ✅ フロントエンドとバックエンドの疎結合設計
- ✅ GitHub Actionsによる自動CI/CDパイプライン

### 設計・アーキテクチャ
- ✅ マイクロサービス的な疎結合設計
- ✅ RESTful API設計
- ✅ データベース正規化
- ✅ 認証・認可の実装

## トラブルシューティング

### ポートが既に使用されている

```bash
# 使用中のポートを確認
lsof -i :3000  # バックエンド
lsof -i :5173  # フロントエンド

# プロセスを終了
kill -9 <PID>
```

### データベース接続エラー

```bash
# データベースコンテナを再起動
docker-compose restart db

# データベースを再作成
docker-compose exec backend rails db:drop db:create db:migrate
```

### フロントエンドのビルドエラー

```bash
# node_modulesを削除して再インストール
docker-compose exec frontend rm -rf node_modules
docker-compose exec frontend npm install
```

## テストカバレッジ

### フロントエンド
- **総テスト数**: 70テスト
- **カバレッジ**: 97.59% (Statements), 93.02% (Branch), 100% (Functions)
- **テスト対象**:
  - コンポーネント（SearchBar, ProjectCard, TaskCard）
  - ユーティリティ（storage, csvExport）

### バックエンド
- **総テスト数**: 127テスト（全成功）
- **カバレッジ**: 93.52% (202/216行)
- **テストフレームワーク**: RSpec + SimpleCov
- **テスト対象**:
  - モデル（User, Project, Task, TimeEntry）
  - APIエンドポイント（認証、プロジェクト、タスク、時間記録）

## CI/CD

GitHub Actionsを使用した自動化パイプライン：

### バックエンド
- **Lint & Security**:
  - RuboCop（コードスタイル）
  - Brakeman（セキュリティ脆弱性）
  - Bundler Audit（依存関係の脆弱性）
- **Tests**:
  - RSpec（全127テスト）
  - SimpleCov（カバレッジレポート）

### フロントエンド
- **Lint & Format**:
  - ESLint（コード品質）
  - Prettier（コードフォーマット）
  - TypeScript型チェック
- **Tests**:
  - Vitest（全70テスト）
  - カバレッジレポート

ワークフローは `main` および `develop` ブランチへのプッシュ・プルリクエスト時に自動実行されます。

## 今後の拡張案

- [ ] タイマー機能（リアルタイムで時間計測）
- [x] CSVエクスポート機能
- [ ] PDFエクスポート機能
- [ ] 請求書生成機能
- [ ] チーム機能（複数ユーザー対応）
- [ ] ダッシュボードの統計グラフ
- [ ] モバイルアプリ対応
- [ ] E2Eテスト（Playwright）の追加
- [x] CI/CDパイプラインの構築

## ライセンス

MIT

## 作者

[@ruito-dev](https://github.com/ruito-dev)
