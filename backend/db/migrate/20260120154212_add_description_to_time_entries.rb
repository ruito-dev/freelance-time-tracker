class AddDescriptionToTimeEntries < ActiveRecord::Migration[8.1]
  def change
    add_column :time_entries, :description, :text
  end
end
