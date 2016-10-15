class CreateProjects < ActiveRecord::Migration[5.0]
  enable_extension 'pgcrypto' unless extension_enabled?('pgcrypto')
  def change
    create_table :projects, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.string :script_name
      t.integer :timeout
      t.references :work_unit, type: :uuid
    end

    create_table :work_units, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.json :arguments
      t.json :consensus
      t.references :work_request, type: :uuid
    end

    create_table :work_requests, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.datetime :time_issued, default: Time.at(0)
      t.json :result
      t.binary :nonce
    end
  end
end
