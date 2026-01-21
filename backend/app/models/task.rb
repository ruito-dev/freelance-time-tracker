class Task < ApplicationRecord
  belongs_to :project
  has_many :time_entries, dependent: :destroy

  enum :status, { todo: "todo", in_progress: "in_progress", done: "done" }, default: :todo

  validates :title, presence: true
  validates :status, presence: true, inclusion: { in: statuses.keys }
end
