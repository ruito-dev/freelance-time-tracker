class ChangeDurationToDecimalInTimeEntries < ActiveRecord::Migration[8.1]
  def change
    change_column :time_entries, :duration, :decimal, precision: 10, scale: 2
  end
end
