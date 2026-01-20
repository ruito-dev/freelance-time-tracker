FROM ruby:3.2.2-alpine

# 必要なパッケージのインストール
RUN apk add --no-cache \
    build-base \
    postgresql-dev \
    tzdata \
    bash \
    git

# 作業ディレクトリの設定
WORKDIR /app

# Gemfileをコピーして依存関係をインストール
COPY Gemfile Gemfile.lock ./
RUN bundle install

# アプリケーションコードをコピー
COPY . .

# ポート3000を公開
EXPOSE 3000

# サーバー起動コマンド
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
