# ドキュメント

このディレクトリには、Freelance Time Trackerアプリケーションの設計ドキュメントが含まれています。

## 📚 ドキュメント一覧

### 1. [アーキテクチャ設計書](./architecture.md)
システム全体のアーキテクチャ、技術スタック、設計思想を説明しています。

**内容**:
- システム構成図(Mermaid)
- 技術スタック一覧
- フロント・バック分離アーキテクチャの説明
- セキュリティ設計(JWT認証フロー)
- Docker構成
- スケーラビリティ戦略

**対象読者**: 技術リード、アーキテクト、採用担当者

---

### 2. [データベース設計書](./database-design.md)
データベーススキーマ、テーブル定義、リレーションシップを詳細に説明しています。

**内容**:
- ER図(Mermaid)
- 全テーブル定義(users, projects, tasks, time_entries)
- インデックス設計とその意図
- リレーションシップとカスケード削除
- パフォーマンス最適化戦略
- セキュリティ考慮事項

**対象読者**: バックエンドエンジニア、DBA、技術レビュアー

---

### 3. [API設計書(Markdown版)](./api-design.md)
REST APIの詳細仕様を人間が読みやすい形式で記載しています。

**内容**:
- 全エンドポイントの詳細
- リクエスト/レスポンス例
- 認証フロー(シーケンス図)
- エラーハンドリング
- HTTPステータスコード一覧
- CORS設定

**対象読者**: フロントエンドエンジニア、API利用者、QAエンジニア

---

### 4. [OpenAPI仕様書](./openapi.yaml) ⭐ **推奨**
OpenAPI 3.0形式のAPI仕様書。ツールとの連携が可能です。

**内容**:
- 機械可読なAPI仕様
- すべてのエンドポイント定義
- スキーマ定義
- 認証設定
- サンプルリクエスト/レスポンス

**対象読者**: すべての開発者

**使い方**:
```bash
# Swagger UIで表示
npx @redocly/cli preview-docs docs/openapi.yaml

# または、オンラインエディタで開く
# https://editor.swagger.io/
# ファイルの内容をコピー&ペースト
```

**ツール連携**:
- **Swagger UI**: インタラクティブなAPIドキュメント
- **Postman**: OpenAPIファイルをインポートしてテスト
- **OpenAPI Generator**: クライアントSDKの自動生成
- **Redoc**: 美しいAPIドキュメント生成

---

## 🎯 ドキュメントの目的

このドキュメント群は以下の目的で作成されています:

1. **企業へのアピール**
   - 設計品質の証明
   - ドキュメント作成能力の証明
   - プロフェッショナルな開発プロセスの実践

2. **開発効率の向上**
   - チーム開発時の共通理解
   - 新規参加者のオンボーディング
   - API仕様の明確化

3. **保守性の向上**
   - 設計意図の記録
   - 将来の拡張時の参考資料
   - トラブルシューティングの支援

---

## 🛠️ OpenAPI仕様書の活用方法

### Swagger UIでの表示

```bash
# Redoclyを使用(推奨)
npx @redocly/cli preview-docs docs/openapi.yaml

# または、Swagger UIをローカルで起動
docker run -p 8080:8080 \
  -e SWAGGER_JSON=/docs/openapi.yaml \
  -v $(pwd)/docs:/docs \
  swaggerapi/swagger-ui
```

ブラウザで `http://localhost:8080` を開く

### Postmanでのインポート

1. Postmanを開く
2. Import → Upload Files
3. `docs/openapi.yaml`を選択
4. すべてのエンドポイントがコレクションとして追加される

### クライアントSDKの自動生成

```bash
# TypeScript Axiosクライアント生成
npx @openapitools/openapi-generator-cli generate \
  -i docs/openapi.yaml \
  -g typescript-axios \
  -o frontend/src/api/generated

# 他の言語も生成可能
# -g python, java, ruby, go, etc.
```

---

## 📖 ドキュメントの読み方

### 初めての方
1. **アーキテクチャ設計書**を読んで全体像を把握
2. **OpenAPI仕様書**をSwagger UIで確認
3. 必要に応じて**データベース設計書**を参照

### フロントエンド開発者
1. **OpenAPI仕様書**でAPI仕様を確認
2. **API設計書(Markdown版)**でリクエスト/レスポンス例を確認
3. Postmanでテストリクエストを作成

### バックエンド開発者
1. **データベース設計書**でスキーマを確認
2. **API設計書**でエンドポイント仕様を確認
3. **アーキテクチャ設計書**でセキュリティ設計を確認

### 採用担当者・技術レビュアー
1. **アーキテクチャ設計書**で設計思想を評価
2. **データベース設計書**でデータモデリング能力を評価
3. **OpenAPI仕様書**でAPI設計能力を評価

---

## 🔄 ドキュメントの更新

ドキュメントは実装と同期して更新されます。

**更新タイミング**:
- 新しいエンドポイント追加時
- データベーススキーマ変更時
- アーキテクチャの大きな変更時

**更新方法**:
1. 該当するMarkdownファイルを編集
2. `openapi.yaml`を更新
3. コミットメッセージに`[docs]`プレフィックスを付ける

```bash
git commit -m "[docs] API仕様書を更新: レポートエンドポイント追加"
```

---

## 📊 Mermaid図の表示

このドキュメントではMermaid記法を使用して図を描画しています。

**GitHubで表示**: GitHubは自動的にMermaid図をレンダリングします

**VSCodeで表示**:
1. 拡張機能「Markdown Preview Mermaid Support」をインストール
2. Markdownファイルをプレビュー表示

**その他のツール**:
- [Mermaid Live Editor](https://mermaid.live/)
- [Obsidian](https://obsidian.md/)
- [Notion](https://notion.so/)

---

## 🎓 参考資料

### OpenAPI
- [OpenAPI Specification](https://swagger.io/specification/)
- [OpenAPI Generator](https://openapi-generator.tech/)
- [Redocly](https://redocly.com/)

### データベース設計
- [Database Design Best Practices](https://www.postgresql.org/docs/current/ddl.html)
- [Rails Guides - Active Record](https://guides.rubyonrails.org/active_record_basics.html)

### アーキテクチャ
- [The Twelve-Factor App](https://12factor.net/)
- [Microservices Architecture](https://microservices.io/)

---

## 💡 Tips

### API仕様書の検証

```bash
# OpenAPI仕様書の妥当性チェック
npx @redocly/cli lint docs/openapi.yaml
```

### 美しいドキュメント生成

```bash
# Redocで静的HTMLを生成
npx @redocly/cli build-docs docs/openapi.yaml \
  -o docs/api-docs.html

# ブラウザで開く
open docs/api-docs.html
```

### Markdownのプレビュー

```bash
# VSCodeでプレビュー
# Cmd+Shift+V (Mac) または Ctrl+Shift+V (Windows/Linux)
```

---

## 📝 ライセンス

このドキュメントはMITライセンスの下で公開されています。

---

## 👤 作成者

**Ruito** - フリーランスエンジニア  
Email: ruito.dev@gmail.com  
GitHub: [@ruito-dev](https://github.com/ruito-dev)

---

**最終更新**: 2026-01-20
