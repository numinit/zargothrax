#!/usr/bin/ruby

require 'json'
require 'active_record'
# Uninitialized constant ApplicationRecord
# require "#{Rails.root}/app/models/project"

def dispatch(project_name, script_name, args, timeout, redundancy_factor=2)

  arg_blobs = args.map{|a| a.to_json}
  project   = Project.create(script_name:script_name, timeout:timeout)

  units = arg_blobs.map{ |a| 
    project.work_units.create(arguments:a)
  }

  units.each do |u|
    for i in 1..redundancy_factor do
      u.work_requests.create
    end
  end

end
