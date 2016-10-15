class Project < ApplicationRecord
  include ActiveModel::Validations
  attr_accessor :script_name, :timeout
  validates :script_name, presence: true
  validates :timeout, presence: true, numericality: {greater_than_or_equal_to: 1000}
  has_many :work_units
end
