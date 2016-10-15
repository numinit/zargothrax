class Project < ApplicationRecord
  include ActiveModel::Validations
  validates :script_name, presence: true
  validates :timeout, presence: true, numericality: {greater_than_or_equal_to: 1000}
  validates :enabled, inclusion: [true, false]
  has_many :work_units
end
