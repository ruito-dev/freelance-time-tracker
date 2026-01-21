require 'rails_helper'

RSpec.describe 'Api::V1::Tasks', type: :request do
  let(:user) { create(:user) }
  let(:project) { create(:project, user: user) }
  let(:other_user) { create(:user) }
  let(:other_project) { create(:project, user: other_user) }
  let(:token) { JsonWebToken.encode({ user_id: user.id }) }
  let(:headers) { { 'Authorization' => "Bearer #{token}" } }

  describe 'GET /api/v1/tasks' do
    let!(:task1) { create(:task, project: project, title: 'Task 1') }
    let!(:task2) { create(:task, project: project, title: 'Task 2') }
    let!(:other_task) { create(:task, project: other_project, title: 'Other Task') }

    context 'when authenticated' do
      it 'returns all tasks for user projects' do
        get '/api/v1/tasks', headers: headers
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json.length).to eq(2)
        expect(json.map { |t| t['title'] }).to contain_exactly('Task 1', 'Task 2')
      end

      it 'filters tasks by project_id' do
        get "/api/v1/tasks?project_id=#{project.id}", headers: headers
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json.length).to eq(2)
      end

      it 'filters tasks by status' do
        task1.update(status: 'done')
        get '/api/v1/tasks?status=done', headers: headers
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json.length).to eq(1)
        expect(json.first['title']).to eq('Task 1')
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        get '/api/v1/tasks'
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET /api/v1/tasks/:id' do
    let(:task) { create(:task, project: project) }

    context 'when authenticated' do
      it 'returns the task' do
        get "/api/v1/tasks/#{task.id}", headers: headers
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['id']).to eq(task.id)
        expect(json['title']).to eq(task.title)
      end

      it 'returns not found for other user task' do
        other_task = create(:task, project: other_project)
        get "/api/v1/tasks/#{other_task.id}", headers: headers
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        get "/api/v1/tasks/#{task.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST /api/v1/tasks' do
    let(:valid_attributes) do
      {
        project_id: project.id,
        title: 'New Task',
        description: 'Task description',
        status: 'todo',
        priority: 'high',
        due_date: 1.week.from_now.to_date
      }
    end

    context 'when authenticated' do
      it 'creates a new task' do
        expect {
          post "/api/v1/projects/#{project.id}/tasks", params: { task: valid_attributes }, headers: headers
        }.to change(Task, :count).by(1)
        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json['title']).to eq('New Task')
      end

      it 'returns error for invalid attributes' do
        post "/api/v1/projects/#{project.id}/tasks", params: { task: { title: '' } }, headers: headers
        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'returns error for other user project' do
        post "/api/v1/projects/#{other_project.id}/tasks", params: { task: valid_attributes }, headers: headers
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        post "/api/v1/projects/#{project.id}/tasks", params: { task: valid_attributes }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'PATCH /api/v1/tasks/:id' do
    let(:task) { create(:task, project: project, title: 'Original Title') }

    context 'when authenticated' do
      it 'updates the task' do
        patch "/api/v1/tasks/#{task.id}",
              params: { task: { title: 'Updated Title', status: 'in_progress' } },
              headers: headers
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['title']).to eq('Updated Title')
        expect(json['status']).to eq('in_progress')
      end

      it 'returns error for invalid attributes' do
        patch "/api/v1/tasks/#{task.id}",
              params: { task: { title: '' } },
              headers: headers
        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'returns not found for other user task' do
        other_task = create(:task, project: other_project)
        patch "/api/v1/tasks/#{other_task.id}",
              params: { task: { title: 'Updated' } },
              headers: headers
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        patch "/api/v1/tasks/#{task.id}", params: { task: { title: 'Updated' } }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'DELETE /api/v1/tasks/:id' do
    let!(:task) { create(:task, project: project) }

    context 'when authenticated' do
      it 'deletes the task' do
        expect {
          delete "/api/v1/tasks/#{task.id}", headers: headers
        }.to change(Task, :count).by(-1)
        expect(response).to have_http_status(:no_content)
      end

      it 'returns not found for other user task' do
        other_task = create(:task, project: other_project)
        expect {
          delete "/api/v1/tasks/#{other_task.id}", headers: headers
        }.not_to change(Task, :count)
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        delete "/api/v1/tasks/#{task.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
