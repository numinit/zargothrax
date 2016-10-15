class WorkUnit < ApplicationRecord
  attr_accessor :arguments, :consensus
  has_many :work_request
  belongs_to :project
end
