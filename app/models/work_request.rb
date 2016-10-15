class WorkRequest < ApplicationRecord
  attr_accessor :time_issued, :result, :nonce
  belongs_to :work_unit
end
