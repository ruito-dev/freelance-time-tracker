class CreateTimeEntries < ActiveRecord::Migration[8.1]
  def change
    create_table :time_entries do |t|
      t.datetime :started_at, null: false
      t.datetime :ended_at
      t.integer :duration
      t.references :task, null: false, foreign_key: true

      t.timestamps
    end

    add_index :time_entries, [:task_id, :started_at]
    add_index :time_entries, :ended_at
  end
end
