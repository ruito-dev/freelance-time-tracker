require 'rails_helper'

RSpec.describe 'Api::V1::TimeEntries', type: :request do
  before do
    host! 'localhost'
  end

  let(:user) { create(:user) }
  let(:project) { create(:project, user: user) }
  let(:task) { create(:task, project: project) }
  let(:other_user) { create(:user) }
  let(:other_project) { create(:project, user: other_user) }
  let(:other_task) { create(:task, project: other_project) }
  let(:token) { JsonWebToken.encode({ user_id: user.id }) }
  let(:headers) { { 'Authorization' => "Bearer #{token}" } }

  describe 'GET /api/v1/time_entries' do
    let!(:entry1) { create(:time_entry, task: task, started_at: Time.current, ended_at: Time.current + 2.hours) }
    let!(:entry2) { create(:time_entry, task: task, started_at: Time.current, ended_at: Time.current + 1.5.hours) }
    let!(:other_entry) { create(:time_entry, task: other_task, started_at: Time.current, ended_at: Time.current + 3.hours) }

    context 'when authenticated' do
      it 'returns all time entries for user tasks' do
        get '/api/v1/time_entries', headers: headers
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json.length).to eq(2)
        expect(json.map { |e| e['duration'].to_f }).to contain_exactly(2.0, 1.5)
      end

      it 'filters time entries by task_id' do
        get "/api/v1/time_entries?task_id=#{task.id}", headers: headers
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json.length).to eq(2)
      end

      it 'filters time entries by project_id' do
        get "/api/v1/time_entries?project_id=#{project.id}", headers: headers
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json.length).to eq(2)
      end

      it 'filters time entries by date range' do
        start_date = Date.today.to_s
        end_date = Date.today.to_s
        get "/api/v1/time_entries?start_date=#{start_date}&end_date=#{end_date}", headers: headers
        expect(response).to have_http_status(:ok)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        get '/api/v1/time_entries'
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET /api/v1/time_entries/:id' do
    let(:time_entry) { create(:time_entry, task: task) }

    context 'when authenticated' do
      it 'returns the time entry' do
        get "/api/v1/time_entries/#{time_entry.id}", headers: headers
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['id']).to eq(time_entry.id)
        expect(json['duration'].to_f).to eq(time_entry.duration.to_f)
      end

      it 'returns not found for other user time entry' do
        other_entry = create(:time_entry, task: other_task)
        get "/api/v1/time_entries/#{other_entry.id}", headers: headers
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        get "/api/v1/time_entries/#{time_entry.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST /api/v1/time_entries' do
    let(:valid_attributes) do
      {
        task_id: task.id,
        started_at: Time.current,
        ended_at: Time.current + 2.hours,
        description: 'Working on feature'
      }
    end

    context 'when authenticated' do
      it 'creates a new time entry' do
        expect {
          post '/api/v1/time_entries', params: { time_entry: valid_attributes }, headers: headers
        }.to change(TimeEntry, :count).by(1)
        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json['duration'].to_f).to eq(2.0)
      end

      it 'returns error for invalid attributes' do
        post '/api/v1/time_entries',
             params: { time_entry: { task_id: task.id, started_at: Time.current, ended_at: Time.current - 1.hour } },
             headers: headers
        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'returns error for other user task' do
        post '/api/v1/time_entries',
             params: { time_entry: valid_attributes.merge(task_id: other_task.id) },
             headers: headers
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        post '/api/v1/time_entries', params: { time_entry: valid_attributes }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'PATCH /api/v1/time_entries/:id' do
    let(:time_entry) { create(:time_entry, task: task, started_at: Time.current, ended_at: Time.current + 1.hour) }

    context 'when authenticated' do
      it 'updates the time entry' do
        new_ended_at = time_entry.started_at + 2.5.hours
        patch "/api/v1/time_entries/#{time_entry.id}",
              params: { time_entry: { ended_at: new_ended_at, description: 'Updated description' } },
              headers: headers
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['duration'].to_f).to eq(2.5)
        expect(json['description']).to eq('Updated description')
      end

      it 'returns error for invalid attributes' do
        patch "/api/v1/time_entries/#{time_entry.id}",
              params: { time_entry: { ended_at: time_entry.started_at - 1.hour } },
              headers: headers
        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'returns not found for other user time entry' do
        other_entry = create(:time_entry, task: other_task)
        patch "/api/v1/time_entries/#{other_entry.id}",
              params: { time_entry: { duration: 2.0 } },
              headers: headers
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        patch "/api/v1/time_entries/#{time_entry.id}",
              params: { time_entry: { duration: 2.0 } }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'DELETE /api/v1/time_entries/:id' do
    let!(:time_entry) { create(:time_entry, task: task) }

    context 'when authenticated' do
      it 'deletes the time entry' do
        expect {
          delete "/api/v1/time_entries/#{time_entry.id}", headers: headers
        }.to change(TimeEntry, :count).by(-1)
        expect(response).to have_http_status(:no_content)
      end

      it 'returns not found for other user time entry' do
        other_entry = create(:time_entry, task: other_task)
        expect {
          delete "/api/v1/time_entries/#{other_entry.id}", headers: headers
        }.not_to change(TimeEntry, :count)
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        delete "/api/v1/time_entries/#{time_entry.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET /api/v1/time_entries/summary' do
    let!(:entry1) { create(:time_entry, task: task, started_at: Date.today.to_time, ended_at: Date.today.to_time + 2.hours) }
    let!(:entry2) { create(:time_entry, task: task, started_at: Date.today.to_time, ended_at: Date.today.to_time + 1.5.hours) }
    let!(:old_entry) { create(:time_entry, task: task, started_at: 1.month.ago, ended_at: 1.month.ago + 3.hours) }

    context 'when authenticated' do
      it 'returns summary for date range' do
        get "/api/v1/time_entries/summary?start_date=#{Date.today}&end_date=#{Date.today}",
            headers: headers
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['total_duration'].to_f).to eq(3.5)
      end

      it 'returns summary for all time when no date range specified' do
        get '/api/v1/time_entries/summary', headers: headers
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['total_duration'].to_f).to eq(6.5)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        get '/api/v1/time_entries/summary'
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
