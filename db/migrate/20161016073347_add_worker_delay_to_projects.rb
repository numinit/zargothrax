class AddWorkerDelayToProjects < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :worker_delay, :integer, default: 10000, null: false
  end
end
