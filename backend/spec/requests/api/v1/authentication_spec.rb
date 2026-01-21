require 'rails_helper'

RSpec.describe 'Api::V1::Authentication', type: :request do
  describe 'POST /api/v1/auth/signup' do
    let(:valid_attributes) do
      {
        user: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          password_confirmation: 'password123'
        }
      }
    end

    context 'with valid parameters' do
      it 'creates a new user' do
        expect {
          post '/api/v1/auth/signup', params: valid_attributes, as: :json
        }.to change(User, :count).by(1)
      end

      it 'returns a token and user data' do
        post '/api/v1/auth/signup', params: valid_attributes, as: :json
        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json['token']).to be_present
        expect(json['user']['email']).to eq('test@example.com')
        expect(json['user']['name']).to eq('Test User')
      end
    end

    context 'with invalid parameters' do
      it 'returns validation errors' do
        post '/api/v1/auth/signup', params: { user: { email: 'invalid' } }, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json['errors']).to be_present
      end
    end
  end

  describe 'POST /api/v1/auth/login' do
    let!(:user) { create(:user, email: 'test@example.com', password: 'password123') }

    context 'with valid credentials' do
      it 'returns a token and user data' do
        post '/api/v1/auth/login', params: { email: 'test@example.com', password: 'password123' }, as: :json
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['token']).to be_present
        expect(json['user']['email']).to eq('test@example.com')
      end
    end

    context 'with invalid email' do
      it 'returns unauthorized error' do
        post '/api/v1/auth/login', params: { email: 'wrong@example.com', password: 'password123' }, as: :json
        expect(response).to have_http_status(:unauthorized)
        json = JSON.parse(response.body)
        expect(json['error']).to eq('メールアドレスまたはパスワードが正しくありません')
      end
    end

    context 'with invalid password' do
      it 'returns unauthorized error' do
        post '/api/v1/auth/login', params: { email: 'test@example.com', password: 'wrong_password' }, as: :json
        expect(response).to have_http_status(:unauthorized)
        json = JSON.parse(response.body)
        expect(json['error']).to eq('メールアドレスまたはパスワードが正しくありません')
      end
    end
  end

  describe 'POST /api/v1/auth/refresh' do
    let(:user) { create(:user) }
    let(:token) { JsonWebToken.encode(user_id: user.id) }

    context 'with valid token' do
      it 'returns a new token' do
        post '/api/v1/auth/refresh', headers: { 'Authorization' => "Bearer #{token}" }
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['token']).to be_present
        expect(json['user']['id']).to eq(user.id)
      end
    end

    context 'without token' do
      it 'returns unauthorized error' do
        post '/api/v1/auth/refresh', as: :json
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET /api/v1/auth/me' do
    let(:user) { create(:user) }
    let(:token) { JsonWebToken.encode(user_id: user.id) }

    context 'with valid token' do
      it 'returns current user data' do
        get '/api/v1/auth/me', headers: { 'Authorization' => "Bearer #{token}" }
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['id']).to eq(user.id)
        expect(json['email']).to eq(user.email)
      end
    end

    context 'without token' do
      it 'returns unauthorized error' do
        get '/api/v1/auth/me'
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
