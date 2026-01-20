Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  # API v1
  namespace :api do
    namespace :v1 do
      # 認証関連
      scope :auth do
        post "signup", to: "authentication#signup"
        post "login", to: "authentication#login"
        post "refresh", to: "authentication#refresh"
        get "me", to: "authentication#me"
      end

      # リソース
      resources :projects do
        resources :tasks, only: [ :index, :create ]
      end
      resources :tasks, only: [ :show, :update, :destroy ]
      resources :time_entries
    end
  end
end
