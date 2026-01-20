# frozen_string_literal: true

# JWTトークンのエンコード・デコードを行うモジュール
module JsonWebToken
  # 秘密鍵（環境変数から取得、なければRailsのsecret_key_baseを使用）
  SECRET_KEY = ENV.fetch("JWT_SECRET_KEY") { Rails.application.credentials.secret_key_base }

  # トークンの有効期限（24時間）
  EXPIRATION_TIME = 24.hours.from_now.to_i

  # JWTトークンをエンコード
  #
  # @param payload [Hash] エンコードするデータ
  # @return [String] エンコードされたJWTトークン
  def self.encode(payload)
    payload[:exp] = EXPIRATION_TIME
    JWT.encode(payload, SECRET_KEY, "HS256")
  end

  # JWTトークンをデコード
  #
  # @param token [String] デコードするJWTトークン
  # @return [HashWithIndifferentAccess, nil] デコードされたデータ、エラー時はnil
  def self.decode(token)
    decoded = JWT.decode(token, SECRET_KEY, true, algorithm: "HS256")
    HashWithIndifferentAccess.new(decoded[0])
  rescue JWT::DecodeError => e
    Rails.logger.error("JWT Decode Error: #{e.message}")
    nil
  end
end
