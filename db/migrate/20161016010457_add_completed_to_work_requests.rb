class AddCompletedToWorkRequests < ActiveRecord::Migration[5.0]
  def change
    add_column :work_requests, :completed, :boolean, null: false, default: false
  end
end
