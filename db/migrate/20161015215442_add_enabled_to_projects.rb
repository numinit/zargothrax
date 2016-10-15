class AddEnabledToProjects < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :enabled, :boolean, null: false, default: true
  end
end
