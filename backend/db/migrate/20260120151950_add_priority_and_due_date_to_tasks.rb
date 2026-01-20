class AddPriorityAndDueDateToTasks < ActiveRecord::Migration[8.1]
  def change
    add_column :tasks, :priority, :string, default: 'medium', null: false
    add_column :tasks, :due_date, :date
  end
end
