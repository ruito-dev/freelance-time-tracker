class Task < ApplicationRecord
  belongs_to :project
  has_many :time_entries, dependent: :destroy

  validates :title, presence: true
  validates :status, presence: true, inclusion: { in: %w[todo in_progress done] }

  enum :status, { todo: "todo", in_progress: "in_progress", done: "done" }, default: :todo
end
