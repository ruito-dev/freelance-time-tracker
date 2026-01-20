# frozen_string_literal: true

module Api
  module V1
    class AuthenticationController < ApplicationController
      # ログインとリフレッシュ以外は認証が必要
      before_action :authenticate_user!, only: [ :refresh, :me ]

      # POST /api/v1/auth/signup
      # ユーザー登録
      def signup
        user = User.new(signup_params)

        if user.save
          token = JsonWebToken.encode(user_id: user.id)
          render json: {
            token: token,
            user: user_response(user)
          }, status: :created
        else
          render json: { errors: user.errors.messages }, status: :unprocessable_entity
        end
      end

      # POST /api/v1/auth/login
      # ログイン
      def login
        user = User.find_by(email: login_params[:email])

        if user&.authenticate(login_params[:password])
          token = JsonWebToken.encode(user_id: user.id)
          render json: {
            token: token,
            user: user_response(user)
          }, status: :ok
        else
          render json: { error: "メールアドレスまたはパスワードが正しくありません" }, status: :unauthorized
        end
      end

      # POST /api/v1/auth/refresh
      # トークンリフレッシュ
      def refresh
        token = JsonWebToken.encode(user_id: current_user.id)
        render json: {
          token: token,
          user: user_response(current_user)
        }, status: :ok
      end

      # GET /api/v1/auth/me
      # 現在のユーザー情報取得
      def me
        render json: user_response(current_user), status: :ok
      end

      private

      # ユーザー登録パラメータ
      def signup_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation)
      end

      # ログインパラメータ
      def login_params
        params.permit(:email, :password)
      end

      # ユーザーレスポンス
      def user_response(user)
        {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at
        }
      end
    end
  end
end
