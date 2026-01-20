# frozen_string_literal: true

class ApplicationController < ActionController::API
  # API専用アプリケーションのため、セッションとCSRF保護を無効化
  include ActionController::Cookies
  protect_from_forgery with: :null_session

  # 認証エラーをキャッチ
  rescue_from ActiveRecord::RecordNotFound, with: :not_found_response

  private

  # Authorizationヘッダーからトークンを取得
  #
  # @return [String, nil] JWTトークン
  def token_from_request_headers
    request.headers["Authorization"]&.split(" ")&.last
  end

  # JWTトークンをデコードしてペイロードを取得
  #
  # @return [Hash, nil] デコードされたペイロード
  def decoded_token
    token = token_from_request_headers
    return nil unless token

    JsonWebToken.decode(token)
  end

  # 現在のユーザーを取得
  #
  # @return [User, nil] 現在のユーザー
  def current_user
    return @current_user if defined?(@current_user)

    payload = decoded_token
    @current_user = payload ? User.find_by(id: payload[:user_id]) : nil
  end

  # ユーザーがログインしているかチェック
  #
  # @return [Boolean] ログインしている場合true
  def logged_in?
    current_user.present?
  end

  # 認証が必要なアクションの前に呼び出す
  # ログインしていない場合は401エラーを返す
  def authenticate_user!
    render json: { error: "認証が必要です" }, status: :unauthorized unless logged_in?
  end

  # 404エラーレスポンス
  def not_found_response
    render json: { error: "リソースが見つかりません" }, status: :not_found
  end
end
