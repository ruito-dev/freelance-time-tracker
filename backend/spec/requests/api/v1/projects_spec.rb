require 'rails_helper'

RSpec.describe 'Api::V1::Projects', type: :request do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:token) { JsonWebToken.encode(user_id: user.id) }
  let(:headers) { { 'Authorization' => "Bearer #{token}" } }

  describe 'GET /api/v1/projects' do
    let!(:user_projects) { create_list(:project, 3, user: user) }
    let!(:other_projects) { create_list(:project, 2, user: other_user) }

    it 'returns user projects only' do
      get '/api/v1/projects', headers: headers
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.length).to eq(3)
      expect(json.map { |p| p['user_id'] }.uniq).to eq([ user.id ])
    end

    it 'requires authentication' do
      get '/api/v1/projects'
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'GET /api/v1/projects/:id' do
    let(:project) { create(:project, user: user) }

    it 'returns the project' do
      get "/api/v1/projects/#{project.id}", headers: headers
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['id']).to eq(project.id)
      expect(json['name']).to eq(project.name)
    end

    it 'returns 404 for other user project' do
      other_project = create(:project, user: other_user)
      get "/api/v1/projects/#{other_project.id}", headers: headers
      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'POST /api/v1/projects' do
    let(:valid_attributes) do
      {
        project: {
          name: 'New Project',
          description: 'Project description',
          color: '#FF5733'
        }
      }
    end

    it 'creates a new project' do
      expect {
        post '/api/v1/projects', params: valid_attributes, headers: headers, as: :json
      }.to change(Project, :count).by(1)
      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json['name']).to eq('New Project')
      expect(json['user_id']).to eq(user.id)
    end

    it 'returns errors for invalid data' do
      post '/api/v1/projects', params: { project: { name: '' } }, headers: headers, as: :json
      expect(response).to have_http_status(:unprocessable_entity)
      json = JSON.parse(response.body)
      expect(json['errors']).to be_present
    end
  end

  describe 'PATCH /api/v1/projects/:id' do
    let(:project) { create(:project, user: user) }

    it 'updates the project' do
      patch "/api/v1/projects/#{project.id}",
            params: { project: { name: 'Updated Name' } },
            headers: headers,
            as: :json
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['name']).to eq('Updated Name')
    end

    it 'returns 404 for other user project' do
      other_project = create(:project, user: other_user)
      patch "/api/v1/projects/#{other_project.id}",
            params: { project: { name: 'Hacked' } },
            headers: headers,
            as: :json
      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'DELETE /api/v1/projects/:id' do
    let!(:project) { create(:project, user: user) }

    it 'deletes the project' do
      expect {
        delete "/api/v1/projects/#{project.id}", headers: headers
      }.to change(Project, :count).by(-1)
      expect(response).to have_http_status(:no_content)
    end

    it 'returns 404 for other user project' do
      other_project = create(:project, user: other_user)
      expect {
        delete "/api/v1/projects/#{other_project.id}", headers: headers
      }.not_to change(Project, :count)
      expect(response).to have_http_status(:not_found)
    end
  end
end
