class TimeEntry < ApplicationRecord
  belongs_to :task

  validates :started_at, presence: true
  validate :ended_at_after_started_at, if: -> { ended_at.present? }

  before_save :calculate_duration, if: -> { ended_at.present? && ended_at_changed? }

  scope :active, -> { where(ended_at: nil) }
  scope :completed, -> { where.not(ended_at: nil) }

  def stop!
    return if ended_at.present?

    self.ended_at = Time.current
    calculate_duration
    save!
  end

  private

  def ended_at_after_started_at
    if ended_at <= started_at
      errors.add(:ended_at, "は開始時刻より後である必要があります")
    end
  end

  def calculate_duration
    self.duration = (ended_at - started_at).to_i if started_at && ended_at
  end
end
