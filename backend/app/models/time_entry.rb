class TimeEntry < ApplicationRecord
  belongs_to :task

  validates :started_at, presence: true
  validates :ended_at, presence: true
  validates :duration, presence: true, numericality: { greater_than: 0 }
  validate :ended_at_after_started_at, if: -> { started_at.present? && ended_at.present? }

  before_validation :calculate_duration, if: -> { started_at.present? && ended_at.present? }

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
    # 時間単位で保存（小数点以下も含む）
    self.duration = ((ended_at - started_at) / 3600.0).round(2) if started_at && ended_at
  end
end
