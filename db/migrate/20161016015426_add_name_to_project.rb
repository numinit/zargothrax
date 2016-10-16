class AddNameToProject < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :name, :string, null: false
  end
end
