FROM node:20-alpine

# 作業ディレクトリの設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係のインストール
RUN npm install

# アプリケーションコードをコピー
COPY . .

# ポート5173を公開
EXPOSE 5173

# 開発サーバー起動コマンド
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
