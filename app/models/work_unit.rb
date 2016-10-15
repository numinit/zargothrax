class WorkUnit < ApplicationRecord
  has_many :work_requests
  belongs_to :project
end
