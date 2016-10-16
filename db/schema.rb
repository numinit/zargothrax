# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20161016093104) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "pgcrypto"

  create_table "projects", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string  "script_name"
    t.integer "timeout"
    t.boolean "enabled",      default: true,  null: false
    t.string  "name",                         null: false
    t.integer "worker_delay", default: 10000, null: false
  end

  create_table "work_requests", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid     "work_unit_id"
    t.datetime "time_issued",  default: '1970-01-01 00:00:00'
    t.jsonb    "result"
    t.binary   "nonce"
    t.boolean  "completed",    default: false,                 null: false
    t.datetime "created_at",                                   null: false
    t.datetime "updated_at",                                   null: false
    t.index ["work_unit_id"], name: "index_work_requests_on_work_unit_id", using: :btree
  end

  create_table "work_units", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid  "project_id"
    t.jsonb "arguments"
    t.jsonb "consensus"
    t.index ["project_id"], name: "index_work_units_on_project_id", using: :btree
  end

end
