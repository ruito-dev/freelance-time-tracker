require 'rails_helper'

RSpec.describe TimeEntry, type: :model do
  describe 'associations' do
    it { should belong_to(:task) }
  end

  describe 'validations' do
    subject { build(:time_entry) }

    it { should validate_presence_of(:started_at) }
    it { should validate_presence_of(:ended_at) }

    it 'validates duration is present after save' do
      time_entry = create(:time_entry)
      expect(time_entry.duration).to be_present
      expect(time_entry.duration).to be > 0
    end
  end

  describe 'factory' do
    it 'has a valid factory' do
      expect(build(:time_entry)).to be_valid
    end
  end

  describe 'duration calculation' do
    let(:task) { create(:task) }

    it 'calculates duration correctly for 1 hour' do
      started_at = Time.current
      ended_at = started_at + 1.hour
      time_entry = create(:time_entry, task: task, started_at: started_at, ended_at: ended_at)
      expect(time_entry.duration).to eq(1.0)
    end

    it 'calculates duration correctly for 30 minutes' do
      started_at = Time.current
      ended_at = started_at + 30.minutes
      time_entry = create(:time_entry, task: task, started_at: started_at, ended_at: ended_at)
      expect(time_entry.duration).to eq(0.5)
    end

    it 'calculates duration correctly for multiple hours' do
      started_at = Time.current
      ended_at = started_at + 3.hours + 45.minutes
      time_entry = create(:time_entry, task: task, started_at: started_at, ended_at: ended_at)
      expect(time_entry.duration).to eq(3.75)
    end
  end

  describe 'time validation' do
    let(:task) { create(:task) }

    it 'is invalid when ended_at is before started_at' do
      time_entry = build(:time_entry,
        task: task,
        started_at: Time.current,
        ended_at: Time.current - 1.hour
      )
      expect(time_entry).not_to be_valid
    end

    it 'is valid when ended_at is after started_at' do
      time_entry = build(:time_entry,
        task: task,
        started_at: Time.current,
        ended_at: Time.current + 1.hour
      )
      expect(time_entry).to be_valid
    end
  end

  describe 'description' do
    it 'allows nil description' do
      time_entry = build(:time_entry, description: nil)
      expect(time_entry).to be_valid
    end

    it 'allows empty description' do
      time_entry = build(:time_entry, description: '')
      expect(time_entry).to be_valid
    end

    it 'allows long description' do
      time_entry = build(:time_entry, description: 'a' * 1000)
      expect(time_entry).to be_valid
    end
  end

  describe 'scopes and queries' do
    let(:task) { create(:task) }
    let!(:today_entry) { create(:time_entry, task: task, started_at: Time.current.beginning_of_day, ended_at: Time.current.beginning_of_day + 1.hour) }
    let!(:yesterday_entry) { create(:time_entry, task: task, started_at: 1.day.ago.beginning_of_day, ended_at: 1.day.ago.beginning_of_day + 2.hours) }
    let!(:last_week_entry) { create(:time_entry, task: task, started_at: 1.week.ago, ended_at: 1.week.ago + 3.hours) }

    it 'filters time entries by date range' do
      start_date = Time.current.beginning_of_day
      end_date = Time.current.end_of_day
      entries = task.time_entries.where('started_at >= ? AND started_at <= ?', start_date, end_date)
      expect(entries).to include(today_entry)
      expect(entries).not_to include(yesterday_entry, last_week_entry)
    end

    it 'calculates total duration for a task' do
      total = task.time_entries.sum(:duration)
      expect(total).to eq(6.0) # 1.0 + 2.0 + 3.0
    end
  end

  describe 'ordering' do
    let(:task) { create(:task) }
    let!(:entry1) { create(:time_entry, task: task, started_at: 3.days.ago, ended_at: 3.days.ago + 1.hour) }
    let!(:entry2) { create(:time_entry, task: task, started_at: 1.day.ago, ended_at: 1.day.ago + 1.hour) }
    let!(:entry3) { create(:time_entry, task: task, started_at: Time.current, ended_at: Time.current + 1.hour) }

    it 'orders by started_at descending' do
      entries = task.time_entries.order(started_at: :desc)
      expect(entries.first).to eq(entry3)
      expect(entries.last).to eq(entry1)
    end

    it 'orders by started_at ascending' do
      entries = task.time_entries.order(started_at: :asc)
      expect(entries.first).to eq(entry1)
      expect(entries.last).to eq(entry3)
    end
  end

  describe 'edge cases' do
    let(:task) { create(:task) }

    it 'handles very short durations (1 minute)' do
      started_at = Time.current
      ended_at = started_at + 1.minute
      time_entry = create(:time_entry, task: task, started_at: started_at, ended_at: ended_at)
      expect(time_entry.duration).to be > 0
    end

    it 'handles very long durations (24 hours)' do
      started_at = Time.current
      ended_at = started_at + 24.hours
      time_entry = create(:time_entry, task: task, started_at: started_at, ended_at: ended_at)
      expect(time_entry.duration).to eq(24.0)
    end
  end
end
