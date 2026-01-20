# Freelance Time Tracker

フリーランス向けのタスク管理 & 時間トラッキングアプリケーション

## 技術スタック

### Frontend
- **React** - UIライブラリ
- **TypeScript** - 型安全性
- **Vite** - 高速ビルドツール
- **Tailwind CSS** - ユーティリティファーストCSS
- **TanStack Query (React Query)** - サーバーステート管理

### Backend
- **Ruby on Rails 8.1** - APIモード
- **PostgreSQL** - データベース
- **JWT** - 認証

### Infrastructure
- **Docker & Docker Compose** - コンテナ化

## 主要機能

- ✅ プロジェクト管理 - クライアントごとのプロジェクト作成
- ✅ タスク管理 - プロジェクトに紐づくタスク(CRUD)
- ✅ 時間トラッキング - タスクごとの作業時間記録(開始/停止)
- ✅ レポート機能 - プロジェクト別・期間別の集計
- ✅ 認証機能 - JWT認証でセキュアなAPI通信

## セットアップ

### 前提条件
- Docker Desktop がインストールされていること

### 起動方法

```bash
# リポジトリをクローン
git clone <repository-url>
cd freelance-time-tracker

# Docker Composeで起動
docker-compose up --build

# 別のターミナルでデータベースのセットアップ
docker-compose exec backend rails db:create db:migrate db:seed
```

### アクセス
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 開発

### バックエンド

```bash
# Railsコンソール
docker-compose exec backend rails console

# マイグレーション作成
docker-compose exec backend rails g migration CreateXXX

# テスト実行
docker-compose exec backend rspec
```

### フロントエンド

```bash
# 依存関係のインストール
docker-compose exec frontend npm install

# 開発サーバー起動（既に起動している場合は不要）
docker-compose exec frontend npm run dev
```

## アーキテクチャ

このプロジェクトは、フロントエンドとバックエンドを完全に分離した**疎結合アーキテクチャ**を採用しています。

- フロントエンド(Vite + React)とバックエンド(Rails API)は独立したコンテナで動作
- RESTful APIを介して通信
- マイクロサービス的な設計で、将来的な拡張性を確保

## ライセンス

MIT
