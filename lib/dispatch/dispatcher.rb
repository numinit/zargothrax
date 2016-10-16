#!/usr/bin/ruby

require 'json'
require 'active_record'

def dispatch(project_name, script_name, args, timeout, redundancy_factor=2)
  project = Project.create(name: project_name, script_name: script_name, timeout:timeout)

  units = args.map do |a|
    project.work_units.create(arguments: a)
  end

  units.each do |u|
    (1..redundancy_factor).each do |i|
      u.work_requests.create
    end
  end
end
