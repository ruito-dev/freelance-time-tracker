class Project < ApplicationRecord
  belongs_to :user
  has_many :tasks, dependent: :destroy
  has_many :time_entries, through: :tasks

  validates :name, presence: true

  def total_hours
    time_entries.sum(:duration)
  end
end
