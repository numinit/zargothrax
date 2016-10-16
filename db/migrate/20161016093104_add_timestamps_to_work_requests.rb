class AddTimestampsToWorkRequests < ActiveRecord::Migration[5.0]
  def change
    change_table :work_requests do |t|
      t.timestamps
    end
  end
end
