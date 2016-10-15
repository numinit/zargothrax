class CreateProjects < ActiveRecord::Migration[5.0]
  enable_extension 'pgcrypto' unless extension_enabled?('pgcrypto')
  def change
    create_table :projects, force: true, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.string :script_name
      t.integer :timeout
    end

    create_table :work_units, force: true, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.references :project, type: :uuid
      t.jsonb :arguments
      t.jsonb :consensus
    end

    create_table :work_requests, force: true, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.references :work_unit, type: :uuid
      t.datetime :time_issued, default: Time.at(0)
      t.jsonb :result
      t.binary :nonce
    end
  end
end
