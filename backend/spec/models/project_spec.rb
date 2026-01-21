require 'rails_helper'

RSpec.describe Project, type: :model do
  describe 'associations' do
    it { should belong_to(:user) }
    it { should have_many(:tasks).dependent(:destroy) }
  end

  describe 'validations' do
    subject { build(:project) }

    it { should validate_presence_of(:name) }
  end

  describe 'factory' do
    it 'has a valid factory' do
      expect(build(:project)).to be_valid
    end
  end

  describe 'color attribute' do
    it 'allows setting a color' do
      project = create(:project, color: '#FF0000')
      expect(project.color).to eq('#FF0000')
    end

    it 'allows nil color' do
      project = build(:project, color: nil)
      expect(project).to be_valid
    end
  end

  describe 'dependent destroy' do
    let(:project) { create(:project) }
    let!(:task) { create(:task, project: project) }

    it 'destroys associated tasks when project is destroyed' do
      expect { project.destroy }.to change { Task.count }.by(-1)
    end
  end

  describe 'scopes and queries' do
    let(:user) { create(:user) }
    let!(:project1) { create(:project, user: user, name: 'Project A') }
    let!(:project2) { create(:project, user: user, name: 'Project B') }
    let!(:other_user_project) { create(:project, name: 'Other Project') }

    it 'returns projects for a specific user' do
      expect(user.projects).to include(project1, project2)
      expect(user.projects).not_to include(other_user_project)
    end
  end

  describe 'tasks_count calculation' do
    let(:project) { create(:project) }

    it 'returns 0 when no tasks exist' do
      expect(project.tasks.count).to eq(0)
    end

    it 'returns correct count when tasks exist' do
      create_list(:task, 3, project: project)
      expect(project.tasks.count).to eq(3)
    end
  end

  describe 'total_hours calculation through tasks' do
    let(:project) { create(:project) }
    let(:task) { create(:task, project: project) }

    it 'returns 0 when no time entries exist' do
      expect(project.total_hours).to eq(0)
    end

    it 'calculates total hours from time entries' do
      # started_atとended_atから自動計算されるため、明示的に時間を指定
      create(:time_entry, task: task, started_at: Time.current, ended_at: Time.current + 1.hour)
      expect(project.total_hours).to eq(1.0)
    end
  end
end
