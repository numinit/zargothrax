class WorkUnit < ApplicationRecord
  attr_accessor :arguments, :consensus
  has_many :work_requests
  belongs_to :project
end
