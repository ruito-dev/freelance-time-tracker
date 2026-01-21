require 'rails_helper'

RSpec.describe Task, type: :model do
  describe 'associations' do
    it { should belong_to(:project) }
    it { should have_many(:time_entries).dependent(:destroy) }
  end

  describe 'validations' do
    subject { build(:task) }

    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:status) }

    it 'validates status inclusion' do
      task = build(:task, status: 'todo')
      expect(task).to be_valid

      task.status = 'in_progress'
      expect(task).to be_valid

      task.status = 'done'
      expect(task).to be_valid
    end
  end

  describe 'factory' do
    it 'has a valid factory' do
      expect(build(:task)).to be_valid
    end
  end

  describe 'default values' do
    it 'sets default status to todo' do
      task = Task.new(title: 'Test Task', project: create(:project))
      expect(task.status).to eq('todo')
    end

    it 'sets default priority to medium' do
      task = Task.new(title: 'Test Task', project: create(:project))
      expect(task.priority).to eq('medium')
    end

    it 'uses provided status' do
      task = Task.new(title: 'Test Task', status: 'in_progress', project: create(:project))
      expect(task.status).to eq('in_progress')
    end

    it 'uses provided priority' do
      task = Task.new(title: 'Test Task', priority: 'high', project: create(:project))
      expect(task.priority).to eq('high')
    end
  end

  describe 'status transitions' do
    let(:task) { create(:task, status: 'todo') }

    it 'can transition from todo to in_progress' do
      task.update(status: 'in_progress')
      expect(task.status).to eq('in_progress')
    end

    it 'can transition from in_progress to done' do
      task.update(status: 'in_progress')
      task.update(status: 'done')
      expect(task.status).to eq('done')
    end

    it 'can transition from done back to in_progress' do
      task.update(status: 'done')
      task.update(status: 'in_progress')
      expect(task.status).to eq('in_progress')
    end
  end

  describe 'priority attribute' do
    it 'allows setting priority' do
      task = create(:task, priority: 'high')
      expect(task.priority).to eq('high')
    end

    it 'has default priority' do
      task = Task.new(title: 'Test', project: create(:project))
      expect(task.priority).to eq('medium')
    end
  end

  describe 'dependent destroy' do
    let(:task) { create(:task) }
    let!(:time_entry) { create(:time_entry, task: task) }

    it 'destroys associated time entries when task is destroyed' do
      expect { task.destroy }.to change { TimeEntry.count }.by(-1)
    end
  end

  describe 'due date' do
    it 'allows nil due_date' do
      task = build(:task, due_date: nil)
      expect(task).to be_valid
    end

    it 'allows future due_date' do
      task = build(:task, due_date: 1.week.from_now)
      expect(task).to be_valid
    end

    it 'allows past due_date' do
      task = build(:task, due_date: 1.week.ago)
      expect(task).to be_valid
    end
  end

  describe 'description' do
    it 'allows nil description' do
      task = build(:task, description: nil)
      expect(task).to be_valid
    end

    it 'allows empty description' do
      task = build(:task, description: '')
      expect(task).to be_valid
    end

    it 'allows long description' do
      task = build(:task, description: 'a' * 1000)
      expect(task).to be_valid
    end
  end

  describe 'scopes and queries' do
    let(:project) { create(:project) }
    let!(:todo_task) { create(:task, project: project, status: 'todo') }
    let!(:in_progress_task) { create(:task, project: project, status: 'in_progress') }
    let!(:done_task) { create(:task, project: project, status: 'done') }

    it 'filters tasks by status' do
      expect(project.tasks.where(status: 'todo')).to include(todo_task)
      expect(project.tasks.where(status: 'in_progress')).to include(in_progress_task)
      expect(project.tasks.where(status: 'done')).to include(done_task)
    end

    it 'filters tasks by priority' do
      high_priority_task = create(:task, project: project, priority: 'high')
      expect(project.tasks.where(priority: 'high')).to include(high_priority_task)
    end
  end
end
