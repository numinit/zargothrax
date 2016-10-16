#!/usr/bin/ruby

require 'json'
require 'active_record'

def dispatch(project_name, script_name, args, timeout, redundancy_factor=1)
  project = Project.create(name: project_name, script_name: script_name, timeout:timeout)

  units = args.each_with_index.map do |a, i|
    ret = project.work_units.create(arguments: a)
    yield :unit, i if block_given?
    ret
  end

  units.each_with_index do |u, j|
    (1..redundancy_factor).each do |i|
      u.work_requests.create
    end

    yield :request, j if block_given?
  end
end
